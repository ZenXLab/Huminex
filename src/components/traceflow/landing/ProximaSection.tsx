import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Eye,
  Workflow,
  TrendingUp,
  Ticket,
  Map,
  ArrowRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const agents = [
  {
    id: "analyst",
    name: "Session Analyst",
    description: "AI-powered session summarization",
    icon: Eye,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "mapper",
    name: "Journey Mapper",
    description: "Automatic funnel discovery",
    icon: Map,
    color: "from-cyan-500 to-teal-500",
  },
  {
    id: "causality",
    name: "Causality Engine",
    description: "Root cause identification",
    icon: Workflow,
    color: "from-teal-500 to-emerald-500",
  },
  {
    id: "ux",
    name: "UX Vision",
    description: "Visual UI issue detection",
    icon: Brain,
    color: "from-emerald-500 to-green-500",
  },
  {
    id: "revenue",
    name: "Revenue Impact",
    description: "Business value quantification",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "ticket",
    name: "Ticket Automation",
    description: "Auto-generated Jira tickets",
    icon: Ticket,
    color: "from-purple-500 to-pink-500",
  },
];

const flowSteps = ["Events", "Agents", "Insights", "Actions"];

export const ProximaSection = () => {
  const [activeAgent, setActiveAgent] = useState(0);
  const [flowStep, setFlowStep] = useState(0);

  // Auto-rotate agents
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Animate flow
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowStep((prev) => (prev + 1) % flowSteps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-[#0B3D91]/5 via-background to-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white border-0">
            Multi-Agent Intelligence
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">PROXIMA</span> — Digital Intelligence Layer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Six specialized AI agents working in concert to diagnose, quantify, and resolve experience issues.
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 lg:gap-4">
            {flowSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-2 lg:gap-4">
                <div
                  className={cn(
                    "px-4 py-2 lg:px-6 lg:py-3 rounded-xl font-medium text-sm lg:text-base transition-all duration-500",
                    index <= flowStep
                      ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white shadow-lg shadow-[#0B3D91]/20"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step}
                </div>
                {index < flowSteps.length - 1 && (
                  <ArrowRight className={cn(
                    "h-4 w-4 lg:h-5 lg:w-5 transition-colors duration-500",
                    index < flowStep ? "text-[#00C2D8]" : "text-muted-foreground/30"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            const isActive = index === activeAgent;

            return (
              <div
                key={agent.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setActiveAgent(index)}
              >
                {/* Glow Effect */}
                {isActive && (
                  <div className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-r blur-xl opacity-30 -z-10",
                    agent.color
                  )} />
                )}

                <div className={cn(
                  "bg-card border rounded-2xl p-5 lg:p-6 transition-all duration-300 h-full",
                  isActive
                    ? "border-[#00C2D8] shadow-xl -translate-y-1"
                    : "border-border hover:border-border/80"
                )}>
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-r flex items-center justify-center mb-4 transition-all duration-300",
                    agent.color,
                    isActive && "scale-110"
                  )}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold mb-1">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute top-3 right-3">
                      <Zap className="h-4 w-4 text-[#FF8A00] animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Brain Visualization */}
        <div className="mt-12 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] flex items-center justify-center animate-pulse shadow-2xl shadow-[#0B3D91]/30">
              <Brain className="h-12 w-12 text-white" />
            </div>
            {/* Orbiting dots */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-[#00C2D8]"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 60}deg) translateX(60px) translateY(-50%)`,
                  animation: `orbit 8s linear infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(60px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(60px) rotate(-360deg);
          }
        }
      `}</style>
    </section>
  );
};
