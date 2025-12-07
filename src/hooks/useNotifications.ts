import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  type: "feature_unlock" | "system_update" | "action_required" | "info" | "security_alert";
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  isRead: boolean;
  createdAt: Date;
  isNew?: boolean;
  priority?: "low" | "normal" | "high" | "urgent";
  featureId?: string;
}

interface UseNotificationsOptions {
  userId?: string;
  tenantId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { autoRefresh = true, refreshInterval = 30000 } = options;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      // For now, we'll use admin_notifications table since employee_notifications 
      // table is in the docs schema. This can be updated when schema is migrated.
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      const userId = session.session.user.id;

      // Query admin_notifications for now (can be switched to employee_notifications later)
      const { data, error: fetchError } = await supabase
        .from("admin_notifications")
        .select("*")
        .or(`target_admin_id.eq.${userId},target_admin_id.is.null`)
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) {
        console.error("Error fetching notifications:", fetchError);
        // If table doesn't exist or RLS blocks, use empty array
        setNotifications([]);
      } else {
        const mappedNotifications: Notification[] = (data || []).map((n) => ({
          id: n.id,
          type: mapNotificationType(n.notification_type),
          title: n.title,
          message: n.message,
          isRead: n.is_read,
          createdAt: new Date(n.created_at),
          isNew: !n.is_read && isWithinDays(n.created_at, 1),
        }));
        setNotifications(mappedNotifications);
      }
    } catch (err) {
      console.error("Notification fetch error:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const mapNotificationType = (type: string): Notification["type"] => {
    const typeMap: Record<string, Notification["type"]> = {
      feature_unlock: "feature_unlock",
      system: "system_update",
      action: "action_required",
      security: "security_alert",
      info: "info",
    };
    return typeMap[type] || "info";
  };

  const isWithinDays = (dateStr: string, days: number): boolean => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= days;
  };

  const markAsRead = useCallback(async (id: string) => {
    try {
      await supabase
        .from("admin_notifications")
        .update({ is_read: true })
        .eq("id", id);
      
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, isNew: false } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
      
      if (unreadIds.length > 0) {
        await supabase
          .from("admin_notifications")
          .update({ is_read: true })
          .in("id", unreadIds);
      }
      
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, isNew: false }))
      );
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  }, [notifications]);

  const deleteNotification = useCallback(async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchNotifications, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchNotifications]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "admin_notifications",
        },
        (payload) => {
          const newNotification: Notification = {
            id: payload.new.id,
            type: mapNotificationType(payload.new.notification_type),
            title: payload.new.title,
            message: payload.new.message,
            isRead: payload.new.is_read,
            createdAt: new Date(payload.new.created_at),
            isNew: true,
          };
          setNotifications((prev) => [newNotification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications,
  };
};
