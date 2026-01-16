import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import huminexIcon from "@/assets/huminex-icon.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"logo" | "text" | "complete">("logo");

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase("text"), 800);
    const timer2 = setTimeout(() => setPhase("complete"), 2500);
    const timer3 = setTimeout(onComplete, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "complete" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0A0F1C] via-[#0D1424] to-[#0A0F1C]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>

          {/* Animated H Logo */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            {/* Outer rotating rings */}
            <motion.div
              className="absolute inset-[-30px] rounded-full border-2 border-dashed border-primary/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-[-50px] rounded-full border border-accent/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Pulsing glow */}
            <motion.div
              className="absolute inset-[-20px] rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Main circle container */}
            <motion.div 
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30"
              animate={{ 
                boxShadow: [
                  "0 0 30px rgba(14, 165, 233, 0.3)",
                  "0 0 60px rgba(14, 165, 233, 0.5)",
                  "0 0 30px rgba(14, 165, 233, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* HUMINEX Hexagonal Logo */}
              <motion.img
                src={huminexIcon}
                alt="HUMINEX"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-2xl"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.div>

            {/* Orbiting particles */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent shadow-lg shadow-accent/50" />
            </motion.div>
          </motion.div>

          {/* Text content */}
          <motion.div
            className="relative z-10 mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: phase === "text" ? 1 : 0, y: phase === "text" ? 0 : 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* HUMINEX */}
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                HUMINEX
              </span>
            </motion.h1>

            {/* Workforce Operating System */}
            <motion.p
              className="text-sm sm:text-base md:text-lg text-white/70 tracking-[0.3em] uppercase font-medium mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              Workforce Operating System
            </motion.p>

            {/* Powered By */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              <span className="text-xs text-white/40 uppercase tracking-widest">Powered & Developed By</span>
              <span className="text-sm sm:text-base font-semibold text-accent">
                CropXon Innovations Pvt. Ltd.
              </span>
            </motion.div>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-16 w-48 h-1 bg-white/10 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
