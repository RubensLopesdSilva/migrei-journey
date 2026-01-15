import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useMentorStatus() {
  const { user } = useAuth();
  const [isMentor, setIsMentor] = useState(false);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkMentorStatus = useCallback(async () => {
    if (!user) {
      setIsMentor(false);
      setMentorId(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("mentors")
        .select("id, is_active")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Error checking mentor status:", error);
        setIsMentor(false);
        setMentorId(null);
      } else if (data) {
        setIsMentor(true);
        setMentorId(data.id);
      } else {
        setIsMentor(false);
        setMentorId(null);
      }
    } catch (err) {
      console.error("Error:", err);
      setIsMentor(false);
      setMentorId(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkMentorStatus();
  }, [checkMentorStatus]);

  return {
    isMentor,
    mentorId,
    loading,
    refetch: checkMentorStatus,
  };
}
