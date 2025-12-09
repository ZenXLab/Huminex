import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Brain, Lightbulb, MousePointerClick, XCircle, FileX, RefreshCw, Zap, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ClickstreamEvent {
  id: string;
  session_id: string;
  event_type: string;
  page_url: string;
  element_id: string | null;
  element_text: string | null;
  created_at: string;
  metadata: any;
}

interface AIStruggleDetectionProps {
  events: ClickstreamEvent[];
}

interface StruggleAnalysis {
  rageClicks: {
    count: number;
    locations: Array<{ element: string; page: string; severity: string }>;
  };
  deadClicks: {
    count: number;
    locations: Array<{ element: string; page: string }>;
  };
  formAbandonment: {
    count: number;
    forms: Array<{ formId: string; fieldsAbandoned: string[]; dropOffPoint: string }>;
  };
  fieldAnalytics: {
    mostAbandoned: Array<{ field: string; abandonmentRate: number }>;
    slowestFields: Array<{ field: string; avgTimeMs: number }>;
    errorProne: Array<{ field: string; errorRate: number }>;
  };
  aiInsights: string[];
  overallFrustrationScore: number;
  recommendations: string[];
}

export const AIStruggleDetection = ({ events }: AIStruggleDetectionProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<StruggleAnalysis | null>(null);

  const runAnalysis = async () => {
    if (events.length === 0) {
      toast.error("No events to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-user-struggles", {
        body: { events: events.slice(0, 500) },
      });

      if (error) throw error;
      setAnalysis(data);
      toast.success("AI analysis complete");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to run AI analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFrustrationColor = (score: number) => {
    if (score >= 70) return "text-red-600";
    if (score >= 40) return "text-amber-600";
    return "text-green-600";
  };

  const getFrustrationLabel = (score: number) => {
    if (score >= 70) return "High Frustration";
    if (score >= 40) return "Moderate Friction";
    return "Smooth Experience";
  };

  if (!analysis && !isAnalyzing) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
            <h3 className="text-lg font-semibold mb-2">AI-Powered Struggle Detection</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Automatically detect rage clicks, dead clicks, and form abandonment patterns using advanced AI analysis.
            </p>
            <Button onClick={runAnalysis} disabled={events.length === 0} size="lg">
              <Zap className="h-4 w-4 mr-2" />
              Run AI Analysis
            </Button>
            {events.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">Collect some events first</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Brain className="h-16 w-16 text-primary" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Analyzing User Behavior...</h3>
            <p className="text-muted-foreground">AI is detecting struggle patterns</p>
            <div className="mt-6 space-y-3 max-w-sm mx-auto">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Struggle Detection
          </h2>
          <p className="text-sm text-muted-foreground">Powered by Lovable AI</p>
        </div>
        <Button variant="outline" onClick={runAnalysis} disabled={isAnalyzing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`} />
          Re-analyze
        </Button>
      </div>

      {/* Frustration Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall Frustration Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(analysis?.overallFrustrationScore || 0) * 3.52} 352`}
                    className={getFrustrationColor(analysis?.overallFrustrationScore || 0)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getFrustrationColor(analysis?.overallFrustrationScore || 0)}`}>
                    {analysis?.overallFrustrationScore || 0}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className={`text-lg font-semibold ${getFrustrationColor(analysis?.overallFrustrationScore || 0)}`}>
                  {getFrustrationLabel(analysis?.overallFrustrationScore || 0)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {events.length} analyzed events
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Struggle Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-red-500" />
                Rage Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{analysis?.rageClicks.count || 0}</p>
              <p className="text-sm text-muted-foreground mb-3">Rapid repeated clicks detected</p>
              {analysis?.rageClicks.locations.slice(0, 3).map((loc, idx) => (
                <div key={idx} className="text-xs py-1 border-b last:border-0">
                  <span className="font-medium">{loc.element}</span>
                  <Badge variant="outline" className="ml-2">{loc.severity}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <XCircle className="h-4 w-4 text-amber-500" />
                Dead Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">{analysis?.deadClicks.count || 0}</p>
              <p className="text-sm text-muted-foreground mb-3">Clicks with no response</p>
              {analysis?.deadClicks.locations.slice(0, 3).map((loc, idx) => (
                <div key={idx} className="text-xs py-1 border-b last:border-0 truncate">
                  {loc.element}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileX className="h-4 w-4 text-purple-500" />
                Form Abandonment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{analysis?.formAbandonment.count || 0}</p>
              <p className="text-sm text-muted-foreground mb-3">Incomplete form submissions</p>
              {analysis?.formAbandonment.forms.slice(0, 3).map((form, idx) => (
                <div key={idx} className="text-xs py-1 border-b last:border-0">
                  <span className="font-medium">{form.formId}</span>
                  <span className="text-muted-foreground ml-1">→ {form.dropOffPoint}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                AI Insights
              </CardTitle>
              <CardDescription>Key findings from behavior analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <AnimatePresence>
                  {analysis?.aiInsights.map((insight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-3 mb-3 p-3 rounded-lg bg-muted/50"
                    >
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm">{insight}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Recommendations
              </CardTitle>
              <CardDescription>Actionable improvements to reduce friction</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <AnimatePresence>
                  {analysis?.recommendations.map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-3 mb-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm">{rec}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Field Analytics Summary */}
      {analysis?.fieldAnalytics && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Field-Level Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-red-600">Most Abandoned</h4>
                  {analysis.fieldAnalytics.mostAbandoned.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data</p>
                  ) : (
                    analysis.fieldAnalytics.mostAbandoned.map((f, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1">
                        <span className="truncate">{f.field}</span>
                        <Badge variant="destructive">{f.abandonmentRate.toFixed(0)}%</Badge>
                      </div>
                    ))
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2 text-purple-600">Slowest Fields</h4>
                  {analysis.fieldAnalytics.slowestFields.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data</p>
                  ) : (
                    analysis.fieldAnalytics.slowestFields.map((f, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1">
                        <span className="truncate">{f.field}</span>
                        <Badge variant="secondary">{(f.avgTimeMs / 1000).toFixed(1)}s</Badge>
                      </div>
                    ))
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2 text-amber-600">Error-Prone</h4>
                  {analysis.fieldAnalytics.errorProne.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data</p>
                  ) : (
                    analysis.fieldAnalytics.errorProne.map((f, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1">
                        <span className="truncate">{f.field}</span>
                        <Badge variant="outline" className="border-amber-500 text-amber-600">{f.errorRate.toFixed(0)}%</Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
