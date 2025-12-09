import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface PricingTierCardProps {
  name: string;
  description: string;
  price: number | null;
  originalPrice?: number | null;
  perUser?: boolean;
  minimumFee?: string;
  employeeLimit?: string;
  icon: LucideIcon;
  popular: boolean;
  features: string[];
  cta: string;
  ctaLink: string;
  gradient: string;
  isAnnual: boolean;
  currency: string;
  onSelect?: (name: string, price: number) => void;
  isSelected?: boolean;
}

export const PricingTierCard = ({
  name,
  description,
  price,
  originalPrice,
  perUser,
  minimumFee,
  employeeLimit,
  icon: Icon,
  popular,
  features,
  cta,
  ctaLink,
  gradient,
  isAnnual,
  currency,
  onSelect,
  isSelected
}: PricingTierCardProps) => {
  const formatPrice = (p: number) => {
    if (currency === "₹") {
      return `₹${p.toLocaleString('en-IN')}`;
    }
    return `$${p}`;
  };

  const handleCardClick = () => {
    if (onSelect && price !== null) {
      onSelect(name, price);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative group rounded-3xl border-2 transition-all duration-500 hover:scale-[1.02] cursor-pointer ${
        isSelected
          ? 'bg-gradient-to-b from-card to-accent/10 border-accent shadow-2xl shadow-accent/30 ring-2 ring-accent'
          : popular 
          ? 'bg-gradient-to-b from-card to-primary/5 border-primary shadow-2xl shadow-primary/20 scale-105 z-10' 
          : 'bg-card border-border/50 hover:border-primary/30 hover:shadow-xl'
      }`}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute -top-5 right-4 z-20">
          <div className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-lg flex items-center gap-1">
            <Check className="w-3 h-3" />
            Selected
          </div>
        </div>
      )}
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
          <div className="px-6 py-2 rounded-full bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4" />
            Most Popular
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 rounded-3xl`} />
      
      {/* Glow Effect for Popular */}
      {popular && (
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-50" />
      )}

      <div className="relative p-8 lg:p-10">
        {/* Icon & Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-heading font-bold text-foreground">{name}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-8 min-h-[100px]">
          {price !== null ? (
            <>
              <div className="flex items-end gap-2 mb-2">
                {originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                <span className="text-5xl font-bold text-foreground tracking-tight">
                  {formatPrice(price)}
                </span>
                <span className="text-muted-foreground text-lg mb-1">
                  {perUser ? '/user/mo' : '/month'}
                </span>
              </div>
              {minimumFee && (
                <p className="text-sm text-muted-foreground">
                  Minimum {minimumFee}
                </p>
              )}
              {employeeLimit && (
                <p className="text-sm text-primary font-medium">
                  {employeeLimit}
                </p>
              )}
              {isAnnual && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold">
                  <Check className="w-3 h-3" />
                  Save 20% with annual billing
                </div>
              )}
            </>
          ) : (
            <div>
              <span className="text-4xl font-bold text-foreground">Custom Pricing</span>
              <p className="text-muted-foreground text-sm mt-2">
                Tailored to your organization's needs
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

        {/* Features */}
        <ul className="space-y-4 mb-10">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-foreground/90 leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link to={ctaLink}>
          <Button 
            className={`w-full h-14 font-semibold text-base transition-all duration-300 rounded-xl ${
              popular 
                ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/30' 
                : 'hover:shadow-lg'
            }`}
            variant={popular ? "default" : "outline"}
            size="lg"
          >
            {cta}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>

        {/* Trust Badge */}
        {price !== null && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            ✓ 30-day free trial • No credit card required
          </p>
        )}
      </div>
    </div>
  );
};
