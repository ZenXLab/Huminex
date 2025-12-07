import React, { useState } from "react";
import {
  Search,
  Plus,
  Upload,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Building,
  Edit,
  UserX,
  Eye,
  Calendar,
  Briefcase,
  Shield,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  UserPlus,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { InviteEmployeeModal } from "@/components/tenant/modals/InviteEmployeeModal";
import { toast } from "sonner";

const mockEmployees = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@acme.com", phone: "+91 98765 43210", role: "Engineering Manager", department: "Engineering", location: "Bangalore", status: "active", avatar: null, joinDate: "2023-03-15" },
  { id: 2, name: "John Smith", email: "john.s@acme.com", phone: "+91 98765 43211", role: "Senior Developer", department: "Engineering", location: "Mumbai", status: "active", avatar: null, joinDate: "2022-08-20" },
  { id: 3, name: "Mike Chen", email: "mike.c@acme.com", phone: "+91 98765 43212", role: "Product Manager", department: "Product", location: "Delhi", status: "probation", avatar: null, joinDate: "2024-11-01" },
  { id: 4, name: "Emily Davis", email: "emily.d@acme.com", phone: "+91 98765 43213", role: "UX Designer", department: "Design", location: "Bangalore", status: "active", avatar: null, joinDate: "2023-06-10" },
  { id: 5, name: "Alex Wilson", email: "alex.w@acme.com", phone: "+91 98765 43214", role: "Sales Executive", department: "Sales", location: "Chennai", status: "active", avatar: null, joinDate: "2023-01-05" },
  { id: 6, name: "Priya Sharma", email: "priya.s@acme.com", phone: "+91 98765 43215", role: "HR Manager", department: "HR", location: "Bangalore", status: "active", avatar: null, joinDate: "2022-04-18" },
  { id: 7, name: "Robert Brown", email: "robert.b@acme.com", phone: "+91 98765 43216", role: "Contractor", department: "Engineering", location: "Remote", status: "contractor", avatar: null, joinDate: "2024-09-01" },
  { id: 8, name: "Lisa Wang", email: "lisa.w@acme.com", phone: "+91 98765 43217", role: "Finance Lead", department: "Finance", location: "Mumbai", status: "active", avatar: null, joinDate: "2022-11-22" },
];

const TenantWorkforce: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<typeof mockEmployees[0] | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20";
      case "probation": return "bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20";
      case "contractor": return "bg-[#00C2FF]/10 text-[#00C2FF] border-[#00C2FF]/20";
      case "inactive": return "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20";
      default: return "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20";
    }
  };

  const filteredEmployees = mockEmployees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepartment === "all" || emp.department === selectedDepartment;
    const matchesStatus = selectedStatus === "all" || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map((e) => e.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleImportCSV = () => {
    toast.info("Import CSV: Upload your employee data file to bulk import");
  };

  const handleExport = () => {
    toast.success("Generating workforce report... Download will start shortly.");
  };

  const handleBulkEdit = () => {
    toast.info(`Editing ${selectedEmployees.length} employees...`);
  };

  const handleDeactivate = () => {
    toast.error(`Deactivating ${selectedEmployees.length} employees...`);
    setSelectedEmployees([]);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Workforce Directory</h1>
          <p className="text-sm text-[#6B7280]">
            <span className="font-medium text-[#0FB07A]">{mockEmployees.length}</span> employees in your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-gray-200 text-[#6B7280] gap-2 hover:border-[#005EEB]/30 hover-lift"
            onClick={handleImportCSV}
          >
            <Upload className="w-4 h-4" /> Import CSV
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-200 text-[#6B7280] gap-2 hover:border-[#005EEB]/30 hover-lift"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button 
            className="bg-[#005EEB] hover:bg-[#004ACC] gap-2 shadow-lg shadow-[#005EEB]/20" 
            onClick={() => setShowInviteModal(true)}
          >
            <UserPlus className="w-4 h-4" /> Invite Employee
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Employees", value: mockEmployees.length, icon: Users, color: "#005EEB" },
          { label: "Active", value: mockEmployees.filter(e => e.status === "active").length, icon: TrendingUp, color: "#0FB07A" },
          { label: "On Probation", value: mockEmployees.filter(e => e.status === "probation").length, icon: Clock, color: "#FFB020" },
          { label: "Contractors", value: mockEmployees.filter(e => e.status === "contractor").length, icon: Briefcase, color: "#00C2FF" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all hover-lift"
            style={{ boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}
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
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees by name, email, or role..."
            className="pl-10 bg-white border-gray-200"
          />
        </div>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[180px] bg-white border-gray-200">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Product">Product</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[150px] bg-white border-gray-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="probation">Probation</SelectItem>
            <SelectItem value="contractor">Contractor</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedEmployees.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#005EEB]/10 to-[#00C2FF]/5 rounded-xl border border-[#005EEB]/20 animate-scale-in">
          <span className="text-sm font-semibold text-[#005EEB]">
            {selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button 
              size="sm" 
              variant="outline" 
              className="border-[#005EEB]/30 text-[#005EEB] hover:bg-[#005EEB]/10"
              onClick={handleBulkEdit}
            >
              <Edit className="w-3 h-3 mr-1" /> Bulk Edit
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-[#E23E57]/30 text-[#E23E57] hover:bg-[#E23E57]/10"
              onClick={handleDeactivate}
            >
              <UserX className="w-3 h-3 mr-1" /> Deactivate
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F9FC] border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-[#F7F9FC] transition-colors">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedEmployees.includes(employee.id)}
                      onCheckedChange={() => toggleSelect(employee.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={employee.avatar || undefined} />
                        <AvatarFallback className="bg-[#005EEB]/10 text-[#005EEB] font-medium">
                          {employee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[#0F1E3A]">{employee.name}</p>
                        <p className="text-xs text-[#6B7280]">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#0F1E3A]">{employee.role}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{employee.department}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{employee.location}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn("capitalize", getStatusColor(employee.status))}>
                      {employee.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedEmployee(employee)}>
                          <Eye className="w-4 h-4 mr-2" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-[#E23E57]">
                          <UserX className="w-4 h-4 mr-2" /> Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-[#F7F9FC]">
          <p className="text-sm text-[#6B7280]">Showing 1-{filteredEmployees.length} of {mockEmployees.length}</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-[#005EEB] text-white border-[#005EEB]">1</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Employee Detail Slide-out */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedEmployee(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-[480px] bg-white shadow-2xl animate-slide-panel overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="font-semibold text-[#0F1E3A]">Employee Profile</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEmployee(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-[#005EEB]/10 text-[#005EEB] text-2xl font-semibold">
                    {selectedEmployee.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-[#0F1E3A]">{selectedEmployee.name}</h3>
                  <p className="text-[#6B7280]">{selectedEmployee.role}</p>
                  <Badge variant="outline" className={cn("mt-2 capitalize", getStatusColor(selectedEmployee.status))}>
                    {selectedEmployee.status}
                  </Badge>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-lg">
                  <Mail className="w-5 h-5 text-[#6B7280]" />
                  <span className="text-sm text-[#0F1E3A]">{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-lg">
                  <Phone className="w-5 h-5 text-[#6B7280]" />
                  <span className="text-sm text-[#0F1E3A]">{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-lg">
                  <MapPin className="w-5 h-5 text-[#6B7280]" />
                  <span className="text-sm text-[#0F1E3A]">{selectedEmployee.location}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-lg">
                  <Building className="w-5 h-5 text-[#6B7280]" />
                  <span className="text-sm text-[#0F1E3A]">{selectedEmployee.department}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-lg">
                  <Calendar className="w-5 h-5 text-[#6B7280]" />
                  <span className="text-sm text-[#0F1E3A]">Joined {selectedEmployee.joinDate}</span>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="employment">
                <TabsList className="w-full bg-[#F7F9FC]">
                  <TabsTrigger value="employment" className="flex-1">Employment</TabsTrigger>
                  <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
                  <TabsTrigger value="payroll" className="flex-1">Payroll</TabsTrigger>
                </TabsList>
                <TabsContent value="employment" className="mt-4 space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-[#005EEB]" />
                      <span className="text-sm font-medium text-[#0F1E3A]">Current Position</span>
                    </div>
                    <p className="text-sm text-[#6B7280]">{selectedEmployee.role}</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-[#0FB07A]" />
                      <span className="text-sm font-medium text-[#0F1E3A]">BGV Status</span>
                    </div>
                    <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20">Verified</Badge>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-[#FFB020]" />
                      <span className="text-sm font-medium text-[#0F1E3A]">Last Performance Review</span>
                    </div>
                    <p className="text-sm text-[#6B7280]">December 2024 - Rating: 4.2/5</p>
                  </div>
                </TabsContent>
                <TabsContent value="documents" className="mt-4">
                  <div className="space-y-2">
                    {["Offer Letter.pdf", "ID Proof.pdf", "Address Proof.pdf"].map((doc) => (
                      <div key={doc} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#6B7280]" />
                          <span className="text-sm text-[#0F1E3A]">{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[#005EEB]">View</Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="payroll" className="mt-4">
                  <div className="p-4 bg-[#F7F9FC] rounded-lg text-center">
                    <p className="text-sm text-[#6B7280]">Payroll details are confidential.</p>
                    <Button variant="link" className="text-[#005EEB]">Request Access</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      <InviteEmployeeModal open={showInviteModal} onOpenChange={setShowInviteModal} />
    </div>
  );
};

export default TenantWorkforce;
