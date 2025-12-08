import { useState, useEffect, useCallback } from "react";

export interface WidgetConfig {
  id: string;
  order: number;
  size: "small" | "medium" | "large" | "full";
  visible: boolean;
}

export interface WidgetMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "overview" | "analytics" | "operations" | "system";
  defaultSize: WidgetConfig["size"];
}

export interface DashboardPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  widgets: WidgetConfig[];
  isCustom?: boolean;
}

interface DashboardLayout {
  widgets: WidgetConfig[];
  activePreset: string | null;
  lastUpdated: string;
}

const STORAGE_KEY = "admin-dashboard-layout";
const CUSTOM_PRESETS_KEY = "admin-custom-presets";

// Widget catalog - all available widgets
export const widgetCatalog: WidgetMeta[] = [
  { id: "stats", name: "Statistics Overview", description: "Key platform metrics at a glance", icon: "BarChart3", category: "overview", defaultSize: "full" },
  { id: "system-health", name: "System Health", description: "Real-time system status monitoring", icon: "Activity", category: "system", defaultSize: "full" },
  { id: "clickstream", name: "Clickstream Analytics", description: "User behavior and engagement tracking", icon: "MousePointer", category: "analytics", defaultSize: "full" },
  { id: "onboarding", name: "Pending Onboarding", description: "Client onboarding requests queue", icon: "UserPlus", category: "operations", defaultSize: "medium" },
  { id: "tenants", name: "Recent Tenants", description: "Latest tenant activity", icon: "Building2", category: "operations", defaultSize: "medium" },
  { id: "quotes", name: "Recent Quotes", description: "Latest quote requests", icon: "FileText", category: "operations", defaultSize: "full" },
  { id: "quick-actions", name: "Quick Actions", description: "Fast access to all admin modules", icon: "Zap", category: "overview", defaultSize: "full" },
  { id: "revenue-chart", name: "Revenue Chart", description: "Monthly revenue trends", icon: "TrendingUp", category: "analytics", defaultSize: "large" },
  { id: "user-activity", name: "User Activity", description: "Active users and sessions", icon: "Users", category: "analytics", defaultSize: "medium" },
  { id: "alerts", name: "System Alerts", description: "Critical alerts and notifications", icon: "Bell", category: "system", defaultSize: "medium" },
];

// Default layout
const defaultWidgets: WidgetConfig[] = [
  { id: "stats", order: 0, size: "full", visible: true },
  { id: "system-health", order: 1, size: "full", visible: true },
  { id: "clickstream", order: 2, size: "full", visible: true },
  { id: "onboarding", order: 3, size: "medium", visible: true },
  { id: "tenants", order: 4, size: "medium", visible: true },
  { id: "quotes", order: 5, size: "full", visible: true },
  { id: "quick-actions", order: 6, size: "full", visible: true },
];

// Presets
export const dashboardPresets: DashboardPreset[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Essential widgets only for a clean overview",
    icon: "Minimize2",
    widgets: [
      { id: "stats", order: 0, size: "full", visible: true },
      { id: "quick-actions", order: 1, size: "full", visible: true },
      { id: "system-health", order: 2, size: "full", visible: false },
      { id: "clickstream", order: 3, size: "full", visible: false },
      { id: "onboarding", order: 4, size: "medium", visible: false },
      { id: "tenants", order: 5, size: "medium", visible: false },
      { id: "quotes", order: 6, size: "full", visible: false },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    description: "Balanced view with all key widgets",
    icon: "LayoutGrid",
    widgets: defaultWidgets,
  },
  {
    id: "analytics",
    name: "Analytics Focus",
    description: "Detailed analytics and tracking widgets",
    icon: "LineChart",
    widgets: [
      { id: "stats", order: 0, size: "full", visible: true },
      { id: "clickstream", order: 1, size: "full", visible: true },
      { id: "system-health", order: 2, size: "full", visible: true },
      { id: "revenue-chart", order: 3, size: "large", visible: true },
      { id: "user-activity", order: 4, size: "medium", visible: true },
      { id: "onboarding", order: 5, size: "medium", visible: false },
      { id: "tenants", order: 6, size: "medium", visible: false },
      { id: "quotes", order: 7, size: "full", visible: false },
      { id: "quick-actions", order: 8, size: "full", visible: true },
    ],
  },
  {
    id: "operations",
    name: "Operations",
    description: "Focus on client and tenant management",
    icon: "Briefcase",
    widgets: [
      { id: "stats", order: 0, size: "full", visible: true },
      { id: "onboarding", order: 1, size: "large", visible: true },
      { id: "tenants", order: 2, size: "large", visible: true },
      { id: "quotes", order: 3, size: "full", visible: true },
      { id: "alerts", order: 4, size: "medium", visible: true },
      { id: "system-health", order: 5, size: "full", visible: true },
      { id: "quick-actions", order: 6, size: "full", visible: true },
      { id: "clickstream", order: 7, size: "full", visible: false },
    ],
  },
];

export const useDashboardLayout = () => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(defaultWidgets);
  const [activePreset, setActivePreset] = useState<string | null>("standard");
  const [customPresets, setCustomPresets] = useState<DashboardPreset[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Load layout and custom presets from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const layout: DashboardLayout = JSON.parse(saved);
        setWidgets(layout.widgets.sort((a, b) => a.order - b.order));
        setActivePreset(layout.activePreset);
      }
      
      const savedPresets = localStorage.getItem(CUSTOM_PRESETS_KEY);
      if (savedPresets) {
        setCustomPresets(JSON.parse(savedPresets));
      }
    } catch (e) {
      console.error("Failed to load dashboard layout:", e);
    }
  }, []);

  // Save layout to localStorage
  const saveLayout = useCallback((newWidgets: WidgetConfig[], preset: string | null = null) => {
    const layout: DashboardLayout = {
      widgets: newWidgets,
      activePreset: preset,
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

        const reordered = newWidgets.map((w, i) => ({ ...w, order: i }));
        saveLayout(reordered, null);
        setActivePreset(null);
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
        saveLayout(newWidgets, null);
        setActivePreset(null);
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
        saveLayout(newWidgets, null);
        setActivePreset(null);
        return newWidgets;
      });
    },
    [saveLayout]
  );

  // Add widget from library
  const addWidget = useCallback(
    (widgetId: string) => {
      const meta = widgetCatalog.find((w) => w.id === widgetId);
      if (!meta) return;

      setWidgets((prev) => {
        const exists = prev.find((w) => w.id === widgetId);
        if (exists) {
          // Just make it visible
          const newWidgets = prev.map((w) =>
            w.id === widgetId ? { ...w, visible: true } : w
          );
          saveLayout(newWidgets, null);
          setActivePreset(null);
          return newWidgets;
        }

        const newWidget: WidgetConfig = {
          id: widgetId,
          order: prev.length,
          size: meta.defaultSize,
          visible: true,
        };
        const newWidgets = [...prev, newWidget];
        saveLayout(newWidgets, null);
        setActivePreset(null);
        return newWidgets;
      });
    },
    [saveLayout]
  );

  // Apply preset (built-in or custom)
  const applyPreset = useCallback(
    (presetId: string) => {
      const allPresets = [...dashboardPresets, ...customPresets];
      const preset = allPresets.find((p) => p.id === presetId);
      if (!preset) return;

      setWidgets(preset.widgets);
      setActivePreset(presetId);
      saveLayout(preset.widgets, presetId);
    },
    [saveLayout, customPresets]
  );

  // Save current layout as custom preset
  const saveCustomPreset = useCallback(
    (name: string, description: string = "") => {
      const presetId = `custom-${Date.now()}`;
      const newPreset: DashboardPreset = {
        id: presetId,
        name,
        description: description || `Custom preset saved on ${new Date().toLocaleDateString()}`,
        icon: "Star",
        widgets: [...widgets],
        isCustom: true,
      };
      
      const updatedPresets = [...customPresets, newPreset];
      setCustomPresets(updatedPresets);
      setActivePreset(presetId);
      localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(updatedPresets));
      saveLayout(widgets, presetId);
      
      return presetId;
    },
    [widgets, customPresets, saveLayout]
  );

  // Delete custom preset
  const deleteCustomPreset = useCallback(
    (presetId: string) => {
      const updatedPresets = customPresets.filter((p) => p.id !== presetId);
      setCustomPresets(updatedPresets);
      localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(updatedPresets));
      
      if (activePreset === presetId) {
        setActivePreset(null);
      }
    },
    [customPresets, activePreset]
  );

  // Reset to default layout
  const resetLayout = useCallback(() => {
    setWidgets(defaultWidgets);
    setActivePreset("standard");
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    widgets,
    activePreset,
    customPresets,
    isEditMode,
    isDragging,
    isLibraryOpen,
    setIsEditMode,
    setIsDragging,
    setIsLibraryOpen,
    reorderWidgets,
    resizeWidget,
    toggleWidget,
    addWidget,
    applyPreset,
    saveCustomPreset,
    deleteCustomPreset,
    resetLayout,
  };
};
