import { Link } from "react-router-dom";
import { 
  Code, 
  Brain, 
  Palette, 
  Cloud, 
  Briefcase, 
  Shield, 
  Lock, 
  LayoutGrid,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const pillars = [
  {
    icon: Code,
    title: "Digital Engineering",
    description: "Websites, Apps & SaaS",
    href: "/services/digital-engineering",
    borderColor: "from-blue-400 to-blue-600",
    iconBg: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-500",
  },
  {
    icon: Brain,
    title: "AI & Automation",
    description: "Chatbots & Predictive Analytics",
    href: "/services/ai-automation",
    borderColor: "from-purple-400 to-purple-600",
    iconBg: "bg-purple-50 dark:bg-purple-950/50",
    iconColor: "text-purple-500",
  },
  {
    icon: Palette,
    title: "Experience Design",
    description: "Branding & UX/UI",
    href: "/services/experience-design",
    borderColor: "from-cyan-400 to-teal-500",
    iconBg: "bg-cyan-50 dark:bg-cyan-950/50",
    iconColor: "text-cyan-500",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description: "Infrastructure & CI/CD",
    href: "/services/cloud-devops",
    borderColor: "from-rose-400 to-pink-500",
    iconBg: "bg-rose-50 dark:bg-rose-950/50",
    iconColor: "text-rose-500",
  },
  {
    icon: Briefcase,
    title: "Enterprise Consulting",
    description: "CTO Services & Strategy",
    href: "/services/enterprise-consulting",
    borderColor: "from-orange-400 to-amber-500",
    iconBg: "bg-orange-50 dark:bg-orange-950/50",
    iconColor: "text-orange-500",
  },
  {
    icon: Shield,
    title: "Managed IT Services",
    description: "Monitoring & Support",
    href: "/services/managed-it",
    borderColor: "from-teal-400 to-emerald-500",
    iconBg: "bg-teal-50 dark:bg-teal-950/50",
    iconColor: "text-teal-500",
  },
  {
    icon: Lock,
    title: "Cybersecurity",
    description: "VAPT & Compliance",
    href: "/services/cybersecurity",
    borderColor: "from-indigo-400 to-violet-500",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/50",
    iconColor: "text-indigo-500",
  },
  {
    icon: LayoutGrid,
    title: "Industry Solutions",
    description: "Tailored vertical solutions",
    href: "/services/industry-solutions",
    borderColor: "from-fuchsia-400 to-pink-500",
    iconBg: "bg-fuchsia-50 dark:bg-fuchsia-950/50",
    iconColor: "text-fuchsia-500",
  },
];

export const PillarsSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section 
      id="pillars" 
      className="py-24 lg:py-32 relative overflow-hidden bg-secondary/30"
      ref={ref as React.RefObject<HTMLElement>}
    >
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold tracking-wide uppercase mb-6">
            Our Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6 text-foreground">
            The <span className="text-gradient">8 Pillars</span> of ATLAS
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            Comprehensive consulting and technology services designed to transform your enterprise.
          </p>
        </div>

        {/* Pillars Grid - Premium Card Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.title}
                to={pillar.href}
                className={`group relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                {/* Card with gradient border */}
                <div className="relative p-[1.5px] rounded-2xl">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pillar.borderColor} opacity-30 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Inner card */}
                  <div className="relative bg-card rounded-[14px] p-5 lg:p-6 h-full flex flex-col items-center text-center transition-all duration-300 group-hover:shadow-lg border border-transparent group-hover:border-transparent">
                    {/* Icon Container */}
                    <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl ${pillar.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`w-6 h-6 lg:w-7 lg:h-7 ${pillar.iconColor}`} strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 className="text-sm lg:text-base font-heading font-semibold text-foreground mb-1 leading-tight tracking-tight">
                      {pillar.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};