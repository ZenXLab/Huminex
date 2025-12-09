import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Video,
  Activity,
  GitBranch,
  Cpu,
  Bot,
  Plug2,
  Settings,
  MousePointer,
  Layers,
  Brain,
  Target,
  BarChart3,
  Code2,
  ChevronLeft,
  ChevronRight,
  Crown,
  Zap,
  Radio
} from "lucide-react";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

// TRACEFLOW Core Feature Modules
const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", id: "overview", description: "AI-powered dashboard with real-time insights" },
  { icon: MousePointer, label: "Capture Engine", id: "capture", description: "Universal auto-capture across web & mobile", badge: "Core", badgeColor: "bg-primary/10 text-primary" },
  { icon: Video, label: "Session Intelligence", id: "sessions", description: "AI summaries, root-cause & fix suggestions", badge: "Live", badgeColor: "bg-emerald-500/10 text-emerald-600" },
  { icon: Layers, label: "UX Intelligence", id: "ux", description: "Visual breakage, heatmaps & design auditor" },
  { icon: GitBranch, label: "Journey Intelligence", id: "journeys", description: "Auto-funnels, drop-off causality & simulator" },
  { icon: BarChart3, label: "Product Intelligence", id: "product", description: "Feature usage, retention & churn prediction" },
  { icon: Activity, label: "Observability", id: "observability", description: "OTel traces, service maps & API correlation" },
  { icon: Brain, label: "Multi-Modal AI", id: "multimodal", description: "Voice, text & sentiment fusion with sessions", badge: "New", badgeColor: "bg-accent/10 text-accent" },
  { icon: Bot, label: "AI Operations", id: "ai-ops", description: "Multi-agent auto-ticketing & monitoring" },
  { icon: Target, label: "Revenue Insights", id: "revenue", description: "Financial impact & ROI of UX improvements" },
  { icon: Code2, label: "SDK & Setup", id: "sdk", description: "Integrate TRACEFLOW in minutes" },
  { icon: Settings, label: "Admin & Billing", id: "settings", description: "Feature store, team & billing management" },
];

interface TraceflowSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isConnected?: boolean;
}

export const TraceflowSidebar = ({ activeTab, onTabChange, isConnected }: TraceflowSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const renderNavItem = (item: SidebarItem) => {
    const isActive = activeTab === item.id;
    const Icon = item.icon;

    const content = (
      <button
        onClick={() => onTabChange(item.id)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
          isActive 
            ? "bg-primary/10 text-primary border border-primary/20" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className={cn(
          "h-5 w-5 shrink-0 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )} />
        
        {!collapsed && (
          <>
            <div className="flex-1 text-left min-w-0">
              <span className="text-sm font-medium block truncate">{item.label}</span>
              {!collapsed && (
                <span className="text-xs text-muted-foreground truncate block">{item.description}</span>
              )}
            </div>
            {item.badge && (
              <Badge className={cn("text-[10px] px-1.5 py-0.5 shrink-0", item.badgeColor)}>
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </button>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.id} delayDuration={0}>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            <span>{item.label}</span>
            {item.badge && (
              <Badge className={cn("text-[10px]", item.badgeColor)}>{item.badge}</Badge>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.id}>{content}</div>;
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className={cn(
        "p-4 border-b border-border flex items-center",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">TRACEFLOW</h2>
              <p className="text-xs text-muted-foreground">Digital Experience Intelligence</p>
            </div>
          </div>
        )}
        
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", collapsed && "hidden")}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Collapsed toggle button */}
      {collapsed && (
        <Button
          variant="ghost"
          size="sm"
          className="mx-auto mt-2 h-8 w-8 p-0"
          onClick={() => setCollapsed(false)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Connection Status */}
      {!collapsed && (
        <div className="px-4 py-2">
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs",
            isConnected ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
          )}>
            <Radio className={cn("h-3 w-3", isConnected && "animate-pulse")} />
            <span>{isConnected ? "Live Connected" : "Connecting..."}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {sidebarItems.map(renderNavItem)}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
            <Crown className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Enterprise Plan</p>
              <p className="text-xs text-muted-foreground">All features unlocked</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
