import React, { useState } from "react";
import { 
  Globe, 
  Plus, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  RefreshCw,
  Shield,
  ExternalLink,
  Copy,
  Trash2,
  Clock,
  Lock,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Domain {
  id: string;
  domain: string;
  status: "active" | "pending" | "failed" | "verifying";
  ssl: boolean;
  primary: boolean;
  addedAt: string;
  verifiedAt?: string;
}

const domains: Domain[] = [
  {
    id: "1",
    domain: "hr.acmecorp.com",
    status: "active",
    ssl: true,
    primary: true,
    addedAt: "2024-01-10",
    verifiedAt: "2024-01-10"
  },
  {
    id: "2",
    domain: "people.acmecorp.com",
    status: "verifying",
    ssl: false,
    primary: false,
    addedAt: "2024-01-18"
  }
];

const dnsRecords = [
  { type: "CNAME", name: "hr", value: "tenant-acme.atlas.app", ttl: "3600" },
  { type: "TXT", name: "_atlas-verify", value: "atlas-verify=abc123xyz789", ttl: "3600" }
];

const TenantCustomDomain: React.FC = () => {
  const [domainList, setDomainList] = useState(domains);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [forceSSL, setForceSSL] = useState(true);

  const handleAddDomain = () => {
    if (!newDomain.trim()) {
      toast.error("Please enter a domain");
      return;
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(newDomain)) {
      toast.error("Please enter a valid domain");
      return;
    }

    const domain: Domain = {
      id: Date.now().toString(),
      domain: newDomain,
      status: "pending",
      ssl: false,
      primary: false,
      addedAt: new Date().toISOString().split('T')[0]
    };

    setDomainList(prev => [...prev, domain]);
    setIsAddDialogOpen(false);
    setNewDomain("");
    toast.success("Domain added. Please configure DNS records.");
  };

  const handleVerify = (id: string) => {
    setDomainList(prev => prev.map(d => 
      d.id === id ? { ...d, status: "verifying" as const } : d
    ));
    toast.success("Verifying domain...");

    // Simulate verification
    setTimeout(() => {
      setDomainList(prev => prev.map(d => 
        d.id === id ? { ...d, status: "active" as const, ssl: true, verifiedAt: new Date().toISOString().split('T')[0] } : d
      ));
      toast.success("Domain verified successfully!");
    }, 3000);
  };

  const handleSetPrimary = (id: string) => {
    setDomainList(prev => prev.map(d => ({
      ...d,
      primary: d.id === id
    })));
    toast.success("Primary domain updated");
  };

  const handleRemove = (id: string) => {
    setDomainList(prev => prev.filter(d => d.id !== id));
    toast.success("Domain removed");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20">Active</Badge>;
      case "pending":
        return <Badge className="bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20">Pending DNS</Badge>;
      case "verifying":
        return <Badge className="bg-[#005EEB]/10 text-[#005EEB] border-[#005EEB]/20">Verifying</Badge>;
      case "failed":
        return <Badge className="bg-[#E23E57]/10 text-[#E23E57] border-[#E23E57]/20">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Custom Domain</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Connect your own domain to your ATLAS workspace
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#005EEB] hover:bg-[#0047B3] gap-2 shadow-lg shadow-[#005EEB]/20">
              <Plus className="w-4 h-4" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Custom Domain</DialogTitle>
              <DialogDescription>
                Enter the domain you want to connect to your ATLAS workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Domain Name</Label>
                <Input
                  placeholder="hr.yourcompany.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
                <p className="text-xs text-[#6B7280]">
                  Enter your subdomain (e.g., hr.company.com) or root domain (e.g., company.com)
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Force HTTPS</Label>
                  <p className="text-xs text-[#6B7280]">Redirect all HTTP traffic to HTTPS</p>
                </div>
                <Switch checked={forceSSL} onCheckedChange={setForceSSL} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDomain} className="bg-[#005EEB] hover:bg-[#0047B3]">
                Add Domain
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Workspace URL */}
      <div className="bg-[#005EEB]/5 border border-[#005EEB]/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#005EEB]" />
            <div>
              <p className="text-sm font-medium text-[#0F1E3A]">Default Workspace URL</p>
              <a 
                href="https://acmecorp.atlas.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-[#005EEB] hover:underline flex items-center gap-1"
              >
                acmecorp.atlas.app
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <Badge className="bg-[#0FB07A]/10 text-[#0FB07A]">
            <Lock className="w-3 h-3 mr-1" />
            SSL Active
          </Badge>
        </div>
      </div>

      {/* Connected Domains */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-[#0F1E3A]">Connected Domains</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {domainList.map((domain) => (
            <div key={domain.id} className="p-4 hover:bg-[#F7F9FC]/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    domain.status === "active" ? "bg-[#0FB07A]/10" : "bg-[#F7F9FC]"
                  }`}>
                    <Globe className={`w-5 h-5 ${
                      domain.status === "active" ? "text-[#0FB07A]" : "text-[#6B7280]"
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-[#0F1E3A]">{domain.domain}</span>
                      {domain.primary && (
                        <Badge className="bg-[#005EEB]/10 text-[#005EEB] text-xs">Primary</Badge>
                      )}
                      {getStatusBadge(domain.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                      <span>Added: {domain.addedAt}</span>
                      {domain.verifiedAt && <span>Verified: {domain.verifiedAt}</span>}
                      {domain.ssl && (
                        <span className="flex items-center gap-1 text-[#0FB07A]">
                          <Lock className="w-3 h-3" />
                          SSL Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {domain.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerify(domain.id)}
                      className="gap-1 border-gray-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Verify
                    </Button>
                  )}
                  {domain.status === "active" && !domain.primary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(domain.id)}
                      className="border-gray-200"
                    >
                      Set Primary
                    </Button>
                  )}
                  {!domain.primary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(domain.id)}
                      className="text-[#E23E57] hover:text-[#E23E57] hover:bg-[#E23E57]/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* DNS Records for pending domains */}
              {domain.status === "pending" && (
                <div className="mt-4 p-4 bg-[#F7F9FC] rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-[#FFB020]" />
                    <span className="text-sm font-medium text-[#0F1E3A]">DNS Configuration Required</span>
                  </div>
                  <p className="text-xs text-[#6B7280] mb-3">
                    Add the following DNS records to your domain provider:
                  </p>
                  <div className="space-y-2">
                    {dnsRecords.map((record, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                        <div className="grid grid-cols-4 gap-4 text-xs flex-1">
                          <div>
                            <span className="text-[#9CA3AF]">Type:</span>
                            <span className="ml-1 font-mono font-medium text-[#0F1E3A]">{record.type}</span>
                          </div>
                          <div>
                            <span className="text-[#9CA3AF]">Name:</span>
                            <span className="ml-1 font-mono font-medium text-[#0F1E3A]">{record.name}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[#9CA3AF]">Value:</span>
                            <span className="ml-1 font-mono font-medium text-[#0F1E3A] break-all">{record.value}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(record.value)}
                          className="ml-2"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SSL Certificate Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0FB07A]/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#0FB07A]" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#0F1E3A] mb-1">SSL Certificates</h3>
            <p className="text-sm text-[#6B7280] mb-4">
              ATLAS automatically provisions and renews SSL certificates for all your domains using Let's Encrypt.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-3 bg-[#F7F9FC] rounded-lg">
                <p className="text-xs text-[#6B7280]">Certificate Status</p>
                <p className="text-sm font-medium text-[#0FB07A]">Active</p>
              </div>
              <div className="p-3 bg-[#F7F9FC] rounded-lg">
                <p className="text-xs text-[#6B7280]">Expires</p>
                <p className="text-sm font-medium text-[#0F1E3A]">Apr 15, 2024</p>
              </div>
              <div className="p-3 bg-[#F7F9FC] rounded-lg">
                <p className="text-xs text-[#6B7280]">Auto-Renewal</p>
                <p className="text-sm font-medium text-[#0FB07A]">Enabled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-[#0F1E3A] to-[#1a2e50] rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Need help with DNS configuration?</h3>
              <p className="text-white/70 text-sm">Our support team can help you set up your custom domain</p>
            </div>
          </div>
          <Button className="bg-white text-[#0F1E3A] hover:bg-white/90 gap-2">
            Contact Support
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TenantCustomDomain;
