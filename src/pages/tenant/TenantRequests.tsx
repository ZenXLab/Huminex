import React from "react";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  User,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const requests = [
  {
    id: "REQ-001",
    type: "Leave Request",
    category: "leave",
    description: "Annual leave - Family vacation",
    submittedDate: "2024-01-15",
    status: "approved",
    approver: "John Smith",
    approvedDate: "2024-01-16",
    duration: "5 days"
  },
  {
    id: "REQ-002",
    type: "Expense Claim",
    category: "expense",
    description: "Client meeting travel expenses",
    submittedDate: "2024-01-18",
    status: "pending",
    approver: "Sarah Johnson",
    amount: "$245.00"
  },
  {
    id: "REQ-003",
    type: "Equipment Request",
    category: "equipment",
    description: "New laptop for development work",
    submittedDate: "2024-01-17",
    status: "in_review",
    approver: "IT Department",
    priority: "high"
  },
  {
    id: "REQ-004",
    type: "Work From Home",
    category: "wfh",
    description: "WFH request for next week",
    submittedDate: "2024-01-19",
    status: "pending",
    approver: "Team Lead",
    duration: "5 days"
  },
  {
    id: "REQ-005",
    type: "Training Request",
    category: "training",
    description: "AWS Certification Course",
    submittedDate: "2024-01-12",
    status: "rejected",
    approver: "HR Manager",
    rejectedDate: "2024-01-14",
    reason: "Budget constraints"
  }
];

const stats = [
  { label: "Total Requests", value: "24", icon: FileText, color: "bg-[#005EEB]", trend: "+3 this month" },
  { label: "Pending", value: "5", icon: Clock, color: "bg-[#FFB020]", trend: "Awaiting approval" },
  { label: "Approved", value: "16", icon: CheckCircle2, color: "bg-[#0FB07A]", trend: "This quarter" },
  { label: "Rejected", value: "3", icon: XCircle, color: "bg-[#E23E57]", trend: "Review feedback" }
];

const requestTypes = [
  { id: "leave", label: "Leave Request", icon: Calendar },
  { id: "expense", label: "Expense Claim", icon: FileText },
  { id: "equipment", label: "Equipment", icon: FileText },
  { id: "wfh", label: "Work From Home", icon: FileText },
  { id: "training", label: "Training", icon: FileText }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20">Approved</Badge>;
    case "pending":
      return <Badge className="bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20">Pending</Badge>;
    case "in_review":
      return <Badge className="bg-[#005EEB]/10 text-[#005EEB] border-[#005EEB]/20">In Review</Badge>;
    case "rejected":
      return <Badge className="bg-[#E23E57]/10 text-[#E23E57] border-[#E23E57]/20">Rejected</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const TenantRequests: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">My Requests</h1>
          <p className="text-sm text-[#6B7280] mt-1">Track and manage your submitted requests</p>
        </div>
        <Button className="bg-[#005EEB] hover:bg-[#0047B3] gap-2 shadow-lg shadow-[#005EEB]/20">
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color}/10 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className="text-xs text-[#6B7280]">{stat.trend}</span>
            </div>
            <div className="text-2xl font-bold text-[#0F1E3A]">{stat.value}</div>
            <div className="text-sm text-[#6B7280] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-[#0F1E3A] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {requestTypes.map((type) => (
            <button
              key={type.id}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-[#005EEB]/30 hover:bg-[#005EEB]/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F7F9FC] group-hover:bg-[#005EEB]/10 flex items-center justify-center transition-colors">
                <type.icon className="w-5 h-5 text-[#6B7280] group-hover:text-[#005EEB] transition-colors" />
              </div>
              <span className="text-xs font-medium text-[#6B7280] group-hover:text-[#005EEB] transition-colors text-center">
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <Input
              placeholder="Search requests..."
              className="pl-10 border-gray-200 focus:border-[#005EEB] rounded-lg"
            />
          </div>
          <Button variant="outline" className="gap-2 border-gray-200">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7F9FC]">
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Request ID</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Type</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Description</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Approver</th>
                <th className="text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-[#F7F9FC]/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm font-medium text-[#005EEB]">{request.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-[#0F1E3A]">{request.type}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#6B7280] max-w-xs truncate block">{request.description}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#6B7280]">{request.submittedDate}</span>
                  </td>
                  <td className="px-5 py-4">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#F7F9FC] flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-[#6B7280]" />
                      </div>
                      <span className="text-sm text-[#6B7280]">{request.approver}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#6B7280] hover:text-[#005EEB]">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-[#6B7280]">Showing 5 of 24 requests</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-200">Previous</Button>
            <Button variant="outline" size="sm" className="border-gray-200">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantRequests;
