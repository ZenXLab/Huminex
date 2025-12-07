import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, Activity, Shield, Clock, AlertTriangle, 
  TrendingUp, Zap, Server, Key, RefreshCw, Eye
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const requestData = [
  { time: "00:00", requests: 1200, errors: 12, latency: 45 },
  { time: "04:00", requests: 800, errors: 5, latency: 38 },
  { time: "08:00", requests: 2400, errors: 28, latency: 52 },
  { time: "12:00", requests: 3200, errors: 35, latency: 58 },
  { time: "16:00", requests: 2800, errors: 22, latency: 48 },
  { time: "20:00", requests: 1800, errors: 15, latency: 42 },
];

const endpoints = [
  { path: "/api/v1/users", method: "GET", calls: 45200, avgLatency: 42, status: "healthy", rateLimit: 1000 },
  { path: "/api/v1/tenants", method: "GET", calls: 32100, avgLatency: 38, status: "healthy", rateLimit: 500 },
  { path: "/api/v1/auth/login", method: "POST", calls: 28500, avgLatency: 125, status: "healthy", rateLimit: 100 },
  { path: "/api/v1/invoices", method: "GET", calls: 18400, avgLatency: 65, status: "warning", rateLimit: 500 },
  { path: "/api/v1/projects", method: "GET", calls: 15600, avgLatency: 52, status: "healthy", rateLimit: 500 },
  { path: "/api/v1/ai/chat", method: "POST", calls: 12300, avgLatency: 850, status: "healthy", rateLimit: 50 },
];

const apiKeys = [
  { name: "Production API Key", prefix: "pk_live_", created: "2024-01-05", lastUsed: "2 min ago", calls: 125000, status: "active" },
  { name: "Staging API Key", prefix: "pk_test_", created: "2024-01-10", lastUsed: "1 hour ago", calls: 45000, status: "active" },
  { name: "Mobile App Key", prefix: "pk_mob_", created: "2024-01-15", lastUsed: "5 min ago", calls: 89000, status: "active" },
  { name: "Legacy Integration", prefix: "pk_leg_", created: "2023-06-20", lastUsed: "2 days ago", calls: 12000, status: "deprecated" },
];

const rateLimitData = [
  { endpoint: "/api/v1/auth", limit: 100, current: 78, color: "#F59E0B" },
  { endpoint: "/api/v1/users", limit: 1000, current: 452, color: "#10B981" },
  { endpoint: "/api/v1/ai", limit: 50, current: 48, color: "#EF4444" },
  { endpoint: "/api/v1/files", limit: 200, current: 120, color: "#3B82F6" },
];

export const AdminAPIGateway = () => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      healthy: "default",
      warning: "secondary",
      error: "destructive",
      deprecated: "outline",
      active: "default",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-green-500/20 text-green-500",
      POST: "bg-blue-500/20 text-blue-500",
      PUT: "bg-yellow-500/20 text-yellow-500",
      DELETE: "bg-red-500/20 text-red-500",
      PATCH: "bg-purple-500/20 text-purple-500",
    };
    return <Badge className={colors[method] || "bg-gray-500/20"}>{method}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">API Gateway</h1>
          <p className="text-muted-foreground">Monitor and manage API endpoints, rate limits, and security</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Key className="h-4 w-4" />
            New API Key
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests (24h)</p>
                <p className="text-2xl font-bold">2.4M</p>
                <p className="text-xs text-green-500">+18.2% vs yesterday</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Globe className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Latency</p>
                <p className="text-2xl font-bold">48ms</p>
                <p className="text-xs text-green-500">-12ms vs yesterday</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">99.87%</p>
                <p className="text-xs text-green-500">+0.12% vs yesterday</p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-full">
                <Activity className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Count</p>
                <p className="text-2xl font-bold">3,142</p>
                <p className="text-xs text-red-500">+5.2% vs yesterday</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="ratelimits">Rate Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Request Traffic (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={requestData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="requests" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Requests" />
                    <Area type="monotone" dataKey="errors" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} name="Errors" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Endpoint Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {endpoints.map((endpoint, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {getMethodBadge(endpoint.method)}
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{endpoint.path}</code>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="font-medium">{endpoint.calls.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">calls/24h</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{endpoint.avgLatency}ms</p>
                        <p className="text-xs text-muted-foreground">avg latency</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{endpoint.rateLimit}/min</p>
                        <p className="text-xs text-muted-foreground">rate limit</p>
                      </div>
                      {getStatusBadge(endpoint.status)}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((key, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{key.name}</p>
                        <code className="text-xs text-muted-foreground">{key.prefix}****</code>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="font-medium">{key.calls.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">total calls</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{key.lastUsed}</p>
                        <p className="text-xs text-muted-foreground">last used</p>
                      </div>
                      {getStatusBadge(key.status)}
                      <Button variant="outline" size="sm">Rotate</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratelimits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Rate Limit Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {rateLimitData.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{item.endpoint}</code>
                    <span className="text-sm">
                      {item.current} / {item.limit} req/min
                    </span>
                  </div>
                  <Progress 
                    value={(item.current / item.limit) * 100} 
                    className="h-3"
                    style={{ 
                      // @ts-ignore
                      '--progress-foreground': item.color 
                    }}
                  />
                  {(item.current / item.limit) > 0.9 && (
                    <p className="text-xs text-amber-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Approaching rate limit
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAPIGateway;
