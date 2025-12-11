import { Badge } from "@/components/ui/badge";
import { CheckCircle, Minus, X, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const competitors = [
  { name: "TRACEFLOW", isUs: true },
  { name: "FullStory", isUs: false },
  { name: "Glassbox", isUs: false },
  { name: "Contentsquare", isUs: false },
];

type FeatureStatus = "full" | "partial" | "none";

interface FeatureRow {
  feature: string;
  description: string;
  traceflow: FeatureStatus;
  fullstory: FeatureStatus;
  glassbox: FeatureStatus;
  contentsquare: FeatureStatus;
}

const features: FeatureRow[] = [
  {
    feature: "Hybrid Deployment",
    description: "Cloud + On-Prem flexibility",
    traceflow: "full",
    fullstory: "none",
    glassbox: "full",
    contentsquare: "none",
  },
  {
    feature: "On-Prem / Air-Gapped",
    description: "Fully isolated deployment",
    traceflow: "full",
    fullstory: "none",
    glassbox: "partial",
    contentsquare: "none",
  },
  {
    feature: "Zero-PII Pipeline",
    description: "Local tokenization before cloud",
    traceflow: "full",
    fullstory: "none",
    glassbox: "full",
    contentsquare: "none",
  },
  {
    feature: "Dual WebAuthn Admin",
    description: "TouchID/FaceID + hardware keys",
    traceflow: "full",
    fullstory: "none",
    glassbox: "none",
    contentsquare: "none",
  },
  {
    feature: "Multi-Agent RCA",
    description: "AI-powered root cause analysis",
    traceflow: "full",
    fullstory: "none",
    glassbox: "partial",
    contentsquare: "none",
  },
  {
    feature: "PROXIMA Automation",
    description: "Multi-agent workflow engine",
    traceflow: "full",
    fullstory: "none",
    glassbox: "none",
    contentsquare: "none",
  },
  {
    feature: "Observability Fusion",
    description: "OTel traces + session correlation",
    traceflow: "full",
    fullstory: "partial",
    glassbox: "partial",
    contentsquare: "none",
  },
  {
    feature: "Enterprise Compliance",
    description: "SOC2, ISO, data residency",
    traceflow: "full",
    fullstory: "full",
    glassbox: "full",
    contentsquare: "full",
  },
  {
    feature: "Temporal Workflow Engine",
    description: "Durable orchestration layer",
    traceflow: "full",
    fullstory: "none",
    glassbox: "none",
    contentsquare: "none",
  },
];

const StatusIcon = ({ status }: { status: FeatureStatus }) => {
  if (status === "full") {
    return <CheckCircle className="h-5 w-5 text-emerald-500" />;
  }
  if (status === "partial") {
    return <Minus className="h-5 w-5 text-amber-500" />;
  }
  return <X className="h-5 w-5 text-red-400" />;
};

export const CompetitorTable = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white border-0">
            Competitive Advantage
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Why <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">TRACEFLOW</span> Leads
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The only DXI platform with enterprise-grade deployment, zero-trust security, and multi-agent AI.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <div className="p-4">
                <span className="text-sm font-medium text-muted-foreground">Feature</span>
              </div>
              {competitors.map((competitor) => (
                <div
                  key={competitor.name}
                  className={cn(
                    "p-4 rounded-t-xl text-center",
                    competitor.isUs
                      ? "bg-gradient-to-b from-[#0B3D91] to-[#0B3D91]/90"
                      : "bg-muted"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    {competitor.isUs && <Crown className="h-4 w-4 text-[#FF8A00]" />}
                    <span className={cn(
                      "font-semibold",
                      competitor.isUs ? "text-white" : "text-foreground"
                    )}>
                      {competitor.name}
                    </span>
                  </div>
                  {competitor.isUs && (
                    <Badge className="mt-2 bg-[#FF8A00] text-white text-[10px] border-0">
                      Advanced
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div
                  key={feature.feature}
                  className={cn(
                    "grid grid-cols-5 gap-2 items-center transition-all duration-300 hover:bg-muted/50 rounded-xl",
                    index % 2 === 0 ? "bg-card" : "bg-card/50"
                  )}
                >
                  <div className="p-4">
                    <p className="font-medium text-sm">{feature.feature}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                  <div className={cn(
                    "p-4 flex justify-center bg-[#0B3D91]/5 border-l-2 border-[#0B3D91]"
                  )}>
                    <StatusIcon status={feature.traceflow} />
                  </div>
                  <div className="p-4 flex justify-center">
                    <StatusIcon status={feature.fullstory} />
                  </div>
                  <div className="p-4 flex justify-center">
                    <StatusIcon status={feature.glassbox} />
                  </div>
                  <div className="p-4 flex justify-center">
                    <StatusIcon status={feature.contentsquare} />
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">Full Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">Partial</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-400" />
                <span className="text-sm text-muted-foreground">Not Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
