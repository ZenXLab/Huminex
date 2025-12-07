import { Button } from "@/components/ui/button";
import { NetworkBackground } from "./NetworkBackground";
import { ArrowRight, Calculator } from "lucide-react";
import cropxonIcon from "@/assets/cropxon-icon.png";

interface HeroSectionProps {
  onQuoteClick?: () => void;
}

export const HeroSection = ({ onQuoteClick }: HeroSectionProps) => {
  const scrollToSolutions = () => {
    document.getElementById("pillars")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-20">
      <NetworkBackground />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated ATLAS Logo & Name */}
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
                  src={cropxonIcon} 
                  alt="ATLAS" 
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

            {/* Animated ATLAS Text */}
            <div className="mt-8 relative">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tighter">
                <span className="inline-block relative">
                  {/* Background glow text */}
                  <span className="absolute inset-0 text-primary/20 blur-xl animate-pulse">ATLAS</span>
                  
                  {/* Main gradient text with letter animation */}
                  <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                    {'ATLAS'.split('').map((letter, index) => (
                      <span 
                        key={index}
                        className="inline-block hover:scale-110 hover:-translate-y-1 transition-transform duration-300 cursor-default"
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                          animation: 'fade-in-up 0.5s ease-out forwards',
                          opacity: 0
                        }}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                </span>
              </h2>
              
              {/* Subtitle with typewriter effect */}
              <p className="mt-3 text-sm sm:text-base text-muted-foreground font-medium tracking-[0.3em] uppercase">
                Workforce Operating System
              </p>
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
            <Button variant="hero" size="xl" className="group" onClick={scrollToSolutions}>
              Explore Solutions
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="hero-outline" size="xl" className="group" onClick={onQuoteClick}>
              <Calculator className="h-5 w-5" />
              Get a Quote
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
