import React, { useState } from "react";
import { MessageSquare, Plus, Pin, Bell, Calendar, Users, Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const announcements = [
  {
    id: 1,
    title: "Holiday Notice: Christmas & New Year",
    content: "The office will be closed from December 24th to January 1st. Wishing everyone a joyful holiday season!",
    category: "Holiday",
    priority: "high",
    pinned: true,
    author: "HR Department",
    date: "Dec 5, 2025",
    views: 184,
    targetAudience: "All Employees"
  },
  {
    id: 2,
    title: "New Health Insurance Benefits",
    content: "We're excited to announce enhanced health insurance coverage starting January 2026. Check your email for details.",
    category: "Benefits",
    priority: "medium",
    pinned: true,
    author: "Benefits Team",
    date: "Dec 3, 2025",
    views: 156,
    targetAudience: "All Employees"
  },
  {
    id: 3,
    title: "Q4 Town Hall Meeting",
    content: "Join us for the quarterly town hall on December 15th at 3 PM. CEO will share company updates and future plans.",
    category: "Event",
    priority: "medium",
    pinned: false,
    author: "CEO Office",
    date: "Dec 1, 2025",
    views: 142,
    targetAudience: "All Employees"
  },
  {
    id: 4,
    title: "IT System Maintenance",
    content: "Scheduled maintenance on December 10th from 10 PM to 2 AM. Some services may be temporarily unavailable.",
    category: "IT",
    priority: "low",
    pinned: false,
    author: "IT Team",
    date: "Nov 28, 2025",
    views: 98,
    targetAudience: "All Employees"
  },
];

const TenantAnnouncements: React.FC = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-[#E23E57]/10 text-[#E23E57] border-[#E23E57]/20";
      case "medium": return "bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20";
      case "low": return "bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20";
      default: return "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Holiday": return "bg-[#8B5CF6]/10 text-[#8B5CF6]";
      case "Benefits": return "bg-[#0FB07A]/10 text-[#0FB07A]";
      case "Event": return "bg-[#005EEB]/10 text-[#005EEB]";
      case "IT": return "bg-[#FFB020]/10 text-[#FFB020]";
      default: return "bg-[#6B7280]/10 text-[#6B7280]";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Announcements</h1>
          <p className="text-sm text-[#6B7280] mt-1">Company-wide announcements and important updates</p>
        </div>
        <Button className="bg-[#005EEB] hover:bg-[#004ACC] gap-2">
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#005EEB]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">24</p>
                <p className="text-xs text-[#6B7280]">Total Announcements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFB020]/10 flex items-center justify-center">
                <Pin className="w-5 h-5 text-[#FFB020]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">2</p>
                <p className="text-xs text-[#6B7280]">Pinned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0FB07A]/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#0FB07A]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">580</p>
                <p className="text-xs text-[#6B7280]">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">4</p>
                <p className="text-xs text-[#6B7280]">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-white border">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pinned">Pinned</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {announcement.pinned && (
                        <Pin className="w-4 h-4 text-[#FFB020]" />
                      )}
                      <Badge className={getCategoryColor(announcement.category)}>{announcement.category}</Badge>
                      <Badge variant="outline" className={getPriorityColor(announcement.priority)}>
                        {announcement.priority} priority
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-[#0F1E3A] mb-2">{announcement.title}</h3>
                    <p className="text-[#6B7280] text-sm mb-4">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {announcement.targetAudience}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {announcement.views} views
                      </span>
                      <span>By {announcement.author}</span>
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#E23E57]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pinned">
          {announcements.filter(a => a.pinned).map((announcement) => (
            <Card key={announcement.id} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Pin className="w-4 h-4 text-[#FFB020]" />
                  <Badge className={getCategoryColor(announcement.category)}>{announcement.category}</Badge>
                </div>
                <h3 className="text-lg font-semibold text-[#0F1E3A] mb-2">{announcement.title}</h3>
                <p className="text-[#6B7280] text-sm">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="drafts">
          <Card className="border-none shadow-sm">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-[#6B7280] opacity-50" />
              <p className="text-[#6B7280]">No draft announcements</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantAnnouncements;
