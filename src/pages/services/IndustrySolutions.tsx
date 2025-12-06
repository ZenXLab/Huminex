import { ServicePageLayout } from "@/components/ServicePageLayout";
import { IndustryAnimation } from "@/components/LottieAnimations";
import { LayoutGrid } from "lucide-react";

const IndustrySolutions = () => {
  return (
    <ServicePageLayout
      title="Industry-Specific Solutions"
      subtitle="Pillar 8"
      description="Tailored solutions designed for the unique challenges of your industry vertical. From retail POS to healthcare management, we bring deep domain expertise to deliver solutions that truly fit your business."
      icon={LayoutGrid}
      lottieAnimation={<IndustryAnimation />}
      features={[
        "Retail & POS Solutions",
        "Healthcare Management Systems",
        "EdTech Platforms",
        "AgriTech Solutions",
        "Logistics & Fleet Management",
        "Hospitality Management",
        "Real Estate Platforms",
        "FinTech Solutions",
        "FoodTech & Restaurant Tech",
      ]}
      benefits={[
        "Leverage pre-built industry modules to reduce development time by 50%",
        "Benefit from our deep domain expertise gained from 100+ industry-specific implementations",
        "Ensure regulatory compliance with solutions designed for your industry's requirements",
        "Integrate seamlessly with industry-standard tools and platforms your business already uses",
        "Scale confidently with solutions proven in production across similar businesses",
      ]}
      caseStudy={{
        title: "Unified POS & Inventory Platform for Restaurant Chain",
        client: "Quick Service Restaurant Chain — India",
        challenge: "Replace fragmented POS systems across 200+ outlets with a unified platform supporting online orders, loyalty programs, and real-time inventory management.",
        solution: "Developed a cloud-native POS platform with mobile ordering, kitchen display systems, inventory management, and integration with delivery aggregators.",
        results: [
          "200+ outlets live in 4 months",
          "35% increase in average order value",
          "25% reduction in food waste",
          "Real-time inventory visibility",
          "Integrated with 5 delivery apps",
          "2M+ loyalty members enrolled",
        ],
      }}
    />
  );
};

export default IndustrySolutions;
