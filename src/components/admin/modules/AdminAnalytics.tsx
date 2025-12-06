import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, TrendingUp, Users, FileText, Receipt, DollarSign, Eye, MousePointer } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";

const COLORS = ['#8B5CF6', '#06B6D4', '#EC4899', '#10B981', '#F59E0B'];

export const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuotes: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingOnboarding: 0,
    pageViews: 0,
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [clickstreamData, setClickstreamData] = useState<any[]>([]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch counts
      const [usersRes, quotesRes, invoicesRes, onboardingRes, clickstreamRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('quotes').select('*'),
        supabase.from('invoices').select('*'),
        supabase.from('client_onboarding').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('clickstream_events').select('*').order('created_at', { ascending: false }).limit(100),
      ]);

      const quotes = quotesRes.data || [];
      const invoices = invoicesRes.data || [];
      const totalRevenue = invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + Number(i.total_amount || 0), 0);

      setStats({
        totalUsers: usersRes.count || 0,
        totalQuotes: quotes.length,
        totalInvoices: invoices.length,
        totalRevenue,
        pendingOnboarding: onboardingRes.count || 0,
        pageViews: clickstreamRes.data?.length || 0,
      });

      // Generate revenue trend data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const revenueByDay = last7Days.map(day => {
        const dayRevenue = invoices
          .filter(i => i.created_at?.startsWith(day) && i.status === 'paid')
          .reduce((sum, i) => sum + Number(i.total_amount || 0), 0);
        return { date: day.slice(5), revenue: dayRevenue };
      });
      setRevenueData(revenueByDay);

      // Service type distribution
      const serviceCount: Record<string, number> = {};
      quotes.forEach(q => {
        const service = q.service_type || 'Other';
        serviceCount[service] = (serviceCount[service] || 0) + 1;
      });
      setServiceData(Object.entries(serviceCount).map(([name, value]) => ({ name, value })));

      // Clickstream by event type
      const eventCount: Record<string, number> = {};
      (clickstreamRes.data || []).forEach((e: any) => {
        const type = e.event_type || 'unknown';
        eventCount[type] = (eventCount[type] || 0) + 1;
      });
      setClickstreamData(Object.entries(eventCount).map(([name, value]) => ({ name, value })));

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Real-time subscriptions
    const channel = supabase
      .channel('admin-analytics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, fetchAnalytics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quotes' }, fetchAnalytics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clickstream_events' }, fetchAnalytics)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Total Quotes", value: stats.totalQuotes, icon: FileText, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { title: "Total Invoices", value: stats.totalInvoices, icon: Receipt, color: "text-pink-500", bg: "bg-pink-500/10" },
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Pending Approvals", value: stats.pendingOnboarding, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Page Views (24h)", value: stats.pageViews, icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time business intelligence</p>
        </div>
        <Button onClick={fetchAnalytics} disabled={loading} variant="outline" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Service Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Clickstream Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clickstreamData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#06B6D4" name="Events" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
