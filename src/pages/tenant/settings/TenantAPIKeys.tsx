import React, { useState } from "react";
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  AlertTriangle,
  Shield,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SettingsSubNav } from "@/components/tenant/SettingsSubNav";

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  expiresAt: string | null;
  status: "active" | "expired" | "revoked";
  permissions: string[];
  requests: number;
}

const apiKeys: APIKey[] = [
  { id: "1", name: "Production API Key", key: "atls_prod_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx1234", createdAt: "2024-01-15", lastUsed: "2 mins ago", expiresAt: null, status: "active", permissions: ["read", "write", "delete"], requests: 15420 },
  { id: "2", name: "Development Key", key: "atls_dev_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxabcd", createdAt: "2024-01-10", lastUsed: "1 hour ago", expiresAt: "2025-01-10", status: "active", permissions: ["read", "write"], requests: 8530 },
  { id: "3", name: "Webhook Secret", key: "atls_whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxefgh", createdAt: "2024-01-05", lastUsed: "5 days ago", expiresAt: "2024-06-05", status: "active", permissions: ["webhook"], requests: 1250 }
];

const webhooks = [
  { id: "1", url: "https://api.yourcompany.com/webhooks/atlas", events: ["employee.created", "payroll.processed"], status: "active", lastTriggered: "1 hour ago" },
  { id: "2", url: "https://slack.com/webhooks/atlas-notifications", events: ["attendance.marked", "leave.approved"], status: "active", lastTriggered: "30 mins ago" }
];

const TenantAPIKeys: React.FC = () => {
  const [keys, setKeys] = useState(apiKeys);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyExpiry, setNewKeyExpiry] = useState("never");

  const toggleKeyVisibility = (id: string) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API key copied to clipboard");
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `atls_new_sk_${Math.random().toString(36).substring(2, 34)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      expiresAt: newKeyExpiry === "never" ? null : new Date(Date.now() + parseInt(newKeyExpiry) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "active",
      permissions: ["read", "write"],
      requests: 0
    };
    setKeys(prev => [newKey, ...prev]);
    setIsCreateDialogOpen(false);
    setNewKeyName("");
    toast.success("API key created successfully");
  };

  const handleRevokeKey = (id: string) => {
    setKeys(prev => prev.map(key => key.id === id ? { ...key, status: "revoked" as const } : key));
    toast.success("API key revoked");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20">Active</Badge>;
      case "expired": return <Badge className="bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20">Expired</Badge>;
      case "revoked": return <Badge className="bg-[#E23E57]/10 text-[#E23E57] border-[#E23E57]/20">Revoked</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E3A]">API Keys</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage API keys and webhook endpoints for programmatic access</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#005EEB] hover:bg-[#0047B3] gap-2 shadow-lg shadow-[#005EEB]/20">
              <Plus className="w-4 h-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>Generate a new API key for accessing ATLAS programmatically.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Key Name</Label>
                <Input placeholder="e.g., Production API Key" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} className="border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label>Expiration</Label>
                <Select value={newKeyExpiry} onValueChange={setNewKeyExpiry}>
                  <SelectTrigger className="border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never expires</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">6 months</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-[#FFB020]/10 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#FFB020] mt-0.5" />
                <p className="text-xs text-[#6B7280]">Your API key will only be shown once. Make sure to copy it and store it securely.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateKey} className="bg-[#005EEB] hover:bg-[#0047B3]">Create Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Settings Sub Navigation */}
      <SettingsSubNav />

      {/* Security Notice */}
      <div className="bg-[#005EEB]/5 border border-[#005EEB]/20 rounded-xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#005EEB]/10 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-[#005EEB]" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#0F1E3A]">Keep your API keys secure</h4>
          <p className="text-sm text-[#6B7280] mt-1">Never share your API keys in public repositories or client-side code. Use environment variables and rotate keys regularly.</p>
        </div>
      </div>

      {/* API Keys List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-[#0F1E3A]">API Keys</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {keys.map((apiKey, index) => (
            <div key={apiKey.id} className="p-5 hover:bg-[#F7F9FC]/50 transition-colors" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F9FC] flex items-center justify-center">
                    <Key className="w-5 h-5 text-[#6B7280]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-[#0F1E3A]">{apiKey.name}</h4>
                      {getStatusBadge(apiKey.status)}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs bg-[#F7F9FC] px-2 py-1 rounded font-mono text-[#6B7280]">
                        {showKey[apiKey.id] ? apiKey.key : apiKey.key.substring(0, 20) + "••••••••••••••••"}
                      </code>
                      <button onClick={() => toggleKeyVisibility(apiKey.id)} className="p-1 text-[#6B7280] hover:text-[#005EEB] transition-colors">
                        {showKey[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => copyToClipboard(apiKey.key)} className="p-1 text-[#6B7280] hover:text-[#005EEB] transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                      <span>Created: {apiKey.createdAt}</span>
                      <span>Last used: {apiKey.lastUsed}</span>
                      <span>{apiKey.requests.toLocaleString()} requests</span>
                      {apiKey.expiresAt && <span>Expires: {apiKey.expiresAt}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {apiKey.status === "active" && (
                    <Button variant="ghost" size="sm" onClick={() => handleRevokeKey(apiKey.id)} className="text-[#E23E57] hover:text-[#E23E57] hover:bg-[#E23E57]/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#0F1E3A]">Webhook Endpoints</h3>
          <Button variant="outline" size="sm" className="gap-2 border-gray-200 hover:border-[#005EEB] hover:text-[#005EEB]">
            <Plus className="w-4 h-4" />
            Add Endpoint
          </Button>
        </div>
        <div className="divide-y divide-gray-100">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="p-5 hover:bg-[#F7F9FC]/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm font-mono text-[#005EEB]">{webhook.url}</code>
                    <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] text-xs">{webhook.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline" className="text-xs border-gray-200">{event}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-[#9CA3AF] mt-2">Last triggered: {webhook.lastTriggered}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#6B7280] hover:text-[#005EEB]">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#E23E57] hover:text-[#E23E57] hover:bg-[#E23E57]/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-gradient-to-r from-[#005EEB] to-[#00C2FF] rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">API Documentation</h3>
            <p className="text-white/80 text-sm">Learn how to integrate ATLAS with your applications</p>
          </div>
          <Button className="bg-white text-[#005EEB] hover:bg-white/90 gap-2">
            View Documentation
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TenantAPIKeys;
