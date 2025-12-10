import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { enterpriseRunnerData, featureMatrixStatus } from "@/lib/traceflowDemoData";
import { FeatureModuleCard } from "./FeatureModuleCard";
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity,
  Check,
  AlertTriangle,
  Gauge,
  Shield,
  Database,
  Wifi
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const EnterpriseRunnerModule = () => {
  return (
    <FeatureModuleCard
      id="enterprise-runner"
      title="Enterprise Runner (Hybrid/On-Prem)"
      description="Self-hosted ingest agent with local processing, tokenization, and buffering"
      icon={<Server className="h-5 w-5 text-emerald-500" />}
      category="B"
      featureId="enterprise-runner-module"
      stats={enterpriseRunnerData.stats}
      status={featureMatrixStatus['B']}
      accentColor="emerald"
    >
      <div className="space-y-4">
        {/* Runner Instances */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Active Runner Instances
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {enterpriseRunnerData.runners.map((runner, idx) => (
              <motion.div
                key={runner.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "p-3 rounded-lg border",
                  runner.status === 'healthy' 
                    ? "bg-emerald-500/5 border-emerald-500/20" 
                    : "bg-amber-500/5 border-amber-500/20"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">{runner.name}</span>
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    runner.status === 'healthy' ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                  )} />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Cpu className="h-3 w-3" /> CPU
                    </span>
                    <span className={cn(
                      "font-medium",
                      runner.cpu > 70 ? "text-amber-600" : "text-foreground"
                    )}>{runner.cpu}%</span>
                  </div>
                  <Progress value={runner.cpu} className="h-1" />
                  
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <HardDrive className="h-3 w-3" /> Memory
                    </span>
                    <span className={cn(
                      "font-medium",
                      runner.memory > 80 ? "text-amber-600" : "text-foreground"
                    )}>{runner.memory}%</span>
                  </div>
                  <Progress value={runner.memory} className="h-1" />
                  
                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-muted-foreground">Queue Depth</span>
                    <Badge variant="outline" className="text-[9px] h-4">
                      {runner.queue}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Capabilities List */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Runner Capabilities
          </h4>
          <div className="grid grid-cols-1 gap-1">
            {enterpriseRunnerData.capabilities.map((cap, idx) => (
              <motion.div
                key={cap.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-[11px]">{cap.name}</span>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {cap.throughput || cap.connections || cap.tokensProcessed || cap.rate || cap.trips || cap.size || cap.pending}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Deployment Modes */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold">K8</div>
              <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[8px] text-white font-bold">VM</div>
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-white font-bold">🔒</div>
            </div>
            <span className="text-xs">On-Prem / Hybrid / Air-gapped Ready</span>
          </div>
          <Button size="sm" variant="outline" className="h-6 text-[10px]">
            Deploy
          </Button>
        </div>
      </div>
    </FeatureModuleCard>
  );
};
