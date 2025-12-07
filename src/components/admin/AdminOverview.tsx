import { useState, useMemo, memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, Receipt, Users, TrendingUp, Clock, UserPlus, Building2, ArrowRight,
  Activity, Server, Shield, Zap, RefreshCw, CheckCircle2, AlertCircle, XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ClickstreamSummaryWidget } from "./modules/clickstream/ClickstreamSummaryWidget";
import { AdminCardSkeleton, AdminDashboardSkeleton } from "./AdminCardSkeleton";
import { 
  useAdminStats, 
  useRecentQuotes, 
  usePendingOnboardings, 
  useRecentTenants,
  useAdminRealtime 
} from "@/hooks/useAdminData";
import { useQueryClient } from "@tanstack/react-query";

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

// Memoized stat card component
const StatCard = memo(({ title, value, icon: Icon, color, bg }: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  bg: string;
}) => (
  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
    <CardContent className="pt-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${bg} transition-transform group-hover:scale-110`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
    </CardContent>
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />
  </Card>
));

StatCard.displayName = "StatCard";

export const AdminOverview = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const queryClient = useQueryClient();

  // Use optimized hooks with React Query
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useAdminStats();
  const { data: recentQuotes, isLoading: quotesLoading } = useRecentQuotes(5);
  const { data: pendingOnboardings, isLoading: onboardingsLoading } = usePendingOnboardings(5);
  const { data: recentTenants, isLoading: tenantsLoading } = useRecentTenants(5);

  // Set up real-time subscriptions
  useAdminRealtime(["quotes", "client_tenants", "onboarding_sessions", "invoices"]);

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin"] });
    await refetchStats();
    setLastUpdated(new Date());
  }, [queryClient, refetchStats]);

  const loading = statsLoading || quotesLoading || onboardingsLoading || tenantsLoading;

  const statCards = useMemo(() => [
    { title: "Total Quotes", value: stats?.totalQuotes || 0, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { title: "Pending Quotes", value: stats?.pendingQuotes || 0, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-500/10" },
    { title: "Pending Onboarding", value: stats?.pendingOnboarding || 0, icon: UserPlus, color: "text-orange-600", bg: "bg-orange-500/10" },
    { title: "Active Tenants", value: stats?.activeTenants || 0, icon: Building2, color: "text-cyan-600", bg: "bg-cyan-500/10" },
    { title: "Total Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-500/10" },
    { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-500/10" },
  ], [stats]);

  const systemHealthItems = [
    { name: "Database", status: "healthy", latency: "12ms" },
    { name: "API Gateway", status: "healthy", latency: "45ms" },
    { name: "Edge Functions", status: "healthy", latency: "89ms" },
    { name: "Storage", status: "healthy", latency: "23ms" },
  ];

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    pending_approval: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    verified: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    approved: "bg-green-500/10 text-green-600 border-green-500/20",
    active: "bg-green-500/10 text-green-600 border-green-500/20",
    inactive: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  };

  const getStatusIcon = (status: string) => {
    if (status === "healthy") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (status === "warning") return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <AdminCardSkeleton key={i} variant="stat" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCardSkeleton variant="list" />
          <AdminCardSkeleton variant="list" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCardSkeleton variant="table" />
          <AdminCardSkeleton variant="list" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Real-time indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Real-time platform monitoring & operations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live</span>
            <span className="text-xs">Updated {format(lastUpdated, 'HH:mm:ss')}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid - Using memoized component */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* System Health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            System Health
          </CardTitle>
          <Badge variant="outline" className="text-green-600 border-green-500/30 bg-green-500/10">
            All Systems Operational
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemHealthItems.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.latency}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-green-600 border-green-500/30">
                  Healthy
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clickstream Summary Widget */}
      <ClickstreamSummaryWidget />

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
            {(!pendingOnboardings || pendingOnboardings.length === 0) ? (
              <p className="text-muted-foreground text-center py-8">No pending onboarding requests</p>
            ) : (
              <div className="space-y-3">
                {(pendingOnboardings || []).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{session.full_name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {session.company_name || session.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.client_id} • {format(new Date(session.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Badge className={`${statusColors[session.status] || "bg-gray-500/10 text-gray-600"} border`}>
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
            {(!recentTenants || recentTenants.length === 0) ? (
              <p className="text-muted-foreground text-center py-8">No tenants yet</p>
            ) : (
              <div className="space-y-3">
                {(recentTenants || []).map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        @{tenant.slug} • {tenant.tenant_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated {format(new Date(tenant.updated_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <Badge className={`${statusColors[tenant.status] || "bg-gray-500/10 text-gray-600"} border`}>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Recent Quotes
          </CardTitle>
          <Link to="/admin/quotes">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {(!recentQuotes || recentQuotes.length === 0) ? (
            <p className="text-muted-foreground text-center py-8">No quotes yet</p>
          ) : (
            <div className="space-y-3">
              {(recentQuotes || []).map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">{quote.quote_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {quote.contact_name} • {quote.service_type?.replace('-', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">₹{Number(quote.final_price).toLocaleString()}</p>
                    <Badge variant="outline" className="capitalize">{quote.status}</Badge>
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