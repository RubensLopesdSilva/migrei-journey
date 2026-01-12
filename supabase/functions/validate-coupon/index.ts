import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[VALIDATE-COUPON] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

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
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const body = await req.json();
    const { couponCode, planId } = body;

    if (!couponCode) throw new Error("Coupon code is required");

    // Validate coupon using database function
    const { data: result, error: rpcError } = await supabaseClient.rpc("validate_coupon", {
      p_code: couponCode.toUpperCase(),
      p_user_id: user.id,
      p_plan_id: planId || null,
    });

    if (rpcError) {
      logStep("RPC error", { error: rpcError.message });
      throw new Error("Failed to validate coupon");
    }

    const validation = result?.[0];

    if (!validation) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Cupom não encontrado",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (!validation.is_valid) {
      logStep("Coupon invalid", { error: validation.error_message });
      return new Response(
        JSON.stringify({
          valid: false,
          error: validation.error_message,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get coupon details for display
    const { data: coupon } = await supabaseClient
      .from("coupons")
      .select("name, description, coupon_type, discount_value, duration, duration_in_months")
      .eq("id", validation.coupon_id)
      .single();

    logStep("Coupon validated successfully", {
      couponId: validation.coupon_id,
      discountType: validation.discount_type,
      discountValue: validation.discount_value,
    });

    return new Response(
      JSON.stringify({
        valid: true,
        coupon: {
          id: validation.coupon_id,
          name: coupon?.name,
          description: coupon?.description,
          type: validation.discount_type,
          value: Number(validation.discount_value),
          duration: coupon?.duration,
          durationInMonths: coupon?.duration_in_months,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ valid: false, error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
