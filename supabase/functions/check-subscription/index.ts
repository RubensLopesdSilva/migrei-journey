import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

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

    // First check our database for subscription
    const { data: dbSubscription } = await supabaseClient
      .from("user_subscriptions")
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq("user_id", user.id)
      .in("status", ["active", "trialing", "past_due"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (dbSubscription) {
      logStep("Found subscription in database", {
        planSlug: dbSubscription.plan?.slug,
        status: dbSubscription.status,
      });

      // Get plan features
      const { data: features } = await supabaseClient
        .from("plan_features")
        .select("feature_key, feature_value")
        .eq("plan_id", dbSubscription.plan_id);

      const featuresMap = features?.reduce((acc, f) => {
        acc[f.feature_key] = f.feature_value;
        return acc;
      }, {} as Record<string, unknown>) || {};

      return new Response(
        JSON.stringify({
          subscribed: dbSubscription.status === "active" || dbSubscription.status === "trialing",
          status: dbSubscription.status,
          plan_slug: dbSubscription.plan?.slug,
          plan_name: dbSubscription.plan?.name,
          subscription_end: dbSubscription.current_period_end,
          cancel_at_period_end: dbSubscription.cancel_at_period_end,
          trial_end: dbSubscription.trial_end,
          features: featuresMap,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // If no subscription in DB, check Stripe directly
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      return new Response(
        JSON.stringify({
          subscribed: false,
          status: null,
          plan_slug: "free",
          plan_name: "Gratuito",
          features: {},
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // Check for trialing
      const trialingSubscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "trialing",
        limit: 1,
      });

      if (trialingSubscriptions.data.length === 0) {
        logStep("No active subscription found");
        return new Response(
          JSON.stringify({
            subscribed: false,
            status: null,
            plan_slug: "free",
            plan_name: "Gratuito",
            features: {},
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }
    }

    const subscription = subscriptions.data[0] || (await stripe.subscriptions.list({
      customer: customerId,
      status: "trialing",
      limit: 1,
    })).data[0];

    if (!subscription) {
      return new Response(
        JSON.stringify({
          subscribed: false,
          status: null,
          plan_slug: "free",
          plan_name: "Gratuito",
          features: {},
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const priceId = subscription.items.data[0]?.price.id;
    
    // Find plan by Stripe price ID
    const { data: plan } = await supabaseClient
      .from("subscription_plans")
      .select("*")
      .eq("stripe_price_id", priceId)
      .single();

    // Get plan features if plan found
    let featuresMap: Record<string, unknown> = {};
    if (plan) {
      const { data: features } = await supabaseClient
        .from("plan_features")
        .select("feature_key, feature_value")
        .eq("plan_id", plan.id);

      featuresMap = features?.reduce((acc, f) => {
        acc[f.feature_key] = f.feature_value;
        return acc;
      }, {} as Record<string, unknown>) || {};
    }

    logStep("Active subscription found", {
      subscriptionId: subscription.id,
      status: subscription.status,
      planSlug: plan?.slug,
    });

    return new Response(
      JSON.stringify({
        subscribed: true,
        status: subscription.status,
        plan_slug: plan?.slug || "premium",
        plan_name: plan?.name || "Premium",
        subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        trial_end: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
        features: featuresMap,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
