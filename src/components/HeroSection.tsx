import { Button } from "@/components/ui/button";
import { NetworkBackground } from "./NetworkBackground";
import { ArrowRight, Calculator } from "lucide-react";
import cropxonIcon from "@/assets/cropxon-icon.png";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-20">
      <NetworkBackground />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo Icon */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full animate-pulse-glow" />
              <img 
                src={cropxonIcon} 
                alt="CropXon" 
                className="relative h-24 w-24 object-contain animate-float"
              />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 animate-fade-in-up">
            <span className="text-foreground">ATLAS</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2 text-gradient">
              Consulting & Digital Transformation
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            Built for the Next Generation of Innovation.
          </p>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-foreground/60 mb-12 animate-fade-in-up animation-delay-400">
            A Division of <span className="text-accent font-semibold">CropXon Innovations Pvt. Ltd.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
            <Button variant="hero" size="xl" className="group">
              Explore Solutions
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="hero-outline" size="xl" className="group">
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
