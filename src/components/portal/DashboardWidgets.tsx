import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GripVertical, 
  FolderKanban, 
  Receipt, 
  HeadphonesIcon, 
  Calendar,
  TrendingUp,
  FileText,
  Clock,
  X
} from "lucide-react";

interface Widget {
  id: string;
  title: string;
  icon: any;
  size: "small" | "medium" | "large";
  component: React.ReactNode;
}

interface DraggableWidgetProps {
  widget: Widget;
  onRemove: (id: string) => void;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
}

const DraggableWidget = ({ 
  widget, 
  onRemove, 
  isDragging, 
  onDragStart, 
  onDragEnd,
  onDragOver 
}: DraggableWidgetProps) => {
  const Icon = widget.icon;
  
  return (
    <div
      draggable
      onDragStart={() => onDragStart(widget.id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, widget.id)}
      className={`
        ${widget.size === "small" ? "col-span-1" : widget.size === "medium" ? "col-span-2" : "col-span-3"}
        ${isDragging ? "opacity-50 scale-95" : "opacity-100"}
        transition-all duration-200
      `}
    >
      <Card className="h-full group hover:border-primary/30 hover:shadow-lg transition-all cursor-move">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(widget.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent>
          {widget.component}
        </CardContent>
      </Card>
    </div>
  );
};

// Widget Components
const ProjectsWidget = () => (
  <div className="space-y-2">
    {[
      { name: "E-Commerce Platform", progress: 65 },
      { name: "Mobile App MVP", progress: 90 },
    ].map((project) => (
      <div key={project.name} className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="truncate">{project.name}</span>
          <span className="text-primary font-medium">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

const InvoicesWidget = () => (
  <div className="space-y-2">
    {[
      { id: "INV-001", amount: "₹25,000", status: "Pending" },
      { id: "INV-002", amount: "₹18,500", status: "Paid" },
    ].map((invoice) => (
      <div key={invoice.id} className="flex items-center justify-between text-sm">
        <span className="font-mono">{invoice.id}</span>
        <span className="font-medium">{invoice.amount}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          invoice.status === "Paid" ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
        }`}>
          {invoice.status}
        </span>
      </div>
    ))}
  </div>
);

const TicketsWidget = () => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-2xl font-bold">1</p>
      <p className="text-sm text-muted-foreground">Open Tickets</p>
    </div>
    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
      <HeadphonesIcon className="h-6 w-6 text-primary" />
    </div>
  </div>
);

const MeetingsWidget = () => (
  <div className="space-y-2">
    {[
      { title: "Sprint Review", time: "Today, 3:00 PM" },
      { title: "Design Sync", time: "Tomorrow, 11:00 AM" },
    ].map((meeting, i) => (
      <div key={i} className="flex items-center gap-2 text-sm">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="font-medium">{meeting.title}</span>
        <span className="text-muted-foreground text-xs">{meeting.time}</span>
      </div>
    ))}
  </div>
);

const StatsWidget = () => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <p className="text-2xl font-bold text-primary">3</p>
      <p className="text-xs text-muted-foreground">Active Projects</p>
    </div>
    <div>
      <p className="text-2xl font-bold text-accent">₹45K</p>
      <p className="text-xs text-muted-foreground">Pending</p>
    </div>
  </div>
);

const RecentFilesWidget = () => (
  <div className="space-y-2">
    {[
      { name: "Project_Scope.pdf", size: "2.4 MB" },
      { name: "Design_v2.fig", size: "15 MB" },
      { name: "Contract.docx", size: "156 KB" },
    ].map((file, i) => (
      <div key={i} className="flex items-center gap-2 text-sm">
        <FileText className="h-3 w-3 text-muted-foreground" />
        <span className="truncate flex-1">{file.name}</span>
        <span className="text-muted-foreground text-xs">{file.size}</span>
      </div>
    ))}
  </div>
);

const defaultWidgets: Widget[] = [
  { id: "stats", title: "Quick Stats", icon: TrendingUp, size: "medium", component: <StatsWidget /> },
  { id: "projects", title: "Active Projects", icon: FolderKanban, size: "medium", component: <ProjectsWidget /> },
  { id: "invoices", title: "Recent Invoices", icon: Receipt, size: "medium", component: <InvoicesWidget /> },
  { id: "tickets", title: "Support Tickets", icon: HeadphonesIcon, size: "small", component: <TicketsWidget /> },
  { id: "meetings", title: "Upcoming Meetings", icon: Calendar, size: "medium", component: <MeetingsWidget /> },
  { id: "files", title: "Recent Files", icon: FileText, size: "small", component: <RecentFilesWidget /> },
];

export const DashboardWidgets = () => {
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleRemove = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    setWidgets((prev) => {
      const draggedIndex = prev.findIndex((w) => w.id === draggedId);
      const targetIndex = prev.findIndex((w) => w.id === targetId);
      
      const newWidgets = [...prev];
      const [draggedWidget] = newWidgets.splice(draggedIndex, 1);
      newWidgets.splice(targetIndex, 0, draggedWidget);
      
      return newWidgets;
    });
  }, [draggedId]);

  const handleReset = useCallback(() => {
    setWidgets(defaultWidgets);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Drag widgets to reorder your dashboard</p>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset Layout
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <DraggableWidget
            key={widget.id}
            widget={widget}
            onRemove={handleRemove}
            isDragging={draggedId === widget.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          />
        ))}
      </div>
    </div>
  );
};
