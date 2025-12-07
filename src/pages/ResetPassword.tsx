import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NetworkBackground } from "@/components/NetworkBackground";
import cropxonIcon from "@/assets/cropxon-icon.png";
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, Shield, Users, Building2 } from "lucide-react";
import { z } from "zod";

const passwordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const portalConfig = {
  employee: {
    title: "Employee Portal",
    redirectPath: "/portal/login",
    icon: Users,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  organization: {
    title: "Organization Admin",
    redirectPath: "/tenant/login",
    icon: Building2,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
  admin: {
    title: "ATLAS Admin",
    redirectPath: "/admin/login",
    icon: Shield,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const portalType = (searchParams.get("type") as keyof typeof portalConfig) || "employee";
  const config = portalConfig[portalType] || portalConfig.employee;
  const Icon = config.icon;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Invalid or expired reset link. Please request a new one.");
        navigate(config.redirectPath);
      }
    };
    
    // Small delay to allow Supabase to process the token from URL
    const timer = setTimeout(checkSession, 1000);
    return () => clearTimeout(timer);
  }, [navigate, config.redirectPath]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      passwordSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSuccess(true);
        toast.success("Password updated successfully!");
        
        // Sign out after password change
        await supabase.auth.signOut();
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate(config.redirectPath);
        }, 3000);
      }
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <NetworkBackground />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <img src={cropxonIcon} alt="CropXon" className="h-16 w-16" />
            <div>
              <span className="text-2xl font-heading font-bold text-foreground">CropXon</span>
              <span className="block text-primary font-heading font-semibold text-sm">{config.title}</span>
            </div>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          {success ? (
            <div className="text-center py-4">
              <div className={`w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center mx-auto mb-4`}>
                <CheckCircle2 className={`w-8 h-8 ${config.iconColor}`} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                Password Updated!
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Your password has been successfully reset. You will be redirected to the login page shortly.
              </p>
              <Button onClick={() => navigate(config.redirectPath)} className="w-full">
                Go to Login
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className={`w-14 h-14 rounded-xl ${config.iconBg} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-7 h-7 ${config.iconColor}`} />
                </div>
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Create New Password
                </h1>
                <p className="text-muted-foreground text-sm">
                  Your new password must be different from previously used passwords.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs font-medium text-foreground mb-2">Password requirements:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className={formData.password.length >= 8 ? "text-green-600" : ""}>
                      • At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? "text-green-600" : ""}>
                      • One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(formData.password) ? "text-green-600" : ""}>
                      • One lowercase letter
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? "text-green-600" : ""}>
                      • One number
                    </li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to={config.redirectPath}
                  className="text-sm text-primary hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
