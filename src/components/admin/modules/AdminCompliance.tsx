import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw, Plus, Shield, CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ComplianceItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export const AdminCompliance = () => {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "security",
    due_date: "",
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('compliance_items')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching compliance items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('compliance_items').insert({
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        due_date: formData.due_date || null,
      });

      if (error) throw error;
      toast.success('Compliance item created');
      setDialogOpen(false);
      setFormData({ title: "", description: "", category: "security", due_date: "" });
      fetchItems();
    } catch (error) {
      toast.error('Failed to create item');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (item: ComplianceItem, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('compliance_items')
        .update({
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', item.id);

      if (error) throw error;
      toast.success('Status updated');
      fetchItems();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statusIcons: Record<string, any> = {
    pending: Clock,
    in_progress: AlertTriangle,
    completed: CheckCircle,
    overdue: AlertTriangle,
  };

  const statusColors: Record<string, string> = {
    pending: "bg-slate-100 text-slate-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-emerald-100 text-emerald-800",
    overdue: "bg-red-100 text-red-800",
  };

  const categoryColors: Record<string, string> = {
    security: "bg-purple-100 text-purple-800",
    privacy: "bg-cyan-100 text-cyan-800",
    legal: "bg-amber-100 text-amber-800",
    financial: "bg-emerald-100 text-emerald-800",
    operational: "bg-blue-100 text-blue-800",
  };

  const stats = {
    total: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    inProgress: items.filter(i => i.status === 'in_progress').length,
    completed: items.filter(i => i.status === 'completed').length,
    overdue: items.filter(i => i.status === 'overdue' || (i.due_date && new Date(i.due_date) < new Date() && i.status !== 'completed')).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Compliance</h1>
          <p className="text-muted-foreground">Track compliance requirements and audits</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchItems} disabled={loading} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Compliance Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Compliance requirement..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Details..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => setFormData({ ...formData, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="privacy">Privacy</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="operational">Operational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreate} disabled={saving} className="w-full">
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Create Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-slate-600">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No compliance items</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = statusIcons[item.status] || Clock;
            const isOverdue = item.due_date && new Date(item.due_date) < new Date() && item.status !== 'completed';
            return (
              <Card key={item.id} className={isOverdue ? 'border-red-500/50' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className={`p-2 rounded-lg ${statusColors[isOverdue ? 'overdue' : item.status]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold">{item.title}</h3>
                          <Badge className={categoryColors[item.category]}>{item.category}</Badge>
                          <Badge className={statusColors[isOverdue ? 'overdue' : item.status]}>
                            {isOverdue ? 'overdue' : item.status}
                          </Badge>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        {item.due_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(item.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Select
                      value={item.status}
                      onValueChange={(v) => handleStatusChange(item, v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
