import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Receipt, Users, MessageSquare, TrendingUp, Clock, UserPlus, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface OnboardingSession {
  id: string;
  client_id: string;
  full_name: string;
  email: string;
  company_name: string | null;
  client_type: string;
  status: string;
  created_at: string;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  tenant_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalQuotes: 0,
    pendingQuotes: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalInquiries: 0,
    pendingOnboarding: 0,
    activeTenants: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [pendingOnboardings, setPendingOnboardings] = useState<OnboardingSession[]>([]);
  const [recentTenants, setRecentTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch quotes
        const { data: quotes } = await supabase.from('quotes').select('*');
        const pendingQuotes = quotes?.filter(q => q.status === 'pending') || [];

        // Fetch invoices
        const { data: invoices } = await supabase.from('invoices').select('*');
        const paidInvoices = invoices?.filter(i => i.status === 'paid') || [];
        const totalRevenue = paidInvoices.reduce((sum, i) => sum + Number(i.total_amount), 0);

        // Fetch users
        const { data: users } = await supabase.from('profiles').select('id');

        // Fetch inquiries
        const { data: inquiries } = await supabase.from('inquiries').select('id');

        // Recent quotes
        const { data: recent } = await supabase
          .from('quotes')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch pending onboarding sessions
        const { data: onboardings } = await supabase
          .from('onboarding_sessions')
          .select('*')
          .in('status', ['new', 'pending', 'pending_approval', 'verified'])
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch recent tenants
        const { data: tenants } = await supabase
          .from('client_tenants')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(5);

        // Count active tenants
        const activeTenants = tenants?.filter(t => t.status === 'active')?.length || 0;

        setStats({
          totalQuotes: quotes?.length || 0,
          pendingQuotes: pendingQuotes.length,
          totalInvoices: invoices?.length || 0,
          totalRevenue,
          totalUsers: users?.length || 0,
          totalInquiries: inquiries?.length || 0,
          pendingOnboarding: onboardings?.length || 0,
          activeTenants,
        });
        setRecentQuotes(recent || []);
        setPendingOnboardings(onboardings || []);
        setRecentTenants(tenants || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Quotes", value: stats.totalQuotes, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { title: "Pending Quotes", value: stats.pendingQuotes, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
    { title: "Pending Onboarding", value: stats.pendingOnboarding, icon: UserPlus, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Active Tenants", value: stats.activeTenants, icon: Building2, color: "text-cyan-600", bg: "bg-cyan-100" },
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    pending_approval: "bg-orange-100 text-orange-700",
    verified: "bg-cyan-100 text-cyan-700",
    approved: "bg-green-100 text-green-700",
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-700",
  };

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-xl" />
        ))}
      </div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Admin Overview</h1>
        <p className="text-muted-foreground">Monitor your business performance at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout for Widgets */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Onboarding Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-orange-600" />
              Pending Onboarding
            </CardTitle>
            <Link to="/admin/onboarding-tracker">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingOnboardings.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending onboarding requests</p>
            ) : (
              <div className="space-y-3">
                {pendingOnboardings.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{session.full_name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {session.company_name || session.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.client_id} • {format(new Date(session.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Badge className={statusColors[session.status] || "bg-gray-100 text-gray-700"}>
                      {session.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tenant Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-cyan-600" />
              Recent Tenants
            </CardTitle>
            <Link to="/admin/tenants">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentTenants.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No tenants yet</p>
            ) : (
              <div className="space-y-3">
                {recentTenants.map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        @{tenant.slug} • {tenant.tenant_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated {format(new Date(tenant.updated_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <Badge className={statusColors[tenant.status] || "bg-gray-100 text-gray-700"}>
                      {tenant.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Quotes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentQuotes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No quotes yet</p>
          ) : (
            <div className="space-y-4">
              {recentQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{quote.quote_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {quote.contact_name} • {quote.service_type.replace('-', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">₹{Number(quote.final_price).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground capitalize">{quote.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};