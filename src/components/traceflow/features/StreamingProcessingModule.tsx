import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { FeatureStageIndicator } from "@/components/ui/feature-badge";
import { 
  Radio, 
  Zap, 
  RotateCcw, 
  Archive,
  Activity,
  FileText,
  Image,
  Mic,
  AlertCircle
} from "lucide-react";
import { traceflowDemoData } from "@/lib/traceflowDemoData";
import { useState } from "react";
import { motion } from "framer-motion";

export const StreamingProcessingModule = () => {
  const [features, setFeatures] = useState(traceflowDemoData.streamingLayer.features);

  const toggleFeature = (index: number) => {
    const updated = [...features];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setFeatures(updated);
  };

  const iconMap: Record<string, React.ReactNode> = {
    "Redis Streams": <Radio className="h-4 w-4" />,
    "Kafka/Redpanda": <Activity className="h-4 w-4" />,
    "Consumer Groups": <Zap className="h-4 w-4" />,
    "Event Normalizer": <FileText className="h-4 w-4" />,
    "Transcription Worker": <Mic className="h-4 w-4" />,
    "Embedding Generator": <Activity className="h-4 w-4" />,
    "Image/Frame Encoder": <Image className="h-4 w-4" />,
    "Replay Chunking": <Archive className="h-4 w-4" />,
    "BullMQ Queue": <Radio className="h-4 w-4" />,
    "Priority Lanes": <Zap className="h-4 w-4" />,
    "Exponential Backoff": <RotateCcw className="h-4 w-4" />,
    "Dead-Letter Queue": <AlertCircle className="h-4 w-4" />,
  };

  const enabledCount = features.filter(f => f.enabled).length;
  const progress = (enabledCount / features.length) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Radio className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-sm">Streaming & Processing</CardTitle>
                <FeatureStageIndicator featureId="streaming-module" size="sm" />
              </div>
              <p className="text-xs text-muted-foreground">Event backbone & workers</p>
            </div>
          </div>
          <Badge variant="outline" className="text-cyan-600 border-cyan-300">
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
