import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTraceflowAuth } from "@/hooks/useTraceflowAuth";
import { Loader2, Activity } from "lucide-react";

interface TraceflowGuardProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export const TraceflowGuard = ({ children, requireSubscription = true }: TraceflowGuardProps) => {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, requireAuth, requireSubscription: checkSubscription } = useTraceflowAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Check authentication
    if (!requireAuth()) {
      return;
    }

    // Admin bypass - always authorized
    if (isAdmin) {
      setIsAuthorized(true);
      return;
    }

    // Check subscription if required
    if (requireSubscription) {
      if (checkSubscription()) {
        setIsAuthorized(true);
      }
    } else {
      setIsAuthorized(true);
    }
  }, [isLoading, user, isAdmin, requireAuth, checkSubscription, requireSubscription]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0B3D91]/20 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center mx-auto animate-pulse">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading TRACEFLOW...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default TraceflowGuard;
