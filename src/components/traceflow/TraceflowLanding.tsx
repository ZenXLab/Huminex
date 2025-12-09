import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Activity,
  Play,
  ArrowRight,
  Zap,
  Brain,
  GitBranch,
  Shield,
  Globe,
  Mic,
  Eye,
  Code,
  TrendingUp,
  Users,
  ChevronDown,
  Star,
  Crown,
  Menu,
  X,
  Layers,
  BarChart3,
  Network,
  Cpu,
  LineChart,
  Target,
  CheckCircle,
  Building2,
  ShoppingCart,
  Landmark,
  Heart,
  GraduationCap,
  Factory,
  Truck,
  Quote,
  MousePointerClick,
  Gauge,
  Workflow,
  MessageSquare,
  Settings,
  Plug,
  CreditCard,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Feature categories for showcase
const featureCategories = [
  {
    id: "capture",
    title: "Capture Engine",
    icon: MousePointerClick,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Auto Event Capture (zero manual tagging)",
      "Pixel-Perfect Web Replay",
      "Mobile Gesture Capture",
      "Rage & Dead Click Detection",
      "DOM Timeline Tracking"
    ]
  },
  {
    id: "session",
    title: "Session Intelligence",
    icon: Eye,
    color: "from-purple-500 to-pink-500",
    features: [
      "AI Session Summaries",
      "Root Cause Detection",
      "UX Frustration Tags",
      "Key Moments Timeline",
      "Fix Suggestions Linked to Code"
    ]
  },
  {
    id: "ux",
    title: "UX Intelligence",
    icon: Layers,
    color: "from-emerald-500 to-teal-500",
    features: [
      "Heatmaps & Hotspots",
      "Visual UI Breakage Finder",
      "Slow Element Detection",
      "UX DNA Mapping",
      "Design Consistency Analyzer"
    ]
  },
  {
    id: "journey",
    title: "Journey Intelligence",
    icon: Workflow,
    color: "from-amber-500 to-orange-500",
    features: [
      "Auto-Created Funnels",
      "Drop-Off Diagnostics",
      "Causality Engine",
      "Behavioral Intent Scoring",
      "Experiment Simulator"
    ]
  },
  {
    id: "product",
    title: "Product Intelligence",
    icon: BarChart3,
    color: "from-rose-500 to-red-500",
    features: [
      "Feature Usage Analytics",
      "Retention Curves",
      "Churn Prediction",
      "Cohort Analysis",
      "Growth Dashboards"
    ]
  },
  {
    id: "observability",
    title: "Observability Layer",
    icon: Network,
    color: "from-indigo-500 to-violet-500",
    features: [
      "OTel-Powered Traces",
      "Service Map",
      "Experience-to-Code Correlation",
      "Latency Hotspots",
      "API Timeline"
    ]
  }
];

// Case studies data - Investor-grade comprehensive case studies
const caseStudies = [
  {
    id: 1,
    industry: "E-Commerce",
    company: "ShopMax India",
    logo: ShoppingCart,
    metric: "32%",
    metricLabel: "Conversion Increase",
    revenue: "₹2.3Cr",
    revenueLabel: "Monthly Revenue Recovered",
    timeToValue: "6 weeks",
    challenge: "High cart abandonment rate with no visibility into why users dropped off during checkout. Traditional analytics showed WHERE users left but not WHY.",
    solution: "TRACEFLOW's AI Cortex identified payment gateway timeouts causing 68% of abandonments. Session replay + distributed tracing pinpointed the exact API bottleneck. Auto-generated Jira tickets with code-level fix suggestions led to 3-day resolution.",
    results: [
      "32% increase in checkout conversion",
      "68% reduction in payment failures",
      "₹2.3Cr monthly revenue recovered",
      "3-day mean time to resolution"
    ],
    testimonial: "We recovered ₹2.3Cr in monthly revenue within 6 weeks of implementing TRACEFLOW. The AI session summaries saved our support team 20+ hours per week.",
    author: "Priya Sharma",
    role: "VP Product, ShopMax India",
    avatar: "PS",
    companySize: "500+ employees",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 2,
    industry: "FinTech",
    company: "PaySecure Bank",
    logo: Landmark,
    metric: "70%",
    metricLabel: "Faster Issue Resolution",
    revenue: "$1.2M",
    revenueLabel: "Annual Support Cost Savings",
    timeToValue: "4 weeks",
    challenge: "Compliance requirements made debugging slow. Engineers spent 4+ hours watching session replays. Zero-PII requirements blocked most analytics tools.",
    solution: "AI Session Summaries reduced triage time from 4 hours to 45 minutes. Zero-PII tokenization mode ensured GDPR/PCI-DSS compliance while maintaining full behavioral visibility.",
    results: [
      "70% faster issue resolution",
      "4 hours → 45 minutes triage time",
      "100% PCI-DSS compliance maintained",
      "$1.2M annual support cost savings"
    ],
    testimonial: "TRACEFLOW's tokenization-first approach let us stay compliant while getting full visibility. No other tool offered this level of compliance with this level of insight.",
    author: "Rahul Mehta",
    role: "CTO, PaySecure Bank",
    avatar: "RM",
    companySize: "2000+ employees",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    industry: "Healthcare",
    company: "MediCare Plus",
    logo: Heart,
    metric: "45%",
    metricLabel: "Reduced Support Tickets",
    revenue: "28pts",
    revenueLabel: "NPS Score Improvement",
    timeToValue: "8 weeks",
    challenge: "Patients struggling with appointment booking but support couldn't reproduce issues. Voice complaints didn't match logged data. HIPAA compliance required.",
    solution: "Session replay + voice fusion aligned patient complaints with exact user journeys. UX Intelligence auto-detected form accessibility issues affecting elderly users. HIPAA-compliant deployment.",
    results: [
      "45% reduction in support tickets",
      "28-point NPS improvement",
      "23 accessibility issues detected",
      "100% HIPAA compliance"
    ],
    testimonial: "Our patient satisfaction scores jumped 28 points after fixing the issues TRACEFLOW found. The voice + session fusion is revolutionary for understanding patient frustration.",
    author: "Dr. Anita Desai",
    role: "Digital Transformation Head, MediCare Plus",
    avatar: "AD",
    companySize: "5000+ employees",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 4,
    industry: "Education",
    company: "LearnFirst EdTech",
    logo: GraduationCap,
    metric: "58%",
    metricLabel: "Higher Course Completion",
    revenue: "2.4x",
    revenueLabel: "Student Engagement Increase",
    timeToValue: "5 weeks",
    challenge: "Students dropping off mid-course with no insight into why content wasn't engaging. Traditional analytics showed course exit rates but not behavioral causes.",
    solution: "Journey Intelligence mapped complete learning paths. AI identified confusing UI patterns in video player controls and content navigation. Heatmaps revealed ignored UI elements.",
    results: [
      "58% higher course completion",
      "2.4x student engagement increase",
      "12 critical UX issues identified",
      "40% reduction in drop-off"
    ],
    testimonial: "TRACEFLOW showed us exactly where students got frustrated. Course completion doubled after we fixed the video player controls the AI identified.",
    author: "Vikram Singh",
    role: "Founder & CEO, LearnFirst EdTech",
    avatar: "VS",
    companySize: "200+ employees",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: 5,
    industry: "Manufacturing",
    company: "TechFab Industries",
    logo: Factory,
    metric: "89%",
    metricLabel: "Faster Onboarding",
    revenue: "57%",
    revenueLabel: "Adoption Rate Increase",
    timeToValue: "12 weeks",
    challenge: "Internal ERP tool had poor adoption. Employees avoided digital workflows and reverted to paper processes. No visibility into employee struggles.",
    solution: "UX DNA Mapping revealed 23 inconsistent UI patterns confusing users. Component-level anomaly detection found slow-loading modules. AI-generated training recommendations.",
    results: [
      "89% faster employee onboarding",
      "34% → 91% adoption rate",
      "23 UI inconsistencies fixed",
      "₹45L annual productivity gains"
    ],
    testimonial: "Our factory floor adoption went from 34% to 91% in 3 months. TRACEFLOW's UX DNA Mapping found issues we'd been blind to for years.",
    author: "Suresh Kumar",
    role: "IT Director, TechFab Industries",
    avatar: "SK",
    companySize: "3000+ employees",
    color: "from-slate-500 to-zinc-600"
  },
  {
    id: 6,
    industry: "Logistics",
    company: "FastTrack Delivery",
    logo: Truck,
    metric: "4.2x",
    metricLabel: "ROI in 6 Months",
    revenue: "₹1.8Cr",
    revenueLabel: "Annual Cost Savings",
    timeToValue: "3 weeks",
    challenge: "Driver app crashes causing delivery delays. No correlation between app issues and operational impact. Engineering and ops teams blamed each other.",
    solution: "Observability Layer correlated mobile crashes with route failures using OTel-powered distributed tracing. Experience-to-Code linked issues to specific commits and developers.",
    results: [
      "4.2x ROI in 6 months",
      "60% reduction in app crashes",
      "₹1.8Cr annual cost savings",
      "Proactive issue detection"
    ],
    testimonial: "We now fix app issues before they impact deliveries. The experience-to-code correlation ended the blame game between engineering and operations.",
    author: "Deepak Raj",
    role: "VP Technology, FastTrack Delivery",
    avatar: "DR",
    companySize: "8000+ employees",
    color: "from-amber-500 to-yellow-500"
  },
  {
    id: 7,
    industry: "SaaS",
    company: "CloudOps Platform",
    logo: Building2,
    metric: "35%",
    metricLabel: "Churn Reduction",
    revenue: "$2.1M",
    revenueLabel: "ARR Saved",
    timeToValue: "6 weeks",
    challenge: "High churn rate with no visibility into product friction. Customer success team couldn't identify at-risk accounts until too late.",
    solution: "Journey Causality Engine identified that users who skipped onboarding wizard churned 4x more. AI Churn Prediction flagged at-risk accounts 30 days in advance.",
    results: [
      "35% reduction in churn",
      "$2.1M ARR saved annually",
      "30-day churn prediction accuracy",
      "2.3x feature adoption increase"
    ],
    testimonial: "TRACEFLOW's churn prediction saved us $2.1M in ARR. We now proactively reach out to at-risk customers before they even think about leaving.",
    author: "Sarah Chen",
    role: "Chief Customer Officer, CloudOps",
    avatar: "SC",
    companySize: "150+ employees",
    color: "from-violet-500 to-purple-500"
  },
  {
    id: 8,
    industry: "Insurance",
    company: "SecureLife Insurance",
    logo: Shield,
    metric: "52%",
    metricLabel: "Faster Claims Processing",
    revenue: "89%",
    revenueLabel: "Customer Satisfaction",
    timeToValue: "10 weeks",
    challenge: "Digital claims process had high abandonment. Customers called support frustrated. No visibility into mobile app experience.",
    solution: "Mobile gesture capture revealed swipe confusion in claims wizard. AI Session Intelligence auto-summarized support escalations with linked sessions.",
    results: [
      "52% faster claims processing",
      "89% customer satisfaction score",
      "40% reduction in support calls",
      "Mobile-first optimization"
    ],
    testimonial: "TRACEFLOW revealed that our mobile claims wizard was causing 60% of abandonments due to gesture confusion. The fix took 2 days and transformed our metrics.",
    author: "Amit Patel",
    role: "Digital Head, SecureLife Insurance",
    avatar: "AP",
    companySize: "4000+ employees",
    color: "from-indigo-500 to-blue-500"
  }
];

// Testimonials data
const testimonials = [
  {
    quote: "TRACEFLOW is like having 10 senior engineers watching every session. The AI summaries are incredibly accurate.",
    author: "Arjun Patel",
    role: "VP Engineering",
    company: "FinServe Tech",
    rating: 5,
    avatar: "AP"
  },
  {
    quote: "We reduced our mean time to resolution by 70%. The experience-to-code correlation is something we've never seen before.",
    author: "Sarah Chen",
    role: "Director of Product",
    company: "GlobalRetail Inc",
    rating: 5,
    avatar: "SC"
  },
  {
    quote: "The voice + session fusion feature helped us understand why customers were actually frustrated. Revolutionary.",
    author: "Michael Roberts",
    role: "CX Lead",
    company: "TravelEase",
    rating: 5,
    avatar: "MR"
  },
  {
    quote: "Zero-PII mode meant we could deploy in our banking environment. No other tool offered this level of compliance.",
    author: "Priya Sharma",
    role: "CISO",
    company: "SecureBank",
    rating: 5,
    avatar: "PS"
  },
  {
    quote: "Auto-ticketing to Jira saved our team 20+ hours per week. The fix suggestions are actually useful.",
    author: "David Kim",
    role: "Engineering Manager",
    company: "SaaS Platform Co",
    rating: 5,
    avatar: "DK"
  },
  {
    quote: "Journey causality engine showed us WHY users dropped off, not just WHERE. This changed our entire product strategy.",
    author: "Emily Zhang",
    role: "Head of Growth",
    company: "E-Commerce Giant",
    rating: 5,
    avatar: "EZ"
  }
];

// World-first features
const worldFirstFeatures = [
  {
    title: "AI Session Telemetry Fusion",
    description: "Replay → Logs → Code → Fix Suggestion in one click. No other platform connects all signals.",
    icon: Brain
  },
  {
    title: "Voice + Session Fusion",
    description: "User's audio complaint maps to their exact recorded session automatically.",
    icon: Mic
  },
  {
    title: "Journey Causality Engine",
    description: "Not just 'what happened' but 'WHY it happened' with statistical confidence.",
    icon: Workflow
  },
  {
    title: "Experience-to-Code Correlation",
    description: "Link user frustration directly to suspected code files and git commits.",
    icon: Code
  }
];

export const TraceflowLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % featureCategories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Navigation Header */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg" 
          : "bg-background/80 backdrop-blur-lg border-b border-border/40"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex items-center justify-between transition-all duration-300",
            isScrolled ? "h-14" : "h-16"
          )}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
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
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">by CropXon ATLAS</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <a href="#features" className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                How It Works
              </a>
              <a href="#case-studies" className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                Case Studies
              </a>
              <a href="#pricing" className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                Pricing
              </a>
              <Link to="/contact" className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                Contact
              </Link>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/traceflow/login">
                <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link to="/traceflow/login">
                <Button 
                  size="sm" 
                  className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white shadow-lg shadow-[#FF8A00]/25"
                >
                  Request Demo
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-screen border-t border-border" : "max-h-0"
        )}>
          <div className="bg-background px-4 py-4 space-y-2">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-muted/50 rounded-lg">
              Features
            </a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-muted/50 rounded-lg">
              How It Works
            </a>
            <a href="#case-studies" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-muted/50 rounded-lg">
              Case Studies
            </a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-muted/50 rounded-lg">
              Pricing
            </a>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-muted/50 rounded-lg">
              Contact
            </Link>
            <div className="pt-4 border-t border-border space-y-2">
              <Link to="/traceflow/login">
                <Button variant="outline" className="w-full justify-center">Sign In</Button>
              </Link>
              <Link to="/traceflow/login">
                <Button className="w-full justify-center bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 pb-16 lg:pb-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D91]/5 via-background to-[#00C2D8]/5" />
        
        {/* Animated Signal Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#00C2D8]/30 to-transparent animate-pulse"
              style={{
                top: `${10 + i * 12}%`,
                left: 0,
                right: 0,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-[#0B3D91]/20 to-transparent animate-pulse"
              style={{
                left: `${15 + i * 15}%`,
                top: 0,
                bottom: 0,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${4 + i * 0.3}s`
              }}
            />
          ))}
        </div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-[#0B3D91]/10 to-[#00C2D8]/15 blur-3xl animate-float"
              style={{
                width: `${200 + i * 100}px`,
                height: `${200 + i * 100}px`,
                left: `${10 + i * 18}%`,
                top: `${5 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${6 + i}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white border-0 shadow-lg">
                  <Crown className="h-3 w-3 mr-1" />
                  Flagship Product
                </Badge>
                <Badge variant="outline" className="border-[#00C2D8]/50 text-[#0B3D91]">
                  AI-Native DXI Platform
                </Badge>
                <Badge variant="outline" className="border-[#FF8A00]/50 text-[#FF8A00]">
                  World's First
                </Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1]">
                <span className="bg-gradient-to-r from-[#0B3D91] via-[#00C2D8] to-[#0B3D91] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  TRACEFLOW
                </span>
                <br />
                <span className="text-foreground">Every Signal.</span>
                <br />
                <span className="text-foreground">One Intelligence.</span>
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Unify clickstream, observability, and multimodal feedback — auto-diagnose, auto-suggest, auto-fix. 
                The world's first AI-native Digital Experience Intelligence platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/traceflow/login">
                  <Button 
                    size="lg" 
                    className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white shadow-xl shadow-[#FF8A00]/25 px-8 h-12 text-base"
                  >
                    Request Enterprise Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/traceflow/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-[#0B3D91]/30 text-[#0B3D91] hover:bg-[#0B3D91]/5 h-12 text-base"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    View Live Dashboard
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-muted-foreground">SOC2 Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-muted-foreground">Zero-PII Mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-muted-foreground">GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-muted-foreground">VPC/On-Prem</span>
                </div>
              </div>
            </div>

            {/* Right Column - Animated Hero Visual */}
            <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#0B3D91]/20 border border-border/50 bg-gradient-to-br from-slate-900 via-slate-800 to-[#0B3D91]">
                {/* Live Animation Demo */}
                <div className="aspect-video relative p-4 lg:p-6">
                  {/* Session Timeline */}
                  <div className="absolute top-4 left-4 right-4 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-gradient-to-r from-[#00C2D8] to-[#FF8A00] rounded-full animate-pulse" 
                         style={{ animation: 'timeline 8s linear infinite' }} />
                  </div>

                  {/* Recording Indicator */}
                  <div className="absolute top-8 left-4 bg-white/10 backdrop-blur rounded-lg px-3 py-1.5 flex items-center gap-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white text-xs font-medium">Recording Session</span>
                  </div>

                  {/* Floating Analysis Cards */}
                  <div className="absolute top-8 right-4 bg-white rounded-xl p-3 shadow-xl animate-fade-in" style={{ animationDelay: "500ms", animation: 'float 4s ease-in-out infinite' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="h-4 w-4 text-[#0B3D91]" />
                      <span className="text-xs font-semibold text-slate-900">AI Analysis</span>
                    </div>
                    <p className="text-[10px] text-slate-600">Rage click detected on checkout button</p>
                    <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] rounded-full" />
                    </div>
                  </div>

                  {/* User Journey Visualization */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Animated connection lines */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,194,216,0.3)" strokeWidth="1" 
                              className="animate-pulse" style={{ animationDuration: '2s' }} />
                      <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0,194,216,0.4)" strokeWidth="1"
                              className="animate-pulse" style={{ animationDuration: '3s' }} />
                      <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(0,194,216,0.5)" strokeWidth="1"
                              className="animate-pulse" style={{ animationDuration: '4s' }} />
                      {/* Center node */}
                      <circle cx="50" cy="50" r="8" fill="url(#gradient)" className="animate-pulse" />
                      {/* Outer nodes */}
                      <circle cx="50" cy="10" r="4" fill="#00C2D8" className="animate-bounce" style={{ animationDuration: '2s' }} />
                      <circle cx="90" cy="50" r="4" fill="#FF8A00" className="animate-bounce" style={{ animationDuration: '2.5s' }} />
                      <circle cx="50" cy="90" r="4" fill="#0B3D91" className="animate-bounce" style={{ animationDuration: '3s' }} />
                      <circle cx="10" cy="50" r="4" fill="#00C2D8" className="animate-bounce" style={{ animationDuration: '2.2s' }} />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0B3D91" />
                          <stop offset="100%" stopColor="#00C2D8" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Auto Ticket Creation */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-3 shadow-xl animate-fade-in" style={{ animationDelay: "800ms" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-[#0B3D91]" />
                        <span className="text-xs font-semibold text-slate-900">Jira Ticket Created</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 text-[9px] px-2">Auto-generated</Badge>
                    </div>
                    <p className="text-[10px] text-slate-600 mb-2">BUG-1234: Checkout button unresponsive on mobile</p>
                    <div className="flex items-center gap-4 text-[9px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Code className="h-3 w-3" />
                        /src/Checkout.tsx:142
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        Est. +12% conversion
                      </span>
                    </div>
                  </div>

                  {/* Metric Cards */}
                  <div className="absolute -left-4 lg:-left-6 top-1/3 bg-white rounded-xl p-2.5 shadow-xl animate-fade-in border border-slate-100" 
                       style={{ animationDelay: "1000ms", animation: 'slideInLeft 0.5s ease-out, float 5s ease-in-out infinite 0.5s' }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center">
                        <Zap className="h-3 w-3 text-red-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-slate-900">Rage Click</p>
                        <p className="text-[8px] text-slate-500">Button #pay-now</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-4 lg:-right-6 top-2/3 bg-white rounded-xl p-2.5 shadow-xl animate-fade-in border border-slate-100"
                       style={{ animationDelay: "1200ms", animation: 'slideInRight 0.5s ease-out, float 6s ease-in-out infinite 0.5s' }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-slate-900">+23% Conv.</p>
                        <p className="text-[8px] text-slate-500">After fix applied</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Feature Animation Section */}
      <section id="features" className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#0B3D91]/10 text-[#0B3D91] border-[#0B3D91]/20">
              Complete Platform
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need in <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">One Platform</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From session replay to AI-powered root cause analysis — TRACEFLOW unifies every signal into actionable intelligence.
            </p>
          </div>

          {/* Animated Feature Tabs */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature Selector */}
            <div className="lg:col-span-1 space-y-2">
              {featureCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveFeature(index)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 text-left group",
                      activeFeature === index 
                        ? "bg-white shadow-lg border border-border" 
                        : "hover:bg-white/50 border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center transition-transform group-hover:scale-110",
                      category.color,
                      activeFeature === index ? "scale-110" : ""
                    )}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{category.title}</h4>
                      <p className="text-xs text-muted-foreground">{category.features.length} features</p>
                    </div>
                    {activeFeature === index && (
                      <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#0B3D91] to-[#00C2D8]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feature Details */}
            <div className="lg:col-span-2">
              <Card className="h-full border-0 shadow-xl overflow-hidden">
                <div className={cn(
                  "h-2 bg-gradient-to-r",
                  featureCategories[activeFeature].color
                )} />
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    {(() => {
                      const Icon = featureCategories[activeFeature].icon;
                      return (
                        <div className={cn(
                          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                          featureCategories[activeFeature].color
                        )}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      );
                    })()}
                    <div>
                      <h3 className="text-xl font-bold">{featureCategories[activeFeature].title}</h3>
                      <p className="text-sm text-muted-foreground">AI-powered intelligence</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {featureCategories[activeFeature].features.map((feature, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Live Animation Preview */}
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] bg-repeat" />
                    </div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white text-sm">Live Analysis Running</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#00C2D8] text-sm font-mono">2,847 events/sec</span>
                        <Gauge className="h-4 w-4 text-[#00C2D8]" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* World-First Features / How It Works */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-br from-[#0B3D91] via-[#0B3D91] to-[#00C2D8] text-white relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur">
              <Star className="h-3 w-3 mr-1" />
              Industry First
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Features That Don't Exist Anywhere Else
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              TRACEFLOW introduces capabilities no other platform offers — not Glassbox, FullStory, or Contentsquare.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {worldFirstFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/15 transition-all group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-2">{feature.title}</h4>
                    <p className="text-sm text-white/70">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
              Customer Success
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Real Results Across <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">Industries</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how leading companies use TRACEFLOW to improve conversions, reduce support costs, and accelerate engineering velocity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study) => {
              const Icon = study.logo;
              return (
                <Card key={study.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={cn("h-1.5 bg-gradient-to-r", study.color)} />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", study.color)}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{study.company}</h4>
                          <p className="text-xs text-muted-foreground">{study.industry}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">
                          {study.metric}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{study.metricLabel}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Challenge</p>
                        <p className="text-sm text-foreground/80">{study.challenge}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Solution</p>
                        <p className="text-sm text-foreground/80">{study.solution}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-sm italic text-foreground/70 mb-2">"{study.testimonial}"</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center text-white text-[10px] font-medium">
                          {study.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{study.author}</p>
                          <p className="text-[10px] text-muted-foreground">{study.role}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/20">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Customer Love
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by Product & Engineering Teams
            </h2>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-background border-border/50 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {/* Stars */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-[#FF8A00] text-[#FF8A00]" />
                        ))}
                      </div>

                      {/* Quote */}
                      <div className="relative mb-4">
                        <Quote className="absolute -top-2 -left-2 h-6 w-6 text-[#0B3D91]/20" />
                        <p className="text-foreground/80 text-sm leading-relaxed pl-4">
                          {testimonial.quote}
                        </p>
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center text-white text-sm font-semibold">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{testimonial.author}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          <p className="text-xs text-[#0B3D91]">{testimonial.company}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-2 mt-6">
              <CarouselPrevious className="static translate-y-0 bg-white shadow-lg border-border hover:bg-muted" />
              <CarouselNext className="static translate-y-0 bg-white shadow-lg border-border hover:bg-muted" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section id="pricing" className="py-16 lg:py-24 bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5 animate-float"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: `${i * 20}%`,
                top: `${20 + i * 10}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Digital Experience?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of teams using TRACEFLOW to understand users, fix issues faster, and drive conversions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white shadow-xl px-8 h-12">
                Request Enterprise Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/traceflow/login">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-12">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">TRACEFLOW</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                The world's first AI-native Digital Experience Intelligence platform.
              </p>
              <p className="text-xs text-slate-500">by CropXon Innovations</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="#" className="hover:text-white transition-colors">Session Replay</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">AI Cortex</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">UX Intelligence</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Observability</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © 2025 CropXon Innovations. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                SOC2 Ready
              </Badge>
              <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                <Globe className="h-3 w-3 mr-1" />
                GDPR Compliant
              </Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes timeline {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TraceflowLanding;
