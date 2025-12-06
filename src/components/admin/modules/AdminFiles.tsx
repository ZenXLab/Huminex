import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, Download, Folder, Image, File } from "lucide-react";
import { format } from "date-fns";

export const AdminFiles = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: files, isLoading } = useQuery({
    queryKey: ["admin-files", searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("client_files")
        .select("*, profiles(full_name, email), projects(name)")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileIcon = (type: string | null) => {
    if (!type) return <File className="h-4 w-4" />;
    if (type.includes("image")) return <Image className="h-4 w-4 text-green-500" />;
    if (type.includes("pdf") || type.includes("document")) return <FileText className="h-4 w-4 text-blue-500" />;
    return <File className="h-4 w-4 text-muted-foreground" />;
  };

  const stats = {
    total: files?.length || 0,
    totalSize: files?.reduce((sum, f) => sum + (f.file_size || 0), 0) || 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Files Repository</h1>
        <p className="text-muted-foreground">Manage all client files and documents</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Files</CardTitle>
              <CardDescription>Browse and manage uploaded files</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search files..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : files?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No files found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files?.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.file_type)}
                        <span className="font-medium truncate max-w-48">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{(file.profiles as any)?.full_name || "-"}</TableCell>
                    <TableCell>{(file.projects as any)?.name || "-"}</TableCell>
                    <TableCell>{formatFileSize(file.file_size)}</TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(file.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
