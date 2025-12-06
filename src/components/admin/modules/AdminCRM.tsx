import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Users, UserPlus, Phone, Mail, Building, TrendingUp, Filter, Search } from "lucide-react";
import { format } from "date-fns";

export const AdminCRM = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service_interest: "",
    message: "",
    source: "manual"
  });

  const { data: leads, isLoading } = useQuery({
    queryKey: ["crm-leads", searchTerm, filterSource],
    queryFn: async () => {
      let query = supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);
      }

      if (filterSource !== "all") {
        query = query.eq("source", filterSource);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const addLeadMutation = useMutation({
    mutationFn: async (lead: typeof newLead) => {
      const { error } = await supabase.from("inquiries").insert([lead]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
      toast.success("Lead added successfully");
      setIsAddDialogOpen(false);
      setNewLead({
        name: "",
        email: "",
        phone: "",
        company: "",
        service_interest: "",
        message: "",
        source: "manual"
      });
    },
    onError: () => {
      toast.error("Failed to add lead");
    },
  });

  const stats = {
    total: leads?.length || 0,
    thisWeek: leads?.filter(l => {
      const created = new Date(l.created_at || "");
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created > weekAgo;
    }).length || 0,
    fromWebsite: leads?.filter(l => l.source === "website").length || 0,
    withPhone: leads?.filter(l => l.phone).length || 0,
  };

  const getSourceBadge = (source: string | null) => {
    const colors: Record<string, string> = {
      website: "bg-primary/20 text-primary",
      manual: "bg-secondary/20 text-secondary-foreground",
      referral: "bg-accent/20 text-accent-foreground",
      campaign: "bg-destructive/20 text-destructive",
    };
    return colors[source || "website"] || colors.website;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM Lead Management</h1>
          <p className="text-muted-foreground">Track and manage all leads and inquiries</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    placeholder="Company name"
                  />
                </div>
              </div>
              <div>
                <Label>Service Interest</Label>
                <Select
                  value={newLead.service_interest}
                  onValueChange={(value) => setNewLead({ ...newLead, service_interest: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital-engineering">Digital Engineering</SelectItem>
                    <SelectItem value="ai-automation">AI & Automation</SelectItem>
                    <SelectItem value="cloud-devops">Cloud & DevOps</SelectItem>
                    <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="managed-it">Managed IT</SelectItem>
                    <SelectItem value="consulting">Enterprise Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => addLeadMutation.mutate(newLead)}
                disabled={!newLead.name || !newLead.email || addLeadMutation.isPending}
              >
                {addLeadMutation.isPending ? "Adding..." : "Add Lead"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">From Website</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fromWebsite}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">With Phone</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withPhone}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Leads</CardTitle>
              <CardDescription>Manage and track all incoming leads</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-36">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading leads...</div>
          ) : leads?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No leads found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads?.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" /> {lead.email}
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" /> {lead.phone}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{lead.company || "-"}</TableCell>
                    <TableCell>{lead.service_interest || "-"}</TableCell>
                    <TableCell>
                      <Badge className={getSourceBadge(lead.source)}>{lead.source || "website"}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.created_at ? format(new Date(lead.created_at), "MMM d, yyyy") : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
