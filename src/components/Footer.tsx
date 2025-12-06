import { Mail, MapPin, FileText, Shield, HeadphonesIcon } from "lucide-react";
import cropxonLogo from "@/assets/cropxon-logo.png";

const footerLinks = {
  services: [
    { name: "Digital Engineering", href: "#" },
    { name: "AI & Automation", href: "#" },
    { name: "Experience Design", href: "#" },
    { name: "Cloud & DevOps", href: "#" },
    { name: "Enterprise Consulting", href: "#" },
    { name: "Managed IT Services", href: "#" },
  ],
  company: [
    { name: "About CropXon", href: "#" },
    { name: "Leadership", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Case Studies", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Security", href: "#" },
  ],
};

const contactEmails = [
  { label: "General", email: "hello@atlas.cropxon.com", icon: Mail },
  { label: "Support", email: "support@atlas.cropxon.com", icon: HeadphonesIcon },
  { label: "Legal", email: "legal@atlas.cropxon.com", icon: FileText },
  { label: "HR", email: "hr@atlas.cropxon.com", icon: Shield },
  { label: "Technical", email: "admin@atlas.cropxon.com", icon: Shield },
];

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Footer */}
        <div className="py-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img src={cropxonLogo} alt="CropXon" className="h-12 w-auto mb-4" />
            <p className="text-lg font-heading font-bold text-accent mb-2">ATLAS Division</p>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              Consulting & Digital Transformation wing of CropXon Innovations Pvt. Ltd. 
              Building the next generation of enterprise solutions.
            </p>

            {/* Legal Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><span className="text-foreground/70">CIN:</span> U72900XX2024PTC000000</p>
              <p><span className="text-foreground/70">GSTIN:</span> 00XXXXX0000X0X0</p>
              <p><span className="text-foreground/70">Udyam:</span> UDYAM-XX-00-0000000</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-muted-foreground hover:text-accent transition-colors relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-muted-foreground hover:text-accent transition-colors relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              {contactEmails.slice(0, 4).map((contact) => (
                <li key={contact.label}>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="text-muted-foreground hover:text-accent transition-colors text-sm"
                  >
                    <span className="text-foreground/70">{contact.label}:</span>
                    <br />
                    {contact.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Address Bar */}
        <div className="py-6 border-t border-border/50">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-foreground/80 font-medium">Registered Office:</p>
              <p>CropXon Innovations Pvt. Ltd., Technology Park, Innovation District, India</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} CropXon Innovations Pvt. Ltd.</span>
            <span>•</span>
            <a href="https://atlas.cropxon.com" className="text-primary hover:text-accent transition-colors">
              atlas.cropxon.com
            </a>
          </div>

          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
