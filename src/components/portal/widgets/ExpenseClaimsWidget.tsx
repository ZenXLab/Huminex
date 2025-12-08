import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Clock, CheckCircle2, XCircle } from "lucide-react";

export const ExpenseClaimsWidget = () => {
  // Mock data - would come from API
  const claims = [
    { id: 1, description: "Client Lunch", amount: 2500, status: "pending", date: "Dec 5" },
    { id: 2, description: "Travel - Mumbai", amount: 8500, status: "approved", date: "Dec 2" },
    { id: 3, description: "Office Supplies", amount: 1200, status: "rejected", date: "Nov 28" },
  ];

  const totals = {
    pending: 2500,
    approved: 8500,
    rejected: 1200,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-600 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-600 border-0"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-0"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            Expense Claims
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <Plus className="w-3 h-3" />
            New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Pending Amount */}
        <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">Pending Reimbursement</p>
          <p className="text-xl font-bold text-yellow-600">₹{totals.pending.toLocaleString()}</p>
        </div>

        {/* Recent Claims */}
        <div className="space-y-2">
          {claims.map((claim) => (
            <div key={claim.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <div>
                <p className="text-sm font-medium text-foreground">{claim.description}</p>
                <p className="text-xs text-muted-foreground">{claim.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">₹{claim.amount.toLocaleString()}</p>
                {getStatusBadge(claim.status)}
              </div>
            </div>
          ))}
        </div>

        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          View All Claims →
        </Button>
      </CardContent>
    </Card>
  );
};
