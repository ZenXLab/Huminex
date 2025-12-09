import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  MousePointer, 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface ClickData {
  element_selector: string;
  element_text: string;
  page_url: string;
  click_count: number;
  rage_clicks: number;
  dead_clicks: number;
  avg_time_to_click_ms: number;
}

export const TraceflowClickAnalysis = () => {
  const [timeRange, setTimeRange] = useState("24h");
  const [pageFilter, setPageFilter] = useState("all");

  // Get unique pages for filtering
  const { data: pages } = useQuery({
    queryKey: ["traceflow-click-pages"],
    queryFn: async () => {
      const { data } = await supabase
        .from("traceflow_events")
        .select("page_url")
        .in("event_type", ["click", "rage_click", "dead_click"])
        .not("page_url", "is", null);
      
      const uniquePages = [...new Set((data || []).map(e => e.page_url))];
      return uniquePages.filter(Boolean) as string[];
    },
    staleTime: 60000,
  });

  // Get click analysis data
  const { data: clickData, isLoading, refetch } = useQuery({
    queryKey: ["traceflow-click-analysis", timeRange, pageFilter],
    queryFn: async () => {
      const timeMs = timeRange === "1h" ? 3600000 : timeRange === "24h" ? 86400000 : timeRange === "7d" ? 604800000 : 2592000000;
      const fromDate = new Date(Date.now() - timeMs).toISOString();

      let query = supabase
        .from("traceflow_events")
        .select("element_selector, element_text, page_url, event_type, timestamp")
        .in("event_type", ["click", "rage_click", "dead_click"])
        .gte("timestamp", fromDate)
        .not("element_selector", "is", null);

      if (pageFilter !== "all") {
        query = query.eq("page_url", pageFilter);
      }

      const { data, error } = await query.limit(5000);
      if (error) throw error;

      // Aggregate by element
      const elementMap = new Map<string, ClickData>();
      
      (data || []).forEach(event => {
        const key = `${event.element_selector}|${event.page_url}`;
        const existing = elementMap.get(key) || {
          element_selector: event.element_selector || "",
          element_text: event.element_text || "",
          page_url: event.page_url || "",
          click_count: 0,
          rage_clicks: 0,
          dead_clicks: 0,
          avg_time_to_click_ms: 0,
        };

        existing.click_count++;
        if (event.event_type === "rage_click") existing.rage_clicks++;
        if (event.event_type === "dead_click") existing.dead_clicks++;
        if (event.element_text && !existing.element_text) existing.element_text = event.element_text;

        elementMap.set(key, existing);
      });

      return Array.from(elementMap.values())
        .sort((a, b) => b.click_count - a.click_count)
        .slice(0, 50);
    },
    staleTime: 30000,
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("click-analysis-realtime")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "traceflow_events",
      }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const totalClicks = clickData?.reduce((sum, c) => sum + c.click_count, 0) || 0;
  const totalRageClicks = clickData?.reduce((sum, c) => sum + c.rage_clicks, 0) || 0;
  const totalDeadClicks = clickData?.reduce((sum, c) => sum + c.dead_clicks, 0) || 0;
  const problematicElements = clickData?.filter(c => c.rage_clicks > 0 || c.dead_clicks > 0).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MousePointer className="h-6 w-6 text-primary" />
            Click Analysis
          </h2>
          <p className="text-muted-foreground">Detailed breakdown of user clicks by element</p>
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
          <Select value={pageFilter} onValueChange={setPageFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Pages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              {pages?.map(page => (
                <SelectItem key={page} value={page}>{page.replace(/^https?:\/\/[^/]+/, "")}</SelectItem>
              ))}
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
            <Target className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-destructive" />
            <p className="text-3xl font-bold text-destructive">{totalRageClicks}</p>
            <p className="text-sm text-muted-foreground">Rage Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MousePointer className="h-5 w-5 mx-auto mb-2 text-amber-500" />
            <p className="text-3xl font-bold text-amber-500">{totalDeadClicks}</p>
            <p className="text-sm text-muted-foreground">Dead Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingDown className="h-5 w-5 mx-auto mb-2 text-orange-500" />
            <p className="text-3xl font-bold text-orange-500">{problematicElements}</p>
            <p className="text-sm text-muted-foreground">Problematic Elements</p>
          </CardContent>
        </Card>
      </div>

      {/* Click Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clicked Elements</CardTitle>
          <CardDescription>Elements ranked by click volume with frustration indicators</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Element</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Rage</TableHead>
                  <TableHead className="text-right">Dead</TableHead>
                  <TableHead>Health</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clickData?.map((row, idx) => {
                  const healthScore = row.click_count > 0 
                    ? 100 - ((row.rage_clicks + row.dead_clicks) / row.click_count) * 100 
                    : 100;
                  
                  return (
                    <TableRow key={idx}>
                      <TableCell>
                        <div>
                          <p className="font-mono text-xs truncate max-w-[200px]">{row.element_selector}</p>
                          {row.element_text && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">"{row.element_text}"</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs truncate max-w-[150px] block">
                          {row.page_url?.replace(/^https?:\/\/[^/]+/, "") || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">{row.click_count}</TableCell>
                      <TableCell className="text-right">
                        {row.rage_clicks > 0 && (
                          <Badge variant="destructive" className="text-xs">{row.rage_clicks}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.dead_clicks > 0 && (
                          <Badge className="bg-amber-500/10 text-amber-600 text-xs">{row.dead_clicks}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          healthScore >= 90 ? "bg-emerald-500/10 text-emerald-600" :
                          healthScore >= 70 ? "bg-amber-500/10 text-amber-600" :
                          "bg-destructive/10 text-destructive"
                        }>
                          {healthScore.toFixed(0)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {(!clickData || clickData.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No click data available for this time range
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
