-- Create client_onboarding table for tracking onboarding requests pending approval
CREATE TABLE public.client_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  service_interests JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table for tracking all admin actions
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clickstream_events table for tracking user behavior
CREATE TABLE public.clickstream_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  page_url TEXT,
  element_id TEXT,
  element_class TEXT,
  element_text TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system_logs table for system-level logging
CREATE TABLE public.system_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error', 'debug')),
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_notices table for sending notices to clients
CREATE TABLE public.client_notices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  notice_type TEXT NOT NULL DEFAULT 'info' CHECK (notice_type IN ('info', 'warning', 'urgent', 'maintenance')),
  target_type TEXT NOT NULL DEFAULT 'all' CHECK (target_type IN ('all', 'specific')),
  target_users JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compliance_items table
CREATE TABLE public.compliance_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  due_date DATE,
  assigned_to UUID REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create api_usage table
CREATE TABLE public.api_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  request_body JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create integrations table
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT false,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portal_settings table
CREATE TABLE public.portal_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.client_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clickstream_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_settings ENABLE ROW LEVEL SECURITY;

-- Admin policies for client_onboarding
CREATE POLICY "Admins can manage onboarding" ON public.client_onboarding
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for audit_logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Admin policies for clickstream_events
CREATE POLICY "Admins can view clickstream" ON public.clickstream_events
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert clickstream" ON public.clickstream_events
  FOR INSERT WITH CHECK (true);

-- Admin policies for system_logs
CREATE POLICY "Admins can view system logs" ON public.system_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert system logs" ON public.system_logs
  FOR INSERT WITH CHECK (true);

-- Admin policies for client_notices
CREATE POLICY "Admins can manage notices" ON public.client_notices
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view active notices" ON public.client_notices
  FOR SELECT USING (
    is_active = true AND 
    (expires_at IS NULL OR expires_at > now()) AND
    (target_type = 'all' OR auth.uid()::text = ANY(SELECT jsonb_array_elements_text(target_users)))
  );

-- Admin policies for compliance_items
CREATE POLICY "Admins can manage compliance" ON public.compliance_items
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for api_usage
CREATE POLICY "Admins can view api usage" ON public.api_usage
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert api usage" ON public.api_usage
  FOR INSERT WITH CHECK (true);

-- Admin policies for integrations
CREATE POLICY "Admins can manage integrations" ON public.integrations
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for portal_settings
CREATE POLICY "Admins can manage settings" ON public.portal_settings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_onboarding;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clickstream_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_notices;