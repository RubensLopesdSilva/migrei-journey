import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useMentoringBooking } from "@/hooks/useMentoringBooking";

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
  cancelled_at?: string | null;
  rescheduled_from?: string | null;
  counts_towards_limit?: boolean;
  mentor?: Mentor;
}

export function useMentoring() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mySessions, setMySessions] = useState<MentoringSession[]>([]);
  const [monthlySessionCount, setMonthlySessionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Use the new subscription system
  const {
    isSubscribed,
    planSlug,
    planName,
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

  // Refetch function
  const refetchSessions = useCallback(async () => {
    await Promise.all([
      fetchMySessions(),
      fetchMonthlyCount(),
    ]);
  }, []);

  // Use the booking hook with all the booking logic
  const bookingHook = useMentoringBooking(sessionLimit, monthlySessionCount, refetchSessions);

  const fetchMentors = useCallback(async () => {
    // Fetch mentors with their availability - only show mentors who have availability slots configured
    const { data: mentorsData, error: mentorsError } = await supabase
      .from("mentors")
      .select("*")
      .eq("is_active", true);

    if (mentorsError) {
      console.error("Error fetching mentors:", mentorsError);
      return;
    }

    if (!mentorsData || mentorsData.length === 0) {
      setMentors([]);
      return;
    }

    // Fetch availability for all mentors
    const { data: availabilityData, error: availabilityError } = await supabase
      .from("mentor_availability")
      .select("mentor_id")
      .eq("is_available", true);

    if (availabilityError) {
      console.error("Error fetching availability:", availabilityError);
      setMentors([]);
      return;
    }

    // Get unique mentor IDs that have availability
    const mentorIdsWithAvailability = new Set(
      (availabilityData || []).map((a) => a.mentor_id)
    );

    // Filter mentors to only include those with availability
    const mentorsWithAvailability = mentorsData.filter((mentor) =>
      mentorIdsWithAvailability.has(mentor.id)
    );

    setMentors(mentorsWithAvailability);
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMentors(),
        fetchMySessions(),
        fetchMonthlyCount(),
        bookingHook.fetchCancellationInfo(),
      ]);
      setLoading(false);
    };

    if (user) {
      loadData();
    } else {
      // Still fetch mentors for non-logged users
      fetchMentors().then(() => setLoading(false));
    }
  }, [user, fetchMentors, fetchMySessions, fetchMonthlyCount, bookingHook.fetchCancellationInfo]);

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
    // Mentor availability
    fetchMentorAvailability,
    // Booking functions from the booking hook
    fetchBookedSlots: bookingHook.fetchBookedSlots,
    bookSession: bookingHook.bookSession,
    cancelSession: bookingHook.cancelSession,
    rescheduleSession: bookingHook.rescheduleSession,
    cancellationInfo: bookingHook.cancellationInfo,
    minAdvanceHours: bookingHook.minAdvanceHours,
    // Refetch
    refetch: async () => {
      await Promise.all([
        fetchMentors(),
        fetchMySessions(),
        fetchMonthlyCount(),
        bookingHook.fetchCancellationInfo(),
      ]);
    },
  };
}
