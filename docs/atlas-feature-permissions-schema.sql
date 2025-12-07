-- =========================================================
-- ATLAS Feature Permissions & Notifications Schema
-- =========================================================
-- This schema defines tables for:
-- 1. Global Feature Registry - All available features in ATLAS
-- 2. Tenant Feature Flags - Features unlocked per tenant
-- 3. Role Permissions - Per-role feature access within tenant
-- 4. Employee Module Access - Individual employee feature access
-- 5. Notifications System - In-app and email notifications
-- =========================================================

-- =========================================================
-- 1. GLOBAL FEATURE REGISTRY
-- Purpose: Master list of all features available in ATLAS
-- Managed by: ATLAS Global Admin
-- =========================================================

CREATE TYPE public.feature_category AS ENUM (
  'core',           -- Core HR, Attendance, Leave
  'payroll',        -- Payroll, Compliance, Finance
  'talent',         -- Recruitment, BGV, Onboarding
  'operations',     -- Projects, Assets, Documents
  'compliance',     -- Compliance, Insurance, Governance
  'intelligence',   -- OpZenix, Proxima AI
  'integrations'    -- SSO, APIs, Third-party
);

CREATE TYPE public.feature_tier AS ENUM (
  'starter',        -- Basic plan features
  'professional',   -- Pro plan features
  'business',       -- Business plan features
  'enterprise'      -- Enterprise-only features
);

CREATE TABLE public.global_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT NOT NULL UNIQUE,           -- e.g., 'payroll.multi_currency'
  name TEXT NOT NULL,                         -- Display name
  description TEXT,                           -- Feature description
  category feature_category NOT NULL,
  minimum_tier feature_tier NOT NULL DEFAULT 'starter',
  is_addon BOOLEAN DEFAULT false,             -- Requires additional purchase
  addon_price_monthly DECIMAL(10,2),          -- Monthly addon price if applicable
  is_active BOOLEAN DEFAULT true,             -- Feature enabled globally
  is_beta BOOLEAN DEFAULT false,              -- Beta feature flag
  released_at TIMESTAMP WITH TIME ZONE,       -- When feature was released
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX idx_global_features_category ON public.global_features(category);
CREATE INDEX idx_global_features_tier ON public.global_features(minimum_tier);

-- =========================================================
-- 2. TENANT FEATURE FLAGS
-- Purpose: Features unlocked per tenant based on subscription
-- Managed by: ATLAS Global Admin
-- =========================================================

CREATE TABLE public.tenant_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES public.global_features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT true,
  enabled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  enabled_by UUID,                            -- Admin who enabled
  expires_at TIMESTAMP WITH TIME ZONE,        -- For trial features
  is_trial BOOLEAN DEFAULT false,
  trial_days_remaining INTEGER,
  notes TEXT,                                 -- Admin notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id, feature_id)
);

-- Index for tenant feature lookups
CREATE INDEX idx_tenant_features_tenant ON public.tenant_features(tenant_id);
CREATE INDEX idx_tenant_features_enabled ON public.tenant_features(is_enabled);

-- =========================================================
-- 3. ROLE-BASED PERMISSIONS
-- Purpose: Default feature access per role within tenant
-- Managed by: Tenant Super-Admin
-- =========================================================

CREATE TYPE public.tenant_role AS ENUM (
  'super_admin',    -- Full access
  'admin',          -- Administrative access
  'manager',        -- Team/department manager
  'employee',       -- Regular employee
  'contractor',     -- External contractor
  'viewer'          -- Read-only access
);

CREATE TABLE public.role_feature_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
  role tenant_role NOT NULL,
  feature_id UUID NOT NULL REFERENCES public.global_features(id) ON DELETE CASCADE,
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_export BOOLEAN DEFAULT false,
  custom_permissions JSONB DEFAULT '{}',      -- Additional custom permissions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id, role, feature_id)
);

-- Index for role permission lookups
CREATE INDEX idx_role_permissions_tenant ON public.role_feature_defaults(tenant_id);
CREATE INDEX idx_role_permissions_role ON public.role_feature_defaults(role);

-- =========================================================
-- 4. EMPLOYEE MODULE ACCESS
-- Purpose: Individual employee feature overrides
-- Managed by: Tenant Super-Admin
-- =========================================================

CREATE TABLE public.employee_feature_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL,                  -- References employee record
  user_id UUID NOT NULL,                      -- References auth user
  feature_id UUID NOT NULL REFERENCES public.global_features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT true,
  override_role_default BOOLEAN DEFAULT false, -- Overrides role-based setting
  can_view BOOLEAN DEFAULT true,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_export BOOLEAN DEFAULT false,
  enabled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  enabled_by UUID,                            -- Tenant admin who enabled
  is_new BOOLEAN DEFAULT true,                -- Shows "NEW" badge in UI
  new_badge_expires_at TIMESTAMP WITH TIME ZONE, -- When to hide NEW badge
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id, employee_id, feature_id)
);

-- Indexes for employee access lookups
CREATE INDEX idx_employee_access_tenant ON public.employee_feature_access(tenant_id);
CREATE INDEX idx_employee_access_user ON public.employee_feature_access(user_id);
CREATE INDEX idx_employee_access_enabled ON public.employee_feature_access(is_enabled);
CREATE INDEX idx_employee_access_new ON public.employee_feature_access(is_new);

-- =========================================================
-- 5. NOTIFICATIONS SYSTEM
-- Purpose: In-app and email notifications for feature unlocks
-- =========================================================

CREATE TYPE public.notification_type AS ENUM (
  'feature_unlock',     -- New feature enabled
  'feature_trial',      -- Trial feature available
  'feature_expiring',   -- Trial/addon expiring soon
  'system_update',      -- Platform updates
  'security_alert',     -- Security notifications
  'action_required',    -- User action needed
  'info'               -- General information
);

CREATE TYPE public.notification_channel AS ENUM (
  'in_app',
  'email',
  'both'
);

CREATE TYPE public.notification_priority AS ENUM (
  'low',
  'normal',
  'high',
  'urgent'
);

CREATE TABLE public.employee_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,                      -- Recipient user
  notification_type notification_type NOT NULL,
  channel notification_channel DEFAULT 'both',
  priority notification_priority DEFAULT 'normal',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,                            -- Link to relevant page
  action_label TEXT,                          -- Button text for action
  feature_id UUID REFERENCES public.global_features(id), -- Related feature if applicable
  metadata JSONB DEFAULT '{}',                -- Additional data
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  is_email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  email_error TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,        -- Auto-dismiss after
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for notification queries
CREATE INDEX idx_notifications_user ON public.employee_notifications(user_id);
CREATE INDEX idx_notifications_tenant ON public.employee_notifications(tenant_id);
CREATE INDEX idx_notifications_unread ON public.employee_notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_type ON public.employee_notifications(notification_type);
CREATE INDEX idx_notifications_created ON public.employee_notifications(created_at DESC);

-- =========================================================
-- 6. NOTIFICATION PREFERENCES
-- Purpose: User preferences for notification delivery
-- =========================================================

CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  feature_unlock_channel notification_channel DEFAULT 'both',
  system_update_channel notification_channel DEFAULT 'in_app',
  security_alert_channel notification_channel DEFAULT 'both',
  action_required_channel notification_channel DEFAULT 'both',
  email_digest_enabled BOOLEAN DEFAULT false,
  email_digest_frequency TEXT DEFAULT 'daily', -- daily, weekly
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =========================================================
-- 7. FEATURE UNLOCK AUDIT LOG
-- Purpose: Track all feature enable/disable actions
-- =========================================================

CREATE TABLE public.feature_unlock_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.client_tenants(id),
  feature_id UUID NOT NULL REFERENCES public.global_features(id),
  action TEXT NOT NULL,                       -- 'enabled', 'disabled', 'trial_started', 'trial_expired'
  target_type TEXT NOT NULL,                  -- 'tenant', 'role', 'employee'
  target_id UUID,                             -- tenant_id, role record id, or employee_id
  performed_by UUID NOT NULL,                 -- User who performed action
  performed_by_type TEXT NOT NULL,            -- 'atlas_admin', 'tenant_admin'
  previous_state JSONB,
  new_state JSONB,
  reason TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for audit queries
CREATE INDEX idx_feature_log_tenant ON public.feature_unlock_log(tenant_id);
CREATE INDEX idx_feature_log_feature ON public.feature_unlock_log(feature_id);
CREATE INDEX idx_feature_log_created ON public.feature_unlock_log(created_at DESC);

-- =========================================================
-- RLS POLICIES
-- =========================================================

ALTER TABLE public.global_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_feature_defaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_feature_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_unlock_log ENABLE ROW LEVEL SECURITY;

-- Global Features: ATLAS admins can manage, everyone can read active features
CREATE POLICY "ATLAS admins can manage global features"
  ON public.global_features FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view active features"
  ON public.global_features FOR SELECT
  USING (is_active = true);

-- Tenant Features: ATLAS admins manage, tenant users can view their tenant's features
CREATE POLICY "ATLAS admins can manage tenant features"
  ON public.tenant_features FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Tenant users can view their features"
  ON public.tenant_features FOR SELECT
  USING (tenant_id IN (
    SELECT ctu.tenant_id FROM public.client_tenant_users ctu WHERE ctu.user_id = auth.uid()
  ));

-- Role Defaults: Tenant admins manage, users can view
CREATE POLICY "Tenant admins can manage role defaults"
  ON public.role_feature_defaults FOR ALL
  USING (
    has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.client_tenant_users ctu 
      WHERE ctu.user_id = auth.uid() 
      AND ctu.tenant_id = role_feature_defaults.tenant_id 
      AND ctu.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Tenant users can view role defaults"
  ON public.role_feature_defaults FOR SELECT
  USING (tenant_id IN (
    SELECT ctu.tenant_id FROM public.client_tenant_users ctu WHERE ctu.user_id = auth.uid()
  ));

-- Employee Access: Tenant admins manage, employees can view their own
CREATE POLICY "Tenant admins can manage employee access"
  ON public.employee_feature_access FOR ALL
  USING (
    has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.client_tenant_users ctu 
      WHERE ctu.user_id = auth.uid() 
      AND ctu.tenant_id = employee_feature_access.tenant_id 
      AND ctu.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Employees can view their own access"
  ON public.employee_feature_access FOR SELECT
  USING (user_id = auth.uid());

-- Notifications: Users can view and update their own
CREATE POLICY "Users can view their notifications"
  ON public.employee_notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications"
  ON public.employee_notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.employee_notifications FOR INSERT
  WITH CHECK (true);

-- Notification Preferences: Users manage their own
CREATE POLICY "Users can manage their notification preferences"
  ON public.notification_preferences FOR ALL
  USING (user_id = auth.uid());

-- Feature Unlock Log: ATLAS admins and tenant admins can view
CREATE POLICY "Admins can view feature logs"
  ON public.feature_unlock_log FOR SELECT
  USING (
    has_role(auth.uid(), 'admin') OR
    (tenant_id IS NOT NULL AND tenant_id IN (
      SELECT ctu.tenant_id FROM public.client_tenant_users ctu 
      WHERE ctu.user_id = auth.uid() AND ctu.role IN ('super_admin', 'admin')
    ))
  );

CREATE POLICY "System can create feature logs"
  ON public.feature_unlock_log FOR INSERT
  WITH CHECK (true);

-- =========================================================
-- HELPER FUNCTIONS
-- =========================================================

-- Check if a feature is enabled for a user
CREATE OR REPLACE FUNCTION public.is_feature_enabled_for_user(
  p_user_id UUID,
  p_feature_key TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_feature_id UUID;
  v_tenant_id UUID;
  v_is_enabled BOOLEAN;
BEGIN
  -- Get feature ID
  SELECT id INTO v_feature_id FROM public.global_features 
  WHERE feature_key = p_feature_key AND is_active = true;
  
  IF v_feature_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get user's tenant
  SELECT ctu.tenant_id INTO v_tenant_id 
  FROM public.client_tenant_users ctu 
  WHERE ctu.user_id = p_user_id 
  LIMIT 1;
  
  IF v_tenant_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check tenant feature flag
  SELECT is_enabled INTO v_is_enabled 
  FROM public.tenant_features 
  WHERE tenant_id = v_tenant_id AND feature_id = v_feature_id;
  
  IF v_is_enabled IS NULL OR v_is_enabled = false THEN
    RETURN false;
  END IF;
  
  -- Check employee-specific access
  SELECT is_enabled INTO v_is_enabled 
  FROM public.employee_feature_access 
  WHERE user_id = p_user_id AND feature_id = v_feature_id;
  
  IF v_is_enabled IS NOT NULL THEN
    RETURN v_is_enabled;
  END IF;
  
  -- Fall back to role-based default
  RETURN true; -- If tenant has feature and no employee override, allow
END;
$$;

-- Create notification for feature unlock
CREATE OR REPLACE FUNCTION public.notify_feature_unlock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_feature_name TEXT;
BEGIN
  -- Get feature name
  SELECT name INTO v_feature_name FROM public.global_features WHERE id = NEW.feature_id;
  
  -- Create notification
  INSERT INTO public.employee_notifications (
    tenant_id,
    user_id,
    notification_type,
    channel,
    priority,
    title,
    message,
    action_url,
    action_label,
    feature_id
  ) VALUES (
    NEW.tenant_id,
    NEW.user_id,
    'feature_unlock',
    'both',
    'normal',
    'New Feature Unlocked!',
    format('You now have access to %s. Explore it now!', v_feature_name),
    '/portal',
    'Explore Feature',
    NEW.feature_id
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for employee feature access
CREATE TRIGGER on_employee_feature_enabled
  AFTER INSERT ON public.employee_feature_access
  FOR EACH ROW
  WHEN (NEW.is_enabled = true)
  EXECUTE FUNCTION public.notify_feature_unlock();

-- =========================================================
-- SEED DATA: Default Features
-- =========================================================

INSERT INTO public.global_features (feature_key, name, description, category, minimum_tier) VALUES
-- Core Features
('core.employee_directory', 'Employee Directory', 'View and manage employee profiles', 'core', 'starter'),
('core.org_chart', 'Organization Chart', 'Visual organization hierarchy', 'core', 'starter'),
('core.documents', 'Document Management', 'Upload and manage documents', 'core', 'starter'),
('core.announcements', 'Announcements', 'Company-wide announcements', 'core', 'starter'),

-- Payroll Features
('payroll.basic', 'Basic Payroll', 'Standard payroll processing', 'payroll', 'starter'),
('payroll.multi_currency', 'Multi-Currency Payroll', 'Process payroll in multiple currencies', 'payroll', 'business'),
('payroll.advanced_compliance', 'Advanced Compliance', 'Automated compliance filings', 'payroll', 'professional'),

-- Attendance Features
('core.attendance', 'Attendance Tracking', 'Track employee attendance', 'core', 'starter'),
('core.leave_management', 'Leave Management', 'Manage leave requests', 'core', 'starter'),
('core.geofence_attendance', 'Geofence Attendance', 'Location-based attendance', 'core', 'professional'),

-- Talent Features
('talent.recruitment', 'Recruitment', 'Job postings and ATS', 'talent', 'professional'),
('talent.bgv', 'Background Verification', 'BGV integration', 'talent', 'business'),
('talent.performance', 'Performance Management', 'Reviews and OKRs', 'talent', 'professional'),

-- Operations Features
('operations.projects', 'Project Management', 'Track projects and tasks', 'operations', 'professional'),
('operations.assets', 'Asset Management', 'Track company assets', 'operations', 'professional'),
('operations.visitors', 'Visitor Management', 'Track visitors', 'operations', 'business'),

-- Intelligence Features
('intelligence.opzenix', 'OpZenix Automation', 'Workflow automation', 'intelligence', 'business'),
('intelligence.proxima_basic', 'Proxima AI Basic', 'Basic AI insights', 'intelligence', 'professional'),
('intelligence.proxima_advanced', 'Proxima AI Advanced', 'Advanced predictive analytics', 'intelligence', 'enterprise'),

-- Integration Features
('integrations.sso', 'SSO Integration', 'Single Sign-On support', 'integrations', 'business'),
('integrations.api_access', 'API Access', 'REST API access', 'integrations', 'business'),
('integrations.custom_webhooks', 'Custom Webhooks', 'Custom webhook integrations', 'integrations', 'enterprise');
