import React, { useState } from "react";
import { Brain, Sparkles, Send, TrendingUp, Users, AlertTriangle, Lightbulb, MessageSquare, BarChart3, Zap, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const insights = [
  {
    id: 1,
    type: "attrition",
    title: "High Attrition Risk Detected",
    description: "Operations team showing 23% attrition risk based on engagement scores and tenure patterns.",
    severity: "high",
    recommendation: "Schedule 1-on-1s with at-risk employees and review compensation benchmarks.",
    impact: "5 employees at high risk"
  },
  {
    id: 2,
    type: "payroll",
    title: "Payroll Anomaly Detected",
    description: "Unusual overtime patterns in Engineering department for the past 3 weeks.",
    severity: "medium",
    recommendation: "Review project timelines and consider resource reallocation.",
    impact: "₹2.4L additional cost"
  },
  {
    id: 3,
    type: "compliance",
    title: "Upcoming Compliance Deadline",
    description: "PF return filing deadline in 8 days. 12 employee records need verification.",
    severity: "medium",
    recommendation: "Complete verification of flagged records before Dec 12.",
    impact: "12 records pending"
  },
  {
    id: 4,
    type: "performance",
    title: "Performance Improvement Opportunity",
    description: "Sales team exceeded targets by 15% this quarter. Consider recognition program.",
    severity: "positive",
    recommendation: "Implement spot bonus or recognition awards.",
    impact: "+15% above target"
  },
];

const suggestedPrompts = [
  "Why is attrition risk high in Operations?",
  "Show me payroll trends for Q4",
  "Predict hiring needs for next quarter",
  "Analyze employee engagement by department",
  "Generate compliance summary report",
];

const TenantProximaAI: React.FC = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hello! I'm Proxima, your AI-powered insights assistant. Ask me anything about your workforce, payroll, compliance, or operations. How can I help you today?" }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-[#E23E57]/10 text-[#E23E57] border-[#E23E57]/20";
      case "medium": return "bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20";
      case "low": return "bg-[#005EEB]/10 text-[#005EEB] border-[#005EEB]/20";
      case "positive": return "bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20";
      default: return "bg-[#6B7280]/10 text-[#6B7280]";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attrition": return <Users className="w-5 h-5 text-[#E23E57]" />;
      case "payroll": return <BarChart3 className="w-5 h-5 text-[#FFB020]" />;
      case "compliance": return <AlertTriangle className="w-5 h-5 text-[#005EEB]" />;
      case "performance": return <TrendingUp className="w-5 h-5 text-[#0FB07A]" />;
      default: return <Lightbulb className="w-5 h-5 text-[#6B7280]" />;
    }
  };

  const handleSend = () => {
    if (!query.trim()) return;
    setMessages([...messages, { role: "user", content: query }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Based on my analysis of your data regarding "${query}", here are the key findings:\n\n• The Operations team has shown declining engagement scores over the past 3 months\n• Exit interviews indicate concerns about career growth and workload\n• Comparable roles in the market are paying 12% higher\n\nI recommend scheduling skip-level meetings and conducting a compensation benchmark analysis. Would you like me to create an OpZenix workflow to automate follow-ups?`
      }]);
    }, 1000);
    setQuery("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F1E3A]">Proxima AI</h1>
            <p className="text-sm text-[#6B7280]">AI-powered workforce intelligence</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Chat */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#8B5CF6]" />
              Ask ATLAS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-[#005EEB] text-white' 
                      : 'bg-[#F7F9FC] text-[#0F1E3A]'
                  }`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                        <span className="text-xs font-semibold text-[#8B5CF6]">Proxima</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Prompts */}
            <div className="px-4 py-3 border-t border-b bg-[#F7F9FC]/50">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs text-[#6B7280] flex-shrink-0">Try:</span>
                {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 flex-shrink-0"
                    onClick={() => setQuery(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Ask Proxima anything..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} className="bg-[#8B5CF6] hover:bg-[#7C3AED] gap-2">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0F1E3A]">12</p>
                  <p className="text-xs text-[#6B7280]">Active Insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0FB07A]/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#0FB07A]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0F1E3A]">89%</p>
                  <p className="text-xs text-[#6B7280]">Prediction Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FFB020]/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#FFB020]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0F1E3A]">3</p>
                  <p className="text-xs text-[#6B7280]">Actions Required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Insights Grid */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">AI-Generated Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <div key={insight.id} className="p-4 border border-gray-100 rounded-lg hover:bg-[#F7F9FC] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F7F9FC] flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-[#0F1E3A]">{insight.title}</h4>
                      <Badge className={getSeverityColor(insight.severity)}>
                        {insight.severity === 'positive' ? 'Positive' : insight.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6B7280] mb-2">{insight.description}</p>
                    <div className="p-2 bg-[#F7F9FC] rounded text-xs">
                      <span className="font-medium text-[#005EEB]">Recommendation:</span>
                      <span className="text-[#6B7280] ml-1">{insight.recommendation}</span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-2">Impact: {insight.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantProximaAI;
