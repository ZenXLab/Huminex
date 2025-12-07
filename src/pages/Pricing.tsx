import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingSection } from "@/components/PricingSection";
import { PricingLeadCapture } from "@/components/pricing/PricingLeadCapture";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { ExitIntentPopup } from "@/components/pricing/ExitIntentPopup";
import { BusinessTypeMatcher } from "@/components/pricing/BusinessTypeMatcher";
import { PricingVsQuoteComparison } from "@/components/pricing/PricingVsQuoteComparison";

const Pricing = () => {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const hasShownExitPopup = useRef(false);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from top of viewport
      if (e.clientY <= 0 && !hasShownExitPopup.current) {
        hasShownExitPopup.current = true;
        setShowExitPopup(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <>
      <Helmet>
        <title>ATLAS Pricing - Flexible Plans for Every Business | CropXon</title>
        <meta 
          name="description" 
          content="Explore ATLAS pricing plans for India and Global markets. From startups to enterprises, find the perfect workforce management solution with transparent pricing." 
        />
        <meta name="keywords" content="ATLAS pricing, HR software pricing, payroll software cost, workforce management plans, India HR software, enterprise HRMS" />
        <link rel="canonical" href="https://atlas.cropxon.com/pricing" />
        
        {/* Open Graph */}
        <meta property="og:title" content="ATLAS Pricing - Flexible Plans for Every Business" />
        <meta property="og:description" content="Transparent pricing for India & Global markets. Start free, scale as you grow." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://atlas.cropxon.com/pricing" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ATLAS Pricing - Workforce OS for Modern Enterprises" />
        <meta name="twitter:description" content="From ₹3,999/month. Payroll, HR, Compliance, all-in-one." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "ATLAS Workforce Operating System",
            "description": "AI-Powered HR, Payroll, Compliance platform",
            "brand": {
              "@type": "Brand",
              "name": "CropXon ATLAS"
            },
            "offers": [
              {
                "@type": "Offer",
                "name": "Starter",
                "price": "3999",
                "priceCurrency": "INR",
                "priceValidUntil": "2025-12-31",
                "availability": "https://schema.org/InStock"
              },
              {
                "@type": "Offer",
                "name": "Professional",
                "price": "7999",
                "priceCurrency": "INR",
                "priceValidUntil": "2025-12-31",
                "availability": "https://schema.org/InStock"
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16 lg:pt-18">
          {/* Hero Section */}
          <section className="py-12 lg:py-20 bg-gradient-to-b from-primary/5 to-background">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Compare Plans & Features
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Compare ATLAS plans side-by-side. Find the right fit for your business size and needs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  30-Day Free Trial
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  No Credit Card Required
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Price Lock Guarantee
                </span>
              </div>
              
              {/* Clarification Banner */}
              <div className="max-w-2xl mx-auto p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Need a custom quote?</strong> Use our{" "}
                  <a href="/get-quote" className="text-primary hover:underline font-medium">
                    Quote Builder
                  </a>{" "}
                  to configure services, add-ons, and get personalized pricing for your specific requirements.
                </p>
              </div>
            </div>
          </section>

          {/* Business Type Matcher */}
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <BusinessTypeMatcher />
            </div>
          </section>

          {/* Pricing vs Quote Comparison */}
          <PricingVsQuoteComparison />

          {/* Main Pricing Section */}
          <div id="pricing-plans">
            <PricingSection />
          </div>

          {/* Lead Capture */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <PricingLeadCapture />
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <PricingFAQ />
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Exit Intent Popup */}
      <ExitIntentPopup 
        isOpen={showExitPopup} 
        onClose={() => setShowExitPopup(false)} 
      />
    </>
  );
};

export default Pricing;
