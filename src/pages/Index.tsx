import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { AboutSection } from "@/components/AboutSection";
import { PillarsSection } from "@/components/PillarsSection";
import { DemoVideoSection } from "@/components/DemoVideoSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { ComparisonTable } from "@/components/ComparisonTable";
import { PricingSection } from "@/components/PricingSection";
import { EnhancedTestimonialsSection } from "@/components/EnhancedTestimonialsSection";
import { Footer } from "@/components/Footer";
import { QuoteModal } from "@/components/QuoteModal";

const Index = () => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CropXon ATLAS",
    "description": "AI-powered Workforce Operating System - From Hire to Retire and everything in between. Unified HR, Payroll, Compliance, Finance, Recruitment, Projects, and Operations.",
    "url": "https://atlas.cropxon.com",
    "applicationCategory": "BusinessApplication",
    "logo": "https://atlas.cropxon.com/logo.png",
    "sameAs": [
      "https://twitter.com/CropXon",
      "https://linkedin.com/company/cropxon"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXX-XXX-XXXX",
      "contactType": "customer service",
      "email": "hello@atlas.cropxon.com"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "offerCount": "8",
      "offers": [
        { "@type": "Offer", "name": "Digital Engineering" },
        { "@type": "Offer", "name": "AI & Automation" },
        { "@type": "Offer", "name": "Experience Design" },
        { "@type": "Offer", "name": "Cloud & DevOps" },
        { "@type": "Offer", "name": "Enterprise Consulting" },
        { "@type": "Offer", "name": "Managed IT Services" },
        { "@type": "Offer", "name": "Cybersecurity" },
        { "@type": "Offer", "name": "Industry Solutions" }
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>CropXon ATLAS | AI-Powered Workforce Operating System - From Hire to Retire</title>
        <meta name="description" content="ATLAS by CropXon - The AI-powered Workforce OS that automates HR, Payroll, Compliance, Finance, Recruitment, Projects, and Operations for modern enterprises. From hire to retire and everything in between." />
        <meta name="keywords" content="workforce management, HR software, payroll automation, compliance management, HRMS, enterprise software, AI HR, workforce OS, India payroll, employee management" />
        <link rel="canonical" href="https://atlas.cropxon.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="CropXon ATLAS | Enterprise Consulting & Digital Transformation" />
        <meta property="og:description" content="Enterprise-grade consulting and digital transformation solutions. AI, Cloud, Cybersecurity & more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://atlas.cropxon.com" />
        <meta property="og:site_name" content="CropXon ATLAS" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CropXon ATLAS | Enterprise Consulting & Digital Transformation" />
        <meta name="twitter:description" content="Enterprise-grade consulting and digital transformation solutions." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background">
        <Header onQuoteClick={() => setQuoteModalOpen(true)} />
        
        <article>
          <HeroSection onQuoteClick={() => setQuoteModalOpen(true)} />
          
          <section aria-labelledby="stats-heading">
            <StatsSection />
          </section>
          
          <section aria-labelledby="about-heading">
            <AboutSection />
          </section>
          
          <section aria-labelledby="pillars-heading">
            <PillarsSection />
          </section>
          
          <section aria-labelledby="demo-heading">
            <DemoVideoSection />
          </section>
          
          <section aria-labelledby="why-choose-heading">
            <WhyChooseSection />
          </section>
          
          <section aria-labelledby="comparison-heading">
            <ComparisonTable />
          </section>
          
          <section id="pricing" aria-labelledby="pricing-heading">
            <PricingSection />
          </section>
          
          <section aria-labelledby="testimonials-heading">
            <EnhancedTestimonialsSection />
          </section>
        </article>
        
        <Footer />
        <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
      </main>
    </>
  );
};

export default Index;
