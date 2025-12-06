import { Quote, Star, CheckCircle2 } from "lucide-react";

const testimonials = [
  {
    quote: "ATLAS transformed our digital infrastructure in ways we never imagined possible. Their AI-first approach delivered results that exceeded our expectations.",
    author: "Rajesh Kumar",
    role: "CTO, TechServe India",
    location: "Mumbai, India",
  },
  {
    quote: "The team's expertise in cloud architecture and DevOps helped us achieve 99.99% uptime. True enterprise partners.",
    author: "Sarah Mitchell",
    role: "VP Engineering, CloudFirst",
    location: "Singapore",
  },
  {
    quote: "From strategy to execution, ATLAS delivered a complete digital transformation that positioned us as industry leaders.",
    author: "Michael Chen",
    role: "CEO, InnovateTech",
    location: "Dubai, UAE",
  },
];

const trustIndicators = [
  "50+ Enterprise Clients",
  "15+ Countries Served",
  "99.9% Client Satisfaction",
  "24/7 Global Support",
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-card relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16 animate-fade-in-up">
          {trustIndicators.map((indicator) => (
            <div key={indicator} className="flex items-center gap-2 px-4 py-2 bg-muted/30 border border-border/50 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground">{indicator}</span>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            Client Success
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Trusted by <span className="text-gradient">Enterprises Worldwide</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="p-8 bg-background border border-border rounded-2xl relative card-glow animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-8">
                <div className="p-3 bg-primary rounded-xl shadow-neon">
                  <Quote className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/80 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-border/50">
                <p className="font-heading font-semibold text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-xs text-primary mt-1">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
