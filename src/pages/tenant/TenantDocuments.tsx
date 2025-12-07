import React, { useState } from "react";
import { FileText, Upload, FolderOpen, Download, Search, Filter, MoreVertical, File, Image, FileSpreadsheet, Presentation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const documents = [
  { id: 1, name: "Employee Handbook 2025.pdf", type: "pdf", size: "2.4 MB", folder: "Policies", uploadedBy: "HR Admin", date: "Dec 1, 2025" },
  { id: 2, name: "Leave Policy.docx", type: "doc", size: "156 KB", folder: "Policies", uploadedBy: "HR Admin", date: "Nov 15, 2025" },
  { id: 3, name: "Payroll Template.xlsx", type: "excel", size: "89 KB", folder: "Templates", uploadedBy: "Finance Team", date: "Nov 10, 2025" },
  { id: 4, name: "Company Logo.png", type: "image", size: "1.2 MB", folder: "Brand Assets", uploadedBy: "Marketing", date: "Oct 5, 2025" },
  { id: 5, name: "Q3 Presentation.pptx", type: "ppt", size: "5.8 MB", folder: "Reports", uploadedBy: "CEO Office", date: "Sep 30, 2025" },
  { id: 6, name: "NDA Template.pdf", type: "pdf", size: "245 KB", folder: "Legal", uploadedBy: "Legal Team", date: "Sep 15, 2025" },
];

const folders = [
  { name: "Policies", count: 12, color: "#005EEB" },
  { name: "Templates", count: 8, color: "#0FB07A" },
  { name: "Brand Assets", count: 24, color: "#FFB020" },
  { name: "Reports", count: 16, color: "#8B5CF6" },
  { name: "Legal", count: 6, color: "#E23E57" },
];

const TenantDocuments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="w-5 h-5 text-[#E23E57]" />;
      case "doc": return <FileText className="w-5 h-5 text-[#005EEB]" />;
      case "excel": return <FileSpreadsheet className="w-5 h-5 text-[#0FB07A]" />;
      case "image": return <Image className="w-5 h-5 text-[#FFB020]" />;
      case "ppt": return <Presentation className="w-5 h-5 text-[#FF6B35]" />;
      default: return <File className="w-5 h-5 text-[#6B7280]" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Documents</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage company documents, policies, and templates</p>
        </div>
        <Button className="bg-[#005EEB] hover:bg-[#004ACC] gap-2">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {folders.map((folder) => (
          <Card key={folder.name} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${folder.color}15` }}>
                  <FolderOpen className="w-5 h-5" style={{ color: folder.color }} />
                </div>
                <div>
                  <p className="font-medium text-[#0F1E3A] text-sm">{folder.name}</p>
                  <p className="text-xs text-[#6B7280]">{folder.count} files</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documents List */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b bg-[#F7F9FC]/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Documents</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 bg-white"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F9FC]">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Name</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Folder</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Size</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Uploaded By</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Date</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-100 hover:bg-[#F7F9FC]/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.type)}
                        <span className="font-medium text-[#0F1E3A]">{doc.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">{doc.folder}</Badge>
                    </td>
                    <td className="p-4 text-sm text-[#6B7280]">{doc.size}</td>
                    <td className="p-4 text-sm text-[#6B7280]">{doc.uploadedBy}</td>
                    <td className="p-4 text-sm text-[#6B7280]">{doc.date}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDocuments;
