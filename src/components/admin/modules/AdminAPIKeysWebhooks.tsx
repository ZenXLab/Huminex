import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Key, Plus, Copy, RefreshCw, Trash2, Eye, EyeOff, 
  Webhook, Globe, Clock, CheckCircle, XCircle, AlertTriangle,
  Send, Settings, Code, ExternalLink, Filter, Download
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Mock API Keys Data
const mockAPIKeys = [
  {
    id: "1",
    name: "Production API Key",
    key: "atls_live_sk_1234567890abcdef",
    prefix: "atls_live_sk_",
    created_at: "2024-01-15",
    last_used: "2024-01-20 14:32:00",
    status: "active",
    permissions: ["read", "write", "delete"],
    rate_limit: 10000,
    requests_today: 4521,
    tenant: "Global"
  },
  {
    id: "2",
    name: "Test Environment Key",
    key: "atls_test_sk_abcdef1234567890",
    prefix: "atls_test_sk_",
    created_at: "2024-01-10",
    last_used: "2024-01-19 09:15:00",
    status: "active",
    permissions: ["read", "write"],
    rate_limit: 5000,
    requests_today: 892,
    tenant: "Development"
  },
  {
    id: "3",
    name: "Read-Only Analytics Key",
    key: "atls_read_sk_xyz789abc123def",
    prefix: "atls_read_sk_",
    created_at: "2024-01-05",
    last_used: "2024-01-18 16:45:00",
    status: "active",
    permissions: ["read"],
    rate_limit: 20000,
    requests_today: 12450,
    tenant: "Analytics"
  },
  {
    id: "4",
    name: "Deprecated Legacy Key",
    key: "atls_leg_sk_old123456789",
    prefix: "atls_leg_sk_",
    created_at: "2023-06-01",
    last_used: "2023-12-15 11:20:00",
    status: "expired",
    permissions: ["read"],
    rate_limit: 1000,
    requests_today: 0,
    tenant: "Legacy"
  }
];

// Mock Webhooks Data
const mockWebhooks = [
  {
    id: "1",
    name: "New User Registration",
    url: "https://api.example.com/webhooks/user-created",
    events: ["user.created", "user.verified"],
    status: "active",
    created_at: "2024-01-10",
    last_triggered: "2024-01-20 14:30:00",
    success_rate: 99.5,
    total_deliveries: 1250,
    failed_deliveries: 6,
    secret: "whsec_abcdef123456"
  },
  {
    id: "2",
    name: "Payment Events",
    url: "https://payments.example.com/atlas-webhook",
    events: ["invoice.paid", "invoice.overdue", "payment.failed"],
    status: "active",
    created_at: "2024-01-08",
    last_triggered: "2024-01-20 12:15:00",
    success_rate: 98.2,
    total_deliveries: 890,
    failed_deliveries: 16,
    secret: "whsec_payment789xyz"
  },
  {
    id: "3",
    name: "Project Updates",
    url: "https://hooks.slack.com/services/T00/B00/XXX",
    events: ["project.milestone_completed", "project.status_changed"],
    status: "active",
    created_at: "2024-01-05",
    last_triggered: "2024-01-19 18:45:00",
    success_rate: 100,
    total_deliveries: 234,
    failed_deliveries: 0,
    secret: "whsec_slack123"
  },
  {
    id: "4",
    name: "Security Alerts",
    url: "https://security.internal/alerts",
    events: ["security.threat_detected", "security.login_failed"],
    status: "paused",
    created_at: "2024-01-01",
    last_triggered: "2024-01-15 09:00:00",
    success_rate: 95.0,
    total_deliveries: 100,
    failed_deliveries: 5,
    secret: "whsec_security456"
  }
];

// Mock Webhook Logs
const mockWebhookLogs = [
  {
    id: "1",
    webhook_name: "New User Registration",
    event: "user.created",
    status: "success",
    response_code: 200,
    response_time: 145,
    timestamp: "2024-01-20 14:30:00",
    payload_size: "1.2 KB"
  },
  {
    id: "2",
    webhook_name: "Payment Events",
    event: "invoice.paid",
    status: "success",
    response_code: 200,
    response_time: 230,
    timestamp: "2024-01-20 12:15:00",
    payload_size: "2.4 KB"
  },
  {
    id: "3",
    webhook_name: "Project Updates",
    event: "project.milestone_completed",
    status: "success",
    response_code: 200,
    response_time: 89,
    timestamp: "2024-01-19 18:45:00",
    payload_size: "0.8 KB"
  },
  {
    id: "4",
    webhook_name: "Payment Events",
    event: "payment.failed",
    status: "failed",
    response_code: 500,
    response_time: 5000,
    timestamp: "2024-01-19 16:30:00",
    payload_size: "1.5 KB"
  },
  {
    id: "5",
    webhook_name: "Security Alerts",
    event: "security.login_failed",
    status: "failed",
    response_code: 503,
    response_time: 30000,
    timestamp: "2024-01-18 11:20:00",
    payload_size: "0.5 KB"
  }
];

const availableEvents = [
  { category: "User Events", events: ["user.created", "user.verified", "user.updated", "user.deleted"] },
  { category: "Invoice Events", events: ["invoice.created", "invoice.sent", "invoice.paid", "invoice.overdue"] },
  { category: "Payment Events", events: ["payment.success", "payment.failed", "payment.refunded"] },
  { category: "Project Events", events: ["project.created", "project.milestone_completed", "project.status_changed"] },
  { category: "Security Events", events: ["security.threat_detected", "security.login_failed", "security.access_denied"] },
  { category: "Onboarding Events", events: ["onboarding.started", "onboarding.completed", "onboarding.approved"] }
];

export const AdminAPIKeysWebhooks: React.FC = () => {
  const [apiKeys, setApiKeys] = useState(mockAPIKeys);
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);
  const [isCreateWebhookOpen, setIsCreateWebhookOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(["read"]);
  const [newWebhookName, setNewWebhookName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([]);

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const generateNewKey = () => {
    const newKey = {
      id: (apiKeys.length + 1).toString(),
      name: newKeyName,
      key: `atls_live_sk_${Math.random().toString(36).substring(2, 18)}`,
      prefix: "atls_live_sk_",
      created_at: new Date().toISOString().split('T')[0],
      last_used: "Never",
      status: "active",
      permissions: newKeyPermissions,
      rate_limit: 10000,
      requests_today: 0,
      tenant: "Global"
    };
    setApiKeys([...apiKeys, newKey]);
    setIsCreateKeyOpen(false);
    setNewKeyName("");
    setNewKeyPermissions(["read"]);
    toast.success("API Key created successfully");
  };

  const rotateKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId 
        ? { ...key, key: `${key.prefix}${Math.random().toString(36).substring(2, 18)}` }
        : key
    ));
    toast.success("API Key rotated successfully");
  };

  const deleteKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
    toast.success("API Key deleted");
  };

  const createWebhook = () => {
    const newWebhook = {
      id: (webhooks.length + 1).toString(),
      name: newWebhookName,
      url: newWebhookUrl,
      events: newWebhookEvents,
      status: "active",
      created_at: new Date().toISOString().split('T')[0],
      last_triggered: "Never",
      success_rate: 100,
      total_deliveries: 0,
      failed_deliveries: 0,
      secret: `whsec_${Math.random().toString(36).substring(2, 14)}`
    };
    setWebhooks([...webhooks, newWebhook]);
    setIsCreateWebhookOpen(false);
    setNewWebhookName("");
    setNewWebhookUrl("");
    setNewWebhookEvents([]);
    toast.success("Webhook created successfully");
  };

  const toggleWebhookStatus = (webhookId: string) => {
    setWebhooks(webhooks.map(wh => 
      wh.id === webhookId 
        ? { ...wh, status: wh.status === "active" ? "paused" : "active" }
        : wh
    ));
    toast.success("Webhook status updated");
  };

  const testWebhook = (webhookId: string) => {
    toast.success("Test webhook sent successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">API Keys & Webhooks</h1>
          <p className="text-muted-foreground">Manage API credentials and webhook integrations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline" size="sm">
            <Code className="w-4 h-4 mr-2" />
            API Docs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{apiKeys.filter(k => k.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active API Keys</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Webhook className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{webhooks.filter(w => w.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active Webhooks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{apiKeys.reduce((sum, k) => sum + k.requests_today, 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">API Requests Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <CheckCircle className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {(webhooks.reduce((sum, w) => sum + w.success_rate, 0) / webhooks.length).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Webhook Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="api-keys" className="gap-2">
            <Key className="w-4 h-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-2">
            <Webhook className="w-4 h-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <Clock className="w-4 h-4" />
            Execution Logs
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">API Keys</h2>
            <Dialog open={isCreateKeyOpen} onOpenChange={setIsCreateKeyOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Generate a new API key for accessing ATLAS APIs
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Key Name</Label>
                    <Input 
                      placeholder="e.g., Production API Key" 
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="flex gap-4">
                      {["read", "write", "delete"].map(perm => (
                        <div key={perm} className="flex items-center gap-2">
                          <Checkbox 
                            id={perm}
                            checked={newKeyPermissions.includes(perm)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewKeyPermissions([...newKeyPermissions, perm]);
                              } else {
                                setNewKeyPermissions(newKeyPermissions.filter(p => p !== perm));
                              }
                            }}
                          />
                          <Label htmlFor={perm} className="capitalize">{perm}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateKeyOpen(false)}>Cancel</Button>
                  <Button onClick={generateNewKey} disabled={!newKeyName}>Generate Key</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id} className={apiKey.status === 'expired' ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{apiKey.name}</h3>
                        <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                          {apiKey.status}
                        </Badge>
                        <Badge variant="outline">{apiKey.tenant}</Badge>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-sm bg-muted/50 p-2 rounded">
                        <code>
                          {showKey[apiKey.id] 
                            ? apiKey.key 
                            : `${apiKey.prefix}${'•'.repeat(16)}`}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKey[apiKey.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Created: {apiKey.created_at}</span>
                        <span>Last used: {apiKey.last_used}</span>
                        <span>Requests: {apiKey.requests_today.toLocaleString()}/{apiKey.rate_limit.toLocaleString()}</span>
                        <span>Permissions: {apiKey.permissions.join(", ")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => rotateKey(apiKey.id)}
                        disabled={apiKey.status === 'expired'}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Rotate
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteKey(apiKey.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Webhooks</h2>
            <Dialog open={isCreateWebhookOpen} onOpenChange={setIsCreateWebhookOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Webhook</DialogTitle>
                  <DialogDescription>
                    Configure a webhook endpoint to receive event notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Webhook Name</Label>
                    <Input 
                      placeholder="e.g., User Registration Events" 
                      value={newWebhookName}
                      onChange={(e) => setNewWebhookName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Endpoint URL</Label>
                    <Input 
                      placeholder="https://your-server.com/webhook" 
                      value={newWebhookUrl}
                      onChange={(e) => setNewWebhookUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Events to Subscribe</Label>
                    <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-3">
                      {availableEvents.map((category) => (
                        <div key={category.category}>
                          <p className="text-sm font-medium mb-2">{category.category}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {category.events.map((event) => (
                              <div key={event} className="flex items-center gap-2">
                                <Checkbox 
                                  id={event}
                                  checked={newWebhookEvents.includes(event)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setNewWebhookEvents([...newWebhookEvents, event]);
                                    } else {
                                      setNewWebhookEvents(newWebhookEvents.filter(e => e !== event));
                                    }
                                  }}
                                />
                                <Label htmlFor={event} className="text-xs font-mono">{event}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateWebhookOpen(false)}>Cancel</Button>
                  <Button onClick={createWebhook} disabled={!newWebhookName || !newWebhookUrl || newWebhookEvents.length === 0}>
                    Create Webhook
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{webhook.name}</h3>
                        <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                          {webhook.status}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={webhook.success_rate >= 99 ? 'border-green-500 text-green-500' : 
                                     webhook.success_rate >= 95 ? 'border-yellow-500 text-yellow-500' : 
                                     'border-red-500 text-red-500'}
                        >
                          {webhook.success_rate}% success
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <code className="bg-muted/50 px-2 py-1 rounded text-xs">{webhook.url}</code>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs font-mono">
                            {event}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Created: {webhook.created_at}</span>
                        <span>Last triggered: {webhook.last_triggered}</span>
                        <span>Deliveries: {webhook.total_deliveries} ({webhook.failed_deliveries} failed)</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testWebhook(webhook.id)}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Test
                      </Button>
                      <Button 
                        variant={webhook.status === 'active' ? 'secondary' : 'default'}
                        size="sm"
                        onClick={() => toggleWebhookStatus(webhook.id)}
                      >
                        {webhook.status === 'active' ? 'Pause' : 'Activate'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Execution Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Webhook Execution Logs</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Webhook</th>
                      <th className="text-left p-4 font-medium">Event</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Response</th>
                      <th className="text-left p-4 font-medium">Duration</th>
                      <th className="text-left p-4 font-medium">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockWebhookLogs.map((log) => (
                      <tr key={log.id} className="border-t">
                        <td className="p-4">{log.webhook_name}</td>
                        <td className="p-4">
                          <code className="text-xs bg-muted px-2 py-1 rounded">{log.event}</code>
                        </td>
                        <td className="p-4">
                          <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                            {log.status === 'success' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {log.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant="outline"
                            className={log.response_code < 400 ? 'text-green-500' : 'text-red-500'}
                          >
                            {log.response_code}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{log.response_time}ms</td>
                        <td className="p-4 text-muted-foreground">{log.timestamp}</td>
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

export default AdminAPIKeysWebhooks;
