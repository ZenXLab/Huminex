import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MousePointer, Eye, Link, BarChart3, Clock, Users } from "lucide-react";
import { format } from "date-fns";

export const AdminClickstream = () => {
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("24h");

  const { data: events, isLoading } = useQuery({
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clickstream Analytics</h1>
          <p className="text-muted-foreground">Track user interactions and behavior</p>
        </div>
        <div className="flex gap-2">
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clicks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pageViews}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Top Pages
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
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>Latest user interactions</CardDescription>
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
