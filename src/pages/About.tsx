import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  ArrowRight, 
  Sparkles, 
  Users, 
  Target, 
  Eye,
  Zap,
  Heart,
  Shield,
  Rocket,
  Code,
  Palette,
  HeadphonesIcon,
  Globe,
  ChevronDown,
  Star,
  Lightbulb,
  Brain
} from "lucide-react";

const teamMembers = [
  {
    name: "Abhi",
    role: "Founder & Chief Architect",
    description: "The mind behind ATLAS. Daydreamer. Night coder. Vision-led builder.",
    avatar: "A",
    gradient: "from-violet-500 to-purple-600"
  },
  {
    name: "Engineering Team",
    role: "AI & Automation",
    description: "Building the neural pathways of ATLAS with cutting-edge AI/ML.",
    avatar: "AI",
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    name: "Platform Team",
    role: "Full-Stack Engineers",
    description: "Crafting scalable infrastructure that powers enterprises.",
    avatar: "PT",
    gradient: "from-emerald-500 to-green-600"
  },
  {
    name: "Creative Studio",
    role: "Experience Design",
    description: "Making enterprise software beautiful and intuitive.",
    avatar: "XD",
    gradient: "from-pink-500 to-rose-600"
  },
  {
    name: "DevSecOps",
    role: "Security & Infrastructure",
    description: "Ensuring ATLAS is secure, fast, and always available.",
    avatar: "DO",
    gradient: "from-amber-500 to-orange-600"
  },
  {
    name: "Customer Success",
    role: "Support & Experience",
    description: "Because ATLAS puts humans first. Always.",
    avatar: "CS",
    gradient: "from-indigo-500 to-violet-600"
  }
];

const values = [
  { icon: Heart, title: "People First", description: "Technology serves humans. Not the other way around." },
  { icon: Zap, title: "Speed Over Everything", description: "Fast product. Fast delivery. Fast support." },
  { icon: Brain, title: "Automation Native", description: "Every feature solves 1 problem and removes 10 tasks." },
  { icon: Shield, title: "Transparency + Trust", description: "No black boxes. Only clarity." },
  { icon: Rocket, title: "Build Like Tomorrow", description: "Because the future depends on it." }
];

const visionPoints = [
  "Companies run automatically",
  "Workflows execute themselves",
  "Payroll never fails",
  "Compliance never slips",
  "Insights appear before decisions",
  "People feel supported, not managed",
  "AI is your co-founder, co-pilot, and co-worker"
];

const About = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: storyRef, isVisible: storyVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: missionRef, isVisible: missionVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: visionRef, isVisible: visionVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: teamRef, isVisible: teamVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <>
      <Helmet>
        <title>About Us | CropXon ATLAS - The Story Behind the Workforce OS</title>
        <meta name="description" content="Discover the story of ATLAS - from a late-night idea to the world's first AI-powered Workforce Operating System. Meet the team building the future of work." />
        <link rel="canonical" href="https://atlas.cropxon.com/about" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16 lg:pt-18">
        {/* Hero Section */}
        <section 
          ref={heroRef as React.RefObject<HTMLElement>}
          className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-8"
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/30 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <span className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold tracking-wide uppercase mb-8 animate-pulse">
                <Sparkles className="w-4 h-4" />
                Our Story
              </span>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-black tracking-tight mb-8 leading-[0.9]">
                <span className="block text-foreground">We're rewriting</span>
                <span className="block text-gradient">how the world works.</span>
                <span className="block text-foreground/60 text-4xl sm:text-5xl lg:text-6xl mt-4">Literally.</span>
              </h1>

              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                What started as a small idea in a late-night workspace has grown into a mission to build 
                the world's first <span className="text-primary font-semibold">AI-powered Workforce OS</span> — 
                a system that unifies people, payroll, projects, compliance, automation, and intelligence 
                into one seamless experience.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link to="#team">
                  <Button size="lg" className="group shadow-xl shadow-primary/20">
                    <Users className="w-5 h-5 mr-2" />
                    Meet the Team
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="#mission">
                  <Button variant="outline" size="lg">
                    <Target className="w-5 h-5 mr-2" />
                    Our Mission
                  </Button>
                </Link>
              </div>

              {/* Scroll Indicator */}
              <div className="animate-bounce">
                <ChevronDown className="w-8 h-8 text-muted-foreground mx-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section 
          ref={storyRef as React.RefObject<HTMLElement>}
          className="py-24 lg:py-32 relative"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className={`text-center mb-16 transition-all duration-700 ${storyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium mb-6">
                  The Genesis
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black mb-6">
                  <span className="text-gradient">It started with frustration.</span>
                </h2>
              </div>

              <div className={`space-y-8 text-lg lg:text-xl text-muted-foreground leading-relaxed transition-all duration-700 delay-200 ${storyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <p className="text-center text-2xl lg:text-3xl font-heading font-bold text-foreground">
                  Then turned into obsession.<br />
                  <span className="text-gradient">Now, it's a revolution.</span>
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <div className="p-8 bg-card/50 border border-border/60 rounded-2xl">
                    <p className="text-foreground/80">
                      We saw companies running on <span className="text-primary font-semibold">10–15 disconnected tools</span>: 
                      HR in one place, payroll somewhere else, projects lost in spreadsheets, 
                      compliance buried in folders, and automation as a dream for "later."
                    </p>
                  </div>
                  <div className="p-8 bg-card/50 border border-border/60 rounded-2xl">
                    <p className="text-foreground/80">
                      <span className="text-primary font-semibold">Employees struggled.</span> HR teams burned out. 
                      Finance kept chasing data. Founders were blind to insights.
                    </p>
                  </div>
                </div>

                <div className="text-center py-12">
                  <p className="text-2xl lg:text-3xl font-heading text-foreground mb-4">
                    And one night, a simple question hit us:
                  </p>
                  <p className="text-3xl lg:text-4xl font-heading font-black text-gradient">
                    "What if one system… handled everything?"
                  </p>
                </div>

                <div className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl text-center">
                  <p className="text-foreground text-xl">
                    Not another HR tool. Not another payroll app.<br />
                    But <span className="text-primary font-bold">one unified Operating System</span> for the entire workforce.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                  {["Nights of coding", "Prototypes built", "Rebuilt again", "Dreams realized"].map((item, i) => (
                    <div key={i} className="p-4 bg-card/30 border border-border/40 rounded-xl text-center">
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-12">
                  <p className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-4">
                    And then — <span className="text-gradient">ATLAS came alive.</span>
                  </p>
                  <p className="text-muted-foreground">
                    Not just as a product. But as a purpose. A movement. A belief that:
                  </p>
                  <p className="text-3xl lg:text-4xl font-heading font-black text-primary mt-6">
                    Work shouldn't feel like work.<br />
                    <span className="text-gradient">It should feel like flow.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section 
          id="mission"
          ref={missionRef as React.RefObject<HTMLElement>}
          className="py-24 lg:py-32 bg-card/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className={`text-center mb-16 transition-all duration-700 ${missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                Our Mission
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black">
                What We're <span className="text-gradient">Building</span>
              </h2>
            </div>

            <div className={`grid md:grid-cols-3 gap-8 max-w-6xl mx-auto transition-all duration-700 delay-200 ${missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {[
                { icon: Globe, title: "World's Most Intelligent Workforce OS", desc: "A platform that understands your organization, automates everything, and empowers people to thrive." },
                { icon: Zap, title: "Eliminate Friction", desc: "HR, payroll, projects, compliance, finance — seamlessly synced into one intelligent system." },
                { icon: Brain, title: "AI at the Heart of Work", desc: "Not replacing people — amplifying them. Making everyone 10x more productive." }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="group p-8 bg-background border border-border/60 rounded-2xl hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className={`text-center mt-16 transition-all duration-700 delay-400 ${missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Something <span className="text-primary font-semibold">Workday</span> did for Fortune 50.<br />
                <span className="text-gradient font-bold text-2xl">ATLAS will do for everyone.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section 
          ref={visionRef as React.RefObject<HTMLElement>}
          className="py-24 lg:py-32 relative"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-700 ${visionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium mb-6">
                <Eye className="w-4 h-4" />
                Our Vision
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black mb-6">
                A World <span className="text-gradient">Where</span>
              </h2>
            </div>

            <div className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto transition-all duration-700 delay-200 ${visionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {visionPoints.map((point, index) => (
                <div 
                  key={index}
                  className="group p-6 bg-card/50 border border-border/60 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-foreground font-medium">{point}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`text-center mt-16 p-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl max-w-4xl mx-auto transition-all duration-700 delay-400 ${visionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
                ATLAS is not software.<br />
                <span className="text-gradient">ATLAS is infrastructure for the future of organizations.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section 
          id="team"
          ref={teamRef as React.RefObject<HTMLElement>}
          className="py-24 lg:py-32 bg-card/50"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-700 ${teamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
                <Users className="w-4 h-4" />
                The Team
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black mb-6">
                Builders of <span className="text-gradient">ATLAS</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A passionate team of engineers, designers, and dreamers building the future of work.
              </p>
            </div>

            <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto transition-all duration-700 delay-200 ${teamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="group relative p-8 bg-background border border-border/60 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-500"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${member.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                  
                  <div className="relative z-10">
                    {/* Avatar */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <span className="text-white font-heading font-bold text-xl">{member.avatar}</span>
                    </div>

                    <h3 className="text-xl font-heading font-bold text-foreground mb-1">{member.name}</h3>
                    <p className="text-primary font-medium text-sm mb-4">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section 
          ref={valuesRef as React.RefObject<HTMLElement>}
          className="py-24 lg:py-32"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-700 ${valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium mb-6">
                <Lightbulb className="w-4 h-4" />
                Our Values
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black">
                What We <span className="text-gradient">Stand For</span>
              </h2>
            </div>

            <div className={`flex flex-wrap justify-center gap-6 max-w-5xl mx-auto transition-all duration-700 delay-200 ${valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="group flex-1 min-w-[280px] max-w-[350px] p-8 bg-card/50 border border-border/60 rounded-2xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black mb-6">
                Ready to Join the <span className="text-gradient">Revolution?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Be part of the movement that's redefining how organizations work.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/get-quote">
                  <Button size="lg" className="group shadow-xl shadow-primary/20">
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
