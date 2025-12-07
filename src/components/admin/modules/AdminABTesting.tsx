import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
  FlaskConical, Plus, Play, Pause, CheckCircle, XCircle, TrendingUp, TrendingDown,
  Users, Target, Percent, Clock, ArrowRight, BarChart3, RefreshCw, Download
} from "lucide-react";

// Mock experiment data
const experiments = [
  {
    id: "exp-001",
    name: "Pricing Page CTA Color",
    status: "running",
    startDate: "2024-12-01",
    variants: [
      { name: "Control (Blue)", visitors: 4520, conversions: 312, conversionRate: 6.9 },
      { name: "Variant A (Green)", visitors: 4480, conversions: 358, conversionRate: 8.0 },
    ],
    improvement: 15.9,
    significance: 94.2,
    targetMetric: "Quote Submissions",
  },
  {
    id: "exp-002", 
    name: "Homepage Hero Copy",
    status: "running",
    startDate: "2024-11-28",
    variants: [
      { name: "Control", visitors: 8920, conversions: 624, conversionRate: 7.0 },
      { name: "Variant A", visitors: 8850, conversions: 708, conversionRate: 8.0 },
      { name: "Variant B", visitors: 8780, conversions: 659, conversionRate: 7.5 },
    ],
    improvement: 14.3,
    significance: 96.8,
    targetMetric: "Page Engagement",
  },
  {
    id: "exp-003",
    name: "Onboarding Flow Steps",
    status: "completed",
    startDate: "2024-11-15",
    endDate: "2024-11-30",
    variants: [
      { name: "4-Step Flow", visitors: 1240, conversions: 892, conversionRate: 71.9 },
      { name: "6-Step Flow", visitors: 1260, conversions: 756, conversionRate: 60.0 },
    ],
    improvement: -16.5,
    significance: 99.2,
    targetMetric: "Onboarding Completion",
    winner: "4-Step Flow",
  },
  {
    id: "exp-004",
    name: "Quote Form Fields",
    status: "paused",
    startDate: "2024-12-03",
    variants: [
      { name: "Short Form (5 fields)", visitors: 890, conversions: 445, conversionRate: 50.0 },
      { name: "Long Form (10 fields)", visitors: 880, conversions: 352, conversionRate: 40.0 },
    ],
    improvement: 20.0,
    significance: 78.5,
    targetMetric: "Form Submissions",
  },
];

const timeSeriesData = [
  { date: "Dec 1", control: 6.2, variantA: 7.1 },
  { date: "Dec 2", control: 6.5, variantA: 7.8 },
  { date: "Dec 3", control: 6.8, variantA: 8.2 },
  { date: "Dec 4", control: 6.4, variantA: 7.9 },
  { date: "Dec 5", control: 7.0, variantA: 8.5 },
  { date: "Dec 6", control: 6.9, variantA: 8.0 },
  { date: "Dec 7", control: 7.2, variantA: 8.3 },
];

export const AdminABTesting = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [showNewExperiment, setShowNewExperiment] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      case "completed": return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "paused": return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <Play className="h-3 w-3" />;
      case "completed": return <CheckCircle className="h-3 w-3" />;
      case "paused": return <Pause className="h-3 w-3" />;
      default: return null;
    }
  };

  const activeExperiments = experiments.filter(e => e.status === "running");
  const completedExperiments = experiments.filter(e => e.status === "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <FlaskConical className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">A/B Testing</h1>
            <p className="text-muted-foreground">Experiment with variants and track conversions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showNewExperiment} onOpenChange={setShowNewExperiment}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Experiment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Experiment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Experiment Name</Label>
                  <Input placeholder="e.g., Homepage CTA Button Color" />
                </div>
                <div className="space-y-2">
                  <Label>Target Metric</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversions">Conversions</SelectItem>
                      <SelectItem value="engagement">Page Engagement</SelectItem>
                      <SelectItem value="signups">Sign Ups</SelectItem>
                      <SelectItem value="quotes">Quote Submissions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Traffic Split</Label>
                  <Select defaultValue="50-50">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50-50">50/50 Split</SelectItem>
                      <SelectItem value="70-30">70/30 Split</SelectItem>
                      <SelectItem value="80-20">80/20 Split</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Sample Size</Label>
                  <Input type="number" placeholder="1000" defaultValue="1000" />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setShowNewExperiment(false)}>Cancel</Button>
                  <Button onClick={() => setShowNewExperiment(false)}>Create Experiment</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Experiments</p>
                <p className="text-3xl font-bold">{activeExperiments.length}</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/10">
                <Play className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Visitors Tested</p>
                <p className="text-3xl font-bold">45.2K</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Improvement</p>
                <p className="text-3xl font-bold text-emerald-500">+12.4%</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Significance Rate</p>
                <p className="text-3xl font-bold">92%</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/10">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active ({activeExperiments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedExperiments.length})</TabsTrigger>
          <TabsTrigger value="all">All Experiments</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4">
          {activeExperiments.map((experiment) => (
            <Card key={experiment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {experiment.name}
                      <Badge variant="outline" className={getStatusColor(experiment.status)}>
                        {getStatusIcon(experiment.status)}
                        <span className="ml-1 capitalize">{experiment.status}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Started {experiment.startDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {experiment.targetMetric}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Variants */}
                  <div className="grid gap-3">
                    {experiment.variants.map((variant, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{variant.name}</span>
                            <span className="text-sm font-semibold">
                              {variant.conversionRate.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={variant.conversionRate * 10} className="h-2" />
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div>{variant.visitors.toLocaleString()} visitors</div>
                          <div>{variant.conversions.toLocaleString()} conversions</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-xs text-muted-foreground">Improvement</span>
                        <p className={`font-semibold flex items-center gap-1 ${experiment.improvement > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {experiment.improvement > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {experiment.improvement > 0 ? '+' : ''}{experiment.improvement.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Significance</span>
                        <p className={`font-semibold ${experiment.significance >= 95 ? 'text-emerald-500' : experiment.significance >= 90 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                          {experiment.significance.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <Button variant="default" size="sm" disabled={experiment.significance < 95}>
                      {experiment.significance >= 95 ? 'Declare Winner' : 'Needs More Data'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          {completedExperiments.map((experiment) => (
            <Card key={experiment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {experiment.name}
                      <Badge variant="outline" className={getStatusColor(experiment.status)}>
                        {getStatusIcon(experiment.status)}
                        <span className="ml-1 capitalize">{experiment.status}</span>
                      </Badge>
                      {experiment.winner && (
                        <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                          Winner: {experiment.winner}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {experiment.startDate} — {experiment.endDate}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {experiment.variants.map((variant, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        experiment.winner === variant.name 
                          ? 'bg-emerald-500/10 border border-emerald-500/30' 
                          : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm flex items-center gap-2">
                            {variant.name}
                            {experiment.winner === variant.name && (
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            )}
                          </span>
                          <span className="text-sm font-semibold">{variant.conversionRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={variant.conversionRate} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Experiments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Experiment</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Visitors</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Improvement</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Significance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiments.map((exp) => (
                      <tr key={exp.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-4 font-medium">{exp.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={getStatusColor(exp.status)}>
                            {exp.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {exp.variants.reduce((sum, v) => sum + v.visitors, 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={exp.improvement > 0 ? 'text-emerald-500' : 'text-red-500'}>
                            {exp.improvement > 0 ? '+' : ''}{exp.improvement.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">{exp.significance.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Conversion Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate Over Time</CardTitle>
          <CardDescription>Daily conversion comparison for active experiment</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(v) => `${v}%`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`]}
              />
              <Legend />
              <Line type="monotone" dataKey="control" stroke="hsl(var(--muted-foreground))" strokeWidth={2} name="Control" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="variantA" stroke="hsl(160, 84%, 39%)" strokeWidth={2} name="Variant A" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminABTesting;
