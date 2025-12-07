import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Mail, Building, Briefcase, Send, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InviteEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InviteEmployeeModal: React.FC<InviteEmployeeModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    department: "",
    role: "",
    employmentType: "full-time",
  });

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setStep("success");
  };

  const handleClose = () => {
    setStep("form");
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      department: "",
      role: "",
      employmentType: "full-time",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === "form" ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#005EEB]/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-[#005EEB]" />
                </div>
                <div>
                  <DialogTitle className="text-[#0F1E3A]">Invite Employee</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your organization
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0F1E3A]">
                  Work Email <span className="text-[#E23E57]">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="employee@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#0F1E3A]">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#0F1E3A]">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#0F1E3A]">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(v) => setFormData({ ...formData, department: v })}
                >
                  <SelectTrigger>
                    <Building className="w-4 h-4 mr-2 text-[#6B7280]" />
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#0F1E3A]">Job Role</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <Input
                    placeholder="e.g. Senior Developer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#0F1E3A]">Employment Type</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(v) => setFormData({ ...formData, employmentType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="bg-[#005EEB] hover:bg-[#004ACC] gap-2"
                onClick={handleSubmit}
                disabled={!formData.email || loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#0FB07A]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#0FB07A]" />
            </div>
            <h3 className="text-xl font-semibold text-[#0F1E3A] mb-2">Invitation Sent!</h3>
            <p className="text-[#6B7280] mb-6">
              We've sent an invitation to <strong>{formData.email}</strong>
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button
                className="bg-[#005EEB] hover:bg-[#004ACC]"
                onClick={() => setStep("form")}
              >
                Invite Another
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
