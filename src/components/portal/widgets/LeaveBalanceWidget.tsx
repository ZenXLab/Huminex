import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus, Umbrella, Stethoscope, Baby, Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const LeaveBalanceWidget = () => {
  // Mock data - would come from API
  const leaveData = [
    { type: "Casual", icon: Umbrella, total: 12, used: 4, color: "from-blue-400 to-blue-600" },
    { type: "Sick", icon: Stethoscope, total: 10, used: 2, color: "from-red-400 to-red-600" },
    { type: "Earned", icon: Gift, total: 15, used: 5, color: "from-emerald-400 to-emerald-600" },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            Leave Balance
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <Plus className="w-3 h-3" />
            Apply
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaveData.map((leave) => {
          const Icon = leave.icon;
          const remaining = leave.total - leave.used;
          const percentage = (leave.used / leave.total) * 100;

          return (
            <div key={leave.type} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${leave.color} flex items-center justify-center`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{leave.type}</span>
                </div>
                <span className="text-sm">
                  <span className="font-bold text-foreground">{remaining}</span>
                  <span className="text-muted-foreground">/{leave.total}</span>
                </span>
              </div>
              <Progress 
                value={percentage} 
                className="h-1.5" 
              />
            </div>
          );
        })}

        {/* Total available */}
        <div className="border-t border-border/50 pt-3 mt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Available</span>
            <span className="font-bold text-lg text-primary">
              {leaveData.reduce((sum, l) => sum + (l.total - l.used), 0)} days
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
