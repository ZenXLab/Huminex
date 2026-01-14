import { Button } from "@/components/ui/button";
import { NetworkBackground } from "./NetworkBackground";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { HeroDashboardPreview } from "./HeroDashboardPreview";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface HeroSectionProps {
  onQuoteClick?: () => void;
}

// SVG H Logo Component - Stylish and fits perfectly in circle
const HLogo = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
  >
    <defs>
      <linearGradient id="hLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0EA5E9" />
        <stop offset="50%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#22D3EE" />
      </linearGradient>
      <filter id="hGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path
      d="M25 15 L25 85 M25 50 L75 50 M75 15 L75 85"
      stroke="url(#hLogoGradient)"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#hGlow)"
    />
  </svg>
);

export const HeroSection = ({ onQuoteClick }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Workforce Operating System";
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Smooth spring physics for parallax
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax transforms
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const logoY = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
  const logoScale = useTransform(smoothProgress, [0, 0.5], [1, 0.8]);
  const logoOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0.6]);
  const textY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  const dashboardY = useTransform(smoothProgress, [0, 1], ["0%", "-10%"]);
  const dashboardScale = useTransform(smoothProgress, [0, 0.5], [1, 0.95]);
  const overlayOpacity = useTransform(smoothProgress, [0, 0.5], [0, 0.3]);

  // Typing animation effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, []);

  const scrollToSolutions = () => {
    document.getElementById("pillars")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartFreeTrial = () => {
    if (user) {
      navigate("/portal");
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-20 pb-12"
    >
      {/* Parallax Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <NetworkBackground />
      </motion.div>
      
      {/* Gradient overlays with parallax */}
      <motion.div 
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-background/50 pointer-events-none" 
      />
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Floating particles with parallax */}
      <motion.div 
        style={{ y: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated HUMINEX Logo & Name with Parallax */}
          <motion.div 
            style={{ y: logoY, scale: logoScale, opacity: logoOpacity }}
            className="flex flex-col items-center justify-center mb-8"
          >
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Outer glow ring */}
              <div className="absolute inset-[-20px] rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-20 blur-2xl animate-pulse-glow" />
              
              {/* Spinning ring */}
              <motion.div 
                className="absolute inset-[-16px] rounded-full border-2 border-dashed border-primary/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-[-28px] rounded-full border border-accent/25"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Main circle container with H Logo inside */}
              <motion.div 
                className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
                animate={{ 
                  boxShadow: [
                    "0 0 30px rgba(14, 165, 233, 0.2)",
                    "0 0 50px rgba(14, 165, 233, 0.4)",
                    "0 0 30px rgba(14, 165, 233, 0.2)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {/* Inner gradient circle */}
                <motion.div 
                  className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/5 to-accent/5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Stylish H Logo - SVG fits perfectly */}
                <motion.div
                  className="relative z-10"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <HLogo className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-2xl" />
                </motion.div>
              </motion.div>

              {/* Orbiting dots */}
              <motion.div 
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/50" />
              </motion.div>
              <motion.div 
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-2 h-2 rounded-full bg-accent shadow-lg shadow-accent/50" />
              </motion.div>
            </motion.div>

            {/* Animated HUMINEX Text */}
            <motion.div 
              className="mt-8 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 animate-pulse" />
                <h2 className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                    HUMINEX
                  </span>
                </h2>
              </div>
              
              <div className="mt-3 h-7 flex items-center justify-center">
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-medium tracking-[0.25em] uppercase">
                  {displayedText}
                  <span className="inline-block w-0.5 h-4 bg-primary ml-1 animate-pulse" />
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Headline with Parallax */}
          <motion.div style={{ y: textY }}>
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="text-gradient">From Hire to Retire</span>
              <span className="block text-base sm:text-lg md:text-xl lg:text-2xl mt-2 font-medium text-foreground/90">
                And Everything in Between
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              The AI-Powered Workforce OS that automates HR, Payroll, Compliance, Finance, Recruitment, Projects, and Operations for modern enterprises.
            </motion.p>

            {/* Company Attribution */}
            <motion.p 
              className="text-sm text-foreground/60 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              A Division of <span className="text-accent font-semibold">CropXon Innovations Pvt. Ltd.</span>
            </motion.p>

            {/* CTA Buttons with stagger animation */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="hero" size="xl" className="group" onClick={handleStartFreeTrial}>
                  <Sparkles className="h-5 w-5" />
                  Start Your Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="hero-outline" size="xl" className="group" onClick={scrollToSolutions}>
                  Explore Solutions
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Interactive Dashboard Preview with Parallax */}
          <motion.div 
            style={{ y: dashboardY, scale: dashboardScale }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <HeroDashboardPreview />
          </motion.div>

          {/* Trust indicators with reveal animation */}
          <motion.div 
            className="mt-12 pt-6 border-t border-border/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <p className="text-muted-foreground text-sm mb-4">Trusted by enterprises worldwide</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {[
                { text: "24/7 Global Support" },
                { text: "50+ Enterprise Clients" },
                { text: "AI-First Approach" }
              ].map((item, i) => (
                <motion.div 
                  key={item.text}
                  className="flex items-center gap-2 text-foreground/60"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.1 + i * 0.1 }}
                >
                  <motion.div 
                    className="h-2 w-2 rounded-full bg-accent"
                    animate={{ 
                      boxShadow: ["0 0 0 0 rgba(34, 211, 238, 0.4)", "0 0 0 8px rgba(34, 211, 238, 0)", "0 0 0 0 rgba(34, 211, 238, 0)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-3 rounded-full bg-primary"
            animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
