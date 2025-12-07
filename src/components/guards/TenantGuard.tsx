import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTenantRole } from "@/hooks/useTenantRole";
import { Loader2 } from "lucide-react";

interface TenantGuardProps {
  children: React.ReactNode;
  requiredRole?: "super_admin" | "admin" | "manager" | "employee";
}

/**
 * TenantGuard - Route guard for Tenant Super-Admin Portal (/tenant/*)
 * 
 * Ensures only users with appropriate tenant admin roles can access the tenant portal.
 * - Super Admins have full access to all tenant configurations
 * - Regular employees should be redirected to /portal instead
 */
export const TenantGuard: React.FC<TenantGuardProps> = ({ 
  children, 
  requiredRole = "super_admin" 
}) => {
  const { user, loading: authLoading, isDevMode } = useAuth();
  const { isSuperAdmin, isTenantAdmin, loading: roleLoading } = useTenantRole();
  const location = useLocation();

  // Show loading state while checking auth and roles
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#005EEB]" />
          <p className="text-sm text-[#6B7280]">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to tenant login
  if (!user && !isDevMode) {
    return <Navigate to="/tenant/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  const hasAccess = requiredRole === "super_admin" 
    ? isSuperAdmin 
    : isTenantAdmin;

  // If user doesn't have the required role, redirect appropriately
  if (!hasAccess && !isDevMode) {
    // Regular employees should go to the portal
    return <Navigate to="/portal" replace />;
  }

  // In dev mode, allow access if tenant role is set
  if (isDevMode) {
    const tenantRole = localStorage.getItem("atlas_tenant_role");
    if (!tenantRole || tenantRole !== "super_admin") {
      // Set the role for dev mode access
      localStorage.setItem("atlas_tenant_role", "super_admin");
    }
  }

  return <>{children}</>;
};

export default TenantGuard;
