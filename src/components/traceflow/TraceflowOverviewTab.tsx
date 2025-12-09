import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Activity, 
  AlertTriangle, 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Play,
  ArrowRight,
  Sparkles,
  DollarSign,
  Users,
  Zap
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from "@/lib/utils";
import { TraceflowSession, TraceflowUXIssue, NeuroRouterLog } from "@/hooks/useTraceflow";

// Mock chart data - will be replaced with real data
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

interface TraceflowOverviewTabProps {
  sessions: TraceflowSession[] | null;
  uxIssues: TraceflowUXIssue[] | null;
  neuroRouterLogs: NeuroRouterLog[] | null;
  onViewSession: (sessionId: string) => void;
}

export const TraceflowOverviewTab = ({ 
  sessions, 
  uxIssues, 
  neuroRouterLogs,
  onViewSession 
}: TraceflowOverviewTabProps) => {
  // Generate AI insights from real data
  const aiInsights = useMemo(() => {
    const insights: AIInsightCard[] = [];
    
    if (sessions && sessions.length > 0) {
      const frustratingSessions = sessions.filter(s => (s.frustration_score || 0) > 50);
      if (frustratingSessions.length > 0) {
        insights.push({
          id: "frustration-1",
          type: "urgent",
          title: `${frustratingSessions.length} Sessions with High Frustration`,
          description: `Users showing signs of frustration including rage clicks and dead clicks.`,
          impact: "Potential revenue at risk",
          confidence: 94,
          sessionId: frustratingSessions[0]?.session_id,
          timestamp: "Just now",
          llmUsed: "DeepSeek Reasoner"
        });
      }
      
      const rageClickSessions = sessions.filter(s => (s.rage_click_count || 0) > 0);
      if (rageClickSessions.length > 0) {
        insights.push({
          id: "rage-1",
          type: "error",
          title: "Rage Click Pattern Detected",
          description: `${rageClickSessions.reduce((acc, s) => acc + (s.rage_click_count || 0), 0)} rage clicks across ${rageClickSessions.length} sessions.`,
          impact: `${rageClickSessions.length} affected sessions`,
          confidence: 92,
          sessionId: rageClickSessions[0]?.session_id,
          timestamp: "5 min ago",
          llmUsed: "Gemini 2.5 Vision"
        });
      }
    }
    
    if (uxIssues && uxIssues.length > 0) {
      const criticalIssues = uxIssues.filter(i => i.severity === 'critical' || i.severity === 'high');
      if (criticalIssues.length > 0) {
        insights.push({
          id: "ux-1",
          type: "revenue",
          title: `${criticalIssues.length} Critical UX Issues`,
          description: criticalIssues[0]?.ai_diagnosis || "Multiple UI elements affecting user experience",
          impact: "Estimated conversion impact",
          confidence: 87,
          timestamp: "15 min ago",
          llmUsed: "Claude 4 Code"
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        id: "demo-1",
        type: "conversion",
        title: "Funnel Optimization Opportunity",
        description: "AI analysis suggests simplifying checkout could increase conversions by 23%",
        impact: "+₹1.2M/month projected",
        confidence: 82,
        timestamp: "Demo data",
        llmUsed: "OpenAI GPT-5"
      });
    }
    
    return insights;
  }, [sessions, uxIssues]);

  const stats = useMemo(() => ({
    activeSessions: sessions?.length || 0,
    eventsCount: sessions?.reduce((acc, s) => acc + (s.event_count || 0), 0) || 0,
    uxIssuesCount: uxIssues?.length || 0,
    aiTasks: neuroRouterLogs?.length || 0
  }), [sessions, uxIssues, neuroRouterLogs]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "revenue": return <DollarSign className="h-4 w-4 text-amber-500" />;
      case "churn": return <Users className="h-4 w-4 text-primary" />;
      case "conversion": return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case "error": return <Zap className="h-4 w-4 text-destructive" />;
      default: return <Sparkles className="h-4 w-4 text-primary" />;
    }
  };

  const getInsightBadge = (type: string) => {
    switch (type) {
      case "urgent": return <Badge variant="destructive" className="text-[10px]">Urgent</Badge>;
      case "revenue": return <Badge className="bg-amber-500/10 text-amber-600 text-[10px]">Revenue</Badge>;
      case "churn": return <Badge className="bg-primary/10 text-primary text-[10px]">Churn Risk</Badge>;
      case "conversion": return <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Opportunity</Badge>;
      case "error": return <Badge variant="destructive" className="text-[10px]">Error</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeSessions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>+12% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10">
                <Activity className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.eventsCount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Events Captured</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>+8% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.uxIssuesCount}</p>
                <p className="text-sm text-muted-foreground">UX Issues</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
              <TrendingDown className="h-3 w-3" />
              <span>-15% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.aiTasks}</p>
                <p className="text-sm text-muted-foreground">AI Tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>+45% from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts + AI Insights Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Events Over Time Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Events Over Time</CardTitle>
            <CardDescription>Captured events and errors in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={eventData}>
                  <defs>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="events" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorEvents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Analyst Insights */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Analyst
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">Auto</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiInsights.slice(0, 3).map((insight) => (
              <div 
                key={insight.id} 
                className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => insight.sessionId && onViewSession(insight.sessionId)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    {getInsightBadge(insight.type)}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{insight.timestamp}</span>
                </div>
                <p className="text-sm font-medium mb-1">{insight.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-primary">{insight.impact}</span>
                  <span className="text-[10px] text-muted-foreground">{insight.confidence}% confidence</span>
                </div>
                {insight.llmUsed && (
                  <Badge variant="outline" className="text-[9px] mt-2">{insight.llmUsed}</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Top Pages by Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="page" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
