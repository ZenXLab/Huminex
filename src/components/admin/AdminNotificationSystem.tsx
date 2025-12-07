import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, Send, Mail, MessageSquare, AlertTriangle, 
  CheckCircle, XCircle, Clock, Filter, Plus, Trash2,
  Settings, Eye, Users, Globe, Smartphone, RefreshCw,
  Volume2, VolumeX, BellRing, Archive, BellOff,
  Shield, CreditCard, FolderOpen, UserPlus, Cog, Search
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useNotificationSound } from "@/hooks/useNotificationSound";

// Types
interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  target_admin_id: string | null;
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
}

// Notification Categories for filtering
const NOTIFICATION_CATEGORIES = [
  { id: "all", label: "All", icon: Bell, color: "text-foreground" },
  { id: "system", label: "System", icon: Cog, color: "text-blue-500" },
  { id: "security", label: "Security", icon: Shield, color: "text-red-500" },
  { id: "billing", label: "Billing", icon: CreditCard, color: "text-green-500" },
  { id: "users", label: "Users", icon: Users, color: "text-purple-500" },
  { id: "projects", label: "Projects", icon: FolderOpen, color: "text-orange-500" },
  { id: "onboarding", label: "Onboarding", icon: UserPlus, color: "text-cyan-500" },
] as const;

// Map notification types to categories
const TYPE_TO_CATEGORY: Record<string, string> = {
  info: "system",
  success: "system",
  warning: "system",
  error: "system",
  security: "security",
  billing: "billing",
  payment: "billing",
  invoice: "billing",
  user: "users",
  onboarding: "onboarding",
  project: "projects",
  feature: "system",
};

// Mock templates
const notificationTemplates: NotificationTemplate[] = [
  { id: "1", name: "Welcome Email", subject: "Welcome to ATLAS!", body: "Thank you for joining ATLAS. Your account is now active.", type: "email" },
  { id: "2", name: "Invoice Reminder", subject: "Invoice Due Reminder", body: "Your invoice #{{invoice_number}} is due in {{days}} days.", type: "email" },
  { id: "3", name: "Feature Unlock", subject: "New Feature Unlocked!", body: "Congratulations! {{feature_name}} is now available in your dashboard.", type: "push" },
  { id: "4", name: "Security Alert", subject: "Security Alert", body: "A new login was detected from {{location}} at {{time}}.", type: "both" },
];

export const AdminNotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    category: "system",
    sendEmail: false,
    sendPush: true,
    targetAll: true,
    targetUsers: [] as string[]
  });
  const [readFilter, setReadFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Push notification hook
  const {
    isSupported: pushSupported,
    permission: pushPermission,
    isSubscribed,
    subscribe: subscribePush,
    unsubscribe: unsubscribePush,
    showLocalNotification,
    isLoading: pushLoading
  } = usePushNotifications();

  // Sound hook
  const { playDefaultSound, playSuccessSound } = useNotificationSound({ 
    volume: 0.5, 
    enabled: soundEnabled 
  });

  // Handle new notification with sound and desktop alert
  const handleNewNotification = useCallback(async (notification: any) => {
    // Play notification sound
    if (soundEnabled) {
      playDefaultSound();
    }

    // Show toast notification
    toast.info(notification.title, {
      description: notification.message,
    });

    // Show desktop notification if push is enabled and subscribed
    if (pushEnabled && isSubscribed && pushPermission === 'granted') {
      await showLocalNotification(notification.title, {
        body: notification.message,
        tag: `admin-notification-${notification.id}`,
        requireInteraction: notification.notification_type === 'error' || notification.notification_type === 'warning'
      });
    }
  }, [soundEnabled, pushEnabled, isSubscribed, pushPermission, playDefaultSound, showLocalNotification]);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_notifications'
        },
        (payload) => {
          console.log('Real-time notification update:', payload);
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as Notification, ...prev]);
            handleNewNotification(payload.new);
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => prev.map(n => 
              n.id === payload.new.id ? payload.new as Notification : n
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [handleNewNotification]);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } else {
      setNotifications(data || []);
    }
    setLoading(false);
  };

  // Handle push subscription toggle
  const handlePushToggle = async () => {
    if (isSubscribed) {
      await unsubscribePush();
      toast.success('Push notifications unsubscribed');
    } else {
      await subscribePush();
      if (pushPermission === 'granted') {
        toast.success('Push notifications enabled');
      }
    }
  };

  const createNotification = async () => {
    const { data, error } = await supabase
      .from('admin_notifications')
      .insert({
        title: newNotification.title,
        message: newNotification.message,
        notification_type: newNotification.type,
        is_read: false,
        target_admin_id: null
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create notification');
      console.error(error);
    } else {
      toast.success('Notification created');
      setIsCreateOpen(false);
      setNewNotification({
        title: "",
        message: "",
        type: "info",
        category: "system",
        sendEmail: false,
        sendPush: true,
        targetAll: true,
        targetUsers: []
      });

      // If email is enabled, send email notification
      if (newNotification.sendEmail && emailEnabled) {
        sendEmailNotification(newNotification.title, newNotification.message);
      }
    }
  };

  const sendEmailNotification = async (subject: string, body: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-welcome-email', {
        body: { 
          email: 'admin@cropxon.com',
          name: 'Admin',
          subject,
          message: body
        }
      });

      if (error) {
        console.error('Email send error:', error);
      } else {
        toast.success('Email notification sent');
      }
    } catch (e) {
      console.error('Failed to send email:', e);
    }
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    }
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from('admin_notifications')
      .delete()
      .eq('id', id);

    if (!error) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    }
  };

  const clearAllNotifications = async () => {
    const { error } = await supabase
      .from('admin_notifications')
      .delete()
      .neq('id', '');

    if (!error) {
      setNotifications([]);
      toast.success('All notifications cleared');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/10 text-green-500';
      case 'warning': return 'bg-yellow-500/10 text-yellow-500';
      case 'error': return 'bg-red-500/10 text-red-500';
      default: return 'bg-blue-500/10 text-blue-500';
    }
  };

  // Get category for a notification type
  const getNotificationCategory = (type: string): string => {
    return TYPE_TO_CATEGORY[type] || "system";
  };

  // Filter notifications by read status, category, and search
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      // Read filter
      if (readFilter === 'unread' && n.is_read) return false;
      if (readFilter === 'read' && !n.is_read) return false;
      
      // Category filter
      if (categoryFilter !== 'all') {
        const notifCategory = getNotificationCategory(n.notification_type);
        if (notifCategory !== categoryFilter) return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(query) || 
               n.message.toLowerCase().includes(query);
      }
      
      return true;
    });
  }, [notifications, readFilter, categoryFilter, searchQuery]);

  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  // Category counts for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: notifications.length };
    NOTIFICATION_CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = notifications.filter(n => 
          getNotificationCategory(n.notification_type) === cat.id
        ).length;
      }
    });
    return counts;
  }, [notifications]);

  // Get category icon component
  const getCategoryIcon = (categoryId: string) => {
    const category = NOTIFICATION_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return Bell;
    return category.icon;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BellRing className="w-8 h-8 text-primary" />
            Notifications & Alerts
          </h1>
          <p className="text-muted-foreground">Manage system notifications and alert preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchNotifications}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Notification</DialogTitle>
                <DialogDescription>Send a notification to admins or users</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                    placeholder="Notification title" 
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea 
                    placeholder="Notification message..."
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newNotification.type} onValueChange={(v) => setNewNotification({ ...newNotification, type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newNotification.category} onValueChange={(v) => setNewNotification({ ...newNotification, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NOTIFICATION_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <span className="flex items-center gap-2">
                              <cat.icon className={`w-4 h-4 ${cat.color}`} />
                              {cat.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Delivery Methods</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="push"
                        checked={newNotification.sendPush}
                        onCheckedChange={(checked) => setNewNotification({ ...newNotification, sendPush: !!checked })}
                      />
                      <Label htmlFor="push" className="flex items-center gap-1">
                        <Smartphone className="w-4 h-4" /> Push
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="email"
                        checked={newNotification.sendEmail}
                        onCheckedChange={(checked) => setNewNotification({ ...newNotification, sendEmail: !!checked })}
                      />
                      <Label htmlFor="email" className="flex items-center gap-1">
                        <Mail className="w-4 h-4" /> Email
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={createNotification} disabled={!newNotification.title || !newNotification.message}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notifications.length}</p>
                <p className="text-sm text-muted-foreground">Total Notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <MessageSquare className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Mail className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{emailEnabled ? 'On' : 'Off'}</p>
                <p className="text-sm text-muted-foreground">Email Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Smartphone className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pushEnabled ? 'On' : 'Off'}</p>
                <p className="text-sm text-muted-foreground">Push Notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-1">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Search and Category Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {NOTIFICATION_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = categoryFilter === cat.id;
                return (
                  <Button
                    key={cat.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`flex items-center gap-1.5 ${isActive ? "" : "hover:bg-muted/50"}`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? "" : cat.color}`} />
                    {cat.label}
                    {categoryCounts[cat.id] > 0 && (
                      <Badge variant={isActive ? "secondary" : "outline"} className="ml-1 text-xs px-1.5 py-0">
                        {categoryCounts[cat.id]}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
            
            {/* Read Status Filters and Actions */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant={readFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setReadFilter('all')}>
                  All
                </Button>
                <Button variant={readFilter === 'unread' ? 'default' : 'outline'} size="sm" onClick={() => setReadFilter('unread')}>
                  Unread ({unreadCount})
                </Button>
                <Button variant={readFilter === 'read' ? 'default' : 'outline'} size="sm" onClick={() => setReadFilter('read')}>
                  Read
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Eye className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
                <Button variant="outline" size="sm" onClick={clearAllNotifications}>
                  <Archive className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {loading ? (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    Loading...
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Bell className="w-8 h-8 mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 hover:bg-muted/50 transition-colors ${!notification.is_read ? 'bg-primary/5' : ''}`}
                      >
                          <div className="flex items-start gap-3">
                          <Badge className={getTypeColor(notification.notification_type)}>
                            {getTypeIcon(notification.notification_type)}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              {!notification.is_read && (
                                <Badge variant="secondary" className="text-xs">New</Badge>
                              )}
                              {/* Category badge */}
                              {(() => {
                                const catId = getNotificationCategory(notification.notification_type);
                                const cat = NOTIFICATION_CATEGORIES.find(c => c.id === catId);
                                if (cat && cat.id !== 'all') {
                                  const CatIcon = cat.icon;
                                  return (
                                    <Badge variant="outline" className={`text-xs ${cat.color}`}>
                                      <CatIcon className="w-3 h-3 mr-1" />
                                      {cat.label}
                                    </Badge>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {new Date(notification.created_at).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {!notification.is_read && (
                              <Button variant="ghost" size="icon" onClick={() => markAsRead(notification.id)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="outline" className="mt-1">{template.type}</Badge>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Subject:</p>
                      <p>{template.subject}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Body:</p>
                      <p className="text-muted-foreground line-clamp-2">{template.body}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Push Notifications Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-primary" />
                  Push Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Browser Status</p>
                    <p className="text-sm text-muted-foreground">
                      {!pushSupported ? 'Not supported' :
                       pushPermission === 'granted' ? 'Enabled' :
                       pushPermission === 'denied' ? 'Blocked' : 'Not set'}
                    </p>
                  </div>
                  <Badge variant={
                    !pushSupported ? 'secondary' :
                    pushPermission === 'granted' ? 'default' :
                    pushPermission === 'denied' ? 'destructive' : 'outline'
                  }>
                    {pushPermission === 'granted' ? 'Active' : 
                     pushPermission === 'denied' ? 'Blocked' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Smartphone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Enable Push</p>
                      <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                    </div>
                  </div>
                  <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Subscription Status</p>
                    <p className="text-sm text-muted-foreground">
                      {isSubscribed ? 'Subscribed to push' : 'Not subscribed'}
                    </p>
                  </div>
                  <Button 
                    variant={isSubscribed ? 'destructive' : 'default'}
                    size="sm"
                    onClick={handlePushToggle}
                    disabled={pushLoading || !pushSupported || pushPermission === 'denied'}
                  >
                    {pushLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> :
                     isSubscribed ? <><BellOff className="w-4 h-4 mr-1" /> Unsubscribe</> :
                     <><Bell className="w-4 h-4 mr-1" /> Subscribe</>}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Other Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Mail className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email alerts</p>
                    </div>
                  </div>
                  <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      {soundEnabled ? <Volume2 className="w-5 h-5 text-purple-500" /> : <VolumeX className="w-5 h-5 text-purple-500" />}
                    </div>
                    <div>
                      <p className="font-medium">Notification Sound</p>
                      <p className="text-sm text-muted-foreground">Play sound for new alerts</p>
                    </div>
                  </div>
                  <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Bell className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">Desktop Toasts</p>
                      <p className="text-sm text-muted-foreground">Show in-app notifications</p>
                    </div>
                  </div>
                  <Switch checked={true} disabled />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Notification */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Test Notifications</p>
                  <p className="text-sm text-muted-foreground">Send a test notification to verify your settings</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={async () => {
                    playSuccessSound();
                    toast.success('Test notification', { description: 'Your notification settings are working!' });
                    if (isSubscribed && pushPermission === 'granted') {
                      await showLocalNotification('Test Notification', {
                        body: 'This is a test push notification from ATLAS Admin',
                        tag: 'test-notification'
                      });
                    }
                  }}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Send Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotificationSystem;
