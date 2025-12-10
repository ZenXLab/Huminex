import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  DollarSign, 
  Gauge, 
  Scale,
  Globe,
  Archive,
  Brain,
  Zap
} from "lucide-react";
import { traceflowDemoData } from "@/lib/traceflowDemoData";
import { useState } from "react";
import { motion } from "framer-motion";

export const CostOptimizationModule = () => {
  const [features, setFeatures] = useState(traceflowDemoData.costOptimization.features);

  const toggleFeature = (index: number) => {
    const updated = [...features];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setFeatures(updated);
  };

  const iconMap: Record<string, React.ReactNode> = {
    "Token Budgeting": <DollarSign className="h-4 w-4" />,
    "Rate Limiting": <Gauge className="h-4 w-4" />,
    "Auto-Scaling Workers": <Scale className="h-4 w-4" />,
    "Multi-Region Architecture": <Globe className="h-4 w-4" />,
    "Cold Storage Lifecycle": <Archive className="h-4 w-4" />,
    "Adaptive AI Complexity": <Brain className="h-4 w-4" />,
  };

  const enabledCount = features.filter(f => f.enabled).length;
  const progress = (enabledCount / features.length) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">Cost Optimization</CardTitle>
              <p className="text-xs text-muted-foreground">Budgets & scaling</p>
            </div>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-300">
            {enabledCount}/{features.length}
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
                className="flex items-center justify-between p-2 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground">
                    {iconMap[feature.name] || <Zap className="h-4 w-4" />}
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
