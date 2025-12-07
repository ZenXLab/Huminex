import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MousePointer, Eye, Link, BarChart3, Clock, Users, RefreshCw, Radio, FlaskConical, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ConversionFunnel } from "./clickstream/ConversionFunnel";
import { ClickHeatmap } from "./clickstream/ClickHeatmap";

export const AdminClickstream = () => {
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveEventsCount, setLiveEventsCount] = useState(0);
  const queryClient = useQueryClient();

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["clickstream-events", eventFilter, timeRange],
    queryFn: async () => {
      let query = supabase
        .from("clickstream_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (eventFilter !== "all") {
        query = query.eq("event_type", eventFilter);
      }

      const timeFilters: Record<string, number> = {
        "1h": 1,
        "24h": 24,
        "7d": 168,
        "30d": 720,
      };

      if (timeFilters[timeRange]) {
        const since = new Date();
        since.setHours(since.getHours() - timeFilters[timeRange]);
        query = query.gte("created_at", since.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch A/B test experiments for conversion tracking
  const { data: experiments } = useQuery({
    queryKey: ["ab-experiments-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ab_experiments")
        .select(`
          *,
          ab_variants (*),
          ab_user_assignments (*)
        `)
        .eq("status", "running");
      
      if (error) throw error;
      return data;
    },
  });

  // Real-time subscription for clickstream events
  useEffect(() => {
    const channel = supabase
      .channel('clickstream-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'clickstream_events'
        },
        (payload) => {
          setLiveEventsCount(prev => prev + 1);
          // Invalidate query to refresh data
          queryClient.invalidateQueries({ queryKey: ["clickstream-events"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Real-time subscription for A/B test assignments
  useEffect(() => {
    const channel = supabase
      .channel('ab-assignments-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ab_user_assignments'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["ab-experiments-active"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLiveEventsCount(0);
    try {
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ["ab-experiments-active"] });
      toast.success("Data refreshed successfully");
    } catch {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const stats = {
    totalEvents: events?.length || 0,
    uniqueSessions: new Set(events?.map(e => e.session_id)).size,
    clicks: events?.filter(e => e.event_type === "click").length || 0,
    pageViews: events?.filter(e => e.event_type === "pageview").length || 0,
  };

  const topPages = events?.reduce((acc, event) => {
    if (event.page_url) {
      acc[event.page_url] = (acc[event.page_url] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const sortedPages = Object.entries(topPages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topElements = events?.reduce((acc, event) => {
    if (event.element_text && event.event_type === "click") {
      acc[event.element_text] = (acc[event.element_text] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const sortedElements = Object.entries(topElements)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const getEventBadge = (type: string) => {
    const colors: Record<string, string> = {
      click: "bg-primary/20 text-primary",
      pageview: "bg-secondary/20 text-secondary-foreground",
      scroll: "bg-accent/20 text-accent-foreground",
      hover: "bg-muted text-muted-foreground",
    };
    return colors[type] || colors.click;
  };

  // Calculate A/B test stats from real data
  const abTestStats = experiments?.map(exp => {
    const variants = exp.ab_variants || [];
    const assignments = exp.ab_user_assignments || [];
    
    return {
      name: exp.name,
      status: exp.status,
      totalAssignments: assignments.length,
      conversions: assignments.filter((a: any) => a.converted).length,
      conversionRate: assignments.length > 0 
        ? ((assignments.filter((a: any) => a.converted).length / assignments.length) * 100).toFixed(1)
        : "0.0",
      variants: variants.map((v: any) => ({
        name: v.name,
        isControl: v.is_control,
        assignments: assignments.filter((a: any) => a.variant_id === v.id).length,
        conversions: assignments.filter((a: any) => a.variant_id === v.id && a.converted).length,
      })),
    };
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold">Clickstream Analytics</h1>
            <p className="text-muted-foreground">Track user interactions and behavior</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 animate-pulse">
              <Radio className="h-3 w-3 mr-1" />
              Live
            </Badge>
            {liveEventsCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                +{liveEventsCount} new
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="click">Clicks</SelectItem>
              <SelectItem value="pageview">Page Views</SelectItem>
              <SelectItem value="scroll">Scrolls</SelectItem>
              <SelectItem value="hover">Hovers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Badge variant="outline" className="text-[10px] px-1">
                <Radio className="h-2 w-2 mr-1" />
                Realtime
              </Badge>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueSessions}</div>
            <p className="text-xs text-muted-foreground mt-1">Active visitors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clicks}</div>
            <p className="text-xs text-muted-foreground mt-1">User interactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pageViews}</div>
            <p className="text-xs text-muted-foreground mt-1">Pages visited</p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel & Heatmap */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ConversionFunnel events={events || []} />
        <ClickHeatmap events={events || []} />
      </div>

      {/* A/B Testing Integration */}
      {abTestStats.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              Active A/B Experiments
              <Badge variant="outline" className="ml-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                <Radio className="h-3 w-3 mr-1" />
                Live Tracking
              </Badge>
            </CardTitle>
            <CardDescription>Real-time experiment performance from clickstream data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {abTestStats.map((exp, idx) => (
                <div key={idx} className="p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{exp.name}</span>
                      <Badge variant="outline" className="capitalize">{exp.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {exp.totalAssignments} participants
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                        {exp.conversionRate}% conversion
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {exp.variants.map((variant: any, vIdx: number) => (
                      <div 
                        key={vIdx} 
                        className={`p-3 rounded border ${variant.isControl ? "bg-muted/50" : "bg-primary/5"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {variant.name}
                            {variant.isControl && (
                              <Badge variant="secondary" className="ml-2 text-[10px]">Control</Badge>
                            )}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {variant.assignments} users / {variant.conversions} conversions
                          </span>
                        </div>
                        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500"
                            style={{ 
                              width: `${variant.assignments > 0 ? (variant.conversions / variant.assignments) * 100 : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Top Pages
              <Badge variant="outline" className="ml-auto text-[10px]">
                <Radio className="h-2 w-2 mr-1" />
                Live
              </Badge>
            </CardTitle>
            <CardDescription>Most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedPages.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No data yet</div>
            ) : (
              <div className="space-y-3">
                {sortedPages.map(([page, count], i) => (
                  <div key={page} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-4">{i + 1}.</span>
                      <span className="font-medium truncate max-w-64">{page}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Top Clicked Elements
              <Badge variant="outline" className="ml-auto text-[10px]">
                <Radio className="h-2 w-2 mr-1" />
                Live
              </Badge>
            </CardTitle>
            <CardDescription>Most clicked buttons and links</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedElements.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No data yet</div>
            ) : (
              <div className="space-y-3">
                {sortedElements.map(([element, count], i) => (
                  <div key={element} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-4">{i + 1}.</span>
                      <span className="font-medium truncate max-w-64">{element}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest user interactions</CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              Realtime Stream
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading events...</div>
          ) : events?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No events recorded yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Element</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events?.slice(0, 50).map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Badge className={getEventBadge(event.event_type)}>{event.event_type}</Badge>
                    </TableCell>
                    <TableCell className="max-w-48 truncate">{event.page_url || "-"}</TableCell>
                    <TableCell className="max-w-32 truncate">{event.element_text || "-"}</TableCell>
                    <TableCell className="font-mono text-xs">{event.session_id.slice(0, 8)}...</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(event.created_at), "HH:mm:ss")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
