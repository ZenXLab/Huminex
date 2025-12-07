import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
  Brain, TrendingUp, TrendingDown, AlertTriangle, Users, DollarSign, Target,
  RefreshCw, Loader2, Sparkles, ChevronRight, Shield, Zap, ArrowUpRight, ArrowDownRight
} from "lucide-react";

// Historical data for AI to analyze
const historicalMRRData = [
  { month: "Jul", mrr: 45000 }, { month: "Aug", mrr: 52000 }, { month: "Sep", mrr: 58000 },
  { month: "Oct", mrr: 67000 }, { month: "Nov", mrr: 75000 }, { month: "Dec", mrr: 85000 },
];

const tenantMetrics = [
  { tenant_id: "T001", name: "TechCorp", logins_30d: 12, tickets: 5, payment_issues: 2, engagement: 35 },
  { tenant_id: "T002", name: "StartupXYZ", logins_30d: 45, tickets: 1, payment_issues: 0, engagement: 92 },
  { tenant_id: "T003", name: "Enterprise Inc", logins_30d: 8, tickets: 8, payment_issues: 1, engagement: 28 },
  { tenant_id: "T004", name: "GrowthCo", logins_30d: 38, tickets: 2, payment_issues: 0, engagement: 78 },
  { tenant_id: "T005", name: "SMB Solutions", logins_30d: 5, tickets: 12, payment_issues: 3, engagement: 18 },
];

const funnelData = {
  stages: [
    { name: "Visitors", count: 15420, drop_off: 46.5 },
    { name: "Engaged", count: 8250, drop_off: 50.1 },
    { name: "Pricing", count: 4120, drop_off: 54.1 },
    { name: "Quote", count: 1890, drop_off: 55.3 },
    { name: "Converted", count: 845, drop_off: 0 },
  ]
};

export const AdminPredictiveAnalytics = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [mrrPredictions, setMrrPredictions] = useState<any>(null);
  const [churnPredictions, setChurnPredictions] = useState<any>(null);
  const [conversionPredictions, setConversionPredictions] = useState<any>(null);

  const runPrediction = async (type: string) => {
    setLoading(type);
    try {
      let historicalData;
      switch (type) {
        case "mrr_forecast":
          historicalData = historicalMRRData;
          break;
        case "churn_risk":
          historicalData = tenantMetrics;
          break;
        case "conversion_optimization":
          historicalData = funnelData;
          break;
        default:
          throw new Error("Unknown prediction type");
      }

      const { data, error } = await supabase.functions.invoke("predictive-analytics", {
        body: { type, historicalData }
      });

      if (error) throw error;

      switch (type) {
        case "mrr_forecast":
          setMrrPredictions(data.result);
          break;
        case "churn_risk":
          setChurnPredictions(data.result);
          break;
        case "conversion_optimization":
          setConversionPredictions(data.result);
          break;
      }

      toast.success(`${type.replace("_", " ")} prediction completed`);
    } catch (error: any) {
      console.error("Prediction error:", error);
      if (error.message?.includes("429")) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else if (error.message?.includes("402")) {
        toast.error("AI credits exhausted. Please add more credits.");
      } else {
        toast.error("Failed to generate prediction. Please try again.");
      }
    } finally {
      setLoading(null);
    }
  };

  // Generate predicted MRR chart data
  const getPredictedMRRData = () => {
    const base: Array<{ month: string; mrr: number; predicted?: boolean }> = [...historicalMRRData];
    if (mrrPredictions?.predictions) {
      mrrPredictions.predictions.forEach((pred: any) => {
        base.push({ month: pred.month, mrr: pred.predicted_mrr, predicted: true });
      });
    }
    return base;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
            <Brain className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">AI Predictive Analytics</h1>
            <p className="text-muted-foreground">Forecast MRR, churn risk & conversion improvements</p>
          </div>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
          <Sparkles className="h-3 w-3" />
          Powered by Lovable AI
        </Badge>
      </div>

      {/* Prediction Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* MRR Forecast Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              MRR Forecast
            </CardTitle>
            <CardDescription>6-month revenue prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => runPrediction("mrr_forecast")} 
              disabled={loading === "mrr_forecast"}
              className="w-full mb-4"
            >
              {loading === "mrr_forecast" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Forecast
                </>
              )}
            </Button>
            {mrrPredictions && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Trend</span>
                  <Badge className={mrrPredictions.trend === "growing" ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"}>
                    {mrrPredictions.trend === "growing" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {mrrPredictions.trend}
                  </Badge>
                </div>
                {mrrPredictions.insights?.slice(0, 2).map((insight: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-emerald-500" />
                    {insight}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Churn Risk Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Churn Risk
            </CardTitle>
            <CardDescription>At-risk tenant identification</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => runPrediction("churn_risk")} 
              disabled={loading === "churn_risk"}
              className="w-full mb-4"
              variant="outline"
            >
              {loading === "churn_risk" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Analyze Risk
                </>
              )}
            </Button>
            {churnPredictions && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <span className="text-sm">Churn Probability</span>
                  <span className="font-bold text-red-500">{churnPredictions.overall_churn_probability}%</span>
                </div>
                {churnPredictions.high_risk_tenants?.slice(0, 2).map((tenant: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm font-medium">{tenant.tenant_id}</span>
                    <Badge variant="destructive" className="text-xs">{tenant.risk_score}% risk</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversion Optimization Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-500" />
              Conversion Optimization
            </CardTitle>
            <CardDescription>Funnel improvement suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => runPrediction("conversion_optimization")} 
              disabled={loading === "conversion_optimization"}
              className="w-full mb-4"
              variant="outline"
            >
              {loading === "conversion_optimization" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Get Suggestions
                </>
              )}
            </Button>
            {conversionPredictions && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <span className="text-sm">Predicted Improvement</span>
                  <span className="font-bold text-cyan-500">+{conversionPredictions.predicted_improvement}%</span>
                </div>
                {conversionPredictions.quick_wins?.slice(0, 2).map((win: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 mt-0.5 text-cyan-500" />
                    {win}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* MRR Prediction Chart */}
      {mrrPredictions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              MRR Forecast Visualization
            </CardTitle>
            <CardDescription>Historical data with 6-month AI predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={getPredictedMRRData()}>
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `₹${v/1000}K`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    `₹${value.toLocaleString()}`, 
                    name === 'mrr' ? 'MRR' : 'Predicted'
                  ]}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="mrr" 
                  stroke="hsl(160, 84%, 39%)" 
                  fill="url(#mrrGradient)"
                  strokeWidth={2}
                  name="Historical MRR"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Churn Risk Details */}
      {churnPredictions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Churn Risk Analysis
            </CardTitle>
            <CardDescription>AI-identified at-risk tenants with recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-red-500 flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  High Risk Tenants
                </h4>
                {churnPredictions.high_risk_tenants?.map((tenant: any, i: number) => (
                  <div key={i} className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{tenant.tenant_id}</span>
                      <Badge variant="destructive">{tenant.risk_score}% Risk</Badge>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {tenant.reasons?.map((reason: string, j: number) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-emerald-500 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Recommendations
                </h4>
                {churnPredictions.recommendations?.map((rec: string, i: number) => (
                  <div key={i} className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-sm font-semibold">
                      {i + 1}
                    </div>
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversion Optimization Details */}
      {conversionPredictions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-500" />
              Conversion Optimization Roadmap
            </CardTitle>
            <CardDescription>AI-identified bottlenecks and improvement opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-amber-500">Identified Bottlenecks</h4>
                {conversionPredictions.bottlenecks?.map((bottleneck: any, i: number) => (
                  <div key={i} className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{bottleneck.stage}</span>
                      <Badge className="bg-amber-500/20 text-amber-500">{bottleneck.drop_off_rate}% drop</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{bottleneck.fix}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-cyan-500">Quick Wins</h4>
                {conversionPredictions.quick_wins?.map((win: string, i: number) => (
                  <div key={i} className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg flex items-start gap-3">
                    <Zap className="h-5 w-5 text-cyan-500 mt-0.5" />
                    <span className="text-sm">{win}</span>
                  </div>
                ))}
                <h4 className="font-semibold text-purple-500 mt-6">Long-term Improvements</h4>
                {conversionPredictions.long_term_improvements?.map((imp: string, i: number) => (
                  <div key={i} className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5" />
                    <span className="text-sm">{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPredictiveAnalytics;
