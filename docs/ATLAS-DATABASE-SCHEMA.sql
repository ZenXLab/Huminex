-- ============================================================================
-- ATLAS DATABASE SCHEMA - COMPLETE SQL REFERENCE
-- ============================================================================
-- 
-- PURPOSE: Complete database schema for ATLAS Workforce Operating System
--          including all tables, functions, triggers, enums, and RLS policies
--
-- VERSION: 2.0.0
-- LAST UPDATED: December 2024
--
-- CONTENTS:
--   Part 1: Enums & Types
--   Part 2: Core Tables (Users, Profiles, Roles, Tenants)
--   Part 3: Sales & CRM Tables (Quotes, Invoices, Leads)
--   Part 4: Client Onboarding Tables
--   Part 5: Project Management Tables
--   Part 6: Support & Communication Tables
--   Part 7: File Management Tables
--   Part 8: MSP Monitoring Tables
--   Part 9: Pricing & Configuration Tables
--   Part 10: Admin & System Tables
--   Part 11: Logging & Analytics Tables
--   Part 12: Team & Compliance Tables
--   Part 13: Feature Permissions & Notifications Tables
--   Part 14: Database Functions
--   Part 15: Triggers
--   Part 16: Row Level Security (RLS) Policies
--   Part 17: Multi-Tenancy Schema (Advanced)
--
-- ============================================================================


-- ============================================================================
-- PART 1: ENUMS & TYPES
-- ============================================================================

-- User roles for RBAC
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Quote status workflow
CREATE TYPE public.quote_status AS ENUM (
    'draft',      -- Initial creation
    'pending',    -- Awaiting review
    'approved',   -- Approved by admin
    'rejected',   -- Rejected
    'converted'   -- Converted to invoice/project
);

-- Invoice status workflow
CREATE TYPE public.invoice_status AS ENUM (
    'draft',      -- Initial creation
    'sent',       -- Sent to client
    'paid',       -- Payment received
    'overdue',    -- Past due date
    'cancelled'   -- Cancelled
);

-- Feature permission enums
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

CREATE TYPE public.tenant_role AS ENUM (
    'super_admin',    -- Full access
    'admin',          -- Administrative access
    'manager',        -- Team/department manager
    'employee',       -- Regular employee
    'contractor',     -- External contractor
    'viewer'          -- Read-only access
);

CREATE TYPE public.notification_type AS ENUM (
    'feature_unlock',     -- New feature enabled
    'feature_trial',      -- Trial feature available
    'feature_expiring',   -- Trial/addon expiring soon
    'system_update',      -- Platform updates
    'security_alert',     -- Security notifications
    'action_required',    -- User action needed
    'info'                -- General information
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


-- ============================================================================
-- PART 2: CORE TABLES
-- ============================================================================

-- 2.1 User Profiles (linked to auth.users)
-- Purpose: Extended user information beyond Supabase auth
CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    full_name text,
    company_name text,
    phone text,
    tenant_id uuid,  -- Multi-tenancy link (FK added after client_tenants)
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Extended user profile information linked to auth.users';
COMMENT ON COLUMN public.profiles.tenant_id IS 'Optional link to client organization for multi-tenancy';

-- 2.2 User Roles (CRITICAL: Separate table for security)
-- Purpose: Role-based access control without privilege escalation risk
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, role)
);

COMMENT ON TABLE public.user_roles IS 'SECURITY: User roles stored separately to prevent privilege escalation';
COMMENT ON COLUMN public.user_roles.role IS 'admin = full platform access, user = standard access';

-- 2.3 Client Tenants (Multi-tenant organizations)
-- Purpose: Root table for multi-tenancy - each tenant is a client organization
CREATE TABLE public.client_tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,              -- URL-friendly identifier
    name text NOT NULL,
    contact_email text NOT NULL,
    contact_phone text,
    address text,
    logo_url text,
    status text DEFAULT 'pending',          -- pending/active/suspended
    tenant_type text DEFAULT 'individual',  -- individual/enterprise
    settings jsonb DEFAULT '{}',            -- Custom configuration
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.client_tenants IS 'Root table for multi-tenancy - each row is a client organization';

-- Add foreign key from profiles to client_tenants
ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_tenant_id_fkey 
    FOREIGN KEY (tenant_id) REFERENCES public.client_tenants(id);

-- 2.4 Client Tenant Users (User-Tenant membership)
-- Purpose: Links users to tenants with role assignments
CREATE TABLE public.client_tenant_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text DEFAULT 'member',             -- super_admin/admin/member/viewer
    created_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, user_id)
);

COMMENT ON TABLE public.client_tenant_users IS 'Many-to-many: links users to tenant organizations with roles';


-- ============================================================================
-- PART 3: SALES & CRM TABLES
-- ============================================================================

-- 3.1 Quotes (Sales pricing quotes)
CREATE TABLE public.quotes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number text NOT NULL,             -- Format: ATL-YYYY-XXXX
    user_id uuid REFERENCES public.profiles(id),
    
    -- Quote Configuration
    client_type text NOT NULL,              -- individual/startup/enterprise
    service_type text NOT NULL,
    complexity text NOT NULL,               -- basic/standard/advanced
    
    -- Pricing
    estimated_price numeric NOT NULL,
    discount_percent integer DEFAULT 0,
    final_price numeric NOT NULL,
    
    -- Add-ons & Features
    features jsonb DEFAULT '[]',
    addons jsonb DEFAULT '[]',
    coupon_code text,
    
    -- Contact Info
    contact_name text,
    contact_email text,
    contact_phone text,
    contact_company text,
    
    -- Status & Notes
    status quote_status DEFAULT 'pending',
    notes text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.quotes IS 'Sales quotes generated via pricing calculator';

-- 3.2 Invoices (Billing)
CREATE TABLE public.invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number text NOT NULL,           -- Format: INV-YYYY-XXXX
    user_id uuid REFERENCES public.profiles(id),
    quote_id uuid REFERENCES public.quotes(id),
    
    -- Amounts
    amount numeric NOT NULL,
    tax_percent numeric DEFAULT 18.00,      -- GST percentage
    tax_amount numeric NOT NULL,
    total_amount numeric NOT NULL,
    
    -- Status & Dates
    status invoice_status DEFAULT 'draft',
    due_date date,
    paid_at timestamptz,
    
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3.3 Leads (CRM)
CREATE TABLE public.leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    source text DEFAULT 'website',          -- website/referral/campaign
    status text DEFAULT 'new',              -- new/contacted/qualified/converted
    score integer DEFAULT 0,                -- Lead scoring (0-100)
    assigned_to uuid,
    notes text,
    last_contact_at timestamptz,
    converted_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3.4 Inquiries (Contact form submissions)
CREATE TABLE public.inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    service_interest text,
    message text,
    source text DEFAULT 'website',
    user_id uuid REFERENCES public.profiles(id),
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- PART 4: CLIENT ONBOARDING TABLES
-- ============================================================================

-- 4.1 Onboarding Sessions (Multi-step wizard)
CREATE TABLE public.onboarding_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id text NOT NULL,                -- Format: ATLS-YYYYMMDD-XXXX
    user_id uuid REFERENCES auth.users(id),
    quote_id uuid REFERENCES public.quotes(id),
    
    -- Client Info
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    company_name text,
    
    -- Classification
    client_type text NOT NULL,
    industry_type text NOT NULL,
    industry_subtype text,
    
    -- Onboarding Progress
    current_step integer DEFAULT 1,         -- 1-4 step wizard
    status text DEFAULT 'new',              -- new/in_progress/verified/approved/rejected
    
    -- Selections
    selected_services jsonb DEFAULT '[]',
    selected_addons jsonb DEFAULT '[]',
    consent_accepted jsonb DEFAULT '{}',
    pricing_snapshot jsonb,
    
    -- Verification
    verification_code text,
    verification_sent_at timestamptz,
    verified_at timestamptz,
    
    -- Approval
    dashboard_tier text DEFAULT 'basic',
    assigned_pm uuid,
    assigned_team jsonb DEFAULT '[]',
    approved_by uuid,
    approved_at timestamptz,
    approval_notes text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 4.2 Client Onboarding (Legacy/simplified)
CREATE TABLE public.client_onboarding (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    company_name text,
    service_interests jsonb DEFAULT '[]',
    status text DEFAULT 'pending',
    notes text,
    reviewed_by uuid,
    reviewed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);


-- ============================================================================
-- PART 5: PROJECT MANAGEMENT TABLES
-- ============================================================================

-- 5.1 Projects
CREATE TABLE public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id),
    name text NOT NULL,
    description text,
    status text DEFAULT 'planning',         -- planning/active/on_hold/completed
    phase text DEFAULT 'Discovery',
    progress integer DEFAULT 0,             -- 0-100%
    health_score integer DEFAULT 100,
    start_date date,
    due_date date,
    budget numeric,
    team_members jsonb DEFAULT '[]',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 5.2 Project Milestones
CREATE TABLE public.project_milestones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    status text DEFAULT 'pending',          -- pending/in_progress/completed
    due_date date,
    completed_at timestamptz,
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- PART 6: SUPPORT & COMMUNICATION TABLES
-- ============================================================================

-- 6.1 Support Tickets
CREATE TABLE public.support_tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number text NOT NULL,            -- Format: TKT-XXXXX
    user_id uuid REFERENCES public.profiles(id),
    project_id uuid REFERENCES public.projects(id),
    subject text NOT NULL,
    description text,
    status text DEFAULT 'open',             -- open/in_progress/resolved/closed
    priority text DEFAULT 'medium',         -- low/medium/high/urgent
    assigned_to uuid,
    sla_due_at timestamptz,
    resolved_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 6.2 Ticket Messages
CREATE TABLE public.ticket_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id uuid REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    user_id uuid,
    message text NOT NULL,
    is_internal boolean DEFAULT false,      -- Internal notes (admin only)
    created_at timestamptz DEFAULT now()
);

-- 6.3 Meetings
CREATE TABLE public.meetings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id),
    project_id uuid REFERENCES public.projects(id),
    title text NOT NULL,
    description text,
    scheduled_at timestamptz NOT NULL,
    duration_minutes integer DEFAULT 30,
    meeting_type text DEFAULT 'client',     -- client/internal/demo
    meeting_link text,
    recording_url text,
    notes text,
    status text DEFAULT 'scheduled',        -- scheduled/completed/cancelled
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- PART 7: FILE MANAGEMENT TABLES
-- ============================================================================

-- 7.1 Client Files
CREATE TABLE public.client_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id),
    project_id uuid REFERENCES public.projects(id),
    name text NOT NULL,
    file_path text NOT NULL,                -- Storage bucket path
    file_type text,                         -- MIME type
    file_size bigint,
    folder text DEFAULT 'root',
    version integer DEFAULT 1,
    uploaded_by uuid,
    created_at timestamptz DEFAULT now()
);

-- 7.2 Client Feedback
CREATE TABLE public.client_feedback (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id),
    project_id uuid REFERENCES public.projects(id),
    milestone_id uuid REFERENCES public.project_milestones(id),
    rating integer,                         -- 1-5 stars
    comment text,
    feedback_type text DEFAULT 'general',
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- PART 8: MSP MONITORING TABLES
-- ============================================================================

-- 8.1 MSP Servers
CREATE TABLE public.client_msp_servers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    hostname text,
    ip_address text,
    server_type text DEFAULT 'web',         -- web/database/application
    status text DEFAULT 'unknown',          -- online/offline/warning/unknown
    last_ping_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 8.2 MSP Metrics
CREATE TABLE public.client_msp_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id uuid NOT NULL REFERENCES public.client_msp_servers(id) ON DELETE CASCADE,
    cpu_usage numeric,
    memory_usage numeric,
    disk_usage numeric,
    network_in bigint,
    network_out bigint,
    uptime_seconds bigint,
    recorded_at timestamptz DEFAULT now()
);

-- 8.3 MSP Alerts
CREATE TABLE public.client_msp_alerts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    server_id uuid NOT NULL REFERENCES public.client_msp_servers(id) ON DELETE CASCADE,
    alert_type text NOT NULL,               -- cpu_high/memory_high/disk_full/offline
    severity text DEFAULT 'warning',        -- info/warning/critical
    message text NOT NULL,
    is_resolved boolean DEFAULT false,
    resolved_at timestamptz,
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- PART 9: PRICING & CONFIGURATION TABLES
-- ============================================================================

-- 9.1 Service Pricing
CREATE TABLE public.service_pricing (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name text NOT NULL,
    service_category text NOT NULL,
    plan_tier text DEFAULT 'basic',
    base_price numeric DEFAULT 0,
    features jsonb DEFAULT '[]',
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 9.2 Service Addons
CREATE TABLE public.service_addons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    category text,
    price numeric DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- 9.3 Pricing Modifiers
CREATE TABLE public.pricing_modifiers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    modifier_type text NOT NULL,            -- industry/client_type/size
    modifier_key text NOT NULL,
    multiplier numeric DEFAULT 1.0,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- 9.4 Coupon Codes
CREATE TABLE public.coupon_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,
    discount_type text DEFAULT 'percentage', -- percentage/fixed
    discount_value numeric DEFAULT 0,
    max_uses integer,
    current_uses integer DEFAULT 0,
    valid_from timestamptz,
    valid_until timestamptz,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- PART 10: ADMIN & SYSTEM TABLES
-- ============================================================================

-- 10.1 Admin Notifications
CREATE TABLE public.admin_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    target_admin_id uuid,                   -- Specific admin or null for all
    title text NOT NULL,
    message text NOT NULL,
    notification_type text DEFAULT 'info',  -- info/warning/error/success/security/billing
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 10.2 Admin Settings
CREATE TABLE public.admin_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL,
    description text,
    updated_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 10.3 Portal Settings
CREATE TABLE public.portal_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL,
    description text,
    updated_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);


-- ============================================================================
-- PART 11: LOGGING & ANALYTICS TABLES
-- ============================================================================

-- 11.1 Audit Logs (Immutable)
CREATE TABLE public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    action text NOT NULL,                   -- create/update/delete/login
    entity_type text NOT NULL,
    entity_id text,
    old_values jsonb,
    new_values jsonb,
    ip_address text,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.audit_logs IS 'Immutable audit trail for compliance - never delete rows';

-- 11.2 System Logs
CREATE TABLE public.system_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    level text NOT NULL,                    -- info/warning/error/debug
    source text NOT NULL,
    message text NOT NULL,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- 11.3 Clickstream Events
CREATE TABLE public.clickstream_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id text NOT NULL,
    user_id uuid,
    event_type text NOT NULL,               -- page_view/click/scroll/form_submit
    page_url text,
    element_id text,
    element_class text,
    element_text text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- 11.4 API Usage
CREATE TABLE public.api_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    endpoint text NOT NULL,
    method text NOT NULL,
    status_code integer,
    response_time_ms integer,
    request_body jsonb,
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- PART 12: TEAM & COMPLIANCE TABLES
-- ============================================================================

-- 12.1 Team Members
CREATE TABLE public.team_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    name text NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    department text,
    avatar_url text,
    skills jsonb DEFAULT '[]',
    availability text DEFAULT 'available',
    created_at timestamptz DEFAULT now()
);

-- 12.2 Compliance Items
CREATE TABLE public.compliance_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    category text NOT NULL,                 -- gdpr/hipaa/soc2/pci
    status text DEFAULT 'pending',
    due_date date,
    assigned_to uuid,
    completed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 12.3 Integrations
CREATE TABLE public.integrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL,                     -- slack/google/stripe
    config jsonb DEFAULT '{}',
    is_active boolean DEFAULT false,
    last_sync_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 12.4 Client Notices
CREATE TABLE public.client_notices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    notice_type text DEFAULT 'info',
    target_type text DEFAULT 'all',
    target_users jsonb DEFAULT '[]',
    is_active boolean DEFAULT true,
    expires_at timestamptz,
    created_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);


-- ============================================================================
-- PART 13: FEATURE PERMISSIONS & NOTIFICATIONS TABLES
-- ============================================================================

-- 13.1 Global Features (Master registry)
CREATE TABLE public.global_features (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_key text NOT NULL UNIQUE,       -- e.g., 'payroll.multi_currency'
    name text NOT NULL,
    description text,
    category feature_category NOT NULL,
    minimum_tier feature_tier NOT NULL DEFAULT 'starter',
    is_addon boolean DEFAULT false,
    addon_price_monthly numeric(10,2),
    is_active boolean DEFAULT true,
    is_beta boolean DEFAULT false,
    released_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 13.2 Tenant Features (Per-tenant flags)
CREATE TABLE public.tenant_features (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    feature_id uuid NOT NULL REFERENCES public.global_features(id) ON DELETE CASCADE,
    is_enabled boolean DEFAULT true,
    enabled_at timestamptz DEFAULT now(),
    enabled_by uuid,
    expires_at timestamptz,
    is_trial boolean DEFAULT false,
    trial_days_remaining integer,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, feature_id)
);

-- 13.3 Role Feature Defaults
CREATE TABLE public.role_feature_defaults (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    role tenant_role NOT NULL,
    feature_id uuid NOT NULL REFERENCES public.global_features(id) ON DELETE CASCADE,
    can_view boolean DEFAULT false,
    can_create boolean DEFAULT false,
    can_edit boolean DEFAULT false,
    can_delete boolean DEFAULT false,
    can_export boolean DEFAULT false,
    custom_permissions jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, role, feature_id)
);

-- 13.4 Employee Feature Access (Individual overrides)
CREATE TABLE public.employee_feature_access (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    user_id uuid NOT NULL,
    feature_id uuid NOT NULL REFERENCES public.global_features(id) ON DELETE CASCADE,
    is_enabled boolean DEFAULT true,
    override_role_default boolean DEFAULT false,
    can_view boolean DEFAULT true,
    can_create boolean DEFAULT false,
    can_edit boolean DEFAULT false,
    can_delete boolean DEFAULT false,
    can_export boolean DEFAULT false,
    enabled_at timestamptz DEFAULT now(),
    enabled_by uuid,
    is_new boolean DEFAULT true,            -- Shows "NEW" badge
    new_badge_expires_at timestamptz,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, employee_id, feature_id)
);

-- 13.5 Employee Notifications
CREATE TABLE public.employee_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    notification_type notification_type NOT NULL,
    channel notification_channel DEFAULT 'both',
    priority notification_priority DEFAULT 'normal',
    title text NOT NULL,
    message text NOT NULL,
    action_url text,
    action_label text,
    feature_id uuid REFERENCES public.global_features(id),
    metadata jsonb DEFAULT '{}',
    is_read boolean DEFAULT false,
    read_at timestamptz,
    is_email_sent boolean DEFAULT false,
    email_sent_at timestamptz,
    email_error text,
    expires_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- 13.6 Notification Preferences
CREATE TABLE public.notification_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE,
    feature_unlock_channel notification_channel DEFAULT 'both',
    system_update_channel notification_channel DEFAULT 'in_app',
    security_alert_channel notification_channel DEFAULT 'both',
    action_required_channel notification_channel DEFAULT 'both',
    email_digest_enabled boolean DEFAULT false,
    email_digest_frequency text DEFAULT 'daily',
    quiet_hours_enabled boolean DEFAULT false,
    quiet_hours_start time,
    quiet_hours_end time,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 13.7 Feature Unlock Log (Audit)
CREATE TABLE public.feature_unlock_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES public.client_tenants(id),
    feature_id uuid NOT NULL REFERENCES public.global_features(id),
    action text NOT NULL,                   -- enabled/disabled/trial_started/trial_expired
    target_type text NOT NULL,              -- tenant/role/employee
    target_id uuid,
    performed_by uuid NOT NULL,
    performed_by_type text NOT NULL,        -- atlas_admin/tenant_admin
    previous_state jsonb,
    new_state jsonb,
    reason text,
    ip_address text,
    user_agent text,
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- PART 14: DATABASE FUNCTIONS
-- ============================================================================

-- 14.1 Generate Quote Number (ATL-YYYY-XXXX)
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    new_number TEXT;
    year_part TEXT;
    seq_num INTEGER;
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 10) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM public.quotes
    WHERE quote_number LIKE 'ATL-' || year_part || '-%';
    
    new_number := 'ATL-' || year_part || '-' || LPAD(seq_num::TEXT, 4, '0');
    RETURN new_number;
END;
$$;

COMMENT ON FUNCTION public.generate_quote_number IS 'Generates unique quote numbers in format ATL-YYYY-XXXX';

-- 14.2 Generate Invoice Number (INV-YYYY-XXXX)
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    new_number TEXT;
    year_part TEXT;
    seq_num INTEGER;
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 10) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM public.invoices
    WHERE invoice_number LIKE 'INV-' || year_part || '-%';
    
    new_number := 'INV-' || year_part || '-' || LPAD(seq_num::TEXT, 4, '0');
    RETURN new_number;
END;
$$;

COMMENT ON FUNCTION public.generate_invoice_number IS 'Generates unique invoice numbers in format INV-YYYY-XXXX';

-- 14.3 Generate Client ID (ATLS-YYYYMMDD-XXXX)
CREATE OR REPLACE FUNCTION public.generate_client_id()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    new_id TEXT;
    date_part TEXT;
    seq_num INTEGER;
BEGIN
    date_part := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
    SELECT COALESCE(MAX(CAST(SUBSTRING(client_id FROM 15) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM public.onboarding_sessions
    WHERE client_id LIKE 'ATLS-' || date_part || '-%';
    
    new_id := 'ATLS-' || date_part || '-' || LPAD(seq_num::TEXT, 4, '0');
    RETURN new_id;
END;
$$;

COMMENT ON FUNCTION public.generate_client_id IS 'Generates unique client IDs in format ATLS-YYYYMMDD-XXXX';

-- 14.4 Generate Ticket Number (TKT-XXXXX)
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    new_number TEXT;
    seq_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 5) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM public.support_tickets;
    
    new_number := 'TKT-' || LPAD(seq_num::TEXT, 5, '0');
    RETURN new_number;
END;
$$;

COMMENT ON FUNCTION public.generate_ticket_number IS 'Generates unique ticket numbers in format TKT-XXXXX';

-- 14.5 Has Role (SECURITY DEFINER - bypasses RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

COMMENT ON FUNCTION public.has_role IS 'SECURITY: Checks if user has specific role. SECURITY DEFINER bypasses RLS to prevent recursion.';

-- 14.6 Handle New User (Auth trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, company_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'company_name', '')
    );
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user IS 'Trigger function: Auto-creates profile when user signs up';

-- 14.7 Is Feature Enabled for User
CREATE OR REPLACE FUNCTION public.is_feature_enabled_for_user(
    p_user_id uuid,
    p_feature_key text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_feature_id uuid;
    v_tenant_id uuid;
    v_is_enabled boolean;
BEGIN
    -- Get feature ID
    SELECT id INTO v_feature_id 
    FROM public.global_features 
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
    
    RETURN true;
END;
$$;

COMMENT ON FUNCTION public.is_feature_enabled_for_user IS 'Checks if a specific feature is enabled for a user based on tenant and individual access';


-- ============================================================================
-- PART 15: TRIGGERS
-- ============================================================================

-- 15.1 Auto-create profile on signup
-- NOTE: Run this in Supabase SQL Editor - attaches to auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 15.2 Notify on feature unlock
CREATE OR REPLACE FUNCTION public.notify_feature_unlock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_feature_name text;
BEGIN
    SELECT name INTO v_feature_name FROM public.global_features WHERE id = NEW.feature_id;
    
    INSERT INTO public.employee_notifications (
        tenant_id, user_id, notification_type, channel, priority,
        title, message, action_url, action_label, feature_id
    ) VALUES (
        NEW.tenant_id, NEW.user_id, 'feature_unlock', 'both', 'normal',
        'New Feature Unlocked!',
        format('You now have access to %s. Explore it now!', v_feature_name),
        '/portal', 'Explore Feature', NEW.feature_id
    );
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_employee_feature_enabled
    AFTER INSERT ON public.employee_feature_access
    FOR EACH ROW
    WHEN (NEW.is_enabled = true)
    EXECUTE FUNCTION public.notify_feature_unlock();


-- ============================================================================
-- PART 16: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_msp_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_msp_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_msp_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clickstream_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_feature_defaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_feature_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_unlock_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- USER ROLES POLICIES
-- ============================================================================

CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- CLIENT TENANTS POLICIES
-- ============================================================================

CREATE POLICY "Admins can manage tenants" ON public.client_tenants
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own tenant" ON public.client_tenants
    FOR SELECT USING (id IN (
        SELECT tenant_id FROM public.client_tenant_users WHERE user_id = auth.uid()
    ));

-- ============================================================================
-- QUOTES POLICIES
-- ============================================================================

CREATE POLICY "Anyone can create quotes" ON public.quotes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own quotes" ON public.quotes
    FOR SELECT USING ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can update own quotes" ON public.quotes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all quotes" ON public.quotes
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all quotes" ON public.quotes
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- INVOICES POLICIES
-- ============================================================================

CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all invoices" ON public.invoices
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert invoices" ON public.invoices
    FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update invoices" ON public.invoices
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- ADMIN NOTIFICATIONS POLICIES
-- ============================================================================

CREATE POLICY "Admins can manage admin notifications" ON public.admin_notifications
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- ADDITIONAL POLICIES (abbreviated for common patterns)
-- ============================================================================

-- Admin-only tables
CREATE POLICY "Admins can manage leads" ON public.leads FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage admin settings" ON public.admin_settings FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage portal settings" ON public.portal_settings FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage compliance" ON public.compliance_items FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage integrations" ON public.integrations FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage onboarding" ON public.client_onboarding FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Public read + admin write
CREATE POLICY "Anyone can view active pricing" ON public.service_pricing FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage pricing" ON public.service_pricing FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active addons" ON public.service_addons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage addons" ON public.service_addons FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active modifiers" ON public.pricing_modifiers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage modifiers" ON public.pricing_modifiers FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active coupons" ON public.coupon_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage coupons" ON public.coupon_codes FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view team" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage team" ON public.team_members FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Logs - insert allowed, read admin only
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert system logs" ON public.system_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view system logs" ON public.system_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert clickstream" ON public.clickstream_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view clickstream" ON public.clickstream_events FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert api usage" ON public.api_usage FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view api usage" ON public.api_usage FOR SELECT USING (has_role(auth.uid(), 'admin'));


-- ============================================================================
-- PART 17: INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_quotes_user ON public.quotes(user_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_invoices_user ON public.invoices(user_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_assigned ON public.leads(assigned_to);
CREATE INDEX idx_projects_user ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_tickets_user ON public.support_tickets(user_id);
CREATE INDEX idx_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_clickstream_session ON public.clickstream_events(session_id);
CREATE INDEX idx_clickstream_created ON public.clickstream_events(created_at DESC);
CREATE INDEX idx_admin_notifications_admin ON public.admin_notifications(target_admin_id);
CREATE INDEX idx_admin_notifications_unread ON public.admin_notifications(is_read) WHERE is_read = false;
CREATE INDEX idx_global_features_category ON public.global_features(category);
CREATE INDEX idx_tenant_features_tenant ON public.tenant_features(tenant_id);
CREATE INDEX idx_employee_access_user ON public.employee_feature_access(user_id);
CREATE INDEX idx_notifications_user_unread ON public.employee_notifications(user_id, is_read) WHERE is_read = false;


-- ============================================================================
-- PART 18: ENABLE REALTIME (Optional - for live updates)
-- ============================================================================

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.employee_notifications;

-- Enable realtime for MSP monitoring
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_msp_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_msp_metrics;


-- ============================================================================
-- END OF ATLAS DATABASE SCHEMA
-- ============================================================================
