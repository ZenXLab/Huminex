import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  Play,
  Download,
  Search,
  Plus,
  Copy,
  CheckCircle
} from "lucide-react";

// Mock video call data
const upcomingCalls = [
  { id: 1, title: "Retail Chain Kickoff", client: "Retail Chain Corp", time: "10:00 AM", date: "Feb 9, 2025", duration: "60 min", participants: 5, link: "https://meet.google.com/abc-defg-hij", type: "client" },
  { id: 2, title: "EdTech Weekly Sync", client: "EdTech Solutions", time: "2:30 PM", date: "Feb 8, 2025", duration: "30 min", participants: 3, link: "https://teams.microsoft.com/xyz", type: "client" },
  { id: 3, title: "Hospital Demo", client: "Hospital Network", time: "11:00 AM", date: "Feb 12, 2025", duration: "45 min", participants: 8, link: "https://zoom.us/j/123456789", type: "demo" },
  { id: 4, title: "Sprint Planning", client: "Internal", time: "9:00 AM", date: "Feb 10, 2025", duration: "120 min", participants: 12, link: "https://meet.google.com/xyz-abcd", type: "internal" },
];

const recordings = [
  { id: 1, title: "Manufacturing Co - Discovery Call", date: "Feb 1, 2025", duration: "52:34", size: "245 MB", client: "Manufacturing Co" },
  { id: 2, title: "Fintech Security Review", date: "Jan 28, 2025", duration: "1:15:22", size: "412 MB", client: "Fintech Ltd" },
  { id: 3, title: "Logistics Plus Demo", date: "Jan 25, 2025", duration: "38:45", size: "178 MB", client: "Logistics Plus" },
  { id: 4, title: "Startup Hub Onboarding", date: "Jan 22, 2025", duration: "45:12", size: "210 MB", client: "Startup Hub" },
];

const stats = {
  totalCalls: 156,
  thisWeek: 12,
  avgDuration: "42 min",
  recordingsSize: "8.2 GB"
};

export const AdminVideoConference = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedLink, setCopiedLink] = useState<number | null>(null);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "client": return "bg-blue-100 text-blue-800";
      case "demo": return "bg-purple-100 text-purple-800";
      case "internal": return "bg-slate-100 text-slate-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const copyLink = (id: number, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Video Conferences</h1>
          <p className="text-muted-foreground">Schedule and manage video calls</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Call
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Calls</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalCalls}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Video className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold text-foreground">{stats.thisWeek}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="text-3xl font-bold text-foreground">{stats.avgDuration}</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recordings</p>
                <p className="text-3xl font-bold text-foreground">{stats.recordingsSize}</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100">
                <Play className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Calls</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Scheduled Video Calls</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search calls..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingCalls.map((call) => (
                  <div 
                    key={call.id}
                    className="flex items-center justify-between p-4 bg-muted/30 border border-border/60 rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {call.title}
                          <Badge className={getTypeBadge(call.type)}>{call.type}</Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground">{call.client}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground">{call.date}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="font-medium text-foreground">{call.time}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-medium text-foreground">{call.duration}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Participants</p>
                        <p className="font-medium text-foreground flex items-center justify-center gap-1">
                          <Users className="h-3 w-3" /> {call.participants}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyLink(call.id, call.link)}
                        >
                          {copiedLink === call.id ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="sm" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recordings">
          <Card>
            <CardHeader>
              <CardTitle>Call Recordings</CardTitle>
              <CardDescription>Download and review past meeting recordings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recordings.map((recording) => (
                  <div 
                    key={recording.id}
                    className="flex items-center justify-between p-4 bg-muted/30 border border-border/60 rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Play className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{recording.title}</h3>
                        <p className="text-sm text-muted-foreground">{recording.client}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground">{recording.date}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-medium text-foreground">{recording.duration}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Size</p>
                        <p className="font-medium text-foreground">{recording.size}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Play className="h-4 w-4" />
                          Play
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
