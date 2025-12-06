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
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border/40 transition-all duration-300">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <img 
                src={cropxonIcon} 
                alt="CropXon" 
                className="relative h-10 lg:h-11 w-10 lg:w-11 object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-heading font-bold text-base lg:text-lg tracking-tight leading-none">
                CropXon
              </span>
              <span className="text-primary font-heading font-semibold text-xs lg:text-sm leading-none mt-0.5">
                ATLAS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            <Link 
              to="/" 
              className="px-4 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50"
            >
              Home
            </Link>
            <a 
              href="/#about" 
              className="px-4 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50"
            >
              About
            </a>
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("services")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50">
                Services 
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "services" ? "rotate-180" : ""}`} />
              </button>
              <div className={`absolute top-full left-0 pt-2 transition-all duration-200 ${activeDropdown === "services" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                <div className="w-64 bg-card border border-border/60 rounded-xl shadow-lg p-2 backdrop-blur-xl">
                  {services.map((service, index) => (
                    <Link
                      key={service.name}
                      to={service.href}
                      className="flex items-center px-3 py-2.5 text-foreground/70 hover:text-foreground hover:bg-muted/60 rounded-lg transition-all duration-200 text-sm font-medium group"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-3 group-hover:bg-primary transition-colors" />
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link 
              to="/industries" 
              className="px-4 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50"
            >
              Industries
            </Link>

            <a 
              href="/#pricing" 
              className="px-4 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50"
            >
              Pricing
            </a>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50">
                Resources 
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "resources" ? "rotate-180" : ""}`} />
              </button>
              <div className={`absolute top-full left-0 pt-2 transition-all duration-200 ${activeDropdown === "resources" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                <div className="w-52 bg-card border border-border/60 rounded-xl shadow-lg p-2 backdrop-blur-xl">
                  {resources.map((resource) => (
                    <a
                      key={resource.name}
                      href={resource.href}
                      className="flex items-center px-3 py-2.5 text-foreground/70 hover:text-foreground hover:bg-muted/60 rounded-lg transition-all duration-200 text-sm font-medium group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-3 group-hover:bg-primary transition-colors" />
                      {resource.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("company")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50">
                Company 
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "company" ? "rotate-180" : ""}`} />
              </button>
              <div className={`absolute top-full right-0 pt-2 transition-all duration-200 ${activeDropdown === "company" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                <div className="w-52 bg-card border border-border/60 rounded-xl shadow-lg p-2 backdrop-blur-xl">
                  {company.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-3 py-2.5 text-foreground/70 hover:text-foreground hover:bg-muted/60 rounded-lg transition-all duration-200 text-sm font-medium group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-3 group-hover:bg-primary transition-colors" />
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2 font-medium text-sm h-9">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut} className="font-medium text-sm h-9">
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2 font-medium text-sm h-9">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
            <Button 
              variant="default" 
              size="sm" 
              onClick={onQuoteClick}
              className="font-semibold text-sm h-9 px-5 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
            >
              Get a Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="py-4 border-t border-border/40">
            <div className="flex flex-col gap-1">
              <Link 
                to="/" 
                className="px-4 py-3 text-foreground font-medium hover:bg-muted/50 rounded-xl transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <a 
                href="/#about" 
                className="px-4 py-3 text-foreground font-medium hover:bg-muted/50 rounded-xl transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              
              {/* Mobile Services */}
              <div className="px-4 py-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">Services</div>
              {services.map((service) => (
                <Link 
                  key={service.name}
                  to={service.href} 
                  className="px-6 py-2.5 text-foreground/80 hover:bg-muted/50 rounded-xl transition-colors text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {service.name}
                </Link>
              ))}
              
              <Link 
                to="/industries" 
                className="px-4 py-3 text-foreground font-medium hover:bg-muted/50 rounded-xl transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Industries
              </Link>
              
              <a 
                href="/#pricing" 
                className="px-4 py-3 text-foreground font-medium hover:bg-muted/50 rounded-xl transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>

              <div className="pt-4 px-4 space-y-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full gap-2 font-medium">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full font-medium" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full font-medium">Sign In</Button>
                  </Link>
                )}
                <Button 
                  variant="default" 
                  className="w-full font-semibold" 
                  onClick={() => { onQuoteClick?.(); setMobileMenuOpen(false); }}
                >
                  Get a Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
