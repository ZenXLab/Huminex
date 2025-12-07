import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Building2, 
  Package, Activity, RefreshCw, Calendar, ArrowUpRight,
  Zap, Target, BarChart3
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

// Mock data for charts - in production, this would come from Supabase
const mrrData = [
  { month: 'Jul', mrr: 45000, arr: 540000, newMrr: 8000, churnedMrr: 2000 },
  { month: 'Aug', mrr: 52000, arr: 624000, newMrr: 10000, churnedMrr: 3000 },
  { month: 'Sep', mrr: 58000, arr: 696000, newMrr: 9000, churnedMrr: 3000 },
  { month: 'Oct', mrr: 67000, arr: 804000, newMrr: 12000, churnedMrr: 3000 },
  { month: 'Nov', mrr: 75000, arr: 900000, newMrr: 11000, churnedMrr: 3000 },
  { month: 'Dec', mrr: 85000, arr: 1020000, newMrr: 14000, churnedMrr: 4000 },
];

const tenantGrowthData = [
  { month: 'Jul', total: 12, new: 3, churned: 0 },
  { month: 'Aug', total: 18, new: 7, churned: 1 },
  { month: 'Sep', total: 25, new: 8, churned: 1 },
  { month: 'Oct', total: 34, new: 10, churned: 1 },
  { month: 'Nov', total: 45, new: 13, churned: 2 },
  { month: 'Dec', total: 58, new: 15, churned: 2 },
];

const featureAdoptionData = [
  { name: 'Workforce', adoption: 95, color: '#8B5CF6' },
  { name: 'Payroll', adoption: 88, color: '#06B6D4' },
  { name: 'Attendance', adoption: 82, color: '#10B981' },
  { name: 'Compliance', adoption: 75, color: '#F59E0B' },
  { name: 'Projects', adoption: 68, color: '#EF4444' },
  { name: 'BGV', adoption: 45, color: '#EC4899' },
  { name: 'AI/Proxima', adoption: 38, color: '#8B5CF6' },
  { name: 'OpZenix', adoption: 32, color: '#14B8A6' },
];

const usageMetricsData = [
  { hour: '00', apiCalls: 120, activeUsers: 15 },
  { hour: '04', apiCalls: 80, activeUsers: 8 },
  { hour: '08', apiCalls: 450, activeUsers: 45 },
  { hour: '12', apiCalls: 680, activeUsers: 72 },
  { hour: '16', apiCalls: 520, activeUsers: 58 },
  { hour: '20', apiCalls: 280, activeUsers: 32 },
];

const planDistributionData = [
  { name: 'Starter', value: 35, color: '#94A3B8' },
  { name: 'Professional', value: 42, color: '#8B5CF6' },
  { name: 'Business', value: 18, color: '#06B6D4' },
  { name: 'Enterprise', value: 5, color: '#10B981' },
];

export const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6m");
  const [realTimeStats, setRealTimeStats] = useState({
    totalMrr: 85000,
    mrrGrowth: 13.3,
    totalArr: 1020000,
    activeTenants: 58,
    tenantGrowth: 28.9,
    totalUsers: 1247,
    userGrowth: 22.4,
    avgRevenuePerTenant: 1465,
    churnRate: 3.4,
    netRevenueRetention: 112,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch real data from Supabase
        const { data: tenants } = await supabase
          .from('client_tenants')
          .select('*')
          .eq('status', 'active');
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id');

        const { data: invoices } = await supabase
          .from('invoices')
          .select('*')
          .eq('status', 'paid');

        const totalRevenue = invoices?.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0) || 0;
        
        setRealTimeStats(prev => ({
          ...prev,
          activeTenants: tenants?.length || prev.activeTenants,
          totalUsers: profiles?.length || prev.totalUsers,
          totalMrr: totalRevenue / 12 || prev.totalMrr,
          totalArr: totalRevenue || prev.totalArr,
        }));
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const kpiCards = [
    { 
      title: "Monthly Recurring Revenue", 
      value: `₹${realTimeStats.totalMrr.toLocaleString()}`,
      change: `+${realTimeStats.mrrGrowth}%`,
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10"
    },
    { 
      title: "Annual Recurring Revenue", 
      value: `₹${(realTimeStats.totalArr / 100000).toFixed(1)}L`,
      change: `+${realTimeStats.mrrGrowth}%`,
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-500/10"
    },
    { 
      title: "Active Tenants", 
      value: realTimeStats.activeTenants,
      change: `+${realTimeStats.tenantGrowth}%`,
      trend: "up",
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-500/10"
    },
    { 
      title: "Total Users", 
      value: realTimeStats.totalUsers.toLocaleString(),
      change: `+${realTimeStats.userGrowth}%`,
      trend: "up",
      icon: Users,
      color: "text-cyan-600",
      bg: "bg-cyan-500/10"
    },
    { 
      title: "Avg Revenue/Tenant", 
      value: `₹${realTimeStats.avgRevenuePerTenant.toLocaleString()}`,
      change: "+5.2%",
      trend: "up",
      icon: Target,
      color: "text-orange-600",
      bg: "bg-orange-500/10"
    },
    { 
      title: "Net Revenue Retention", 
      value: `${realTimeStats.netRevenueRetention}%`,
      change: "+2%",
      trend: "up",
      icon: Activity,
      color: "text-green-600",
      bg: "bg-green-500/10"
    },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights into platform performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <Badge 
                  variant={kpi.trend === "up" ? "default" : "destructive"} 
                  className="text-[10px] px-1.5"
                >
                  {kpi.change}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  MRR & ARR Trends
                </CardTitle>
                <CardDescription>Monthly recurring revenue growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mrrData}>
                    <defs>
                      <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `₹${v/1000}K`} />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="mrr" 
                      stroke="#8B5CF6" 
                      fill="url(#mrrGradient)"
                      name="MRR"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="newMrr" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="New MRR"
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="churnedMrr" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Churned MRR"
                      dot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Plan Distribution
                </CardTitle>
                <CardDescription>Tenants by subscription plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={planDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {planDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tenants Tab */}
        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                Tenant Growth
              </CardTitle>
              <CardDescription>New tenants and churn over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={tenantGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="new" fill="#10B981" name="New Tenants" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="churned" fill="#EF4444" name="Churned" radius={[4, 4, 0, 0]} />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    name="Total Active"
                    dot={{ r: 5, fill: '#8B5CF6' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                Feature Adoption Rates
              </CardTitle>
              <CardDescription>Percentage of tenants using each module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureAdoptionData.map((feature) => (
                  <div key={feature.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{feature.name}</span>
                      <span className="text-sm text-muted-foreground">{feature.adoption}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${feature.adoption}%`, 
                          backgroundColor: feature.color 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-600" />
                API Usage & Active Users
              </CardTitle>
              <CardDescription>Platform activity throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={usageMetricsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" className="text-xs" tickFormatter={(v) => `${v}:00`} />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="apiCalls" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="API Calls"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="activeUsers" 
                    stroke="#06B6D4" 
                    strokeWidth={2}
                    name="Active Users"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};