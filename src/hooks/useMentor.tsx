import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface MentorProfile {
  id: string;
  user_id: string;
  name: string;
  title: string;
  bio: string | null;
  expertise: string[];
  avatar_url: string | null;
  linkedin_url: string | null;
  years_experience: number;
  is_active: boolean;
}

export interface MentorSession {
  id: string;
  mentor_id: string;
  mentee_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  notes: string | null;
  meeting_url: string | null;
  cancelled_at?: string | null;
  rescheduled_from?: string | null;
  mentee?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface MentorAvailabilitySlot {
  id: string;
  mentor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const DAY_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function useMentor() {
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [availability, setAvailability] = useState<MentorAvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMentor, setIsMentor] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user is a mentor
  const checkMentorStatus = useCallback(async () => {
    if (!user) {
      setIsMentor(false);
      setMentorProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("mentors")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      setIsMentor(false);
      setMentorProfile(null);
      return;
    }

    setIsMentor(true);
    setMentorProfile(data);
    return data;
  }, [user]);

  // Fetch mentor's sessions
  const fetchSessions = useCallback(async (mentorId: string) => {
    // First fetch sessions
    const { data: sessionsData, error: sessionError } = await supabase
      .from("mentoring_sessions")
      .select("*")
      .eq("mentor_id", mentorId)
      .order("scheduled_at", { ascending: true });

    if (sessionError) {
      console.error("Error fetching mentor sessions:", sessionError);
      return;
    }

    if (!sessionsData || sessionsData.length === 0) {
      setSessions([]);
      return;
    }

    // Get unique mentee IDs
    const menteeIds = [...new Set(sessionsData.map(s => s.mentee_id))];
    
    // Fetch mentee profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("user_id", menteeIds);

    // Map profiles to sessions
    const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
    
    const sessionsWithMentees: MentorSession[] = sessionsData.map(session => ({
      ...session,
      mentee: profilesMap.get(session.mentee_id) || undefined,
    }));

    setSessions(sessionsWithMentees);
  }, []);

  // Fetch mentor's availability
  const fetchAvailability = useCallback(async (mentorId: string) => {
    const { data, error } = await supabase
      .from("mentor_availability")
      .select("*")
      .eq("mentor_id", mentorId)
      .order("day_of_week", { ascending: true });

    if (error) {
      console.error("Error fetching availability:", error);
      return;
    }

    setAvailability(data || []);
  }, []);

  // Update availability
  const updateAvailability = async (
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    isAvailable: boolean
  ): Promise<boolean> => {
    if (!mentorProfile) return false;

    // Check if slot exists
    const existingSlot = availability.find(
      (slot) => slot.day_of_week === dayOfWeek
    );

    if (existingSlot) {
      // Update existing
      const { error } = await supabase
        .from("mentor_availability")
        .update({
          start_time: startTime,
          end_time: endTime,
          is_available: isAvailable,
        })
        .eq("id", existingSlot.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a disponibilidade.",
          variant: "destructive",
        });
        return false;
      }
    } else {
      // Insert new
      const { error } = await supabase.from("mentor_availability").insert({
        mentor_id: mentorProfile.id,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        is_available: isAvailable,
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível salvar a disponibilidade.",
          variant: "destructive",
        });
        return false;
      }
    }

    toast({
      title: "Disponibilidade atualizada",
      description: `${DAY_NAMES[dayOfWeek]} foi ${isAvailable ? "ativado" : "desativado"}.`,
    });

    await fetchAvailability(mentorProfile.id);
    return true;
  };

  // Toggle availability for a day
  const toggleDayAvailability = async (dayOfWeek: number): Promise<boolean> => {
    if (!mentorProfile) return false;

    const existingSlot = availability.find((slot) => slot.day_of_week === dayOfWeek);
    
    if (existingSlot) {
      const { error } = await supabase
        .from("mentor_availability")
        .update({ is_available: !existingSlot.is_available })
        .eq("id", existingSlot.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a disponibilidade.",
          variant: "destructive",
        });
        return false;
      }
    } else {
      // Create new slot with default times
      const { error } = await supabase.from("mentor_availability").insert({
        mentor_id: mentorProfile.id,
        day_of_week: dayOfWeek,
        start_time: "09:00",
        end_time: "18:00",
        is_available: true,
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível salvar a disponibilidade.",
          variant: "destructive",
        });
        return false;
      }
    }

    await fetchAvailability(mentorProfile.id);
    return true;
  };

  // Update session status (confirm, cancel, complete)
  const updateSessionStatus = async (
    sessionId: string,
    status: "scheduled" | "cancelled" | "completed",
    notes?: string
  ): Promise<boolean> => {
    const updateData: Record<string, unknown> = { status };
    
    if (status === "cancelled") {
      updateData.cancelled_at = new Date().toISOString();
    }
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { error } = await supabase
      .from("mentoring_sessions")
      .update(updateData)
      .eq("id", sessionId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a sessão.",
        variant: "destructive",
      });
      return false;
    }

    const statusMessages: Record<string, string> = {
      scheduled: "Sessão confirmada",
      cancelled: "Sessão cancelada",
      completed: "Sessão marcada como concluída",
    };

    toast({
      title: statusMessages[status],
      description: "A sessão foi atualizada com sucesso.",
    });

    if (mentorProfile) {
      await fetchSessions(mentorProfile.id);
    }
    return true;
  };

  // Add notes to session
  const addSessionNotes = async (sessionId: string, notes: string): Promise<boolean> => {
    const { error } = await supabase
      .from("mentoring_sessions")
      .update({ notes })
      .eq("id", sessionId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as anotações.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Anotações salvas",
      description: "As anotações da sessão foram atualizadas.",
    });

    if (mentorProfile) {
      await fetchSessions(mentorProfile.id);
    }
    return true;
  };

  // Update mentor profile
  const updateProfile = async (updates: Partial<MentorProfile>): Promise<boolean> => {
    if (!mentorProfile) return false;

    const { error } = await supabase
      .from("mentors")
      .update(updates)
      .eq("id", mentorProfile.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas.",
    });

    await checkMentorStatus();
    return true;
  };

  // Get formatted availability for display
  const getFormattedAvailability = () => {
    return DAY_NAMES.map((name, index) => {
      const slot = availability.find((a) => a.day_of_week === index);
      return {
        day: index,
        name,
        isAvailable: slot?.is_available ?? false,
        startTime: slot?.start_time || "09:00",
        endTime: slot?.end_time || "18:00",
      };
    });
  };

  // Get sessions grouped by status
  const getSessionsByStatus = () => {
    const now = new Date();
    
    const upcoming = sessions.filter(
      (s) => s.status === "scheduled" && new Date(s.scheduled_at) >= now
    );
    
    const past = sessions.filter(
      (s) => s.status === "completed" || new Date(s.scheduled_at) < now
    );
    
    const cancelled = sessions.filter((s) => s.status === "cancelled");

    return { upcoming, past, cancelled };
  };

  // Get session stats
  const getStats = () => {
    const { upcoming, past, cancelled } = getSessionsByStatus();
    const thisMonth = sessions.filter((s) => {
      const sessionDate = new Date(s.scheduled_at);
      const now = new Date();
      return (
        sessionDate.getMonth() === now.getMonth() &&
        sessionDate.getFullYear() === now.getFullYear() &&
        s.status !== "cancelled"
      );
    });

    return {
      totalSessions: sessions.filter((s) => s.status !== "cancelled").length,
      upcomingSessions: upcoming.length,
      completedSessions: past.length,
      cancelledSessions: cancelled.length,
      thisMonthSessions: thisMonth.length,
    };
  };

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const mentor = await checkMentorStatus();
      
      if (mentor) {
        await Promise.all([
          fetchSessions(mentor.id),
          fetchAvailability(mentor.id),
        ]);
      }
      
      setLoading(false);
    };

    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user, checkMentorStatus, fetchSessions, fetchAvailability]);

  // Subscribe to realtime updates for mentoring sessions
  useEffect(() => {
    if (!mentorProfile) return;

    const channel = supabase
      .channel('mentor-sessions-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mentoring_sessions',
          filter: `mentor_id=eq.${mentorProfile.id}`,
        },
        (payload) => {
          console.log('Session update received:', payload);
          // Refetch sessions when any change occurs
          fetchSessions(mentorProfile.id);
          
          // Show toast for new bookings
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Novo agendamento!",
              description: "Um usuário agendou uma mentoria com você.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mentorProfile, fetchSessions, toast]);

  return {
    // State
    isMentor,
    mentorProfile,
    sessions,
    availability,
    loading,
    // Computed
    getFormattedAvailability,
    getSessionsByStatus,
    getStats,
    dayNames: DAY_NAMES,
    // Actions
    updateAvailability,
    toggleDayAvailability,
    updateSessionStatus,
    addSessionNotes,
    updateProfile,
    // Refresh
    refetch: async () => {
      if (mentorProfile) {
        await Promise.all([
          fetchSessions(mentorProfile.id),
          fetchAvailability(mentorProfile.id),
        ]);
      }
    },
  };
}
