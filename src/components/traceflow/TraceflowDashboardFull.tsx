import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  LayoutDashboard, 
  Video, 
  Activity, 
  Zap, 
  GitBranch, 
  Cpu, 
  Bot, 
  Plug2, 
  Settings,
  Search,
  Bell,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Play,
  Clock,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ChevronLeft,
  Crown,
  Code2,
  Map,
  Layers,
  Brain,
  Target,
  BarChart3,
  PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useTraceflowSessions, useTraceflowStats, useNeuroRouterLogs, useTraceflowUXIssues } from "@/hooks/useTraceflow";
import { TraceflowSessionReplay } from "./TraceflowSessionReplay";
import { TraceflowUXIntelligence } from "./TraceflowUXIntelligence";
import { TraceflowSDK } from "./TraceflowSDK";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data for charts - will be replaced with real data
const eventData = [
  { time: '00:00', events: 2400, errors: 24 },
  { time: '04:00', events: 1398, errors: 12 },
  { time: '08:00', events: 4800, errors: 45 },
  { time: '12:00', events: 6200, errors: 62 },
  { time: '16:00', events: 5800, errors: 38 },
  { time: '20:00', events: 4000, errors: 28 },
  { time: '24:00', events: 3200, errors: 18 },
];

const pageData = [
  { page: '/home', views: 12400, bounceRate: 24 },
  { page: '/pricing', views: 8200, bounceRate: 45 },
  { page: '/checkout', views: 4100, bounceRate: 68 },
  { page: '/signup', views: 3800, bounceRate: 32 },
  { page: '/dashboard', views: 2900, bounceRate: 12 },
];

interface AIInsightCard {
  id: string;
  type: "urgent" | "revenue" | "churn" | "conversion" | "error";
  title: string;
  description: string;
  impact: string;
  confidence: number;
  sessionId?: string;
  timestamp: string;
  llmUsed?: string;
}

// TRACEFLOW 11 Core Feature Modules
const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview", description: "AI-powered dashboard with real-time insights" },
  { icon: MousePointer, label: "Capture Engine", id: "capture", description: "Universal auto-capture across web & mobile", badge: "Core" },
  { icon: Video, label: "Session Intelligence", id: "sessions", description: "AI summaries, root-cause & fix suggestions", badge: "Live" },
  { icon: Layers, label: "UX Intelligence", id: "ux", description: "Visual breakage, heatmaps & design auditor" },
  { icon: GitBranch, label: "Journey Intelligence", id: "journeys", description: "Auto-funnels, drop-off causality & simulator" },
  { icon: BarChart3, label: "Product Intelligence", id: "product", description: "Feature usage, retention & churn prediction" },
  { icon: Activity, label: "Observability", id: "observability", description: "OTel traces, service maps & API correlation" },
  { icon: Brain, label: "Multi-Modal AI", id: "multimodal", description: "Voice, text & sentiment fusion with sessions", badge: "New" },
  { icon: Bot, label: "AI Operations", id: "ai-ops", description: "Multi-agent auto-ticketing & monitoring" },
  { icon: Target, label: "Revenue Insights", id: "revenue", description: "Financial impact & ROI of UX improvements" },
  { icon: Code2, label: "SDK & Setup", id: "sdk", description: "Integrate TRACEFLOW in minutes" },
  { icon: Settings, label: "Admin & Billing", id: "settings", description: "Feature store, team & billing management" },
];

export const TraceflowDashboardFull = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("Last 24h");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Get real data from hooks
  const { data: sessions, isLoading: sessionsLoading, refetch: refetchSessions } = useTraceflowSessions({ limit: 50 });
  const { data: uxIssues, refetch: refetchUxIssues } = useTraceflowUXIssues({ status: 'open' });
  const { data: stats } = useTraceflowStats();
  const { data: neuroRouterLogs } = useNeuroRouterLogs(10);
  
  const isLoading = sessionsLoading;

  // Generate AI insights from real data
  const [aiInsights, setAiInsights] = useState<AIInsightCard[]>([]);
  
  useEffect(() => {
    // Generate insights based on real session data
    const insights: AIInsightCard[] = [];
    
    if (sessions && sessions.length > 0) {
      // Find sessions with high frustration
      const frustratingSessions = sessions.filter(s => (s.frustration_score || 0) > 50);
      if (frustratingSessions.length > 0) {
        insights.push({
          id: "frustration-1",
          type: "urgent",
          title: `${frustratingSessions.length} Sessions with High Frustration Detected`,
          description: `Users showing signs of frustration including rage clicks and dead clicks. ${frustratingSessions.length} sessions affected.`,
          impact: "Potential revenue at risk",
          confidence: 94,
          sessionId: frustratingSessions[0]?.session_id,
          timestamp: "Just now",
          llmUsed: "DeepSeek Reasoner"
        });
      }
      
      // Rage click detection
      const rageClickSessions = sessions.filter(s => (s.rage_click_count || 0) > 0);
      if (rageClickSessions.length > 0) {
        insights.push({
          id: "rage-1",
          type: "error",
          title: "Rage Click Pattern Detected",
          description: `${rageClickSessions.reduce((acc, s) => acc + (s.rage_click_count || 0), 0)} rage clicks across ${rageClickSessions.length} sessions. Indicates UI responsiveness issues.`,
          impact: `${rageClickSessions.length} affected sessions`,
          confidence: 92,
          sessionId: rageClickSessions[0]?.session_id,
          timestamp: "5 min ago",
          llmUsed: "Gemini 2.5 Vision"
        });
      }
    }
    
    // Add UX issue insights
    if (uxIssues && uxIssues.length > 0) {
      const criticalIssues = uxIssues.filter(i => i.severity === 'critical' || i.severity === 'high');
      if (criticalIssues.length > 0) {
        insights.push({
          id: "ux-1",
          type: "revenue",
          title: `${criticalIssues.length} Critical UX Issues Need Attention`,
          description: criticalIssues[0]?.ai_diagnosis || "Multiple UI elements affecting user experience detected",
          impact: "Estimated conversion impact",
          confidence: 87,
          timestamp: "15 min ago",
          llmUsed: "Claude 4 Code"
        });
      }
    }

    // Add default insights if no real data
    if (insights.length === 0) {
      insights.push({
        id: "demo-1",
        type: "conversion",
        title: "Funnel Optimization Opportunity",
        description: "AI analysis suggests simplifying the checkout flow could increase conversions by 23%",
        impact: "+₹1.2M/month projected",
        confidence: 82,
        timestamp: "Demo data",
        llmUsed: "OpenAI GPT-5"
      });
    }
    
    setAiInsights(insights);
  }, [sessions, uxIssues]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "revenue": return <DollarSign className="h-4 w-4 text-amber-500" />;
      case "churn": return <Users className="h-4 w-4 text-purple-500" />;
      case "conversion": return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case "error": return <Zap className="h-4 w-4 text-red-500" />;
      default: return <Sparkles className="h-4 w-4 text-blue-500" />;
    }
  };

  const getInsightBadge = (type: string) => {
    switch (type) {
      case "urgent": return <Badge variant="destructive" className="text-[10px]">Urgent</Badge>;
      case "revenue": return <Badge className="bg-amber-500/10 text-amber-600 text-[10px]">Revenue</Badge>;
      case "churn": return <Badge className="bg-purple-500/10 text-purple-600 text-[10px]">Churn Risk</Badge>;
      case "conversion": return <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Opportunity</Badge>;
      case "error": return <Badge variant="destructive" className="text-[10px]">Error</Badge>;
      default: return null;
    }
  };

  const renderContent = () => {
    // Get current module info for header
    const currentModule = sidebarItems.find(item => item.id === activeTab);
    
    switch (activeTab) {
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
                  <MousePointer className="h-6 w-6 text-[#0B3D91]" />
                  Universal Capture Engine
                </h2>
                <p className="text-muted-foreground">Auto-capture every user interaction with zero manual tagging</p>
              </div>
              <Badge className="bg-blue-500/10 text-blue-600">Core Feature</Badge>
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
                <Card key={feature.title} className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">Active</Badge>
                      <span className="text-sm font-bold text-[#0B3D91]">{feature.metric}</span>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <GitBranch className="h-6 w-6 text-[#0B3D91]" />
                  Journey Intelligence
                </h2>
                <p className="text-muted-foreground">Auto-build funnels, explain drop-offs, predict conversion impact</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Causality Engine</CardTitle>
                  <CardDescription>Explains WHY users drop off, not just where</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-red-700">Checkout Drop-off</span>
                      </div>
                      <p className="text-xs text-red-600">Payment gateway timeout causing 68% abandonment</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="font-medium text-amber-700">Form Friction</span>
                      </div>
                      <p className="text-xs text-amber-600">Address autocomplete failure on mobile devices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Impact Simulator</CardTitle>
                  <CardDescription>Predict conversion uplift from proposed fixes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-4xl font-bold text-emerald-600 mb-1">+23%</div>
                    <p className="text-sm text-muted-foreground">Projected conversion increase</p>
                    <p className="text-xs text-muted-foreground mt-2">if checkout flow is optimized</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "product":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-[#0B3D91]" />
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
                <Card key={stat.title} className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold">{stat.value}</span>
                      <span className={cn("text-xs", stat.change.startsWith("+") ? "text-emerald-600" : "text-red-600")}>{stat.change}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "observability":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Activity className="h-6 w-6 text-[#0B3D91]" />
                  Experience Observability
                </h2>
                <p className="text-muted-foreground">Connect frontend behavior with backend traces, logs & API performance</p>
              </div>
              <Badge className="bg-purple-500/10 text-purple-600">OTel-Powered</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Service Map</CardTitle>
                  <CardDescription>Real-time service dependencies and latency</CardDescription>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center bg-slate-50 rounded-lg">
                  <p className="text-muted-foreground">Interactive service map visualization</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">API Correlation</CardTitle>
                  <CardDescription>Link user frustration to specific API calls</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                      <p className="text-xs font-medium">POST /api/checkout</p>
                      <p className="text-xs text-red-600">Avg 4.2s latency causing 68% rage clicks</p>
                    </div>
                    <div className="p-2 bg-amber-50 rounded border-l-4 border-amber-500">
                      <p className="text-xs font-medium">GET /api/products</p>
                      <p className="text-xs text-amber-600">Intermittent 500 errors detected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "multimodal":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Brain className="h-6 w-6 text-[#0B3D91]" />
                  Multi-Modal Intelligence
                </h2>
                <p className="text-muted-foreground">Voice, text & sentiment fusion with exact user sessions</p>
              </div>
              <Badge className="bg-[#FF8A00]/10 text-[#FF8A00]">World First</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Voice + Session Fusion</CardTitle>
                  <CardDescription>Audio complaint maps to exact recorded session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Customer Voice Note</p>
                        <p className="text-xs text-muted-foreground">"The checkout button wasn't working..."</p>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-white rounded border">
                      <p className="text-xs text-emerald-600">✓ Matched to Session #4521 - Rage clicks detected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
                  <CardDescription>NPS, feedback & sentiment trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Positive</span>
                      <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-3/5" />
                      </div>
                      <span className="text-sm font-medium">62%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Neutral</span>
                      <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-1/4" />
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Negative</span>
                      <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[13%]" />
                      </div>
                      <span className="text-sm font-medium">13%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "ai-ops":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Bot className="h-6 w-6 text-[#0B3D91]" />
                  AI Operations
                </h2>
                <p className="text-muted-foreground">Multi-agent automation for diagnostics, ticketing & monitoring</p>
              </div>
            </div>
            
            {/* NeuroRouter Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { name: "DeepSeek", tasks: 245, icon: Brain, color: "from-blue-500 to-indigo-600", specialty: "Reasoning" },
                { name: "Gemini 2.5", tasks: 189, icon: Eye, color: "from-purple-500 to-pink-600", specialty: "Vision" },
                { name: "Claude 4", tasks: 156, icon: Code2, color: "from-amber-500 to-orange-600", specialty: "Code" },
                { name: "GPT-5", tasks: 134, icon: Sparkles, color: "from-emerald-500 to-teal-600", specialty: "General" },
              ].map((llm) => (
                <Card key={llm.name} className="border-0 shadow-lg overflow-hidden">
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
            <Card className="border-0 shadow-lg">
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
                        <Badge className={agent.status === "Running" ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-600"}>
                          {agent.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{agent.desc}</p>
                      {agent.tasks > 0 && (
                        <p className="text-xs text-[#0B3D91] mt-1">{agent.tasks} tasks in progress</p>
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
                  <Target className="h-6 w-6 text-[#0B3D91]" />
                  Revenue & Growth Intelligence
                </h2>
                <p className="text-muted-foreground">Quantify financial impact of UX issues, predict ROI of fixes</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Revenue at Risk</p>
                  <p className="text-3xl font-bold text-red-600">₹12.4L</p>
                  <p className="text-xs text-red-600 mt-1">Due to checkout friction</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Projected Recovery</p>
                  <p className="text-3xl font-bold text-emerald-600">₹8.2L</p>
                  <p className="text-xs text-emerald-600 mt-1">If top 5 issues fixed</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">ROI of TRACEFLOW</p>
                  <p className="text-3xl font-bold text-blue-600">4.2x</p>
                  <p className="text-xs text-blue-600 mt-1">In first 6 months</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Settings className="h-6 w-6 text-[#0B3D91]" />
                  Admin & Billing
                </h2>
                <p className="text-muted-foreground">Feature store, team management & billing</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Feature Store</CardTitle>
                  <CardDescription>Enable/disable features per team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Session Replay", "AI Summaries", "Heatmaps", "Voice Fusion", "NeuroRouter"].map((feature) => (
                      <div key={feature} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <span className="text-sm">{feature}</span>
                        <Badge className="bg-emerald-500/10 text-emerald-600">Enabled</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Professional - 250K sessions/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sessions Used</span>
                      <span className="font-medium">142,500 / 250,000</span>
                    </div>
                    <Progress value={57} className="h-2" />
                    <Button className="w-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8]">
                      Upgrade to Enterprise
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Active Sessions", value: sessions?.length || 0, change: "+12%", icon: Eye, trend: "up" },
                { label: "Events Captured", value: sessions?.reduce((acc, s) => acc + (s.event_count || 0), 0) || "0", change: "+8%", icon: Activity, trend: "up" },
                { label: "UX Issues", value: uxIssues?.length || 0, change: "-15%", icon: AlertTriangle, trend: "down" },
                { label: "AI Tasks", value: neuroRouterLogs?.length || 0, change: "+45%", icon: Brain, trend: "up" },
              ].map((stat) => (
                <Card key={stat.label} className="bg-white/70 backdrop-blur border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {stat.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          <span className={cn(
                            "text-xs font-medium",
                            stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                          )}>{stat.change}</span>
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#0B3D91]/10 to-[#00C2D8]/10 flex items-center justify-center">
                        <stat.icon className="h-5 w-5 text-[#0B3D91]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Events Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={eventData}>
                        <defs>
                          <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0B3D91" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0B3D91" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                        <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                        <Tooltip />
                        <Area type="monotone" dataKey="events" stroke="#0B3D91" fill="url(#colorEvents)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Top Pages by Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pageData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                        <YAxis dataKey="page" type="category" tick={{ fontSize: 11 }} stroke="#9ca3af" width={80} />
                        <Tooltip />
                        <Bar dataKey="views" fill="#00C2D8" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights Stream */}
            <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">AI Analyst Insights</CardTitle>
                      <CardDescription className="text-xs">Real-time intelligence powered by NeuroRouter</CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground"
                    onClick={() => {
                      refetchSessions();
                      refetchUxIssues();
                    }}
                  >
                    <RefreshCw className={cn("h-3 w-3 mr-1", isLoading && "animate-spin")} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-3">
                    {aiInsights.map((insight, index) => (
                      <div
                        key={insight.id}
                        onClick={() => setSelectedInsight(insight.id)}
                        className={cn(
                          "p-4 rounded-xl border bg-white/80 cursor-pointer transition-all duration-300 hover:shadow-md animate-fade-in",
                          selectedInsight === insight.id && "ring-2 ring-[#00C2D8]/50 shadow-lg",
                          insight.type === "urgent" && "border-l-4 border-l-red-500"
                        )}
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {getInsightBadge(insight.type)}
                                {insight.llmUsed && (
                                  <Badge variant="outline" className="text-[9px] bg-[#0B3D91]/5">
                                    <Brain className="h-2.5 w-2.5 mr-1" />
                                    {insight.llmUsed}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
                              </div>
                              <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs font-medium text-[#FF8A00]">{insight.impact}</span>
                                <span className="text-xs text-muted-foreground">
                                  Confidence: <span className="font-medium">{insight.confidence}%</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            {insight.sessionId && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTab("sessions");
                                }}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Replay
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0B3D91]">
                              Create Ticket
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-slate-900 text-white flex flex-col transition-all duration-300 sticky top-0 h-screen",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-800">
          <Link to="/traceflow" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00C2D8]/30 blur-xl rounded-full" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight">TRACEFLOW</span>
                  <Crown className="h-3 w-3 text-[#FF8A00]" />
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">DXI Engine</span>
              </div>
            )}
          </Link>
        </div>

        {/* Back to Landing */}
        <div className="px-3 py-2 border-b border-slate-800">
          <Link to="/traceflow">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "w-full text-slate-400 hover:text-white hover:bg-slate-800",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">Back to Product</span>}
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left",
                activeTab === item.id
                  ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white shadow-lg shadow-[#00C2D8]/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110 flex-shrink-0",
                activeTab === item.id && "text-white"
              )} />
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        className={cn(
                          "text-[9px] h-4 px-1.5 ml-1",
                          item.badge === "Live" 
                            ? "bg-emerald-500/20 text-emerald-400" 
                            : item.badge === "Core"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-[#FF8A00]/20 text-[#FF8A00]"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] truncate block",
                    activeTab === item.id ? "text-white/70" : "text-slate-500"
                  )}>{item.description}</span>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800">
          {!sidebarCollapsed && (
            <div className="bg-gradient-to-r from-[#0B3D91]/20 to-[#00C2D8]/20 rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-300">Live Ingestion</span>
              </div>
              <div className="text-xl font-bold text-white">{sessions?.reduce((acc, s) => acc + (s.event_count || 0), 0) || 0}</div>
              <div className="text-[10px] text-slate-400">total events captured</div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "w-full text-slate-400 hover:text-white hover:bg-slate-800",
              sidebarCollapsed && "justify-center px-2"
            )}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
            {!sidebarCollapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <h1 className="font-semibold text-lg capitalize">
                {activeTab === "neurorouter" ? "NeuroRouter AI" : activeTab.replace("-", " ")}
              </h1>
              {activeTab === "overview" && (
                <Badge variant="secondary" className="text-xs">
                  Last updated: Just now
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search sessions, events..." 
                  className="pl-9 w-72 bg-muted/30 border-0 focus:ring-2 focus:ring-[#00C2D8]/30"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {aiInsights.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF8A00] rounded-full text-[10px] text-white flex items-center justify-center">
                    {aiInsights.length}
                  </span>
                )}
              </Button>
              <Button className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white hover:opacity-90">
                <Plus className="h-4 w-4 mr-1" />
                New Analysis
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TraceflowDashboardFull;
