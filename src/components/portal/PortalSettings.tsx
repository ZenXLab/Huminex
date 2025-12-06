import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Building, Phone, Mail, Lock } from "lucide-react";

interface PortalSettingsProps {
  userId?: string;
  profile?: any;
}

export const PortalSettings = ({ userId, profile }: PortalSettingsProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    company_name: profile?.company_name || "",
    phone: profile?.phone || "",
  });
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portal-profile"] });
      toast.success("Profile updated");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (passwordData.new !== passwordData.confirm) {
        throw new Error("Passwords don't match");
      }
      const { error } = await supabase.auth.updateUser({ password: passwordData.new });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Password changed");
      setPasswordData({ current: "", new: "", confirm: "" });
    },
    onError: (error: any) => toast.error(error.message || "Failed to change password"),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
          </div>
          <div>
            <Label>Company Name</Label>
            <Input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={profile?.email || ""} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>
          <Button onClick={() => updateProfileMutation.mutate()} disabled={updateProfileMutation.isPending}>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" />Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>New Password</Label>
            <Input type="password" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} />
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} />
          </div>
          <Button onClick={() => changePasswordMutation.mutate()} disabled={!passwordData.new || changePasswordMutation.isPending}>
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
