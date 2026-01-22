import React, { useState } from "react";
import { FolderKanban, Plus, Calendar, Users, Clock, CheckCircle2, AlertCircle, Filter, LayoutGrid, List, Kanban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const projects = [
  { id: 1, name: "HUMINEX Platform v2.0", status: "in-progress", progress: 65, priority: "high", dueDate: "Dec 31, 2025", team: 8, tasks: { completed: 24, total: 37 } },
  { id: 2, name: "Mobile App Development", status: "in-progress", progress: 40, priority: "medium", dueDate: "Jan 15, 2026", team: 5, tasks: { completed: 12, total: 30 } },
  { id: 3, name: "Data Migration Project", status: "completed", progress: 100, priority: "high", dueDate: "Nov 30, 2025", team: 4, tasks: { completed: 18, total: 18 } },
  { id: 4, name: "Security Audit 2025", status: "planning", progress: 15, priority: "high", dueDate: "Feb 28, 2026", team: 3, tasks: { completed: 2, total: 15 } },
  { id: 5, name: "Employee Portal Redesign", status: "on-hold", progress: 30, priority: "low", dueDate: "Mar 15, 2026", team: 4, tasks: { completed: 6, total: 20 } },
];

const tasks = [
  { id: 1, title: "Review API documentation", project: "HUMINEX Platform v2.0", assignee: "Priya S.", priority: "high", dueDate: "Today", status: "in-progress" },
  { id: 2, title: "Fix login authentication bug", project: "Mobile App", assignee: "Rahul V.", priority: "high", dueDate: "Today", status: "todo" },
  { id: 3, title: "Design system components", project: "Employee Portal", assignee: "Sneha R.", priority: "medium", dueDate: "Tomorrow", status: "in-progress" },
  { id: 4, title: "Database schema review", project: "Data Migration", assignee: "Vikram S.", priority: "low", dueDate: "Dec 10", status: "completed" },
  { id: 5, title: "Security policy update", project: "Security Audit", assignee: "Amit K.", priority: "medium", dueDate: "Dec 12", status: "todo" },
];

const TenantProjects: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "kanban">("grid");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress": return <Badge className="bg-[#005EEB]/10 text-[#005EEB] border-[#005EEB]/20">In Progress</Badge>;
      case "completed": return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20">Completed</Badge>;
      case "planning": return <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20">Planning</Badge>;
      case "on-hold": return <Badge className="bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20">On Hold</Badge>;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge variant="outline" className="text-[#E23E57] border-[#E23E57]/30 text-[10px]">High</Badge>;
      case "medium": return <Badge variant="outline" className="text-[#FFB020] border-[#FFB020]/30 text-[10px]">Medium</Badge>;
      case "low": return <Badge variant="outline" className="text-[#6B7280] border-[#6B7280]/30 text-[10px]">Low</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Tasks & Projects</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage projects, tasks, and team assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg p-1 bg-white">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "kanban" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("kanban")}>
              <Kanban className="w-4 h-4" />
            </Button>
          </div>
          <Button className="bg-[#005EEB] hover:bg-[#004ACC] gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-[#005EEB]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">5</p>
                <p className="text-xs text-[#6B7280]">Active Projects</p>
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
                <p className="text-2xl font-bold text-[#0F1E3A]">24</p>
                <p className="text-xs text-[#6B7280]">Pending Tasks</p>
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
                <p className="text-2xl font-bold text-[#0F1E3A]">62</p>
                <p className="text-xs text-[#6B7280]">Completed Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E23E57]/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#E23E57]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">3</p>
                <p className="text-xs text-[#6B7280]">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="bg-white border">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="border-none shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    {getStatusBadge(project.status)}
                    {getPriorityBadge(project.priority)}
                  </div>
                  <CardTitle className="text-lg mt-2">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B7280]">Progress</span>
                      <span className="font-medium text-[#0F1E3A]">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-[#6B7280]">
                      <Calendar className="w-4 h-4" />
                      {project.dueDate}
                    </div>
                    <div className="flex items-center gap-2 text-[#6B7280]">
                      <Users className="w-4 h-4" />
                      {project.team} members
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-[#6B7280]">
                      {project.tasks.completed}/{project.tasks.total} tasks
                    </span>
                    <Button variant="ghost" size="sm" className="text-[#005EEB]">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b bg-[#F7F9FC]/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">My Tasks</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-[#F7F9FC]/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      task.status === 'completed' ? 'bg-[#0FB07A] border-[#0FB07A]' : 'border-gray-300 hover:border-[#005EEB]'
                    }`}>
                      {task.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className={`font-medium ${task.status === 'completed' ? 'text-[#6B7280] line-through' : 'text-[#0F1E3A]'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-[#6B7280]">{task.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getPriorityBadge(task.priority)}
                    <span className="text-sm text-[#6B7280]">{task.dueDate}</span>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#005EEB] to-[#00C2FF] flex items-center justify-center text-white text-[10px] font-bold">
                      {task.assignee.split(" ").map(n => n[0]).join("")}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-12 text-[#6B7280]">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Timeline / Gantt view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantProjects;
