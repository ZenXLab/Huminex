import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Check, BarChart3, Activity, MousePointer, UserPlus, Building2, FileText, Zap, TrendingUp, Users, Bell, Briefcase, LineChart, LayoutGrid, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { widgetCatalog, WidgetMeta, WidgetConfig } from "@/hooks/useDashboardLayout";

interface WidgetLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: WidgetConfig[];
  onAddWidget: (widgetId: string) => void;
}

const iconMap: Record<string, any> = {
  BarChart3,
  Activity,
  MousePointer,
  UserPlus,
  Building2,
  FileText,
  Zap,
  TrendingUp,
  Users,
  Bell,
  Briefcase,
  LineChart,
  LayoutGrid,
  Minimize2,
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  overview: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/20" },
  analytics: { bg: "bg-purple-500/10", text: "text-purple-600", border: "border-purple-500/20" },
  operations: { bg: "bg-green-500/10", text: "text-green-600", border: "border-green-500/20" },
  system: { bg: "bg-orange-500/10", text: "text-orange-600", border: "border-orange-500/20" },
};

const WidgetCard = memo(({
  widget,
  isAdded,
  onAdd,
}: {
  widget: WidgetMeta;
  isAdded: boolean;
  onAdd: () => void;
}) => {
  const Icon = iconMap[widget.icon] || BarChart3;
  const colors = categoryColors[widget.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${isAdded ? "bg-muted/50 border-muted" : "bg-card border-border hover:border-primary/30"} transition-all group`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-lg ${colors.bg} shrink-0`}>
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground truncate">{widget.name}</h4>
            <Badge variant="outline" className={`text-xs ${colors.bg} ${colors.text} ${colors.border}`}>
              {widget.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{widget.description}</p>
        </div>
        <Button
          size="sm"
          variant={isAdded ? "secondary" : "default"}
          className="shrink-0"
          onClick={onAdd}
          disabled={isAdded}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Added
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
});

WidgetCard.displayName = "WidgetCard";

export const WidgetLibrary = memo(({
  isOpen,
  onClose,
  widgets,
  onAddWidget,
}: WidgetLibraryProps) => {
  const addedWidgetIds = widgets.filter((w) => w.visible).map((w) => w.id);

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "analytics", label: "Analytics" },
    { id: "operations", label: "Operations" },
    { id: "system", label: "System" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Widget Library</h2>
                  <p className="text-sm text-muted-foreground">Add widgets to your dashboard</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-8">
                  {categories.map((category) => {
                    const categoryWidgets = widgetCatalog.filter(
                      (w) => w.category === category.id
                    );
                    if (categoryWidgets.length === 0) return null;

                    return (
                      <div key={category.id}>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                          {category.label}
                        </h3>
                        <div className="space-y-3">
                          {categoryWidgets.map((widget) => (
                            <WidgetCard
                              key={widget.id}
                              widget={widget}
                              isAdded={addedWidgetIds.includes(widget.id)}
                              onAdd={() => onAddWidget(widget.id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  {addedWidgetIds.length} of {widgetCatalog.length} widgets active
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

WidgetLibrary.displayName = "WidgetLibrary";