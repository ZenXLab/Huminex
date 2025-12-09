import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ArrowRight,
  ArrowLeft,
  Zap,
  Brain,
  Shield,
  Globe,
  Mic,
  Eye,
  Code,
  TrendingUp,
  Users,
  Star,
  Crown,
  Layers,
  BarChart3,
  Network,
  Cpu,
  LineChart,
  Target,
  CheckCircle,
  MousePointerClick,
  Gauge,
  Workflow,
  MessageSquare,
  Settings,
  Plug,
  GitBranch,
  Database,
  Sparkles,
  Lightbulb,
  BookOpen,
  Play,
  Clock,
  Building2,
  FileCode,
  Boxes,
  Fingerprint,
  Lock,
  Rocket,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NetworkBackground } from "@/components/NetworkBackground";

// Feature sections with detailed documentation
const featureSections = [
  {
    id: "capture-engine",
    title: "Capture Engine",
    icon: MousePointerClick,
    color: "from-blue-500 to-cyan-500",
    tagline: "Zero-configuration event capture that just works",
    description: "TRACEFLOW's Capture Engine automatically records every user interaction without requiring manual event tagging. Our proprietary technology ensures pixel-perfect session replay while maintaining blazing-fast performance.",
    whyItMatters: [
      "Save 100+ engineering hours by eliminating manual event tagging",
      "Never miss critical user interactions that traditional analytics overlook",
      "Capture the full context of user behavior, not just predefined events"
    ],
    useCases: [
      {
        title: "E-Commerce Checkout Optimization",
        description: "Identify exactly where users abandon carts without setting up funnel events manually.",
        metric: "32% conversion increase"
      },
      {
        title: "SaaS Onboarding Analysis",
        description: "Understand new user journeys from signup to activation without engineering effort.",
        metric: "58% faster onboarding"
      },
      {
        title: "Mobile App UX Research",
        description: "Capture touch gestures, swipes, and pinch-zoom behaviors automatically.",
        metric: "4x more insights"
      }
    ],
    technicalSpecs: [
      "< 50ms capture latency",
      "< 2KB SDK footprint (gzipped)",
      "Automatic PII masking",
      "Cross-domain session stitching",
      "Native mobile SDK (iOS/Android)"
    ],
    liveDemo: {
      title: "Real-time Event Stream",
      events: ["click", "scroll", "input", "navigation", "rage_click", "dead_click"]
    }
  },
  {
    id: "session-intelligence",
    title: "Session Intelligence",
    icon: Eye,
    color: "from-purple-500 to-pink-500",
    tagline: "AI-powered session analysis that thinks like a human",
    description: "Our Multi-LLM NeuroRouter analyzes every session using specialized AI models, generating human-readable summaries, detecting frustration patterns, and suggesting fixes — all automatically.",
    whyItMatters: [
      "Reduce session review time from 4 hours to 45 minutes with AI summaries",
      "Automatically prioritize sessions with the highest frustration signals",
      "Get actionable fix suggestions linked directly to your codebase"
    ],
    useCases: [
      {
        title: "Support Ticket Triage",
        description: "Instantly link customer complaints to relevant session replays with AI-matched context.",
        metric: "70% faster resolution"
      },
      {
        title: "Bug Reproduction",
        description: "Skip hours of debugging — AI pinpoints exact steps and code paths that caused issues.",
        metric: "85% less debug time"
      },
      {
        title: "Product Feedback Analysis",
        description: "Correlate user feedback with actual behavior to validate qualitative insights.",
        metric: "3x more actionable insights"
      }
    ],
    technicalSpecs: [
      "Multi-LLM NeuroRouter (DeepSeek, Gemini, Claude, GPT)",
      "Real-time frustration scoring",
      "Auto-generated session titles",
      "Code-level fix suggestions",
      "Jira/Linear auto-ticketing"
    ],
    liveDemo: {
      title: "AI Session Summary",
      content: "User attempted checkout 3 times. Payment failed due to timeout on /api/payment (avg 8.2s response). Frustration detected: 2 rage clicks on 'Submit' button. Suggested fix: Implement retry logic in PaymentService.js line 142."
    }
  },
  {
    id: "ux-intelligence",
    title: "UX Intelligence",
    icon: Layers,
    color: "from-emerald-500 to-teal-500",
    tagline: "Visual diagnostics that find what humans miss",
    description: "TRACEFLOW's UX Intelligence automatically scans your application for visual inconsistencies, slow-rendering elements, and accessibility issues using computer vision AI.",
    whyItMatters: [
      "Catch UI bugs before users report them with automated visual scanning",
      "Identify slow-loading elements that hurt conversion rates",
      "Ensure design system consistency across your entire application"
    ],
    useCases: [
      {
        title: "Design System Compliance",
        description: "Automatically detect deviations from your design system across 100s of pages.",
        metric: "23 UI inconsistencies found"
      },
      {
        title: "Performance Hotspots",
        description: "Find elements that render slowly and cause layout shifts.",
        metric: "40% LCP improvement"
      },
      {
        title: "Accessibility Auditing",
        description: "Continuous accessibility scanning with WCAG compliance scoring.",
        metric: "100% WCAG 2.1 AA"
      }
    ],
    technicalSpecs: [
      "Gemini Vision-powered analysis",
      "Real-time heatmap generation",
      "Layout shift detection",
      "Color contrast checking",
      "Component-level performance scoring"
    ],
    liveDemo: {
      title: "Visual Heatmap",
      type: "heatmap"
    }
  },
  {
    id: "journey-intelligence",
    title: "Journey Intelligence",
    icon: Workflow,
    color: "from-amber-500 to-orange-500",
    tagline: "Understand WHY users drop off, not just WHERE",
    description: "The Journey Causality Engine goes beyond traditional funnel analysis. It uses statistical inference to determine the actual causes of drop-offs and predicts the impact of UX changes before you implement them.",
    whyItMatters: [
      "Stop guessing why users abandon — get statistically validated causes",
      "Simulate the conversion impact of proposed changes before building",
      "Auto-discover hidden user paths you didn't know existed"
    ],
    useCases: [
      {
        title: "Checkout Funnel Optimization",
        description: "Identify that shipping cost display causes 40% of cart abandonments, not the checkout form.",
        metric: "₹2.3Cr revenue recovered"
      },
      {
        title: "Feature Adoption Analysis",
        description: "Understand which user paths lead to feature discovery and activation.",
        metric: "2.4x feature adoption"
      },
      {
        title: "Churn Prevention",
        description: "Predict users likely to churn based on behavioral patterns.",
        metric: "35% churn reduction"
      }
    ],
    technicalSpecs: [
      "Causal inference modeling",
      "Predictive impact simulation",
      "Auto-funnel discovery",
      "Cohort-based analysis",
      "Statistical confidence scoring"
    ],
    liveDemo: {
      title: "Causality Analysis",
      type: "funnel"
    }
  },
  {
    id: "observability",
    title: "Observability Layer",
    icon: Network,
    color: "from-indigo-500 to-violet-500",
    tagline: "Connect user frustration to backend root causes",
    description: "TRACEFLOW bridges the gap between frontend experience and backend performance. Using OpenTelemetry-powered distributed tracing, we correlate user sessions with service performance, API latency, and infrastructure health.",
    whyItMatters: [
      "Stop finger-pointing between frontend and backend teams",
      "See the complete picture: user click → API call → database query",
      "Identify infrastructure issues before they impact user experience"
    ],
    useCases: [
      {
        title: "API Performance Correlation",
        description: "Link slow user experiences to specific slow API endpoints and database queries.",
        metric: "60% faster MTTR"
      },
      {
        title: "Microservices Debugging",
        description: "Trace user actions through complex microservice architectures.",
        metric: "Complete visibility"
      },
      {
        title: "Infrastructure Impact Analysis",
        description: "Understand how infrastructure changes affect user experience.",
        metric: "Proactive alerting"
      }
    ],
    technicalSpecs: [
      "OpenTelemetry native integration",
      "Distributed trace correlation",
      "Service dependency mapping",
      "Latency percentile tracking",
      "Git commit correlation"
    ],
    liveDemo: {
      title: "Service Trace",
      type: "trace"
    }
  },
  {
    id: "ai-operations",
    title: "AI Operations",
    icon: Brain,
    color: "from-rose-500 to-red-500",
    tagline: "Multi-agent AI system that works while you sleep",
    description: "The TRACEFLOW AI Operations layer deploys multiple specialized AI agents that continuously analyze, diagnose, and even auto-remediate experience issues. Our NeuroRouter intelligently assigns tasks to the best-suited AI model.",
    whyItMatters: [
      "24/7 automated experience monitoring without human intervention",
      "Multi-LLM architecture ensures best-in-class analysis for each task",
      "Auto-ticketing and fix suggestions accelerate resolution cycles"
    ],
    useCases: [
      {
        title: "Automated Issue Detection",
        description: "AI agents continuously scan for anomalies and alert teams before users complain.",
        metric: "90% issues caught proactively"
      },
      {
        title: "Self-Healing Recommendations",
        description: "Generate code-level fix suggestions with confidence scores.",
        metric: "3x faster fixes"
      },
      {
        title: "Intelligent Prioritization",
        description: "AI ranks issues by business impact, not just frequency.",
        metric: "Focus on what matters"
      }
    ],
    technicalSpecs: [
      "DeepSeek for complex reasoning",
      "Gemini for visual analysis",
      "Claude for code suggestions",
      "GPT for general tasks",
      "Automatic model selection via NeuroRouter"
    ],
    liveDemo: {
      title: "NeuroRouter Status",
      type: "neurorouter"
    }
  }
];

// Animated background orbs
const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-gradient-to-br from-[#0B3D91]/20 to-[#00C2D8]/20 blur-3xl"
        style={{
          width: `${200 + i * 100}px`,
          height: `${200 + i * 100}px`,
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20 + i * 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 2,
        }}
        initial={{
          left: `${10 + i * 15}%`,
          top: `${5 + i * 12}%`,
        }}
      />
    ))}
  </div>
);

// Live event stream animation
const LiveEventStream = ({ events }: { events: string[] }) => {
  const [visibleEvents, setVisibleEvents] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setVisibleEvents(prev => [...prev.slice(-5), randomEvent]);
    }, 800);
    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-emerald-400">Live Event Stream</span>
        <span className="text-slate-500 ml-auto">2,847 events/sec</span>
      </div>
      <AnimatePresence mode="popLayout">
        {visibleEvents.map((event, i) => (
          <motion.div
            key={`${event}-${i}-${Date.now()}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-3 py-1"
          >
            <span className="text-slate-500">{new Date().toLocaleTimeString()}</span>
            <span className={cn(
              "px-2 py-0.5 rounded text-xs",
              event === "rage_click" ? "bg-red-500/20 text-red-400" :
              event === "dead_click" ? "bg-amber-500/20 text-amber-400" :
              "bg-blue-500/20 text-blue-400"
            )}>
              {event}
            </span>
            <span className="text-slate-400">/checkout/payment</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Heatmap visualization
const HeatmapVisualization = () => {
  return (
    <div className="relative bg-slate-900 rounded-xl p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
        <Eye className="w-4 h-4 text-emerald-400" />
        <span className="text-emerald-400 font-mono text-sm">UX Heatmap Analysis</span>
      </div>
      <div className="relative h-48 bg-slate-800 rounded-lg overflow-hidden">
        {/* Simulated heatmap hotspots */}
        {[
          { x: 20, y: 30, intensity: 0.9, size: 60 },
          { x: 50, y: 60, intensity: 0.7, size: 80 },
          { x: 75, y: 25, intensity: 0.5, size: 50 },
          { x: 35, y: 80, intensity: 0.8, size: 70 },
        ].map((spot, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: spot.size,
              height: spot.size,
              background: `radial-gradient(circle, rgba(239,68,68,${spot.intensity}) 0%, rgba(239,68,68,0) 70%)`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        <div className="absolute bottom-2 left-2 flex items-center gap-2 text-xs text-slate-400">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-red-500" />
          <span>Low → High engagement</span>
        </div>
      </div>
    </div>
  );
};

// Funnel visualization
const FunnelVisualization = () => {
  const stages = [
    { name: "Homepage", value: 100, users: "12,450" },
    { name: "Product Page", value: 72, users: "8,964" },
    { name: "Add to Cart", value: 45, users: "5,603" },
    { name: "Checkout", value: 28, users: "3,486" },
    { name: "Purchase", value: 18, users: "2,241" },
  ];

  return (
    <div className="bg-slate-900 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
        <TrendingUp className="w-4 h-4 text-amber-400" />
        <span className="text-amber-400 font-mono text-sm">Conversion Funnel</span>
      </div>
      <div className="space-y-2">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-slate-400 text-xs w-24 truncate">{stage.name}</span>
            <div className="flex-1 h-6 bg-slate-800 rounded overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-end px-2"
                initial={{ width: 0 }}
                animate={{ width: `${stage.value}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
              >
                <span className="text-xs text-white font-medium">{stage.value}%</span>
              </motion.div>
            </div>
            <span className="text-slate-500 text-xs w-16 text-right">{stage.users}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-slate-700 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-xs text-amber-400">AI Insight: Shipping cost display causes 40% drop at Checkout</span>
      </div>
    </div>
  );
};

// NeuroRouter visualization
const NeuroRouterVisualization = () => {
  const [activeModel, setActiveModel] = useState(0);
  const models = [
    { name: "DeepSeek", task: "Complex Reasoning", status: "processing" },
    { name: "Gemini 2.5", task: "Visual Analysis", status: "idle" },
    { name: "Claude 4", task: "Code Review", status: "idle" },
    { name: "GPT-5", task: "General Tasks", status: "idle" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModel(prev => (prev + 1) % models.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
        <Brain className="w-4 h-4 text-rose-400" />
        <span className="text-rose-400 font-mono text-sm">NeuroRouter Status</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {models.map((model, i) => (
          <motion.div
            key={model.name}
            className={cn(
              "p-3 rounded-lg border transition-all",
              activeModel === i 
                ? "border-rose-500 bg-rose-500/10" 
                : "border-slate-700 bg-slate-800"
            )}
            animate={{
              scale: activeModel === i ? 1.02 : 1,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                activeModel === i ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
              )} />
              <span className="text-xs font-medium text-white">{model.name}</span>
            </div>
            <span className="text-[10px] text-slate-500">{model.task}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-400">
        <span className="text-rose-400">Active Task:</span> Analyzing session #28472 for frustration patterns
      </div>
    </div>
  );
};

// Service trace visualization
const TraceVisualization = () => {
  const spans = [
    { name: "User Click", duration: "2ms", indent: 0, color: "bg-blue-500" },
    { name: "API Gateway", duration: "45ms", indent: 1, color: "bg-purple-500" },
    { name: "Auth Service", duration: "12ms", indent: 2, color: "bg-emerald-500" },
    { name: "Payment Service", duration: "820ms", indent: 2, color: "bg-red-500" },
    { name: "Database Query", duration: "650ms", indent: 3, color: "bg-amber-500" },
    { name: "Response", duration: "8ms", indent: 1, color: "bg-cyan-500" },
  ];

  return (
    <div className="bg-slate-900 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
        <Network className="w-4 h-4 text-indigo-400" />
        <span className="text-indigo-400 font-mono text-sm">Distributed Trace</span>
      </div>
      <div className="space-y-1">
        {spans.map((span, i) => (
          <motion.div
            key={span.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2"
            style={{ paddingLeft: span.indent * 16 }}
          >
            <div className={cn("w-2 h-2 rounded-full", span.color)} />
            <span className="text-xs text-slate-300 flex-1">{span.name}</span>
            <span className={cn(
              "text-xs font-mono",
              span.duration.includes("820") || span.duration.includes("650") ? "text-red-400" : "text-slate-500"
            )}>
              {span.duration}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-red-400" />
        <span className="text-xs text-red-400">Bottleneck: Payment Service → Database Query</span>
      </div>
    </div>
  );
};

export default function TraceflowHowItWorks() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <NetworkBackground />
      <FloatingOrbs />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/traceflow" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF8A00] rounded-full flex items-center justify-center">
                  <Crown className="h-2 w-2 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-none bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">
                  TRACEFLOW
                </span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">How It Works</span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/traceflow">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/traceflow/login">
                <Button size="sm" className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white">
                  Request Demo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-gradient-to-r from-[#0B3D91]/10 to-[#00C2D8]/10 text-[#0B3D91] border-[#0B3D91]/20">
              <BookOpen className="h-3 w-3 mr-1" />
              Complete Documentation
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              How <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">TRACEFLOW</span> Works
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Deep dive into every feature with live demonstrations, real-world use cases, and technical specifications. 
              Understand why leading enterprises choose TRACEFLOW for their digital experience intelligence.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="py-2 px-4">
                <Clock className="h-3 w-3 mr-2" />
                15 min read
              </Badge>
              <Badge variant="outline" className="py-2 px-4">
                <Boxes className="h-3 w-3 mr-2" />
                6 Core Modules
              </Badge>
              <Badge variant="outline" className="py-2 px-4">
                <Play className="h-3 w-3 mr-2" />
                Live Demos
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 border-y border-border bg-muted/30 sticky top-16 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {featureSections.map((section, i) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(i);
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all",
                    activeSection === i
                      ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white shadow-lg"
                      : "bg-background hover:bg-muted border border-border"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <div className="py-16">
        {featureSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <section
              key={section.id}
              id={section.id}
              className={cn(
                "py-16 lg:py-24",
                sectionIndex % 2 === 1 ? "bg-muted/30" : ""
              )}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                      section.color
                    )}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <Badge className="mb-1 bg-gradient-to-r from-[#0B3D91]/10 to-[#00C2D8]/10 text-[#0B3D91] border-[#0B3D91]/20">
                        Module {sectionIndex + 1}
                      </Badge>
                      <h2 className="text-3xl font-bold">{section.title}</h2>
                    </div>
                  </div>
                  <p className="text-xl text-[#0B3D91] font-medium mb-4">{section.tagline}</p>
                  <p className="text-muted-foreground max-w-3xl">{section.description}</p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Left Column - Content */}
                  <div className="space-y-8">
                    {/* Why It Matters */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        Why It Matters
                      </h3>
                      <div className="space-y-3">
                        {section.whyItMatters.map((point, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20"
                          >
                            <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{point}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Use Cases */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-[#0B3D91]" />
                        Real-World Use Cases
                      </h3>
                      <div className="space-y-4">
                        {section.useCases.map((useCase, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                              <div className={cn("h-1 bg-gradient-to-r", section.color)} />
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <h4 className="font-semibold mb-1">{useCase.title}</h4>
                                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                                  </div>
                                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 whitespace-nowrap">
                                    {useCase.metric}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Technical Specs */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileCode className="h-5 w-5 text-purple-500" />
                        Technical Specifications
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {section.technicalSpecs.map((spec, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="py-1.5 px-3 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300"
                          >
                            <Code className="h-3 w-3 mr-1.5" />
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column - Live Demo */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:sticky lg:top-40 lg:self-start"
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Play className="h-5 w-5 text-emerald-500" />
                      Live Demo
                    </h3>
                    {section.liveDemo.type === "heatmap" ? (
                      <HeatmapVisualization />
                    ) : section.liveDemo.type === "funnel" ? (
                      <FunnelVisualization />
                    ) : section.liveDemo.type === "neurorouter" ? (
                      <NeuroRouterVisualization />
                    ) : section.liveDemo.type === "trace" ? (
                      <TraceVisualization />
                    ) : section.liveDemo.events ? (
                      <LiveEventStream events={section.liveDemo.events} />
                    ) : (
                      <div className="bg-slate-900 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
                          <Brain className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-400 font-mono text-sm">{section.liveDemo.title}</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed font-mono">
                          {section.liveDemo.content}
                        </p>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#0B3D91]/10 to-[#00C2D8]/10 border border-[#0B3D91]/20">
                      <p className="text-sm text-muted-foreground mb-3">
                        See {section.title} in action with your own data
                      </p>
                      <Link to="/traceflow/login">
                        <Button className="w-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white">
                          Start Free Trial
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#0B3D91] via-[#0B3D91] to-[#00C2D8] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${80 + Math.random() * 20}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-0">
              <Rocket className="h-3 w-3 mr-1" />
              Ready to Transform Your Experience?
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Start Understanding Your Users Today
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join hundreds of companies using TRACEFLOW to capture every signal, 
              diagnose every issue, and deliver exceptional digital experiences.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/traceflow/login">
                <Button size="lg" className="bg-white text-[#0B3D91] hover:bg-white/90 shadow-xl">
                  Request Enterprise Demo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/traceflow">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Back to Overview
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">
                © 2024 CropXon Innovations. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/traceflow" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
