import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Play, Pause, Volume2, VolumeX, Maximize2, Bot, TrendingUp, Zap, Users, CheckCircle2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const DemoVideoSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Auto-advance animation steps when "playing"
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % 4);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
  };

  const automationSteps = [
    { icon: Users, title: "Employee Joins", description: "New hire added to ATLAS", color: "from-blue-500 to-cyan-500" },
    { icon: Bot, title: "AI Processes", description: "Automated onboarding begins", color: "from-purple-500 to-violet-500" },
    { icon: Zap, title: "Workflows Trigger", description: "Documents, access, payroll setup", color: "from-amber-500 to-orange-500" },
    { icon: CheckCircle2, title: "Complete", description: "Employee productive in hours", color: "from-green-500 to-emerald-500" },
  ];

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-semibold tracking-wide uppercase mb-6">
            <Zap className="w-4 h-4" />
            See ATLAS in Action
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6">
            Experience the <span className="text-gradient">Future of Work</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Watch how ATLAS revolutionizes workforce management with AI-powered automation. From hire to retire — in seconds.
          </p>
        </div>

        {/* Interactive Demo Container */}
        <div className={`max-w-5xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative rounded-3xl overflow-hidden bg-card border border-border/60 shadow-2xl shadow-primary/10">
            {/* Video/Demo Area */}
            <div className="aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
              {/* Animated Grid */}
              <div className="absolute inset-0 opacity-20">
                <div 
                  className="absolute inset-0" 
                  style={{
                    backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                  }}
                />
              </div>

              {/* Flowing Lines Animation */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: '-100%',
                      width: '200%',
                      animation: isPlaying ? `slideRight ${3 + i * 0.5}s linear infinite` : 'none',
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                ))}
              </div>

              {/* Center Content - Automation Flow */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="w-full max-w-3xl">
                  {/* Automation Steps */}
                  <div className="flex items-center justify-between">
                    {automationSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = currentStep === index;
                      const isPast = currentStep > index;
                      
                      return (
                        <div key={index} className="flex flex-col items-center flex-1 relative">
                          {/* Connector Line */}
                          {index < automationSteps.length - 1 && (
                            <div className="absolute top-8 left-1/2 w-full h-1 bg-slate-700">
                              <div 
                                className={`h-full bg-gradient-to-r ${step.color} transition-all duration-500`}
                                style={{ width: isPast || isActive ? '100%' : '0%' }}
                              />
                            </div>
                          )}
                          
                          {/* Step Circle */}
                          <div 
                            className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                              isActive 
                                ? `bg-gradient-to-br ${step.color} scale-110 shadow-lg shadow-primary/30` 
                                : isPast 
                                  ? 'bg-green-500/20 border-2 border-green-500' 
                                  : 'bg-slate-800 border border-slate-700'
                            }`}
                          >
                            <Icon className={`w-7 h-7 ${isActive ? 'text-white' : isPast ? 'text-green-500' : 'text-slate-500'}`} />
                            {isActive && (
                              <span className="absolute -inset-2 rounded-2xl border-2 border-primary/50 animate-ping" />
                            )}
                          </div>
                          
                          {/* Step Label */}
                          <div className={`mt-4 text-center transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                            <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                              {step.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 hidden sm:block">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stats Display */}
                  <div className="mt-12 grid grid-cols-3 gap-4">
                    <div className={`bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center transition-all duration-500 ${isPlaying ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="text-2xl font-bold text-primary">90%</div>
                      <div className="text-xs text-slate-400">Time Saved</div>
                    </div>
                    <div className={`bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center transition-all duration-500 delay-100 ${isPlaying ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="text-2xl font-bold text-accent">100%</div>
                      <div className="text-xs text-slate-400">Compliance</div>
                    </div>
                    <div className={`bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center transition-all duration-500 delay-200 ${isPlaying ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="text-2xl font-bold text-green-500">Zero</div>
                      <div className="text-xs text-slate-400">Manual Errors</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ATLAS Branding */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <span className="text-white font-heading font-bold">ATLAS</span>
                  <span className="text-slate-400 text-xs block">Live Demo</span>
                </div>
              </div>

              {/* Play/Pause Overlay Button */}
              <button
                onClick={handlePlayClick}
                className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary shadow-lg shadow-primary/30"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                )}
              </button>

              {/* Status Indicator */}
              <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-white text-sm font-medium">{isPlaying ? 'Running' : 'Paused'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link to="/get-quote">
            <Button size="lg" className="shadow-lg shadow-primary/20">
              Start Free Trial
              <TrendingUp className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg">
              Request Live Demo
            </Button>
          </Link>
        </div>

        {/* Bottom Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { label: "Setup Time", value: "< 5 mins", icon: "⚡" },
            { label: "Free Trial", value: "30 Days", icon: "🎁" },
            { label: "Support", value: "24/7", icon: "💬" },
            { label: "Data Import", value: "1-Click", icon: "📥" },
          ].map((item, index) => (
            <div key={index} className="text-center p-5 bg-card/50 border border-border/40 rounded-xl hover:border-primary/30 transition-colors">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xl font-heading font-bold text-foreground mb-1">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for slide animation */}
      <style>{`
        @keyframes slideRight {
          from { transform: translateX(0); }
          to { transform: translateX(50%); }
        }
      `}</style>
    </section>
  );
};
