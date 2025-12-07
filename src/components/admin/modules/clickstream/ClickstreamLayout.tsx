import { useState } from "react";
import { useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Flame, 
  Route, 
  Globe, 
  Eye, 
  Monitor, 
  Video,
  TrendingUp,
  MousePointer,
  Activity,
  ChevronRight,
  ChevronDown,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClickstreamLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    description: "Dashboard summary & KPIs",
  },
  {
    id: "behavior",
    label: "User Behavior",
    icon: Activity,
    description: "Behavior analytics",
    children: [
      {
        id: "funnel",
        label: "Conversion Funnel",
        icon: TrendingUp,
        description: "Track conversion paths",
      },
      {
        id: "journeys",
        label: "User Journeys",
        icon: Route,
        description: "Path visualization",
      },
      {
        id: "clicks",
        label: "Click Analysis",
        icon: MousePointer,
        description: "Element interactions",
      },
    ],
  },
  {
    id: "heatmaps",
    label: "Heatmaps",
    icon: Flame,
    description: "Visual engagement data",
    children: [
      {
        id: "click-heatmap",
        label: "Click Heatmap",
        icon: MousePointer,
        description: "Click density",
      },
      {
        id: "scroll-heatmap",
        label: "Scroll Depth",
        icon: Layers,
        description: "Scroll engagement",
      },
    ],
  },
  {
    id: "session-replay",
    label: "Session Replay",
    icon: Video,
    description: "Watch user sessions",
    badge: "Pro",
  },
  {
    id: "device-analytics",
    label: "Device & Browser",
    icon: Monitor,
    description: "Device breakdown",
    badge: "New",
  },
  {
    id: "geo-analytics",
    label: "Geographic",
    icon: Globe,
    description: "Location insights",
  },
  {
    id: "events",
    label: "Recent Events",
    icon: Eye,
    description: "Live event stream",
  },
];

export const ClickstreamLayout = ({ 
  children, 
  activeSection, 
  onSectionChange 
}: ClickstreamLayoutProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["behavior", "heatmaps"]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isActive = (id: string) => activeSection === id;
  const isGroupActive = (item: NavItem) => 
    item.children?.some(child => isActive(child.id)) || isActive(item.id);

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedGroups.includes(item.id);
    const active = hasChildren ? isGroupActive(item) : isActive(item.id);

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleGroup(item.id);
            } else {
              onSectionChange(item.id);
            }
          }}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
            "hover:bg-muted/80",
            active && !hasChildren && "bg-primary/10 text-primary border-l-2 border-primary",
            active && hasChildren && "text-primary",
            depth > 0 && "ml-4 text-xs"
          )}
        >
          <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
          <span className="flex-1 text-left truncate">{item.label}</span>
          {item.badge && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-[9px] px-1.5 py-0",
                item.badge === "New" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                item.badge === "Pro" && "bg-purple-500/10 text-purple-600 border-purple-500/30"
              )}
            >
              {item.badge}
            </Badge>
          )}
          {hasChildren && (
            isExpanded 
              ? <ChevronDown className="h-3 w-3 text-muted-foreground" />
              : <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
        </button>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar Navigation */}
      <div className="w-64 shrink-0">
        <div className="sticky top-4 space-y-4">
          <div className="p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
            <h3 className="font-semibold text-sm mb-1">Clickstream Analytics</h3>
            <p className="text-xs text-muted-foreground">
              Comprehensive user behavior tracking
            </p>
          </div>
          
          <ScrollArea className="h-[calc(100vh-280px)]">
            <nav className="space-y-1 p-1">
              {navItems.map(item => renderNavItem(item))}
            </nav>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
};
