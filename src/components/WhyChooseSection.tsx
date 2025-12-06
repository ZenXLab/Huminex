import { 
  Clock, 
  Globe2, 
  Brain, 
  FileText, 
  Workflow, 
  Calculator, 
  ShieldCheck 
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Clock,
    title: "24/7 Global Support",
    description: "Round-the-clock support across all time zones with dedicated response teams.",
    color: "from-blue-400 to-blue-600",
    iconBg: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-500",
  },
  {
    icon: Globe2,
    title: "Multi-Industry Experience",
    description: "Deep expertise spanning retail, healthcare, finance, and 20+ industry verticals.",
    color: "from-purple-400 to-purple-600",
    iconBg: "bg-purple-50 dark:bg-purple-950/50",
    iconColor: "text-purple-500",
  },
  {
    icon: Brain,
    title: "AI-First Consulting",
    description: "Every solution is enhanced with intelligent automation and predictive capabilities.",
    color: "from-cyan-400 to-teal-500",
    iconBg: "bg-cyan-50 dark:bg-cyan-950/50",
    iconColor: "text-cyan-500",
  },
  {
    icon: FileText,
    title: "Enterprise Documentation",
    description: "Comprehensive documentation, SOPs, and knowledge transfer for every engagement.",
    color: "from-amber-400 to-orange-500",
    iconBg: "bg-amber-50 dark:bg-amber-950/50",
    iconColor: "text-amber-500",
  },
  {
    icon: Workflow,
    title: "Full Lifecycle Delivery",
    description: "From strategy to deployment to ongoing management — we handle it all.",
    color: "from-rose-400 to-pink-500",
    iconBg: "bg-rose-50 dark:bg-rose-950/50",
    iconColor: "text-rose-500",
  },
  {
    icon: Calculator,
    title: "Transparent Pricing",
    description: "Clear, upfront pricing with our interactive calculator. No hidden costs.",
    color: "from-emerald-400 to-green-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-500",
  },
  {
    icon: ShieldCheck,
    title: "Security & Compliance",
    description: "SOC2, ISO 27001, GDPR compliant. Your data security is our priority.",
    color: "from-indigo-400 to-violet-500",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/50",
    iconColor: "text-indigo-500",
  },
];

export const WhyChooseSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section 
      className="py-24 lg:py-32 bg-secondary/30 relative overflow-hidden"
      ref={ref as React.RefObject<HTMLElement>}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold tracking-wide uppercase mb-6">
            Why ATLAS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6 text-foreground">
            Why Choose <span className="text-gradient">ATLAS</span>?
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            Enterprise-grade capabilities with the agility and innovation of a modern consultancy.
          </p>
        </div>

        {/* Features Grid - Premium Card Style */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Card with gradient border on hover */}
              <div className="relative p-[1px] rounded-2xl">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Inner card */}
                <div className="relative bg-card rounded-[15px] p-5 h-full border border-border/50 group-hover:border-transparent transition-all duration-300 group-hover:shadow-lg">
                  {/* Icon Container */}
                  <div className={`w-11 h-11 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className={`w-5 h-5 ${feature.iconColor}`} strokeWidth={1.5} />
                  </div>

                  <h3 className="text-sm lg:text-base font-heading font-semibold text-foreground mb-2 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
