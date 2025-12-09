import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  Monitor,
  Smartphone,
  Tablet,
  AlertTriangle,
  MousePointer,
  Clock,
  Activity,
  Code,
  GitBranch,
  ExternalLink,
  Copy,
  Sparkles,
  Zap,
  Network,
  Eye,
  EyeOff,
  ChevronRight,
  FileCode,
  Bug,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTraceflowSessions, useTraceflowEvents, useTraceflowSession } from "@/hooks/useTraceflow";
import { useSessionSummary, useRootCauseAnalysis, useCodeFixSuggestion } from "@/hooks/useNeuroRouter";
import { toast } from "sonner";
import { format } from "date-fns";

interface TimelineEvent {
  time: string;
  type: string;
  label: string;
  page?: string;
}

interface AISummary {
  tldr: string;
  keyMoments: { time: string; description: string }[];
  rootCause: {
    description: string;
    code: string;
    commit: string;
    confidence: number;
  };
  suggestedFix: {
    description: string;
    code: string;
    confidence: number;
  };
}

export const TraceflowSessionReplay = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [showNetwork, setShowNetwork] = useState(true);
  const [showErrors, setShowErrors] = useState(true);
  const [showDOMHighlight, setShowDOMHighlight] = useState(true);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("mobile");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);

  // Fetch real sessions
  const { data: sessions, isLoading: sessionsLoading } = useTraceflowSessions({ limit: 20 });
  const { data: sessionData } = useTraceflowSession(selectedSessionId || "");
  const { data: events, isLoading: eventsLoading } = useTraceflowEvents(selectedSessionId || "");

  // AI analysis hooks
  const sessionSummary = useSessionSummary();
  const rootCauseAnalysis = useRootCauseAnalysis();
  const codeFix = useCodeFixSuggestion();

  // Auto-select first session
  useEffect(() => {
    if (sessions && sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].session_id);
    }
  }, [sessions, selectedSessionId]);

  // Transform events to timeline format
  const timelineEvents: TimelineEvent[] = (events || []).map((e, i) => {
    const seconds = Math.floor((new Date(e.timestamp).getTime() - new Date(events![0]?.timestamp || e.timestamp).getTime()) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      time: `${mins}:${secs.toString().padStart(2, '0')}`,
      type: e.event_type,
      label: e.element_text || e.element_selector || e.event_type,
      page: e.page_url || undefined,
    };
  });

  // Run AI analysis
  const handleRunAnalysis = async () => {
    if (!events || events.length === 0 || !sessionData) {
      toast.error("No session data to analyze");
      return;
    }

    try {
      toast.info("Running AI analysis...");
      
      const summaryResult = await sessionSummary.analyze(events, {
        frustration_score: sessionData.frustration_score,
        rage_clicks: sessionData.rage_click_count,
        dead_clicks: sessionData.dead_click_count,
        errors: sessionData.error_count,
      });

      // Parse AI response
      const summary = summaryResult.content;
      
      setAiSummary({
        tldr: summary.slice(0, 300),
        keyMoments: timelineEvents
          .filter(e => e.type === "rage_click" || e.type === "error" || e.type === "dead_click")
          .slice(0, 3)
          .map(e => ({ time: e.time, description: e.label })),
        rootCause: {
          description: sessionData.ai_root_cause || "Analysis pending - click 'Analyze Root Cause' for detailed diagnosis",
          code: "Component analysis required",
          commit: "N/A",
          confidence: 75,
        },
        suggestedFix: {
          description: sessionData.ai_suggested_fix || "Fix suggestions will appear after root cause analysis",
          code: "// Suggested fix will appear here",
          confidence: 70,
        },
      });

      toast.success(`Analysis complete! Used ${summaryResult.llm_used}/${summaryResult.model_used}`);
    } catch (error) {
      toast.error("Failed to run AI analysis");
      console.error(error);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "pageview": return <Eye className="h-3 w-3" />;
      case "session_start": return <Eye className="h-3 w-3" />;
      case "click": return <MousePointer className="h-3 w-3" />;
      case "input": return <Code className="h-3 w-3" />;
      case "scroll": return <Activity className="h-3 w-3" />;
      case "error": return <AlertTriangle className="h-3 w-3 text-amber-500" />;
      case "rage_click": return <Zap className="h-3 w-3 text-red-500" />;
      case "dead_click": return <MousePointer className="h-3 w-3 text-amber-500" />;
      case "api_error": return <Bug className="h-3 w-3 text-red-500" />;
      case "success": return <Activity className="h-3 w-3 text-emerald-500" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const totalDuration = events && events.length > 1
    ? Math.floor((new Date(events[events.length - 1].timestamp).getTime() - new Date(events[0].timestamp).getTime()) / 1000)
    : 0;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (sessionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B3D91]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <select
              value={selectedSessionId || ""}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="text-sm border rounded-lg px-3 py-1.5 bg-white"
            >
              {sessions?.map((s) => (
                <option key={s.session_id} value={s.session_id}>
                  {s.session_id.slice(0, 12)}... ({s.event_count} events)
                </option>
              ))}
            </select>
            <div className="h-4 w-px bg-border" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  Session #{selectedSessionId?.slice(0, 8) || "..."}
                </span>
                {sessionData?.error_count && sessionData.error_count > 0 && (
                  <Badge variant="destructive" className="text-[10px]">Has Errors</Badge>
                )}
                {sessionData?.frustration_score && sessionData.frustration_score > 50 && (
                  <Badge className="bg-amber-500 text-white text-[10px]">High Frustration</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {sessionData ? format(new Date(sessionData.created_at), "MMM d, yyyy • HH:mm") : "..."} • 
                {formatDuration(totalDuration)} duration • {sessionData?.device_type || "Unknown"} {sessionData?.browser || ""}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRunAnalysis}
              disabled={sessionSummary.isPending}
            >
              {sessionSummary.isPending ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              Analyze with AI
            </Button>
            <Button className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white">
              <GitBranch className="h-3 w-3 mr-1" />
              Create Jira Ticket
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Left Panel - Timeline & Controls */}
        <aside className="w-72 border-r bg-white/50 flex flex-col">
          {/* Playback Controls */}
          <div className="p-4 border-b bg-white/80">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-10 w-10 bg-gradient-to-r from-[#0B3D91] to-[#00C2D8]"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(totalDuration)}</span>
              </div>
              <Slider 
                value={[currentTime]} 
                max={totalDuration || 1} 
                step={1}
                onValueChange={(v) => setCurrentTime(v[0])}
                className="cursor-pointer"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Speed</span>
                <div className="flex gap-1">
                  {[0.5, 1, 2, 4].map((speed) => (
                    <Button
                      key={speed}
                      variant={playbackSpeed === speed ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "h-6 px-2 text-xs",
                        playbackSpeed === speed && "bg-[#0B3D91]"
                      )}
                      onClick={() => setPlaybackSpeed(speed)}
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Events */}
          <ScrollArea className="flex-1 p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Event Timeline
            </h3>
            {eventsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : timelineEvents.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No events in this session
              </div>
            ) : (
              <div className="space-y-1">
                {timelineEvents.map((event, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all hover:bg-muted/50",
                      event.type === "rage_click" || event.type === "dead_click" || event.type === "error"
                        ? "bg-red-50 border border-red-200" 
                        : ""
                    )}
                  >
                    <span className="text-xs font-mono text-muted-foreground w-8">{event.time}</span>
                    {getEventIcon(event.type)}
                    <span className="text-xs truncate flex-1">{event.label}</span>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Overlay Toggles */}
          <div className="p-4 border-t bg-white/80 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Overlays
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="network" className="text-xs">Network</Label>
              <Switch id="network" checked={showNetwork} onCheckedChange={setShowNetwork} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="errors" className="text-xs">Errors</Label>
              <Switch id="errors" checked={showErrors} onCheckedChange={setShowErrors} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dom" className="text-xs">DOM Highlights</Label>
              <Switch id="dom" checked={showDOMHighlight} onCheckedChange={setShowDOMHighlight} />
            </div>
          </div>
        </aside>

        {/* Center - Replay Pane */}
        <main className="flex-1 p-6 flex flex-col">
          {/* Device Selector */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {[
                { id: "desktop", icon: Monitor, label: "Desktop" },
                { id: "tablet", icon: Tablet, label: "Tablet" },
                { id: "mobile", icon: Smartphone, label: "Mobile" },
              ].map((device) => (
                <Button
                  key={device.id}
                  variant={deviceView === device.id ? "default" : "ghost"}
                  size="sm"
                  className={cn(deviceView === device.id && "bg-[#0B3D91]")}
                  onClick={() => setDeviceView(device.id as any)}
                >
                  <device.icon className="h-3 w-3 mr-1" />
                  {device.label}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Device Frame */}
          <div className="flex-1 flex items-center justify-center bg-slate-100 rounded-2xl p-8">
            <div className={cn(
              "bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-800 relative transition-all duration-300",
              deviceView === "mobile" && "w-[375px] h-[667px]",
              deviceView === "tablet" && "w-[768px] h-[500px]",
              deviceView === "desktop" && "w-full max-w-[900px] h-[500px] rounded-xl border-4"
            )}>
              {/* Notch for mobile */}
              {deviceView === "mobile" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-10" />
              )}
              
              {/* Mock Session Content */}
              <div className="h-full bg-gradient-to-b from-slate-50 to-white p-4 pt-8">
                <div className="space-y-4">
                  <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
                  <div className="h-12 w-full bg-slate-100 rounded-lg border" />
                  <div className="h-12 w-full bg-slate-100 rounded-lg border" />
                  
                  {/* Highlighted error element */}
                  {showDOMHighlight && (
                    <div className="relative">
                      <div className="h-12 w-full bg-red-50 rounded-lg border-2 border-red-400 animate-pulse" />
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px]">
                        Rage Click
                      </Badge>
                    </div>
                  )}
                  
                  <div className="h-10 w-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] rounded-lg" />
                </div>
                
                {/* Network overlay */}
                {showNetwork && (
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 text-white p-2 rounded-lg text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Network className="h-3 w-3 text-red-400" />
                      <span>POST /api/validate-otp</span>
                      <Badge variant="destructive" className="text-[9px]">500</Badge>
                      <span className="text-red-400">2341ms</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel - AI Summary */}
        <aside className="w-96 border-l bg-white/50 flex flex-col">
          <Tabs defaultValue="summary" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4 grid grid-cols-3">
              <TabsTrigger value="summary" className="text-xs">AI Summary</TabsTrigger>
              <TabsTrigger value="code" className="text-xs">Code Context</TabsTrigger>
              <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {!aiSummary ? (
                    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-0">
                      <CardContent className="p-6 text-center">
                        <Sparkles className="h-8 w-8 text-[#0B3D91] mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-muted-foreground mb-3">
                          Click "Analyze with AI" to generate insights for this session
                        </p>
                        <Button 
                          onClick={handleRunAnalysis}
                          disabled={sessionSummary.isPending}
                          className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8]"
                        >
                          {sessionSummary.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4 mr-2" />
                          )}
                          Run AI Analysis
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {/* TL;DR */}
                      <Card className="bg-gradient-to-br from-[#0B3D91]/5 to-[#00C2D8]/10 border-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-[#0B3D91]" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#0B3D91]">TL;DR</span>
                          </div>
                          <p className="text-sm leading-relaxed">{aiSummary.tldr}</p>
                        </CardContent>
                      </Card>

                  {/* Key Moments */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Key Moments
                    </h4>
                    <div className="space-y-2">
                      {aiSummary.keyMoments.map((moment, i) => (
                        <button
                          key={i}
                          className="w-full flex items-center gap-3 p-2 rounded-lg bg-white hover:bg-muted/50 transition-all text-left border"
                        >
                          <span className="text-xs font-mono text-[#0B3D91] font-semibold">{moment.time}</span>
                          <span className="text-xs">{moment.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Root Cause */}
                  <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Bug className="h-4 w-4 text-red-500" />
                        Root Cause Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">{aiSummary.rootCause.description}</p>
                      <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-emerald-400 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCode className="h-3 w-3" />
                          <span>{aiSummary.rootCause.code}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <GitBranch className="h-3 w-3" />
                        <span>Commit: {aiSummary.rootCause.commit}</span>
                        <Badge variant="outline" className="text-[10px]">{aiSummary.rootCause.confidence}% confidence</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Suggested Fix */}
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-500" />
                        Suggested Fix
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">{aiSummary.suggestedFix.description}</p>
                      <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{aiSummary.suggestedFix.code}</pre>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="outline" className="text-[10px]">{aiSummary.suggestedFix.confidence}% confidence</Badge>
                        <Button size="sm" className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white text-xs">
                          Create PR with Fix
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                      {/* Create Ticket */}
                      <Button className="w-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white">
                        <GitBranch className="h-4 w-4 mr-2" />
                        Create Jira Ticket with Full Context
                      </Button>
                    </>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="code" className="flex-1 p-4">
              <div className="bg-slate-900 rounded-lg p-4 h-full text-xs font-mono text-slate-300">
                <div className="text-emerald-400 mb-2">// OTPInput.tsx:53</div>
                <pre className="text-red-400">const validateOTP = async (otp) =&gt; {"{"}</pre>
                <pre className="text-slate-400 pl-4">const response = await api.post('/validate', {"{"} otp {"}"});</pre>
                <pre className="text-slate-400 pl-4">// No retry logic or timeout handling</pre>
                <pre className="text-slate-400 pl-4">return response.data;</pre>
                <pre className="text-red-400">{"}"}</pre>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="flex-1 p-4">
              <div className="space-y-2 text-xs font-mono">
                <div className="bg-slate-100 p-2 rounded flex gap-2">
                  <span className="text-muted-foreground">10:45:02</span>
                  <span className="text-blue-600">[INFO]</span>
                  <span>User initiated OTP validation</span>
                </div>
                <div className="bg-red-50 p-2 rounded flex gap-2 border border-red-200">
                  <span className="text-muted-foreground">10:45:04</span>
                  <span className="text-red-600">[ERROR]</span>
                  <span>API timeout after 2341ms</span>
                </div>
                <div className="bg-amber-50 p-2 rounded flex gap-2 border border-amber-200">
                  <span className="text-muted-foreground">10:45:04</span>
                  <span className="text-amber-600">[WARN]</span>
                  <span>Rage click detected on submit button</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
};

export default TraceflowSessionReplay;
