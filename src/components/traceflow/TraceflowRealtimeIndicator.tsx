import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTraceflowRealtime } from "@/hooks/useTraceflowRBAC";

interface TraceflowRealtimeIndicatorProps {
  subscriptionId: string | undefined;
  className?: string;
}

export const TraceflowRealtimeIndicator = ({ 
  subscriptionId, 
  className 
}: TraceflowRealtimeIndicatorProps) => {
  const { isConnected } = useTraceflowRealtime(subscriptionId);
  const [pulse, setPulse] = useState(false);

  // Pulse animation on data updates
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setPulse(true);
        setTimeout(() => setPulse(false), 500);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return (
    <Badge 
      className={cn(
        "flex items-center gap-1.5 transition-all",
        isConnected 
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
          : "bg-red-500/20 text-red-400 border-red-500/30",
        pulse && "scale-105",
        className
      )}
    >
      {isConnected ? (
        <>
          <Activity className={cn("h-3 w-3", pulse && "animate-pulse")} />
          <span>Live</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Offline</span>
        </>
      )}
    </Badge>
  );
};

export default TraceflowRealtimeIndicator;
