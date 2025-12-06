import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  MousePointer, 
  Target, 
  BarChart3, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Megaphone
} from "lucide-react";

export const AdminMarketing = () => {
  const { data: inquiries } = useQuery({
    queryKey: ["marketing-inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: clickstream } = useQuery({
    queryKey: ["marketing-clickstream"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 30);
      
      const { data, error } = await supabase
        .from("clickstream_events")
        .select("*")
        .gte("created_at", since.toISOString());
      if (error) throw error;
      return data;
    },
  });

  // Calculate metrics
  const thisMonth = new Date();
  thisMonth.setDate(1);
  
  const lastMonth = new Date(thisMonth);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const thisMonthLeads = inquiries?.filter(i => new Date(i.created_at || "") >= thisMonth).length || 0;
  const lastMonthLeads = inquiries?.filter(i => {
    const date = new Date(i.created_at || "");
    return date >= lastMonth && date < thisMonth;
  }).length || 0;

  const leadGrowth = lastMonthLeads > 0 
    ? Math.round(((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100) 
    : 100;

  const uniqueVisitors = new Set(clickstream?.map(e => e.session_id)).size;
  const pageViews = clickstream?.filter(e => e.event_type === "pageview").length || 0;
  const clicks = clickstream?.filter(e => e.event_type === "click").length || 0;

  // Source breakdown
  const sourceBreakdown = inquiries?.reduce((acc, inq) => {
    const source = inq.source || "website";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Service interest breakdown
  const serviceBreakdown = inquiries?.reduce((acc, inq) => {
    const service = inq.service_interest || "General";
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const sortedServices = Object.entries(serviceBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  // Top pages
  const topPages = clickstream?.reduce((acc, event) => {
    if (event.page_url && event.event_type === "pageview") {
      acc[event.page_url] = (acc[event.page_url] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const sortedPages = Object.entries(topPages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Mock campaign data
  const campaigns = [
    { name: "Q4 Enterprise Push", status: "active", leads: 45, spend: 2500, roi: 320 },
    { name: "LinkedIn Tech Outreach", status: "active", leads: 28, spend: 1200, roi: 280 },
    { name: "Google Ads - Cloud", status: "paused", leads: 18, spend: 800, roi: 210 },
    { name: "Retargeting - Visitors", status: "active", leads: 12, spend: 400, roi: 450 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketing Analytics</h1>
        <p className="text-muted-foreground">Track campaigns, conversions, and marketing performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inquiries?.length || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {leadGrowth >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
              )}
              <span className={leadGrowth >= 0 ? "text-green-500" : "text-destructive"}>
                {Math.abs(leadGrowth)}%
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pageViews > 0 ? ((clicks / pageViews) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Engagement rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Service Interest
                </CardTitle>
                <CardDescription>Leads by service category</CardDescription>
              </CardHeader>
              <CardContent>
                {sortedServices.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No data yet</div>
                ) : (
                  <div className="space-y-3">
                    {sortedServices.map(([service, count]) => {
                      const percentage = Math.round((count / (inquiries?.length || 1)) * 100);
                      return (
                        <div key={service} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="capitalize">{service.replace(/-/g, " ")}</span>
                            <span className="font-medium">{count} ({percentage}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${percentage}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Pages
                </CardTitle>
                <CardDescription>Most visited pages</CardDescription>
              </CardHeader>
              <CardContent>
                {sortedPages.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No data yet</div>
                ) : (
                  <div className="space-y-3">
                    {sortedPages.map(([page, count], i) => (
                      <div key={page} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-4">{i + 1}.</span>
                          <span className="truncate max-w-52">{page}</span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Active Campaigns
              </CardTitle>
              <CardDescription>Track campaign performance and ROI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge className={campaign.status === "active" ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Leads</p>
                        <p className="font-bold">{campaign.leads}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Spend</p>
                        <p className="font-bold">${campaign.spend}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">ROI</p>
                        <p className="font-bold text-green-500">{campaign.roi}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Lead Sources
              </CardTitle>
              <CardDescription>Where your leads come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(sourceBreakdown).map(([source, count]) => {
                  const percentage = Math.round((count / (inquiries?.length || 1)) * 100);
                  return (
                    <div key={source} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="font-medium capitalize">{source}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{count}</p>
                        <p className="text-sm text-muted-foreground">{percentage}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
