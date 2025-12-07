import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Layers, Plus, Search, Flag, Users, Beaker, 
  Globe, Lock, Clock, CheckCircle, XCircle,
  Settings, Trash2, Edit, Eye, Copy, AlertTriangle,
  BarChart3, Percent, Target
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Mock Feature Flags Data
const featureFlags = [
  {
    id: "ff-1",
    key: "new_dashboard_ui",
    name: "New Dashboard UI",
    description: "Enable the redesigned dashboard with enhanced widgets and layouts",
    status: "enabled",
    type: "release",
    rollout: 100,
    environments: ["production", "staging"],
    created_at: "2024-01-10",
    updated_at: "2024-01-20",
    targeting: { type: "all" }
  },
  {
    id: "ff-2",
    key: "ai_chat_support",
    name: "AI Chat Support",
    description: "Enable AI-powered chat support in the help center",
    status: "partial",
    type: "feature",
    rollout: 50,
    environments: ["staging"],
    created_at: "2024-01-15",
    updated_at: "2024-01-18",
    targeting: { type: "percentage", value: 50 }
  },
  {
    id: "ff-3",
    key: "advanced_analytics",
    name: "Advanced Analytics",
    description: "Access to predictive analytics and ML-powered insights",
    status: "enabled",
    type: "permission",
    rollout: 100,
    environments: ["production"],
    created_at: "2024-01-05",
    updated_at: "2024-01-19",
    targeting: { type: "plan", value: ["enterprise", "business"] }
  },
  {
    id: "ff-4",
    key: "beta_automation_builder",
    name: "Beta Automation Builder",
    description: "New drag-and-drop automation workflow builder",
    status: "disabled",
    type: "experiment",
    rollout: 0,
    environments: [],
    created_at: "2024-01-18",
    updated_at: "2024-01-18",
    targeting: { type: "none" }
  },
  {
    id: "ff-5",
    key: "dark_mode_v2",
    name: "Dark Mode V2",
    description: "Enhanced dark mode with better contrast and accessibility",
    status: "partial",
    type: "release",
    rollout: 25,
    environments: ["production", "staging"],
    created_at: "2024-01-12",
    updated_at: "2024-01-20",
    targeting: { type: "tenant", value: ["tenant-123", "tenant-456"] }
  },
  {
    id: "ff-6",
    key: "sso_google",
    name: "Google SSO",
    description: "Enable Google Workspace SSO for enterprise tenants",
    status: "enabled",
    type: "integration",
    rollout: 100,
    environments: ["production"],
    created_at: "2024-01-08",
    updated_at: "2024-01-15",
    targeting: { type: "plan", value: ["enterprise"] }
  }
];

const abTests = [
  {
    id: "ab-1",
    name: "Pricing Page Layout",
    status: "running",
    variants: [
      { name: "Control", traffic: 50, conversions: 245 },
      { name: "Variant A", traffic: 50, conversions: 312 }
    ],
    metric: "Conversions",
    started: "2024-01-15",
    visitors: 5420
  },
  {
    id: "ab-2",
    name: "CTA Button Color",
    status: "completed",
    variants: [
      { name: "Blue", traffic: 33, conversions: 189 },
      { name: "Green", traffic: 33, conversions: 234 },
      { name: "Orange", traffic: 34, conversions: 178 }
    ],
    metric: "Click Rate",
    started: "2024-01-10",
    visitors: 8920,
    winner: "Green"
  }
];

export const AdminFeatureFlags: React.FC = () => {
  const [flags, setFlags] = useState(featureFlags);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFlag, setNewFlag] = useState({ key: "", name: "", description: "", type: "release" });

  const toggleFlag = (flagId: string) => {
    setFlags(flags.map(flag => {
      if (flag.id === flagId) {
        const newStatus = flag.status === 'enabled' ? 'disabled' : 'enabled';
        toast.success(`${flag.name} ${newStatus}`);
        return { ...flag, status: newStatus, rollout: newStatus === 'enabled' ? 100 : 0 };
      }
      return flag;
    }));
  };

  const createFlag = () => {
    const flag = {
      id: `ff-${flags.length + 1}`,
      ...newFlag,
      status: "disabled",
      rollout: 0,
      environments: [],
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
      targeting: { type: "none" }
    };
    setFlags([...flags, flag]);
    setIsCreateOpen(false);
    setNewFlag({ key: "", name: "", description: "", type: "release" });
    toast.success("Feature flag created");
  };

  const deleteFlag = (flagId: string) => {
    setFlags(flags.filter(f => f.id !== flagId));
    toast.success("Feature flag deleted");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled': return 'text-green-500 bg-green-500/10';
      case 'partial': return 'text-yellow-500 bg-yellow-500/10';
      case 'disabled': return 'text-gray-500 bg-gray-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'release': return <Flag className="w-4 h-4" />;
      case 'feature': return <Layers className="w-4 h-4" />;
      case 'permission': return <Lock className="w-4 h-4" />;
      case 'experiment': return <Beaker className="w-4 h-4" />;
      case 'integration': return <Globe className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };

  const filteredFlags = flags.filter(flag => 
    flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flag.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enabledCount = flags.filter(f => f.status === 'enabled').length;
  const partialCount = flags.filter(f => f.status === 'partial').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Feature Flags</h1>
          <p className="text-muted-foreground">Toggle features and manage A/B experiments</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Flag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Feature Flag</DialogTitle>
              <DialogDescription>Define a new feature flag for controlled rollout</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Flag Key</Label>
                <Input 
                  placeholder="e.g., new_feature_v2" 
                  value={newFlag.key}
                  onChange={(e) => setNewFlag({ ...newFlag, key: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                />
              </div>
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input 
                  placeholder="e.g., New Feature V2" 
                  value={newFlag.name}
                  onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Describe what this feature flag controls..."
                  value={newFlag.description}
                  onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newFlag.type} onValueChange={(v) => setNewFlag({ ...newFlag, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="release">Release</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="permission">Permission</SelectItem>
                    <SelectItem value="experiment">Experiment</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={createFlag} disabled={!newFlag.key || !newFlag.name}>Create Flag</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Flag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{flags.length}</p>
                <p className="text-sm text-muted-foreground">Total Flags</p>
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
                <p className="text-2xl font-bold">{enabledCount}</p>
                <p className="text-sm text-muted-foreground">Enabled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Percent className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{partialCount}</p>
                <p className="text-sm text-muted-foreground">Partial Rollout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Beaker className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{abTests.filter(t => t.status === 'running').length}</p>
                <p className="text-sm text-muted-foreground">Active A/B Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="flags" className="space-y-6">
        <TabsList>
          <TabsTrigger value="flags">Feature Flags</TabsTrigger>
          <TabsTrigger value="ab-tests">A/B Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="flags" className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search flags..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Flags List */}
          <div className="space-y-4">
            {filteredFlags.map((flag) => (
              <Card key={flag.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          {getTypeIcon(flag.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{flag.name}</h3>
                            <Badge className={getStatusColor(flag.status)}>
                              {flag.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{flag.type}</Badge>
                          </div>
                          <code className="text-xs bg-muted px-2 py-0.5 rounded">{flag.key}</code>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{flag.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {flag.environments.map(env => (
                          <Badge key={env} variant="secondary">{env}</Badge>
                        ))}
                        {flag.targeting.type !== 'none' && flag.targeting.type !== 'all' && (
                          <Badge variant="outline">
                            <Target className="w-3 h-3 mr-1" />
                            {flag.targeting.type}: {Array.isArray(flag.targeting.value) ? flag.targeting.value.join(', ') : flag.targeting.value}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {flag.status === 'partial' && (
                        <div className="text-center">
                          <p className="text-lg font-bold">{flag.rollout}%</p>
                          <p className="text-xs text-muted-foreground">Rollout</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Switch 
                          checked={flag.status === 'enabled' || flag.status === 'partial'}
                          onCheckedChange={() => toggleFlag(flag.id)}
                        />
                        <Button variant="outline" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(flag.key);
                            toast.success("Key copied");
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => deleteFlag(flag.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ab-tests" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {abTests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <Badge variant={test.status === 'running' ? 'default' : 'secondary'}>
                      {test.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Started: {test.started} • {test.visitors.toLocaleString()} visitors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {test.variants.map((variant, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{variant.name}</span>
                            {test.winner === variant.name && (
                              <Badge className="bg-green-500/10 text-green-500">Winner</Badge>
                            )}
                          </div>
                          <span className="text-sm">
                            {variant.conversions} {test.metric.toLowerCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={variant.traffic} 
                            className="h-2 flex-1"
                          />
                          <span className="text-sm text-muted-foreground w-12">{variant.traffic}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Results
                    </Button>
                    {test.status === 'running' && (
                      <Button variant="outline" size="sm">
                        Stop Test
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFeatureFlags;
