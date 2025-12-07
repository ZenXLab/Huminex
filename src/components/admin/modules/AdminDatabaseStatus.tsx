import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, HardDrive, Activity, Clock, AlertTriangle,
  RefreshCw, Zap, Server, Table2, Search, TrendingUp
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const connectionData = [
  { time: "00:00", active: 45, idle: 120, waiting: 5 },
  { time: "04:00", active: 25, idle: 140, waiting: 2 },
  { time: "08:00", active: 85, idle: 80, waiting: 15 },
  { time: "12:00", active: 120, idle: 50, waiting: 30 },
  { time: "16:00", active: 95, idle: 75, waiting: 20 },
  { time: "20:00", active: 60, idle: 100, waiting: 10 },
];

const queryPerformance = [
  { time: "00:00", avgTime: 12, queries: 4500 },
  { time: "04:00", avgTime: 8, queries: 2800 },
  { time: "08:00", avgTime: 18, queries: 12500 },
  { time: "12:00", avgTime: 25, queries: 18900 },
  { time: "16:00", avgTime: 20, queries: 15600 },
  { time: "20:00", avgTime: 14, queries: 8900 },
];

const tables = [
  { name: "profiles", rows: 45200, size: "128 MB", lastVacuum: "2h ago", bloat: 5 },
  { name: "client_tenants", rows: 1250, size: "24 MB", lastVacuum: "4h ago", bloat: 3 },
  { name: "invoices", rows: 89400, size: "256 MB", lastVacuum: "1h ago", bloat: 8 },
  { name: "projects", rows: 12800, size: "64 MB", lastVacuum: "3h ago", bloat: 4 },
  { name: "support_tickets", rows: 34500, size: "96 MB", lastVacuum: "30m ago", bloat: 2 },
  { name: "audit_logs", rows: 1250000, size: "2.4 GB", lastVacuum: "6h ago", bloat: 12 },
];

const slowQueries = [
  { query: "SELECT * FROM invoices WHERE...", avgTime: 850, calls: 1250, table: "invoices" },
  { query: "SELECT * FROM audit_logs JOIN...", avgTime: 1200, calls: 450, table: "audit_logs" },
  { query: "UPDATE profiles SET...", avgTime: 320, calls: 2800, table: "profiles" },
  { query: "SELECT COUNT(*) FROM...", avgTime: 280, calls: 3200, table: "client_tenants" },
];

const indexes = [
  { name: "idx_profiles_user_id", table: "profiles", size: "12 MB", scans: 125000, status: "healthy" },
  { name: "idx_invoices_created_at", table: "invoices", size: "8 MB", scans: 89000, status: "healthy" },
  { name: "idx_audit_logs_timestamp", table: "audit_logs", size: "156 MB", scans: 45000, status: "warning" },
  { name: "idx_tenants_slug", table: "client_tenants", size: "2 MB", scans: 32000, status: "healthy" },
];

export const AdminDatabaseStatus = () => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      healthy: "default",
      warning: "secondary",
      critical: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Database Status</h1>
          <p className="text-muted-foreground">Monitor database health, performance, and optimize queries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Stats
          </Button>
          <Button className="gap-2">
            <Zap className="h-4 w-4" />
            Run VACUUM
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Database Size</p>
                <p className="text-2xl font-bold">4.2 GB</p>
                <p className="text-xs text-muted-foreground">of 10 GB allocated</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Database className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <Progress value={42} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Connections</p>
                <p className="text-2xl font-bold">85</p>
                <p className="text-xs text-muted-foreground">of 200 max</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Server className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <Progress value={42.5} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Query Time</p>
                <p className="text-2xl font-bold">18ms</p>
                <p className="text-xs text-green-500">-5ms vs yesterday</p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-full">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cache Hit Ratio</p>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-xs text-green-500">+0.3% vs yesterday</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Zap className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="connections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="queries">Slow Queries</TabsTrigger>
          <TabsTrigger value="indexes">Indexes</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Connection Pool (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={connectionData}>
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
                    <Area type="monotone" dataKey="active" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Active" />
                    <Area type="monotone" dataKey="idle" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Idle" />
                    <Area type="monotone" dataKey="waiting" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Waiting" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table2 className="h-5 w-5" />
                Table Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tables.map((table, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Table2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <code className="text-sm font-mono font-medium">{table.name}</code>
                        <p className="text-xs text-muted-foreground">{table.rows.toLocaleString()} rows</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="font-medium">{table.size}</p>
                        <p className="text-xs text-muted-foreground">size</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{table.lastVacuum}</p>
                        <p className="text-xs text-muted-foreground">last vacuum</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${table.bloat > 10 ? 'text-red-500' : table.bloat > 5 ? 'text-amber-500' : 'text-green-500'}`}>
                          {table.bloat}%
                        </p>
                        <p className="text-xs text-muted-foreground">bloat</p>
                      </div>
                      <Button variant="outline" size="sm">Analyze</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Slow Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {slowQueries.map((query, idx) => (
                  <div key={idx} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{query.table}</Badge>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-amber-500 font-medium">{query.avgTime}ms avg</span>
                        <span className="text-muted-foreground">{query.calls.toLocaleString()} calls</span>
                      </div>
                    </div>
                    <code className="text-xs font-mono text-muted-foreground block truncate">
                      {query.query}
                    </code>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">Explain</Button>
                      <Button variant="outline" size="sm">Optimize</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indexes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Index Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {indexes.map((index, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <HardDrive className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <code className="text-sm font-mono font-medium">{index.name}</code>
                        <p className="text-xs text-muted-foreground">on {index.table}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="font-medium">{index.size}</p>
                        <p className="text-xs text-muted-foreground">size</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{index.scans.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">scans</p>
                      </div>
                      {getStatusBadge(index.status)}
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

export default AdminDatabaseStatus;
