import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Eye,
  MousePointer,
  ShoppingCart,
  CheckCircle,
  RefreshCw,
  Download,
  Filter
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList, Cell } from "recharts";

// Funnel data
const mainFunnelData = [
  { name: "Page Views", value: 15420, fill: "hsl(var(--primary))" },
  { name: "Engaged Users", value: 8250, fill: "hsl(var(--primary) / 0.8)" },
  { name: "Pricing Page", value: 4120, fill: "hsl(var(--primary) / 0.6)" },
  { name: "Quote Started", value: 1890, fill: "hsl(var(--primary) / 0.4)" },
  { name: "Quote Completed", value: 845, fill: "hsl(var(--primary) / 0.3)" },
  { name: "Converted", value: 312, fill: "hsl(210, 100%, 50%)" },
];

const weeklyConversions = [
  { week: "Week 1", visitors: 3500, leads: 420, conversions: 68 },
  { week: "Week 2", visitors: 4200, leads: 510, conversions: 82 },
  { week: "Week 3", visitors: 3800, leads: 475, conversions: 71 },
  { week: "Week 4", visitors: 4500, leads: 580, conversions: 91 },
];

const funnelSteps = [
  { step: "Homepage Visit", users: 15420, conversionRate: 53.5, dropOff: 46.5, change: 5.2 },
  { step: "Feature Exploration", users: 8250, conversionRate: 49.9, dropOff: 50.1, change: -2.1 },
  { step: "Pricing Page View", users: 4120, conversionRate: 45.9, dropOff: 54.1, change: 3.8 },
  { step: "Quote Started", users: 1890, conversionRate: 44.7, dropOff: 55.3, change: 1.2 },
  { step: "Quote Completed", users: 845, conversionRate: 36.9, dropOff: 63.1, change: -4.5 },
  { step: "Converted to Client", users: 312, conversionRate: 100, dropOff: 0, change: 8.3 },
];

const topDropOffPages = [
  { page: "/pricing", dropOffRate: 54.1, suggestions: "Add comparison table, clarify pricing tiers" },
  { page: "/get-quote/step-2", dropOffRate: 48.2, suggestions: "Simplify form, add progress indicator" },
  { page: "/features/compliance", dropOffRate: 42.5, suggestions: "Add demo video, customer testimonials" },
  { page: "/onboarding/consent", dropOffRate: 38.9, suggestions: "Reduce consent items, add summary" },
];

export const AdminConversionFunnels = () => {
  const [timeRange, setTimeRange] = useState("30d");

  const overallConversionRate = ((312 / 15420) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Conversion Funnels</h1>
          <p className="text-muted-foreground">Track and optimize your conversion funnels</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Conversion</p>
                <p className="text-3xl font-bold text-foreground">{overallConversionRate}%</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +0.8% vs last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Visitors</p>
                <p className="text-3xl font-bold text-foreground">15,420</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quotes Generated</p>
                <p className="text-3xl font-bold text-foreground">845</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <ShoppingCart className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Clients</p>
                <p className="text-3xl font-bold text-emerald-600">312</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnel">Funnel View</TabsTrigger>
          <TabsTrigger value="steps">Step Analysis</TabsTrigger>
          <TabsTrigger value="dropoff">Drop-off Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Main Conversion Funnel</CardTitle>
              <CardDescription>Visitor journey from first visit to conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mainFunnelData.map((step, index) => {
                  const width = (step.value / mainFunnelData[0].value) * 100;
                  const nextStep = mainFunnelData[index + 1];
                  const conversionRate = nextStep 
                    ? ((nextStep.value / step.value) * 100).toFixed(1) 
                    : "100";
                  
                  return (
                    <div key={step.name} className="relative">
                      <div className="flex items-center gap-4">
                        <div className="w-40 text-sm font-medium text-foreground">{step.name}</div>
                        <div className="flex-1 relative">
                          <div 
                            className="h-12 rounded-lg flex items-center justify-end pr-4 text-white font-semibold transition-all duration-500"
                            style={{ 
                              width: `${width}%`, 
                              backgroundColor: step.fill,
                              minWidth: '80px'
                            }}
                          >
                            {step.value.toLocaleString()}
                          </div>
                        </div>
                        {index < mainFunnelData.length - 1 && (
                          <div className="w-24 text-right">
                            <Badge variant="outline" className="text-xs">
                              {conversionRate}% →
                            </Badge>
                          </div>
                        )}
                      </div>
                      {index < mainFunnelData.length - 1 && (
                        <div className="ml-44 h-4 flex items-center">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps">
          <Card>
            <CardHeader>
              <CardTitle>Funnel Step Analysis</CardTitle>
              <CardDescription>Detailed metrics for each funnel step</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funnelSteps.map((step, index) => (
                  <div 
                    key={step.step}
                    className="flex items-center justify-between p-4 bg-muted/30 border border-border/60 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{step.step}</p>
                        <p className="text-sm text-muted-foreground">{step.users.toLocaleString()} users</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Conversion</p>
                        <p className="font-semibold text-emerald-600">{step.conversionRate}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Drop-off</p>
                        <p className="font-semibold text-red-600">{step.dropOff}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Change</p>
                        <p className={`font-semibold flex items-center gap-1 ${step.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {step.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {step.change >= 0 ? '+' : ''}{step.change}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dropoff">
          <Card>
            <CardHeader>
              <CardTitle>Top Drop-off Points</CardTitle>
              <CardDescription>Pages with highest drop-off rates and optimization suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDropOffPages.map((page, index) => (
                  <div 
                    key={page.page}
                    className="p-4 bg-muted/30 border border-border/60 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="destructive" className="text-xs">
                          {page.dropOffRate}% drop-off
                        </Badge>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{page.page}</code>
                      </div>
                      <Button variant="outline" size="sm">Optimize</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Suggestion:</span> {page.suggestions}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Conversion Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyConversions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="visitors" fill="hsl(var(--primary) / 0.3)" name="Visitors" />
                <Bar dataKey="leads" fill="hsl(var(--primary) / 0.6)" name="Leads" />
                <Bar dataKey="conversions" fill="hsl(var(--primary))" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
