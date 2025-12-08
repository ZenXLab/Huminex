import { memo, useState, DragEvent } from "react";
import { motion } from "framer-motion";
import { GripVertical, Maximize2, Minimize2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { PortalWidgetConfig } from "@/hooks/usePortalDashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DraggablePortalWidgetProps {
  widget: PortalWidgetConfig;
  children: React.ReactNode;
  isEditMode: boolean;
  onDragStart: () => void;
  onDragEnd: (targetId: string | null) => void;
  onResize: (size: PortalWidgetConfig["size"]) => void;
  onToggleVisibility: () => void;
  dragOverId: string | null;
  setDragOverId: (id: string | null) => void;
}

const sizeClasses = {
  small: "lg:col-span-1",
  medium: "lg:col-span-1",
  large: "lg:col-span-2",
  full: "lg:col-span-3",
};

export const DraggablePortalWidget = memo(({
  widget,
  children,
  isEditMode,
  onDragStart,
  onDragEnd,
  onResize,
  onToggleVisibility,
  dragOverId,
  setDragOverId,
}: DraggablePortalWidgetProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("widgetId", widget.id);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    onDragStart();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd(dragOverId);
    setDragOverId(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(widget.id);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("widgetId");
    if (sourceId && sourceId !== widget.id) {
      onDragEnd(widget.id);
    }
    setDragOverId(null);
  };

  if (!widget.visible && !isEditMode) {
    return null;
  }

  return (
    <div
      draggable={isEditMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative transition-all duration-200",
        sizeClasses[widget.size],
        isDragging && "opacity-50 scale-95 z-50",
        dragOverId === widget.id && !isDragging && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        isEditMode && "cursor-move",
        !widget.visible && "grayscale opacity-50"
      )}
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: widget.visible ? 1 : 0.5, 
          scale: 1,
          y: dragOverId === widget.id ? -4 : 0,
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          layout: { duration: 0.3 }
        }}
        className="h-full"
      >
        {/* Edit Mode Controls */}
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-2 -right-2 z-10 flex items-center gap-1"
          >
            {/* Drag Handle */}
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground shadow-lg cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4" />
            </div>

            {/* Size Control */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary" className="h-7 w-7 shadow-lg">
                  {widget.size === "full" || widget.size === "large" ? (
                    <Minimize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => onResize("small")}>Small</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onResize("medium")}>Medium</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onResize("large")}>Large</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onResize("full")}>Full Width</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Visibility Toggle */}
            <Button
              size="icon"
              variant={widget.visible ? "secondary" : "destructive"}
              className="h-7 w-7 shadow-lg"
              onClick={onToggleVisibility}
            >
              {widget.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </Button>
          </motion.div>
        )}

        {/* Drop indicator line */}
        {dragOverId === widget.id && !isDragging && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute -top-1 left-0 right-0 h-1 bg-primary rounded-full"
          />
        )}

        {children}
      </motion.div>
    </div>
  );
});

DraggablePortalWidget.displayName = "DraggablePortalWidget";
