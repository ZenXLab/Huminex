import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Zap, Clock, CheckCircle, AlertTriangle, 
  XCircle, TrendingUp, TrendingDown, Settings,
  RefreshCw, BarChart3, Target, Activity, Cpu,
  Thermometer, Gauge
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { toast } from "sonner";

// Mock Model Performance Data
const models = [
  {
    id: "gpt-4",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    status: "active",
    version: "1.0.0",
    accuracy: 96.5,
    avgLatency: 1250,
    p95Latency: 2100,
    uptime: 99.95,
    requests24h: 4520,
    errorRate: 0.3,
    costPer1kTokens: 0.03,
    capabilities: ["text", "code", "analysis", "reasoning"],
    color: "#8B5CF6"
  },
  {
    id: "gpt-35",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    status: "active",
    version: "1.0.0",
    accuracy: 89.2,
    avgLatency: 450,
    p95Latency: 850,
    uptime: 99.98,
    requests24h: 12800,
    errorRate: 0.1,
    costPer1kTokens: 0.002,
    capabilities: ["text", "code"],
    color: "#06B6D4"
  },
  {
    id: "claude-3",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    status: "active",
    version: "2024-02",
    accuracy: 95.8,
    avgLatency: 980,
    p95Latency: 1800,
    uptime: 99.92,
    requests24h: 2340,
    errorRate: 0.5,
    costPer1kTokens: 0.015,
    capabilities: ["text", "code", "analysis", "vision"],
    color: "#10B981"
  },
  {
    id: "gemini",
    name: "Gemini Pro",
    provider: "Google",
    status: "degraded",
    version: "1.0",
    accuracy: 91.4,
    avgLatency: 680,
    p95Latency: 1400,
    uptime: 98.5,
    requests24h: 1890,
    errorRate: 1.2,
    costPer1kTokens: 0.002,
    capabilities: ["text", "code", "vision"],
    color: "#F59E0B"
  }
];

const latencyTrend = [
  { time: "00:00", gpt4: 1200, gpt35: 420, claude: 950, gemini: 650 },
  { time: "04:00", gpt4: 1150, gpt35: 440, claude: 920, gemini: 680 },
  { time: "08:00", gpt4: 1350, gpt35: 480, claude: 1020, gemini: 720 },
  { time: "12:00", gpt4: 1450, gpt35: 520, claude: 1100, gemini: 780 },
  { time: "16:00", gpt4: 1380, gpt35: 490, claude: 1050, gemini: 750 },
  { time: "20:00", gpt4: 1250, gpt35: 450, claude: 980, gemini: 690 },
  { time: "24:00", gpt4: 1220, gpt35: 430, claude: 960, gemini: 670 }
];

const accuracyByTask = [
  { task: "Classification", gpt4: 98, gpt35: 92, claude: 97, gemini: 94 },
  { task: "Summarization", gpt4: 95, gpt35: 88, claude: 96, gemini: 90 },
  { task: "Code Gen", gpt4: 97, gpt35: 85, claude: 94, gemini: 88 },
  { task: "Q&A", gpt4: 96, gpt35: 90, claude: 95, gemini: 92 },
  { task: "Analysis", gpt4: 95, gpt35: 86, claude: 97, gemini: 89 }
];

const radarData = [
  { metric: "Accuracy", GPT4: 97, GPT35: 89, Claude: 96, Gemini: 91 },
  { metric: "Speed", GPT4: 65, GPT35: 95, Claude: 75, Gemini: 85 },
  { metric: "Cost", GPT4: 40, GPT35: 95, Claude: 70, Gemini: 90 },
  { metric: "Uptime", GPT4: 99, GPT35: 99, Claude: 99, Gemini: 98 },
  { metric: "Versatility", GPT4: 98, GPT35: 80, Claude: 95, Gemini: 85 }
];

export const AdminAIModels: React.FC = () => {
  const [modelSettings, setModelSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(models.map(m => [m.id, m.status === 'active']))
  );

  const toggleModel = (modelId: string) => {
    setModelSettings(prev => {
      const newState = { ...prev, [modelId]: !prev[modelId] };
      toast.success(`${models.find(m => m.id === modelId)?.name} ${newState[modelId] ? 'enabled' : 'disabled'}`);
      return newState;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'degraded': return 'text-yellow-500 bg-yellow-500/10';
      case 'down': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4" />;
      case 'down': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Model Performance</h1>
          <p className="text-muted-foreground">Monitor model accuracy, latency, and reliability</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Metrics
          </Button>
        </div>
      </div>

      {/* Model Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map((model) => (
          <Card key={model.id} className={!modelSettings[model.id] ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${model.color}20` }}>
                    <Brain className="w-4 h-4" style={{ color: model.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{model.name}</h3>
                    <p className="text-xs text-muted-foreground">{model.provider}</p>
                  </div>
                </div>
                <Switch 
                  checked={modelSettings[model.id]} 
                  onCheckedChange={() => toggleModel(model.id)}
                />
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getStatusColor(model.status)}>
                  {getStatusIcon(model.status)}
                  <span className="ml-1 capitalize">{model.status}</span>
                </Badge>
                <Badge variant="outline" className="text-xs">{model.version}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Accuracy</p>
                  <p className="font-semibold">{model.accuracy}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Latency</p>
                  <p className="font-semibold">{model.avgLatency}ms</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uptime</p>
                  <p className="font-semibold">{model.uptime}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Error Rate</p>
                  <p className="font-semibold">{model.errorRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
          <TabsTrigger value="accuracy">Accuracy by Task</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Latency Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Latency Trend (24h)</CardTitle>
              <CardDescription>Average response time across models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }} 
                    />
                    <Line type="monotone" dataKey="gpt4" stroke="#8B5CF6" strokeWidth={2} name="GPT-4" dot={false} />
                    <Line type="monotone" dataKey="gpt35" stroke="#06B6D4" strokeWidth={2} name="GPT-3.5" dot={false} />
                    <Line type="monotone" dataKey="claude" stroke="#10B981" strokeWidth={2} name="Claude" dot={false} />
                    <Line type="monotone" dataKey="gemini" stroke="#F59E0B" strokeWidth={2} name="Gemini" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <Badge className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Target className="w-3 h-3" /> Accuracy
                        </span>
                        <span className="font-medium">{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Activity className="w-3 h-3" /> Uptime
                        </span>
                        <span className="font-medium">{model.uptime}%</span>
                      </div>
                      <Progress value={model.uptime} className="h-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-lg font-bold">{model.avgLatency}ms</p>
                        <p className="text-xs text-muted-foreground">Avg Latency</p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-lg font-bold">{model.p95Latency}ms</p>
                        <p className="text-xs text-muted-foreground">P95 Latency</p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-lg font-bold">{model.requests24h}</p>
                        <p className="text-xs text-muted-foreground">24h Requests</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.map(cap => (
                        <Badge key={cap} variant="outline" className="text-xs capitalize">{cap}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Comparison Radar</CardTitle>
              <CardDescription>Compare models across key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid className="stroke-muted" />
                    <PolarAngleAxis dataKey="metric" className="text-xs" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="GPT-4" dataKey="GPT4" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                    <Radar name="GPT-3.5" dataKey="GPT35" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} />
                    <Radar name="Claude" dataKey="Claude" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                    <Radar name="Gemini" dataKey="Gemini" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Accuracy by Task Type</CardTitle>
              <CardDescription>Performance comparison across different use cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={accuracyByTask} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="task" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="gpt4" fill="#8B5CF6" name="GPT-4" />
                    <Bar dataKey="gpt35" fill="#06B6D4" name="GPT-3.5" />
                    <Bar dataKey="claude" fill="#10B981" name="Claude" />
                    <Bar dataKey="gemini" fill="#F59E0B" name="Gemini" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>Enable/disable models and configure fallback behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${model.color}20` }}>
                        <Brain className="w-5 h-5" style={{ color: model.color }} />
                      </div>
                      <div>
                        <h3 className="font-medium">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">{model.provider} • ${model.costPer1kTokens}/1K tokens</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{modelSettings[model.id] ? 'Enabled' : 'Disabled'}</Badge>
                      <Switch 
                        checked={modelSettings[model.id]} 
                        onCheckedChange={() => toggleModel(model.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAIModels;
