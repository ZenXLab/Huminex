import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Video, 
  Radio,
  MousePointer,
  Eye,
  Maximize2,
  Volume2,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface LiveSessionRecordingProps {
  events: Array<{
    id: string;
    session_id: string;
    event_type: string;
    page_url: string | null;
    element_text: string | null;
    element_id: string | null;
    metadata: any;
    created_at: string;
  }>;
}

interface SessionData {
  sessionId: string;
  events: LiveSessionRecordingProps['events'];
  startTime: Date;
  endTime: Date;
  duration: number;
  pageCount: number;
}

export const LiveSessionRecording = ({ events }: LiveSessionRecordingProps) => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Group events by session
  const sessionMap = events.reduce((acc, event) => {
    if (!acc[event.session_id]) {
      acc[event.session_id] = [];
    }
    acc[event.session_id].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  // Create session data objects
  const sessions: SessionData[] = Object.entries(sessionMap)
    .map(([sessionId, sessionEvents]) => {
      const sortedEvents = [...sessionEvents].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      const startTime = new Date(sortedEvents[0].created_at);
      const endTime = new Date(sortedEvents[sortedEvents.length - 1].created_at);
      const duration = endTime.getTime() - startTime.getTime();
      const uniquePages = new Set(sortedEvents.map(e => e.page_url)).size;

      return {
        sessionId,
        events: sortedEvents,
        startTime,
        endTime,
        duration,
        pageCount: uniquePages,
      };
    })
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
    .slice(0, 20);

  const currentSession = sessions.find(s => s.sessionId === selectedSession);
  const currentEvent = currentSession?.events[currentEventIndex];

  // Playback control
  useEffect(() => {
    if (isPlaying && currentSession) {
      const baseInterval = 1000 / playbackSpeed;
      
      intervalRef.current = setInterval(() => {
        setCurrentEventIndex(prev => {
          if (prev >= currentSession.events.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, baseInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentSession, playbackSpeed]);

  // Update progress
  useEffect(() => {
    if (currentSession) {
      setProgress((currentEventIndex / Math.max(currentSession.events.length - 1, 1)) * 100);
    }
  }, [currentEventIndex, currentSession]);

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
    setCurrentEventIndex(0);
    setIsPlaying(false);
    setProgress(0);
  };

  const togglePlayback = () => setIsPlaying(!isPlaying);

  const skipToStart = () => {
    setCurrentEventIndex(0);
    setProgress(0);
  };

  const skipToEnd = () => {
    if (currentSession) {
      setCurrentEventIndex(currentSession.events.length - 1);
      setProgress(100);
      setIsPlaying(false);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (currentSession) {
      const newIndex = Math.floor((value[0] / 100) * (currentSession.events.length - 1));
      setCurrentEventIndex(newIndex);
      setProgress(value[0]);
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "click": return MousePointer;
      case "pageview": return Eye;
      default: return Eye;
    }
  };

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Session Recording
          </CardTitle>
          <CardDescription>Watch user sessions in video-like playback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 text-muted-foreground">
            <Video className="h-20 w-20 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No sessions available</p>
            <p className="text-sm">Sessions will appear as users interact with the site</p>
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
            Session Recording & Playback
          </h2>
          <p className="text-muted-foreground">
            Watch user sessions like a video with interactive timeline
          </p>
        </div>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
          Pro Feature
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Session List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Available Sessions</CardTitle>
            <CardDescription>{sessions.length} sessions recorded</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {sessions.map((session, idx) => (
                <motion.button
                  key={session.sessionId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => handleSessionSelect(session.sessionId)}
                  className={`w-full p-3 border-b text-left transition-colors hover:bg-muted/50 ${
                    selectedSession === session.sessionId ? "bg-primary/10 border-l-2 border-l-primary" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-muted-foreground">
                      {session.sessionId.slice(0, 12)}...
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {session.events.length} events
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{format(session.startTime, "MMM d, HH:mm")}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {formatDuration(session.duration)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {session.pageCount} pages visited
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Video Player */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                Session Playback
                {isPlaying && (
                  <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
                    <Radio className="h-2 w-2 mr-1 animate-pulse" />
                    Playing
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select 
                  value={playbackSpeed.toString()} 
                  onValueChange={(v) => setPlaybackSpeed(Number(v))}
                >
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
            {!selectedSession ? (
              <div className="h-[400px] flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>Select a session to start playback</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Video Display Area */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden">
                  {/* Browser Chrome Simulation */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-slate-700/50 flex items-center px-3 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-slate-600/50 rounded px-3 py-1 text-xs text-slate-300 truncate">
                        {currentEvent?.page_url || "/"}
                      </div>
                    </div>
                  </div>

                  {/* Page Content Simulation */}
                  <div className="absolute inset-0 mt-8 p-4">
                    <AnimatePresence mode="wait">
                      {currentEvent && (
                        <motion.div
                          key={currentEvent.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full flex flex-col items-center justify-center"
                        >
                          {/* Event Visualization */}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="relative"
                          >
                            {currentEvent.event_type === "click" && (
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.5, 1],
                                  opacity: [1, 0.5, 1] 
                                }}
                                transition={{ duration: 0.5 }}
                                className="w-16 h-16 rounded-full bg-red-500/30 border-2 border-red-500 flex items-center justify-center"
                              >
                                <MousePointer className="h-6 w-6 text-red-500" />
                              </motion.div>
                            )}
                            {currentEvent.event_type === "pageview" && (
                              <motion.div
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                className="w-16 h-16 rounded-full bg-blue-500/30 border-2 border-blue-500 flex items-center justify-center"
                              >
                                <Eye className="h-6 w-6 text-blue-500" />
                              </motion.div>
                            )}
                            {currentEvent.event_type === "scroll" && (
                              <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 0.5 }}
                                className="w-16 h-16 rounded-full bg-green-500/30 border-2 border-green-500 flex items-center justify-center"
                              >
                                <span className="text-green-500 font-bold">
                                  {(currentEvent.metadata as any)?.depth || 0}%
                                </span>
                              </motion.div>
                            )}
                          </motion.div>

                          {/* Event Info */}
                          <div className="mt-6 text-center">
                            <Badge 
                              className={
                                currentEvent.event_type === "click" ? "bg-red-500" :
                                currentEvent.event_type === "pageview" ? "bg-blue-500" :
                                "bg-green-500"
                              }
                            >
                              {currentEvent.event_type.toUpperCase()}
                            </Badge>
                            <p className="text-white mt-2 text-sm">
                              {currentEvent.element_text || currentEvent.page_url}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">
                              {format(new Date(currentEvent.created_at), "HH:mm:ss.SSS")}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Fullscreen Button */}
                  <button className="absolute top-10 right-2 p-1.5 rounded bg-slate-700/50 hover:bg-slate-600/50 transition-colors">
                    <Maximize2 className="h-4 w-4 text-slate-300" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[progress]}
                    onValueChange={handleProgressChange}
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Event {currentEventIndex + 1} of {currentSession?.events.length}</span>
                    <span>
                      {currentEvent && format(new Date(currentEvent.created_at), "HH:mm:ss")}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="icon" onClick={skipToStart}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    onClick={togglePlayback}
                    className="h-12 w-12"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={skipToEnd}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Event Timeline */}
                <div className="flex gap-1 overflow-x-auto py-2">
                  {currentSession?.events.slice(0, 50).map((event, idx) => {
                    const EventIcon = getEventIcon(event.event_type);
                    return (
                      <button
                        key={event.id}
                        onClick={() => {
                          setCurrentEventIndex(idx);
                          setProgress((idx / Math.max(currentSession.events.length - 1, 1)) * 100);
                        }}
                        className={`shrink-0 p-1.5 rounded transition-colors ${
                          idx === currentEventIndex 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        <EventIcon className="h-3 w-3" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
