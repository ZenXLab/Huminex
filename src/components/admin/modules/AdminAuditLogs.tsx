import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Search, Activity, User, FileText, Settings, Loader2 } from "lucide-react";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  created_at: string;
}

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

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
      .channel('audit-logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, (payload) => {
        setLogs(prev => [payload.new as AuditLog, ...prev.slice(0, 99)]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getActionIcon = (action: string) => {
    if (action.includes('user') || action.includes('profile')) return User;
    if (action.includes('quote') || action.includes('invoice')) return FileText;
    if (action.includes('setting')) return Settings;
    return Activity;
  };

  const getActionColor = (action: string) => {
    if (action.includes('create') || action.includes('approve')) return "bg-emerald-100 text-emerald-800";
    if (action.includes('update') || action.includes('edit')) return "bg-blue-100 text-blue-800";
    if (action.includes('delete') || action.includes('reject')) return "bg-red-100 text-red-800";
    return "bg-slate-100 text-slate-800";
  };

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entity_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">Track all system activities in real-time</p>
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
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit logs found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => {
                const Icon = getActionIcon(log.action);
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                        <span className="text-sm text-muted-foreground">{log.entity_type}</span>
                        {log.entity_id && (
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {log.entity_id.slice(0, 8)}...
                          </code>
                        )}
                      </div>
                      {log.new_values && Object.keys(log.new_values).length > 0 && (
                        <pre className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.new_values, null, 2)}
                        </pre>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                      <p>{new Date(log.created_at).toLocaleDateString()}</p>
                      <p>{new Date(log.created_at).toLocaleTimeString()}</p>
                    </div>
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
