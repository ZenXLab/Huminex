import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import cropxonIcon from "@/assets/cropxon-icon.png";
import { 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  Users, 
  MessageSquare,
  Settings,
  LogOut,
  Home,
  BarChart3,
  MousePointer,
  Server,
  Megaphone,
  UserPlus,
  Shield,
  FileCode,
  Plug,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "CRM Leads", href: "/admin/crm", icon: UserPlus },
  { name: "Clickstream", href: "/admin/clickstream", icon: MousePointer },
  { name: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { name: "MSP Monitoring", href: "/admin/msp", icon: Server },
  { name: "Onboarding", href: "/admin/onboarding", icon: Users },
  { name: "Quotes", href: "/admin/quotes", icon: FileText },
  { name: "Invoices", href: "/admin/invoices", icon: Receipt },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Notices", href: "/admin/notices", icon: Bell },
  { name: "Compliance", href: "/admin/compliance", icon: Shield },
  { name: "Audit Logs", href: "/admin/audit", icon: FileCode },
  { name: "System Logs", href: "/admin/logs", icon: Settings },
  { name: "Integrations", href: "/admin/integrations", icon: Plug },
  { name: "Portal Settings", href: "/admin/portal-settings", icon: Settings },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/admin" className="flex items-center gap-3">
            <img src={cropxonIcon} alt="CropXon" className="h-10 w-10" />
            <div>
              <span className="text-foreground font-heading font-bold">CropXon</span>
              <span className="block text-primary font-heading font-semibold text-xs">ATLAS Admin</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/admin" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Link to="/">
            <Button variant="outline" className="w-full gap-2">
              <Home className="h-4 w-4" />
              Back to Website
            </Button>
          </Link>
          <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
