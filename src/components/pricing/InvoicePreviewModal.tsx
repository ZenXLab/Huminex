import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, Download, MessageCircle, ThumbsUp, LogIn, 
  CheckCircle, Shield, Phone, Mail, Globe, IndianRupee, 
  Sparkles, Building2, Hash, Calendar, Receipt, Send, Loader2, CreditCard
} from "lucide-react";
import { useClickstream } from "@/hooks/useClickstream";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PlanDetails {
  name: string;
  price: number;
}

interface AddonDetails {
  id: string;
  name: string;
  price: number;
}

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: 'india' | 'global';
  plan: PlanDetails | null;
  addons: AddonDetails[];
  addonsTotal: number;
  isAnnual: boolean;
}

export const InvoicePreviewModal = ({
  isOpen,
  onClose,
  region,
  plan,
  addons,
  addonsTotal,
  isAnnual
}: InvoicePreviewModalProps) => {
  const { trackEvent } = useClickstream();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoiceId, setInvoiceId] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const currency = region === 'india' ? '₹' : '$';
  const currencyIcon = region === 'india' ? IndianRupee : Globe;
  const CurrencyIcon = currencyIcon;
  
  // Generate invoice ID on mount
  useEffect(() => {
    if (isOpen) {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      setInvoiceId(`ATLS-INV-${timestamp}-${random}`);
      
      trackEvent("invoice_preview_opened", {
        region,
        plan: plan?.name,
        addonsCount: addons.length,
        isAnnual
      });
    }
  }, [isOpen, region, plan, addons.length, isAnnual, trackEvent]);

  // Calculate pricing
  const planPrice = plan?.price || 0;
  const subtotal = planPrice + addonsTotal;
  
  // Tax calculations
  const gstRate = region === 'india' ? 0.18 : 0;
  const gstAmount = region === 'india' ? subtotal * gstRate : 0;
  const totalAmount = region === 'india' ? subtotal + gstAmount : subtotal;
  
  const taxLabel = region === 'india' ? 'GST (18%)' : 'Tax Included';

  const getInvoiceData = () => ({
    invoiceId,
    planName: plan?.name || 'No Plan Selected',
    planPrice,
    addons: addons.map(a => ({ name: a.name, price: a.price })),
    addonsTotal,
    subtotal,
    taxAmount: gstAmount,
    totalAmount,
    region,
    isAnnual,
    currency,
  });

  // Send email functionality
  const handleSendEmail = async () => {
    if (!emailInput || !emailInput.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSendingEmail(true);
    trackEvent("invoice_email_send_clicked", {
      invoiceId,
      email: emailInput,
      region
    });

    try {
      const { data, error } = await supabase.functions.invoke('send-invoice-email', {
        body: { ...getInvoiceData(), email: emailInput }
      });

      if (error) throw error;

      toast({
        title: "Email Sent!",
        description: `Invoice preview sent to ${emailInput}`
      });
      setEmailInput("");
    } catch (error: any) {
      console.error("Email send error:", error);
      toast({
        title: "Failed to Send",
        description: error.message || "Could not send email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // PDF download functionality
  const handleDownload = async () => {
    trackEvent("invoice_download_attempted", {
      invoiceId,
      isLoggedIn: !!user,
      region,
      totalAmount
    });

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to download your invoice.",
        variant: "default"
      });
      navigate("/portal/login");
      onClose();
      return;
    }

    setIsGeneratingPdf(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { 
          ...getInvoiceData(), 
          customerEmail: user.email,
          customerName: user.user_metadata?.full_name || user.email 
        }
      });

      if (error) throw error;

      // Create a blob from the HTML and download
      const blob = new Blob([data.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Open in new window for printing/saving as PDF
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }

      toast({
        title: "Invoice Generated",
        description: "Your invoice is ready. Use your browser's print dialog to save as PDF."
      });
    } catch (error: any) {
      console.error("PDF generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Razorpay payment functionality
  const handleLoginAndPay = async () => {
    trackEvent("invoice_login_pay_clicked", {
      invoiceId,
      region,
      plan: plan?.name,
      totalAmount,
      isLoggedIn: !!user
    });

    if (!user) {
      navigate("/portal/login");
      onClose();
      return;
    }

    if (!plan) {
      toast({
        title: "No Plan Selected",
        description: "Please select a plan before proceeding to payment.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Create Razorpay order
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: totalAmount,
          currency: currency,
          invoiceId,
          planName: plan.name,
          customerEmail: user.email,
          customerName: user.user_metadata?.full_name || user.email
        }
      });

      if (error) throw error;

      // Load Razorpay script if not already loaded
      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }

      // Initialize Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'ATLAS by CropXon',
        description: `${plan.name} - ${isAnnual ? 'Annual' : 'Monthly'} Plan`,
        order_id: data.orderId,
        handler: function(response: any) {
          trackEvent("payment_success", {
            invoiceId,
            orderId: data.orderId,
            paymentId: response.razorpay_payment_id
          });
          toast({
            title: "Payment Successful!",
            description: "Thank you for your purchase. You will receive a confirmation email shortly."
          });
          onClose();
          navigate("/portal");
        },
        prefill: {
          email: user.email,
          name: user.user_metadata?.full_name || ''
        },
        theme: {
          color: '#00363D'
        },
        modal: {
          ondismiss: function() {
            trackEvent("payment_cancelled", { invoiceId, orderId: data.orderId });
            setIsProcessingPayment(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Could not initiate payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessingPayment(false);
    }
  };

  const handleSatisfied = () => {
    trackEvent("invoice_satisfaction_clicked", {
      invoiceId,
      action: "satisfied",
      region,
      totalAmount
    });
    toast({
      title: "Thank You!",
      description: "We're glad you're satisfied. Let's proceed with your order!"
    });
  };

  const handleTalkToSales = () => {
    trackEvent("invoice_talk_to_sales_clicked", {
      invoiceId,
      region,
      plan: plan?.name,
      totalAmount
    });
    navigate("/contact");
    onClose();
  };

  const maskValue = (value: string) => {
    if (value.length <= 4) return value;
    return value.slice(0, 2) + "••••" + value.slice(-2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-background to-secondary/20 border-2 border-primary/20">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Receipt className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-heading font-bold text-foreground">
                  Invoice Preview
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Review your selected services and pricing
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Invoice Content */}
        <div className="space-y-6 py-4">
          {/* Company Header */}
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ATLAS
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    by CropXon Innovations Pvt Ltd
                  </p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                  <Hash className="w-4 h-4" />
                  <span className="font-mono font-bold text-foreground">{invoiceId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString('en-IN', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-end">
                  <Shield className="w-3 h-3" />
                  <span>Draft - Preview Only</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Plan */}
          {plan && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Selected Plan
              </h4>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                <div>
                  <p className="font-bold text-lg text-foreground">{plan.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {isAnnual ? 'Annual Billing' : 'Monthly Billing'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {currency}{planPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAnnual ? '/year' : '/month'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Add-ons */}
          {addons.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Add-On Modules ({addons.length})
              </h4>
              <div className="space-y-2">
                {addons.map((addon) => (
                  <div 
                    key={addon.id}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-foreground">{addon.name}</span>
                    </div>
                    <span className="font-bold text-foreground">
                      {currency}{addon.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="bg-gradient-to-br from-card to-secondary/30 rounded-xl border border-border p-5">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <CurrencyIcon className="w-4 h-4" />
              Pricing Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan Subtotal</span>
                <span className="font-medium text-foreground">{currency}{planPrice.toLocaleString()}</span>
              </div>
              {addons.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Add-ons Subtotal</span>
                  <span className="font-medium text-foreground">{currency}{addonsTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{currency}{subtotal.toLocaleString()}</span>
              </div>
              
              {region === 'india' ? (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{taxLabel}</span>
                  <span className="font-medium text-foreground">+ {currency}{gstAmount.toLocaleString()}</span>
                </div>
              ) : (
                <div className="flex justify-between text-sm text-green-600">
                  <span>✓ {taxLabel}</span>
                  <span className="font-medium">Included</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-3 border-t-2 border-primary/20">
                <span className="text-lg font-bold text-foreground">Total Amount</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {currency}{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Email Invoice Section */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Invoice Preview
            </h4>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSendEmail}
                disabled={isSendingEmail || !emailInput}
                className="bg-primary hover:bg-primary/90"
              >
                {isSendingEmail ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Receive a copy of this invoice preview in your inbox
            </p>
          </div>

          {/* Masked Details */}
          <div className="bg-secondary/30 rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <Shield className="w-3 h-3 inline mr-1" />
              Invoice details partially masked for preview. Full details available after login.
              <br />
              Customer ID: {maskValue("CUST-" + Date.now().toString())} | 
              Billing: {maskValue("billing@example.com")}
            </p>
          </div>

          {/* Action Columns */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Satisfaction Column */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20 text-center">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-7 h-7 text-green-600" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">Satisfied with the Invoice?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Let us know if everything looks good!
              </p>
              <Button
                onClick={handleSatisfied}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Yes, I'm Satisfied!
              </Button>
            </div>

            {/* Talk to Sales Column */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">Need Customization?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Talk to our sales team for tailored solutions
              </p>
              <Button
                onClick={handleTalkToSales}
                variant="outline"
                className="w-full border-blue-500/50 text-blue-600 hover:bg-blue-500/10"
              >
                <Phone className="w-4 h-4 mr-2" />
                Talk to Sales
              </Button>
            </div>
          </div>

          {/* Download Button */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 max-w-xs"
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {user ? 'Download Invoice PDF' : 'Login to Download'}
            </Button>
          </div>

          {/* Login and Pay CTA */}
          <div className="bg-gradient-to-r from-primary via-accent to-primary rounded-2xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative z-10">
              <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-2">
                Ready to Transform Your Workforce?
              </h3>
              <p className="text-primary-foreground/80 mb-6">
                Experience world-class HR, Payroll & Compliance under one roof
              </p>
              <Button
                onClick={handleLoginAndPay}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-xl shadow-lg"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5 mr-2" />
                )}
                {user ? 'Proceed to Payment' : 'Login & Pay'}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> support@cropxon.com
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> atlas.cropxon.com
              </span>
            </div>
            <p>CropXon Innovations Pvt Ltd • GSTIN: ************ • CIN: **************</p>
            <p className="mt-1 text-primary/60">
              All prices are in {region === 'india' ? 'INR (₹)' : 'USD ($)'}.
              {region === 'india' ? ' GST applicable as per Government of India regulations.' : ' Prices are tax-inclusive.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
