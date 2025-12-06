import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FolderKanban, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  ChevronRight,
  Target,
  Zap
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: "active" | "review" | "completed" | "planning";
  progress: number;
  phase: string;
  dueDate: string;
  team: string[];
  tasks: { total: number; completed: number };
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "E-Commerce Platform",
    status: "active",
    progress: 65,
    phase: "Development",
    dueDate: "2024-02-15",
    team: ["John", "Sarah", "Mike"],
    tasks: { total: 24, completed: 16 },
  },
  {
    id: "2",
    name: "Mobile App MVP",
    status: "review",
    progress: 90,
    phase: "Testing",
    dueDate: "2024-01-30",
    team: ["Alex", "Emma"],
    tasks: { total: 18, completed: 16 },
  },
  {
    id: "3",
    name: "AI Chatbot Integration",
    status: "planning",
    progress: 20,
    phase: "Discovery",
    dueDate: "2024-03-01",
    team: ["David"],
    tasks: { total: 12, completed: 2 },
  },
];

const milestones = [
  { name: "Project Kickoff", date: "Jan 5", status: "completed" },
  { name: "Design Approval", date: "Jan 15", status: "completed" },
  { name: "MVP Development", date: "Feb 1", status: "active" },
  { name: "User Testing", date: "Feb 15", status: "upcoming" },
  { name: "Launch", date: "Mar 1", status: "upcoming" },
];

export const ProjectWorkspace = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(mockProjects[0]);

  const getStatusBadge = (status: Project["status"]) => {
    const styles = {
      active: "bg-primary/20 text-primary",
      review: "bg-yellow-500/20 text-yellow-500",
      completed: "bg-green-500/20 text-green-500",
      planning: "bg-muted text-muted-foreground",
    };
    return styles[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Project Workspace</h2>
          <p className="text-muted-foreground">Track progress and manage your projects</p>
        </div>
        <Button className="gap-2">
          <FolderKanban className="h-4 w-4" />
          View All Projects
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="space-y-3">
          {mockProjects.map((project) => (
            <Card 
              key={project.id}
              className={`cursor-pointer transition-all hover:border-primary/30 ${
                selectedProject?.id === project.id ? "border-primary ring-1 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedProject(project)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{project.name}</h3>
                  <Badge className={getStatusBadge(project.status)}>{project.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{project.phase}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Details */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedProject.name}</CardTitle>
                    <CardDescription>{selectedProject.phase} Phase</CardDescription>
                  </div>
                  <Badge className={getStatusBadge(selectedProject.status)}>{selectedProject.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <BarChart3 className="h-4 w-4" />
                          <span className="text-sm">Progress</span>
                        </div>
                        <p className="text-2xl font-bold">{selectedProject.progress}%</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm">Tasks</span>
                        </div>
                        <p className="text-2xl font-bold">{selectedProject.tasks.completed}/{selectedProject.tasks.total}</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Team</span>
                        </div>
                        <p className="text-2xl font-bold">{selectedProject.team.length}</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Due Date</span>
                        </div>
                        <p className="text-lg font-bold">{new Date(selectedProject.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Progress</h4>
                      <Progress value={selectedProject.progress} className="h-3" />
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <FileText className="h-4 w-4" />
                        View Documents
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Messages
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <div className="relative">
                      {milestones.map((milestone, index) => (
                        <div key={index} className="flex items-start gap-4 pb-6 last:pb-0">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center shrink-0
                            ${milestone.status === "completed" ? "bg-green-500" : ""}
                            ${milestone.status === "active" ? "bg-primary" : ""}
                            ${milestone.status === "upcoming" ? "bg-muted" : ""}
                          `}>
                            {milestone.status === "completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : milestone.status === "active" ? (
                              <Zap className="h-4 w-4 text-white" />
                            ) : (
                              <Target className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{milestone.name}</h4>
                              <span className="text-sm text-muted-foreground">{milestone.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="team" className="space-y-4">
                    <div className="grid gap-3">
                      {selectedProject.team.map((member, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                            {member.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{member}</p>
                            <p className="text-sm text-muted-foreground">Team Member</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a project to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
