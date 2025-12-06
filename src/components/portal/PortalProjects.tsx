import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderKanban, Calendar, CheckCircle2, Clock, Target } from "lucide-react";

interface PortalProjectsProps {
  userId?: string;
}

export const PortalProjects = ({ userId }: PortalProjectsProps) => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["portal-all-projects", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_milestones(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-primary/20 text-primary",
      planning: "bg-muted text-muted-foreground",
      review: "bg-yellow-500/20 text-yellow-500",
      completed: "bg-green-500/20 text-green-500",
    };
    return styles[status] || styles.active;
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Your Projects</h1>
        <p className="text-muted-foreground">Track progress and view project details</p>
      </div>

      {projects?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground">Contact us to start your first project</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects?.map((project) => (
            <Card key={project.id} className="hover:border-primary/30 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  </div>
                  <Badge className={getStatusBadge(project.status)}>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Phase</p>
                        <p className="font-medium">{project.phase}</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Progress</p>
                        <p className="font-medium">{project.progress || 0}%</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Health Score</p>
                        <p className="font-medium">{project.health_score || 100}%</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                        <p className="font-medium">{project.due_date ? new Date(project.due_date).toLocaleDateString() : "TBD"}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-medium">{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} className="h-2" />
                    </div>
                  </TabsContent>

                  <TabsContent value="milestones">
                    <div className="space-y-3">
                      {(project.project_milestones as any[])?.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No milestones yet</p>
                      ) : (
                        (project.project_milestones as any[])?.map((milestone) => (
                          <div key={milestone.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              milestone.status === "completed" ? "bg-green-500" :
                              milestone.status === "active" ? "bg-primary" : "bg-muted"
                            }`}>
                              {milestone.status === "completed" ? (
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              ) : milestone.status === "active" ? (
                                <Clock className="h-4 w-4 text-white" />
                              ) : (
                                <Target className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{milestone.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {milestone.due_date ? `Due: ${new Date(milestone.due_date).toLocaleDateString()}` : "No due date"}
                              </p>
                            </div>
                            <Badge variant="secondary">{milestone.status}</Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
