import { useState, useMemo, memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Receipt, Users, TrendingUp, Clock, UserPlus, Building2, ArrowRight,
  Activity, Server, Shield, Zap, RefreshCw, CheckCircle2, AlertCircle, XCircle,
  MousePointer, Megaphone, Target, Brain, BarChart3, Settings, CreditCard,
  Database, Globe, Lock, Package, ClipboardList, Calendar, HeadphonesIcon,
  FolderKanban, Mail, Gauge, ShieldCheck, Key, Bell, Plug, FileCode
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ClickstreamSummaryWidget } from "./modules/clickstream/ClickstreamSummaryWidget";
import { AdminCardSkeleton } from "./AdminCardSkeleton";
import { DraggableWidget } from "./DraggableWidget";
import { DashboardEditControls } from "./DashboardEditControls";
import { useDashboardLayout, WidgetConfig } from "@/hooks/useDashboardLayout";
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
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Dashboard layout management
  const {
    widgets,
    isEditMode,
    setIsEditMode,
    setIsDragging,
    reorderWidgets,
    resizeWidget,
    toggleWidget,
    resetLayout,
  } = useDashboardLayout();

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

  // Quick action items for all admin functionalities
  const quickActions = useMemo(() => [
    // Tenant & Client Management
    { name: "Tenants", icon: Building2, path: "/admin/tenants", color: "text-cyan-600", bg: "bg-cyan-500/10" },
    { name: "Users", icon: Users, path: "/admin/users", color: "text-purple-600", bg: "bg-purple-500/10" },
    { name: "Onboarding", icon: UserPlus, path: "/admin/onboarding-tracker", color: "text-orange-600", bg: "bg-orange-500/10" },
    { name: "Client Health", icon: Activity, path: "/admin/client-health", color: "text-green-600", bg: "bg-green-500/10" },
    
    // Sales & Revenue
    { name: "Quotes", icon: FileText, path: "/admin/quotes", color: "text-primary", bg: "bg-primary/10" },
    { name: "Invoices", icon: Receipt, path: "/admin/invoices", color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { name: "CRM", icon: Target, path: "/admin/crm", color: "text-rose-600", bg: "bg-rose-500/10" },
    { name: "Pipeline", icon: TrendingUp, path: "/admin/pipeline", color: "text-blue-600", bg: "bg-blue-500/10" },
    { name: "Revenue", icon: CreditCard, path: "/admin/revenue", color: "text-green-600", bg: "bg-green-500/10" },
    { name: "Pricing", icon: Gauge, path: "/admin/pricing", color: "text-amber-600", bg: "bg-amber-500/10" },
    
    // Marketing & Analytics
    { name: "Clickstream", icon: MousePointer, path: "/admin/clickstream", color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { name: "Analytics", icon: BarChart3, path: "/admin/analytics", color: "text-violet-600", bg: "bg-violet-500/10" },
    { name: "Marketing", icon: Megaphone, path: "/admin/marketing", color: "text-pink-600", bg: "bg-pink-500/10" },
    { name: "Lead Scoring", icon: Target, path: "/admin/lead-scoring", color: "text-orange-600", bg: "bg-orange-500/10" },
    { name: "Email Campaigns", icon: Mail, path: "/admin/email-campaigns", color: "text-sky-600", bg: "bg-sky-500/10" },
    { name: "A/B Testing", icon: Zap, path: "/admin/ab-testing", color: "text-yellow-600", bg: "bg-yellow-500/10" },
    
    // Operations
    { name: "Projects", icon: FolderKanban, path: "/admin/projects", color: "text-teal-600", bg: "bg-teal-500/10" },
    { name: "Tickets", icon: HeadphonesIcon, path: "/admin/tickets", color: "text-red-600", bg: "bg-red-500/10" },
    { name: "Meetings", icon: Calendar, path: "/admin/meetings", color: "text-blue-600", bg: "bg-blue-500/10" },
    { name: "Files", icon: FileCode, path: "/admin/files", color: "text-slate-600", bg: "bg-slate-500/10" },
    
    // AI & Intelligence
    { name: "AI Dashboard", icon: Brain, path: "/admin/ai", color: "text-fuchsia-600", bg: "bg-fuchsia-500/10" },
    { name: "Predictive", icon: TrendingUp, path: "/admin/predictive", color: "text-violet-600", bg: "bg-violet-500/10" },
    
    // Infrastructure
    { name: "MSP Monitor", icon: Server, path: "/admin/msp", color: "text-gray-600", bg: "bg-gray-500/10" },
    { name: "Database", icon: Database, path: "/admin/database", color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { name: "Cloud", icon: Globe, path: "/admin/cloud", color: "text-sky-600", bg: "bg-sky-500/10" },
    { name: "API Gateway", icon: Plug, path: "/admin/api-gateway", color: "text-indigo-600", bg: "bg-indigo-500/10" },
    
    // Security & Compliance
    { name: "Security", icon: Shield, path: "/admin/security", color: "text-red-600", bg: "bg-red-500/10" },
    { name: "Access Control", icon: Lock, path: "/admin/access-control", color: "text-amber-600", bg: "bg-amber-500/10" },
    { name: "Audit Logs", icon: ClipboardList, path: "/admin/audit", color: "text-slate-600", bg: "bg-slate-500/10" },
    { name: "Threats", icon: ShieldCheck, path: "/admin/threats", color: "text-rose-600", bg: "bg-rose-500/10" },
    
    // Platform Settings
    { name: "Plugins", icon: Package, path: "/admin/plugins", color: "text-purple-600", bg: "bg-purple-500/10" },
    { name: "Integrations", icon: Plug, path: "/admin/integrations", color: "text-blue-600", bg: "bg-blue-500/10" },
    { name: "API Keys", icon: Key, path: "/admin/api-keys", color: "text-amber-600", bg: "bg-amber-500/10" },
    { name: "Notifications", icon: Bell, path: "/admin/notifications", color: "text-pink-600", bg: "bg-pink-500/10" },
    { name: "Settings", icon: Settings, path: "/admin/settings", color: "text-gray-600", bg: "bg-gray-500/10" },
  ], []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Animated Loading Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ 
                    y: [0, -8, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Loading dashboard...</span>
          </div>
        </motion.div>
        
        {/* Stats Skeleton with staggered animation */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <AdminCardSkeleton variant="stat" />
            </motion.div>
          ))}
        </div>
        
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <AdminCardSkeleton variant="list" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Handle drag end
  const handleDragEnd = useCallback(
    (sourceId: string) => (targetId: string | null) => {
      setIsDragging(false);
      if (targetId && targetId !== sourceId) {
        reorderWidgets(sourceId, targetId);
      }
    },
    [reorderWidgets, setIsDragging]
  );

  // Widget renderer
  const renderWidget = (widgetId: string) => {
    const widget = widgets.find((w) => w.id === widgetId);
    if (!widget) return null;

    const content = (() => {
      switch (widgetId) {
        case "stats":
          return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {statCards.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
          );
        case "system-health":
          return (
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
          );
        case "clickstream":
          return <ClickstreamSummaryWidget />;
        case "onboarding":
          return (
            <Card className="h-full">
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
          );
        case "tenants":
          return (
            <Card className="h-full">
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
          );
        case "quotes":
          return (
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
          );
        case "quick-actions":
          return (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.path}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <Link to={action.path}>
                        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 border border-transparent hover:border-primary/20 transition-all duration-200 group cursor-pointer">
                          <div className={`p-2.5 rounded-lg ${action.bg} group-hover:scale-110 transition-transform`}>
                            <action.icon className={`h-5 w-5 ${action.color}`} />
                          </div>
                          <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors line-clamp-1">
                            {action.name}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        default:
          return null;
      }
    })();

    return (
      <DraggableWidget
        key={widget.id}
        widget={widget}
        isEditMode={isEditMode}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd(widget.id)}
        onResize={(size) => resizeWidget(widget.id, size)}
        onToggleVisibility={() => toggleWidget(widget.id)}
        dragOverId={dragOverId}
        setDragOverId={setDragOverId}
      >
        {content}
      </DraggableWidget>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with Real-time indicator and Customize button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Real-time platform monitoring & operations</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live</span>
            <span className="text-xs">Updated {format(lastUpdated, 'HH:mm:ss')}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <DashboardEditControls
            isEditMode={isEditMode}
            widgets={widgets}
            onToggleEditMode={() => setIsEditMode(!isEditMode)}
            onResetLayout={resetLayout}
            onToggleWidget={toggleWidget}
          />
        </div>
      </div>

      {/* Edit Mode Banner */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Zap className="h-5 w-5 text-primary" />
                </motion.div>
                <span className="font-medium text-primary">Edit Mode Active</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Drag widgets to reorder • Click size icons to resize • Click eye icon to hide/show
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draggable Dashboard Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {widgets
            .filter((w) => w.visible || isEditMode)
            .sort((a, b) => a.order - b.order)
            .map((widget) => renderWidget(widget.id))}
        </AnimatePresence>
      </div>
    </div>
  );
};