import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle, Clock, AlertTriangle, ArrowUpRight, FileSearch, Users, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "../TenantLayout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const mockData = {
  pending: 5,
  completed: 42,
  failed: 2,
  avgTat: "2.5 days",
  recentChecks: [
    { name: "John Smith", status: "completed", date: "Jan 5", type: "Full" },
    { name: "Sarah Johnson", status: "pending", date: "Jan 4", type: "Basic" },
    { name: "Mike Chen", status: "failed", date: "Jan 3", type: "Full" },
  ],
  progressPercent: 85,
};

export const BGVWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();
  const [animatedStats, setAnimatedStats] = useState({ pending: 0, completed: 0, failed: 0 });
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedStats({
        pending: Math.round(mockData.pending * easeOut),
        completed: Math.round(mockData.completed * easeOut),
        failed: Math.round(mockData.failed * easeOut),
      });
      setAnimatedProgress(Math.round(mockData.progressPercent * easeOut));
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "#0FB07A";
      case "pending": return "#FFB020";
      case "failed": return "#E23E57";
      default: return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "pending": return Clock;
      case "failed": return AlertTriangle;
      default: return Clock;
    }
  };

  const handleViewQueue = () => {
    toast.info("Opening BGV verification queue...");
    navigate("/tenant/bgv");
  };

  const handleRetry = (name: string) => {
    toast.success(`Retrying BGV for ${name}...`);
  };

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200/80 p-5 h-[200px] flex flex-col animate-scale-in stagger-6" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#005EEB]/15 to-[#00C2FF]/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#005EEB]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#0F1E3A]">BGV Status</h3>
            <p className="text-[10px] text-[#6B7280]">TAT: {mockData.avgTat}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-[#6B7280]">Completion</p>
            <p className="text-sm font-bold text-[#005EEB]">{animatedProgress}%</p>
          </div>
          <div className="w-12 h-12">
            <svg className="w-full h-full -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#F7F9FC" strokeWidth="4" />
              <circle 
                cx="24" cy="24" r="20" fill="none" 
                stroke="url(#bgvGradient)" strokeWidth="4" 
                strokeDasharray={`${(animatedProgress / 100) * 126} 126`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="bgvGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#005EEB" />
                  <stop offset="100%" stopColor="#00C2FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-1">
        <button
          onClick={() => {
            toast.info(`${mockData.pending} verifications pending`);
            navigate("/tenant/bgv?status=pending");
          }}
          className="flex-1 flex flex-col items-center justify-center p-2 bg-gradient-to-br from-[#FFB020]/15 to-[#FFB020]/5 rounded-xl hover:from-[#FFB020]/20 hover:to-[#FFB020]/10 transition-all group hover-lift animate-fade-up"
        >
          <Clock className="w-5 h-5 text-[#FFB020] mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-xl font-bold text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">{animatedStats.pending}</p>
          <p className="text-[10px] text-[#6B7280] font-medium">Pending</p>
        </button>
        <button
          onClick={() => {
            toast.success(`${mockData.completed} verifications completed`);
            navigate("/tenant/bgv?status=completed");
          }}
          className="flex-1 flex flex-col items-center justify-center p-2 bg-gradient-to-br from-[#0FB07A]/15 to-[#0FB07A]/5 rounded-xl hover:from-[#0FB07A]/20 hover:to-[#0FB07A]/10 transition-all group hover-lift animate-fade-up stagger-1"
        >
          <CheckCircle className="w-5 h-5 text-[#0FB07A] mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-xl font-bold text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">{animatedStats.completed}</p>
          <p className="text-[10px] text-[#6B7280] font-medium">Completed</p>
        </button>
        <button
          onClick={() => {
            toast.error(`${mockData.failed} verifications failed - action required`);
            navigate("/tenant/bgv?status=failed");
          }}
          className={cn(
            "flex-1 flex flex-col items-center justify-center p-2 bg-gradient-to-br from-[#E23E57]/15 to-[#E23E57]/5 rounded-xl hover:from-[#E23E57]/20 hover:to-[#E23E57]/10 transition-all group hover-lift relative animate-fade-up stagger-2",
            mockData.failed > 0 && "animate-pulse-attention"
          )}
        >
          {mockData.failed > 0 && <div className="notification-dot" />}
          <AlertTriangle className="w-5 h-5 text-[#E23E57] mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-xl font-bold text-[#E23E57]">{animatedStats.failed}</p>
          <p className="text-[10px] text-[#6B7280] font-medium">Failed</p>
        </button>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="w-full mt-3 text-[#005EEB] hover:text-[#004ACC] hover:bg-[#005EEB]/5 gap-1 group h-9"
        onClick={handleViewQueue}
      >
        View BGV Queue 
        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </Button>
    </div>
  );
};