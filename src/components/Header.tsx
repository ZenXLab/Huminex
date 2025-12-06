import { useState } from "react";
import { Menu, X, ChevronDown, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import cropxonIcon from "@/assets/cropxon-icon.png";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onQuoteClick?: () => void;
}

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

export const Header = ({ onQuoteClick }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/50">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src={cropxonIcon} 
                alt="CropXon" 
                className="relative h-12 w-12 object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-heading font-bold text-lg tracking-tight">
                CropXon
              </span>
              <span className="text-primary font-heading font-semibold text-sm -mt-1">
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

            <Link to="/industries" className="px-4 py-2 text-foreground/80 hover:text-foreground transition-colors font-medium">
              Industries
            </Link>

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

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
            <Button variant="hero" size="lg" onClick={onQuoteClick}>
              Get a Quote
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
              
              <Link to="/industries" className="px-4 py-3 text-foreground hover:bg-muted/50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Industries
              </Link>
              
              <a href="/#pricing" className="px-4 py-3 text-foreground hover:bg-muted/50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </a>

              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="mt-4 w-full gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" className="mt-2" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="mt-4 w-full">Sign In</Button>
                </Link>
              )}
              <Button variant="hero" className="mt-2" onClick={() => { onQuoteClick?.(); setMobileMenuOpen(false); }}>
                Get a Quote
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};