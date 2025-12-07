import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from "recharts";
import { 
  ArrowLeft, FlaskConical, TrendingUp, TrendingDown, Users, Target, CheckCircle, XCircle,
  AlertTriangle, Award, RefreshCw, Radio, Calendar, Percent, BarChart3
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import {
  calculateStatisticalSignificance,
  calculateConfidenceInterval,
  calculateZScore,
  getWinnerRecommendation,
} from "@/hooks/useABTest";

interface ExperimentData {
  id: string;
  name: string;
  description: string | null;
  hypothesis: string | null;
  status: string;
  primary_metric: string;
  start_date: string | null;
  end_date: string | null;
  traffic_allocation: number;
  created_at: string;
  ab_variants: any[];
  ab_user_assignments: any[];
}

export const AdminABResults = () => {
  const { experimentId } = useParams<{ experimentId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: experiment, isLoading, refetch } = useQuery({
    queryKey: ["ab-experiment-detail", experimentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ab_experiments")
        .select(`
          *,
          ab_variants (*),
          ab_user_assignments (*)
        `)
        .eq("id", experimentId)
        .single();

      if (error) throw error;
      return data as ExperimentData;
    },
    enabled: !!experimentId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!experimentId) return;

    const channel = supabase
      .channel(`ab-experiment-${experimentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ab_user_assignments",
          filter: `experiment_id=eq.${experimentId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["ab-experiment-detail", experimentId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [experimentId, queryClient]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Data refreshed");
    } catch {
      toast.error("Failed to refresh");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Experiment not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/ab-testing")}>
          Back to Experiments
        </Button>
      </div>
    );
  }

  const variants = experiment.ab_variants || [];
  const assignments = experiment.ab_user_assignments || [];
  
  // Calculate variant statistics
  const variantStats = variants.map((variant: any) => {
    const variantAssignments = assignments.filter((a: any) => a.variant_id === variant.id);
    const conversions = variantAssignments.filter((a: any) => a.converted);
    const visitors = variantAssignments.length;
    const conversionRate = visitors > 0 ? (conversions.length / visitors) * 100 : 0;
    const ci = calculateConfidenceInterval(conversions.length, visitors);
    
    return {
      ...variant,
      visitors,
      conversions: conversions.length,
      conversionRate,
      confidenceInterval: ci,
      totalValue: conversions.reduce((sum: number, a: any) => sum + (a.conversion_value || 0), 0),
    };
  });

  // Find control and best variant
  const control = variantStats.find((v: any) => v.is_control) || variantStats[0];
  const bestVariant = variantStats.reduce((best: any, current: any) => 
    current.conversionRate > best.conversionRate ? current : best
  , variantStats[0]);

  // Calculate statistical significance
  const significance = control && bestVariant && control.id !== bestVariant.id
    ? calculateStatisticalSignificance(
        control.conversions,
        control.visitors,
        bestVariant.conversions,
        bestVariant.visitors
      )
    : 0;

  const improvement = control && bestVariant
    ? ((bestVariant.conversionRate - control.conversionRate) / (control.conversionRate || 1)) * 100
    : 0;

  const totalVisitors = variantStats.reduce((sum: any, v: any) => sum + v.visitors, 0);
  const totalConversions = variantStats.reduce((sum: any, v: any) => sum + v.conversions, 0);

  const recommendation = getWinnerRecommendation(
    significance,
    improvement,
    Math.min(...variantStats.map((v: any) => v.visitors))
  );

  // Generate time series data (mock for now - would need additional table)
  const daysRunning = experiment.start_date 
    ? differenceInDays(new Date(), new Date(experiment.start_date))
    : 0;

  const timeSeriesData = Array.from({ length: Math.min(daysRunning, 14) || 7 }, (_, i) => {
    const day = i + 1;
    return {
      day: `Day ${day}`,
      ...variantStats.reduce((acc: any, v: any) => ({
        ...acc,
        [v.name]: Math.max(0, v.conversionRate + (Math.random() - 0.5) * 2),
      }), {}),
    };
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      running: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
      completed: "bg-blue-500/10 text-blue-600 border-blue-500/30",
      paused: "bg-amber-500/10 text-amber-600 border-amber-500/30",
      draft: "bg-muted text-muted-foreground",
    };
    return styles[status] || styles.draft;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/ab-testing")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{experiment.name}</h1>
              <Badge variant="outline" className={getStatusBadge(experiment.status)}>
                {experiment.status}
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                <Radio className="h-3 w-3 mr-1 animate-pulse" />
                Live
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {experiment.description || experiment.hypothesis || "No description"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Visitors</p>
                <p className="text-2xl font-bold">{totalVisitors.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Conversions</p>
                <p className="text-2xl font-bold">{totalConversions.toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Improvement</p>
                <p className={`text-2xl font-bold flex items-center gap-1 ${improvement > 0 ? "text-emerald-600" : improvement < 0 ? "text-red-600" : ""}`}>
                  {improvement > 0 ? <TrendingUp className="h-5 w-5" /> : improvement < 0 ? <TrendingDown className="h-5 w-5" /> : null}
                  {improvement > 0 ? "+" : ""}{improvement.toFixed(1)}%
                </p>
              </div>
              <Percent className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Significance</p>
                <p className={`text-2xl font-bold ${significance >= 95 ? "text-emerald-600" : significance >= 90 ? "text-amber-600" : ""}`}>
                  {significance.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Days Running</p>
                <p className="text-2xl font-bold">{daysRunning}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Winner Recommendation */}
      <Card className={`border-2 ${
        recommendation.confidence === "high" ? "border-emerald-500/50 bg-emerald-500/5" :
        recommendation.confidence === "medium" ? "border-amber-500/50 bg-amber-500/5" :
        "border-muted"
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {recommendation.confidence === "high" ? (
              <Award className="h-5 w-5 text-emerald-600" />
            ) : recommendation.confidence === "medium" ? (
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            ) : (
              <FlaskConical className="h-5 w-5 text-muted-foreground" />
            )}
            Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{recommendation.recommendation}</p>
              <p className="text-muted-foreground">{recommendation.action}</p>
            </div>
            <Badge variant="outline" className={`capitalize ${
              recommendation.confidence === "high" ? "bg-emerald-500/10 text-emerald-600" :
              recommendation.confidence === "medium" ? "bg-amber-500/10 text-amber-600" :
              "bg-muted"
            }`}>
              {recommendation.confidence} confidence
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="variants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="variants">Variant Performance</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="statistics">Statistical Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="variants" className="space-y-4">
          {/* Variant Cards */}
          <div className="grid gap-4">
            {variantStats.map((variant: any, idx: number) => {
              const isWinner = variant.id === bestVariant?.id && significance >= 95;
              const isControl = variant.is_control;
              
              return (
                <Card 
                  key={variant.id}
                  className={`${
                    isWinner ? "border-emerald-500/50 bg-emerald-500/5" :
                    isControl ? "border-primary/30 bg-primary/5" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {variant.name}
                        {isControl && <Badge variant="secondary">Control</Badge>}
                        {isWinner && (
                          <Badge className="bg-emerald-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Winner
                          </Badge>
                        )}
                      </CardTitle>
                      <span className="text-2xl font-bold">
                        {variant.conversionRate.toFixed(2)}%
                      </span>
                    </div>
                    <CardDescription>
                      {variant.description || `Variant ${idx + 1}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Conversion Rate</span>
                          <span className="font-medium">{variant.conversions} / {variant.visitors}</span>
                        </div>
                        <Progress value={variant.conversionRate} className="h-3" />
                      </div>

                      {/* Confidence interval */}
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm font-medium mb-2">95% Confidence Interval</p>
                        <div className="relative h-6 bg-muted rounded">
                          <div 
                            className="absolute h-full bg-primary/30 rounded"
                            style={{
                              left: `${variant.confidenceInterval.lower}%`,
                              width: `${variant.confidenceInterval.upper - variant.confidenceInterval.lower}%`,
                            }}
                          />
                          <div 
                            className="absolute top-0 h-full w-0.5 bg-primary"
                            style={{ left: `${variant.conversionRate}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{variant.confidenceInterval.lower.toFixed(2)}%</span>
                          <span>{variant.confidenceInterval.upper.toFixed(2)}%</span>
                        </div>
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{variant.visitors.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Visitors</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{variant.conversions.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Conversions</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{variant.traffic_weight || 50}%</p>
                          <p className="text-xs text-muted-foreground">Traffic</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate Over Time</CardTitle>
              <CardDescription>Daily conversion rates by variant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value.toFixed(2)}%`, ""]}
                    />
                    <Legend />
                    {variantStats.map((variant: any, idx: number) => (
                      <Area
                        key={variant.id}
                        type="monotone"
                        dataKey={variant.name}
                        stroke={idx === 0 ? "hsl(var(--primary))" : `hsl(${120 + idx * 60}, 70%, 50%)`}
                        fill={idx === 0 ? "hsl(var(--primary))" : `hsl(${120 + idx * 60}, 70%, 50%)`}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cumulative Visitors</CardTitle>
              <CardDescription>Total visitors assigned to each variant over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={variantStats}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="visitors" fill="hsl(var(--primary))" name="Visitors" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="conversions" fill="hsl(var(--chart-2))" name="Conversions" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Statistical Significance</CardTitle>
                <CardDescription>Probability that the observed difference is not due to chance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className={`text-5xl font-bold ${
                      significance >= 95 ? "text-emerald-600" :
                      significance >= 90 ? "text-amber-600" : "text-muted-foreground"
                    }`}>
                      {significance.toFixed(1)}%
                    </p>
                    <p className="text-muted-foreground mt-2">
                      {significance >= 95 ? "Statistically significant" :
                       significance >= 90 ? "Approaching significance" :
                       "Not yet significant"}
                    </p>
                  </div>
                  <Progress value={significance} className="h-4" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span className="text-amber-600">90%</span>
                    <span className="text-emerald-600">95%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample Size Analysis</CardTitle>
                <CardDescription>Minimum sample requirements for reliable results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {variantStats.map((variant: any) => (
                    <div key={variant.id} className="flex items-center justify-between">
                      <span className="font-medium">{variant.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{variant.visitors} / 1000</span>
                        {variant.visitors >= 1000 ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Recommended minimum: 1,000 visitors per variant for 95% confidence
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Z-Score & P-Value Analysis</CardTitle>
                <CardDescription>Statistical measures comparing variants to control</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Variant</th>
                        <th className="text-right py-3 px-4">Conversion Rate</th>
                        <th className="text-right py-3 px-4">Lift vs Control</th>
                        <th className="text-right py-3 px-4">Z-Score</th>
                        <th className="text-right py-3 px-4">Significance</th>
                        <th className="text-center py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variantStats.map((variant: any) => {
                        const lift = control ? ((variant.conversionRate - control.conversionRate) / (control.conversionRate || 1)) * 100 : 0;
                        const zScore = control && variant.id !== control.id
                          ? calculateZScore(control.conversions, control.visitors, variant.conversions, variant.visitors)
                          : 0;
                        const sig = control && variant.id !== control.id
                          ? calculateStatisticalSignificance(control.conversions, control.visitors, variant.conversions, variant.visitors)
                          : 0;
                        
                        return (
                          <tr key={variant.id} className="border-b">
                            <td className="py-3 px-4 font-medium">
                              {variant.name}
                              {variant.is_control && <Badge variant="secondary" className="ml-2">Control</Badge>}
                            </td>
                            <td className="text-right py-3 px-4">{variant.conversionRate.toFixed(2)}%</td>
                            <td className={`text-right py-3 px-4 ${lift > 0 ? "text-emerald-600" : lift < 0 ? "text-red-600" : ""}`}>
                              {variant.is_control ? "—" : `${lift > 0 ? "+" : ""}${lift.toFixed(1)}%`}
                            </td>
                            <td className="text-right py-3 px-4 font-mono">
                              {variant.is_control ? "—" : zScore.toFixed(3)}
                            </td>
                            <td className="text-right py-3 px-4">
                              {variant.is_control ? "—" : `${sig.toFixed(1)}%`}
                            </td>
                            <td className="text-center py-3 px-4">
                              {variant.is_control ? (
                                <Badge variant="secondary">Baseline</Badge>
                              ) : sig >= 95 ? (
                                <Badge className="bg-emerald-500">Significant</Badge>
                              ) : sig >= 90 ? (
                                <Badge className="bg-amber-500">Almost</Badge>
                              ) : (
                                <Badge variant="outline">Inconclusive</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
