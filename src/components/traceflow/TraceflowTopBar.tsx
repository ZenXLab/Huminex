import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Bell, 
  Plus, 
  RefreshCw,
  Calendar,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sidebar items for header display
const sidebarLabels: Record<string, { label: string; description: string }> = {
  overview: { label: "Overview", description: "AI-powered dashboard with real-time insights" },
  capture: { label: "Capture Engine", description: "Universal auto-capture across web & mobile" },
  sessions: { label: "Session Intelligence", description: "AI summaries, root-cause & fix suggestions" },
  ux: { label: "UX Intelligence", description: "Visual breakage, heatmaps & design auditor" },
  journeys: { label: "Journey Intelligence", description: "Auto-funnels, drop-off causality & simulator" },
  product: { label: "Product Intelligence", description: "Feature usage, retention & churn prediction" },
  observability: { label: "Observability", description: "OTel traces, service maps & API correlation" },
  multimodal: { label: "Multi-Modal AI", description: "Voice, text & sentiment fusion with sessions" },
  "ai-ops": { label: "AI Operations", description: "Multi-agent auto-ticketing & monitoring" },
  revenue: { label: "Revenue Insights", description: "Financial impact & ROI of UX improvements" },
  sdk: { label: "SDK & Setup", description: "Integrate TRACEFLOW in minutes" },
  settings: { label: "Admin & Billing", description: "Feature store, team & billing management" },
};

interface TraceflowTopBarProps {
  activeTab: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
  timeFilter: string;
  onTimeFilterChange: (value: string) => void;
}

export const TraceflowTopBar = ({ 
  activeTab, 
  onRefresh, 
  isRefreshing, 
  timeFilter, 
  onTimeFilterChange 
}: TraceflowTopBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const currentModule = sidebarLabels[activeTab] || { label: "Dashboard", description: "" };

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Module Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground truncate">{currentModule.label}</h1>
          <p className="text-sm text-muted-foreground truncate">{currentModule.description}</p>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search sessions, events, users..." 
              className="pl-9 bg-muted/50 border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Time Filter */}
          <Select value={timeFilter} onValueChange={onTimeFilterChange}>
            <SelectTrigger className="w-32 h-9 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {/* Refresh */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-9"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>

          {/* Notifications */}
          <Button variant="outline" size="sm" className="h-9 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* New Analysis */}
          <Button size="sm" className="h-9 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">New Analysis</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
