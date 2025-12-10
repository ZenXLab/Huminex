import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  Database, 
  HardDrive, 
  Search,
  Image,
  Mic,
  Archive,
  Layers,
  GitBranch,
  Brain
} from "lucide-react";
import { traceflowDemoData } from "@/lib/traceflowDemoData";
import { useState } from "react";
import { motion } from "framer-motion";

export const StorageIndexingModule = () => {
  const [features, setFeatures] = useState(traceflowDemoData.storageLayer.features);

  const toggleFeature = (index: number) => {
    const updated = [...features];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setFeatures(updated);
  };

  const iconMap: Record<string, React.ReactNode> = {
    "Replay Blob Storage": <HardDrive className="h-4 w-4" />,
    "Screenshot Storage": <Image className="h-4 w-4" />,
    "Audio File Storage": <Mic className="h-4 w-4" />,
    "Cold Storage Lifecycle": <Archive className="h-4 w-4" />,
    "Session Metadata DB": <Database className="h-4 w-4" />,
    "User Journey Paths": <GitBranch className="h-4 w-4" />,
    "Performance Signals": <Layers className="h-4 w-4" />,
    "Vector Embeddings": <Brain className="h-4 w-4" />,
    "Semantic Search": <Search className="h-4 w-4" />,
    "Cross-Modal Indexing": <Layers className="h-4 w-4" />,
    "Journey Clustering": <GitBranch className="h-4 w-4" />,
    "Root-Cause Grouping": <Search className="h-4 w-4" />,
  };

  const enabledCount = features.filter(f => f.enabled).length;
  const progress = (enabledCount / features.length) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <Database className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">Storage & Indexing</CardTitle>
              <p className="text-xs text-muted-foreground">Objects, metadata & vectors</p>
            </div>
          </div>
          <Badge variant="outline" className="text-emerald-600 border-emerald-300">
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
                    {iconMap[feature.name] || <Database className="h-4 w-4" />}
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
