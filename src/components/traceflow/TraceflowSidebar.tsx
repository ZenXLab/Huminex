import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Video,
  Activity,
  GitBranch,
  Bot,
  Settings,
  MousePointer,
  Layers,
  Brain,
  Target,
  BarChart3,
  Code2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Crown,
  Zap,
  Radio,
  Map,
  Thermometer,
  FormInput,
  Users,
  Globe,
  Smartphone,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  ArrowDown,
  Shield
} from "lucide-react";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

interface SidebarSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: SidebarItem[];
  defaultOpen?: boolean;
}

// Feature-organized sidebar sections
const sidebarSections: SidebarSection[] = [
  {
    title: "Intelligence Hub",
    icon: Brain,
    defaultOpen: true,
    items: [
      { icon: LayoutDashboard, label: "Overview", id: "overview", description: "AI-powered real-time insights dashboard" },
      { icon: Sparkles, label: "AI Analyst", id: "ai-analyst", description: "Automated insights & recommendations", badge: "AI", badgeColor: "bg-primary/10 text-primary" },
    ]
  },
  {
    title: "Capture & Recording",
    icon: MousePointer,
    defaultOpen: true,
    items: [
      { icon: MousePointer, label: "Capture Engine", id: "capture", description: "Auto-capture clicks, scrolls, gestures", badge: "Core", badgeColor: "bg-primary/10 text-primary" },
      { icon: Video, label: "Session Replay", id: "sessions", description: "Watch real user sessions", badge: "Live", badgeColor: "bg-emerald-500/10 text-emerald-600" },
    ]
  },
  {
    title: "UX Analytics",
    icon: Layers,
    defaultOpen: true,
    items: [
      { icon: MousePointer, label: "Click Analysis", id: "click-analysis", description: "Detailed click breakdown by element" },
      { icon: Thermometer, label: "Click Heatmaps", id: "heatmaps", description: "Visual click distribution analysis" },
      { icon: ArrowDown, label: "Scroll Depth", id: "scroll-depth", description: "Track how far users scroll" },
      { icon: AlertTriangle, label: "Frustration Detection", id: "frustration", description: "Rage clicks, dead clicks, errors" },
      { icon: FormInput, label: "Form Analytics", id: "forms", description: "Field abandonment & completion rates" },
      { icon: Layers, label: "UX Issues", id: "ux", description: "AI-detected UI problems" },
    ]
  },
  {
    title: "Journey & Funnels",
    icon: GitBranch,
    defaultOpen: false,
    items: [
      { icon: GitBranch, label: "User Journeys", id: "journeys", description: "Path analysis & drop-off points" },
      { icon: TrendingUp, label: "Conversion Funnels", id: "funnels", description: "Step-by-step conversion tracking" },
    ]
  },
  {
    title: "Audience Insights",
    icon: Users,
    defaultOpen: false,
    items: [
      { icon: Smartphone, label: "Device Analytics", id: "devices", description: "Browser, OS, device breakdown" },
      { icon: Globe, label: "Geo Analytics", id: "geo", description: "Geographic user distribution" },
    ]
  },
  {
    title: "AI Operations",
    icon: Bot,
    defaultOpen: false,
    items: [
      { icon: Bot, label: "NeuroRouter", id: "ai-ops", description: "Multi-LLM task routing", badge: "New", badgeColor: "bg-accent/10 text-accent" },
      { icon: Brain, label: "Multi-Modal AI", id: "multimodal", description: "Voice, text & sentiment fusion" },
    ]
  },
  {
    title: "Product & Revenue",
    icon: Target,
    defaultOpen: false,
    items: [
      { icon: BarChart3, label: "Product Intelligence", id: "product", description: "Feature usage & retention" },
      { icon: Target, label: "Revenue Insights", id: "revenue", description: "Financial impact of UX" },
    ]
  },
  {
    title: "Setup & Admin",
    icon: Settings,
    defaultOpen: false,
    items: [
      { icon: Code2, label: "SDK Integration", id: "sdk", description: "Install TRACEFLOW in minutes" },
      { icon: Activity, label: "Recent Events", id: "recent-events", description: "Real-time event feed" },
      { icon: Shield, label: "Privacy Controls", id: "privacy", description: "Data masking & compliance" },
      { icon: Settings, label: "Settings", id: "settings", description: "Team, billing & configuration" },
    ]
  },
];

// Add Sparkles to imports
import { Sparkles } from "lucide-react";

interface TraceflowSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isConnected?: boolean;
  stats?: {
    sessions24h?: number;
    uxIssues?: number;
    aiTasks?: number;
  };
}

export const TraceflowSidebar = ({ activeTab, onTabChange, isConnected, stats }: TraceflowSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    sidebarSections.reduce((acc, section) => ({ ...acc, [section.title]: section.defaultOpen ?? false }), {})
  );

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const renderNavItem = (item: SidebarItem) => {
    const isActive = activeTab === item.id;
    const Icon = item.icon;

    const content = (
      <button
        onClick={() => onTabChange(item.id)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
          isActive 
            ? "bg-primary/10 text-primary border border-primary/20" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )} />
        
        {!collapsed && (
          <>
            <div className="flex-1 text-left min-w-0">
              <span className="text-sm font-medium block truncate">{item.label}</span>
            </div>
            {item.badge && (
              <Badge className={cn("text-[10px] px-1.5 py-0 h-4 shrink-0", item.badgeColor)}>
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
          <TooltipContent side="right" className="flex flex-col gap-1">
            <span className="font-medium">{item.label}</span>
            <span className="text-xs text-muted-foreground">{item.description}</span>
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.id}>{content}</div>;
  };

  const renderSection = (section: SidebarSection) => {
    const isOpen = openSections[section.title];
    const SectionIcon = section.icon;
    const hasActiveItem = section.items.some(item => item.id === activeTab);

    if (collapsed) {
      return (
        <div key={section.title} className="space-y-1">
          {section.items.map(renderNavItem)}
        </div>
      );
    }

    return (
      <Collapsible
        key={section.title}
        open={isOpen}
        onOpenChange={() => toggleSection(section.title)}
      >
        <CollapsibleTrigger className="w-full">
          <div className={cn(
            "flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors",
            hasActiveItem && "text-primary"
          )}>
            <div className="flex items-center gap-2">
              <SectionIcon className="h-3.5 w-3.5" />
              <span>{section.title}</span>
            </div>
            <ChevronDown className={cn(
              "h-3.5 w-3.5 transition-transform",
              isOpen && "rotate-180"
            )} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-0.5 mt-1">
          {section.items.map(renderNavItem)}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-64"
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
              <h2 className="font-bold text-foreground text-sm">TRACEFLOW</h2>
              <p className="text-[10px] text-muted-foreground">Digital Experience Intelligence</p>
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
          className={cn("h-7 w-7 p-0", collapsed && "hidden")}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Collapsed toggle */}
      {collapsed && (
        <Button
          variant="ghost"
          size="sm"
          className="mx-auto mt-2 h-7 w-7 p-0"
          onClick={() => setCollapsed(false)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Connection Status */}
      {!collapsed && (
        <div className="px-3 py-2">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs",
            isConnected ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
          )}>
            <Radio className={cn("h-3 w-3", isConnected && "animate-pulse")} />
            <span>{isConnected ? "Live Connected" : "Connecting..."}</span>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {!collapsed && stats && (
        <div className="px-3 py-2 grid grid-cols-3 gap-1">
          <div className="text-center p-1.5 rounded bg-muted/50">
            <p className="text-xs font-bold">{stats.sessions24h || 0}</p>
            <p className="text-[9px] text-muted-foreground">Sessions</p>
          </div>
          <div className="text-center p-1.5 rounded bg-muted/50">
            <p className="text-xs font-bold text-destructive">{stats.uxIssues || 0}</p>
            <p className="text-[9px] text-muted-foreground">Issues</p>
          </div>
          <div className="text-center p-1.5 rounded bg-muted/50">
            <p className="text-xs font-bold text-primary">{stats.aiTasks || 0}</p>
            <p className="text-[9px] text-muted-foreground">AI Tasks</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="space-y-3">
          {sidebarSections.map(renderSection)}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
            <Crown className="h-4 w-4 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Enterprise Plan</p>
              <p className="text-[10px] text-muted-foreground">All features unlocked</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
