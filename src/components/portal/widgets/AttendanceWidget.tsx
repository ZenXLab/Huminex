import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, LogIn, LogOut, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";

export const AttendanceWidget = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  // Mock data - would come from API
  const attendanceData = {
    monthlyPresent: 18,
    monthlyTotal: 22,
    avgCheckIn: "9:15 AM",
    avgCheckOut: "6:30 PM",
    streak: 5,
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Attendance
          </CardTitle>
          <Badge variant={isCheckedIn ? "default" : "secondary"} className="text-xs">
            {isCheckedIn ? "Checked In" : "Not Checked In"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Check In/Out Button */}
        <div className="flex items-center justify-center">
          {!isCheckedIn ? (
            <Button 
              onClick={handleCheckIn}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Check In Now
            </Button>
          ) : (
            <div className="w-full space-y-2">
              <div className="text-center text-sm text-muted-foreground">
                Checked in at <span className="font-medium text-foreground">{checkInTime}</span>
              </div>
              <Button 
                onClick={handleCheckOut}
                variant="outline"
                className="w-full border-destructive text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Check Out
              </Button>
            </div>
          )}
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {attendanceData.monthlyPresent}/{attendanceData.monthlyTotal}
            </p>
            <p className="text-xs text-muted-foreground">Days Present</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
            <p className="text-lg font-bold text-primary">
              {attendanceData.streak} days
            </p>
            <p className="text-xs text-muted-foreground">On Time</p>
          </div>
        </div>

        {/* Average Times */}
        <div className="flex items-center justify-between text-sm border-t border-border/50 pt-3">
          <div className="text-center flex-1">
            <p className="text-muted-foreground text-xs">Avg. Check-in</p>
            <p className="font-medium text-foreground">{attendanceData.avgCheckIn}</p>
          </div>
          <div className="w-px h-8 bg-border/50" />
          <div className="text-center flex-1">
            <p className="text-muted-foreground text-xs">Avg. Check-out</p>
            <p className="font-medium text-foreground">{attendanceData.avgCheckOut}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
