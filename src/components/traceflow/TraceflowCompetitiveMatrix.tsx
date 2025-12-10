import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Shield,
  Brain,
  Zap,
  Globe,
  Server,
  Eye,
  Mic,
  Video,
  Network,
  Bot,
  Code,
  TrendingUp,
  Users,
  Workflow,
  Layers,
  ChevronRight,
  Crown,
  MousePointerClick,
  ChartColumn,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

// Legend: ✔ = full, △ = partial, ✘ = none
type SupportLevel = "full" | "partial" | "none";

interface CompetitorData {
  name: string;
  category: string;
  market: string;
  strengths: string[];
  weaknesses: string[];
}

interface FeatureComparison {
  feature: string;
  traceflow: SupportLevel;
  fullstory: SupportLevel;
  glassbox: SupportLevel;
  contentsquare: SupportLevel;
  logrocket: SupportLevel;
  quantum: SupportLevel;
  highlight: SupportLevel;
}

interface TraceflowAdvantage {
  title: string;
  description: string;
  icon: LucideIcon;
  competitors: string;
  gradient: string;
}

// Direct competitors data
const directCompetitors: CompetitorData[] = [
  {
    name: "Glassbox",
    category: "DXI + Session Replay",
    market: "Enterprise BFSI",
    strengths: ["Strong analytics", "PII controls", "On-prem option"],
    weaknesses: ["No multi-agent AI", "No Temporal workflows", "Weak developer insights", "No WebRTC live replay"]
  },
  {
    name: "Contentsquare",
    category: "DXI + UX Analytics",
    market: "Enterprise",
    strengths: ["Heatmaps", "UX patterns", "Journey analytics"],
    weaknesses: ["Expensive pricing", "No AI RCA", "No backend correlation", "No voice capture"]
  },
  {
    name: "FullStory",
    category: "Session Replay + DXI",
    market: "Mid-market → Enterprise",
    strengths: ["Smooth replay", "Frustration metrics", "Good UI"],
    weaknesses: ["No privacy-safe on-prem", "Weak AI analytics", "No multi-agent system", "Limited integrations"]
  },
  {
    name: "Quantum Metric",
    category: "DXI + Product Insights",
    market: "Enterprise",
    strengths: ["Strong funnels", "Anomaly detection", "Enterprise focus"],
    weaknesses: ["No multi-agent AI", "No Temporal orchestration", "No voice fusion", "Limited developer tools"]
  },
  {
    name: "LogRocket",
    category: "Session Replay + Dev Tooling",
    market: "SMB → Mid",
    strengths: ["Great dev insights", "Console logging", "Network tracking"],
    weaknesses: ["Not enterprise/BFSI ready", "No AI analysis", "No on-prem option", "Limited scalability"]
  },
  {
    name: "Highlight.io",
    category: "Open-source Replay",
    market: "SMB",
    strengths: ["Open source", "Fast growing", "Self-hosted"],
    weaknesses: ["No enterprise features", "No AI capabilities", "No RCA engine", "Limited support"]
  }
];

// Core Session Replay Features
const sessionReplayFeatures: FeatureComparison[] = [
  { feature: "Session Replay", traceflow: "full", fullstory: "full", glassbox: "full", contentsquare: "partial", logrocket: "full", quantum: "full", highlight: "full" },
  { feature: "DOM Snapshots", traceflow: "full", fullstory: "full", glassbox: "full", contentsquare: "partial", logrocket: "full", quantum: "full", highlight: "full" },
  { feature: "Rage/Dead Click Detection", traceflow: "full", fullstory: "partial", glassbox: "full", contentsquare: "full", logrocket: "full", quantum: "full", highlight: "partial" },
  { feature: "Network Tracing", traceflow: "full", fullstory: "full", glassbox: "full", contentsquare: "none", logrocket: "full", quantum: "partial", highlight: "partial" },
  { feature: "Console Logs Capture", traceflow: "full", fullstory: "full", glassbox: "full", contentsquare: "none", logrocket: "full", quantum: "partial", highlight: "full" },
  { feature: "Mobile Replay", traceflow: "full", fullstory: "partial", glassbox: "full", contentsquare: "partial", logrocket: "partial", quantum: "full", highlight: "none" },
  { feature: "Real-time Live View (WebRTC)", traceflow: "full", fullstory: "none", glassbox: "none", contentsquare: "none", logrocket: "none", quantum: "partial", highlight: "none" },
  { feature: "Audio/Voice Capture", traceflow: "full", fullstory: "none", glassbox: "none", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "none" }
];

// AI Capabilities
const aiCapabilities: FeatureComparison[] = [
  { feature: "AI Session Summary", traceflow: "full", fullstory: "none", glassbox: "partial", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "none" },
  { feature: "Multi-Agent Root Cause Analysis", traceflow: "full", fullstory: "none", glassbox: "partial", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "none" },
  { feature: "Causality Graph", traceflow: "full", fullstory: "none", glassbox: "none", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "none" },
  { feature: "Multi-Agent AI Pipelines", traceflow: "full", fullstory: "none", glassbox: "none", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "none" },
  { feature: "Auto-Ticketing (Jira/GitHub)", traceflow: "full", fullstory: "none", glassbox: "none", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "none" },
  { feature: "Vision Model UI Analysis", traceflow: "full", fullstory: "none", glassbox: "none", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "none" },
  { feature: "AI Fix Recommendations", traceflow: "full", fullstory: "none", glassbox: "partial", contentsquare: "partial", logrocket: "none", quantum: "none", highlight: "none" }
];

// Enterprise & Compliance
const enterpriseFeatures: FeatureComparison[] = [
  { feature: "On-Premise Deployment", traceflow: "full", fullstory: "none", glassbox: "full", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "partial" },
  { feature: "Hybrid Deployment", traceflow: "full", fullstory: "none", glassbox: "full", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "none" },
  { feature: "Air-Gapped Mode", traceflow: "full", fullstory: "none", glassbox: "partial", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "none" },
  { feature: "Local PII Tokenization", traceflow: "full", fullstory: "none", glassbox: "full", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "none" },
  { feature: "Data Residency Options", traceflow: "full", fullstory: "partial", glassbox: "partial", contentsquare: "partial", logrocket: "none", quantum: "partial", highlight: "none" },
  { feature: "SOC2 Ready", traceflow: "full", fullstory: "full", glassbox: "full", contentsquare: "full", logrocket: "full", quantum: "full", highlight: "partial" }
];

// Developer Features
const developerFeatures: FeatureComparison[] = [
  { feature: "Backend Correlation (API → UI)", traceflow: "full", fullstory: "none", glassbox: "partial", contentsquare: "none", logrocket: "full", quantum: "partial", highlight: "none" },
  { feature: "Logs + Replay Fusion", traceflow: "full", fullstory: "none", glassbox: "none", contentsquare: "none", logrocket: "partial", quantum: "none", highlight: "none" },
  { feature: "OpenTelemetry Traces", traceflow: "full", fullstory: "none", glassbox: "none", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "none" },
  { feature: "Temporal Workflow Orchestration", traceflow: "full", fullstory: "none", glassbox: "none", contentsquare: "none", logrocket: "none", quantum: "none", highlight: "none" },
  { feature: "Source Maps Support", traceflow: "full", fullstory: "full", glassbox: "full", contentsquare: "partial", logrocket: "full", quantum: "full", highlight: "full" },
  { feature: "Experience-to-Code Linking", traceflow: "full", fullstory: "none", glassbox: "none", contentsquare: "none", logrocket: "partial", quantum: "none", highlight: "none" }
];

// TRACEFLOW unique advantages
const traceflowAdvantages: TraceflowAdvantage[] = [
  {
    title: "Multi-Agent AI Intelligence",
    description: "The only DXI platform with multi-modal AI, multi-agent RCA, automated code-fix suggestions, causality graphs, and Temporal-powered orchestration.",
    icon: Brain,
    competitors: "No competitor has multi-agent AI orchestration",
    gradient: "from-purple-500 to-indigo-600"
  },
  {
    title: "Enterprise-Ready Runner",
    description: "Full on-premise deployment with local PII tokenization, Redis buffering, and zero raw data leaving your network. Built for BFSI/Insurance/Healthcare.",
    icon: Server,
    competitors: "Only Glassbox has partial on-prem. Everyone else: cloud-only",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    title: "Real-Time WebRTC Live Replay",
    description: "Watch user sessions live with ultra-low latency WebRTC streaming. Audio capture, tokenization at edge, and real-time anomaly detection.",
    icon: Video,
    competitors: "No competitor offers live WebRTC replay with audio",
    gradient: "from-rose-500 to-pink-600"
  },
  {
    title: "Hybrid & Air-Gapped Ready",
    description: "Deploy in SaaS, hybrid, fully on-prem, or air-gapped environments. Unlock banks, insurance, NBFCs, government, and healthcare markets.",
    icon: Shield,
    competitors: "FullStory/Contentsquare cannot enter these markets",
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    title: "Intelligent AI Cost Routing",
    description: "NeuroRouter delivers lower cost, higher accuracy, fallback resilience, and multi-model fusion across DeepSeek, Gemini, Claude, and GPT.",
    icon: Zap,
    competitors: "Single-provider AI = higher cost, no failover",
    gradient: "from-amber-500 to-orange-600"
  }
];

// Feature category icons for the tabs
const featureCategoryIcons = {
  session: MousePointerClick,
  ai: Brain,
  enterprise: Shield,
  developer: Code
};

const SupportIcon = ({ level }: { level: SupportLevel }) => {
  switch (level) {
    case "full":
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case "partial":
      return <MinusCircle className="h-5 w-5 text-amber-500" />;
    case "none":
      return <XCircle className="h-5 w-5 text-red-400/60" />;
  }
};

const CompetitorCard = ({ competitor, index }: { competitor: CompetitorData; index: number }) => (
  <Card 
    className="group relative overflow-hidden border-border/50 hover:border-[#0B3D91]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#0B3D91]/5"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/5 to-transparent" />
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-foreground">{competitor.name}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">{competitor.category}</p>
        </div>
        <Badge variant="outline" className="text-[10px] border-border/50">
          {competitor.market}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Strengths - Faded */}
      <div>
        <p className="text-xs font-medium text-muted-foreground/70 mb-2">Strengths</p>
        <ul className="space-y-1">
          {competitor.strengths.map((strength, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground/60">
              <CheckCircle2 className="h-3 w-3 text-emerald-400/50 mt-0.5 shrink-0" />
              {strength}
            </li>
          ))}
        </ul>
      </div>
      {/* Weaknesses - Bold (TRACEFLOW opportunity) */}
      <div>
        <p className="text-xs font-medium text-[#FF8A00] mb-2 flex items-center gap-1">
          <Crown className="h-3 w-3" />
          TRACEFLOW Advantage
        </p>
        <ul className="space-y-1.5">
          {competitor.weaknesses.map((weakness, i) => (
            <li key={i} className="flex items-start gap-2 text-xs font-semibold text-foreground">
              <XCircle className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
              {weakness}
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
  </Card>
);

const FeatureTable = ({ features, title }: { features: FeatureComparison[]; title: string }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[800px]">
      <thead>
        <tr className="border-b border-border/50">
          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">{title}</th>
          <th className="py-3 px-3 text-center">
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">TRACEFLOW</span>
              <Crown className="h-3 w-3 text-[#FF8A00] mt-0.5" />
            </div>
          </th>
          <th className="py-3 px-3 text-center text-xs font-medium text-muted-foreground">FullStory</th>
          <th className="py-3 px-3 text-center text-xs font-medium text-muted-foreground">Glassbox</th>
          <th className="py-3 px-3 text-center text-xs font-medium text-muted-foreground">Contentsquare</th>
          <th className="py-3 px-3 text-center text-xs font-medium text-muted-foreground">LogRocket</th>
          <th className="py-3 px-3 text-center text-xs font-medium text-muted-foreground">Quantum</th>
          <th className="py-3 px-3 text-center text-xs font-medium text-muted-foreground">Highlight</th>
        </tr>
      </thead>
      <tbody>
        {features.map((row, i) => (
          <tr key={i} className={cn(
            "border-b border-border/30 transition-colors hover:bg-muted/30",
            row.traceflow === "full" && row.fullstory === "none" && row.glassbox === "none" && "bg-emerald-500/5"
          )}>
            <td className="py-3 px-4 text-sm text-foreground">{row.feature}</td>
            <td className="py-3 px-3 text-center bg-[#0B3D91]/5">
              <div className="flex justify-center">
                <SupportIcon level={row.traceflow} />
              </div>
            </td>
            <td className="py-3 px-3 text-center"><div className="flex justify-center"><SupportIcon level={row.fullstory} /></div></td>
            <td className="py-3 px-3 text-center"><div className="flex justify-center"><SupportIcon level={row.glassbox} /></div></td>
            <td className="py-3 px-3 text-center"><div className="flex justify-center"><SupportIcon level={row.contentsquare} /></div></td>
            <td className="py-3 px-3 text-center"><div className="flex justify-center"><SupportIcon level={row.logrocket} /></div></td>
            <td className="py-3 px-3 text-center"><div className="flex justify-center"><SupportIcon level={row.quantum} /></div></td>
            <td className="py-3 px-3 text-center"><div className="flex justify-center"><SupportIcon level={row.highlight} /></div></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const TraceflowCompetitiveMatrix = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <section id="why-traceflow" className="py-20 lg:py-28 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#0B3D91]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#00C2D8]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white border-0 shadow-lg">
            <Crown className="h-3 w-3 mr-1" />
            Why TRACEFLOW
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">The Only</span>{" "}
            <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">DXI OS</span>{" "}
            <span className="text-foreground">Built for Enterprises</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            TRACEFLOW combines session replay, UX analytics, logs, APM context, and multi-agent AI 
            to deliver automatic root-cause analysis, instant insights, and fully on-premise data privacy.
          </p>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 mb-12">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-sm text-muted-foreground">Fully Supported</span>
          </div>
          <div className="flex items-center gap-2">
            <MinusCircle className="h-5 w-5 text-amber-500" />
            <span className="text-sm text-muted-foreground">Partial Support</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-400/60" />
            <span className="text-sm text-muted-foreground">Not Supported</span>
          </div>
        </div>

        {/* Tabs for Feature Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 h-14 bg-muted/50 p-1 rounded-xl mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-lg">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="session" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-lg">
              <MousePointerClick className="h-4 w-4" />
              <span className="hidden sm:inline">Session</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-lg">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
            <TabsTrigger value="enterprise" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-lg">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Enterprise</span>
            </TabsTrigger>
            <TabsTrigger value="developer" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-lg">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Developer</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Competitor Cards */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {directCompetitors.map((competitor, index) => (
                <CompetitorCard key={competitor.name} competitor={competitor} index={index} />
              ))}
            </div>
          </TabsContent>

          {/* Session Replay Tab */}
          <TabsContent value="session" className="mt-0">
            <Card className="border-border/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#0B3D91]/5 to-[#00C2D8]/5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <MousePointerClick className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Session Replay & UX Features</CardTitle>
                    <p className="text-sm text-muted-foreground">Core capture and playback capabilities</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <FeatureTable features={sessionReplayFeatures} title="Feature" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai" className="mt-0">
            <Card className="border-border/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI & Automation Capabilities</CardTitle>
                    <p className="text-sm text-muted-foreground">TRACEFLOW is the clear leader in AI</p>
                  </div>
                  <Badge className="ml-auto bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    #1 in AI
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <FeatureTable features={aiCapabilities} title="AI Capability" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enterprise Tab */}
          <TabsContent value="enterprise" className="mt-0">
            <Card className="border-border/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Enterprise Deployment & Compliance</CardTitle>
                    <p className="text-sm text-muted-foreground">Only fully BFSI-ready platform aside from Glassbox</p>
                  </div>
                  <Badge className="ml-auto bg-blue-500/10 text-blue-600 border-blue-500/20">
                    BFSI Ready
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <FeatureTable features={enterpriseFeatures} title="Enterprise Feature" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Developer Tab */}
          <TabsContent value="developer" className="mt-0">
            <Card className="border-border/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Developer & Engineering Features</CardTitle>
                    <p className="text-sm text-muted-foreground">Deep developer tooling and observability</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <FeatureTable features={developerFeatures} title="Developer Feature" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* TRACEFLOW Unique Advantages */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/20">
              Competitive Moat
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
              Why Enterprises Choose TRACEFLOW
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {traceflowAdvantages.slice(0, 3).map((advantage, index) => (
              <Card 
                key={advantage.title}
                className="group relative overflow-hidden border-border/50 hover:border-[#00C2D8]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#0B3D91]/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
                  advantage.gradient
                )} />
                <CardContent className="pt-8 pb-6 px-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform",
                    advantage.gradient
                  )}>
                    <advantage.icon className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-3">{advantage.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{advantage.description}</p>
                  <div className="flex items-start gap-2 pt-4 border-t border-border/50">
                    <ChevronRight className="h-4 w-4 text-[#FF8A00] mt-0.5 shrink-0" />
                    <p className="text-xs font-medium text-[#FF8A00]">{advantage.competitors}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
            {traceflowAdvantages.slice(3).map((advantage, index) => (
              <Card 
                key={advantage.title}
                className="group relative overflow-hidden border-border/50 hover:border-[#00C2D8]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#0B3D91]/10"
              >
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
                  advantage.gradient
                )} />
                <CardContent className="pt-8 pb-6 px-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform",
                    advantage.gradient
                  )}>
                    <advantage.icon className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-3">{advantage.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{advantage.description}</p>
                  <div className="flex items-start gap-2 pt-4 border-t border-border/50">
                    <ChevronRight className="h-4 w-4 text-[#FF8A00] mt-0.5 shrink-0" />
                    <p className="text-xs font-medium text-[#FF8A00]">{advantage.competitors}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final Positioning Statement */}
        <div className="mt-20 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-[#0B3D91]/5 via-background to-[#00C2D8]/5 border-[#0B3D91]/20 overflow-hidden">
            <CardContent className="py-12 px-8">
              <Crown className="h-12 w-12 text-[#FF8A00] mx-auto mb-6" />
              <blockquote className="text-xl sm:text-2xl font-semibold text-foreground leading-relaxed mb-6">
                "TRACEFLOW is the first Digital Experience Intelligence OS built for enterprises—combining 
                session replay, UX analytics, logs, APM context, and multi-agent AI to deliver automatic 
                root-cause analysis, instant insights, and fully on-premise data privacy."
              </blockquote>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge className="bg-[#0B3D91]/10 text-[#0B3D91] border-[#0B3D91]/20 text-sm px-4 py-1">
                  DXI + RUM + APM
                </Badge>
                <Badge className="bg-[#00C2D8]/10 text-[#00C2D8] border-[#00C2D8]/20 text-sm px-4 py-1">
                  Multi-Agent AI
                </Badge>
                <Badge className="bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/20 text-sm px-4 py-1">
                  Enterprise-Ready
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TraceflowCompetitiveMatrix;
