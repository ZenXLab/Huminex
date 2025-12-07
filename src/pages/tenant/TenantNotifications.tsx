import React, { useState } from "react";
import { 
  Bell, 
  BellOff,
  CheckCircle2, 
  AlertTriangle,
  Info,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  Settings,
  Check,
  Trash2,
  MoreHorizontal,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "message";
  category: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "success",
    category: "approval",
    title: "Leave Request Approved",
    description: "Your leave request for Jan 20-24 has been approved by John Smith.",
    timestamp: "2 hours ago",
    isRead: false,
    actionUrl: "/tenant/requests",
    actionLabel: "View Request"
  },
  {
    id: "2",
    type: "warning",
    category: "compliance",
    title: "Document Expiring Soon",
    description: "Your Professional Certification expires in 15 days. Please renew it.",
    timestamp: "5 hours ago",
    isRead: false,
    actionUrl: "/tenant/documents",
    actionLabel: "Update Document"
  },
  {
    id: "3",
    type: "info",
    category: "system",
    title: "New Feature Available",
    description: "Proxima AI insights are now available in your dashboard. Try it out!",
    timestamp: "1 day ago",
    isRead: false,
    actionUrl: "/tenant/intelligence",
    actionLabel: "Explore"
  },
  {
    id: "4",
    type: "message",
    category: "communication",
    title: "New Comment on Project",
    description: "Sarah commented on 'Q1 Planning' project: 'Great progress on the milestones!'",
    timestamp: "1 day ago",
    isRead: true,
    actionUrl: "/tenant/projects",
    actionLabel: "View Comment"
  },
  {
    id: "5",
    type: "info",
    category: "payroll",
    title: "Payslip Available",
    description: "Your January 2024 payslip is now available for download.",
    timestamp: "2 days ago",
    isRead: true,
    actionUrl: "/tenant/payroll",
    actionLabel: "Download"
  },
  {
    id: "6",
    type: "success",
    category: "onboarding",
    title: "New Team Member",
    description: "Alex Johnson has joined the Engineering team. Welcome them!",
    timestamp: "3 days ago",
    isRead: true,
    actionUrl: "/tenant/workforce",
    actionLabel: "View Profile"
  },
  {
    id: "7",
    type: "warning",
    category: "attendance",
    title: "Missing Clock-out",
    description: "You forgot to clock out yesterday. Please regularize your attendance.",
    timestamp: "3 days ago",
    isRead: true,
    actionUrl: "/tenant/attendance",
    actionLabel: "Regularize"
  }
];

const categories = [
  { id: "all", label: "All", icon: Bell },
  { id: "approval", label: "Approvals", icon: CheckCircle2 },
  { id: "compliance", label: "Compliance", icon: FileText },
  { id: "communication", label: "Messages", icon: MessageSquare },
  { id: "system", label: "System", icon: Settings }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="w-5 h-5 text-[#0FB07A]" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-[#FFB020]" />;
    case "info":
      return <Info className="w-5 h-5 text-[#005EEB]" />;
    case "message":
      return <MessageSquare className="w-5 h-5 text-[#8B5CF6]" />;
    default:
      return <Bell className="w-5 h-5 text-[#6B7280]" />;
  }
};

const getTypeBg = (type: string) => {
  switch (type) {
    case "success":
      return "bg-[#0FB07A]/10";
    case "warning":
      return "bg-[#FFB020]/10";
    case "info":
      return "bg-[#005EEB]/10";
    case "message":
      return "bg-[#8B5CF6]/10";
    default:
      return "bg-[#F7F9FC]";
  }
};

const TenantNotifications: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [notificationList, setNotificationList] = useState(notifications);

  const unreadCount = notificationList.filter(n => !n.isRead).length;
  
  const filteredNotifications = activeCategory === "all" 
    ? notificationList 
    : notificationList.filter(n => n.category === activeCategory);

  const markAsRead = (id: string) => {
    setNotificationList(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Notifications</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Stay updated with your workspace activities
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-[#E23E57] text-white">{unreadCount} new</Badge>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead} className="gap-2 border-gray-200">
            <Check className="w-4 h-4" />
            Mark all as read
          </Button>
          <Button variant="outline" className="gap-2 border-gray-200">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-5 h-5 text-[#005EEB]" />
            <span className="text-xs text-[#6B7280]">Total</span>
          </div>
          <div className="text-2xl font-bold text-[#0F1E3A]">{notificationList.length}</div>
          <div className="text-sm text-[#6B7280]">All Notifications</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <BellOff className="w-5 h-5 text-[#E23E57]" />
            <span className="text-xs text-[#6B7280]">Pending</span>
          </div>
          <div className="text-2xl font-bold text-[#0F1E3A]">{unreadCount}</div>
          <div className="text-sm text-[#6B7280]">Unread</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-[#FFB020]" />
            <span className="text-xs text-[#6B7280]">Alerts</span>
          </div>
          <div className="text-2xl font-bold text-[#0F1E3A]">
            {notificationList.filter(n => n.type === "warning").length}
          </div>
          <div className="text-sm text-[#6B7280]">Require Attention</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-[#0FB07A]" />
            <span className="text-xs text-[#6B7280]">Completed</span>
          </div>
          <div className="text-2xl font-bold text-[#0F1E3A]">
            {notificationList.filter(n => n.isRead).length}
          </div>
          <div className="text-sm text-[#6B7280]">Read</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#005EEB] text-white"
                    : "text-[#6B7280] hover:bg-[#F7F9FC]"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F7F9FC] mx-auto mb-4 flex items-center justify-center">
                <Bell className="w-8 h-8 text-[#6B7280]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F1E3A] mb-2">No notifications</h3>
              <p className="text-[#6B7280]">You're all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-[#F7F9FC]/50 transition-colors ${
                  !notification.isRead ? "bg-[#005EEB]/[0.02]" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${getTypeBg(notification.type)} flex items-center justify-center flex-shrink-0`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-semibold ${!notification.isRead ? "text-[#0F1E3A]" : "text-[#6B7280]"}`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#005EEB]" />
                          )}
                        </div>
                        <p className="text-sm text-[#6B7280] mt-1">{notification.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs text-[#9CA3AF]">{notification.timestamp}</span>
                          {notification.actionUrl && (
                            <button className="text-xs font-medium text-[#005EEB] hover:text-[#0047B3] transition-colors">
                              {notification.actionLabel} →
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0 text-[#6B7280] hover:text-[#005EEB]"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 p-0 text-[#6B7280] hover:text-[#E23E57]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantNotifications;
