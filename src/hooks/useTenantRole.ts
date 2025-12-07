import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, DEV_MODE_KEY, DEV_MODE_TYPE_KEY } from "./useAuth";

export type TenantRole = "super_admin" | "admin" | "manager" | "employee";

export const useTenantRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<TenantRole | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isTenantAdmin, setIsTenantAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTenantRole = async () => {
      // Check for dev mode first
      const devMode = localStorage.getItem(DEV_MODE_KEY) === "true";
      const devType = localStorage.getItem(DEV_MODE_TYPE_KEY);
      const tenantRole = localStorage.getItem("atlas_tenant_role") as TenantRole | null;
      
      if (devMode) {
        // In dev mode, check for tenant role override
        if (tenantRole === "super_admin") {
          setRole("super_admin");
          setIsSuperAdmin(true);
          setIsTenantAdmin(true);
        } else if (devType === "client") {
          // Default to employee for regular client dev mode
          setRole("employee");
          setIsSuperAdmin(false);
          setIsTenantAdmin(false);
        }
        setLoading(false);
        return;
      }

      if (!user) {
        setRole(null);
        setIsSuperAdmin(false);
        setIsTenantAdmin(false);
        setLoading(false);
        return;
      }

      // Skip DB check for dev mode users
      if (user.id.startsWith("dev-")) {
        if (tenantRole === "super_admin") {
          setRole("super_admin");
          setIsSuperAdmin(true);
          setIsTenantAdmin(true);
        } else {
          setRole("employee");
          setIsSuperAdmin(false);
          setIsTenantAdmin(false);
        }
        setLoading(false);
        return;
      }

      try {
        // Check user's tenant role from client_tenant_users table
        const { data, error } = await supabase
          .from('client_tenant_users')
          .select('role, tenant_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking tenant role:', error);
          setRole(null);
          setIsSuperAdmin(false);
          setIsTenantAdmin(false);
        } else if (data) {
          const userRole = data.role as TenantRole;
          setRole(userRole);
          setIsSuperAdmin(userRole === "super_admin");
          setIsTenantAdmin(userRole === "super_admin" || userRole === "admin");
        } else {
          setRole(null);
          setIsSuperAdmin(false);
          setIsTenantAdmin(false);
        }
      } catch (err) {
        console.error('Error:', err);
        setRole(null);
        setIsSuperAdmin(false);
        setIsTenantAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkTenantRole();
  }, [user]);

  return { role, isSuperAdmin, isTenantAdmin, loading };
};
