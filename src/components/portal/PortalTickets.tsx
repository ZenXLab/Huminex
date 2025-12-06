import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { HeadphonesIcon, Plus, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface PortalTicketsProps {
  userId?: string;
}

export const PortalTickets = ({ userId }: PortalTicketsProps) => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", priority: "medium" });

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["portal-all-tickets", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not authenticated");
      const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;
      const { error } = await supabase.from("support_tickets").insert({
        user_id: userId,
        ticket_number: ticketNumber,
        subject: newTicket.subject,
        description: newTicket.description,
        priority: newTicket.priority,
        status: "open",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portal-all-tickets"] });
      toast.success("Ticket created");
      setIsCreateOpen(false);
      setNewTicket({ subject: "", description: "", priority: "medium" });
    },
    onError: () => toast.error("Failed to create ticket"),
  });

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      open: "bg-yellow-500/20 text-yellow-500",
      in_progress: "bg-primary/20 text-primary",
      resolved: "bg-green-500/20 text-green-500",
      closed: "bg-muted text-muted-foreground",
    };
    return styles[status || "open"] || styles.open;
  };

  const getPriorityBadge = (priority: string | null) => {
    const styles: Record<string, string> = {
      low: "bg-muted text-muted-foreground",
      medium: "bg-yellow-500/20 text-yellow-500",
      high: "bg-orange-500/20 text-orange-500",
      urgent: "bg-destructive/20 text-destructive",
    };
    return styles[priority || "medium"] || styles.medium;
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "resolved": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress": return <Clock className="h-5 w-5 text-primary" />;
      default: return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">Get help with your projects</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Ticket</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Support Ticket</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Subject</Label>
                <Input value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} placeholder="Brief description of your issue" />
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={newTicket.priority} onValueChange={(v) => setNewTicket({ ...newTicket, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} placeholder="Detailed description..." rows={4} />
              </div>
              <Button className="w-full" onClick={() => createMutation.mutate()} disabled={!newTicket.subject || createMutation.isPending}>
                Submit Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets?.filter(t => t.status === "open").length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets?.filter(t => t.status === "in_progress").length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets?.filter(t => t.status === "resolved").length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading tickets...</div>
      ) : tickets?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <HeadphonesIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Tickets Yet</h3>
            <p className="text-muted-foreground mb-4">Create a ticket if you need help</p>
            <Button onClick={() => setIsCreateOpen(true)}><Plus className="h-4 w-4 mr-2" />New Ticket</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets?.map((ticket) => (
            <Card key={ticket.id} className="hover:border-primary/30 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {getStatusIcon(ticket.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{ticket.subject}</h3>
                      <span className="font-mono text-sm text-muted-foreground">{ticket.ticket_number}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{ticket.description}</p>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusBadge(ticket.status)}>{ticket.status?.replace("_", " ")}</Badge>
                      <Badge className={getPriorityBadge(ticket.priority)}>{ticket.priority}</Badge>
                      <span className="text-xs text-muted-foreground">Created {format(new Date(ticket.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
