import { useState, lazy, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MousePointer, 
  AlertTriangle,
  Eye,
  Code2,
  Brain,
  Target,
  Users,
  Sparkles,
  Bot,
  Activity,
  GitBranch,
  BarChart3,
  RefreshCw,
  Thermometer,
  FormInput,
  Smartphone,
  Globe,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTraceflowSessions, useTraceflowStats, useNeuroRouterLogs, useTraceflowUXIssues } from "@/hooks/useTraceflow";
import { TraceflowSessionReplay } from "./TraceflowSessionReplay";
import { TraceflowUXIntelligence } from "./TraceflowUXIntelligence";
import { TraceflowSDK } from "./TraceflowSDK";
import { TraceflowAdminPanel } from "./TraceflowAdminPanel";
import { TraceflowSidebar } from "./TraceflowSidebar";
import { TraceflowTopBar } from "./TraceflowTopBar";
import { TraceflowOverviewTab } from "./TraceflowOverviewTab";
import { TraceflowClickAnalysis } from "./TraceflowClickAnalysis";
import { TraceflowScrollDepth } from "./TraceflowScrollDepth";
import { TraceflowRecentEvents } from "./TraceflowRecentEvents";
import { TraceflowPrivacyControls } from "./TraceflowPrivacyControls";
import { useTraceflowAuth } from "@/hooks/useTraceflowAuth";
import { useTraceflowRealtime } from "@/hooks/useTraceflowRBAC";

// Lazy load heavy clickstream components (reusing from admin)
const ConversionFunnel = lazy(() => import("@/components/admin/modules/clickstream/ConversionFunnel").then(m => ({ default: m.ConversionFunnel })));
const UserJourney = lazy(() => import("@/components/admin/modules/clickstream/UserJourney").then(m => ({ default: m.UserJourney })));
const ClickHeatmap = lazy(() => import("@/components/admin/modules/clickstream/ClickHeatmap").then(m => ({ default: m.ClickHeatmap })));
const DeviceAnalytics = lazy(() => import("@/components/admin/modules/clickstream/DeviceAnalytics").then(m => ({ default: m.DeviceAnalytics })));
const GeoAnalytics = lazy(() => import("@/components/admin/modules/clickstream/GeoAnalytics").then(m => ({ default: m.GeoAnalytics })));
const FormFieldAnalytics = lazy(() => import("@/components/admin/modules/clickstream/FormFieldAnalytics").then(m => ({ default: m.FormFieldAnalytics })));
const AIStruggleDetection = lazy(() => import("@/components/admin/modules/clickstream/AIStruggleDetection").then(m => ({ default: m.AIStruggleDetection })));

// Loading skeleton for lazy components
const ComponentSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-48" />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
    <Skeleton className="h-64" />
  </div>
);

export const TraceflowDashboardFull = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState("24h");
  
  // Get auth and subscription info
  const { user, isAdmin } = useTraceflowAuth();
  const subscriptionId = user?.id;
  
  // Enable real-time updates
  const { isConnected } = useTraceflowRealtime(subscriptionId);
  
  // Get real data from hooks
  const { data: sessions, isLoading: sessionsLoading, refetch: refetchSessions } = useTraceflowSessions({ limit: 100 });
  const { data: uxIssues, refetch: refetchUxIssues } = useTraceflowUXIssues({ status: 'open' });
  const { data: stats } = useTraceflowStats();
  const { data: neuroRouterLogs } = useNeuroRouterLogs(20);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchSessions(), refetchUxIssues()]);
    setIsRefreshing(false);
  };

  const handleViewSession = (sessionId: string) => {
    setActiveTab("sessions");
  };

  // Sidebar stats from real data
  const sidebarStats = {
    sessions24h: sessions?.length || 0,
    uxIssues: uxIssues?.length || 0,
    aiTasks: neuroRouterLogs?.length || 0,
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
      case "ai-analyst":
        return (
          <TraceflowOverviewTab 
            sessions={sessions || null}
            uxIssues={uxIssues || null}
            neuroRouterLogs={neuroRouterLogs || null}
            onViewSession={handleViewSession}
            isLoading={sessionsLoading}
          />
        );

      case "sessions":
        return <TraceflowSessionReplay />;

      case "ux":
        return <TraceflowUXIntelligence />;

      case "sdk":
        return <TraceflowSDK />;

      case "settings":
        return <TraceflowAdminPanel subscriptionId={subscriptionId || ""} />;

      case "click-analysis":
        return <TraceflowClickAnalysis />;

      case "scroll-depth":
        return <TraceflowScrollDepth />;

      case "recent-events":
        return <TraceflowRecentEvents />;

      case "privacy":
        return <TraceflowPrivacyControls />;

      case "capture":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MousePointer className="h-6 w-6 text-primary" />
                  Capture Engine
                </h2>
                <p className="text-muted-foreground">Auto-capture every user interaction with zero manual tagging</p>
              </div>
              <Badge className="bg-primary/10 text-primary">Core Feature</Badge>
            </div>
            
            {/* Real stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{sessions?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Sessions Captured</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">{sessions?.reduce((a,s) => a + (s.event_count||0), 0) || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-destructive">{sessions?.reduce((a,s) => a + (s.rage_click_count||0), 0) || 0}</p>
                  <p className="text-sm text-muted-foreground">Rage Clicks</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-500">{sessions?.reduce((a,s) => a + (s.dead_click_count||0), 0) || 0}</p>
                  <p className="text-sm text-muted-foreground">Dead Clicks</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Auto Event Capture", desc: "Zero manual tagging - captures clicks, taps, gestures", status: "Active" },
                { title: "Session Recording", desc: "Pixel-perfect playback of every user session", status: "Active" },
                { title: "Rage Click Detection", desc: "AI-powered frustration pattern recognition", status: "Active" },
                { title: "Dead Click Detection", desc: "Identify non-responsive UI elements", status: "Active" },
                { title: "Scroll Depth Tracking", desc: "Track how far users scroll on each page", status: "Active" },
                { title: "Error Capture", desc: "Automatic JavaScript error logging", status: "Active" },
              ].map((feature) => (
                <Card key={feature.title}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">{feature.status}</Badge>
                    </div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "heatmaps":
        return (
          <Suspense fallback={<ComponentSkeleton />}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Thermometer className="h-6 w-6 text-primary" />
                    Click Heatmaps
                  </h2>
                  <p className="text-muted-foreground">Visual click distribution analysis across your pages</p>
                </div>
              </div>
              <ClickHeatmap events={[]} />
            </div>
          </Suspense>
        );

      case "frustration":
        return (
          <Suspense fallback={<ComponentSkeleton />}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                    Frustration Detection
                  </h2>
                  <p className="text-muted-foreground">AI-powered detection of rage clicks, dead clicks, and errors</p>
                </div>
              </div>
              <AIStruggleDetection events={[]} />
            </div>
          </Suspense>
        );

      case "forms":
        return (
          <Suspense fallback={<ComponentSkeleton />}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FormInput className="h-6 w-6 text-primary" />
                    Form Analytics
                  </h2>
                  <p className="text-muted-foreground">Field-level abandonment and completion analysis</p>
                </div>
              </div>
              <FormFieldAnalytics events={[]} />
            </div>
          </Suspense>
        );

      case "journeys":
        return (
          <Suspense fallback={<ComponentSkeleton />}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <GitBranch className="h-6 w-6 text-primary" />
                    User Journeys
                  </h2>
                  <p className="text-muted-foreground">Path analysis and drop-off point identification</p>
                </div>
              </div>
              <UserJourney events={[]} />
            </div>
          </Suspense>
        );

      case "funnels":
        return (
          <Suspense fallback={<ComponentSkeleton />}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Conversion Funnels
                  </h2>
                  <p className="text-muted-foreground">Step-by-step conversion tracking and optimization</p>
                </div>
              </div>
              <ConversionFunnel events={[]} />
            </div>
          </Suspense>
        );

      case "devices":
        return (
          <Suspense fallback={<ComponentSkeleton />}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Smartphone className="h-6 w-6 text-primary" />
                    Device Analytics
                  </h2>
                  <p className="text-muted-foreground">Browser, OS, and device breakdown of your users</p>
                </div>
              </div>
              <DeviceAnalytics events={[]} />
            </div>
          </Suspense>
        );

      case "geo":
        return (
          <Suspense fallback={<ComponentSkeleton />}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Globe className="h-6 w-6 text-primary" />
                    Geographic Analytics
                  </h2>
                  <p className="text-muted-foreground">User distribution by country and region</p>
                </div>
              </div>
              <GeoAnalytics events={[]} />
            </div>
          </Suspense>
        );

      case "ai-ops":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Bot className="h-6 w-6 text-primary" />
                  NeuroRouter AI Operations
                </h2>
                <p className="text-muted-foreground">Multi-LLM task routing for intelligent analysis</p>
              </div>
              <Badge className="bg-accent/10 text-accent">AI-Powered</Badge>
            </div>
            
            {/* Real NeuroRouter stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "DeepSeek", specialty: "Reasoning", color: "from-primary to-accent", icon: Brain },
                { name: "Gemini 2.5", specialty: "Vision", color: "from-primary to-primary/60", icon: Eye },
                { name: "Claude 4", specialty: "Code", color: "from-amber-500 to-amber-600", icon: Code2 },
                { name: "GPT-5", specialty: "General", color: "from-emerald-500 to-emerald-600", icon: Sparkles },
              ].map((llm) => {
                const tasksForLLM = neuroRouterLogs?.filter(l => l.selected_llm?.includes(llm.name.toLowerCase().split(' ')[0]))?.length || 0;
                return (
                  <Card key={llm.name} className="overflow-hidden">
                    <div className={cn("h-1 bg-gradient-to-r", llm.color)} />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", llm.color)}>
                          <llm.icon className="h-5 w-5 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs">{llm.specialty}</Badge>
                      </div>
                      <h4 className="font-semibold">{llm.name}</h4>
                      <p className="text-2xl font-bold mt-1">{tasksForLLM}</p>
                      <p className="text-xs text-muted-foreground">tasks routed</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent AI Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent AI Tasks</CardTitle>
                <CardDescription>Latest tasks processed by the NeuroRouter</CardDescription>
              </CardHeader>
              <CardContent>
                {neuroRouterLogs && neuroRouterLogs.length > 0 ? (
                  <div className="space-y-2">
                    {neuroRouterLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{log.task_type}</Badge>
                          <span className="text-sm">{log.selected_llm} - {log.selected_model}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{log.latency_ms}ms</span>
                          <Badge className={log.success ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"}>
                            {log.success ? "Success" : "Failed"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No AI tasks processed yet</p>
                    <p className="text-xs">Tasks will appear here as sessions are analyzed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "multimodal":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  Multi-Modal Intelligence
                </h2>
                <p className="text-muted-foreground">Voice, text & sentiment fusion with exact user sessions</p>
              </div>
              <Badge className="bg-accent/10 text-accent">World First</Badge>
            </div>
            <Suspense fallback={<ComponentSkeleton />}>
              <AIStruggleDetection events={[]} />
            </Suspense>
          </div>
        );

      case "product":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  Product Intelligence
                </h2>
                <p className="text-muted-foreground">Feature adoption, retention drivers, churn signals</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold">{sessions?.length || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">In the last 24 hours</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Avg Frustration</p>
                  <p className="text-2xl font-bold">{stats?.avgFrustration || 0}%</p>
                  <p className="text-xs text-muted-foreground mt-1">User frustration score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Critical Issues</p>
                  <p className="text-2xl font-bold text-destructive">{stats?.criticalIssues || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
                </CardContent>
              </Card>
            </div>
            <Suspense fallback={<ComponentSkeleton />}>
              <DeviceAnalytics events={[]} />
            </Suspense>
          </div>
        );

      case "revenue":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Revenue Insights
                </h2>
                <p className="text-muted-foreground">Financial impact of UX issues and improvements</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estimated Revenue Impact</CardTitle>
                  <CardDescription>Based on detected UX issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uxIssues && uxIssues.length > 0 ? (
                      uxIssues.slice(0, 5).map((issue) => (
                        <div key={issue.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">{issue.issue_type}</p>
                            <p className="text-xs text-muted-foreground">{issue.page_url}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={issue.severity === 'critical' ? 'destructive' : 'secondary'}>
                              {issue.severity}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{issue.occurrence_count} occurrences</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>No revenue impact data yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">UX Issue Summary</CardTitle>
                  <CardDescription>Overview of detected problems</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Critical Issues</span>
                    <span className="font-bold text-destructive">{stats?.criticalIssues || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Open Issues</span>
                    <span className="font-bold">{stats?.openIssues || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rage Clicks (24h)</span>
                    <span className="font-bold text-amber-500">{stats?.rageClicks24h || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dead Clicks (24h)</span>
                    <span className="font-bold">{stats?.deadClicks24h || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <TraceflowOverviewTab 
            sessions={sessions || null}
            uxIssues={uxIssues || null}
            neuroRouterLogs={neuroRouterLogs || null}
            onViewSession={handleViewSession}
            isLoading={sessionsLoading}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TraceflowSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isConnected={isConnected}
        stats={sidebarStats}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <TraceflowTopBar 
          activeTab={activeTab}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />
        
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
