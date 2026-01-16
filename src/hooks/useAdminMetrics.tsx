import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";

interface ConversionFunnel {
  total_signups: number;
  completed_onboarding: number;
  selected_agent: number;
  started_phase1: number;
  completed_phase1: number;
  converted_to_paid: number;
  active_last_7_days: number;
  churned_users: number;
}

interface DailySignup {
  day: string;
  signups: number;
  with_agent: number;
  paid: number;
}

interface PhaseDistribution {
  phase_number: number;
  phase_name: string;
  user_count: number;
  avg_days_in_phase: number;
}

interface RetentionCohort {
  cohort_week: string;
  total_users: number;
  week_1_retention: number;
  week_2_retention: number;
  week_4_retention: number;
}

export function useAdminMetrics() {
  const { isAdmin } = useAdmin();

  const { data: funnel, isLoading: funnelLoading } = useQuery({
    queryKey: ["admin-funnel"],
    queryFn: async (): Promise<ConversionFunnel | null> => {
      const { data, error } = await supabase.rpc("get_conversion_funnel");
      if (error) {
        console.error("Error fetching funnel:", error);
        return null;
      }
      return data?.[0] || null;
    },
    enabled: isAdmin,
    staleTime: 60000,
  });

  const { data: dailySignups, isLoading: signupsLoading } = useQuery({
    queryKey: ["admin-daily-signups"],
    queryFn: async (): Promise<DailySignup[]> => {
      const { data, error } = await supabase.rpc("get_daily_signups");
      if (error) {
        console.error("Error fetching daily signups:", error);
        return [];
      }
      return data || [];
    },
    enabled: isAdmin,
    staleTime: 60000,
  });

  const { data: phaseDistribution, isLoading: phasesLoading } = useQuery({
    queryKey: ["admin-phase-distribution"],
    queryFn: async (): Promise<PhaseDistribution[]> => {
      const { data, error } = await supabase.rpc("get_phase_distribution");
      if (error) {
        console.error("Error fetching phase distribution:", error);
        return [];
      }
      return data || [];
    },
    enabled: isAdmin,
    staleTime: 60000,
  });

  const { data: retentionCohorts, isLoading: retentionLoading } = useQuery({
    queryKey: ["admin-retention"],
    queryFn: async (): Promise<RetentionCohort[]> => {
      const { data, error } = await supabase.rpc("get_retention_cohorts");
      if (error) {
        console.error("Error fetching retention cohorts:", error);
        return [];
      }
      return data || [];
    },
    enabled: isAdmin,
    staleTime: 60000,
  });

  // Calculate conversion rates
  const conversionRates = funnel ? {
    signupToOnboarding: funnel.total_signups > 0 
      ? ((funnel.completed_onboarding / funnel.total_signups) * 100).toFixed(1) 
      : "0",
    onboardingToAgent: funnel.completed_onboarding > 0 
      ? ((funnel.selected_agent / funnel.completed_onboarding) * 100).toFixed(1) 
      : "0",
    agentToPhase1: funnel.selected_agent > 0 
      ? ((funnel.started_phase1 / funnel.selected_agent) * 100).toFixed(1) 
      : "0",
    phase1Completion: funnel.started_phase1 > 0 
      ? ((funnel.completed_phase1 / funnel.started_phase1) * 100).toFixed(1) 
      : "0",
    freeToPaid: funnel.completed_onboarding > 0 
      ? ((funnel.converted_to_paid / funnel.completed_onboarding) * 100).toFixed(1) 
      : "0",
    churnRate: funnel.total_signups > 0 
      ? ((funnel.churned_users / funnel.total_signups) * 100).toFixed(1) 
      : "0",
  } : null;

  return {
    funnel,
    dailySignups,
    phaseDistribution,
    retentionCohorts,
    conversionRates,
    loading: funnelLoading || signupsLoading || phasesLoading || retentionLoading,
  };
}
