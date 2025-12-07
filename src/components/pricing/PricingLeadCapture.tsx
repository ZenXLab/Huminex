import { useState } from "react";
import { FileText, Download, Send, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const PricingLeadCapture = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !company) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Quote sent to your email! Check your inbox.");
    setEmail("");
    setName("");
    setCompany("");
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-card to-accent/5 rounded-3xl border border-primary/20 p-8 lg:p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative grid lg:grid-cols-2 gap-10 items-center">
        {/* Left: Lead Magnet */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Free Resource
          </div>
          <h3 className="text-3xl font-heading font-bold text-foreground mb-4">
            ATLAS Savings Calculator
          </h3>
          <p className="text-muted-foreground text-lg mb-6">
            Discover how much time and money your HR team can save each month with ATLAS automation.
          </p>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span>Calculate hours saved on payroll processing</span>
            </li>
            <li className="flex items-center gap-3 text-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span>See compliance cost reduction estimates</span>
            </li>
            <li className="flex items-center gap-3 text-foreground">
              <Download className="w-5 h-5 text-primary" />
              <span>Get instant PDF report with ROI breakdown</span>
            </li>
          </ul>

          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Free Calculator
          </Button>
        </div>

        {/* Right: Custom Quote Form */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-xl">
          <h4 className="text-xl font-heading font-bold text-foreground mb-2">
            Get Your Custom Quote
          </h4>
          <p className="text-muted-foreground text-sm mb-6">
            Personalized pricing in your inbox within 2 minutes
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50 h-12"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Work Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 h-12"
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-background/50 h-12"
              />
            </div>
            <Button 
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold"
            >
              <Send className="w-4 h-4 mr-2" />
              Get Custom Quote
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            🔒 We respect your privacy. No spam, ever.
          </p>
        </div>
      </div>
    </div>
  );
};
