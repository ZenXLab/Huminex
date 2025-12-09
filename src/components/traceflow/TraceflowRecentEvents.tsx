import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, 
  MousePointer, 
  AlertTriangle, 
  Eye,
  ArrowDown,
  FormInput,
  XCircle,
  RefreshCw,
  Search,
  Radio
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface RecentEvent {
  id: string;
  session_id: string;
  event_type: string;
  page_url: string | null;
  element_selector: string | null;
  element_text: string | null;
  timestamp: string;
  metadata: any;
}

const eventIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  click: MousePointer,
  rage_click: AlertTriangle,
  dead_click: XCircle,
  page_view: Eye,
  scroll: ArrowDown,
  form_submit: FormInput,
  error: XCircle,
};

const eventColors: Record<string, string> = {
  click: "bg-primary/10 text-primary",
  rage_click: "bg-destructive/10 text-destructive",
  dead_click: "bg-amber-500/10 text-amber-600",
  page_view: "bg-blue-500/10 text-blue-600",
  scroll: "bg-purple-500/10 text-purple-600",
  form_submit: "bg-emerald-500/10 text-emerald-600",
  error: "bg-red-500/10 text-red-600",
};

export const TraceflowRecentEvents = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isLive, setIsLive] = useState(true);
  const queryClient = useQueryClient();

  // Get recent events
  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["traceflow-recent-events", filter],
    queryFn: async () => {
      let query = supabase
        .from("traceflow_events")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(100);

      if (filter !== "all") {
        query = query.eq("event_type", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as RecentEvent[];
    },
    staleTime: 5000,
    refetchInterval: isLive ? 5000 : false,
  });

  // Real-time subscription for live events
  useEffect(() => {
    if (!isLive) return;

    const channel = supabase
      .channel("recent-events-realtime")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "traceflow_events",
      }, (payload) => {
        // Optimistically add new event to the list
        queryClient.setQueryData(
          ["traceflow-recent-events", filter],
          (old: RecentEvent[] | undefined) => {
            if (!old) return [payload.new as RecentEvent];
            if (filter !== "all" && (payload.new as RecentEvent).event_type !== filter) {
              return old;
            }
            return [payload.new as RecentEvent, ...old].slice(0, 100);
          }
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLive, filter, queryClient]);

  // Filter by search
  const filteredEvents = events?.filter(event => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      event.event_type.toLowerCase().includes(searchLower) ||
      event.page_url?.toLowerCase().includes(searchLower) ||
      event.element_text?.toLowerCase().includes(searchLower) ||
      event.element_selector?.toLowerCase().includes(searchLower)
    );
  });

  const eventCounts = {
    total: events?.length || 0,
    clicks: events?.filter(e => e.event_type === "click").length || 0,
    rageClicks: events?.filter(e => e.event_type === "rage_click").length || 0,
    pageViews: events?.filter(e => e.event_type === "page_view").length || 0,
    errors: events?.filter(e => e.event_type === "error").length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Recent Events
            {isLive && (
              <Badge className="bg-emerald-500/10 text-emerald-600 animate-pulse">
                <Radio className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">Real-time feed of all captured user events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={isLive ? "default" : "outline"} 
            size="sm" 
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? "Pause" : "Resume"} Live
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{eventCounts.total}</p>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{eventCounts.clicks}</p>
            <p className="text-xs text-muted-foreground">Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-destructive">{eventCounts.rageClicks}</p>
            <p className="text-xs text-muted-foreground">Rage Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-500">{eventCounts.pageViews}</p>
            <p className="text-xs text-muted-foreground">Page Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-500">{eventCounts.errors}</p>
            <p className="text-xs text-muted-foreground">Errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="click">Clicks</SelectItem>
            <SelectItem value="rage_click">Rage Clicks</SelectItem>
            <SelectItem value="dead_click">Dead Clicks</SelectItem>
            <SelectItem value="page_view">Page Views</SelectItem>
            <SelectItem value="scroll">Scroll</SelectItem>
            <SelectItem value="error">Errors</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Feed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Event Stream</CardTitle>
          <CardDescription>Latest {filteredEvents?.length || 0} events</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : filteredEvents && filteredEvents.length > 0 ? (
              <div className="space-y-2">
                {filteredEvents.map((event) => {
                  const Icon = eventIcons[event.event_type] || Activity;
                  const colorClass = eventColors[event.event_type] || "bg-muted text-muted-foreground";

                  return (
                    <div 
                      key={event.id} 
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {event.event_type.replace("_", " ")}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm truncate">
                          {event.page_url?.replace(/^https?:\/\/[^/]+/, "") || "Unknown page"}
                        </p>
                        {event.element_text && (
                          <p className="text-xs text-muted-foreground truncate">
                            Element: "{event.element_text}"
                          </p>
                        )}
                        {event.element_selector && (
                          <p className="text-xs font-mono text-muted-foreground truncate">
                            {event.element_selector}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {event.session_id.slice(0, 8)}...
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No events captured yet</p>
                <p className="text-sm">Events will appear here in real-time</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
