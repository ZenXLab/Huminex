import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TraceflowCompetitiveMatrix } from "./TraceflowCompetitiveMatrix";
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
  Lock,
  Fingerprint,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Import new premium sections
import { HeroSection } from "./landing/HeroSection";
import { PipelineSection } from "./landing/PipelineSection";
import { ModulesGrid } from "./landing/ModulesGrid";
import { IndustrySolutions } from "./landing/IndustrySolutions";
import { CompetitorTable } from "./landing/CompetitorTable";
import { SecuritySection } from "./landing/SecuritySection";
import { ProximaSection } from "./landing/ProximaSection";
import { StorySection } from "./landing/StorySection";
import { PricingSection } from "./landing/PricingSection";
import { VideoDemoSection } from "./landing/VideoDemoSection";

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

// Case studies data
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
    challenge: "High cart abandonment rate with no visibility into why users dropped off during checkout.",
    solution: "TRACEFLOW's AI Cortex identified payment gateway timeouts causing 68% of abandonments.",
    results: [
      "32% increase in checkout conversion",
      "68% reduction in payment failures",
      "₹2.3Cr monthly revenue recovered",
      "3-day mean time to resolution"
    ],
    testimonial: "We recovered ₹2.3Cr in monthly revenue within 6 weeks of implementing TRACEFLOW.",
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
    challenge: "Compliance requirements made debugging slow. Engineers spent 4+ hours watching replays.",
    solution: "AI Session Summaries reduced triage time from 4 hours to 45 minutes.",
    results: [
      "70% faster issue resolution",
      "4 hours → 45 minutes triage time",
      "100% PCI-DSS compliance maintained",
      "$1.2M annual support cost savings"
    ],
    testimonial: "TRACEFLOW's tokenization-first approach let us stay compliant while getting full visibility.",
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
    challenge: "Patients struggling with appointment booking but support couldn't reproduce issues.",
    solution: "Session replay + voice fusion aligned patient complaints with exact user journeys.",
    results: [
      "45% reduction in support tickets",
      "28-point NPS improvement",
      "23 accessibility issues detected",
      "100% HIPAA compliance"
    ],
    testimonial: "Our patient satisfaction scores jumped 28 points after fixing the issues TRACEFLOW found.",
    author: "Dr. Anita Desai",
    role: "Digital Transformation Head",
    avatar: "AD",
    companySize: "5000+ employees",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 4,
    industry: "SaaS",
    company: "CloudOps Platform",
    logo: Building2,
    metric: "35%",
    metricLabel: "Churn Reduction",
    revenue: "$2.1M",
    revenueLabel: "ARR Saved",
    timeToValue: "6 weeks",
    challenge: "High churn rate with no visibility into product friction.",
    solution: "Journey Causality Engine identified that users who skipped onboarding churned 4x more.",
    results: [
      "35% reduction in churn",
      "$2.1M ARR saved annually",
      "30-day churn prediction accuracy",
      "2.3x feature adoption increase"
    ],
    testimonial: "TRACEFLOW's churn prediction saved us $2.1M in ARR.",
    author: "Sarah Chen",
    role: "Chief Customer Officer",
    avatar: "SC",
    companySize: "150+ employees",
    color: "from-violet-500 to-purple-500"
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
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg" 
          : "bg-background/80 backdrop-blur-lg border-b border-border/40"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex items-center justify-between transition-all duration-500",
            isScrolled ? "h-14" : "h-16"
          )}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF8A00] rounded-full flex items-center justify-center animate-pulse">
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
              {[
                { href: "#features", label: "Features" },
                { href: "#why-traceflow", label: "Why TRACEFLOW", icon: Crown },
                { href: "#case-studies", label: "Case Studies" },
                { href: "#pricing", label: "Pricing" },
              ].map((item, index) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground rounded-lg transition-all duration-300 group overflow-hidden"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.icon && <item.icon className="h-3 w-3 text-[#FF8A00]" />}
                    {item.label}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D91]/0 via-[#0B3D91]/5 to-[#00C2D8]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <Link to="/traceflow/how-it-works" className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground rounded-lg transition-all duration-300 group overflow-hidden">
                <span className="relative z-10">How It Works</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D91]/0 via-[#0B3D91]/5 to-[#00C2D8]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link to="/contact" className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground rounded-lg transition-all duration-300 group overflow-hidden">
                <span className="relative z-10">Contact</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D91]/0 via-[#0B3D91]/5 to-[#00C2D8]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/traceflow/login">
                <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground relative overflow-hidden group">
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-muted/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Button>
              </Link>
              <Link to="/traceflow/login">
                <Button 
                  size="sm" 
                  className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white shadow-lg shadow-[#FF8A00]/25 hover:shadow-xl hover:shadow-[#FF8A00]/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Request Demo
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <span className={cn(
                  "absolute left-0 w-5 h-0.5 bg-foreground transition-all duration-300",
                  mobileMenuOpen ? "top-2 rotate-45" : "top-1"
                )} />
                <span className={cn(
                  "absolute left-0 top-2 w-5 h-0.5 bg-foreground transition-all duration-300",
                  mobileMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                )} />
                <span className={cn(
                  "absolute left-0 w-5 h-0.5 bg-foreground transition-all duration-300",
                  mobileMenuOpen ? "top-2 -rotate-45" : "top-3"
                )} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-500 ease-in-out",
          mobileMenuOpen ? "max-h-screen border-t border-border" : "max-h-0"
        )}>
          <div className="bg-background px-4 py-4 space-y-2">
            {[
              { href: "#features", label: "Features" },
              { href: "#why-traceflow", label: "Why TRACEFLOW", icon: Crown },
              { href: "#case-studies", label: "Case Studies" },
              { href: "#pricing", label: "Pricing" },
            ].map((item, index) => (
              <a 
                key={item.href}
                href={item.href} 
                onClick={() => setMobileMenuOpen(false)} 
                className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-muted/50 rounded-lg transition-all duration-300 flex items-center gap-2"
                style={{ 
                  opacity: mobileMenuOpen ? 1 : 0,
                  transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)',
                  transitionDelay: `${index * 50}ms`
                }}
              >
                {item.icon && <item.icon className="h-3 w-3 text-[#FF8A00]" />}
                {item.label}
              </a>
            ))}
            <Link to="/traceflow/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-muted/50 rounded-lg">
              How It Works
            </Link>
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

      {/* NEW: Hero Section */}
      <HeroSection />

      {/* NEW: Animated Pipeline Section */}
      <PipelineSection />

      {/* NEW: Video Demo Section */}
      <VideoDemoSection />

      {/* NEW: Modules Grid (Platform OS) */}
      <ModulesGrid />

      {/* Live Feature Animation Section */}
      <section id="features" className="py-16 lg:py-24 bg-background" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#0B3D91]/10 text-[#0B3D91] border-[#0B3D91]/20 animate-fade-in">
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
                      "w-full p-4 rounded-xl text-left transition-all duration-500 group relative overflow-hidden",
                      activeFeature === index 
                        ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white shadow-lg shadow-[#0B3D91]/20 scale-[1.02]" 
                        : "bg-muted/50 hover:bg-muted text-foreground hover:scale-[1.01]"
                    )}
                    style={{ transitionDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                        activeFeature === index 
                          ? "bg-white/20" 
                          : `bg-gradient-to-r ${category.color}`
                      )}>
                        <Icon className={cn(
                          "h-5 w-5 transition-transform duration-300",
                          activeFeature === index ? "text-white scale-110" : "text-white"
                        )} />
                      </div>
                      <span className="font-medium">{category.title}</span>
                    </div>
                    {activeFeature === index && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feature Content */}
            <div className="lg:col-span-2">
              <Card className="h-full border-2 border-[#0B3D91]/10 hover:border-[#0B3D91]/20 transition-colors duration-300 overflow-hidden">
                <CardContent className="p-6 lg:p-8">
                  <div className={cn(
                    "flex items-center gap-4 mb-6 transition-all duration-500",
                  )}>
                    <div className={cn(
                      "w-14 h-14 rounded-2xl bg-gradient-to-r flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110",
                      featureCategories[activeFeature].color
                    )}>
                      {(() => {
                        const Icon = featureCategories[activeFeature].icon;
                        return <Icon className="h-7 w-7 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{featureCategories[activeFeature].title}</h3>
                      <p className="text-sm text-muted-foreground">TRACEFLOW Intelligence Module</p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {featureCategories[activeFeature].features.map((feature, index) => (
                      <li 
                        key={index} 
                        className="flex items-center gap-3 text-foreground/80 animate-fade-in group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="relative">
                          <CheckCircle className="h-5 w-5 text-[#00C2D8] transition-transform duration-300 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-[#00C2D8]/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-50" />
                        </div>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Industry Solutions */}
      <IndustrySolutions />

      {/* World-First Features */}
      <section className="py-16 lg:py-24 bg-muted/30" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/20">
              <Crown className="h-3 w-3 mr-1" />
              Industry Firsts
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Features You Won't Find <span className="bg-gradient-to-r from-[#FF8A00] to-[#0B3D91] bg-clip-text text-transparent">Anywhere Else</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              TRACEFLOW pioneers capabilities that don't exist in any other platform. These are genuine world-firsts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {worldFirstFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border-2 hover:border-[#FF8A00]/30 overflow-hidden"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF8A00]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#0B3D91] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg group-hover:text-[#0B3D91] transition-colors duration-300">{feature.title}</h3>
                          <Badge className="bg-[#FF8A00]/10 text-[#FF8A00] text-[10px] border-0 group-hover:bg-[#FF8A00] group-hover:text-white transition-colors duration-300">
                            World First
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm group-hover:text-foreground/80 transition-colors duration-300">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEW: Why TRACEFLOW Section with Competitive Matrix */}
      <section id="why-traceflow" className="py-16 lg:py-24 bg-background">
        <TraceflowCompetitiveMatrix />
      </section>

      {/* NEW: Competitor Comparison Table */}
      <CompetitorTable />

      {/* NEW: Security Architecture Section */}
      <SecuritySection />

      {/* NEW: PROXIMA Multi-Agent Section */}
      <ProximaSection />

      {/* NEW: Story Section */}
      <StorySection />

      {/* Case Studies */}
      <section id="case-studies" className="py-16 lg:py-24 bg-background" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              <TrendingUp className="h-3 w-3 mr-1" />
              Proven Results
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Real Impact, <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">Real Results</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how leading companies transformed their digital experience with TRACEFLOW.
            </p>
          </div>

          {/* Horizontal Scrolling Case Studies */}
          <div className="relative -mx-4 px-4 lg:-mx-8 lg:px-8 overflow-hidden">
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex-shrink-0 w-4 lg:w-[calc((100vw-1280px)/2)]" />
              
              {caseStudies.map((study, index) => {
                const Icon = study.logo;
                return (
                  <Card 
                    key={study.id} 
                    className="flex-shrink-0 w-[380px] lg:w-[420px] group hover:shadow-2xl transition-all duration-500 overflow-hidden snap-center border-2 hover:border-[#0B3D91]/30 hover:-translate-y-1"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className={cn("h-2 bg-gradient-to-r transition-all duration-300 group-hover:h-3", study.color)} />
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300", study.color)}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-base">{study.company}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] py-0">{study.industry}</Badge>
                              <span className="text-[10px] text-muted-foreground">{study.companySize}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-3 mb-5 p-3 rounded-xl bg-gradient-to-br from-[#0B3D91]/5 to-[#00C2D8]/5 border border-[#0B3D91]/10">
                        <div className="text-center">
                          <p className="text-xl font-bold bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">
                            {study.metric}
                          </p>
                          <p className="text-[9px] text-muted-foreground leading-tight">{study.metricLabel}</p>
                        </div>
                        <div className="text-center border-x border-[#0B3D91]/10">
                          <p className="text-xl font-bold text-emerald-600">{study.revenue}</p>
                          <p className="text-[9px] text-muted-foreground leading-tight">{study.revenueLabel}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-[#FF8A00]">{study.timeToValue}</p>
                          <p className="text-[9px] text-muted-foreground leading-tight">Time to Value</p>
                        </div>
                      </div>

                      {/* Challenge & Solution */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-xs font-semibold text-red-600 mb-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Challenge
                          </p>
                          <p className="text-xs text-foreground/80 leading-relaxed">{study.challenge}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-600 mb-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Solution
                          </p>
                          <p className="text-xs text-foreground/80 leading-relaxed">{study.solution}</p>
                        </div>
                      </div>

                      {/* Results */}
                      <div className="mb-4 p-3 rounded-lg bg-muted/50">
                        <p className="text-xs font-semibold mb-2">Key Results:</p>
                        <div className="grid grid-cols-2 gap-1">
                          {study.results?.slice(0, 4).map((result, i) => (
                            <div key={i} className="flex items-center gap-1.5 group/item">
                              <CheckCircle className="h-3 w-3 text-emerald-500 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200" />
                              <span className="text-[10px] text-foreground/80">{result}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Testimonial */}
                      <div className="pt-4 border-t border-border">
                        <div className="relative">
                          <Quote className="absolute -top-1 -left-1 h-4 w-4 text-[#0B3D91]/20" />
                          <p className="text-xs italic text-foreground/70 mb-3 pl-4 leading-relaxed">"{study.testimonial}"</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center text-white text-xs font-semibold shadow-lg">
                            {study.avatar}
                          </div>
                          <div>
                            <p className="text-xs font-semibold">{study.author}</p>
                            <p className="text-[10px] text-muted-foreground">{study.role}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              <div className="flex-shrink-0 w-4 lg:w-[calc((100vw-1280px)/2)]" />
            </div>
          </div>

          {/* Scroll hint */}
          <div className="flex justify-center mt-4 lg:hidden">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex gap-1">
                {caseStudies.map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#0B3D91]/30" />
                ))}
              </div>
              <span>Swipe to explore</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
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
                  <Card className="h-full bg-background border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-[#FF8A00] text-[#FF8A00]" />
                        ))}
                      </div>
                      <div className="relative mb-4">
                        <Quote className="absolute -top-2 -left-2 h-6 w-6 text-[#0B3D91]/20" />
                        <p className="text-foreground/80 text-sm leading-relaxed pl-4">{testimonial.quote}</p>
                      </div>
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
              <CarouselPrevious className="static translate-y-0 bg-white shadow-lg border-border hover:bg-muted hover:scale-105 transition-transform duration-200" />
              <CarouselNext className="static translate-y-0 bg-white shadow-lg border-border hover:bg-muted hover:scale-105 transition-transform duration-200" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* NEW: Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] relative overflow-hidden">
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
              <Button size="lg" className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white shadow-xl px-8 h-12 hover:scale-105 transition-transform duration-300">
                Request Enterprise Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/traceflow/login">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-12 hover:scale-105 transition-transform duration-300">
                Explore Dashboard
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
                The world's first Digital Cognition Infrastructure for enterprise.
              </p>
              <p className="text-xs text-slate-500">by CropXon Innovations</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Session Replay</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">PROXIMA AI</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">UX Intelligence</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Observability</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-white transition-colors duration-200">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Careers</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Security</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © 2025 CropXon Innovations. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs hover:border-slate-500 transition-colors duration-200">
                <Shield className="h-3 w-3 mr-1" />
                SOC2 Ready
              </Badge>
              <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs hover:border-slate-500 transition-colors duration-200">
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
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TraceflowLanding;
