import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Landmark,
  Shield,
  ShoppingCart,
  Building2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const industries = [
  {
    id: "bfsi",
    name: "BFSI",
    fullName: "Banking, Financial Services & Insurance",
    icon: Landmark,
    color: "from-blue-600 to-blue-400",
    painPoints: [
      "Regulatory compliance requirements block analytics tools",
      "Zero visibility into digital banking friction points",
      "Unable to correlate API failures with user experience",
      "No on-prem deployment options for sensitive data",
    ],
    solutions: [
      "Zero-PII tokenization meets RBI/GDPR requirements",
      "Full session replay with compliance-safe data handling",
      "API-to-UI correlation with distributed tracing",
      "Hybrid/air-gapped deployment for data residency",
    ],
  },
  {
    id: "insurance",
    name: "Insurance",
    fullName: "Insurance & Claims Processing",
    icon: Shield,
    color: "from-emerald-600 to-emerald-400",
    painPoints: [
      "High claim abandonment with no diagnostic insight",
      "Mobile app friction causes customer churn",
      "Support tickets lack reproduction context",
      "Unable to predict at-risk policy renewals",
    ],
    solutions: [
      "Journey causality engine explains drop-off reasons",
      "Mobile gesture capture detects UX confusion",
      "Session-linked tickets with auto-reproduction steps",
      "Churn prediction with 30-day advance warning",
    ],
  },
  {
    id: "ecommerce",
    name: "Ecommerce",
    fullName: "E-Commerce & Retail",
    icon: ShoppingCart,
    color: "from-orange-600 to-orange-400",
    painPoints: [
      "Cart abandonment revenue loss in millions",
      "No visibility into checkout friction points",
      "A/B tests lack behavioral context",
      "Unable to prioritize conversion fixes by impact",
    ],
    solutions: [
      "AI identifies exact abandonment root causes",
      "Rage/dead click detection on payment flows",
      "Session replay integration with experimentation",
      "Revenue impact scoring for every identified issue",
    ],
  },
  {
    id: "saas",
    name: "SaaS",
    fullName: "Software as a Service",
    icon: Building2,
    color: "from-purple-600 to-purple-400",
    painPoints: [
      "High churn with no early warning signals",
      "Feature adoption metrics lack context",
      "Support tickets take hours to reproduce",
      "Unable to identify power user patterns",
    ],
    solutions: [
      "Churn prediction identifies at-risk accounts",
      "Feature usage analytics with session context",
      "Auto-generated tickets with session links",
      "Behavioral cohort analysis for growth insights",
    ],
  },
];

export const IndustrySolutions = () => {
  const [activeIndustry, setActiveIndustry] = useState("bfsi");
  const [animatingItems, setAnimatingItems] = useState<number[]>([]);

  const handleIndustryChange = (industryId: string) => {
    setActiveIndustry(industryId);
    setAnimatingItems([]);
    // Trigger staggered animation
    industries.find(i => i.id === industryId)?.solutions.forEach((_, index) => {
      setTimeout(() => {
        setAnimatingItems(prev => [...prev, index]);
      }, index * 150);
    });
  };

  const activeData = industries.find(i => i.id === activeIndustry)!;
  const Icon = activeData.icon;

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/20">
            Enterprise Solutions
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Industry-Specific <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">Intelligence</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tailored solutions for mission-critical digital experiences.
          </p>
        </div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {industries.map((industry) => {
            const TabIcon = industry.icon;
            const isActive = activeIndustry === industry.id;

            return (
              <button
                key={industry.id}
                onClick={() => handleIndustryChange(industry.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 font-medium",
                  isActive
                    ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white shadow-lg shadow-[#0B3D91]/20"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <TabIcon className="h-4 w-4" />
                <span>{industry.name}</span>
              </button>
            );
          })}
        </div>

        {/* Industry Content */}
        <Card className="border-border/50 overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className={cn(
              "bg-gradient-to-r p-6 lg:p-8 text-white",
              activeData.color
            )}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold">{activeData.fullName}</h3>
                  <p className="text-white/80 text-sm">Enterprise-grade digital experience intelligence</p>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* Pain Points */}
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h4 className="font-semibold text-lg">Pain Points</h4>
                </div>
                <ul className="space-y-3">
                  {activeData.painPoints.map((point, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-3 text-sm text-muted-foreground animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div className="p-6 lg:p-8 bg-muted/20">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <h4 className="font-semibold text-lg">TRACEFLOW Solutions</h4>
                </div>
                <ul className="space-y-3">
                  {activeData.solutions.map((solution, index) => (
                    <li 
                      key={index}
                      className={cn(
                        "flex items-start gap-3 text-sm transition-all duration-300",
                        animatingItems.includes(index) 
                          ? "opacity-100 translate-x-0" 
                          : "opacity-50 translate-x-2"
                      )}
                    >
                      <CheckCircle className={cn(
                        "h-4 w-4 mt-0.5 flex-shrink-0 transition-colors duration-300",
                        animatingItems.includes(index) ? "text-emerald-500" : "text-muted-foreground"
                      )} />
                      <span className={cn(
                        "transition-colors duration-300",
                        animatingItems.includes(index) ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        {solution}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
