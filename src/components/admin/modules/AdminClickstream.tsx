import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminCardSkeleton, AdminTableSkeleton } from "@/components/admin/AdminCardSkeleton";
import { VirtualTable } from "@/components/admin/VirtualTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MousePointer, Eye, BarChart3, Users, RefreshCw, Radio, Trash2, AlertTriangle, Download, ChevronDown, ChevronUp, Bell, AlertCircle, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ConversionFunnel } from "./clickstream/ConversionFunnel";
import { ClickHeatmap } from "./clickstream/ClickHeatmap";
import { UserJourney } from "./clickstream/UserJourney";
import { DateRangePicker } from "./clickstream/DateRangePicker";
import { DeviceAnalytics } from "./clickstream/DeviceAnalytics";
import { RRWebPlayer } from "./clickstream/RRWebPlayer";
import { ClickstreamLayout } from "./clickstream/ClickstreamLayout";
import { PrivacyControls, defaultPrivacySettings, PrivacySettings } from "./clickstream/PrivacyControls";
import { GeoAnalytics } from "./clickstream/GeoAnalytics";
import { ExportModal } from "./clickstream/ExportModal";
import { FormFieldAnalytics } from "./clickstream/FormFieldAnalytics";
import { AIStruggleDetection } from "./clickstream/AIStruggleDetection";
import { ClickstreamComparisonTable } from "./clickstream/ClickstreamComparisonTable";

export const AdminClickstream = () => {
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveEventsCount, setLiveEventsCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [eventsExpanded, setEventsExpanded] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(defaultPrivacySettings);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["clickstream-events", eventFilter, timeRange, customDateRange?.from?.toISOString(), customDateRange?.to?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from("clickstream_events")
        .select("id, session_id, event_type, page_url, element_id, element_text, created_at, metadata")
        .order("created_at", { ascending: false })
        .limit(200); // Reduced limit for faster initial load

      if (eventFilter !== "all") {
        query = query.eq("event_type", eventFilter);
      }

      if (timeRange === "custom" && customDateRange) {
        query = query
          .gte("created_at", customDateRange.from.toISOString())
          .lte("created_at", customDateRange.to.toISOString());
      } else {
        const timeFilters: Record<string, number> = {
          "1h": 1,
          "24h": 24,
          "7d": 168,
          "30d": 720,
          "90d": 2160,
        };

        if (timeFilters[timeRange]) {
          const since = new Date();
          since.setHours(since.getHours() - timeFilters[timeRange]);
          query = query.gte("created_at", since.toISOString());
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setLastUpdate(new Date());
      return data || [];
    },
    refetchInterval: 30000, // Increased from 5s to 30s to reduce load
    staleTime: 10000, // Cache for 10 seconds
  });

  const { data: experiments } = useQuery({
    queryKey: ["ab-experiments-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ab_experiments")
        .select("id, name, status")
        .eq("status", "running")
        .limit(10);
      if (error) throw error;
      return data;
    },
    staleTime: 60000, // Cache for 1 minute
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('clickstream-realtime-v4')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'clickstream_events'
      }, (payload) => {
        setLiveEventsCount(prev => prev + 1);
        setLastUpdate(new Date());
        queryClient.invalidateQueries({ queryKey: ["clickstream-events"] });
        
        if (notificationsEnabled) {
          const newEvent = payload.new as any;
          const eventInfo = newEvent.event_type === 'pageview' 
            ? `Page: ${newEvent.page_url || 'Unknown'}`
            : newEvent.event_type === 'click'
              ? `Clicked: ${newEvent.element_text?.slice(0, 30) || 'Element'}`
              : `Action: ${newEvent.event_type}`;
          
          toast.info(`New ${newEvent.event_type} event`, {
            description: eventInfo,
            duration: 3000,
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient, notificationsEnabled]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLiveEventsCount(0);
    try {
      await refetch();
      toast.success("Data refreshed");
    } catch {
      toast.error("Failed to refresh");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("clickstream_events")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
      await refetch();
      setLiveEventsCount(0);
      setShowDeleteDialog(false);
      toast.success("All clickstream data deleted successfully");
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const stats = useMemo(() => ({
    totalEvents: events?.length || 0,
    uniqueSessions: new Set(events?.map(e => e.session_id)).size,
    clicks: events?.filter(e => e.event_type === "click").length || 0,
    pageViews: events?.filter(e => e.event_type === "pageview").length || 0,
  }), [events]);

  const sortedPages = useMemo(() => {
    const topPages = events?.reduce((acc, event) => {
      if (event.page_url) acc[event.page_url] = (acc[event.page_url] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    return Object.entries(topPages).sort(([, a], [, b]) => b - a).slice(0, 5);
  }, [events]);

  const virtualTableColumns = useMemo(() => [
    { 
      key: "event_type", 
      header: "Type", 
      width: 100,
      render: (item: any) => (
        <Badge className={`${getEventBadge(item.event_type)} text-xs`}>{item.event_type}</Badge>
      )
    },
    { key: "element_text", header: "Element", render: (item: any) => item.element_text || "-" },
    { key: "page_url", header: "Page", render: (item: any) => item.page_url?.slice(0, 40) || "-" },
    { 
      key: "session_id", 
      header: "Session", 
      width: 100,
      render: (item: any) => <span className="font-mono text-xs">{item.session_id?.slice(0, 8)}...</span>
    },
    { 
      key: "created_at", 
      header: "Time", 
      width: 120,
      render: (item: any) => format(new Date(item.created_at), "MMM d, HH:mm")
    },
  ], []);

  const getEventBadge = (type: string) => {
    const colors: Record<string, string> = {
      click: "bg-primary/20 text-primary",
      pageview: "bg-secondary/20 text-secondary-foreground",
      scroll: "bg-accent/20 text-accent-foreground",
    };
    return colors[type] || colors.click;
  };

  // Render content based on active section
  const renderContent = () => {
    // Show skeleton while loading
    if (isLoading) {
      return (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <AdminCardSkeleton key={i} variant="stat" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <AdminCardSkeleton variant="list" />
            <AdminCardSkeleton variant="list" />
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Grid - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="overflow-hidden">
                <CardContent className="p-4 sm:pt-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-primary/10 shrink-0">
                      <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg sm:text-2xl font-bold truncate">{stats.totalEvents.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Total Events</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardContent className="p-4 sm:pt-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-purple-500/10 shrink-0">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg sm:text-2xl font-bold truncate">{stats.uniqueSessions.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardContent className="p-4 sm:pt-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-red-500/10 shrink-0">
                      <MousePointer className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg sm:text-2xl font-bold truncate">{stats.clicks.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Clicks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardContent className="p-4 sm:pt-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-blue-500/10 shrink-0">
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg sm:text-2xl font-bold truncate">{stats.pageViews.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Page Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Pages & Recent Events - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base">Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  {sortedPages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-6 sm:py-8 text-sm">No page data available</p>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {sortedPages.map(([page, count], idx) => (
                        <div key={page} className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm truncate flex-1 min-w-0">{page}</span>
                          <Badge variant="secondary" className="shrink-0">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base flex items-center justify-between">
                    Recent Events
                    <Button variant="ghost" size="sm" onClick={() => setEventsExpanded(!eventsExpanded)} className="h-8 w-8 p-0">
                      {eventsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {events?.slice(0, eventsExpanded ? 20 : 5).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-2 rounded bg-muted/30 gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Badge className={`${getEventBadge(event.event_type)} shrink-0 text-xs`}>{event.event_type}</Badge>
                          <span className="text-xs text-muted-foreground truncate">
                            {event.element_text || event.page_url}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {format(new Date(event.created_at), "HH:mm:ss")}
                        </span>
                      </div>
                    ))}
                    {(!events || events.length === 0) && (
                      <p className="text-muted-foreground text-center py-6 text-sm">No events recorded yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "funnel":
        return <ConversionFunnel events={events || []} />;

      case "journeys":
        return <UserJourney events={events || []} />;

      case "clicks":
        return (
          <Card>
            <CardHeader><CardTitle className="text-sm sm:text-base">Click Analysis</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Element</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">Page</TableHead>
                    <TableHead className="text-xs">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events?.filter(e => e.event_type === "click").slice(0, 20).map(event => (
                    <TableRow key={event.id}>
                      <TableCell className="max-w-[120px] sm:max-w-[200px] truncate text-xs sm:text-sm">{event.element_text || event.element_id || "Unknown"}</TableCell>
                      <TableCell className="max-w-[150px] truncate text-xs sm:text-sm hidden sm:table-cell">{event.page_url}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{format(new Date(event.created_at), "MMM d, HH:mm")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case "click-heatmap":
      case "scroll-heatmap":
        return <ClickHeatmap events={events || []} />;

      case "session-replay":
        return <RRWebPlayer />;

      case "device-analytics":
        return <DeviceAnalytics events={events || []} />;

      case "geo-analytics":
        return <GeoAnalytics events={events || []} />;

      case "events":
        return (
          <Card>
            <CardHeader><CardTitle className="text-sm sm:text-base">All Events ({events?.length || 0})</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? (
                <AdminTableSkeleton rows={10} />
              ) : (
                <VirtualTable
                  data={events || []}
                  columns={virtualTableColumns}
                  rowHeight={48}
                  getRowKey={(item) => item.id}
                  emptyMessage="No events recorded yet"
                  className="max-h-[500px]"
                />
              )}
            </CardContent>
          </Card>
        );

      case "privacy":
        return (
          <PrivacyControls
            settings={privacySettings}
            onSettingsChange={setPrivacySettings}
            onSave={() => {
              localStorage.setItem("rrweb_privacy_settings", JSON.stringify(privacySettings));
            }}
          />
        );

      case "form-analytics":
        return <FormFieldAnalytics events={events || []} />;

      case "ai-struggle":
        return <AIStruggleDetection events={events || []} />;

      case "comparison":
        return <ClickstreamComparisonTable />;

      default:
        return <div className="text-center py-12 text-muted-foreground">Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Clickstream Analytics</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Track user interactions and behavior</p>
          </div>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />Live
            </Badge>
          </motion.div>
          {liveEventsCount > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">+{liveEventsCount} new</Badge>
          )}
        </div>
        
        {/* Action Buttons - Responsive */}
        <div className="flex flex-wrap gap-2">
          {/* Delete All Button with Enhanced Dialog */}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-1 text-xs sm:text-sm"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Delete All</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <ShieldAlert className="h-5 w-5" />
                  Danger: Delete All Data
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4">
                    <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p className="font-medium text-destructive">This action cannot be undone!</p>
                          <p className="text-sm text-muted-foreground">
                            You are about to permanently delete all clickstream analytics data.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Data to be deleted:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <strong>{stats.totalEvents.toLocaleString()}</strong> clickstream events
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <strong>{stats.uniqueSessions.toLocaleString()}</strong> unique sessions
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <strong>{stats.clicks.toLocaleString()}</strong> click events
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <strong>{stats.pageViews.toLocaleString()}</strong> page view events
                        </li>
                      </ul>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2 sm:gap-0">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAllData} 
                  disabled={isDeleting} 
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>Deleting...</>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Data
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Export Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowExportModal(true)}
            className="gap-1 text-xs sm:text-sm"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          {/* Notifications Toggle */}
          <Button 
            variant={notificationsEnabled ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className="gap-1 text-xs sm:text-sm"
          >
            <Bell className={`h-3 w-3 sm:h-4 sm:w-4 ${notificationsEnabled ? "text-primary" : ""}`} />
            <span className="hidden sm:inline">{notificationsEnabled ? "On" : "Off"}</span>
          </Button>

          {/* Refresh Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="gap-1 text-xs sm:text-sm"
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {/* Date Range Picker */}
          <DateRangePicker 
            value={timeRange} 
            onChange={(value, range) => { setTimeRange(value); setCustomDateRange(range || null); }}
            customRange={customDateRange}
          />

          {/* Event Filter */}
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-24 sm:w-32 text-xs sm:text-sm h-8 sm:h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="click">Clicks</SelectItem>
              <SelectItem value="pageview">Page Views</SelectItem>
              <SelectItem value="scroll">Scrolls</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tree Navigation Layout */}
      <ClickstreamLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 sm:h-32 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : (
          renderContent()
        )}
      </ClickstreamLayout>

      {/* Export Modal */}
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        events={events || []}
        stats={stats}
      />
    </div>
  );
};