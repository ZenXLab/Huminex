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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Building, Calendar, DollarSign, Plus, Trash2, CheckCircle, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CreateInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    invoiceNumber: "INV-2026-001",
    dueDate: "",
    items: [{ description: "", quantity: 1, rate: 0 }],
    notes: "",
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, rate: 0 }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setStep("success");
    toast({
      title: "Invoice Created",
      description: `Invoice ${formData.invoiceNumber} has been created successfully.`,
    });
  };

  const handleClose = () => {
    setStep("form");
    setFormData({
      client: "",
      invoiceNumber: "INV-2026-001",
      dueDate: "",
      items: [{ description: "", quantity: 1, rate: 0 }],
      notes: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === "form" ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#005EEB]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#005EEB]" />
                </div>
                <div>
                  <DialogTitle className="text-[#0F1E3A]">Create Invoice</DialogTitle>
                  <DialogDescription>
                    Generate a new invoice for your client
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#0F1E3A]">Client / Vendor</Label>
                  <Select value={formData.client} onValueChange={(v) => setFormData({ ...formData, client: v })}>
                    <SelectTrigger>
                      <Building className="w-4 h-4 mr-2 text-[#6B7280]" />
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acme">Acme Corp</SelectItem>
                      <SelectItem value="techsol">TechSol Industries</SelectItem>
                      <SelectItem value="globex">Globex Corporation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0F1E3A]">Invoice Number</Label>
                  <Input value={formData.invoiceNumber} disabled className="bg-[#F7F9FC]" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#0F1E3A]">Due Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[#0F1E3A]">Line Items</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={addItem} className="text-[#005EEB] gap-1">
                    <Plus className="w-4 h-4" /> Add Item
                  </Button>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 p-3 bg-[#F7F9FC] text-xs font-medium text-[#6B7280] uppercase">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-3">Rate</div>
                    <div className="col-span-1"></div>
                  </div>
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 p-3 border-t border-gray-100">
                      <div className="col-span-6">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(index, "description", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          min="0"
                          value={item.rate}
                          onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#E23E57]"
                          onClick={() => removeItem(index)}
                          disabled={formData.items.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-[#F7F9FC] rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Subtotal</span>
                  <span className="text-[#0F1E3A]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">GST (18%)</span>
                  <span className="text-[#0F1E3A]">{formatCurrency(gst)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span className="text-[#0F1E3A]">Total</span>
                  <span className="text-[#005EEB]">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#0F1E3A]">Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any notes or terms..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="bg-[#005EEB] hover:bg-[#004ACC] gap-2"
                onClick={handleSubmit}
                disabled={!formData.client || loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Create Invoice
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#0FB07A]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#0FB07A]" />
            </div>
            <h3 className="text-xl font-semibold text-[#0F1E3A] mb-2">Invoice Created!</h3>
            <p className="text-[#6B7280] mb-6">
              Invoice <strong>{formData.invoiceNumber}</strong> for {formatCurrency(total)} has been created.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button className="bg-[#005EEB] hover:bg-[#004ACC]">
                Send to Client
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
