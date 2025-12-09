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
  BarChart3
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
  const [timeFilter, setTimeFilter] = useState("24h");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get auth and subscription info
  const { user, isAdmin } = useTraceflowAuth();
  const subscriptionId = user?.id;
  
  // Enable real-time updates
  const { isConnected } = useTraceflowRealtime(subscriptionId);
  
  // Get real data from hooks
  const { data: sessions, isLoading: sessionsLoading, refetch: refetchSessions } = useTraceflowSessions({ limit: 50 });
  const { data: uxIssues, refetch: refetchUxIssues } = useTraceflowUXIssues({ status: 'open' });
  const { data: stats } = useTraceflowStats();
  const { data: neuroRouterLogs } = useNeuroRouterLogs(10);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchSessions(), refetchUxIssues()]);
    setIsRefreshing(false);
  };

  const handleViewSession = (sessionId: string) => {
    setActiveTab("sessions");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <TraceflowOverviewTab 
            sessions={sessions || null}
            uxIssues={uxIssues || null}
            neuroRouterLogs={neuroRouterLogs || null}
            onViewSession={handleViewSession}
          />
        );

      case "sessions":
        return <TraceflowSessionReplay />;

      case "ux":
        return <TraceflowUXIntelligence />;

      case "sdk":
        return <TraceflowSDK />;

      case "capture":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MousePointer className="h-6 w-6 text-primary" />
                  Universal Capture Engine
                </h2>
                <p className="text-muted-foreground">Auto-capture every user interaction with zero manual tagging</p>
              </div>
              <Badge className="bg-primary/10 text-primary">Core Feature</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Auto Event Capture", desc: "Zero manual tagging required - captures clicks, taps, gestures automatically", metric: "100%", status: "active" },
                { title: "Web Session Replay", desc: "Pixel-perfect playback of every user session", metric: "HD", status: "active" },
                { title: "Mobile Gesture Capture", desc: "Native iOS & Android gesture tracking", metric: "Native", status: "active" },
                { title: "Rage Click Detection", desc: "AI-powered frustration pattern recognition", metric: "Real-time", status: "active" },
                { title: "Dead Click Detection", desc: "Identify non-responsive UI elements", metric: "Instant", status: "active" },
                { title: "DOM Timeline Tracking", desc: "Complete DOM mutation history", metric: "Full", status: "active" },
              ].map((feature) => (
                <Card key={feature.title}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">Active</Badge>
                      <span className="text-sm font-bold text-primary">{feature.metric}</span>
                    </div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "journeys":
        return (
          <Suspense fallback={<ComponentSkeleton />}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <GitBranch className="h-6 w-6 text-primary" />
                    Journey Intelligence
                  </h2>
                  <p className="text-muted-foreground">Auto-build funnels, explain drop-offs, predict conversion impact</p>
                </div>
              </div>
              <ConversionFunnel events={[]} />
              <UserJourney events={[]} />
            </div>
          </Suspense>
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
              {[
                { title: "Feature Usage", value: "12.4K", change: "+18%", desc: "Active users on new dashboard" },
                { title: "Retention Rate", value: "87%", change: "+5%", desc: "30-day user retention" },
                { title: "Churn Risk", value: "234", change: "-12%", desc: "Users at risk of churning" },
              ].map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold">{stat.value}</span>
                      <span className={cn("text-xs", stat.change.startsWith("+") ? "text-emerald-600" : "text-destructive")}>{stat.change}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Suspense fallback={<ComponentSkeleton />}>
              <DeviceAnalytics events={[]} />
            </Suspense>
          </div>
        );

      case "observability":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Activity className="h-6 w-6 text-primary" />
                  Experience Observability
                </h2>
                <p className="text-muted-foreground">Connect frontend behavior with backend traces, logs & API performance</p>
              </div>
              <Badge className="bg-primary/10 text-primary">OTel-Powered</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Map</CardTitle>
                  <CardDescription>Real-time service dependencies and latency</CardDescription>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Interactive service map visualization</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">API Correlation</CardTitle>
                  <CardDescription>Link user frustration to specific API calls</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 bg-destructive/10 rounded border-l-4 border-destructive">
                      <p className="text-xs font-medium">POST /api/checkout</p>
                      <p className="text-xs text-destructive">Avg 4.2s latency causing 68% rage clicks</p>
                    </div>
                    <div className="p-2 bg-amber-500/10 rounded border-l-4 border-amber-500">
                      <p className="text-xs font-medium">GET /api/products</p>
                      <p className="text-xs text-amber-600">Intermittent 500 errors detected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Suspense fallback={<ComponentSkeleton />}>
              <GeoAnalytics events={[]} />
            </Suspense>
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
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Voice + Session Fusion</CardTitle>
                  <CardDescription>Audio complaint maps to exact recorded session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Customer Voice Note</p>
                        <p className="text-xs text-muted-foreground">"The checkout button wasn't working..."</p>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-card rounded border">
                      <p className="text-xs text-emerald-600">✓ Matched to Session #4521 - Rage clicks detected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
                  <CardDescription>NPS, feedback & sentiment trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Positive</span>
                      <div className="flex-1 mx-3 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-3/5" />
                      </div>
                      <span className="text-sm font-medium">62%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Neutral</span>
                      <div className="flex-1 mx-3 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-1/4" />
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Negative</span>
                      <div className="flex-1 mx-3 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-destructive w-[13%]" />
                      </div>
                      <span className="text-sm font-medium">13%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Suspense fallback={<ComponentSkeleton />}>
              <AIStruggleDetection events={[]} />
            </Suspense>
          </div>
        );

      case "ai-ops":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Bot className="h-6 w-6 text-primary" />
                  AI Operations
                </h2>
                <p className="text-muted-foreground">Multi-agent automation for diagnostics, ticketing & monitoring</p>
              </div>
            </div>
            
            {/* NeuroRouter Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "DeepSeek", tasks: 245, icon: Brain, color: "from-primary to-accent", specialty: "Reasoning" },
                { name: "Gemini 2.5", tasks: 189, icon: Eye, color: "from-primary to-primary/60", specialty: "Vision" },
                { name: "Claude 4", tasks: 156, icon: Code2, color: "from-amber-500 to-amber-600", specialty: "Code" },
                { name: "GPT-5", tasks: 134, icon: Sparkles, color: "from-emerald-500 to-emerald-600", specialty: "General" },
              ].map((llm) => (
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
                    <p className="text-2xl font-bold mt-1">{llm.tasks}</p>
                    <p className="text-xs text-muted-foreground">tasks routed</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Agents */}
            <Card>
              <CardHeader>
                <CardTitle>Active AI Agents</CardTitle>
                <CardDescription>Autonomous agents working on your experience data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: "Diagnostics Agent", status: "Running", tasks: 12, desc: "Analyzing session anomalies" },
                    { name: "Ticketing Agent", status: "Idle", tasks: 0, desc: "Auto-creates Jira tickets" },
                    { name: "Regression Agent", status: "Running", tasks: 3, desc: "Monitoring for regressions" },
                  ].map((agent) => (
                    <div key={agent.name} className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{agent.name}</span>
                        <Badge className={agent.status === "Running" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}>
                          {agent.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{agent.desc}</p>
                      {agent.tasks > 0 && (
                        <p className="text-xs text-primary mt-1">{agent.tasks} tasks in progress</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "revenue":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Revenue & Growth Intelligence
                </h2>
                <p className="text-muted-foreground">Quantify financial impact of UX issues, predict ROI of fixes</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Revenue at Risk</p>
                  <p className="text-3xl font-bold text-destructive">₹12.4L</p>
                  <p className="text-xs text-destructive mt-1">Due to checkout friction</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Projected Recovery</p>
                  <p className="text-3xl font-bold text-emerald-600">₹8.2L</p>
                  <p className="text-xs text-emerald-600 mt-1">If top 5 issues fixed</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">ROI of TRACEFLOW</p>
                  <p className="text-3xl font-bold text-primary">4.2x</p>
                  <p className="text-xs text-primary mt-1">In first 6 months</p>
                </CardContent>
              </Card>
            </div>
            <Suspense fallback={<ComponentSkeleton />}>
              <FormFieldAnalytics events={[]} />
            </Suspense>
          </div>
        );

      case "settings":
        return subscriptionId ? (
          <TraceflowAdminPanel subscriptionId={subscriptionId} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading admin panel...</p>
          </div>
        );

      default:
        return (
          <TraceflowOverviewTab 
            sessions={sessions || null}
            uxIssues={uxIssues || null}
            neuroRouterLogs={neuroRouterLogs || null}
            onViewSession={handleViewSession}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <TraceflowSidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isConnected={isConnected}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <TraceflowTopBar 
          activeTab={activeTab}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {sessionsLoading ? (
            <ComponentSkeleton />
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};
