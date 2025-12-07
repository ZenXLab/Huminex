import { memo } from "react";
import { motion } from "framer-motion";
import { Check, Minimize2, LayoutGrid, LineChart, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dashboardPresets, DashboardPreset } from "@/hooks/useDashboardLayout";

interface DashboardPresetsProps {
  activePreset: string | null;
  onApplyPreset: (presetId: string) => void;
}

const iconMap: Record<string, any> = {
  Minimize2,
  LayoutGrid,
  LineChart,
  Briefcase,
};

export const DashboardPresets = memo(({
  activePreset,
  onApplyPreset,
}: DashboardPresetsProps) => {
  const currentPreset = dashboardPresets.find((p) => p.id === activePreset);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentPreset ? currentPreset.name : "Custom"}
          </span>
          {!currentPreset && (
            <Badge variant="secondary" className="text-xs px-1.5">
              Custom
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Dashboard Presets</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dashboardPresets.map((preset) => {
          const Icon = iconMap[preset.icon] || LayoutGrid;
          const isActive = activePreset === preset.id;

          return (
            <DropdownMenuItem
              key={preset.id}
              onClick={() => onApplyPreset(preset.id)}
              className="flex items-start gap-3 p-3 cursor-pointer"
            >
              <div className={`p-2 rounded-lg ${isActive ? "bg-primary/10" : "bg-muted"}`}>
                <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                    {preset.name}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center w-4 h-4 rounded-full bg-primary"
                    >
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{preset.description}</p>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <div className="px-3 py-2">
          <p className="text-xs text-muted-foreground">
            Presets provide quick layouts. Customize further in edit mode.
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

DashboardPresets.displayName = "DashboardPresets";