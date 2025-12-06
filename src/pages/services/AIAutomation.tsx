import { ServicePageLayout } from "@/components/ServicePageLayout";
import { AIBrainAnimation } from "@/components/LottieAnimations";
import { Brain } from "lucide-react";

const AIAutomation = () => {
  return (
    <ServicePageLayout
      title="AI & Intelligent Automation"
      subtitle="Pillar 2"
      description="Harness the power of artificial intelligence to automate workflows, predict outcomes, and transform your operations. From conversational AI to predictive analytics, we build intelligent solutions that learn and adapt."
      icon={Brain}
      lottieAnimation={<AIBrainAnimation />}
      features={[
        "Custom AI Chatbots & Virtual Assistants",
        "RAG (Retrieval-Augmented Generation) Systems",
        "Workflow Automation with AI",
        "Predictive Analytics & Forecasting",
        "Natural Language Processing (NLP)",
        "Computer Vision Solutions",
        "Machine Learning Model Development",
        "AI-Powered Document Processing",
        "Recommendation Engines",
      ]}
      benefits={[
        "Reduce operational costs by up to 70% through intelligent automation of repetitive tasks",
        "Improve customer satisfaction with 24/7 AI-powered support that handles 80% of queries automatically",
        "Make data-driven decisions with predictive models that achieve 90%+ accuracy rates",
        "Accelerate document processing 10x faster with AI-powered extraction and classification",
        "Stay competitive with cutting-edge AI capabilities that evolve with your business needs",
      ]}
      caseStudy={{
        title: "AI-Powered Customer Service Transformation",
        client: "FinTech Startup — Singapore",
        challenge: "Handle rapidly growing customer queries (10,000+ daily) without proportionally scaling the support team, while maintaining response quality and compliance.",
        solution: "Implemented a RAG-based AI assistant integrated with their knowledge base, capable of handling complex financial queries, escalating edge cases, and learning from agent feedback.",
        results: [
          "85% queries automated",
          "Average response time: 3 seconds",
          "40% cost reduction",
          "95% customer satisfaction",
          "24/7 multilingual support",
          "100% compliance maintained",
        ],
      }}
    />
  );
};

export default AIAutomation;
