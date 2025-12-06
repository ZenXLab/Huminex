import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const navSections = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ]
  },
  {
    title: "Sales & Leads",
    items: [
      { name: "CRM Leads", href: "/admin/crm", icon: UserPlus },
      { name: "Clickstream", href: "/admin/clickstream", icon: MousePointer },
      { name: "Marketing", href: "/admin/marketing", icon: Megaphone },
    ]
  },
  {
    title: "Client Management",
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
    items: [
      { name: "All Projects", href: "/admin/projects", icon: FolderKanban },
      { name: "Files Repository", href: "/admin/files", icon: FileText },
    ]
  },
  {
    title: "Billing & Payments",
    items: [
      { name: "Pricing Management", href: "/admin/pricing", icon: DollarSign },
      { name: "Quotes", href: "/admin/quotes", icon: FileText },
      { name: "Invoices", href: "/admin/invoices", icon: Receipt },
    ]
  },
  {
    title: "Support",
    items: [
      { name: "Tickets", href: "/admin/tickets", icon: HeadphonesIcon },
      { name: "Meetings", href: "/admin/meetings", icon: Calendar },
      { name: "Inquiries", href: "/admin/inquiries", icon: Users },
    ]
  },
  {
    title: "AI & Monitoring",
    items: [
      { name: "AI Dashboard", href: "/admin/ai", icon: Brain },
      { name: "MSP Monitoring", href: "/admin/msp", icon: Server },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ]
  },
  {
    title: "Security & Compliance",
    items: [
      { name: "Cybersecurity", href: "/admin/security", icon: Shield },
      { name: "Compliance", href: "/admin/compliance", icon: Lock },
      { name: "Audit Logs", href: "/admin/audit", icon: FileCode },
    ]
  },
  {
    title: "Team",
    items: [
      { name: "Team Management", href: "/admin/team", icon: Users },
    ]
  },
  {
    title: "System",
    items: [
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link to="/admin" className="flex items-center gap-3">
            <img src={cropxonIcon} alt="CropXon" className="h-9 w-9" />
            <div>
              <span className="text-foreground font-heading font-bold text-sm">CropXon</span>
              <span className="block text-primary font-heading font-semibold text-xs">ATLAS Admin</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="p-3 space-y-4">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border space-y-1">
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
