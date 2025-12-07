import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, DEV_MODE_KEY, DEV_MODE_TYPE_KEY } from "./useAuth";

export type EmployeeRole = "staff" | "hr" | "manager" | "finance" | "admin";

interface EmployeeRoleResult {
  role: EmployeeRole;
  isHR: boolean;
  isManager: boolean;
  isFinance: boolean;
  isAdmin: boolean;
  loading: boolean;
}

/**
 * Role-based module visibility for Employee Portal
 * - staff: Basic modules (Dashboard, Projects, Files, Meetings, Feedback, Resources, Settings)
 * - hr: Staff modules + Team, Tickets
 * - manager: Staff modules + Team, Projects (full), AI Dashboard
 * - finance: Staff modules + Invoices, MSP Monitoring
 * - admin: All modules
 */
export const useEmployeeRole = (): EmployeeRoleResult => {
  const { user } = useAuth();
  const [role, setRole] = useState<EmployeeRole>("staff");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      // Check for dev mode first
      const devMode = localStorage.getItem(DEV_MODE_KEY) === "true";
      const devType = localStorage.getItem(DEV_MODE_TYPE_KEY);
      const storedEmployeeRole = localStorage.getItem("atlas_employee_role") as EmployeeRole | null;
      
      if (devMode && devType === "client") {
        // In dev mode, check if there's a stored employee role
        setRole(storedEmployeeRole || "admin"); // Default to admin in dev mode for full access
        setLoading(false);
        return;
      }

      if (!user) {
        setRole("staff");
        setLoading(false);
        return;
      }

      // Skip DB check for dev mode users
      if (user.id.startsWith("dev-")) {
        setRole(storedEmployeeRole || "admin");
        setLoading(false);
        return;
      }

      try {
        // Check client_tenant_users for role
        const { data, error } = await supabase
          .from('client_tenant_users')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking employee role:', error);
          setRole("staff");
        } else if (data) {
          // Map tenant roles to employee roles
          const tenantRole = data.role as string;
          if (tenantRole === "super_admin" || tenantRole === "admin") {
            setRole("admin");
          } else if (tenantRole === "hr") {
            setRole("hr");
          } else if (tenantRole === "manager") {
            setRole("manager");
          } else if (tenantRole === "finance") {
            setRole("finance");
          } else {
            setRole("staff");
          }
        } else {
          setRole("staff");
        }
      } catch (err) {
        console.error('Error:', err);
        setRole("staff");
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [user]);

  return {
    role,
    isHR: role === "hr" || role === "admin",
    isManager: role === "manager" || role === "admin",
    isFinance: role === "finance" || role === "admin",
    isAdmin: role === "admin",
    loading
  };
};

/**
 * Module access by role
 */
export const moduleAccessByRole: Record<string, EmployeeRole[]> = {
  "Dashboard": ["staff", "hr", "manager", "finance", "admin"],
  "Projects": ["staff", "hr", "manager", "finance", "admin"],
  "Files": ["staff", "hr", "manager", "finance", "admin"],
  "Invoices": ["finance", "admin"],
  "Tickets": ["hr", "manager", "admin"],
  "Meetings": ["staff", "hr", "manager", "finance", "admin"],
  "AI Dashboard": ["manager", "admin"],
  "MSP Monitoring": ["finance", "admin"],
  "Team": ["hr", "manager", "admin"],
  "Feedback": ["staff", "hr", "manager", "finance", "admin"],
  "Resources": ["staff", "hr", "manager", "finance", "admin"],
  "Settings": ["staff", "hr", "manager", "finance", "admin"],
};

export const isModuleAccessibleByRole = (moduleName: string, role: EmployeeRole): boolean => {
  const allowedRoles = moduleAccessByRole[moduleName];
  return allowedRoles ? allowedRoles.includes(role) : false;
};
