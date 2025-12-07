import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Zap,
  Check,
  X,
  Users,
  Shield,
  Globe,
  Brain,
  Headphones,
  ArrowRight,
  Star,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const plans = [
  {
    name: "Starter",
    price: 15000,
    period: "month",
    description: "For small teams getting started",
    features: [
      { label: "Up to 50 employees", included: true },
      { label: "Core HR modules", included: true },
      { label: "Payroll processing", included: true },
      { label: "Email support", included: true },
      { label: "SSO Authentication", included: false },
      { label: "Custom domain", included: false },
      { label: "Proxima AI", included: false },
      { label: "Managed Operations", included: false },
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 35000,
    period: "month",
    description: "For growing organizations",
    features: [
      { label: "Up to 200 employees", included: true },
      { label: "All Starter features", included: true },
      { label: "Advanced analytics", included: true },
      { label: "Priority support", included: true },
      { label: "SSO Authentication", included: true },
      { label: "Custom domain", included: true },
      { label: "Proxima AI (Basic)", included: true },
      { label: "Managed Operations", included: false },
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 75000,
    period: "month",
    description: "For large enterprises",
    features: [
      { label: "Unlimited employees", included: true },
      { label: "All Professional features", included: true },
      { label: "Custom integrations", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "SSO Authentication", included: true },
      { label: "Custom domain", included: true },
      { label: "Proxima AI (Full)", included: true },
      { label: "Managed Operations", included: true },
    ],
    popular: false,
  },
];

export const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [billingAnnual, setBillingAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    const finalAmount = billingAnnual ? amount * 0.8 : amount;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(finalAmount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#005EEB] to-[#00C2FF] flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl text-[#0F1E3A]">Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Unlock premium features and scale your organization
          </DialogDescription>
        </DialogHeader>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 py-4">
          <span className={cn("text-sm", !billingAnnual ? "text-[#0F1E3A] font-medium" : "text-[#6B7280]")}>
            Monthly
          </span>
          <Switch
            checked={billingAnnual}
            onCheckedChange={setBillingAnnual}
            className="data-[state=checked]:bg-[#005EEB]"
          />
          <span className={cn("text-sm", billingAnnual ? "text-[#0F1E3A] font-medium" : "text-[#6B7280]")}>
            Annual
          </span>
          {billingAnnual && (
            <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20">
              Save 20%
            </Badge>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-3 gap-4 py-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-xl border-2 p-5 transition-all cursor-pointer",
                plan.popular
                  ? "border-[#005EEB] bg-[#005EEB]/5"
                  : "border-gray-200 hover:border-[#005EEB]/50",
                selectedPlan === plan.name && "ring-2 ring-[#005EEB] ring-offset-2"
              )}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#005EEB] text-white">
                  <Star className="w-3 h-3 mr-1" /> Most Popular
                </Badge>
              )}

              <div className="text-center mb-4">
                <h3 className="font-semibold text-[#0F1E3A] text-lg">{plan.name}</h3>
                <p className="text-xs text-[#6B7280]">{plan.description}</p>
              </div>

              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-[#0F1E3A]">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-sm text-[#6B7280]">/{plan.period}</span>
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((feature) => (
                  <li key={feature.label} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-[#0FB07A]" />
                    ) : (
                      <X className="w-4 h-4 text-[#6B7280]/50" />
                    )}
                    <span className={feature.included ? "text-[#0F1E3A]" : "text-[#6B7280]/50"}>
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full",
                  plan.popular || selectedPlan === plan.name
                    ? "bg-[#005EEB] hover:bg-[#004ACC] text-white"
                    : "bg-white border border-gray-200 text-[#0F1E3A] hover:bg-[#F7F9FC]"
                )}
              >
                {selectedPlan === plan.name ? "Selected" : "Choose Plan"}
              </Button>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-4 gap-4 py-4 border-t border-gray-200">
          {[
            { icon: Users, label: "Unlimited Employees", desc: "Scale without limits" },
            { icon: Shield, label: "SSO & Security", desc: "Enterprise-grade auth" },
            { icon: Brain, label: "Proxima AI", desc: "Intelligent insights" },
            { icon: Headphones, label: "Managed Ops", desc: "Dedicated support" },
          ].map((feature) => (
            <div key={feature.label} className="text-center p-3">
              <div className="w-10 h-10 rounded-xl bg-[#005EEB]/10 flex items-center justify-center mx-auto mb-2">
                <feature.icon className="w-5 h-5 text-[#005EEB]" />
              </div>
              <p className="font-medium text-sm text-[#0F1E3A]">{feature.label}</p>
              <p className="text-xs text-[#6B7280]">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Building className="w-4 h-4" />
            Need a custom plan? <button className="text-[#005EEB] hover:underline">Contact Sales</button>
          </div>
          <Button
            className="bg-[#005EEB] hover:bg-[#004ACC] gap-2"
            disabled={!selectedPlan}
          >
            Upgrade Now <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
