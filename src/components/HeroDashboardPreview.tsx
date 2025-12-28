import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Building2, Shield, BarChart3, Clock, FileText, 
  DollarSign, Bell, CheckCircle2, AlertTriangle, TrendingUp,
  Calendar, UserCheck, Briefcase, Settings, Eye, Lock,
  Cpu, Globe, Zap, HeartPulse, GraduationCap, Target,
  Wallet, FileCheck, UserCog, Building, Activity
} from "lucide-react";

type Role = "super_admin" | "hr_manager" | "finance_lead" | "employee";

interface RoleConfig {
  name: string;
  color: string;
  icon: typeof Users;
  permissions: string[];
}

const roleConfigs: Record<Role, RoleConfig> = {
  super_admin: {
    name: "Super Admin",
    color: "from-purple-500 to-indigo-600",
    icon: Shield,
    permissions: ["All Modules", "User Management", "System Settings", "Analytics", "Audit Logs", "Billing"]
  },
  hr_manager: {
    name: "HR Manager",
    color: "from-blue-500 to-cyan-500",
    icon: Users,
    permissions: ["Employees", "Attendance", "Leave", "Recruitment", "Performance", "Training"]
  },
  finance_lead: {
    name: "Finance Lead",
    color: "from-emerald-500 to-teal-500",
    icon: DollarSign,
    permissions: ["Payroll", "Invoices", "Expenses", "Budget", "Reports", "Compliance"]
  },
  employee: {
    name: "Employee",
    color: "from-amber-500 to-orange-500",
    icon: Briefcase,
    permissions: ["My Profile", "Attendance", "Leave Requests", "Payslips", "Tasks"]
  }
};

const dashboardModules = [
  { id: "workforce", name: "Workforce", icon: Users, value: "2,847", change: "+12%", color: "bg-blue-500/20 text-blue-400", trend: "up" },
  { id: "attendance", name: "Attendance", icon: Clock, value: "94.2%", change: "+2.1%", color: "bg-green-500/20 text-green-400", trend: "up" },
  { id: "payroll", name: "Payroll", icon: DollarSign, value: "₹24.5L", change: "Processed", color: "bg-emerald-500/20 text-emerald-400", trend: "neutral" },
  { id: "compliance", name: "Compliance", icon: Shield, value: "98%", change: "Healthy", color: "bg-purple-500/20 text-purple-400", trend: "up" },
  { id: "projects", name: "Projects", icon: Briefcase, value: "18", change: "Active", color: "bg-amber-500/20 text-amber-400", trend: "neutral" },
  { id: "analytics", name: "Analytics", icon: BarChart3, value: "Live", change: "Real-time", color: "bg-pink-500/20 text-pink-400", trend: "neutral" },
  { id: "recruitment", name: "Recruitment", icon: UserCog, value: "32", change: "Open", color: "bg-indigo-500/20 text-indigo-400", trend: "up" },
  { id: "training", name: "Training", icon: GraduationCap, value: "156", change: "Enrolled", color: "bg-cyan-500/20 text-cyan-400", trend: "up" },
  { id: "performance", name: "Performance", icon: Target, value: "4.2", change: "Avg Score", color: "bg-rose-500/20 text-rose-400", trend: "up" },
  { id: "expenses", name: "Expenses", icon: Wallet, value: "₹4.2L", change: "Pending", color: "bg-orange-500/20 text-orange-400", trend: "down" },
  { id: "documents", name: "Documents", icon: FileCheck, value: "1.2K", change: "Verified", color: "bg-teal-500/20 text-teal-400", trend: "neutral" },
  { id: "ai_insights", name: "AI Insights", icon: Cpu, value: "47", change: "Actions", color: "bg-violet-500/20 text-violet-400", trend: "up" },
];

const notifications = [
  { type: "success", message: "Payroll processed for 847 employees", time: "2m ago" },
  { type: "warning", message: "3 leave requests pending approval", time: "15m ago" },
  { type: "info", message: "New compliance update available", time: "1h ago" },
  { type: "success", message: "BGV completed for 12 candidates", time: "2h ago" },
];

const roleAccess: Record<Role, string[]> = {
  super_admin: ["workforce", "attendance", "payroll", "compliance", "projects", "analytics", "recruitment", "training", "performance", "expenses", "documents", "ai_insights"],
  hr_manager: ["workforce", "attendance", "projects", "recruitment", "training", "performance"],
  finance_lead: ["payroll", "compliance", "analytics", "expenses", "documents"],
  employee: ["attendance", "projects", "training", "performance"]
};

const liveMetrics = [
  { label: "Active Users", value: "1,247", icon: Activity },
  { label: "API Calls/min", value: "8.4K", icon: Zap },
  { label: "Uptime", value: "99.99%", icon: HeartPulse },
];

export const HeroDashboardPreview = () => {
  const [activeRole, setActiveRole] = useState<Role>("super_admin");
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [animatingModules, setAnimatingModules] = useState(true);

  // Auto-rotate roles for demo
  useEffect(() => {
    const roles: Role[] = ["super_admin", "hr_manager", "finance_lead", "employee"];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % roles.length;
      setActiveRole(roles[currentIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Initial animation
  useEffect(() => {
    const timer = setTimeout(() => setAnimatingModules(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const currentRoleConfig = roleConfigs[activeRole];
  const accessibleModules = roleAccess[activeRole];
  const RoleIcon = currentRoleConfig.icon;

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-8 lg:mt-12 px-2 sm:px-0">
      {/* Glass Container */}
      <motion.div 
        className="relative rounded-xl sm:rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 p-[1px]">
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-[#0A0F1C]/95 backdrop-blur-xl" />
        </div>

        <div className="relative z-10 p-3 sm:p-4 lg:p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex gap-1 sm:gap-1.5">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-white/60 text-xs sm:text-sm font-medium hidden sm:inline">HUMINEX Dashboard</span>
            </div>
            
            {/* Role Indicator */}
            <motion.div 
              key={activeRole}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r ${currentRoleConfig.color}`}
            >
              <RoleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              <span className="text-white text-[10px] sm:text-xs font-semibold">{currentRoleConfig.name}</span>
            </motion.div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-4 lg:mb-6 flex-wrap">
            <span className="text-white/40 text-[10px] sm:text-xs mr-1 sm:mr-2">RBAC:</span>
            {(Object.keys(roleConfigs) as Role[]).map((role) => {
              const config = roleConfigs[role];
              const Icon = config.icon;
              return (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`
                    flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium transition-all duration-300
                    ${activeRole === role 
                      ? `bg-gradient-to-r ${config.color} text-white shadow-lg` 
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden xs:inline">{config.name}</span>
                </button>
              );
            })}
          </div>

          {/* Live Metrics Bar */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 lg:mb-6 p-2 sm:p-3 rounded-lg bg-white/5 border border-white/10">
            {liveMetrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-xs sm:text-sm">{metric.value}</span>
                    <span className="text-white/40 text-[8px] sm:text-[10px] hidden sm:block">{metric.label}</span>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 text-[10px] sm:text-xs">Live</span>
            </div>
          </div>

          {/* Dashboard Grid - Fully Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3 mb-4 lg:mb-6">
            <AnimatePresence mode="popLayout">
              {dashboardModules.map((module, index) => {
                const isAccessible = accessibleModules.includes(module.id);
                const ModuleIcon = module.icon;
                
                return (
                  <motion.div
                    key={module.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: isAccessible ? 1 : 0.3, 
                      scale: 1,
                      filter: isAccessible ? "none" : "grayscale(100%)"
                    }}
                    transition={{ 
                      duration: 0.4, 
                      delay: animatingModules ? index * 0.05 : 0,
                      ease: "easeOut"
                    }}
                    onMouseEnter={() => setHoveredModule(module.id)}
                    onMouseLeave={() => setHoveredModule(null)}
                    className={`
                      relative p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border transition-all duration-300 cursor-pointer
                      ${isAccessible 
                        ? "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10" 
                        : "bg-white/[0.02] border-white/5"
                      }
                    `}
                  >
                    {/* Lock Overlay for restricted modules */}
                    {!isAccessible && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg sm:rounded-xl bg-black/40">
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg ${module.color}`}>
                        <ModuleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      {isAccessible && module.trend === "up" && (
                        <TrendingUp className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                    
                    <h3 className="text-white/80 text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 truncate">{module.name}</h3>
                    <div className="flex items-baseline gap-1 sm:gap-2">
                      <span className="text-white text-sm sm:text-base lg:text-lg font-bold">{module.value}</span>
                      <span className="text-green-400 text-[8px] sm:text-[10px] hidden sm:inline">{module.change}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Bottom Section - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Permissions Panel */}
            <motion.div 
              key={activeRole + "-perms"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="text-white/80 text-xs sm:text-sm font-medium">Access Permissions</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {currentRoleConfig.permissions.slice(0, 5).map((perm, i) => (
                  <motion.span
                    key={perm}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-primary/20 text-primary text-[10px] sm:text-xs"
                  >
                    {perm}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Live Activity */}
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                <span className="text-white/80 text-xs sm:text-sm font-medium">Live Activity</span>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                {notifications.slice(0, 2).map((notif, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs"
                  >
                    {notif.type === "success" && <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400 flex-shrink-0" />}
                    {notif.type === "warning" && <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 flex-shrink-0" />}
                    {notif.type === "info" && <Bell className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 flex-shrink-0" />}
                    <span className="text-white/70 flex-1 truncate">{notif.message}</span>
                    <span className="text-white/40 hidden sm:inline">{notif.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-white/80 text-xs sm:text-sm font-medium">Quick Stats</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <span className="text-white font-bold text-sm sm:text-lg block">98.5%</span>
                  <span className="text-white/40 text-[8px] sm:text-[10px]">SLA Met</span>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <span className="text-white font-bold text-sm sm:text-lg block">₹2.4Cr</span>
                  <span className="text-white/40 text-[8px] sm:text-[10px]">MRR</span>
                </div>
              </div>
            </div>
          </div>

          {/* RBAC Label */}
          <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/40">
            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="text-center">Role-Based Access Control • Click roles to see access levels</span>
          </div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute -top-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 sm:w-40 h-32 sm:h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
