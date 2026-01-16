import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCallback } from "react";
import { useCelebration } from "@/components/ui/celebration";

interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  streak_started_at: string | null;
}

interface StreakUpdateResult {
  current_streak: number;
  longest_streak: number;
  streak_broken: boolean;
  is_new_record: boolean;
}

export function useStreak() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { celebrate } = useCelebration();

  // Fetch current streak
  const { data: streak, isLoading } = useQuery({
    queryKey: ["user-streak", user?.id],
    queryFn: async (): Promise<UserStreak | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("user_streaks")
        .select("current_streak, longest_streak, last_activity_date, streak_started_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching streak:", error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 60000,
  });

  // Update streak mutation
  const updateStreakMutation = useMutation({
    mutationFn: async (): Promise<StreakUpdateResult | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase.rpc("update_user_streak", {
        p_user_id: user.id,
      });

      if (error) {
        console.error("Error updating streak:", error);
        throw error;
      }

      return data?.[0] || null;
    },
    onSuccess: (result) => {
      if (result) {
        // Invalidate streak query
        queryClient.invalidateQueries({ queryKey: ["user-streak", user?.id] });

        // Celebrate milestones
        if (result.is_new_record && result.current_streak >= 3) {
          celebrate("streak", {
            title: `🔥 ${result.current_streak} dias seguidos!`,
            subtitle: "Novo recorde pessoal!",
            xp: result.current_streak * 5,
          });
        } else if (result.current_streak === 7) {
          celebrate("streak", {
            title: "🔥 1 semana de streak!",
            subtitle: "Consistência é o segredo do sucesso",
            xp: 50,
          });
        } else if (result.current_streak === 30) {
          celebrate("streak", {
            title: "🔥 1 mês de streak!",
            subtitle: "Você é imparável!",
            xp: 200,
          });
        }
      }
    },
  });

  // Log activity (call this when user completes any action)
  const logActivity = useCallback(() => {
    if (user?.id) {
      updateStreakMutation.mutate();
    }
  }, [user?.id, updateStreakMutation]);

  // Calculate streak status
  const getStreakStatus = useCallback(() => {
    if (!streak) return { isActive: false, daysUntilLoss: 0 };

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const isActiveToday = streak.last_activity_date === today;
    const wasActiveYesterday = streak.last_activity_date === yesterday;

    return {
      isActive: isActiveToday,
      needsActivity: !isActiveToday && wasActiveYesterday,
      streakAtRisk: !isActiveToday && wasActiveYesterday,
      daysUntilLoss: isActiveToday ? 1 : wasActiveYesterday ? 0 : -1,
    };
  }, [streak]);

  return {
    streak,
    loading: isLoading,
    logActivity,
    getStreakStatus,
    isUpdating: updateStreakMutation.isPending,
  };
}
