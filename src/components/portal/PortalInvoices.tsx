import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt, Download, CreditCard } from "lucide-react";
import { format } from "date-fns";

interface PortalInvoicesProps {
  userId?: string;
}

export const PortalInvoices = ({ userId }: PortalInvoicesProps) => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["portal-all-invoices", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      draft: "bg-muted text-muted-foreground",
      sent: "bg-yellow-500/20 text-yellow-500",
      paid: "bg-green-500/20 text-green-500",
      overdue: "bg-destructive/20 text-destructive",
      cancelled: "bg-muted text-muted-foreground",
    };
    return styles[status || "draft"] || styles.draft;
  };

  const totalPending = invoices?.filter(i => i.status !== "paid" && i.status !== "cancelled").reduce((sum, i) => sum + Number(i.total_amount || 0), 0) || 0;
  const totalPaid = invoices?.filter(i => i.status === "paid").reduce((sum, i) => sum + Number(i.total_amount || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Invoices & Billing</h1>
        <p className="text-muted-foreground">View and manage your invoices</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPending.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : invoices?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No invoices yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices?.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono">{invoice.invoice_number}</TableCell>
                    <TableCell>₹{Number(invoice.amount).toLocaleString()}</TableCell>
                    <TableCell>₹{Number(invoice.tax_amount).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">₹{Number(invoice.total_amount).toLocaleString()}</TableCell>
                    <TableCell><Badge className={getStatusBadge(invoice.status)}>{invoice.status}</Badge></TableCell>
                    <TableCell>{invoice.due_date ? format(new Date(invoice.due_date), "MMM d, yyyy") : "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                        {invoice.status !== "paid" && (
                          <Button size="sm" className="gap-1">
                            <CreditCard className="h-3 w-3" /> Pay
                          </Button>
                        )}
                      </div>
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
