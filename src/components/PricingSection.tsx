import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small teams getting started",
    monthlyPrice: 4999,
    annualPrice: 3999,
    icon: Zap,
    popular: false,
    features: [
      "Up to 25 employees",
      "Core HR & Workforce",
      "Attendance & Leave",
      "Basic Payroll",
      "Email Support",
      "Standard Reports",
    ],
    cta: "Start Free Trial",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Professional",
    description: "For growing businesses with more needs",
    monthlyPrice: 9999,
    annualPrice: 7999,
    icon: Star,
    popular: true,
    features: [
      "Up to 100 employees",
      "Everything in Starter",
      "Recruitment & ATS",
      "Expense Management",
      "Compliance Suite",
      "Priority Support",
      "Advanced Analytics",
      "Custom Workflows",
    ],
    cta: "Get Started",
    color: "from-primary to-accent"
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex needs",
    monthlyPrice: null,
    annualPrice: null,
    icon: Building2,
    popular: false,
    features: [
      "Unlimited employees",
      "Everything in Professional",
      "All 15 Modules",
      "SSO & SAML",
      "Dedicated Account Manager",
      "Custom Integrations",
      "On-premise Option",
      "SLA Guarantee",
      "White-label Options",
    ],
    cta: "Contact Sales",
    color: "from-purple-500 to-violet-500"
  },
];

export const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Transparent Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Choose Your <span className="text-gradient">Growth Plan</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            No hidden fees. No surprises. Scale your workforce management with confidence.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-16 h-8 rounded-full bg-secondary border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            role="switch"
            aria-checked={isAnnual}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-primary shadow-lg transition-transform duration-300 ${
                isAnnual ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Annual
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
              Save 20%
            </span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            
            return (
              <div
                key={plan.name}
                className={`relative group rounded-2xl border transition-all duration-500 ${
                  plan.popular 
                    ? 'bg-card border-primary shadow-xl shadow-primary/10 scale-105 z-10' 
                    : 'bg-card border-border hover:border-primary/50'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-5 rounded-2xl`} />

                <div className="relative p-8">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-foreground">{plan.name}</h3>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    {price ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-foreground">₹{price.toLocaleString()}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-foreground">Custom Pricing</div>
                    )}
                    {price && isAnnual && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Billed annually (₹{(price * 12).toLocaleString()}/year)
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to="/get-quote">
                    <Button 
                      className={`w-full h-12 font-semibold transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg' 
                          : ''
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Need a custom solution? We've got you covered.
          </p>
          <Link to="/contact">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              Talk to our team <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
