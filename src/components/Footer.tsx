import { Mail, MapPin, FileText, Shield, HeadphonesIcon, ArrowUpRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import cropxonLogo from "@/assets/cropxon-logo.png";

const footerLinks = {
  services: [
    { name: "Digital Engineering", href: "/services/digital-engineering" },
    { name: "AI & Automation", href: "/services/ai-automation" },
    { name: "Experience Design", href: "/services/experience-design" },
    { name: "Cloud & DevOps", href: "/services/cloud-devops" },
    { name: "Enterprise Consulting", href: "/services/enterprise-consulting" },
    { name: "Managed IT Services", href: "/services/managed-it" },
  ],
  company: [
    { name: "About CropXon", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Industries", href: "/industries" },
    { name: "Contact", href: "/contact" },
    { name: "Get Quote", href: "/get-quote" },
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
];

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Footer */}
        <div className="py-16 lg:py-20 grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block group mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={cropxonLogo} 
                  alt="CropXon Innovations Pvt. Ltd." 
                  className="h-12 w-auto transition-transform duration-300 group-hover:scale-105 dark:brightness-110 dark:contrast-125" 
                />
              </div>
            </Link>
            <p className="text-lg font-heading font-bold text-foreground mb-1 tracking-tight">
              CropXon Innovations Pvt. Ltd.
            </p>
            <p className="text-base font-medium text-primary mb-3">ATLAS Division</p>
            <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed text-sm">
              Consulting & Digital Transformation wing of CropXon Innovations Pvt. Ltd. 
              Building the next generation of enterprise solutions.
            </p>

            {/* Legal Info */}
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p><span className="text-foreground font-medium">CIN:</span> U62010OD2025PTC051089</p>
              <p><span className="text-foreground font-medium">GSTIN:</span> 21AANCC1954F1ZW</p>
              <p><span className="text-foreground font-medium">Udyam:</span> UDYAM-OD-03-0076858</p>
              <p><span className="text-foreground font-medium">DPIIT:</span> DIPP230789 (Valid till: 15-10-2035)</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-5 text-sm tracking-tight">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-5 text-sm tracking-tight">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-5 text-sm tracking-tight">Contact</h4>
            <ul className="space-y-4">
              {contactEmails.map((contact) => {
                const Icon = contact.icon;
                return (
                  <li key={contact.label}>
                    <a 
                      href={`mailto:${contact.email}`} 
                      className="group flex items-start gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon className="h-4 w-4 mt-0.5 text-primary/60 group-hover:text-primary transition-colors" />
                      <div>
                        <span className="text-xs text-foreground/50 font-medium block">{contact.label}</span>
                        <span className="text-sm font-medium">{contact.email}</span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Address Bar */}
        <div className="py-6 border-t border-border/40">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Registered Office - Bhubaneswar */}
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-foreground/70 font-medium text-xs mb-0.5">Registered Office - Bhubaneswar</p>
                <p className="text-sm">CropXon Innovations Pvt. Ltd., Tech Hub, Infocity, Bhubaneswar, Odisha 751024, India</p>
              </div>
            </div>
            
            {/* Branch Office - Bangalore */}
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-foreground/70 font-medium text-xs mb-0.5">Branch Office - Bangalore</p>
                <p className="text-sm">CropXon Innovations Pvt. Ltd., Electronic City, Bangalore, Karnataka 560100, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-5 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-foreground font-medium">© {new Date().getFullYear()} CropXon Innovations Pvt. Ltd.</span>
            <span className="text-muted-foreground">•</span>
            <a href="https://atlas.cropxon.com" className="text-primary hover:text-primary/80 transition-colors font-semibold">
              atlas.cropxon.com
            </a>
          </div>

          <div className="flex items-center gap-5">
            {footerLinks.legal.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
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
