import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Save, RotateCcw, Users, Shield, Receipt, UserCheck, Menu, Copy,
  LayoutDashboard, FolderKanban, FileText, HeadphonesIcon, Calendar,
  Brain, Settings, Star, BookOpen, Server, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { EmployeeRole } from "@/hooks/useEmployeeRole";
import { notifySidebarAccessUpdate } from "@/hooks/useWidgetAccessSync";

export const SIDEBAR_ACCESS_STORAGE_KEY = "tenant-sidebar-access-config";

interface RoleSidebarAccess {
  [moduleId: string]: boolean;
}

export interface SidebarAccessConfig {
  staff: RoleSidebarAccess;
  hr: RoleSidebarAccess;
  manager: RoleSidebarAccess;
  finance: RoleSidebarAccess;
  admin: RoleSidebarAccess;
}

const roles: { id: EmployeeRole; name: string; icon: React.ElementType; color: string }[] = [
  { id: "staff", name: "Staff", icon: Users, color: "bg-blue-500" },
  { id: "hr", name: "HR", icon: UserCheck, color: "bg-green-500" },
  { id: "manager", name: "Manager", icon: Shield, color: "bg-purple-500" },
  { id: "finance", name: "Finance", icon: Receipt, color: "bg-amber-500" },
  { id: "admin", name: "Admin", icon: Shield, color: "bg-red-500" },
];

export interface SidebarModuleMeta {
  id: string;
  name: string;
  icon: React.ElementType;
  section: string;
  description: string;
  defaultRoles: EmployeeRole[];
}

export const sidebarModuleCatalog: SidebarModuleMeta[] = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, section: "Overview", description: "Main dashboard with overview stats", defaultRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "projects", name: "Projects", icon: FolderKanban, section: "Work", description: "Project management and tracking", defaultRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "files", name: "Files", icon: FileText, section: "Work", description: "File storage and document management", defaultRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "invoices", name: "Invoices", icon: Receipt, section: "Billing", description: "Invoice history and payment tracking", defaultRoles: ["manager", "finance", "admin"] },
  { id: "tickets", name: "Tickets", icon: HeadphonesIcon, section: "Support", description: "Support ticket management", defaultRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "meetings", name: "Meetings", icon: Calendar, section: "Support", description: "Meeting scheduling and calendar", defaultRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "ai-dashboard", name: "AI Dashboard", icon: Brain, section: "AI & Monitoring", description: "AI insights and automation tools", defaultRoles: ["manager", "admin"] },
  { id: "msp-monitoring", name: "MSP Monitoring", icon: Server, section: "AI & Monitoring", description: "Server and infrastructure monitoring", defaultRoles: ["admin"] },
  { id: "team", name: "Team", icon: Users, section: "More", description: "Team directory and management", defaultRoles: ["hr", "manager", "admin"] },
  { id: "feedback", name: "Feedback", icon: Star, section: "More", description: "Feedback submission and tracking", defaultRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "resources", name: "Resources", icon: BookOpen, section: "More", description: "Knowledge base and resources", defaultRoles: ["staff", "hr", "manager", "finance", "admin"] },
  { id: "settings", name: "Settings", icon: Settings, section: "Account", description: "Account and profile settings", defaultRoles: ["staff", "hr", "manager", "finance", "admin"] },
];

const sections = ["Overview", "Work", "Billing", "Support", "AI & Monitoring", "More", "Account"];

export const getDefaultSidebarConfig = (): SidebarAccessConfig => {
  const config: SidebarAccessConfig = { staff: {}, hr: {}, manager: {}, finance: {}, admin: {} };
  
  sidebarModuleCatalog.forEach(module => {
    roles.forEach(role => {
      config[role.id][module.id] = module.defaultRoles.includes(role.id);
    });
  });
  
  return config;
};

const TenantSidebarAccess: React.FC = () => {
  const [config, setConfig] = useState<SidebarAccessConfig>(getDefaultSidebarConfig);
  const [activeRole, setActiveRole] = useState<EmployeeRole>("staff");
  const [hasChanges, setHasChanges] = useState(false);
  const [copyFromRole, setCopyFromRole] = useState<EmployeeRole | "">("");

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_ACCESS_STORAGE_KEY);
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load sidebar access config:", e);
      }
    }
  }, []);

  const handleToggle = (moduleId: string, enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      [activeRole]: {
        ...prev[activeRole],
        [moduleId]: enabled,
      },
    }));
    setHasChanges(true);
  };

  const handleCopyFromRole = () => {
    if (!copyFromRole) return;
    setConfig(prev => ({
      ...prev,
      [activeRole]: { ...prev[copyFromRole] },
    }));
    setHasChanges(true);
    toast.success(`Copied settings from ${roles.find(r => r.id === copyFromRole)?.name} to ${roles.find(r => r.id === activeRole)?.name}`);
    setCopyFromRole("");
  };

  const handleSave = () => {
    localStorage.setItem(SIDEBAR_ACCESS_STORAGE_KEY, JSON.stringify(config));
    setHasChanges(false);
    notifySidebarAccessUpdate();
    toast.success("Sidebar access configuration saved! Employees will see changes immediately.");
  };

  const handleReset = () => {
    const defaultConfig = getDefaultSidebarConfig();
    setConfig(defaultConfig);
    localStorage.removeItem(SIDEBAR_ACCESS_STORAGE_KEY);
    setHasChanges(false);
    notifySidebarAccessUpdate();
    toast.info("Sidebar access reset to defaults");
  };

  const getEnabledCount = (role: EmployeeRole) => {
    return Object.values(config[role]).filter(Boolean).length;
  };

  const currentRole = roles.find(r => r.id === activeRole);
  const RoleIcon = currentRole?.icon || Users;
  const otherRoles = roles.filter(r => r.id !== activeRole);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E3A]">Sidebar Module Access</h1>
          <p className="text-sm text-[#6B7280] mt-1">Configure which sidebar modules each employee role can see</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2 border-gray-200">
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges}
            className="bg-[#005EEB] hover:bg-[#004ACC] gap-2 shadow-lg shadow-[#005EEB]/20"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Role Tabs */}
      <Tabs value={activeRole} onValueChange={(v) => setActiveRole(v as EmployeeRole)} className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-xl flex-wrap h-auto">
          {roles.map(role => {
            const Icon = role.icon;
            return (
              <TabsTrigger 
                key={role.id} 
                value={role.id}
                className="rounded-lg data-[state=active]:bg-[#005EEB] data-[state=active]:text-white gap-2"
              >
                <Icon className="w-4 h-4" />
                {role.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {getEnabledCount(role.id)}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {roles.map(role => (
          <TabsContent key={role.id} value={role.id} className="space-y-6">
            {/* Role Summary Card with Bulk Copy */}
            <Card className="border-gray-100 shadow-sm bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${role.color} flex items-center justify-center shadow-lg`}>
                      <RoleIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#0F1E3A]">{role.name} Sidebar Modules</h3>
                      <p className="text-sm text-[#6B7280]">
                        {getEnabledCount(role.id)} of {sidebarModuleCatalog.length} modules visible
                      </p>
                    </div>
                  </div>
                  
                  {/* Bulk Copy Feature */}
                  <div className="flex items-center gap-2 bg-[#F7F9FC] p-3 rounded-xl border border-gray-100">
                    <Copy className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-sm text-[#6B7280]">Copy from:</span>
                    <Select value={copyFromRole} onValueChange={(v) => setCopyFromRole(v as EmployeeRole)}>
                      <SelectTrigger className="w-32 h-8 text-sm bg-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {otherRoles.map(r => (
                          <SelectItem key={r.id} value={r.id}>
                            <div className="flex items-center gap-2">
                              <r.icon className="w-3.5 h-3.5" />
                              {r.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleCopyFromRole}
                      disabled={!copyFromRole}
                      className="h-8 gap-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Module Sections */}
            {sections.map(section => {
              const sectionModules = sidebarModuleCatalog.filter(m => m.section === section);
              if (sectionModules.length === 0) return null;

              return (
                <Card key={section} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#005EEB]/10 flex items-center justify-center">
                        <Menu className="w-5 h-5 text-[#005EEB]" />
                      </div>
                      {section}
                    </CardTitle>
                    <CardDescription className="ml-13">
                      Manage visibility for {section.toLowerCase()} modules
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sectionModules.map(module => {
                      const Icon = module.icon;
                      const isEnabled = config[role.id][module.id] ?? false;
                      
                      return (
                        <div 
                          key={module.id}
                          className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                            isEnabled 
                              ? "bg-[#005EEB]/5 border border-[#005EEB]/20" 
                              : "bg-[#F7F9FC] hover:bg-[#F0F3F7] border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isEnabled ? "bg-[#005EEB]/10" : "bg-gray-100"
                            }`}>
                              <Icon className={`w-5 h-5 ${isEnabled ? "text-[#005EEB]" : "text-gray-400"}`} />
                            </div>
                            <div>
                              <p className={`font-medium ${isEnabled ? "text-[#0F1E3A]" : "text-[#6B7280]"}`}>
                                {module.name}
                              </p>
                              <p className="text-sm text-[#9CA3AF]">{module.description}</p>
                            </div>
                          </div>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => handleToggle(module.id, checked)}
                          />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TenantSidebarAccess;
