import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, ArrowDown, Radio } from "lucide-react";

interface FunnelStep {
  name: string;
  count: number;
  percentage: number;
  dropOff: number;
}

interface ConversionFunnelProps {
  events: Array<{
    event_type: string;
    page_url: string | null;
    metadata: any;
  }>;
}

export const ConversionFunnel = ({ events }: ConversionFunnelProps) => {
  // Calculate funnel steps from events
  const calculateFunnel = (): FunnelStep[] => {
    const landingPages = events.filter(e => 
      e.event_type === "pageview" && 
      (e.page_url === "/" || e.page_url === "/pricing" || e.page_url?.includes("/industries"))
    ).length;

    const featureViews = events.filter(e => 
      e.event_type === "pageview" && 
      (e.page_url?.includes("/features") || e.page_url?.includes("/modules"))
    ).length;

    const pricingViews = events.filter(e => 
      e.event_type === "pageview" && e.page_url === "/pricing"
    ).length;

    const quoteClicks = events.filter(e => 
      e.event_type === "click" && 
      (e.metadata?.tagName === "BUTTON" || e.page_url?.includes("/get-quote"))
    ).length;

    const contactSubmissions = events.filter(e => 
      e.event_type === "form_submit" || 
      (e.event_type === "click" && e.page_url?.includes("/contact"))
    ).length;

    const signupAttempts = events.filter(e => 
      e.page_url?.includes("/onboarding") || 
      e.page_url?.includes("/auth")
    ).length;

    const steps = [
      { name: "Landing Page", count: landingPages },
      { name: "Feature Exploration", count: featureViews },
      { name: "Pricing View", count: pricingViews },
      { name: "CTA Clicks", count: quoteClicks },
      { name: "Contact/Quote", count: contactSubmissions },
      { name: "Signup Started", count: signupAttempts },
    ];

    const maxCount = Math.max(...steps.map(s => s.count), 1);

    return steps.map((step, idx) => ({
      ...step,
      percentage: (step.count / maxCount) * 100,
      dropOff: idx > 0 && steps[idx - 1].count > 0 
        ? Math.round(((steps[idx - 1].count - step.count) / steps[idx - 1].count) * 100)
        : 0,
    }));
  };

  const funnelSteps = calculateFunnel();
  const totalConversionRate = funnelSteps[0].count > 0 
    ? ((funnelSteps[funnelSteps.length - 1].count / funnelSteps[0].count) * 100).toFixed(1)
    : "0.0";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Conversion Funnel
            </CardTitle>
            <CardDescription>User journey from landing to signup</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              Live
            </Badge>
            <Badge variant="secondary" className="text-primary">
              {totalConversionRate}% Overall
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funnelSteps.map((step, idx) => (
            <div key={step.name} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{step.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{step.count}</span>
                  {step.dropOff > 0 && (
                    <Badge variant="destructive" className="text-[10px] px-1.5">
                      -{step.dropOff}%
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Funnel bar */}
              <div className="relative h-10 bg-muted rounded-lg overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 rounded-lg flex items-center justify-end pr-3"
                  style={{ 
                    width: `${Math.max(step.percentage, 5)}%`,
                    clipPath: idx < funnelSteps.length - 1 
                      ? "polygon(0 0, 100% 0, 95% 100%, 0 100%)" 
                      : undefined
                  }}
                >
                  <span className="text-primary-foreground text-sm font-medium">
                    {step.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Arrow connector */}
              {idx < funnelSteps.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Conversion insights */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">Funnel Insights</h4>
          <div className="grid gap-2 text-sm text-muted-foreground">
            {funnelSteps.slice(1).map((step, idx) => (
              step.dropOff > 50 && (
                <div key={step.name} className="flex items-center gap-2 text-amber-600">
                  <TrendingDown className="h-4 w-4" />
                  <span>High drop-off ({step.dropOff}%) at "{step.name}" stage</span>
                </div>
              )
            ))}
            {funnelSteps.every(s => s.dropOff <= 50) && (
              <span className="text-emerald-600">Funnel performing well - no critical drop-offs detected</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
