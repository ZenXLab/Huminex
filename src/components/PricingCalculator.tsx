import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Calculator, ArrowRight } from "lucide-react";

const clientTypes = [
  { id: "startup", label: "Startup", multiplier: 1 },
  { id: "sme", label: "SME", multiplier: 1.3 },
  { id: "enterprise", label: "Enterprise", multiplier: 2 },
  { id: "agency", label: "Agency Partner", multiplier: 0.85 },
];

const serviceTypes = [
  { id: "web", label: "Web Development", base: 5000 },
  { id: "mobile", label: "Mobile App", base: 8000 },
  { id: "ai", label: "AI Solution", base: 12000 },
  { id: "cloud", label: "Cloud Infrastructure", base: 6000 },
  { id: "consulting", label: "Strategic Consulting", base: 4000 },
  { id: "security", label: "Security Audit", base: 3000 },
];

const addOns = [
  { id: "support", label: "24/7 Premium Support", price: 1500 },
  { id: "maintenance", label: "Monthly Maintenance", price: 800 },
  { id: "training", label: "Team Training", price: 1200 },
  { id: "documentation", label: "Extended Documentation", price: 500 },
];

const complexityLevels = [
  { id: "basic", label: "Basic", multiplier: 1 },
  { id: "standard", label: "Standard", multiplier: 1.5 },
  { id: "complex", label: "Complex", multiplier: 2.2 },
  { id: "enterprise", label: "Enterprise-Grade", multiplier: 3 },
];

export const PricingCalculator = () => {
  const [clientType, setClientType] = useState("startup");
  const [serviceType, setServiceType] = useState("web");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [complexity, setComplexity] = useState("basic");
  const [couponCode, setCouponCode] = useState("");

  const calculatePrice = () => {
    const client = clientTypes.find(c => c.id === clientType);
    const service = serviceTypes.find(s => s.id === serviceType);
    const comp = complexityLevels.find(c => c.id === complexity);
    
    if (!client || !service || !comp) return 0;

    let basePrice = service.base * client.multiplier * comp.multiplier;
    
    const addOnsTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);

    let finalPrice = basePrice + addOnsTotal;

    // Apply coupon
    if (couponCode.toLowerCase() === "atlas10") {
      finalPrice *= 0.9;
    }

    return Math.round(finalPrice);
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <section id="pricing" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            <Calculator className="inline h-4 w-4 mr-2" />
            Price Calculator
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get an instant estimate for your project. No hidden fees, no surprises.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
              {/* Client Type */}
              <div className="p-6 bg-card border border-border rounded-2xl">
                <h3 className="text-lg font-heading font-semibold mb-4 text-foreground">Client Type</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {clientTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setClientType(type.id)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                        clientType === type.id
                          ? "bg-primary text-primary-foreground border-primary shadow-neon"
                          : "bg-muted/50 text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Type */}
              <div className="p-6 bg-card border border-border rounded-2xl">
                <h3 className="text-lg font-heading font-semibold mb-4 text-foreground">Service Type</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {serviceTypes.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setServiceType(service.id)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                        serviceType === service.id
                          ? "bg-primary text-primary-foreground border-primary shadow-neon"
                          : "bg-muted/50 text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {service.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complexity */}
              <div className="p-6 bg-card border border-border rounded-2xl">
                <h3 className="text-lg font-heading font-semibold mb-4 text-foreground">Project Complexity</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {complexityLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setComplexity(level.id)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                        complexity === level.id
                          ? "bg-primary text-primary-foreground border-primary shadow-neon"
                          : "bg-muted/50 text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className="p-6 bg-card border border-border rounded-2xl">
                <h3 className="text-lg font-heading font-semibold mb-4 text-foreground">Add-ons</h3>
                <div className="grid grid-cols-2 gap-3">
                  {addOns.map((addOn) => (
                    <button
                      key={addOn.id}
                      onClick={() => toggleAddOn(addOn.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                        selectedAddOns.includes(addOn.id)
                          ? "bg-primary/10 border-primary"
                          : "bg-muted/50 border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{addOn.label}</span>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedAddOns.includes(addOn.id)
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        }`}>
                          {selectedAddOns.includes(addOn.id) && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">+${addOn.price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="animate-fade-in-up animation-delay-200">
              <div className="sticky top-28 p-8 bg-card border border-border rounded-2xl neon-border">
                <h3 className="text-lg font-heading font-semibold mb-6 text-foreground">Estimated Budget</h3>
                
                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="text-sm text-muted-foreground mb-2 block">Coupon Code</label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                  {couponCode.toLowerCase() === "atlas10" && (
                    <p className="text-xs text-accent mt-2">10% discount applied!</p>
                  )}
                </div>

                {/* Price */}
                <div className="text-center py-8 mb-6 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-2">Starting from</p>
                  <p className="text-5xl font-heading font-bold text-gradient">
                    ${calculatePrice().toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">USD</p>
                </div>

                {/* CTA */}
                <Button variant="hero" className="w-full group" size="lg">
                  Book a Strategy Call
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Final pricing may vary based on detailed requirements
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
