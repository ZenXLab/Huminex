-- TRACEFLOW RBAC & Enterprise Trust Layer Tables

-- Create traceflow_roles enum
DO $$ BEGIN
  CREATE TYPE traceflow_role AS ENUM ('owner', 'admin', 'analyst', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Traceflow Team Members with RBAC
CREATE TABLE IF NOT EXISTS public.traceflow_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.traceflow_subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  role traceflow_role NOT NULL DEFAULT 'viewer',
  invited_by UUID,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Feature Access Control (RBAC)
CREATE TABLE IF NOT EXISTS public.traceflow_feature_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.traceflow_subscriptions(id) ON DELETE CASCADE,
  feature_id TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  feature_description TEXT,
  is_enabled BOOLEAN DEFAULT false,
  enabled_for_roles traceflow_role[] DEFAULT ARRAY['owner', 'admin']::traceflow_role[],
  usage_limit INTEGER,
  current_usage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(subscription_id, feature_id)
);

-- Enterprise Audit Logs
CREATE TABLE IF NOT EXISTS public.traceflow_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.traceflow_subscriptions(id) ON DELETE CASCADE,
  user_id UUID,
  user_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SSO/SAML Configuration
CREATE TABLE IF NOT EXISTS public.traceflow_sso_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.traceflow_subscriptions(id) ON DELETE CASCADE UNIQUE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'microsoft', 'okta', 'saml')),
  is_enabled BOOLEAN DEFAULT false,
  domain TEXT,
  client_id TEXT,
  metadata_url TEXT,
  certificate TEXT,
  enforce_sso BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Data Retention & Compliance Settings
CREATE TABLE IF NOT EXISTS public.traceflow_compliance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.traceflow_subscriptions(id) ON DELETE CASCADE UNIQUE,
  data_retention_days INTEGER DEFAULT 90,
  pii_masking_enabled BOOLEAN DEFAULT true,
  session_recording_enabled BOOLEAN DEFAULT true,
  gdpr_mode BOOLEAN DEFAULT false,
  hipaa_mode BOOLEAN DEFAULT false,
  allowed_domains TEXT[],
  blocked_ips TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- API Keys for SDK Integration
CREATE TABLE IF NOT EXISTS public.traceflow_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.traceflow_subscriptions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['read', 'write'],
  rate_limit INTEGER DEFAULT 1000,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.traceflow_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_feature_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_sso_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_compliance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceflow_api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team members
CREATE POLICY "Users can view team in their subscription" ON public.traceflow_team_members
  FOR SELECT USING (
    subscription_id IN (
      SELECT id FROM public.traceflow_subscriptions WHERE user_id = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Owners and admins can manage team" ON public.traceflow_team_members
  FOR ALL USING (
    subscription_id IN (
      SELECT id FROM public.traceflow_subscriptions WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for feature access
CREATE POLICY "Users can view features in their subscription" ON public.traceflow_feature_access
  FOR SELECT USING (
    subscription_id IN (
      SELECT id FROM public.traceflow_subscriptions WHERE user_id = auth.uid()
    ) OR subscription_id IN (
      SELECT subscription_id FROM public.traceflow_team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage features" ON public.traceflow_feature_access
  FOR ALL USING (
    subscription_id IN (
      SELECT id FROM public.traceflow_subscriptions WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for audit logs
CREATE POLICY "Users can view audit logs in their subscription" ON public.traceflow_audit_logs
  FOR SELECT USING (
    subscription_id IN (
      SELECT id FROM public.traceflow_subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert audit logs" ON public.traceflow_audit_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for SSO config
CREATE POLICY "Owners can manage SSO" ON public.traceflow_sso_config
  FOR ALL USING (
    subscription_id IN (
      SELECT id FROM public.traceflow_subscriptions WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for compliance settings
CREATE POLICY "Owners can manage compliance" ON public.traceflow_compliance_settings
  FOR ALL USING (
    subscription_id IN (
      SELECT id FROM public.traceflow_subscriptions WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for API keys
CREATE POLICY "Users can view API keys in their subscription" ON public.traceflow_api_keys
  FOR SELECT USING (
    subscription_id IN (
      SELECT id FROM public.traceflow_subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage API keys" ON public.traceflow_api_keys
  FOR ALL USING (
    subscription_id IN (
      SELECT id FROM public.traceflow_subscriptions WHERE user_id = auth.uid()
    )
  );

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.traceflow_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.traceflow_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.traceflow_ux_issues;
ALTER PUBLICATION supabase_realtime ADD TABLE public.traceflow_neurorouter_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.traceflow_audit_logs;

-- Admin check function for TRACEFLOW
CREATE OR REPLACE FUNCTION public.is_traceflow_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id AND role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM public.traceflow_subscriptions
    WHERE user_id = check_user_id AND role IN ('admin', 'owner')
  )
$$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_traceflow_team_subscription ON public.traceflow_team_members(subscription_id);
CREATE INDEX IF NOT EXISTS idx_traceflow_team_user ON public.traceflow_team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_traceflow_feature_subscription ON public.traceflow_feature_access(subscription_id);
CREATE INDEX IF NOT EXISTS idx_traceflow_audit_subscription ON public.traceflow_audit_logs(subscription_id);
CREATE INDEX IF NOT EXISTS idx_traceflow_audit_created ON public.traceflow_audit_logs(created_at DESC);