import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { FolderKanban, Plus, Search, Users, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export const AdminProjects = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "planning",
    phase: "Discovery",
    user_id: "",
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects", searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*, profiles(full_name, email)")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: clients } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name, email");
      if (error) throw error;
      return data;
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (project: typeof newProject) => {
      const { error } = await supabase.from("projects").insert([project]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Project created");
      setIsAddDialogOpen(false);
      setNewProject({ name: "", description: "", status: "planning", phase: "Discovery", user_id: "" });
    },
    onError: () => toast.error("Failed to create project"),
  });

  const stats = {
    total: projects?.length || 0,
    active: projects?.filter(p => p.status === "active").length || 0,
    completed: projects?.filter(p => p.status === "completed").length || 0,
    avgProgress: projects?.length ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) : 0,
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      planning: "bg-muted text-muted-foreground",
      active: "bg-primary/20 text-primary",
      review: "bg-yellow-500/20 text-yellow-500",
      completed: "bg-green-500/20 text-green-500",
      on_hold: "bg-orange-500/20 text-orange-500",
    };
    return styles[status] || styles.planning;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground">Manage all client projects</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Project Name</Label>
                <Input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
              </div>
              <div>
                <Label>Client</Label>
                <Select value={newProject.user_id} onValueChange={(v) => setNewProject({ ...newProject, user_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.full_name || c.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={newProject.status} onValueChange={(v) => setNewProject({ ...newProject, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Phase</Label>
                  <Select value={newProject.phase} onValueChange={(v) => setNewProject({ ...newProject, phase: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Discovery">Discovery</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Testing">Testing</SelectItem>
                      <SelectItem value="Deployment">Deployment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full" onClick={() => createProjectMutation.mutate(newProject)} disabled={!newProject.name || createProjectMutation.isPending}>
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.active}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.completed}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.avgProgress}%</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>Manage client projects and track progress</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : projects?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No projects found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects?.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{(project.profiles as any)?.full_name || (project.profiles as any)?.email || "-"}</TableCell>
                    <TableCell><Badge className={getStatusBadge(project.status)}>{project.status}</Badge></TableCell>
                    <TableCell>{project.phase}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress || 0} className="h-2 w-20" />
                        <span className="text-sm">{project.progress || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(project.created_at), "MMM d, yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
