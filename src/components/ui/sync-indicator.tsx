import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudOff, RefreshCw, Check, AlertCircle } from "lucide-react";
import { backgroundSync } from "@/lib/backgroundSync";
import { cn } from "@/lib/utils";

interface SyncIndicatorProps {
  className?: string;
}

export const SyncIndicator = ({ className }: SyncIndicatorProps) => {
  const [syncing, setSyncing] = useState(false);
  const [queueSize, setQueueSize] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = backgroundSync.subscribe((isSyncing, size) => {
      const wasSyncing = syncing;
      setSyncing(isSyncing);
      setQueueSize(size);
      
      // Show success animation when sync completes
      if (wasSyncing && !isSyncing && size === 0) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncing]);

  // Don't show anything if online and no pending items
  if (isOnline && queueSize === 0 && !syncing && !showSuccess) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
          !isOnline && "bg-amber-500/10 text-amber-600 border border-amber-500/20",
          syncing && "bg-blue-500/10 text-blue-600 border border-blue-500/20",
          showSuccess && "bg-green-500/10 text-green-600 border border-green-500/20",
          queueSize > 0 && isOnline && !syncing && "bg-orange-500/10 text-orange-600 border border-orange-500/20",
          className
        )}
      >
        {!isOnline ? (
          <>
            <CloudOff className="h-3.5 w-3.5" />
            <span>Offline</span>
            {queueSize > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-500/20 rounded-full">
                {queueSize} queued
              </span>
            )}
          </>
        ) : syncing ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>Syncing...</span>
          </>
        ) : showSuccess ? (
          <>
            <Check className="h-3.5 w-3.5" />
            <span>Synced</span>
          </>
        ) : queueSize > 0 ? (
          <>
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{queueSize} pending</span>
          </>
        ) : (
          <>
            <Cloud className="h-3.5 w-3.5" />
            <span>Online</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
