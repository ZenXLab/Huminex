import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { aiAgentSystemData, featureMatrixStatus } from "@/lib/traceflowDemoData";
import { FeatureModuleCard } from "./FeatureModuleCard";
import { 
  Bot, 
  Brain, 
  Eye, 
  GitBranch, 
  Bug, 
  Zap, 
  TrendingUp, 
  Ticket,
  Check,
  Clock,
  Sparkles,
  DollarSign,
  Timer,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

const agentIcons: Record<string, React.ReactNode> = {
  'brain': <Brain className="h-3.5 w-3.5" />,
  'eye': <Eye className="h-3.5 w-3.5" />,
  'git-branch': <GitBranch className="h-3.5 w-3.5" />,
  'bug': <Bug className="h-3.5 w-3.5" />,
  'zap': <Zap className="h-3.5 w-3.5" />,
  'trending-up': <TrendingUp className="h-3.5 w-3.5" />,
  'ticket': <Ticket className="h-3.5 w-3.5" />,
};

export const AIAgentSystemModule = () => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  return (
    <FeatureModuleCard
      id="ai-agent-system"
      title="AI Multi-Agent System"
      description="NeuroRouter-powered multi-LLM orchestration with specialized AI agents"
      icon={<Bot className="h-5 w-5 text-purple-500" />}
      category="D"
      featureId="ai-agent-module"
      stats={aiAgentSystemData.stats}
      status={featureMatrixStatus['D']}
      accentColor="purple"
      defaultExpanded
    >
      <div className="space-y-4">
        {/* NeuroRouter Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              NeuroRouter — Multi-LLM Control
            </h4>
            <Badge className="text-[9px] bg-purple-500/10 text-purple-600 border-purple-500/30">
              {aiAgentSystemData.neuroRouter.routingPolicy}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {aiAgentSystemData.neuroRouter.activeProviders.map((provider, idx) => (
              <motion.div
                key={provider.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedProvider(selectedProvider === provider.name ? null : provider.name)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                  selectedProvider === provider.name
                    ? "bg-purple-500/10 border-purple-500/30 ring-1 ring-purple-500/20"
                    : "bg-muted/30 border-border/50 hover:border-purple-500/20"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">{provider.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] text-muted-foreground">
                  <div className="text-center">
                    <p className="font-bold text-foreground">{provider.tasks}</p>
                    <p>Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">{provider.avgLatency}</p>
                    <p>Latency</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-emerald-600">{provider.cost}</p>
                    <p>Cost</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Router Stats */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <Shield className="h-3.5 w-3.5 mx-auto mb-1 text-purple-500" />
              <p className="text-[10px] font-medium">{aiAgentSystemData.neuroRouter.circuitBreakers}</p>
              <p className="text-[9px] text-muted-foreground">Circuit Breakers</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <Sparkles className="h-3.5 w-3.5 mx-auto mb-1 text-purple-500" />
              <p className="text-[10px] font-medium">{aiAgentSystemData.neuroRouter.auditTrail.toLocaleString()}</p>
              <p className="text-[9px] text-muted-foreground">Audit Trail</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <DollarSign className="h-3.5 w-3.5 mx-auto mb-1 text-emerald-500" />
              <p className="text-[10px] font-medium">-12%</p>
              <p className="text-[9px] text-muted-foreground">Cost Savings</p>
            </div>
          </div>
        </div>

        {/* AI Agents Grid */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Specialized AI Agents
          </h4>
          <div className="grid grid-cols-2 gap-1.5">
            {aiAgentSystemData.agents.map((agent, idx) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg transition-all hover:shadow-sm cursor-pointer",
                  agent.status === 'active' 
                    ? "bg-emerald-500/5 border border-emerald-500/20" 
                    : "bg-muted/30 border border-border/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded-md",
                    agent.status === 'active' ? "bg-purple-500/10" : "bg-muted"
                  )}>
                    {agentIcons[agent.icon] || <Bot className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <p className="text-[11px] font-medium">{agent.name}</p>
                    <p className="text-[9px] text-muted-foreground">{agent.tasks} tasks</p>
                  </div>
                </div>
                <div className="text-right">
                  {agent.status === 'active' ? (
                    <span className="text-[10px] font-medium text-emerald-600">{agent.accuracy}</span>
                  ) : (
                    <Badge variant="outline" className="text-[9px] h-4">Pending</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent AI Outputs */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Recent AI Insights
          </h4>
          <ScrollArea className="h-28">
            <div className="space-y-1.5">
              {aiAgentSystemData.recentOutputs.map((output, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-2.5 rounded-lg bg-gradient-to-r from-purple-500/5 to-transparent border border-purple-500/10"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[9px] h-4 text-purple-600 border-purple-500/30">
                      {output.type.replace('_', ' ')}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {output.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground">{output.insight}</p>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </FeatureModuleCard>
  );
};
