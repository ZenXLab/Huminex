import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import cropxonIcon from "@/assets/cropxon-icon.png";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Loader2, 
  SkipForward,
  Building2,
  Shield,
  Sparkles
} from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const TenantAuth = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { enableDevMode } = useAuth();

  // Skip login for development/testing - enters as tenant super admin
  const handleSkipLogin = () => {
    enableDevMode("client");
    localStorage.setItem("atlas_tenant_role", "super_admin");
    toast.success("Development mode: Tenant Super Admin access enabled");
    navigate("/tenant/dashboard");
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // Check if user has tenant admin role
          navigate("/tenant/dashboard");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/tenant/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = loginSchema.parse({
        email: formData.email,
        password: formData.password,
      });

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Welcome to ATLAS Admin Console!");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#005EEB]/10 to-[#00C2FF]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#0F1E3A]/5 to-[#005EEB]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(#0F1E3A 1px, transparent 1px), linear-gradient(90deg, #0F1E3A 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#0F1E3A] transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#005EEB]/20 rounded-2xl blur-xl scale-150" />
              <img src={cropxonIcon} alt="CropXon" className="h-16 w-16 relative z-10" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0F1E3A]">CropXon</span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-[#005EEB] font-semibold text-sm">ATLAS</span>
                <span className="h-4 w-px bg-[#E5E7EB]" />
                <span className="text-[#6B7280] text-xs uppercase tracking-wider">Organization Admin</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-[#0F1E3A]/5 p-8 relative overflow-hidden">
          {/* Card Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#005EEB] via-[#00C2FF] to-[#005EEB]" />
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#005EEB]/10 to-[#00C2FF]/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-[#005EEB]" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F1E3A] mb-2">
              Organization Admin Console
            </h1>
            <p className="text-[#6B7280] text-sm">
              Sign in to configure your ATLAS workspace
            </p>
          </div>

          {/* Features Badge */}
          <div className="flex items-center justify-center gap-4 mb-6 text-xs text-[#6B7280]">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#0FB07A]" />
              <span>Secure Access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#005EEB]" />
              <span>Full Control</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0F1E3A] text-sm font-medium">Work Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280] group-focus-within:text-[#005EEB] transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#005EEB] focus:ring-[#005EEB]/20 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#0F1E3A] text-sm font-medium">Password</Label>
                <button type="button" className="text-xs text-[#005EEB] hover:text-[#0047B3] transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280] group-focus-within:text-[#005EEB] transition-colors" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-[#005EEB] focus:ring-[#005EEB]/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0F1E3A] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#005EEB] hover:bg-[#0047B3] text-white rounded-xl font-medium shadow-lg shadow-[#005EEB]/20 transition-all hover:shadow-xl hover:shadow-[#005EEB]/30" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Console"
              )}
            </Button>

            {/* Skip Button for Development */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#6B7280]">Development Only</span>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-11 gap-2 border-dashed border-[#E5E7EB] text-[#6B7280] hover:text-[#005EEB] hover:border-[#005EEB] rounded-xl transition-all" 
              onClick={handleSkipLogin}
            >
              <SkipForward className="h-4 w-4" />
              Skip Login (Dev Mode)
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-[#6B7280]">
              Looking for the Employee Portal?{" "}
              <Link
                to="/portal/login"
                className="text-[#005EEB] hover:text-[#0047B3] font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 space-y-4">
          <p className="text-center text-xs text-[#6B7280]">
            New to ATLAS?{" "}
            <Link to="/onboarding" className="text-[#005EEB] hover:text-[#0047B3] font-medium transition-colors">
              Start your onboarding journey
            </Link>
          </p>
          <p className="text-center text-xs text-[#9CA3AF]">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#6B7280] hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-[#6B7280] hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TenantAuth;
