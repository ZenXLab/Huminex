import React from "react";
import { Building2, Users, Globe, CreditCard, Key, Database, Shield, Bell, Palette, Link2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TenantSettings: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Organization Settings</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage your organization profile and preferences</p>
        </div>
        <Button className="bg-[#005EEB] hover:bg-[#004ACC] gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Organization Details */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#005EEB]" />
                Organization Details
              </CardTitle>
              <CardDescription>Basic information about your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" defaultValue="ACME Pharma Pvt Ltd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalName">Legal Entity Name</Label>
                  <Input id="legalName" defaultValue="ACME Pharmaceutical Private Limited" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select defaultValue="pharma">
                    <SelectTrigger>
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
                  <Label htmlFor="size">Company Size</Label>
                  <Select defaultValue="100-500">
                    <SelectTrigger>
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
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-[#005EEB]" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Primary Email</Label>
                  <Input id="email" type="email" defaultValue="admin@acmepharma.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Business Park, Sector 5, Mumbai, Maharashtra 400001" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#005EEB]" />
                Regional Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="ist">
                    <SelectTrigger>
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
                  <Label>Currency</Label>
                  <Select defaultValue="inr">
                    <SelectTrigger>
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
                  <Label>Date Format</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger>
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
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#005EEB]" />
                Brand Customization
              </CardTitle>
              <CardDescription>Customize the look and feel of your portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-[#F7F9FC] border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-[#9CA3AF]" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-[#0F1E3A]">Company Logo</p>
                  <p className="text-sm text-[#6B7280]">Recommended size: 200x200px, PNG or SVG</p>
                  <Button variant="outline" size="sm">Upload Logo</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Primary Brand Color</Label>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#005EEB]" />
                  <Input defaultValue="#005EEB" className="w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#005EEB]" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-lg">
                <div>
                  <p className="font-medium text-[#0F1E3A]">Two-Factor Authentication</p>
                  <p className="text-sm text-[#6B7280]">Require 2FA for all admin users</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-lg">
                <div>
                  <p className="font-medium text-[#0F1E3A]">Session Timeout</p>
                  <p className="text-sm text-[#6B7280]">Automatically logout after 30 minutes of inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-lg">
                <div>
                  <p className="font-medium text-[#0F1E3A]">IP Whitelisting</p>
                  <p className="text-sm text-[#6B7280]">Restrict access to specific IP addresses</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#005EEB]" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-lg">
                <div>
                  <p className="font-medium text-[#0F1E3A]">Email Notifications</p>
                  <p className="text-sm text-[#6B7280]">Receive important updates via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-lg">
                <div>
                  <p className="font-medium text-[#0F1E3A]">Compliance Alerts</p>
                  <p className="text-sm text-[#6B7280]">Get notified about upcoming deadlines</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-lg">
                <div>
                  <p className="font-medium text-[#0F1E3A]">Payroll Reminders</p>
                  <p className="text-sm text-[#6B7280]">Receive payroll processing reminders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-lg">
                <div>
                  <p className="font-medium text-[#0F1E3A]">Weekly Digest</p>
                  <p className="text-sm text-[#6B7280]">Get a summary of activities every week</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantSettings;
