import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Search, Terminal, AlertCircle, AlertTriangle, Info, Bug, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SystemLog {
  id: string;
  level: string;
  source: string;
  message: string;
  metadata: any;
  created_at: string;
}

export const AdminSystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (levelFilter !== 'all') {
        query = query.eq('level', levelFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    const channel = supabase
      .channel('system-logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_logs' }, (payload) => {
        setLogs(prev => [payload.new as SystemLog, ...prev.slice(0, 199)]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [levelFilter]);

  const levelIcons: Record<string, any> = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    debug: Bug,
  };

  const levelColors: Record<string, string> = {
    info: "bg-blue-100 text-blue-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
    debug: "bg-slate-100 text-slate-800",
  };

  const filteredLogs = logs.filter(log =>
    log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">System Logs</h1>
          <p className="text-muted-foreground">Real-time system and application logs</p>
        </div>
        <Button onClick={fetchLogs} disabled={loading} variant="outline" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline">{filteredLogs.length} entries</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No system logs found</p>
            </div>
          ) : (
            <div className="font-mono text-sm space-y-1 max-h-[600px] overflow-auto">
              {filteredLogs.map((log) => {
                const Icon = levelIcons[log.level] || Info;
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                    <Badge className={`${levelColors[log.level]} text-xs px-1.5`}>
                      {log.level.toUpperCase()}
                    </Badge>
                    <span className="text-cyan-600 whitespace-nowrap">[{log.source}]</span>
                    <span className="flex-1 break-all">{log.message}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
