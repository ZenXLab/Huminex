import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, TrendingUp, Users, Zap, Brain, Settings,
  ArrowUp, ArrowDown, Star, Activity, BarChart3, Filter
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, ZAxis } from "recharts";

const scoreDistribution = [
  { range: "0-20", count: 125, color: "#EF4444" },
  { range: "21-40", count: 280, color: "#F59E0B" },
  { range: "41-60", count: 450, color: "#FBBF24" },
  { range: "61-80", count: 380, color: "#10B981" },
  { range: "81-100", count: 165, color: "#3B82F6" },
];

const conversionTrend = [
  { month: "Jan", rate: 12.5, leads: 450 },
  { month: "Feb", rate: 14.2, leads: 520 },
  { month: "Mar", rate: 15.8, leads: 480 },
  { month: "Apr", rate: 18.4, leads: 610 },
  { month: "May", rate: 19.2, leads: 580 },
  { month: "Jun", rate: 22.1, leads: 720 },
];

const topLeads = [
  { id: 1, name: "TechCorp Solutions", score: 95, company: "Enterprise", activity: "Demo Requested", trend: "up" },
  { id: 2, name: "Global Industries Ltd", score: 92, company: "Enterprise", activity: "Pricing Page Visit", trend: "up" },
  { id: 3, name: "StartupXYZ", score: 88, company: "Startup", activity: "Trial Started", trend: "stable" },
  { id: 4, name: "Digital First Agency", score: 85, company: "SMB", activity: "Whitepaper Download", trend: "up" },
  { id: 5, name: "Innovation Labs", score: 82, company: "Enterprise", activity: "Contact Form", trend: "down" },
];

const scoringFactors = [
  { name: "Website Visits", weight: 15, impact: "high" },
  { name: "Email Engagement", weight: 20, impact: "high" },
  { name: "Demo Requests", weight: 25, impact: "critical" },
  { name: "Content Downloads", weight: 10, impact: "medium" },
  { name: "Pricing Page Views", weight: 15, impact: "high" },
  { name: "Form Submissions", weight: 15, impact: "high" },
];

const leadActivity = [
  { x: 10, y: 20, z: 200, name: "Website" },
  { x: 25, y: 50, z: 400, name: "Email" },
  { x: 40, y: 70, z: 350, name: "Social" },
  { x: 60, y: 85, z: 500, name: "Direct" },
  { x: 80, y: 95, z: 450, name: "Referral" },
];

export const AdminLeadScoring = () => {
  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-blue-500">Hot Lead</Badge>;
    if (score >= 60) return <Badge className="bg-green-500">Warm Lead</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-500">Nurturing</Badge>;
    return <Badge variant="secondary">Cold Lead</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (trend === "down") return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Scoring</h1>
          <p className="text-muted-foreground">AI-powered lead qualification and prioritization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure Model
          </Button>
          <Button className="gap-2">
            <Brain className="h-4 w-4" />
            Train Model
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">1,400</p>
                <p className="text-xs text-green-500">+156 this week</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hot Leads</p>
                <p className="text-2xl font-bold">165</p>
                <p className="text-xs text-green-500">Score 80+</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">56.4</p>
                <p className="text-xs text-green-500">+4.2 vs last month</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">22.1%</p>
                <p className="text-xs text-green-500">+3.8% vs last month</p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Top Leads</TabsTrigger>
          <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
          <TabsTrigger value="model">Scoring Model</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Highest Scoring Leads
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-lg font-bold">{lead.score}</span>
                        </div>
                        <div className="absolute -top-1 -right-1">
                          {getTrendIcon(lead.trend)}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.activity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{lead.company}</Badge>
                      {getScoreBadge(lead.score)}
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Lead Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="range" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {scoreDistribution.map((entry, index) => (
                        <Bar key={`bar-${index}`} dataKey="count" fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Scoring Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scoringFactors.map((factor) => (
                  <div key={factor.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{factor.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={factor.impact === "critical" ? "destructive" : factor.impact === "high" ? "default" : "secondary"}
                        >
                          {factor.impact}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{factor.weight}%</span>
                      </div>
                    </div>
                    <Progress value={factor.weight * 4} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Model Accuracy</span>
                    <span className="text-2xl font-bold text-green-500">87.4%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Based on last 1,000 conversions</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Precision</p>
                    <p className="text-xl font-bold">91.2%</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Recall</p>
                    <p className="text-xl font-bold">84.8%</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">F1 Score</p>
                    <p className="text-xl font-bold">0.878</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">AUC-ROC</p>
                    <p className="text-xl font-bold">0.924</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Brain className="h-4 w-4" />
                  Retrain Model
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Conversion Rate Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversionTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" yAxisId="left" />
                    <YAxis className="text-xs" yAxisId="right" orientation="right" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line yAxisId="left" type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={2} name="Conversion Rate %" />
                    <Line yAxisId="right" type="monotone" dataKey="leads" stroke="#10B981" strokeWidth={2} name="New Leads" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLeadScoring;
