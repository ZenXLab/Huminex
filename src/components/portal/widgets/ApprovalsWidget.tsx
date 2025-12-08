import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Check, X, Calendar, CreditCard, FileText } from "lucide-react";

export const ApprovalsWidget = () => {
  // Mock data - would come from API
  const approvals = [
    { 
      id: 1, 
      type: "leave", 
      title: "Leave Request", 
      requester: "Priya Sharma",
      details: "Casual Leave: Dec 15-17",
      icon: Calendar,
      urgent: false,
    },
    { 
      id: 2, 
      type: "expense", 
      title: "Expense Claim", 
      requester: "Rahul Verma",
      details: "₹3,500 - Client Travel",
      icon: CreditCard,
      urgent: true,
    },
    { 
      id: 3, 
      type: "document", 
      title: "Document Approval", 
      requester: "Amit Kumar",
      details: "Project Proposal v2",
      icon: FileText,
      urgent: false,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "leave": return "bg-purple-500/20 text-purple-600";
      case "expense": return "bg-green-500/20 text-green-600";
      case "document": return "bg-blue-500/20 text-blue-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            Pending Approvals
          </CardTitle>
          <Badge variant="destructive" className="text-xs">
            {approvals.length} pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {approvals.map((approval) => {
          const Icon = approval.icon;
          return (
            <div 
              key={approval.id} 
              className={`p-3 rounded-lg border ${approval.urgent ? 'border-orange-500/30 bg-orange-500/5' : 'border-border/50 bg-muted/30'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(approval.type)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{approval.title}</p>
                    {approval.urgent && (
                      <Badge variant="destructive" className="text-[10px] px-1 py-0">Urgent</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{approval.requester}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{approval.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/30">
                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs border-red-500/30 text-red-600 hover:bg-red-500/10">
                  <X className="w-3 h-3 mr-1" />
                  Reject
                </Button>
                <Button size="sm" className="flex-1 h-7 text-xs bg-green-500 hover:bg-green-600 text-white">
                  <Check className="w-3 h-3 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          );
        })}

        <Button variant="link" size="sm" className="h-auto p-0 text-xs w-full">
          View All Approvals →
        </Button>
      </CardContent>
    </Card>
  );
};
