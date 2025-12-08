import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export const InvoicesWidget = () => {
  // Mock data - would come from API
  const invoiceStats = {
    pending: { count: 5, amount: 245000 },
    overdue: { count: 2, amount: 85000 },
    paid: { count: 12, amount: 520000 },
  };

  const recentInvoices = [
    { id: "INV-2024-001", client: "TechCorp Ltd", amount: 45000, status: "pending", dueDate: "Dec 15" },
    { id: "INV-2024-002", client: "StartupXYZ", amount: 28000, status: "overdue", dueDate: "Dec 1" },
    { id: "INV-2024-003", client: "Enterprise Co", amount: 125000, status: "paid", dueDate: "Nov 28" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/20 text-green-600 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Paid</Badge>;
      case "overdue":
        return <Badge className="bg-red-500/20 text-red-600 border-0"><AlertCircle className="w-3 h-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-0"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Invoices Overview
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <Download className="w-3 h-3" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-yellow-600">{invoiceStats.pending.count}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-[10px] text-muted-foreground">₹{(invoiceStats.pending.amount / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-red-500/10 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-red-600">{invoiceStats.overdue.count}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
            <p className="text-[10px] text-muted-foreground">₹{(invoiceStats.overdue.amount / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-green-600">{invoiceStats.paid.count}</p>
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="text-[10px] text-muted-foreground">₹{(invoiceStats.paid.amount / 1000).toFixed(0)}K</p>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Recent Invoices</p>
          <div className="space-y-2">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{invoice.id}</p>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">{invoice.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">₹{invoice.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Due: {invoice.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="link" size="sm" className="h-auto p-0 text-xs w-full">
          View All Invoices →
        </Button>
      </CardContent>
    </Card>
  );
};
