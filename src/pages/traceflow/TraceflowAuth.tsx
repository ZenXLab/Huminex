import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NetworkBackground } from "@/components/NetworkBackground";
import { 
  Activity, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Mail, 
  KeyRound,
  Building2,
  Crown,
  CheckCircle,
  Loader2,
  Zap,
  BarChart3,
  MousePointerClick,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// Security features displayed
const securityFeatures = [
  { icon: Shield, text: "SOC 2 Type II Certified" },
  { icon: Lock, text: "256-bit AES Encryption" },
  { icon: CheckCircle, text: "GDPR & HIPAA Compliant" },
];

// Feature highlights
const featureHighlights = [
  { icon: MousePointerClick, text: "Universal Capture Engine", delay: 0 },
  { icon: Sparkles, text: "AI Session Intelligence", delay: 0.1 },
  { icon: BarChart3, text: "UX Analytics Dashboard", delay: 0.2 },
  { icon: Zap, text: "Multi-LLM NeuroRouter", delay: 0.3 },
];

// Animated floating orbs component
const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-64 h-64 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Animated grid lines
const AnimatedGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
    <svg className="w-full h-full">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    {/* Animated scan line */}
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export const TraceflowAuth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");

  // DEV MODE: Bypass for ATLAS Admin testing (remove in production)
  const handleDevBypass = () => {
    localStorage.setItem("TRACEFLOW_DEV_MODE", "true");
    toast.success("Dev Mode activated! Redirecting to dashboard...");
    navigate("/traceflow/dashboard");
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user has ATLAS Admin role (skip payment)
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user?.id)
        .single();

      if (roleData?.role === "admin") {
        toast.success("Welcome back, Admin!");
        navigate("/traceflow/dashboard");
      } else {
        // Check if user has active subscription
        const { data: subscription } = await supabase
          .from("traceflow_subscriptions")
          .select("*")
          .eq("user_id", data.user?.id)
          .eq("status", "active")
          .single();

        if (subscription) {
          navigate("/traceflow/dashboard");
        } else {
          navigate("/traceflow/onboarding");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !fullName || !companyName) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/traceflow/onboarding`,
          data: {
            full_name: fullName,
            company_name: companyName,
          },
        },
      });

      if (error) throw error;

      toast.success("Account created! Redirecting to setup...");
      navigate("/traceflow/onboarding");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/traceflow/onboarding`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  const handleSAMLLogin = () => {
    toast.info("Enterprise SAML SSO requires configuration. Contact sales@cropxon.com");
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Animated Background */}
      <NetworkBackground />
      <FloatingOrbs />
      <AnimatedGrid />

      {/* Left Panel - Branding */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 via-primary to-accent p-12 flex-col justify-between relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-white/30"
              style={{
                top: `${8 + i * 8}%`,
                left: 0,
                right: 0,
              }}
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Glowing orb */}
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <motion.div 
              className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src="/src/assets/cropxon-icon.png" 
                alt="CropXon" 
                className="w-8 h-8"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                }}
              />
              <Activity className="h-7 w-7 text-white fallback-icon hidden" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">TRACEFLOW</span>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="h-5 w-5 text-yellow-300" />
                </motion.div>
              </div>
              <span className="text-xs text-white/80">by CropXon ATLAS</span>
            </div>
          </Link>

          <motion.h1 
            className="text-5xl font-bold text-white mb-6 leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Every Signal.<br />
            <span className="text-accent">One Intelligence.</span>
          </motion.h1>
          <motion.p 
            className="text-white/90 text-lg max-w-md leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Unify clickstream, observability, and multi-modal feedback into a single AI-powered platform.
          </motion.p>

          {/* Feature highlights */}
          <div className="mt-12 space-y-4">
            {featureHighlights.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + feature.delay }}
                whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <feature.icon className="h-5 w-5 text-accent" />
                <span className="text-white text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Badges */}
        <motion.div 
          className="relative z-10 space-y-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/70 text-sm uppercase tracking-wider font-medium">Enterprise Security</p>
          <div className="flex flex-wrap gap-3">
            {securityFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <feature.icon className="h-4 w-4 text-accent" />
                <span className="text-white/95 text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Right Panel - Auth Forms */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl">
          <CardHeader className="text-center pb-4">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                animate={{ boxShadow: ["0 0 20px hsl(var(--primary) / 0.3)", "0 0 40px hsl(var(--primary) / 0.5)", "0 0 20px hsl(var(--primary) / 0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <div>
                <span className="text-xl font-bold text-foreground">TRACEFLOW</span>
                <p className="text-xs text-muted-foreground">by CropXon ATLAS</p>
              </div>
            </div>
            
            <CardTitle className="text-2xl text-foreground">
              {activeTab === "signin" ? "Welcome Back" : "Get Started"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {activeTab === "signin" 
                ? "Sign in to access your dashboard" 
                : "Create your enterprise account"}
            </CardDescription>

            {/* ATLAS Admin badge + Dev Bypass */}
            <motion.div
              className="mt-3 space-y-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Shield className="h-3 w-3 mr-1" />
                ATLAS Admins get instant access
              </Badge>
              
              {/* DEV MODE bypass button - REMOVE IN PRODUCTION */}
              {import.meta.env.DEV && (
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDevBypass}
                    className="w-full border-dashed border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Skip Login (Dev Mode)
                  </Button>
                </div>
              )}
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <motion.div 
                    className="space-y-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <Label className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Password</Label>
                      <Link to="/reset-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="space-y-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                    >
                      <Label className="text-foreground">Full Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </motion.div>
                    <motion.div 
                      className="space-y-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label className="text-foreground">Company</Label>
                      <Input
                        placeholder="Acme Inc"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </motion.div>
                  </div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label className="text-foreground">Work Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label className="text-foreground">Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label className="text-foreground">Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>
            </Tabs>

            {/* SSO Section */}
            <div className="space-y-4">
              <div className="relative">
                <Separator className="bg-border" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  or continue with
                </span>
              </div>

              {/* SSO Buttons */}
              <div className="space-y-2">
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSSOLogin("google")}
                    className="w-full bg-white hover:bg-gray-50 text-gray-800 border-gray-200"
                    disabled={isLoading}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google Workspace
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSSOLogin("azure")}
                    className="w-full bg-[#2F2F2F] hover:bg-[#1F1F1F] text-white border-[#2F2F2F]"
                    disabled={isLoading}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 23 23">
                      <path fill="#f3f3f3" d="M0 0h10.931v10.931H0z"/>
                      <path fill="#f35325" d="M12.069 0H23v10.931H12.069z"/>
                      <path fill="#05a6f0" d="M0 12.069h10.931V23H0z"/>
                      <path fill="#ffba08" d="M12.069 12.069H23V23H12.069z"/>
                    </svg>
                    Microsoft Entra ID
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSAMLLogin}
                    className="w-full border-border hover:bg-muted"
                    disabled={isLoading}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Enterprise SSO (SAML)
                  </Button>
                </motion.div>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TraceflowAuth;
