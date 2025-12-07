import { ReactNode, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import cropxonIcon from "@/assets/cropxon-icon.png";
import { AdminNotificationBell } from "./AdminNotificationBell";
import { prefetchAdminModule } from "@/lib/adminPrefetch";
import { SyncIndicator } from "@/components/ui/sync-indicator";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText, 
  Receipt, 
  HeadphonesIcon, 
  Calendar, 
  Brain, 
  Server, 
  Shield, 
  BarChart3, 
  Settings, 
  LogOut, 
  Home,
  UserPlus,
  MousePointer,
  Megaphone,
  Bell,
  FileCode,
  Plug,
  Target,
  Lock,
  Activity,
  Building2,
  DollarSign,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  TrendingUp,
  CreditCard,
  Gauge,
  Database,
  Globe,
  Zap,
  Package,
  ShieldCheck,
  AlertTriangle,
  FileSearch,
  Workflow,
  Mail,
  Phone,
  Video,
  HardDrive,
  Cloud,
  Key,
  UserCog,
  Layers,
  RefreshCw,
  Wallet,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

interface NavSection {
  title: string;
  icon: LucideIcon;
  color: string;
  items: NavItem[];
}

// Comprehensive Admin Sidebar Navigation for full SaaS Operations
const navSections: NavSection[] = [
  {
    title: "Command Center",
    icon: LayoutDashboard,
    color: "text-blue-500",
    items: [
      { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Real-time Analytics", href: "/admin/analytics", icon: BarChart3, badge: "Live" },
      { name: "System Health", href: "/admin/health", icon: Gauge },
    ]
  },
  {
    title: "Tenant Management",
    icon: Building2,
    color: "text-purple-500",
    items: [
      { name: "All Tenants", href: "/admin/tenants", icon: Building2 },
      { name: "Tenant Plans & Billing", href: "/admin/tenant-billing", icon: CreditCard },
      { name: "Tenant Usage Metrics", href: "/admin/tenant-usage", icon: TrendingUp },
      { name: "Tenant Configuration", href: "/admin/tenant-config", icon: Settings },
      { name: "Feature Permissions", href: "/admin/plugins", icon: Package },
    ]
  },
  {
    title: "Sales & Revenue",
    icon: DollarSign,
    color: "text-emerald-500",
    items: [
      { name: "CRM & Leads", href: "/admin/crm", icon: UserPlus },
      { name: "Pipeline Management", href: "/admin/pipeline", icon: Workflow },
      { name: "Quotes & Proposals", href: "/admin/quotes", icon: FileText },
      { name: "Invoices & Payments", href: "/admin/invoices", icon: Receipt },
      { name: "Revenue Analytics", href: "/admin/revenue", icon: TrendingUp },
      { name: "Pricing Management", href: "/admin/pricing", icon: DollarSign },
    ]
  },
  {
    title: "Client Management",
    icon: Users,
    color: "text-cyan-500",
    items: [
      { name: "All Clients", href: "/admin/users", icon: Users },
      { name: "Onboarding Tracker", href: "/admin/onboarding-tracker", icon: ClipboardList },
      { name: "Onboarding Approvals", href: "/admin/onboarding", icon: Target },
      { name: "Client Health Scores", href: "/admin/client-health", icon: Gauge },
      { name: "Client Notices", href: "/admin/notices", icon: Bell },
    ]
  },
  {
    title: "Marketing & Growth",
    icon: Megaphone,
    color: "text-pink-500",
    items: [
      { name: "Clickstream Analytics", href: "/admin/clickstream", icon: MousePointer },
      { name: "Marketing Campaigns", href: "/admin/marketing", icon: Megaphone },
      { name: "Lead Scoring", href: "/admin/lead-scoring", icon: Target },
      { name: "Email Campaigns", href: "/admin/email-campaigns", icon: Mail },
      { name: "Conversion Funnels", href: "/admin/funnels", icon: TrendingUp },
      { name: "A/B Testing", href: "/admin/ab-testing", icon: Layers, badge: "NEW" },
    ]
  },
  {
    title: "Operations & Projects",
    icon: FolderKanban,
    color: "text-orange-500",
    items: [
      { name: "All Projects", href: "/admin/projects", icon: FolderKanban },
      { name: "Project Timeline", href: "/admin/project-timeline", icon: Calendar },
      { name: "Files Repository", href: "/admin/files", icon: FileText },
      { name: "Team Assignments", href: "/admin/team", icon: Users },
    ]
  },
  {
    title: "Support & Communication",
    icon: HeadphonesIcon,
    color: "text-indigo-500",
    items: [
      { name: "Support Tickets", href: "/admin/tickets", icon: HeadphonesIcon },
      { name: "Live Chat", href: "/admin/chat", icon: Phone },
      { name: "Scheduled Meetings", href: "/admin/meetings", icon: Calendar },
      { name: "Video Calls", href: "/admin/video-calls", icon: Video },
      { name: "Client Inquiries", href: "/admin/inquiries", icon: Users },
    ]
  },
  {
    title: "AI & Intelligence",
    icon: Brain,
    color: "text-violet-500",
    items: [
      { name: "Proxima AI Dashboard", href: "/admin/ai", icon: Brain },
      { name: "Predictive Analytics", href: "/admin/predictive-analytics", icon: TrendingUp, badge: "AI" },
      { name: "AI Usage & Costs", href: "/admin/ai-usage", icon: Wallet },
      { name: "Model Performance", href: "/admin/ai-models", icon: TrendingUp },
      { name: "Automation Logs", href: "/admin/automation-logs", icon: Workflow },
    ]
  },
  {
    title: "Infrastructure & MSP",
    icon: Server,
    color: "text-slate-500",
    items: [
      { name: "MSP Monitoring", href: "/admin/msp", icon: Server },
      { name: "Server Health", href: "/admin/servers", icon: HardDrive },
      { name: "Cloud Resources", href: "/admin/cloud", icon: Cloud },
      { name: "Database Status", href: "/admin/database", icon: Database },
      { name: "API Gateway", href: "/admin/api-gateway", icon: Globe },
    ]
  },
  {
    title: "Security & Compliance",
    icon: Shield,
    color: "text-red-500",
    items: [
      { name: "Security Dashboard", href: "/admin/security", icon: Shield },
      { name: "Access Control", href: "/admin/access-control", icon: Key },
      { name: "Compliance Status", href: "/admin/compliance", icon: ShieldCheck },
      { name: "Threat Detection", href: "/admin/threats", icon: AlertTriangle },
      { name: "Audit Logs", href: "/admin/audit", icon: FileSearch },
    ]
  },
  {
    title: "Platform Settings",
    icon: Settings,
    color: "text-gray-500",
    items: [
      { name: "General Settings", href: "/admin/portal-settings", icon: Settings },
      { name: "User Roles & Permissions", href: "/admin/roles", icon: UserCog },
      { name: "Integrations", href: "/admin/integrations", icon: Plug },
      { name: "API Keys & Webhooks", href: "/admin/api-keys", icon: Key },
      { name: "Feature Flags", href: "/admin/feature-flags", icon: Layers },
      { name: "System Logs", href: "/admin/logs", icon: Activity },
      { name: "Backup & Recovery", href: "/admin/backup", icon: RefreshCw },
      { name: "Super Admin", href: "/admin/super", icon: Shield, badge: "Critical" },
    ]
  },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(
    navSections.map(s => s.title) // All sections open by default
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("atlas_dev_mode");
    localStorage.removeItem("atlas_dev_mode_type");
    navigate("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  const isSectionActive = (section: NavSection) => {
    return section.items.some(item => isActive(item.href));
  };

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title) 
        : [...prev, title]
    );
  };

  const toggleAllSections = (open: boolean) => {
    setOpenSections(open ? navSections.map(s => s.title) : []);
  };

  // Prefetch module on hover for instant navigation
  const handleLinkHover = useCallback((href: string) => {
    prefetchAdminModule(href);
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <aside className={cn(
          "bg-card border-r border-border flex flex-col transition-all duration-300 relative",
          collapsed ? "w-[68px]" : "w-72"
        )}>
          {/* Logo Header */}
          <div className="p-4 border-b border-border">
            <Link to="/admin" className={cn("flex items-center gap-3", collapsed && "justify-center")}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
                <img src={cropxonIcon} alt="CropXon" className="relative h-9 w-9" />
              </div>
              {!collapsed && (
                <div>
                  <span className="text-foreground font-heading font-bold text-sm">CropXon</span>
                  <span className="block text-primary font-heading font-semibold text-xs">ATLAS Admin</span>
                </div>
              )}
            </Link>
          </div>

          {/* Admin Badge */}
          {!collapsed && (
            <div className="px-4 py-2 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-foreground">Platform Admin</span>
                <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0">
                  Owner
                </Badge>
              </div>
            </div>
          )}

          {/* Collapse Controls */}
          {!collapsed && (
            <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-muted/30">
              <span className="text-xs text-muted-foreground font-medium">Navigation</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => toggleAllSections(true)}
                  title="Expand All"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => toggleAllSections(false)}
                  title="Collapse All"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className="p-2 space-y-1">
              {navSections.map((section) => {
                const SectionIcon = section.icon;
                const isOpen = openSections.includes(section.title);
                const sectionActive = isSectionActive(section);

                if (collapsed) {
                  // Collapsed view - show only section icons with tooltip
                  return (
                    <Tooltip key={section.title}>
                      <TooltipTrigger asChild>
                        <Link
                          to={section.items[0].href}
                          onMouseEnter={() => handleLinkHover(section.items[0].href)}
                          onFocus={() => handleLinkHover(section.items[0].href)}
                          className={cn(
                            "flex items-center justify-center p-2.5 rounded-lg transition-all duration-200",
                            sectionActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <SectionIcon className={cn("h-5 w-5", !sectionActive && section.color)} />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="flex flex-col gap-0.5">
                        <span className="font-semibold">{section.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {section.items.length} modules
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <Collapsible
                    key={section.title}
                    open={isOpen}
                    onOpenChange={() => toggleSection(section.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                          sectionActive
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <SectionIcon className={cn("h-4 w-4", section.color)} />
                          <span>{section.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {sectionActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {section.items.length}
                          </span>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 mt-1 space-y-0.5 animate-accordion-down">
                      {section.items.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onMouseEnter={() => handleLinkHover(item.href)}
                          onFocus={() => handleLinkHover(item.href)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group",
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                          )}
                        >
                          <item.icon className={cn(
                            "h-3.5 w-3.5 transition-transform group-hover:scale-110",
                            isActive(item.href) ? "" : "opacity-70"
                          )} />
                          <span className="flex-1 truncate">{item.name}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.badgeVariant || "secondary"} 
                              className="text-[9px] px-1.5 py-0 h-4"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Footer Actions */}
          <div className={cn(
            "border-t border-border bg-muted/30",
            collapsed ? "p-2" : "p-3 space-y-1"
          )}>
            {collapsed ? (
              <div className="space-y-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full h-10"
                      onClick={() => setCollapsed(false)}
                    >
                      <PanelLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Expand Sidebar</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/">
                      <Button variant="ghost" size="icon" className="w-full h-10">
                        <Home className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Back to Website</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-full h-10 text-muted-foreground" 
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Sign Out</TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 justify-start"
                  onClick={() => setCollapsed(true)}
                >
                  <PanelLeftClose className="h-4 w-4" />
                  <span>Collapse Sidebar</span>
                </Button>
                <Link to="/">
                  <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
                    <Home className="h-4 w-4" />
                    Back to Website
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full gap-2 justify-start text-muted-foreground hover:text-destructive" 
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Admin Header with Notification Bell */}
          <header className="h-14 border-b border-border bg-card/95 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-medium text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <SyncIndicator />
              <AdminNotificationBell />
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">A</span>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};