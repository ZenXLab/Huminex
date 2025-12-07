import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, SkipForward, SkipBack, Clock, MousePointer, Eye, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface SessionEvent {
  id: string;
  event_type: string;
  page_url: string | null;
  element_text: string | null;
  created_at: string;
  session_id: string;
}

interface SessionReplayProps {
  events: SessionEvent[];
}

export const SessionReplay = ({ events }: SessionReplayProps) => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Group events by session
  const sessions = useMemo(() => {
    const sessionMap: Record<string, SessionEvent[]> = {};
    events.forEach(event => {
      if (!sessionMap[event.session_id]) {
        sessionMap[event.session_id] = [];
      }
      sessionMap[event.session_id].push(event);
    });

    return Object.entries(sessionMap)
      .map(([sessionId, sessionEvents]) => ({
        id: sessionId,
        events: sessionEvents.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
        startTime: sessionEvents[0]?.created_at,
        duration: sessionEvents.length > 1 
          ? (new Date(sessionEvents[sessionEvents.length - 1].created_at).getTime() - 
             new Date(sessionEvents[0].created_at).getTime()) / 1000
          : 0,
        pageCount: new Set(sessionEvents.map(e => e.page_url)).size,
        clickCount: sessionEvents.filter(e => e.event_type === 'click').length,
      }))
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 20);
  }, [events]);

  const currentSession = sessions.find(s => s.id === selectedSession);
  const currentEvent = currentSession?.events[currentEventIndex];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !currentSession) return;

    const interval = setInterval(() => {
      setCurrentEventIndex(prev => {
        if (prev >= currentSession.events.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, currentSession, playbackSpeed]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'click': return <MousePointer className="h-3 w-3" />;
      case 'pageview': return <Eye className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'click': return "bg-blue-500";
      case 'pageview': return "bg-emerald-500";
      case 'scroll': return "bg-amber-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Session Replay
            </CardTitle>
            <CardDescription>Watch user journeys through the site</CardDescription>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
            <Radio className="h-3 w-3 mr-1 animate-pulse" />
            {sessions.length} Sessions
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Session List */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Recent Sessions</h4>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No sessions recorded yet
                  </div>
                ) : (
                  sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      onClick={() => {
                        setSelectedSession(session.id);
                        setCurrentEventIndex(0);
                        setIsPlaying(false);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedSession === session.id 
                          ? "border-primary bg-primary/5" 
                          : "border-muted hover:border-primary/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">
                          {session.id.slice(0, 20)}...
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          {session.events.length} events
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {session.pageCount} pages
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="h-3 w-3" />
                          {session.clickCount} clicks
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.round(session.duration)}s
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {format(new Date(session.startTime), "MMM d, HH:mm:ss")}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Replay Player */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Journey Replay</h4>
            
            {currentSession ? (
              <>
                {/* Timeline visualization */}
                <div className="relative h-16 bg-muted/50 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center px-2">
                    {currentSession.events.map((event, idx) => (
                      <motion.div
                        key={event.id}
                        className={`w-2 h-2 rounded-full mx-0.5 ${getEventColor(event.event_type)} ${
                          idx === currentEventIndex ? "ring-2 ring-primary ring-offset-2" : ""
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: idx <= currentEventIndex ? 1 : 0.5, opacity: idx <= currentEventIndex ? 1 : 0.3 }}
                        onClick={() => setCurrentEventIndex(idx)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                  {/* Progress bar */}
                  <motion.div 
                    className="absolute bottom-0 left-0 h-1 bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentEventIndex + 1) / currentSession.events.length) * 100}%` }}
                  />
                </div>

                {/* Current event display */}
                <AnimatePresence mode="wait">
                  {currentEvent && (
                    <motion.div
                      key={currentEventIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-muted/30 rounded-lg border"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-full ${getEventColor(currentEvent.event_type)}`}>
                          {getEventIcon(currentEvent.event_type)}
                        </div>
                        <div>
                          <Badge variant="outline" className="capitalize">
                            {currentEvent.event_type}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Step {currentEventIndex + 1} of {currentSession.events.length}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><strong>Page:</strong> {currentEvent.page_url || "Unknown"}</p>
                        {currentEvent.element_text && (
                          <p><strong>Element:</strong> {currentEvent.element_text.slice(0, 50)}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(currentEvent.created_at), "HH:mm:ss.SSS")}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Playback controls */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentEventIndex(Math.max(0, currentEventIndex - 1))}
                    disabled={currentEventIndex === 0}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={isPlaying ? "secondary" : "default"}
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentEventIndex(Math.min(currentSession.events.length - 1, currentEventIndex + 1))}
                    disabled={currentEventIndex === currentSession.events.length - 1}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <div className="ml-4 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Speed:</span>
                    {[0.5, 1, 2].map(speed => (
                      <Button
                        key={speed}
                        variant={playbackSpeed === speed ? "default" : "outline"}
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setPlaybackSpeed(speed)}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Select a session to watch the replay
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
