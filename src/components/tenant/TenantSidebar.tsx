import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  FileCheck,
  CreditCard,
  Shield,
  UserCheck,
  FolderKanban,
  Building,
  Target,
  Zap,
  Brain,
  Key,
  AlertTriangle,
  Headphones,
  Settings,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Bell,
  FileText,
  MessageSquare,
  ClipboardList,
  LucideIcon,
  Link2,
  Database,
  Globe,
  Sparkles,
} from "lucide-react";
import { useTenant } from "./TenantLayout";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: string;
  badgeVariant?: "default" | "warning" | "danger" | "success";
}

interface NavModule {
  title: string;
  icon: LucideIcon;
  color: string;
  items: NavItem[];
}

const primaryNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/tenant/dashboard" },
];

const coreModules: NavModule[] = [
  {
    title: "Workforce Management",
    icon: Users,
    color: "#005EEB",
    items: [
      { label: "Employee Directory", icon: Users, path: "/tenant/workforce" },
      { label: "Attendance & Leave", icon: Calendar, path: "/tenant/attendance" },
      { label: "Documents", icon: FileText, path: "/tenant/documents" },
      { label: "Announcements", icon: MessageSquare, path: "/tenant/announcements" },
    ],
  },
  {
    title: "Payroll & Finance",
    icon: DollarSign,
    color: "#0FB07A",
    items: [
      { label: "Payroll", icon: DollarSign, path: "/tenant/payroll", badge: "Processing", badgeVariant: "warning" },
      { label: "Finance & Billing", icon: CreditCard, path: "/tenant/finance" },
      { label: "Insurance & Claims", icon: Shield, path: "/tenant/insurance" },
    ],
  },
  {
    title: "Talent & Hiring",
    icon: Briefcase,
    color: "#00C2FF",
    items: [
      { label: "Recruitment", icon: Briefcase, path: "/tenant/recruitment" },
      { label: "BGV", icon: UserCheck, path: "/tenant/bgv", badge: "12", badgeVariant: "warning" },
      { label: "Performance", icon: Target, path: "/tenant/performance" },
    ],
  },
  {
    title: "Operations",
    icon: FolderKanban,
    color: "#FFB020",
    items: [
      { label: "Tasks & Projects", icon: FolderKanban, path: "/tenant/projects" },
      { label: "EMS / Assets", icon: Building, path: "/tenant/ems" },
      { label: "My Requests", icon: ClipboardList, path: "/tenant/requests" },
      { label: "Notifications", icon: Bell, path: "/tenant/notifications" },
    ],
  },
  {
    title: "Compliance & Risk",
    icon: FileCheck,
    color: "#E23E57",
    items: [
      { label: "Compliance", icon: FileCheck, path: "/tenant/compliance" },
      { label: "Risk & Governance", icon: AlertTriangle, path: "/tenant/risk" },
      { label: "Identity & Access", icon: Key, path: "/tenant/identity" },
    ],
  },
  {
    title: "Intelligence & Automation",
    icon: Brain,
    color: "#8B5CF6",
    items: [
      { label: "Proxima AI", icon: Brain, path: "/tenant/intelligence" },
      { label: "OpZenix", icon: Zap, path: "/tenant/automations" },
      { label: "Managed Ops", icon: Headphones, path: "/tenant/managed-ops" },
    ],
  },
];

const settingsModule: NavModule = {
  title: "Settings",
  icon: Settings,
  color: "#6B7280",
  items: [
    { label: "Organization", icon: Building, path: "/tenant/settings" },
    { label: "Integrations", icon: Link2, path: "/tenant/settings/integrations" },
    { label: "API Keys", icon: Key, path: "/tenant/settings/api-keys" },
    { label: "Billing & Plans", icon: CreditCard, path: "/tenant/settings/billing" },
    { label: "Data Export", icon: Database, path: "/tenant/settings/export" },
    { label: "Custom Domain", icon: Globe, path: "/tenant/settings/domain" },
  ],
};

export const TenantSidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useTenant();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isModuleActive = (module: NavModule) => module.items.some(item => location.pathname === item.path);

  // Auto-expand module containing active route
  useEffect(() => {
    const allModules = [...coreModules, settingsModule];
    const activeModule = allModules.find(isModuleActive);
    if (activeModule && !expandedModules.includes(activeModule.title)) {
      setExpandedModules(prev => [...prev, activeModule.title]);
    }
  }, [location.pathname]);

  const toggleModule = (title: string) => {
    setExpandedModules(prev => 
      prev.includes(title) 
        ? prev.filter(m => m !== title)
        : [...prev, title]
    );
  };

  const handleNavClick = (item: NavItem) => {
    toast.info(`Navigating to ${item.label}...`, { duration: 1500 });
  };

  const renderNavItem = (item: NavItem, collapsed: boolean, indent: boolean = false) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    const content = (
      <NavLink
        to={item.path}
        onClick={() => handleNavClick(item)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
          "hover:bg-gradient-to-r hover:from-[#005EEB]/5 hover:to-transparent",
          active && "bg-gradient-to-r from-[#005EEB]/10 to-[#00C2FF]/5 text-[#005EEB]",
          !active && "text-[#6B7280]",
          collapsed && "justify-center px-2",
          indent && !collapsed && "ml-4"
        )}
      >
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#005EEB] to-[#00C2FF] rounded-r-full" />
        )}
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
          active ? "bg-[#005EEB]/10" : "group-hover:bg-[#005EEB]/5",
          "group-hover:scale-110"
        )}>
          <Icon className={cn(
            "w-4 h-4 transition-all duration-300",
            active ? "text-[#005EEB]" : "text-[#9CA3AF] group-hover:text-[#005EEB]"
          )} />
        </div>
        {!collapsed && (
          <>
            <span className={cn(
              "flex-1 text-[13px] font-medium transition-all duration-300",
              active ? "text-[#005EEB]" : "text-[#4B5563] group-hover:text-[#0F1E3A]"
            )}>
              {item.label}
            </span>
            {item.badge && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-2 py-0.5 h-5 font-semibold border",
                  item.badgeVariant === "warning" && "border-[#FFB020] text-[#FFB020] bg-[#FFB020]/10 animate-pulse",
                  item.badgeVariant === "danger" && "border-[#E23E57] text-[#E23E57] bg-[#E23E57]/10",
                  item.badgeVariant === "success" && "border-[#0FB07A] text-[#0FB07A] bg-[#0FB07A]/10",
                  !item.badgeVariant && "border-[#6B7280] text-[#6B7280]"
                )}
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.path}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium text-xs bg-[#0F1E3A] text-white border-none">
            <div className="flex items-center gap-2">
              {item.label}
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20">{item.badge}</span>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.path}>{content}</div>;
  };

  const renderModule = (module: NavModule) => {
    const isExpanded = expandedModules.includes(module.title);
    const hasActiveItem = isModuleActive(module);
    const Icon = module.icon;

    if (sidebarCollapsed) {
      return (
        <div key={module.title} className="mb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => {
                  setSidebarCollapsed(false);
                  if (!expandedModules.includes(module.title)) {
                    setExpandedModules(prev => [...prev, module.title]);
                  }
                }}
                className={cn(
                  "flex items-center justify-center p-2.5 rounded-xl cursor-pointer transition-all duration-300 w-full",
                  "hover:scale-105 hover:bg-[#F7F9FC]",
                  hasActiveItem && "bg-gradient-to-r from-[#005EEB]/10 to-transparent"
                )}
                style={{ borderLeft: hasActiveItem ? `3px solid ${module.color}` : undefined }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{ backgroundColor: `${module.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: module.color }} />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium text-xs bg-[#0F1E3A] text-white border-none">
              {module.title}
            </TooltipContent>
          </Tooltip>
        </div>
      );
    }

    return (
      <div key={module.title} className="mb-1">
        <button
          onClick={() => toggleModule(module.title)}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-300 group",
            "hover:bg-gradient-to-r hover:from-[#F7F9FC] hover:to-transparent",
            hasActiveItem && "bg-[#F7F9FC]"
          )}
        >
          <div 
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
              "group-hover:scale-105 group-hover:shadow-lg"
            )}
            style={{ 
              backgroundColor: `${module.color}15`,
              boxShadow: hasActiveItem ? `0 4px 12px ${module.color}30` : undefined
            }}
          >
            <Icon className="w-5 h-5 transition-transform duration-300" style={{ color: module.color }} />
          </div>
          <span className={cn(
            "flex-1 text-left text-[13px] font-semibold transition-colors duration-300",
            hasActiveItem ? "text-[#0F1E3A]" : "text-[#4B5563] group-hover:text-[#0F1E3A]"
          )}>
            {module.title}
          </span>
          <div className={cn(
            "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 bg-[#F7F9FC]",
            isExpanded && "rotate-180 bg-[#005EEB]/10"
          )}>
            <ChevronDown className={cn(
              "w-4 h-4 transition-colors",
              isExpanded ? "text-[#005EEB]" : "text-[#9CA3AF]"
            )} />
          </div>
        </button>

        <div className={cn(
          "overflow-hidden transition-all duration-400 ease-out",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="mt-1 space-y-0.5 ml-3 pl-3 border-l-2 border-gray-100">
            {module.items.map((item, index) => (
              <div 
                key={item.path}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {renderNavItem(item, false, true)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-[72px] bottom-0 bg-white border-r border-gray-200 transition-all duration-400 z-40 flex flex-col",
        sidebarCollapsed ? "w-[80px]" : "w-[280px]"
      )}
      style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.03)" }}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center p-4 border-b border-gray-100",
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#005EEB]" />
            <span className="text-xs font-bold text-[#005EEB] uppercase tracking-wider">Navigation</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-9 w-9 rounded-xl hover:bg-[#005EEB]/5 transition-all duration-300 hover:scale-105"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-5 h-5 text-[#005EEB]" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-[#6B7280]" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {/* Primary Nav */}
        <div className="mb-4">
          {primaryNav.map((item) => renderNavItem(item, sidebarCollapsed))}
        </div>

        {/* Modules Label */}
        {!sidebarCollapsed && (
          <div className="mb-3 px-3">
            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">
              Modules
            </span>
          </div>
        )}

        {/* Core Modules */}
        <div className="space-y-1">
          {coreModules.map(renderModule)}
        </div>

        {/* Divider */}
        <div className="my-4 mx-3 border-t border-gray-100" />

        {/* Settings */}
        {renderModule(settingsModule)}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-[#F7F9FC] to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#0FB07A] animate-pulse shadow-lg shadow-[#0FB07A]/50" />
              <span className="text-xs text-[#6B7280] font-medium">Connected</span>
            </div>
            <span className="text-[10px] text-[#9CA3AF] font-mono">v2.0.1</span>
          </div>
        </div>
      )}
    </aside>
  );
};