import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { RefreshCw, CheckCircle, XCircle, Clock, Mail, Building, Phone, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OnboardingRequest {
  id: string;
  email: string;
  full_name: string;
  company_name: string | null;
  phone: string | null;
  service_interests: any;
  status: string;
  notes: string | null;
  created_at: string;
}

export const AdminOnboardingApprovals = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<OnboardingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<OnboardingRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_onboarding')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load onboarding requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel('onboarding-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_onboarding' }, fetchRequests)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleApprove = async (request: OnboardingRequest) => {
    setActionLoading(request.id);
    try {
      const temporaryPassword = generateTemporaryPassword();

      // Update onboarding status
      const { error: updateError } = await supabase
        .from('client_onboarding')
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          notes: reviewNotes || null,
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // Create user account with temporary password
      const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
        email: request.email,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: {
          full_name: request.full_name,
          company_name: request.company_name,
        }
      });

      // If admin API not available, try regular sign up
      if (signUpError) {
        console.log('Admin API not available, user will need to sign up manually');
      }

      // Send welcome email with credentials
      const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          clientEmail: request.email,
          clientName: request.full_name,
          companyName: request.company_name || 'Your Company',
          temporaryPassword: temporaryPassword,
        }
      });

      if (emailError) {
        console.error('Failed to send welcome email:', emailError);
        toast.warning('Approved, but failed to send welcome email. Please send manually.');
      } else {
        toast.success(`Approved ${request.full_name}'s application. Welcome email sent!`);
      }

      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'approve_onboarding',
        entity_type: 'client_onboarding',
        entity_id: request.id,
        new_values: { status: 'approved', notes: reviewNotes },
      });

      setSelectedRequest(null);
      setReviewNotes("");
      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (request: OnboardingRequest) => {
    if (!reviewNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setActionLoading(request.id);
    try {
      const { error } = await supabase
        .from('client_onboarding')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          notes: reviewNotes,
        })
        .eq('id', request.id);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'reject_onboarding',
        entity_type: 'client_onboarding',
        entity_id: request.id,
        new_values: { status: 'rejected', notes: reviewNotes },
      });

      toast.success(`Rejected ${request.full_name}'s application`);
      setSelectedRequest(null);
      setReviewNotes("");
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Onboarding Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve client applications
            {pendingCount > 0 && (
              <Badge className="ml-2 bg-amber-500">{pendingCount} pending</Badge>
            )}
          </p>
        </div>
        <Button onClick={fetchRequests} disabled={loading} variant="outline" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No onboarding requests yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id} className={request.status === 'pending' ? 'border-amber-500/50' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{request.full_name}</h3>
                      <Badge className={statusColors[request.status]}>{request.status}</Badge>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {request.email}
                      </div>
                      {request.company_name && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4" />
                          {request.company_name}
                        </div>
                      )}
                      {request.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {request.phone}
                        </div>
                      )}
                      <div className="text-muted-foreground">
                        Applied: {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {request.service_interests && request.service_interests.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {request.service_interests.map((service, i) => (
                          <Badge key={i} variant="outline">{service}</Badge>
                        ))}
                      </div>
                    )}

                    {request.notes && (
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        <span className="font-medium">Notes:</span> {request.notes}
                      </p>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Review
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Review {selectedRequest?.full_name}'s application for ATLAS Portal access
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Name:</span> {selectedRequest?.full_name}</p>
              <p><span className="font-medium">Email:</span> {selectedRequest?.email}</p>
              {selectedRequest?.company_name && (
                <p><span className="font-medium">Company:</span> {selectedRequest?.company_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Review Notes (required for rejection)</label>
              <Textarea
                placeholder="Add notes about this application..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => selectedRequest && handleReject(selectedRequest)}
                disabled={actionLoading === selectedRequest?.id}
                className="text-red-600 hover:bg-red-50"
              >
                {actionLoading === selectedRequest?.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Reject
              </Button>
              <Button
                onClick={() => selectedRequest && handleApprove(selectedRequest)}
                disabled={actionLoading === selectedRequest?.id}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {actionLoading === selectedRequest?.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Approve & Send Welcome Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
