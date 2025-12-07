import { Link } from "react-router-dom";
import { Check, X, ArrowRight, Calculator, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

const comparisonData = [
  {
    feature: "View standard plan tiers",
    pricing: true,
    quote: true,
  },
  {
    feature: "Compare features side-by-side",
    pricing: true,
    quote: false,
  },
  {
    feature: "See transparent pricing",
    pricing: true,
    quote: true,
  },
  {
    feature: "Industry-specific recommendations",
    pricing: true,
    quote: true,
  },
  {
    feature: "Custom service selection",
    pricing: false,
    quote: true,
  },
  {
    feature: "Add-on module configuration",
    pricing: false,
    quote: true,
  },
  {
    feature: "Multi-service bundle pricing",
    pricing: false,
    quote: true,
  },
  {
    feature: "Personalized pricing based on company size",
    pricing: false,
    quote: true,
  },
  {
    feature: "Apply coupon codes",
    pricing: false,
    quote: true,
  },
  {
    feature: "Save quote and proceed to onboarding",
    pricing: false,
    quote: true,
  },
];

export const PricingVsQuoteComparison = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
            Pricing Plans vs Custom Quote Builder
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Not sure which option to choose? Here's a quick comparison to help you decide.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-1" />
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <LayoutGrid className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Pricing Plans</h3>
              <p className="text-xs text-muted-foreground mt-1">Compare standard tiers</p>
            </div>
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Calculator className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Quote Builder</h3>
              <p className="text-xs text-muted-foreground mt-1">Custom configuration</p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {comparisonData.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 gap-4 p-4 ${
                  index !== comparisonData.length - 1 ? "border-b border-border" : ""
                } ${index % 2 === 0 ? "bg-background" : ""}`}
              >
                <div className="flex items-center">
                  <span className="text-sm text-foreground">{item.feature}</span>
                </div>
                <div className="flex items-center justify-center">
                  {item.pricing ? (
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  {item.quote ? (
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <h4 className="font-semibold text-foreground mb-2">Just Exploring?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Compare our standard plans to see which tier fits your needs.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="#pricing-plans">
                  View Plans Below <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
              <h4 className="font-semibold text-foreground mb-2">Need Custom Pricing?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Build a quote tailored to your specific business requirements.
              </p>
              <Button className="w-full" asChild>
                <Link to="/get-quote">
                  Open Quote Builder <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingVsQuoteComparison;
