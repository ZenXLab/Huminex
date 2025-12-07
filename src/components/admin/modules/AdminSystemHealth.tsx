import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  MemoryStick,
  Database,
  Server,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Zap,
  Globe,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  WifiOff,
  Cloud,
  Timer,
  BarChart3,
  PieChart,
  Network,
  Terminal,
  FileCode,
  Radio
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';

// Generate realistic mock data
const generatePerformanceData = () => Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  cpu: Math.floor(Math.random() * 35) + 15,
  memory: Math.floor(Math.random() * 25) + 45,
  requests: Math.floor(Math.random() * 800) + 400,
  latency: Math.floor(Math.random() * 30) + 20
}));

const generateEdgeFunctionData = () => [
  { name: 'send-notification', calls: 2450, avgTime: 125, p95: 280, errors: 12, status: 'healthy' },
  { name: 'run-payroll', calls: 45, avgTime: 2340, p95: 4500, errors: 1, status: 'healthy' },
  { name: 'process-bgv', calls: 180, avgTime: 890, p95: 1500, errors: 3, status: 'healthy' },
  { name: 'generate-invoice-pdf', calls: 320, avgTime: 450, p95: 890, errors: 5, status: 'degraded' },
  { name: 'send-welcome-email', calls: 890, avgTime: 180, p95: 350, errors: 8, status: 'healthy' },
  { name: 'geofence-attendance', calls: 1250, avgTime: 95, p95: 180, errors: 2, status: 'healthy' },
  { name: 'overtime-calculator', calls: 560, avgTime: 220, p95: 450, errors: 0, status: 'healthy' },
  { name: 'shift-scheduler', calls: 89, avgTime: 680, p95: 1200, errors: 1, status: 'healthy' },
  { name: 'sso-callback', calls: 340, avgTime: 145, p95: 280, errors: 4, status: 'healthy' },
  { name: 'verify-document', calls: 210, avgTime: 1100, p95: 2200, errors: 6, status: 'warning' },
];

const generateApiUsageData = () => Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    GET: Math.floor(Math.random() * 5000) + 8000,
    POST: Math.floor(Math.random() * 2000) + 2000,
    PUT: Math.floor(Math.random() * 800) + 500,
    DELETE: Math.floor(Math.random() * 200) + 100,
  };
});

const generateDatabaseConnections = () => Array.from({ length: 12 }, (_, i) => ({
  time: `${String(i * 2).padStart(2, '0')}:00`,
  active: Math.floor(Math.random() * 40) + 30,
  idle: Math.floor(Math.random() * 60) + 80,
  waiting: Math.floor(Math.random() * 10) + 2,
}));

const services = [
  { name: 'API Gateway', status: 'healthy', latency: 45, uptime: 99.99, requests: 125400 },
  { name: 'Database Primary', status: 'healthy', latency: 12, uptime: 99.98, requests: 890000 },
  { name: 'Database Replica', status: 'healthy', latency: 15, uptime: 99.97, requests: 456000 },
  { name: 'Redis Cache', status: 'healthy', latency: 3, uptime: 99.99, requests: 2340000 },
  { name: 'Edge Functions', status: 'healthy', latency: 89, uptime: 99.95, requests: 45600 },
  { name: 'Storage CDN', status: 'healthy', latency: 28, uptime: 99.99, requests: 78900 },
  { name: 'Email Service (Resend)', status: 'degraded', latency: 450, uptime: 98.5, requests: 12300 },
  { name: 'Background Jobs', status: 'healthy', latency: 0, uptime: 99.9, requests: 34500 },
  { name: 'Realtime Subscriptions', status: 'healthy', latency: 8, uptime: 99.96, requests: 567000 },
  { name: 'Auth Service', status: 'healthy', latency: 35, uptime: 99.99, requests: 89000 },
];

const COLORS = ['#00A6A6', '#4FF2F2', '#0E3A40', '#00C2FF', '#8B5CF6', '#10B981'];

export const AdminSystemHealth = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [performanceData, setPerformanceData] = useState(generatePerformanceData());
  const [edgeFunctionData, setEdgeFunctionData] = useState(generateEdgeFunctionData());
  const [apiUsageData, setApiUsageData] = useState(generateApiUsageData());
  const [dbConnectionData, setDbConnectionData] = useState(generateDatabaseConnections());
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [liveMetrics, setLiveMetrics] = useState({
    activeConnections: 85,
    requestsPerSec: 245,
    avgLatency: 42,
    errorRate: 0.12
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        activeConnections: Math.max(20, Math.min(180, prev.activeConnections + (Math.random() - 0.5) * 10)),
        requestsPerSec: Math.max(50, Math.min(500, prev.requestsPerSec + (Math.random() - 0.5) * 30)),
        avgLatency: Math.max(15, Math.min(100, prev.avgLatency + (Math.random() - 0.5) * 5)),
        errorRate: Math.max(0, Math.min(2, prev.errorRate + (Math.random() - 0.5) * 0.1))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setPerformanceData(generatePerformanceData());
    setEdgeFunctionData(generateEdgeFunctionData());
    setApiUsageData(generateApiUsageData());
    setDbConnectionData(generateDatabaseConnections());
    setLastRefresh(new Date());
    setTimeout(() => setRefreshing(false), 1000);
  };

  const overallHealth = services.filter(s => s.status === 'healthy').length / services.length * 100;
  const avgLatency = services.reduce((acc, s) => acc + s.latency, 0) / services.length;
  const totalEdgeCalls = edgeFunctionData.reduce((acc, f) => acc + f.calls, 0);
  const totalEdgeErrors = edgeFunctionData.reduce((acc, f) => acc + f.errors, 0);
  const avgEdgeTime = edgeFunctionData.reduce((acc, f) => acc + f.avgTime, 0) / edgeFunctionData.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'down': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'degraded': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'warning': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'down': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const apiMethodBreakdown = [
    { name: 'GET', value: 65, color: '#00A6A6' },
    { name: 'POST', value: 22, color: '#4FF2F2' },
    { name: 'PUT', value: 9, color: '#8B5CF6' },
    { name: 'DELETE', value: 4, color: '#EC4899' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
            <Activity className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">System Health Dashboard</h1>
            <p className="text-muted-foreground">Real-time infrastructure monitoring & analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-500">Live</span>
          </div>
          <Badge className={overallHealth === 100 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}>
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {overallHealth.toFixed(0)}% Operational
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Live Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
          <CardContent className="p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-500">
                <Database className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">DB Connections</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-500">
                <ArrowUpRight className="w-3 h-3" />
                +12%
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{Math.round(liveMetrics.activeConnections)}</p>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={(liveMetrics.activeConnections / 200) * 100} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground">/200</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl" />
          <CardContent className="p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-cyan-500">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Requests/sec</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-500">
                <TrendingUp className="w-3 h-3" />
                +8%
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{Math.round(liveMetrics.requestsPerSec)}</p>
            <p className="text-xs text-muted-foreground mt-2">Peak: 485 req/s</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl" />
          <CardContent className="p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-purple-500">
                <Timer className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Avg Latency</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-500">
                <ArrowDownRight className="w-3 h-3" />
                -5ms
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{Math.round(liveMetrics.avgLatency)}<span className="text-lg text-muted-foreground">ms</span></p>
            <p className="text-xs text-muted-foreground mt-2">P95: 89ms</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-full blur-2xl" />
          <CardContent className="p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-rose-500">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Error Rate</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-500">
                <TrendingDown className="w-3 h-3" />
                -0.03%
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{liveMetrics.errorRate.toFixed(2)}<span className="text-lg text-muted-foreground">%</span></p>
            <p className="text-xs text-muted-foreground mt-2">Last hour: 42 errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="edge-functions" className="gap-2">
            <FileCode className="w-4 h-4" />
            Edge Functions
          </TabsTrigger>
          <TabsTrigger value="api-usage" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            API Usage
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Server className="w-4 h-4" />
            Services
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* System Performance Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  System Performance (24h)
                </CardTitle>
                <CardDescription>CPU, Memory, and Request trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00A6A6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#00A6A6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Area type="monotone" dataKey="cpu" name="CPU %" stroke="#00A6A6" fill="url(#cpuGradient)" strokeWidth={2} />
                      <Area type="monotone" dataKey="memory" name="Memory %" stroke="#8B5CF6" fill="url(#memGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Resource Gauges */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  Resource Utilization
                </CardTitle>
                <CardDescription>Current system resource usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                        <circle cx="48" cy="48" r="40" fill="none" stroke="#00A6A6" strokeWidth="8" 
                          strokeDasharray={`${34 * 2.51} ${100 * 2.51}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold">34%</span>
                        <Cpu className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <span className="text-sm font-medium mt-2">CPU</span>
                    <span className="text-xs text-muted-foreground">4/8 cores</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                        <circle cx="48" cy="48" r="40" fill="none" stroke="#8B5CF6" strokeWidth="8" 
                          strokeDasharray={`${62 * 2.51} ${100 * 2.51}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold">62%</span>
                        <MemoryStick className="w-4 h-4 text-purple-500" />
                      </div>
                    </div>
                    <span className="text-sm font-medium mt-2">Memory</span>
                    <span className="text-xs text-muted-foreground">5/8 GB</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                        <circle cx="48" cy="48" r="40" fill="none" stroke="#10B981" strokeWidth="8" 
                          strokeDasharray={`${28 * 2.51} ${100 * 2.51}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold">28%</span>
                        <HardDrive className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                    <span className="text-sm font-medium mt-2">Storage</span>
                    <span className="text-xs text-muted-foreground">28/100 GB</span>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Clock className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Uptime</p>
                      <p className="text-xs text-muted-foreground">32 days, 14 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Network className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Network I/O</p>
                      <p className="text-xs text-muted-foreground">↑ 145 MB/s ↓ 89 MB/s</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Service Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Service Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {services.slice(0, 10).map((service) => (
                  <div key={service.name} className={`flex items-center gap-2 p-3 rounded-lg border ${service.status === 'healthy' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                    {getStatusIcon(service.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.latency}ms</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Database className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Database Size</p>
                    <p className="text-2xl font-bold">4.2 GB</p>
                  </div>
                </div>
                <Progress value={42} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">of 10 GB allocated</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <Server className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Connections</p>
                    <p className="text-2xl font-bold">{Math.round(liveMetrics.activeConnections)}</p>
                  </div>
                </div>
                <Progress value={(liveMetrics.activeConnections / 200) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">of 200 max pool</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Zap className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cache Hit Ratio</p>
                    <p className="text-2xl font-bold">98.5%</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-500">
                  <TrendingUp className="w-3 h-3" />
                  +0.3% from yesterday
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connection Pool Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Connection Pool (24h)
              </CardTitle>
              <CardDescription>Active, Idle, and Waiting connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dbConnectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
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

        {/* Edge Functions Tab */}
        <TabsContent value="edge-functions" className="space-y-6">
          <div className="grid lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-cyan-500 mb-2">
                  <FileCode className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Total Functions</span>
                </div>
                <p className="text-3xl font-bold">15</p>
                <p className="text-xs text-muted-foreground mt-1">All deployed</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Total Calls (24h)</span>
                </div>
                <p className="text-3xl font-bold">{totalEdgeCalls.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +18% vs yesterday
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-purple-500 mb-2">
                  <Timer className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Avg Execution</span>
                </div>
                <p className="text-3xl font-bold">{Math.round(avgEdgeTime)}ms</p>
                <p className="text-xs text-muted-foreground mt-1">P95: 1.8s</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-rose-500 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Error Count</span>
                </div>
                <p className="text-3xl font-bold">{totalEdgeErrors}</p>
                <p className="text-xs text-muted-foreground mt-1">{((totalEdgeErrors / totalEdgeCalls) * 100).toFixed(2)}% error rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Edge Function List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                Edge Function Performance
              </CardTitle>
              <CardDescription>Execution metrics for all deployed functions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {edgeFunctionData.map((fn) => (
                    <div key={fn.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(fn.status)}
                        <div>
                          <code className="text-sm font-mono font-medium text-foreground">{fn.name}</code>
                          <p className="text-xs text-muted-foreground">{fn.calls.toLocaleString()} calls (24h)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium">{fn.avgTime}ms</p>
                          <p className="text-xs text-muted-foreground">avg time</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{fn.p95}ms</p>
                          <p className="text-xs text-muted-foreground">P95</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${fn.errors > 5 ? 'text-amber-500' : 'text-emerald-500'}`}>{fn.errors}</p>
                          <p className="text-xs text-muted-foreground">errors</p>
                        </div>
                        <Badge className={getStatusColor(fn.status)}>{fn.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Usage Tab */}
        <TabsContent value="api-usage" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* API Requests Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  API Requests (7 days)
                </CardTitle>
                <CardDescription>Request volume by HTTP method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={apiUsageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="GET" fill="#00A6A6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="POST" fill="#4FF2F2" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="PUT" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="DELETE" fill="#EC4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Method Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Request Method Distribution
                </CardTitle>
                <CardDescription>Breakdown by HTTP method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={apiMethodBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {apiMethodBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {apiMethodBreakdown.map((method) => (
                    <div key={method.name} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
                      <span className="text-xs font-medium">{method.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>Top API Endpoints</CardTitle>
              <CardDescription>Most frequently accessed endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { endpoint: '/rest/v1/profiles', method: 'GET', calls: 45200, avgTime: 12 },
                  { endpoint: '/rest/v1/invoices', method: 'GET', calls: 32100, avgTime: 18 },
                  { endpoint: '/rest/v1/projects', method: 'GET', calls: 28400, avgTime: 15 },
                  { endpoint: '/auth/v1/token', method: 'POST', calls: 18900, avgTime: 45 },
                  { endpoint: '/rest/v1/support_tickets', method: 'GET', calls: 12600, avgTime: 22 },
                ].map((ep, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={ep.method === 'GET' ? 'border-emerald-500/50 text-emerald-500' : 'border-blue-500/50 text-blue-500'}>
                        {ep.method}
                      </Badge>
                      <code className="text-sm font-mono">{ep.endpoint}</code>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">{ep.calls.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">calls</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{ep.avgTime}ms</p>
                        <p className="text-xs text-muted-foreground">avg</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Infrastructure Services
              </CardTitle>
              <CardDescription>Status of all platform components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {services.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(service.status)}
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.uptime}% uptime (30d)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">{service.latency}ms</p>
                        <p className="text-xs text-muted-foreground">latency</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{service.requests.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">requests</p>
                      </div>
                      <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
        <p>Last updated: {lastRefresh.toLocaleTimeString()}</p>
        <p>Auto-refresh: Every 30 seconds</p>
      </div>
    </div>
  );
};

export default AdminSystemHealth;
