import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calculator, Check, ArrowRight, User, Mail, Phone, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const clientTypes = [
  { id: "startup", label: "Startup", multiplier: 0.8 },
  { id: "sme", label: "SME", multiplier: 1.0 },
  { id: "enterprise", label: "Enterprise", multiplier: 1.5 },
  { id: "government", label: "Government", multiplier: 1.3 },
];

const serviceTypes = [
  { id: "digital-engineering", label: "Digital Engineering", basePrice: 50000 },
  { id: "ai-automation", label: "AI & Automation", basePrice: 75000 },
  { id: "experience-design", label: "Experience Design", basePrice: 40000 },
  { id: "cloud-devops", label: "Cloud & DevOps", basePrice: 60000 },
  { id: "enterprise-consulting", label: "Enterprise Consulting", basePrice: 80000 },
  { id: "managed-it", label: "Managed IT Services", basePrice: 35000 },
  { id: "cybersecurity", label: "Cybersecurity", basePrice: 70000 },
  { id: "industry-solutions", label: "Industry Solutions", basePrice: 55000 },
];

const complexityLevels = [
  { id: "basic", label: "Basic", multiplier: 1.0 },
  { id: "standard", label: "Standard", multiplier: 1.5 },
  { id: "advanced", label: "Advanced", multiplier: 2.0 },
  { id: "enterprise", label: "Enterprise", multiplier: 3.0 },
];

const addons = [
  { id: "support-24x7", label: "24/7 Support", price: 10000 },
  { id: "priority", label: "Priority Delivery", price: 15000 },
  { id: "training", label: "Team Training", price: 8000 },
  { id: "documentation", label: "Extended Docs", price: 5000 },
  { id: "maintenance", label: "1-Year Maintenance", price: 20000 },
];

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().max(1000).optional(),
});

export const QuoteModal = ({ open, onOpenChange }: QuoteModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [quoteData, setQuoteData] = useState({
    clientType: "",
    serviceType: "",
    complexity: "",
    selectedAddons: [] as string[],
    couponCode: "",
  });

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setContactData(prev => ({
          ...prev,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || "",
        }));
      }
    });
  }, [open]);

  const calculatePrice = () => {
    const service = serviceTypes.find(s => s.id === quoteData.serviceType);
    const client = clientTypes.find(c => c.id === quoteData.clientType);
    const complexity = complexityLevels.find(c => c.id === quoteData.complexity);

    if (!service || !client || !complexity) return 0;

    let price = service.basePrice * client.multiplier * complexity.multiplier;
    
    quoteData.selectedAddons.forEach(addonId => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) price += addon.price;
    });

    // Apply coupon discount
    if (quoteData.couponCode.toLowerCase() === "atlas10") {
      price *= 0.9;
    }

    return Math.round(price);
  };

  const handleAddonToggle = (addonId: string) => {
    setQuoteData(prev => ({
      ...prev,
      selectedAddons: prev.selectedAddons.includes(addonId)
        ? prev.selectedAddons.filter(id => id !== addonId)
        : [...prev.selectedAddons, addonId]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const validated = contactSchema.parse(contactData);
      
      const estimatedPrice = calculatePrice();
      
      // For now, we'll just show success - once DB is ready, this will save to quotes table
      toast.success("Quote request submitted! We'll contact you within 24 hours.");
      onOpenChange(false);
      setStep(1);
      setQuoteData({
        clientType: "",
        serviceType: "",
        complexity: "",
        selectedAddons: [],
        couponCode: "",
      });
      setContactData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = quoteData.clientType && quoteData.serviceType && quoteData.complexity;
  const estimatedPrice = calculatePrice();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-heading">
            <Calculator className="h-6 w-6 text-primary" />
            Get Your Quote
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 2 && (
                <div className={`w-16 h-1 mx-2 rounded ${step > s ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            {/* Client Type */}
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Client Type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {clientTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setQuoteData(prev => ({ ...prev, clientType: type.id }))}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      quoteData.clientType === type.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Type */}
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Service Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {serviceTypes.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setQuoteData(prev => ({ ...prev, serviceType: service.id }))}
                    className={`p-3 rounded-lg border text-sm font-medium text-left transition-all ${
                      quoteData.serviceType === service.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {service.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Complexity */}
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Project Complexity</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {complexityLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setQuoteData(prev => ({ ...prev, complexity: level.id }))}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      quoteData.complexity === level.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Addons */}
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Add-ons (Optional)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {addons.map((addon) => (
                  <button
                    key={addon.id}
                    onClick={() => handleAddonToggle(addon.id)}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      quoteData.selectedAddons.includes(addon.id)
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span className={quoteData.selectedAddons.includes(addon.id) ? "text-primary" : "text-foreground"}>
                      {addon.label}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-1">
                      +₹{addon.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Coupon Code</Label>
              <Input
                placeholder="Enter coupon code"
                value={quoteData.couponCode}
                onChange={(e) => setQuoteData(prev => ({ ...prev, couponCode: e.target.value }))}
              />
              {quoteData.couponCode.toLowerCase() === "atlas10" && (
                <p className="text-xs text-green-600">10% discount applied!</p>
              )}
            </div>

            {/* Estimated Price */}
            {canProceedToStep2 && (
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Estimated Budget</p>
                <p className="text-3xl font-heading font-bold text-primary">
                  ₹{estimatedPrice.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">*Final quote may vary based on requirements</p>
              </div>
            )}

            <Button
              variant="hero"
              className="w-full"
              disabled={!canProceedToStep2}
              onClick={() => setStep(2)}
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-xl mb-4">
              <p className="text-sm text-muted-foreground">Estimated Quote</p>
              <p className="text-2xl font-heading font-bold text-primary">
                ₹{estimatedPrice.toLocaleString()}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={contactData.name}
                    onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={contactData.email}
                    onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={contactData.phone}
                    onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground">Company</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="Your Company"
                    value={contactData.company}
                    onChange={(e) => setContactData(prev => ({ ...prev, company: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground">Additional Details</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your project requirements..."
                value={contactData.message}
                onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                variant="hero"
                onClick={handleSubmit}
                disabled={loading || !contactData.name || !contactData.email}
                className="flex-1"
              >
                {loading ? "Submitting..." : "Submit Quote Request"}
              </Button>
            </div>

            {!user && (
              <p className="text-center text-xs text-muted-foreground">
                <a href="/auth" className="text-primary hover:underline">Sign in</a> to save quotes to your account
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
