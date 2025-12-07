import React from "react";
import { Building2, Users, Globe, Shield, Bell, Palette, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsSubNav } from "@/components/tenant/SettingsSubNav";
import { toast } from "sonner";

const TenantSettings: React.FC = () => {
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E3A]">Organization Settings</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage your organization profile and preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-[#005EEB] hover:bg-[#004ACC] gap-2 shadow-lg shadow-[#005EEB]/20">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      {/* Settings Sub Navigation */}
      <SettingsSubNav />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-[#005EEB] data-[state=active]:text-white">
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="rounded-lg data-[state=active]:bg-[#005EEB] data-[state=active]:text-white">
            Branding
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-[#005EEB] data-[state=active]:text-white">
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-[#005EEB] data-[state=active]:text-white">
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Organization Details */}
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#005EEB]/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#005EEB]" />
                </div>
                Organization Details
              </CardTitle>
              <CardDescription className="ml-13">Basic information about your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName" className="text-[#0F1E3A] font-medium">Organization Name</Label>
                  <Input id="orgName" defaultValue="ACME Pharma Pvt Ltd" className="border-gray-200 focus:border-[#005EEB] focus:ring-[#005EEB]/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalName" className="text-[#0F1E3A] font-medium">Legal Entity Name</Label>
                  <Input id="legalName" defaultValue="ACME Pharmaceutical Private Limited" className="border-gray-200 focus:border-[#005EEB] focus:ring-[#005EEB]/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-[#0F1E3A] font-medium">Industry</Label>
                  <Select defaultValue="pharma">
                    <SelectTrigger className="border-gray-200 focus:border-[#005EEB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pharma">Pharmaceutical</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-[#0F1E3A] font-medium">Company Size</Label>
                  <Select defaultValue="100-500">
                    <SelectTrigger className="border-gray-200 focus:border-[#005EEB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1-50 employees</SelectItem>
                      <SelectItem value="50-100">50-100 employees</SelectItem>
                      <SelectItem value="100-500">100-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0FB07A]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#0FB07A]" />
                </div>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#0F1E3A] font-medium">Primary Email</Label>
                  <Input id="email" type="email" defaultValue="admin@acmepharma.com" className="border-gray-200 focus:border-[#005EEB] focus:ring-[#005EEB]/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#0F1E3A] font-medium">Phone Number</Label>
                  <Input id="phone" defaultValue="+91 98765 43210" className="border-gray-200 focus:border-[#005EEB] focus:ring-[#005EEB]/20" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-[#0F1E3A] font-medium">Address</Label>
                  <Input id="address" defaultValue="123 Business Park, Sector 5, Mumbai, Maharashtra 400001" className="border-gray-200 focus:border-[#005EEB] focus:ring-[#005EEB]/20" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00C2FF]/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#00C2FF]" />
                </div>
                Regional Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#0F1E3A] font-medium">Timezone</Label>
                  <Select defaultValue="ist">
                    <SelectTrigger className="border-gray-200 focus:border-[#005EEB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="pst">America/Los_Angeles (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0F1E3A] font-medium">Currency</Label>
                  <Select defaultValue="inr">
                    <SelectTrigger className="border-gray-200 focus:border-[#005EEB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">INR (₹)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0F1E3A] font-medium">Date Format</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger className="border-gray-200 focus:border-[#005EEB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                Brand Customization
              </CardTitle>
              <CardDescription className="ml-13">Customize the look and feel of your portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-[#F7F9FC] border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#005EEB] hover:bg-[#005EEB]/5 transition-all cursor-pointer group">
                  <Building2 className="w-8 h-8 text-[#9CA3AF] group-hover:text-[#005EEB] transition-colors" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-[#0F1E3A]">Company Logo</p>
                  <p className="text-sm text-[#6B7280]">Recommended size: 200x200px, PNG or SVG</p>
                  <Button variant="outline" size="sm" className="border-gray-200 hover:border-[#005EEB] hover:text-[#005EEB]">
                    Upload Logo
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-[#0F1E3A] font-medium">Primary Brand Color</Label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#005EEB] shadow-lg shadow-[#005EEB]/30" />
                  <Input defaultValue="#005EEB" className="w-32 font-mono border-gray-200 focus:border-[#005EEB]" />
                  <Button variant="outline" size="sm" className="border-gray-200">
                    Pick Color
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E23E57]/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#E23E57]" />
                </div>
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Two-Factor Authentication", description: "Require 2FA for all admin users", defaultChecked: true },
                { title: "Session Timeout", description: "Automatically logout after 30 minutes of inactivity", defaultChecked: true },
                { title: "IP Whitelisting", description: "Restrict access to specific IP addresses", defaultChecked: false },
              ].map((setting) => (
                <div key={setting.title} className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-xl hover:bg-[#F0F3F7] transition-colors">
                  <div>
                    <p className="font-medium text-[#0F1E3A]">{setting.title}</p>
                    <p className="text-sm text-[#6B7280]">{setting.description}</p>
                  </div>
                  <Switch defaultChecked={setting.defaultChecked} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFB020]/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#FFB020]" />
                </div>
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Email Notifications", description: "Receive important updates via email", defaultChecked: true },
                { title: "Compliance Alerts", description: "Get notified about upcoming deadlines", defaultChecked: true },
                { title: "Payroll Reminders", description: "Receive payroll processing reminders", defaultChecked: true },
                { title: "Weekly Digest", description: "Get a summary of activities every week", defaultChecked: false },
              ].map((setting) => (
                <div key={setting.title} className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-xl hover:bg-[#F0F3F7] transition-colors">
                  <div>
                    <p className="font-medium text-[#0F1E3A]">{setting.title}</p>
                    <p className="text-sm text-[#6B7280]">{setting.description}</p>
                  </div>
                  <Switch defaultChecked={setting.defaultChecked} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantSettings;
