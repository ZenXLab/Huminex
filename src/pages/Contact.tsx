import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { toast } from "sonner";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  Building2, 
  Globe, 
  Headphones,
  Clock,
  Shield,
  Code,
  ExternalLink,
  Calendar,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2
} from "lucide-react";

const offices = [
  {
    city: "Bhubaneswar",
    country: "India",
    type: "Headquarters",
    address: "CropXon Innovations Pvt. Ltd.",
    icon: Building2
  },
  {
    city: "Bangalore",
    country: "India",
    type: "Tech Office",
    address: "Koramangala (Coming Soon)",
    icon: Code
  },
  {
    city: "Hyderabad",
    country: "India",
    type: "R&D Center",
    address: "Hitech City (Coming Soon)",
    icon: Zap
  },
  {
    city: "Remote",
    country: "Global",
    type: "Distributed Team",
    address: "Across India & Worldwide",
    icon: Globe
  }
];

const supportChannels = [
  { icon: Mail, label: "General Support", value: "support@cropxon.com", type: "email" },
  { icon: Building2, label: "Enterprise Support", value: "enterprise@cropxon.com", type: "email" },
  { icon: Phone, label: "Phone Support", value: "+91-XXXXXXXXXX", type: "phone" },
  { icon: MessageSquare, label: "WhatsApp Support", value: "Instant Chat", type: "chat" },
  { icon: Headphones, label: "Emergency Payroll", value: "Priority Support Line", type: "priority" },
  { icon: Clock, label: "Response Time", value: "< 2 Hours", type: "info" }
];

const developerResources = [
  { label: "API Documentation", url: "api.cropxon.com/docs", icon: Code },
  { label: "Webhooks Guide", url: "api.cropxon.com/webhooks", icon: Zap },
  { label: "Status Page", url: "status.cropxon.com", icon: Shield }
];

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    contactMethod: "",
    message: ""
  });

  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: officesRef, isVisible: officesVisible } = useScrollAnimation({ threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", organization: "", phone: "", contactMethod: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | CropXon ATLAS - Get in Touch</title>
        <meta name="description" content="Contact CropXon ATLAS for enterprise workforce solutions. Reach out for demos, support, or partnership inquiries." />
        <link rel="canonical" href="https://atlas.cropxon.com/contact" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16 lg:pt-18">
        {/* Hero Section */}
        <section 
          ref={heroRef as React.RefObject<HTMLElement>}
          className="relative pt-20 pb-20 lg:pt-28 lg:pb-28 overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold tracking-wide uppercase mb-6">
                <MessageSquare className="w-4 h-4" />
                Get in Touch
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-6">
                Let's Build the <span className="text-gradient">Future of Work</span> Together
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions? Want a demo? Need enterprise support? We're here to help you transform your organization.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              
              {/* Contact Form */}
              <div 
                ref={formRef as React.RefObject<HTMLDivElement>}
                className={`transition-all duration-700 ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className="bg-card border border-border/60 rounded-2xl p-8 lg:p-10 shadow-xl">
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Send us a Message</h2>
                  <p className="text-muted-foreground mb-8">Fill out the form and we'll get back to you within 24 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="h-12 bg-background border-border/60 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-12 bg-background border-border/60 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organization Name</Label>
                        <Input
                          id="organization"
                          placeholder="Acme Corp"
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          className="h-12 bg-background border-border/60 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-12 bg-background border-border/60 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactMethod">Preferred Contact Method</Label>
                      <Select
                        value={formData.contactMethod}
                        onValueChange={(value) => setFormData({ ...formData, contactMethod: value })}
                      >
                        <SelectTrigger className="h-12 bg-background border-border/60">
                          <SelectValue placeholder="Select preferred method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="video">Video Call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message / Requirements *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your organization and how we can help..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={5}
                        className="bg-background border-border/60 focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full group shadow-lg shadow-primary/20"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Inquiry
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className={`space-y-8 transition-all duration-700 delay-200 ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                
                {/* Support Channels */}
                <div className="bg-card border border-border/60 rounded-2xl p-8">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-primary" />
                    Support Channels
                  </h3>
                  <div className="grid gap-4">
                    {supportChannels.map((channel, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 p-4 bg-muted/30 border border-border/40 rounded-xl hover:border-primary/40 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <channel.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{channel.label}</p>
                          <p className="font-medium text-foreground">{channel.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Developer Resources */}
                <div className="bg-card border border-border/60 rounded-2xl p-8">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Developer Resources
                  </h3>
                  <div className="space-y-3">
                    {developerResources.map((resource, index) => (
                      <a
                        key={index}
                        href={`https://${resource.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-muted/30 border border-border/40 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <resource.icon className="w-5 h-5 text-primary" />
                          <span className="font-medium text-foreground">{resource.label}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Demo CTA */}
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8 text-center">
                  <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    Want a Custom Enterprise Demo?
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Let ATLAS show you how your organization can run 10x faster, 5x smarter.
                  </p>
                  <Link to="/get-quote">
                    <Button className="group shadow-lg shadow-primary/20">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book a Live Demo
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offices Section */}
        <section 
          ref={officesRef as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24 bg-card/50"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className={`text-center mb-12 transition-all duration-700 ${officesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-semibold tracking-wide uppercase mb-6">
                <MapPin className="w-4 h-4" />
                Our Presence
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight mb-4">
                <span className="text-gradient">Global</span> Reach, Local Touch
              </h2>
            </div>

            <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${officesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {offices.map((office, index) => (
                <div 
                  key={index}
                  className="group p-6 bg-background border border-border/60 rounded-2xl hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <office.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">{office.type}</span>
                  <h3 className="text-lg font-heading font-bold text-foreground mt-1">{office.city}, {office.country}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{office.address}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section Placeholder */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="relative h-[400px] bg-gradient-to-br from-primary/5 to-accent/5 border border-border/60 rounded-2xl overflow-hidden">
              {/* Globe Visualization Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <Globe className="w-32 h-32 text-primary/20" />
                  {/* Location dots */}
                  {offices.map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-3 h-3 bg-primary rounded-full animate-pulse"
                      style={{
                        top: `${30 + Math.random() * 40}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="text-muted-foreground">
                  <span className="text-primary font-semibold">Remote-first</span> team across India and global timezones
                </p>
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

export default Contact;
