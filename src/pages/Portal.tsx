import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useClientTier } from "@/hooks/useClientTier";
import { useEmployeeRole, isModuleAccessibleByRole, EmployeeRole } from "@/hooks/useEmployeeRole";
import { TierUpgradePrompt, getRequiredTierForModule } from "@/components/portal/TierUpgradePrompt";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { PortalDashboard } from "@/components/portal/PortalDashboard";
import { PortalProjects } from "@/components/portal/PortalProjects";
import { PortalFiles } from "@/components/portal/PortalFiles";
import { PortalInvoices } from "@/components/portal/PortalInvoices";
import { PortalTickets } from "@/components/portal/PortalTickets";
import { PortalMeetings } from "@/components/portal/PortalMeetings";
import { PortalTeam } from "@/components/portal/PortalTeam";
import { PortalSettings } from "@/components/portal/PortalSettings";
import { PortalAIDashboard } from "@/components/portal/PortalAIDashboard";
import { PortalFeedback } from "@/components/portal/PortalFeedback";
import { PortalResources } from "@/components/portal/PortalResources";
import { PortalMSPMonitoring } from "@/components/portal/PortalMSPMonitoring";
import { NotificationBell } from "@/components/portal/NotificationBell";
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Receipt, 
  HeadphonesIcon, 
  Calendar, 
  Brain, 
  Settings, 
  LogOut,
  Menu,
  Search,
  Plus,
  Users,
  Star,
  BookOpen,
  Server,
  Crown,
  Lock
} from "lucide-react";
import cropxonIcon from "@/assets/cropxon-icon.png";
import { cn } from "@/lib/utils";

const allSidebarItems = [
  { name: "Dashboard", href: "/portal", icon: LayoutDashboard, section: "Overview" },
  { name: "Projects", href: "/portal/projects", icon: FolderKanban, section: "Work" },
  { name: "Files", href: "/portal/files", icon: FileText, section: "Work" },
  { name: "Invoices", href: "/portal/invoices", icon: Receipt, section: "Billing" },
  { name: "Tickets", href: "/portal/tickets", icon: HeadphonesIcon, section: "Support" },
  { name: "Meetings", href: "/portal/meetings", icon: Calendar, section: "Support" },
  { name: "AI Dashboard", href: "/portal/ai", icon: Brain, section: "AI & Monitoring" },
  { name: "MSP Monitoring", href: "/portal/msp", icon: Server, section: "AI & Monitoring" },
  { name: "Team", href: "/portal/team", icon: Users, section: "More" },
  { name: "Feedback", href: "/portal/feedback", icon: Star, section: "More" },
  { name: "Resources", href: "/portal/resources", icon: BookOpen, section: "More" },
  { name: "Settings", href: "/portal/settings", icon: Settings, section: "Account" },
];

const roleLabels: Record<EmployeeRole, string> = {
  staff: "Staff",
  hr: "HR",
  manager: "Manager",
  finance: "Finance",
  admin: "Admin"
};

const roleColors: Record<EmployeeRole, string> = {
  staff: "bg-gray-500/10 text-gray-600",
  hr: "bg-pink-500/10 text-pink-600",
  manager: "bg-blue-500/10 text-blue-600",
  finance: "bg-green-500/10 text-green-600",
  admin: "bg-purple-500/10 text-purple-600"
};

const tierColors: Record<string, string> = {
  basic: "bg-gray-500/10 text-gray-600",
  standard: "bg-blue-500/10 text-blue-600",
  advanced: "bg-purple-500/10 text-purple-600",
  enterprise: "bg-amber-500/10 text-amber-600",
};

export default function Portal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { tier, isModuleAllowed, loading: tierLoading } = useClientTier();
  const { role: employeeRole, loading: roleLoading } = useEmployeeRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/portal/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && !user.id.startsWith("dev-")) {
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

  if (loading || tierLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Group items by section, checking both tier and role access
  const sidebarSections = allSidebarItems.reduce((acc, item) => {
    const section = acc.find(s => s.title === item.section);
    const isTierAllowed = isModuleAllowed(item.name);
    const isRoleAllowed = isModuleAccessibleByRole(item.name, employeeRole);
    const itemWithAccess = { ...item, isTierAllowed, isRoleAllowed };
    
    if (section) {
      section.items.push(itemWithAccess);
    } else {
      acc.push({ title: item.section, items: [itemWithAccess] });
    }
    return acc;
  }, [] as { title: string; items: (typeof allSidebarItems[0] & { isTierAllowed: boolean; isRoleAllowed: boolean })[] }[]);


  const isActive = (path: string) => {
    if (path === "/portal") return location.pathname === "/portal";
    return location.pathname.startsWith(path);
  };

  const renderContent = () => {
    const path = location.pathname;
    
    if (path === "/portal" || path === "/portal/") return <PortalDashboard userId={user?.id} />;
    if (path.startsWith("/portal/projects")) return <PortalProjects userId={user?.id} />;
    if (path.startsWith("/portal/files")) return <PortalFiles userId={user?.id} />;
    if (path.startsWith("/portal/invoices")) return <PortalInvoices userId={user?.id} />;
    if (path.startsWith("/portal/tickets")) return <PortalTickets userId={user?.id} />;
    if (path.startsWith("/portal/meetings")) return <PortalMeetings userId={user?.id} />;
    if (path.startsWith("/portal/team")) return <PortalTeam />;
    if (path.startsWith("/portal/settings")) return <PortalSettings userId={user?.id} profile={profile} />;
    if (path.startsWith("/portal/ai")) return <PortalAIDashboard userId={user?.id} />;
    if (path.startsWith("/portal/msp")) return <PortalMSPMonitoring />;
    if (path.startsWith("/portal/feedback")) return <PortalFeedback userId={user?.id} />;
    if (path.startsWith("/portal/resources")) return <PortalResources />;
    
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-heading font-bold mb-2">Coming Soon</h2>
        <p className="text-muted-foreground">This section is under development</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-card border-r border-border/60 z-50",
        "transform transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border/60">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={cropxonIcon} alt="ATLAS" className="h-9 w-9" />
              <div>
                <span className="text-foreground font-heading font-bold text-sm block">CropXon</span>
                <span className="text-primary font-heading font-semibold text-xs">ATLAS Portal</span>
              </div>
            </Link>
            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <Badge className={cn("text-xs capitalize", tierColors[tier])}>
                  {tier} Plan
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-primary" />
                <Badge className={cn("text-xs", roleColors[employeeRole])}>
                  {roleLabels[employeeRole]} Access
                </Badge>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <nav className="p-3 space-y-4">
              {sidebarSections.map((section) => (
                <div key={section.title}>
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {section.title}
                  </h3>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      
                      // First check role access - if not allowed by role, show lock
                      if (!item.isRoleAllowed) {
                        return (
                          <div
                            key={item.name}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground/50 cursor-not-allowed"
                            title={`${item.name} requires ${item.name === "Invoices" ? "Finance" : item.name === "AI Dashboard" ? "Manager" : item.name === "MSP Monitoring" ? "Finance" : item.name === "Team" || item.name === "Tickets" ? "HR/Manager" : "higher"} role access`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium flex-1">{item.name}</span>
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        );
                      }
                      
                      // Then check tier access - if not allowed by tier, show upgrade prompt
                      if (!item.isTierAllowed) {
                        return (
                          <TierUpgradePrompt
                            key={item.name}
                            moduleName={item.name}
                            currentTier={tier}
                            requiredTier={getRequiredTierForModule(item.name)}
                            icon={Icon}
                          />
                        );
                      }
                      
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group",
                            active 
                              ? "bg-primary/10 text-primary" 
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon className={cn("w-4 h-4", active ? "text-primary" : "group-hover:text-foreground")} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </ScrollArea>

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

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-xl border-b border-border/60">
          <div className="flex items-center justify-between h-14 px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 text-foreground hover:bg-muted/50 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              
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
              <NotificationBell userId={user?.id} />
              <Button size="sm" className="gap-2 hidden sm:flex">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
