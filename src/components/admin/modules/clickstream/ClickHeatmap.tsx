import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flame, Radio, MousePointer } from "lucide-react";

interface HeatmapData {
  element: string;
  count: number;
  intensity: number;
  page: string;
}

interface ClickHeatmapProps {
  events: Array<{
    event_type: string;
    page_url: string | null;
    element_text: string | null;
    element_id: string | null;
    element_class: string | null;
    metadata: any;
  }>;
}

export const ClickHeatmap = ({ events }: ClickHeatmapProps) => {
  const [selectedPage, setSelectedPage] = useState<string>("all");

  // Get unique pages with clicks
  const pagesWithClicks = [...new Set(
    events
      .filter(e => e.event_type === "click" && e.page_url)
      .map(e => e.page_url!)
  )];

  // Calculate click density per element
  const calculateHeatmapData = (): HeatmapData[] => {
    const clickEvents = events.filter(e => 
      e.event_type === "click" && 
      (selectedPage === "all" || e.page_url === selectedPage)
    );

    const elementCounts: Record<string, { count: number; page: string }> = {};

    clickEvents.forEach(event => {
      const elementKey = event.element_text || event.element_id || "Unknown Element";
      if (!elementCounts[elementKey]) {
        elementCounts[elementKey] = { count: 0, page: event.page_url || "/" };
      }
      elementCounts[elementKey].count++;
    });

    const maxCount = Math.max(...Object.values(elementCounts).map(e => e.count), 1);

    return Object.entries(elementCounts)
      .map(([element, data]) => ({
        element: element.slice(0, 50),
        count: data.count,
        intensity: (data.count / maxCount) * 100,
        page: data.page,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  };

  const heatmapData = calculateHeatmapData();
  const totalClicks = heatmapData.reduce((sum, item) => sum + item.count, 0);

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return "from-red-500 to-orange-500";
    if (intensity >= 60) return "from-orange-500 to-amber-500";
    if (intensity >= 40) return "from-amber-500 to-yellow-500";
    if (intensity >= 20) return "from-yellow-500 to-lime-500";
    return "from-lime-500 to-green-500";
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 80) return "Hot";
    if (intensity >= 60) return "Warm";
    if (intensity >= 40) return "Medium";
    if (intensity >= 20) return "Cool";
    return "Cold";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Click Heatmap
            </CardTitle>
            <CardDescription>Element click density visualization</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              Live
            </Badge>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Pages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pages</SelectItem>
                {pagesWithClicks.map(page => (
                  <SelectItem key={page} value={page}>{page}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {heatmapData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MousePointer className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No click data available yet</p>
            <p className="text-sm">Interact with the site to see heatmap data</p>
          </div>
        ) : (
          <>
            {/* Heatmap legend */}
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-sm text-muted-foreground">Click Intensity</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Cold</span>
                <div className="flex h-3">
                  <div className="w-6 bg-gradient-to-r from-green-500 to-lime-500 rounded-l" />
                  <div className="w-6 bg-gradient-to-r from-lime-500 to-yellow-500" />
                  <div className="w-6 bg-gradient-to-r from-yellow-500 to-amber-500" />
                  <div className="w-6 bg-gradient-to-r from-amber-500 to-orange-500" />
                  <div className="w-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-r" />
                </div>
                <span className="text-xs text-muted-foreground">Hot</span>
              </div>
            </div>

            {/* Heatmap grid */}
            <div className="space-y-2">
              {heatmapData.map((item, idx) => (
                <div key={idx} className="group relative">
                  <div className="flex items-center gap-3">
                    <div className="w-8 text-sm text-muted-foreground font-mono">
                      #{idx + 1}
                    </div>
                    <div className="flex-1 relative">
                      <div 
                        className={`absolute inset-0 bg-gradient-to-r ${getIntensityColor(item.intensity)} opacity-20 rounded-lg`}
                        style={{ width: `${Math.max(item.intensity, 10)}%` }}
                      />
                      <div className="relative flex items-center justify-between p-3 rounded-lg border bg-background/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MousePointer className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium truncate">{item.element}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {item.page}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              item.intensity >= 60 
                                ? "border-orange-500/50 text-orange-600 bg-orange-500/10" 
                                : "border-muted"
                            }`}
                          >
                            {getIntensityLabel(item.intensity)}
                          </Badge>
                          <span className="font-bold text-lg w-10 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{totalClicks}</div>
                <div className="text-xs text-muted-foreground">Total Clicks</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {heatmapData.filter(h => h.intensity >= 60).length}
                </div>
                <div className="text-xs text-muted-foreground">Hot Zones</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-emerald-500">
                  {heatmapData.length}
                </div>
                <div className="text-xs text-muted-foreground">Unique Elements</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
