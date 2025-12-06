import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FolderKanban, 
  Receipt, 
  HeadphonesIcon, 
  Calendar,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  FileText,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

interface PortalDashboardProps {
  userId?: string;
}

export const PortalDashboard = ({ userId }: PortalDashboardProps) => {
  const { data: projects } = useQuery({
    queryKey: ["portal-projects", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: invoices } = useQuery({
    queryKey: ["portal-invoices", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: tickets } = useQuery({
    queryKey: ["portal-tickets", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: meetings } = useQuery({
    queryKey: ["portal-meetings", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("user_id", userId)
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const pendingInvoiceAmount = invoices?.filter(i => i.status !== "paid").reduce((sum, i) => sum + Number(i.total_amount || 0), 0) || 0;
  const openTickets = tickets?.filter(t => t.status === "open" || t.status === "in_progress").length || 0;

  const quickStats = [
    { label: "Active Projects", value: projects?.filter(p => p.status === "active").length || 0, icon: FolderKanban, color: "from-purple-400 to-purple-600" },
    { label: "Pending Invoices", value: `₹${pendingInvoiceAmount.toLocaleString()}`, icon: Receipt, color: "from-cyan-400 to-teal-500" },
    { label: "Open Tickets", value: openTickets, icon: HeadphonesIcon, color: "from-pink-400 to-rose-500" },
    { label: "Upcoming Meetings", value: meetings?.length || 0, icon: Calendar, color: "from-emerald-400 to-green-500" },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-primary/20 text-primary",
      planning: "bg-muted text-muted-foreground",
      review: "bg-yellow-500/20 text-yellow-500",
      completed: "bg-green-500/20 text-green-500",
    };
    return styles[status] || styles.active;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-1">
          Welcome back! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-foreground">Your Projects</h2>
            <Link to="/portal/projects">
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {projects?.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No projects yet. Contact us to get started!
                </CardContent>
              </Card>
            ) : (
              projects?.slice(0, 3).map((project) => (
                <Card key={project.id} className="group hover:border-primary/30 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-foreground mb-1">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.phase}</p>
                      </div>
                      <Badge className={getStatusBadge(project.status)}>{project.status}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
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
          </div>

          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Upcoming Meetings</h2>
            <Card>
              <CardContent className="p-4 space-y-3">
                {meetings?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No upcoming meetings</p>
                ) : (
                  meetings?.map((meeting) => (
                    <div key={meeting.id} className="flex items-center gap-3">
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
          </div>
        </div>
      </div>
    </div>
  );
};
