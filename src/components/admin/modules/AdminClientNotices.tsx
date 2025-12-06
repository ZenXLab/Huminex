import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { RefreshCw, Plus, Bell, AlertTriangle, Info, Wrench, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Notice {
  id: string;
  title: string;
  content: string;
  notice_type: string;
  target_type: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export const AdminClientNotices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    notice_type: "info",
    target_type: "all",
    is_active: true,
    expires_at: "",
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('client_notices').insert({
        title: formData.title,
        content: formData.content,
        notice_type: formData.notice_type,
        target_type: formData.target_type,
        is_active: formData.is_active,
        expires_at: formData.expires_at || null,
        created_by: user?.id,
      });

      if (error) throw error;

      toast.success('Notice created successfully');
      setDialogOpen(false);
      setFormData({
        title: "",
        content: "",
        notice_type: "info",
        target_type: "all",
        is_active: true,
        expires_at: "",
      });
      fetchNotices();
    } catch (error) {
      console.error('Error creating notice:', error);
      toast.error('Failed to create notice');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (notice: Notice) => {
    try {
      const { error } = await supabase
        .from('client_notices')
        .update({ is_active: !notice.is_active })
        .eq('id', notice.id);

      if (error) throw error;
      toast.success(`Notice ${notice.is_active ? 'disabled' : 'enabled'}`);
      fetchNotices();
    } catch (error) {
      toast.error('Failed to update notice');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('client_notices').delete().eq('id', id);
      if (error) throw error;
      toast.success('Notice deleted');
      fetchNotices();
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  const typeIcons: Record<string, any> = {
    info: Info,
    warning: AlertTriangle,
    urgent: Bell,
    maintenance: Wrench,
  };

  const typeColors: Record<string, string> = {
    info: "bg-blue-100 text-blue-800",
    warning: "bg-amber-100 text-amber-800",
    urgent: "bg-red-100 text-red-800",
    maintenance: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Client Notices</h1>
          <p className="text-muted-foreground">Send announcements to clients</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchNotices} disabled={loading} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Notice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Notice title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    placeholder="Notice content..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={formData.notice_type}
                      onValueChange={(v) => setFormData({ ...formData, notice_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target</Label>
                    <Select
                      value={formData.target_type}
                      onValueChange={(v) => setFormData({ ...formData, target_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Clients</SelectItem>
                        <SelectItem value="specific">Specific Clients</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Expires At (optional)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                  />
                  <Label>Active immediately</Label>
                </div>
                <Button onClick={handleCreate} disabled={saving} className="w-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Notice
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : notices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notices yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {notices.map((notice) => {
            const Icon = typeIcons[notice.notice_type] || Info;
            return (
              <Card key={notice.id} className={!notice.is_active ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className={`p-2 rounded-lg ${typeColors[notice.notice_type]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{notice.title}</h3>
                          <Badge className={typeColors[notice.notice_type]}>{notice.notice_type}</Badge>
                          {!notice.is_active && <Badge variant="outline">Inactive</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{notice.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {new Date(notice.created_at).toLocaleString()}
                          {notice.expires_at && ` • Expires: ${new Date(notice.expires_at).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={notice.is_active}
                        onCheckedChange={() => handleToggleActive(notice)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(notice.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
