import { Button } from "@/components/ui/button";
import { NetworkBackground } from "./NetworkBackground";
import { ArrowRight, Calculator, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import huminexLogo from "@/assets/huminex-logo.png";

interface HeroSectionProps {
  onQuoteClick?: () => void;
}

export const HeroSection = ({ onQuoteClick }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Workforce Operating System";
  
  // Typing animation effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, []);

  const scrollToSolutions = () => {
    document.getElementById("pillars")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartFreeTrial = () => {
    if (user) {
      // If logged in, redirect to portal
      navigate("/portal");
    } else {
      // If not logged in, redirect to onboarding
      navigate("/onboarding");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-20">
      <NetworkBackground />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated HUMINEX Logo & Name */}
          <div className="flex flex-col items-center justify-center mb-10 animate-fade-in-up">
            <div className="relative group">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-20 blur-2xl animate-pulse-glow scale-150" />
              
              {/* Spinning ring */}
              <div className="absolute inset-[-12px] rounded-full border-2 border-dashed border-primary/30 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-[-24px] rounded-full border border-accent/20 animate-[spin_30s_linear_infinite_reverse]" />
              
              {/* Logo container with spin animation on hover */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-[spin_8s_ease-in-out_infinite]" />
                <img 
                  src={huminexLogo} 
                  alt="HUMINEX" 
                  className="relative h-20 w-20 sm:h-24 sm:w-24 object-contain animate-float drop-shadow-2xl z-10 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Orbiting dots */}
              <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
              </div>
              <div className="absolute inset-0 animate-[spin_15s_linear_infinite_reverse]">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-1.5 h-1.5 rounded-full bg-accent shadow-lg shadow-accent/50" />
              </div>
            </div>

            {/* Animated HUMINEX Text */}
            <div className="mt-8 relative">
              {/* HUMINEX Name with Glow */}
              <div className="relative inline-block">
                {/* Background glow */}
                <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 animate-pulse" />
                
                {/* Main HUMINEX text */}
                <h2 className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black tracking-tight">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                    HUMINEX
                  </span>
                </h2>
              </div>
              
              {/* Subtitle with Typing Animation */}
              <div className="mt-4 h-8 flex items-center justify-center">
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium tracking-[0.25em] uppercase">
                  {displayedText}
                  <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse" />
                </p>
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-6 animate-fade-in-up animation-delay-200">
            <span className="text-gradient">From Hire to Retire</span>
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl mt-3 font-medium text-foreground/90">
              And Everything in Between
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 animate-fade-in-up animation-delay-200">
            The AI-Powered Workforce OS that automates HR, Payroll, Compliance, Finance, Recruitment, Projects, and Operations for modern enterprises.
          </p>

          {/* Company Attribution */}
          <p className="text-sm sm:text-base text-foreground/60 mb-12 animate-fade-in-up animation-delay-400">
            A Division of <span className="text-accent font-semibold">CropXon Innovations Pvt. Ltd.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
            <Button variant="hero" size="xl" className="group" onClick={handleStartFreeTrial}>
              <Sparkles className="h-5 w-5" />
              Start Your Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="hero-outline" size="xl" className="group" onClick={scrollToSolutions}>
              Explore Solutions
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-border/30 animate-fade-in-up animation-delay-600">
            <p className="text-muted-foreground text-sm mb-4">Trusted by enterprises worldwide</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-foreground/60">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
                <span className="text-sm">24/7 Global Support</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/60">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
                <span className="text-sm">50+ Enterprise Clients</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/60">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
                <span className="text-sm">AI-First Approach</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
