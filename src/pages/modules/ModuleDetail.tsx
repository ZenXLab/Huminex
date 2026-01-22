import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getModuleBySlug, modules } from "@/lib/moduleData";
import { 
  ArrowRight, 
  CheckCircle2, 
  ArrowLeft,
  Building2,
  Target,
  Lightbulb,
  ChevronRight
} from "lucide-react";

const ModuleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const module = getModuleBySlug(slug || "");
  
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: useCasesRef, isVisible: useCasesVisible } = useScrollAnimation({ threshold: 0.1 });

  if (!module) {
    return <Navigate to="/features" replace />;
  }

  const Icon = module.icon;
  const currentIndex = modules.findIndex(m => m.slug === slug);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  return (
    <>
      <Helmet>
        <title>{module.title} | CropXon HUMINEX - Enterprise Workforce OS</title>
        <meta name="description" content={`${module.heroDescription} - Part of HUMINEX, the unified workforce operating system.`} />
        <meta name="keywords" content={`${module.title}, HUMINEX, workforce management, HR software, ${module.features.slice(0, 5).join(', ')}`} />
        <link rel="canonical" href={`https://huminex.cropxon.com/modules/${module.slug}`} />
      </Helmet>

      <main className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section 
          ref={heroRef as React.RefObject<HTMLElement>}
          className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${module.color} opacity-10 rounded-full blur-[120px] pointer-events-none`} />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-8 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/features" className="hover:text-primary transition-colors">Features</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{module.title}</span>
            </div>

            <div className={`max-w-4xl transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Module Badge */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl ${module.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-8 h-8 ${module.iconColor}`} strokeWidth={1.5} />
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-gradient-to-r ${module.color} text-white`}>
                  Module {String(module.id).padStart(2, '0')}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-6">
                <span className="text-foreground">{module.title}</span>
              </h1>

              <p className={`text-xl lg:text-2xl font-medium bg-gradient-to-r ${module.color} bg-clip-text text-transparent mb-6`}>
                {module.tagline}
              </p>

              <p className="text-lg text-muted-foreground max-w-3xl mb-8">
                {module.heroDescription}
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link to="/get-quote">
                  <Button variant="default" size="lg" className="group shadow-lg shadow-primary/20">
                    Get Started with {module.title}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/onboarding">
                  <Button variant="outline" size="lg">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section 
          ref={featuresRef as React.RefObject<HTMLElement>}
          className="py-20 lg:py-28 bg-muted/30"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold tracking-wide uppercase mb-6">
                <CheckCircle2 className="w-4 h-4" />
                Core Features
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight mb-6">
                Everything You Need in <span className="text-gradient">{module.title}</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {module.features.map((feature, index) => (
                <div
                  key={index}
                  className={`group bg-card border border-border/60 rounded-xl p-5 transition-all duration-500 hover:shadow-lg hover:border-primary/30 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${module.iconColor} mt-0.5 flex-shrink-0`} />
                    <span className="text-sm font-medium text-foreground">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section 
          ref={benefitsRef as React.RefObject<HTMLElement>}
          className="py-20 lg:py-28"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-semibold tracking-wide uppercase mb-6">
                <Target className="w-4 h-4" />
                Key Benefits
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight mb-6">
                Why Choose <span className="text-gradient">HUMINEX {module.title}</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {module.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`group bg-card border border-border/60 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl hover:border-primary/30 ${benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl ${module.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Lightbulb className={`w-6 h-6 ${module.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section 
          ref={useCasesRef as React.RefObject<HTMLElement>}
          className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-transparent"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${useCasesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold tracking-wide uppercase mb-6">
                <Building2 className="w-4 h-4" />
                Real-World Impact
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight mb-6">
                <span className="text-gradient">{module.title}</span> in Action
              </h2>
              <p className="text-lg text-muted-foreground">
                See how organizations across industries are transforming with HUMINEX.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {module.useCases.map((useCase, index) => (
                <div
                  key={index}
                  className={`group bg-card border border-border/60 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl hover:border-primary/30 ${useCasesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${module.color} text-white mb-4`}>
                    {useCase.industry}
                  </span>
                  <h3 className="text-lg font-heading font-bold text-foreground mb-3">
                    {useCase.scenario}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">{useCase.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-12 border-t border-border/60">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {prevModule ? (
                <Link 
                  to={`/modules/${prevModule.slug}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Previous: {prevModule.title}</span>
                </Link>
              ) : (
                <div />
              )}
              
              <Link to="/features">
                <Button variant="outline">
                  View All Modules
                </Button>
              </Link>

              {nextModule ? (
                <Link 
                  to={`/modules/${nextModule.slug}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <span>Next: {nextModule.title}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 bg-card border-t border-border/60">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight mb-6">
                Ready to Transform with {module.title}?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join hundreds of enterprises that trust HUMINEX to manage their workforce.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/get-quote">
                  <Button variant="default" size="lg" className="group shadow-lg shadow-primary/20">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button variant="outline" size="lg">
                    Explore All Features
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

export default ModuleDetail;
