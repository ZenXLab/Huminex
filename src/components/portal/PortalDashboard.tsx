import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FolderKanban, Receipt, HeadphonesIcon, Calendar, ArrowUpRight, ChevronRight, 
  FileText, Clock, Zap, RefreshCw, Settings, BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEmployeeRole, EmployeeRole } from "@/hooks/useEmployeeRole";
import { usePortalDashboardLayout, PortalWidgetConfig, portalWidgetCatalog, getPortalPresets } from "@/hooks/usePortalDashboardLayout";

// Import widgets
import { AttendanceWidget } from "./widgets/AttendanceWidget";
import { LeaveBalanceWidget } from "./widgets/LeaveBalanceWidget";
import { PayslipWidget } from "./widgets/PayslipWidget";
import { TasksWidget } from "./widgets/TasksWidget";
import { ExpenseClaimsWidget } from "./widgets/ExpenseClaimsWidget";
import { AnnouncementsWidget } from "./widgets/AnnouncementsWidget";
import { TeamOverviewWidget } from "./widgets/TeamOverviewWidget";
import { ApprovalsWidget } from "./widgets/ApprovalsWidget";
import { TeamAttendanceWidget } from "./widgets/TeamAttendanceWidget";
import { InvoicesWidget } from "./widgets/InvoicesWidget";
import { TicketsWidget } from "./widgets/TicketsWidget";

interface PortalDashboardProps {
  userId?: string;
}

export const PortalDashboard = ({ userId }: PortalDashboardProps) => {
  const { role } = useEmployeeRole();
  const { 
    widgets, activePreset, isEditMode, setIsEditMode, 
    reorderWidgets, toggleWidget, applyPreset, resetLayout, presets 
  } = usePortalDashboardLayout(role);

  const { data: projects } = useQuery({
    queryKey: ["portal-projects", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("projects").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
    enabled: !!userId,
  });

  const { data: invoices } = useQuery({
    queryKey: ["portal-invoices", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("invoices").select("*").eq("user_id", userId).limit(5);
      return data || [];
    },
    enabled: !!userId,
  });

  const { data: tickets } = useQuery({
    queryKey: ["portal-tickets", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("support_tickets").select("*").eq("user_id", userId).limit(5);
      return data || [];
    },
    enabled: !!userId,
  });

  const { data: meetings } = useQuery({
    queryKey: ["portal-meetings", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("meetings").select("*").eq("user_id", userId).gte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(3);
      return data || [];
    },
    enabled: !!userId,
  });

  const pendingInvoiceAmount = invoices?.filter(i => i.status !== "paid").reduce((sum, i) => sum + Number(i.total_amount || 0), 0) || 0;
  const openTickets = tickets?.filter(t => t.status === "open" || t.status === "in_progress").length || 0;

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case "quick-stats":
        return <QuickStatsWidget projects={projects} pendingAmount={pendingInvoiceAmount} openTickets={openTickets} meetingsCount={meetings?.length || 0} />;
      case "projects":
        return <ProjectsWidget projects={projects} />;
      case "quick-actions":
        return <QuickActionsWidget />;
      case "meetings":
        return <MeetingsWidget meetings={meetings} />;
      case "attendance":
        return <AttendanceWidget />;
      case "leave-balance":
        return <LeaveBalanceWidget />;
      case "payslip":
        return <PayslipWidget />;
      case "tasks":
        return <TasksWidget />;
      case "expense-claims":
        return <ExpenseClaimsWidget />;
      case "announcements":
        return <AnnouncementsWidget />;
      case "team-overview":
        return <TeamOverviewWidget />;
      case "approvals":
        return <ApprovalsWidget />;
      case "team-attendance":
        return <TeamAttendanceWidget />;
      case "invoices":
        return <InvoicesWidget />;
      case "tickets":
        return <TicketsWidget />;
      default:
        return null;
    }
  };

  const getWidgetGridClass = (size: PortalWidgetConfig["size"]) => {
    switch (size) {
      case "small": return "col-span-1";
      case "medium": return "col-span-1 lg:col-span-1";
      case "large": return "col-span-1 lg:col-span-2";
      case "full": return "col-span-1 lg:col-span-3";
      default: return "col-span-1";
    }
  };

  const visibleWidgets = widgets.filter(w => w.visible);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Welcome back! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening today. <Badge variant="secondary" className="ml-2 text-xs capitalize">{role}</Badge></p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={activePreset || ""} 
            onChange={(e) => applyPreset(e.target.value)}
            className="h-9 px-3 text-sm bg-background border border-input rounded-md"
          >
            <option value="" disabled>Select Preset</option>
            {presets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <Button variant="outline" size="sm" onClick={() => setIsEditMode(!isEditMode)} className="gap-2">
            <Settings className="w-4 h-4" />
            {isEditMode ? "Done" : "Customize"}
          </Button>
          <Button size="sm" onClick={() => window.location.reload()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Edit Mode Bar */}
      {isEditMode && (
        <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-foreground">Click widgets to toggle visibility. Drag to reorder.</p>
          <Button variant="ghost" size="sm" onClick={resetLayout}>Reset to Default</Button>
        </div>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {visibleWidgets.map((widget) => (
          <div 
            key={widget.id} 
            className={`${getWidgetGridClass(widget.size)} ${isEditMode ? 'ring-2 ring-primary/30 ring-dashed cursor-pointer' : ''}`}
            onClick={() => isEditMode && toggleWidget(widget.id)}
          >
            {renderWidget(widget.id)}
          </div>
        ))}
      </div>

      {/* Hidden Widgets (Edit Mode) */}
      {isEditMode && widgets.filter(w => !w.visible).length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Hidden Widgets (click to show)</p>
          <div className="flex flex-wrap gap-2">
            {widgets.filter(w => !w.visible).map((widget) => {
              const meta = portalWidgetCatalog.find(m => m.id === widget.id);
              return (
                <Button key={widget.id} variant="outline" size="sm" onClick={() => toggleWidget(widget.id)} className="opacity-60">
                  {meta?.name || widget.id}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
const QuickStatsWidget = ({ projects, pendingAmount, openTickets, meetingsCount }: any) => {
  const stats = [
    { label: "Active Projects", value: projects?.filter((p: any) => p.status === "active").length || 0, icon: FolderKanban, color: "from-purple-400 to-purple-600" },
    { label: "Pending Invoices", value: `₹${pendingAmount.toLocaleString()}`, icon: Receipt, color: "from-cyan-400 to-teal-500" },
    { label: "Open Tickets", value: openTickets, icon: HeadphonesIcon, color: "from-pink-400 to-rose-500" },
    { label: "Upcoming Meetings", value: meetingsCount, icon: Calendar, color: "from-emerald-400 to-green-500" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="group hover:border-primary/30 transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-heading font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const ProjectsWidget = ({ projects }: any) => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-primary" />Your Projects
        </CardTitle>
        <Link to="/portal/projects"><Button variant="ghost" size="sm" className="text-xs gap-1">View All <ChevronRight className="w-3 h-3" /></Button></Link>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {projects?.slice(0, 3).map((project: any) => (
        <div key={project.id} className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-foreground">{project.name}</p>
            <Badge variant="secondary" className="text-xs">{project.status}</Badge>
          </div>
          <Progress value={project.progress || 0} className="h-1.5" />
        </div>
      )) || <p className="text-sm text-muted-foreground text-center py-4">No projects yet</p>}
    </CardContent>
  </Card>
);

const QuickActionsWidget = () => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-medium flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />Quick Actions</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { name: "Create Ticket", icon: HeadphonesIcon, href: "/portal/tickets", color: "bg-purple-500" },
          { name: "Upload Files", icon: FileText, href: "/portal/files", color: "bg-cyan-500" },
          { name: "Book Meeting", icon: Calendar, href: "/portal/meetings", color: "bg-pink-500" },
          { name: "View Invoices", icon: Receipt, href: "/portal/invoices", color: "bg-emerald-500" },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.name} to={action.href}>
              <button className="w-full p-4 bg-card border border-border/60 rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all text-center group">
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-medium text-foreground">{action.name}</p>
              </button>
            </Link>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

const MeetingsWidget = ({ meetings }: any) => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-medium flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />Upcoming Meetings</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {meetings?.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No upcoming meetings</p>
      ) : (
        meetings?.map((meeting: any) => (
          <div key={meeting.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{meeting.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(meeting.scheduled_at).toLocaleDateString()} at {new Date(meeting.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))
      )}
    </CardContent>
  </Card>
);
