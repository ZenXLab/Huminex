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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle, DollarSign, Users, FileText, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RunPayrollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RunPayrollModal: React.FC<RunPayrollModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [step, setStep] = useState<"confirm" | "processing" | "success">("confirm");
  const [confirmChecks, setConfirmChecks] = useState({
    reviewed: false,
    verified: false,
    authorized: false,
  });

  const allChecked = confirmChecks.reviewed && confirmChecks.verified && confirmChecks.authorized;

  const handleRunPayroll = async () => {
    setStep("processing");
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setStep("success");
    toast({
      title: "Payroll Initiated",
      description: "January 2026 payroll has been submitted for processing.",
    });
  };

  const handleClose = () => {
    setStep("confirm");
    setConfirmChecks({ reviewed: false, verified: false, authorized: false });
    onOpenChange(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === "confirm" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-[#E23E57]/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-[#E23E57]" />
                </div>
                <div>
                  <DialogTitle className="text-[#0F1E3A]">Run Payroll</DialogTitle>
                  <DialogDescription className="text-[#E23E57]">
                    This action cannot be undone
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="py-4">
              {/* Summary */}
              <div className="bg-[#F7F9FC] rounded-xl p-4 mb-4">
                <h4 className="font-medium text-[#0F1E3A] mb-3">January 2026 Payroll Summary</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280] flex items-center gap-2">
                      <Users className="w-4 h-4" /> Employees
                    </span>
                    <span className="font-semibold text-[#0F1E3A]">184</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280] flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Gross Amount
                    </span>
                    <span className="font-semibold text-[#0F1E3A]">{formatCurrency(1850000)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280] flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Net Payout
                    </span>
                    <span className="font-semibold text-[#0FB07A]">{formatCurrency(1620000)}</span>
                  </div>
                </div>
              </div>

              {/* Confirmation Checks */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#0F1E3A]">Please confirm:</p>
                
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-[#F7F9FC] transition-colors cursor-pointer">
                  <Checkbox
                    checked={confirmChecks.reviewed}
                    onCheckedChange={(checked) =>
                      setConfirmChecks({ ...confirmChecks, reviewed: !!checked })
                    }
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#0F1E3A]">I have reviewed all salary components</p>
                    <p className="text-xs text-[#6B7280]">Including bonuses, deductions, and reimbursements</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-[#F7F9FC] transition-colors cursor-pointer">
                  <Checkbox
                    checked={confirmChecks.verified}
                    onCheckedChange={(checked) =>
                      setConfirmChecks({ ...confirmChecks, verified: !!checked })
                    }
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#0F1E3A]">Bank details are verified</p>
                    <p className="text-xs text-[#6B7280]">All employee bank accounts have been validated</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-[#F7F9FC] transition-colors cursor-pointer">
                  <Checkbox
                    checked={confirmChecks.authorized}
                    onCheckedChange={(checked) =>
                      setConfirmChecks({ ...confirmChecks, authorized: !!checked })
                    }
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#0F1E3A]">I am authorized to run payroll</p>
                    <p className="text-xs text-[#6B7280]">I have the necessary permissions for this action</p>
                  </div>
                </label>
              </div>

              {/* Warning */}
              <div className="mt-4 p-3 bg-[#E23E57]/5 border border-[#E23E57]/20 rounded-lg">
                <p className="text-xs text-[#E23E57]">
                  <strong>Warning:</strong> Once payroll is processed, salary disbursement will be initiated 
                  within 24 hours. Ensure all details are correct before proceeding.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="bg-[#E23E57] hover:bg-[#C73550] gap-2"
                onClick={handleRunPayroll}
                disabled={!allChecked}
              >
                <DollarSign className="w-4 h-4" /> Confirm & Run Payroll
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "processing" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#005EEB]/10 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-[#005EEB] animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-[#0F1E3A] mb-2">Processing Payroll</h3>
            <p className="text-[#6B7280]">
              Please wait while we process the payroll for 184 employees...
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#0FB07A]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#0FB07A]" />
            </div>
            <h3 className="text-xl font-semibold text-[#0F1E3A] mb-2">Payroll Submitted!</h3>
            <p className="text-[#6B7280] mb-6">
              January 2026 payroll has been successfully submitted for processing.
              Employees will receive their salaries within 24 hours.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button className="bg-[#005EEB] hover:bg-[#004ACC]">
                View Payroll Status
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
