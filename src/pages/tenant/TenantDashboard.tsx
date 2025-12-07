import React from "react";
import { WorkforceWidget } from "@/components/tenant/widgets/WorkforceWidget";
import { AttendanceWidget } from "@/components/tenant/widgets/AttendanceWidget";
import { TasksProjectsWidget } from "@/components/tenant/widgets/TasksProjectsWidget";
import { PayrollWidget } from "@/components/tenant/widgets/PayrollWidget";
import { RecruitmentWidget } from "@/components/tenant/widgets/RecruitmentWidget";
import { FinanceWidget } from "@/components/tenant/widgets/FinanceWidget";
import { BGVWidget } from "@/components/tenant/widgets/BGVWidget";
import { InsuranceWidget } from "@/components/tenant/widgets/InsuranceWidget";
import { ComplianceWidget } from "@/components/tenant/widgets/ComplianceWidget";
import { ProximaAIWidget } from "@/components/tenant/widgets/ProximaAIWidget";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, Download, Bell } from "lucide-react";
import { useTenant } from "@/components/tenant/TenantLayout";

const TenantDashboard: React.FC = () => {
  const { tenantName, currentPlan } = useTenant();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E3A]">
            Welcome back, {tenantName}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Calendar className="w-4 h-4" />
              {currentDate}
            </div>
            <div className="w-1 h-1 rounded-full bg-[#6B7280]" />
            <span className="text-sm text-[#6B7280]">
              Here's your organization overview
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-gray-200 hover:bg-[#F7F9FC] text-[#6B7280] hover:text-[#0F1E3A]"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-gray-200 hover:bg-[#F7F9FC] text-[#6B7280] hover:text-[#0F1E3A]"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </Button>
          <Button 
            size="sm" 
            className="gap-2 bg-[#005EEB] hover:bg-[#004ACC] text-white shadow-lg shadow-[#005EEB]/20"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Employees", value: "184", change: "+12 this month", color: "#005EEB" },
          { label: "Present Today", value: "86%", change: "158 employees", color: "#0FB07A" },
          { label: "Open Tickets", value: "23", change: "4 urgent", color: "#FFB020" },
          { label: "Pending Approvals", value: "8", change: "Leave & expenses", color: "#E23E57" },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="text-sm text-[#6B7280] mb-1">{stat.label}</p>
            <p 
              className="text-2xl font-bold transition-colors duration-200"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-[#9CA3AF] mt-1 group-hover:text-[#6B7280] transition-colors">
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1 */}
        <div className="space-y-5">
          <WorkforceWidget />
          <RecruitmentWidget />
          <ComplianceWidget />
        </div>

        {/* Column 2 */}
        <div className="space-y-5">
          <AttendanceWidget />
          <PayrollWidget />
          <BGVWidget />
        </div>

        {/* Column 3 */}
        <div className="space-y-5">
          <TasksProjectsWidget />
          <FinanceWidget />
          <InsuranceWidget />
        </div>
      </div>

      {/* Full Width AI Widget */}
      <div className="grid grid-cols-1">
        <ProximaAIWidget />
      </div>
    </div>
  );
};

export default TenantDashboard;
