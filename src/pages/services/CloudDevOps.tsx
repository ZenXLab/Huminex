import { ServicePageLayout } from "@/components/ServicePageLayout";
import { CloudAnimation } from "@/components/LottieAnimations";
import { Cloud } from "lucide-react";

const CloudDevOps = () => {
  return (
    <ServicePageLayout
      title="Cloud, DevOps & Platforms"
      subtitle="Pillar 4"
      description="Build resilient, scalable cloud infrastructure with automated deployment pipelines. We help you modernize your infrastructure, implement CI/CD, and achieve operational excellence through DevOps best practices."
      icon={Cloud}
      lottieAnimation={<CloudAnimation />}
      features={[
        "Cloud Architecture Design (AWS, Azure, GCP)",
        "Kubernetes & Container Orchestration",
        "CI/CD Pipeline Implementation",
        "Infrastructure as Code (Terraform, Pulumi)",
        "Microservices Architecture",
        "Serverless Solutions",
        "Cloud Migration & Modernization",
        "Performance Optimization",
        "Disaster Recovery & High Availability",
      ]}
      benefits={[
        "Reduce infrastructure costs by 40% through right-sizing, reserved instances, and efficient resource utilization",
        "Deploy 10x faster with automated CI/CD pipelines that catch issues before production",
        "Achieve 99.99% uptime with multi-region deployments and automated failover mechanisms",
        "Scale automatically to handle traffic spikes without manual intervention or over-provisioning",
        "Improve developer productivity by 60% with modern tooling and streamlined workflows",
      ]}
      caseStudy={{
        title: "Cloud-Native Transformation & DevOps Implementation",
        client: "E-commerce Platform — India",
        challenge: "Migrate from a monolithic on-premise architecture to cloud-native microservices while maintaining zero downtime during peak sale events handling 1M+ concurrent users.",
        solution: "Designed a Kubernetes-based microservices architecture on AWS with GitOps-driven deployments, auto-scaling policies, and comprehensive observability stack.",
        results: [
          "Zero downtime migration",
          "50% infrastructure cost savings",
          "Deployment time: 30 min → 5 min",
          "Handled 2M concurrent users",
          "Auto-scaling in 60 seconds",
          "99.99% uptime achieved",
        ],
      }}
    />
  );
};

export default CloudDevOps;
