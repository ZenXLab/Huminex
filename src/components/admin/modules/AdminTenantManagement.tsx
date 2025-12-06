import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Building2, Plus, Users, Server, Edit, Trash2, RefreshCw, Search, Eye } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  tenant_type: string;
  status: string;
  contact_email: string;
  contact_phone: string | null;
  address: string | null;
  created_at: string;
}

interface TenantUser {
  id: string;
  user_id: string;
  role: string;
  tenant_id: string;
  created_at: string;
}

const AdminTenantManagement = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenantUsers, setTenantUsers] = useState<TenantUser[]>([]);
  const [viewUsersDialogOpen, setViewUsersDialogOpen] = useState(false);
  
  const [newTenant, setNewTenant] = useState({
    name: '',
    slug: '',
    tenant_type: 'individual',
    contact_email: '',
    contact_phone: '',
    address: '',
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast.error('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantUsers = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('client_tenant_users')
        .select('*')
        .eq('tenant_id', tenantId);

      if (error) throw error;
      setTenantUsers(data || []);
    } catch (error) {
      console.error('Error fetching tenant users:', error);
      toast.error('Failed to load tenant users');
    }
  };

  const handleCreateTenant = async () => {
    if (!newTenant.name || !newTenant.contact_email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      const slug = newTenant.slug || newTenant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const { error } = await supabase
        .from('client_tenants')
        .insert({
          ...newTenant,
          slug,
          status: 'active',
        });

      if (error) throw error;

      toast.success('Tenant created successfully');
      setCreateDialogOpen(false);
      setNewTenant({
        name: '',
        slug: '',
        tenant_type: 'individual',
        contact_email: '',
        contact_phone: '',
        address: '',
      });
      fetchTenants();
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast.error('Failed to create tenant');
    }
  };

  const handleUpdateStatus = async (tenantId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('client_tenants')
        .update({ status })
        .eq('id', tenantId);

      if (error) throw error;

      toast.success('Tenant status updated');
      fetchTenants();
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast.error('Failed to update tenant');
    }
  };

  const handleDeleteTenant = async (tenantId: string) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return;

    try {
      const { error } = await supabase
        .from('client_tenants')
        .delete()
        .eq('id', tenantId);

      if (error) throw error;

      toast.success('Tenant deleted');
      fetchTenants();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast.error('Failed to delete tenant');
    }
  };

  const handleViewUsers = async (tenant: Tenant) => {
    setSelectedTenant(tenant);
    await fetchTenantUsers(tenant.id);
    setViewUsersDialogOpen(true);
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    suspended: 'bg-red-500/10 text-red-500 border-red-500/20',
    inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };

  const typeColors: Record<string, string> = {
    individual: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    business: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    enterprise: 'bg-primary/10 text-primary border-primary/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Tenant Management
          </h1>
          <p className="text-muted-foreground">Manage client organizations and their users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTenants}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Tenant</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Organization Name *</Label>
                  <Input
                    value={newTenant.name}
                    onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                    placeholder="Enter organization name"
                  />
                </div>
                <div>
                  <Label>Slug (URL identifier)</Label>
                  <Input
                    value={newTenant.slug}
                    onChange={(e) => setNewTenant({...newTenant, slug: e.target.value})}
                    placeholder="auto-generated-from-name"
                  />
                </div>
                <div>
                  <Label>Tenant Type</Label>
                  <Select 
                    value={newTenant.tenant_type} 
                    onValueChange={(v) => setNewTenant({...newTenant, tenant_type: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Contact Email *</Label>
                  <Input
                    type="email"
                    value={newTenant.contact_email}
                    onChange={(e) => setNewTenant({...newTenant, contact_email: e.target.value})}
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input
                    value={newTenant.contact_phone}
                    onChange={(e) => setNewTenant({...newTenant, contact_phone: e.target.value})}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={newTenant.address}
                    onChange={(e) => setNewTenant({...newTenant, address: e.target.value})}
                    placeholder="Enter address"
                  />
                </div>
                <Button onClick={handleCreateTenant} className="w-full">
                  Create Tenant
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tenants.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">
              {tenants.filter(t => t.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-500">
              {tenants.filter(t => t.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enterprise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {tenants.filter(t => t.tenant_type === 'enterprise').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tenants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tenants Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-muted-foreground">{tenant.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={typeColors[tenant.tenant_type] || typeColors.individual}>
                        {tenant.tenant_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[tenant.status] || statusColors.pending}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{tenant.contact_email}</p>
                        {tenant.contact_phone && (
                          <p className="text-sm text-muted-foreground">{tenant.contact_phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewUsers(tenant)}>
                          <Users className="w-4 h-4" />
                        </Button>
                        <Select
                          value={tenant.status}
                          onValueChange={(v) => handleUpdateStatus(tenant.id, v)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleDeleteTenant(tenant.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTenants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No tenants found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Users Dialog */}
      <Dialog open={viewUsersDialogOpen} onOpenChange={setViewUsersDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Users in {selectedTenant?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {tenantUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No users in this tenant</p>
            ) : (
              <div className="space-y-2">
                {tenantUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{user.user_id}</p>
                      <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                    </div>
                    <Badge>{user.role}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTenantManagement;
