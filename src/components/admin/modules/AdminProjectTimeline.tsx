import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Download,
  Filter,
  ChevronRight,
  Milestone
} from "lucide-react";

// Mock project timeline data
const projects = [
  {
    id: 1,
    name: "Retail Chain HR Transformation",
    client: "Retail Chain Corp",
    status: "active",
    progress: 45,
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    team: ["Arjun S.", "Priya P.", "Rahul V."],
    milestones: [
      { name: "Discovery Phase", status: "completed", date: "2025-01-15" },
      { name: "Requirements Sign-off", status: "completed", date: "2025-01-31" },
      { name: "Development Sprint 1", status: "completed", date: "2025-02-15" },
      { name: "Development Sprint 2", status: "in_progress", date: "2025-02-28" },
      { name: "UAT Phase", status: "pending", date: "2025-04-15" },
      { name: "Go-Live", status: "pending", date: "2025-06-30" },
    ]
  },
  {
    id: 2,
    name: "EdTech Payroll Integration",
    client: "EdTech Solutions",
    status: "active",
    progress: 70,
    startDate: "2024-12-01",
    endDate: "2025-03-31",
    team: ["Karthik N.", "Sneha G."],
    milestones: [
      { name: "Discovery", status: "completed", date: "2024-12-15" },
      { name: "Design Complete", status: "completed", date: "2024-12-31" },
      { name: "Core Development", status: "completed", date: "2025-01-31" },
      { name: "Integration Testing", status: "in_progress", date: "2025-02-28" },
      { name: "Deployment", status: "pending", date: "2025-03-31" },
    ]
  },
  {
    id: 3,
    name: "Hospital Compliance Audit",
    client: "Hospital Network",
    status: "planning",
    progress: 10,
    startDate: "2025-02-01",
    endDate: "2025-04-30",
    team: ["Vikram R.", "Meera J."],
    milestones: [
      { name: "Kickoff Meeting", status: "completed", date: "2025-02-01" },
      { name: "Audit Scope", status: "in_progress", date: "2025-02-15" },
      { name: "Documentation Review", status: "pending", date: "2025-03-15" },
      { name: "Final Report", status: "pending", date: "2025-04-30" },
    ]
  },
  {
    id: 4,
    name: "Manufacturing ERP Integration",
    client: "Manufacturing Co",
    status: "active",
    progress: 25,
    startDate: "2025-01-15",
    endDate: "2025-09-30",
    team: ["Arjun S.", "Karthik N.", "Ananya S."],
    milestones: [
      { name: "Discovery & Analysis", status: "completed", date: "2025-02-01" },
      { name: "Architecture Design", status: "in_progress", date: "2025-02-28" },
      { name: "Phase 1 Development", status: "pending", date: "2025-04-30" },
      { name: "Phase 2 Development", status: "pending", date: "2025-07-31" },
      { name: "Final Deployment", status: "pending", date: "2025-09-30" },
    ]
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-emerald-500";
    case "in_progress": return "bg-amber-500";
    case "pending": return "bg-slate-300";
    default: return "bg-slate-300";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active": return "bg-emerald-100 text-emerald-800";
    case "planning": return "bg-blue-100 text-blue-800";
    case "on_hold": return "bg-amber-100 text-amber-800";
    case "completed": return "bg-slate-100 text-slate-800";
    default: return "bg-slate-100 text-slate-800";
  }
};

export const AdminProjectTimeline = () => {
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredProjects = projects.filter(p => 
    filterStatus === "all" || p.status === filterStatus
  );

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Project Timeline</h1>
          <p className="text-muted-foreground">Track project milestones and timelines</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-3xl font-bold text-foreground">{projects.filter(p => p.status === "active").length}</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Planning</p>
                <p className="text-3xl font-bold text-foreground">{projects.filter(p => p.status === "planning").length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Milestones</p>
                <p className="text-3xl font-bold text-foreground">
                  {projects.reduce((acc, p) => acc + p.milestones.length, 0)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Milestone className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-3xl font-bold text-foreground">8</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Timelines */}
      <div className="space-y-4">
        {filteredProjects.map((project) => {
          const daysRemaining = calculateDaysRemaining(project.endDate);
          const completedMilestones = project.milestones.filter(m => m.status === "completed").length;
          
          return (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {project.name}
                        <Badge className={getStatusBadge(project.status)}>{project.status}</Badge>
                      </CardTitle>
                      <CardDescription>{project.client}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="font-bold text-foreground">{project.progress}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Days Remaining</p>
                      <p className={`font-bold ${daysRemaining < 30 ? 'text-amber-600' : 'text-foreground'}`}>
                        {daysRemaining}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
                <Progress value={project.progress} className="h-2 mt-3" />
              </CardHeader>
              <CardContent>
                {/* Timeline */}
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-border ml-4" />
                  <div className="space-y-4 pt-2">
                    {project.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-4 relative">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(milestone.status)} z-10 ring-4 ring-background`} />
                        <div className="flex-1 flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <span className={`font-medium ${milestone.status === "completed" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                              {milestone.name}
                            </span>
                            {milestone.status === "in_progress" && (
                              <Badge variant="outline" className="text-xs bg-amber-50">In Progress</Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{milestone.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Team */}
                <div className="mt-4 pt-4 border-t flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Team:</span>
                  <div className="flex items-center gap-2">
                    {project.team.map((member, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {member}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {completedMilestones}/{project.milestones.length} milestones complete
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
