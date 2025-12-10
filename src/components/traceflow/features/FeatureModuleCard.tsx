import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FeatureBadge } from "@/components/ui/feature-badge";
import {
  ChevronDown,
  ChevronUp,
  Check,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  GripVertical,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
}

interface FeatureModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  featureId?: string; // For automatic badge lifecycle
  stats?: StatItem[];
  status: {
    implemented: number;
    partial: number;
    planned: number;
    total: number;
  };
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  onDragStart?: () => void;
  draggable?: boolean;
  accentColor?: string;
}

export const FeatureModuleCard = ({
  id,
  title,
  description,
  icon,
  category,
  featureId,
  stats,
  status,
  children,
  defaultExpanded = false,
  draggable = true,
  accentColor = "primary",
}: FeatureModuleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const implementedPercentage = (status.implemented / status.total) * 100;
  const partialPercentage = (status.partial / status.total) * 100;

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-emerald-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-emerald-600';
      case 'down': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group",
        isFullscreen && "fixed inset-4 z-50 bg-background"
      )}
    >
      <Card className={cn(
        "bg-card/80 backdrop-blur border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden",
        isExpanded && "ring-1 ring-primary/20",
        isFullscreen && "h-full"
      )}>
        {/* Accent Bar */}
        <div className={cn(
          "h-1 bg-gradient-to-r",
          accentColor === "primary" && "from-primary to-accent",
          accentColor === "emerald" && "from-emerald-500 to-teal-500",
          accentColor === "amber" && "from-amber-500 to-orange-500",
          accentColor === "purple" && "from-purple-500 to-pink-500",
          accentColor === "blue" && "from-blue-500 to-cyan-500",
        )} />

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {draggable && (
                  <div className="mt-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className={cn(
                  "p-2 rounded-lg bg-gradient-to-br shrink-0",
                  accentColor === "primary" && "from-primary/10 to-accent/10",
                  accentColor === "emerald" && "from-emerald-500/10 to-teal-500/10",
                  accentColor === "amber" && "from-amber-500/10 to-orange-500/10",
                  accentColor === "purple" && "from-purple-500/10 to-pink-500/10",
                  accentColor === "blue" && "from-blue-500/10 to-cyan-500/10",
                )}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                      {category}
                    </Badge>
                    {featureId && <FeatureBadge featureId={featureId} />}
                    <CardTitle className="text-sm font-semibold truncate">{title}</CardTitle>
                  </div>
                  <CardDescription className="text-xs line-clamp-1">{description}</CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-3 w-3" />
                  ) : (
                    <Maximize2 className="h-3 w-3" />
                  )}
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600">{status.implemented} Implemented</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-500" />
                    <span className="text-amber-600">{status.partial} Partial</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{status.planned} Planned</span>
                  </span>
                </div>
                <span className="font-medium">{Math.round(implementedPercentage)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${implementedPercentage}%` }}
                />
                <div 
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${partialPercentage}%` }}
                />
              </div>
            </div>

            {/* Stats Row */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs font-bold">{stat.value}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{stat.label}</p>
                    {stat.change && (
                      <div className="flex items-center justify-center gap-0.5 mt-0.5">
                        {getTrendIcon(stat.trend)}
                        <span className={cn("text-[9px] font-medium", getTrendColor(stat.trend))}>
                          {stat.change}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="pt-2 pb-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
};
