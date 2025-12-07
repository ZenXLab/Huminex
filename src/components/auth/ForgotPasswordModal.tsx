import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalType: "employee" | "organization" | "admin";
}

const portalConfig = {
  employee: {
    title: "Reset Employee Portal Password",
    description: "Enter your email and we'll send you a link to reset your password.",
    redirectPath: "/portal/login",
    accentColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  organization: {
    title: "Reset Organization Admin Password",
    description: "Enter your admin email to receive password reset instructions.",
    redirectPath: "/tenant/login",
    accentColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  admin: {
    title: "Reset ATLAS Admin Password",
    description: "Enter your admin email for secure password reset.",
    redirectPath: "/admin/login",
    accentColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
};

export const ForgotPasswordModal = ({ isOpen, onClose, portalType }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const config = portalConfig[portalType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/reset-password?type=${portalType}`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSuccess(true);
        toast.success("Password reset email sent!");
      }
    } catch (error) {
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center">
            <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mx-auto mb-4`}>
              <CheckCircle2 className={`w-8 h-8 ${config.accentColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Check Your Email</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and spam folder.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              The link will expire in 1 hour.
            </p>
            <Button onClick={handleClose} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
