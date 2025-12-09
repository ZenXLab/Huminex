import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClientTier } from "@/hooks/useClientTier";
import { useEmployeeRole, isModuleAccessibleByRole, EmployeeRole } from "@/hooks/useEmployeeRole";
import { TierUpgradePrompt, getRequiredTierForModule } from "@/components/portal/TierUpgradePrompt";
import { SIDEBAR_ACCESS_STORAGE_KEY, SidebarAccessConfig, getDefaultSidebarConfig } from "@/pages/tenant/settings/TenantSidebarAccess";
import cropxonIcon from "@/assets/cropxon-icon.png";
import { 
  LayoutDashboard, FolderKanban, FileText, Receipt, HeadphonesIcon, Calendar,
  Brain, Settings, LogOut, Users, Star, BookOpen, Server, Crown, Lock, Sparkles
} from "lucide-react";

const allSidebarItems = [
  { id: "dashboard", name: "Dashboard", href: "/portal", icon: LayoutDashboard, section: "Overview" },
  { id: "projects", name: "Projects", href: "/portal/projects", icon: FolderKanban, section: "Work" },
  { id: "files", name: "Files", href: "/portal/files", icon: FileText, section: "Work" },
  { id: "invoices", name: "Invoices", href: "/portal/invoices", icon: Receipt, section: "Billing" },
  { id: "tickets", name: "Tickets", href: "/portal/tickets", icon: HeadphonesIcon, section: "Support" },
  { id: "meetings", name: "Meetings", href: "/portal/meetings", icon: Calendar, section: "Support" },
  { id: "ai-dashboard", name: "AI Dashboard", href: "/portal/ai", icon: Brain, section: "AI & Monitoring" },
  { id: "msp-monitoring", name: "MSP Monitoring", href: "/portal/msp", icon: Server, section: "AI & Monitoring" },
  { id: "team", name: "Team", href: "/portal/team", icon: Users, section: "More" },
  { id: "feedback", name: "Feedback", href: "/portal/feedback", icon: Star, section: "More" },
  { id: "resources", name: "Resources", href: "/portal/resources", icon: BookOpen, section: "More" },
  { id: "settings", name: "Settings", href: "/portal/settings", icon: Settings, section: "Account" },
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

interface PortalSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: any;
  profile: any;
  signOut: () => void;
}

export const PortalSidebar = ({ sidebarOpen, setSidebarOpen, user, profile, signOut }: PortalSidebarProps) => {
  const location = useLocation();
  const { tier, isModuleAllowed } = useClientTier();
  const { role: employeeRole } = useEmployeeRole();

  const isActive = (path: string) => {
    if (path === "/portal") return location.pathname === "/portal";
    return location.pathname.startsWith(path);
  };

  // Get sidebar access configuration
  const getSidebarAccessConfig = (): SidebarAccessConfig => {
    try {
      const saved = localStorage.getItem(SIDEBAR_ACCESS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load sidebar access config:", e);
    }
    return getDefaultSidebarConfig();
  };

  const sidebarConfig = getSidebarAccessConfig();

  // Check if module is enabled by tenant admin for this role
  const isModuleEnabledByTenant = (moduleId: string): boolean => {
    const roleConfig = sidebarConfig[employeeRole];
    if (!roleConfig) return true;
    return roleConfig[moduleId] !== false;
  };

  // Group items by section, checking tier, role, and tenant admin access
  const sidebarSections = allSidebarItems.reduce((acc, item) => {
    const section = acc.find(s => s.title === item.section);
    const isTierAllowed = isModuleAllowed(item.name);
    const isRoleAllowed = isModuleAccessibleByRole(item.name, employeeRole);
    const isTenantEnabled = isModuleEnabledByTenant(item.id);
    const itemWithAccess = { ...item, isTierAllowed, isRoleAllowed, isTenantEnabled };
    
    if (section) {
      section.items.push(itemWithAccess);
    } else {
      acc.push({ title: item.section, items: [itemWithAccess] });
    }
    return acc;
  }, [] as { title: string; items: (typeof allSidebarItems[0] & { isTierAllowed: boolean; isRoleAllowed: boolean; isTenantEnabled: boolean })[] }[]);

  return (
    <aside className={cn(
      "fixed top-0 left-0 h-full w-64 bg-card border-r border-border/60 z-50",
      "transform transition-transform duration-300 lg:translate-x-0",
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo & Plan Info */}
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
          <Link 
            to="/portal/plans" 
            className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Compare Plans</span>
          </Link>
          </div>
        </div>

        {/* Navigation */}
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
                    
                    // First check if tenant admin has disabled this module
                    if (!item.isTenantEnabled) {
                      return (
                        <div
                          key={item.name}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground/40 cursor-not-allowed"
                          title={`${item.name} has been disabled by your organization admin`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium flex-1">{item.name}</span>
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      );
                    }
                    
                    // Then check role access - if not allowed by role, show lock
                    if (!item.isRoleAllowed) {
                      return (
                        <div
                          key={item.name}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground/50 cursor-not-allowed"
                          title={`${item.name} requires higher role access`}
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

        {/* User Profile & Sign Out */}
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
  );
};
