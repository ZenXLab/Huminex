import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  MousePointer,
  Zap,
  AlertTriangle,
  TrendingDown,
  Eye,
  Play,
  GitBranch,
  DollarSign,
  Calendar,
  Filter,
  ChevronRight,
  MapPin,
  Loader2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTraceflowUXIssues, useTraceflowHeatmap } from "@/hooks/useTraceflow";
import { useUXIssueDetection } from "@/hooks/useNeuroRouter";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface IssueHotspot {
  id: string;
  component: string;
  page: string;
  severity: string;
  occurrences: number;
  impactedRevenue: string;
  firstSeen: string;
  issues: string[];
}

export const TraceflowUXIntelligence = () => {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"heatmap" | "list">("heatmap");
  const [selectedPage, setSelectedPage] = useState<string>("/");

  // Fetch real UX issues
  const { data: uxIssues, isLoading: issuesLoading } = useTraceflowUXIssues({ limit: 20, status: "open" });
  const { data: heatmapData } = useTraceflowHeatmap(selectedPage);
  const uxAnalysis = useUXIssueDetection();

  // Transform UX issues to display format
  const issueHotspots: IssueHotspot[] = useMemo(() => {
    if (!uxIssues) return [];
    return uxIssues.map((issue) => ({
      id: issue.id,
      component: issue.element_selector?.split(" ").pop() || "Unknown",
      page: issue.page_url,
      severity: issue.severity,
      occurrences: issue.occurrence_count,
      impactedRevenue: `₹${Math.round(issue.estimated_revenue_impact / 1000)}K`,
      firstSeen: formatDistanceToNow(new Date(issue.first_seen), { addSuffix: true }),
      issues: [issue.issue_type, issue.ai_diagnosis || "Pending analysis"].filter(Boolean),
    }));
  }, [uxIssues]);

  // Auto-select first issue
  useMemo(() => {
    if (issueHotspots.length > 0 && !selectedIssue) {
      setSelectedIssue(issueHotspots[0].id);
    }
  }, [issueHotspots, selectedIssue]);

  // Count by severity
  const criticalCount = issueHotspots.filter(i => i.severity === "critical").length;
  const highCount = issueHotspots.filter(i => i.severity === "high").length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500";
      case "high": return "bg-amber-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-slate-500";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical": return <Badge variant="destructive" className="text-[10px]">Critical</Badge>;
      case "high": return <Badge className="bg-amber-500/10 text-amber-600 text-[10px]">High</Badge>;
      case "medium": return <Badge className="bg-yellow-500/10 text-yellow-600 text-[10px]">Medium</Badge>;
      default: return <Badge variant="secondary" className="text-[10px]">Low</Badge>;
    }
  };

  // Generate heatmap spots from real data or use placeholders
  const heatmapSpots = heatmapData && heatmapData.length > 0 
    ? heatmapData.slice(0, 10).map((d, i) => ({
        x: (d.x || 0) % 100,
        y: (d.y || 0) % 100,
        type: d.type === "rage_click" ? "rage" : d.type === "dead_click" ? "dead" : "normal",
      }))
    : [
        { x: 45, y: 30, type: "rage" },
        { x: 60, y: 55, type: "dead" },
        { x: 25, y: 70, type: "normal" },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <MousePointer className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">UX Intelligence</span>
              <Badge variant="secondary" className="text-[10px]">Issue Map</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-3 w-3 mr-1" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-3 w-3 mr-1" />
              Last 7 Days
            </Button>
            <Button className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white">
              <GitBranch className="h-3 w-3 mr-1" />
              Bulk Create Tickets
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Left Panel - Component List */}
        <aside className="w-80 border-r bg-white/50 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Issue Summary
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-3">
                  <div className="text-2xl font-bold text-red-600">5</div>
                  <div className="text-xs text-red-600/80">Critical Issues</div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-3">
                  <div className="text-2xl font-bold text-amber-600">12</div>
                  <div className="text-xs text-amber-600/80">High Priority</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Components by Impact
            </h3>
            <div className="space-y-2">
              {issueHotspots.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue.id)}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all",
                    selectedIssue === issue.id
                      ? "bg-white shadow-md ring-2 ring-[#00C2D8]/50"
                      : "bg-white/50 hover:bg-white hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", getSeverityColor(issue.severity))} />
                      <span className="font-medium text-sm">{issue.component}</span>
                    </div>
                    {getSeverityBadge(issue.severity)}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{issue.page}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{issue.occurrences.toLocaleString()} occurrences</span>
                    <span className="font-medium text-[#FF8A00]">{issue.impactedRevenue}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {issue.issues.slice(0, 2).map((iss, i) => (
                      <Badge key={i} variant="outline" className="text-[9px] h-5">
                        {iss}
                      </Badge>
                    ))}
                    {issue.issues.length > 2 && (
                      <Badge variant="outline" className="text-[9px] h-5">+{issue.issues.length - 2}</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content - Heatmap */}
        <main className="flex-1 p-6 flex flex-col">
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
              <TabsList>
                <TabsTrigger value="heatmap" className="text-xs">Heatmap View</TabsTrigger>
                <TabsTrigger value="list" className="text-xs">Component List</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-1" />
                Rage Clicks
              </Badge>
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 rounded-full bg-amber-500 mr-1" />
                Dead Clicks
              </Badge>
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-1" />
                Confusion
              </Badge>
            </div>
          </div>

          {/* Heatmap Visualization */}
          <Card className="flex-1 bg-white/70 backdrop-blur border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0 h-full">
              <div className="relative h-full bg-slate-100 rounded-lg overflow-hidden">
                {/* Page screenshot placeholder */}
                <div className="absolute inset-4 bg-white rounded-lg shadow-inner border">
                  {/* Mock page content */}
                  <div className="p-4 space-y-4">
                    <div className="h-8 w-40 bg-slate-200 rounded" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-slate-100 rounded" />
                        <div className="h-10 w-full bg-slate-100 rounded border" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-slate-100 rounded" />
                        <div className="h-10 w-full bg-slate-100 rounded border" />
                      </div>
                    </div>
                    <div className="h-12 w-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] rounded" />
                  </div>

                  {/* Heatmap hotspots */}
                  {heatmapSpots.map((spot, i) => (
                    <button
                      key={i}
                      className={cn(
                        "absolute w-12 h-12 rounded-full transition-all hover:scale-110 cursor-pointer animate-pulse",
                        spot.type === "rage" && "bg-red-500/40 ring-4 ring-red-500/30",
                        spot.type === "dead" && "bg-amber-500/40 ring-4 ring-amber-500/30",
                        spot.type === "confusion" && "bg-purple-500/40 ring-4 ring-purple-500/30",
                        spot.type === "error" && "bg-red-600/40 ring-4 ring-red-600/30",
                        spot.type === "normal" && "bg-blue-500/20 ring-2 ring-blue-500/20"
                      )}
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.y}%`,
                        transform: 'translate(-50%, -50%)',
                        animationDuration: `${2 + i * 0.3}s`
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        {spot.type === "rage" && <Zap className="h-5 w-5 text-red-600" />}
                        {spot.type === "dead" && <MousePointer className="h-5 w-5 text-amber-600" />}
                        {spot.type === "error" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
                  <div className="text-xs font-semibold mb-2">Interaction Intensity</div>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-2 bg-blue-200 rounded-l" />
                    <div className="w-6 h-2 bg-blue-400" />
                    <div className="w-6 h-2 bg-amber-400" />
                    <div className="w-6 h-2 bg-red-400" />
                    <div className="w-6 h-2 bg-red-600 rounded-r" />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Right Panel - Issue Details */}
        <aside className="w-96 border-l bg-white/50 flex flex-col">
          {selectedIssue && (
            <>
              <div className="p-4 border-b bg-white/80">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {issueHotspots.find(i => i.id === selectedIssue)?.component}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {issueHotspots.find(i => i.id === selectedIssue)?.page}
                    </span>
                  </div>
                  {getSeverityBadge(issueHotspots.find(i => i.id === selectedIssue)?.severity || "")}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-slate-50 border-0">
                    <CardContent className="p-3">
                      <div className="text-lg font-bold">
                        {issueHotspots.find(i => i.id === selectedIssue)?.occurrences.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Occurrences</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#FF8A00]/10 border-0">
                    <CardContent className="p-3">
                      <div className="text-lg font-bold text-[#FF8A00]">
                        {issueHotspots.find(i => i.id === selectedIssue)?.impactedRevenue}
                      </div>
                      <div className="text-xs text-muted-foreground">Revenue Impact</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {/* Issue breakdown */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Detected Issues
                    </h4>
                    <div className="space-y-2">
                      {issueHotspots.find(i => i.id === selectedIssue)?.issues.map((issue, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                          <span className="text-sm">{issue}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps to reproduce */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Steps to Reproduce
                    </h4>
                    <Card className="bg-slate-50 border-0">
                      <CardContent className="p-3 text-sm space-y-2">
                        <div className="flex gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#0B3D91] text-white text-xs flex items-center justify-center flex-shrink-0">1</span>
                          <span>Navigate to /checkout page</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#0B3D91] text-white text-xs flex items-center justify-center flex-shrink-0">2</span>
                          <span>Enter OTP in input field</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#0B3D91] text-white text-xs flex items-center justify-center flex-shrink-0">3</span>
                          <span>Click Submit button</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center flex-shrink-0">!</span>
                          <span className="text-red-600">Validation fails, rage clicks occur</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sample replays */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Sample Sessions
                    </h4>
                    <div className="space-y-2">
                      {["sess_abc123", "sess_def456", "sess_ghi789"].map((sess) => (
                        <Button
                          key={sess}
                          variant="outline"
                          className="w-full justify-start text-sm"
                        >
                          <Play className="h-3 w-3 mr-2" />
                          {sess}
                          <ChevronRight className="h-3 w-3 ml-auto" />
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Suggested fix */}
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">AI Suggested Fix</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        Add retry logic with exponential backoff for OTP validation API calls.
                      </p>
                      <Badge variant="outline" className="text-[10px]">87% confidence</Badge>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-white/80 space-y-2">
                <Button className="w-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Create Ticket for This Issue
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Related Sessions
                </Button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};

export default TraceflowUXIntelligence;
