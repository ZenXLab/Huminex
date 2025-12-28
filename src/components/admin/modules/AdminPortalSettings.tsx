import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { RefreshCw, Save, Settings, Globe, Mail, Shield, Palette, Loader2 } from "lucide-react";

export const AdminPortalSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: "HUMINEX Portal",
    site_description: "Enterprise Consulting & Digital Transformation",
    support_email: "support@cropxon.com",
    enable_client_registration: true,
    require_email_verification: true,
    maintenance_mode: false,
    maintenance_message: "We're currently performing scheduled maintenance. Please check back soon.",
    primary_color: "#8B5CF6",
    enable_notifications: true,
    auto_approve_clients: false,
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portal_settings')
        .select('*');

      if (error) throw error;

      if (data) {
        const settingsMap: Record<string, any> = {};
        data.forEach((s: any) => {
          settingsMap[s.key] = s.value;
        });
        setSettings(prev => ({ ...prev, ...settingsMap }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const entries = Object.entries(settings);
      
      for (const [key, value] of entries) {
        const { error } = await supabase
          .from('portal_settings')
          .upsert({
            key,
            value: value,
            updated_by: user?.id,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'key',
          });

        if (error) throw error;
      }

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'update_settings',
        entity_type: 'portal_settings',
        new_values: settings,
      });

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Portal Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchSettings} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General
            </CardTitle>
            <CardDescription>Basic portal configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Site Description</Label>
              <Textarea
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Authentication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication
            </CardTitle>
            <CardDescription>User registration and access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Client Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new clients to sign up</p>
              </div>
              <Switch
                checked={settings.enable_client_registration}
                onCheckedChange={(v) => setSettings({ ...settings, enable_client_registration: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">Verify emails before access</p>
              </div>
              <Switch
                checked={settings.require_email_verification}
                onCheckedChange={(v) => setSettings({ ...settings, require_email_verification: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-approve Clients</Label>
                <p className="text-sm text-muted-foreground">Skip manual approval</p>
              </div>
              <Switch
                checked={settings.auto_approve_clients}
                onCheckedChange={(v) => setSettings({ ...settings, auto_approve_clients: v })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Email and alert settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Send system notifications</p>
              </div>
              <Switch
                checked={settings.enable_notifications}
                onCheckedChange={(v) => setSettings({ ...settings, enable_notifications: v })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Maintenance
            </CardTitle>
            <CardDescription>Portal availability settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Temporarily disable portal access</p>
              </div>
              <Switch
                checked={settings.maintenance_mode}
                onCheckedChange={(v) => setSettings({ ...settings, maintenance_mode: v })}
              />
            </div>
            {settings.maintenance_mode && (
              <div className="space-y-2">
                <Label>Maintenance Message</Label>
                <Textarea
                  value={settings.maintenance_message}
                  onChange={(e) => setSettings({ ...settings, maintenance_message: e.target.value })}
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Visual customization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
