import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { DollarSign, Plus, Edit, Trash2, RefreshCw, Tag, Percent, Settings } from 'lucide-react';

interface ServicePricing {
  id: string;
  service_name: string;
  service_category: string;
  plan_tier: string;
  base_price: number;
  description: string;
  features: string[];
  is_active: boolean;
}

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
}

interface PricingModifier {
  id: string;
  modifier_type: string;
  modifier_key: string;
  multiplier: number;
  description: string;
  is_active: boolean;
}

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  valid_until: string | null;
  is_active: boolean;
}

const AdminPricingManagement = () => {
  const [services, setServices] = useState<ServicePricing[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [modifiers, setModifiers] = useState<PricingModifier[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editService, setEditService] = useState<ServicePricing | null>(null);
  const [editAddon, setEditAddon] = useState<Addon | null>(null);
  const [editModifier, setEditModifier] = useState<PricingModifier | null>(null);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [addonDialogOpen, setAddonDialogOpen] = useState(false);
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [servicesRes, addonsRes, modifiersRes, couponsRes] = await Promise.all([
        supabase.from('service_pricing').select('*').order('service_name'),
        supabase.from('service_addons').select('*').order('name'),
        supabase.from('pricing_modifiers').select('*').order('modifier_type'),
        supabase.from('coupon_codes').select('*').order('created_at', { ascending: false }),
      ]);

      if (servicesRes.data) {
        setServices(servicesRes.data.map(s => ({
          ...s,
          features: Array.isArray(s.features) ? s.features : JSON.parse(s.features as string || '[]')
        })));
      }
      if (addonsRes.data) setAddons(addonsRes.data);
      if (modifiersRes.data) setModifiers(modifiersRes.data);
      if (couponsRes.data) setCoupons(couponsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load pricing data');
    } finally {
      setLoading(false);
    }
  };

  // Service handlers
  const handleSaveService = async () => {
    if (!editService) return;
    
    try {
      const { error } = editService.id
        ? await supabase.from('service_pricing').update({
            service_name: editService.service_name,
            plan_tier: editService.plan_tier,
            base_price: editService.base_price,
            description: editService.description,
            features: editService.features,
            is_active: editService.is_active,
          }).eq('id', editService.id)
        : await supabase.from('service_pricing').insert({
            service_name: editService.service_name,
            service_category: 'core',
            plan_tier: editService.plan_tier,
            base_price: editService.base_price,
            description: editService.description,
            features: editService.features,
            is_active: editService.is_active,
          });

      if (error) throw error;
      toast.success('Service pricing saved');
      setServiceDialogOpen(false);
      setEditService(null);
      fetchAllData();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this pricing entry?')) return;
    
    try {
      const { error } = await supabase.from('service_pricing').delete().eq('id', id);
      if (error) throw error;
      toast.success('Service deleted');
      fetchAllData();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  // Addon handlers
  const handleSaveAddon = async () => {
    if (!editAddon) return;
    
    try {
      const { error } = editAddon.id
        ? await supabase.from('service_addons').update({
            name: editAddon.name,
            description: editAddon.description,
            price: editAddon.price,
            category: editAddon.category,
            is_active: editAddon.is_active,
          }).eq('id', editAddon.id)
        : await supabase.from('service_addons').insert({
            name: editAddon.name,
            description: editAddon.description,
            price: editAddon.price,
            category: editAddon.category,
            is_active: editAddon.is_active,
          });

      if (error) throw error;
      toast.success('Addon saved');
      setAddonDialogOpen(false);
      setEditAddon(null);
      fetchAllData();
    } catch (error) {
      console.error('Error saving addon:', error);
      toast.error('Failed to save addon');
    }
  };

  // Modifier handlers
  const handleSaveModifier = async () => {
    if (!editModifier) return;
    
    try {
      const { error } = editModifier.id
        ? await supabase.from('pricing_modifiers').update({
            modifier_type: editModifier.modifier_type,
            modifier_key: editModifier.modifier_key,
            multiplier: editModifier.multiplier,
            description: editModifier.description,
            is_active: editModifier.is_active,
          }).eq('id', editModifier.id)
        : await supabase.from('pricing_modifiers').insert({
            modifier_type: editModifier.modifier_type,
            modifier_key: editModifier.modifier_key,
            multiplier: editModifier.multiplier,
            description: editModifier.description,
            is_active: editModifier.is_active,
          });

      if (error) throw error;
      toast.success('Modifier saved');
      setModifierDialogOpen(false);
      setEditModifier(null);
      fetchAllData();
    } catch (error) {
      console.error('Error saving modifier:', error);
      toast.error('Failed to save modifier');
    }
  };

  // Coupon handlers
  const handleSaveCoupon = async () => {
    if (!editCoupon) return;
    
    try {
      const { error } = editCoupon.id
        ? await supabase.from('coupon_codes').update({
            code: editCoupon.code.toUpperCase(),
            discount_type: editCoupon.discount_type,
            discount_value: editCoupon.discount_value,
            max_uses: editCoupon.max_uses,
            valid_until: editCoupon.valid_until,
            is_active: editCoupon.is_active,
          }).eq('id', editCoupon.id)
        : await supabase.from('coupon_codes').insert({
            code: editCoupon.code.toUpperCase(),
            discount_type: editCoupon.discount_type,
            discount_value: editCoupon.discount_value,
            max_uses: editCoupon.max_uses,
            valid_until: editCoupon.valid_until,
            is_active: editCoupon.is_active,
          });

      if (error) throw error;
      toast.success('Coupon saved');
      setCouponDialogOpen(false);
      setEditCoupon(null);
      fetchAllData();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error('Failed to save coupon');
    }
  };

  const tierColors: Record<string, string> = {
    basic: 'bg-gray-500/10 text-gray-500',
    standard: 'bg-blue-500/10 text-blue-500',
    advanced: 'bg-purple-500/10 text-purple-500',
    enterprise: 'bg-primary/10 text-primary',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Pricing Management
          </h1>
          <p className="text-muted-foreground">Manage service pricing, add-ons, and discounts</p>
        </div>
        <Button variant="outline" onClick={fetchAllData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="services">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="addons">Add-ons</TabsTrigger>
          <TabsTrigger value="modifiers">Modifiers</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => {
              setEditService({
                id: '',
                service_name: '',
                service_category: 'core',
                plan_tier: 'basic',
                base_price: 0,
                description: '',
                features: [],
                is_active: true,
              });
              setServiceDialogOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <p className="font-medium">{service.service_name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">{service.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={tierColors[service.plan_tier]}>{service.plan_tier}</Badge>
                      </TableCell>
                      <TableCell>₹{service.base_price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={service.is_active ? 'default' : 'secondary'}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditService(service);
                          setServiceDialogOpen(true);
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteService(service.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add-ons Tab */}
        <TabsContent value="addons" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => {
              setEditAddon({
                id: '',
                name: '',
                description: '',
                price: 0,
                category: 'general',
                is_active: true,
              });
              setAddonDialogOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Addon
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon) => (
              <Card key={addon.id} className={!addon.is_active ? 'opacity-60' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{addon.name}</CardTitle>
                    <Badge variant="outline">{addon.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{addon.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">₹{addon.price.toLocaleString()}</p>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditAddon(addon);
                        setAddonDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Modifiers Tab */}
        <TabsContent value="modifiers" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => {
              setEditModifier({
                id: '',
                modifier_type: 'client_type',
                modifier_key: '',
                multiplier: 1,
                description: '',
                is_active: true,
              });
              setModifierDialogOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Modifier
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Multiplier</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modifiers.map((modifier) => (
                    <TableRow key={modifier.id}>
                      <TableCell>
                        <Badge variant="outline">{modifier.modifier_type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{modifier.modifier_key}</TableCell>
                      <TableCell>×{modifier.multiplier}</TableCell>
                      <TableCell className="text-muted-foreground">{modifier.description}</TableCell>
                      <TableCell>
                        <Badge variant={modifier.is_active ? 'default' : 'secondary'}>
                          {modifier.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditModifier(modifier);
                          setModifierDialogOpen(true);
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coupons Tab */}
        <TabsContent value="coupons" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => {
              setEditCoupon({
                id: '',
                code: '',
                discount_type: 'percentage',
                discount_value: 10,
                max_uses: null,
                current_uses: 0,
                valid_until: null,
                is_active: true,
              });
              setCouponDialogOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Coupon
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                      <TableCell>
                        {coupon.discount_value}
                        {coupon.discount_type === 'percentage' ? '%' : ' ₹'}
                      </TableCell>
                      <TableCell>
                        {coupon.current_uses}/{coupon.max_uses || '∞'}
                      </TableCell>
                      <TableCell>
                        {coupon.valid_until 
                          ? new Date(coupon.valid_until).toLocaleDateString()
                          : 'No expiry'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditCoupon(coupon);
                          setCouponDialogOpen(true);
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Service Dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editService?.id ? 'Edit' : 'Add'} Service</DialogTitle>
          </DialogHeader>
          {editService && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Service Name</Label>
                <Input
                  value={editService.service_name}
                  onChange={(e) => setEditService({...editService, service_name: e.target.value})}
                />
              </div>
              <div>
                <Label>Plan Tier</Label>
                <Select 
                  value={editService.plan_tier} 
                  onValueChange={(v) => setEditService({...editService, plan_tier: v})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Base Price (₹)</Label>
                <Input
                  type="number"
                  value={editService.base_price}
                  onChange={(e) => setEditService({...editService, base_price: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editService.description}
                  onChange={(e) => setEditService({...editService, description: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editService.is_active}
                  onCheckedChange={(v) => setEditService({...editService, is_active: v})}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSaveService} className="w-full">Save Service</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Addon Dialog */}
      <Dialog open={addonDialogOpen} onOpenChange={setAddonDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editAddon?.id ? 'Edit' : 'Add'} Add-on</DialogTitle>
          </DialogHeader>
          {editAddon && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editAddon.name}
                  onChange={(e) => setEditAddon({...editAddon, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={editAddon.category}
                  onChange={(e) => setEditAddon({...editAddon, category: e.target.value})}
                />
              </div>
              <div>
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={editAddon.price}
                  onChange={(e) => setEditAddon({...editAddon, price: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editAddon.description || ''}
                  onChange={(e) => setEditAddon({...editAddon, description: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editAddon.is_active}
                  onCheckedChange={(v) => setEditAddon({...editAddon, is_active: v})}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSaveAddon} className="w-full">Save Add-on</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modifier Dialog */}
      <Dialog open={modifierDialogOpen} onOpenChange={setModifierDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editModifier?.id ? 'Edit' : 'Add'} Modifier</DialogTitle>
          </DialogHeader>
          {editModifier && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Type</Label>
                <Select 
                  value={editModifier.modifier_type} 
                  onValueChange={(v) => setEditModifier({...editModifier, modifier_type: v})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client_type">Client Type</SelectItem>
                    <SelectItem value="industry">Industry</SelectItem>
                    <SelectItem value="region">Region</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Key</Label>
                <Input
                  value={editModifier.modifier_key}
                  onChange={(e) => setEditModifier({...editModifier, modifier_key: e.target.value})}
                  placeholder="e.g., enterprise, healthcare"
                />
              </div>
              <div>
                <Label>Multiplier</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editModifier.multiplier}
                  onChange={(e) => setEditModifier({...editModifier, multiplier: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={editModifier.description || ''}
                  onChange={(e) => setEditModifier({...editModifier, description: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editModifier.is_active}
                  onCheckedChange={(v) => setEditModifier({...editModifier, is_active: v})}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSaveModifier} className="w-full">Save Modifier</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Coupon Dialog */}
      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editCoupon?.id ? 'Edit' : 'Add'} Coupon</DialogTitle>
          </DialogHeader>
          {editCoupon && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Code</Label>
                <Input
                  value={editCoupon.code}
                  onChange={(e) => setEditCoupon({...editCoupon, code: e.target.value.toUpperCase()})}
                  placeholder="SUMMER2024"
                />
              </div>
              <div>
                <Label>Discount Type</Label>
                <Select 
                  value={editCoupon.discount_type} 
                  onValueChange={(v) => setEditCoupon({...editCoupon, discount_type: v})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  value={editCoupon.discount_value}
                  onChange={(e) => setEditCoupon({...editCoupon, discount_value: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label>Max Uses (leave empty for unlimited)</Label>
                <Input
                  type="number"
                  value={editCoupon.max_uses || ''}
                  onChange={(e) => setEditCoupon({...editCoupon, max_uses: e.target.value ? Number(e.target.value) : null})}
                />
              </div>
              <div>
                <Label>Valid Until</Label>
                <Input
                  type="date"
                  value={editCoupon.valid_until?.split('T')[0] || ''}
                  onChange={(e) => setEditCoupon({...editCoupon, valid_until: e.target.value || null})}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editCoupon.is_active}
                  onCheckedChange={(v) => setEditCoupon({...editCoupon, is_active: v})}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSaveCoupon} className="w-full">Save Coupon</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPricingManagement;
