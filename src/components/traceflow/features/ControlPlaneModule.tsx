import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { FeatureStageIndicator } from "@/components/ui/feature-badge";
import { 
  Cloud, 
  Users, 
  CreditCard,
  Shield,
  Bell,
  BarChart3,
  Video,
  Mic,
  GitBranch,
  TrendingUp,
  Activity,
  AlertTriangle
} from "lucide-react";
import { traceflowDemoData } from "@/lib/traceflowDemoData";
import { useState } from "react";
import { motion } from "framer-motion";

export const ControlPlaneModule = () => {
  const [features, setFeatures] = useState(traceflowDemoData.controlPlane.features);

  const toggleFeature = (index: number) => {
    const updated = [...features];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setFeatures(updated);
  };

  const iconMap: Record<string, React.ReactNode> = {
    "Tenant Management": <Users className="h-4 w-4" />,
    "Billing & Usage Ledger": <CreditCard className="h-4 w-4" />,
    "Feature Flags": <Shield className="h-4 w-4" />,
    "RBAC": <Shield className="h-4 w-4" />,
    "SSO/SAML": <Users className="h-4 w-4" />,
    "Audit Logs": <Activity className="h-4 w-4" />,
    "Session Explorer": <Video className="h-4 w-4" />,
    "Replay Viewer": <Video className="h-4 w-4" />,
    "Audio Transcript Viewer": <Mic className="h-4 w-4" />,
    "Journey Explorer": <GitBranch className="h-4 w-4" />,
    "Funnel Analytics": <TrendingUp className="h-4 w-4" />,
    "Revenue-Loss Quantification": <BarChart3 className="h-4 w-4" />,
    "Custom Alert Rules": <Bell className="h-4 w-4" />,
    "Real-time Anomaly Detection": <AlertTriangle className="h-4 w-4" />,
    "Auto-Runbooks": <Activity className="h-4 w-4" />,
    "Slack/Email/PagerDuty": <Bell className="h-4 w-4" />,
  };

  const enabledCount = features.filter(f => f.enabled).length;
  const progress = (enabledCount / features.length) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <Cloud className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-sm">Control Plane (Cloud)</CardTitle>
                <FeatureStageIndicator featureId="control-plane-module" size="sm" />
              </div>
              <p className="text-xs text-muted-foreground">Platform & analytics</p>
            </div>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-300">
            {enabledCount}/{features.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-1.5 mt-2" />
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px]">
          <div className="px-4 pb-4 space-y-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between p-2 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground">
                    {iconMap[feature.name] || <Cloud className="h-4 w-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-medium">{feature.name}</span>
                    <p className="text-[10px] text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <Switch
                  checked={feature.enabled}
                  onCheckedChange={() => toggleFeature(index)}
                  className="scale-75"
                />
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
