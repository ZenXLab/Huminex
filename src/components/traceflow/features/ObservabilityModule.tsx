import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  Activity, 
  Radio, 
  Bell,
  BarChart3,
  Search,
  Monitor,
  Gauge,
  LineChart
} from "lucide-react";
import { traceflowDemoData } from "@/lib/traceflowDemoData";
import { useState } from "react";
import { motion } from "framer-motion";

export const ObservabilityModule = () => {
  const [features, setFeatures] = useState(traceflowDemoData.observability.features);

  const toggleFeature = (index: number) => {
    const updated = [...features];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setFeatures(updated);
  };

  const iconMap: Record<string, React.ReactNode> = {
    "WebRTC Live Replay": <Radio className="h-4 w-4" />,
    "WebSocket Micro-Events": <Activity className="h-4 w-4" />,
    "Live Anomaly Notifications": <Bell className="h-4 w-4" />,
    "Real-time Dashboards": <Monitor className="h-4 w-4" />,
    "OpenTelemetry Instrumentation": <Activity className="h-4 w-4" />,
    "Distributed Tracing": <Search className="h-4 w-4" />,
    "Prometheus Metrics": <Gauge className="h-4 w-4" />,
    "Grafana Dashboards": <BarChart3 className="h-4 w-4" />,
    "Loki Logs": <Search className="h-4 w-4" />,
    "Jaeger Tracing": <Activity className="h-4 w-4" />,
    "Performance SLOs": <LineChart className="h-4 w-4" />,
  };

  const enabledCount = features.filter(f => f.enabled).length;
  const progress = (enabledCount / features.length) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">Realtime & Observability</CardTitle>
              <p className="text-xs text-muted-foreground">Live monitoring & metrics</p>
            </div>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-300">
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
                    {iconMap[feature.name] || <Activity className="h-4 w-4" />}
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
