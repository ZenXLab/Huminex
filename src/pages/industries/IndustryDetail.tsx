import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ArrowLeft,
  Check, 
  Zap, 
  TrendingUp, 
  Users, 
  ShieldCheck,
  ShoppingCart, 
  Utensils, 
  Heart, 
  GraduationCap, 
  Leaf, 
  Truck, 
  Building2, 
  Home, 
  Plane, 
  Landmark, 
  Megaphone, 
  Briefcase,
  Factory,
  Cpu,
  Music,
  Scale,
  Building,
  type LucideIcon
} from "lucide-react";

interface IndustryData {
  slug: string;
  name: string;
  icon: LucideIcon;
  tagline: string;
  heroDescription: string;
  challenges: string[];
  solutions: { title: string; description: string }[];
  modules: string[];
  stats: { value: string; label: string }[];
  testimonial: { quote: string; author: string; role: string; company: string };
  color: string;
  gradient: string;
}

const industriesData: Record<string, IndustryData> = {
  "retail": {
    slug: "retail",
    name: "Retail & E-Commerce",
    icon: ShoppingCart,
    tagline: "Transform retail operations with unified workforce management",
    heroDescription: "From frontline store staff to warehouse teams, manage your entire retail workforce with intelligent scheduling, real-time attendance, and seamless payroll.",
    challenges: [
      "High employee turnover and seasonal hiring spikes",
      "Complex shift scheduling across multiple locations",
      "Compliance with varying labor laws by region",
      "Managing part-time, full-time, and gig workers",
      "Tracking attendance across distributed stores"
    ],
    solutions: [
      { title: "Smart Shift Scheduling", description: "AI-powered scheduling that balances employee preferences, skills, and store demand" },
      { title: "Multi-Location Management", description: "Unified view of workforce across all stores with location-specific policies" },
      { title: "Seasonal Hiring Module", description: "Rapid onboarding and offboarding for peak seasons" },
      { title: "Commission & Incentive Tracking", description: "Automated sales-based incentive calculations in payroll" }
    ],
    modules: ["Workforce Management", "Attendance & Leave", "Payroll Engine", "Recruitment & ATS", "Compliance & Risk"],
    stats: [
      { value: "40%", label: "Reduction in scheduling time" },
      { value: "25%", label: "Lower employee turnover" },
      { value: "99.9%", label: "Payroll accuracy" },
      { value: "60%", label: "Faster onboarding" }
    ],
    testimonial: {
      quote: "ATLAS transformed how we manage 2,000+ store employees across 150 locations. Scheduling that used to take days now happens in hours.",
      author: "Priya Sharma",
      role: "Head of HR",
      company: "RetailMax India"
    },
    color: "text-cyan-500",
    gradient: "from-cyan-500 to-blue-500"
  },
  "foodtech": {
    slug: "foodtech",
    name: "FoodTech & Restaurants",
    icon: Utensils,
    tagline: "Streamline kitchen-to-counter workforce operations",
    heroDescription: "Manage diverse teams from kitchen staff to delivery partners with flexible scheduling, tip management, and compliance-ready payroll.",
    challenges: [
      "Managing diverse workforce: kitchen, service, delivery",
      "Complex tip pooling and distribution",
      "High turnover in food service industry",
      "Compliance with FSSAI and labor regulations",
      "Tracking attendance across multiple outlets"
    ],
    solutions: [
      { title: "Tip Management System", description: "Automated tip pooling, distribution, and payroll integration" },
      { title: "Kitchen Shift Optimization", description: "Demand-based scheduling for peak hours and seasons" },
      { title: "Delivery Partner Module", description: "Gig worker management with per-delivery tracking" },
      { title: "FSSAI Compliance Tracker", description: "Automated food handler certification and renewal tracking" }
    ],
    modules: ["Workforce Management", "Attendance & Leave", "Payroll Engine", "Compliance & Risk", "Projects & Tasks"],
    stats: [
      { value: "35%", label: "Reduction in overtime costs" },
      { value: "50%", label: "Faster shift filling" },
      { value: "100%", label: "Compliance adherence" },
      { value: "45%", label: "Lower turnover rate" }
    ],
    testimonial: {
      quote: "Managing 500+ delivery partners and restaurant staff used to be chaos. ATLAS brought order and visibility we never had before.",
      author: "Rahul Mehta",
      role: "Operations Director",
      company: "CloudKitchen Co."
    },
    color: "text-orange-500",
    gradient: "from-orange-500 to-amber-500"
  },
  "healthcare": {
    slug: "healthcare",
    name: "Healthcare & Pharma",
    icon: Heart,
    tagline: "Care for your caregivers with intelligent workforce management",
    heroDescription: "From doctors to nurses to admin staff, manage complex healthcare workforce with 24/7 shift scheduling, credential tracking, and compliant payroll.",
    challenges: [
      "24/7 shift coverage requirements",
      "Complex credential and license management",
      "Strict regulatory compliance (HIPAA, clinical standards)",
      "Overtime management in critical care",
      "Cross-departmental staffing needs"
    ],
    solutions: [
      { title: "Credential Management", description: "Automated license tracking, renewal alerts, and verification" },
      { title: "24/7 Shift Scheduling", description: "Intelligent scheduling for round-the-clock care coverage" },
      { title: "Overtime Prevention", description: "Real-time alerts when employees approach overtime thresholds" },
      { title: "Department Allocation", description: "Flexible cross-training and department assignment tracking" }
    ],
    modules: ["Workforce Management", "Attendance & Leave", "Payroll Engine", "Compliance & Risk", "BGV Suite", "Identity & Access"],
    stats: [
      { value: "99.5%", label: "Shift coverage rate" },
      { value: "30%", label: "Reduction in overtime costs" },
      { value: "Zero", label: "Credential lapses" },
      { value: "2x", label: "Faster credential verification" }
    ],
    testimonial: {
      quote: "In healthcare, a missed credential can cost lives and licenses. ATLAS ensures we never miss a renewal or certification.",
      author: "Dr. Anita Kapoor",
      role: "Chief Medical Officer",
      company: "CareFirst Hospitals"
    },
    color: "text-red-500",
    gradient: "from-red-500 to-rose-500"
  },
  "education": {
    slug: "education",
    name: "Education & EdTech",
    icon: GraduationCap,
    tagline: "Empower educators with streamlined workforce operations",
    heroDescription: "Manage faculty, administrative staff, and contractors with academic-year scheduling, leave management, and education-specific compliance.",
    challenges: [
      "Academic calendar-based workforce planning",
      "Managing full-time faculty and visiting lecturers",
      "Complex leave policies (sabbaticals, study leave)",
      "Multi-campus staff coordination",
      "Compliance with education regulations"
    ],
    solutions: [
      { title: "Academic Scheduling", description: "Semester-based scheduling aligned with academic calendars" },
      { title: "Faculty Workload Management", description: "Credit hour tracking and balanced class assignments" },
      { title: "Contract Staff Module", description: "Visiting faculty and adjunct professor management" },
      { title: "Education Compliance", description: "AICTE, UGC compliance tracking and reporting" }
    ],
    modules: ["Workforce Management", "Attendance & Leave", "Payroll Engine", "Recruitment & ATS", "Projects & Tasks", "Compliance & Risk"],
    stats: [
      { value: "50%", label: "Faster timetable generation" },
      { value: "40%", label: "Reduction in admin workload" },
      { value: "100%", label: "Regulatory compliance" },
      { value: "35%", label: "Improved faculty satisfaction" }
    ],
    testimonial: {
      quote: "ATLAS understands education. From sabbaticals to study leaves to visiting faculty pay, everything just works.",
      author: "Prof. Suresh Kumar",
      role: "Dean of Administration",
      company: "National Institute of Technology"
    },
    color: "text-blue-500",
    gradient: "from-blue-500 to-indigo-500"
  },
  "agriculture": {
    slug: "agriculture",
    name: "Agriculture & AgriTech",
    icon: Leaf,
    tagline: "Cultivate efficient workforce operations from field to market",
    heroDescription: "Manage seasonal workers, field staff, and supply chain teams with GPS-enabled attendance, piece-rate payroll, and rural-friendly mobile access.",
    challenges: [
      "Seasonal workforce with varying demand",
      "Field workers without traditional attendance systems",
      "Piece-rate and harvest-based compensation",
      "Multi-location farm operations",
      "Limited connectivity in rural areas"
    ],
    solutions: [
      { title: "GPS Field Attendance", description: "Location-verified check-ins from remote farm locations" },
      { title: "Piece-Rate Payroll", description: "Harvest-based, per-unit, and daily wage calculations" },
      { title: "Offline-First Mobile", description: "Attendance and data sync even without connectivity" },
      { title: "Seasonal Workforce", description: "Rapid onboarding and offboarding for harvest seasons" }
    ],
    modules: ["Workforce Management", "Attendance & Leave", "Payroll Engine", "Assets & EMS", "Projects & Tasks"],
    stats: [
      { value: "60%", label: "Reduction in payroll errors" },
      { value: "45%", label: "Faster seasonal hiring" },
      { value: "100%", label: "Field attendance accuracy" },
      { value: "3x", label: "Faster wage disbursement" }
    ],
    testimonial: {
      quote: "We manage 5,000 seasonal workers across 50 farms. ATLAS offline mode and GPS attendance changed everything.",
      author: "Ramesh Agrawal",
      role: "Director of Operations",
      company: "AgriVentures India"
    },
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500"
  },
  "logistics": {
    slug: "logistics",
    name: "Logistics & Supply Chain",
    icon: Truck,
    tagline: "Keep your supply chain workforce moving seamlessly",
    heroDescription: "Manage drivers, warehouse staff, and operations teams with route-based scheduling, GPS tracking, and transport-specific compliance.",
    challenges: [
      "Managing dispersed driver and delivery workforce",
      "Complex shift patterns across warehouses",
      "Vehicle and route-based attendance tracking",
      "Driver fatigue and hours-of-service compliance",
      "Peak season capacity planning"
    ],
    solutions: [
      { title: "Driver Hours Management", description: "Fatigue tracking and hours-of-service compliance" },
      { title: "Route-Based Scheduling", description: "Shift planning aligned with delivery routes" },
      { title: "Warehouse Shift Optimization", description: "Demand-based staffing for fulfillment centers" },
      { title: "Fleet Staff Integration", description: "Vehicle assignment linked to driver profiles" }
    ],
    modules: ["Workforce Management", "Attendance & Leave", "Payroll Engine", "Assets & EMS", "Compliance & Risk", "Projects & Tasks"],
    stats: [
      { value: "30%", label: "Improvement in on-time delivery" },
      { value: "25%", label: "Reduction in overtime" },
      { value: "100%", label: "Hours-of-service compliance" },
      { value: "40%", label: "Lower fleet downtime" }
    ],
    testimonial: {
      quote: "ATLAS knows logistics. Driver fatigue alerts and hours tracking have made our fleet safer and more efficient.",
      author: "Vikram Singh",
      role: "VP of Fleet Operations",
      company: "LogiPrime Express"
    },
    color: "text-amber-500",
    gradient: "from-amber-500 to-yellow-500"
  },
  "hospitality": {
    slug: "hospitality",
    name: "Hospitality & Travel",
    icon: Building2,
    tagline: "Elevate guest experiences with exceptional workforce management",
    heroDescription: "From front desk to housekeeping to F&B, orchestrate your hospitality workforce for 24/7 guest satisfaction.",
    challenges: [
      "24/7 operations with complex shift patterns",
      "High employee turnover in hospitality",
      "Multi-department coordination",
      "Seasonal demand fluctuations",
      "Tip and gratuity management"
    ],
    solutions: [
      { title: "Guest-Centric Scheduling", description: "Staff scheduling aligned with occupancy forecasts" },
      { title: "Multi-Property Management", description: "Unified workforce view across hotel chains" },
      { title: "Service Charge Distribution", description: "Automated gratuity pooling and distribution" },
      { title: "Cross-Training Tracker", description: "Multi-department skill management for flexible staffing" }
    ],
    modules: ["Workforce Management", "Attendance & Leave", "Payroll Engine", "Recruitment & ATS", "Performance & OKRs", "Projects & Tasks"],
    stats: [
      { value: "40%", label: "Reduction in scheduling conflicts" },
      { value: "35%", label: "Lower turnover rate" },
      { value: "99%", label: "Shift coverage" },
      { value: "50%", label: "Faster hiring" }
    ],
    testimonial: {
      quote: "Managing 15 properties with seasonal staff used to be a nightmare. ATLAS gave us control we never imagined possible.",
      author: "Neha Rajput",
      role: "Group HR Director",
      company: "Heritage Hotels Group"
    },
    color: "text-purple-500",
    gradient: "from-purple-500 to-violet-500"
  },
  "real-estate": {
    slug: "real-estate",
    name: "Real Estate & PropTech",
    icon: Home,
    tagline: "Build stronger teams for every property",
    heroDescription: "Manage property managers, maintenance staff, and sales teams with project-based tracking and property-specific workforce allocation.",
    challenges: [
      "Project-based workforce across multiple sites",
      "Managing property management staff",
      "Sales team commission calculations",
      "Contractor and vendor workforce",
      "Multi-project resource allocation"
    ],
    solutions: [
      { title: "Project-Based Staffing", description: "Allocate and track staff across construction and sales projects" },
      { title: "Commission Engine", description: "Automated sales commission calculations and payouts" },
      { title: "Property Staff Management", description: "Security, maintenance, and housekeeping team management" },
      { title: "Contractor Integration", description: "Third-party workforce tracking and payment management" }
    ],
    modules: ["Workforce Management", "Attendance & Leave", "Payroll Engine", "Projects & Tasks", "Finance & Expense", "Assets & EMS"],
    stats: [
      { value: "45%", label: "Faster commission processing" },
      { value: "30%", label: "Improvement in project staffing" },
      { value: "60%", label: "Reduction in admin overhead" },
      { value: "100%", label: "Commission accuracy" }
    ],
    testimonial: {
      quote: "From construction sites to property management, ATLAS handles our entire workforce ecosystem seamlessly.",
      author: "Arun Kapoor",
      role: "Chief People Officer",
      company: "BuildRight Developers"
    },
    color: "text-teal-500",
    gradient: "from-teal-500 to-cyan-500"
  },
  "manufacturing": {
    slug: "manufacturing",
    name: "Manufacturing & Industrial",
    icon: Factory,
    tagline: "Power your production with optimized workforce operations",
    heroDescription: "Manage factory floor workers, supervisors, and support staff with shift scheduling, safety compliance, and production-linked incentives.",
    challenges: [
      "Complex multi-shift factory operations",
      "Safety training and compliance tracking",
      "Production-linked wage calculations",
      "High workforce volume management",
      "Union and labor law compliance"
    ],
    solutions: [
      { title: "Production Shift Scheduling", description: "24/7 factory scheduling with skill-based allocation" },
      { title: "Safety Compliance Suite", description: "Training tracking, incident reporting, and certification management" },
      { title: "Piece-Rate & Incentive Payroll", description: "Production-linked bonus and incentive calculations" },
      { title: "Union Management", description: "Labor law compliance and union agreement tracking" }
    ],
    modules: ["Workforce Management", "Attendance & Leave", "Payroll Engine", "Compliance & Risk", "Assets & EMS", "BGV Suite"],
    stats: [
      { value: "50%", label: "Reduction in compliance issues" },
      { value: "35%", label: "Improvement in production efficiency" },
      { value: "Zero", label: "Safety certification lapses" },
      { value: "40%", label: "Faster shift planning" }
    ],
    testimonial: {
      quote: "Managing 3 plants with 10,000 workers in 3 shifts was chaos. ATLAS brought structure and visibility.",
      author: "Rajesh Patel",
      role: "Plant HR Head",
      company: "AutoParts Manufacturing Ltd."
    },
    color: "text-slate-500",
    gradient: "from-slate-500 to-zinc-500"
  },
  "technology": {
    slug: "technology",
    name: "Technology & IT Services",
    icon: Cpu,
    tagline: "Scale your tech workforce with intelligent management",
    heroDescription: "Manage developers, consultants, and support teams with project-based allocation, skill tracking, and knowledge-worker-friendly policies.",
    challenges: [
      "Project-based resource allocation",
      "Remote and hybrid workforce management",
      "Skill gap identification and tracking",
      "Contractor and consultant management",
      "Complex leave and WFH policies"
    ],
    solutions: [
      { title: "Project Resource Management", description: "Skill-based project allocation and utilization tracking" },
      { title: "Remote Work Suite", description: "Hybrid attendance, work-from-anywhere policies, and productivity tools" },
      { title: "Skill Matrix", description: "Employee skill inventory and gap analysis for project matching" },
      { title: "Contractor Portal", description: "Seamless onboarding and management of contract workers" }
    ],
    modules: ["Workforce Management", "Attendance & Leave", "Payroll Engine", "Projects & Tasks", "Recruitment & ATS", "Performance & OKRs"],
    stats: [
      { value: "60%", label: "Improvement in resource utilization" },
      { value: "45%", label: "Faster project staffing" },
      { value: "30%", label: "Reduction in bench time" },
      { value: "2x", label: "Faster onboarding" }
    ],
    testimonial: {
      quote: "ATLAS understands tech companies. Project allocation, skill tracking, and remote work management just work.",
      author: "Amit Sharma",
      role: "VP of Engineering",
      company: "TechServe Solutions"
    },
    color: "text-violet-500",
    gradient: "from-violet-500 to-purple-500"
  },
  "finance": {
    slug: "finance",
    name: "Finance & FinTech",
    icon: Landmark,
    tagline: "Secure, compliant, and efficient workforce operations",
    heroDescription: "Manage financial services workforce with strict access controls, regulatory compliance, and audit-ready record keeping.",
    challenges: [
      "Strict regulatory and audit requirements",
      "Sensitive data access controls",
      "Complex compensation structures",
      "High compliance burden",
      "Background verification requirements"
    ],
    solutions: [
      { title: "Audit-Ready HR", description: "Complete audit trails and compliance documentation" },
      { title: "Role-Based Access", description: "Granular permissions for sensitive HR and payroll data" },
      { title: "Complex Comp Structures", description: "Bonus, deferred compensation, and ESOP management" },
      { title: "Regulatory Compliance", description: "RBI, SEBI, and industry-specific compliance tracking" }
    ],
    modules: ["Workforce Management", "Payroll Engine", "Compliance & Risk", "Identity & Access", "BGV Suite", "Finance & Expense"],
    stats: [
      { value: "100%", label: "Audit compliance" },
      { value: "50%", label: "Reduction in compliance prep time" },
      { value: "Zero", label: "Access violations" },
      { value: "99.9%", label: "Payroll accuracy" }
    ],
    testimonial: {
      quote: "In financial services, compliance isn't optional. ATLAS keeps us audit-ready 365 days a year.",
      author: "Deepika Nair",
      role: "Chief Compliance Officer",
      company: "FinServe Capital"
    },
    color: "text-emerald-500",
    gradient: "from-emerald-500 to-green-500"
  },
  "media": {
    slug: "media",
    name: "Media & Entertainment",
    icon: Music,
    tagline: "Orchestrate creative workforce with precision",
    heroDescription: "Manage creative talent, production crews, and support staff with project-based scheduling, royalty tracking, and entertainment-specific workflows.",
    challenges: [
      "Project-based creative workforce",
      "Complex royalty and residual payments",
      "Managing freelancers and contractors",
      "Production schedule-driven staffing",
      "Union and guild compliance"
    ],
    solutions: [
      { title: "Production Scheduling", description: "Project-based crew scheduling and call sheets" },
      { title: "Talent Management", description: "Creative talent profiles, availability, and booking" },
      { title: "Royalty & Residuals", description: "Automated royalty calculations and payments" },
      { title: "Guild Compliance", description: "Union rates, overtime, and turnaround compliance" }
    ],
    modules: ["Workforce Management", "Payroll Engine", "Projects & Tasks", "Recruitment & ATS", "Compliance & Risk", "Finance & Expense"],
    stats: [
      { value: "40%", label: "Faster production scheduling" },
      { value: "100%", label: "Guild compliance" },
      { value: "60%", label: "Reduction in payroll errors" },
      { value: "3x", label: "Faster crew mobilization" }
    ],
    testimonial: {
      quote: "Managing film productions with 500+ crew members is complex. ATLAS handles guild compliance and call sheets effortlessly.",
      author: "Karan Malhotra",
      role: "Line Producer",
      company: "Spotlight Productions"
    },
    color: "text-pink-500",
    gradient: "from-pink-500 to-rose-500"
  },
  "professional": {
    slug: "professional",
    name: "Professional Services",
    icon: Briefcase,
    tagline: "Elevate your professional services workforce",
    heroDescription: "Manage consultants, lawyers, accountants, and professional staff with billable hour tracking, utilization management, and partner compensation.",
    challenges: [
      "Billable hour tracking and utilization",
      "Complex partner compensation models",
      "Project-based resource allocation",
      "Professional certification tracking",
      "Client-facing staff management"
    ],
    solutions: [
      { title: "Billable Hour Management", description: "Automated time tracking with client and project allocation" },
      { title: "Utilization Dashboards", description: "Real-time visibility into staff utilization and billing rates" },
      { title: "Partner Compensation", description: "Complex profit-sharing and partner draw calculations" },
      { title: "Certification Tracker", description: "CPE, bar admissions, and professional license management" }
    ],
    modules: ["Workforce Management", "Attendance & Leave", "Payroll Engine", "Projects & Tasks", "Finance & Expense", "Compliance & Risk"],
    stats: [
      { value: "20%", label: "Improvement in utilization" },
      { value: "50%", label: "Reduction in billing disputes" },
      { value: "100%", label: "Certification compliance" },
      { value: "35%", label: "Faster project staffing" }
    ],
    testimonial: {
      quote: "ATLAS understands professional services. Utilization tracking and partner comp calculations that actually work.",
      author: "Sanjay Gupta",
      role: "Managing Partner",
      company: "Gupta & Associates LLP"
    },
    color: "text-indigo-500",
    gradient: "from-indigo-500 to-blue-500"
  },
  "government": {
    slug: "government",
    name: "Government & Public Sector",
    icon: Scale,
    tagline: "Modernize public sector workforce management",
    heroDescription: "Manage government employees with tenure tracking, departmental allocations, and public sector-specific compliance requirements.",
    challenges: [
      "Complex government pay scales and grades",
      "Tenure and seniority tracking",
      "Departmental transfers and postings",
      "Public sector leave policies",
      "Pension and retirement management"
    ],
    solutions: [
      { title: "Pay Commission Integration", description: "7th Pay Commission compliant salary structures" },
      { title: "Transfer Management", description: "Inter-departmental posting and transfer workflows" },
      { title: "Pension Calculator", description: "NPS and OPS pension calculations and projections" },
      { title: "Government Leave Suite", description: "EL, CL, HPL, and all government leave types" }
    ],
    modules: ["Workforce Management", "Attendance & Leave", "Payroll Engine", "Compliance & Risk", "Projects & Tasks", "Finance & Expense"],
    stats: [
      { value: "100%", label: "Pay Commission compliance" },
      { value: "60%", label: "Faster transfer processing" },
      { value: "Zero", label: "Pension calculation errors" },
      { value: "50%", label: "Reduction in admin burden" }
    ],
    testimonial: {
      quote: "ATLAS handles the complexity of government HR like no other system we've seen.",
      author: "IAS K. Venkatesh",
      role: "Secretary, Personnel",
      company: "State Government"
    },
    color: "text-sky-500",
    gradient: "from-sky-500 to-blue-500"
  }
};

const IndustryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const industry = slug ? industriesData[slug] : null;

  if (!industry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Industry not found</h1>
          <Link to="/industries">
            <Button>Back to Industries</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = industry.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <NetworkBackground />
        </div>
        <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-5`} />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <Link 
            to="/industries" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Industries
          </Link>
          
          <div className="max-w-4xl">
            <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r ${industry.gradient} bg-opacity-10 mb-6`}>
              <Icon className={`w-5 h-5 ${industry.color}`} />
              <span className={`text-sm font-medium ${industry.color}`}>{industry.name}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 animate-fade-in">
              {industry.tagline}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
              {industry.heroDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Link to="/get-quote">
                <Button size="lg" className={`bg-gradient-to-r ${industry.gradient} text-white hover:opacity-90`}>
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {industry.stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${industry.gradient} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-sm font-medium mb-6`}>
                <Zap className="w-4 h-4" />
                Industry Challenges
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                We understand your <span className={`bg-gradient-to-r ${industry.gradient} bg-clip-text text-transparent`}>unique challenges</span>
              </h2>
              <ul className="space-y-4">
                {industry.challenges.map((challenge, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-3 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                    <span className="text-foreground/80">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${industry.gradient} opacity-10 rounded-3xl blur-3xl`} />
              <div className="relative bg-card border border-border rounded-2xl p-8">
                <h3 className="text-xl font-heading font-bold text-foreground mb-6">How ATLAS Solves These</h3>
                <div className="space-y-6">
                  {industry.solutions.map((solution, index) => (
                    <div 
                      key={solution.title}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${industry.gradient} flex items-center justify-center`}>
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-foreground">{solution.title}</h4>
                      </div>
                      <p className="text-muted-foreground text-sm pl-11">{solution.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${industry.gradient} bg-opacity-10 text-foreground text-sm font-medium mb-6`}>
              <ShieldCheck className="w-4 h-4" />
              Recommended Modules
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Purpose-built for <span className={`bg-gradient-to-r ${industry.gradient} bg-clip-text text-transparent`}>{industry.name}</span>
            </h2>
            <p className="text-muted-foreground">
              These ATLAS modules are specifically configured to address your industry's unique needs.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {industry.modules.map((module, index) => (
              <Link
                key={module}
                to={`/modules/${module.toLowerCase().replace(/ /g, '-').replace(/&/g, '').replace(/--/g, '-')}`}
                className="group px-6 py-3 rounded-xl bg-background border border-border hover:border-primary transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-foreground group-hover:text-primary transition-colors">{module}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className={`relative bg-gradient-to-r ${industry.gradient} rounded-3xl p-1`}>
              <div className="bg-background rounded-[22px] p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <Users className={`w-8 h-8 ${industry.color}`} />
                  <span className="text-muted-foreground text-sm font-medium">Customer Success Story</span>
                </div>
                <blockquote className="text-2xl md:text-3xl font-heading font-medium text-foreground mb-8 leading-relaxed">
                  "{industry.testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${industry.gradient} flex items-center justify-center text-white font-bold`}>
                    {industry.testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{industry.testimonial.author}</div>
                    <div className="text-muted-foreground text-sm">
                      {industry.testimonial.role}, {industry.testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Ready to transform your <span className={`bg-gradient-to-r ${industry.gradient} bg-clip-text text-transparent`}>{industry.name.toLowerCase()}</span> workforce?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join leading organizations that trust ATLAS for their workforce operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/get-quote">
                <Button size="lg" className={`bg-gradient-to-r ${industry.gradient} text-white hover:opacity-90`}>
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Schedule Demo
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

export default IndustryDetail;
