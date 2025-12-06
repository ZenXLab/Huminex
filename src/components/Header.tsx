import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import cropxonLogo from "@/assets/cropxon-logo.png";
import cropxonIcon from "@/assets/cropxon-icon.png";

const services = [
  { name: "Digital Engineering", href: "/services/digital-engineering" },
  { name: "AI & Automation", href: "/services/ai-automation" },
  { name: "Experience Design Studio", href: "/services/experience-design" },
  { name: "Cloud & DevOps", href: "/services/cloud-devops" },
  { name: "Enterprise Consulting", href: "/services/enterprise-consulting" },
  { name: "Managed IT (MSP)", href: "/services/managed-it" },
  { name: "Cybersecurity", href: "/services/cybersecurity" },
  { name: "Industry Solutions", href: "/services/industry-solutions" },
];

const industries = [
  "Retail", "FoodTech", "Healthcare", "Education", "Agriculture", 
  "Logistics", "Hospitality", "Real Estate", "Airlines", "Finance",
  "Influencers", "Marketing", "Ad Agencies"
];

const resources = [
  { name: "Blog", href: "#" },
  { name: "Documentation", href: "#" },
  { name: "Downloads", href: "#" },
];

const company = [
  { name: "About CropXon", href: "/#about" },
  { name: "Leadership", href: "#" },
  { name: "Careers", href: "#" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/50">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Enhanced Visibility */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Logo with glow effect for better visibility */}
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-1.5 bg-foreground/10 rounded-xl border border-accent/30 backdrop-blur-sm">
                <img 
                  src={cropxonIcon} 
                  alt="CropXon" 
                  className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(0,166,166,0.5)]" 
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-heading font-bold text-lg tracking-tight drop-shadow-[0_0_10px_rgba(79,242,242,0.3)]">
                CropXon
              </span>
              <span className="text-accent font-heading font-semibold text-sm -mt-1">
                ATLAS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-foreground/80 hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <a href="/#about" className="px-4 py-2 text-foreground/80 hover:text-foreground transition-colors font-medium">
              About
            </a>
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("services")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-foreground/80 hover:text-foreground transition-colors font-medium">
                Services <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "services" && (
                <div className="absolute top-full left-0 w-64 bg-card border border-border rounded-xl shadow-card p-4 animate-fade-in-up">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      to={service.href}
                      className="block px-3 py-2 text-foreground/70 hover:text-accent hover:bg-muted/50 rounded-lg transition-colors text-sm"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Industries Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("industries")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-foreground/80 hover:text-foreground transition-colors font-medium">
                Industries <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "industries" && (
                <div className="absolute top-full left-0 w-80 bg-card border border-border rounded-xl shadow-card p-4 animate-fade-in-up">
                  <div className="grid grid-cols-2 gap-1">
                    {industries.map((industry) => (
                      <a
                        key={industry}
                        href="#industries"
                        className="block px-3 py-2 text-foreground/70 hover:text-accent hover:bg-muted/50 rounded-lg transition-colors text-sm"
                      >
                        {industry}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a href="/#pricing" className="px-4 py-2 text-foreground/80 hover:text-foreground transition-colors font-medium">
              Pricing
            </a>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-foreground/80 hover:text-foreground transition-colors font-medium">
                Resources <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "resources" && (
                <div className="absolute top-full left-0 w-48 bg-card border border-border rounded-xl shadow-card p-4 animate-fade-in-up">
                  {resources.map((resource) => (
                    <a
                      key={resource.name}
                      href={resource.href}
                      className="block px-3 py-2 text-foreground/70 hover:text-accent hover:bg-muted/50 rounded-lg transition-colors text-sm"
                    >
                      {resource.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Company Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("company")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-foreground/80 hover:text-foreground transition-colors font-medium">
                Company <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "company" && (
                <div className="absolute top-full left-0 w-48 bg-card border border-border rounded-xl shadow-card p-4 animate-fade-in-up">
                  {company.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-foreground/70 hover:text-accent hover:bg-muted/50 rounded-lg transition-colors text-sm"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="hero" size="lg">
              Book a Consultation
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in-up">
            <div className="flex flex-col gap-2">
              <Link to="/" className="px-4 py-3 text-foreground hover:bg-muted/50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <a href="/#about" className="px-4 py-3 text-foreground hover:bg-muted/50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                About
              </a>
              
              {/* Mobile Services */}
              <div className="px-4 py-2 text-muted-foreground text-sm font-semibold">Services</div>
              {services.map((service) => (
                <Link 
                  key={service.name}
                  to={service.href} 
                  className="px-6 py-2 text-foreground/80 hover:bg-muted/50 rounded-lg text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {service.name}
                </Link>
              ))}
              
              <a href="/#pricing" className="px-4 py-3 text-foreground hover:bg-muted/50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </a>
              <Button variant="hero" className="mt-4">Book a Consultation</Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
