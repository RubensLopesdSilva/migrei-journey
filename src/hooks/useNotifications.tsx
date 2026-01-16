import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async (): Promise<Notification[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("community_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching notifications:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30000,
    refetchInterval: 60000, // Refetch every minute
  });

  // Count unread
  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("community_notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;

      const { error } = await supabase
        .from("community_notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  // Create notification (for internal use)
  const createNotification = async (
    title: string,
    message: string,
    type: string,
    referenceId?: string,
    referenceType?: string
  ) => {
    if (!user?.id) return;

    const { error } = await supabase.from("community_notifications").insert({
      user_id: user.id,
      title,
      message,
      type,
      reference_id: referenceId || null,
      reference_type: referenceType || null,
    });

    if (error) {
      console.error("Error creating notification:", error);
    } else {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    }
  };

  return {
    notifications,
    unreadCount,
    loading: isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    createNotification,
  };
}
