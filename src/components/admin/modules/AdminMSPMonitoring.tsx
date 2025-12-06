import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Server, 
  Plus, 
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
  Trash2,
  Zap
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const AdminMSPMonitoring = () => {
  const queryClient = useQueryClient();
  const [isAddServerOpen, setIsAddServerOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<string>("all");
  const [newServer, setNewServer] = useState({
    name: "",
    server_type: "web",
    ip_address: "",
    hostname: "",
    tenant_id: ""
  });

  // Fetch all tenants
  const { data: tenants } = useQuery({
    queryKey: ["admin-tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_tenants")
        .select("id, name, slug")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch all servers
  const { data: servers, isLoading: serversLoading, refetch: refetchServers } = useQuery({
    queryKey: ["admin-msp-servers", selectedTenant],
    queryFn: async () => {
      let query = supabase
        .from("client_msp_servers")
        .select(`*, client_tenants (id, name, slug)`)
        .order("name");
      
      if (selectedTenant !== "all") {
        query = query.eq("tenant_id", selectedTenant);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch all alerts
  const { data: alerts, refetch: refetchAlerts } = useQuery({
    queryKey: ["admin-msp-alerts", selectedTenant],
    queryFn: async () => {
      let query = supabase
        .from("client_msp_alerts")
        .select(`*, client_msp_servers (name), client_tenants (name)`)
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (selectedTenant !== "all") {
        query = query.eq("tenant_id", selectedTenant);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch metrics for overview
  const { data: latestMetrics } = useQuery({
    queryKey: ["admin-msp-latest-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_msp_metrics")
        .select("*, client_msp_servers(name, tenant_id)")
        .order("recorded_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  // Add server mutation
  const addServerMutation = useMutation({
    mutationFn: async (server: typeof newServer) => {
      const { error } = await supabase.from("client_msp_servers").insert([{
        ...server,
        status: "unknown"
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-msp-servers"] });
      toast.success("Server added successfully");
      setIsAddServerOpen(false);
      setNewServer({ name: "", server_type: "web", ip_address: "", hostname: "", tenant_id: "" });
    },
    onError: () => toast.error("Failed to add server"),
  });

  // Delete server mutation
  const deleteServerMutation = useMutation({
    mutationFn: async (serverId: string) => {
      const { error } = await supabase.from("client_msp_servers").delete().eq("id", serverId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-msp-servers"] });
      toast.success("Server removed");
    },
    onError: () => toast.error("Failed to remove server"),
  });

  // Update server status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ serverId, status }: { serverId: string; status: string }) => {
      const { error } = await supabase
        .from("client_msp_servers")
        .update({ status, last_ping_at: new Date().toISOString() })
        .eq("id", serverId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-msp-servers"] });
      toast.success("Server status updated");
    },
  });

  // Resolve alert mutation
  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from("client_msp_alerts")
        .update({ is_resolved: true, resolved_at: new Date().toISOString() })
        .eq("id", alertId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-msp-alerts"] });
      toast.success("Alert resolved");
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500/20 text-emerald-500';
      case 'offline': return 'bg-destructive/20 text-destructive';
      case 'warning': return 'bg-amber-500/20 text-amber-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/20 text-destructive';
      case 'warning': return 'bg-amber-500/20 text-amber-500';
      default: return 'bg-blue-500/20 text-blue-500';
    }
  };

  // Stats
  const totalServers = servers?.length || 0;
  const onlineServers = servers?.filter((s: any) => s.status === 'online').length || 0;
  const offlineServers = servers?.filter((s: any) => s.status === 'offline').length || 0;
  const activeAlerts = alerts?.filter((a: any) => !a.is_resolved).length || 0;

  // Calculate average metrics
  const avgCpu = latestMetrics?.length ? latestMetrics.reduce((acc: number, m: any) => acc + (m.cpu_usage || 0), 0) / latestMetrics.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">MSP Monitoring</h1>
          <p className="text-muted-foreground">Manage and monitor client servers across all tenants</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTenant} onValueChange={setSelectedTenant}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Tenants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tenants</SelectItem>
              {tenants?.map((tenant: any) => (
                <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => { refetchServers(); refetchAlerts(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddServerOpen} onOpenChange={setIsAddServerOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Server
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Server</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Tenant *</Label>
                  <Select value={newServer.tenant_id} onValueChange={(v) => setNewServer({ ...newServer, tenant_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants?.map((tenant: any) => (
                        <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Server Name *</Label>
                  <Input
                    value={newServer.name}
                    onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                    placeholder="Production Web Server"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Server Type</Label>
                    <Select value={newServer.server_type} onValueChange={(v) => setNewServer({ ...newServer, server_type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web Server</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="application">Application</SelectItem>
                        <SelectItem value="file">File Server</SelectItem>
                        <SelectItem value="cache">Cache Server</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>IP Address</Label>
                    <Input
                      value={newServer.ip_address}
                      onChange={(e) => setNewServer({ ...newServer, ip_address: e.target.value })}
                      placeholder="192.168.1.100"
                    />
                  </div>
                </div>
                <div>
                  <Label>Hostname</Label>
                  <Input
                    value={newServer.hostname}
                    onChange={(e) => setNewServer({ ...newServer, hostname: e.target.value })}
                    placeholder="server.example.com"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => addServerMutation.mutate(newServer)}
                  disabled={!newServer.name || !newServer.tenant_id || addServerMutation.isPending}
                >
                  {addServerMutation.isPending ? "Adding..." : "Add Server"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{onlineServers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{offlineServers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg CPU</CardTitle>
            <Cpu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCpu.toFixed(1)}%</div>
            <Progress value={avgCpu} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{activeAlerts}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="servers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="servers">Servers ({totalServers})</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts
            {activeAlerts > 0 && <Badge className="ml-2 bg-destructive">{activeAlerts}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="servers">
          <Card>
            <CardContent className="pt-6">
              {serversLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading servers...</div>
              ) : servers?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No servers configured. Add your first server to start monitoring.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Server</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>IP / Hostname</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Ping</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servers?.map((server: any) => (
                      <TableRow key={server.id}>
                        <TableCell className="font-medium">{server.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{server.client_tenants?.name || 'Unknown'}</Badge>
                        </TableCell>
                        <TableCell className="capitalize">{server.server_type}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {server.ip_address || server.hostname || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(server.status)}>{server.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {server.last_ping_at 
                            ? new Date(server.last_ping_at).toLocaleString() 
                            : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateStatusMutation.mutate({ serverId: server.id, status: 'online' })}
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateStatusMutation.mutate({ serverId: server.id, status: 'offline' })}
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteServerMutation.mutate(server.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardContent className="pt-6">
              {alerts?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-emerald-500" />
                  <p>No alerts. All systems running normally.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead>Server</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts?.map((alert: any) => (
                      <TableRow key={alert.id} className={alert.is_resolved ? 'opacity-50' : ''}>
                        <TableCell>
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                        </TableCell>
                        <TableCell>{alert.client_msp_servers?.name || '-'}</TableCell>
                        <TableCell>{alert.client_tenants?.name || '-'}</TableCell>
                        <TableCell className="capitalize">{alert.alert_type?.replace('_', ' ')}</TableCell>
                        <TableCell className="max-w-xs truncate">{alert.message}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {alert.is_resolved ? (
                            <Badge className="bg-emerald-500/20 text-emerald-500">Resolved</Badge>
                          ) : (
                            <Badge className="bg-amber-500/20 text-amber-500">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {!alert.is_resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveAlertMutation.mutate(alert.id)}
                            >
                              Resolve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  CPU Usage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  {latestMetrics && latestMetrics.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={latestMetrics.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="client_msp_servers.name" 
                          className="text-xs"
                          tickFormatter={(val) => val?.slice(0, 10) || ''}
                        />
                        <YAxis domain={[0, 100]} className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="cpu_usage" fill="hsl(var(--primary))" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No metrics data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Memory Usage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  {latestMetrics && latestMetrics.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={latestMetrics.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="client_msp_servers.name" 
                          className="text-xs"
                          tickFormatter={(val) => val?.slice(0, 10) || ''}
                        />
                        <YAxis domain={[0, 100]} className="text-xs" />
                        <Tooltip />
                        <Bar dataKey="memory_usage" fill="hsl(var(--accent))" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No metrics data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
