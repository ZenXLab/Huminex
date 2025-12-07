import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Percent, Crown, Sparkles, Check, X, ArrowRight, Calculator } from "lucide-react";
import { motion } from "framer-motion";

interface CompetitorPricing {
  name: string;
  monthlyPerEmployee: number;
  setupFee: number;
  annualDiscount: number;
  hiddenCosts: string[];
  logo?: string;
}

const competitorPricing: CompetitorPricing[] = [
  {
    name: "Workday",
    monthlyPerEmployee: 35,
    setupFee: 150000,
    annualDiscount: 5,
    hiddenCosts: ["Implementation consulting", "Training fees", "Custom integrations", "Premium support"],
  },
  {
    name: "Rippling",
    monthlyPerEmployee: 18,
    setupFee: 5000,
    annualDiscount: 10,
    hiddenCosts: ["Module add-ons", "API access fees", "Advanced reporting"],
  },
  {
    name: "Darwinbox",
    monthlyPerEmployee: 12,
    setupFee: 25000,
    annualDiscount: 8,
    hiddenCosts: ["India-specific compliance", "Support upgrades", "Data migration"],
  },
  {
    name: "Zoho People",
    monthlyPerEmployee: 6,
    setupFee: 0,
    annualDiscount: 15,
    hiddenCosts: ["Advanced features locked", "Limited automation", "Support tiers"],
  },
  {
    name: "GreytHR",
    monthlyPerEmployee: 4,
    setupFee: 0,
    annualDiscount: 10,
    hiddenCosts: ["Limited modules", "No AI features", "Basic compliance"],
  },
];

const atlasPricing = {
  name: "ATLAS",
  monthlyPerEmployee: 8,
  setupFee: 0,
  annualDiscount: 20,
  includedFeatures: [
    "All 15+ modules included",
    "Proxima AI Intelligence",
    "OpZenix Automations",
    "India Compliance Suite",
    "24/7 Priority Support",
    "Free Implementation",
    "Unlimited API Access",
    "White-label Option",
  ],
};

interface PricingComparisonModalProps {
  trigger?: React.ReactNode;
}

export const PricingComparisonModal = ({ trigger }: PricingComparisonModalProps) => {
  const [open, setOpen] = useState(false);
  const [employeeCount, setEmployeeCount] = useState(100);

  const calculateAnnualCost = (pricing: CompetitorPricing | typeof atlasPricing) => {
    const monthly = pricing.monthlyPerEmployee * employeeCount;
    const annual = monthly * 12;
    const discountedAnnual = annual * (1 - pricing.annualDiscount / 100);
    return {
      monthly,
      annual: discountedAnnual,
      setupFee: pricing.setupFee,
      totalFirstYear: discountedAnnual + pricing.setupFee,
    };
  };

  const atlasCost = calculateAnnualCost(atlasPricing);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Calculator className="w-4 h-4" />
            Compare Pricing
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary via-primary/90 to-cyan-500 text-white p-6 rounded-t-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6" />
              <DialogTitle className="text-2xl font-bold text-white">
                ATLAS Savings Calculator
              </DialogTitle>
            </div>
            <p className="text-white/80 text-sm">
              See how much your organization can save by switching to ATLAS
            </p>
          </DialogHeader>

          {/* Employee Count Slider */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Number of Employees</span>
              <span className="text-2xl font-bold">{employeeCount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={employeeCount}
              onChange={(e) => setEmployeeCount(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>10</span>
              <span>250</span>
              <span>500</span>
              <span>750</span>
              <span>1000+</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* ATLAS Highlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-cyan-500/5 to-violet-500/5 border-2 border-primary/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">ATLAS Premium</h3>
                  <Badge className="bg-primary text-white">RECOMMENDED</Badge>
                </div>
                <p className="text-muted-foreground text-sm max-w-md">
                  All-in-one Workforce OS with AI intelligence, automations, and enterprise features
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  ₹{atlasCost.annual.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">per year (20% discount)</div>
                <div className="text-xs text-green-600 font-medium mt-1">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  ₹0 Setup Fee
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {atlasPricing.includedFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Competitor Comparison Grid */}
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Your Potential Savings
          </h4>

          <div className="grid gap-4">
            {competitorPricing.map((competitor, index) => {
              const competitorCost = calculateAnnualCost(competitor);
              const savings = competitorCost.totalFirstYear - atlasCost.totalFirstYear;
              const savingsPercent = ((savings / competitorCost.totalFirstYear) * 100).toFixed(0);

              return (
                <motion.div
                  key={competitor.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl border border-border/60 bg-card hover:bg-muted/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-semibold text-foreground">{competitor.name}</h5>
                        <span className="text-sm text-muted-foreground">
                          ₹{competitor.monthlyPerEmployee}/employee/month
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {competitor.hiddenCosts.map((cost, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-red-500/10 text-red-600 rounded-full flex items-center gap-1">
                            <X className="w-3 h-3" />
                            {cost}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-muted-foreground line-through">
                          ₹{competitorCost.totalFirstYear.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {competitor.setupFee > 0 && `+₹${competitor.setupFee.toLocaleString()} setup`}
                        </div>
                      </div>

                      <ArrowRight className="w-5 h-5 text-muted-foreground" />

                      <div className="text-center min-w-[100px]">
                        <div className={`text-xl font-bold ${savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {savings > 0 ? 'Save' : 'Extra'}
                        </div>
                        <div className={`text-2xl font-bold ${savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{Math.abs(savings).toLocaleString()}
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`mt-1 ${savings > 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}
                        >
                          <Percent className="w-3 h-3 mr-1" />
                          {Math.abs(Number(savingsPercent))}% {savings > 0 ? 'savings' : 'more'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-cyan-500/10 border border-primary/20 text-center">
            <h4 className="text-xl font-bold mb-2 text-foreground">
              Ready to Save with ATLAS?
            </h4>
            <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
              Switch to ATLAS and unlock enterprise features at a fraction of the cost. 
              Zero downtime, free migration assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button 
                size="lg" 
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={() => {
                  setOpen(false);
                  window.location.href = "/get-quote";
                }}
              >
                <Crown className="w-4 h-4" />
                Get Your Custom Quote
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <DollarSign className="w-4 h-4" />
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
