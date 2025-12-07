import { useState } from "react";
import { Calculator, Users, TrendingUp, Mail, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PricingCalculatorProps {
  region: 'india' | 'global';
}

export const PricingCalculator = ({ region }: PricingCalculatorProps) => {
  const [employees, setEmployees] = useState<number>(50);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [showQuote, setShowQuote] = useState(false);

  const calculatePrice = () => {
    if (region === 'india') {
      if (employees <= 25) {
        return { plan: 'Starter', price: 3999, perEmployee: Math.round(3999 / employees) };
      } else if (employees <= 100) {
        return { plan: 'Professional', price: 7999, perEmployee: Math.round(7999 / employees) };
      } else {
        const basePrice = 7999 + (employees - 100) * 50;
        return { plan: 'Enterprise', price: basePrice, perEmployee: Math.round(basePrice / employees) };
      }
    } else {
      if (employees <= 25) {
        const price = Math.max(79, employees * 2.5);
        return { plan: 'Essential', price: Math.round(price), perEmployee: 2.5 };
      } else if (employees <= 100) {
        const price = Math.max(149, employees * 4);
        return { plan: 'Growth', price: Math.round(price), perEmployee: 4 };
      } else {
        const price = employees * 6;
        return { plan: 'Enterprise', price: Math.round(price), perEmployee: 6 };
      }
    }
  };

  const pricing = calculatePrice();
  const currency = region === 'india' ? '₹' : '$';
  const annualSavings = pricing.price * 12 * 0.2;

  const handleGetQuote = () => {
    if (!email || !company) {
      toast.error("Please enter your email and company name");
      return;
    }
    toast.success("Quote sent to your email!");
    setShowQuote(true);
  };

  return (
    <div className="bg-gradient-to-br from-card via-card to-primary/5 rounded-3xl border border-border/50 p-8 lg:p-10 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-heading font-bold text-foreground">Instant Pricing Calculator</h3>
          <p className="text-muted-foreground text-sm">Get your personalized quote in seconds</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Calculator */}
        <div className="space-y-6">
          <div>
            <Label className="text-foreground font-medium flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              Number of Employees
            </Label>
            <div className="relative">
              <Input
                type="range"
                min="5"
                max="500"
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>5</span>
                <span className="text-lg font-bold text-primary">{employees}</span>
                <span>500+</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground font-medium flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-primary" />
                Work Email
              </Label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div>
              <Label className="text-foreground font-medium flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-primary" />
                Company Name
              </Label>
              <Input
                type="text"
                placeholder="Your Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-background/50"
              />
            </div>
          </div>

          <Button 
            onClick={handleGetQuote}
            className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold"
          >
            Get Custom Quote via Email
          </Button>
        </div>

        {/* Right: Result */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">Recommended Plan</p>
            <h4 className="text-3xl font-bold text-foreground">{pricing.plan}</h4>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-muted-foreground">Monthly Price</span>
              <span className="text-2xl font-bold text-foreground">
                {currency}{pricing.price.toLocaleString()}/mo
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-muted-foreground">Per Employee</span>
              <span className="text-lg font-semibold text-foreground">
                {currency}{pricing.perEmployee}/mo
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-muted-foreground">Annual Cost</span>
              <span className="text-lg text-foreground">
                {currency}{(pricing.price * 12).toLocaleString()}/yr
              </span>
            </div>
            <div className="flex justify-between items-center py-3 bg-green-500/10 rounded-lg px-3">
              <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Annual Savings (20% off)
              </span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {currency}{annualSavings.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            🔒 Price Lock Guarantee for 12 months
          </p>
        </div>
      </div>
    </div>
  );
};
