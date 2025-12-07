import React, { useState } from "react";
import { 
  Download, 
  FileText, 
  Database, 
  Users, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FolderArchive,
  Shield,
  FileSpreadsheet,
  FileJson
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ExportModule {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  recordCount: number;
  selected: boolean;
}

const exportModules: ExportModule[] = [
  { id: "employees", name: "Employees", description: "All employee records and profiles", icon: Users, recordCount: 67, selected: true },
  { id: "attendance", name: "Attendance", description: "Attendance logs and timesheets", icon: Calendar, recordCount: 12450, selected: true },
  { id: "payroll", name: "Payroll", description: "Payroll runs and salary data", icon: FileSpreadsheet, recordCount: 804, selected: true },
  { id: "leaves", name: "Leaves", description: "Leave requests and balances", icon: Clock, recordCount: 342, selected: false },
  { id: "documents", name: "Documents", description: "Uploaded documents and files", icon: FileText, recordCount: 156, selected: false },
  { id: "compliance", name: "Compliance", description: "Compliance records and audits", icon: Shield, recordCount: 89, selected: false }
];

const recentExports = [
  { id: "1", name: "Full Data Export", format: "CSV", size: "45.2 MB", date: "Jan 15, 2024", status: "completed" },
  { id: "2", name: "Employees Export", format: "JSON", size: "2.1 MB", date: "Jan 10, 2024", status: "completed" },
  { id: "3", name: "Attendance Report", format: "Excel", size: "12.8 MB", date: "Jan 5, 2024", status: "completed" },
  { id: "4", name: "Payroll Data", format: "CSV", size: "8.4 MB", date: "Dec 28, 2023", status: "expired" }
];

const TenantDataExport: React.FC = () => {
  const [modules, setModules] = useState(exportModules);
  const [exportFormat, setExportFormat] = useState("csv");
  const [dateRange, setDateRange] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const selectedCount = modules.filter(m => m.selected).length;
  const totalRecords = modules.filter(m => m.selected).reduce((acc, m) => acc + m.recordCount, 0);

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m => 
      m.id === id ? { ...m, selected: !m.selected } : m
    ));
  };

  const selectAll = () => {
    setModules(prev => prev.map(m => ({ ...m, selected: true })));
  };

  const deselectAll = () => {
    setModules(prev => prev.map(m => ({ ...m, selected: false })));
  };

  const handleExport = async () => {
    if (selectedCount === 0) {
      toast.error("Please select at least one module to export");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          toast.success("Export completed! Your download will start shortly.");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleDownload = (exportId: string) => {
    toast.success("Download started...");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20">Ready</Badge>;
      case "processing":
        return <Badge className="bg-[#005EEB]/10 text-[#005EEB] border-[#005EEB]/20">Processing</Badge>;
      case "expired":
        return <Badge className="bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Data Export</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Export your organization data in various formats
          </p>
        </div>
        <Badge className="bg-[#005EEB]/10 text-[#005EEB]">
          GDPR Compliant
        </Badge>
      </div>

      {/* Export Configuration */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-[#0F1E3A] mb-4">Configure Export</h3>
        
        {/* Module Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-[#0F1E3A]">Select Modules</Label>
            <div className="flex items-center gap-2">
              <Button variant="link" size="sm" onClick={selectAll} className="text-[#005EEB] p-0 h-auto">
                Select All
              </Button>
              <span className="text-[#6B7280]">|</span>
              <Button variant="link" size="sm" onClick={deselectAll} className="text-[#6B7280] p-0 h-auto">
                Deselect All
              </Button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((module) => (
              <label
                key={module.id}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  module.selected 
                    ? "border-[#005EEB] bg-[#005EEB]/5" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Checkbox
                  checked={module.selected}
                  onCheckedChange={() => toggleModule(module.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <module.icon className={`w-4 h-4 ${module.selected ? "text-[#005EEB]" : "text-[#6B7280]"}`} />
                    <span className="text-sm font-medium text-[#0F1E3A]">{module.name}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">{module.description}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">{module.recordCount.toLocaleString()} records</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#0F1E3A]">Export Format</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="csv" />
                <FileSpreadsheet className="w-4 h-4 text-[#0FB07A]" />
                <span className="text-sm">CSV</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="excel" />
                <FileSpreadsheet className="w-4 h-4 text-[#0FB07A]" />
                <span className="text-sm">Excel</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="json" />
                <FileJson className="w-4 h-4 text-[#FFB020]" />
                <span className="text-sm">JSON</span>
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#0F1E3A]">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Export Summary & Action */}
        <div className="bg-[#F7F9FC] rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#0F1E3A]">
                {selectedCount} module{selectedCount !== 1 ? "s" : ""} selected
              </p>
              <p className="text-xs text-[#6B7280]">
                Approximately {totalRecords.toLocaleString()} records will be exported
              </p>
            </div>
            <Button 
              onClick={handleExport}
              disabled={isExporting || selectedCount === 0}
              className="bg-[#005EEB] hover:bg-[#0047B3] gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Start Export
                </>
              )}
            </Button>
          </div>

          {isExporting && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
                <span>Exporting data...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2 [&>div]:bg-[#005EEB]" />
            </div>
          )}
        </div>
      </div>

      {/* Data Retention Notice */}
      <div className="bg-[#FFB020]/10 border border-[#FFB020]/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#FFB020] mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-[#0F1E3A]">Data Retention Policy</h4>
          <p className="text-sm text-[#6B7280] mt-1">
            Exported files are available for download for 7 days. After that, you'll need to generate a new export.
            All exports are encrypted and comply with GDPR regulations.
          </p>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-[#0F1E3A]">Recent Exports</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {recentExports.map((exportItem) => (
            <div key={exportItem.id} className="p-4 hover:bg-[#F7F9FC]/50 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#F7F9FC] flex items-center justify-center">
                    <FolderArchive className="w-5 h-5 text-[#6B7280]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#0F1E3A]">{exportItem.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mt-1">
                      <span>{exportItem.format}</span>
                      <span>•</span>
                      <span>{exportItem.size}</span>
                      <span>•</span>
                      <span>{exportItem.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(exportItem.status)}
                  {exportItem.status === "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(exportItem.id)}
                      className="gap-1 border-gray-200"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GDPR Request */}
      <div className="bg-gradient-to-r from-[#0F1E3A] to-[#1a2e50] rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">GDPR Data Request</h3>
              <p className="text-white/70 text-sm">Request a complete copy of all your organization's data</p>
            </div>
          </div>
          <Button className="bg-white text-[#0F1E3A] hover:bg-white/90">
            Submit Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TenantDataExport;
