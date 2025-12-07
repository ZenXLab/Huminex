import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  FlaskConical, Plus, Play, Pause, CheckCircle, XCircle, TrendingUp, TrendingDown,
  Users, Target, Clock, BarChart3, RefreshCw, Download, Radio, Eye
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { calculateStatisticalSignificance } from "@/hooks/useABTest";

export const AdminABTesting = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("active");
  const [showNewExperiment, setShowNewExperiment] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Form state for new experiment
  const [newExperiment, setNewExperiment] = useState({
    name: "",
    description: "",
    hypothesis: "",
    primary_metric: "conversions",
    traffic_allocation: 100,
    variant_a_name: "Control",
    variant_b_name: "Variant A",
  });

  // Fetch experiments from database
  const { data: experiments, isLoading, refetch } = useQuery({
    queryKey: ["ab-experiments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ab_experiments")
        .select(`
          *,
          ab_variants (*),
          ab_user_assignments (*)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("ab-experiments-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ab_experiments" },
        () => queryClient.invalidateQueries({ queryKey: ["ab-experiments"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ab_user_assignments" },
        () => queryClient.invalidateQueries({ queryKey: ["ab-experiments"] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Create experiment mutation
  const createExperiment = useMutation({
    mutationFn: async () => {
      // Create experiment
      const { data: experiment, error: expError } = await supabase
        .from("ab_experiments")
        .insert({
          name: newExperiment.name,
          description: newExperiment.description,
          hypothesis: newExperiment.hypothesis,
          primary_metric: newExperiment.primary_metric,
          traffic_allocation: newExperiment.traffic_allocation,
          status: "running",
          start_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (expError) throw expError;

      // Create variants
      const { error: varError } = await supabase
        .from("ab_variants")
        .insert([
          {
            experiment_id: experiment.id,
            name: newExperiment.variant_a_name,
            is_control: true,
            traffic_weight: 50,
          },
          {
            experiment_id: experiment.id,
            name: newExperiment.variant_b_name,
            is_control: false,
            traffic_weight: 50,
          },
        ]);

      if (varError) throw varError;
      return experiment;
    },
    onSuccess: () => {
      toast.success("Experiment created successfully");
      setShowNewExperiment(false);
      setNewExperiment({
        name: "",
        description: "",
        hypothesis: "",
        primary_metric: "conversions",
        traffic_allocation: 100,
        variant_a_name: "Control",
        variant_b_name: "Variant A",
      });
      queryClient.invalidateQueries({ queryKey: ["ab-experiments"] });
    },
    onError: (error) => {
      toast.error("Failed to create experiment: " + (error as Error).message);
    },
  });

  // Update experiment status mutation
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("ab_experiments")
        .update({ 
          status, 
          ...(status === "completed" ? { end_date: new Date().toISOString() } : {})
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["ab-experiments"] });
    },
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Data refreshed");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Process experiments data
  const processedExperiments = experiments?.map((exp) => {
    const variants = exp.ab_variants || [];
    const assignments = exp.ab_user_assignments || [];
    
    const variantStats = variants.map((v: any) => {
      const varAssignments = assignments.filter((a: any) => a.variant_id === v.id);
      const conversions = varAssignments.filter((a: any) => a.converted);
      return {
        ...v,
        visitors: varAssignments.length,
        conversions: conversions.length,
        conversionRate: varAssignments.length > 0 
          ? (conversions.length / varAssignments.length) * 100 
          : 0,
      };
    });

    const control = variantStats.find((v: any) => v.is_control) || variantStats[0];
    const bestVariant = variantStats.reduce((best: any, curr: any) => 
      curr.conversionRate > (best?.conversionRate || 0) ? curr : best
    , null);

    const significance = control && bestVariant && control.id !== bestVariant?.id
      ? calculateStatisticalSignificance(
          control.conversions, control.visitors,
          bestVariant.conversions, bestVariant.visitors
        )
      : 0;

    const improvement = control && bestVariant
      ? ((bestVariant.conversionRate - control.conversionRate) / (control.conversionRate || 1)) * 100
      : 0;

    return {
      ...exp,
      variants: variantStats,
      totalVisitors: variantStats.reduce((sum: number, v: any) => sum + v.visitors, 0),
      significance,
      improvement,
    };
  }) || [];

  const activeExperiments = processedExperiments.filter((e) => e.status === "running");
  const completedExperiments = processedExperiments.filter((e) => e.status === "completed");
  const pausedExperiments = processedExperiments.filter((e) => e.status === "paused");

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

  // Stats
  const totalVisitors = processedExperiments.reduce((sum, e) => sum + e.totalVisitors, 0);
  const avgImprovement = activeExperiments.length > 0
    ? activeExperiments.reduce((sum, e) => sum + e.improvement, 0) / activeExperiments.length
    : 0;
  const significantCount = processedExperiments.filter((e) => e.significance >= 95).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <FlaskConical className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-heading font-bold text-foreground">A/B Testing</h1>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                <Radio className="h-3 w-3 mr-1 animate-pulse" />
                Live
              </Badge>
            </div>
            <p className="text-muted-foreground">Experiment with variants and track conversions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
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
                  <Label>Experiment Name *</Label>
                  <Input 
                    placeholder="e.g., Homepage CTA Button Color"
                    value={newExperiment.name}
                    onChange={(e) => setNewExperiment(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hypothesis</Label>
                  <Textarea 
                    placeholder="e.g., Changing the CTA color to green will increase conversions"
                    value={newExperiment.hypothesis}
                    onChange={(e) => setNewExperiment(prev => ({ ...prev, hypothesis: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Control Name</Label>
                    <Input 
                      value={newExperiment.variant_a_name}
                      onChange={(e) => setNewExperiment(prev => ({ ...prev, variant_a_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Variant Name</Label>
                    <Input 
                      value={newExperiment.variant_b_name}
                      onChange={(e) => setNewExperiment(prev => ({ ...prev, variant_b_name: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Target Metric</Label>
                  <Select 
                    value={newExperiment.primary_metric}
                    onValueChange={(v) => setNewExperiment(prev => ({ ...prev, primary_metric: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversions">Conversions</SelectItem>
                      <SelectItem value="engagement">Page Engagement</SelectItem>
                      <SelectItem value="signups">Sign Ups</SelectItem>
                      <SelectItem value="quotes">Quote Submissions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setShowNewExperiment(false)}>Cancel</Button>
                  <Button 
                    onClick={() => createExperiment.mutate()}
                    disabled={!newExperiment.name || createExperiment.isPending}
                  >
                    {createExperiment.isPending ? "Creating..." : "Create Experiment"}
                  </Button>
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
                <p className="text-sm text-muted-foreground">Total Visitors</p>
                <p className="text-3xl font-bold">{totalVisitors.toLocaleString()}</p>
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
                <p className={`text-3xl font-bold ${avgImprovement > 0 ? "text-emerald-500" : avgImprovement < 0 ? "text-red-500" : ""}`}>
                  {avgImprovement > 0 ? "+" : ""}{avgImprovement.toFixed(1)}%
                </p>
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
                <p className="text-sm text-muted-foreground">Significant Results</p>
                <p className="text-3xl font-bold">{significantCount}</p>
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
          <TabsTrigger value="all">All Experiments ({processedExperiments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading experiments...</div>
          ) : activeExperiments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No active experiments</p>
                <Button className="mt-4" onClick={() => setShowNewExperiment(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Experiment
                </Button>
              </CardContent>
            </Card>
          ) : (
            activeExperiments.map((experiment) => (
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
                          Started {experiment.start_date ? format(new Date(experiment.start_date), "MMM d, yyyy") : "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {experiment.primary_metric}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: experiment.id, status: "paused" })}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/ab-testing/${experiment.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Variants */}
                    <div className="grid gap-3">
                      {experiment.variants.map((variant: any) => (
                        <div key={variant.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm flex items-center gap-2">
                                {variant.name}
                                {variant.is_control && <Badge variant="secondary" className="text-[10px]">Control</Badge>}
                              </span>
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
                      <Button 
                        variant="default" 
                        size="sm" 
                        disabled={experiment.significance < 95}
                        onClick={() => updateStatus.mutate({ id: experiment.id, status: "completed" })}
                      >
                        {experiment.significance >= 95 ? 'Declare Winner' : 'Needs More Data'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          {completedExperiments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No completed experiments yet
              </CardContent>
            </Card>
          ) : (
            completedExperiments.map((experiment) => (
              <Card key={experiment.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/admin/ab-testing/${experiment.id}`)}>
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
                      <CardDescription>
                        {experiment.start_date && format(new Date(experiment.start_date), "MMM d")} — {experiment.end_date ? format(new Date(experiment.end_date), "MMM d, yyyy") : "Ongoing"}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {experiment.variants.map((variant: any) => {
                      const isWinner = experiment.significance >= 95 && 
                        variant.conversionRate === Math.max(...experiment.variants.map((v: any) => v.conversionRate));
                      
                      return (
                        <div 
                          key={variant.id} 
                          className={`flex items-center gap-4 p-3 rounded-lg ${
                            isWinner ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-muted/30'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm flex items-center gap-2">
                                {variant.name}
                                {isWinner && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                              </span>
                              <span className="text-sm font-semibold">{variant.conversionRate.toFixed(1)}%</span>
                            </div>
                            <Progress value={variant.conversionRate} className="h-2" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Experiments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Experiment</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Visitors</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Improvement</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Significance</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedExperiments.map((experiment) => (
                        <tr key={experiment.id} className="border-b border-border hover:bg-muted/30">
                          <td className="py-3 px-4 font-medium">{experiment.name}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className={getStatusColor(experiment.status)}>
                              {experiment.status}
                            </Badge>
                          </td>
                          <td className="text-right py-3 px-4">{experiment.totalVisitors.toLocaleString()}</td>
                          <td className={`text-right py-3 px-4 ${experiment.improvement > 0 ? 'text-emerald-500' : experiment.improvement < 0 ? 'text-red-500' : ''}`}>
                            {experiment.improvement > 0 ? '+' : ''}{experiment.improvement.toFixed(1)}%
                          </td>
                          <td className={`text-right py-3 px-4 ${experiment.significance >= 95 ? 'text-emerald-500' : ''}`}>
                            {experiment.significance.toFixed(1)}%
                          </td>
                          <td className="text-center py-3 px-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/admin/ab-testing/${experiment.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
