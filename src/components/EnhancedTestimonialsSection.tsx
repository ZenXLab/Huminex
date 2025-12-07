import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Quote, Star, Building2, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  industry: string;
  location: string;
  rating: number;
  metrics?: { label: string; value: string }[];
  logo: string;
  avatar: string;
  isIndian: boolean;
}

const testimonials: Testimonial[] = [
  {
    quote: "ATLAS transformed our HR operations completely. We went from 3 separate systems to one unified platform. Payroll processing that took 5 days now happens in 4 hours.",
    author: "Priya Sharma",
    role: "CHRO",
    company: "TechServe India",
    industry: "IT Services",
    location: "Mumbai, India",
    rating: 5,
    metrics: [
      { label: "Time Saved", value: "85%" },
      { label: "Employees", value: "2,500+" },
    ],
    logo: "TS",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    isIndian: true
  },
  {
    quote: "The compliance automation alone saved us from 3 potential penalties. Proxima AI flagged issues before they became problems. Best investment we've made.",
    author: "Rajesh Kumar",
    role: "CFO",
    company: "FinanceFirst",
    industry: "Banking & Finance",
    location: "Delhi NCR, India",
    rating: 5,
    metrics: [
      { label: "Compliance Score", value: "100%" },
      { label: "Cost Savings", value: "₹45L/yr" },
    ],
    logo: "FF",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isIndian: true
  },
  {
    quote: "Onboarding 200+ employees during our expansion was seamless. The BGV integration and automated workflows made what seemed impossible, simple.",
    author: "Sarah Chen",
    role: "VP People Operations",
    company: "CloudFirst Asia",
    industry: "Cloud Computing",
    location: "Singapore",
    rating: 5,
    metrics: [
      { label: "Onboarding Time", value: "2 Days" },
      { label: "Hires/Quarter", value: "200+" },
    ],
    logo: "CF",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    isIndian: false
  },
  {
    quote: "Managing 15 retail locations with different shift patterns was a nightmare. ATLAS attendance and roster management changed everything.",
    author: "Amit Patel",
    role: "Operations Director",
    company: "RetailMax",
    industry: "Retail Chain",
    location: "Bangalore, India",
    rating: 5,
    metrics: [
      { label: "Locations", value: "15" },
      { label: "Accuracy", value: "99.9%" },
    ],
    logo: "RM",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isIndian: true
  },
  {
    quote: "The project billing integration with payroll was exactly what our consulting firm needed. Real-time utilization visibility transformed our margins.",
    author: "Michael Wong",
    role: "Managing Partner",
    company: "StrategyWorks",
    industry: "Management Consulting",
    location: "Hong Kong",
    rating: 5,
    metrics: [
      { label: "Margin Improvement", value: "18%" },
      { label: "Billing Accuracy", value: "100%" },
    ],
    logo: "SW",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    isIndian: false
  },
  {
    quote: "From a 50-person startup to 500+ employees in 2 years, ATLAS scaled with us without any system changes. The OpZenix automation is game-changing.",
    author: "Neha Reddy",
    role: "Co-Founder & CEO",
    company: "HealthTech Solutions",
    industry: "Healthcare Tech",
    location: "Hyderabad, India",
    rating: 5,
    metrics: [
      { label: "Growth", value: "10x" },
      { label: "Automation Rate", value: "92%" },
    ],
    logo: "HT",
    avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&h=150&fit=crop&crop=face",
    isIndian: true
  },
];

const trustIndicators = [
  { label: "Enterprises Trust Us", value: "200+" },
  { label: "Countries Served", value: "15+" },
  { label: "Employees Managed", value: "50K+" },
  { label: "Client Satisfaction", value: "99.9%" },
];

const companyLogos = [
  "TechServe", "FinanceFirst", "CloudFirst", "RetailMax", 
  "StrategyWorks", "HealthTech", "InnovateCorp", "DataDriven"
];

export const EnhancedTestimonialsSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: logosRef, isVisible: logosVisible } = useScrollAnimation({ threshold: 0.2 });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleStartFreeTrial = () => {
    if (user) {
      navigate("/portal");
    } else {
      navigate("/onboarding");
    }
  };

  // Auto-scroll animation
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="py-20 lg:py-28 bg-card relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Trust Indicators */}
        <div 
          ref={logosRef as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-700 ${logosVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {trustIndicators.map((indicator, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-background/50 border border-border/50 rounded-2xl"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl lg:text-4xl font-heading font-extrabold text-primary mb-2">
                {indicator.value}
              </div>
              <div className="text-sm text-muted-foreground">{indicator.label}</div>
            </div>
          ))}
        </div>

        {/* Company Logos Ticker */}
        <div className={`mb-16 overflow-hidden transition-all duration-700 delay-200 ${logosVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {companyLogos.map((logo, index) => (
              <div 
                key={index}
                className="px-6 py-3 bg-muted/30 border border-border/30 rounded-lg text-muted-foreground font-heading font-semibold"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div 
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold tracking-wide uppercase mb-6">
            <Building2 className="w-4 h-4" />
            Real Results
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See how enterprises across industries are transforming with ATLAS.
          </p>
        </div>

        {/* Horizontal Scrolling Testimonials */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden pb-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Duplicate testimonials for infinite scroll effect */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="group flex-shrink-0 w-[380px] p-6 lg:p-8 bg-background border border-border/60 rounded-2xl relative transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-6">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
                  <Quote className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Company Logo */}
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center">
                  <span className="font-heading font-bold text-primary">{testimonial.logo}</span>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Industry Badge */}
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
                {testimonial.industry}
              </span>

              {/* Quote */}
              <p className="text-foreground/80 mb-6 leading-relaxed text-sm lg:text-base line-clamp-4">
                "{testimonial.quote}"
              </p>

              {/* Metrics */}
              {testimonial.metrics && (
                <div className="flex gap-4 mb-6 pb-6 border-b border-border/50">
                  {testimonial.metrics.map((metric, idx) => (
                    <div key={idx} className="flex-1 text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-lg font-heading font-bold text-primary">{metric.value}</div>
                      <div className="text-xs text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Author with Avatar */}
              <div className="flex items-center gap-3">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <p className="font-heading font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                  <p className="text-xs text-primary mt-0.5">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-muted-foreground mb-6">
            Join 200+ enterprises already transforming with ATLAS
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="group shadow-lg shadow-primary/20" onClick={handleStartFreeTrial}>
              <Sparkles className="w-4 h-4 mr-2" />
              Start Your Free Trial
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/industries")}>
              View Case Studies
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
