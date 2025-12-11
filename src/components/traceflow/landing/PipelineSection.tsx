import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Server,
  Database,
  Brain,
  LayoutDashboard,
  Lock,
  Cloud,
  Building2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

const pipelineSteps = [
  { id: "sdk", label: "SDK", sublabel: "Capture", icon: Smartphone, color: "from-blue-500 to-cyan-500" },
  { id: "runner", label: "Runner", sublabel: "Hybrid Ingestion", icon: Server, color: "from-cyan-500 to-teal-500" },
  { id: "streams", label: "Streams", sublabel: "Redis/Upstash", icon: Database, color: "from-teal-500 to-emerald-500" },
  { id: "temporal", label: "Temporal", sublabel: "Orchestration", icon: Brain, color: "from-emerald-500 to-green-500" },
  { id: "proxima", label: "PROXIMA", sublabel: "AI Agents", icon: Brain, color: "from-[#0B3D91] to-[#00C2D8]" },
  { id: "dashboards", label: "Dashboards", sublabel: "Intelligence", icon: LayoutDashboard, color: "from-purple-500 to-pink-500" },
];

const deploymentModes = [
  { id: "hybrid", label: "Hybrid", icon: Cloud, description: "Cloud + On-Prem" },
  { id: "onprem", label: "On-Prem", icon: Building2, description: "Fully Private" },
  { id: "airgapped", label: "Air-Gapped", icon: WifiOff, description: "Zero External" },
];

export const PipelineSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeMode, setActiveMode] = useState(0);
  const [packetPosition, setPacketPosition] = useState(0);

  // Animate data packet flowing through pipeline
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketPosition(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate active step
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % pipelineSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white border-0">
            Enterprise Architecture
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Zero-Trust <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">Intelligence Pipeline</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            End-to-end data flow with PII tokenization, hybrid deployment, and multi-agent AI processing.
          </p>
        </div>

        {/* Pipeline Visualization */}
        <div className="relative mb-12">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#0B3D91]/20 via-[#00C2D8]/30 to-[#FF8A00]/20 -translate-y-1/2 hidden lg:block" />
          
          {/* Animated Data Packet */}
          <div 
            className="absolute top-1/2 w-3 h-3 bg-gradient-to-r from-[#00C2D8] to-[#FF8A00] rounded-full -translate-y-1/2 shadow-lg shadow-[#00C2D8]/50 hidden lg:block z-10"
            style={{ 
              left: `${packetPosition}%`,
              transition: 'left 0.05s linear',
              boxShadow: '0 0 20px rgba(0, 194, 216, 0.6), 0 0 40px rgba(0, 194, 216, 0.3)'
            }}
          />

          {/* Pipeline Steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-2 relative">
            {pipelineSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              
              return (
                <div 
                  key={step.id}
                  className={cn(
                    "relative group cursor-pointer transition-all duration-500",
                    isActive && "scale-105"
                  )}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  {/* Glow Effect */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D91]/20 to-[#00C2D8]/20 rounded-xl blur-xl -z-10" />
                  )}
                  
                  <div className={cn(
                    "relative bg-card border rounded-xl p-4 text-center transition-all duration-300",
                    isActive 
                      ? "border-[#00C2D8] shadow-lg shadow-[#00C2D8]/20" 
                      : "border-border hover:border-[#00C2D8]/50"
                  )}>
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white text-xs flex items-center justify-center font-bold shadow-lg">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className={cn(
                      "w-12 h-12 mx-auto rounded-xl bg-gradient-to-r flex items-center justify-center mb-3 transition-transform duration-300",
                      step.color,
                      isActive && "animate-pulse scale-110"
                    )}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <h3 className="font-semibold text-sm mb-0.5">{step.label}</h3>
                    <p className="text-xs text-muted-foreground">{step.sublabel}</p>

                    {/* PII Tokenization indicator for Runner */}
                    {step.id === "runner" && (
                      <div className="mt-2 flex items-center justify-center gap-1">
                        <Lock className="h-3 w-3 text-emerald-500" />
                        <span className="text-[10px] text-emerald-600 font-medium">PII Tokenized</span>
                      </div>
                    )}

                    {/* Active indicator animation */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] rounded-full" />
                    )}
                  </div>

                  {/* Connection Arrow */}
                  {index < pipelineSteps.length - 1 && (
                    <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                      <div className={cn(
                        "w-4 h-4 border-t-2 border-r-2 rotate-45 transition-colors duration-300",
                        isActive ? "border-[#00C2D8]" : "border-border"
                      )} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Deployment Mode Toggle */}
        <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Deployment Flexibility</h3>
              <p className="text-sm text-muted-foreground">
                Deploy TRACEFLOW anywhere — cloud, on-prem, or air-gapped environments.
              </p>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2 bg-muted/50 p-1.5 rounded-xl">
              {deploymentModes.map((mode, index) => {
                const Icon = mode.icon;
                const isActive = index === activeMode;
                
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(index)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300",
                      isActive 
                        ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white shadow-lg" 
                        : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Details */}
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {deploymentModes.map((mode, index) => {
              const Icon = mode.icon;
              const isActive = index === activeMode;
              
              return (
                <div
                  key={mode.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-300",
                    isActive 
                      ? "border-[#00C2D8] bg-[#00C2D8]/5" 
                      : "border-border/50 opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isActive 
                        ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8]" 
                        : "bg-muted"
                    )}>
                      <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{mode.label}</h4>
                      <p className="text-xs text-muted-foreground">{mode.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
