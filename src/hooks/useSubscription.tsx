import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface PlanFeatures {
  mentoring_sessions_limit?: number;
  community_access?: boolean;
  ai_assistant?: boolean;
  priority_support?: boolean;
  exclusive_content?: boolean;
  max_phase_access?: number;
  [key: string]: unknown;
}

interface SubscriptionState {
  isLoading: boolean;
  isSubscribed: boolean;
  status: string | null;
  planSlug: string;
  planName: string;
  subscriptionEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
  features: PlanFeatures;
}

interface SubscriptionContextType extends SubscriptionState {
  checkSubscription: () => Promise<void>;
  createCheckout: (planSlug: string, couponCode?: string) => Promise<string | null>;
  openCustomerPortal: () => Promise<string | null>;
  validateCoupon: (couponCode: string, planId?: string) => Promise<CouponValidation | null>;
  hasFeature: (featureKey: string) => boolean;
  getFeatureValue: <T = unknown>(featureKey: string, defaultValue: T) => T;
  canAccessPhase: (phaseNumber: number) => boolean;
  getMaxPhaseAccess: () => number;
}

interface CouponValidation {
  valid: boolean;
  error?: string;
  coupon?: {
    id: string;
    name: string;
    description?: string;
    type: "percentage" | "fixed_amount" | "trial_extension";
    value: number;
    duration: string;
    durationInMonths?: number;
  };
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

const initialState: SubscriptionState = {
  isLoading: true,
  isSubscribed: false,
  status: null,
  planSlug: "essential",
  planName: "Essencial",
  subscriptionEnd: null,
  cancelAtPeriodEnd: false,
  trialEnd: null,
  features: {},
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const [state, setState] = useState<SubscriptionState>(initialState);

  const checkSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setState({ ...initialState, isLoading: false });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error("Error checking subscription:", error);
        setState({ ...initialState, isLoading: false });
        return;
      }

      // Parse features
      const features: PlanFeatures = {};
      if (data.features) {
        Object.entries(data.features).forEach(([key, value]) => {
          // Parse JSONB values
          if (typeof value === "string") {
            try {
              features[key] = JSON.parse(value);
            } catch {
              features[key] = value;
            }
          } else {
            features[key] = value;
          }
        });
      }

      setState({
        isLoading: false,
        isSubscribed: data.subscribed || false,
        status: data.status,
        planSlug: data.plan_slug || "essential",
        planName: data.plan_name || "Essencial",
        subscriptionEnd: data.subscription_end,
        cancelAtPeriodEnd: data.cancel_at_period_end || false,
        trialEnd: data.trial_end,
        features,
      });
    } catch (error) {
      console.error("Error checking subscription:", error);
      setState({ ...initialState, isLoading: false });
    }
  }, [session?.access_token]);

  const createCheckout = useCallback(
    async (planSlug: string, couponCode?: string): Promise<string | null> => {
      if (!session?.access_token) {
        throw new Error("You must be logged in to subscribe");
      }

      try {
        // Build explicit URLs using window.location.origin to ensure correct redirect
        const currentOrigin = window.location.origin;
        const successUrl = `${currentOrigin}/assinatura-sucesso`;
        const cancelUrl = `${currentOrigin}/assinar?subscription=canceled`;

        const { data, error } = await supabase.functions.invoke("create-checkout", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: {
            planSlug,
            couponCode,
            successUrl,
            cancelUrl,
          },
        });

        if (error) throw error;
        if (data.error) throw new Error(data.error);

        return data.url;
      } catch (error) {
        console.error("Error creating checkout:", error);
        throw error;
      }
    },
    [session?.access_token]
  );

  const openCustomerPortal = useCallback(async (): Promise<string | null> => {
    if (!session?.access_token) {
      throw new Error("You must be logged in to manage subscription");
    }

    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data.url;
    } catch (error) {
      console.error("Error opening customer portal:", error);
      throw error;
    }
  }, [session?.access_token]);

  const validateCoupon = useCallback(
    async (couponCode: string, planId?: string): Promise<CouponValidation | null> => {
      if (!session?.access_token) {
        return { valid: false, error: "You must be logged in" };
      }

      try {
        const { data, error } = await supabase.functions.invoke("validate-coupon", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: {
            couponCode,
            planId,
          },
        });

        if (error) throw error;

        return data;
      } catch (error) {
        console.error("Error validating coupon:", error);
        return { valid: false, error: "Failed to validate coupon" };
      }
    },
    [session?.access_token]
  );

  const hasFeature = useCallback(
    (featureKey: string): boolean => {
      const value = state.features[featureKey];
      if (typeof value === "boolean") return value;
      if (typeof value === "number") return value > 0;
      return Boolean(value);
    },
    [state.features]
  );

  const getFeatureValue = useCallback(
    <T = unknown>(featureKey: string, defaultValue: T): T => {
      const value = state.features[featureKey];
      if (value === undefined || value === null) return defaultValue;
      return value as T;
    },
    [state.features]
  );

  const getMaxPhaseAccess = useCallback((): number => {
    const maxPhase = state.features.max_phase_access;
    if (typeof maxPhase === "number") return maxPhase;
    // Default: all plans have full access (6 phases)
    return 6;
  }, [state.features, state.planSlug]);

  const canAccessPhase = useCallback(
    (phaseNumber: number): boolean => {
      return phaseNumber <= getMaxPhaseAccess();
    },
    [getMaxPhaseAccess]
  );

  // Check subscription on mount and when user changes
  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setState({ ...initialState, isLoading: false });
    }
  }, [user, checkSubscription]);

  // Auto-refresh subscription every minute
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  // Handle URL params for subscription success/cancel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subscriptionStatus = params.get("subscription");

    if (subscriptionStatus === "success") {
      // Refresh subscription after successful checkout
      setTimeout(checkSubscription, 2000);
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    } else if (subscriptionStatus === "canceled") {
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [checkSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        ...state,
        checkSubscription,
        createCheckout,
        openCustomerPortal,
        validateCoupon,
        hasFeature,
        getFeatureValue,
        canAccessPhase,
        getMaxPhaseAccess,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
