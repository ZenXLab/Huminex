import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X, Receipt, Eye, Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  converted: "bg-blue-100 text-blue-800",
  draft: "bg-gray-100 text-gray-800",
};

export const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const updateQuoteStatus = async (quoteId: string, status: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: status as "approved" | "converted" | "draft" | "pending" | "rejected", updated_at: new Date().toISOString() })
        .eq('id', quoteId);

      if (error) throw error;
      toast.success(`Quote ${status}`);
      fetchQuotes();
      setSelectedQuote(null);
    } catch (error) {
      console.error('Error updating quote:', error);
      toast.error('Failed to update quote');
    } finally {
      setActionLoading(false);
    }
  };

  const convertToInvoice = async (quote: any) => {
    setActionLoading(true);
    try {
      // Generate invoice number
      const { data: invoiceNumber, error: invoiceNumberError } = await supabase
        .rpc('generate_invoice_number');

      if (invoiceNumberError) throw invoiceNumberError;

      const taxPercent = 18;
      const amount = Number(quote.final_price);
      const taxAmount = amount * (taxPercent / 100);
      const totalAmount = amount + taxAmount;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      // Create invoice
      const { error: insertError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          quote_id: quote.id,
          user_id: quote.user_id,
          amount,
          tax_percent: taxPercent,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'sent',
        });

      if (insertError) throw insertError;

      // Update quote status
      await supabase
        .from('quotes')
        .update({ status: 'converted', updated_at: new Date().toISOString() })
        .eq('id', quote.id);

      toast.success(`Invoice ${invoiceNumber} created`);
      fetchQuotes();
      setSelectedQuote(null);
    } catch (error) {
      console.error('Error converting to invoice:', error);
      toast.error('Failed to create invoice');
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
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Manage Quotes</h1>
        <p className="text-muted-foreground">Review, approve, reject, or convert quotes to invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Quotes ({quotes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No quotes found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quote #</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{quote.quote_number}</td>
                      <td className="py-3 px-4">
                        <p className="text-foreground">{quote.contact_name || '-'}</p>
                        <p className="text-xs text-muted-foreground">{quote.contact_email || '-'}</p>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground capitalize">
                        {quote.service_type.replace('-', ' ')}
                      </td>
                      <td className="py-3 px-4">₹{Number(quote.final_price).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[quote.status || 'pending']}>
                          {quote.status || 'pending'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedQuote(quote)}
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

      {/* Quote Detail Modal */}
      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quote Details - {selectedQuote?.quote_number}</DialogTitle>
          </DialogHeader>
          
          {selectedQuote && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Name</p>
                  <p className="font-medium">{selectedQuote.contact_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Email</p>
                  <p className="font-medium">{selectedQuote.contact_email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Phone</p>
                  <p className="font-medium">{selectedQuote.contact_phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{selectedQuote.contact_company || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Client Type</p>
                  <p className="font-medium capitalize">{selectedQuote.client_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Type</p>
                  <p className="font-medium capitalize">{selectedQuote.service_type.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Complexity</p>
                  <p className="font-medium capitalize">{selectedQuote.complexity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusColors[selectedQuote.status || 'pending']}>
                    {selectedQuote.status || 'pending'}
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Estimated Price</span>
                  <span className="font-medium">₹{Number(selectedQuote.estimated_price).toLocaleString()}</span>
                </div>
                {selectedQuote.discount_percent > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">-{selectedQuote.discount_percent}%</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
                  <span className="font-medium">Final Price</span>
                  <span className="text-xl font-bold text-primary">₹{Number(selectedQuote.final_price).toLocaleString()}</span>
                </div>
              </div>

              {selectedQuote.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-foreground">{selectedQuote.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            {selectedQuote?.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => updateQuoteStatus(selectedQuote.id, 'rejected')}
                  disabled={actionLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateQuoteStatus(selectedQuote.id, 'approved')}
                  disabled={actionLoading}
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            {selectedQuote?.status === 'approved' && (
              <Button
                variant="hero"
                onClick={() => convertToInvoice(selectedQuote)}
                disabled={actionLoading}
              >
                <Receipt className="h-4 w-4 mr-2" />
                Convert to Invoice
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
