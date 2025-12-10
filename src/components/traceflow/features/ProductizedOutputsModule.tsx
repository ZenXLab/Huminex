import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  FileText, 
  Map, 
  GitBranch,
  Thermometer,
  History,
  Video,
  FileCode,
  Upload
} from "lucide-react";
import { traceflowDemoData } from "@/lib/traceflowDemoData";
import { useState } from "react";
import { motion } from "framer-motion";

export const ProductizedOutputsModule = () => {
  const [features, setFeatures] = useState(traceflowDemoData.productizedOutputs.features);

  const toggleFeature = (index: number) => {
    const updated = [...features];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setFeatures(updated);
  };

  const iconMap: Record<string, React.ReactNode> = {
    "AI Session Reports": <FileText className="h-4 w-4" />,
    "UX Friction Maps": <Map className="h-4 w-4" />,
    "Journey Causality Graphs": <GitBranch className="h-4 w-4" />,
    "Anomaly Heatmaps": <Thermometer className="h-4 w-4" />,
    "Model Provenance Sheets": <History className="h-4 w-4" />,
    "Replay + Transcript Fusion": <Video className="h-4 w-4" />,
    "Auto-created Jira/GitHub Issues": <FileCode className="h-4 w-4" />,
    "Export to Snowflake/BigQuery": <Upload className="h-4 w-4" />,
  };

  const enabledCount = features.filter(f => f.enabled).length;
  const progress = (enabledCount / features.length) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">Productized Outputs</CardTitle>
              <p className="text-xs text-muted-foreground">Reports & exports</p>
            </div>
          </div>
          <Badge variant="outline" className="text-pink-600 border-pink-300">
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
                    {iconMap[feature.name] || <FileText className="h-4 w-4" />}
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
