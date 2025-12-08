import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Headphones, Plus, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export const TicketsWidget = () => {
  // Mock data - would come from API
  const ticketStats = {
    open: 8,
    inProgress: 5,
    resolved: 23,
    avgResponseTime: "2.5h",
  };

  const recentTickets = [
    { id: "TKT-001", title: "Login issue reported", priority: "high", status: "open", assignee: "You" },
    { id: "TKT-002", title: "Payroll discrepancy", priority: "medium", status: "in_progress", assignee: "HR Team" },
    { id: "TKT-003", title: "Leave balance query", priority: "low", status: "resolved", assignee: "You" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-600";
      case "medium": return "bg-yellow-500/20 text-yellow-600";
      case "low": return "bg-green-500/20 text-green-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="w-3 h-3 text-red-500" />;
      case "in_progress": return <Clock className="w-3 h-3 text-yellow-500" />;
      case "resolved": return <CheckCircle2 className="w-3 h-3 text-green-500" />;
      default: return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Headphones className="w-4 h-4 text-primary" />
            Support Tickets
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <Plus className="w-3 h-3" />
            New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 rounded-lg bg-red-500/10">
            <p className="text-lg font-bold text-red-600">{ticketStats.open}</p>
            <p className="text-[10px] text-muted-foreground">Open</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-yellow-500/10">
            <p className="text-lg font-bold text-yellow-600">{ticketStats.inProgress}</p>
            <p className="text-[10px] text-muted-foreground">In Progress</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-green-500/10">
            <p className="text-lg font-bold text-green-600">{ticketStats.resolved}</p>
            <p className="text-[10px] text-muted-foreground">Resolved</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-500/10">
            <p className="text-lg font-bold text-blue-600">{ticketStats.avgResponseTime}</p>
            <p className="text-[10px] text-muted-foreground">Avg Time</p>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Recent Tickets</p>
          <div className="space-y-2">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                {getStatusIcon(ticket.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{ticket.id}</p>
                    <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">Assigned: {ticket.assignee}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="link" size="sm" className="h-auto p-0 text-xs w-full">
          View All Tickets →
        </Button>
      </CardContent>
    </Card>
  );
};
