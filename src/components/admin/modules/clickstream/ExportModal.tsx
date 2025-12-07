import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Mail, FileSpreadsheet, FileJson, FileText, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format as formatDate } from "date-fns";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: any[];
  stats: {
    totalEvents: number;
    uniqueSessions: number;
    clicks: number;
    pageViews: number;
  };
}

type ExportFormat = "csv" | "json" | "xlsx";
type DeliveryMethod = "download" | "email";

export const ExportModal = ({ open, onOpenChange, events, stats }: ExportModalProps) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("download");
  const [email, setEmail] = useState("");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeSessions, setIncludeSessions] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    if (deliveryMethod === "email" && !email) {
      toast.error("Please enter an email address");
      return;
    }

    if (!events?.length) {
      toast.error("No data to export");
      return;
    }

    setIsExporting(true);

    try {
      if (deliveryMethod === "download") {
        if (exportFormat === "csv") {
          exportCSV();
        } else if (exportFormat === "json") {
          exportJSON();
        } else {
          exportCSV();
          toast.info("Excel export uses CSV format for compatibility");
        }
        setExportComplete(true);
        toast.success(`Exported ${events.length} events as ${exportFormat.toUpperCase()}`);
      } else {
        toast.info("Email export feature coming soon. Using download instead.");
        exportCSV();
        setExportComplete(true);
      }
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Event Type",
      "Page URL", 
      "Element ID",
      "Element Text",
      "Element Class",
      "Session ID",
      "User ID",
      "Created At"
    ];

    if (includeMetadata) {
      headers.push("Metadata");
    }

    const csvRows = [
      headers.join(","),
      ...events.map(e => {
        const row = [
          e.event_type,
          `"${(e.page_url || '').replace(/"/g, '""')}"`,
          `"${(e.element_id || '').replace(/"/g, '""')}"`,
          `"${(e.element_text || '').replace(/"/g, '""')}"`,
          `"${(e.element_class || '').replace(/"/g, '""')}"`,
          e.session_id,
          e.user_id || '',
          new Date(e.created_at).toISOString()
        ];

        if (includeMetadata) {
          row.push(`"${JSON.stringify(e.metadata || {}).replace(/"/g, '""')}"`);
        }

        return row.join(",");
      })
    ];

    downloadFile(csvRows.join("\n"), "text/csv", "csv");
  };

  const exportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      stats: {
        totalEvents: stats.totalEvents,
        uniqueSessions: stats.uniqueSessions,
        clicks: stats.clicks,
        pageViews: stats.pageViews
      },
      events: events.map(e => ({
        eventType: e.event_type,
        pageUrl: e.page_url,
        elementId: e.element_id,
        elementText: e.element_text,
        elementClass: e.element_class,
        sessionId: e.session_id,
        userId: e.user_id,
        createdAt: e.created_at,
        ...(includeMetadata && { metadata: e.metadata })
      }))
    };

    downloadFile(JSON.stringify(data, null, 2), "application/json", "json");
  };

  const downloadFile = (content: string, mimeType: string, extension: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clickstream_export_${formatDate(new Date(), "yyyy-MM-dd_HH-mm")}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetState = () => {
    setExportComplete(false);
    setIsExporting(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetState();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Clickstream Data
          </DialogTitle>
          <DialogDescription>
            Export {stats.totalEvents.toLocaleString()} events from {stats.uniqueSessions.toLocaleString()} sessions
          </DialogDescription>
        </DialogHeader>

        {exportComplete ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Export Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your {exportFormat.toUpperCase()} file has been downloaded
              </p>
            </div>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        ) : (
          <>
            <div className="space-y-6 py-4">
              {/* Format Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Export Format</Label>
                <RadioGroup 
                  value={exportFormat} 
                  onValueChange={(v) => setExportFormat(v as ExportFormat)}
                  className="grid grid-cols-3 gap-3"
                >
                  <Label 
                    htmlFor="csv" 
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      exportFormat === "csv" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="csv" id="csv" className="sr-only" />
                    <FileSpreadsheet className="h-6 w-6" />
                    <span className="text-sm font-medium">CSV</span>
                  </Label>
                  <Label 
                    htmlFor="json" 
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      exportFormat === "json" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="json" id="json" className="sr-only" />
                    <FileJson className="h-6 w-6" />
                    <span className="text-sm font-medium">JSON</span>
                  </Label>
                  <Label 
                    htmlFor="xlsx" 
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      exportFormat === "xlsx" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="xlsx" id="xlsx" className="sr-only" />
                    <FileText className="h-6 w-6" />
                    <span className="text-sm font-medium">Excel</span>
                  </Label>
                </RadioGroup>
              </div>

              {/* Delivery Method */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Delivery Method</Label>
                <RadioGroup 
                  value={deliveryMethod} 
                  onValueChange={(v) => setDeliveryMethod(v as DeliveryMethod)}
                  className="space-y-2"
                >
                  <Label 
                    htmlFor="download" 
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      deliveryMethod === "download" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="download" id="download" />
                    <Download className="h-4 w-4" />
                    <div>
                      <span className="font-medium">Download Now</span>
                      <p className="text-xs text-muted-foreground">Download file directly to your device</p>
                    </div>
                  </Label>
                  <Label 
                    htmlFor="email" 
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      deliveryMethod === "email" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="email" id="email" />
                    <Mail className="h-4 w-4" />
                    <div>
                      <span className="font-medium">Send to Email</span>
                      <p className="text-xs text-muted-foreground">Receive export via email</p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              {/* Email Input */}
              {deliveryMethod === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="email-input">Email Address</Label>
                  <Input 
                    id="email-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              {/* Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Include in Export</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="metadata" 
                      checked={includeMetadata}
                      onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
                    />
                    <Label htmlFor="metadata" className="text-sm cursor-pointer">Event metadata (device info, etc.)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="sessions" 
                      checked={includeSessions}
                      onCheckedChange={(checked) => setIncludeSessions(checked as boolean)}
                    />
                    <Label htmlFor="sessions" className="text-sm cursor-pointer">Session grouping</Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={isExporting}>
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    {deliveryMethod === "download" ? <Download className="h-4 w-4 mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                    {deliveryMethod === "download" ? "Download" : "Send Email"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
