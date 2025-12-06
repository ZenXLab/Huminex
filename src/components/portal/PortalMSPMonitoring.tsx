import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  Bell,
  Shield
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface MspServer {
  id: string;
  name: string;
  server_type: string;
  ip_address: string | null;
  hostname: string | null;
  status: string;
  last_ping_at: string | null;
}

interface MspMetric {
  id: string;
  server_id: string;
  cpu_usage: number | null;
  memory_usage: number | null;
  disk_usage: number | null;
  network_in: number | null;
  network_out: number | null;
  uptime_seconds: number | null;
  recorded_at: string;
}

interface MspAlert {
  id: string;
  server_id: string;
  tenant_id: string;
  alert_type: string;
  severity: string;
  message: string;
  is_resolved: boolean;
  created_at: string;
}

export const PortalMSPMonitoring = () => {
  const { user } = useAuth();
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  const { data: servers, isLoading: serversLoading, refetch: refetchServers } = useQuery({
    queryKey: ["client-msp-servers", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_msp_servers")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as MspServer[];
    },
    enabled: !!user,
  });

  const { data: metrics } = useQuery({
    queryKey: ["client-msp-metrics", selectedServer],
    queryFn: async () => {
      if (!selectedServer) return [];
      const { data, error } = await supabase
        .from("client_msp_metrics")
        .select("*")
        .eq("server_id", selectedServer)
        .order("recorded_at", { ascending: false })
        .limit(24);
      if (error) throw error;
      return (data as MspMetric[]).reverse();
    },
    enabled: !!selectedServer,
    refetchInterval: 30000,
  });

  const { data: alerts, refetch: refetchAlerts } = useQuery({
    queryKey: ["client-msp-alerts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_msp_alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as MspAlert[];
    },
    enabled: !!user,
  });

  // Set up realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const metricsChannel = supabase
      .channel('client-msp-metrics-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'client_msp_metrics' }, () => {
        refetchServers();
      })
      .subscribe();

    const alertsChannel = supabase
      .channel('client-msp-alerts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_msp_alerts' }, () => {
        refetchAlerts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(metricsChannel);
      supabase.removeChannel(alertsChannel);
    };
  }, [user, refetchServers, refetchAlerts]);

  // Auto-select first server
  useEffect(() => {
    if (servers?.length && !selectedServer) {
      setSelectedServer(servers[0].id);
    }
  }, [servers, selectedServer]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      case 'offline':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/20 text-destructive';
      case 'warning':
        return 'bg-amber-500/20 text-amber-500';
      default:
        return 'bg-blue-500/20 text-blue-500';
    }
  };

  const formatUptime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const latestMetric = metrics?.[metrics.length - 1];
  const onlineServers = servers?.filter(s => s.status === 'online').length || 0;
  const totalServers = servers?.length || 0;
  const activeAlerts = alerts?.filter(a => !a.is_resolved).length || 0;

  if (serversLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!servers?.length) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">MSP Monitoring</h1>
          <p className="text-muted-foreground">Monitor your server infrastructure in real-time</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Servers Configured</h3>
            <p className="text-muted-foreground">
              Contact your administrator to set up server monitoring for your account.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">MSP Monitoring</h1>
          <p className="text-muted-foreground">Real-time infrastructure monitoring and alerts</p>
        </div>
        <Button variant="outline" onClick={() => { refetchServers(); refetchAlerts(); }}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Servers Online</CardTitle>
            <Server className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineServers}/{totalServers}</div>
            <Progress value={(onlineServers / totalServers) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetric?.cpu_usage?.toFixed(1) || 0}%</div>
            <Progress value={latestMetric?.cpu_usage || 0} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetric?.memory_usage?.toFixed(1) || 0}%</div>
            <Progress value={latestMetric?.memory_usage || 0} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeAlerts === 0 ? 'All systems normal' : 'Requires attention'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="servers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="metrics">Performance</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts
            {activeAlerts > 0 && (
              <Badge className="ml-2 bg-destructive text-destructive-foreground">{activeAlerts}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="servers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {servers.map((server) => (
              <Card 
                key={server.id} 
                className={`cursor-pointer transition-all ${selectedServer === server.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedServer(server.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      {server.name}
                    </CardTitle>
                    <Badge className={getStatusColor(server.status)}>{server.status}</Badge>
                  </div>
                  <CardDescription>{server.server_type} server</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {server.hostname && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hostname:</span>
                        <span className="font-mono">{server.hostname}</span>
                      </div>
                    )}
                    {server.ip_address && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IP:</span>
                        <span className="font-mono">{server.ip_address}</span>
                      </div>
                    )}
                    {server.last_ping_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last ping:</span>
                        <span>{new Date(server.last_ping_at).toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {metrics && metrics.length > 0 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {/* CPU Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      CPU Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metrics}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="recorded_at" 
                            tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            className="text-xs"
                          />
                          <YAxis domain={[0, 100]} className="text-xs" />
                          <Tooltip 
                            labelFormatter={(val) => new Date(val).toLocaleString()}
                            formatter={(val: number) => [`${val.toFixed(1)}%`, 'CPU']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="cpu_usage" 
                            stroke="hsl(var(--primary))" 
                            fill="hsl(var(--primary) / 0.2)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Memory Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Memory Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metrics}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="recorded_at" 
                            tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            className="text-xs"
                          />
                          <YAxis domain={[0, 100]} className="text-xs" />
                          <Tooltip 
                            labelFormatter={(val) => new Date(val).toLocaleString()}
                            formatter={(val: number) => [`${val.toFixed(1)}%`, 'Memory']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="memory_usage" 
                            stroke="hsl(var(--accent))" 
                            fill="hsl(var(--accent) / 0.2)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Server Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <HardDrive className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Disk Usage</p>
                        <p className="text-lg font-semibold">{latestMetric?.disk_usage?.toFixed(1) || 0}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Wifi className="h-8 w-8 text-emerald-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Network In</p>
                        <p className="text-lg font-semibold">{formatBytes(latestMetric?.network_in)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Wifi className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Network Out</p>
                        <p className="text-lg font-semibold">{formatBytes(latestMetric?.network_out)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Clock className="h-8 w-8 text-amber-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                        <p className="text-lg font-semibold">{formatUptime(latestMetric?.uptime_seconds)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Metrics Available</h3>
                <p className="text-muted-foreground">
                  Select a server to view its performance metrics.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts && alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card key={alert.id} className={alert.is_resolved ? 'opacity-60' : ''}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {alert.severity === 'critical' ? (
                          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                        ) : alert.severity === 'warning' ? (
                          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                        ) : (
                          <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                            <Badge variant="outline">{alert.alert_type.replace('_', ' ')}</Badge>
                            {alert.is_resolved && (
                              <Badge className="bg-emerald-500/20 text-emerald-500">Resolved</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm">{alert.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(alert.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
                <p className="text-muted-foreground">
                  All systems are running normally. No alerts to display.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
