import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Validate key format - must be secret key (sk_), not publishable (pk_)
    if (stripeKey.startsWith("pk_")) {
      throw new Error("STRIPE_SECRET_KEY contains a publishable key (pk_*). Please configure a secret key (sk_live_* or sk_test_*) in Settings → Connectors → Stripe.");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const body = await req.json();
    const { planSlug, couponCode, successUrl, cancelUrl } = body;

    if (!planSlug) throw new Error("Plan slug is required");

    // Get plan details
    const { data: plan, error: planError } = await supabaseClient
      .from("subscription_plans")
      .select("*")
      .eq("slug", planSlug)
      .eq("is_active", true)
      .single();

    if (planError || !plan) throw new Error("Plan not found or inactive");
    logStep("Plan found", { planId: plan.id, name: plan.name });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if user already exists as Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });

      // Check for active subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        throw new Error("You already have an active subscription. Please manage it from your account settings.");
      }
    }

    // Create or get Stripe price
    let priceId = plan.stripe_price_id;

    if (!priceId) {
      // Create product and price in Stripe
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description || undefined,
        metadata: { plan_id: plan.id, plan_slug: plan.slug },
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price_cents,
        currency: plan.currency.toLowerCase(),
        recurring: {
          interval: plan.interval as "month" | "year",
          interval_count: plan.interval_count,
        },
      });

      priceId = price.id;

      // Update plan with Stripe IDs
      await supabaseClient
        .from("subscription_plans")
        .update({
          stripe_product_id: product.id,
          stripe_price_id: price.id,
        })
        .eq("id", plan.id);

      logStep("Created Stripe product and price", { productId: product.id, priceId });
    }

    // Build checkout session options
    const origin = req.headers.get("origin") || "https://migrei-compass.lovable.app";
    const successUrlFinal = successUrl || `${origin}/assinatura-sucesso`;
    const cancelUrlFinal = cancelUrl || `${origin}/assinar?subscription=canceled`;
    
    logStep("Building checkout session", { origin, successUrl: successUrlFinal, cancelUrl: cancelUrlFinal });
    
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: successUrlFinal,
      cancel_url: cancelUrlFinal,
      subscription_data: {
        trial_period_days: plan.trial_days > 0 ? plan.trial_days : undefined,
        metadata: {
          user_id: user.id,
          plan_id: plan.id,
          plan_slug: plan.slug,
        },
      },
      metadata: {
        user_id: user.id,
        plan_id: plan.id,
      },
      allow_promotion_codes: true,
    };

    // Apply coupon if provided
    if (couponCode) {
      // Validate coupon
      const { data: couponValidation } = await supabaseClient
        .rpc("validate_coupon", {
          p_code: couponCode,
          p_user_id: user.id,
          p_plan_id: plan.id,
        });

      if (couponValidation?.[0]?.is_valid) {
        const coupon = couponValidation[0];
        
        // Check if Stripe coupon exists, or create one
        let stripeCouponId: string;
        
        const { data: dbCoupon } = await supabaseClient
          .from("coupons")
          .select("stripe_coupon_id")
          .eq("id", coupon.coupon_id)
          .single();

        if (dbCoupon?.stripe_coupon_id) {
          stripeCouponId = dbCoupon.stripe_coupon_id;
        } else {
          // Create coupon in Stripe
          const stripeCoupon = await stripe.coupons.create({
            ...(coupon.discount_type === "percentage"
              ? { percent_off: Number(coupon.discount_value) }
              : { amount_off: Number(coupon.discount_value), currency: plan.currency.toLowerCase() }),
            duration: "once",
            metadata: { coupon_id: coupon.coupon_id },
          });

          stripeCouponId = stripeCoupon.id;

          // Update coupon with Stripe ID
          await supabaseClient
            .from("coupons")
            .update({ stripe_coupon_id: stripeCouponId })
            .eq("id", coupon.coupon_id);
        }

        sessionOptions.discounts = [{ coupon: stripeCouponId }];
        sessionOptions.allow_promotion_codes = false; // Disable if we have a custom coupon
        logStep("Applied coupon", { couponId: coupon.coupon_id });
      } else {
        logStep("Invalid coupon provided", { code: couponCode, error: couponValidation?.[0]?.error_message });
      }
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);
    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
