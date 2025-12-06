import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Folder, FileText, Image, File, Upload, Download, Trash2, 
  Search, Grid, List, Home, ChevronRight
} from "lucide-react";
import { format } from "date-fns";

interface PortalFilesProps {
  userId?: string;
}

export const PortalFiles = ({ userId }: PortalFilesProps) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDragOver, setIsDragOver] = useState(false);

  const { data: files, isLoading } = useQuery({
    queryKey: ["portal-files", userId, searchTerm],
    queryFn: async () => {
      if (!userId) return [];
      let query = supabase
        .from("client_files")
        .select("*, projects(name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!userId) throw new Error("Not authenticated");
      
      const filePath = `${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("client-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("client_files").insert({
        user_id: userId,
        name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
      });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portal-files"] });
      toast.success("File uploaded successfully");
    },
    onError: () => toast.error("Failed to upload file"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (file: any) => {
      await supabase.storage.from("client-files").remove([file.file_path]);
      const { error } = await supabase.from("client_files").delete().eq("id", file.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portal-files"] });
      toast.success("File deleted");
    },
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(file => uploadMutation.mutate(file));
  }, [uploadMutation]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(file => uploadMutation.mutate(file));
  };

  const downloadFile = async (file: any) => {
    const { data, error } = await supabase.storage.from("client-files").download(file.file_path);
    if (error) {
      toast.error("Failed to download file");
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileIcon = (type: string | null) => {
    if (!type) return <File className="h-8 w-8 text-muted-foreground" />;
    if (type.includes("image")) return <Image className="h-8 w-8 text-green-500" />;
    if (type.includes("pdf") || type.includes("document")) return <FileText className="h-8 w-8 text-blue-500" />;
    return <File className="h-8 w-8 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Files & Documents</h1>
          <p className="text-muted-foreground">Upload and manage your project files</p>
        </div>
        <div>
          <input type="file" id="file-upload" multiple onChange={handleFileSelect} className="hidden" />
          <Button onClick={() => document.getElementById("file-upload")?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search files..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
        </div>
        <div className="flex border rounded-lg">
          <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" className="rounded-r-none" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" className="rounded-l-none" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 transition-all ${isDragOver ? "border-primary bg-primary/5" : "border-border"}`}
      >
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading files...</div>
        ) : files?.length === 0 ? (
          <div className="text-center py-8">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Drop files here or click Upload</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files?.map((file) => (
              <Card key={file.id} className="group hover:border-primary/30 transition-all">
                <CardContent className="p-4 text-center relative">
                  <div className="mb-3">{getFileIcon(file.file_type)}</div>
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.file_size)}</p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => downloadFile(file)}>
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => deleteMutation.mutate(file)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {files?.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 group">
                {getFileIcon(file.file_type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(file.created_at), "MMM d, yyyy")}</p>
                </div>
                <Badge variant="secondary">{formatFileSize(file.file_size)}</Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => downloadFile(file)}><Download className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteMutation.mutate(file)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
