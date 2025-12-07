import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import cropxonIcon from "@/assets/cropxon-icon.png";
import { Eye, EyeOff, Mail, Lock, Shield, ArrowLeft, Loader2, SkipForward } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AdminAuth = () => {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { enableDevMode } = useAuth();

  // Skip login for development/testing
  const handleSkipLogin = () => {
    enableDevMode("admin");
    toast.success("Development mode: Admin access enabled");
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
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center relative overflow-hidden">
      {/* ATLAS Internal Branding Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-radial from-[#00363D]/30 via-[#00363D]/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#00A6A6]/20 via-[#4FF2F2]/5 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#4FF2F2 1px, transparent 1px), linear-gradient(90deg, #4FF2F2 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#4FF2F2] rounded-full animate-pulse opacity-60" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-[#00A6A6] rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-[#4FF2F2] rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Back to Home */}
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-[#6B8A8E] hover:text-[#4FF2F2] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </a>

        {/* ATLAS Internal Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex flex-col items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00A6A6]/30 rounded-2xl blur-xl scale-150 animate-pulse" />
              <img src={cropxonIcon} alt="CropXon" className="h-16 w-16 relative z-10" />
            </div>
            <div>
              <span className="text-2xl font-heading font-bold text-white">ATLAS</span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-[#4FF2F2] font-semibold text-sm">Internal Admin</span>
                <span className="h-4 w-px bg-[#2A3A4A]" />
                <span className="text-[#6B8A8E] text-xs uppercase tracking-wider">CropXon</span>
              </div>
            </div>
          </a>
        </div>

        <div className="bg-[#0F1A2A] border border-[#1E3A4A] rounded-2xl p-8 shadow-2xl shadow-[#00A6A6]/5">
          {step === 'login' ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-[#00363D] to-[#0E3A40] mb-4 ring-2 ring-[#00A6A6]/20">
                  <Shield className="h-8 w-8 text-[#4FF2F2]" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-white mb-2">
                  ATLAS Global Admin
                </h1>
                <p className="text-[#6B8A8E] text-sm">
                  Authorized CropXon personnel only
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#A0B4B8]">Admin Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B8A8E] group-focus-within:text-[#4FF2F2] transition-colors" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@cropxon.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-12 bg-[#0A0F1C] border-[#1E3A4A] text-white placeholder:text-[#4A5A6A] focus:border-[#00A6A6] focus:ring-[#00A6A6]/20 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[#A0B4B8]">Password</Label>
                    <button 
                      type="button" 
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-[#00A6A6] hover:text-[#4FF2F2] transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B8A8E] group-focus-within:text-[#4FF2F2] transition-colors" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 h-12 bg-[#0A0F1C] border-[#1E3A4A] text-white placeholder:text-[#4A5A6A] focus:border-[#00A6A6] focus:ring-[#00A6A6]/20 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B8A8E] hover:text-[#4FF2F2] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-[#00363D] to-[#00A6A6] hover:from-[#00A6A6] hover:to-[#4FF2F2] text-white rounded-xl font-medium shadow-lg shadow-[#00A6A6]/20 transition-all hover:shadow-xl hover:shadow-[#00A6A6]/30" 
                  disabled={loading}
                >
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
                    <span className="w-full border-t border-[#1E3A4A]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0F1A2A] px-2 text-[#6B8A8E]">Development Only</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-11 gap-2 border-dashed border-[#1E3A4A] text-[#6B8A8E] hover:text-[#4FF2F2] hover:border-[#00A6A6] bg-transparent rounded-xl transition-all" 
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
                <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 mb-4 ring-2 ring-emerald-500/20">
                  <Shield className="h-8 w-8 text-emerald-400" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-white mb-2">
                  Two-Factor Authentication
                </h1>
                <p className="text-[#6B8A8E] text-sm">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-[#A0B4B8]">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-[0.5em] font-mono h-14 bg-[#0A0F1C] border-[#1E3A4A] text-white focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                    maxLength={6}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20" 
                  disabled={loading || otpCode.length !== 6}
                >
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
                    className="text-sm text-[#00A6A6] hover:text-[#4FF2F2] transition-colors"
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
                  className="w-full text-sm text-[#6B8A8E] hover:text-white transition-colors"
                >
                  ← Back to login
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#4A5A6A] mt-6">
          Secure admin access with two-factor authentication
        </p>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        portalType="admin"
      />
    </div>
  );
};

export default AdminAuth;
