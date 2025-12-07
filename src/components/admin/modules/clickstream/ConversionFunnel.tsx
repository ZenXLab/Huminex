import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, ArrowDown, Radio, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FunnelStep {
  name: string;
  count: number;
  percentage: number;
  dropOff: number;
  color: string;
}

interface ConversionFunnelProps {
  events: Array<{
    event_type: string;
    page_url: string | null;
    metadata: any;
  }>;
}

export const ConversionFunnel = ({ events }: ConversionFunnelProps) => {
  const [animationKey, setAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate funnel steps from events
  const funnelSteps = useMemo((): FunnelStep[] => {
    const landingPages = events.filter(e => 
      e.event_type === "pageview" && 
      (e.page_url === "/" || e.page_url === "/pricing" || e.page_url?.includes("/industries"))
    ).length;

    const featureViews = events.filter(e => 
      e.event_type === "pageview" && 
      (e.page_url?.includes("/features") || e.page_url?.includes("/modules"))
    ).length;

    const pricingViews = events.filter(e => 
      e.event_type === "pageview" && e.page_url === "/pricing"
    ).length;

    const quoteClicks = events.filter(e => 
      e.event_type === "click" && 
      (e.metadata?.tagName === "BUTTON" || e.page_url?.includes("/get-quote"))
    ).length;

    const contactSubmissions = events.filter(e => 
      e.event_type === "form_submit" || 
      (e.event_type === "click" && e.page_url?.includes("/contact"))
    ).length;

    const signupAttempts = events.filter(e => 
      e.page_url?.includes("/onboarding") || 
      e.page_url?.includes("/auth")
    ).length;

    const colors = [
      "from-violet-500 to-purple-600",
      "from-purple-500 to-fuchsia-600",
      "from-fuchsia-500 to-pink-600",
      "from-pink-500 to-rose-600",
      "from-rose-500 to-red-600",
      "from-red-500 to-orange-600",
    ];

    const steps = [
      { name: "Landing Page", count: landingPages },
      { name: "Feature Exploration", count: featureViews },
      { name: "Pricing View", count: pricingViews },
      { name: "CTA Clicks", count: quoteClicks },
      { name: "Contact/Quote", count: contactSubmissions },
      { name: "Signup Started", count: signupAttempts },
    ];

    const maxCount = Math.max(...steps.map(s => s.count), 1);

    return steps.map((step, idx) => ({
      ...step,
      percentage: (step.count / maxCount) * 100,
      dropOff: idx > 0 && steps[idx - 1].count > 0 
        ? Math.round(((steps[idx - 1].count - step.count) / steps[idx - 1].count) * 100)
        : 0,
      color: colors[idx],
    }));
  }, [events]);

  const totalConversionRate = funnelSteps[0].count > 0 
    ? ((funnelSteps[funnelSteps.length - 1].count / funnelSteps[0].count) * 100).toFixed(1)
    : "0.0";

  // Trigger animation on data change
  useEffect(() => {
    setIsAnimating(true);
    setAnimationKey(prev => prev + 1);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [events.length]);

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            initial={{ x: `${Math.random() * 100}%`, y: "100%", opacity: 0 }}
            animate={{ 
              y: "-10%", 
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: isAnimating ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingDown className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-bold">
                Conversion Funnel
              </span>
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            </CardTitle>
            <CardDescription>User journey from landing to signup</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                <Radio className="h-3 w-3 mr-1 animate-pulse" />
                Live
              </Badge>
            </motion.div>
            <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
              <Zap className="h-3 w-3 mr-1" />
              {totalConversionRate}% Overall
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {funnelSteps.map((step, idx) => (
              <motion.div 
                key={`${step.name}-${animationKey}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <motion.span 
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-purple-600/30 text-primary text-xs font-bold flex items-center justify-center shadow-lg shadow-primary/20"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {idx + 1}
                    </motion.span>
                    <span className="font-medium text-sm">{step.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.span 
                      className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text"
                      key={step.count}
                      initial={{ scale: 1.5, color: "hsl(var(--primary))" }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {step.count}
                    </motion.span>
                    {step.dropOff > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.1 + 0.3 }}
                      >
                        <Badge 
                          variant="destructive" 
                          className="text-[10px] px-1.5 bg-red-500/20 text-red-500 border-red-500/30"
                        >
                          -{step.dropOff}%
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {/* Animated funnel bar */}
                <div className="relative h-10 bg-muted/50 rounded-xl overflow-hidden backdrop-blur-sm border border-primary/10">
                  <motion.div 
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${step.color} rounded-xl`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(step.percentage, 8)}%` }}
                    transition={{ delay: idx * 0.15, duration: 0.8, ease: "easeOut" }}
                    style={{ 
                      clipPath: idx < funnelSteps.length - 1 
                        ? "polygon(0 0, 100% 0, 96% 100%, 0 100%)" 
                        : undefined
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm font-semibold drop-shadow-lg">
                      {step.percentage.toFixed(0)}%
                    </span>
                  </motion.div>
                </div>

                {/* Arrow connector with pulse */}
                {idx < funnelSteps.length - 1 && (
                  <motion.div 
                    className="flex justify-center py-1"
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.1 }}
                  >
                    <ArrowDown className="h-4 w-4 text-primary/50" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Conversion insights with glow effect */}
        <motion.div 
          className="mt-6 p-4 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-xl border border-primary/20 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent animate-pulse" />
          <h4 className="font-semibold mb-2 flex items-center gap-2 relative">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Funnel Insights
          </h4>
          <div className="grid gap-2 text-sm relative">
            {funnelSteps.slice(1).map((step) => (
              step.dropOff > 50 && (
                <motion.div 
                  key={step.name} 
                  className="flex items-center gap-2 text-amber-600 bg-amber-500/10 rounded-lg p-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <TrendingDown className="h-4 w-4" />
                  <span>High drop-off ({step.dropOff}%) at "{step.name}" stage</span>
                </motion.div>
              )
            ))}
            {funnelSteps.every(s => s.dropOff <= 50) && (
              <motion.span 
                className="text-emerald-600 flex items-center gap-2"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="h-4 w-4" />
                Funnel performing well - no critical drop-offs detected
              </motion.span>
            )}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
