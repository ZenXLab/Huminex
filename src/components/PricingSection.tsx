import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Star, Building2, Globe, IndianRupee, TrendingUp, Shield, Clock, FileText } from "lucide-react";
import { PricingTierCard } from "./pricing/PricingTierCard";
import { PricingCalculator } from "./pricing/PricingCalculator";
import { PricingAddons } from "./pricing/PricingAddons";
import { PricingFAQ } from "./pricing/PricingFAQ";
import { PricingLeadCapture } from "./pricing/PricingLeadCapture";
import { PricingComparisonModal } from "./PricingComparisonModal";
import { InvoicePreviewModal } from "./pricing/InvoicePreviewModal";
import { useClickstream } from "@/hooks/useClickstream";

const indiaPricing = [
  {
    name: "Starter",
    description: "Best for small teams getting started",
    monthlyPrice: 4999,
    annualPrice: 3999,
    originalMonthly: 4999,
    originalAnnual: null,
    perUser: false,
    employeeLimit: "Up to 25 employees",
    icon: Zap,
    popular: false,
    features: [
      "Core HR & Workforce",
      "Attendance & Leave Management",
      "Basic Payroll (India statutory)",
      "Standard Letters & Documents",
      "Email Support (48hr response)",
      "Standard Reports & Analytics",
      "Unlimited Document Storage",
      "AI-Powered Smart Search",
    ],
    cta: "Start Free Trial",
    ctaLink: "/get-quote",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: "Professional",
    description: "Built for growing companies",
    monthlyPrice: 9999,
    annualPrice: 7999,
    originalMonthly: 9999,
    originalAnnual: null,
    perUser: false,
    employeeLimit: "Up to 100 employees",
    icon: Star,
    popular: true,
    features: [
      "Everything in Starter +",
      "Advanced Payroll (India compliance)",
      "Expense & Reimbursements",
      "Recruitment & ATS",
      "Auto-Offer Letter Generator",
      "Compliance Suite (PF, ESIC, PT)",
      "Priority Support (24hr response)",
      "AI Smart Insights",
      "Custom Workflows (OpZenix)",
      "Integration Hub (Slack, GSuite)",
    ],
    cta: "Get Started",
    ctaLink: "/get-quote",
    gradient: "from-primary to-accent"
  },
  {
    name: "Enterprise India",
    description: "For 200–50,000+ employees",
    monthlyPrice: null,
    annualPrice: null,
    originalMonthly: null,
    originalAnnual: null,
    perUser: false,
    employeeLimit: "Unlimited employees",
    icon: Building2,
    popular: false,
    features: [
      "All 15+ ATLAS Modules",
      "SSO & SAML Integration",
      "Custom Integrations",
      "On-Premise Deployment Option",
      "White-label Branding",
      "Dedicated Account Manager",
      "24/7 Enterprise Support",
      "99.9% SLA Guarantee",
      "SOC2, ISO, GDPR Compliance",
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
    gradient: "from-purple-500 to-violet-500"
  },
];

const globalPricing = [
  {
    name: "Essential",
    description: "Perfect for small teams adopting smarter HR",
    monthlyPrice: 2.5,
    annualPrice: 2,
    originalMonthly: 2.5,
    originalAnnual: null,
    perUser: true,
    minimumFee: "$79/month",
    icon: Zap,
    popular: false,
    features: [
      "Core HRMS",
      "Employee Database",
      "Leave & Attendance",
      "Basic Payroll",
      "Standard Reports",
      "Email Support",
      "Unlimited Document Storage",
      "AI-Powered Smart Search",
    ],
    cta: "Start Free Trial",
    ctaLink: "/get-quote",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: "Growth",
    description: "For scaling companies needing automations",
    monthlyPrice: 4,
    annualPrice: 3.2,
    originalMonthly: 4,
    originalAnnual: null,
    perUser: true,
    minimumFee: "$149/month",
    icon: Star,
    popular: true,
    features: [
      "Everything in Essential +",
      "Recruitment & ATS",
      "Expense Management",
      "Compliance Suite",
      "Advanced Payroll Engine",
      "Analytics + Dashboards",
      "Custom Workflows (OpZenix)",
      "Priority Support",
      "API Access",
      "Integration Hub (Slack, GSuite, Office)",
    ],
    cta: "Get Started",
    ctaLink: "/get-quote",
    gradient: "from-primary to-accent"
  },
  {
    name: "Enterprise",
    description: "For global organizations with complex workflows",
    monthlyPrice: null,
    annualPrice: null,
    originalMonthly: null,
    originalAnnual: null,
    perUser: false,
    icon: Building2,
    popular: false,
    features: [
      "Unlimited employees",
      "All 15+ ATLAS Modules",
      "SSO + SAML + SCIM",
      "Dedicated Customer Success Manager",
      "Onboarding & Implementation",
      "24/7 Enterprise Support",
      "White-label Option",
      "On-Premise / Private Cloud",
      "SLA-backed uptime",
      "Custom Integrations",
      "SOC2, ISO, GDPR compliance",
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
    gradient: "from-purple-500 to-violet-500"
  },
];

// Addon data for invoice modal
const indiaAddons = [
  { id: "bgv", name: "Background Verification (BGV)", price: 49 },
  { id: "doc-verify", name: "Document Verification", price: 25 },
  { id: "notifications", name: "Slack/WhatsApp Notifications", price: 2 },
  { id: "payroll-reprocess", name: "Payroll Re-processing", price: 5 },
  { id: "payroll-approval", name: "Payroll Approval Workflows", price: 1 },
  { id: "workflow-runs", name: "Extra 1,000 Workflow Runs", price: 999 },
  { id: "proxima-ai", name: "Proxima AI Assistant", price: 49 },
  { id: "ai-insights", name: "AI Insights Dashboard", price: 19 },
];

const globalAddons = [
  { id: "bgv", name: "Background Verification (BGV)", price: 1.5 },
  { id: "doc-verify", name: "Document Verification", price: 0.75 },
  { id: "notifications", name: "Slack/WhatsApp Notifications", price: 0.5 },
  { id: "payroll-reprocess", name: "Payroll Re-processing", price: 0.25 },
  { id: "payroll-approval", name: "Payroll Approval Workflows", price: 0.15 },
  { id: "workflow-runs", name: "Extra 1,000 Workflow Runs", price: 29 },
  { id: "proxima-ai", name: "Proxima AI Assistant", price: 1.5 },
  { id: "ai-insights", name: "AI Insights Dashboard", price: 0.5 },
];

export const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [region, setRegion] = useState<'india' | 'global'>('india');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [addonsPrice, setAddonsPrice] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const { trackEvent } = useClickstream();

  const pricing = region === 'india' ? indiaPricing : globalPricing;
  const currency = region === 'india' ? '₹' : '$';
  const addonsList = region === 'india' ? indiaAddons : globalAddons;

  const handleAddonsChange = useCallback((addons: string[], totalPrice: number) => {
    setSelectedAddons(addons);
    setAddonsPrice(totalPrice);
  }, []);

  const handlePlanSelect = (planName: string, price: number) => {
    setSelectedPlan({ name: planName, price });
    trackEvent("plan_selected", { planName, price, region, isAnnual });
  };

  const openInvoicePreview = () => {
    if (!selectedPlan && selectedAddons.length === 0) {
      // Auto-select Professional/Growth plan if nothing selected
      const defaultPlan = pricing[1];
      const defaultPrice = isAnnual ? defaultPlan.annualPrice : defaultPlan.monthlyPrice;
      if (defaultPrice) {
        setSelectedPlan({ name: defaultPlan.name, price: defaultPrice });
      }
    }
    setIsInvoiceModalOpen(true);
    trackEvent("invoice_preview_button_clicked", { 
      region, 
      selectedPlan: selectedPlan?.name,
      addonsCount: selectedAddons.length,
      isAnnual 
    });
  };

  // Get selected addon details for invoice
  const selectedAddonDetails = selectedAddons.map(id => {
    const addon = addonsList.find(a => a.id === id);
    return addon ? { id: addon.id, name: addon.name, price: addon.price } : null;
  }).filter(Boolean) as { id: string; name: string; price: number }[];

  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Transparent Pricing
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
            Workday-level Power.{" "}
            <span className="text-gradient">Startup-friendly Pricing.</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
            Replace 12 tools with one AI-native platform. No hidden fees. No surprises. 
            Scale your workforce management with confidence.
          </p>
        </div>

        {/* Region Toggle */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Button
            variant={region === 'india' ? 'default' : 'outline'}
            onClick={() => setRegion('india')}
            className={`h-12 px-6 rounded-full font-semibold transition-all ${
              region === 'india' 
                ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-lg' 
                : 'hover:border-primary'
            }`}
          >
            <IndianRupee className="w-4 h-4 mr-2" />
            India (₹)
          </Button>
          <Button
            variant={region === 'global' ? 'default' : 'outline'}
            onClick={() => setRegion('global')}
            className={`h-12 px-6 rounded-full font-semibold transition-all ${
              region === 'global' 
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg' 
                : 'hover:border-primary'
            }`}
          >
            <Globe className="w-4 h-4 mr-2" />
            Global ($)
          </Button>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-20 h-10 rounded-full bg-secondary border-2 border-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:border-primary/50"
            role="switch"
            aria-checked={isAnnual}
          >
            <div
              className={`absolute top-1 w-7 h-7 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg transition-transform duration-300 ${
                isAnnual ? 'translate-x-11' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Annual
            <span className="ml-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold animate-pulse">
              Save 20%
            </span>
          </span>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            Price Lock Guarantee
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            30-Day Free Trial
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-primary" />
            No Hidden Fees
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {pricing.map((plan) => {
            const planPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <PricingTierCard
                key={plan.name}
                name={plan.name}
                description={plan.description}
                price={planPrice}
                originalPrice={!isAnnual ? null : plan.originalMonthly}
                perUser={plan.perUser}
                minimumFee={plan.minimumFee}
                employeeLimit={plan.employeeLimit}
                icon={plan.icon}
                popular={plan.popular}
                features={plan.features}
                cta={plan.cta}
                ctaLink={plan.ctaLink}
                gradient={plan.gradient}
                isAnnual={isAnnual}
                currency={currency}
                onSelect={handlePlanSelect}
                isSelected={selectedPlan?.name === plan.name}
              />
            );
          })}
        </div>

        {/* Compare with Competitors */}
        <div className="text-center mb-16">
          <p className="text-muted-foreground mb-4">
            See how much you can save compared to legacy HR platforms
          </p>
          <PricingComparisonModal />
        </div>

        {/* Pricing Calculator */}
        <div className="mb-20">
          <PricingCalculator region={region} />
        </div>

        {/* Add-ons */}
        <div className="mb-12">
          <PricingAddons 
            region={region} 
            selectedAddons={selectedAddons}
            onAddonsChange={handleAddonsChange}
          />
        </div>

        {/* Preview Invoice Button */}
        {(selectedPlan || selectedAddons.length > 0) && (
          <div className="mb-20 text-center">
            <Button
              onClick={openInvoicePreview}
              size="lg"
              className="h-16 px-12 bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 text-primary-foreground font-bold text-lg rounded-2xl shadow-xl animate-pulse"
            >
              <FileText className="w-6 h-6 mr-3" />
              Preview Invoice & Pricing
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Review your selection with GST/Tax calculations before proceeding
            </p>
          </div>
        )}

        {/* Invoice Preview Modal */}
        <InvoicePreviewModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          region={region}
          plan={selectedPlan}
          addons={selectedAddonDetails}
          addonsTotal={addonsPrice}
          isAnnual={isAnnual}
        />

        {/* Lead Capture */}
        <div className="mb-20">
          <PricingLeadCapture />
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <PricingFAQ />
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-12 border border-primary/20">
          <h3 className="text-3xl font-heading font-bold text-foreground mb-4">
            Ready to Transform Your Workforce?
          </h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of companies using ATLAS to automate HR, payroll, and compliance. 
            Start your 30-day free trial today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="h-14 px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold rounded-xl shadow-lg"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-14 px-8 rounded-xl font-semibold"
            >
              Talk to Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
