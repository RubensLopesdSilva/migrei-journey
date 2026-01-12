import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Map Stripe subscription status to our enum
const mapSubscriptionStatus = (stripeStatus: string): string => {
  const statusMap: Record<string, string> = {
    active: "active",
    past_due: "past_due",
    canceled: "canceled",
    unpaid: "unpaid",
    trialing: "trialing",
    incomplete: "incomplete",
    incomplete_expired: "incomplete_expired",
    paused: "paused",
  };
  return statusMap[stripeStatus] || "incomplete";
};

// Map Stripe event type to our enum
const mapEventType = (stripeEventType: string): string | null => {
  const eventMap: Record<string, string> = {
    "payment_intent.succeeded": "payment_succeeded",
    "payment_intent.payment_failed": "payment_failed",
    "customer.subscription.created": "subscription_created",
    "customer.subscription.updated": "subscription_updated",
    "customer.subscription.deleted": "subscription_canceled",
    "invoice.paid": "invoice_paid",
    "invoice.payment_failed": "invoice_payment_failed",
    "customer.created": "customer_created",
    "charge.refunded": "refund_processed",
  };
  return eventMap[stripeEventType] || null;
};

// Find user by Stripe customer ID
async function findUserByCustomerId(customerId: string): Promise<string | null> {
  logStep("Finding user by customer ID", { customerId });

  // First check if we have a subscription with this customer
  const { data: subscription } = await supabaseAdmin
    .from("user_subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .limit(1)
    .single();

  if (subscription?.user_id) {
    logStep("Found user from subscription", { userId: subscription.user_id });
    return subscription.user_id;
  }

  // If not, try to find user by email from Stripe
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return null;

    const email = (customer as Stripe.Customer).email;
    if (!email) return null;

    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const user = users.users.find((u) => u.email === email);
    
    if (user) {
      logStep("Found user by email", { userId: user.id, email });
      return user.id;
    }
  } catch (error) {
    logStep("Error finding user by email", { error: String(error) });
  }

  return null;
}

// Get plan by Stripe price ID
async function getPlanByPriceId(priceId: string): Promise<string | null> {
  const { data: plan } = await supabaseAdmin
    .from("subscription_plans")
    .select("id")
    .eq("stripe_price_id", priceId)
    .single();

  return plan?.id || null;
}

// Log payment event
async function logPaymentEvent(
  stripeEventId: string,
  eventType: string,
  customerId: string | null,
  subscriptionId: string | null,
  userId: string | null,
  payload: unknown
): Promise<void> {
  const { error } = await supabaseAdmin.from("payment_events").insert({
    stripe_event_id: stripeEventId,
    event_type: eventType,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    user_id: userId,
    payload: payload,
    processed: true,
    processed_at: new Date().toISOString(),
  });

  if (error) {
    logStep("Error logging payment event", { error: error.message });
  }
}

// Handle subscription created/updated
async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  isNew: boolean
): Promise<void> {
  const customerId = subscription.customer as string;
  const userId = await findUserByCustomerId(customerId);

  if (!userId) {
    logStep("No user found for customer", { customerId });
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  let planId = await getPlanByPriceId(priceId);

  // If no plan found, try to match by price amount
  if (!planId) {
    const price = subscription.items.data[0]?.price;
    const priceCents = price?.unit_amount || 0;
    
    const { data: matchingPlan } = await supabaseAdmin
      .from("subscription_plans")
      .select("id")
      .eq("price_cents", priceCents)
      .eq("is_active", true)
      .limit(1)
      .single();

    planId = matchingPlan?.id;

    // Update plan with Stripe IDs if found
    if (planId) {
      await supabaseAdmin
        .from("subscription_plans")
        .update({
          stripe_product_id: price?.product as string,
          stripe_price_id: priceId,
        })
        .eq("id", planId);
    }
  }

  if (!planId) {
    logStep("No matching plan found", { priceId });
    return;
  }

  const subscriptionData = {
    user_id: userId,
    plan_id: planId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    status: mapSubscriptionStatus(subscription.status),
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
    ended_at: subscription.ended_at
      ? new Date(subscription.ended_at * 1000).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? new Date(subscription.trial_start * 1000).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
  };

  if (isNew) {
    // Cancel any existing active subscriptions for this user
    await supabaseAdmin
      .from("user_subscriptions")
      .update({ status: "canceled", ended_at: new Date().toISOString() })
      .eq("user_id", userId)
      .in("status", ["active", "trialing"]);

    const { error } = await supabaseAdmin
      .from("user_subscriptions")
      .insert(subscriptionData);

    if (error) {
      logStep("Error creating subscription", { error: error.message });
    } else {
      logStep("Subscription created", { userId, planId });
    }
  } else {
    const { error } = await supabaseAdmin
      .from("user_subscriptions")
      .update(subscriptionData)
      .eq("stripe_subscription_id", subscription.id);

    if (error) {
      logStep("Error updating subscription", { error: error.message });
    } else {
      logStep("Subscription updated", { subscriptionId: subscription.id });
    }
  }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("user_subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    logStep("Error canceling subscription", { error: error.message });
  } else {
    logStep("Subscription canceled", { subscriptionId: subscription.id });
  }
}

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    logStep("Missing stripe-signature header");
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    logStep("STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
    logStep("Webhook event received", { type: event.type, id: event.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logStep("Webhook signature verification failed", { error: message });
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  const eventType = mapEventType(event.type);

  try {
    switch (event.type) {
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription, true);
        await logPaymentEvent(
          event.id,
          "subscription_created",
          subscription.customer as string,
          subscription.id,
          await findUserByCustomerId(subscription.customer as string),
          event.data.object
        );
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription, false);
        
        // Check if this is a renewal
        const previousAttributes = (event.data as { previous_attributes?: Record<string, unknown> }).previous_attributes;
        const isRenewal = previousAttributes?.current_period_end !== undefined;
        
        await logPaymentEvent(
          event.id,
          isRenewal ? "subscription_renewed" : "subscription_updated",
          subscription.customer as string,
          subscription.id,
          await findUserByCustomerId(subscription.customer as string),
          event.data.object
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        await logPaymentEvent(
          event.id,
          "subscription_canceled",
          subscription.customer as string,
          subscription.id,
          await findUserByCustomerId(subscription.customer as string),
          event.data.object
        );
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await logPaymentEvent(
          event.id,
          "invoice_paid",
          invoice.customer as string,
          invoice.subscription as string | null,
          await findUserByCustomerId(invoice.customer as string),
          event.data.object
        );
        logStep("Invoice paid", { invoiceId: invoice.id });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Update subscription status to past_due if exists
        if (invoice.subscription) {
          await supabaseAdmin
            .from("user_subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", invoice.subscription);
        }

        await logPaymentEvent(
          event.id,
          "invoice_payment_failed",
          invoice.customer as string,
          invoice.subscription as string | null,
          await findUserByCustomerId(invoice.customer as string),
          event.data.object
        );
        logStep("Invoice payment failed", { invoiceId: invoice.id });
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await logPaymentEvent(
          event.id,
          "payment_succeeded",
          paymentIntent.customer as string | null,
          null,
          paymentIntent.customer
            ? await findUserByCustomerId(paymentIntent.customer as string)
            : null,
          event.data.object
        );
        logStep("Payment succeeded", { paymentIntentId: paymentIntent.id });
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await logPaymentEvent(
          event.id,
          "payment_failed",
          paymentIntent.customer as string | null,
          null,
          paymentIntent.customer
            ? await findUserByCustomerId(paymentIntent.customer as string)
            : null,
          event.data.object
        );
        logStep("Payment failed", { paymentIntentId: paymentIntent.id });
        break;
      }

      case "customer.created": {
        const customer = event.data.object as Stripe.Customer;
        await logPaymentEvent(
          event.id,
          "customer_created",
          customer.id,
          null,
          null,
          event.data.object
        );
        logStep("Customer created", { customerId: customer.id });
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await logPaymentEvent(
          event.id,
          "refund_processed",
          charge.customer as string | null,
          null,
          charge.customer
            ? await findUserByCustomerId(charge.customer as string)
            : null,
          event.data.object
        );
        logStep("Refund processed", { chargeId: charge.id });
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logStep("Error processing webhook", { error: message });

    // Log failed event for retry
    if (eventType) {
      await supabaseAdmin.from("payment_events").insert({
        stripe_event_id: event.id,
        event_type: eventType,
        payload: event.data.object,
        processed: false,
        error_message: message,
        retry_count: 0,
      });
    }

    return new Response(JSON.stringify({ error: message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
