import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
  Users, Shield, Key, FileText, Settings, Plus, Mail, 
  UserCheck, UserX, Crown, Eye, Pencil, Trash2, Clock,
  CheckCircle2, XCircle, AlertTriangle, Lock, Unlock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  useTraceflowTeam, 
  useInviteTeamMember, 
  useUpdateTeamMember,
  useTraceflowFeatures, 
  useToggleFeature,
  useTraceflowAuditLogs,
  TRACEFLOW_FEATURES,
  TraceflowTeamMember,
  TraceflowFeatureAccess,
} from "@/hooks/useTraceflowRBAC";
import { useTraceflowAuth } from "@/hooks/useTraceflowAuth";
import { format } from "date-fns";

const roleColors = {
  owner: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  admin: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  analyst: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  viewer: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const roleIcons = {
  owner: Crown,
  admin: Shield,
  analyst: Eye,
  viewer: Eye,
};

interface TraceflowAdminPanelProps {
  subscriptionId: string;
}

export const TraceflowAdminPanel = ({ subscriptionId }: TraceflowAdminPanelProps) => {
  const [activeTab, setActiveTab] = useState("team");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("analyst");
  
  const { user, isAdmin } = useTraceflowAuth();
  const { data: team, isLoading: teamLoading } = useTraceflowTeam(subscriptionId);
  const { data: features, isLoading: featuresLoading } = useTraceflowFeatures(subscriptionId);
  const { data: auditLogs, isLoading: auditLoading } = useTraceflowAuditLogs(subscriptionId);
  
  const inviteMember = useInviteTeamMember();
  const updateMember = useUpdateTeamMember();
  const toggleFeature = useToggleFeature();

  const handleInvite = async () => {
    if (!inviteEmail) return;
    await inviteMember.mutateAsync({
      subscriptionId,
      email: inviteEmail,
      role: inviteRole,
      fullName: inviteName,
    });
    setInviteDialogOpen(false);
    setInviteEmail("");
    setInviteName("");
    setInviteRole("analyst");
  };

  const handleToggleFeature = async (feature: TraceflowFeatureAccess) => {
    await toggleFeature.mutateAsync({
      id: feature.id,
      isEnabled: !feature.is_enabled,
      subscriptionId,
    });
  };

  const handleUpdateMemberRole = async (member: TraceflowTeamMember, newRole: string) => {
    await updateMember.mutateAsync({
      id: member.id,
      updates: { role: newRole as any },
    });
  };

  const handleSuspendMember = async (member: TraceflowTeamMember) => {
    await updateMember.mutateAsync({
      id: member.id,
      updates: { status: member.status === "suspended" ? "active" : "suspended" },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Admin & Settings</h2>
          <p className="text-slate-400">Manage team, features, and security settings</p>
        </div>
        {isAdmin && (
          <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Crown className="h-3 w-3 mr-1" />
            Admin Access
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="team" className="data-[state=active]:bg-[#0B3D91]">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-[#0B3D91]">
            <Settings className="h-4 w-4 mr-2" />
            Features (RBAC)
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-[#0B3D91]">
            <FileText className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#0B3D91]">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Team Management Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Team Members</CardTitle>
                <CardDescription>Manage who has access to TRACEFLOW</CardDescription>
              </div>
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#0B3D91] hover:bg-[#0B3D91]/80">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Invite Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        placeholder="colleague@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Full Name (Optional)</Label>
                      <Input
                        placeholder="John Doe"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger className="bg-slate-800 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="admin">Admin - Full access</SelectItem>
                          <SelectItem value="analyst">Analyst - View & analyze</SelectItem>
                          <SelectItem value="viewer">Viewer - Read only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleInvite} disabled={inviteMember.isPending}>
                      {inviteMember.isPending ? "Sending..." : "Send Invite"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {teamLoading ? (
                    <div className="text-center py-8 text-slate-400">Loading team...</div>
                  ) : team && team.length > 0 ? (
                    team.map((member) => {
                      const RoleIcon = roleIcons[member.role];
                      return (
                        <div
                          key={member.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-lg border",
                            member.status === "suspended" 
                              ? "bg-red-500/5 border-red-500/20" 
                              : "bg-slate-800/50 border-slate-700"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {member.full_name?.[0] || member.email[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">
                                  {member.full_name || member.email}
                                </span>
                                <Badge className={cn("text-xs", roleColors[member.role])}>
                                  <RoleIcon className="h-3 w-3 mr-1" />
                                  {member.role}
                                </Badge>
                                {member.status === "pending" && (
                                  <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                                {member.status === "suspended" && (
                                  <Badge variant="outline" className="text-red-400 border-red-500/30">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Suspended
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-slate-400">{member.email}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={member.role}
                              onValueChange={(value) => handleUpdateMemberRole(member, value)}
                              disabled={member.role === "owner"}
                            >
                              <SelectTrigger className="w-28 bg-slate-800 border-slate-600">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-600">
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="analyst">Analyst</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSuspendMember(member)}
                              disabled={member.role === "owner"}
                            >
                              {member.status === "suspended" ? (
                                <Unlock className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Lock className="h-4 w-4 text-red-400" />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No team members yet</p>
                      <p className="text-sm text-slate-500">Invite your first team member to get started</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features (RBAC) Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Feature Access Control
              </CardTitle>
              <CardDescription>
                Enable or disable features and control which roles can access them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {featuresLoading ? (
                    <div className="text-center py-8 text-slate-400">Loading features...</div>
                  ) : features && features.length > 0 ? (
                    features.map((feature) => (
                      <div
                        key={feature.id}
                        className={cn(
                          "p-4 rounded-lg border transition-all",
                          feature.is_enabled
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "bg-slate-800/50 border-slate-700"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="text-white font-medium">{feature.feature_name}</h4>
                              {feature.is_enabled ? (
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Enabled
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-slate-400 border-slate-600">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Disabled
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                              {feature.feature_description}
                            </p>
                            {feature.is_enabled && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-slate-500">Accessible by:</span>
                                {feature.enabled_for_roles.map((role) => (
                                  <Badge key={role} variant="outline" className="text-xs text-slate-300 border-slate-600">
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {feature.usage_limit && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-slate-500">
                                  Usage: {feature.current_usage} / {feature.usage_limit}
                                </span>
                              </div>
                            )}
                          </div>
                          <Switch
                            checked={feature.is_enabled}
                            onCheckedChange={() => handleToggleFeature(feature)}
                            disabled={toggleFeature.isPending}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">Features not initialized</p>
                      <p className="text-sm text-slate-500">Features will be set up based on your plan</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Audit Logs
              </CardTitle>
              <CardDescription>
                Track all actions taken within your TRACEFLOW workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {auditLoading ? (
                    <div className="text-center py-8 text-slate-400">Loading audit logs...</div>
                  ) : auditLogs && auditLogs.length > 0 ? (
                    auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          log.action.includes("enabled") || log.action.includes("created") 
                            ? "bg-emerald-500/20" 
                            : log.action.includes("disabled") || log.action.includes("deleted")
                            ? "bg-red-500/20"
                            : "bg-blue-500/20"
                        )}>
                          {log.action.includes("enabled") || log.action.includes("created") ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          ) : log.action.includes("disabled") || log.action.includes("deleted") ? (
                            <XCircle className="h-4 w-4 text-red-400" />
                          ) : (
                            <Pencil className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium capitalize">
                              {log.action.replace(/_/g, " ")}
                            </span>
                            <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                              {log.resource_type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span>{log.user_email || "System"}</span>
                            <span>•</span>
                            <span>{format(new Date(log.created_at), "MMM d, HH:mm")}</span>
                            {log.ip_address && (
                              <>
                                <span>•</span>
                                <span className="text-xs">{log.ip_address}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No audit logs yet</p>
                      <p className="text-sm text-slate-500">Actions will be logged as you use TRACEFLOW</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  SSO Configuration
                </CardTitle>
                <CardDescription>Configure Single Sign-On for your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                      <span className="text-lg">G</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Google Workspace</p>
                      <p className="text-xs text-slate-400">OAuth 2.0</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#00a4ef] flex items-center justify-center">
                      <span className="text-white text-lg font-bold">M</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Microsoft Entra ID</p>
                      <p className="text-xs text-slate-400">OIDC / SAML</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#1a1a1a] flex items-center justify-center">
                      <span className="text-white text-lg">O</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Okta</p>
                      <p className="text-xs text-slate-400">SAML 2.0</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Configure Custom SAML
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
                <CardDescription>Manage API keys for SDK integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Production Key</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                  </div>
                  <code className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                    tf_live_••••••••••••••••
                  </code>
                  <p className="text-xs text-slate-500 mt-2">Created 30 days ago</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Development Key</span>
                    <Badge variant="outline" className="text-slate-400">Test</Badge>
                  </div>
                  <code className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                    tf_test_••••••••••••••••
                  </code>
                  <p className="text-xs text-slate-500 mt-2">Created 30 days ago</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Key
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Data Privacy
                </CardTitle>
                <CardDescription>Configure data retention and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">PII Masking</p>
                    <p className="text-xs text-slate-400">Automatically mask sensitive data</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Session Recording</p>
                    <p className="text-xs text-slate-400">Record user sessions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">GDPR Mode</p>
                    <p className="text-xs text-slate-400">Enhanced EU compliance</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">HIPAA Mode</p>
                    <p className="text-xs text-slate-400">Healthcare compliance</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Access Controls
                </CardTitle>
                <CardDescription>IP restrictions and domain allowlisting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Allowed Domains</Label>
                  <Input 
                    placeholder="example.com, app.example.com" 
                    className="bg-slate-900 border-slate-600"
                  />
                  <p className="text-xs text-slate-500">Only capture data from these domains</p>
                </div>
                <div className="space-y-2">
                  <Label>Blocked IPs</Label>
                  <Input 
                    placeholder="192.168.1.1, 10.0.0.0/8" 
                    className="bg-slate-900 border-slate-600"
                  />
                  <p className="text-xs text-slate-500">Block data from these IP ranges</p>
                </div>
                <div className="space-y-2">
                  <Label>Data Retention (Days)</Label>
                  <Select defaultValue="90">
                    <SelectTrigger className="bg-slate-900 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TraceflowAdminPanel;
