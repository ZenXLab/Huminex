import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Wallet, TrendingUp, TrendingDown, Zap, 
  MessageSquare, Image, FileText, Bot, Clock,
  DollarSign, BarChart3, PieChart, AlertTriangle,
  Download, Calendar, Filter, RefreshCw
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

// Mock Usage Data
const dailyUsageData = [
  { date: "Jan 14", tokens: 125000, cost: 2.50, requests: 450 },
  { date: "Jan 15", tokens: 180000, cost: 3.60, requests: 620 },
  { date: "Jan 16", tokens: 145000, cost: 2.90, requests: 510 },
  { date: "Jan 17", tokens: 210000, cost: 4.20, requests: 720 },
  { date: "Jan 18", tokens: 195000, cost: 3.90, requests: 680 },
  { date: "Jan 19", tokens: 165000, cost: 3.30, requests: 575 },
  { date: "Jan 20", tokens: 235000, cost: 4.70, requests: 810 }
];

const modelUsageData = [
  { name: "GPT-4", tokens: 450000, cost: 13.50, requests: 1200, color: "#8B5CF6" },
  { name: "GPT-3.5", tokens: 320000, cost: 1.60, requests: 2800, color: "#06B6D4" },
  { name: "Claude 3", tokens: 280000, cost: 8.40, requests: 950, color: "#10B981" },
  { name: "Gemini Pro", tokens: 180000, cost: 3.60, requests: 640, color: "#F59E0B" }
];

const featureUsageData = [
  { feature: "Chat Support", requests: 2450, tokens: 520000, cost: 12.50, trend: "+15%" },
  { feature: "Document Analysis", requests: 890, tokens: 380000, cost: 9.20, trend: "+8%" },
  { feature: "Content Generation", requests: 1230, tokens: 290000, cost: 7.10, trend: "+22%" },
  { feature: "Code Assistance", requests: 560, tokens: 180000, cost: 4.40, trend: "-5%" },
  { feature: "Email Drafting", requests: 780, tokens: 150000, cost: 3.60, trend: "+12%" },
  { feature: "Data Extraction", requests: 340, tokens: 95000, cost: 2.30, trend: "+18%" }
];

const tenantUsageData = [
  { tenant: "TechCorp Inc", tokens: 180000, cost: 4.35, plan: "Enterprise", usage: 72 },
  { tenant: "StartupIO", tokens: 95000, cost: 2.30, plan: "Professional", usage: 85 },
  { tenant: "Enterprise Solutions", tokens: 145000, cost: 3.50, plan: "Enterprise", usage: 58 },
  { tenant: "SmallBiz Ltd", tokens: 45000, cost: 1.10, plan: "Starter", usage: 90 },
  { tenant: "AgriTech Farms", tokens: 72000, cost: 1.75, plan: "Professional", usage: 65 }
];

export const AdminAIUsage: React.FC = () => {
  const [timeRange, setTimeRange] = useState("7d");
  
  const totalTokens = modelUsageData.reduce((sum, m) => sum + m.tokens, 0);
  const totalCost = modelUsageData.reduce((sum, m) => sum + m.cost, 0);
  const totalRequests = modelUsageData.reduce((sum, m) => sum + m.requests, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Usage & Costs</h1>
          <p className="text-muted-foreground">Monitor AI feature usage and track costs across tenants</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 7 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Brain className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(totalTokens / 1000000).toFixed(2)}M</p>
                <p className="text-sm text-muted-foreground">Total Tokens</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-500">
              <TrendingUp className="w-3 h-3" />
              <span>+18% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Cost</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-yellow-500">
              <TrendingUp className="w-3 h-3" />
              <span>+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalRequests.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">API Requests</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-500">
              <TrendingUp className="w-3 h-3" />
              <span>+25% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">245ms</p>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-500">
              <TrendingDown className="w-3 h-3" />
              <span>-8% faster than last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">By Model</TabsTrigger>
          <TabsTrigger value="features">By Feature</TabsTrigger>
          <TabsTrigger value="tenants">By Tenant</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Usage Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Trend</CardTitle>
              <CardDescription>Daily token usage and costs over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyUsageData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }} 
                    />
                    <Area yAxisId="left" type="monotone" dataKey="tokens" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} name="Tokens" />
                    <Area yAxisId="right" type="monotone" dataKey="cost" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Cost ($)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Model Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Usage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={modelUsageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="tokens"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {modelUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost by Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modelUsageData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="cost" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modelUsageData.map((model) => (
              <Card key={model.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${model.color}20` }}>
                        <Bot className="w-5 h-5" style={{ color: model.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">{model.requests.toLocaleString()} requests</p>
                      </div>
                    </div>
                    <Badge variant="outline">${model.cost.toFixed(2)}</Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Token Usage</span>
                        <span>{(model.tokens / 1000).toFixed(0)}K tokens</span>
                      </div>
                      <Progress value={(model.tokens / totalTokens) * 100} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Avg per Request</p>
                        <p className="font-medium">{Math.round(model.tokens / model.requests)} tokens</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cost per 1K Tokens</p>
                        <p className="font-medium">${((model.cost / model.tokens) * 1000).toFixed(4)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Feature</th>
                      <th className="text-left p-4 font-medium">Requests</th>
                      <th className="text-left p-4 font-medium">Tokens</th>
                      <th className="text-left p-4 font-medium">Cost</th>
                      <th className="text-left p-4 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureUsageData.map((feature) => (
                      <tr key={feature.feature} className="border-t">
                        <td className="p-4 font-medium">{feature.feature}</td>
                        <td className="p-4">{feature.requests.toLocaleString()}</td>
                        <td className="p-4">{(feature.tokens / 1000).toFixed(0)}K</td>
                        <td className="p-4">${feature.cost.toFixed(2)}</td>
                        <td className="p-4">
                          <Badge variant={feature.trend.startsWith('+') ? 'default' : 'secondary'}>
                            {feature.trend}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Tenant</th>
                      <th className="text-left p-4 font-medium">Plan</th>
                      <th className="text-left p-4 font-medium">Tokens Used</th>
                      <th className="text-left p-4 font-medium">Cost</th>
                      <th className="text-left p-4 font-medium">Quota Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenantUsageData.map((tenant) => (
                      <tr key={tenant.tenant} className="border-t">
                        <td className="p-4 font-medium">{tenant.tenant}</td>
                        <td className="p-4">
                          <Badge variant="outline">{tenant.plan}</Badge>
                        </td>
                        <td className="p-4">{(tenant.tokens / 1000).toFixed(0)}K</td>
                        <td className="p-4">${tenant.cost.toFixed(2)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Progress value={tenant.usage} className="h-2 w-20" />
                            <span className={`text-sm ${tenant.usage > 80 ? 'text-orange-500' : ''}`}>
                              {tenant.usage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAIUsage;
