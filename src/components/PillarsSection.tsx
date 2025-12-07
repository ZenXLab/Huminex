import { Link } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  Wallet, 
  UserPlus, 
  FolderKanban, 
  Receipt, 
  ShieldCheck, 
  KeyRound,
  Package,
  FileSearch,
  TrendingUp,
  Megaphone,
  Zap,
  Sparkles,
  Shield
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const atlasModules = [
  {
    icon: Users,
    title: "Workforce",
    description: "Complete employee lifecycle",
    href: "/modules/workforce-management",
    borderColor: "from-blue-400 to-blue-600",
    iconBg: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-500",
  },
  {
    icon: Calendar,
    title: "Attendance",
    description: "Biometric & GPS tracking",
    href: "/modules/attendance-leave",
    borderColor: "from-green-400 to-emerald-600",
    iconBg: "bg-green-50 dark:bg-green-950/50",
    iconColor: "text-green-500",
  },
  {
    icon: Wallet,
    title: "Payroll",
    description: "100% compliant payroll",
    href: "/modules/payroll-engine",
    borderColor: "from-amber-400 to-orange-600",
    iconBg: "bg-amber-50 dark:bg-amber-950/50",
    iconColor: "text-amber-500",
  },
  {
    icon: UserPlus,
    title: "Recruitment",
    description: "AI-powered ATS",
    href: "/modules/recruitment-ats",
    borderColor: "from-purple-400 to-violet-600",
    iconBg: "bg-purple-50 dark:bg-purple-950/50",
    iconColor: "text-purple-500",
  },
  {
    icon: FolderKanban,
    title: "Projects",
    description: "Track & bill seamlessly",
    href: "/modules/projects-tasks",
    borderColor: "from-indigo-400 to-blue-600",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/50",
    iconColor: "text-indigo-500",
  },
  {
    icon: Receipt,
    title: "Finance",
    description: "Expense & budgets",
    href: "/modules/finance-expense",
    borderColor: "from-teal-400 to-cyan-600",
    iconBg: "bg-teal-50 dark:bg-teal-950/50",
    iconColor: "text-teal-500",
  },
  {
    icon: ShieldCheck,
    title: "Compliance",
    description: "Zero compliance gaps",
    href: "/modules/compliance-risk",
    borderColor: "from-red-400 to-rose-600",
    iconBg: "bg-red-50 dark:bg-red-950/50",
    iconColor: "text-red-500",
  },
  {
    icon: KeyRound,
    title: "Identity",
    description: "SSO & RBAC",
    href: "/modules/identity-access",
    borderColor: "from-slate-400 to-zinc-600",
    iconBg: "bg-slate-50 dark:bg-slate-950/50",
    iconColor: "text-slate-500",
  },
  {
    icon: Package,
    title: "Assets",
    description: "Complete EMS",
    href: "/modules/assets-ems",
    borderColor: "from-pink-400 to-rose-600",
    iconBg: "bg-pink-50 dark:bg-pink-950/50",
    iconColor: "text-pink-500",
  },
  {
    icon: FileSearch,
    title: "BGV",
    description: "Instant verification",
    href: "/modules/bgv-suite",
    borderColor: "from-emerald-400 to-green-600",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "Performance",
    description: "OKRs & reviews",
    href: "/modules/performance-okrs",
    borderColor: "from-orange-400 to-amber-600",
    iconBg: "bg-orange-50 dark:bg-orange-950/50",
    iconColor: "text-orange-500",
  },
  {
    icon: Shield,
    title: "Insurance",
    description: "Claims & coverage",
    href: "/modules/insurance-claims",
    borderColor: "from-cyan-400 to-teal-600",
    iconBg: "bg-cyan-50 dark:bg-cyan-950/50",
    iconColor: "text-cyan-500",
  },
  {
    icon: Zap,
    title: "OpZenix",
    description: "Workflow automation",
    href: "/modules/opzenix",
    borderColor: "from-yellow-400 to-amber-600",
    iconBg: "bg-yellow-50 dark:bg-yellow-950/50",
    iconColor: "text-yellow-500",
  },
  {
    icon: Sparkles,
    title: "Proxima AI",
    description: "Intelligent insights",
    href: "/modules/proxima-ai",
    borderColor: "from-violet-400 to-purple-600",
    iconBg: "bg-violet-50 dark:bg-violet-950/50",
    iconColor: "text-violet-500",
  },
  {
    icon: Megaphone,
    title: "Communications",
    description: "Announcements & docs",
    href: "/modules/announcements",
    borderColor: "from-fuchsia-400 to-pink-600",
    iconBg: "bg-fuchsia-50 dark:bg-fuchsia-950/50",
    iconColor: "text-fuchsia-500",
  },
];

export const PillarsSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section 
      id="pillars" 
      className="py-24 lg:py-32 relative overflow-hidden bg-secondary/30"
      ref={ref as React.RefObject<HTMLElement>}
    >
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold tracking-wide uppercase mb-6">
            Complete Workforce OS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6 text-foreground">
            <span className="text-gradient">15 Powerful Modules</span> <br className="hidden sm:block" />
            One Unified Platform
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            Everything you need to manage your workforce — from hire to retire and everything in between.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
          {atlasModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.title}
                to={module.href}
                className={`group relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                {/* Card with gradient border */}
                <div className="relative p-[1.5px] rounded-2xl">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${module.borderColor} opacity-30 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Inner card */}
                  <div className="relative bg-card rounded-[14px] p-4 lg:p-5 h-full flex flex-col items-center text-center transition-all duration-300 group-hover:shadow-lg border border-transparent group-hover:border-transparent">
                    {/* Icon Container */}
                    <div className={`w-12 h-12 rounded-xl ${module.iconBg} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`w-6 h-6 ${module.iconColor}`} strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-heading font-semibold text-foreground mb-1 leading-tight tracking-tight">
                      {module.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link 
            to="/features" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-xl transition-all duration-300 group"
          >
            Explore All Features
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
