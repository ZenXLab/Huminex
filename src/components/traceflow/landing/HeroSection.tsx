import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Play,
  ArrowRight,
  Zap,
  Brain,
  GitBranch,
  Shield,
  Globe,
  Code,
  TrendingUp,
  Crown,
  Building2,
  Lock,
  Fingerprint,
} from "lucide-react";
import { Link } from "react-router-dom";

// Floating particle component
const FloatingParticle = ({ delay, duration, startX, startY }: { delay: number; duration: number; startX: number; startY: number }) => (
  <div
    className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#00C2D8] to-[#0B3D91] opacity-60"
    style={{
      left: `${startX}%`,
      top: `${startY}%`,
      animation: `particleFlow ${duration}s ease-in-out ${delay}s infinite`,
    }}
  />
);

export const HeroSection = () => {
  const [glowPulse, setGlowPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
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

      {/* Floating Particles traveling to center */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            duration={4 + (i % 3)}
            startX={5 + (i * 8) % 90}
            startY={10 + (i * 7) % 80}
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

      {/* Central Intelligence Hub Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-[#0B3D91]/10 via-[#00C2D8]/10 to-[#FF8A00]/10 blur-3xl transition-opacity duration-1000 ${glowPulse ? 'opacity-60' : 'opacity-30'}`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white border-0 shadow-lg">
                <Crown className="h-3 w-3 mr-1" />
                World's First
              </Badge>
              <Badge variant="outline" className="border-[#00C2D8]/50 text-[#0B3D91]">
                Digital Cognition Infrastructure
              </Badge>
              <Badge variant="outline" className="border-[#FF8A00]/50 text-[#FF8A00]">
                Zero-Trust Ready
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1]">
              <span className="bg-gradient-to-r from-[#0B3D91] via-[#00C2D8] to-[#0B3D91] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                TRACEFLOW
              </span>
              <br />
              <span 
                className={`text-foreground relative inline-block transition-all duration-500 ${glowPulse ? 'drop-shadow-[0_0_15px_rgba(0,194,216,0.4)]' : ''}`}
              >
                Digital Cognition
              </span>
              <br />
              <span 
                className={`text-foreground relative inline-block transition-all duration-500 ${glowPulse ? 'drop-shadow-[0_0_15px_rgba(11,61,145,0.4)]' : ''}`}
              >
                Infrastructure
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Unify clickstream, observability, and multimodal feedback into a Zero-Trust, Hybrid-Ready Intelligence Layer for banks, insurers, telcos, governments, and mission-critical enterprises.
            </p>

            {/* Brand Signature Tagline */}
            <p className="text-base lg:text-lg font-medium text-[#0B3D91]/80 italic">
              Every Signal. One Intelligence.
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
                  Explore Dashboard
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
                <Lock className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-muted-foreground">Zero-PII Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">Hybrid/On-Prem</span>
              </div>
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-[#FF8A00]" />
                <span className="text-sm text-muted-foreground">Dual WebAuthn</span>
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
                    <span className="text-xs font-semibold text-slate-900">PROXIMA AI</span>
                  </div>
                  <p className="text-[10px] text-slate-600">Multi-agent analysis running...</p>
                  <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] rounded-full animate-pulse" />
                  </div>
                </div>

                {/* User Journey Visualization */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,194,216,0.3)" strokeWidth="1" 
                            className="animate-pulse" style={{ animationDuration: '2s' }} />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0,194,216,0.4)" strokeWidth="1"
                            className="animate-pulse" style={{ animationDuration: '3s' }} />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(0,194,216,0.5)" strokeWidth="1"
                            className="animate-pulse" style={{ animationDuration: '4s' }} />
                    <circle cx="50" cy="50" r="8" fill="url(#gradient)" className="animate-pulse" />
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

      {/* CSS for particle animation */}
      <style>{`
        @keyframes particleFlow {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          50% {
            transform: translate(calc(50vw - 100%), calc(50vh - 100%)) scale(0.5);
            opacity: 0.6;
          }
          80% {
            opacity: 0.3;
          }
          100% {
            transform: translate(calc(50vw - 50%), calc(50vh - 50%)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};
