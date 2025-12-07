import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCog, 
  Shield, 
  Users, 
  Key, 
  Plus,
  Edit,
  Trash2,
  Search,
  Lock,
  Unlock,
  CheckCircle,
  XCircle
} from "lucide-react";

// Mock roles data
const roles = [
  { 
    id: 1, 
    name: "Super Admin", 
    description: "Full platform access with all permissions", 
    userCount: 2, 
    permissions: ["all"],
    color: "bg-red-100 text-red-800",
    isSystem: true
  },
  { 
    id: 2, 
    name: "Admin", 
    description: "Administrative access with limited system settings", 
    userCount: 5, 
    permissions: ["users", "projects", "billing", "reports"],
    color: "bg-purple-100 text-purple-800",
    isSystem: true
  },
  { 
    id: 3, 
    name: "Project Manager", 
    description: "Manage projects and team assignments", 
    userCount: 8, 
    permissions: ["projects", "team", "files", "meetings"],
    color: "bg-blue-100 text-blue-800",
    isSystem: false
  },
  { 
    id: 4, 
    name: "Support Agent", 
    description: "Handle support tickets and client inquiries", 
    userCount: 12, 
    permissions: ["tickets", "inquiries", "files"],
    color: "bg-emerald-100 text-emerald-800",
    isSystem: false
  },
  { 
    id: 5, 
    name: "Finance", 
    description: "Access to billing, invoices, and financial reports", 
    userCount: 3, 
    permissions: ["invoices", "quotes", "billing", "reports"],
    color: "bg-amber-100 text-amber-800",
    isSystem: false
  },
  { 
    id: 6, 
    name: "Viewer", 
    description: "Read-only access to assigned resources", 
    userCount: 15, 
    permissions: ["view"],
    color: "bg-slate-100 text-slate-800",
    isSystem: true
  },
];

const permissions = [
  { category: "Users & Access", items: [
    { key: "users.view", label: "View Users", description: "View user list and profiles" },
    { key: "users.create", label: "Create Users", description: "Create new user accounts" },
    { key: "users.edit", label: "Edit Users", description: "Modify user information" },
    { key: "users.delete", label: "Delete Users", description: "Remove user accounts" },
    { key: "roles.manage", label: "Manage Roles", description: "Create and edit roles" },
  ]},
  { category: "Projects", items: [
    { key: "projects.view", label: "View Projects", description: "View all projects" },
    { key: "projects.create", label: "Create Projects", description: "Create new projects" },
    { key: "projects.edit", label: "Edit Projects", description: "Modify project details" },
    { key: "projects.delete", label: "Delete Projects", description: "Remove projects" },
  ]},
  { category: "Billing & Finance", items: [
    { key: "invoices.view", label: "View Invoices", description: "View invoice list" },
    { key: "invoices.create", label: "Create Invoices", description: "Generate new invoices" },
    { key: "quotes.manage", label: "Manage Quotes", description: "Create and edit quotes" },
    { key: "billing.settings", label: "Billing Settings", description: "Configure billing options" },
  ]},
  { category: "Support", items: [
    { key: "tickets.view", label: "View Tickets", description: "View support tickets" },
    { key: "tickets.respond", label: "Respond to Tickets", description: "Reply to tickets" },
    { key: "tickets.manage", label: "Manage Tickets", description: "Assign and close tickets" },
  ]},
  { category: "System", items: [
    { key: "settings.view", label: "View Settings", description: "View system settings" },
    { key: "settings.edit", label: "Edit Settings", description: "Modify system settings" },
    { key: "integrations.manage", label: "Manage Integrations", description: "Configure integrations" },
    { key: "audit.view", label: "View Audit Logs", description: "Access audit trail" },
  ]},
];

export const AdminRolesPermissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-muted-foreground">Configure platform roles and access permissions</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Roles</p>
                <p className="text-3xl font-bold text-foreground">{roles.length}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Roles</p>
                <p className="text-3xl font-bold text-foreground">{roles.filter(r => r.isSystem).length}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Lock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Custom Roles</p>
                <p className="text-3xl font-bold text-foreground">{roles.filter(r => !r.isSystem).length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <UserCog className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-foreground">{roles.reduce((a, b) => a + b.userCount, 0)}</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Role Management</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRoles.map((role) => (
                  <div 
                    key={role.id}
                    className="flex items-center justify-between p-4 bg-muted/30 border border-border/60 rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{role.name}</h3>
                          <Badge className={role.color}>{role.userCount} users</Badge>
                          {role.isSystem && (
                            <Badge variant="outline" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" /> System
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      {!role.isSystem && (
                        <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Configure permissions for each role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {permissions.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Key className="h-4 w-4 text-primary" />
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((permission) => (
                        <div 
                          key={permission.key}
                          className="flex items-center justify-between p-3 bg-muted/30 border border-border/60 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-foreground text-sm">{permission.label}</p>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {roles.slice(0, 4).map((role) => (
                              <div key={role.id} className="flex flex-col items-center gap-1">
                                <span className="text-[10px] text-muted-foreground">{role.name.split(' ')[0]}</span>
                                <Switch 
                                  defaultChecked={role.permissions.includes('all') || Math.random() > 0.3}
                                  disabled={role.isSystem && role.name === "Super Admin"}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
