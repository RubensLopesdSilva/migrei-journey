import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { addHours, isBefore, format } from "date-fns";

export interface CancellationInfo {
  freeCancellationsUsed: number;
  paidCancellations: number;
  canCancelFree: boolean;
}

export interface BookedSlot {
  scheduled_at: string;
}

// Minimum hours in advance to book a session (48h)
const MIN_ADVANCE_HOURS = 48;

export function useMentoringBooking(
  sessionLimit: number,
  monthlySessionCount: number,
  onSuccess?: () => void
) {
  const [loading, setLoading] = useState(false);
  const [cancellationInfo, setCancellationInfo] = useState<CancellationInfo>({
    freeCancellationsUsed: 0,
    paidCancellations: 0,
    canCancelFree: true,
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's cancellation info for current month
  const fetchCancellationInfo = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase.rpc("get_monthly_cancellation_info", {
      p_user_id: user.id,
    });

    if (error) {
      console.error("Error fetching cancellation info:", error);
      return;
    }

    if (data && data.length > 0) {
      setCancellationInfo({
        freeCancellationsUsed: data[0].free_cancellations_used || 0,
        paidCancellations: data[0].paid_cancellations || 0,
        canCancelFree: data[0].can_cancel_free ?? true,
      });
    }
  }, [user]);

  // Fetch booked slots for a mentor in a date range
  const fetchBookedSlots = async (
    mentorId: string,
    startDate: Date,
    endDate: Date
  ): Promise<BookedSlot[]> => {
    const { data, error } = await supabase.rpc("get_mentor_booked_slots", {
      p_mentor_id: mentorId,
      p_start_date: format(startDate, "yyyy-MM-dd"),
      p_end_date: format(endDate, "yyyy-MM-dd"),
    });

    if (error) {
      console.error("Error fetching booked slots:", error);
      return [];
    }

    return (data || []).map((item: { scheduled_at: string }) => ({
      scheduled_at: item.scheduled_at,
    }));
  };

  // Check if a slot is available (not booked)
  const checkSlotAvailability = async (
    mentorId: string,
    scheduledAt: Date,
    excludeSessionId?: string
  ): Promise<boolean> => {
    const { data, error } = await supabase.rpc("is_slot_available", {
      p_mentor_id: mentorId,
      p_scheduled_at: scheduledAt.toISOString(),
      p_exclude_session_id: excludeSessionId || null,
    });

    if (error) {
      console.error("Error checking slot availability:", error);
      return false;
    }

    return data ?? false;
  };

  // Validate booking constraints
  const validateBooking = (scheduledAt: Date): { valid: boolean; message?: string } => {
    const now = new Date();
    const minBookingTime = addHours(now, MIN_ADVANCE_HOURS);

    // Check minimum advance time (48h)
    if (isBefore(scheduledAt, minBookingTime)) {
      return {
        valid: false,
        message: `Agendamentos devem ser feitos com no mínimo ${MIN_ADVANCE_HOURS}h de antecedência.`,
      };
    }

    // Check session limit
    if (sessionLimit === 0) {
      return {
        valid: false,
        message: "Seu plano não permite mentorias. Faça upgrade para ter acesso.",
      };
    }

    if (monthlySessionCount >= sessionLimit) {
      return {
        valid: false,
        message: `Você atingiu o limite de ${sessionLimit} mentorias deste mês.`,
      };
    }

    return { valid: true };
  };

  // Book a new session
  const bookSession = async (
    mentorId: string,
    scheduledAt: Date,
    meetingUrl?: string
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para agendar uma mentoria.",
        variant: "destructive",
      });
      return false;
    }

    // Validate booking constraints
    const validation = validateBooking(scheduledAt);
    if (!validation.valid) {
      toast({
        title: "Não foi possível agendar",
        description: validation.message,
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);

    // Check for slot conflict
    const isAvailable = await checkSlotAvailability(mentorId, scheduledAt);
    if (!isAvailable) {
      toast({
        title: "Horário indisponível",
        description: "Este horário já foi reservado por outro usuário. Escolha outro horário.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }

    // Create the session
    const { error } = await supabase.from("mentoring_sessions").insert({
      mentor_id: mentorId,
      mentee_id: user.id,
      scheduled_at: scheduledAt.toISOString(),
      duration_minutes: 60,
      status: "scheduled",
      meeting_url: meetingUrl || null,
    });

    if (error) {
      console.error("Error booking session:", error);
      toast({
        title: "Erro ao agendar",
        description: "Não foi possível agendar a mentoria. Tente novamente.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }

    toast({
      title: "Mentoria agendada!",
      description: "Você receberá um email com os detalhes da sessão.",
    });

    setLoading(false);
    onSuccess?.();
    return true;
  };

  // Cancel a session with limit tracking
  const cancelSession = async (sessionId: string): Promise<{ success: boolean; countedTowardsLimit: boolean }> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado.",
        variant: "destructive",
      });
      return { success: false, countedTowardsLimit: false };
    }

    setLoading(true);

    // Check if user can cancel for free
    await fetchCancellationInfo();
    const canCancelFree = cancellationInfo.canCancelFree;
    const monthYear = format(new Date(), "yyyy-MM");

    // Update the session status
    const { error: sessionError } = await supabase
      .from("mentoring_sessions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        counts_towards_limit: !canCancelFree, // If not free, it counts towards limit
      })
      .eq("id", sessionId);

    if (sessionError) {
      console.error("Error cancelling session:", sessionError);
      toast({
        title: "Erro ao cancelar",
        description: "Não foi possível cancelar a mentoria.",
        variant: "destructive",
      });
      setLoading(false);
      return { success: false, countedTowardsLimit: false };
    }

    // Update cancellation tracking
    const { data: existingRecord } = await supabase
      .from("user_monthly_cancellations")
      .select("*")
      .eq("user_id", user.id)
      .eq("month_year", monthYear)
      .single();

    if (existingRecord) {
      await supabase
        .from("user_monthly_cancellations")
        .update({
          free_cancellations_used: canCancelFree 
            ? existingRecord.free_cancellations_used + 1 
            : existingRecord.free_cancellations_used,
          paid_cancellations: !canCancelFree 
            ? existingRecord.paid_cancellations + 1 
            : existingRecord.paid_cancellations,
        })
        .eq("id", existingRecord.id);
    } else {
      await supabase.from("user_monthly_cancellations").insert({
        user_id: user.id,
        month_year: monthYear,
        free_cancellations_used: canCancelFree ? 1 : 0,
        paid_cancellations: !canCancelFree ? 1 : 0,
      });
    }

    if (!canCancelFree) {
      toast({
        title: "Mentoria cancelada",
        description: "Como você já usou seu cancelamento gratuito, esta sessão foi descontada do seu plano.",
        variant: "default",
      });
    } else {
      toast({
        title: "Mentoria cancelada",
        description: "A sessão foi cancelada com sucesso.",
      });
    }

    setLoading(false);
    await fetchCancellationInfo();
    onSuccess?.();
    return { success: true, countedTowardsLimit: !canCancelFree };
  };

  // Reschedule a session
  const rescheduleSession = async (
    sessionId: string,
    mentorId: string,
    newScheduledAt: Date,
    meetingUrl?: string
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado.",
        variant: "destructive",
      });
      return false;
    }

    // Validate new time
    const validation = validateBooking(newScheduledAt);
    if (!validation.valid) {
      toast({
        title: "Não foi possível reagendar",
        description: validation.message,
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);

    // Check slot availability (excluding current session)
    const isAvailable = await checkSlotAvailability(mentorId, newScheduledAt, sessionId);
    if (!isAvailable) {
      toast({
        title: "Horário indisponível",
        description: "Este horário já foi reservado. Escolha outro horário.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }

    // Update the session with new time
    const { error } = await supabase
      .from("mentoring_sessions")
      .update({
        scheduled_at: newScheduledAt.toISOString(),
        meeting_url: meetingUrl || null,
        rescheduled_from: sessionId,
      })
      .eq("id", sessionId);

    if (error) {
      console.error("Error rescheduling session:", error);
      toast({
        title: "Erro ao reagendar",
        description: "Não foi possível reagendar a mentoria.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }

    toast({
      title: "Mentoria reagendada!",
      description: "O novo horário foi confirmado.",
    });

    setLoading(false);
    onSuccess?.();
    return true;
  };

  return {
    loading,
    cancellationInfo,
    fetchCancellationInfo,
    fetchBookedSlots,
    checkSlotAvailability,
    validateBooking,
    bookSession,
    cancelSession,
    rescheduleSession,
    minAdvanceHours: MIN_ADVANCE_HOURS,
  };
}
