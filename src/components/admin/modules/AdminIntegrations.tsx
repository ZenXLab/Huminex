import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw, Plug, Zap, Cloud, Mail, CreditCard, MessageSquare, Loader2 } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  last_sync_at: string | null;
  config: any;
  created_at: string;
}

const defaultIntegrations = [
  { name: "Stripe", type: "payment", icon: CreditCard, description: "Payment processing" },
  { name: "Resend", type: "email", icon: Mail, description: "Email delivery" },
  { name: "Slack", type: "communication", icon: MessageSquare, description: "Team notifications" },
  { name: "AWS S3", type: "storage", icon: Cloud, description: "File storage" },
  { name: "Zapier", type: "automation", icon: Zap, description: "Workflow automation" },
];

export const AdminIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('name');

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleToggle = async (integration: Integration) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ is_active: !integration.is_active })
        .eq('id', integration.id);

      if (error) throw error;
      toast.success(`${integration.name} ${integration.is_active ? 'disabled' : 'enabled'}`);
      fetchIntegrations();
    } catch (error) {
      toast.error('Failed to update integration');
    }
  };

  const handleCreate = async (name: string, type: string) => {
    try {
      const { error } = await supabase.from('integrations').insert({
        name,
        type,
        is_active: false,
        config: {},
      });

      if (error) throw error;
      toast.success(`${name} integration added`);
      fetchIntegrations();
    } catch (error) {
      toast.error('Failed to add integration');
    }
  };

  const getIcon = (type: string) => {
    const found = defaultIntegrations.find(i => i.type === type);
    return found?.icon || Plug;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground">Manage third-party connections</p>
        </div>
        <Button onClick={fetchIntegrations} disabled={loading} variant="outline" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Active Integrations */}
          {integrations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Configured Integrations</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.map((integration) => {
                  const Icon = getIcon(integration.type);
                  return (
                    <Card key={integration.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{integration.name}</h3>
                              <p className="text-sm text-muted-foreground capitalize">{integration.type}</p>
                              {integration.last_sync_at && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Last sync: {new Date(integration.last_sync_at).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={integration.is_active ? "default" : "secondary"}>
                              {integration.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Switch
                              checked={integration.is_active}
                              onCheckedChange={() => handleToggle(integration)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Integrations */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Available Integrations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {defaultIntegrations
                .filter(di => !integrations.some(i => i.name === di.name))
                .map((integration) => (
                  <Card key={integration.name} className="border-dashed">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <integration.icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{integration.name}</h3>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCreate(integration.name, integration.type)}
                        >
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
