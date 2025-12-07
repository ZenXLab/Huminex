import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, Utensils, Heart, GraduationCap, Leaf, Truck, Building2, Home, Landmark, Briefcase, Factory, Cpu, Music, Scale } from "lucide-react";
import { Link } from "react-router-dom";

const industries = [
  {
    name: "Retail & E-Commerce",
    slug: "retail",
    icon: ShoppingCart,
    description: "Transform your retail operations with AI-powered workforce management, smart scheduling, and seamless payroll.",
    solutions: ["Smart Scheduling", "Multi-Location Management", "Commission Tracking", "Seasonal Hiring"],
    color: "from-cyan-500/20 to-blue-500/10",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    name: "FoodTech & Restaurants",
    slug: "foodtech",
    icon: Utensils,
    description: "Streamline kitchen-to-counter operations with tip management, shift optimization, and compliance tracking.",
    solutions: ["Tip Management", "Kitchen Scheduling", "Delivery Partner Module", "FSSAI Compliance"],
    color: "from-orange-500/20 to-amber-500/10",
    gradient: "from-orange-500 to-amber-500"
  },
  {
    name: "Healthcare & Pharma",
    slug: "healthcare",
    icon: Heart,
    description: "Modernize healthcare workforce with 24/7 scheduling, credential management, and overtime prevention.",
    solutions: ["Credential Management", "24/7 Scheduling", "Overtime Prevention", "Department Allocation"],
    color: "from-red-500/20 to-rose-500/10",
    gradient: "from-red-500 to-rose-500"
  },
  {
    name: "Education & EdTech",
    slug: "education",
    icon: GraduationCap,
    description: "Empower educators with academic scheduling, faculty management, and education-specific compliance.",
    solutions: ["Academic Scheduling", "Faculty Workload", "Contract Staff", "Education Compliance"],
    color: "from-blue-500/20 to-indigo-500/10",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    name: "Agriculture & AgriTech",
    slug: "agriculture",
    icon: Leaf,
    description: "Cultivate efficiency with GPS attendance, piece-rate payroll, and offline-first mobile access.",
    solutions: ["GPS Attendance", "Piece-Rate Payroll", "Offline Mobile", "Seasonal Workforce"],
    color: "from-green-500/20 to-emerald-500/10",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    name: "Logistics & Supply Chain",
    slug: "logistics",
    icon: Truck,
    description: "Keep your supply chain moving with driver management, route scheduling, and hours tracking.",
    solutions: ["Driver Hours", "Route Scheduling", "Warehouse Shifts", "Fleet Integration"],
    color: "from-amber-500/20 to-yellow-500/10",
    gradient: "from-amber-500 to-yellow-500"
  },
  {
    name: "Hospitality & Travel",
    slug: "hospitality",
    icon: Building2,
    description: "Elevate guest experiences with smart scheduling, multi-property management, and gratuity tracking.",
    solutions: ["Guest-Centric Scheduling", "Multi-Property", "Service Charge", "Cross-Training"],
    color: "from-purple-500/20 to-violet-500/10",
    gradient: "from-purple-500 to-violet-500"
  },
  {
    name: "Real Estate & PropTech",
    slug: "real-estate",
    icon: Home,
    description: "Build stronger teams with project staffing, commission engines, and contractor management.",
    solutions: ["Project Staffing", "Commission Engine", "Property Staff", "Contractor Portal"],
    color: "from-teal-500/20 to-cyan-500/10",
    gradient: "from-teal-500 to-cyan-500"
  },
  {
    name: "Manufacturing & Industrial",
    slug: "manufacturing",
    icon: Factory,
    description: "Power your production with shift scheduling, safety compliance, and incentive payroll.",
    solutions: ["Production Shifts", "Safety Compliance", "Piece-Rate Payroll", "Union Management"],
    color: "from-slate-500/20 to-zinc-500/10",
    gradient: "from-slate-500 to-zinc-500"
  },
  {
    name: "Technology & IT Services",
    slug: "technology",
    icon: Cpu,
    description: "Scale your tech workforce with project allocation, skill tracking, and remote work tools.",
    solutions: ["Resource Management", "Remote Work Suite", "Skill Matrix", "Contractor Portal"],
    color: "from-violet-500/20 to-purple-500/10",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    name: "Finance & FinTech",
    slug: "finance",
    icon: Landmark,
    description: "Secure and compliant workforce operations with audit-ready HR and role-based access.",
    solutions: ["Audit-Ready HR", "Role-Based Access", "Complex Comp", "Regulatory Compliance"],
    color: "from-emerald-500/20 to-green-500/10",
    gradient: "from-emerald-500 to-green-500"
  },
  {
    name: "Media & Entertainment",
    slug: "media",
    icon: Music,
    description: "Orchestrate creative talent with production scheduling, royalty tracking, and guild compliance.",
    solutions: ["Production Scheduling", "Talent Management", "Royalty Tracking", "Guild Compliance"],
    color: "from-pink-500/20 to-rose-500/10",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    name: "Professional Services",
    slug: "professional",
    icon: Briefcase,
    description: "Elevate your firm with billable hour tracking, utilization dashboards, and partner compensation.",
    solutions: ["Billable Hours", "Utilization", "Partner Comp", "Certification Tracker"],
    color: "from-indigo-500/20 to-blue-500/10",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    name: "Government & Public Sector",
    slug: "government",
    icon: Scale,
    description: "Modernize public sector workforce with pay commission compliance and pension management.",
    solutions: ["Pay Commission", "Transfer Management", "Pension Calculator", "Government Leave"],
    color: "from-sky-500/20 to-blue-500/10",
    gradient: "from-sky-500 to-blue-500"
  }
];

const Industries = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <NetworkBackground />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Building2 className="w-4 h-4" />
              14+ Industry Solutions
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              Industry-Specific <span className="text-gradient">Workforce Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "200ms" }}>
              Every industry has unique challenges. ATLAS is tailored to meet the specific workforce needs of your sector.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <Link
                key={industry.slug}
                to={`/industries/${industry.slug}`}
                className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
                
                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${industry.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <industry.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                    {industry.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                    {industry.description}
                  </p>

                  {/* Solutions Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {industry.solutions.slice(0, 3).map((solution) => (
                      <span
                        key={solution}
                        className="px-3 py-1 text-xs bg-muted rounded-full text-muted-foreground"
                      >
                        {solution}
                      </span>
                    ))}
                    {industry.solutions.length > 3 && (
                      <span className="px-3 py-1 text-xs bg-primary/10 rounded-full text-primary">
                        +{industry.solutions.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                    Learn More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Don't See Your Industry?
            </h2>
            <p className="text-muted-foreground mb-8">
              We work across diverse sectors. Let's discuss how ATLAS can be customized for your unique industry challenges.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="shadow-lg shadow-primary/20">
                  Contact Us
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/get-quote">
                <Button variant="outline" size="lg">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Industries;
