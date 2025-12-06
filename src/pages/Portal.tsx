import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DashboardWidgets } from "@/components/portal/DashboardWidgets";
import { ProjectWorkspace } from "@/components/portal/ProjectWorkspace";
import { FileRepository } from "@/components/portal/FileRepository";
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
  Bell,
  Search,
  Plus
} from "lucide-react";
import cropxonIcon from "@/assets/cropxon-icon.png";

const sidebarItems = [
  { name: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { name: "Projects", href: "/portal/projects", icon: FolderKanban },
  { name: "Files", href: "/portal/files", icon: FileText },
  { name: "Invoices", href: "/portal/invoices", icon: Receipt },
  { name: "Support", href: "/portal/support", icon: HeadphonesIcon },
  { name: "Meetings", href: "/portal/meetings", icon: Calendar },
  { name: "AI Dashboard", href: "/portal/ai", icon: Brain },
  { name: "Security", href: "/portal/security", icon: Shield },
  { name: "Settings", href: "/portal/settings", icon: Settings },
];

export default function Portal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/portal/login");
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
      .maybeSingle();
    setProfile(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isActive = (path: string) => {
    if (path === "/portal") return location.pathname === "/portal";
    return location.pathname.startsWith(path);
  };

  const renderContent = () => {
    const path = location.pathname;
    
    if (path === "/portal" || path === "/portal/") {
      return <DashboardWidgets />;
    }
    if (path.startsWith("/portal/projects")) {
      return <ProjectWorkspace />;
    }
    if (path.startsWith("/portal/files")) {
      return <FileRepository />;
    }
    
    // Default placeholder for other routes
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-heading font-bold mb-2">Coming Soon</h2>
        <p className="text-muted-foreground">This section is under development</p>
      </div>
    );
  };

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

          {renderContent()}
        </main>
      </div>
    </div>
  );
}
