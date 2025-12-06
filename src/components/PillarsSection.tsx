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
  ArrowRight
} from "lucide-react";
import {
  CodeAnimation,
  AIBrainAnimation,
  DesignAnimation,
  CloudAnimation,
  ConsultingAnimation,
  SupportAnimation,
  SecurityAnimation,
  IndustryAnimation,
} from "./LottieAnimations";

const pillars = [
  {
    icon: Code,
    animation: CodeAnimation,
    title: "Digital Engineering",
    description: "Websites, Apps, SaaS, Portals",
    details: "Full-stack development with modern frameworks, scalable architectures, and seamless user experiences.",
    href: "/services/digital-engineering",
  },
  {
    icon: Brain,
    animation: AIBrainAnimation,
    title: "AI & Intelligent Automation",
    description: "Chatbots, RAG, Workflows, Predictive Analytics",
    details: "Harness the power of artificial intelligence to automate, predict, and transform your operations.",
    href: "/services/ai-automation",
  },
  {
    icon: Palette,
    animation: DesignAnimation,
    title: "Experience Design Studio",
    description: "Branding, UX/UI, Creative, Customer Journey",
    details: "Craft memorable experiences that resonate with your audience and drive engagement.",
    href: "/services/experience-design",
  },
  {
    icon: Cloud,
    animation: CloudAnimation,
    title: "Cloud, DevOps & Platforms",
    description: "Infrastructure, CI/CD, Microservices",
    details: "Build resilient, scalable cloud infrastructure with automated deployment pipelines.",
    href: "/services/cloud-devops",
  },
  {
    icon: Briefcase,
    animation: ConsultingAnimation,
    title: "Enterprise Consulting",
    description: "CTO Services, Strategy, Governance",
    details: "Strategic guidance and executive-level technology leadership for enterprise transformation.",
    href: "/services/enterprise-consulting",
  },
  {
    icon: Shield,
    animation: SupportAnimation,
    title: "Managed IT Services",
    description: "Monitoring, Support, Uptime, SLA",
    details: "24/7 managed services ensuring your systems run smoothly with guaranteed SLAs.",
    href: "/services/managed-it",
  },
  {
    icon: Lock,
    animation: SecurityAnimation,
    title: "Cybersecurity & Compliance",
    description: "VAPT, SOC2, ISO, GDPR",
    details: "Comprehensive security assessments and compliance frameworks to protect your assets.",
    href: "/services/cybersecurity",
  },
  {
    icon: LayoutGrid,
    animation: IndustryAnimation,
    title: "Industry-Specific Solutions",
    description: "POS, Healthcare, Education, Agri, Logistics",
    details: "Tailored solutions designed for the unique challenges of your industry vertical.",
    href: "/services/industry-solutions",
  },
];

export const PillarsSection = () => {
  return (
    <section id="pillars" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            Our Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
            The <span className="text-gradient">8 Pillars</span> of ATLAS
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive consulting and technology services designed to transform your enterprise.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => {
            const Animation = pillar.animation;
            return (
              <Link
                key={pillar.title}
                to={pillar.href}
                className="group relative bg-card border border-border/50 rounded-2xl p-6 card-glow neon-border animate-fade-in-up block"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
                     style={{ backgroundImage: `linear-gradient(to bottom right, hsl(var(--primary)), hsl(var(--accent)))` }} />

                {/* Animation Container */}
                <div className="relative mb-4 flex justify-center">
                  <div className="transform scale-50 origin-center group-hover:scale-60 transition-transform duration-500">
                    <Animation />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {pillar.description}
                </p>
                <p className="text-sm text-foreground/60 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {pillar.details}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center gap-2 text-primary group-hover:text-accent transition-colors duration-300">
                  <span className="text-sm font-medium">Learn More</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
