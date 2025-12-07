import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Handshake,
  Shield,
  Zap,
  Users,
  Code,
  Headphones,
  ChevronRight,
  Check,
  Building2,
  Globe,
  Award
} from "lucide-react";

const partnerTypes = [
  {
    id: "implementation",
    name: "Implementation Partner",
    icon: Code,
    description: "Deploy and customize ATLAS for enterprise clients",
    benefits: ["Revenue share on projects", "Technical training", "Lead referrals", "Partner portal access"]
  },
  {
    id: "reseller",
    name: "Reseller / VAR",
    icon: Building2,
    description: "Sell ATLAS licenses with your value-added services",
    benefits: ["Wholesale pricing", "Marketing support", "Co-branded materials", "Dedicated account manager"]
  },
  {
    id: "technology",
    name: "Technology Partner",
    icon: Zap,
    description: "Integrate your solution with ATLAS ecosystem",
    benefits: ["API access", "Technical documentation", "Joint go-to-market", "Integration listing"]
  },
  {
    id: "referral",
    name: "Referral Partner",
    icon: Handshake,
    description: "Refer clients and earn commissions",
    benefits: ["20% referral commission", "No minimum commitment", "Real-time tracking", "Monthly payouts"]
  }
];

const internalServices = [
  {
    name: "Managed ATLAS Operations",
    description: "Full-service payroll, compliance, and HR operations managed by CropXon team",
    features: ["Dedicated ops team", "SLA-backed delivery", "Compliance guarantee", "24/7 support"]
  },
  {
    name: "Custom Development",
    description: "Bespoke modules and integrations built by our internal engineering team",
    features: ["Custom workflows", "API integrations", "White-label options", "Dedicated PM"]
  },
  {
    name: "Enterprise Implementation",
    description: "End-to-end deployment for large organizations",
    features: ["Data migration", "Training programs", "Change management", "Go-live support"]
  }
];

const Partners = () => {
  const [selectedType, setSelectedType] = useState("implementation");
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.email || !formData.contactName) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      await supabase.from("inquiries").insert({
        name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        company: formData.companyName,
        message: `Partner Type: ${selectedType}\nWebsite: ${formData.website}\n\n${formData.message}`,
        service_interest: "Partnership",
        source: "partners_page"
      });

      toast.success("Thank you! Our partnerships team will contact you within 24 hours.");
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        website: "",
        message: ""
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Partner with ATLAS | CropXon Technology Partner Program</title>
        <meta 
          name="description" 
          content="Join the ATLAS partner ecosystem. Become an implementation partner, reseller, or technology partner. Grow your business with India's leading workforce platform." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20">
          {/* Hero */}
          <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
            <div className="container mx-auto px-4 text-center">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Handshake className="w-3 h-3 mr-1" />
                Partner Program
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
                Grow with ATLAS
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join our partner ecosystem and unlock new revenue streams while delivering world-class workforce solutions to your clients.
              </p>
            </div>
          </section>

          {/* Partner Types */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-heading font-bold mb-4">Choose Your Partnership Path</h2>
                <p className="text-muted-foreground">Multiple ways to collaborate and grow together</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {partnerTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`w-10 h-10 mb-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                      <ul className="space-y-2">
                        {type.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-center gap-2 text-xs">
                            <Check className="w-3 h-3 text-primary" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Internal Services - CropXon Managed */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Managed by CropXon
                </Badge>
                <h2 className="text-3xl font-heading font-bold mb-4">Internal Service Packages</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  For projects requiring direct involvement from our internal team. Full-service delivery with guaranteed outcomes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {internalServices.map((service) => (
                  <Card key={service.name} className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Partner Application Form */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-heading font-bold mb-4">Become a Partner</h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and our partnerships team will reach out within 24 hours.
                  </p>
                </div>

                <Card className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          placeholder="Your company"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          placeholder="https://"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactName">Contact Name *</Label>
                        <Input
                          id="contactName"
                          value={formData.contactName}
                          onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+91"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Tell us about your interest</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="How would you like to partner with ATLAS?"
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Partnership Application"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">50+</div>
                  <div className="text-primary-foreground/80">Active Partners</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">₹2Cr+</div>
                  <div className="text-primary-foreground/80">Partner Revenue</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">14</div>
                  <div className="text-primary-foreground/80">Industries Served</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">99%</div>
                  <div className="text-primary-foreground/80">Partner Satisfaction</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Partners;
