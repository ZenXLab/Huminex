import { useState, useEffect, useCallback } from "react";
import { EmployeeRole } from "./useEmployeeRole";

export interface PortalWidgetConfig {
  id: string;
  order: number;
  size: "small" | "medium" | "large" | "full";
  visible: boolean;
}

export interface PortalWidgetMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "overview" | "hr" | "finance" | "operations" | "personal";
  defaultSize: PortalWidgetConfig["size"];
  allowedRoles: EmployeeRole[];
}

export interface PortalDashboardPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  widgets: PortalWidgetConfig[];
  isCustom?: boolean;
  forRoles?: EmployeeRole[];
}

interface PortalDashboardLayout {
  widgets: PortalWidgetConfig[];
  activePreset: string | null;
  lastUpdated: string;
}

interface RoleWidgetAccess {
  [widgetId: string]: boolean;
}

interface WidgetAccessConfig {
  staff: RoleWidgetAccess;
  hr: RoleWidgetAccess;
  manager: RoleWidgetAccess;
  finance: RoleWidgetAccess;
  admin: RoleWidgetAccess;
}

const STORAGE_KEY = "portal-dashboard-layout";
const CUSTOM_PRESETS_KEY = "portal-custom-presets";
const WIDGET_ACCESS_STORAGE_KEY = "tenant-widget-access-config";

// Portal widget catalog - all available employee widgets
export const portalWidgetCatalog: PortalWidgetMeta[] = [
  // Overview widgets - available to all
  { id: "quick-stats", name: "Quick Stats", description: "Key metrics at a glance", icon: "BarChart3", category: "overview", defaultSize: "full", allowedRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "projects", name: "My Projects", description: "Active project progress", icon: "FolderKanban", category: "overview", defaultSize: "large", allowedRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "quick-actions", name: "Quick Actions", description: "Fast access to common tasks", icon: "Zap", category: "overview", defaultSize: "medium", allowedRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "meetings", name: "Upcoming Meetings", description: "Scheduled meetings and calls", icon: "Calendar", category: "overview", defaultSize: "medium", allowedRoles: ["staff", "hr", "manager", "finance", "admin"] },
  
  // HR/Personal widgets
  { id: "attendance", name: "Attendance Summary", description: "Today's check-in status and monthly overview", icon: "Clock", category: "hr", defaultSize: "medium", allowedRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "leave-balance", name: "Leave Balance", description: "Available leave days by type", icon: "CalendarDays", category: "hr", defaultSize: "small", allowedRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "team-attendance", name: "Team Attendance", description: "Team presence overview", icon: "Users", category: "hr", defaultSize: "medium", allowedRoles: ["hr", "manager", "admin"] },
  
  // Finance widgets
  { id: "payslip", name: "Payslip Quick View", description: "Latest salary breakdown", icon: "Receipt", category: "finance", defaultSize: "medium", allowedRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "invoices", name: "Pending Invoices", description: "Outstanding invoices summary", icon: "FileText", category: "finance", defaultSize: "medium", allowedRoles: ["finance", "admin"] },
  { id: "expense-claims", name: "Expense Claims", description: "Pending reimbursements", icon: "CreditCard", category: "finance", defaultSize: "small", allowedRoles: ["staff", "hr", "manager", "finance", "admin"] },
  
  // Operations widgets
  { id: "tasks", name: "My Tasks", description: "Assigned tasks and deadlines", icon: "CheckSquare", category: "operations", defaultSize: "large", allowedRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "tickets", name: "Support Tickets", description: "Open tickets status", icon: "Headphones", category: "operations", defaultSize: "medium", allowedRoles: ["hr", "manager", "admin"] },
  { id: "announcements", name: "Announcements", description: "Company news and updates", icon: "Megaphone", category: "personal", defaultSize: "medium", allowedRoles: ["staff", "hr", "manager", "finance", "admin"] },
  
  // Manager-specific
  { id: "team-overview", name: "Team Overview", description: "Direct reports summary", icon: "UserCheck", category: "hr", defaultSize: "large", allowedRoles: ["manager", "admin"] },
  { id: "approvals", name: "Pending Approvals", description: "Leave and expense approvals", icon: "ClipboardCheck", category: "operations", defaultSize: "medium", allowedRoles: ["hr", "manager", "admin"] },
];

// Get tenant admin's widget access configuration
const getTenantWidgetAccessConfig = (): WidgetAccessConfig | null => {
  try {
    const saved = localStorage.getItem(WIDGET_ACCESS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load widget access config:", e);
  }
  return null;
};

// Check if a widget is enabled for a role by tenant admin
const isWidgetEnabledByTenant = (widgetId: string, role: EmployeeRole): boolean => {
  const config = getTenantWidgetAccessConfig();
  if (!config) {
    // No tenant config = use default role-based access
    return true;
  }
  
  const roleConfig = config[role];
  if (!roleConfig) {
    return true;
  }
  
  // If widget is explicitly configured, use that; otherwise default to role's default access
  if (widgetId in roleConfig) {
    return roleConfig[widgetId];
  }
  
  return true;
};

// Get widgets accessible for a specific role (combines role permissions + tenant config)
export const getWidgetsForRole = (role: EmployeeRole): PortalWidgetMeta[] => {
  return portalWidgetCatalog.filter(widget => 
    widget.allowedRoles.includes(role) && isWidgetEnabledByTenant(widget.id, role)
  );
};

// Default widgets by role (filtered by tenant config)
const getDefaultWidgetsByRole = (role: EmployeeRole): PortalWidgetConfig[] => {
  const baseWidgets: PortalWidgetConfig[] = [
    { id: "quick-stats", order: 0, size: "full", visible: true },
    { id: "attendance", order: 1, size: "medium", visible: true },
    { id: "leave-balance", order: 2, size: "small", visible: true },
    { id: "payslip", order: 3, size: "medium", visible: true },
    { id: "tasks", order: 4, size: "large", visible: true },
    { id: "projects", order: 5, size: "large", visible: true },
    { id: "meetings", order: 6, size: "medium", visible: true },
    { id: "quick-actions", order: 7, size: "medium", visible: true },
    { id: "announcements", order: 8, size: "medium", visible: true },
    { id: "expense-claims", order: 9, size: "small", visible: true },
  ];

  const roleSpecificWidgets: Record<EmployeeRole, PortalWidgetConfig[]> = {
    staff: baseWidgets,
    hr: [
      ...baseWidgets,
      { id: "team-attendance", order: 10, size: "medium", visible: true },
      { id: "tickets", order: 11, size: "medium", visible: true },
      { id: "approvals", order: 12, size: "medium", visible: true },
    ],
    manager: [
      ...baseWidgets,
      { id: "team-overview", order: 10, size: "large", visible: true },
      { id: "team-attendance", order: 11, size: "medium", visible: true },
      { id: "approvals", order: 12, size: "medium", visible: true },
      { id: "tickets", order: 13, size: "medium", visible: true },
    ],
    finance: [
      ...baseWidgets,
      { id: "invoices", order: 10, size: "medium", visible: true },
    ],
    admin: [
      ...baseWidgets,
      { id: "team-overview", order: 10, size: "large", visible: true },
      { id: "team-attendance", order: 11, size: "medium", visible: true },
      { id: "tickets", order: 12, size: "medium", visible: true },
      { id: "approvals", order: 13, size: "medium", visible: true },
      { id: "invoices", order: 14, size: "medium", visible: true },
    ],
  };

  const allWidgets = roleSpecificWidgets[role] || baseWidgets;
  
  // Filter out widgets that tenant admin has disabled for this role
  return allWidgets.filter(widget => isWidgetEnabledByTenant(widget.id, role));
};

// Role-based presets
export const getPortalPresets = (role: EmployeeRole): PortalDashboardPreset[] => {
  const basePresets: PortalDashboardPreset[] = [
    {
      id: "minimal",
      name: "Minimal",
      description: "Essential widgets only",
      icon: "Minimize2",
      widgets: [
        { id: "quick-stats", order: 0, size: "full", visible: true },
        { id: "tasks", order: 1, size: "large", visible: true },
        { id: "meetings", order: 2, size: "medium", visible: true },
        { id: "quick-actions", order: 3, size: "medium", visible: true },
      ],
    },
    {
      id: "standard",
      name: "Standard",
      description: "Balanced view with key widgets",
      icon: "LayoutGrid",
      widgets: getDefaultWidgetsByRole(role),
    },
    {
      id: "personal",
      name: "Personal Focus",
      description: "Focus on your tasks and schedule",
      icon: "User",
      widgets: [
        { id: "quick-stats", order: 0, size: "full", visible: true },
        { id: "attendance", order: 1, size: "medium", visible: true },
        { id: "leave-balance", order: 2, size: "small", visible: true },
        { id: "tasks", order: 3, size: "large", visible: true },
        { id: "meetings", order: 4, size: "medium", visible: true },
        { id: "payslip", order: 5, size: "medium", visible: true },
        { id: "expense-claims", order: 6, size: "small", visible: true },
      ],
    },
  ];

  // Add role-specific presets
  if (role === "manager" || role === "admin") {
    basePresets.push({
      id: "team-lead",
      name: "Team Lead",
      description: "Focus on team management",
      icon: "Users",
      forRoles: ["manager", "admin"],
      widgets: [
        { id: "quick-stats", order: 0, size: "full", visible: true },
        { id: "team-overview", order: 1, size: "large", visible: true },
        { id: "team-attendance", order: 2, size: "medium", visible: true },
        { id: "approvals", order: 3, size: "medium", visible: true },
        { id: "tasks", order: 4, size: "large", visible: true },
        { id: "tickets", order: 5, size: "medium", visible: true },
        { id: "meetings", order: 6, size: "medium", visible: true },
      ],
    });
  }

  if (role === "hr" || role === "admin") {
    basePresets.push({
      id: "hr-focus",
      name: "HR Focus",
      description: "People management view",
      icon: "UserCheck",
      forRoles: ["hr", "admin"],
      widgets: [
        { id: "quick-stats", order: 0, size: "full", visible: true },
        { id: "team-attendance", order: 1, size: "large", visible: true },
        { id: "approvals", order: 2, size: "medium", visible: true },
        { id: "tickets", order: 3, size: "medium", visible: true },
        { id: "announcements", order: 4, size: "medium", visible: true },
        { id: "leave-balance", order: 5, size: "small", visible: true },
      ],
    });
  }

  if (role === "finance" || role === "admin") {
    basePresets.push({
      id: "finance-focus",
      name: "Finance Focus",
      description: "Financial overview",
      icon: "DollarSign",
      forRoles: ["finance", "admin"],
      widgets: [
        { id: "quick-stats", order: 0, size: "full", visible: true },
        { id: "invoices", order: 1, size: "large", visible: true },
        { id: "payslip", order: 2, size: "medium", visible: true },
        { id: "expense-claims", order: 3, size: "medium", visible: true },
        { id: "tasks", order: 4, size: "large", visible: true },
      ],
    });
  }

  return basePresets;
};

export const usePortalDashboardLayout = (role: EmployeeRole) => {
  const [widgets, setWidgets] = useState<PortalWidgetConfig[]>(() => getDefaultWidgetsByRole(role));
  const [activePreset, setActivePreset] = useState<string | null>("standard");
  const [customPresets, setCustomPresets] = useState<PortalDashboardPreset[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Load layout and custom presets from localStorage on mount
  useEffect(() => {
    try {
      const storageKeyWithRole = `${STORAGE_KEY}-${role}`;
      const saved = localStorage.getItem(storageKeyWithRole);
      if (saved) {
        const layout: PortalDashboardLayout = JSON.parse(saved);
        // Filter widgets to only include those accessible by current role AND enabled by tenant
        const accessibleWidgets = layout.widgets.filter(w => {
          const meta = portalWidgetCatalog.find(m => m.id === w.id);
          return meta?.allowedRoles.includes(role) && isWidgetEnabledByTenant(w.id, role);
        });
        setWidgets(accessibleWidgets.sort((a, b) => a.order - b.order));
        setActivePreset(layout.activePreset);
      } else {
        setWidgets(getDefaultWidgetsByRole(role));
      }
      
      const savedPresets = localStorage.getItem(`${CUSTOM_PRESETS_KEY}-${role}`);
      if (savedPresets) {
        setCustomPresets(JSON.parse(savedPresets));
      }
    } catch (e) {
      console.error("Failed to load portal dashboard layout:", e);
    }
  }, [role]);

  // Save layout to localStorage
  const saveLayout = useCallback((newWidgets: PortalWidgetConfig[], preset: string | null = null) => {
    const storageKeyWithRole = `${STORAGE_KEY}-${role}`;
    const layout: PortalDashboardLayout = {
      widgets: newWidgets,
      activePreset: preset,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(storageKeyWithRole, JSON.stringify(layout));
  }, [role]);

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
    (id: string, size: PortalWidgetConfig["size"]) => {
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
      const meta = portalWidgetCatalog.find((w) => w.id === widgetId);
      // Check role permissions AND tenant config
      if (!meta || !meta.allowedRoles.includes(role) || !isWidgetEnabledByTenant(widgetId, role)) return;

      setWidgets((prev) => {
        const exists = prev.find((w) => w.id === widgetId);
        if (exists) {
          const newWidgets = prev.map((w) =>
            w.id === widgetId ? { ...w, visible: true } : w
          );
          saveLayout(newWidgets, null);
          setActivePreset(null);
          return newWidgets;
        }

        const newWidget: PortalWidgetConfig = {
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
    [saveLayout, role]
  );

  // Apply preset
  const applyPreset = useCallback(
    (presetId: string) => {
      const allPresets = [...getPortalPresets(role), ...customPresets];
      const preset = allPresets.find((p) => p.id === presetId);
      if (!preset) return;

      // Filter widgets to only include those accessible by current role AND enabled by tenant
      const accessibleWidgets = preset.widgets.filter(w => {
        const meta = portalWidgetCatalog.find(m => m.id === w.id);
        return meta?.allowedRoles.includes(role) && isWidgetEnabledByTenant(w.id, role);
      });

      setWidgets(accessibleWidgets);
      setActivePreset(presetId);
      saveLayout(accessibleWidgets, presetId);
    },
    [saveLayout, customPresets, role]
  );

  // Save current layout as custom preset
  const saveCustomPreset = useCallback(
    (name: string, description: string = "") => {
      const presetId = `custom-${Date.now()}`;
      const newPreset: PortalDashboardPreset = {
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
      localStorage.setItem(`${CUSTOM_PRESETS_KEY}-${role}`, JSON.stringify(updatedPresets));
      saveLayout(widgets, presetId);
      
      return presetId;
    },
    [widgets, customPresets, saveLayout, role]
  );

  // Delete custom preset
  const deleteCustomPreset = useCallback(
    (presetId: string) => {
      const updatedPresets = customPresets.filter((p) => p.id !== presetId);
      setCustomPresets(updatedPresets);
      localStorage.setItem(`${CUSTOM_PRESETS_KEY}-${role}`, JSON.stringify(updatedPresets));
      
      if (activePreset === presetId) {
        setActivePreset(null);
      }
    },
    [customPresets, activePreset, role]
  );

  // Reset to default layout for role
  const resetLayout = useCallback(() => {
    const defaultWidgets = getDefaultWidgetsByRole(role);
    setWidgets(defaultWidgets);
    setActivePreset("standard");
    localStorage.removeItem(`${STORAGE_KEY}-${role}`);
  }, [role]);

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
    availableWidgets: getWidgetsForRole(role),
    presets: getPortalPresets(role),
  };
};
