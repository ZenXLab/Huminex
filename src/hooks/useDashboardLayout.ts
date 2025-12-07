import { useState, useEffect, useCallback } from "react";

export interface WidgetConfig {
  id: string;
  order: number;
  size: "small" | "medium" | "large" | "full";
  visible: boolean;
}

interface DashboardLayout {
  widgets: WidgetConfig[];
  lastUpdated: string;
}

const STORAGE_KEY = "admin-dashboard-layout";

const defaultLayout: WidgetConfig[] = [
  { id: "stats", order: 0, size: "full", visible: true },
  { id: "system-health", order: 1, size: "full", visible: true },
  { id: "clickstream", order: 2, size: "full", visible: true },
  { id: "onboarding", order: 3, size: "medium", visible: true },
  { id: "tenants", order: 4, size: "medium", visible: true },
  { id: "quotes", order: 5, size: "full", visible: true },
  { id: "quick-actions", order: 6, size: "full", visible: true },
];

export const useDashboardLayout = () => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(defaultLayout);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Load layout from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const layout: DashboardLayout = JSON.parse(saved);
        // Merge with default to handle new widgets
        const mergedWidgets = defaultLayout.map((defaultWidget) => {
          const savedWidget = layout.widgets.find((w) => w.id === defaultWidget.id);
          return savedWidget || defaultWidget;
        });
        setWidgets(mergedWidgets.sort((a, b) => a.order - b.order));
      }
    } catch (e) {
      console.error("Failed to load dashboard layout:", e);
    }
  }, []);

  // Save layout to localStorage
  const saveLayout = useCallback((newWidgets: WidgetConfig[]) => {
    const layout: DashboardLayout = {
      widgets: newWidgets,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }, []);

  // Reorder widgets after drag
  const reorderWidgets = useCallback(
    (sourceId: string, targetId: string) => {
      setWidgets((prev) => {
        const sourceIndex = prev.findIndex((w) => w.id === sourceId);
        const targetIndex = prev.findIndex((w) => w.id === targetId);
        
        if (sourceIndex === -1 || targetIndex === -1) return prev;

        const newWidgets = [...prev];
        const [removed] = newWidgets.splice(sourceIndex, 1);
        newWidgets.splice(targetIndex, 0, removed);

        // Update order values
        const reordered = newWidgets.map((w, i) => ({ ...w, order: i }));
        saveLayout(reordered);
        return reordered;
      });
    },
    [saveLayout]
  );

  // Resize widget
  const resizeWidget = useCallback(
    (id: string, size: WidgetConfig["size"]) => {
      setWidgets((prev) => {
        const newWidgets = prev.map((w) =>
          w.id === id ? { ...w, size } : w
        );
        saveLayout(newWidgets);
        return newWidgets;
      });
    },
    [saveLayout]
  );

  // Toggle widget visibility
  const toggleWidget = useCallback(
    (id: string) => {
      setWidgets((prev) => {
        const newWidgets = prev.map((w) =>
          w.id === id ? { ...w, visible: !w.visible } : w
        );
        saveLayout(newWidgets);
        return newWidgets;
      });
    },
    [saveLayout]
  );

  // Reset to default layout
  const resetLayout = useCallback(() => {
    setWidgets(defaultLayout);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    widgets,
    isEditMode,
    isDragging,
    setIsEditMode,
    setIsDragging,
    reorderWidgets,
    resizeWidget,
    toggleWidget,
    resetLayout,
  };
};
