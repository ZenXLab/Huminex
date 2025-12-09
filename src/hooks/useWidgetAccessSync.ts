import { useState, useEffect, useCallback } from "react";
import { EmployeeRole } from "./useEmployeeRole";

const WIDGET_ACCESS_STORAGE_KEY = "tenant-widget-access-config";
const SIDEBAR_ACCESS_STORAGE_KEY = "tenant-sidebar-access-config";

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

export const useWidgetAccessSync = (role: EmployeeRole) => {
  const [accessConfig, setAccessConfig] = useState<WidgetAccessConfig | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Load initial config
  const loadConfig = useCallback(() => {
    try {
      const saved = localStorage.getItem(WIDGET_ACCESS_STORAGE_KEY);
      if (saved) {
        setAccessConfig(JSON.parse(saved));
      } else {
        setAccessConfig(null);
      }
    } catch (e) {
      console.error("Failed to load widget access config:", e);
      setAccessConfig(null);
    }
  }, []);

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    loadConfig();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WIDGET_ACCESS_STORAGE_KEY) {
        loadConfig();
        setLastUpdate(Date.now());
      }
    };

    // Listen for storage events from other tabs
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events for same-tab updates
    const handleCustomUpdate = () => {
      loadConfig();
      setLastUpdate(Date.now());
    };
    window.addEventListener("widget-access-updated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("widget-access-updated", handleCustomUpdate);
    };
  }, [loadConfig]);

  // Check if a widget is enabled for the current role
  const isWidgetEnabled = useCallback((widgetId: string): boolean => {
    if (!accessConfig) return true;
    const roleConfig = accessConfig[role];
    if (!roleConfig) return true;
    if (widgetId in roleConfig) {
      return roleConfig[widgetId];
    }
    return true;
  }, [accessConfig, role]);

  // Get list of restricted widgets
  const getRestrictedWidgets = useCallback((): string[] => {
    if (!accessConfig) return [];
    const roleConfig = accessConfig[role];
    if (!roleConfig) return [];
    return Object.entries(roleConfig)
      .filter(([_, enabled]) => !enabled)
      .map(([widgetId]) => widgetId);
  }, [accessConfig, role]);

  return {
    accessConfig,
    lastUpdate,
    isWidgetEnabled,
    getRestrictedWidgets,
    refreshConfig: loadConfig,
  };
};

// Sidebar access sync hook
export const useSidebarAccessSync = (role: EmployeeRole) => {
  const [sidebarConfig, setSidebarConfig] = useState<WidgetAccessConfig | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const loadConfig = useCallback(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_ACCESS_STORAGE_KEY);
      if (saved) {
        setSidebarConfig(JSON.parse(saved));
      } else {
        setSidebarConfig(null);
      }
    } catch (e) {
      console.error("Failed to load sidebar access config:", e);
      setSidebarConfig(null);
    }
  }, []);

  useEffect(() => {
    loadConfig();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SIDEBAR_ACCESS_STORAGE_KEY) {
        loadConfig();
        setLastUpdate(Date.now());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleCustomUpdate = () => {
      loadConfig();
      setLastUpdate(Date.now());
    };
    window.addEventListener("sidebar-access-updated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("sidebar-access-updated", handleCustomUpdate);
    };
  }, [loadConfig]);

  const isModuleEnabled = useCallback((moduleId: string): boolean => {
    if (!sidebarConfig) return true;
    const roleConfig = sidebarConfig[role];
    if (!roleConfig) return true;
    return roleConfig[moduleId] !== false;
  }, [sidebarConfig, role]);

  return {
    sidebarConfig,
    lastUpdate,
    isModuleEnabled,
    refreshConfig: loadConfig,
  };
};

// Helper to dispatch custom event when widget config changes
export const notifyWidgetAccessUpdate = () => {
  window.dispatchEvent(new CustomEvent("widget-access-updated"));
};

// Helper to dispatch custom event when sidebar config changes
export const notifySidebarAccessUpdate = () => {
  window.dispatchEvent(new CustomEvent("sidebar-access-updated"));
};
