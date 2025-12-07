import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import cropxonIcon from "@/assets/cropxon-icon.png";
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
  PanelLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const navSections = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ]
  },
  {
    title: "Sales & Leads",
    icon: UserPlus,
    items: [
      { name: "CRM Leads", href: "/admin/crm", icon: UserPlus },
      { name: "Clickstream", href: "/admin/clickstream", icon: MousePointer },
      { name: "Marketing", href: "/admin/marketing", icon: Megaphone },
    ]
  },
  {
    title: "Client Management",
    icon: Users,
    items: [
      { name: "All Clients", href: "/admin/users", icon: Users },
      { name: "Tenants", href: "/admin/tenants", icon: Building2 },
      { name: "Onboarding", href: "/admin/onboarding", icon: Target },
      { name: "Onboarding Tracker", href: "/admin/onboarding-tracker", icon: ClipboardList },
      { name: "Notices", href: "/admin/notices", icon: Bell },
    ]
  },
  {
    title: "Project Management",
    icon: FolderKanban,
    items: [
      { name: "All Projects", href: "/admin/projects", icon: FolderKanban },
      { name: "Files Repository", href: "/admin/files", icon: FileText },
    ]
  },
  {
    title: "Billing & Payments",
    icon: Receipt,
    items: [
      { name: "Pricing Management", href: "/admin/pricing", icon: DollarSign },
      { name: "Quotes", href: "/admin/quotes", icon: FileText },
      { name: "Invoices", href: "/admin/invoices", icon: Receipt },
    ]
  },
  {
    title: "Support",
    icon: HeadphonesIcon,
    items: [
      { name: "Tickets", href: "/admin/tickets", icon: HeadphonesIcon },
      { name: "Meetings", href: "/admin/meetings", icon: Calendar },
      { name: "Inquiries", href: "/admin/inquiries", icon: Users },
    ]
  },
  {
    title: "AI & Monitoring",
    icon: Brain,
    items: [
      { name: "AI Dashboard", href: "/admin/ai", icon: Brain },
      { name: "MSP Monitoring", href: "/admin/msp", icon: Server },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ]
  },
  {
    title: "Security & Compliance",
    icon: Shield,
    items: [
      { name: "Cybersecurity", href: "/admin/security", icon: Shield },
      { name: "Compliance", href: "/admin/compliance", icon: Lock },
      { name: "Audit Logs", href: "/admin/audit", icon: FileCode },
    ]
  },
  {
    title: "Team",
    icon: Users,
    items: [
      { name: "Team Management", href: "/admin/team", icon: Users },
    ]
  },
  {
    title: "System",
    icon: Settings,
    items: [
      { name: "Plugins & Add-ons", href: "/admin/plugins", icon: Plug },
      { name: "System Logs", href: "/admin/logs", icon: Activity },
      { name: "Integrations", href: "/admin/integrations", icon: Plug },
      { name: "Portal Settings", href: "/admin/portal-settings", icon: Settings },
      { name: "Super Admin", href: "/admin/super", icon: Shield },
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
    navigate("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  const isSectionActive = (section: typeof navSections[0]) => {
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link to="/admin" className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <img src={cropxonIcon} alt="CropXon" className="h-9 w-9" />
            {!collapsed && (
              <div>
                <span className="text-foreground font-heading font-bold text-sm">CropXon</span>
                <span className="block text-primary font-heading font-semibold text-xs">ATLAS Admin</span>
              </div>
            )}
          </Link>
        </div>

        {/* Collapse Controls */}
        {!collapsed && (
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Navigation</span>
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
                // Collapsed view - show only icons for first item
                const firstItem = section.items[0];
                return (
                  <Link
                    key={section.title}
                    to={firstItem.href}
                    className={cn(
                      "flex items-center justify-center p-2 rounded-lg transition-colors",
                      sectionActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    title={section.title}
                  >
                    <SectionIcon className="h-5 w-5" />
                  </Link>
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
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        sectionActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <SectionIcon className="h-4 w-4" />
                        <span>{section.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {sectionActive && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 mt-1 space-y-0.5">
                    {section.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors",
                          isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        {item.name}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn("w-full gap-2", collapsed && "justify-center")}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
          {!collapsed && (
            <>
              <Link to="/">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Home className="h-4 w-4" />
                  Back to Website
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          )}
          {collapsed && (
            <>
              <Link to="/">
                <Button variant="ghost" size="icon" className="w-full" title="Back to Website">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="w-full" onClick={handleSignOut} title="Sign Out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
