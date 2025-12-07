import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard - Route guard for ATLAS Global Admin Dashboard (/admin/*)
 * 
 * This is NOT visible to clients.
 * Used for:
 * - Managing tenants
 * - Platform-wide billing & metering
 * - System health
 * - Logs & audits
 * - Provider integrations (BGV, Insurance, etc.)
 * - Feature flags & pricing
 * - ATLAS internal operations
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, loading: authLoading, isDevMode } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const location = useLocation();

  // Show loading state while checking auth and roles
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If not logged in and not in dev mode, redirect to admin login
  if (!user && !isDevMode) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If logged in but not an admin, show access denied
  if (!isAdmin && !isDevMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access the admin dashboard.</p>
          <a href="/" className="text-primary hover:underline">Return to Home</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
