import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Folder, 
  FileText, 
  Image, 
  File, 
  Upload, 
  Download, 
  Trash2, 
  Search,
  Grid,
  List,
  MoreVertical,
  FolderPlus,
  ChevronRight,
  Home
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "document" | "image" | "file";
  size?: string;
  modified: string;
  path: string[];
}

const mockFiles: FileItem[] = [
  { id: "1", name: "Project Documents", type: "folder", modified: "Jan 15, 2024", path: [] },
  { id: "2", name: "Designs", type: "folder", modified: "Jan 12, 2024", path: [] },
  { id: "3", name: "Contracts", type: "folder", modified: "Jan 10, 2024", path: [] },
  { id: "4", name: "Project_Scope.pdf", type: "document", size: "2.4 MB", modified: "Jan 14, 2024", path: [] },
  { id: "5", name: "Requirements.docx", type: "document", size: "156 KB", modified: "Jan 13, 2024", path: [] },
  { id: "6", name: "Logo_Final.png", type: "image", size: "1.2 MB", modified: "Jan 11, 2024", path: [] },
  { id: "7", name: "Wireframes.fig", type: "file", size: "15 MB", modified: "Jan 10, 2024", path: [] },
  { id: "8", name: "Meeting_Notes.pdf", type: "document", size: "89 KB", modified: "Jan 9, 2024", path: [] },
];

export const FileRepository = () => {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDragOver, setIsDragOver] = useState(false);

  const getFileIcon = (type: FileItem["type"]) => {
    switch (type) {
      case "folder":
        return <Folder className="h-8 w-8 text-yellow-500" />;
      case "document":
        return <FileText className="h-8 w-8 text-blue-500" />;
      case "image":
        return <Image className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const filteredFiles = files.filter(
    (file) =>
      file.path.join("/") === currentPath.join("/") &&
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFolderClick = (folder: FileItem) => {
    if (folder.type === "folder") {
      setCurrentPath([...currentPath, folder.name]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      toast.success(`${droppedFiles.length} file(s) ready for upload`);
      // Here you would handle the actual upload
    }
  }, []);

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast.success("File deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">File Repository</h2>
          <p className="text-muted-foreground">Manage your project files and documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-r-none"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-l-none"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm">
        <button
          onClick={() => setCurrentPath([])}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          Home
        </button>
        {currentPath.map((folder, index) => (
          <span key={index} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <button
              onClick={() => handleBreadcrumbClick(index + 1)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {folder}
            </button>
          </span>
        ))}
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 transition-all
          ${isDragOver ? "border-primary bg-primary/5" : "border-border"}
        `}
      >
        {filteredFiles.length === 0 ? (
          <div className="text-center py-8">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? "No files match your search" : "Drop files here or click Upload"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <Card
                key={file.id}
                className={`group cursor-pointer hover:border-primary/30 hover:shadow-lg transition-all ${
                  file.type === "folder" ? "hover:bg-muted/50" : ""
                }`}
                onClick={() => handleFolderClick(file)}
              >
                <CardContent className="p-4 text-center relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(file.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="mb-3">{getFileIcon(file.type)}</div>
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  {file.size && (
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 group cursor-pointer"
                onClick={() => handleFolderClick(file)}
              >
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{file.modified}</p>
                </div>
                {file.size && (
                  <Badge variant="secondary">{file.size}</Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(file.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
