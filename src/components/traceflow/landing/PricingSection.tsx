import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  ArrowRight,
  Shield,
  Globe,
  Building2,
  FileCheck,
  Brain,
  Server,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const trustIcons = [
  { icon: Shield, label: "SOC2", color: "text-emerald-600" },
  { icon: FileCheck, label: "ISO", color: "text-blue-600" },
  { icon: Globe, label: "Data Residency", color: "text-purple-600" },
  { icon: Building2, label: "Finance-Ready", color: "text-amber-600" },
];

const addons = [
  { id: "proxima", name: "PROXIMA AI", description: "Multi-agent intelligence", icon: Brain },
  { id: "runner", name: "On-Prem Runner", description: "Hybrid deployment", icon: Server },
  { id: "sso", name: "SSO/SAML", description: "Enterprise auth", icon: Users },
];

export const PricingSection = () => {
  const [sessions, setSessions] = useState([100000]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["proxima"]);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const basePrice = Math.round(sessions[0] / 1000 * 2.5);
  const addonPrice = selectedAddons.length * 500;
  const totalPrice = basePrice + addonPrice;

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/20">
            Enterprise Pricing
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Transparent <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">Usage-Based</span> Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pay only for what you use. Enterprise features included at every tier.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Pricing Calculator */}
          <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
            <h3 className="text-xl font-semibold mb-6">Configure Your Plan</h3>

            {/* Session Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Monthly Sessions</label>
                <span className="text-lg font-bold text-[#0B3D91]">
                  {sessions[0].toLocaleString()}
                </span>
              </div>
              <Slider
                value={sessions}
                onValueChange={setSessions}
                min={10000}
                max={1000000}
                step={10000}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10K</span>
                <span>1M+</span>
              </div>
            </div>

            {/* Add-ons */}
            <div className="mb-8">
              <label className="text-sm font-medium block mb-3">Add-ons</label>
              <div className="space-y-2">
                {addons.map((addon) => {
                  const Icon = addon.icon;
                  const isSelected = selectedAddons.includes(addon.id);

                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
                        isSelected
                          ? "border-[#00C2D8] bg-[#00C2D8]/5"
                          : "border-border hover:border-border/80"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8]"
                          : "bg-muted"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          isSelected ? "text-white" : "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{addon.name}</p>
                        <p className="text-xs text-muted-foreground">{addon.description}</p>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 transition-colors",
                        isSelected
                          ? "border-[#00C2D8] bg-[#00C2D8]"
                          : "border-muted-foreground/30"
                      )}>
                        {isSelected && (
                          <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Base ({sessions[0].toLocaleString()} sessions)</span>
                <span className="font-medium">${basePrice}/mo</span>
              </div>
              {selectedAddons.length > 0 && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Add-ons ({selectedAddons.length})</span>
                  <span className="font-medium">${addonPrice}/mo</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xl font-bold mt-4 pt-4 border-t border-border">
                <span>Total</span>
                <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">
                  ${totalPrice}/mo
                </span>
              </div>
            </div>
          </div>

          {/* CTA & Trust */}
          <div className="space-y-6">
            {/* Enterprise CTA */}
            <div className="bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] rounded-2xl p-6 lg:p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Ready to Transform DXI?</h3>
              <p className="text-white/80 mb-6">
                Get a personalized demo and custom pricing for your enterprise needs.
              </p>
              <Link to="/traceflow/login">
                <Button 
                  size="lg" 
                  className="w-full bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white shadow-xl"
                >
                  Request Enterprise Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Trust Icons */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h4 className="font-semibold mb-4">Enterprise Trust</h4>
              <div className="grid grid-cols-2 gap-4">
                {trustIcons.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className={cn("h-5 w-5", item.color)} />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact Sales */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Need custom volume pricing or on-prem deployment?
              </p>
              <Link to="/contact" className="text-sm font-medium text-[#0B3D91] hover:underline">
                Contact Sales →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
