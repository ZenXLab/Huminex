import { useState } from "react";
import { Bell, X, Check, Sparkles, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "feature_unlock" | "system_update" | "action_required" | "info";
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  isRead: boolean;
  createdAt: Date;
  isNew?: boolean;
}

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "feature_unlock",
    title: "New Feature Unlocked!",
    message: "AI Dashboard is now available in your portal. Explore AI-powered insights!",
    actionUrl: "/portal/ai",
    actionLabel: "Explore Now",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    isNew: true,
  },
  {
    id: "2",
    type: "feature_unlock",
    title: "MSP Monitoring Activated",
    message: "Your admin has enabled MSP Monitoring. Track server health in real-time.",
    actionUrl: "/portal/msp",
    actionLabel: "View Dashboard",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    isNew: true,
  },
  {
    id: "3",
    type: "action_required",
    title: "Invoice Payment Due",
    message: "Invoice INV-2024-0042 is due in 3 days. Please review and process payment.",
    actionUrl: "/portal/invoices",
    actionLabel: "View Invoice",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "4",
    type: "system_update",
    title: "System Maintenance",
    message: "Scheduled maintenance on Dec 10, 2024 from 2:00 AM - 4:00 AM IST.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "5",
    type: "info",
    title: "Welcome to ATLAS Portal",
    message: "Your account is ready. Explore your dashboard and get started.",
    actionUrl: "/portal",
    actionLabel: "Get Started",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "feature_unlock":
      return <Sparkles className="w-4 h-4 text-violet-500" />;
    case "action_required":
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "system_update":
      return <Info className="w-4 h-4 text-blue-500" />;
    default:
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  }
};

const getNotificationBg = (type: Notification["type"], isRead: boolean) => {
  if (isRead) return "bg-muted/30";
  switch (type) {
    case "feature_unlock":
      return "bg-violet-500/5 border-l-2 border-l-violet-500";
    case "action_required":
      return "bg-amber-500/5 border-l-2 border-l-amber-500";
    case "system_update":
      return "bg-blue-500/5 border-l-2 border-l-blue-500";
    default:
      return "bg-green-500/5 border-l-2 border-l-green-500";
  }
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

interface NotificationBellProps {
  userId?: string;
}

export const NotificationBell = ({ userId }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
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

        {/* Notifications List */}
        <ScrollArea className="max-h-[400px]">
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
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
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
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
