-- Create client tenants table for multi-tenancy
CREATE TABLE public.client_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tenant_type TEXT NOT NULL DEFAULT 'individual', -- individual, startup, enterprise
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, suspended, inactive
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  logo_url TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client tenant users junction table
CREATE TABLE public.client_tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.client_tenants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client MSP servers table
CREATE TABLE public.client_msp_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.client_tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  server_type TEXT NOT NULL DEFAULT 'web', -- web, database, application, file
  ip_address TEXT,
  hostname TEXT,
  status TEXT NOT NULL DEFAULT 'unknown', -- online, offline, warning, unknown
  last_ping_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client MSP metrics table
CREATE TABLE public.client_msp_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.client_msp_servers(id) ON DELETE CASCADE NOT NULL,
  cpu_usage DECIMAL(5,2),
  memory_usage DECIMAL(5,2),
  disk_usage DECIMAL(5,2),
  network_in BIGINT,
  network_out BIGINT,
  uptime_seconds BIGINT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client MSP alerts table
CREATE TABLE public.client_msp_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.client_msp_servers(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.client_tenants(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL, -- cpu_high, memory_high, disk_full, downtime, security
  severity TEXT NOT NULL DEFAULT 'warning', -- info, warning, critical
  message TEXT NOT NULL,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin settings table (for admin panel configuration)
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin notifications table
CREATE TABLE public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL DEFAULT 'info', -- info, warning, error, success
  is_read BOOLEAN NOT NULL DEFAULT false,
  target_admin_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add tenant_id to profiles for multi-tenancy
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.client_tenants(id) ON DELETE SET NULL;

-- Enable RLS on all new tables
ALTER TABLE public.client_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_msp_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_msp_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_msp_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_tenants
CREATE POLICY "Admins can manage tenants" ON public.client_tenants FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own tenant" ON public.client_tenants FOR SELECT USING (
  id IN (SELECT tenant_id FROM public.client_tenant_users WHERE user_id = auth.uid())
);

-- RLS Policies for client_tenant_users
CREATE POLICY "Admins can manage tenant users" ON public.client_tenant_users FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own tenant users" ON public.client_tenant_users FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for client_msp_servers
CREATE POLICY "Admins can manage MSP servers" ON public.client_msp_servers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own tenant servers" ON public.client_msp_servers FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM public.client_tenant_users WHERE user_id = auth.uid())
);

-- RLS Policies for client_msp_metrics
CREATE POLICY "Admins can manage MSP metrics" ON public.client_msp_metrics FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own tenant metrics" ON public.client_msp_metrics FOR SELECT USING (
  server_id IN (
    SELECT s.id FROM public.client_msp_servers s
    JOIN public.client_tenant_users tu ON s.tenant_id = tu.tenant_id
    WHERE tu.user_id = auth.uid()
  )
);

-- RLS Policies for client_msp_alerts
CREATE POLICY "Admins can manage MSP alerts" ON public.client_msp_alerts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own tenant alerts" ON public.client_msp_alerts FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM public.client_tenant_users WHERE user_id = auth.uid())
);

-- RLS Policies for admin_settings
CREATE POLICY "Admins can manage admin settings" ON public.admin_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for admin_notifications
CREATE POLICY "Admins can manage admin notifications" ON public.admin_notifications FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for MSP monitoring
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_msp_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_msp_alerts;