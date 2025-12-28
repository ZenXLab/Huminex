import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Building2, Shield, BarChart3, Clock, FileText, 
  DollarSign, Bell, CheckCircle2, AlertTriangle, TrendingUp,
  Calendar, UserCheck, Briefcase, Settings, Eye, Lock
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
    permissions: ["All Modules", "User Management", "System Settings", "Analytics", "Audit Logs"]
  },
  hr_manager: {
    name: "HR Manager",
    color: "from-blue-500 to-cyan-500",
    icon: Users,
    permissions: ["Employees", "Attendance", "Leave", "Recruitment", "Performance"]
  },
  finance_lead: {
    name: "Finance Lead",
    color: "from-emerald-500 to-teal-500",
    icon: DollarSign,
    permissions: ["Payroll", "Invoices", "Expenses", "Budget", "Reports"]
  },
  employee: {
    name: "Employee",
    color: "from-amber-500 to-orange-500",
    icon: Briefcase,
    permissions: ["My Profile", "Attendance", "Leave Requests", "Payslips", "Tasks"]
  }
};

const dashboardModules = [
  { id: "workforce", name: "Workforce", icon: Users, value: "2,847", change: "+12%", color: "bg-blue-500/20 text-blue-400" },
  { id: "attendance", name: "Attendance", icon: Clock, value: "94.2%", change: "+2.1%", color: "bg-green-500/20 text-green-400" },
  { id: "payroll", name: "Payroll", icon: DollarSign, value: "₹24.5L", change: "Processed", color: "bg-emerald-500/20 text-emerald-400" },
  { id: "compliance", name: "Compliance", icon: Shield, value: "98%", change: "Healthy", color: "bg-purple-500/20 text-purple-400" },
  { id: "projects", name: "Projects", icon: Briefcase, value: "18", change: "Active", color: "bg-amber-500/20 text-amber-400" },
  { id: "analytics", name: "Analytics", icon: BarChart3, value: "Live", change: "Real-time", color: "bg-pink-500/20 text-pink-400" },
];

const notifications = [
  { type: "success", message: "Payroll processed for 847 employees", time: "2m ago" },
  { type: "warning", message: "3 leave requests pending approval", time: "15m ago" },
  { type: "info", message: "New compliance update available", time: "1h ago" },
];

const roleAccess: Record<Role, string[]> = {
  super_admin: ["workforce", "attendance", "payroll", "compliance", "projects", "analytics"],
  hr_manager: ["workforce", "attendance", "projects"],
  finance_lead: ["payroll", "compliance", "analytics"],
  employee: ["attendance", "projects"]
};

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
    <div className="relative w-full max-w-5xl mx-auto mt-12">
      {/* Glass Container */}
      <motion.div 
        className="relative rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 p-[1px]">
          <div className="absolute inset-0 rounded-2xl bg-[#0A0F1C]/95 backdrop-blur-xl" />
        </div>

        <div className="relative z-10 p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-white/60 text-sm font-medium">HUMINEX Dashboard</span>
            </div>
            
            {/* Role Indicator */}
            <motion.div 
              key={activeRole}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${currentRoleConfig.color}`}
            >
              <RoleIcon className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-semibold">{currentRoleConfig.name}</span>
            </motion.div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-white/40 text-xs mr-2">RBAC View:</span>
            {(Object.keys(roleConfigs) as Role[]).map((role) => {
              const config = roleConfigs[role];
              const Icon = config.icon;
              return (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300
                    ${activeRole === role 
                      ? `bg-gradient-to-r ${config.color} text-white shadow-lg` 
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {config.name}
                </button>
              );
            })}
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
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
                      delay: animatingModules ? index * 0.1 : 0,
                      ease: "easeOut"
                    }}
                    onMouseEnter={() => setHoveredModule(module.id)}
                    onMouseLeave={() => setHoveredModule(null)}
                    className={`
                      relative p-4 rounded-xl border transition-all duration-300 cursor-pointer
                      ${isAccessible 
                        ? "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10" 
                        : "bg-white/[0.02] border-white/5"
                      }
                    `}
                  >
                    {/* Lock Overlay for restricted modules */}
                    {!isAccessible && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
                        <Lock className="w-5 h-5 text-white/40" />
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${module.color}`}>
                        <ModuleIcon className="w-4 h-4" />
                      </div>
                      {isAccessible && hoveredModule === module.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-1 rounded bg-white/10"
                        >
                          <Eye className="w-3 h-3 text-white/60" />
                        </motion.div>
                      )}
                    </div>
                    
                    <h3 className="text-white/80 text-xs font-medium mb-1">{module.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-white text-lg font-bold">{module.value}</span>
                      <span className="text-green-400 text-xs">{module.change}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Permissions Panel */}
            <motion.div 
              key={activeRole + "-perms"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-white/80 text-sm font-medium">Access Permissions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentRoleConfig.permissions.map((perm, i) => (
                  <motion.span
                    key={perm}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-2 py-1 rounded-md bg-primary/20 text-primary text-xs"
                  >
                    {perm}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Live Activity */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-accent" />
                <span className="text-white/80 text-sm font-medium">Live Activity</span>
                <span className="ml-auto flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-400 text-xs">Live</span>
                </span>
              </div>
              <div className="space-y-2">
                {notifications.slice(0, 2).map((notif, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    {notif.type === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
                    {notif.type === "warning" && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                    {notif.type === "info" && <Bell className="w-3.5 h-3.5 text-blue-400" />}
                    <span className="text-white/70 flex-1 truncate">{notif.message}</span>
                    <span className="text-white/40">{notif.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* RBAC Label */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
            <Shield className="w-3.5 h-3.5" />
            <span>Role-Based Access Control (RBAC) • Click roles above to see different access levels</span>
          </div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
