import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Minimize2, LayoutGrid, LineChart, Briefcase, Star, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dashboardPresets, DashboardPreset } from "@/hooks/useDashboardLayout";
import { toast } from "sonner";

interface DashboardPresetsProps {
  activePreset: string | null;
  customPresets: DashboardPreset[];
  onApplyPreset: (presetId: string) => void;
  onSaveCustomPreset: (name: string, description: string) => string;
  onDeleteCustomPreset: (presetId: string) => void;
}

const iconMap: Record<string, any> = {
  Minimize2,
  LayoutGrid,
  LineChart,
  Briefcase,
  Star,
};

export const DashboardPresets = memo(({
  activePreset,
  customPresets,
  onApplyPreset,
  onSaveCustomPreset,
  onDeleteCustomPreset,
}: DashboardPresetsProps) => {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presetDescription, setPresetDescription] = useState("");

  const allPresets = [...dashboardPresets, ...customPresets];
  const currentPreset = allPresets.find((p) => p.id === activePreset);

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast.error("Please enter a preset name");
      return;
    }
    
    onSaveCustomPreset(presetName.trim(), presetDescription.trim());
    toast.success(`Preset "${presetName}" saved successfully`);
    setPresetName("");
    setPresetDescription("");
    setIsSaveDialogOpen(false);
  };

  const handleDeletePreset = (e: React.MouseEvent, presetId: string, presetName: string) => {
    e.stopPropagation();
    onDeleteCustomPreset(presetId);
    toast.success(`Preset "${presetName}" deleted`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">
              {currentPreset ? currentPreset.name : "Custom"}
            </span>
            {!currentPreset && (
              <Badge variant="secondary" className="text-xs px-1.5">
                Custom
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Dashboard Presets</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSaveDialogOpen(true);
              }}
            >
              <Plus className="h-3 w-3" />
              Save Current
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Built-in Presets */}
          {dashboardPresets.map((preset) => {
            const Icon = iconMap[preset.icon] || LayoutGrid;
            const isActive = activePreset === preset.id;

            return (
              <DropdownMenuItem
                key={preset.id}
                onClick={() => onApplyPreset(preset.id)}
                className="flex items-start gap-3 p-3 cursor-pointer"
              >
                <div className={`p-2 rounded-lg ${isActive ? "bg-primary/10" : "bg-muted"}`}>
                  <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                      {preset.name}
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center justify-center w-4 h-4 rounded-full bg-primary"
                      >
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{preset.description}</p>
                </div>
              </DropdownMenuItem>
            );
          })}

          {/* Custom Presets */}
          {customPresets.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Your Custom Presets
              </DropdownMenuLabel>
              {customPresets.map((preset) => {
                const isActive = activePreset === preset.id;

                return (
                  <DropdownMenuItem
                    key={preset.id}
                    onClick={() => onApplyPreset(preset.id)}
                    className="flex items-start gap-3 p-3 cursor-pointer group"
                  >
                    <div className={`p-2 rounded-lg ${isActive ? "bg-primary/10" : "bg-muted"}`}>
                      <Star className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                          {preset.name}
                        </span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center w-4 h-4 rounded-full bg-primary flex-shrink-0"
                          >
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{preset.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={(e) => handleDeletePreset(e, preset.id, preset.name)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </DropdownMenuItem>
                );
              })}
            </>
          )}

          <DropdownMenuSeparator />
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground">
              {customPresets.length === 0 
                ? "Save your current layout as a custom preset using the button above."
                : `${customPresets.length} custom preset${customPresets.length > 1 ? 's' : ''} saved.`
              }
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Save Preset Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="h-5 w-5 text-primary" />
              Save Custom Preset
            </DialogTitle>
            <DialogDescription>
              Save your current dashboard layout as a reusable preset.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="preset-name" className="text-sm font-medium">
                Preset Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="preset-name"
                placeholder="e.g., My Analytics View"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="preset-description" className="text-sm font-medium">
                Description <span className="text-muted-foreground">(optional)</span>
              </label>
              <Textarea
                id="preset-description"
                placeholder="Describe what this preset is for..."
                value={presetDescription}
                onChange={(e) => setPresetDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreset} className="gap-2">
              <Save className="h-4 w-4" />
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

DashboardPresets.displayName = "DashboardPresets";
