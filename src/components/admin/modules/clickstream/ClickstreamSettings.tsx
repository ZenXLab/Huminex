import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Trash2, AlertTriangle, ShieldAlert, Settings, Activity, Video, 
  Brain, FormInput, Globe, MousePointer, Eye, Flame, AlertCircle,
  Save, RotateCcw
} from "lucide-react";

interface ClickstreamSettingsProps {
  totalEvents: number;
  uniqueSessions: number;
  clicks: number;
  pageViews: number;
  onDeleteSuccess: () => void;
}

interface FeatureSettings {
  trackClicks: boolean;
  trackPageViews: boolean;
  trackScrolls: boolean;
  sessionRecording: boolean;
  aiStruggleDetection: boolean;
  formAnalytics: boolean;
  geoTracking: boolean;
  heatmaps: boolean;
  realTimeNotifications: boolean;
  retentionDays: number;
}

const defaultSettings: FeatureSettings = {
  trackClicks: true,
  trackPageViews: true,
  trackScrolls: true,
  sessionRecording: true,
  aiStruggleDetection: true,
  formAnalytics: true,
  geoTracking: true,
  heatmaps: true,
  realTimeNotifications: true,
  retentionDays: 90,
};

export const ClickstreamSettings = ({
  totalEvents,
  uniqueSessions,
  clicks,
  pageViews,
  onDeleteSuccess,
}: ClickstreamSettingsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [settings, setSettings] = useState<FeatureSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("clickstream_feature_settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings:", e);
      }
    }
  }, []);

  const handleSettingChange = (key: keyof FeatureSettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem("clickstream_feature_settings", JSON.stringify(settings));
    setHasChanges(false);
    toast.success("Settings saved successfully");
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("clickstream_events")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
      setShowDeleteDialog(false);
      toast.success("All clickstream data deleted successfully");
      onDeleteSuccess();
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const features = [
    { key: "trackClicks", label: "Click Tracking", icon: MousePointer, description: "Track user clicks on elements" },
    { key: "trackPageViews", label: "Page View Tracking", icon: Eye, description: "Track page visits and navigation" },
    { key: "trackScrolls", label: "Scroll Tracking", icon: Activity, description: "Track scroll depth and patterns" },
    { key: "sessionRecording", label: "Session Recording", icon: Video, description: "Record user sessions for replay", badge: "Pro" },
    { key: "aiStruggleDetection", label: "AI Struggle Detection", icon: Brain, description: "Detect user frustration patterns", badge: "AI" },
    { key: "formAnalytics", label: "Form Analytics", icon: FormInput, description: "Track form field interactions", badge: "New" },
    { key: "geoTracking", label: "Geographic Tracking", icon: Globe, description: "Track user locations" },
    { key: "heatmaps", label: "Heatmaps", icon: Flame, description: "Generate click and scroll heatmaps" },
    { key: "realTimeNotifications", label: "Real-time Notifications", icon: Activity, description: "Show live event notifications" },
  ];

  return (
    <div className="space-y-6">
      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Feature Settings
              </CardTitle>
              <CardDescription>Enable or disable clickstream features</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(({ key, label, icon: Icon, description, badge }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Label className="font-medium">{label}</Label>
                      {badge && (
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${
                          badge === "New" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
                          badge === "Pro" ? "bg-purple-500/10 text-purple-600 border-purple-500/30" :
                          badge === "AI" ? "bg-blue-500/10 text-blue-600 border-blue-500/30" : ""
                        }`}>
                          {badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[key as keyof FeatureSettings] as boolean}
                  onCheckedChange={(checked) => handleSettingChange(key as keyof FeatureSettings, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Retention</CardTitle>
          <CardDescription>Configure how long clickstream data is stored</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label className="min-w-[120px]">Retention Period</Label>
            <Input
              type="number"
              value={settings.retentionDays}
              onChange={(e) => handleSettingChange("retentionDays", parseInt(e.target.value) || 30)}
              className="w-24"
              min={7}
              max={365}
            />
            <span className="text-sm text-muted-foreground">days</span>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions - proceed with caution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
            <div>
              <p className="font-medium">Delete All Clickstream Data</p>
              <p className="text-sm text-muted-foreground">
                Permanently remove all tracked events, sessions, and analytics data
              </p>
            </div>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                    <ShieldAlert className="h-5 w-5" />
                    Danger: Delete All Data
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-4">
                      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                          <div className="space-y-2">
                            <p className="font-medium text-destructive">This action cannot be undone!</p>
                            <p className="text-sm text-muted-foreground">
                              You are about to permanently delete all clickstream analytics data.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Data to be deleted:</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <strong>{totalEvents.toLocaleString()}</strong> clickstream events
                          </li>
                          <li className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <strong>{uniqueSessions.toLocaleString()}</strong> unique sessions
                          </li>
                          <li className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <strong>{clicks.toLocaleString()}</strong> click events
                          </li>
                          <li className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <strong>{pageViews.toLocaleString()}</strong> page view events
                          </li>
                        </ul>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAllData} 
                    disabled={isDeleting} 
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete All Data
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
