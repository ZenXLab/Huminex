import { Cpu, Layers, Zap, Globe } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section 
      id="about" 
      className="py-24 lg:py-32 relative overflow-hidden"
      ref={ref as React.RefObject<HTMLElement>}
    >
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold tracking-wide uppercase mb-6">
              About ATLAS
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6 text-foreground">
              The Consulting Intelligence Wing of{" "}
              <span className="text-gradient">CropXon Innovations</span>
            </h2>
            
            <p className="text-base lg:text-lg text-muted-foreground mb-6 leading-relaxed">
              ATLAS represents our commitment to enterprise excellence. We combine deep industry expertise 
              with cutting-edge technology to deliver transformative solutions that drive real business outcomes.
            </p>

            <p className="text-sm lg:text-base text-muted-foreground mb-8 leading-relaxed">
              From strategy to execution, we partner with organizations to navigate digital transformation, 
              implement AI-driven solutions, and build resilient technology foundations that scale with ambition.
            </p>

            <div className={`grid sm:grid-cols-2 gap-3 stagger-children ${isVisible ? 'visible' : ''}`}>
              {[
                { icon: Globe, label: "Global Reach" },
                { icon: Cpu, label: "AI-Powered" },
                { icon: Layers, label: "Full Stack" },
                { icon: Zap, label: "Rapid Delivery" },
              ].map((item) => (
                <div 
                  key={item.label} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 hover:border-primary/30 hover:bg-muted/60 transition-all duration-300 group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className={`relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Orbiting circles */}
              <div className="absolute inset-0 rounded-full border border-border/20 animate-spin" style={{ animationDuration: '25s' }} />
              <div className="absolute inset-10 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }} />
              <div className="absolute inset-20 rounded-full border border-accent/30 animate-spin" style={{ animationDuration: '12s' }} />
              
              {/* Center glow */}
              <div className="absolute inset-28 rounded-full bg-gradient-radial from-primary/30 via-primary/5 to-transparent animate-pulse-glow" />
              
              {/* Floating nodes */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 p-3 bg-card border border-border/60 rounded-xl shadow-lg animate-float">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 p-3 bg-card border border-border/60 rounded-xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div className="absolute top-1/2 left-8 -translate-y-1/2 p-3 bg-card border border-border/60 rounded-xl shadow-lg animate-float" style={{ animationDelay: '2s' }}>
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div className="absolute top-1/2 right-8 -translate-y-1/2 p-3 bg-card border border-border/60 rounded-xl shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                <Zap className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
