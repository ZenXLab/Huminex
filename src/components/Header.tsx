import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import cropxonLogo from "@/assets/cropxon-logo.png";

const services = [
  { name: "Digital Engineering", href: "#pillars" },
  { name: "AI & Automation", href: "#pillars" },
  { name: "Experience Design Studio", href: "#pillars" },
  { name: "Cloud & DevOps", href: "#pillars" },
  { name: "Enterprise Consulting", href: "#pillars" },
  { name: "Managed IT (MSP)", href: "#pillars" },
  { name: "Cybersecurity", href: "#pillars" },
  { name: "Industry Solutions", href: "#pillars" },
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
  { name: "About CropXon", href: "#about" },
  { name: "Leadership", href: "#" },
  { name: "Careers", href: "#" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <img src={cropxonLogo} alt="CropXon ATLAS" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <span className="text-accent font-heading font-bold text-lg">ATLAS</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <a href="/" className="px-4 py-2 text-foreground/80 hover:text-foreground transition-colors font-medium">
              Home
            </a>
            <a href="#about" className="px-4 py-2 text-foreground/80 hover:text-foreground transition-colors font-medium">
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
                    <a
                      key={service.name}
                      href={service.href}
                      className="block px-3 py-2 text-foreground/70 hover:text-accent hover:bg-muted/50 rounded-lg transition-colors text-sm"
                    >
                      {service.name}
                    </a>
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

            <a href="#pricing" className="px-4 py-2 text-foreground/80 hover:text-foreground transition-colors font-medium">
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
              <a href="/" className="px-4 py-3 text-foreground hover:bg-muted/50 rounded-lg">Home</a>
              <a href="#about" className="px-4 py-3 text-foreground hover:bg-muted/50 rounded-lg">About</a>
              <a href="#pillars" className="px-4 py-3 text-foreground hover:bg-muted/50 rounded-lg">Services</a>
              <a href="#pricing" className="px-4 py-3 text-foreground hover:bg-muted/50 rounded-lg">Pricing</a>
              <Button variant="hero" className="mt-4">Book a Consultation</Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
