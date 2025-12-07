import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Check, X, Minus, Crown, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ComparisonFeature {
  category: string;
  features: {
    name: string;
    atlas: boolean | "partial" | "premium";
    workday: boolean | "partial";
    rippling: boolean | "partial";
    darwinbox: boolean | "partial";
    zoho: boolean | "partial";
    greythr: boolean | "partial";
  }[];
}

const comparisonData: ComparisonFeature[] = [
  {
    category: "Core HR & Workforce",
    features: [
      { name: "Employee Database", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: true },
      { name: "Multi-Entity Support", atlas: true, workday: true, rippling: true, darwinbox: "partial", zoho: "partial", greythr: false },
      { name: "Org Chart & Hierarchy", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: true },
      { name: "Employee Lifecycle", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: true },
    ]
  },
  {
    category: "Payroll & Compliance",
    features: [
      { name: "India Payroll (PF/ESI/PT/TDS)", atlas: true, workday: "partial", rippling: true, darwinbox: true, zoho: true, greythr: true },
      { name: "Multi-Country Payroll", atlas: true, workday: true, rippling: true, darwinbox: "partial", zoho: "partial", greythr: false },
      { name: "Auto Compliance Filings", atlas: true, workday: "partial", rippling: "partial", darwinbox: true, zoho: "partial", greythr: true },
      { name: "CTC Structure Builder", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: true },
    ]
  },
  {
    category: "Attendance & Leave",
    features: [
      { name: "Biometric Integration", atlas: true, workday: "partial", rippling: "partial", darwinbox: true, zoho: true, greythr: true },
      { name: "Geofence Attendance", atlas: true, workday: false, rippling: true, darwinbox: true, zoho: true, greythr: "partial" },
      { name: "Shift & Roster Management", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: true },
      { name: "Leave Policies Engine", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: true },
    ]
  },
  {
    category: "Recruitment & ATS",
    features: [
      { name: "Job Posting & Distribution", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: false },
      { name: "AI Resume Parsing", atlas: true, workday: "partial", rippling: true, darwinbox: "partial", zoho: "partial", greythr: false },
      { name: "Interview Scheduling", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: false },
      { name: "Offer Management", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: false },
    ]
  },
  {
    category: "Projects & Finance",
    features: [
      { name: "Project Management", atlas: true, workday: "partial", rippling: false, darwinbox: false, zoho: true, greythr: false },
      { name: "Time & Billing", atlas: true, workday: true, rippling: "partial", darwinbox: false, zoho: true, greythr: false },
      { name: "Expense Management", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: "partial" },
      { name: "Vendor Payments", atlas: true, workday: true, rippling: true, darwinbox: false, zoho: true, greythr: false },
    ]
  },
  {
    category: "AI & Automation",
    features: [
      { name: "AI Insights (Proxima)", atlas: "premium", workday: "partial", rippling: "partial", darwinbox: false, zoho: "partial", greythr: false },
      { name: "Workflow Automation", atlas: true, workday: true, rippling: true, darwinbox: "partial", zoho: true, greythr: "partial" },
      { name: "Natural Language Queries", atlas: "premium", workday: false, rippling: false, darwinbox: false, zoho: false, greythr: false },
      { name: "Predictive Analytics", atlas: "premium", workday: "partial", rippling: false, darwinbox: false, zoho: false, greythr: false },
    ]
  },
  {
    category: "Security & Governance",
    features: [
      { name: "SSO (Google/Microsoft/Okta)", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: "partial" },
      { name: "Role-Based Access Control", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: true },
      { name: "Audit Logs", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: "partial" },
      { name: "Data Encryption", atlas: true, workday: true, rippling: true, darwinbox: true, zoho: true, greythr: true },
    ]
  },
  {
    category: "Additional Modules",
    features: [
      { name: "BGV Integration", atlas: true, workday: "partial", rippling: true, darwinbox: "partial", zoho: false, greythr: false },
      { name: "Asset Management", atlas: true, workday: false, rippling: true, darwinbox: "partial", zoho: "partial", greythr: false },
      { name: "Insurance & Claims", atlas: true, workday: false, rippling: true, darwinbox: false, zoho: false, greythr: false },
      { name: "Performance Management", atlas: true, workday: true, rippling: "partial", darwinbox: true, zoho: true, greythr: "partial" },
    ]
  }
];

const competitors = [
  { key: "atlas", name: "ATLAS", highlight: true },
  { key: "workday", name: "Workday", highlight: false },
  { key: "rippling", name: "Rippling", highlight: false },
  { key: "darwinbox", name: "Darwinbox", highlight: false },
  { key: "zoho", name: "Zoho People", highlight: false },
  { key: "greythr", name: "GreytHR", highlight: false },
];

const FeatureIcon = ({ value, isAtlas = false }: { value: boolean | "partial" | "premium"; isAtlas?: boolean }) => {
  if (value === true) {
    return <Check className="w-5 h-5 text-green-500" />;
  }
  if (value === "partial") {
    return <Minus className="w-5 h-5 text-amber-500" />;
  }
  if (value === "premium") {
    return (
      <div className="flex items-center gap-1">
        <Check className="w-5 h-5 text-violet-500" />
        <Sparkles className="w-3 h-3 text-violet-500" />
      </div>
    );
  }
  // Red X for competitors, muted for ATLAS (if ever needed)
  return <X className={`w-5 h-5 ${isAtlas ? 'text-muted-foreground/40' : 'text-red-500'}`} />;
};

export const ComparisonTable = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-muted/30"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold tracking-wide uppercase mb-6">
            <Crown className="w-4 h-4" />
            Why ATLAS Wins
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6">
            ATLAS vs <span className="text-gradient">The Competition</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See how ATLAS stacks up against industry leaders. We built what others couldn't — 
            a truly unified platform for the modern enterprise.
          </p>
        </div>

        {/* Legend */}
        <div className={`flex flex-wrap items-center justify-center gap-6 mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">Full Support</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Minus className="w-4 h-4 text-amber-500" />
            <span className="text-muted-foreground">Partial Support</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-0.5">
              <Check className="w-4 h-4 text-violet-500" />
              <Sparkles className="w-3 h-3 text-violet-500" />
            </div>
            <span className="text-muted-foreground">Premium Feature</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <X className="w-4 h-4 text-red-500" />
            <span className="text-muted-foreground">Not Available</span>
          </div>
        </div>

        {/* Collapsible Table */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <button className={`w-full flex items-center justify-center gap-2 py-4 px-6 bg-card border border-border/60 rounded-2xl mb-4 hover:bg-muted/50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="font-semibold text-foreground">
                {isOpen ? 'Hide Comparison Table' : 'Show Full Comparison Table'}
              </span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className={`overflow-x-auto transition-all duration-700 delay-300`}>
              <div className="min-w-[900px] bg-card border border-border/60 rounded-2xl overflow-hidden shadow-lg">
                {/* Header Row */}
                <div className="grid grid-cols-7 bg-muted/50 border-b border-border/60">
                  <div className="p-4 font-semibold text-foreground">Features</div>
                  {competitors.map((comp) => (
                    <div 
                      key={comp.key} 
                      className={`p-4 text-center font-semibold ${comp.highlight ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {comp.highlight && <Crown className="w-4 h-4" />}
                        <span>{comp.name}</span>
                        {comp.highlight && (
                          <Badge variant="default" className="text-[10px] px-2 py-0">
                            RECOMMENDED
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feature Rows */}
                {comparisonData.map((category, catIndex) => (
                  <div key={catIndex}>
                    {/* Category Header */}
                    <div className="grid grid-cols-7 bg-muted/30 border-b border-border/40">
                      <div className="col-span-7 p-3 px-4">
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                          {category.category}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    {category.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex} 
                        className="grid grid-cols-7 border-b border-border/30 hover:bg-muted/20 transition-colors"
                      >
                        <div className="p-4 text-sm text-foreground">
                          {feature.name}
                        </div>
                        {competitors.map((comp) => (
                          <div 
                            key={comp.key} 
                            className={`p-4 flex justify-center items-center ${comp.highlight ? 'bg-primary/5' : ''}`}
                          >
                            <FeatureIcon 
                              value={feature[comp.key as keyof typeof feature] as boolean | "partial" | "premium"} 
                              isAtlas={comp.highlight}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Bottom CTA */}
        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-muted-foreground mb-4">
            Ready to experience the ATLAS difference?
          </p>
          <a 
            href="/get-quote" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Crown className="w-4 h-4" />
            Start Your Free Trial
          </a>
        </div>
      </div>
    </section>
  );
};
