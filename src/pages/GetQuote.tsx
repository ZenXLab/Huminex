import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { industryCategories } from '@/lib/industryTypes';
import { Check, Star, Zap, Shield, ArrowRight, Calculator, Building2, Users, Briefcase, Crown } from 'lucide-react';

interface ServicePricing {
  id: string;
  service_name: string;
  service_category: string;
  plan_tier: string;
  base_price: number;
  description: string;
  features: string[];
}

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface PricingModifier {
  modifier_type: string;
  modifier_key: string;
  multiplier: number;
}

const clientTypes = [
  { id: 'individual', label: 'Individual', icon: Users, description: '1 person' },
  { id: 'small_business', label: 'Small Business', icon: Building2, description: '1-20 employees' },
  { id: 'msme', label: 'MSME', icon: Briefcase, description: '20-200 employees' },
  { id: 'startup', label: 'Startup', icon: Zap, description: '200-500 employees' },
  { id: 'enterprise', label: 'Enterprise', icon: Crown, description: '500+ employees' },
];

const planTiers = ['basic', 'standard', 'advanced', 'enterprise'];

const GetQuote = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Data from database
  const [services, setServices] = useState<ServicePricing[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [modifiers, setModifiers] = useState<PricingModifier[]>([]);
  
  // User selections
  const [clientType, setClientType] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [industrySubtype, setIndustrySubtype] = useState('');
  const [selectedServices, setSelectedServices] = useState<{service: string, tier: string}[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  // Contact info for pre-onboarding
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      const [servicesRes, addonsRes, modifiersRes] = await Promise.all([
        supabase.from('service_pricing').select('*').eq('is_active', true),
        supabase.from('service_addons').select('*').eq('is_active', true),
        supabase.from('pricing_modifiers').select('*').eq('is_active', true),
      ]);

      if (servicesRes.data) {
        setServices(servicesRes.data.map(s => ({
          ...s,
          features: Array.isArray(s.features) ? s.features : JSON.parse(s.features as string || '[]')
        })));
      }
      if (addonsRes.data) setAddons(addonsRes.data);
      if (modifiersRes.data) setModifiers(modifiersRes.data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error('Failed to load pricing data');
    } finally {
      setLoading(false);
    }
  };

  const getUniqueServices = () => {
    const serviceNames = [...new Set(services.map(s => s.service_name))];
    return serviceNames;
  };

  const getServiceByTier = (serviceName: string, tier: string) => {
    return services.find(s => s.service_name === serviceName && s.plan_tier === tier);
  };

  const getClientTypeMultiplier = () => {
    const modifier = modifiers.find(m => m.modifier_type === 'client_type' && m.modifier_key === clientType);
    return modifier?.multiplier || 1;
  };

  const getIndustryMultiplier = () => {
    const modifier = modifiers.find(m => m.modifier_type === 'industry' && m.modifier_key === industryType.toLowerCase());
    return modifier?.multiplier || 1;
  };

  const calculateTotalPrice = () => {
    let total = 0;
    
    // Calculate services price
    selectedServices.forEach(({ service, tier }) => {
      const serviceData = getServiceByTier(service, tier);
      if (serviceData) {
        total += serviceData.base_price;
      }
    });
    
    // Add addons
    selectedAddons.forEach(addonId => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) {
        total += addon.price;
      }
    });
    
    // Apply modifiers
    total *= getClientTypeMultiplier();
    total *= getIndustryMultiplier();
    
    // Apply coupon
    if (couponDiscount > 0) {
      total *= (1 - couponDiscount / 100);
    }
    
    return Math.round(total);
  };

  const toggleService = (serviceName: string, tier: string) => {
    setSelectedServices(prev => {
      const existing = prev.find(s => s.service === serviceName);
      if (existing) {
        if (existing.tier === tier) {
          return prev.filter(s => s.service !== serviceName);
        }
        return prev.map(s => s.service === serviceName ? { ...s, tier } : s);
      }
      return [...prev, { service: serviceName, tier }];
    });
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    const { data, error } = await supabase
      .from('coupon_codes')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();
    
    if (error || !data) {
      toast.error('Invalid coupon code');
      return;
    }
    
    if (data.max_uses && data.current_uses >= data.max_uses) {
      toast.error('Coupon has reached maximum uses');
      return;
    }
    
    if (data.valid_until && new Date(data.valid_until) < new Date()) {
      toast.error('Coupon has expired');
      return;
    }
    
    setCouponDiscount(data.discount_value);
    toast.success(`Coupon applied! ${data.discount_value}% discount`);
  };

  const handleContinueToOnboarding = async () => {
    if (!contactInfo.name || !contactInfo.email || !clientType || !industryType) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Generate client ID
      const { data: clientIdData, error: clientIdError } = await supabase.rpc('generate_client_id');
      
      if (clientIdError) throw clientIdError;
      
      const clientId = clientIdData || `ATLS-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-0001`;
      
      // Create onboarding session
      const { data: session, error: sessionError } = await supabase
        .from('onboarding_sessions')
        .insert({
          client_id: clientId,
          email: contactInfo.email,
          full_name: contactInfo.name,
          phone: contactInfo.phone,
          company_name: contactInfo.company,
          client_type: clientType,
          industry_type: industryType,
          industry_subtype: industrySubtype,
          selected_services: selectedServices,
          selected_addons: selectedAddons,
          pricing_snapshot: {
            services: selectedServices.map(s => ({
              ...s,
              price: getServiceByTier(s.service, s.tier)?.base_price || 0
            })),
            addons: selectedAddons.map(id => {
              const addon = addons.find(a => a.id === id);
              return { id, name: addon?.name, price: addon?.price };
            }),
            subtotal: calculateTotalPrice(),
            clientTypeMultiplier: getClientTypeMultiplier(),
            industryMultiplier: getIndustryMultiplier(),
            couponDiscount,
            total: calculateTotalPrice()
          },
          status: 'new',
          dashboard_tier: clientType === 'enterprise' ? 'enterprise' : 
                          clientType === 'startup' ? 'advanced' :
                          clientType === 'small_business' || clientType === 'msme' ? 'standard' : 'basic'
        })
        .select()
        .single();
      
      if (sessionError) throw sessionError;
      
      // Store session ID for onboarding
      localStorage.setItem('atlas_onboarding_session', session.id);
      localStorage.setItem('atlas_client_id', clientId);
      
      toast.success('Quote saved! Redirecting to onboarding...');
      navigate('/onboarding');
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to save quote. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Calculator className="w-4 h-4" />
              Custom Quote Builder
            </div>
            <h1 className="text-4xl font-bold mb-4">Build Your Custom Quote</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Configure your exact services, select add-ons, and get personalized pricing tailored to your business.
            </p>
            <div className="max-w-xl mx-auto p-3 rounded-xl bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Just browsing plans?</strong> Visit our{" "}
                <a href="/pricing" className="text-primary hover:underline font-medium">
                  Pricing Page
                </a>{" "}
                to compare standard plans and features side-by-side.
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {s}
                  </div>
                  {s < 4 && <div className={`w-16 h-1 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Client Type & Industry */}
          {step === 1 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Select Your Business Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {clientTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setClientType(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          clientType === type.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${clientType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className="font-medium text-sm">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Select Your Industry</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Industry Category</Label>
                    <Select value={industryType} onValueChange={setIndustryType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industryCategories.map((cat) => (
                          <SelectItem key={cat.category} value={cat.category}>{cat.category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {industryType && industryCategories.find(c => c.category === industryType)?.industries && (
                    <div>
                      <Label>Sub-category (Optional)</Label>
                      <Select value={industrySubtype} onValueChange={setIndustrySubtype}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub-category" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryCategories.find(c => c.category === industryType)?.industries.map((sub) => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!clientType || !industryType}
                  size="lg"
                >
                  Continue to Services <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Select Services */}
          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-center mb-8">Select Your Services</h2>
              
              {getUniqueServices().map((serviceName) => (
                <Card key={serviceName} className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{serviceName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {planTiers.map((tier) => {
                      const service = getServiceByTier(serviceName, tier);
                      if (!service) return null;
                      
                      const isSelected = selectedServices.some(s => s.service === serviceName && s.tier === tier);
                      const isEnterprise = tier === 'enterprise';
                      
                      return (
                        <button
                          key={tier}
                          onClick={() => toggleService(serviceName, tier)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={tier === 'advanced' ? 'default' : 'secondary'} className="capitalize">
                              {tier === 'advanced' && <Star className="w-3 h-3 mr-1" />}
                              {tier}
                            </Badge>
                            {isSelected && <Check className="w-5 h-5 text-primary" />}
                          </div>
                          <p className="text-2xl font-bold mb-2">
                            {isEnterprise ? 'Custom' : `₹${service.base_price.toLocaleString()}`}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                          <ul className="space-y-1">
                            {service.features.slice(0, 3).map((feature, i) => (
                              <li key={i} className="text-xs flex items-center gap-1">
                                <Check className="w-3 h-3 text-primary" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              ))}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={selectedServices.length === 0}
                  size="lg"
                >
                  Continue to Add-ons <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Add-ons & Summary */}
          {step === 3 && (
            <div className="max-w-4xl mx-auto space-y-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Optional Add-ons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addons.map((addon) => (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedAddons.includes(addon.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{addon.name}</p>
                          <p className="text-sm text-muted-foreground">{addon.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{addon.price.toLocaleString()}</p>
                          {selectedAddons.includes(addon.id) && (
                            <Check className="w-5 h-5 text-primary ml-auto" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Apply Coupon</h2>
                <div className="flex gap-4">
                  <Input 
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <Button onClick={applyCoupon} variant="outline">Apply</Button>
                </div>
                {couponDiscount > 0 && (
                  <p className="text-sm text-primary mt-2">✓ {couponDiscount}% discount applied</p>
                )}
              </Card>

              <Card className="p-6 bg-primary/5 border-primary/20">
                <h2 className="text-xl font-semibold mb-4">Quote Summary</h2>
                <div className="space-y-3">
                  {selectedServices.map(({ service, tier }) => {
                    const serviceData = getServiceByTier(service, tier);
                    return (
                      <div key={`${service}-${tier}`} className="flex justify-between">
                        <span>{service} ({tier})</span>
                        <span>₹{serviceData?.base_price.toLocaleString() || 0}</span>
                      </div>
                    );
                  })}
                  {selectedAddons.map((addonId) => {
                    const addon = addons.find(a => a.id === addonId);
                    return (
                      <div key={addonId} className="flex justify-between text-muted-foreground">
                        <span>+ {addon?.name}</span>
                        <span>₹{addon?.price.toLocaleString()}</span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-3 flex justify-between text-sm text-muted-foreground">
                    <span>Client Type Modifier ({clientType})</span>
                    <span>×{getClientTypeMultiplier()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Industry Modifier ({industryType})</span>
                    <span>×{getIndustryMultiplier()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Coupon Discount</span>
                      <span>-{couponDiscount}%</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span>₹{calculateTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)} size="lg">
                  Continue to Onboarding <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Pre-Onboarding Contact */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto">
              <Card className="p-8">
                <div className="text-center mb-8">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Almost There!</h2>
                  <p className="text-muted-foreground">
                    Enter your details to save your quote and continue to onboarding.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input 
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label>Business Email *</Label>
                    <Input 
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      placeholder="Enter your business email"
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input 
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label>Company Name</Label>
                    <Input 
                      value={contactInfo.company}
                      onChange={(e) => setContactInfo({...contactInfo, company: e.target.value})}
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Your Quote Total</p>
                      <p className="text-sm text-muted-foreground">{selectedServices.length} services, {selectedAddons.length} add-ons</p>
                    </div>
                    <p className="text-3xl font-bold">₹{calculateTotalPrice().toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                  <Button onClick={handleContinueToOnboarding} size="lg">
                    Continue to Onboarding <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GetQuote;
