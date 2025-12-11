import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Server,
  Brain,
  Workflow,
  Video,
  Network,
  Shield,
  Cloud,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
  {
    id: "capture",
    title: "Capture Engine",
    subtitle: "SDK",
    description: "Auto-capture every interaction",
    icon: Smartphone,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "runner",
    title: "DXI Runner",
    subtitle: "Hybrid Ingestion",
    description: "On-prem event processing",
    icon: Server,
    color: "from-cyan-500 to-teal-500",
  },
  {
    id: "proxima",
    title: "PROXIMA AI",
    subtitle: "Multi-Agent",
    description: "Intelligent analysis engine",
    icon: Brain,
    color: "from-[#0B3D91] to-[#00C2D8]",
  },
  {
    id: "temporal",
    title: "Temporal Engine",
    subtitle: "Workflow",
    description: "Durable orchestration layer",
    icon: Workflow,
    color: "from-emerald-500 to-green-500",
  },
  {
    id: "replay",
    title: "Replay Infra",
    subtitle: "Session",
    description: "Pixel-perfect recordings",
    icon: Video,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "observability",
    title: "Observability",
    subtitle: "Fusion",
    description: "OTel-powered correlation",
    icon: Network,
    color: "from-indigo-500 to-violet-500",
  },
  {
    id: "security",
    title: "Security Suite",
    subtitle: "Governance",
    description: "Zero-trust controls",
    icon: Shield,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "deployment",
    title: "Hybrid Layer",
    subtitle: "Deployment",
    description: "Cloud, on-prem, air-gapped",
    icon: Cloud,
    color: "from-rose-500 to-red-500",
  },
  {
    id: "automation",
    title: "Automation",
    subtitle: "Engine",
    description: "Ticket & workflow triggers",
    icon: Zap,
    color: "from-yellow-500 to-amber-500",
  },
];

export const ModulesGrid = () => {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#0B3D91]/10 text-[#0B3D91] border-[#0B3D91]/20">
            Platform OS
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Modular <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">Intelligence Modules</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade components designed for mission-critical deployments.
          </p>
        </div>

        {/* 3x3 Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            const isHovered = hoveredModule === module.id;

            return (
              <div
                key={module.id}
                className="relative group"
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                {/* Glow Effect */}
                <div 
                  className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 blur-xl transition-opacity duration-500 -z-10",
                    module.color,
                    isHovered && "opacity-20"
                  )} 
                />

                <div className={cn(
                  "relative bg-card border rounded-2xl p-6 transition-all duration-300 h-full",
                  isHovered 
                    ? "border-[#00C2D8] shadow-xl -translate-y-1" 
                    : "border-border hover:border-border/80"
                )}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-r flex items-center justify-center transition-transform duration-300",
                      module.color,
                      isHovered && "scale-110 rotate-3"
                    )}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-[10px] border-border/50">
                      {module.subtitle}
                    </Badge>
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-1">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>

                  {/* Hover Indicator */}
                  <div className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r rounded-full transition-all duration-300",
                    module.color,
                    isHovered ? "w-16 opacity-100" : "w-0 opacity-0"
                  )} />

                  {/* Corner Accent */}
                  <div className={cn(
                    "absolute top-0 right-0 w-16 h-16 opacity-0 transition-opacity duration-300",
                    isHovered && "opacity-10"
                  )}>
                    <div className={cn(
                      "absolute top-0 right-0 w-full h-full bg-gradient-to-br rounded-bl-[100%]",
                      module.color
                    )} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
