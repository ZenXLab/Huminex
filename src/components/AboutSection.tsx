import { Cpu, Layers, Zap, Globe } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
              About ATLAS
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
              The Consulting Intelligence Wing of{" "}
              <span className="text-gradient">CropXon Innovations</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              ATLAS represents our commitment to enterprise excellence. We combine deep industry expertise 
              with cutting-edge technology to deliver transformative solutions that drive real business outcomes.
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              From strategy to execution, we partner with organizations to navigate digital transformation, 
              implement AI-driven solutions, and build resilient technology foundations that scale with ambition.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Globe, label: "Global Reach" },
                { icon: Cpu, label: "AI-Powered" },
                { icon: Layers, label: "Full Stack" },
                { icon: Zap, label: "Rapid Delivery" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative animate-fade-in-up animation-delay-200">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Orbiting circles */}
              <div className="absolute inset-0 rounded-full border border-border/30 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-8 rounded-full border border-primary/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              <div className="absolute inset-16 rounded-full border border-accent/40 animate-spin" style={{ animationDuration: '10s' }} />
              
              {/* Center glow */}
              <div className="absolute inset-24 rounded-full bg-gradient-radial from-primary/40 via-primary/10 to-transparent animate-pulse-glow" />
              
              {/* Floating nodes */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 p-3 bg-card border border-border rounded-xl shadow-neon animate-float">
                <Cpu className="h-6 w-6 text-accent" />
              </div>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 p-3 bg-card border border-border rounded-xl shadow-neon animate-float" style={{ animationDelay: '1s' }}>
                <Layers className="h-6 w-6 text-accent" />
              </div>
              <div className="absolute top-1/2 left-10 -translate-y-1/2 p-3 bg-card border border-border rounded-xl shadow-neon animate-float" style={{ animationDelay: '2s' }}>
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <div className="absolute top-1/2 right-10 -translate-y-1/2 p-3 bg-card border border-border rounded-xl shadow-neon animate-float" style={{ animationDelay: '0.5s' }}>
                <Zap className="h-6 w-6 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
