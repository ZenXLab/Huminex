import { useState } from "react";
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LayoutDashboard,
  Code,
  Brain,
  Palette,
  Cloud,
  Briefcase,
  Shield,
  Lock,
  LayoutGrid,
  Globe,
  BookOpen,
  FileText,
  Download,
  Building2,
  Users,
  Handshake,
  Mail,
  DollarSign,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import cropxonIcon from "@/assets/cropxon-icon.png";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onQuoteClick?: () => void;
}

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

const services: MenuItem[] = [
  { name: "Digital Engineering", href: "/services/digital-engineering", icon: Code, description: "Web, Mobile & SaaS" },
  { name: "AI & Automation", href: "/services/ai-automation", icon: Brain, description: "Intelligent Solutions" },
  { name: "Experience Design", href: "/services/experience-design", icon: Palette, description: "UX/UI & Branding" },
  { name: "Cloud & DevOps", href: "/services/cloud-devops", icon: Cloud, description: "Infrastructure & CI/CD" },
  { name: "Enterprise Consulting", href: "/services/enterprise-consulting", icon: Briefcase, description: "Strategy & CTO" },
  { name: "Managed IT (MSP)", href: "/services/managed-it", icon: Shield, description: "24/7 Support" },
  { name: "Cybersecurity", href: "/services/cybersecurity", icon: Lock, description: "VAPT & Compliance" },
  { name: "Industry Solutions", href: "/services/industry-solutions", icon: LayoutGrid, description: "Vertical Expertise" },
];

const resources: MenuItem[] = [
  { name: "Blog", href: "#", icon: BookOpen, description: "Insights & Articles" },
  { name: "Documentation", href: "#", icon: FileText, description: "Guides & API Docs" },
  { name: "Downloads", href: "#", icon: Download, description: "Resources & Tools" },
];

const company: MenuItem[] = [
  { name: "About ATLAS", href: "/#about", icon: Building2, description: "Our Story" },
  { name: "Leadership", href: "#", icon: Users, description: "Meet the Team" },
  { name: "Careers", href: "#", icon: Handshake, description: "Join Us" },
  { name: "Contact", href: "#", icon: Mail, description: "Get in Touch" },
];

export const Header = ({ onQuoteClick }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  const renderDropdownItem = (item: MenuItem, index: number) => {
    const Icon = item.icon;
    const isLink = item.href.startsWith('/');
    const Component = isLink ? Link : 'a';
    
    return (
      <Component
        key={item.name}
        to={isLink ? item.href : undefined}
        href={!isLink ? item.href : undefined}
        className="flex items-center gap-3 px-3 py-2.5 text-foreground/70 hover:text-foreground hover:bg-muted/60 rounded-lg transition-all duration-200 group"
        style={{ animationDelay: `${index * 30}ms` }}
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{item.name}</span>
          {item.description && (
            <span className="text-xs text-muted-foreground">{item.description}</span>
          )}
        </div>
      </Component>
    );
  };

  const renderMobileMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isLink = item.href.startsWith('/');
    const Component = isLink ? Link : 'a';
    
    return (
      <Component
        key={item.name}
        to={isLink ? item.href : undefined}
        href={!isLink ? item.href : undefined}
        className="flex items-center gap-3 px-4 py-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{item.name}</span>
          {item.description && (
            <span className="text-xs text-muted-foreground">{item.description}</span>
          )}
        </div>
      </Component>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border/40 transition-all duration-300">
      <nav className="container mx-auto px-4 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="CropXon ATLAS Home">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <img 
                src={cropxonIcon} 
                alt="CropXon ATLAS Logo" 
                className="relative h-9 lg:h-10 w-9 lg:w-10 object-contain transition-transform duration-300 group-hover:scale-105" 
                width={40}
                height={40}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-heading font-bold text-sm lg:text-base tracking-tight leading-none">
                CropXon
              </span>
              <span className="text-primary font-heading font-semibold text-xs leading-none mt-0.5">
                ATLAS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5" role="menubar">
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("services")}
              onMouseLeave={() => setActiveDropdown(null)}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={activeDropdown === "services"}
            >
              <button className="flex items-center gap-1.5 px-3 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50">
                <Code className="w-4 h-4" />
                Services 
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "services" ? "rotate-180" : ""}`} />
              </button>
              <div 
                className={`absolute top-full left-0 pt-2 transition-all duration-200 ${activeDropdown === "services" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
                role="menu"
              >
                <div className="w-72 bg-card border border-border/60 rounded-xl shadow-lg p-2 backdrop-blur-xl">
                  {services.map((service, index) => renderDropdownItem(service, index))}
                </div>
              </div>
            </div>

            <Link 
              to="/industries" 
              className="flex items-center gap-1.5 px-3 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50"
              role="menuitem"
            >
              <Globe className="w-4 h-4" />
              Industries
            </Link>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={activeDropdown === "resources"}
            >
              <button className="flex items-center gap-1.5 px-3 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50">
                <BookOpen className="w-4 h-4" />
                Resources 
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "resources" ? "rotate-180" : ""}`} />
              </button>
              <div 
                className={`absolute top-full left-0 pt-2 transition-all duration-200 ${activeDropdown === "resources" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
                role="menu"
              >
                <div className="w-64 bg-card border border-border/60 rounded-xl shadow-lg p-2 backdrop-blur-xl">
                  {resources.map((resource, index) => renderDropdownItem(resource, index))}
                </div>
              </div>
            </div>

            <a 
              href="/#pricing" 
              className="flex items-center gap-1.5 px-3 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50"
              role="menuitem"
            >
              <DollarSign className="w-4 h-4" />
              Pricing
            </a>

            {/* Company Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("company")}
              onMouseLeave={() => setActiveDropdown(null)}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={activeDropdown === "company"}
            >
              <button className="flex items-center gap-1.5 px-3 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50">
                <Building2 className="w-4 h-4" />
                Company 
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "company" ? "rotate-180" : ""}`} />
              </button>
              <div 
                className={`absolute top-full right-0 pt-2 transition-all duration-200 ${activeDropdown === "company" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
                role="menu"
              >
                <div className="w-64 bg-card border border-border/60 rounded-xl shadow-lg p-2 backdrop-blur-xl">
                  {company.map((item, index) => renderDropdownItem(item, index))}
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
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
          role="menu"
          aria-hidden={!mobileMenuOpen}
        >
          <div className="py-4 border-t border-border/40">
            <div className="flex flex-col gap-1">
              {/* Mobile Services */}
              <div className="px-4 py-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                <Code className="w-3.5 h-3.5" />
                Services
              </div>
              {services.map(renderMobileMenuItem)}
              
              <Link 
                to="/industries" 
                className="flex items-center gap-3 px-4 py-3 text-foreground font-medium hover:bg-muted/50 rounded-xl transition-colors mt-2" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <span>Industries</span>
              </Link>

              {/* Mobile Resources */}
              <div className="px-4 py-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mt-2">
                <BookOpen className="w-3.5 h-3.5" />
                Resources
              </div>
              {resources.map(renderMobileMenuItem)}
              
              <a 
                href="/#pricing" 
                className="flex items-center gap-3 px-4 py-3 text-foreground font-medium hover:bg-muted/50 rounded-xl transition-colors mt-2" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <span>Pricing</span>
              </a>

              {/* Mobile Company */}
              <div className="px-4 py-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mt-2">
                <Building2 className="w-3.5 h-3.5" />
                Company
              </div>
              {company.map(renderMobileMenuItem)}

              <div className="pt-4 px-4 space-y-2 border-t border-border/40 mt-4">
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
                    <Button variant="outline" className="w-full font-medium gap-2">
                      <User className="h-4 w-4" />
                      Sign In
                    </Button>
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
