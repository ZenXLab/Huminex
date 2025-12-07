import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { modules } from "@/lib/moduleData";
import { 
  ArrowRight,
  CheckCircle2,
  Building2,
  ExternalLink
} from "lucide-react";

const Features = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: modulesRef, isVisible: modulesVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <>
      <Helmet>
        <title>Features | CropXon ATLAS - Enterprise Workforce Operating System</title>
        <meta name="description" content="Explore all 15 modules of ATLAS - the unified workforce OS for HR, Payroll, Compliance, Finance, Recruitment, Projects, AI, and Automation." />
        <meta name="keywords" content="ATLAS features, HR software, payroll system, workforce management, compliance automation, AI HR, enterprise software" />
        <link rel="canonical" href="https://atlas.cropxon.com/features" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section 
          ref={heroRef as React.RefObject<HTMLElement>}
          className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
        >
          {/* Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold tracking-wide uppercase mb-6">
                <Building2 className="w-4 h-4" />
                15 Unified Modules
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-6">
                <span className="text-gradient">From Hire to Retire</span>
                <span className="block text-foreground mt-2">And Everything in Between</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                ATLAS is an AI-powered Workforce OS that automates HR, Payroll, Compliance, Finance, 
                Recruitment, Projects, and Operations for modern enterprises.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/get-quote">
                  <Button variant="default" size="lg" className="group shadow-lg shadow-primary/20">
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/onboarding">
                  <Button variant="outline" size="lg">
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section 
          ref={modulesRef as React.RefObject<HTMLElement>}
          className="py-20 lg:py-28"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${modulesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6">
                One Platform. <span className="text-gradient">Infinite Possibilities.</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore the complete suite of modules that power modern enterprises.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <Link
                    key={module.id}
                    to={`/modules/${module.slug}`}
                    className={`group relative bg-card border border-border/60 rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 ${modulesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {/* Module Number Badge */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                        {String(module.id).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl ${module.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${module.iconColor}`} strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2 flex items-center gap-2">
                      {module.title}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </h3>

                    {/* Tagline */}
                    <p className={`text-sm font-medium bg-gradient-to-r ${module.color} bg-clip-text text-transparent mb-4`}>
                      {module.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                      {module.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2">
                      {module.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className={`w-4 h-4 ${module.iconColor} mt-0.5 flex-shrink-0`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {module.features.length > 4 && (
                        <li className="text-sm text-primary font-medium pt-1">
                          +{module.features.length - 4} more features →
                        </li>
                      )}
                    </ul>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6">
                Ready to Transform Your Organization?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join hundreds of enterprises that trust ATLAS to manage their workforce, 
                streamline operations, and drive growth.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/get-quote">
                  <Button variant="default" size="lg" className="group shadow-lg shadow-primary/20">
                    Get Started Today
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/industries">
                  <Button variant="outline" size="lg">
                    View Industry Solutions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Features;
