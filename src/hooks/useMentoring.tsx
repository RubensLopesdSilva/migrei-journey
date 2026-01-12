import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

export interface Mentor {
  id: string;
  user_id: string | null;
  name: string;
  title: string;
  bio: string | null;
  expertise: string[];
  avatar_url: string | null;
  linkedin_url: string | null;
  years_experience: number;
}

export interface MentorAvailability {
  id: string;
  mentor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface MentoringSession {
  id: string;
  mentor_id: string;
  mentee_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  notes: string | null;
  meeting_url: string | null;
  mentor?: Mentor;
}

export function useMentoring() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mySessions, setMySessions] = useState<MentoringSession[]>([]);
  const [monthlySessionCount, setMonthlySessionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use the new subscription system
  const {
    isSubscribed,
    planSlug,
    planName,
    features,
    hasFeature,
    getFeatureValue,
    isLoading: subscriptionLoading,
  } = useSubscription();

  // Get session limit from subscription features
  const sessionLimit = getFeatureValue<number>("mentoring_sessions_limit", 0);
  const remainingSessions = Math.max(0, sessionLimit - monthlySessionCount);
  const canBookSessions = sessionLimit > 0 && remainingSessions > 0;
  const hasAIAssistant = hasFeature("ai_assistant");
  const hasPrioritySupport = hasFeature("priority_support");
  const hasExclusiveContent = hasFeature("exclusive_content");

  const fetchMentors = useCallback(async () => {
    const { data, error } = await supabase
      .from("mentors")
      .select("*")
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching mentors:", error);
      return;
    }

    setMentors(data || []);
  }, []);

  const fetchMySessions = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("mentoring_sessions")
      .select(`
        *,
        mentor:mentors(*)
      `)
      .eq("mentee_id", user.id)
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("Error fetching sessions:", error);
      return;
    }

    setMySessions(data || []);
  }, [user]);

  const fetchMonthlyCount = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .rpc("count_monthly_sessions", { user_uuid: user.id });

    if (error) {
      console.error("Error fetching monthly count:", error);
      return;
    }

    setMonthlySessionCount(data || 0);
  }, [user]);

  const fetchMentorAvailability = async (mentorId: string): Promise<MentorAvailability[]> => {
    const { data, error } = await supabase
      .from("mentor_availability")
      .select("*")
      .eq("mentor_id", mentorId)
      .eq("is_available", true);

    if (error) {
      console.error("Error fetching availability:", error);
      return [];
    }

    return data || [];
  };

  const bookSession = async (mentorId: string, scheduledAt: Date): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para agendar uma mentoria.",
        variant: "destructive",
      });
      return false;
    }

    if (sessionLimit === 0) {
      toast({
        title: "Plano não permite mentorias",
        description: "Faça upgrade para um plano que inclua sessões de mentoria.",
        variant: "destructive",
      });
      return false;
    }

    if (monthlySessionCount >= sessionLimit) {
      toast({
        title: "Limite atingido",
        description: `Você já utilizou suas ${sessionLimit} mentorias deste mês. Faça upgrade para ter mais sessões.`,
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from("mentoring_sessions")
      .insert({
        mentor_id: mentorId,
        mentee_id: user.id,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: 60,
        status: "scheduled",
      });

    if (error) {
      console.error("Error booking session:", error);
      toast({
        title: "Erro ao agendar",
        description: "Não foi possível agendar a mentoria. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Mentoria agendada!",
      description: "Você receberá um email com os detalhes da sessão.",
    });

    await fetchMySessions();
    await fetchMonthlyCount();

    return true;
  };

  const cancelSession = async (sessionId: string): Promise<boolean> => {
    const { error } = await supabase
      .from("mentoring_sessions")
      .update({ status: "cancelled" })
      .eq("id", sessionId);

    if (error) {
      console.error("Error cancelling session:", error);
      toast({
        title: "Erro ao cancelar",
        description: "Não foi possível cancelar a mentoria.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Mentoria cancelada",
      description: "A sessão foi cancelada com sucesso.",
    });

    await fetchMySessions();
    await fetchMonthlyCount();

    return true;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMentors(),
        fetchMySessions(),
        fetchMonthlyCount(),
      ]);
      setLoading(false);
    };

    if (user) {
      loadData();
    } else {
      // Still fetch mentors for non-logged users
      fetchMentors().then(() => setLoading(false));
    }
  }, [user, fetchMentors, fetchMySessions, fetchMonthlyCount]);

  return {
    mentors,
    mySessions,
    monthlySessionCount,
    sessionLimit,
    remainingSessions,
    canBookSessions,
    // Plan info
    planSlug,
    planName,
    isSubscribed,
    // Feature flags
    hasAIAssistant,
    hasPrioritySupport,
    hasExclusiveContent,
    // Loading state
    loading: loading || subscriptionLoading,
    // Actions
    fetchMentorAvailability,
    bookSession,
    cancelSession,
    refetch: async () => {
      await Promise.all([
        fetchMentors(),
        fetchMySessions(),
        fetchMonthlyCount(),
      ]);
    },
  };
}
