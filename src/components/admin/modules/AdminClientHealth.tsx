import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  RefreshCw,
  Download,
  Users,
  Activity,
  Heart,
  ThumbsUp
} from "lucide-react";

// Mock client health data
const clientHealthData = [
  { id: 1, name: "Acme Corporation", healthScore: 92, trend: "up", lastActivity: "2 hours ago", ticketCount: 1, satisfaction: 4.8, engagement: "high", risk: "low" },
  { id: 2, name: "Startup Hub India", healthScore: 78, trend: "down", lastActivity: "1 day ago", ticketCount: 3, satisfaction: 4.2, engagement: "medium", risk: "medium" },
  { id: 3, name: "Retail Mart Ltd", healthScore: 45, trend: "down", lastActivity: "5 days ago", ticketCount: 7, satisfaction: 3.1, engagement: "low", risk: "high" },
  { id: 4, name: "Tech Solutions Pvt Ltd", healthScore: 88, trend: "up", lastActivity: "3 hours ago", ticketCount: 0, satisfaction: 4.9, engagement: "high", risk: "low" },
  { id: 5, name: "Global Services Inc", healthScore: 65, trend: "stable", lastActivity: "2 days ago", ticketCount: 2, satisfaction: 3.8, engagement: "medium", risk: "medium" },
  { id: 6, name: "Hospital Network", healthScore: 55, trend: "down", lastActivity: "4 days ago", ticketCount: 5, satisfaction: 3.5, engagement: "low", risk: "high" },
  { id: 7, name: "EdTech Solutions", healthScore: 95, trend: "up", lastActivity: "1 hour ago", ticketCount: 0, satisfaction: 5.0, engagement: "high", risk: "low" },
  { id: 8, name: "Manufacturing Co", healthScore: 72, trend: "stable", lastActivity: "12 hours ago", ticketCount: 2, satisfaction: 4.0, engagement: "medium", risk: "medium" },
];

const stats = {
  avgHealth: Math.round(clientHealthData.reduce((a, b) => a + b.healthScore, 0) / clientHealthData.length),
  atRisk: clientHealthData.filter(c => c.risk === "high").length,
  healthy: clientHealthData.filter(c => c.healthScore >= 80).length,
  avgSatisfaction: (clientHealthData.reduce((a, b) => a + b.satisfaction, 0) / clientHealthData.length).toFixed(1),
};

export const AdminClientHealth = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");

  const filteredClients = clientHealthData.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === "all" || client.risk === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low": return "bg-emerald-100 text-emerald-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Client Health Scores</h1>
          <p className="text-muted-foreground">Monitor client satisfaction and engagement metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Health</p>
                <p className="text-3xl font-bold text-foreground">{stats.avgHealth}%</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy Clients</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.healthy}</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-3xl font-bold text-red-600">{stats.atRisk}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
                <p className="text-3xl font-bold text-foreground">{stats.avgSatisfaction}</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <ThumbsUp className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Client Health Dashboard</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div 
                key={client.id} 
                className="flex items-center justify-between p-4 bg-muted/30 border border-border/60 rounded-xl hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${getHealthBg(client.healthScore)} flex items-center justify-center text-white font-bold`}>
                    {client.healthScore}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">Last activity: {client.lastActivity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Trend</p>
                    <div className="flex items-center justify-center">{getTrendIcon(client.trend)}</div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Open Tickets</p>
                    <p className={`font-semibold ${client.ticketCount > 3 ? 'text-red-600' : 'text-foreground'}`}>
                      {client.ticketCount}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Satisfaction</p>
                    <p className="font-semibold text-foreground">{client.satisfaction}/5</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                    <Badge variant="outline" className="capitalize">{client.engagement}</Badge>
                  </div>
                  <Badge className={getRiskBadge(client.risk)}>
                    {client.risk.toUpperCase()} RISK
                  </Badge>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
