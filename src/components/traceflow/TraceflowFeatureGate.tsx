import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, ArrowRight } from "lucide-react";
import { useTraceflowFeatures } from "@/hooks/useTraceflowRBAC";
import { useTraceflowAuth } from "@/hooks/useTraceflowAuth";
import { Link } from "react-router-dom";

interface TraceflowFeatureGateProps {
  featureId: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const TraceflowFeatureGate = ({ 
  featureId, 
  children, 
  fallback 
}: TraceflowFeatureGateProps) => {
  const { user, isAdmin, hasFeature } = useTraceflowAuth();
  const { data: features } = useTraceflowFeatures(user?.id);

  // Admins have access to everything
  if (isAdmin || hasFeature(featureId)) {
    return <>{children}</>;
  }

  // Check if feature exists and is enabled
  const feature = features?.find(f => f.feature_id === featureId);
  
  if (feature?.is_enabled) {
    // Check if user's role has access
    const userRole = user?.role || "viewer";
    if (feature.enabled_for_roles.includes(userRole)) {
      return <>{children}</>;
    }
  }

  // Show fallback or locked state
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="text-white font-semibold mb-2">Feature Locked</h3>
        <p className="text-slate-400 text-sm text-center max-w-md mb-4">
          {feature ? (
            <>This feature is not available for your role. Contact your admin to request access.</>
          ) : (
            <>This feature requires a plan upgrade. Unlock it to access powerful capabilities.</>
          )}
        </p>
        <Link to="/traceflow/billing">
          <Button className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8]">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Plan
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default TraceflowFeatureGate;
