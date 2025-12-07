import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Check, RotateCcw, Layout, EyeOff, Plus, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WidgetConfig } from "@/hooks/useDashboardLayout";

interface DashboardEditControlsProps {
  isEditMode: boolean;
  widgets: WidgetConfig[];
  onToggleEditMode: () => void;
  onResetLayout: () => void;
  onToggleWidget: (id: string) => void;
  onOpenLibrary: () => void;
}

export const DashboardEditControls = memo(({
  isEditMode,
  widgets,
  onToggleEditMode,
  onResetLayout,
  onToggleWidget,
  onOpenLibrary,
}: DashboardEditControlsProps) => {
  const hiddenCount = widgets.filter((w) => !w.visible).length;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              {/* Hidden widgets indicator */}
              {hiddenCount > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <EyeOff className="h-3 w-3" />
                  {hiddenCount} hidden
                </Badge>
              )}

              {/* Widget Library button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenLibrary}
                    className="gap-2"
                  >
                    <Library className="h-4 w-4" />
                    <span className="hidden sm:inline">Widgets</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Browse widget library</p>
                </TooltipContent>
              </Tooltip>

              {/* Reset button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onResetLayout}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="hidden sm:inline">Reset</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset to default layout</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit/Done button */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={onToggleEditMode}
            className="gap-2"
          >
            <AnimatePresence mode="wait">
              {isEditMode ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Done
                </motion.div>
              ) : (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  className="flex items-center gap-2"
                >
                  <Layout className="h-4 w-4" />
                  Customize
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </TooltipProvider>
  );
});

DashboardEditControls.displayName = "DashboardEditControls";
