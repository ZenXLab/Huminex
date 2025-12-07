import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter
} from "recharts";
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Building2, 
  Package, Activity, RefreshCw, Calendar, ArrowUpRight, ArrowDownRight,
  Zap, Target, BarChart3, Eye, MousePointer, ShoppingCart, 
  CheckCircle, Filter, Download, Map, Layers, Clock, Globe
} from "lucide-react";

// Revenue data
const mrrData = [
  { month: 'Jul', mrr: 45000, arr: 540000, newMrr: 8000, churnedMrr: 2000 },
  { month: 'Aug', mrr: 52000, arr: 624000, newMrr: 10000, churnedMrr: 3000 },
  { month: 'Sep', mrr: 58000, arr: 696000, newMrr: 9000, churnedMrr: 3000 },
  { month: 'Oct', mrr: 67000, arr: 804000, newMrr: 12000, churnedMrr: 3000 },
  { month: 'Nov', mrr: 75000, arr: 900000, newMrr: 11000, churnedMrr: 3000 },
  { month: 'Dec', mrr: 85000, arr: 1020000, newMrr: 14000, churnedMrr: 4000 },
];

// Funnel data
const mainFunnelData = [
  { name: "Page Views", value: 15420, fill: "hsl(262, 83%, 58%)" },
  { name: "Engaged Users", value: 8250, fill: "hsl(262, 83%, 58%)" },
  { name: "Pricing Page", value: 4120, fill: "hsl(188, 94%, 43%)" },
  { name: "Quote Started", value: 1890, fill: "hsl(188, 94%, 43%)" },
  { name: "Quote Completed", value: 845, fill: "hsl(160, 84%, 39%)" },
  { name: "Converted", value: 312, fill: "hsl(160, 84%, 39%)" },
];

// Heatmap page data
const pageHeatmapData = [
  { page: "/", sessions: 8420, avgTime: 145, bounceRate: 32, interactions: 12450 },
  { page: "/features", sessions: 4580, avgTime: 210, bounceRate: 28, interactions: 8920 },
  { page: "/pricing", sessions: 3890, avgTime: 285, bounceRate: 45, interactions: 7450 },
  { page: "/get-quote", sessions: 2340, avgTime: 420, bounceRate: 38, interactions: 9870 },
  { page: "/about", sessions: 1890, avgTime: 95, bounceRate: 52, interactions: 2340 },
  { page: "/contact", sessions: 1560, avgTime: 180, bounceRate: 35, interactions: 3450 },
  { page: "/industries", sessions: 1240, avgTime: 165, bounceRate: 42, interactions: 2890 },
  { page: "/onboarding", sessions: 890, avgTime: 520, bounceRate: 22, interactions: 6780 },
];

// Click heatmap data (simulated grid positions)
const clickHeatmapData = [
  { x: 20, y: 15, intensity: 95, element: "Get Quote CTA" },
  { x: 50, y: 10, intensity: 88, element: "Navigation Menu" },
  { x: 80, y: 15, intensity: 72, element: "Login Button" },
  { x: 30, y: 35, intensity: 85, element: "Feature Cards" },
  { x: 60, y: 45, intensity: 68, element: "Pricing Toggle" },
  { x: 45, y: 65, intensity: 78, element: "Comparison Table" },
  { x: 25, y: 80, intensity: 55, element: "Testimonials" },
  { x: 70, y: 75, intensity: 62, element: "Demo Video" },
  { x: 50, y: 90, intensity: 48, element: "Footer Links" },
];

// User behavior by time
const hourlyActivityData = [
  { hour: "00", users: 120, pageviews: 450, conversions: 8 },
  { hour: "02", users: 85, pageviews: 280, conversions: 4 },
  { hour: "04", users: 65, pageviews: 180, conversions: 2 },
  { hour: "06", users: 145, pageviews: 520, conversions: 12 },
  { hour: "08", users: 380, pageviews: 1450, conversions: 35 },
  { hour: "10", users: 520, pageviews: 2100, conversions: 52 },
  { hour: "12", users: 480, pageviews: 1850, conversions: 45 },
  { hour: "14", users: 550, pageviews: 2250, conversions: 58 },
  { hour: "16", users: 490, pageviews: 1950, conversions: 48 },
  { hour: "18", users: 420, pageviews: 1650, conversions: 38 },
  { hour: "20", users: 350, pageviews: 1280, conversions: 28 },
  { hour: "22", users: 220, pageviews: 780, conversions: 15 },
];

// Geographic data
const geographicData = [
  { region: "Maharashtra", users: 2450, revenue: 28500, growth: 12.5 },
  { region: "Karnataka", users: 1890, revenue: 22400, growth: 18.2 },
  { region: "Delhi NCR", users: 1650, revenue: 19800, growth: 8.7 },
  { region: "Tamil Nadu", users: 1420, revenue: 16500, growth: 15.3 },
  { region: "Gujarat", users: 1180, revenue: 13200, growth: 22.1 },
  { region: "Telangana", users: 980, revenue: 11500, growth: 14.8 },
  { region: "West Bengal", users: 820, revenue: 9400, growth: 9.2 },
  { region: "Others", users: 2450, revenue: 28700, growth: 11.4 },
];

const planDistributionData = [
  { name: 'Starter', value: 35, color: 'hsl(var(--muted-foreground))' },
  { name: 'Professional', value: 42, color: 'hsl(262, 83%, 58%)' },
  { name: 'Business', value: 18, color: 'hsl(188, 94%, 43%)' },
  { name: 'Enterprise', value: 5, color: 'hsl(160, 84%, 39%)' },
];

export const AdminAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalMrr: 85000,
    mrrGrowth: 13.3,
    activeTenants: 58,
    tenantGrowth: 28.9,
    totalUsers: 1247,
    conversionRate: 2.02,
    avgSessionDuration: 4.5,
    bounceRate: 38.2,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [tenantsRes, profilesRes, clickstreamRes] = await Promise.all([
          supabase.from('client_tenants').select('*').eq('status', 'active'),
          supabase.from('profiles').select('id'),
          supabase.from('clickstream_events').select('*').limit(1000),
        ]);

        setStats(prev => ({
          ...prev,
          activeTenants: tenantsRes.data?.length || prev.activeTenants,
          totalUsers: profilesRes.data?.length || prev.totalUsers,
        }));
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const getHeatmapColor = (intensity: number) => {
    if (intensity >= 80) return "bg-red-500";
    if (intensity >= 60) return "bg-orange-500";
    if (intensity >= 40) return "bg-yellow-500";
    if (intensity >= 20) return "bg-green-500";
    return "bg-blue-500";
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Advanced Analytics</h1>
          <p className="text-muted-foreground">Conversion funnels, user behavior heatmaps & revenue tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <Badge className="bg-emerald-500/20 text-emerald-500 text-[10px]">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {stats.mrrGrowth}%
              </Badge>
            </div>
            <p className="text-2xl font-bold">₹{(stats.totalMrr / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground">Monthly Revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="h-5 w-5 text-purple-500" />
              <Badge className="bg-purple-500/20 text-purple-500 text-[10px]">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {stats.tenantGrowth}%
              </Badge>
            </div>
            <p className="text-2xl font-bold">{stats.activeTenants}</p>
            <p className="text-xs text-muted-foreground">Active Tenants</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-cyan-500" />
              <Badge className="bg-cyan-500/20 text-cyan-500 text-[10px]">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                0.8%
              </Badge>
            </div>
            <p className="text-2xl font-bold">{stats.conversionRate}%</p>
            <p className="text-xs text-muted-foreground">Conversion Rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <Badge className="bg-orange-500/20 text-orange-500 text-[10px]">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                12%
              </Badge>
            </div>
            <p className="text-2xl font-bold">{stats.avgSessionDuration}m</p>
            <p className="text-xs text-muted-foreground">Avg Session Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="funnels" className="gap-2">
            <Layers className="h-4 w-4" />
            Funnels
          </TabsTrigger>
          <TabsTrigger value="heatmaps" className="gap-2">
            <Map className="h-4 w-4" />
            Heatmaps
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="geographic" className="gap-2">
            <Globe className="h-4 w-4" />
            Geographic
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Quick Funnel View */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Conversion Funnel
                </CardTitle>
                <CardDescription>Visitor to customer journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mainFunnelData.map((step, index) => {
                    const width = (step.value / mainFunnelData[0].value) * 100;
                    return (
                      <div key={step.name} className="flex items-center gap-3">
                        <div className="w-28 text-xs font-medium text-muted-foreground">{step.name}</div>
                        <div className="flex-1 relative h-8">
                          <div 
                            className="h-full rounded flex items-center justify-end pr-2 text-xs font-semibold text-white transition-all"
                            style={{ width: `${width}%`, backgroundColor: step.fill, minWidth: '60px' }}
                          >
                            {step.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Hourly Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-500" />
                  Hourly Activity
                </CardTitle>
                <CardDescription>User activity throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={hourlyActivityData}>
                    <defs>
                      <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="hour" className="text-xs" tickFormatter={(v) => `${v}:00`} />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area type="monotone" dataKey="users" stroke="hsl(262, 83%, 58%)" fill="url(#userGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Page Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" />
                Page Performance
              </CardTitle>
              <CardDescription>Metrics for top pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Page</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Sessions</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Time</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Bounce Rate</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Interactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageHeatmapData.slice(0, 5).map((page) => (
                      <tr key={page.page} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-4 font-mono text-foreground">{page.page}</td>
                        <td className="py-3 px-4 text-right">{page.sessions.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{Math.floor(page.avgTime / 60)}m {page.avgTime % 60}s</td>
                        <td className="py-3 px-4 text-right">
                          <span className={page.bounceRate > 40 ? 'text-red-500' : 'text-emerald-500'}>
                            {page.bounceRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">{page.interactions.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funnels Tab */}
        <TabsContent value="funnels" className="space-y-6">
          <div className="grid lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Conversion</p>
                    <p className="text-3xl font-bold">2.02%</p>
                    <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" /> +0.8% vs last month
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Visitors</p>
                    <p className="text-3xl font-bold">15,420</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-500/10">
                    <Eye className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Quotes Generated</p>
                    <p className="text-3xl font-bold">845</p>
                  </div>
                  <div className="p-3 rounded-full bg-amber-500/10">
                    <ShoppingCart className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New Clients</p>
                    <p className="text-3xl font-bold text-emerald-500">312</p>
                  </div>
                  <div className="p-3 rounded-full bg-emerald-500/10">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Conversion Funnel</CardTitle>
              <CardDescription>Step-by-step analysis with drop-off rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mainFunnelData.map((step, index) => {
                  const width = (step.value / mainFunnelData[0].value) * 100;
                  const nextStep = mainFunnelData[index + 1];
                  const dropOff = nextStep ? (100 - (nextStep.value / step.value) * 100).toFixed(1) : "0";
                  const conversionRate = nextStep ? ((nextStep.value / step.value) * 100).toFixed(1) : "100";
                  
                  return (
                    <div key={step.name} className="relative">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="w-36 text-sm font-medium">{step.name}</div>
                        <div className="flex-1 relative">
                          <div 
                            className="h-10 rounded-lg flex items-center justify-end pr-4 text-white font-semibold transition-all"
                            style={{ width: `${width}%`, backgroundColor: step.fill, minWidth: '100px' }}
                          >
                            {step.value.toLocaleString()}
                          </div>
                        </div>
                        <div className="w-28 flex gap-2">
                          {index < mainFunnelData.length - 1 && (
                            <>
                              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                                {conversionRate}%
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/30">
                                -{dropOff}%
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Heatmaps Tab */}
        <TabsContent value="heatmaps" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Click Heatmap Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="h-5 w-5 text-orange-500" />
                  Click Heatmap
                </CardTitle>
                <CardDescription>Most clicked areas on homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-muted/30 rounded-xl p-4 h-80 border border-border">
                  {/* Grid representation */}
                  <div className="absolute inset-4 grid grid-cols-10 grid-rows-10 gap-1">
                    {clickHeatmapData.map((point, i) => (
                      <div
                        key={i}
                        className={`absolute rounded-full opacity-70 blur-sm transition-all hover:opacity-100 hover:blur-none cursor-pointer ${getHeatmapColor(point.intensity)}`}
                        style={{
                          left: `${point.x}%`,
                          top: `${point.y}%`,
                          width: `${Math.max(20, point.intensity / 3)}px`,
                          height: `${Math.max(20, point.intensity / 3)}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        title={`${point.element}: ${point.intensity}% intensity`}
                      />
                    ))}
                  </div>
                  {/* Legend */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-2 text-xs bg-background/80 rounded-lg px-3 py-2">
                    <span>Low</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded bg-blue-500" />
                      <div className="w-3 h-3 rounded bg-green-500" />
                      <div className="w-3 h-3 rounded bg-yellow-500" />
                      <div className="w-3 h-3 rounded bg-orange-500" />
                      <div className="w-3 h-3 rounded bg-red-500" />
                    </div>
                    <span>High</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Clicked Elements */}
            <Card>
              <CardHeader>
                <CardTitle>Top Clicked Elements</CardTitle>
                <CardDescription>Elements with highest interaction rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clickHeatmapData.sort((a, b) => b.intensity - a.intensity).map((item, index) => (
                    <div key={item.element} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.element}</span>
                          <span className="text-sm text-muted-foreground">{item.intensity}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getHeatmapColor(item.intensity)}`}
                            style={{ width: `${item.intensity}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Page Heat Table */}
          <Card>
            <CardHeader>
              <CardTitle>Page Engagement Heatmap</CardTitle>
              <CardDescription>User engagement metrics by page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Page</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Sessions</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg Time</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Bounce Rate</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Interactions</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageHeatmapData.map((page) => {
                      const engagement = Math.round((page.interactions / page.sessions) * 10);
                      return (
                        <tr key={page.page} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-4 font-mono text-foreground">{page.page}</td>
                          <td className="py-3 px-4 text-right">{page.sessions.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">{Math.floor(page.avgTime / 60)}m {page.avgTime % 60}s</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant={page.bounceRate > 40 ? 'destructive' : 'default'} className="text-xs">
                              {page.bounceRate}%
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">{page.interactions.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-4 h-4 rounded ${i < Math.min(engagement, 5) ? getHeatmapColor(engagement * 20) : 'bg-muted'}`}
                                />
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">MRR</span>
                  <Badge className="bg-emerald-500/20 text-emerald-500 text-[10px]">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    10.9%
                  </Badge>
                </div>
                <p className="text-2xl font-bold">₹85K</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">ARR</span>
                  <Badge className="bg-blue-500/20 text-blue-500 text-[10px]">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    10.9%
                  </Badge>
                </div>
                <p className="text-2xl font-bold">₹10.2L</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">LTV:CAC</span>
                </div>
                <p className="text-2xl font-bold">4.5:1</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Churn</span>
                  <Badge className="bg-red-500/20 text-red-500 text-[10px]">
                    <ArrowDownRight className="w-3 h-3 mr-0.5" />
                    0.3%
                  </Badge>
                </div>
                <p className="text-2xl font-bold">2.8%</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* MRR Chart */}
            <Card>
              <CardHeader>
                <CardTitle>MRR Growth Trend</CardTitle>
                <CardDescription>Monthly recurring revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mrrData}>
                    <defs>
                      <linearGradient id="mrrAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `₹${v/1000}K`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'MRR']}
                    />
                    <Area type="monotone" dataKey="mrr" stroke="hsl(160, 84%, 39%)" fill="url(#mrrAreaGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Plan Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Plan</CardTitle>
                <CardDescription>Distribution across pricing tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={planDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {planDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* New vs Churned MRR */}
          <Card>
            <CardHeader>
              <CardTitle>Net MRR Movement</CardTitle>
              <CardDescription>New revenue vs churn over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mrrData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `₹${v/1000}K`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`]}
                  />
                  <Legend />
                  <Bar dataKey="newMrr" name="New MRR" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="churnedMrr" name="Churned" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Regional Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Users by Region
                </CardTitle>
                <CardDescription>Geographic distribution of active users</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={geographicData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="region" type="category" className="text-xs" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="users" fill="hsl(262, 83%, 58%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Region */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Region</CardTitle>
                <CardDescription>Monthly revenue distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={geographicData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" tickFormatter={(v) => `₹${v/1000}K`} />
                    <YAxis dataKey="region" type="category" className="text-xs" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="hsl(160, 84%, 39%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Regional Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance Details</CardTitle>
              <CardDescription>Comprehensive metrics by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Region</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Users</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg/User</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geographicData.map((region) => (
                      <tr key={region.region} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-4 font-medium">{region.region}</td>
                        <td className="py-3 px-4 text-right">{region.users.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">₹{region.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">₹{Math.round(region.revenue / region.users)}</td>
                        <td className="py-3 px-4 text-right">
                          <Badge variant="outline" className={`text-xs ${region.growth >= 15 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-blue-500/10 text-blue-500 border-blue-500/30'}`}>
                            <ArrowUpRight className="w-3 h-3 mr-0.5" />
                            {region.growth}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsDashboard;
