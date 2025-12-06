import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { ClipboardList, Search, RefreshCw, Check, X, User, Building2, Mail, Eye, UserCheck } from 'lucide-react';

interface OnboardingSession {
  id: string;
  client_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  company_name: string | null;
  client_type: string;
  industry_type: string;
  industry_subtype: string | null;
  selected_services: any[];
  selected_addons: any[];
  current_step: number;
  status: string;
  pricing_snapshot: any;
  dashboard_tier: string;
  assigned_pm: string | null;
  approval_notes: string | null;
  verified_at: string | null;
  approved_at: string | null;
  created_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AdminOnboardingTracker = () => {
  const [sessions, setSessions] = useState<OnboardingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState<OnboardingSession | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [assignedPM, setAssignedPM] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
    fetchTeamMembers();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('onboarding_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load onboarding sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, name, email, role')
        .in('role', ['Project Manager', 'Account Manager', 'Team Lead']);

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleApprove = async () => {
    if (!selectedSession) return;
    
    setActionLoading(true);
    try {
      // Update session status
      const { error: updateError } = await supabase
        .from('onboarding_sessions')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approval_notes: approvalNotes,
          assigned_pm: assignedPM || null,
        })
        .eq('id', selectedSession.id);

      if (updateError) throw updateError;

      // Send approval email
      try {
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            email: selectedSession.email,
            full_name: selectedSession.full_name,
            client_id: selectedSession.client_id,
            type: 'approval',
            assigned_pm: teamMembers.find(m => m.id === assignedPM)?.name || 'Our Team',
          }
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
      }

      toast.success('Onboarding approved! Client notified.');
      setDetailsOpen(false);
      fetchSessions();
    } catch (error) {
      console.error('Error approving:', error);
      toast.error('Failed to approve onboarding');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSession || !approvalNotes) {
      toast.error('Please provide rejection notes');
      return;
    }
    
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('onboarding_sessions')
        .update({
          status: 'rejected',
          approval_notes: approvalNotes,
        })
        .eq('id', selectedSession.id);

      if (error) throw error;

      toast.success('Onboarding rejected');
      setDetailsOpen(false);
      fetchSessions();
    } catch (error) {
      console.error('Error rejecting:', error);
      toast.error('Failed to reject onboarding');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusSessions = (status: string) => {
    return sessions.filter(s => s.status === status);
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    onboarding: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    pending_approval: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    approved: 'bg-green-500/10 text-green-500 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const filteredSessions = sessions.filter(s =>
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.client_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.company_name && s.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const SessionCard = ({ session }: { session: OnboardingSession }) => (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => {
      setSelectedSession(session);
      setApprovalNotes(session.approval_notes || '');
      setAssignedPM(session.assigned_pm || '');
      setDetailsOpen(true);
    }}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold">{session.full_name}</p>
            <p className="text-sm text-muted-foreground">{session.email}</p>
          </div>
          <Badge className={statusColors[session.status]}>{session.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Client ID</p>
            <p className="font-mono">{session.client_id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p>{session.client_type}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Industry</p>
            <p>{session.industry_type}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Step</p>
            <p>{session.current_step}/4</p>
          </div>
        </div>
        {session.pricing_snapshot?.total && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-lg font-bold">₹{session.pricing_snapshot.total.toLocaleString()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            Onboarding Tracker
          </h1>
          <p className="text-muted-foreground">Track and manage client onboarding sessions</p>
        </div>
        <Button variant="outline" onClick={fetchSessions}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">New</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-500">{getStatusSessions('new').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-500">{getStatusSessions('onboarding').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-500">{getStatusSessions('pending_approval').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{getStatusSessions('approved').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{getStatusSessions('rejected').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or client ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Approval ({getStatusSessions('pending_approval').length})
          </TabsTrigger>
          <TabsTrigger value="all">All Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : getStatusSessions('pending_approval').length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No pending approvals
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getStatusSessions('pending_approval').map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Step</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow 
                      key={session.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedSession(session);
                        setApprovalNotes(session.approval_notes || '');
                        setAssignedPM(session.assigned_pm || '');
                        setDetailsOpen(true);
                      }}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{session.full_name}</p>
                          <p className="text-sm text-muted-foreground">{session.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{session.client_id}</TableCell>
                      <TableCell>{session.client_type}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[session.status]}>{session.status}</Badge>
                      </TableCell>
                      <TableCell>{session.current_step}/4</TableCell>
                      <TableCell>
                        {session.pricing_snapshot?.total 
                          ? `₹${session.pricing_snapshot.total.toLocaleString()}`
                          : '-'
                        }
                      </TableCell>
                      <TableCell>{new Date(session.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Onboarding Details</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-6 py-4">
              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Client ID</Label>
                  <p className="font-mono font-bold">{selectedSession.client_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={statusColors[selectedSession.status]}>{selectedSession.status}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p>{selectedSession.full_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p>{selectedSession.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p>{selectedSession.phone || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Company</Label>
                  <p>{selectedSession.company_name || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Client Type</Label>
                  <p>{selectedSession.client_type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Industry</Label>
                  <p>{selectedSession.industry_type} {selectedSession.industry_subtype && `/ ${selectedSession.industry_subtype}`}</p>
                </div>
              </div>

              {/* Services */}
              {selectedSession.selected_services && selectedSession.selected_services.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Selected Services</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedSession.selected_services.map((s: any, i: number) => (
                      <Badge key={i} variant="outline">
                        {s.service} ({s.tier})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing */}
              {selectedSession.pricing_snapshot && (
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-muted-foreground">Quote Summary</Label>
                  <p className="text-2xl font-bold mt-1">
                    ₹{selectedSession.pricing_snapshot.total?.toLocaleString() || 0}
                  </p>
                  {selectedSession.pricing_snapshot.clientTypeMultiplier && (
                    <p className="text-sm text-muted-foreground">
                      Multipliers: ×{selectedSession.pricing_snapshot.clientTypeMultiplier} (client) 
                      ×{selectedSession.pricing_snapshot.industryMultiplier} (industry)
                    </p>
                  )}
                </div>
              )}

              {/* Assign PM */}
              {selectedSession.status === 'pending_approval' && (
                <div>
                  <Label>Assign Project Manager</Label>
                  <Select value={assignedPM} onValueChange={setAssignedPM}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select PM" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Notes */}
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add notes about this onboarding..."
                  disabled={selectedSession.status === 'approved' || selectedSession.status === 'rejected'}
                />
              </div>

              {/* Actions */}
              {selectedSession.status === 'pending_approval' && (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleApprove} 
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOnboardingTracker;
