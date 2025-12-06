import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { PillarsSection } from "@/components/PillarsSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { PricingCalculator } from "@/components/PricingCalculator";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AboutSection />
      <PillarsSection />
      <WhyChooseSection />
      <PricingCalculator />
      <TestimonialsSection />
      <Footer />
    </main>
  );
};

export default Index;
