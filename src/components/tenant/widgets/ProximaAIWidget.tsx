import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Sparkles, AlertTriangle, DollarSign, FileCheck, Send, Lock, Zap, TrendingDown, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTenant } from "../TenantLayout";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const mockData = {
  attritionRisks: [
    { team: "Operations", risk: 23, status: "high" },
    { team: "Sales", risk: 15, status: "medium" },
    { team: "Engineering", risk: 8, status: "low" },
    { team: "Marketing", risk: 12, status: "medium" },
    { team: "HR", risk: 5, status: "low" },
  ],
  highRiskEmployees: [
    { name: "John Smith", team: "Ops", score: 0.78, action: "Schedule 1-on-1" },
    { name: "Sarah Lee", team: "Sales", score: 0.72, action: "Review workload" },
    { name: "Mike Chen", team: "Ops", score: 0.68, action: "Career discussion" },
  ],
  payrollAnomalies: [
    { type: "Overtime spike", severity: "warning", amount: "₹45,000" },
    { type: "Duplicate entry", severity: "danger", amount: "₹12,500" },
  ],
  complianceRisks: [
    { type: "PF Filing", deadline: "Feb 15", status: "warning" },
    { type: "ESIC Update", deadline: "Feb 28", status: "ok" },
  ],
  savedAmount: 125000,
  automationsRun: 45,
};

export const ProximaAIWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [animatedSavings, setAnimatedSavings] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedSavings(Math.round(mockData.savedAmount * easeOut));
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const getRiskColor = (status: string) => {
    switch (status) {
      case "high": return "#E23E57";
      case "medium": return "#FFB020";
      default: return "#0FB07A";
    }
  };

  const handleSendQuery = () => {
    if (!query.trim()) return;
    setIsTyping(true);
    toast.info(`Processing: "${query}"`);
    setTimeout(() => {
      toast.success("AI Analysis: Operations team shows 23% attrition risk due to overtime patterns and engagement scores. Recommended actions: workload review and team restructuring.");
      setIsTyping(false);
      setQuery("");
    }, 2000);
  };

  const handleEmployeeAction = (emp: typeof mockData.highRiskEmployees[0]) => {
    toast.success(`Action initiated: ${emp.action} for ${emp.name}`);
  };

  const handleAnomalyClick = (anomaly: typeof mockData.payrollAnomalies[0]) => {
    toast.info(`Opening details for: ${anomaly.type}`);
    navigate("/tenant/payroll");
  };

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200/80 p-6 col-span-3 animate-scale-in" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#FFB020]/15 to-[#FFB020]/5 rounded-lg border border-[#FFB020]/20">
          <Lock className="w-4 h-4 text-[#FFB020]" />
          <span className="text-xs font-semibold text-[#FFB020]">DEMO MODE</span>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#005EEB] via-[#00C2FF] to-[#8B5CF6] flex items-center justify-center animate-glow-pulse">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#0F1E3A] text-xl flex items-center gap-2">
              Proxima AI Insights
              <Sparkles className="w-5 h-5 text-[#00C2FF] animate-pulse" />
            </h3>
            <p className="text-sm text-[#6B7280]">Intelligent predictions and recommendations</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-[#6B7280]">Saved This Month</p>
            <p className="text-lg font-bold text-[#0FB07A]">₹{animatedSavings.toLocaleString()}</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-right">
            <p className="text-xs text-[#6B7280]">Automations Run</p>
            <p className="text-lg font-bold text-[#005EEB]">{mockData.automationsRun}</p>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Attrition Risk */}
        <div className="bg-gradient-to-br from-[#F7F9FC] to-[#FEF3F2] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#E23E57]/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-[#E23E57]" />
              </div>
              <h4 className="font-semibold text-[#0F1E3A]">Attrition Risk</h4>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#005EEB] text-xs gap-1 group"
              onClick={() => navigate("/tenant/intelligence")}
            >
              Details
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
          
          {/* Team Heatmap */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {mockData.attritionRisks.map((team, i) => (
              <button
                key={team.team}
                onClick={() => toast.info(`${team.team}: ${team.risk}% attrition risk`)}
                className="aspect-square rounded-xl flex flex-col items-center justify-center text-center p-1 cursor-pointer hover:scale-110 transition-all duration-300 animate-fade-up hover-lift"
                style={{ 
                  backgroundColor: `${getRiskColor(team.status)}15`,
                  animationDelay: `${i * 100}ms`
                }}
              >
                <span className="text-lg font-bold" style={{ color: getRiskColor(team.status) }}>
                  {team.risk}%
                </span>
                <span className="text-[8px] text-[#6B7280] font-medium truncate w-full">{team.team}</span>
              </button>
            ))}
          </div>

          {/* High Risk Employees */}
          <p className="text-xs font-semibold text-[#6B7280] mb-2 uppercase tracking-wide">High Risk Employees</p>
          <div className="space-y-2">
            {mockData.highRiskEmployees.map((emp, i) => (
              <button
                key={emp.name}
                onClick={() => handleEmployeeAction(emp)}
                className="flex items-center justify-between w-full p-3 bg-white rounded-xl border border-gray-100 hover:border-[#005EEB]/30 hover:shadow-md transition-all group animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">{emp.name}</p>
                  <p className="text-xs text-[#6B7280]">{emp.team}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#E23E57]">{(emp.score * 100).toFixed(0)}%</p>
                  <span className="text-[10px] text-[#005EEB] font-medium">{emp.action}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payroll Anomalies */}
        <div className="bg-gradient-to-br from-[#F7F9FC] to-[#FFFBEB] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#FFB020]/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#FFB020]" />
              </div>
              <h4 className="font-semibold text-[#0F1E3A]">Payroll Anomalies</h4>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            {mockData.payrollAnomalies.map((anomaly, i) => (
              <button
                key={i}
                onClick={() => handleAnomalyClick(anomaly)}
                className={cn(
                  "w-full p-4 rounded-xl border-l-4 text-left hover:shadow-md transition-all group animate-fade-up",
                  anomaly.severity === "danger" 
                    ? "bg-[#E23E57]/10 border-[#E23E57] hover:bg-[#E23E57]/15" 
                    : "bg-[#FFB020]/10 border-[#FFB020] hover:bg-[#FFB020]/15"
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#0F1E3A]">{anomaly.type}</span>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                      anomaly.severity === "danger" 
                        ? "bg-[#E23E57]/20 text-[#E23E57]" 
                        : "bg-[#FFB020]/20 text-[#FFB020]"
                    )}
                  >
                    {anomaly.severity}
                  </span>
                </div>
                <p className="text-xl font-bold text-[#0F1E3A]">{anomaly.amount}</p>
              </button>
            ))}
          </div>

          <div className="p-4 bg-white rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-[#6B7280] mb-2 uppercase tracking-wide">Recommended Actions</p>
            <ul className="space-y-2">
              {["Review overtime entries", "Cross-check duplicate IDs", "Validate contractor hours"].map((item, i) => (
                <li 
                  key={item} 
                  className="flex items-center gap-2 text-sm text-[#0F1E3A] animate-fade-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#005EEB] to-[#00C2FF]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Compliance Risk */}
        <div className="bg-gradient-to-br from-[#F7F9FC] to-[#F0F9FF] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#005EEB]/10 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-[#005EEB]" />
              </div>
              <h4 className="font-semibold text-[#0F1E3A]">Compliance Risk</h4>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            {mockData.complianceRisks.map((risk, i) => (
              <button
                key={risk.type}
                onClick={() => {
                  toast.info(`Opening ${risk.type} details`);
                  navigate("/tenant/compliance");
                }}
                className="flex items-center justify-between w-full p-4 bg-white rounded-xl border border-gray-100 hover:border-[#005EEB]/30 hover:shadow-md transition-all group animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">{risk.type}</p>
                  <p className="text-xs text-[#6B7280]">Due: {risk.deadline}</p>
                </div>
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                    risk.status === "warning" ? "bg-[#FFB020]/15" : "bg-[#0FB07A]/15"
                  )}
                >
                  {risk.status === "warning" ? (
                    <AlertTriangle className="w-5 h-5 text-[#FFB020]" />
                  ) : (
                    <FileCheck className="w-5 h-5 text-[#0FB07A]" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => toast.success("Generating PF forms automatically...")}
            className="w-full p-4 bg-gradient-to-r from-[#005EEB]/10 to-[#00C2FF]/10 rounded-xl border border-[#005EEB]/20 hover:from-[#005EEB]/15 hover:to-[#00C2FF]/15 transition-all group"
          >
            <p className="text-xs font-semibold text-[#005EEB] mb-1">Mitigation Playbook</p>
            <div className="flex items-center gap-2 text-sm text-[#005EEB] font-medium">
              <Zap className="w-4 h-4 group-hover:animate-pulse" /> 
              Auto-generate PF forms
              <ArrowRight className="w-3 h-3 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Natural Language Query */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
            placeholder="Ask ATLAS: Why is attrition risk high in Ops?"
            className="h-14 pl-5 pr-14 bg-gradient-to-r from-[#F7F9FC] to-white border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#005EEB]/20 text-base"
          />
          <Button
            size="icon"
            onClick={handleSendQuery}
            disabled={isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-gradient-to-r from-[#005EEB] to-[#00C2FF] hover:from-[#004ACC] hover:to-[#00A8D6] rounded-xl shadow-lg shadow-[#005EEB]/30"
          >
            {isTyping ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <Button
          variant="outline"
          className="h-14 px-6 border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] hover:border-[#005EEB]/30 gap-2 rounded-2xl hover-lift"
          onClick={() => navigate("/tenant/intelligence")}
        >
          <Brain className="w-5 h-5" /> Open Proxima
        </Button>
      </div>

      {isTrialMode && (
        <p className="text-center text-xs text-[#6B7280] mt-4">
          Running in demo mode with synthetic predictions.{" "}
          <button 
            onClick={() => navigate("/tenant/settings/billing")}
            className="text-[#005EEB] hover:underline font-medium"
          >
            Upgrade for real-time AI insights
          </button>
        </p>
      )}
    </div>
  );
};