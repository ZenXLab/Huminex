import { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
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
  Sparkles,
  Sun,
  Moon,
  Calendar,
  Wallet,
  UserPlus,
  FolderKanban,
  Receipt,
  ShieldCheck,
  KeyRound,
  Package,
  FileSearch,
  TrendingUp,
  Megaphone,
  Zap,
  ShoppingCart,
  Utensils,
  Heart,
  GraduationCap,
  Leaf,
  Truck,
  Home,
  Plane,
  Landmark,
  Factory,
  Cpu,
  Music,
  Scale,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import cropxonIcon from "@/assets/cropxon-icon.png";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

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

const modules: MenuItem[] = [
  { name: "Workforce Management", href: "/modules/workforce-management", icon: Users, description: "Employee database & lifecycle" },
  { name: "Attendance & Leave", href: "/modules/attendance-leave", icon: Calendar, description: "Biometric & shift scheduling" },
  { name: "Payroll Engine", href: "/modules/payroll-engine", icon: Wallet, description: "100% compliant payroll" },
  { name: "Recruitment & ATS", href: "/modules/recruitment-ats", icon: UserPlus, description: "End-to-end hiring" },
  { name: "Projects & Tasks", href: "/modules/projects-tasks", icon: FolderKanban, description: "Project management" },
  { name: "Finance & Expense", href: "/modules/finance-expense", icon: Receipt, description: "Expense management" },
  { name: "Compliance & Risk", href: "/modules/compliance-risk", icon: ShieldCheck, description: "Zero compliance surprises" },
  { name: "Identity & Access", href: "/modules/identity-access", icon: KeyRound, description: "SSO & RBAC" },
  { name: "Assets & EMS", href: "/modules/assets-ems", icon: Package, description: "Asset lifecycle" },
  { name: "BGV Suite", href: "/modules/bgv-suite", icon: FileSearch, description: "Background verification" },
  { name: "Performance & OKRs", href: "/modules/performance-okrs", icon: TrendingUp, description: "Goal tracking" },
  { name: "Announcements", href: "/modules/announcements", icon: Megaphone, description: "Internal communications" },
  { name: "OpZenix Automation", href: "/modules/opzenix", icon: Zap, description: "Workflow automation" },
  { name: "Proxima AI", href: "/modules/proxima-ai", icon: Sparkles, description: "AI-powered insights" },
  { name: "Insurance & Claims", href: "/modules/insurance-claims", icon: Shield, description: "Employee insurance" },
];

const industries: MenuItem[] = [
  { name: "Retail & E-Commerce", href: "/industries/retail", icon: ShoppingCart, description: "Retail workforce" },
  { name: "FoodTech & Restaurants", href: "/industries/foodtech", icon: Utensils, description: "Kitchen to counter" },
  { name: "Healthcare & Pharma", href: "/industries/healthcare", icon: Heart, description: "Care for caregivers" },
  { name: "Education & EdTech", href: "/industries/education", icon: GraduationCap, description: "Empower educators" },
  { name: "Agriculture & AgriTech", href: "/industries/agriculture", icon: Leaf, description: "Field to market" },
  { name: "Logistics & Supply Chain", href: "/industries/logistics", icon: Truck, description: "Keep moving" },
  { name: "Hospitality & Travel", href: "/industries/hospitality", icon: Building2, description: "Guest experiences" },
  { name: "Real Estate & PropTech", href: "/industries/real-estate", icon: Home, description: "Property teams" },
  { name: "Manufacturing", href: "/industries/manufacturing", icon: Factory, description: "Production workforce" },
  { name: "Technology & IT", href: "/industries/technology", icon: Cpu, description: "Tech workforce" },
  { name: "Finance & FinTech", href: "/industries/finance", icon: Landmark, description: "Secure & compliant" },
  { name: "Media & Entertainment", href: "/industries/media", icon: Music, description: "Creative talent" },
  { name: "Professional Services", href: "/industries/professional", icon: Briefcase, description: "Consultants & firms" },
  { name: "Government & Public", href: "/industries/government", icon: Scale, description: "Public sector" },
];

const resources: MenuItem[] = [
  { name: "Blog", href: "#", icon: BookOpen, description: "Insights & Articles" },
  { name: "Documentation", href: "#", icon: FileText, description: "Guides & API Docs" },
  { name: "Downloads", href: "#", icon: Download, description: "Resources & Tools" },
];

const company: MenuItem[] = [
  { name: "About ATLAS", href: "/about", icon: Building2, description: "Our Story" },
  { name: "Leadership", href: "/about#team", icon: Users, description: "Meet the Team" },
  { name: "Careers", href: "/contact", icon: Handshake, description: "Join Us" },
  { name: "Contact", href: "/contact", icon: Mail, description: "Get in Touch" },
];

export const Header = ({ onQuoteClick }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Scroll-based header shrink effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSubMenu(null);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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

  const renderMobileSection = (title: string, items: MenuItem[], sectionKey: string, icon: LucideIcon) => {
    const Icon = icon;
    const isOpen = mobileSubMenu === sectionKey;
    
    return (
      <div className="border-b border-border/40 last:border-b-0">
        <button
          onClick={() => setMobileSubMenu(isOpen ? null : sectionKey)}
          className="w-full flex items-center justify-between px-4 py-4 text-foreground font-medium"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span>{title}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-2 pb-4 space-y-1">
            {items.map(renderMobileMenuItem)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] bg-card/95 backdrop-blur-xl border-b border-border/40 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      <nav className="container mx-auto px-4 lg:px-8" aria-label="Main navigation">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16 lg:h-18'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="CropXon ATLAS Home">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <img 
                src={cropxonIcon} 
                alt="CropXon ATLAS Logo" 
                className={`relative object-contain transition-all duration-300 group-hover:scale-105 ${isScrolled ? 'h-7 lg:h-8 w-7 lg:w-8' : 'h-9 lg:h-10 w-9 lg:w-10'}`}
                width={40}
                height={40}
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-foreground font-heading font-bold tracking-tight leading-none transition-all duration-300 ${isScrolled ? 'text-xs lg:text-sm' : 'text-sm lg:text-base'}`}>
                CropXon
              </span>
              <span className={`text-primary font-heading font-semibold leading-none mt-0.5 transition-all duration-300 ${isScrolled ? 'text-[10px]' : 'text-xs'}`}>
                ATLAS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5" role="menubar">
            {/* Features Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("features")}
              onMouseLeave={() => setActiveDropdown(null)}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={activeDropdown === "features"}
            >
              <button className="flex items-center gap-1.5 px-3 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50">
                <Sparkles className="w-4 h-4" />
                Features 
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "features" ? "rotate-180" : ""}`} />
              </button>
              <div 
                className={`absolute top-full left-0 pt-2 transition-all duration-200 ${activeDropdown === "features" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
                role="menu"
              >
                <div className="w-[600px] bg-card border border-border/60 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden">
                  <div className="p-4 bg-muted/30 border-b border-border/40">
                    <h3 className="font-heading font-semibold text-foreground">15 Powerful Modules</h3>
                    <p className="text-xs text-muted-foreground">Everything you need to run your workforce</p>
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-1 max-h-[400px] overflow-y-auto">
                    {modules.map((module, index) => renderDropdownItem(module, index))}
                  </div>
                  <div className="p-3 bg-muted/30 border-t border-border/40">
                    <Link to="/features" className="flex items-center gap-2 text-primary text-sm font-medium hover:underline">
                      View all features <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Industries Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("industries")}
              onMouseLeave={() => setActiveDropdown(null)}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={activeDropdown === "industries"}
            >
              <button className="flex items-center gap-1.5 px-3 py-2 text-foreground/70 hover:text-foreground transition-all duration-200 font-medium text-sm rounded-lg hover:bg-muted/50">
                <Globe className="w-4 h-4" />
                Industries 
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "industries" ? "rotate-180" : ""}`} />
              </button>
              <div 
                className={`absolute top-full left-0 pt-2 transition-all duration-200 ${activeDropdown === "industries" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
                role="menu"
              >
                <div className="w-[600px] bg-card border border-border/60 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden">
                  <div className="p-4 bg-muted/30 border-b border-border/40">
                    <h3 className="font-heading font-semibold text-foreground">Industry Solutions</h3>
                    <p className="text-xs text-muted-foreground">Tailored for your sector's unique needs</p>
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-1 max-h-[400px] overflow-y-auto">
                    {industries.map((industry, index) => renderDropdownItem(industry, index))}
                  </div>
                  <div className="p-3 bg-muted/30 border-t border-border/40">
                    <Link to="/industries" className="flex items-center gap-2 text-primary text-sm font-medium hover:underline">
                      View all industries <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

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
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300 group overflow-hidden"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <div className="relative w-5 h-5">
                <Sun 
                  className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-500 ${
                    theme === 'light' 
                      ? 'rotate-0 scale-100 opacity-100' 
                      : 'rotate-90 scale-0 opacity-0'
                  }`} 
                />
                <Moon 
                  className={`absolute inset-0 w-5 h-5 text-primary transition-all duration-500 ${
                    theme === 'dark' 
                      ? 'rotate-0 scale-100 opacity-100' 
                      : '-rotate-90 scale-0 opacity-0'
                  }`} 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>

            {/* Pricing Link */}
            <Link to="/pricing">
              <Button variant="ghost" size="sm" className="gap-2 font-medium text-sm h-9">
                <Wallet className="h-4 w-4" />
                Pricing
              </Button>
            </Link>

            {user ? (
              <>
                <Link to="/portal">
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
              /* Login Dropdown */
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown("login")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Button variant="ghost" size="sm" className="gap-2 font-medium text-sm h-9">
                  <User className="h-4 w-4" />
                  Login
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "login" ? "rotate-180" : ""}`} />
                </Button>
                <div 
                  className={`absolute top-full right-0 pt-2 transition-all duration-200 ${activeDropdown === "login" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
                >
                  <div className="w-72 bg-card border border-border/60 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden">
                    <div className="p-3 bg-muted/30 border-b border-border/40">
                      <h3 className="font-heading font-semibold text-foreground text-sm">Client & Enterprise Login</h3>
                      <p className="text-xs text-muted-foreground">Choose your portal access</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        to="/portal/login"
                        className="flex items-center gap-3 px-3 py-3 text-foreground/70 hover:text-foreground hover:bg-muted/60 rounded-lg transition-all duration-200"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium block">Employee Portal</span>
                          <span className="text-xs text-muted-foreground">For all employees, HR, managers & staff</span>
                        </div>
                      </Link>
                      <Link
                        to="/tenant/login"
                        className="flex items-center gap-3 px-3 py-3 text-foreground/70 hover:text-foreground hover:bg-muted/60 rounded-lg transition-all duration-200"
                      >
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium block">Owner / Super Admin</span>
                          <span className="text-xs text-muted-foreground">CEO, Director, VP or Company Owner only</span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-3 bg-muted/20 border-t border-border/40">
                      <p className="text-xs text-muted-foreground text-center">
                        New to ATLAS? <Link to="/onboarding" className="text-primary hover:underline">Start Onboarding</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Link to="/get-quote">
              <Button 
                variant="default" 
                size="sm" 
                className="font-semibold text-sm h-9 px-5 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
              >
                Get a Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:bg-muted/50 rounded-lg transition-colors relative z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute left-0 top-1 w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`absolute left-0 top-3 w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-5 w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ${
          mobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div 
          className={`absolute top-0 right-0 w-full max-w-md h-[calc(100vh-4rem)] bg-card border-l border-border shadow-2xl overflow-y-auto transition-transform duration-500 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="py-4">
            {/* Mobile Sections */}
            {renderMobileSection("Features", modules, "features", Sparkles)}
            {renderMobileSection("Industries", industries, "industries", Globe)}
            {renderMobileSection("Services", services, "services", Code)}
            {renderMobileSection("Resources", resources, "resources", BookOpen)}
            {renderMobileSection("Company", company, "company", Building2)}

            {/* Theme Toggle */}
            <div className="px-4 py-4 flex items-center justify-between border-t border-border/40">
              <span className="text-sm font-medium text-foreground/70">Theme</span>
              <button
                onClick={toggleTheme}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <Sun className={`w-4 h-4 transition-all duration-300 ${theme === 'light' ? 'text-amber-500' : 'text-muted-foreground'}`} />
                <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-primary' : 'bg-muted'} relative`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <Moon className={`w-4 h-4 transition-all duration-300 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="p-4 space-y-3 border-t border-border/40">
              {user ? (
                <>
                  <Link to="/portal" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/portal/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center gap-2">
                      <Users className="h-4 w-4" />
                      Employee Portal Login
                    </Button>
                  </Link>
                  <Link to="/tenant/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Organization Admin Login
                    </Button>
                  </Link>
                </>
              )}
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" className="w-full gap-2">
                  <Wallet className="h-4 w-4" />
                  View Pricing
                </Button>
              </Link>
              <Link to="/get-quote" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Get Custom Quote</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
