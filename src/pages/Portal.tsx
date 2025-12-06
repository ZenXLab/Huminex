import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card";
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Receipt, 
  HeadphonesIcon, 
  Calendar, 
  Brain, 
  Shield, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ArrowUpRight,
  Plus
} from "lucide-react";
import cropxonIcon from "@/assets/cropxon-icon.png";

const sidebarItems = [
  { name: "Overview", href: "/portal", icon: LayoutDashboard },
  { name: "Projects", href: "/portal/projects", icon: FolderKanban },
  { name: "Documents", href: "/portal/documents", icon: FileText },
  { name: "Invoices", href: "/portal/invoices", icon: Receipt },
  { name: "Support", href: "/portal/support", icon: HeadphonesIcon },
  { name: "Meetings", href: "/portal/meetings", icon: Calendar },
  { name: "AI Dashboard", href: "/portal/ai", icon: Brain },
  { name: "Security", href: "/portal/security", icon: Shield },
  { name: "Settings", href: "/portal/settings", icon: Settings },
];

const quickStats = [
  { label: "Active Projects", value: "3", icon: FolderKanban, color: "from-purple-400 to-purple-600", change: "+1 this month" },
  { label: "Pending Invoices", value: "₹45,000", icon: Receipt, color: "from-cyan-400 to-teal-500", change: "2 due soon" },
  { label: "Support Tickets", value: "1", icon: HeadphonesIcon, color: "from-pink-400 to-rose-500", change: "Open ticket" },
  { label: "Meetings", value: "2", icon: Calendar, color: "from-emerald-400 to-green-500", change: "This week" },
];

const recentProjects = [
  { name: "E-Commerce Platform", status: "In Progress", progress: 65, phase: "Development" },
  { name: "Mobile App MVP", status: "Review", progress: 90, phase: "Testing" },
  { name: "AI Chatbot Integration", status: "Planning", progress: 20, phase: "Discovery" },
];

const quickActions = [
  { name: "Create Ticket", icon: Plus, color: "bg-purple-500" },
  { name: "Upload Files", icon: FileText, color: "bg-cyan-500" },
  { name: "Book Meeting", icon: Calendar, color: "bg-pink-500" },
  { name: "View Invoice", icon: Receipt, color: "bg-emerald-500" },
];

export default function Portal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/onboarding");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-card border-r border-border/60 z-50
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-border/60">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={cropxonIcon} alt="ATLAS" className="h-9 w-9" />
              <div>
                <span className="text-foreground font-heading font-bold text-sm block">CropXon</span>
                <span className="text-primary font-heading font-semibold text-xs">ATLAS Portal</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                    ${active 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-primary" : "group-hover:text-foreground"}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.full_name || "Client"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-xl border-b border-border/60">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 text-foreground hover:bg-muted/50 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 w-64">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <Button size="sm" className="gap-2 shadow-purple hidden sm:flex">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-1">
              Welcome back, {profile?.full_name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your projects today.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <PremiumCard 
                  key={stat.label} 
                  className="group"
                  hoverable
                  glowColor="purple"
                >
                  <PremiumCardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-2xl font-heading font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xs text-primary mt-2">{stat.change}</p>
                  </PremiumCardContent>
                </PremiumCard>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Active Projects */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">Active Projects</h2>
                <Button variant="ghost" size="sm" className="text-primary gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <PremiumCard key={index} className="group" hoverable glowColor="cyan">
                    <PremiumCardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-foreground mb-1">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.phase}</p>
                        </div>
                        <span className={`
                          px-2.5 py-1 rounded-full text-xs font-medium
                          ${project.status === "In Progress" ? "bg-primary/10 text-primary" : ""}
                          ${project.status === "Review" ? "bg-amber-500/10 text-amber-500" : ""}
                          ${project.status === "Planning" ? "bg-muted text-muted-foreground" : ""}
                        `}>
                          {project.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </PremiumCardContent>
                  </PremiumCard>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Quick Actions</h2>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.name}
                      className="p-4 bg-card border border-border/60 rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center group"
                    >
                      <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-medium text-foreground">{action.name}</p>
                    </button>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Activity</h2>
              <PremiumCard variant="outlined">
                <PremiumCardContent className="p-4 space-y-4">
                  {[
                    { icon: CheckCircle2, text: "Project milestone approved", time: "2h ago", color: "text-emerald" },
                    { icon: FileText, text: "New document uploaded", time: "5h ago", color: "text-primary" },
                    { icon: Receipt, text: "Invoice #INV-001 sent", time: "1d ago", color: "text-accent" },
                  ].map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <Icon className={`w-4 h-4 mt-0.5 ${activity.color}`} />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{activity.text}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </PremiumCardContent>
              </PremiumCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
