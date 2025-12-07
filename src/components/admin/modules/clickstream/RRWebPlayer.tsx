import { useEffect, useRef, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
  RefreshCw,
  Filter
} from "lucide-react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { motion } from "framer-motion";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
import { SessionFiltersPanel, SessionFilters, defaultFilters } from "./SessionFilters";
import { SessionHighlights } from "./SessionHighlights";

interface SessionRecording {
  id: string;
  session_id: string;
  events: any[];
  start_time: string;
  end_time: string | null;
  duration_ms: number | null;
  page_count: number | null;
  event_count: number | null;
  metadata: any;
  created_at: string;
}

export const RRWebPlayer = () => {
  const [selectedRecording, setSelectedRecording] = useState<SessionRecording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filters, setFilters] = useState<SessionFilters>(defaultFilters);
  const playerRef = useRef<rrwebPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch recordings from database
  const { data: recordings, isLoading, refetch } = useQuery({
    queryKey: ["session-recordings"],
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
  });

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
      
      // Highlight filters (rage clicks, dead clicks, form abandonment)
      // These would require analyzing the events - for now we show all if filters are on
      // In production, you'd pre-compute these and store as metadata
      
      return true;
    });
  }, [recordings, filters]);

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
      console.warn("Not enough events to play");
      return;
    }

    try {
      // Calculate responsive dimensions
      const containerWidth = containerRef.current.offsetWidth || 600;
      const aspectRatio = 16 / 9;
      const playerWidth = Math.min(containerWidth, 800);
      const playerHeight = Math.round(playerWidth / aspectRatio);

      playerRef.current = new rrwebPlayer({
        target: containerRef.current,
        props: {
          events: events,
          width: playerWidth,
          height: playerHeight,
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

      console.log("rrweb player initialized with", events.length, "events");
    } catch (err) {
      console.error("Error initializing rrweb player:", err);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.pause();
      }
    };
  }, [selectedRecording]);

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

  const handleSeekToTimestamp = (timestamp: number) => {
    if (playerRef.current && selectedRecording?.events?.length) {
      const startTime = selectedRecording.events[0]?.timestamp || 0;
      const relativeTime = timestamp - startTime;
      playerRef.current.goto(relativeTime);
    }
  };

  const handleSpeedChange = (speed: string) => {
    if (playerRef.current) {
      playerRef.current.setSpeed(Number(speed));
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return "0:00";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-16">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Video className="h-6 w-6" />
            Session Replay (rrweb)
          </h2>
          <p className="text-muted-foreground">
            Watch real user sessions with DOM recording
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
            Pro Feature
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <SessionFiltersPanel
        filters={filters}
        onFiltersChange={setFilters}
        onClear={() => setFilters(defaultFilters)}
      />

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Session List */}
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm md:text-base flex items-center gap-2 flex-wrap">
              Recorded Sessions
              {filters.pageUrl || filters.dateRange ? (
                <Badge variant="secondary" className="text-xs">
                  <Filter className="h-3 w-3 mr-1" />
                  Filtered
                </Badge>
              ) : null}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {filteredRecordings?.length || 0} of {recordings?.length || 0} sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto">
              {filteredRecordings?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No recordings match filters</p>
                  <p className="text-xs">Try adjusting your criteria</p>
                </div>
              ) : (
                filteredRecordings?.map((recording, idx) => (
                  <motion.button
                    key={recording.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => {
                      setSelectedRecording(recording);
                      setIsPlaying(false);
                      setProgress(0);
                    }}
                    className={`w-full p-3 border-b text-left transition-colors hover:bg-muted/50 ${
                      selectedRecording?.id === recording.id
                        ? "bg-primary/10 border-l-2 border-l-primary"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-muted-foreground">
                        {recording.session_id.slice(0, 12)}...
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {recording.event_count || 0} events
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {format(new Date(recording.start_time), "MMM d, HH:mm")}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {formatDuration(recording.duration_ms)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Monitor className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {recording.metadata?.screenWidth}x{recording.metadata?.screenHeight}
                      </span>
                      {recording.metadata?.url && (
                        <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                          {recording.metadata.url}
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Player */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <CardTitle className="text-sm md:text-base">
                Playback
                {isPlaying && (
                  <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 border-red-500/30">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1" />
                    Playing
                  </Badge>
                )}
              </CardTitle>
              <Select defaultValue="1" onValueChange={handleSpeedChange}>
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
          </CardHeader>
          <CardContent>
            {!selectedRecording ? (
              <div className="h-[250px] sm:h-[350px] md:h-[400px] flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed">
                <div className="text-center text-muted-foreground p-4">
                  <Video className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-sm md:text-base">Select a session to watch</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Player Container */}
                <div 
                  ref={containerRef} 
                  className="bg-slate-900 rounded-lg overflow-hidden w-full"
                  style={{ minHeight: "250px", maxWidth: "100%" }}
                />

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
                    <span>
                      {formatDuration((progress / 100) * (selectedRecording.duration_ms || 0))}
                    </span>
                    <span>{formatDuration(selectedRecording.duration_ms)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSeek([0])}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={isPlaying ? handlePause : handlePlay}
                    className="h-12 w-12"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSeek([100])}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Highlights Panel */}
        <div className="col-span-1">
          <SessionHighlights
            recording={selectedRecording}
            onSeekTo={handleSeekToTimestamp}
          />
        </div>
      </div>
    </div>
  );
};
