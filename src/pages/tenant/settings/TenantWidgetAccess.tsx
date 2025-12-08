import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutGrid, Save, RotateCcw, Users, Shield, Eye, Clock, CalendarDays,
  Receipt, CheckSquare, CreditCard, Megaphone, UserCheck, ClipboardCheck, 
  Headphones, FileText, BarChart3, FolderKanban, Zap, Calendar
} from "lucide-react";
import { toast } from "sonner";
import { EmployeeRole } from "@/hooks/useEmployeeRole";
import { portalWidgetCatalog, PortalWidgetMeta } from "@/hooks/usePortalDashboardLayout";

const WIDGET_ACCESS_STORAGE_KEY = "tenant-widget-access-config";

interface RoleWidgetAccess {
  [widgetId: string]: boolean;
}

interface WidgetAccessConfig {
  staff: RoleWidgetAccess;
  hr: RoleWidgetAccess;
  manager: RoleWidgetAccess;
  finance: RoleWidgetAccess;
  admin: RoleWidgetAccess;
}

const roles: { id: EmployeeRole; name: string; icon: React.ElementType; color: string }[] = [
  { id: "staff", name: "Staff", icon: Users, color: "bg-blue-500" },
  { id: "hr", name: "HR", icon: UserCheck, color: "bg-green-500" },
  { id: "manager", name: "Manager", icon: Shield, color: "bg-purple-500" },
  { id: "finance", name: "Finance", icon: Receipt, color: "bg-amber-500" },
  { id: "admin", name: "Admin", icon: Shield, color: "bg-red-500" },
];

const widgetIcons: Record<string, React.ElementType> = {
  "quick-stats": BarChart3,
  "projects": FolderKanban,
  "quick-actions": Zap,
  "meetings": Calendar,
  "attendance": Clock,
  "leave-balance": CalendarDays,
  "payslip": Receipt,
  "tasks": CheckSquare,
  "expense-claims": CreditCard,
  "announcements": Megaphone,
  "team-overview": Users,
  "approvals": ClipboardCheck,
  "team-attendance": Users,
  "invoices": FileText,
  "tickets": Headphones,
};

const getDefaultConfig = (): WidgetAccessConfig => {
  const config: WidgetAccessConfig = { staff: {}, hr: {}, manager: {}, finance: {}, admin: {} };
  
  portalWidgetCatalog.forEach(widget => {
    roles.forEach(role => {
      config[role.id][widget.id] = widget.allowedRoles.includes(role.id);
    });
  });
  
  return config;
};

const TenantWidgetAccess: React.FC = () => {
  const [config, setConfig] = useState<WidgetAccessConfig>(getDefaultConfig);
  const [activeRole, setActiveRole] = useState<EmployeeRole>("staff");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(WIDGET_ACCESS_STORAGE_KEY);
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load widget access config:", e);
      }
    }
  }, []);

  const handleToggle = (widgetId: string, enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      [activeRole]: {
        ...prev[activeRole],
        [widgetId]: enabled,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem(WIDGET_ACCESS_STORAGE_KEY, JSON.stringify(config));
    setHasChanges(false);
    toast.success("Widget access configuration saved successfully!");
  };

  const handleReset = () => {
    const defaultConfig = getDefaultConfig();
    setConfig(defaultConfig);
    localStorage.removeItem(WIDGET_ACCESS_STORAGE_KEY);
    setHasChanges(false);
    toast.info("Widget access reset to defaults");
  };

  const getEnabledCount = (role: EmployeeRole) => {
    return Object.values(config[role]).filter(Boolean).length;
  };

  const currentRole = roles.find(r => r.id === activeRole);
  const RoleIcon = currentRole?.icon || Users;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E3A]">Widget Access Control</h1>
          <p className="text-sm text-[#6B7280] mt-1">Configure which dashboard widgets each employee role can access</p>
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
            {/* Role Summary Card */}
            <Card className="border-gray-100 shadow-sm bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${role.color} flex items-center justify-center shadow-lg`}>
                    <RoleIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F1E3A]">{role.name} Dashboard Widgets</h3>
                    <p className="text-sm text-[#6B7280]">
                      {getEnabledCount(role.id)} of {portalWidgetCatalog.length} widgets enabled
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Widget Categories */}
            {["overview", "hr", "finance", "operations", "personal"].map(category => {
              const categoryWidgets = portalWidgetCatalog.filter(w => w.category === category);
              if (categoryWidgets.length === 0) return null;

              return (
                <Card key={category} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-3 capitalize">
                      <div className="w-10 h-10 rounded-xl bg-[#005EEB]/10 flex items-center justify-center">
                        <LayoutGrid className="w-5 h-5 text-[#005EEB]" />
                      </div>
                      {category} Widgets
                    </CardTitle>
                    <CardDescription className="ml-13">
                      Manage access to {category} dashboard widgets
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {categoryWidgets.map(widget => {
                      const Icon = widgetIcons[widget.id] || Eye;
                      const isEnabled = config[role.id][widget.id] ?? false;
                      
                      return (
                        <div 
                          key={widget.id}
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
                                {widget.name}
                              </p>
                              <p className="text-sm text-[#9CA3AF]">{widget.description}</p>
                            </div>
                          </div>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => handleToggle(widget.id, checked)}
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

export default TenantWidgetAccess;
