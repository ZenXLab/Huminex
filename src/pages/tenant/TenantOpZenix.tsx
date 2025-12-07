import React from "react";
import { Zap, Play, Pause, Plus, Clock, CheckCircle2, AlertTriangle, GitBranch, ArrowRight, Settings, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const workflows = [
  { id: 1, name: "Employee Onboarding", status: "active", runs: 24, successRate: 98, lastRun: "2 hours ago", trigger: "New Employee Added" },
  { id: 2, name: "Payroll Processing", status: "active", runs: 12, successRate: 100, lastRun: "5 days ago", trigger: "Monthly Schedule" },
  { id: 3, name: "Leave Approval", status: "active", runs: 156, successRate: 95, lastRun: "10 mins ago", trigger: "Leave Request" },
  { id: 4, name: "BGV Re-check", status: "paused", runs: 8, successRate: 87, lastRun: "2 weeks ago", trigger: "Annual Schedule" },
  { id: 5, name: "Contract Renewal Alert", status: "active", runs: 34, successRate: 100, lastRun: "1 day ago", trigger: "30 Days Before Expiry" },
];

const templates = [
  { name: "Onboarding Sequence", category: "HR", popularity: "Popular" },
  { name: "Payroll Run Automation", category: "Finance", popularity: "Popular" },
  { name: "Compliance Reminder", category: "Legal", popularity: "New" },
  { name: "Performance Review Cycle", category: "HR", popularity: "" },
  { name: "Asset Allocation", category: "IT", popularity: "" },
];

const recentRuns = [
  { id: 1, workflow: "Leave Approval", status: "success", duration: "2.3s", timestamp: "10 mins ago" },
  { id: 2, workflow: "Leave Approval", status: "success", duration: "1.8s", timestamp: "25 mins ago" },
  { id: 3, workflow: "Employee Onboarding", status: "success", duration: "12.4s", timestamp: "2 hours ago" },
  { id: 4, workflow: "Contract Renewal Alert", status: "success", duration: "3.1s", timestamp: "1 day ago" },
  { id: 5, workflow: "BGV Re-check", status: "failed", duration: "45.2s", timestamp: "2 weeks ago" },
];

const TenantOpZenix: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">OpZenix Automations</h1>
          <p className="text-sm text-[#6B7280] mt-1">Build and manage workflow automations</p>
        </div>
        <Button className="bg-[#005EEB] hover:bg-[#004ACC] gap-2">
          <Plus className="w-4 h-4" />
          Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">5</p>
                <p className="text-xs text-[#6B7280]">Active Workflows</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0FB07A]/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#0FB07A]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">234</p>
                <p className="text-xs text-[#6B7280]">Total Runs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#005EEB]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">96%</p>
                <p className="text-xs text-[#6B7280]">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFB020]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FFB020]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">142h</p>
                <p className="text-xs text-[#6B7280]">Time Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflows List */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">My Workflows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-[#F7F9FC] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${workflow.status === 'active' ? 'bg-[#0FB07A]/10' : 'bg-[#6B7280]/10'}`}>
                    <GitBranch className={`w-5 h-5 ${workflow.status === 'active' ? 'text-[#0FB07A]' : 'text-[#6B7280]'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#0F1E3A]">{workflow.name}</p>
                      <Badge variant="outline" className={workflow.status === 'active' ? 'text-[#0FB07A] border-[#0FB07A]/30' : 'text-[#6B7280]'}>
                        {workflow.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#6B7280]">Trigger: {workflow.trigger}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#0F1E3A]">{workflow.runs} runs</p>
                    <p className="text-xs text-[#6B7280]">{workflow.successRate}% success</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Templates */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {templates.map((template, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#F7F9FC] rounded-lg hover:bg-[#F0F4F8] transition-colors cursor-pointer group">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-[#0F1E3A]">{template.name}</p>
                    {template.popularity && (
                      <Badge className={template.popularity === 'Popular' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'bg-[#0FB07A]/10 text-[#0FB07A]'}>
                        {template.popularity}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280]">{template.category}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#005EEB] transition-colors" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Runs */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Executions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F9FC]">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Workflow</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Status</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Duration</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((run) => (
                  <tr key={run.id} className="border-b border-gray-100 hover:bg-[#F7F9FC]/50 transition-colors">
                    <td className="p-4 font-medium text-[#0F1E3A]">{run.workflow}</td>
                    <td className="p-4">
                      <Badge className={run.status === 'success' ? 'bg-[#0FB07A]/10 text-[#0FB07A]' : 'bg-[#E23E57]/10 text-[#E23E57]'}>
                        {run.status === 'success' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                        {run.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-[#6B7280]">{run.duration}</td>
                    <td className="p-4 text-sm text-[#6B7280]">{run.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantOpZenix;
