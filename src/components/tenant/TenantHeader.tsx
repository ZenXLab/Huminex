import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  UserPlus,
  Ticket,
  HelpCircle,
  ChevronDown,
  User,
  Settings,
  CreditCard,
  RefreshCw,
  LogOut,
  Building2,
  Sparkles,
  Clock,
  Crown,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "./TenantLayout";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UpgradePlanModal } from "./modals/UpgradePlanModal";
import { TenantNotificationBell } from "./TenantNotificationBell";


export const TenantHeader: React.FC = () => {
  const { isTrialMode, trialDaysLeft, tenantName, currentPlan, billingCycleEnd } = useTenant();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Calculate days until billing cycle ends
  const daysUntilBilling = Math.ceil(
    (new Date(billingCycleEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !searchFocused) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchFocused]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success": return "bg-[#0FB07A]/10 text-[#0FB07A]";
      case "warning": return "bg-[#FFB020]/10 text-[#FFB020]";
      case "danger": return "bg-[#E23E57]/10 text-[#E23E57]";
      default: return "bg-[#005EEB]/10 text-[#005EEB]";
    }
  };

  const getPlanColor = () => {
    if (isTrialMode) return "from-[#FFB020] to-[#FF8C00]";
    switch (currentPlan) {
      case "Pro": return "from-[#005EEB] to-[#00C2FF]";
      case "Business": return "from-[#8B5CF6] to-[#A78BFA]";
      case "Enterprise": return "from-[#0F1E3A] to-[#1E3A5F]";
      default: return "from-[#6B7280] to-[#9CA3AF]";
    }
  };

  const getPlanIcon = () => {
    if (isTrialMode) return <Clock className="w-3.5 h-3.5" />;
    switch (currentPlan) {
      case "Enterprise": return <Crown className="w-3.5 h-3.5" />;
      case "Business": return <Zap className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-white border-b border-gray-200 flex items-center px-6">
        {/* Left: Logo + Tenant Name */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#005EEB] to-[#00C2FF] flex items-center justify-center shadow-lg shadow-[#005EEB]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#005EEB] uppercase tracking-widest">HUMINEX</span>
            <span className="text-sm font-semibold text-[#0F1E3A] truncate max-w-[160px]">
              {tenantName}
            </span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl mx-auto px-8">
          <div className={cn(
            "relative transition-all duration-200",
            searchFocused && "scale-[1.02]"
          )}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <Input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search employees, tasks, policies..."
              className="w-full h-11 pl-11 pr-14 bg-[#F7F9FC] border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#005EEB]/20 focus:border-[#005EEB] text-sm"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-medium text-[#6B7280] bg-white border border-gray-200 rounded">
              /
            </kbd>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Plan/Trial Badge with Timer */}
          <div 
            onClick={() => isTrialMode && setShowUpgradeModal(true)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all",
              "bg-gradient-to-r text-white shadow-md hover:shadow-lg",
              getPlanColor()
            )}
          >
            {getPlanIcon()}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wide">
                {isTrialMode ? "Trial" : currentPlan}
              </span>
              <span className="text-[10px] font-medium opacity-90">
                {isTrialMode 
                  ? `${trialDaysLeft} days left` 
                  : `${daysUntilBilling} days to billing`
                }
              </span>
            </div>
            {isTrialMode && (
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            )}
          </div>

          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="bg-[#005EEB] hover:bg-[#004ACC] text-white gap-2 h-9 px-4 rounded-lg shadow-md shadow-[#005EEB]/20">
                <Plus className="w-4 h-4" />
                <span className="hidden lg:inline font-medium">Create</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/tenant/recruitment")}>
                <Plus className="w-4 h-4 mr-2" /> Create Job
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/tenant/workforce")}>
                <UserPlus className="w-4 h-4 mr-2" /> Invite Employee
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Ticket className="w-4 h-4 mr-2" /> Raise Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications - Using TenantNotificationBell */}
          <TenantNotificationBell />

          {/* Help */}
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-[#F7F9FC]">
            <HelpCircle className="w-5 h-5 text-[#6B7280]" />
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2 rounded-lg hover:bg-[#F7F9FC]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#005EEB] to-[#00C2FF] flex items-center justify-center ring-2 ring-white shadow-md">
                  <span className="text-xs font-bold text-white">AP</span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#6B7280]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="font-semibold text-sm text-[#0F1E3A]">Admin User</p>
                <p className="text-xs text-[#6B7280]">admin@acmepharma.com</p>
              </div>
              <DropdownMenuItem onClick={() => navigate("/tenant/settings")}>
                <User className="w-4 h-4 mr-2" /> My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/tenant/settings")}>
                <Building2 className="w-4 h-4 mr-2" /> Tenant Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/tenant/settings/billing")}>
                <CreditCard className="w-4 h-4 mr-2" /> Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <RefreshCw className="w-4 h-4 mr-2" /> Switch Role
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#E23E57] focus:text-[#E23E57]">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <UpgradePlanModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
};
