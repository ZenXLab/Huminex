import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, Loader2, Download } from "lucide-react";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Manage Invoices</h1>
        <p className="text-muted-foreground">Track and manage all invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices ({invoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No invoices found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice #</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quote #</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{invoice.invoice_number}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {invoice.quotes?.quote_number || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-foreground">{invoice.quotes?.contact_name || '-'}</p>
                        <p className="text-xs text-muted-foreground">{invoice.quotes?.contact_email || '-'}</p>
                      </td>
                      <td className="py-3 px-4">₹{Number(invoice.total_amount).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[invoice.status || 'draft']}>
                          {invoice.status || 'draft'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Detail Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details - {selectedInvoice?.invoice_number}</DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Related Quote</p>
                  <p className="font-medium">{selectedInvoice.quotes?.quote_number || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{selectedInvoice.quotes?.contact_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">
                    {selectedInvoice.due_date 
                      ? new Date(selectedInvoice.due_date).toLocaleDateString() 
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusColors[selectedInvoice.status || 'draft']}>
                    {selectedInvoice.status || 'draft'}
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{Number(selectedInvoice.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tax ({selectedInvoice.tax_percent}%)</span>
                  <span className="font-medium">₹{Number(selectedInvoice.tax_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{Number(selectedInvoice.total_amount).toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedInvoice.paid_at && (
                <div>
                  <p className="text-sm text-muted-foreground">Paid On</p>
                  <p className="font-medium text-green-600">
                    {new Date(selectedInvoice.paid_at).toLocaleString()}
                  </p>
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
            </div>
          )}

          <DialogFooter>
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
