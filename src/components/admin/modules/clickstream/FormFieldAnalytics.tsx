import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileX, Clock, AlertTriangle, TrendingDown, FormInput } from "lucide-react";
import { motion } from "framer-motion";

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

interface FormFieldAnalyticsProps {
  events: ClickstreamEvent[];
}

interface FieldMetrics {
  fieldName: string;
  interactions: number;
  avgTimeMs: number;
  errors: number;
  errorRate: number;
  abandonments: number;
  abandonmentRate: number;
}

export const FormFieldAnalytics = ({ events }: FormFieldAnalyticsProps) => {
  const formEvents = useMemo(() => 
    events.filter(e => 
      ["field_blur", "field_error", "form_submit", "form_abandonment"].includes(e.event_type)
    ),
    [events]
  );

  const fieldMetrics = useMemo(() => {
    const metrics: Map<string, {
      interactions: number;
      totalTime: number;
      errors: number;
      abandonments: number;
    }> = new Map();

    // Process field blur events
    formEvents
      .filter(e => e.event_type === "field_blur")
      .forEach(event => {
        const fieldName = event.element_id || event.element_text || "unknown";
        const current = metrics.get(fieldName) || { interactions: 0, totalTime: 0, errors: 0, abandonments: 0 };
        current.interactions++;
        current.totalTime += event.metadata?.timeSpentMs || 0;
        if (event.metadata?.hasError) current.errors++;
        metrics.set(fieldName, current);
      });

    // Process field error events
    formEvents
      .filter(e => e.event_type === "field_error")
      .forEach(event => {
        const fieldName = event.element_id || "unknown";
        const current = metrics.get(fieldName) || { interactions: 0, totalTime: 0, errors: 0, abandonments: 0 };
        current.errors++;
        metrics.set(fieldName, current);
      });

    // Process form abandonment events
    formEvents
      .filter(e => e.event_type === "form_abandonment")
      .forEach(event => {
        const abandonedFields = event.metadata?.fieldDetails?.filter((f: any) => f.wasAbandoned) || [];
        abandonedFields.forEach((field: any) => {
          const current = metrics.get(field.name) || { interactions: 0, totalTime: 0, errors: 0, abandonments: 0 };
          current.abandonments++;
          metrics.set(field.name, current);
        });
      });

    // Convert to array with calculated rates
    const result: FieldMetrics[] = Array.from(metrics.entries()).map(([fieldName, data]) => ({
      fieldName,
      interactions: data.interactions,
      avgTimeMs: data.interactions > 0 ? Math.round(data.totalTime / data.interactions) : 0,
      errors: data.errors,
      errorRate: data.interactions > 0 ? Math.round((data.errors / data.interactions) * 100) : 0,
      abandonments: data.abandonments,
      abandonmentRate: data.interactions > 0 ? Math.round((data.abandonments / data.interactions) * 100) : 0,
    }));

    return result.sort((a, b) => b.interactions - a.interactions);
  }, [formEvents]);

  const formStats = useMemo(() => {
    const submissions = formEvents.filter(e => e.event_type === "form_submit").length;
    const abandonments = formEvents.filter(e => e.event_type === "form_abandonment").length;
    const totalForms = submissions + abandonments;
    
    return {
      submissions,
      abandonments,
      completionRate: totalForms > 0 ? Math.round((submissions / totalForms) * 100) : 0,
      avgFormTime: formEvents
        .filter(e => e.event_type === "form_submit" || e.event_type === "form_abandonment")
        .reduce((sum, e) => sum + (e.metadata?.totalTimeMs || 0), 0) / Math.max(totalForms, 1),
    };
  }, [formEvents]);

  const topAbandoned = useMemo(() => 
    [...fieldMetrics]
      .filter(f => f.abandonments > 0)
      .sort((a, b) => b.abandonmentRate - a.abandonmentRate)
      .slice(0, 5),
    [fieldMetrics]
  );

  const topErrorProne = useMemo(() => 
    [...fieldMetrics]
      .filter(f => f.errors > 0)
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 5),
    [fieldMetrics]
  );

  const slowestFields = useMemo(() => 
    [...fieldMetrics]
      .filter(f => f.avgTimeMs > 0)
      .sort((a, b) => b.avgTimeMs - a.avgTimeMs)
      .slice(0, 5),
    [fieldMetrics]
  );

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (formEvents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <FormInput className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No form field data available yet</p>
            <p className="text-sm mt-1">Form interactions will appear here once tracked</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <FormInput className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formStats.submissions}</p>
                  <p className="text-sm text-muted-foreground">Form Submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-red-500/10">
                  <FileX className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formStats.abandonments}</p>
                  <p className="text-sm text-muted-foreground">Form Abandonments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <TrendingDown className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formStats.completionRate}%</p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatTime(formStats.avgFormTime)}</p>
                  <p className="text-sm text-muted-foreground">Avg Form Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Field Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Abandoned Fields */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileX className="h-4 w-4 text-red-500" />
              Most Abandoned Fields
            </CardTitle>
            <CardDescription>Fields where users drop off</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {topAbandoned.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No abandonment data</p>
              ) : (
                <div className="space-y-3">
                  {topAbandoned.map((field, idx) => (
                    <div key={field.fieldName} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium truncate">{field.fieldName}</span>
                        <Badge variant="destructive" className="shrink-0">{field.abandonmentRate}%</Badge>
                      </div>
                      <Progress value={field.abandonmentRate} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Error-Prone Fields */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Error-Prone Fields
            </CardTitle>
            <CardDescription>Fields with high validation errors</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {topErrorProne.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No error data</p>
              ) : (
                <div className="space-y-3">
                  {topErrorProne.map((field, idx) => (
                    <div key={field.fieldName} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium truncate">{field.fieldName}</span>
                        <Badge variant="outline" className="shrink-0 border-amber-500 text-amber-600">{field.errorRate}%</Badge>
                      </div>
                      <Progress value={field.errorRate} className="h-2 [&>div]:bg-amber-500" />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Slowest Fields */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              Slowest Fields
            </CardTitle>
            <CardDescription>Fields taking longest to complete</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {slowestFields.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No timing data</p>
              ) : (
                <div className="space-y-3">
                  {slowestFields.map((field, idx) => (
                    <div key={field.fieldName} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span className="text-sm font-medium truncate">{field.fieldName}</span>
                      <Badge variant="secondary" className="shrink-0">{formatTime(field.avgTimeMs)}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* All Fields Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Form Fields</CardTitle>
          <CardDescription>Comprehensive field-level metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field Name</TableHead>
                  <TableHead className="text-right">Interactions</TableHead>
                  <TableHead className="text-right">Avg Time</TableHead>
                  <TableHead className="text-right">Errors</TableHead>
                  <TableHead className="text-right">Error Rate</TableHead>
                  <TableHead className="text-right">Abandonments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldMetrics.slice(0, 20).map((field) => (
                  <TableRow key={field.fieldName}>
                    <TableCell className="font-medium">{field.fieldName}</TableCell>
                    <TableCell className="text-right">{field.interactions}</TableCell>
                    <TableCell className="text-right">{formatTime(field.avgTimeMs)}</TableCell>
                    <TableCell className="text-right">{field.errors}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={field.errorRate > 20 ? "destructive" : "secondary"}>
                        {field.errorRate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{field.abandonments}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
