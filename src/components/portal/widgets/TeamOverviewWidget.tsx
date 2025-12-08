import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Users, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export const TeamOverviewWidget = () => {
  // Mock data - would come from API
  const teamStats = {
    totalMembers: 8,
    presentToday: 7,
    onLeave: 1,
    pendingApprovals: 3,
  };

  const teamMembers = [
    { name: "Priya Sharma", role: "Developer", status: "present", avatar: "PS" },
    { name: "Rahul Verma", role: "Designer", status: "present", avatar: "RV" },
    { name: "Amit Kumar", role: "Developer", status: "wfh", avatar: "AK" },
    { name: "Sneha Patel", role: "QA", status: "leave", avatar: "SP" },
    { name: "Vikram Singh", role: "Developer", status: "present", avatar: "VS" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-500";
      case "wfh": return "bg-blue-500";
      case "leave": return "bg-yellow-500";
      case "absent": return "bg-red-500";
      default: return "bg-muted";
    }
  };

  const attendancePercentage = (teamStats.presentToday / teamStats.totalMembers) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-primary" />
            Team Overview
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {teamStats.totalMembers} members
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-500/10 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-green-600">
              <CheckCircle className="w-3 h-3" />
              <span className="text-lg font-bold">{teamStats.presentToday}</span>
            </div>
            <p className="text-xs text-muted-foreground">Present</p>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-600">
              <Clock className="w-3 h-3" />
              <span className="text-lg font-bold">{teamStats.onLeave}</span>
            </div>
            <p className="text-xs text-muted-foreground">On Leave</p>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-600">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-lg font-bold">{teamStats.pendingApprovals}</span>
            </div>
            <p className="text-xs text-muted-foreground">Approvals</p>
          </div>
        </div>

        {/* Attendance Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Today's Attendance</span>
            <span className="font-medium text-foreground">{attendancePercentage.toFixed(0)}%</span>
          </div>
          <Progress value={attendancePercentage} className="h-2" />
        </div>

        {/* Team List */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Team Members</p>
          <div className="space-y-2 max-h-[180px] overflow-y-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <Badge variant="secondary" className={`text-[10px] capitalize ${
                  member.status === "present" ? "bg-green-500/20 text-green-600" :
                  member.status === "wfh" ? "bg-blue-500/20 text-blue-600" :
                  "bg-yellow-500/20 text-yellow-600"
                }`}>
                  {member.status === "wfh" ? "WFH" : member.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
