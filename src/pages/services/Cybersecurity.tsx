import { ServicePageLayout } from "@/components/ServicePageLayout";
import { SecurityAnimation } from "@/components/LottieAnimations";
import { Lock } from "lucide-react";

const Cybersecurity = () => {
  return (
    <ServicePageLayout
      title="Cybersecurity & Compliance"
      subtitle="Pillar 7"
      description="Comprehensive security assessments and compliance frameworks to protect your digital assets. From vulnerability testing to SOC2 certification, we ensure your organization stays secure and compliant."
      icon={Lock}
      lottieAnimation={<SecurityAnimation />}
      features={[
        "Vulnerability Assessment & Penetration Testing (VAPT)",
        "SOC2 Type I & II Certification",
        "ISO 27001 Implementation",
        "GDPR & HIPAA Compliance",
        "Security Architecture Review",
        "Incident Response Planning",
        "Security Awareness Training",
        "Cloud Security Assessment",
        "Third-Party Risk Management",
      ]}
      benefits={[
        "Identify and remediate vulnerabilities before attackers exploit them with comprehensive VAPT",
        "Achieve compliance certifications faster with our proven frameworks and experienced auditors",
        "Reduce data breach risk by 90% with defense-in-depth security architecture",
        "Build customer trust with demonstrated security credentials and transparent security practices",
        "Stay ahead of evolving threats with continuous security monitoring and threat intelligence",
      ]}
      caseStudy={{
        title: "SOC2 Certification & Security Transformation",
        client: "B2B SaaS Platform — USA/India",
        challenge: "Achieve SOC2 Type II certification within 6 months to close enterprise deals, starting from minimal security controls and documentation.",
        solution: "Conducted gap assessment, implemented security controls, developed policies and procedures, deployed SIEM, and guided through the audit process.",
        results: [
          "SOC2 Type II in 5 months",
          "Zero critical findings",
          "3 enterprise deals closed",
          "$2M+ in new ARR",
          "24/7 SIEM monitoring live",
          "100+ policies documented",
        ],
      }}
    />
  );
};

export default Cybersecurity;
