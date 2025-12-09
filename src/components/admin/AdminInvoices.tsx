import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Eye, Loader2, Download, Receipt, CreditCard, TrendingUp, 
  Clock, CheckCircle, XCircle, AlertCircle, Search, RefreshCw,
  Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Filter
} from "lucide-react";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const statusIcons: Record<string, React.ReactNode> = {
  draft: <Clock className="h-3 w-3" />,
  sent: <ArrowUpRight className="h-3 w-3" />,
  paid: <CheckCircle className="h-3 w-3" />,
  overdue: <AlertCircle className="h-3 w-3" />,
  cancelled: <XCircle className="h-3 w-3" />,
  failed: <XCircle className="h-3 w-3" />,
};

export const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, quotes(quote_number, contact_name, contact_email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();

    // Set up realtime subscription
    const channel = supabase
      .channel('invoices-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'invoices' },
        () => {
          fetchInvoices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchInvoices();
    setIsRefreshing(false);
    toast.success('Data refreshed');
  };

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    setActionLoading(true);
    try {
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };
      
      if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', invoiceId);

      if (error) throw error;
      toast.success(`Invoice marked as ${status}`);
      fetchInvoices();
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => ['draft', 'sent'].includes(i.status)).length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total_amount || 0), 0),
    pendingAmount: invoices.filter(i => ['draft', 'sent'].includes(i.status)).reduce((sum, i) => sum + Number(i.total_amount || 0), 0),
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.quotes?.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.quotes?.contact_email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Parse notes JSON for payment details
  const parseNotes = (notes: string | null) => {
    if (!notes) return null;
    try {
      return JSON.parse(notes);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Invoices & Payments
          </h1>
          <p className="text-muted-foreground">
            Track invoices, payment statuses, and transaction history
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-card to-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
                <p className="text-xs text-muted-foreground">Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-600">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-amber-600">
                  ₹{stats.pendingAmount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by invoice #, name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            All Invoices
            <Badge variant="secondary" className="ml-2">{filteredInvoices.length}</Badge>
          </CardTitle>
          <CardDescription>
            Complete list of all invoices with payment tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No invoices found</p>
              {searchQuery && (
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice #</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan/Service</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Payment</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => {
                    const notes = parseNotes(invoice.notes);
                    return (
                      <tr key={invoice.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-mono font-medium text-sm">{invoice.invoice_number}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium text-foreground">
                            {notes?.plan_name || invoice.quotes?.quote_number || '-'}
                          </p>
                          {notes?.region && (
                            <p className="text-xs text-muted-foreground capitalize">{notes.region}</p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-foreground">
                            {invoice.quotes?.contact_name || notes?.payment_email || '-'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {invoice.quotes?.contact_email || ''}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-foreground">
                            {notes?.currency === '$' ? '$' : '₹'}{Number(invoice.total_amount).toLocaleString()}
                          </p>
                          {invoice.tax_amount > 0 && (
                            <p className="text-xs text-muted-foreground">
                              incl. tax ₹{Number(invoice.tax_amount).toLocaleString()}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`${statusColors[invoice.status || 'draft']} flex items-center gap-1 w-fit`}>
                            {statusIcons[invoice.status || 'draft']}
                            {invoice.status || 'draft'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {notes?.razorpay_payment_id ? (
                            <div>
                              <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                                <CreditCard className="h-3 w-3 mr-1" />
                                Razorpay
                              </Badge>
                              <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                                {notes.razorpay_payment_id.slice(0, 12)}...
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-foreground">
                            {new Date(invoice.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                          {invoice.paid_at && (
                            <p className="text-xs text-green-600">
                              Paid: {new Date(invoice.paid_at).toLocaleDateString()}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Detail Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Invoice Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Invoice Details</TabsTrigger>
                <TabsTrigger value="payment">Payment Info</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Invoice Number</p>
                  <p className="text-xl font-mono font-bold text-foreground">
                    {selectedInvoice.invoice_number}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Plan/Service</p>
                    <p className="font-medium">
                      {parseNotes(selectedInvoice.notes)?.plan_name || 
                       selectedInvoice.quotes?.quote_number || '-'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Contact</p>
                    <p className="font-medium">
                      {selectedInvoice.quotes?.contact_name || 
                       parseNotes(selectedInvoice.notes)?.payment_email || '-'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Created</p>
                    <p className="font-medium">
                      {new Date(selectedInvoice.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge className={statusColors[selectedInvoice.status || 'draft']}>
                      {selectedInvoice.status || 'draft'}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl space-y-3">
                  <h4 className="font-semibold text-foreground">Pricing Breakdown</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{Number(selectedInvoice.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tax ({selectedInvoice.tax_percent || 0}%)</span>
                    <span className="font-medium">₹{Number(selectedInvoice.tax_amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-border">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{Number(selectedInvoice.total_amount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Add-ons if available */}
                {parseNotes(selectedInvoice.notes)?.addons?.length > 0 && (
                  <div className="p-4 rounded-xl border border-border">
                    <h4 className="font-semibold text-foreground mb-3">Add-ons</h4>
                    <div className="space-y-2">
                      {parseNotes(selectedInvoice.notes).addons.map((addon: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{addon.name}</span>
                          <span className="font-medium">₹{addon.price?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Update Status</p>
                  <Select
                    value={selectedInvoice.status}
                    onValueChange={(value) => updateInvoiceStatus(selectedInvoice.id, value)}
                    disabled={actionLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="payment" className="space-y-6 mt-4">
                {selectedInvoice.paid_at ? (
                  <>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-700">Payment Successful</p>
                          <p className="text-sm text-muted-foreground">
                            Paid on {new Date(selectedInvoice.paid_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {parseNotes(selectedInvoice.notes)?.razorpay_payment_id && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                          Razorpay Transaction Details
                        </h4>
                        <div className="grid gap-3">
                          <div className="p-3 rounded-lg bg-muted/30 flex justify-between">
                            <span className="text-sm text-muted-foreground">Payment ID</span>
                            <span className="font-mono text-sm">
                              {parseNotes(selectedInvoice.notes).razorpay_payment_id}
                            </span>
                          </div>
                          {parseNotes(selectedInvoice.notes).razorpay_order_id && (
                            <div className="p-3 rounded-lg bg-muted/30 flex justify-between">
                              <span className="text-sm text-muted-foreground">Order ID</span>
                              <span className="font-mono text-sm">
                                {parseNotes(selectedInvoice.notes).razorpay_order_id}
                              </span>
                            </div>
                          )}
                          {parseNotes(selectedInvoice.notes).payment_method && (
                            <div className="p-3 rounded-lg bg-muted/30 flex justify-between">
                              <span className="text-sm text-muted-foreground">Payment Method</span>
                              <span className="capitalize">
                                {parseNotes(selectedInvoice.notes).payment_method}
                              </span>
                            </div>
                          )}
                          {parseNotes(selectedInvoice.notes).payment_email && (
                            <div className="p-3 rounded-lg bg-muted/30 flex justify-between">
                              <span className="text-sm text-muted-foreground">Payment Email</span>
                              <span>{parseNotes(selectedInvoice.notes).payment_email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No payment recorded yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Payment details will appear here once the invoice is paid
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
