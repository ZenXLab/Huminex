import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Video, 
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Filter,
  Maximize2,
  Zap,
  XCircle,
  FileX,
  AlertTriangle,
  Activity,
  Eye,
  Radio,
  Wifi,
  WifiOff,
  Sparkles,
  MousePointer,
  MapPin,
  User,
  Globe,
  Layers
} from "lucide-react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SessionRecording {
  id: string;
  session_id: string;
  visitor_id?: string;
  device_fingerprint?: string;
  ip_address?: string;
  geolocation?: {
    city?: string;
    country?: string;
    country_code?: string;
    latitude?: number;
    longitude?: number;
  };
  user_agent?: string;
  pages_visited?: string[];
  events: any[];
  start_time: string;
  end_time: string | null;
  duration_ms: number | null;
  page_count: number | null;
  event_count: number | null;
  metadata: any;
  created_at: string;
}

interface SessionHighlight {
  type: "rage_click" | "dead_click" | "form_abandonment" | "error";
  timestamp: number;
  description: string;
  severity: "low" | "medium" | "high";
  element?: string;
}

interface SessionFilters {
  pageUrl: string;
  minDuration: number | null;
  maxDuration: number | null;
  dateRange: { from: Date | null; to: Date | null };
  hasErrors: boolean;
}

const defaultFilters: SessionFilters = {
  pageUrl: "",
  minDuration: null,
  maxDuration: null,
  dateRange: { from: null, to: null },
  hasErrors: false,
};

export const TraceflowRRWebReplay = () => {
  const [selectedRecording, setSelectedRecording] = useState<SessionRecording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [filters, setFilters] = useState<SessionFilters>(defaultFilters);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showHighlights, setShowHighlights] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const playerRef = useRef<rrwebPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const liveEventsRef = useRef<any[]>([]);

  // Fetch recordings from database with real-time subscription
  const { data: recordings, isLoading, refetch } = useQuery({
    queryKey: ["traceflow-session-recordings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session_recordings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching recordings:", error);
        throw error;
      }
      
      return (data || []) as SessionRecording[];
    },
    refetchInterval: isLiveMode ? 5000 : false, // Auto-refresh in live mode
  });

  // Real-time subscription for new recordings
  useEffect(() => {
    if (!isLiveMode) return;

    const channel = supabase
      .channel('traceflow-recordings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_recordings'
        },
        (payload) => {
          console.log('[TRACEFLOW] Real-time recording update:', payload);
          refetch();
          if (payload.eventType === 'INSERT') {
            toast.success("New session recorded!", {
              description: `Session ${(payload.new as any).session_id?.slice(0, 8)}...`
            });
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        console.log('[TRACEFLOW] Real-time subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLiveMode, refetch]);

  // Filter recordings based on user selections
  const filteredRecordings = useMemo(() => {
    if (!recordings) return [];
    
    return recordings.filter((recording) => {
      // Page URL filter
      if (filters.pageUrl) {
        const pageMatches = recording.metadata?.url?.toLowerCase().includes(filters.pageUrl.toLowerCase());
        if (!pageMatches) return false;
      }
      
      // Duration filters (convert ms to seconds)
      const durationSec = (recording.duration_ms || 0) / 1000;
      if (filters.minDuration && durationSec < filters.minDuration) return false;
      if (filters.maxDuration && durationSec > filters.maxDuration) return false;
      
      // Date range filter
      if (filters.dateRange?.from) {
        const recordingDate = parseISO(recording.start_time);
        if (filters.dateRange.to) {
          if (!isWithinInterval(recordingDate, { start: filters.dateRange.from, end: filters.dateRange.to })) {
            return false;
          }
        } else {
          if (recordingDate < filters.dateRange.from) return false;
        }
      }
      
      return true;
    });
  }, [recordings, filters]);

  // Detect session highlights (rage clicks, dead clicks, form abandonment)
  const sessionHighlights = useMemo((): SessionHighlight[] => {
    if (!selectedRecording?.events?.length) return [];
    
    const events = selectedRecording.events;
    const highlights: SessionHighlight[] = [];
    
    // Detect rage clicks (multiple clicks in quick succession)
    let consecutiveClicks = 0;
    let lastClickTime = 0;
    
    for (const event of events) {
      if (event.type === 3 && event.data?.type === 2) { // Mouse click
        const timeDiff = event.timestamp - lastClickTime;
        if (timeDiff < 500) {
          consecutiveClicks++;
          if (consecutiveClicks >= 3) {
            highlights.push({
              type: "rage_click",
              timestamp: event.timestamp,
              description: `Rage click detected (${consecutiveClicks + 1} rapid clicks)`,
              severity: consecutiveClicks >= 5 ? "high" : "medium",
              element: event.data?.source?.selector,
            });
          }
        } else {
          consecutiveClicks = 0;
        }
        lastClickTime = event.timestamp;
      }
    }
    
    return highlights.sort((a, b) => a.timestamp - b.timestamp);
  }, [selectedRecording]);

  // Initialize player when recording is selected
  useEffect(() => {
    if (!selectedRecording || !containerRef.current) return;

    // Clean up existing player
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current = null;
      containerRef.current.innerHTML = "";
    }

    const events = selectedRecording.events;
    if (!events || events.length < 2) {
      console.warn("[TRACEFLOW] Not enough events to play:", events?.length);
      return;
    }

    try {
      // Calculate responsive dimensions based on device view
      const dimensions = {
        desktop: { width: 800, height: 450 },
        tablet: { width: 600, height: 450 },
        mobile: { width: 375, height: 667 },
      };

      const { width, height } = dimensions[deviceView];

      playerRef.current = new rrwebPlayer({
        target: containerRef.current,
        props: {
          events: events,
          width,
          height,
          autoPlay: false,
          showController: false,
          speedOption: [0.5, 1, 2, 4],
        },
      });

      // Listen to player events
      playerRef.current.addEventListener("ui-update-current-time", (e: any) => {
        const currentTime = e.payload;
        const totalTime = selectedRecording.duration_ms || 1;
        setProgress((currentTime / totalTime) * 100);
      });

      playerRef.current.addEventListener("finish", () => {
        setIsPlaying(false);
        setProgress(100);
      });

      console.log("[TRACEFLOW] rrweb player initialized with", events.length, "events");
    } catch (err) {
      console.error("[TRACEFLOW] Error initializing rrweb player:", err);
      toast.error("Failed to initialize session replay");
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.pause();
      }
    };
  }, [selectedRecording, deviceView]);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number[]) => {
    if (playerRef.current && selectedRecording?.duration_ms) {
      const time = (value[0] / 100) * selectedRecording.duration_ms;
      playerRef.current.goto(time);
      setProgress(value[0]);
    }
  };

  const handleSpeedChange = (speed: string) => {
    const speedNum = Number(speed);
    setPlaybackSpeed(speedNum);
    if (playerRef.current) {
      playerRef.current.setSpeed(speedNum);
    }
  };

  const handleSeekToHighlight = (highlight: SessionHighlight) => {
    if (playerRef.current && selectedRecording?.events?.length) {
      const startTime = selectedRecording.events[0]?.timestamp || 0;
      const relativeTime = highlight.timestamp - startTime;
      playerRef.current.goto(relativeTime);
      toast.info(`Jumped to ${highlight.type.replace('_', ' ')}`);
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return "0:00";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getHighlightIcon = (type: string) => {
    switch (type) {
      case "rage_click": return <Zap className="h-3 w-3 text-red-500" />;
      case "dead_click": return <XCircle className="h-3 w-3 text-amber-500" />;
      case "form_abandonment": return <FileX className="h-3 w-3 text-purple-500" />;
      case "error": return <AlertTriangle className="h-3 w-3 text-red-500" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-[#0B3D91]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Video className="h-6 w-6 text-[#0B3D91]" />
            Session Replay
          </h2>
          <p className="text-muted-foreground">
            Watch real user sessions with full DOM recording
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live Mode Toggle */}
          <div className="flex items-center gap-2 bg-background border rounded-lg px-3 py-2">
            <Radio className={cn("h-4 w-4", isLiveMode && isConnected ? "text-red-500 animate-pulse" : "text-muted-foreground")} />
            <Label htmlFor="live-mode" className="text-sm cursor-pointer">Live</Label>
            <Switch
              id="live-mode"
              checked={isLiveMode}
              onCheckedChange={setIsLiveMode}
            />
            {isLiveMode && (
              <Badge variant="outline" className={cn(
                "ml-2",
                isConnected ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
              )}>
                {isConnected ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            )}
          </div>
          
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Session List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Sessions
              <Badge variant="secondary" className="ml-auto">
                {filteredRecordings?.length || 0}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Select a session to replay
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {filteredRecordings?.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No recordings yet</p>
                  <p className="text-xs">Sessions will appear here as users browse</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredRecordings?.map((recording, idx) => (
                    <motion.button
                      key={recording.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => {
                        setSelectedRecording(recording);
                        setIsPlaying(false);
                        setProgress(0);
                      }}
                      className={cn(
                        "w-full p-3 border-b text-left transition-all hover:bg-muted/50",
                        selectedRecording?.id === recording.id && "bg-[#0B3D91]/5 border-l-2 border-l-[#0B3D91]"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          {recording.visitor_id && (
                            <User className="h-3 w-3 text-[#0B3D91]" />
                          )}
                          <span className="font-mono text-xs text-muted-foreground">
                            #{recording.session_id.slice(0, 8)}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {recording.event_count || 0} events
                        </Badge>
                      </div>
                      
                      {/* Visitor & Location Info */}
                      {(recording.geolocation?.city || recording.geolocation?.country) && (
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin className="h-3 w-3 text-emerald-500" />
                          <span className="text-[10px] text-emerald-600 font-medium">
                            {[recording.geolocation.city, recording.geolocation.country_code].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">
                          {format(new Date(recording.start_time), "MMM d, HH:mm")}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(recording.duration_ms)}
                        </span>
                      </div>
                      
                      {/* Pages visited */}
                      {recording.pages_visited && recording.pages_visited.length > 0 ? (
                        <div className="flex items-center gap-1 mt-1">
                          <Layers className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground truncate">
                            {recording.pages_visited.length} page{recording.pages_visited.length > 1 ? 's' : ''}: {recording.pages_visited[recording.pages_visited.length - 1]}
                          </span>
                        </div>
                      ) : recording.metadata?.url && (
                        <div className="flex items-center gap-1 mt-1">
                          <MousePointer className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground truncate">
                            {recording.metadata.url}
                          </span>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Player */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-sm">Playback</CardTitle>
                {isPlaying && (
                  <Badge className="bg-red-500 text-white animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-white mr-1" />
                    Playing
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Device View Selector */}
                <div className="flex border rounded-lg overflow-hidden">
                  {[
                    { id: "desktop", icon: Monitor },
                    { id: "tablet", icon: Tablet },
                    { id: "mobile", icon: Smartphone },
                  ].map((device) => (
                    <Button
                      key={device.id}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 px-2 rounded-none",
                        deviceView === device.id && "bg-[#0B3D91] text-white"
                      )}
                      onClick={() => setDeviceView(device.id as any)}
                    >
                      <device.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
                
                <Select value={String(playbackSpeed)} onValueChange={handleSpeedChange}>
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                    <SelectItem value="4">4x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!selectedRecording ? (
              <div className="h-[450px] flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-50 rounded-lg border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">Select a session to watch</p>
                  <p className="text-xs">Choose from the list on the left</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Player Container with Device Frame */}
                <div className={cn(
                  "flex items-center justify-center bg-slate-100 rounded-lg p-4 min-h-[400px]",
                  deviceView === "mobile" && "bg-slate-900"
                )}>
                  <div className={cn(
                    "relative",
                    deviceView === "mobile" && "bg-black rounded-[2rem] p-2 shadow-2xl",
                    deviceView === "tablet" && "bg-slate-800 rounded-lg p-2 shadow-xl"
                  )}>
                    {/* Notch for mobile */}
                    {deviceView === "mobile" && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-10" />
                    )}
                    <div 
                      ref={containerRef} 
                      className={cn(
                        "bg-white overflow-hidden",
                        deviceView === "mobile" && "rounded-[1.5rem]",
                        deviceView === "tablet" && "rounded-md",
                        deviceView === "desktop" && "rounded-lg"
                      )}
                      style={{ 
                        maxWidth: "100%",
                        minHeight: deviceView === "mobile" ? "500px" : "350px" 
                      }}
                    />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[progress]}
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDuration((progress / 100) * (selectedRecording.duration_ms || 0))}</span>
                    <span>{formatDuration(selectedRecording.duration_ms)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleSeek([0])}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-12 w-12 bg-gradient-to-r from-[#0B3D91] to-[#00C2D8]"
                    onClick={isPlaying ? handlePause : handlePlay}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleSeek([100])}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Highlights Panel */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Session Insights
            </CardTitle>
            <CardDescription className="text-xs">
              Auto-detected issues & friction points
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedRecording ? (
              <div className="py-8 text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Select a session to view insights</p>
              </div>
            ) : sessionHighlights.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-30 text-emerald-500" />
                <p className="text-sm font-medium text-emerald-600">No issues detected!</p>
                <p className="text-xs">This session appears smooth</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {sessionHighlights.map((highlight, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSeekToHighlight(highlight)}
                      className={cn(
                        "w-full p-3 rounded-lg border text-left transition-all hover:bg-muted/50",
                        highlight.severity === "high" && "border-red-200 bg-red-50",
                        highlight.severity === "medium" && "border-amber-200 bg-amber-50"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {getHighlightIcon(highlight.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-[10px]",
                                highlight.severity === "high" && "bg-red-100 text-red-700",
                                highlight.severity === "medium" && "bg-amber-100 text-amber-700"
                              )}
                            >
                              {highlight.severity}
                            </Badge>
                          </div>
                          <p className="text-xs">{highlight.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Stats Summary */}
            {selectedRecording && (
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t">
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{selectedRecording.event_count || 0}</div>
                  <div className="text-[10px] text-muted-foreground">Total Events</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{selectedRecording.page_count || 1}</div>
                  <div className="text-[10px] text-muted-foreground">Pages Visited</div>
                </div>
                <div className="text-center p-2 bg-red-500/10 rounded-lg">
                  <div className="text-lg font-bold text-red-600">
                    {sessionHighlights.filter(h => h.type === "rage_click").length}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Rage Clicks</div>
                </div>
                <div className="text-center p-2 bg-amber-500/10 rounded-lg">
                  <div className="text-lg font-bold text-amber-600">
                    {sessionHighlights.filter(h => h.severity === "high").length}
                  </div>
                  <div className="text-[10px] text-muted-foreground">High Severity</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
