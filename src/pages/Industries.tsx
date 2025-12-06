import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, Utensils, Heart, GraduationCap, Leaf, Truck, Building2, Home, Plane, Landmark, Users, Megaphone, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const industries = [
  {
    name: "Retail & E-Commerce",
    slug: "retail",
    icon: ShoppingCart,
    description: "Transform your retail operations with AI-powered inventory management, omnichannel experiences, and personalized customer journeys.",
    solutions: ["POS Systems", "Inventory Management", "E-Commerce Platforms", "Customer Analytics", "Loyalty Programs"],
    color: "from-primary/20 to-accent/10"
  },
  {
    name: "FoodTech & Restaurants",
    slug: "foodtech",
    icon: Utensils,
    description: "Streamline food service operations with smart ordering systems, kitchen automation, and delivery optimization.",
    solutions: ["Online Ordering", "Kitchen Display Systems", "Delivery Management", "Menu Engineering", "Table Management"],
    color: "from-orange-500/20 to-primary/10"
  },
  {
    name: "Healthcare & Pharma",
    slug: "healthcare",
    icon: Heart,
    description: "Modernize healthcare delivery with telemedicine, patient management systems, and regulatory compliance solutions.",
    solutions: ["Telemedicine Platforms", "EMR/EHR Systems", "Patient Portals", "Pharmacy Management", "HIPAA Compliance"],
    color: "from-red-500/20 to-primary/10"
  },
  {
    name: "Education & EdTech",
    slug: "education",
    icon: GraduationCap,
    description: "Build engaging learning experiences with LMS platforms, virtual classrooms, and adaptive learning systems.",
    solutions: ["Learning Management", "Virtual Classrooms", "Student Information Systems", "Assessment Platforms", "Content Delivery"],
    color: "from-blue-500/20 to-primary/10"
  },
  {
    name: "Agriculture & AgriTech",
    slug: "agriculture",
    icon: Leaf,
    description: "Leverage IoT, AI, and data analytics to optimize crop yields, supply chains, and farm management.",
    solutions: ["Precision Farming", "Supply Chain Tracking", "Weather Analytics", "Marketplace Platforms", "IoT Monitoring"],
    color: "from-green-500/20 to-primary/10"
  },
  {
    name: "Logistics & Supply Chain",
    slug: "logistics",
    icon: Truck,
    description: "Optimize end-to-end logistics with real-time tracking, route optimization, and warehouse management.",
    solutions: ["Fleet Management", "Route Optimization", "Warehouse Systems", "Last-Mile Delivery", "Supply Chain Visibility"],
    color: "from-amber-500/20 to-primary/10"
  },
  {
    name: "Hospitality & Travel",
    slug: "hospitality",
    icon: Building2,
    description: "Elevate guest experiences with smart booking systems, property management, and personalized services.",
    solutions: ["Property Management", "Booking Engines", "Guest Experience Apps", "Revenue Management", "Channel Management"],
    color: "from-purple-500/20 to-primary/10"
  },
  {
    name: "Real Estate & PropTech",
    slug: "real-estate",
    icon: Home,
    description: "Digitize property management with virtual tours, smart buildings, and automated tenant services.",
    solutions: ["Property Listings", "Virtual Tours", "Tenant Portals", "Smart Building IoT", "Lease Management"],
    color: "from-teal-500/20 to-primary/10"
  },
  {
    name: "Airlines & Aviation",
    slug: "airlines",
    icon: Plane,
    description: "Streamline aviation operations with crew management, passenger services, and maintenance tracking.",
    solutions: ["Booking Systems", "Crew Scheduling", "Passenger Apps", "Maintenance Tracking", "Loyalty Programs"],
    color: "from-sky-500/20 to-primary/10"
  },
  {
    name: "Finance & FinTech",
    slug: "finance",
    icon: Landmark,
    description: "Build secure, compliant financial solutions with payment processing, lending platforms, and wealth management.",
    solutions: ["Payment Gateways", "Lending Platforms", "KYC/AML Solutions", "Wealth Management", "RegTech Compliance"],
    color: "from-emerald-500/20 to-primary/10"
  },
  {
    name: "Media & Influencers",
    slug: "media",
    icon: Users,
    description: "Empower creators with content management, monetization tools, and audience engagement platforms.",
    solutions: ["Content Management", "Monetization Tools", "Analytics Dashboards", "Community Platforms", "Brand Partnerships"],
    color: "from-pink-500/20 to-primary/10"
  },
  {
    name: "Marketing & Ad Agencies",
    slug: "marketing",
    icon: Megaphone,
    description: "Supercharge campaigns with marketing automation, creative tools, and performance analytics.",
    solutions: ["Campaign Management", "Creative Automation", "Performance Analytics", "Client Portals", "Media Buying"],
    color: "from-rose-500/20 to-primary/10"
  },
  {
    name: "Professional Services",
    slug: "professional",
    icon: Briefcase,
    description: "Optimize consulting and professional services with project management, billing, and client collaboration.",
    solutions: ["Project Management", "Time Tracking", "Client Portals", "Document Management", "Billing Automation"],
    color: "from-indigo-500/20 to-primary/10"
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              Industry-Specific <span className="text-gradient">Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We understand that every industry has unique challenges. Our solutions are tailored to meet the specific needs of your sector.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div
                key={industry.slug}
                className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-500 card-glow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-50`} />
                
                <div className="relative p-8">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <industry.icon className="h-8 w-8 text-primary" />
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
                  <Button variant="ghost" className="group/btn p-0 h-auto text-primary hover:bg-transparent">
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
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
              We work across diverse sectors. If you don't see your industry listed, let's discuss how we can create a custom solution for your unique challenges.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/#contact">
                <Button variant="hero" size="lg">
                  Contact Us
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/#pricing">
                <Button variant="hero-outline" size="lg">
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
