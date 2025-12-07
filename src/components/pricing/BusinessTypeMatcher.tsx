import { useState } from "react";
import { Check, Building2, Users, Briefcase, Crown, Zap, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BusinessType {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  employeeRange: string;
  recommendedPlan: "starter" | "professional" | "enterprise";
  features: string[];
  industries: string[];
}

const businessTypes: BusinessType[] = [
  {
    id: "individual",
    name: "Freelancer / Consultant",
    icon: Users,
    description: "Solo professionals managing their practice",
    employeeRange: "1 person",
    recommendedPlan: "starter",
    features: ["Basic payroll", "Invoice generation", "Time tracking"],
    industries: ["Consulting", "Design", "Development", "Marketing"]
  },
  {
    id: "startup",
    name: "Startup / Early Stage",
    icon: Zap,
    description: "Fast-growing companies needing scalable HR",
    employeeRange: "1-50 employees",
    recommendedPlan: "starter",
    features: ["Core HR", "Recruitment", "Basic compliance", "Leave management"],
    industries: ["Tech", "FinTech", "EdTech", "SaaS", "E-commerce"]
  },
  {
    id: "smb",
    name: "Small & Medium Business",
    icon: Building2,
    description: "Established businesses with growing teams",
    employeeRange: "50-200 employees",
    recommendedPlan: "professional",
    features: ["Advanced payroll", "Compliance suite", "Performance", "Analytics"],
    industries: ["Retail", "Healthcare", "Manufacturing", "Services"]
  },
  {
    id: "enterprise",
    name: "Mid-Market Enterprise",
    icon: Briefcase,
    description: "Large organizations with complex needs",
    employeeRange: "200-1000 employees",
    recommendedPlan: "professional",
    features: ["Full HRMS", "Multi-location", "Custom workflows", "API access"],
    industries: ["Finance", "Logistics", "Hospitality", "Real Estate"]
  },
  {
    id: "large_enterprise",
    name: "Large Enterprise",
    icon: Crown,
    description: "Global organizations requiring enterprise-grade solutions",
    employeeRange: "1000+ employees",
    recommendedPlan: "enterprise",
    features: ["All modules", "SSO/SAML", "On-premise option", "Dedicated support"],
    industries: ["Banking", "Government", "MNC", "Conglomerate"]
  }
];

const planDetails = {
  starter: {
    name: "Starter",
    priceIndia: "₹3,999",
    priceGlobal: "$79",
    color: "bg-blue-500"
  },
  professional: {
    name: "Professional",
    priceIndia: "₹7,999",
    priceGlobal: "$149",
    color: "bg-primary"
  },
  enterprise: {
    name: "Enterprise",
    priceIndia: "Custom",
    priceGlobal: "Custom",
    color: "bg-gradient-to-r from-amber-500 to-orange-500"
  }
};

export const BusinessTypeMatcher = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isIndia, setIsIndia] = useState(true);

  const selectedBusiness = businessTypes.find(b => b.id === selectedType);
  const recommendation = selectedBusiness ? planDetails[selectedBusiness.recommendedPlan] : null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
          Plan Finder
        </Badge>
        <h2 className="text-3xl font-heading font-bold text-foreground mb-3">
          Which Plan is Right for You?
        </h2>
        <p className="text-muted-foreground">
          Select your business type to see our recommendation
        </p>
      </div>

      {/* Business Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {businessTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                isSelected 
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <Icon className={`w-8 h-8 mb-3 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              <h3 className="font-semibold text-sm mb-1">{type.name}</h3>
              <p className="text-xs text-muted-foreground">{type.employeeRange}</p>
            </button>
          );
        })}
      </div>

      {/* Recommendation Panel */}
      {selectedBusiness && recommendation && (
        <Card className="p-6 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`${recommendation.color} text-white`}>
                  Recommended: {recommendation.name}
                </Badge>
                <button 
                  onClick={() => setIsIndia(!isIndia)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {isIndia ? "🇮🇳 India" : "🌍 Global"} pricing (click to switch)
                </button>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">
                Perfect for {selectedBusiness.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {selectedBusiness.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedBusiness.features.map((feature) => (
                  <span 
                    key={feature}
                    className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full"
                  >
                    <Check className="w-3 h-3 text-primary" />
                    {feature}
                  </span>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Industries: </span>
                {selectedBusiness.industries.join(", ")}
              </div>
            </div>

            <div className="text-center lg:text-right">
              <div className="text-3xl font-bold text-foreground mb-1">
                {isIndia ? recommendation.priceIndia : recommendation.priceGlobal}
                {recommendation.name !== "Enterprise" && (
                  <span className="text-base font-normal text-muted-foreground">/month</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {recommendation.name === "Enterprise" ? "Custom pricing for your needs" : "Billed annually, save 20%"}
              </p>
              
              <a 
                href={recommendation.name === "Enterprise" ? "/contact" : "/onboarding"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {recommendation.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
