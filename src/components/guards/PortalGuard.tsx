import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface PortalGuardProps {
  children: React.ReactNode;
}

/**
 * PortalGuard - Route guard for Client Employee Portal (/portal/*)
 * 
 * Ensures only authenticated users can access the employee portal.
 * This is the workspace where employees, managers, HR users, and finance users 
 * log in and work daily.
 */
export const PortalGuard: React.FC<PortalGuardProps> = ({ children }) => {
  const { user, loading, isDevMode } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in and not in dev mode, redirect to portal login
  if (!user && !isDevMode) {
    return <Navigate to="/portal/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PortalGuard;
