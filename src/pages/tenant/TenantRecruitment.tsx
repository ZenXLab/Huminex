import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  GripVertical,
  MoreHorizontal,
  FileText,
  Send,
  Star,
  ArrowUpRight,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const mockJobs = [
  { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "Bangalore", type: "Full-time", salary: "₹18-25 LPA", posted: "2 days ago", applications: 45, status: "active" },
  { id: 2, title: "Product Manager", department: "Product", location: "Mumbai", type: "Full-time", salary: "₹22-30 LPA", posted: "5 days ago", applications: 32, status: "active" },
  { id: 3, title: "UX Designer", department: "Design", location: "Remote", type: "Full-time", salary: "₹12-18 LPA", posted: "1 week ago", applications: 28, status: "active" },
  { id: 4, title: "Sales Executive", department: "Sales", location: "Delhi", type: "Full-time", salary: "₹8-12 LPA", posted: "2 weeks ago", applications: 56, status: "paused" },
];

const mockCandidates = {
  applied: [
    { id: 1, name: "Rahul Sharma", role: "Senior Frontend Developer", score: 85, applied: "2 hours ago" },
    { id: 2, name: "Priya Patel", role: "Senior Frontend Developer", score: 78, applied: "5 hours ago" },
    { id: 3, name: "Amit Kumar", role: "Product Manager", score: 92, applied: "1 day ago" },
  ],
  screening: [
    { id: 4, name: "Neha Singh", role: "UX Designer", score: 88, applied: "3 days ago" },
    { id: 5, name: "Vikram Rao", role: "Senior Frontend Developer", score: 75, applied: "4 days ago" },
  ],
  interview: [
    { id: 6, name: "Anjali Gupta", role: "Product Manager", score: 90, interview: "Tomorrow, 10:00 AM" },
    { id: 7, name: "Karthik M", role: "Senior Frontend Developer", score: 82, interview: "Jan 20, 2:00 PM" },
  ],
  offer: [
    { id: 8, name: "Deepak Joshi", role: "UX Designer", score: 95, offerSent: "Jan 15" },
  ],
};

const TenantRecruitment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pipeline");

  const getScoreColor = (score: number) => {
    if (score >= 85) return "#0FB07A";
    if (score >= 70) return "#FFB020";
    return "#E23E57";
  };

  const handlePostJob = () => {
    toast.success("Opening job posting form...");
  };

  const handleMoveCandidate = (name: string, fromStage: string, toStage: string) => {
    toast.success(`Moved ${name} from ${fromStage} to ${toStage}`);
  };

  const handleCandidateClick = (candidate: typeof mockCandidates.applied[0]) => {
    toast.info(`Opening profile for ${candidate.name}`);
  };

  const CandidateCard = ({ candidate, stage }: { candidate: typeof mockCandidates.applied[0] & { interview?: string; offerSent?: string }; stage: string }) => (
    <button
      onClick={() => handleCandidateClick(candidate)}
      className="w-full p-4 bg-white rounded-xl border border-gray-100 hover:border-[#005EEB]/30 hover:shadow-lg transition-all cursor-pointer group text-left animate-fade-up"
    >
      <div className="flex items-start gap-3">
        <div className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-[#6B7280]" />
        </div>
        <Avatar className="w-11 h-11">
          <AvatarFallback className="bg-gradient-to-br from-[#005EEB]/15 to-[#00C2FF]/10 text-[#005EEB] text-sm font-semibold">
            {candidate.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#0F1E3A] truncate group-hover:text-[#005EEB] transition-colors">{candidate.name}</p>
          <p className="text-xs text-[#6B7280] truncate">{candidate.role}</p>
          {candidate.interview && (
            <p className="text-xs text-[#005EEB] mt-1.5 flex items-center gap-1 font-medium">
              <Calendar className="w-3 h-3" /> {candidate.interview}
            </p>
          )}
          {candidate.offerSent && (
            <Badge className="mt-1.5 bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20 text-[10px] font-semibold">
              Offer sent {candidate.offerSent}
            </Badge>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: `${getScoreColor(candidate.score)}15`,
            color: getScoreColor(candidate.score),
          }}
        >
          {candidate.score}
        </div>
      </div>
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Talent Acquisition</h1>
          <p className="text-sm text-[#6B7280]">Manage job postings and candidate pipeline</p>
        </div>
        <Button 
          className="bg-[#005EEB] hover:bg-[#004ACC] gap-2 shadow-lg shadow-[#005EEB]/20"
          onClick={handlePostJob}
        >
          <Plus className="w-4 h-4" /> Post New Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Open Positions", value: 8, icon: Briefcase, color: "#005EEB" },
          { label: "Total Candidates", value: 156, icon: Users, color: "#00C2FF" },
          { label: "Interviews This Week", value: 12, icon: Calendar, color: "#FFB020" },
          { label: "Offers Pending", value: 3, icon: FileText, color: "#0FB07A" },
        ].map((stat, i) => (
          <button
            key={stat.label}
            onClick={() => toast.info(`${stat.label}: ${stat.value}`)}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-[#005EEB]/30 transition-all hover-lift text-left animate-fade-up"
            style={{ 
              boxShadow: "0 6px 18px rgba(16,24,40,0.06)",
              animationDelay: `${i * 100}ms`
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">{stat.value}</p>
                <p className="text-xs text-[#6B7280]">{stat.label}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#F7F9FC]">
          <TabsTrigger value="pipeline">Candidate Pipeline</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-4">
          {/* Kanban Board */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { key: "applied", label: "Applied", count: mockCandidates.applied.length, color: "#6B7280" },
              { key: "screening", label: "Screening", count: mockCandidates.screening.length, color: "#00C2FF" },
              { key: "interview", label: "Interview", count: mockCandidates.interview.length, color: "#FFB020" },
              { key: "offer", label: "Offer", count: mockCandidates.offer.length, color: "#0FB07A" },
            ].map((stage) => (
              <div key={stage.key} className="bg-[#F7F9FC] rounded-xl p-4 min-h-[500px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    <h3 className="font-semibold text-[#0F1E3A]">{stage.label}</h3>
                    <Badge variant="outline" className="text-xs">{stage.count}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Plus className="w-4 h-4 text-[#6B7280]" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {mockCandidates[stage.key as keyof typeof mockCandidates].map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} stage={stage.key} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="mt-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs..."
                    className="pl-10 bg-[#F7F9FC] border-gray-200"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" /> Filter
                </Button>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-[#F7F9FC] border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Applications</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-[#0F1E3A]">{job.title}</p>
                        <p className="text-xs text-[#6B7280]">{job.type} • {job.salary}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#6B7280]">{job.department}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-[#6B7280]">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#005EEB]" />
                        <span className="font-medium text-[#0F1E3A]">{job.applications}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          job.status === "active"
                            ? "bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20"
                            : "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20"
                        )}
                      >
                        {job.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem><Send className="w-4 h-4 mr-2" /> Share</DropdownMenuItem>
                          <DropdownMenuItem className="text-[#E23E57]"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="interviews" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {mockCandidates.interview.map((candidate) => (
              <div
                key={candidate.id}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                style={{ boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-[#005EEB]/10 text-[#005EEB]">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#0F1E3A]">{candidate.name}</h4>
                    <p className="text-sm text-[#6B7280]">{candidate.role}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-[#005EEB]">
                      <Calendar className="w-4 h-4" />
                      <span>{candidate.interview}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-[#005EEB] hover:bg-[#004ACC] gap-1 shadow-lg shadow-[#005EEB]/20"
                    onClick={() => toast.success(`Joining meeting with ${candidate.name}`)}
                  >
                    <Video className="w-3 h-3" /> Join Meeting
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantRecruitment;
