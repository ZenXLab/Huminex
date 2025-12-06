import { ServicePageLayout } from "@/components/ServicePageLayout";
import { DesignAnimation } from "@/components/LottieAnimations";
import { Palette } from "lucide-react";

const ExperienceDesign = () => {
  return (
    <ServicePageLayout
      title="Experience Design Studio"
      subtitle="Pillar 3"
      description="Create memorable brand experiences that resonate with your audience. From comprehensive brand identity to intuitive UX/UI design, our creative studio transforms ideas into visually stunning, user-centric solutions."
      icon={Palette}
      lottieAnimation={<DesignAnimation />}
      features={[
        "Brand Identity & Strategy",
        "UX Research & User Testing",
        "UI Design Systems",
        "Motion Design & Micro-interactions",
        "Customer Journey Mapping",
        "Design Thinking Workshops",
        "Prototype Development",
        "Accessibility (WCAG) Compliance",
        "Creative Campaign Design",
      ]}
      benefits={[
        "Increase conversion rates by 200% with data-driven UX optimizations and A/B tested designs",
        "Build brand recognition with cohesive visual systems that work across all touchpoints",
        "Reduce user friction with intuitive interfaces based on extensive user research and testing",
        "Accelerate development with comprehensive design systems and reusable component libraries",
        "Ensure inclusivity with accessible designs that comply with WCAG 2.1 AA standards",
      ]}
      caseStudy={{
        title: "Complete Brand & Digital Experience Overhaul",
        client: "Healthcare SaaS Company — Dubai",
        challenge: "Rebrand from a clinical, outdated identity to a modern, approachable brand while redesigning their patient portal to improve adoption rates.",
        solution: "Conducted extensive user research, developed a new brand identity emphasizing trust and innovation, and redesigned the patient portal with a focus on accessibility and ease of use.",
        results: [
          "300% increase in portal adoption",
          "45% reduction in support tickets",
          "Brand recognition up 150%",
          "NPS score improved to 72",
          "WCAG 2.1 AA compliant",
          "Design system with 200+ components",
        ],
      }}
    />
  );
};

export default ExperienceDesign;
