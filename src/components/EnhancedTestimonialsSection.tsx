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
              className="group flex-shrink-0 w-[400px] bg-gradient-to-br from-background via-background to-muted/30 border border-border/80 rounded-3xl relative transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 hover:-translate-y-1 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Card Content */}
              <div className="relative p-8">
                {/* Header with Quote icon and Company Logo */}
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg shadow-primary/20">
                    <Quote className="h-5 w-5 text-white" />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border/60 flex items-center justify-center shadow-inner">
                    <span className="font-heading font-bold text-lg text-primary">{testimonial.logo}</span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
                  ))}
                </div>

                {/* Industry & Location */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                    {testimonial.industry}
                  </span>
                  <span className="text-xs text-muted-foreground">• {testimonial.location}</span>
                </div>

                {/* Quote */}
                <p className="text-foreground/90 mb-6 leading-relaxed text-[15px] font-medium line-clamp-4">
                  "{testimonial.quote}"
                </p>

                {/* Metrics */}
                {testimonial.metrics && (
                  <div className="flex gap-3 mb-6">
                    {testimonial.metrics.map((metric, idx) => (
                      <div key={idx} className="flex-1 text-center p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border border-border/40">
                        <div className="text-xl font-heading font-extrabold text-primary">{metric.value}</div>
                        <div className="text-xs text-muted-foreground font-medium mt-1">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                  <div className="relative">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      className="w-14 h-14 rounded-full object-cover border-3 border-primary/30 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground text-base">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground font-medium">{testimonial.role}</p>
                    <p className="text-sm text-primary font-semibold">{testimonial.company}</p>
                  </div>
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
