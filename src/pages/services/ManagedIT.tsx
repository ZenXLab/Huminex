import { ServicePageLayout } from "@/components/ServicePageLayout";
import { SupportAnimation } from "@/components/LottieAnimations";
import { Shield } from "lucide-react";

const ManagedIT = () => {
  return (
    <ServicePageLayout
      title="Managed IT Services (MSP)"
      subtitle="Pillar 6"
      description="24/7 managed services ensuring your systems run smoothly with guaranteed SLAs. From infrastructure monitoring to help desk support, we handle your IT operations so you can focus on your business."
      icon={Shield}
      lottieAnimation={<SupportAnimation />}
      features={[
        "24/7 Infrastructure Monitoring",
        "Help Desk & Technical Support",
        "Proactive Maintenance & Patching",
        "Backup & Disaster Recovery",
        "Network Management",
        "Cloud Resource Management",
        "Performance Optimization",
        "Vendor Management",
        "SLA-Backed Service Guarantees",
      ]}
      benefits={[
        "Reduce IT operational burden by 80% with our comprehensive managed services coverage",
        "Guarantee 99.9%+ uptime with proactive monitoring and rapid incident response",
        "Convert unpredictable IT costs to fixed monthly investments with transparent pricing",
        "Access a team of certified experts across multiple technologies without hiring challenges",
        "Focus on core business while we handle the complexity of IT operations",
      ]}
      caseStudy={{
        title: "Complete IT Operations Outsourcing",
        client: "Logistics Company — Middle East",
        challenge: "Manage IT infrastructure across 50+ locations with limited internal IT staff, frequent outages, and no standardized processes or documentation.",
        solution: "Deployed comprehensive managed services including 24/7 NOC, help desk, proactive monitoring, and standardized IT operations across all locations.",
        results: [
          "99.95% uptime achieved",
          "MTTR reduced from 4hrs to 30min",
          "60% reduction in IT incidents",
          "24/7 support coverage",
          "40% cost savings",
          "50+ locations unified",
        ],
      }}
    />
  );
};

export default ManagedIT;
