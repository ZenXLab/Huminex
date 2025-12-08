import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Pin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AnnouncementsWidget = () => {
  // Mock data - would come from API
  const announcements = [
    { 
      id: 1, 
      title: "Holiday Schedule 2025", 
      excerpt: "Please find the updated holiday calendar for the upcoming year...",
      date: "Dec 5, 2024",
      isPinned: true,
      category: "HR",
    },
    { 
      id: 2, 
      title: "Office Renovation Notice", 
      excerpt: "The 3rd floor will be under renovation from Dec 15-20...",
      date: "Dec 3, 2024",
      isPinned: false,
      category: "Admin",
    },
    { 
      id: 3, 
      title: "Q4 Town Hall Meeting", 
      excerpt: "Join us for the quarterly town hall on December 20th...",
      date: "Dec 1, 2024",
      isPinned: false,
      category: "Event",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "HR": return "bg-purple-500/20 text-purple-600";
      case "Admin": return "bg-blue-500/20 text-blue-600";
      case "Event": return "bg-pink-500/20 text-pink-600";
      case "Policy": return "bg-yellow-500/20 text-yellow-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-primary" />
            Announcements
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {announcements.length} new
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {announcements.map((announcement) => (
          <div 
            key={announcement.id} 
            className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-2">
              {announcement.isPinned && (
                <Pin className="w-3 h-3 text-primary flex-shrink-0 mt-1" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getCategoryColor(announcement.category)}`}>
                    {announcement.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {announcement.date}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {announcement.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {announcement.excerpt}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          </div>
        ))}

        <Button variant="link" size="sm" className="h-auto p-0 text-xs w-full">
          View All Announcements →
        </Button>
      </CardContent>
    </Card>
  );
};
