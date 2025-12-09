import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle,
  Plus,
  X,
  Save
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useTraceflowAuth } from "@/hooks/useTraceflowAuth";

interface PrivacySettings {
  pii_masking_enabled: boolean;
  session_recording_enabled: boolean;
  gdpr_mode: boolean;
  hipaa_mode: boolean;
  data_retention_days: number;
  allowed_domains: string[];
  blocked_ips: string[];
}

export const TraceflowPrivacyControls = () => {
  const { user } = useTraceflowAuth();
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState<PrivacySettings>({
    pii_masking_enabled: true,
    session_recording_enabled: true,
    gdpr_mode: false,
    hipaa_mode: false,
    data_retention_days: 90,
    allowed_domains: [],
    blocked_ips: [],
  });
  
  const [newDomain, setNewDomain] = useState("");
  const [newIp, setNewIp] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch current privacy settings
  const { data: privacyData, isLoading } = useQuery({
    queryKey: ["traceflow-privacy-settings", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("traceflow_compliance_settings")
        .select("*")
        .eq("subscription_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Update settings when data loads
  useEffect(() => {
    if (privacyData) {
      setSettings({
        pii_masking_enabled: privacyData.pii_masking_enabled ?? true,
        session_recording_enabled: privacyData.session_recording_enabled ?? true,
        gdpr_mode: privacyData.gdpr_mode ?? false,
        hipaa_mode: privacyData.hipaa_mode ?? false,
        data_retention_days: privacyData.data_retention_days ?? 90,
        allowed_domains: privacyData.allowed_domains ?? [],
        blocked_ips: privacyData.blocked_ips ?? [],
      });
    }
  }, [privacyData]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (newSettings: PrivacySettings) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("traceflow_compliance_settings")
        .upsert({
          subscription_id: user.id,
          ...newSettings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Privacy settings saved");
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["traceflow-privacy-settings"] });
    },
    onError: (error) => {
      toast.error("Failed to save settings: " + error.message);
    },
  });

  const updateSetting = <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const addDomain = () => {
    if (newDomain && !settings.allowed_domains.includes(newDomain)) {
      updateSetting("allowed_domains", [...settings.allowed_domains, newDomain]);
      setNewDomain("");
    }
  };

  const removeDomain = (domain: string) => {
    updateSetting("allowed_domains", settings.allowed_domains.filter(d => d !== domain));
  };

  const addIp = () => {
    if (newIp && !settings.blocked_ips.includes(newIp)) {
      updateSetting("blocked_ips", [...settings.blocked_ips, newIp]);
      setNewIp("");
    }
  };

  const removeIp = (ip: string) => {
    updateSetting("blocked_ips", settings.blocked_ips.filter(i => i !== ip));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Privacy Controls
          </h2>
          <p className="text-muted-foreground">Configure data collection, masking, and compliance settings</p>
        </div>
        <Button 
          onClick={() => saveMutation.mutate(settings)}
          disabled={!hasChanges || saveMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {saveMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Data Collection
              </CardTitle>
              <CardDescription>Control what data is captured</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Recording</Label>
                  <p className="text-xs text-muted-foreground">Capture full session replays</p>
                </div>
                <Switch 
                  checked={settings.session_recording_enabled}
                  onCheckedChange={(v) => updateSetting("session_recording_enabled", v)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>PII Masking</Label>
                  <p className="text-xs text-muted-foreground">Automatically mask sensitive data</p>
                </div>
                <Switch 
                  checked={settings.pii_masking_enabled}
                  onCheckedChange={(v) => updateSetting("pii_masking_enabled", v)}
                />
              </div>

              <div>
                <Label>Data Retention (days)</Label>
                <Input 
                  type="number" 
                  value={settings.data_retention_days}
                  onChange={(e) => updateSetting("data_retention_days", parseInt(e.target.value) || 90)}
                  className="mt-1"
                  min={7}
                  max={365}
                />
                <p className="text-xs text-muted-foreground mt-1">Data older than this will be automatically deleted</p>
              </div>
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Compliance Mode
              </CardTitle>
              <CardDescription>Enable regulatory compliance features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/10 text-blue-600">GDPR</Badge>
                  <div>
                    <Label>GDPR Mode</Label>
                    <p className="text-xs text-muted-foreground">EU data protection compliance</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.gdpr_mode}
                  onCheckedChange={(v) => updateSetting("gdpr_mode", v)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-500/10 text-purple-600">HIPAA</Badge>
                  <div>
                    <Label>HIPAA Mode</Label>
                    <p className="text-xs text-muted-foreground">Healthcare data compliance</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.hipaa_mode}
                  onCheckedChange={(v) => updateSetting("hipaa_mode", v)}
                />
              </div>

              {(settings.gdpr_mode || settings.hipaa_mode) && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Compliance features active</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enhanced masking, consent tracking, and audit logging enabled
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Allowed Domains */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Allowed Domains
              </CardTitle>
              <CardDescription>Only capture data from these domains (leave empty for all)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addDomain()}
                />
                <Button variant="outline" size="icon" onClick={addDomain}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {settings.allowed_domains.map((domain) => (
                  <Badge key={domain} variant="secondary" className="gap-1">
                    {domain}
                    <button onClick={() => removeDomain(domain)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {settings.allowed_domains.length === 0 && (
                  <p className="text-sm text-muted-foreground">All domains allowed</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blocked IPs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Blocked IPs
              </CardTitle>
              <CardDescription>Exclude these IP addresses from tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="192.168.1.1"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addIp()}
                />
                <Button variant="outline" size="icon" onClick={addIp}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {settings.blocked_ips.map((ip) => (
                  <Badge key={ip} variant="secondary" className="gap-1">
                    {ip}
                    <button onClick={() => removeIp(ip)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {settings.blocked_ips.length === 0 && (
                  <p className="text-sm text-muted-foreground">No IPs blocked</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Privacy Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium">Privacy Status</p>
                <p className="text-sm text-muted-foreground">
                  {settings.pii_masking_enabled ? "PII masking active" : "PII masking disabled"} • 
                  {settings.data_retention_days} day retention
                </p>
              </div>
            </div>
            <Badge className={settings.pii_masking_enabled ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
              {settings.pii_masking_enabled ? "Protected" : "Review Recommended"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
