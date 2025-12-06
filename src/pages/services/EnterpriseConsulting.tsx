import { ServicePageLayout } from "@/components/ServicePageLayout";
import { ConsultingAnimation } from "@/components/LottieAnimations";
import { Briefcase } from "lucide-react";

const EnterpriseConsulting = () => {
  return (
    <ServicePageLayout
      title="Enterprise Consulting & Transformation"
      subtitle="Pillar 5"
      description="Strategic technology leadership and governance for enterprise transformation. Our CTO-as-a-Service and consulting offerings help you navigate complex technology decisions and drive organizational change."
      icon={Briefcase}
      lottieAnimation={<ConsultingAnimation />}
      features={[
        "CTO-as-a-Service",
        "Digital Transformation Strategy",
        "Technology Roadmap Development",
        "Vendor Selection & Management",
        "IT Governance & Compliance",
        "Architecture Review & Assessment",
        "Technical Due Diligence",
        "Change Management",
        "Executive Technology Advisory",
      ]}
      benefits={[
        "Access C-level technology expertise without the full-time executive cost commitment",
        "Align technology investments with business objectives for maximum ROI",
        "Reduce technology risk through comprehensive architecture reviews and governance frameworks",
        "Accelerate decision-making with data-driven technology assessments and vendor evaluations",
        "Navigate digital transformation with proven methodologies and change management expertise",
      ]}
      caseStudy={{
        title: "Digital Transformation Strategy for Manufacturing Giant",
        client: "Manufacturing Conglomerate — India",
        challenge: "Develop and execute a 3-year digital transformation roadmap across 15 manufacturing plants, unifying disparate systems and enabling Industry 4.0 capabilities.",
        solution: "Provided CTO advisory services, developed a phased transformation roadmap, conducted vendor evaluations, and guided implementation of IoT, AI, and cloud solutions.",
        results: [
          "₹50Cr in annual savings identified",
          "15 plants digitally connected",
          "30% productivity improvement",
          "Real-time production visibility",
          "Unified data platform deployed",
          "Industry 4.0 certified",
        ],
      }}
    />
  );
};

export default EnterpriseConsulting;
