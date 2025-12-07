import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, Cpu, HardDrive, MemoryStick, Activity, 
  Wifi, AlertTriangle, CheckCircle, XCircle, Clock,
  RefreshCw, Settings, TrendingUp, TrendingDown,
  Thermometer, Zap, Globe, Database
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

// Mock Server Data
const servers = [
  {
    id: "srv-1",
    name: "Primary App Server",
    type: "Application",
    ip: "10.0.1.10",
    location: "Mumbai, IN",
    status: "healthy",
    uptime: "45 days, 12 hours",
    cpu: 45,
    memory: 62,
    disk: 38,
    network: { in: 125, out: 89 },
    temperature: 52,
    processes: 234,
    connections: 1250
  },
  {
    id: "srv-2",
    name: "Database Server",
    type: "Database",
    ip: "10.0.1.20",
    location: "Mumbai, IN",
    status: "healthy",
    uptime: "60 days, 8 hours",
    cpu: 28,
    memory: 78,
    disk: 55,
    network: { in: 450, out: 380 },
    temperature: 48,
    processes: 89,
    connections: 340
  },
  {
    id: "srv-3",
    name: "Redis Cache",
    type: "Cache",
    ip: "10.0.1.30",
    location: "Mumbai, IN",
    status: "healthy",
    uptime: "30 days, 5 hours",
    cpu: 15,
    memory: 42,
    disk: 12,
    network: { in: 890, out: 920 },
    temperature: 42,
    processes: 24,
    connections: 2450
  },
  {
    id: "srv-4",
    name: "Worker Server",
    type: "Worker",
    ip: "10.0.1.40",
    location: "Bangalore, IN",
    status: "warning",
    uptime: "15 days, 2 hours",
    cpu: 85,
    memory: 71,
    disk: 45,
    network: { in: 56, out: 42 },
    temperature: 68,
    processes: 156,
    connections: 89
  },
  {
    id: "srv-5",
    name: "Backup Server",
    type: "Backup",
    ip: "10.0.2.10",
    location: "Hyderabad, IN",
    status: "healthy",
    uptime: "90 days, 14 hours",
    cpu: 8,
    memory: 25,
    disk: 72,
    network: { in: 12, out: 8 },
    temperature: 38,
    processes: 45,
    connections: 12
  }
];

const cpuHistory = [
  { time: "00:00", srv1: 35, srv2: 25, srv3: 12, srv4: 78 },
  { time: "04:00", srv1: 38, srv2: 28, srv3: 14, srv4: 82 },
  { time: "08:00", srv1: 52, srv2: 35, srv3: 18, srv4: 88 },
  { time: "12:00", srv1: 48, srv2: 32, srv3: 16, srv4: 85 },
  { time: "16:00", srv1: 55, srv2: 38, srv3: 20, srv4: 90 },
  { time: "20:00", srv1: 42, srv2: 26, srv3: 15, srv4: 82 },
  { time: "24:00", srv1: 45, srv2: 28, srv3: 15, srv4: 85 }
];

const systemEvents = [
  { id: "1", server: "Worker Server", event: "High CPU Usage Alert", severity: "warning", time: "5 mins ago" },
  { id: "2", server: "Primary App Server", event: "Auto-scaling triggered", severity: "info", time: "15 mins ago" },
  { id: "3", server: "Database Server", event: "Backup completed successfully", severity: "success", time: "1 hour ago" },
  { id: "4", server: "Redis Cache", event: "Memory optimization applied", severity: "info", time: "2 hours ago" },
  { id: "5", server: "Worker Server", event: "Process restart initiated", severity: "warning", time: "3 hours ago" }
];

export const AdminServerHealth: React.FC = () => {
  const [selectedServer, setSelectedServer] = useState(servers[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500 bg-green-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'critical': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getUsageColor = (value: number) => {
    if (value >= 80) return 'bg-red-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const healthyServers = servers.filter(s => s.status === 'healthy').length;
  const warningServers = servers.filter(s => s.status === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Server Health</h1>
          <p className="text-muted-foreground">Monitor server performance and system metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure Alerts
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Server className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{servers.length}</p>
                <p className="text-sm text-muted-foreground">Total Servers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{healthyServers}</p>
                <p className="text-sm text-muted-foreground">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{warningServers}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">99.95%</p>
                <p className="text-sm text-muted-foreground">Avg Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Server List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Servers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {servers.map((server) => (
                <div
                  key={server.id}
                  onClick={() => setSelectedServer(server)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedServer.id === server.id ? 'bg-muted/50 border-l-2 border-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{server.name}</span>
                    </div>
                    <Badge className={getStatusColor(server.status)}>
                      {getStatusIcon(server.status)}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {server.type} • {server.ip}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">CPU</div>
                      <Progress value={server.cpu} className={`h-1 ${getUsageColor(server.cpu)}`} />
                      <div className="text-xs mt-0.5">{server.cpu}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">MEM</div>
                      <Progress value={server.memory} className={`h-1 ${getUsageColor(server.memory)}`} />
                      <div className="text-xs mt-0.5">{server.memory}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Disk</div>
                      <Progress value={server.disk} className={`h-1 ${getUsageColor(server.disk)}`} />
                      <div className="text-xs mt-0.5">{server.disk}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Server Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  {selectedServer.name}
                </CardTitle>
                <CardDescription>{selectedServer.type} • {selectedServer.location}</CardDescription>
              </div>
              <Badge className={getStatusColor(selectedServer.status)}>
                {getStatusIcon(selectedServer.status)}
                <span className="ml-1 capitalize">{selectedServer.status}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Resource Gauges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <Cpu className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">{selectedServer.cpu}%</p>
                    <p className="text-sm text-muted-foreground">CPU Usage</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <MemoryStick className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">{selectedServer.memory}%</p>
                    <p className="text-sm text-muted-foreground">Memory</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <HardDrive className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">{selectedServer.disk}%</p>
                    <p className="text-sm text-muted-foreground">Disk</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <Thermometer className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-bold">{selectedServer.temperature}°C</p>
                    <p className="text-sm text-muted-foreground">Temperature</p>
                  </div>
                </div>

                {/* Server Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">IP Address</p>
                    <p className="font-mono">{selectedServer.ip}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="font-medium">{selectedServer.uptime}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Processes</p>
                    <p className="font-medium">{selectedServer.processes}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Connections</p>
                    <p className="font-medium">{selectedServer.connections}</p>
                  </div>
                </div>

                {/* Network Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Network In</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedServer.network.in} MB/s</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">Network Out</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedServer.network.out} MB/s</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metrics">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cpuHistory}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))' 
                        }} 
                      />
                      <Area type="monotone" dataKey="srv1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} name="App Server" />
                      <Area type="monotone" dataKey="srv2" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} name="DB Server" />
                      <Area type="monotone" dataKey="srv4" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} name="Worker" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="events">
                <div className="space-y-3">
                  {systemEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Badge className={
                        event.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                        event.severity === 'success' ? 'bg-green-500/10 text-green-500' :
                        'bg-blue-500/10 text-blue-500'
                      }>
                        {event.severity === 'warning' ? <AlertTriangle className="w-3 h-3" /> :
                         event.severity === 'success' ? <CheckCircle className="w-3 h-3" /> :
                         <Activity className="w-3 h-3" />}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium">{event.event}</p>
                        <p className="text-sm text-muted-foreground">{event.server}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{event.time}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminServerHealth;
