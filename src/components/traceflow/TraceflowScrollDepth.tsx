import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowDown, 
  BarChart3, 
  TrendingUp, 
  RefreshCw,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ScrollData {
  page_url: string;
  avg_scroll_depth: number;
  max_scroll_depth: number;
  session_count: number;
  reached_25: number;
  reached_50: number;
  reached_75: number;
  reached_100: number;
}

export const TraceflowScrollDepth = () => {
  const [timeRange, setTimeRange] = useState("24h");

  // Get scroll depth data
  const { data: scrollData, isLoading, refetch } = useQuery({
    queryKey: ["traceflow-scroll-depth", timeRange],
    queryFn: async () => {
      const timeMs = timeRange === "1h" ? 3600000 : timeRange === "24h" ? 86400000 : timeRange === "7d" ? 604800000 : 2592000000;
      const fromDate = new Date(Date.now() - timeMs).toISOString();

      const { data, error } = await supabase
        .from("traceflow_events")
        .select("page_url, metadata, session_id")
        .eq("event_type", "scroll")
        .gte("timestamp", fromDate)
        .not("page_url", "is", null);

      if (error) throw error;

      // Aggregate by page
      const pageMap = new Map<string, {
        depths: number[];
        sessions: Set<string>;
      }>();

      (data || []).forEach(event => {
        const meta = event.metadata as Record<string, any> | null;
        const depth = meta?.scroll_depth || meta?.depth || 0;
        const existing = pageMap.get(event.page_url!) || { depths: [], sessions: new Set() };
        existing.depths.push(depth);
        existing.sessions.add(event.session_id);
        pageMap.set(event.page_url!, existing);
      });

      const result: ScrollData[] = [];
      pageMap.forEach((value, page_url) => {
        const depths = value.depths;
        const avgDepth = depths.length > 0 ? depths.reduce((a, b) => a + b, 0) / depths.length : 0;
        const maxDepth = Math.max(...depths, 0);

        result.push({
          page_url,
          avg_scroll_depth: Math.round(avgDepth),
          max_scroll_depth: maxDepth,
          session_count: value.sessions.size,
          reached_25: depths.filter(d => d >= 25).length,
          reached_50: depths.filter(d => d >= 50).length,
          reached_75: depths.filter(d => d >= 75).length,
          reached_100: depths.filter(d => d >= 100).length,
        });
      });

      return result.sort((a, b) => b.session_count - a.session_count).slice(0, 20);
    },
    staleTime: 30000,
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("scroll-depth-realtime")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "traceflow_events",
        filter: "event_type=eq.scroll",
      }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const overallAvg = scrollData && scrollData.length > 0
    ? Math.round(scrollData.reduce((sum, d) => sum + d.avg_scroll_depth, 0) / scrollData.length)
    : 0;

  const totalSessions = scrollData?.reduce((sum, d) => sum + d.session_count, 0) || 0;

  // Chart data for scroll depth distribution
  const chartData = [
    { name: "0-25%", value: scrollData?.reduce((sum, d) => sum + d.reached_25, 0) || 0, color: "hsl(var(--chart-1))" },
    { name: "25-50%", value: scrollData?.reduce((sum, d) => sum + (d.reached_50 - d.reached_25), 0) || 0, color: "hsl(var(--chart-2))" },
    { name: "50-75%", value: scrollData?.reduce((sum, d) => sum + (d.reached_75 - d.reached_50), 0) || 0, color: "hsl(var(--chart-3))" },
    { name: "75-100%", value: scrollData?.reduce((sum, d) => sum + (d.reached_100 - d.reached_75), 0) || 0, color: "hsl(var(--chart-4))" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ArrowDown className="h-6 w-6 text-primary" />
            Scroll Depth Analytics
          </h2>
          <p className="text-muted-foreground">Track how far users scroll on each page</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <ArrowDown className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-3xl font-bold">{overallAvg}%</p>
            <p className="text-sm text-muted-foreground">Average Scroll Depth</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-5 w-5 mx-auto mb-2 text-blue-500" />
            <p className="text-3xl font-bold">{scrollData?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Pages Tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
            <p className="text-3xl font-bold">{totalSessions.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-purple-500" />
            <p className="text-3xl font-bold">
              {scrollData && scrollData.length > 0 
                ? Math.round(scrollData.filter(d => d.avg_scroll_depth >= 75).length / scrollData.length * 100)
                : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Pages with 75%+ Scroll</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Scroll Depth Distribution</CardTitle>
            <CardDescription>How far users scroll across all pages</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Page Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Page-by-Page Breakdown</CardTitle>
            <CardDescription>Scroll performance by page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : scrollData && scrollData.length > 0 ? (
              scrollData.slice(0, 8).map((page, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {page.page_url.replace(/^https?:\/\/[^/]+/, "") || "/"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{page.session_count} sessions</Badge>
                      <span className="text-sm font-bold">{page.avg_scroll_depth}%</span>
                    </div>
                  </div>
                  <Progress 
                    value={page.avg_scroll_depth} 
                    className="h-2"
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No scroll data available for this time range
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
