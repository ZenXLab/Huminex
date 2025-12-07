import { Lock, Crown, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ClientTier, tierModules } from "@/hooks/useClientTier";

interface TierUpgradePromptProps {
  moduleName: string;
  currentTier: ClientTier;
  requiredTier: ClientTier;
  icon: React.ElementType;
}

const tierOrder: ClientTier[] = ["basic", "standard", "advanced", "enterprise"];

const tierDetails: Record<ClientTier, { 
  name: string; 
  color: string; 
  description: string;
  features: string[];
}> = {
  basic: {
    name: "Basic",
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    description: "Essential features for individuals",
    features: ["Dashboard", "Projects", "Files", "Invoices", "Tickets", "Settings"]
  },
  standard: {
    name: "Standard",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    description: "Perfect for small businesses",
    features: ["Everything in Basic", "Meetings", "Team Directory", "Feedback"]
  },
  advanced: {
    name: "Advanced",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    description: "Advanced features for growing companies",
    features: ["Everything in Standard", "AI Dashboard", "Resources Library"]
  },
  enterprise: {
    name: "Enterprise",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    description: "Full access for enterprise clients",
    features: ["Everything in Advanced", "MSP Monitoring", "Priority Support", "Custom Integrations"]
  }
};

export const TierUpgradePrompt = ({ 
  moduleName, 
  currentTier, 
  requiredTier, 
  icon: Icon 
}: TierUpgradePromptProps) => {
  const currentTierIndex = tierOrder.indexOf(currentTier);
  const requiredTierIndex = tierOrder.indexOf(requiredTier);
  
  // Get tiers that unlock this feature
  const upgradeTiers = tierOrder.slice(requiredTierIndex);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group w-full",
            "text-muted-foreground/50 hover:bg-muted/30 cursor-pointer relative"
          )}
        >
          <div className="relative">
            <Icon className="w-4 h-4 opacity-50" />
            <Lock className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 text-amber-500" />
          </div>
          <span className="text-sm font-medium opacity-50">{moduleName}</span>
          <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0 border-amber-500/30 text-amber-500">
            <Crown className="w-2.5 h-2.5 mr-1" />
            {tierDetails[requiredTier].name}
          </Badge>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Unlock {moduleName}
          </DialogTitle>
          <DialogDescription>
            Upgrade your plan to access this feature and more
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Current Plan */}
          <div className="p-3 rounded-xl border border-border bg-muted/30">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={tierDetails[currentTier].color}>
                Current: {tierDetails[currentTier].name}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {tierDetails[currentTier].description}
            </p>
          </div>

          {/* Upgrade Options */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Upgrade to unlock {moduleName}:</p>
            {upgradeTiers.map((tier) => (
              <div 
                key={tier}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all",
                  tier === requiredTier 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className={tierDetails[tier].color}>
                    {tierDetails[tier].name}
                  </Badge>
                  {tier === requiredTier && (
                    <span className="text-xs text-primary font-medium">Recommended</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {tierDetails[tier].description}
                </p>
                <ul className="space-y-1">
                  {tierDetails[tier].features.slice(0, 4).map((feature) => (
                    <li key={feature} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Button className="w-full gap-2">
            <Crown className="w-4 h-4" />
            Contact Sales to Upgrade
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Our team will help you choose the right plan for your needs
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to determine required tier for a module
export const getRequiredTierForModule = (moduleName: string): ClientTier => {
  for (const tier of tierOrder) {
    if (tierModules[tier].includes(moduleName)) {
      return tier;
    }
  }
  return "enterprise";
};
