import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Radio, MousePointer, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

interface HeatmapData {
  element: string;
  count: number;
  intensity: number;
  page: string;
}

interface ScrollDepthData {
  page: string;
  depths: { percent: number; count: number }[];
  totalViews: number;
}

interface ClickHeatmapProps {
  events: Array<{
    event_type: string;
    page_url: string | null;
    element_text: string | null;
    element_id: string | null;
    element_class?: string | null;
    metadata: any;
  }>;
}

export const ClickHeatmap = ({ events }: ClickHeatmapProps) => {
  const [selectedPage, setSelectedPage] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("clicks");

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

  // Calculate scroll depth data
  const calculateScrollDepthData = (): ScrollDepthData[] => {
    const scrollEvents = events.filter(e => 
      e.event_type === "scroll" && 
      (selectedPage === "all" || e.page_url === selectedPage)
    );

    const pageDepths: Record<string, Record<number, number>> = {};

    scrollEvents.forEach(event => {
      const page = event.page_url || "/";
      const depth = event.metadata?.depth || 0;
      
      if (!pageDepths[page]) {
        pageDepths[page] = {};
      }
      pageDepths[page][depth] = (pageDepths[page][depth] || 0) + 1;
    });

    return Object.entries(pageDepths)
      .map(([page, depths]) => ({
        page,
        depths: Object.entries(depths)
          .map(([percent, count]) => ({ percent: Number(percent), count }))
          .sort((a, b) => a.percent - b.percent),
        totalViews: Object.values(depths).reduce((sum, c) => sum + c, 0)
      }))
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 5);
  };

  const heatmapData = calculateHeatmapData();
  const scrollDepthData = calculateScrollDepthData();
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

  const getScrollHeatColor = (intensity: number) => {
    if (intensity > 0.8) return "bg-gradient-to-r from-red-500 to-orange-500";
    if (intensity > 0.6) return "bg-gradient-to-r from-orange-500 to-yellow-500";
    if (intensity > 0.4) return "bg-gradient-to-r from-yellow-500 to-green-500";
    if (intensity > 0.2) return "bg-gradient-to-r from-green-500 to-teal-500";
    return "bg-gradient-to-r from-teal-500 to-blue-500";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Heatmap Analysis
            </CardTitle>
            <CardDescription>Click density & scroll depth visualization</CardDescription>
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="clicks" className="gap-2">
              <MousePointer className="h-4 w-4" />
              Click Heatmap
            </TabsTrigger>
            <TabsTrigger value="scroll" className="gap-2">
              <ArrowDown className="h-4 w-4" />
              Scroll Depth
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clicks">
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
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {heatmapData.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      className="group relative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
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
                    </motion.div>
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
          </TabsContent>

          <TabsContent value="scroll">
            {scrollDepthData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ArrowDown className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No scroll data available yet</p>
                <p className="text-sm">Scroll events will appear as users interact with pages</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Scroll depth legend */}
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className="text-sm text-muted-foreground">Scroll Engagement</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Low</span>
                    <div className="flex h-3">
                      <div className="w-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-l" />
                      <div className="w-6 bg-gradient-to-r from-teal-500 to-green-500" />
                      <div className="w-6 bg-gradient-to-r from-green-500 to-yellow-500" />
                      <div className="w-6 bg-gradient-to-r from-yellow-500 to-orange-500" />
                      <div className="w-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-r" />
                    </div>
                    <span className="text-xs text-muted-foreground">High</span>
                  </div>
                </div>

                {scrollDepthData.map((page, pageIndex) => {
                  const maxCount = Math.max(...page.depths.map(d => d.count), 1);
                  
                  return (
                    <motion.div
                      key={page.page}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: pageIndex * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate max-w-[200px]">
                          {page.page}
                        </span>
                        <Badge variant="outline">{page.totalViews} scroll events</Badge>
                      </div>
                      
                      {/* Page visualization with scroll depth overlay */}
                      <div className="relative h-40 w-full rounded-lg border border-border/50 overflow-hidden bg-background/50">
                        {/* Browser chrome */}
                        <div className="h-6 bg-muted/30 border-b border-border/30 flex items-center px-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                          </div>
                          <span className="text-[8px] ml-2 text-muted-foreground truncate">
                            {page.page}
                          </span>
                        </div>
                        
                        {/* Content with heatmap overlay */}
                        <div className="relative h-[calc(100%-24px)]">
                          {/* Grid lines */}
                          {[25, 50, 75, 100].map((percent) => (
                            <div
                              key={percent}
                              className="absolute w-full border-t border-dashed border-border/30 flex items-center"
                              style={{ top: `${percent}%` }}
                            >
                              <span className="absolute right-1 -top-2 text-[8px] text-muted-foreground">
                                {percent}%
                              </span>
                            </div>
                          ))}
                          
                          {/* Heatmap sections */}
                          {page.depths.map((depth, idx) => {
                            const intensity = depth.count / maxCount;
                            const startPercent = idx === 0 ? 0 : page.depths[idx - 1]?.percent || 0;
                            const heightPercent = depth.percent - startPercent;
                            
                            return (
                              <motion.div
                                key={depth.percent}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: Math.max(0.3, intensity) }}
                                transition={{ delay: idx * 0.1 + pageIndex * 0.2 }}
                                className={`absolute left-0 right-0 ${getScrollHeatColor(intensity)}`}
                                style={{
                                  top: `${startPercent}%`,
                                  height: `${Math.max(heightPercent, 5)}%`,
                                }}
                              >
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-[10px] font-bold text-white drop-shadow-lg">
                                    {depth.count}
                                  </span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Summary stats */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                      {scrollDepthData.reduce((sum, p) => sum + p.totalViews, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Scrolls</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {scrollDepthData.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Pages Tracked</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-emerald-500">
                      {Math.max(...scrollDepthData.flatMap(p => p.depths.map(d => d.percent)), 0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Max Depth</div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
