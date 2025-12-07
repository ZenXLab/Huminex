import React, { useState } from "react";
import { 
  Plug, 
  Search, 
  RefreshCw,
  Zap,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  CreditCard,
  FileText,
  Cloud,
  Shield,
  Users,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { SettingsSubNav } from "@/components/tenant/SettingsSubNav";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  connected: boolean;
  status: "active" | "inactive" | "error";
  lastSync?: string;
}

const integrations: Integration[] = [
  { id: "google-workspace", name: "Google Workspace", description: "Sync employees, calendar, and documents with Google Workspace", category: "Productivity", icon: Calendar, connected: true, status: "active", lastSync: "5 mins ago" },
  { id: "microsoft-365", name: "Microsoft 365", description: "Connect with Outlook, Teams, and OneDrive", category: "Productivity", icon: Cloud, connected: false, status: "inactive" },
  { id: "slack", name: "Slack", description: "Send notifications and updates to Slack channels", category: "Communication", icon: MessageSquare, connected: true, status: "active", lastSync: "2 mins ago" },
  { id: "razorpay", name: "Razorpay", description: "Process payroll payments and reimbursements", category: "Payments", icon: CreditCard, connected: true, status: "active", lastSync: "1 hour ago" },
  { id: "zoho-books", name: "Zoho Books", description: "Sync invoices and financial data", category: "Accounting", icon: FileText, connected: false, status: "inactive" },
  { id: "tally", name: "Tally ERP", description: "Export payroll data to Tally for accounting", category: "Accounting", icon: Database, connected: false, status: "inactive" },
  { id: "freshteam", name: "Freshteam", description: "Import candidates and recruitment data", category: "HR", icon: Users, connected: false, status: "inactive" },
  { id: "sendgrid", name: "SendGrid", description: "Send transactional emails and notifications", category: "Communication", icon: Mail, connected: true, status: "error", lastSync: "Failed" },
  { id: "okta", name: "Okta SSO", description: "Single sign-on and identity management", category: "Security", icon: Shield, connected: false, status: "inactive" }
];

const categories = ["All", "Productivity", "Communication", "Payments", "Accounting", "HR", "Security"];

const TenantIntegrations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [integrationList, setIntegrationList] = useState(integrations);

  const filteredIntegrations = integrationList.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || integration.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrationList.filter(i => i.connected).length;

  const handleToggle = (id: string) => {
    setIntegrationList(prev => prev.map(integration => {
      if (integration.id === id) {
        const newConnected = !integration.connected;
        toast.success(newConnected ? `${integration.name} connected` : `${integration.name} disconnected`);
        return { ...integration, connected: newConnected, status: newConnected ? "active" : "inactive" };
      }
      return integration;
    }));
  };

  const handleSync = (id: string) => {
    const integration = integrationList.find(i => i.id === id);
    if (integration) toast.success(`Syncing ${integration.name}...`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20">Active</Badge>;
      case "error": return <Badge className="bg-[#E23E57]/10 text-[#E23E57] border-[#E23E57]/20">Error</Badge>;
      default: return <Badge className="bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E3A]">Integrations</h1>
          <p className="text-sm text-[#6B7280] mt-1">Connect third-party services to extend ATLAS capabilities</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#005EEB]/10 text-[#005EEB] border-[#005EEB]/20 px-3 py-1">
            {connectedCount} Connected
          </Badge>
          <Button variant="outline" className="gap-2 border-gray-200 hover:border-[#005EEB] hover:text-[#005EEB]">
            <RefreshCw className="w-4 h-4" />
            Sync All
          </Button>
        </div>
      </div>

      {/* Settings Sub Navigation */}
      <SettingsSubNav />

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-[#005EEB] rounded-lg"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-[#005EEB] text-white shadow-sm"
                    : "text-[#6B7280] hover:bg-[#F7F9FC] hover:text-[#0F1E3A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration, index) => (
          <div
            key={integration.id}
            className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-all duration-300 ${
              integration.connected ? "border-[#005EEB]/20" : "border-gray-100"
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                integration.connected ? "bg-[#005EEB]/10" : "bg-[#F7F9FC]"
              }`}>
                <integration.icon className={`w-6 h-6 transition-colors ${
                  integration.connected ? "text-[#005EEB]" : "text-[#6B7280]"
                }`} />
              </div>
              <Switch
                checked={integration.connected}
                onCheckedChange={() => handleToggle(integration.id)}
              />
            </div>

            <h3 className="text-base font-semibold text-[#0F1E3A] mb-1">{integration.name}</h3>
            <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">{integration.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusBadge(integration.status)}
                {integration.lastSync && integration.connected && (
                  <span className="text-xs text-[#9CA3AF]">{integration.lastSync}</span>
                )}
              </div>
              {integration.connected && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSync(integration.id)}
                    className="h-8 w-8 p-0 text-[#6B7280] hover:text-[#005EEB] hover:bg-[#005EEB]/5"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-[#6B7280] hover:text-[#005EEB] hover:bg-[#005EEB]/5"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Request Integration */}
      <div className="bg-gradient-to-r from-[#0F1E3A] to-[#1a2e50] rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Need a custom integration?</h3>
              <p className="text-white/70 text-sm">Request new integrations or use our API</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
              View API Docs
            </Button>
            <Button className="bg-white text-[#0F1E3A] hover:bg-white/90">
              Request Integration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantIntegrations;
