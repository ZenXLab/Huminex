import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone } from "lucide-react";

export const PortalTeam = () => {
  const { data: team, isLoading } = useQuery({
    queryKey: ["portal-team"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      "Project Manager": "bg-purple-500/20 text-purple-500",
      Developer: "bg-primary/20 text-primary",
      Designer: "bg-pink-500/20 text-pink-500",
      QA: "bg-yellow-500/20 text-yellow-500",
      default: "bg-muted text-muted-foreground",
    };
    return styles[role] || styles.default;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Your Team</h1>
        <p className="text-muted-foreground">Meet the team working on your projects</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading team...</div>
      ) : team?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Team Coming Soon</h3>
            <p className="text-muted-foreground">Your dedicated team will be assigned shortly</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {team?.map((member) => (
            <Card key={member.id} className="hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{member.name}</h3>
                    <Badge className={getRoleBadge(member.role)}>{member.role}</Badge>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
