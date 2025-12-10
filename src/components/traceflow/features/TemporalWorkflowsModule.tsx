import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { FeatureStageIndicator } from "@/components/ui/feature-badge";
import { 
  GitBranch, 
  RefreshCw, 
  Clock, 
  Users,
  CheckCircle2,
  History,
  Scale,
  Shield
} from "lucide-react";
import { traceflowDemoData } from "@/lib/traceflowDemoData";
import { useState } from "react";
import { motion } from "framer-motion";

export const TemporalWorkflowsModule = () => {
  const [features, setFeatures] = useState(traceflowDemoData.temporalWorkflows.features);

  const toggleFeature = (index: number) => {
    const updated = [...features];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setFeatures(updated);
  };

  const iconMap: Record<string, React.ReactNode> = {
    "Session-Summary Workflow": <RefreshCw className="h-4 w-4" />,
    "UX-Scan Workflow": <CheckCircle2 className="h-4 w-4" />,
    "Causality Workflow": <GitBranch className="h-4 w-4" />,
    "Multi-Agent Orchestration": <Users className="h-4 w-4" />,
    "Reprocessing Workflow": <RefreshCw className="h-4 w-4" />,
    "Retention Purge": <Clock className="h-4 w-4" />,
    "Billing Meter Workflow": <Scale className="h-4 w-4" />,
    "Exactly-Once Orchestration": <Shield className="h-4 w-4" />,
    "Versioned Definitions": <History className="h-4 w-4" />,
    "Long-Running Durable Tasks": <Clock className="h-4 w-4" />,
    "Horizontal Scaling": <Scale className="h-4 w-4" />,
    "Human-in-Loop Approvals": <Users className="h-4 w-4" />,
  };

  const enabledCount = features.filter(f => f.enabled).length;
  const progress = (enabledCount / features.length) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <GitBranch className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-sm">Temporal Workflows</CardTitle>
                <FeatureStageIndicator featureId="temporal-workflows-module" size="sm" />
              </div>
              <p className="text-xs text-muted-foreground">Durable orchestration layer</p>
            </div>
          </div>
          <Badge variant="outline" className="text-violet-600 border-violet-300">
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
                    {iconMap[feature.name] || <GitBranch className="h-4 w-4" />}
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
