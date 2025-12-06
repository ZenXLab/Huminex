import { ServicePageLayout } from "@/components/ServicePageLayout";
import { CodeAnimation } from "@/components/LottieAnimations";
import { Code } from "lucide-react";

const DigitalEngineering = () => {
  return (
    <ServicePageLayout
      title="Digital Engineering"
      subtitle="Pillar 1"
      description="Build cutting-edge websites, mobile applications, SaaS platforms, and enterprise portals with our full-stack development expertise. We transform your vision into scalable, performant digital products."
      icon={Code}
      lottieAnimation={<CodeAnimation />}
      features={[
        "Custom Web Application Development",
        "Progressive Web Apps (PWA)",
        "Native & Cross-Platform Mobile Apps",
        "SaaS Platform Architecture",
        "Enterprise Portal Development",
        "API Design & Development",
        "Microservices Architecture",
        "Legacy System Modernization",
        "E-commerce Solutions",
      ]}
      benefits={[
        "Reduce time-to-market by 40% with our agile development methodology and pre-built component libraries",
        "Achieve 99.9% uptime with our battle-tested infrastructure patterns and monitoring solutions",
        "Scale effortlessly from 100 to 1 million users with our cloud-native architecture designs",
        "Lower total cost of ownership through clean, maintainable code and comprehensive documentation",
        "Future-proof your stack with modern technologies like React, Node.js, TypeScript, and Kubernetes",
      ]}
      caseStudy={{
        title: "Enterprise SaaS Platform Transformation",
        client: "Leading Retail Chain — India",
        challenge: "The client needed to replace their legacy inventory management system with a modern, cloud-native SaaS platform that could handle 500+ stores across multiple regions.",
        solution: "We developed a microservices-based platform using React, Node.js, and PostgreSQL, deployed on AWS with auto-scaling capabilities and real-time sync across all locations.",
        results: [
          "60% faster inventory updates",
          "99.99% platform uptime",
          "50% reduction in IT costs",
          "3-month delivery timeline",
          "500+ stores connected",
          "Real-time analytics dashboard",
        ],
      }}
    />
  );
};

export default DigitalEngineering;
