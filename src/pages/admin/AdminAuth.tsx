import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NetworkBackground } from "@/components/NetworkBackground";
import cropxonIcon from "@/assets/cropxon-icon.png";
import { Eye, EyeOff, Mail, Lock, Shield, ArrowLeft, Loader2, SkipForward } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AdminAuth = () => {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // Skip login for development/testing
  const handleSkipLogin = () => {
    toast.success("Development mode: Bypassing authentication");
    navigate("/admin");
  };

  useEffect(() => {
    const checkAdminSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if user is admin
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();
        
        if (roleData) {
          navigate("/admin");
        }
      }
    };
    checkAdminSession();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = loginSchema.parse({
        email: formData.email,
        password: formData.password,
      });

      // First authenticate
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (authError) {
        toast.error("Invalid credentials");
        setLoading(false);
        return;
      }

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .eq('role', 'admin')
        .single();

      if (roleError || !roleData) {
        await supabase.auth.signOut();
        toast.error("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      // Generate and "send" OTP (in production, this would be sent via email)
      const otp = generateOTP();
      setGeneratedOtp(otp);
      
      // In a real scenario, you would send this via email edge function
      // For now, we'll show it in the console and a toast for demo purposes
      console.log("Admin 2FA OTP:", otp);
      toast.info(`2FA Code sent to ${validated.email}`, {
        description: `Demo mode: Your code is ${otp}`,
        duration: 10000,
      });

      setStep('otp');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (otpCode === generatedOtp) {
      toast.success("2FA verification successful!");
      navigate("/admin");
    } else {
      toast.error("Invalid verification code");
    }
    setLoading(false);
  };

  const handleResendOtp = () => {
    const otp = generateOTP();
    setGeneratedOtp(otp);
    console.log("New Admin 2FA OTP:", otp);
    toast.info("New verification code sent", {
      description: `Demo mode: Your code is ${otp}`,
      duration: 10000,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <NetworkBackground />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Back to Home */}
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </a>

        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex flex-col items-center gap-2">
            <img src={cropxonIcon} alt="CropXon" className="h-16 w-16" />
            <div>
              <span className="text-2xl font-heading font-bold text-foreground">CropXon</span>
              <span className="block text-primary font-heading font-semibold text-sm">ATLAS Admin</span>
            </div>
          </a>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          {step === 'login' ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Admin Access
                </h1>
                <p className="text-muted-foreground text-sm">
                  Sign in with your admin credentials
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@cropxon.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Continue to 2FA"
                  )}
                </Button>

                {/* Skip Button for Development */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Development Only</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full gap-2 border-dashed" 
                  onClick={handleSkipLogin}
                >
                  <SkipForward className="h-4 w-4" />
                  Skip Login (Dev Mode)
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/10 mb-4">
                  <Shield className="h-8 w-8 text-emerald-500" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Two-Factor Authentication
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-foreground">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                    maxLength={6}
                    required
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full" disabled={loading || otpCode.length !== 6}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Access Admin"
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-primary hover:underline"
                  >
                    Resend verification code
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep('login');
                    setOtpCode("");
                    supabase.auth.signOut();
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to login
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Secure admin access with two-factor authentication
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
