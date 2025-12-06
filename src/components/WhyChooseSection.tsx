import { 
  Clock, 
  Globe2, 
  Brain, 
  FileText, 
  Workflow, 
  Calculator, 
  ShieldCheck 
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "24/7 Global Support",
    description: "Round-the-clock support across all time zones with dedicated response teams.",
  },
  {
    icon: Globe2,
    title: "Multi-Industry Experience",
    description: "Deep expertise spanning retail, healthcare, finance, and 20+ industry verticals.",
  },
  {
    icon: Brain,
    title: "AI-First Consulting",
    description: "Every solution is enhanced with intelligent automation and predictive capabilities.",
  },
  {
    icon: FileText,
    title: "Enterprise Documentation",
    description: "Comprehensive documentation, SOPs, and knowledge transfer for every engagement.",
  },
  {
    icon: Workflow,
    title: "Full Lifecycle Delivery",
    description: "From strategy to deployment to ongoing management — we handle it all.",
  },
  {
    icon: Calculator,
    title: "Transparent Pricing",
    description: "Clear, upfront pricing with our interactive calculator. No hidden costs.",
  },
  {
    icon: ShieldCheck,
    title: "Security & Compliance",
    description: "SOC2, ISO 27001, GDPR compliant. Your data security is our priority.",
  },
];

export const WhyChooseSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-card relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--accent)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            Why ATLAS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Why Choose <span className="text-gradient">ATLAS</span>?
          </h2>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade capabilities with the agility and innovation of a modern consultancy.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon with glow */}
              <div className="relative mb-4 inline-block">
                <div className="absolute inset-0 blur-xl bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-3 rounded-xl bg-muted border border-border group-hover:border-primary/50 transition-colors duration-300">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
              </div>

              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
