import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { captureEngineData, featureMatrixStatus } from "@/lib/traceflowDemoData";
import { FeatureModuleCard } from "./FeatureModuleCard";
import { 
  Radio, 
  Check, 
  Clock, 
  Smartphone, 
  Globe, 
  Zap,
  MousePointer,
  Eye,
  Mic,
  Video,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const CaptureEngineModule = () => {
  return (
    <FeatureModuleCard
      id="capture-engine"
      title="Data Capture & Ingest Layer"
      description="Full-stack event capture across web, mobile, and hybrid applications"
      icon={<Radio className="h-5 w-5 text-primary" />}
      category="A"
      featureId="capture-engine-module"
      stats={captureEngineData.stats}
      status={featureMatrixStatus['A']}
      accentColor="primary"
      defaultExpanded
    >
      <div className="space-y-4">
        {/* SDKs Grid */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Active SDKs
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {captureEngineData.sdks.map((sdk, idx) => (
              <motion.div
                key={sdk.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer",
                  sdk.status === 'active' ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {sdk.name.includes('iOS') && <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />}
                    {sdk.name.includes('Android') && <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />}
                    {sdk.name.includes('Web') && <Globe className="h-3.5 w-3.5 text-muted-foreground" />}
                    {sdk.name.includes('React') && <Zap className="h-3.5 w-3.5 text-muted-foreground" />}
                    <span className="text-xs font-medium">{sdk.name}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[9px] h-4",
                      sdk.status === 'active' ? "text-emerald-600 border-emerald-500/30" : "text-amber-600 border-amber-500/30"
                    )}
                  >
                    {sdk.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>v{sdk.version}</span>
                  <span className="font-medium">{sdk.events}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Capture Types */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Capture Capabilities
          </h4>
          <div className="grid grid-cols-2 gap-1.5">
            {captureEngineData.captureTypes.map((cap, idx) => (
              <motion.div
                key={cap.type}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {cap.status === 'active' ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Clock className="h-3 w-3 text-amber-500" />
                  )}
                  <span className="text-[11px]">{cap.type}</span>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {cap.count > 0 ? cap.count.toLocaleString() : '—'}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Real-time Events Feed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Live Event Stream
            </h4>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-600 font-medium">Live</span>
            </div>
          </div>
          <ScrollArea className="h-32">
            <div className="space-y-1.5">
              {captureEngineData.realtimeEvents.map((evt, idx) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/50"
                >
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[9px] h-4 px-1.5",
                        evt.type === 'click' && "text-blue-600 border-blue-500/30",
                        evt.type === 'scroll' && "text-purple-600 border-purple-500/30",
                        evt.type === 'error' && "text-red-600 border-red-500/30",
                        evt.type === 'form_input' && "text-amber-600 border-amber-500/30",
                        evt.type === 'rage_click' && "text-orange-600 border-orange-500/30",
                      )}
                    >
                      {evt.type}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                      {evt.page}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{evt.timestamp}</span>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* SDK Integration CTA */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">SDK-side PII Masking Active</span>
          </div>
          <Button size="sm" variant="outline" className="h-6 text-[10px]">
            Configure
          </Button>
        </div>
      </div>
    </FeatureModuleCard>
  );
};
