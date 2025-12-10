import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  Rocket, 
  Bot, 
  Smartphone,
  Shield,
  Activity,
  Cpu,
  Plug
} from "lucide-react";
import { traceflowDemoData } from "@/lib/traceflowDemoData";
import { useState } from "react";
import { motion } from "framer-motion";

export const FutureExpansionsModule = () => {
  const [features, setFeatures] = useState(traceflowDemoData.futureExpansions.features);

  const toggleFeature = (index: number) => {
    const updated = [...features];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setFeatures(updated);
  };

  const iconMap: Record<string, React.ReactNode> = {
    "LLM Synthetic User Testing": <Bot className="h-4 w-4" />,
    "Autonomous UX Optimizer": <Cpu className="h-4 w-4" />,
    "On-Device Small-Model Agents": <Smartphone className="h-4 w-4" />,
    "Federated Analytics": <Shield className="h-4 w-4" />,
    "AI-based Real User Monitoring": <Activity className="h-4 w-4" />,
    "Edge-Only Inference Pipelines": <Cpu className="h-4 w-4" />,
    "Plug-and-Play Adapters": <Plug className="h-4 w-4" />,
  };

  const enabledCount = features.filter(f => f.enabled).length;
  const progress = (enabledCount / features.length) * 100;

  return (
    <Card className="h-full border-dashed border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">Future Expansions</CardTitle>
              <p className="text-xs text-muted-foreground">Roadmap features</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-indigo-600 bg-indigo-100">
            Roadmap
          </Badge>
        </div>
        <Progress value={progress} className="h-1.5 mt-2" />
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          <div className="px-4 pb-4 space-y-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between p-2 rounded-lg border border-dashed bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground">
                    {iconMap[feature.name] || <Rocket className="h-4 w-4" />}
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
                  disabled
                />
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
