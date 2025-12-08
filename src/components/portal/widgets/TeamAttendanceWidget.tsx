import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const TeamAttendanceWidget = () => {
  // Mock data - would come from API
  const attendanceData = {
    today: {
      present: 42,
      total: 50,
      wfh: 8,
      onLeave: 5,
      absent: 3,
    },
    weeklyTrend: [
      { day: "Mon", percentage: 92 },
      { day: "Tue", percentage: 88 },
      { day: "Wed", percentage: 94 },
      { day: "Thu", percentage: 90 },
      { day: "Fri", percentage: 84 },
    ],
    comparedToLastWeek: 3.5,
  };

  const todayPercentage = (attendanceData.today.present / attendanceData.today.total) * 100;
  const isImproved = attendanceData.comparedToLastWeek > 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Team Attendance
          </CardTitle>
          <div className={`flex items-center gap-1 text-xs ${isImproved ? 'text-green-600' : 'text-red-600'}`}>
            {isImproved ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(attendanceData.comparedToLastWeek)}% vs last week
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Overview */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Today's Attendance</span>
            <span className="text-2xl font-bold text-foreground">{todayPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={todayPercentage} className="h-2" />
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <span>{attendanceData.today.present} present</span>
            <span>{attendanceData.today.wfh} WFH</span>
            <span>{attendanceData.today.onLeave} leave</span>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 rounded-lg bg-green-500/10">
            <p className="text-lg font-bold text-green-600">{attendanceData.today.present}</p>
            <p className="text-[10px] text-muted-foreground">Present</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-500/10">
            <p className="text-lg font-bold text-blue-600">{attendanceData.today.wfh}</p>
            <p className="text-[10px] text-muted-foreground">WFH</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-yellow-500/10">
            <p className="text-lg font-bold text-yellow-600">{attendanceData.today.onLeave}</p>
            <p className="text-[10px] text-muted-foreground">Leave</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-red-500/10">
            <p className="text-lg font-bold text-red-600">{attendanceData.today.absent}</p>
            <p className="text-[10px] text-muted-foreground">Absent</p>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">This Week's Trend</p>
          <div className="flex items-end justify-between gap-1 h-16">
            {attendanceData.weeklyTrend.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-primary/20 rounded-t"
                  style={{ height: `${day.percentage * 0.6}px` }}
                />
                <span className="text-[10px] text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
