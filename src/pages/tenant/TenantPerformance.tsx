import React from "react";
import { Target, TrendingUp, Users, Award, Calendar, Star, BarChart3, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const okrs = [
  { id: 1, objective: "Increase customer satisfaction score", keyResult: "Achieve NPS of 75+", progress: 68, owner: "Customer Success", dueDate: "Dec 31, 2025", status: "on-track" },
  { id: 2, objective: "Expand market presence", keyResult: "Launch in 3 new regions", progress: 33, owner: "Sales Team", dueDate: "Dec 31, 2025", status: "at-risk" },
  { id: 3, objective: "Improve product quality", keyResult: "Reduce bugs by 40%", progress: 85, owner: "Engineering", dueDate: "Dec 31, 2025", status: "ahead" },
  { id: 4, objective: "Employee development", keyResult: "100% completion of training", progress: 72, owner: "HR", dueDate: "Dec 31, 2025", status: "on-track" },
];

const topPerformers = [
  { name: "Priya Sharma", department: "Engineering", rating: 4.8, achievements: 12 },
  { name: "Rahul Verma", department: "Sales", rating: 4.7, achievements: 10 },
  { name: "Sneha Reddy", department: "Design", rating: 4.6, achievements: 8 },
  { name: "Vikram Singh", department: "DevOps", rating: 4.5, achievements: 9 },
];

const TenantPerformance: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ahead": return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A]">Ahead</Badge>;
      case "on-track": return <Badge className="bg-[#005EEB]/10 text-[#005EEB]">On Track</Badge>;
      case "at-risk": return <Badge className="bg-[#FFB020]/10 text-[#FFB020]">At Risk</Badge>;
      case "behind": return <Badge className="bg-[#E23E57]/10 text-[#E23E57]">Behind</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Performance & Engagement</h1>
          <p className="text-sm text-[#6B7280] mt-1">Track OKRs, goals, reviews, and team performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Review
          </Button>
          <Button className="bg-[#005EEB] hover:bg-[#004ACC] gap-2">
            <Target className="w-4 h-4" />
            Create OKR
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#005EEB]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">12</p>
                <p className="text-xs text-[#6B7280]">Active OKRs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0FB07A]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#0FB07A]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">67%</p>
                <p className="text-xs text-[#6B7280]">Avg. Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFB020]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FFB020]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">8</p>
                <p className="text-xs text-[#6B7280]">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">4.3</p>
                <p className="text-xs text-[#6B7280]">Avg. Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OKRs */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-[#005EEB]" />
              OKRs - Q4 2025
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {okrs.map((okr) => (
              <div key={okr.id} className="p-4 bg-[#F7F9FC] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-[#0F1E3A]">{okr.objective}</h4>
                  {getStatusBadge(okr.status)}
                </div>
                <p className="text-sm text-[#6B7280] mb-3">{okr.keyResult}</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={okr.progress} className="h-2" />
                  </div>
                  <span className="text-sm font-medium text-[#0F1E3A]">{okr.progress}%</span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-[#9CA3AF]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {okr.owner}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Due: {okr.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FFB020]" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((performer, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#005EEB] to-[#00C2FF] flex items-center justify-center text-white text-sm font-bold">
                  {performer.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#0F1E3A] text-sm">{performer.name}</p>
                  <p className="text-xs text-[#6B7280]">{performer.department}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#FFB020] fill-[#FFB020]" />
                    <span className="text-sm font-semibold text-[#0F1E3A]">{performer.rating}</span>
                  </div>
                  <p className="text-xs text-[#6B7280]">{performer.achievements} achievements</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Reviews Section */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Performance Reviews</CardTitle>
            <Tabs defaultValue="upcoming" className="w-auto">
              <TabsList className="h-8">
                <TabsTrigger value="upcoming" className="text-xs">Upcoming</TabsTrigger>
                <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#6B7280]">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Performance review cycle starts in January 2026</p>
            <Button variant="outline" className="mt-4">Configure Review Cycle</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantPerformance;
