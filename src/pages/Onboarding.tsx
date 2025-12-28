import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { WelcomeAnimation } from "@/components/onboarding/WelcomeAnimation";
import { SuccessAnimation } from "@/components/onboarding/SuccessAnimation";
import { PolicyModal } from "@/components/onboarding/PolicyModal";
import { industryCategories } from "@/lib/industryTypes";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Mail, 
  Lock, 
  User, 
  Building2,
  Phone,
  Shield,
  Sparkles,
  Code,
  Brain,
  Palette,
  Cloud,
  Briefcase,
  Rocket,
  Eye,
  Factory,
  Loader2
} from "lucide-react";

const OnboardingSteps = [
  { id: 1, title: "Welcome", icon: Sparkles },
  { id: 2, title: "Create Account", icon: User },
  { id: 3, title: "Agreements", icon: Shield },
  { id: 4, title: "Verification", icon: Mail },
  { id: 5, title: "Services", icon: Code },
  { id: 6, title: "Complete", icon: Check },
];

const services = [
  { id: "website", name: "Website Development", icon: Code, color: "from-blue-400 to-blue-600" },
  { id: "app", name: "Mobile App", icon: Phone, color: "from-purple-400 to-purple-600" },
  { id: "saas", name: "SaaS Platform", icon: Cloud, color: "from-cyan-400 to-teal-500" },
  { id: "ai", name: "AI Automation", icon: Brain, color: "from-pink-400 to-rose-500" },
  { id: "design", name: "Branding & Design", icon: Palette, color: "from-orange-400 to-amber-500" },
  { id: "devops", name: "Cloud & DevOps", icon: Cloud, color: "from-emerald-400 to-green-500" },
  { id: "security", name: "Cybersecurity", icon: Lock, color: "from-red-400 to-rose-500" },
  { id: "consulting", name: "Enterprise Consulting", icon: Briefcase, color: "from-indigo-400 to-violet-500" },
];

const policies = [
  { id: "terms", label: "Terms & Conditions", required: true },
  { id: "privacy", label: "Privacy Policy", required: true },
  { id: "payment", label: "Payment Policy", required: true },
  { id: "delivery", label: "Project Delivery Policy", required: true },
  { id: "refund", label: "Refund Policy", required: true },
  { id: "data", label: "Data Usage Consent", required: true },
  { id: "ai", label: "AI Automation Consent", required: false },
  { id: "communication", label: "WhatsApp/Communication Consent", required: false },
];

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrefill, setIsLoadingPrefill] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    company: "",
    phone: "",
    industryCategory: "",
    industryType: "",
    customIndustry: "",
    agreements: {} as Record<string, boolean>,
    selectedServices: [] as string[],
  });
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pre-fill logic from URL params or previous onboarding session
  useEffect(() => {
    const prefillFromParams = () => {
      const email = searchParams.get("email");
      const industry = searchParams.get("industry");
      const servicesList = searchParams.get("services");
      
      if (email || industry || servicesList) {
        setFormData(prev => ({
          ...prev,
          email: email || prev.email,
          industryCategory: industry || prev.industryCategory,
          selectedServices: servicesList ? servicesList.split(",") : prev.selectedServices,
        }));
      }
    };

    const prefillFromDatabase = async () => {
      try {
        // Check for existing onboarding session by email from URL
        const email = searchParams.get("email");
        if (email) {
          const { data: existingSession } = await supabase
            .from("onboarding_sessions")
            .select("*")
            .eq("email", email)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (existingSession) {
            setFormData(prev => ({
              ...prev,
              fullName: existingSession.full_name || prev.fullName,
              email: existingSession.email || prev.email,
              company: existingSession.company_name || prev.company,
              phone: existingSession.phone || prev.phone,
              industryCategory: existingSession.industry_type || prev.industryCategory,
              industryType: existingSession.industry_subtype || prev.industryType,
              selectedServices: (existingSession.selected_services as string[]) || prev.selectedServices,
            }));
            
            toast({
              title: "Welcome Back!",
              description: "We've restored your previous selections.",
            });
          }
        }
      } catch (error) {
        // No existing session found, continue with fresh form
        console.log("No previous session found");
      } finally {
        setIsLoadingPrefill(false);
      }
    };

    prefillFromParams();
    prefillFromDatabase();
  }, [searchParams, toast]);

  useEffect(() => {
    if (user) {
      navigate("/portal");
    }
  }, [user, navigate]);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast({ title: "Error", description: "Please enter your full name", variant: "destructive" });
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: "Error", description: "Please enter a valid email address", variant: "destructive" });
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        company_name: formData.company,
        phone: formData.phone,
      });
      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      });
      handleNext();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create account. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const toggleAgreement = (id: string) => {
    setFormData(prev => ({
      ...prev,
      agreements: { ...prev.agreements, [id]: !prev.agreements[id] }
    }));
  };

  const allRequiredAgreed = policies.filter(p => p.required).every(p => formData.agreements[p.id]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Policy Modal */}
      <PolicyModal 
        isOpen={!!selectedPolicy} 
        onClose={() => setSelectedPolicy(null)} 
        policyId={selectedPolicy} 
      />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500"
          style={{ width: `${(currentStep / 6) * 100}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 bg-card/80 backdrop-blur-xl rounded-full px-4 py-2 border border-border/60 shadow-lg">
          {OnboardingSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive ? "bg-primary text-primary-foreground scale-110" : ""}
                  ${isCompleted ? "bg-emerald text-white" : ""}
                  ${!isActive && !isCompleted ? "bg-muted text-muted-foreground" : ""}
                `}>
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                {index < OnboardingSteps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 transition-colors ${isCompleted ? "bg-emerald" : "bg-muted"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-2xl">
          
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="text-center animate-fade-in-up">
              {/* Lottie Hub Animation */}
              <WelcomeAnimation />

              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 tracking-tight">
                Welcome to <span className="text-gradient">HUMINEX</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                Built for the Next Generation of Innovation.
              </p>
              <p className="text-sm text-muted-foreground mb-10">
                Before we begin, let's set up your account.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" onClick={handleNext} className="gap-2 px-8 shadow-purple">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="lg" onClick={() => navigate("/auth")}>
                  Already have an account? Log in
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Account Creation */}
          {currentStep === 2 && (
            <div className="animate-fade-in-up">
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/60 shadow-elevated p-8 lg:p-10">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Create Your Account</h2>
                  <p className="text-muted-foreground">Enter your details to get started</p>
                </div>

                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="fullName"
                          placeholder="John Doe"
                          className="pl-10 h-11 rounded-xl border-border/60 focus:border-primary/50 focus:ring-primary/20"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="email"
                          type="email"
                          placeholder="john@company.com"
                          className="pl-10 h-11 rounded-xl border-border/60 focus:border-primary/50"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium">Company Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="company"
                          placeholder="Acme Inc."
                          className="pl-10 h-11 rounded-xl border-border/60 focus:border-primary/50"
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="pl-10 h-11 rounded-xl border-border/60 focus:border-primary/50"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Industry Category *</Label>
                      <Select 
                        value={formData.industryCategory} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, industryCategory: value, industryType: "", customIndustry: "" }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl">
                          <Factory className="w-4 h-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Select industry category" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryCategories.map((cat) => (
                            <SelectItem key={cat.category} value={cat.category}>{cat.category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Industry Type</Label>
                      <Select 
                        value={formData.industryType} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, industryType: value }))}
                        disabled={!formData.industryCategory}
                      >
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder="Select specific industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryCategories
                            .find(cat => cat.category === formData.industryCategory)
                            ?.industries.map((ind) => (
                              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.industryType === "Custom Category" && (
                    <div className="space-y-2">
                      <Label htmlFor="customIndustry" className="text-sm font-medium">Specify Your Industry</Label>
                      <Input 
                        id="customIndustry"
                        placeholder="Enter your industry type"
                        className="h-11 rounded-xl border-border/60 focus:border-primary/50"
                        value={formData.customIndustry}
                        onChange={(e) => setFormData(prev => ({ ...prev, customIndustry: e.target.value }))}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="password"
                        type="password"
                        placeholder="Create a strong password (min 6 characters)"
                        className="pl-10 h-11 rounded-xl border-border/60 focus:border-primary/50"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="ghost" onClick={handleBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={handleNext} className="gap-2 px-6">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Agreements */}
          {currentStep === 3 && (
            <div className="animate-fade-in-up">
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/60 shadow-elevated p-8 lg:p-10">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Terms & Agreements</h2>
                  <p className="text-muted-foreground">Please review and accept our policies</p>
                </div>

                <div className="space-y-3">
                  {policies.map((policy) => (
                    <div 
                      key={policy.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          id={policy.id}
                          checked={formData.agreements[policy.id] || false}
                          onCheckedChange={() => toggleAgreement(policy.id)}
                          className="border-primary/50 data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor={policy.id} className="text-sm font-medium cursor-pointer">
                          {policy.label}
                          {policy.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-primary gap-1"
                        onClick={() => setSelectedPolicy(policy.id)}
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="ghost" onClick={handleBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={handleSignUp} disabled={!allRequiredAgreed || isLoading} className="gap-2 px-6">
                    {isLoading ? "Creating Account..." : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Verification */}
          {currentStep === 4 && (
            <div className="animate-fade-in-up text-center">
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/60 shadow-elevated p-8 lg:p-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Mail className="w-10 h-10 text-primary" />
                </div>

                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Account Created!</h2>
                <p className="text-muted-foreground mb-6">
                  Your account has been set up successfully. You can now continue to select your services.
                </p>

                <div className="bg-muted/30 rounded-xl p-4 mb-8">
                  <p className="text-sm text-muted-foreground">
                    Email: <span className="text-foreground font-medium">{formData.email}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button onClick={handleNext} className="gap-2">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Service Selection */}
          {currentStep === 5 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">What brings you to HUMINEX?</h2>
                <p className="text-muted-foreground">Select the services you're interested in</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {services.map((service) => {
                  const Icon = service.icon;
                  const isSelected = formData.selectedServices.includes(service.id);
                  
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`
                        relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group
                        ${isSelected 
                          ? "border-primary bg-primary/5 shadow-purple" 
                          : "border-border/60 bg-card/80 hover:border-primary/30"
                        }
                      `}
                    >
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all
                        bg-gradient-to-br ${service.color} ${isSelected ? "opacity-100" : "opacity-70 group-hover:opacity-100"}
                      `}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-sm font-medium text-foreground">{service.name}</h3>
                      
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button onClick={handleNext} className="gap-2 px-6">
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Success */}
          {currentStep === 6 && (
            <div className="text-center animate-fade-in-up">
              {/* Lottie Success Animation */}
              <SuccessAnimation />

              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4 tracking-tight">
                Your HUMINEX Workspace Is Ready
              </h1>
              <p className="text-lg text-muted-foreground mb-10">
                Welcome aboard! Let's build something amazing together.
              </p>

              <Button size="lg" onClick={() => navigate("/portal")} className="gap-2 px-8 shadow-purple">
                <Rocket className="w-5 h-5" />
                Enter Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
