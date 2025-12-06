import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { PillarsSection } from "@/components/PillarsSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { PricingCalculator } from "@/components/PricingCalculator";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";
import { QuoteModal } from "@/components/QuoteModal";

const Index = () => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CropXon ATLAS",
    "description": "Enterprise-grade consulting, AI solutions, digital engineering, and technology transformation services",
    "url": "https://atlas.cropxon.com",
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
        <title>CropXon ATLAS | Enterprise Consulting & Digital Transformation Services</title>
        <meta name="description" content="ATLAS by CropXon - Enterprise-grade consulting, AI solutions, digital engineering, cloud services, and technology transformation. Get custom quotes for your business needs." />
        <meta name="keywords" content="digital transformation, AI consulting, enterprise solutions, cloud services, DevOps, cybersecurity, managed IT services, UX design, software development, India" />
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
          
          <section aria-labelledby="about-heading">
            <AboutSection />
          </section>
          
          <section aria-labelledby="pillars-heading">
            <PillarsSection />
          </section>
          
          <section aria-labelledby="why-choose-heading">
            <WhyChooseSection />
          </section>
          
          <section id="pricing" aria-labelledby="pricing-heading">
            <PricingCalculator />
          </section>
          
          <section aria-labelledby="testimonials-heading">
            <TestimonialsSection />
          </section>
        </article>
        
        <Footer />
        <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
      </main>
    </>
  );
};

export default Index;
