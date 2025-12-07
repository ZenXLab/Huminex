import React, { useState } from "react";
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Crown,
  Zap,
  Users,
  HardDrive,
  Clock,
  ArrowUpRight,
  Receipt,
  Calendar,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "₹4,999",
    period: "/month",
    description: "For small teams getting started",
    features: [
      "Up to 25 employees",
      "Basic HR modules",
      "Email support",
      "5GB storage"
    ],
    current: false
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹14,999",
    period: "/month",
    description: "For growing organizations",
    features: [
      "Up to 100 employees",
      "All HR & Payroll modules",
      "Priority support",
      "25GB storage",
      "API access",
      "Custom reports"
    ],
    current: true,
    popular: true
  },
  {
    id: "business",
    name: "Business",
    price: "₹29,999",
    period: "/month",
    description: "For large enterprises",
    features: [
      "Unlimited employees",
      "All modules + AI insights",
      "24/7 dedicated support",
      "100GB storage",
      "SSO & advanced security",
      "Custom integrations",
      "SLA guarantee"
    ],
    current: false
  }
];

const invoices = [
  { id: "INV-2024-001", date: "Jan 15, 2024", amount: "₹14,999", status: "paid" },
  { id: "INV-2023-012", date: "Dec 15, 2023", amount: "₹14,999", status: "paid" },
  { id: "INV-2023-011", date: "Nov 15, 2023", amount: "₹14,999", status: "paid" },
  { id: "INV-2023-010", date: "Oct 15, 2023", amount: "₹14,999", status: "paid" }
];

const usageMetrics = [
  { label: "Employees", current: 67, limit: 100, icon: Users },
  { label: "Storage Used", current: 12.5, limit: 25, unit: "GB", icon: HardDrive },
  { label: "API Calls", current: 8500, limit: 50000, icon: Zap }
];

const TenantBilling: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const handleUpgrade = (planId: string) => {
    toast.success(`Upgrading to ${planId} plan...`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading ${invoiceId}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Billing & Plans</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage your subscription, billing, and usage
          </p>
        </div>
        <Button variant="outline" className="gap-2 border-gray-200">
          <CreditCard className="w-4 h-4" />
          Update Payment Method
        </Button>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-gradient-to-r from-[#005EEB] to-[#00C2FF] rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">Pro Plan</h2>
                <Badge className="bg-white/20 text-white border-white/30">Current</Badge>
              </div>
              <p className="text-white/80 text-sm mt-1">
                Next billing date: February 15, 2024 • ₹14,999/month
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Cancel Subscription
            </Button>
            <Button className="bg-white text-[#005EEB] hover:bg-white/90">
              Upgrade Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-[#0F1E3A] mb-4">Usage Overview</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          {usageMetrics.map((metric) => {
            const percentage = (metric.current / metric.limit) * 100;
            const isNearLimit = percentage > 80;
            
            return (
              <div key={metric.label} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <metric.icon className={`w-4 h-4 ${isNearLimit ? "text-[#FFB020]" : "text-[#6B7280]"}`} />
                    <span className="text-sm font-medium text-[#0F1E3A]">{metric.label}</span>
                  </div>
                  <span className="text-sm text-[#6B7280]">
                    {metric.current.toLocaleString()}{metric.unit ? metric.unit : ""} / {metric.limit.toLocaleString()}{metric.unit ? metric.unit : ""}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className={`h-2 ${isNearLimit ? "[&>div]:bg-[#FFB020]" : "[&>div]:bg-[#005EEB]"}`}
                />
                {isNearLimit && (
                  <p className="text-xs text-[#FFB020] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Approaching limit
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Plans Comparison */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-[#0F1E3A]">Available Plans</h3>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 relative ${plan.current ? "bg-[#005EEB]/[0.02]" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-[#FFB020] text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              
              <h4 className="text-lg font-semibold text-[#0F1E3A] mb-1">{plan.name}</h4>
              <p className="text-sm text-[#6B7280] mb-4">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#0F1E3A]">{plan.price}</span>
                <span className="text-[#6B7280]">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <CheckCircle2 className="w-4 h-4 text-[#0FB07A]" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.current ? (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full ${
                    plan.id === "business" 
                      ? "bg-[#005EEB] hover:bg-[#0047B3]" 
                      : "bg-[#F7F9FC] text-[#0F1E3A] hover:bg-[#E5E7EB]"
                  }`}
                >
                  {plan.id === "starter" ? "Downgrade" : "Upgrade"}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#0F1E3A]">Payment Method</h3>
          <Button variant="link" className="text-[#005EEB] p-0 h-auto">
            Change
          </Button>
        </div>
        <div className="flex items-center gap-4 p-4 bg-[#F7F9FC] rounded-xl">
          <div className="w-12 h-8 bg-gradient-to-r from-[#1A1F71] to-[#00579F] rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#0F1E3A]">•••• •••• •••• 4242</p>
            <p className="text-xs text-[#6B7280]">Expires 12/25</p>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#0F1E3A]">Billing History</h3>
          <Button variant="outline" size="sm" className="gap-2 border-gray-200">
            <Download className="w-4 h-4" />
            Export All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7F9FC]">
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Invoice</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-[#F7F9FC]/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm font-medium text-[#005EEB]">{invoice.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#6B7280]">{invoice.date}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-[#0F1E3A]">{invoice.amount}</span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20 capitalize">
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="gap-1 text-[#005EEB]"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantBilling;
