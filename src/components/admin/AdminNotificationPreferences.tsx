import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, Mail, Smartphone, Volume2, VolumeX, Save, RefreshCw,
  UserPlus, ShoppingCart, AlertTriangle, FileText, CreditCard,
  Shield, Server, MessageSquare, Calendar, Users, CheckCircle,
  Settings, BellRing, BellOff, Zap
} from "lucide-react";
import { toast } from "sonner";
import { usePushNotifications } from "@/hooks/usePushNotifications";

// Event types that can trigger notifications
interface NotificationEvent {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  emailDefault: boolean;
  pushDefault: boolean;
}

const notificationEvents: NotificationEvent[] = [
  // User & Account Events
  { id: "new_user_signup", name: "New User Signup", description: "When a new user creates an account", category: "Users", icon: <UserPlus className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  { id: "user_verification", name: "User Verification", description: "When a user verifies their email", category: "Users", icon: <CheckCircle className="w-4 h-4" />, emailDefault: false, pushDefault: true },
  { id: "password_reset", name: "Password Reset Request", description: "When a user requests password reset", category: "Users", icon: <Shield className="w-4 h-4" />, emailDefault: true, pushDefault: false },
  
  // Quote & Sales Events
  { id: "new_quote", name: "New Quote Request", description: "When a new quote is generated", category: "Sales", icon: <FileText className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  { id: "quote_approved", name: "Quote Approved", description: "When a quote is approved by client", category: "Sales", icon: <CheckCircle className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  { id: "quote_rejected", name: "Quote Rejected", description: "When a quote is rejected", category: "Sales", icon: <AlertTriangle className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  
  // Billing Events
  { id: "new_invoice", name: "New Invoice", description: "When a new invoice is created", category: "Billing", icon: <CreditCard className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  { id: "payment_received", name: "Payment Received", description: "When a payment is received", category: "Billing", icon: <CreditCard className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  { id: "payment_overdue", name: "Payment Overdue", description: "When a payment becomes overdue", category: "Billing", icon: <AlertTriangle className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  
  // Support Events
  { id: "new_ticket", name: "New Support Ticket", description: "When a new support ticket is created", category: "Support", icon: <MessageSquare className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  { id: "ticket_reply", name: "Ticket Reply", description: "When a client replies to a ticket", category: "Support", icon: <MessageSquare className="w-4 h-4" />, emailDefault: false, pushDefault: true },
  { id: "ticket_escalated", name: "Ticket Escalated", description: "When a ticket is escalated", category: "Support", icon: <AlertTriangle className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  
  // System Events
  { id: "server_alert", name: "Server Alert", description: "When a server issue is detected", category: "System", icon: <Server className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  { id: "security_alert", name: "Security Alert", description: "When a security issue is detected", category: "System", icon: <Shield className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  { id: "system_update", name: "System Update", description: "When the system is updated", category: "System", icon: <RefreshCw className="w-4 h-4" />, emailDefault: false, pushDefault: false },
  
  // Calendar Events
  { id: "meeting_reminder", name: "Meeting Reminder", description: "Reminder for upcoming meetings", category: "Calendar", icon: <Calendar className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  { id: "meeting_cancelled", name: "Meeting Cancelled", description: "When a meeting is cancelled", category: "Calendar", icon: <Calendar className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  
  // Tenant Events
  { id: "new_tenant", name: "New Tenant", description: "When a new tenant is onboarded", category: "Tenants", icon: <Users className="w-4 h-4" />, emailDefault: true, pushDefault: true },
  { id: "tenant_upgrade", name: "Tenant Upgrade", description: "When a tenant upgrades their plan", category: "Tenants", icon: <Zap className="w-4 h-4" />, emailDefault: true, pushDefault: true },
];

interface EventPreference {
  eventId: string;
  email: boolean;
  push: boolean;
  sound: boolean;
}

export const AdminNotificationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<Record<string, EventPreference>>({});
  const [globalPush, setGlobalPush] = useState(true);
  const [globalEmail, setGlobalEmail] = useState(true);
  const [globalSound, setGlobalSound] = useState(true);
  const [desktopAlerts, setDesktopAlerts] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading: pushLoading,
    subscribe,
    unsubscribe,
    requestPermission,
    showLocalNotification
  } = usePushNotifications();

  // Initialize preferences with defaults
  useEffect(() => {
    const initialPrefs: Record<string, EventPreference> = {};
    notificationEvents.forEach(event => {
      initialPrefs[event.id] = {
        eventId: event.id,
        email: event.emailDefault,
        push: event.pushDefault,
        sound: event.pushDefault
      };
    });
    setPreferences(initialPrefs);
  }, []);

  const handleEventToggle = (eventId: string, field: 'email' | 'push' | 'sound', value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value
      }
    }));
  };

  const handleEnableAll = (field: 'email' | 'push') => {
    const newPrefs = { ...preferences };
    Object.keys(newPrefs).forEach(key => {
      newPrefs[key][field] = true;
    });
    setPreferences(newPrefs);
  };

  const handleDisableAll = (field: 'email' | 'push') => {
    const newPrefs = { ...preferences };
    Object.keys(newPrefs).forEach(key => {
      newPrefs[key][field] = false;
    });
    setPreferences(newPrefs);
  };

  const savePreferences = async () => {
    setSaving(true);
    // Simulate save - in production, this would save to Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Notification preferences saved');
    setSaving(false);
  };

  const handleTestNotification = async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }
    
    await showLocalNotification('Test Notification', {
      body: 'This is a test notification from ATLAS Admin',
      tag: 'test-notification',
      requireInteraction: false
    });
    
    toast.success('Test notification sent');
  };

  const handlePushSubscription = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  const categories = Array.from(new Set(notificationEvents.map(e => e.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            Notification Preferences
          </h1>
          <p className="text-muted-foreground">Configure which events trigger notifications and how you receive them</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleTestNotification} disabled={!isSupported}>
            <Bell className="w-4 h-4 mr-2" />
            Test Notification
          </Button>
          <Button onClick={savePreferences} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Global Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-primary" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Receive browser push notifications for real-time alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Browser Status</p>
                <p className="text-sm text-muted-foreground">
                  {!isSupported ? 'Not supported in this browser' :
                   permission === 'granted' ? 'Notifications enabled' :
                   permission === 'denied' ? 'Notifications blocked' :
                   'Click to enable'}
                </p>
              </div>
              <Badge variant={
                !isSupported ? 'secondary' :
                permission === 'granted' ? 'default' :
                permission === 'denied' ? 'destructive' : 'outline'
              }>
                {!isSupported ? 'Unsupported' :
                 permission === 'granted' ? 'Enabled' :
                 permission === 'denied' ? 'Blocked' : 'Not Set'}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Subscription</p>
                <p className="text-sm text-muted-foreground">
                  {isSubscribed ? 'Subscribed to push notifications' : 'Not subscribed'}
                </p>
              </div>
              <Button 
                variant={isSubscribed ? 'destructive' : 'default'}
                size="sm"
                onClick={handlePushSubscription}
                disabled={pushLoading || !isSupported || permission === 'denied'}
              >
                {pushLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> :
                 isSubscribed ? <><BellOff className="w-4 h-4 mr-2" /> Unsubscribe</> :
                 <><Bell className="w-4 h-4 mr-2" /> Subscribe</>}
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Enable All Push</p>
                  <p className="text-sm text-muted-foreground">Master toggle for push notifications</p>
                </div>
              </div>
              <Switch checked={globalPush} onCheckedChange={setGlobalPush} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-500" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Receive email alerts for important events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Enable All Emails</p>
                  <p className="text-sm text-muted-foreground">Master toggle for email notifications</p>
                </div>
              </div>
              <Switch checked={globalEmail} onCheckedChange={setGlobalEmail} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {globalSound ? <Volume2 className="w-5 h-5 text-muted-foreground" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
                <div>
                  <p className="font-medium">Notification Sounds</p>
                  <p className="text-sm text-muted-foreground">Play sound for new notifications</p>
                </div>
              </div>
              <Switch checked={globalSound} onCheckedChange={setGlobalSound} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Desktop Alerts</p>
                  <p className="text-sm text-muted-foreground">Show toast notifications in-app</p>
                </div>
              </div>
              <Switch checked={desktopAlerts} onCheckedChange={setDesktopAlerts} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event-Specific Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Event Notifications</CardTitle>
              <CardDescription>Configure notifications for specific events</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEnableAll('push')}>
                Enable All Push
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEnableAll('email')}>
                Enable All Email
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {categories.map(category => (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <Badge variant="outline">{category}</Badge>
                  </h3>
                  <div className="space-y-2">
                    {notificationEvents
                      .filter(e => e.category === category)
                      .map(event => (
                        <div 
                          key={event.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              {event.icon}
                            </div>
                            <div>
                              <p className="font-medium">{event.name}</p>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`${event.id}-push`} className="text-sm text-muted-foreground">Push</Label>
                              <Switch 
                                id={`${event.id}-push`}
                                checked={preferences[event.id]?.push ?? event.pushDefault}
                                onCheckedChange={(v) => handleEventToggle(event.id, 'push', v)}
                                disabled={!globalPush}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`${event.id}-email`} className="text-sm text-muted-foreground">Email</Label>
                              <Switch 
                                id={`${event.id}-email`}
                                checked={preferences[event.id]?.email ?? event.emailDefault}
                                onCheckedChange={(v) => handleEventToggle(event.id, 'email', v)}
                                disabled={!globalEmail}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationPreferences;
