import React, { useState } from "react";
import {
  DollarSign,
  Play,
  Eye,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  TrendingUp,
  ChevronRight,
  Plus,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { RunPayrollModal } from "@/components/tenant/modals/RunPayrollModal";

const mockPayrollRuns = [
  { id: 1, month: "January 2026", status: "draft", employees: 184, gross: 1850000, net: 1620000, runDate: null },
  { id: 2, month: "December 2025", status: "complete", employees: 182, gross: 1820000, net: 1598000, runDate: "2025-12-31" },
  { id: 3, month: "November 2025", status: "complete", employees: 180, gross: 1790000, net: 1570000, runDate: "2025-11-30" },
  { id: 4, month: "October 2025", status: "complete", employees: 178, gross: 1760000, net: 1545000, runDate: "2025-10-31" },
];

const salaryComponents = [
  { name: "Basic Salary", type: "earning", percent: 50 },
  { name: "HRA", type: "earning", percent: 25 },
  { name: "Special Allowance", type: "earning", percent: 15 },
  { name: "Conveyance", type: "earning", fixed: 1600 },
  { name: "PF (Employee)", type: "deduction", percent: 12 },
  { name: "Professional Tax", type: "deduction", fixed: 200 },
  { name: "TDS", type: "deduction", variable: true },
];

const TenantPayroll: React.FC = () => {
  const [showRunPayroll, setShowRunPayroll] = useState(false);
  const [selectedRun, setSelectedRun] = useState<typeof mockPayrollRuns[0] | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "complete":
        return { color: "#0FB07A", bg: "#0FB07A", icon: CheckCircle, label: "Complete" };
      case "processing":
        return { color: "#FFB020", bg: "#FFB020", icon: Clock, label: "Processing" };
      case "draft":
        return { color: "#6B7280", bg: "#6B7280", icon: FileText, label: "Draft" };
      default:
        return { color: "#6B7280", bg: "#6B7280", icon: FileText, label: status };
    }
  };

  const currentRun = mockPayrollRuns[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Payroll</h1>
          <p className="text-sm text-[#6B7280]">Manage payroll runs, salary components, and compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-200 text-[#6B7280] gap-2">
            <Settings className="w-4 h-4" /> Settings
          </Button>
          <Button
            className="bg-[#E23E57] hover:bg-[#C73550] gap-2"
            onClick={() => setShowRunPayroll(true)}
          >
            <Play className="w-4 h-4" /> Run Payroll
          </Button>
        </div>
      </div>

      {/* Current Cycle Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-[#6B7280]">Current Payroll Cycle</p>
            <h2 className="text-xl font-bold text-[#0F1E3A]">{currentRun.month}</h2>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "capitalize px-3 py-1",
              `bg-[${getStatusConfig(currentRun.status).bg}]/10 text-[${getStatusConfig(currentRun.status).color}] border-[${getStatusConfig(currentRun.status).color}]/20`
            )}
          >
            <FileText className="w-3 h-3 mr-1" />
            {getStatusConfig(currentRun.status).label}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-[#F7F9FC] rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-[#005EEB]" />
              <span className="text-sm text-[#6B7280]">Employees</span>
            </div>
            <p className="text-2xl font-bold text-[#0F1E3A]">{currentRun.employees}</p>
          </div>
          <div className="p-4 bg-[#F7F9FC] rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#0FB07A]" />
              <span className="text-sm text-[#6B7280]">Gross Payroll</span>
            </div>
            <p className="text-2xl font-bold text-[#0F1E3A]">{formatCurrency(currentRun.gross)}</p>
          </div>
          <div className="p-4 bg-[#F7F9FC] rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-[#00C2FF]" />
              <span className="text-sm text-[#6B7280]">Net Payout</span>
            </div>
            <p className="text-2xl font-bold text-[#0F1E3A]">{formatCurrency(currentRun.net)}</p>
          </div>
          <div className="p-4 bg-[#FFB020]/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-[#FFB020]" />
              <span className="text-sm text-[#6B7280]">Pending Actions</span>
            </div>
            <p className="text-2xl font-bold text-[#FFB020]">12</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Payroll Progress</span>
            <span className="font-medium text-[#0F1E3A]">2 of 4 steps complete</span>
          </div>
          <Progress value={50} className="h-2" />
          <div className="flex justify-between mt-3">
            {["Collect Data", "Review", "Approve", "Disburse"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    i < 2 ? "bg-[#0FB07A] text-white" : "bg-[#F7F9FC] text-[#6B7280]"
                  )}
                >
                  {i < 2 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn("text-xs", i < 2 ? "text-[#0F1E3A]" : "text-[#6B7280]")}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="runs">
        <TabsList className="bg-[#F7F9FC]">
          <TabsTrigger value="runs">Payroll Runs</TabsTrigger>
          <TabsTrigger value="components">Salary Components</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="runs" className="mt-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}>
            <table className="w-full">
              <thead className="bg-[#F7F9FC] border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Month</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Employees</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Gross</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Net</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Run Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockPayrollRuns.map((run) => {
                  const statusConfig = getStatusConfig(run.status);
                  return (
                    <tr key={run.id} className="hover:bg-[#F7F9FC] transition-colors">
                      <td className="px-4 py-4 font-medium text-[#0F1E3A]">{run.month}</td>
                      <td className="px-4 py-4 text-[#6B7280]">{run.employees}</td>
                      <td className="px-4 py-4 text-[#0F1E3A]">{formatCurrency(run.gross)}</td>
                      <td className="px-4 py-4 text-[#0FB07A] font-medium">{formatCurrency(run.net)}</td>
                      <td className="px-4 py-4">
                        <Badge
                          variant="outline"
                          className={`bg-[${statusConfig.bg}]/10 text-[${statusConfig.color}] border-[${statusConfig.color}]/20 capitalize`}
                        >
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-[#6B7280]">{run.runDate || "—"}</td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-[#005EEB] gap-1">
                          View <ChevronRight className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="components" className="mt-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0F1E3A]">Salary Structure</h3>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="w-4 h-4" /> Add Component
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-[#0FB07A] mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Earnings
                </h4>
                <div className="space-y-2">
                  {salaryComponents
                    .filter((c) => c.type === "earning")
                    .map((comp) => (
                      <div key={comp.name} className="flex items-center justify-between p-3 bg-[#F7F9FC] rounded-lg">
                        <span className="text-sm text-[#0F1E3A]">{comp.name}</span>
                        <span className="text-sm font-medium text-[#0FB07A]">
                          {comp.percent ? `${comp.percent}%` : formatCurrency(comp.fixed || 0)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#E23E57] mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Deductions
                </h4>
                <div className="space-y-2">
                  {salaryComponents
                    .filter((c) => c.type === "deduction")
                    .map((comp) => (
                      <div key={comp.name} className="flex items-center justify-between p-3 bg-[#F7F9FC] rounded-lg">
                        <span className="text-sm text-[#0F1E3A]">{comp.name}</span>
                        <span className="text-sm font-medium text-[#E23E57]">
                          {comp.percent ? `${comp.percent}%` : comp.variable ? "Variable" : formatCurrency(comp.fixed || 0)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { title: "PF Filing", deadline: "Feb 15, 2026", status: "pending" },
              { title: "ESI Filing", deadline: "Feb 21, 2026", status: "pending" },
              { title: "TDS Payment", deadline: "Feb 7, 2026", status: "complete" },
              { title: "Form 24Q", deadline: "Jan 31, 2026", status: "complete" },
              { title: "PT Filing", deadline: "Feb 28, 2026", status: "pending" },
              { title: "Gratuity Report", deadline: "Mar 31, 2026", status: "upcoming" },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                style={{ boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-[#0F1E3A]">{item.title}</h4>
                  {item.status === "complete" ? (
                    <CheckCircle className="w-5 h-5 text-[#0FB07A]" />
                  ) : item.status === "pending" ? (
                    <Clock className="w-5 h-5 text-[#FFB020]" />
                  ) : (
                    <Calendar className="w-5 h-5 text-[#6B7280]" />
                  )}
                </div>
                <p className="text-sm text-[#6B7280]">Due: {item.deadline}</p>
                {item.status === "pending" && (
                  <Button size="sm" className="w-full mt-3 bg-[#005EEB] hover:bg-[#004ACC]">
                    File Now
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <RunPayrollModal open={showRunPayroll} onOpenChange={setShowRunPayroll} />
    </div>
  );
};

export default TenantPayroll;
