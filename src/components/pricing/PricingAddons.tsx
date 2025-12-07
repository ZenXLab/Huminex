import { Check, Plus } from "lucide-react";

interface Addon {
  name: string;
  price: string;
  unit: string;
  category: string;
}

interface PricingAddonsProps {
  region: 'india' | 'global';
}

const indiaAddons: Addon[] = [
  { name: "Background Verification (BGV)", price: "₹49", unit: "/check", category: "HR" },
  { name: "Document Verification", price: "₹25", unit: "/document", category: "HR" },
  { name: "Slack/WhatsApp Notifications", price: "₹2", unit: "/user/mo", category: "HR" },
  { name: "Payroll Re-processing", price: "₹5", unit: "/employee", category: "Payroll" },
  { name: "Payroll Approval Workflows", price: "₹1", unit: "/user/mo", category: "Payroll" },
  { name: "Extra 1,000 Workflow Runs", price: "₹999", unit: "/month", category: "Automation" },
  { name: "Proxima AI Assistant", price: "₹49", unit: "/user/mo", category: "AI" },
  { name: "AI Insights Dashboard", price: "₹19", unit: "/user/mo", category: "AI" },
];

const globalAddons: Addon[] = [
  { name: "Background Verification (BGV)", price: "$1.5", unit: "/check", category: "HR" },
  { name: "Document Verification", price: "$0.75", unit: "/document", category: "HR" },
  { name: "Slack/WhatsApp Notifications", price: "$0.5", unit: "/user/mo", category: "HR" },
  { name: "Payroll Re-processing", price: "$0.25", unit: "/employee", category: "Payroll" },
  { name: "Payroll Approval Workflows", price: "$0.15", unit: "/user/mo", category: "Payroll" },
  { name: "Extra 1,000 Workflow Runs", price: "$29", unit: "/month", category: "Automation" },
  { name: "Proxima AI Assistant", price: "$1.5", unit: "/user/mo", category: "AI" },
  { name: "AI Insights Dashboard", price: "$0.5", unit: "/user/mo", category: "AI" },
];

export const PricingAddons = ({ region }: PricingAddonsProps) => {
  const addons = region === 'india' ? indiaAddons : globalAddons;
  const categories = [...new Set(addons.map(a => a.category))];

  return (
    <div className="bg-gradient-to-br from-card to-secondary/30 rounded-3xl border border-border/50 p-8 lg:p-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
          <Plus className="w-4 h-4" />
          Power-Up Modules
        </div>
        <h3 className="text-3xl font-heading font-bold text-foreground mb-3">
          Add-On Modules
        </h3>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enhance your ATLAS experience with powerful add-ons. Pay only for what you use.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2">
              {category} Add-ons
            </h4>
            <ul className="space-y-3">
              {addons
                .filter((addon) => addon.category === category)
                .map((addon, idx) => (
                  <li
                    key={idx}
                    className="bg-background/50 rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground leading-tight">
                          {addon.name}
                        </p>
                        <p className="text-primary font-bold mt-1">
                          {addon.price}
                          <span className="text-muted-foreground font-normal text-xs">
                            {addon.unit}
                          </span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
