import React from "react";
import { 
  Headphones, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MessageSquare,
  Phone,
  Video,
  Mail,
  ExternalLink,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const tickets = [
  {
    id: "TKT-001",
    subject: "Payroll Integration Issue",
    category: "Technical Support",
    priority: "high",
    status: "in_progress",
    assignee: "ATLAS Support",
    createdAt: "2024-01-18",
    lastUpdate: "2 hours ago",
    messages: 4
  },
  {
    id: "TKT-002",
    subject: "Request for Custom Report",
    category: "Feature Request",
    priority: "medium",
    status: "pending",
    assignee: "Product Team",
    createdAt: "2024-01-17",
    lastUpdate: "1 day ago",
    messages: 2
  },
  {
    id: "TKT-003",
    subject: "SSO Configuration Help",
    category: "Configuration",
    priority: "low",
    status: "resolved",
    assignee: "ATLAS Support",
    createdAt: "2024-01-15",
    lastUpdate: "3 days ago",
    messages: 6
  },
  {
    id: "TKT-004",
    subject: "Data Migration Assistance",
    category: "Onboarding",
    priority: "high",
    status: "pending",
    assignee: "Onboarding Team",
    createdAt: "2024-01-19",
    lastUpdate: "30 mins ago",
    messages: 1
  }
];

const stats = [
  { label: "Open Tickets", value: "3", icon: AlertCircle, color: "bg-[#FFB020]", change: "-1 from last week" },
  { label: "In Progress", value: "1", icon: Clock, color: "bg-[#005EEB]", change: "Being handled" },
  { label: "Resolved", value: "12", icon: CheckCircle2, color: "bg-[#0FB07A]", change: "+4 this month" },
  { label: "Avg Response", value: "2h", icon: TrendingUp, color: "bg-[#8B5CF6]", change: "Under SLA" }
];

const supportChannels = [
  { id: "chat", label: "Live Chat", icon: MessageSquare, available: true, waitTime: "< 2 min" },
  { id: "call", label: "Phone Support", icon: Phone, available: true, waitTime: "< 5 min" },
  { id: "video", label: "Video Call", icon: Video, available: false, waitTime: "Schedule" },
  { id: "email", label: "Email", icon: Mail, available: true, waitTime: "< 4 hours" }
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-[#E23E57]/10 text-[#E23E57] border-[#E23E57]/20">High</Badge>;
    case "medium":
      return <Badge className="bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20">Medium</Badge>;
    case "low":
      return <Badge className="bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20">Low</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "resolved":
      return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20">Resolved</Badge>;
    case "in_progress":
      return <Badge className="bg-[#005EEB]/10 text-[#005EEB] border-[#005EEB]/20">In Progress</Badge>;
    case "pending":
      return <Badge className="bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20">Pending</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const TenantManagedOps: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Managed Operations</h1>
          <p className="text-sm text-[#6B7280] mt-1">Get support and manage your service requests</p>
        </div>
        <Button className="bg-[#005EEB] hover:bg-[#0047B3] gap-2 shadow-lg shadow-[#005EEB]/20">
          <Plus className="w-4 h-4" />
          New Support Ticket
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
            </div>
            <div className="text-2xl font-bold text-[#0F1E3A]">{stat.value}</div>
            <div className="text-sm text-[#6B7280] mt-1">{stat.label}</div>
            <div className="text-xs text-[#9CA3AF] mt-2">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Support Channels */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#0F1E3A]">Quick Support Channels</h3>
          <Badge className="bg-[#0FB07A]/10 text-[#0FB07A]">Premium Support</Badge>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {supportChannels.map((channel) => (
            <button
              key={channel.id}
              className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all ${
                channel.available 
                  ? "border-gray-100 hover:border-[#005EEB]/30 hover:bg-[#005EEB]/5 cursor-pointer" 
                  : "border-gray-100 bg-[#F7F9FC] opacity-60 cursor-not-allowed"
              }`}
              disabled={!channel.available}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                channel.available ? "bg-[#005EEB]/10" : "bg-[#F7F9FC]"
              }`}>
                <channel.icon className={`w-6 h-6 ${channel.available ? "text-[#005EEB]" : "text-[#6B7280]"}`} />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-[#0F1E3A]">{channel.label}</div>
                <div className="text-xs text-[#6B7280] mt-1">
                  {channel.available ? (
                    <span className="text-[#0FB07A]">Available • {channel.waitTime}</span>
                  ) : (
                    channel.waitTime
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SLA Status */}
      <div className="bg-gradient-to-r from-[#005EEB] to-[#00C2FF] rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">SLA Performance</h3>
            <p className="text-white/80 text-sm">Your support SLA compliance for this month</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">98.5%</div>
              <div className="text-xs text-white/70 mt-1">Response Time SLA</div>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-xs text-white/70 mt-1">Resolution SLA</div>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold">4.8/5</div>
              <div className="text-xs text-white/70 mt-1">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-3 flex-1">
            <h3 className="text-sm font-semibold text-[#0F1E3A]">Support Tickets</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                placeholder="Search tickets..."
                className="pl-10 border-gray-200 focus:border-[#005EEB] rounded-lg"
              />
            </div>
            <Button variant="outline" className="gap-2 border-gray-200">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7F9FC]">
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Ticket</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Category</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Priority</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Assignee</th>
                <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Last Update</th>
                <th className="text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-[#F7F9FC]/50 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <span className="font-mono text-sm font-medium text-[#005EEB]">{ticket.id}</span>
                      <p className="text-sm text-[#0F1E3A] mt-1 max-w-xs truncate">{ticket.subject}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#6B7280]">{ticket.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    {getPriorityBadge(ticket.priority)}
                  </td>
                  <td className="px-5 py-4">
                    {getStatusBadge(ticket.status)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#005EEB]/10 flex items-center justify-center">
                        <Headphones className="w-3.5 h-3.5 text-[#005EEB]" />
                      </div>
                      <span className="text-sm text-[#6B7280]">{ticket.assignee}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#6B7280]">{ticket.lastUpdate}</span>
                      {ticket.messages > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {ticket.messages}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm" className="gap-1 text-[#005EEB] hover:text-[#0047B3]">
                      View
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-[#6B7280]">Showing 4 tickets</span>
          <Button variant="link" className="text-[#005EEB] gap-1">
            View All Tickets
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TenantManagedOps;
