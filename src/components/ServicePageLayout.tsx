import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NetworkBackground } from "./NetworkBackground";
import { Button } from "./ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface CaseStudy {
  title: string;
  client: string;
  challenge: string;
  solution: string;
  results: string[];
}

interface ServicePageLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  benefits: string[];
  caseStudy: CaseStudy;
  lottieAnimation?: ReactNode;
  accentColor?: string;
}

export const ServicePageLayout = ({
  title,
  subtitle,
  description,
  icon: Icon,
  features,
  benefits,
  caseStudy,
  lottieAnimation,
}: ServicePageLayoutProps) => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden hero-gradient pt-20">
        <NetworkBackground />
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link 
              to="/#pillars" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-primary text-sm font-medium">{subtitle}</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6">
                  <span className="text-gradient">{title}</span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="hero" size="lg" className="group">
                    Get Started
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="hero-outline" size="lg">
                    Schedule a Call
                  </Button>
                </div>
              </div>

              {/* Lottie Animation */}
              <div className="relative animate-fade-in-up animation-delay-200">
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full animate-pulse-glow" />
                  {lottieAnimation ? (
                    <div className="relative z-10 flex items-center justify-center h-full">
                      {lottieAnimation}
                    </div>
                  ) : (
                    <div className="relative z-10 flex items-center justify-center h-full">
                      <div className="p-12 bg-card/50 border border-border rounded-3xl shadow-neon">
                        <Icon className="h-32 w-32 text-accent" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6">
              What We <span className="text-gradient">Offer</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature}
                className="p-6 bg-card border border-border rounded-2xl card-glow animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CheckCircle2 className="h-6 w-6 text-accent mb-4" />
                <p className="text-foreground font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-card relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6">
                Why Choose Our <span className="text-gradient">{title}</span> Services?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={benefit} className="flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="p-1 rounded-full bg-primary/20 mt-1">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </div>
                    <p className="text-foreground/80">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video bg-muted/30 border border-border rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <Icon className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Enterprise-grade solutions tailored to your needs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
                Case Study
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">
                Real <span className="text-gradient">Results</span>
              </h2>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 lg:p-12 neon-border">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-2">{caseStudy.title}</h3>
              <p className="text-primary font-medium mb-6">{caseStudy.client}</p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Challenge</h4>
                  <p className="text-foreground/80">{caseStudy.challenge}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Solution</h4>
                  <p className="text-foreground/80">{caseStudy.solution}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Results</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caseStudy.results.map((result) => (
                    <div key={result} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="text-foreground text-sm">{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Ready to <span className="text-gradient">Transform</span> Your Business?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let our experts help you leverage {title.toLowerCase()} to drive growth and innovation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" className="group">
                Start Your Journey
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="hero-outline" size="xl">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};
