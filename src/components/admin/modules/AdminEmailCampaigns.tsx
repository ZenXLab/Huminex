import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, Send, Users, Eye, MousePointer, TrendingUp, 
  Plus, Calendar, FileText, BarChart3, Clock, CheckCircle2,
  XCircle, Pause, Play
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const campaignData = [
  { name: "Jan", sent: 4500, opened: 2100, clicked: 890 },
  { name: "Feb", sent: 5200, opened: 2600, clicked: 1120 },
  { name: "Mar", sent: 4800, opened: 2400, clicked: 980 },
  { name: "Apr", sent: 6100, opened: 3200, clicked: 1450 },
  { name: "May", sent: 5800, opened: 3100, clicked: 1380 },
  { name: "Jun", sent: 7200, opened: 4100, clicked: 1890 },
];

const campaigns = [
  { id: 1, name: "Product Launch Announcement", status: "sent", sent: 12500, opened: 6800, clicked: 2340, date: "2024-01-15" },
  { id: 2, name: "Monthly Newsletter - January", status: "sent", sent: 8900, opened: 4200, clicked: 1560, date: "2024-01-10" },
  { id: 3, name: "Feature Update Notification", status: "scheduled", sent: 0, opened: 0, clicked: 0, date: "2024-01-20" },
  { id: 4, name: "Holiday Promotion", status: "draft", sent: 0, opened: 0, clicked: 0, date: "" },
  { id: 5, name: "Onboarding Welcome Series", status: "active", sent: 3200, opened: 2100, clicked: 890, date: "2024-01-05" },
];

const templates = [
  { id: 1, name: "Welcome Email", category: "Onboarding", uses: 1250 },
  { id: 2, name: "Product Update", category: "Announcements", uses: 890 },
  { id: 3, name: "Monthly Newsletter", category: "Newsletter", uses: 2340 },
  { id: 4, name: "Promotional Offer", category: "Marketing", uses: 560 },
];

const segmentData = [
  { name: "Active Users", value: 45, color: "#10B981" },
  { name: "New Signups", value: 25, color: "#3B82F6" },
  { name: "Inactive", value: 15, color: "#F59E0B" },
  { name: "Enterprise", value: 15, color: "#8B5CF6" },
];

export const AdminEmailCampaigns = () => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      sent: { variant: "default", icon: <CheckCircle2 className="h-3 w-3" /> },
      active: { variant: "default", icon: <Play className="h-3 w-3" /> },
      scheduled: { variant: "secondary", icon: <Clock className="h-3 w-3" /> },
      draft: { variant: "outline", icon: <FileText className="h-3 w-3" /> },
      paused: { variant: "destructive", icon: <Pause className="h-3 w-3" /> },
    };
    const config = variants[status] || variants.draft;
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Campaigns</h1>
          <p className="text-muted-foreground">Create, manage, and analyze email marketing campaigns</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">48,250</p>
                <p className="text-xs text-green-500">+12.5% vs last month</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Send className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">54.2%</p>
                <p className="text-xs text-green-500">+3.8% vs last month</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Eye className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Click Rate</p>
                <p className="text-2xl font-bold">18.7%</p>
                <p className="text-xs text-green-500">+2.1% vs last month</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <MousePointer className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Subscribers</p>
                <p className="text-2xl font-bold">24,850</p>
                <p className="text-xs text-green-500">+890 this month</p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-full">
                <Users className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                All Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        {campaign.date && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {campaign.date}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {campaign.sent > 0 && (
                        <div className="text-right">
                          <p className="text-sm font-medium">{campaign.sent.toLocaleString()} sent</p>
                          <p className="text-xs text-muted-foreground">
                            {((campaign.opened / campaign.sent) * 100).toFixed(1)}% opened
                          </p>
                        </div>
                      )}
                      {getStatusBadge(campaign.status)}
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Campaign Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={campaignData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="sent" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Sent" />
                    <Area type="monotone" dataKey="opened" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Opened" />
                    <Area type="monotone" dataKey="clicked" stackId="3" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Clicked" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Email Templates
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{template.name}</p>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Used {template.uses.toLocaleString()} times</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Duplicate</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Audience Segments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={segmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {segmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {segmentData.map((segment) => (
                    <div key={segment.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                      <span className="text-sm">{segment.name}</span>
                      <span className="text-sm text-muted-foreground">{segment.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Segment
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Import Contacts
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Run A/B Test
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Campaign
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEmailCampaigns;
