import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Puzzle, 
  Search, 
  Filter,
  Users,
  Building2,
  Crown,
  Sparkles,
  Shield,
  Brain,
  Server,
  Receipt,
  Calendar,
  FileText,
  Headphones,
  BarChart3,
  Lock,
  Unlock,
  Settings,
  Save,
  RefreshCw,
  ChevronRight,
  Check,
  X,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Plugin/Feature definitions
const plugins = [
  {
    id: "ai-dashboard",
    name: "AI Intelligence Dashboard",
    description: "Proxima AI analytics, predictions, and insights",
    icon: Brain,
    category: "intelligence",
    tiers: ["professional", "enterprise"],
    defaultEnabled: false,
  },
  {
    id: "msp-monitoring",
    name: "MSP Monitoring",
    description: "Server monitoring, alerts, and uptime tracking",
    icon: Server,
    category: "operations",
    tiers: ["professional", "enterprise"],
    defaultEnabled: false,
  },
  {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    description: "Custom reports, dashboards, and data exports",
    icon: BarChart3,
    category: "analytics",
    tiers: ["starter", "professional", "enterprise"],
    defaultEnabled: true,
  },
  {
    id: "compliance-manager",
    name: "Compliance Manager",
    description: "Regulatory compliance tracking and audits",
    icon: Shield,
    category: "compliance",
    tiers: ["professional", "enterprise"],
    defaultEnabled: false,
  },
  {
    id: "invoicing",
    name: "Invoicing & Billing",
    description: "Generate invoices, track payments, billing automation",
    icon: Receipt,
    category: "billing",
    tiers: ["starter", "professional", "enterprise"],
    defaultEnabled: true,
  },
  {
    id: "meeting-scheduler",
    name: "Meeting Scheduler",
    description: "Book meetings, calendar sync, video conferencing",
    icon: Calendar,
    category: "communication",
    tiers: ["starter", "professional", "enterprise"],
    defaultEnabled: true,
  },
  {
    id: "file-vault",
    name: "File Vault Pro",
    description: "Encrypted file storage with versioning and sharing",
    icon: FileText,
    category: "storage",
    tiers: ["professional", "enterprise"],
    defaultEnabled: false,
  },
  {
    id: "priority-support",
    name: "Priority Support",
    description: "24/7 priority support with dedicated account manager",
    icon: Headphones,
    category: "support",
    tiers: ["enterprise"],
    defaultEnabled: false,
  },
  {
    id: "custom-branding",
    name: "Custom Branding",
    description: "White-label portal with custom domain and branding",
    icon: Sparkles,
    category: "customization",
    tiers: ["enterprise"],
    defaultEnabled: false,
  },
  {
    id: "sso-integration",
    name: "SSO Integration",
    description: "Single Sign-On with Google, Microsoft, Okta, SAML",
    icon: Lock,
    category: "security",
    tiers: ["enterprise"],
    defaultEnabled: false,
  },
];

// Tier definitions
const tiers = [
  { id: "starter", name: "Starter", color: "bg-slate-500", icon: Users },
  { id: "professional", name: "Professional", color: "bg-primary", icon: Building2 },
  { id: "enterprise", name: "Enterprise", color: "bg-amber-500", icon: Crown },
];

// Mock users for demo
const mockUsers = [
  { id: "1", name: "Acme Corp", email: "admin@acme.com", tier: "enterprise", enabledPlugins: ["ai-dashboard", "msp-monitoring", "advanced-analytics", "compliance-manager", "invoicing", "meeting-scheduler", "file-vault", "priority-support", "custom-branding", "sso-integration"] },
  { id: "2", name: "TechStart Inc", email: "admin@techstart.io", tier: "professional", enabledPlugins: ["advanced-analytics", "invoicing", "meeting-scheduler", "ai-dashboard", "msp-monitoring"] },
  { id: "3", name: "Local Shop", email: "owner@localshop.com", tier: "starter", enabledPlugins: ["advanced-analytics", "invoicing", "meeting-scheduler"] },
  { id: "4", name: "FinanceFirst", email: "cfo@financefirst.com", tier: "professional", enabledPlugins: ["advanced-analytics", "invoicing", "meeting-scheduler", "compliance-manager"] },
  { id: "5", name: "HealthTech Solutions", email: "admin@healthtech.in", tier: "enterprise", enabledPlugins: ["ai-dashboard", "msp-monitoring", "advanced-analytics", "compliance-manager", "invoicing", "meeting-scheduler", "file-vault"] },
];

export const AdminPluginsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userPlugins, setUserPlugins] = useState<Record<string, string[]>>(
    mockUsers.reduce((acc, user) => ({ ...acc, [user.id]: user.enabledPlugins }), {})
  );
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === "all" || user.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const togglePluginForUser = (userId: string, pluginId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    const plugin = plugins.find(p => p.id === pluginId);
    
    if (!user || !plugin) return;
    
    // Check if user's tier allows this plugin
    if (!plugin.tiers.includes(user.tier)) {
      toast({
        title: "Tier Restriction",
        description: `This plugin requires ${plugin.tiers[0]} tier or higher.`,
        variant: "destructive",
      });
      return;
    }

    setUserPlugins(prev => {
      const currentPlugins = prev[userId] || [];
      const newPlugins = currentPlugins.includes(pluginId)
        ? currentPlugins.filter(p => p !== pluginId)
        : [...currentPlugins, pluginId];
      return { ...prev, [userId]: newPlugins };
    });
    setHasChanges(true);
  };

  const saveChanges = () => {
    // Here you would save to database
    toast({
      title: "Changes Saved",
      description: "Plugin configurations have been updated successfully.",
    });
    setHasChanges(false);
  };

  const resetChanges = () => {
    setUserPlugins(mockUsers.reduce((acc, user) => ({ ...acc, [user.id]: user.enabledPlugins }), {}));
    setHasChanges(false);
    toast({
      title: "Changes Reset",
      description: "Plugin configurations have been reset to saved state.",
    });
  };

  const getTierBadge = (tier: string) => {
    const tierData = tiers.find(t => t.id === tier);
    if (!tierData) return null;
    return (
      <Badge className={`${tierData.color} text-white`}>
        <tierData.icon className="w-3 h-3 mr-1" />
        {tierData.name}
      </Badge>
    );
  };

  const getPluginStatus = (userId: string, pluginId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    const plugin = plugins.find(p => p.id === pluginId);
    
    if (!user || !plugin) return "unavailable";
    if (!plugin.tiers.includes(user.tier)) return "locked";
    if (userPlugins[userId]?.includes(pluginId)) return "enabled";
    return "disabled";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <Puzzle className="w-6 h-6 text-primary" />
            Plugins & Add-ons Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Enable or disable features for specific tenants based on their subscription tier
          </p>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetChanges}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button size="sm" onClick={saveChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">By User/Tenant</TabsTrigger>
          <TabsTrigger value="plugins">By Plugin</TabsTrigger>
          <TabsTrigger value="tiers">Tier Defaults</TabsTrigger>
        </TabsList>

        {/* By User View */}
        <TabsContent value="users" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users or tenants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {tiers.map(tier => (
                  <SelectItem key={tier.id} value={tier.id}>{tier.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Users List */}
          <div className="grid gap-4">
            {filteredUsers.map(user => (
              <Card key={user.id} className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getTierBadge(user.tier)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Manage
                        <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${selectedUser === user.id ? "rotate-90" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {selectedUser === user.id && (
                  <CardContent className="pt-0">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-border/60">
                      {plugins.map(plugin => {
                        const status = getPluginStatus(user.id, plugin.id);
                        const Icon = plugin.icon;
                        
                        return (
                          <div
                            key={plugin.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              status === "locked" 
                                ? "bg-muted/30 border-border/40 opacity-60" 
                                : status === "enabled"
                                  ? "bg-primary/5 border-primary/30"
                                  : "bg-background border-border/60"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                status === "enabled" ? "bg-primary/10" : "bg-muted"
                              }`}>
                                <Icon className={`w-4 h-4 ${status === "enabled" ? "text-primary" : "text-muted-foreground"}`} />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{plugin.name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{plugin.description}</p>
                              </div>
                            </div>
                            
                            {status === "locked" ? (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Lock className="w-4 h-4" />
                              </div>
                            ) : (
                              <Switch
                                checked={status === "enabled"}
                                onCheckedChange={() => togglePluginForUser(user.id, plugin.id)}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* By Plugin View */}
        <TabsContent value="plugins" className="space-y-6">
          <div className="grid gap-4">
            {plugins.map(plugin => {
              const Icon = plugin.icon;
              const enabledCount = mockUsers.filter(u => userPlugins[u.id]?.includes(plugin.id)).length;
              const eligibleCount = mockUsers.filter(u => plugin.tiers.includes(u.tier)).length;
              
              return (
                <Card key={plugin.id} className="border-border/60">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{plugin.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{plugin.description}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs text-muted-foreground">Available in:</span>
                            {plugin.tiers.map(tier => {
                              const tierData = tiers.find(t => t.id === tier);
                              return tierData ? (
                                <Badge key={tier} variant="outline" className="text-xs">
                                  {tierData.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{enabledCount}/{eligibleCount}</div>
                        <p className="text-xs text-muted-foreground">users enabled</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tier Defaults View */}
        <TabsContent value="tiers" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {tiers.map(tier => {
              const tierPlugins = plugins.filter(p => p.tiers.includes(tier.id));
              const Icon = tier.icon;
              
              return (
                <Card key={tier.id} className="border-border/60">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${tier.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tier.name}</CardTitle>
                        <CardDescription>{tierPlugins.length} plugins available</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {plugins.map(plugin => {
                        const isIncluded = plugin.tiers.includes(tier.id);
                        const PluginIcon = plugin.icon;
                        
                        return (
                          <div
                            key={plugin.id}
                            className={`flex items-center gap-3 p-2 rounded-lg ${
                              isIncluded ? "bg-primary/5" : "opacity-40"
                            }`}
                          >
                            {isIncluded ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground" />
                            )}
                            <PluginIcon className="w-4 h-4 text-muted-foreground" />
                            <span className={`text-sm ${isIncluded ? "text-foreground" : "text-muted-foreground"}`}>
                              {plugin.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-600 dark:text-amber-400">Tier Defaults</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    These are the default plugins available for each tier. You can override these settings for individual users in the "By User" tab. 
                    Changes to tier defaults will apply to new users only.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};