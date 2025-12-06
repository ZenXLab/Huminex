import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Video, Users } from "lucide-react";
import { format } from "date-fns";

export const AdminMeetings = () => {
  const { data: meetings, isLoading } = useQuery({
    queryKey: ["admin-meetings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*, profiles(full_name, email), projects(name)")
        .order("scheduled_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const stats = {
    total: meetings?.length || 0,
    upcoming: meetings?.filter(m => new Date(m.scheduled_at) > new Date() && m.status === "scheduled").length || 0,
    completed: meetings?.filter(m => m.status === "completed").length || 0,
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      scheduled: "bg-primary/20 text-primary",
      completed: "bg-green-500/20 text-green-500",
      cancelled: "bg-destructive/20 text-destructive",
    };
    return styles[status] || styles.scheduled;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meetings & Calls</h1>
        <p className="text-muted-foreground">Manage client and internal meetings</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.upcoming}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Video className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.completed}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Meetings</CardTitle>
          <CardDescription>View and manage scheduled meetings</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : meetings?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No meetings scheduled</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings?.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">{meeting.title}</TableCell>
                    <TableCell>{(meeting.profiles as any)?.full_name || "-"}</TableCell>
                    <TableCell>{(meeting.projects as any)?.name || "-"}</TableCell>
                    <TableCell>{format(new Date(meeting.scheduled_at), "MMM d, yyyy h:mm a")}</TableCell>
                    <TableCell>{meeting.duration_minutes} min</TableCell>
                    <TableCell><Badge className={getStatusBadge(meeting.status || "scheduled")}>{meeting.status}</Badge></TableCell>
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
