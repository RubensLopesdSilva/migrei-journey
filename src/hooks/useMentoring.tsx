import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Mentor {
  id: string;
  user_id: string;
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

export interface UserPlan {
  id: string;
  user_id: string;
  plan: "free" | "premium";
}

const MONTHLY_SESSION_LIMIT = 2;

export function useMentoring() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [mySessions, setMySessions] = useState<MentoringSession[]>([]);
  const [monthlySessionCount, setMonthlySessionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

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

  const fetchUserPlan = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_plans")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user plan:", error);
      return;
    }

    setUserPlan(data);
  }, [user]);

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

    if (!userPlan || userPlan.plan !== "premium") {
      toast({
        title: "Plano Premium necessário",
        description: "Atualize para o plano Premium para agendar mentorias.",
        variant: "destructive",
      });
      return false;
    }

    if (monthlySessionCount >= MONTHLY_SESSION_LIMIT) {
      toast({
        title: "Limite atingido",
        description: `Você já utilizou suas ${MONTHLY_SESSION_LIMIT} mentorias deste mês.`,
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
        fetchUserPlan(),
        fetchMySessions(),
        fetchMonthlyCount(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [fetchMentors, fetchUserPlan, fetchMySessions, fetchMonthlyCount]);

  return {
    mentors,
    userPlan,
    mySessions,
    monthlySessionCount,
    remainingSessions: MONTHLY_SESSION_LIMIT - monthlySessionCount,
    isPremium: userPlan?.plan === "premium",
    loading,
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
