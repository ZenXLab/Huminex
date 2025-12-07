import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Workflow, Play, Pause, CheckCircle, XCircle, Clock,
  AlertTriangle, Search, Filter, Download, RefreshCw,
  ChevronRight, ChevronDown, RotateCcw, Eye, Zap,
  Calendar, Timer, ArrowRight
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Mock Automation Data
const workflows = [
  {
    id: "wf-1",
    name: "New User Onboarding",
    trigger: "user.created",
    status: "active",
    lastRun: "2024-01-20 14:30:00",
    totalRuns: 1250,
    successRate: 98.5,
    avgDuration: "2.3s"
  },
  {
    id: "wf-2",
    name: "Invoice Due Reminder",
    trigger: "schedule:daily@09:00",
    status: "active",
    lastRun: "2024-01-20 09:00:00",
    totalRuns: 180,
    successRate: 100,
    avgDuration: "5.1s"
  },
  {
    id: "wf-3",
    name: "Lead Score Update",
    trigger: "clickstream.event",
    status: "active",
    lastRun: "2024-01-20 14:25:00",
    totalRuns: 8540,
    successRate: 99.2,
    avgDuration: "0.8s"
  },
  {
    id: "wf-4",
    name: "Monthly Report Generation",
    trigger: "schedule:monthly@01:00",
    status: "paused",
    lastRun: "2024-01-01 01:00:00",
    totalRuns: 24,
    successRate: 95.8,
    avgDuration: "45.2s"
  }
];

const executionLogs = [
  {
    id: "exec-1",
    workflow: "New User Onboarding",
    workflowId: "wf-1",
    status: "success",
    startTime: "2024-01-20 14:30:00",
    endTime: "2024-01-20 14:30:02",
    duration: "2.1s",
    triggeredBy: "user.created (sarah@techcorp.com)",
    steps: [
      { name: "Create Profile", status: "success", duration: "0.3s" },
      { name: "Send Welcome Email", status: "success", duration: "1.2s" },
      { name: "Assign Default Role", status: "success", duration: "0.2s" },
      { name: "Notify Admin", status: "success", duration: "0.4s" }
    ]
  },
  {
    id: "exec-2",
    workflow: "Lead Score Update",
    workflowId: "wf-3",
    status: "success",
    startTime: "2024-01-20 14:25:00",
    endTime: "2024-01-20 14:25:01",
    duration: "0.7s",
    triggeredBy: "clickstream.event (page_view: /pricing)",
    steps: [
      { name: "Fetch User Data", status: "success", duration: "0.2s" },
      { name: "Calculate Score", status: "success", duration: "0.3s" },
      { name: "Update Database", status: "success", duration: "0.2s" }
    ]
  },
  {
    id: "exec-3",
    workflow: "Invoice Due Reminder",
    workflowId: "wf-2",
    status: "success",
    startTime: "2024-01-20 09:00:00",
    endTime: "2024-01-20 09:00:05",
    duration: "5.2s",
    triggeredBy: "schedule:daily@09:00",
    steps: [
      { name: "Query Due Invoices", status: "success", duration: "0.8s" },
      { name: "Generate Email List", status: "success", duration: "0.3s" },
      { name: "Send Batch Emails", status: "success", duration: "3.8s" },
      { name: "Log Results", status: "success", duration: "0.3s" }
    ]
  },
  {
    id: "exec-4",
    workflow: "New User Onboarding",
    workflowId: "wf-1",
    status: "failed",
    startTime: "2024-01-20 12:15:00",
    endTime: "2024-01-20 12:15:03",
    duration: "3.2s",
    triggeredBy: "user.created (mike@startup.io)",
    error: "Email service timeout",
    steps: [
      { name: "Create Profile", status: "success", duration: "0.3s" },
      { name: "Send Welcome Email", status: "failed", duration: "2.5s", error: "SMTP connection timeout" },
      { name: "Assign Default Role", status: "skipped", duration: "-" },
      { name: "Notify Admin", status: "skipped", duration: "-" }
    ]
  },
  {
    id: "exec-5",
    workflow: "Lead Score Update",
    workflowId: "wf-3",
    status: "success",
    startTime: "2024-01-20 14:20:00",
    endTime: "2024-01-20 14:20:01",
    duration: "0.9s",
    triggeredBy: "clickstream.event (button_click: get-quote)",
    steps: [
      { name: "Fetch User Data", status: "success", duration: "0.3s" },
      { name: "Calculate Score", status: "success", duration: "0.4s" },
      { name: "Update Database", status: "success", duration: "0.2s" }
    ]
  }
];

const scheduledJobs = [
  { id: "1", name: "Invoice Due Reminder", schedule: "Daily @ 09:00", nextRun: "2024-01-21 09:00:00", status: "scheduled" },
  { id: "2", name: "Weekly Analytics Report", schedule: "Monday @ 08:00", nextRun: "2024-01-22 08:00:00", status: "scheduled" },
  { id: "3", name: "Data Cleanup", schedule: "Daily @ 02:00", nextRun: "2024-01-21 02:00:00", status: "scheduled" },
  { id: "4", name: "Monthly Report Generation", schedule: "1st of Month @ 01:00", nextRun: "2024-02-01 01:00:00", status: "paused" }
];

export const AdminAutomationLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const toggleLog = (logId: string) => {
    setExpandedLogs(prev => ({ ...prev, [logId]: !prev[logId] }));
  };

  const retryExecution = (execId: string) => {
    toast.success("Workflow execution retried");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500 bg-green-500/10';
      case 'failed': return 'text-red-500 bg-red-500/10';
      case 'running': return 'text-blue-500 bg-blue-500/10';
      case 'skipped': return 'text-gray-500 bg-gray-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'running': return <Clock className="w-4 h-4 animate-spin" />;
      case 'skipped': return <ArrowRight className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredLogs = executionLogs.filter(log => {
    if (statusFilter !== "all" && log.status !== statusFilter) return false;
    if (searchQuery && !log.workflow.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalExecutions = executionLogs.length;
  const successfulExecutions = executionLogs.filter(l => l.status === 'success').length;
  const failedExecutions = executionLogs.filter(l => l.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Automation Logs</h1>
          <p className="text-muted-foreground">View workflow execution history and scheduled jobs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Workflow className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{workflows.length}</p>
                <p className="text-sm text-muted-foreground">Active Workflows</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Play className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalExecutions}</p>
                <p className="text-sm text-muted-foreground">Total Executions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{successfulExecutions}</p>
                <p className="text-sm text-muted-foreground">Successful</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{failedExecutions}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="executions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="executions">Execution Logs</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="executions" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search workflows..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === "success" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("success")}
            >
              Success
            </Button>
            <Button 
              variant={statusFilter === "failed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("failed")}
            >
              Failed
            </Button>
          </div>

          {/* Execution Logs */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="divide-y">
                  {filteredLogs.map((log) => (
                    <Collapsible 
                      key={log.id} 
                      open={expandedLogs[log.id]}
                      onOpenChange={() => toggleLog(log.id)}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {expandedLogs[log.id] ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              )}
                              <Badge className={getStatusColor(log.status)}>
                                {getStatusIcon(log.status)}
                                <span className="ml-1 capitalize">{log.status}</span>
                              </Badge>
                              <div className="text-left">
                                <p className="font-medium">{log.workflow}</p>
                                <p className="text-sm text-muted-foreground">{log.triggeredBy}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Timer className="w-3 h-3" />
                                {log.duration}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {log.startTime}
                              </div>
                              {log.status === 'failed' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => { e.stopPropagation(); retryExecution(log.id); }}
                                >
                                  <RotateCcw className="w-3 h-3 mr-1" />
                                  Retry
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 ml-8 border-l-2 border-muted">
                          {log.error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                              <div className="flex items-center gap-2 text-red-500">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="font-medium">Error:</span>
                              </div>
                              <p className="text-sm text-red-400 mt-1">{log.error}</p>
                            </div>
                          )}
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground mb-3">Execution Steps</p>
                            {log.steps.map((step, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                <div className="flex items-center gap-3">
                                  <Badge className={`${getStatusColor(step.status)} h-6 w-6 p-0 justify-center`}>
                                    {getStatusIcon(step.status)}
                                  </Badge>
                                  <span className="text-sm">{step.name}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{step.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Workflow className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{workflow.name}</h3>
                        <code className="text-xs bg-muted px-2 py-0.5 rounded">{workflow.trigger}</code>
                      </div>
                    </div>
                    <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                      {workflow.status === 'active' ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                      {workflow.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Runs</p>
                      <p className="font-semibold">{workflow.totalRuns.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success Rate</p>
                      <p className="font-semibold">{workflow.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Duration</p>
                      <p className="font-semibold">{workflow.avgDuration}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Last run: {workflow.lastRun}</span>
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Job Name</th>
                      <th className="text-left p-4 font-medium">Schedule</th>
                      <th className="text-left p-4 font-medium">Next Run</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduledJobs.map((job) => (
                      <tr key={job.id} className="border-t">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" />
                            <span className="font-medium">{job.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <code className="text-xs bg-muted px-2 py-1 rounded">{job.schedule}</code>
                        </td>
                        <td className="p-4 text-muted-foreground">{job.nextRun}</td>
                        <td className="p-4">
                          <Badge variant={job.status === 'scheduled' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Play className="w-3 h-3 mr-1" />
                              Run Now
                            </Button>
                            <Button variant="outline" size="sm">
                              {job.status === 'scheduled' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAutomationLogs;
