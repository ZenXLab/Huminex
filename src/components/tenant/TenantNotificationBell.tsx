import { useState, useEffect, useCallback } from "react";
import { Bell, X, Check, Sparkles, AlertTriangle, Info, CheckCircle2, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface TenantNotification {
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
}

// Mock notifications for demo until database is connected
const mockTenantNotifications: TenantNotification[] = [
  {
    id: "t1",
    type: "feature_unlock",
    title: "OpZenix Automations Unlocked!",
    message: "ATLAS Admin has enabled workflow automations for your organization.",
    actionUrl: "/tenant/opzenix",
    actionLabel: "Configure Workflows",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    isNew: true,
    priority: "high",
  },
  {
    id: "t2",
    type: "security_alert",
    title: "New SSO Configuration Required",
    message: "Complete your Microsoft Entra ID setup to enable single sign-on.",
    actionUrl: "/tenant/settings/integrations",
    actionLabel: "Setup SSO",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    priority: "urgent",
  },
  {
    id: "t3",
    type: "action_required",
    title: "Compliance Calendar Review",
    message: "3 compliance tasks are due this week. Review and assign team members.",
    actionUrl: "/tenant/compliance",
    actionLabel: "Review Tasks",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    priority: "high",
  },
  {
    id: "t4",
    type: "system_update",
    title: "Payroll Module Updated",
    message: "New features added: Multi-currency support, Advanced tax calculations.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    priority: "normal",
  },
  {
    id: "t5",
    type: "info",
    title: "Proxima AI Insights Ready",
    message: "Your first AI-powered workforce report is ready for review.",
    actionUrl: "/tenant/proxima-ai",
    actionLabel: "View Report",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    priority: "normal",
  },
];

const getNotificationIcon = (type: TenantNotification["type"]) => {
  switch (type) {
    case "feature_unlock":
      return <Sparkles className="w-4 h-4 text-violet-500" />;
    case "action_required":
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "system_update":
      return <Info className="w-4 h-4 text-blue-500" />;
    case "security_alert":
      return <Shield className="w-4 h-4 text-red-500" />;
    default:
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  }
};

const getNotificationBg = (type: TenantNotification["type"], isRead: boolean) => {
  if (isRead) return "bg-muted/30";
  switch (type) {
    case "feature_unlock":
      return "bg-violet-500/5 border-l-2 border-l-violet-500";
    case "action_required":
      return "bg-amber-500/5 border-l-2 border-l-amber-500";
    case "system_update":
      return "bg-blue-500/5 border-l-2 border-l-blue-500";
    case "security_alert":
      return "bg-red-500/5 border-l-2 border-l-red-500";
    default:
      return "bg-green-500/5 border-l-2 border-l-green-500";
  }
};

const getPriorityBadge = (priority?: TenantNotification["priority"]) => {
  if (!priority || priority === "normal" || priority === "low") return null;
  
  if (priority === "urgent") {
    return <Badge className="text-[10px] px-1.5 py-0 bg-red-500 text-white">URGENT</Badge>;
  }
  if (priority === "high") {
    return <Badge className="text-[10px] px-1.5 py-0 bg-amber-500 text-white">HIGH</Badge>;
  }
  return null;
};

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const TenantNotificationBell = () => {
  const [notifications, setNotifications] = useState<TenantNotification[]>(mockTenantNotifications);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const urgentCount = notifications.filter((n) => !n.isRead && (n.priority === "urgent" || n.priority === "high")).length;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch from database when connected
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        // Query admin_notifications or a tenant-specific table
        const { data } = await supabase
          .from("admin_notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20);

        if (data && data.length > 0) {
          const mappedNotifications: TenantNotification[] = data.map((n) => ({
            id: n.id,
            type: n.notification_type as TenantNotification["type"],
            title: n.title,
            message: n.message,
            isRead: n.is_read,
            createdAt: new Date(n.created_at),
            isNew: !n.is_read,
          }));
          setNotifications(mappedNotifications);
        }
      }
    } catch (error) {
      console.error("Error fetching tenant notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("tenant-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "admin_notifications",
        },
        (payload) => {
          const newNotification: TenantNotification = {
            id: payload.new.id,
            type: payload.new.notification_type as TenantNotification["type"],
            title: payload.new.title,
            message: payload.new.message,
            isRead: false,
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

  const markAsRead = async (id: string) => {
    try {
      await supabase.from("admin_notifications").update({ is_read: true }).eq("id", id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, isNew: false } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, isNew: false } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
      if (unreadIds.length > 0) {
        await supabase.from("admin_notifications").update({ is_read: true }).in("id", unreadIds);
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, isNew: false })));
    } catch (error) {
      console.error("Error marking all as read:", error);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, isNew: false })));
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className={cn(
              "absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center",
              urgentCount > 0 ? "bg-red-500 text-white animate-pulse" : "bg-primary text-primary-foreground"
            )}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[420px] p-0" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={fetchNotifications}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary hover:text-primary/80"
                onClick={markAllAsRead}
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-[450px]">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/20 transition-colors cursor-pointer relative group",
                    getNotificationBg(notification.type, notification.isRead)
                  )}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.actionUrl) {
                      setOpen(false);
                      window.location.href = notification.actionUrl;
                    }
                  }}
                >
                  {/* Delete button */}
                  <button
                    className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>

                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <p className={cn(
                          "text-sm font-medium",
                          notification.isRead ? "text-muted-foreground" : "text-foreground"
                        )}>
                          {notification.title}
                        </p>
                        {notification.isNew && !notification.isRead && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-violet-500 text-white">
                            NEW
                          </Badge>
                        )}
                        {getPriorityBadge(notification.priority)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-muted-foreground">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {notification.actionLabel && (
                          <span className="text-xs text-primary font-medium">
                            {notification.actionLabel} →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border/60 bg-muted/20">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs text-muted-foreground"
            onClick={() => {
              setOpen(false);
              window.location.href = "/tenant/notifications";
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
