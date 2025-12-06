import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface PortalMeetingsProps {
  userId?: string;
}

export const PortalMeetings = ({ userId }: PortalMeetingsProps) => {
  const { data: meetings, isLoading } = useQuery({
    queryKey: ["portal-all-meetings", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("meetings")
        .select("*, projects(name)")
        .eq("user_id", userId)
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const upcomingMeetings = meetings?.filter(m => new Date(m.scheduled_at) >= new Date() && m.status === "scheduled") || [];
  const pastMeetings = meetings?.filter(m => new Date(m.scheduled_at) < new Date() || m.status === "completed") || [];

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      scheduled: "bg-primary/20 text-primary",
      completed: "bg-green-500/20 text-green-500",
      cancelled: "bg-destructive/20 text-destructive",
    };
    return styles[status || "scheduled"] || styles.scheduled;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Meetings</h1>
          <p className="text-muted-foreground">View and manage scheduled meetings</p>
        </div>
        <Button><Calendar className="h-4 w-4 mr-2" />Book Meeting</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMeetings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Video className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastMeetings.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Upcoming Meetings</h2>
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">Loading...</div>
          ) : upcomingMeetings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No upcoming meetings scheduled
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <Card key={meeting.id} className="hover:border-primary/30 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Video className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{meeting.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {(meeting.projects as any)?.name || "General"}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3" />
                            {format(new Date(meeting.scheduled_at), "MMM d, yyyy 'at' h:mm a")}
                            <span className="text-muted-foreground">({meeting.duration_minutes} min)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusBadge(meeting.status)}>{meeting.status}</Badge>
                        {meeting.meeting_link && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />Join
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {pastMeetings.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Past Meetings</h2>
            <div className="space-y-3">
              {pastMeetings.slice(0, 5).map((meeting) => (
                <Card key={meeting.id} className="opacity-70">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{meeting.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(meeting.scheduled_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(meeting.status)}>{meeting.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
