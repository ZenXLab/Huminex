import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  RefreshCw,
  Database,
  Shield,
  Zap
} from "lucide-react";

export const AdminMSPMonitoring = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  // Mock data for MSP monitoring
  const servers = [
    { id: 1, name: "PROD-WEB-01", status: "online", cpu: 45, memory: 62, disk: 78, uptime: "99.98%" },
    { id: 2, name: "PROD-WEB-02", status: "online", cpu: 38, memory: 55, disk: 65, uptime: "99.99%" },
    { id: 3, name: "PROD-DB-01", status: "online", cpu: 72, memory: 84, disk: 45, uptime: "99.95%" },
    { id: 4, name: "PROD-API-01", status: "warning", cpu: 89, memory: 91, disk: 52, uptime: "99.87%" },
    { id: 5, name: "DEV-ALL-01", status: "online", cpu: 23, memory: 41, disk: 33, uptime: "98.50%" },
  ];

  const alerts = [
    { id: 1, severity: "warning", message: "High CPU usage on PROD-API-01", time: "5 min ago" },
    { id: 2, severity: "info", message: "Scheduled maintenance in 24 hours", time: "1 hour ago" },
    { id: 3, severity: "success", message: "Backup completed successfully", time: "2 hours ago" },
    { id: 4, severity: "warning", message: "Memory usage approaching threshold on PROD-DB-01", time: "3 hours ago" },
  ];

  const services = [
    { name: "Web Application", status: "operational", latency: "45ms" },
    { name: "API Gateway", status: "operational", latency: "12ms" },
    { name: "Database Cluster", status: "operational", latency: "8ms" },
    { name: "CDN", status: "operational", latency: "23ms" },
    { name: "Email Service", status: "degraded", latency: "156ms" },
    { name: "Authentication", status: "operational", latency: "34ms" },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      online: "bg-green-500/20 text-green-500",
      operational: "bg-green-500/20 text-green-500",
      warning: "bg-yellow-500/20 text-yellow-500",
      degraded: "bg-yellow-500/20 text-yellow-500",
      offline: "bg-destructive/20 text-destructive",
      error: "bg-destructive/20 text-destructive",
    };
    return styles[status] || styles.online;
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-primary" />;
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return "bg-destructive";
    if (value >= 75) return "bg-yellow-500";
    return "bg-primary";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">MSP Monitoring</h1>
          <p className="text-muted-foreground">Infrastructure and service health monitoring</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servers.length}</div>
            <p className="text-xs text-muted-foreground">
              {servers.filter(s => s.status === "online").length} online
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.filter(a => a.severity === "warning").length}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.86%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              {services.filter(s => s.status === "operational").length} operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="servers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="servers" className="space-y-4">
          <div className="grid gap-4">
            {servers.map((server) => (
              <Card key={server.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Server className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{server.name}</h3>
                        <p className="text-sm text-muted-foreground">Uptime: {server.uptime}</p>
                      </div>
                    </div>
                    <Badge className={getStatusBadge(server.status)}>{server.status}</Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Cpu className="h-3 w-3" /> CPU
                        </span>
                        <span>{server.cpu}%</span>
                      </div>
                      <Progress value={server.cpu} className={getProgressColor(server.cpu)} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Database className="h-3 w-3" /> Memory
                        </span>
                        <span>{server.memory}%</span>
                      </div>
                      <Progress value={server.memory} className={getProgressColor(server.memory)} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" /> Disk
                        </span>
                        <span>{server.disk}%</span>
                      </div>
                      <Progress value={server.disk} className={getProgressColor(server.disk)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>Current status of all monitored services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${service.status === "operational" ? "bg-green-500" : "bg-yellow-500"}`} />
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{service.latency}</span>
                      <Badge className={getStatusBadge(service.status)}>{service.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getAlertIcon(alert.severity)}
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">{alert.time}</p>
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
