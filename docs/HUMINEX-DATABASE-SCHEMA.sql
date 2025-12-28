-- ============================================================================
-- ATLAS Database Schema Documentation
-- ============================================================================
-- 
-- > **Version**: 3.7.0  
-- > **Last Updated**: December 9, 2025 @ 10:15 UTC  
-- > **Author**: CropXon ATLAS Team
--
-- ============================================================================

-- ============================================================================

-- ============================================================================
-- 📊 DATABASE SCHEMA SUMMARY (67 Tables)
-- ============================================================================
--
-- | # | Table Name | Status | Category | Purpose/Description |
-- |---|------------|--------|----------|---------------------|
-- | 67 | sidebar_access_logs | ✅ Live | Admin | Sidebar access change audit logs |
-- | # | Table Name | Status | Category | Purpose/Description |
-- |---|------------|--------|----------|---------------------|
-- | 1 | profiles | ✅ Live | Core | User profile data (name, email, phone, company) |
-- | 2 | user_roles | ✅ Live | Core | User role assignments (admin, user) for RBAC |
-- | 3 | client_tenants | ✅ Live | Core | Organization/company tenant records |
-- | 4 | client_tenant_users | ✅ Live | Core | Maps users to their tenant memberships |
-- | 5 | quotes | ✅ Live | Sales & CRM | Service quotes with pricing, status, contact info |
-- | 6 | invoices | ✅ Live | Sales & CRM | Client invoices with amounts, due dates, status |
-- | 7 | leads | ✅ Live | Sales & CRM | Sales leads with scores, sources, conversion |
-- | 8 | inquiries | ✅ Live | Sales & CRM | Contact form submissions and service inquiries |
-- | 9 | onboarding_sessions | ✅ Live | Onboarding | Client onboarding wizard progress and data |
-- | 10 | client_onboarding | ✅ Live | Onboarding | Simple onboarding requests (pre-approval) |
-- | 11 | projects | ✅ Live | Project Mgmt | Client projects with status, budget, timeline |
-- | 12 | project_milestones | ✅ Live | Project Mgmt | Project milestones with due dates and completion |
-- | 13 | support_tickets | ✅ Live | Support | Support tickets with priority, SLA, assignment |
-- | 14 | ticket_messages | ✅ Live | Support | Messages/replies within support tickets |
-- | 15 | meetings | ✅ Live | Communication | Scheduled meetings with clients and team |
-- | 16 | client_files | ✅ Live | File Management | Client uploaded files with versioning |
-- | 17 | client_feedback | ✅ Live | File Management | Client feedback ratings and comments |
-- | 18 | client_msp_servers | ✅ Live | MSP Monitoring | Monitored servers for managed service clients |
-- | 19 | client_msp_metrics | ✅ Live | MSP Monitoring | Server metrics (CPU, memory, disk) |
-- | 20 | client_msp_alerts | ✅ Live | MSP Monitoring | Server alerts and incident notifications |
-- | 21 | service_pricing | ✅ Live | Pricing | Service pricing tiers and features |
-- | 22 | service_addons | ✅ Live | Pricing | Optional add-on services with pricing |
-- | 23 | pricing_modifiers | ✅ Live | Pricing | Industry/size pricing multipliers |
-- | 24 | coupon_codes | ✅ Live | Pricing | Discount coupons with usage limits |
-- | 25 | admin_notifications | ✅ Live | Admin | Admin-targeted notifications |
-- | 26 | admin_settings | ✅ Live | Admin | Platform-wide admin configuration |
-- | 27 | portal_settings | ✅ Live | Admin | Client portal configuration settings |
-- | 28 | audit_logs | ✅ Live | Logging | System audit trail for compliance |
-- | 29 | system_logs | ✅ Live | Logging | Application logs for debugging |
-- | 30 | clickstream_events | ✅ Live | Analytics | User interaction tracking for analytics |
-- | 31 | session_recordings | ✅ Live | Analytics | rrweb session recordings with DOM snapshots |
-- | 32 | api_usage | ✅ Live | Logging | API endpoint usage tracking |
-- | 33 | team_members | ✅ Live | Team | Internal team member profiles |
-- | 34 | compliance_items | ✅ Live | Compliance | Compliance checklist items and status |
-- | 35 | integrations | ✅ Live | Integrations | Third-party integration configurations |
-- | 36 | client_notices | ✅ Live | Communication | Announcements and notices for clients |
-- | 37 | ab_experiments | ✅ Live | A/B Testing | A/B test experiment definitions |
-- | 38 | ab_variants | ✅ Live | A/B Testing | Experiment variant configurations |
-- | 39 | ab_results | ✅ Live | A/B Testing | Experiment results and metrics |
-- | 40 | ab_user_assignments | ✅ Live | A/B Testing | User assignments to experiment variants |
-- | 41 | ai_predictions | ✅ Live | AI Analytics | AI prediction cache (MRR, churn, conversions) |
-- | 42 | global_features | 📋 Pending | Features | Platform-wide feature definitions |
-- | 43 | tenant_features | 📋 Pending | Features | Tenant-specific feature flags |
-- | 44 | role_feature_defaults | 📋 Pending | Features | Default features by role |
-- | 45 | employee_feature_access | 📋 Pending | Features | Individual employee feature permissions |
-- | 46 | employee_notifications | 📋 Pending | Notifications | Employee notification records |
-- | 47 | notification_preferences | 📋 Pending | Notifications | User notification channel preferences |
-- | 48 | feature_unlock_log | 📋 Pending | Notifications | Log of feature unlock events |
-- | 49 | payroll_runs | 📋 Pending | Payroll | Monthly/weekly payroll processing runs |
-- | 50 | payslips | 📋 Pending | Payroll | Individual employee payslips |
-- | 51 | bgv_requests | 📋 Pending | BGV | Background verification requests |
-- | 52 | sso_states | 📋 Pending | SSO | OAuth state tokens for SSO flows |
-- | 53 | insurance_claims | 📋 Pending | Insurance | Employee insurance claim submissions |
-- | 54 | document_verifications | 📋 Pending | Documents | Document verification requests/results |
-- | 55 | document_extractions | 📋 Pending | Documents | OCR/data extraction from documents |
-- | 56 | employees | 📋 Pending | HR | Employee master records with details |
-- | 57 | attendance_records | 📋 Pending | HR | Daily attendance check-in/check-out |
-- | 58 | leave_types | 📋 Pending | HR | Leave type definitions (annual, sick) |
-- | 59 | leave_balances | 📋 Pending | HR | Employee leave balance tracking |
-- | 60 | leave_requests | 📋 Pending | HR | Leave application requests/approvals |
-- | 61 | shifts | 📋 Pending | Shift Mgmt | Shift definitions with timing/settings |
-- | 62 | shift_assignments | 📋 Pending | Shift Mgmt | Employee shift assignments |
-- | 63 | shift_swap_requests | 📋 Pending | Shift Mgmt | Shift swap requests between employees |
-- | 64 | overtime_records | 📋 Pending | Overtime | Overtime hours with approval status |
-- | 65 | geofence_zones | 📋 Pending | Geofencing | Office location geofence boundaries |
-- | 66 | geofence_attendance_logs | 📋 Pending | Geofencing | GPS-validated attendance entries |
--
-- ============================================================================

-- ============================================================================
-- 🔑 REQUIRED SECRETS
-- ============================================================================
--
-- | Secret | Description | Status |
-- |--------|-------------|--------|
-- | SUPABASE_URL | Auto-provided by Supabase | ✅ Configured |
-- | SUPABASE_ANON_KEY | Auto-provided by Supabase | ✅ Configured |
-- | SUPABASE_SERVICE_ROLE_KEY | Auto-provided by Supabase | ✅ Configured |
-- | SUPABASE_DB_URL | Database connection URL | ✅ Configured |
-- | SUPABASE_PUBLISHABLE_KEY | Public API key | ✅ Configured |
-- | RESEND_API_KEY | For sending emails via Resend | ✅ Configured |
--
-- ============================================================================

-- ============================================================================
-- 💾 STORAGE BUCKETS
-- ============================================================================
--
-- | Bucket Name | Public | Purpose |
-- |-------------|--------|---------|
-- | client-files | No | Client uploaded documents and files |
--
-- ============================================================================




-- ============================================================================
-- ============================================================================
--                        DETAILED TABLE DEFINITIONS
-- ============================================================================
-- ============================================================================




-- ============================================================================
-- 📂 PART 1: ENUMS & TYPES
-- ============================================================================

-- 1.1 User roles for RBAC
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 1.2 Quote status workflow
CREATE TYPE public.quote_status AS ENUM (
    'draft',      -- Initial creation
    'pending',    -- Awaiting review
    'approved',   -- Approved by admin
    'rejected',   -- Rejected
    'converted'   -- Converted to invoice/project
);

-- 1.3 Invoice status workflow
CREATE TYPE public.invoice_status AS ENUM (
    'draft',      -- Initial creation
    'sent',       -- Sent to client
    'paid',       -- Payment received
    'overdue',    -- Past due date
    'cancelled'   -- Cancelled
);

-- 1.4 Feature permission enums
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
-- 📂 PART 2: CORE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 2.1 profiles
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Extended user information beyond Supabase auth |
-- | **Primary Key** | id (references auth.users) |
-- | **RLS** | Users can view/update own profile, Admins view all |
-- | **Relationships** | → client_tenants (tenant_id) |
-- ----------------------------------------------------------------------------

CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    full_name text,
    company_name text,
    phone text,
    tenant_id uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Extended user profile information linked to auth.users';

-- ----------------------------------------------------------------------------
-- 2.2 user_roles
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Role-based access control (RBAC) |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users view own roles, Admins manage all |
-- | **SECURITY** | Separate table prevents privilege escalation |
-- ----------------------------------------------------------------------------

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, role)
);

COMMENT ON TABLE public.user_roles IS 'SECURITY: User roles stored separately to prevent privilege escalation';

-- ----------------------------------------------------------------------------
-- 2.3 client_tenants
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Root table for multi-tenancy organizations |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users view own tenant, Admins manage all |
-- | **Unique** | slug (URL-friendly identifier) |
-- ----------------------------------------------------------------------------

CREATE TABLE public.client_tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    contact_email text NOT NULL,
    contact_phone text,
    address text,
    logo_url text,
    status text DEFAULT 'pending',
    tenant_type text DEFAULT 'individual',
    settings jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.client_tenants IS 'Root table for multi-tenancy - each row is a client organization';

-- Add foreign key from profiles to client_tenants
ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_tenant_id_fkey 
    FOREIGN KEY (tenant_id) REFERENCES public.client_tenants(id);

-- ----------------------------------------------------------------------------
-- 2.4 client_tenant_users
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Links users to tenants with role assignments |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users view own memberships, Admins manage all |
-- | **Unique** | (tenant_id, user_id) |
-- ----------------------------------------------------------------------------

CREATE TABLE public.client_tenant_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text DEFAULT 'member',
    created_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, user_id)
);

COMMENT ON TABLE public.client_tenant_users IS 'Many-to-many: links users to tenant organizations with roles';


-- ============================================================================
-- 📂 PART 3: SALES & CRM TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 3.1 quotes
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Service quotes with pricing, status, contact info |
-- | **Primary Key** | id (uuid) |
-- | **Auto-Generated** | quote_number via generate_quote_number() |
-- | **RLS** | Users view own, Admins view/update all |
-- ----------------------------------------------------------------------------

CREATE TABLE public.quotes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number text UNIQUE NOT NULL,
    user_id uuid REFERENCES auth.users(id),
    client_type text NOT NULL,
    service_type text NOT NULL,
    complexity text NOT NULL,
    features jsonb DEFAULT '[]',
    addons jsonb DEFAULT '[]',
    estimated_price numeric NOT NULL,
    discount_percent integer DEFAULT 0,
    coupon_code text,
    final_price numeric NOT NULL,
    status quote_status DEFAULT 'pending',
    contact_name text,
    contact_email text,
    contact_phone text,
    contact_company text,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3.2 invoices
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Client invoices with amounts, due dates, status |
-- | **Primary Key** | id (uuid) |
-- | **Auto-Generated** | invoice_number via generate_invoice_number() |
-- | **RLS** | Users view own, Admins create/update all |
-- ----------------------------------------------------------------------------

CREATE TABLE public.invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number text UNIQUE NOT NULL,
    user_id uuid REFERENCES auth.users(id),
    quote_id uuid REFERENCES public.quotes(id),
    amount numeric NOT NULL,
    tax_percent numeric DEFAULT 18.00,
    tax_amount numeric NOT NULL,
    total_amount numeric NOT NULL,
    status invoice_status DEFAULT 'draft',
    due_date date,
    paid_at timestamptz,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3.3 leads
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Sales leads with scores, sources, conversion tracking |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Admins only |
-- | **Features** | Lead scoring, assignment, conversion tracking |
-- ----------------------------------------------------------------------------

CREATE TABLE public.leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    source text DEFAULT 'website',
    status text DEFAULT 'new',
    score integer DEFAULT 0,
    assigned_to uuid,
    notes text,
    last_contact_at timestamptz,
    converted_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3.4 inquiries
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Contact form submissions and service inquiries |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Anyone can create, Users view own, Admins view all |
-- ----------------------------------------------------------------------------

CREATE TABLE public.inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    service_interest text,
    message text,
    source text DEFAULT 'website',
    user_id uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 📂 PART 4: ONBOARDING TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 4.1 onboarding_sessions
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Client onboarding wizard progress and data |
-- | **Primary Key** | id (uuid) |
-- | **Auto-Generated** | client_id via generate_client_id() |
-- | **RLS** | Users view/update own, Admins manage all |
-- ----------------------------------------------------------------------------

CREATE TABLE public.onboarding_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id text NOT NULL,
    user_id uuid REFERENCES auth.users(id),
    quote_id uuid REFERENCES public.quotes(id),
    email text NOT NULL,
    full_name text NOT NULL,
    phone text,
    company_name text,
    client_type text NOT NULL,
    industry_type text NOT NULL,
    industry_subtype text,
    selected_services jsonb DEFAULT '[]',
    selected_addons jsonb DEFAULT '[]',
    pricing_snapshot jsonb,
    consent_accepted jsonb DEFAULT '{}',
    current_step integer DEFAULT 1,
    status text DEFAULT 'new',
    dashboard_tier text DEFAULT 'basic',
    verification_code text,
    verification_sent_at timestamptz,
    verified_at timestamptz,
    approved_by uuid,
    approved_at timestamptz,
    approval_notes text,
    assigned_pm uuid,
    assigned_team jsonb DEFAULT '[]',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4.2 client_onboarding
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Simple onboarding requests (pre-approval stage) |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Admins only |
-- ----------------------------------------------------------------------------

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
-- 📂 PART 5: PROJECT MANAGEMENT TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 5.1 projects
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Client projects with status, budget, timeline |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users view own, Admins manage all |
-- | **Features** | Progress tracking, health score, team assignments |
-- ----------------------------------------------------------------------------

CREATE TABLE public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    name text NOT NULL,
    description text,
    status text DEFAULT 'planning',
    phase text DEFAULT 'Discovery',
    progress integer DEFAULT 0,
    health_score integer DEFAULT 100,
    budget numeric,
    start_date date,
    due_date date,
    team_members jsonb DEFAULT '[]',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5.2 project_milestones
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Project milestones with due dates and completion |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users view own project milestones, Admins manage all |
-- ----------------------------------------------------------------------------

CREATE TABLE public.project_milestones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    status text DEFAULT 'pending',
    due_date date,
    completed_at timestamptz,
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 📂 PART 6: SUPPORT & COMMUNICATION TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 6.1 support_tickets
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Support tickets with priority, SLA, assignment |
-- | **Primary Key** | id (uuid) |
-- | **Auto-Generated** | ticket_number via generate_ticket_number() |
-- | **RLS** | Users create/view own, Admins manage all |
-- ----------------------------------------------------------------------------

CREATE TABLE public.support_tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number text UNIQUE NOT NULL,
    user_id uuid REFERENCES auth.users(id),
    project_id uuid REFERENCES public.projects(id),
    subject text NOT NULL,
    description text,
    status text DEFAULT 'open',
    priority text DEFAULT 'medium',
    assigned_to uuid,
    sla_due_at timestamptz,
    resolved_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 6.2 ticket_messages
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Messages/replies within support tickets |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users add to own tickets, Admins manage all |
-- | **Features** | Internal notes (is_internal flag) |
-- ----------------------------------------------------------------------------

CREATE TABLE public.ticket_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id uuid REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    user_id uuid,
    message text NOT NULL,
    is_internal boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 6.3 meetings
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Scheduled meetings with clients and team |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users view own, Admins manage all |
-- | **Features** | Video links, recordings, notes |
-- ----------------------------------------------------------------------------

CREATE TABLE public.meetings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    project_id uuid REFERENCES public.projects(id),
    title text NOT NULL,
    description text,
    scheduled_at timestamptz NOT NULL,
    duration_minutes integer DEFAULT 30,
    meeting_type text DEFAULT 'client',
    meeting_link text,
    recording_url text,
    status text DEFAULT 'scheduled',
    notes text,
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 📂 PART 7: FILE MANAGEMENT TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 7.1 client_files
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Client uploaded files with versioning |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users manage own files, Admins manage all |
-- | **Features** | Folder organization, versioning |
-- ----------------------------------------------------------------------------

CREATE TABLE public.client_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    project_id uuid REFERENCES public.projects(id),
    name text NOT NULL,
    file_path text NOT NULL,
    file_type text,
    file_size bigint,
    folder text DEFAULT 'root',
    version integer DEFAULT 1,
    uploaded_by uuid,
    created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 7.2 client_feedback
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Client feedback ratings and comments |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users create/view own, Admins view all |
-- | **Features** | Star ratings, feedback types |
-- ----------------------------------------------------------------------------

CREATE TABLE public.client_feedback (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    project_id uuid REFERENCES public.projects(id),
    milestone_id uuid REFERENCES public.project_milestones(id),
    rating integer,
    comment text,
    feedback_type text DEFAULT 'general',
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 📂 PART 8: MSP MONITORING TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 8.1 client_msp_servers
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Monitored servers for managed service clients |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users view own tenant servers, Admins manage all |
-- | **Features** | Server types, status tracking, last ping |
-- ----------------------------------------------------------------------------

CREATE TABLE public.client_msp_servers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    hostname text,
    ip_address text,
    server_type text DEFAULT 'web',
    status text DEFAULT 'unknown',
    last_ping_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 8.2 client_msp_metrics
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Server performance metrics (CPU, memory, disk) |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users view own tenant metrics, Admins manage all |
-- ----------------------------------------------------------------------------

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

-- ----------------------------------------------------------------------------
-- 8.3 client_msp_alerts
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Server alerts and incident notifications |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users view own tenant alerts, Admins manage all |
-- | **Features** | Severity levels, resolution tracking |
-- ----------------------------------------------------------------------------

CREATE TABLE public.client_msp_alerts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    server_id uuid NOT NULL REFERENCES public.client_msp_servers(id) ON DELETE CASCADE,
    alert_type text NOT NULL,
    message text NOT NULL,
    severity text DEFAULT 'warning',
    is_resolved boolean DEFAULT false,
    resolved_at timestamptz,
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 📂 PART 9: PRICING & CONFIGURATION TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 9.1 service_pricing
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Service pricing tiers and features |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Anyone can view active, Admins manage all |
-- ----------------------------------------------------------------------------

CREATE TABLE public.service_pricing (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name text NOT NULL,
    service_category text NOT NULL,
    plan_tier text DEFAULT 'basic',
    base_price numeric DEFAULT 0,
    description text,
    features jsonb DEFAULT '[]',
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 9.2 service_addons
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Optional add-on services with pricing |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Anyone can view active, Admins manage all |
-- ----------------------------------------------------------------------------

CREATE TABLE public.service_addons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    category text,
    price numeric DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 9.3 pricing_modifiers
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Industry/size pricing multipliers |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Anyone can view active, Admins manage all |
-- ----------------------------------------------------------------------------

CREATE TABLE public.pricing_modifiers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    modifier_type text NOT NULL,
    modifier_key text NOT NULL,
    multiplier numeric DEFAULT 1.0,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 9.4 coupon_codes
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Discount coupons with usage limits |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Anyone can view active, Admins manage all |
-- | **Features** | Usage tracking, validity dates |
-- ----------------------------------------------------------------------------

CREATE TABLE public.coupon_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,
    discount_type text DEFAULT 'percentage',
    discount_value numeric DEFAULT 0,
    max_uses integer,
    current_uses integer DEFAULT 0,
    valid_from timestamptz,
    valid_until timestamptz,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 📂 PART 10: ADMIN & SYSTEM TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 10.1 admin_notifications
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Admin-targeted notifications |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Admins only |
-- | **Features** | Types, priority, read status |
-- ----------------------------------------------------------------------------

CREATE TABLE public.admin_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    message text NOT NULL,
    notification_type text DEFAULT 'info',
    target_admin_id uuid,
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 10.2 admin_settings
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Platform-wide admin configuration |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Admins only |
-- | **Features** | Key-value config storage |
-- ----------------------------------------------------------------------------

CREATE TABLE public.admin_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL,
    description text,
    updated_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 10.3 portal_settings
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Client portal configuration settings |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Admins only |
-- ----------------------------------------------------------------------------

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
-- 📂 PART 11: LOGGING & ANALYTICS TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 11.1 audit_logs
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | System audit trail for compliance |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Admins view, System inserts |
-- | **Features** | Old/new values, IP tracking |
-- ----------------------------------------------------------------------------

CREATE TABLE public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id text,
    old_values jsonb,
    new_values jsonb,
    ip_address text,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 11.2 system_logs
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Application logs for debugging |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Admins view, System inserts |
-- | **Features** | Log levels, source tracking |
-- ----------------------------------------------------------------------------

CREATE TABLE public.system_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    level text NOT NULL,
    source text NOT NULL,
    message text NOT NULL,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 11.3 clickstream_events
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | User interaction tracking for analytics |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Admins view, Anyone inserts |
-- | **Features** | Element tracking, session grouping |
-- ----------------------------------------------------------------------------

CREATE TABLE public.clickstream_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id text NOT NULL,
    user_id uuid,
    event_type text NOT NULL,
    page_url text,
    element_id text,
    element_class text,
    element_text text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 11.4 session_recordings
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | rrweb session recordings with DOM snapshots |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Admins view, Anyone inserts/updates |
-- | **Features** | DOM recording, event storage, metadata, privacy controls |
-- | **Technology** | Uses rrweb library for DOM snapshot recording |
-- ----------------------------------------------------------------------------

CREATE TABLE public.session_recordings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id text NOT NULL,
    events jsonb NOT NULL DEFAULT '[]',
    start_time timestamptz NOT NULL DEFAULT now(),
    end_time timestamptz,
    duration_ms integer,
    page_count integer DEFAULT 1,
    event_count integer DEFAULT 0,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.session_recordings IS 'Stores rrweb session recordings for user behavior analysis';
COMMENT ON COLUMN public.session_recordings.events IS 'Array of rrweb events capturing DOM mutations, mouse movements, scrolls';
COMMENT ON COLUMN public.session_recordings.metadata IS 'Contains userAgent, screenWidth, screenHeight, url, privacySettings';

-- Enable realtime for session_recordings
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_recordings;

-- Indexes for performance
CREATE INDEX idx_session_recordings_session_id ON public.session_recordings(session_id);
CREATE INDEX idx_session_recordings_start_time ON public.session_recordings(start_time DESC);
CREATE INDEX idx_session_recordings_duration ON public.session_recordings(duration_ms);

-- RLS Policies
ALTER TABLE public.session_recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view recordings"
    ON public.session_recordings FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
    ));

CREATE POLICY "Anyone can insert recordings"
    ON public.session_recordings FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can update own session recordings"
    ON public.session_recordings FOR UPDATE
    USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 11.5 api_usage
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | API endpoint usage tracking |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Admins view, System inserts |
-- | **Features** | Response times, status codes |
-- ----------------------------------------------------------------------------

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
-- 📂 PART 12: TEAM & COMPLIANCE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 12.1 team_members
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Internal team member profiles |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Anyone can view, Admins manage |
-- | **Features** | Skills, availability, departments |
-- ----------------------------------------------------------------------------

CREATE TABLE public.team_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    name text NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    department text,
    skills jsonb DEFAULT '[]',
    availability text DEFAULT 'available',
    avatar_url text,
    created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 12.2 compliance_items
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Compliance checklist items and status |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Admins only |
-- | **Features** | Categories, assignments, due dates |
-- ----------------------------------------------------------------------------

CREATE TABLE public.compliance_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    category text NOT NULL,
    description text,
    status text DEFAULT 'pending',
    due_date date,
    assigned_to uuid,
    completed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 12.3 integrations
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Third-party integration configurations |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Admins only |
-- | **Features** | Config storage, sync tracking |
-- ----------------------------------------------------------------------------

CREATE TABLE public.integrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL,
    config jsonb DEFAULT '{}',
    is_active boolean DEFAULT false,
    last_sync_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 12.4 client_notices
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Announcements and notices for clients |
-- | **Primary Key** | id (uuid) |
-- | **RLS** | Users view active, Admins manage all |
-- | **Features** | Expiration, targeting |
-- ----------------------------------------------------------------------------

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
-- 📂 PART 13: FEATURE PERMISSIONS TABLES (PENDING MIGRATION)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 13.1 global_features
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Platform-wide feature definitions |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Tiers, categories, trial periods |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.global_features (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_key text UNIQUE NOT NULL,
    display_name text NOT NULL,
    description text,
    category feature_category DEFAULT 'core',
    minimum_tier feature_tier DEFAULT 'starter',
    is_addon boolean DEFAULT false,
    addon_price_monthly numeric,
    addon_price_yearly numeric,
    trial_days integer DEFAULT 0,
    is_active boolean DEFAULT true,
    icon text,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 13.2 tenant_features
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Tenant-specific feature flags |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Overrides, trials, custom limits |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.tenant_features (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    feature_id uuid NOT NULL REFERENCES public.global_features(id) ON DELETE CASCADE,
    is_enabled boolean DEFAULT false,
    is_trial boolean DEFAULT false,
    trial_started_at timestamptz,
    trial_ends_at timestamptz,
    enabled_at timestamptz,
    enabled_by uuid,
    custom_limit jsonb,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, feature_id)
);

-- ----------------------------------------------------------------------------
-- 13.3 role_feature_defaults
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Default features by role |
-- | **Primary Key** | id (uuid) |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.role_feature_defaults (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    role tenant_role NOT NULL,
    feature_id uuid NOT NULL REFERENCES public.global_features(id) ON DELETE CASCADE,
    is_enabled boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, role, feature_id)
);

-- ----------------------------------------------------------------------------
-- 13.4 employee_feature_access
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Individual employee feature permissions |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Override role defaults per employee |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.employee_feature_access (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id uuid NOT NULL,
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    feature_id uuid NOT NULL REFERENCES public.global_features(id) ON DELETE CASCADE,
    is_enabled boolean DEFAULT true,
    enabled_at timestamptz DEFAULT now(),
    enabled_by uuid,
    notes text,
    created_at timestamptz DEFAULT now(),
    UNIQUE(employee_id, feature_id)
);


-- ============================================================================
-- 📂 PART 14: NOTIFICATION TABLES (PENDING MIGRATION)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 14.1 employee_notifications
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Employee notification records |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Priority, actions, read tracking |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.employee_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id uuid NOT NULL,
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    priority notification_priority DEFAULT 'normal',
    action_url text,
    action_label text,
    is_read boolean DEFAULT false,
    read_at timestamptz,
    metadata jsonb DEFAULT '{}',
    expires_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 14.2 notification_preferences
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | User notification channel preferences |
-- | **Primary Key** | id (uuid) |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.notification_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type notification_type NOT NULL,
    channel notification_channel DEFAULT 'in_app',
    is_enabled boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, notification_type)
);

-- ----------------------------------------------------------------------------
-- 14.3 feature_unlock_log
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Log of feature unlock events |
-- | **Primary Key** | id (uuid) |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.feature_unlock_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    feature_id uuid NOT NULL REFERENCES public.global_features(id) ON DELETE CASCADE,
    employee_id uuid,
    action text NOT NULL,
    performed_by uuid,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 📂 PART 15: HR & PAYROLL TABLES (PENDING MIGRATION)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 15.1 employees
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Employee master records with employment details |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Salary, department, manager hierarchy |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.employees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id),
    employee_code text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone text,
    department text,
    designation text,
    manager_id uuid,
    date_of_joining date,
    date_of_birth date,
    gender text,
    address jsonb DEFAULT '{}',
    emergency_contact jsonb DEFAULT '{}',
    bank_details jsonb DEFAULT '{}',
    salary_details jsonb DEFAULT '{}',
    documents jsonb DEFAULT '[]',
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, employee_code)
);

-- ----------------------------------------------------------------------------
-- 15.2 payroll_runs
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Monthly/weekly payroll processing runs |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Totals, approval workflow |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.payroll_runs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    payroll_period text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status text DEFAULT 'draft',
    total_employees integer DEFAULT 0,
    total_gross numeric DEFAULT 0,
    total_deductions numeric DEFAULT 0,
    total_net numeric DEFAULT 0,
    approved_by uuid,
    approved_at timestamptz,
    processed_at timestamptz,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 15.3 payslips
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Individual employee payslips |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Earnings, deductions, breakdown |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.payslips (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id uuid NOT NULL REFERENCES public.payroll_runs(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    basic_salary numeric DEFAULT 0,
    hra numeric DEFAULT 0,
    special_allowance numeric DEFAULT 0,
    other_allowances numeric DEFAULT 0,
    gross_salary numeric DEFAULT 0,
    pf_employee numeric DEFAULT 0,
    pf_employer numeric DEFAULT 0,
    professional_tax numeric DEFAULT 0,
    tds numeric DEFAULT 0,
    other_deductions numeric DEFAULT 0,
    total_deductions numeric DEFAULT 0,
    net_salary numeric DEFAULT 0,
    overtime_hours numeric DEFAULT 0,
    overtime_amount numeric DEFAULT 0,
    bonus numeric DEFAULT 0,
    status text DEFAULT 'draft',
    generated_at timestamptz,
    sent_at timestamptz,
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 📂 PART 16: BGV, SSO, INSURANCE, DOCUMENTS (PENDING MIGRATION)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 16.1 bgv_requests
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Background verification requests |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Multiple check types, status tracking |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.bgv_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    request_type text NOT NULL,
    checks jsonb DEFAULT '[]',
    status text DEFAULT 'pending',
    submitted_at timestamptz,
    completed_at timestamptz,
    results jsonb DEFAULT '{}',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 16.2 sso_states
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | OAuth state tokens for SSO flows |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Provider tracking, expiration |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.sso_states (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    state text UNIQUE NOT NULL,
    provider text NOT NULL,
    tenant_id uuid REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    redirect_url text,
    metadata jsonb DEFAULT '{}',
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 16.3 insurance_claims
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Employee insurance claim submissions |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Claim types, approval workflow |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.insurance_claims (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    claim_type text NOT NULL,
    claim_amount numeric NOT NULL,
    description text,
    documents jsonb DEFAULT '[]',
    status text DEFAULT 'pending',
    submitted_at timestamptz DEFAULT now(),
    reviewed_by uuid,
    reviewed_at timestamptz,
    approved_amount numeric,
    rejection_reason text,
    paid_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 16.4 document_verifications
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Document verification requests and results |
-- | **Primary Key** | id (uuid) |
-- | **Features** | OCR, verification status |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.document_verifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    document_type text NOT NULL,
    document_url text NOT NULL,
    document_number text,
    status text DEFAULT 'pending',
    verification_result jsonb DEFAULT '{}',
    verified_at timestamptz,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 16.5 document_extractions
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | OCR/data extraction from documents |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Extracted fields, confidence scores |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.document_extractions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id uuid NOT NULL REFERENCES public.document_verifications(id) ON DELETE CASCADE,
    extracted_data jsonb DEFAULT '{}',
    confidence_score numeric,
    extraction_method text DEFAULT 'ocr',
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 📂 PART 17: ATTENDANCE & LEAVE TABLES (PENDING MIGRATION)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 17.1 attendance_records
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Daily attendance check-in/check-out records |
-- | **Primary Key** | id (uuid) |
-- | **Features** | GPS location, work hours calculation |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.attendance_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    date date NOT NULL,
    check_in_time timestamptz,
    check_out_time timestamptz,
    check_in_location jsonb,
    check_out_location jsonb,
    status text DEFAULT 'present',
    work_hours numeric,
    overtime_hours numeric DEFAULT 0,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, employee_id, date)
);

-- ----------------------------------------------------------------------------
-- 17.2 leave_types
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Leave type definitions (annual, sick, etc.) |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Carry forward, encashment rules |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.leave_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    days_per_year integer DEFAULT 0,
    is_paid boolean DEFAULT true,
    is_carry_forward boolean DEFAULT false,
    max_carry_forward integer DEFAULT 0,
    is_encashable boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, code)
);

-- ----------------------------------------------------------------------------
-- 17.3 leave_balances
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Employee leave balance tracking |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Year-wise, used/available tracking |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.leave_balances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    leave_type_id uuid NOT NULL REFERENCES public.leave_types(id) ON DELETE CASCADE,
    year integer NOT NULL,
    total_days numeric DEFAULT 0,
    used_days numeric DEFAULT 0,
    pending_days numeric DEFAULT 0,
    available_days numeric DEFAULT 0,
    carry_forward_days numeric DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, employee_id, leave_type_id, year)
);

-- ----------------------------------------------------------------------------
-- 17.4 leave_requests
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Leave application requests and approvals |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Multi-level approval, attachments |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.leave_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    leave_type_id uuid NOT NULL REFERENCES public.leave_types(id),
    start_date date NOT NULL,
    end_date date NOT NULL,
    days numeric NOT NULL,
    reason text,
    status text DEFAULT 'pending',
    approved_by uuid,
    approved_at timestamptz,
    rejection_reason text,
    attachments jsonb DEFAULT '[]',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 📂 PART 18: SHIFT MANAGEMENT TABLES (PENDING MIGRATION)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 18.1 shifts
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Shift definitions with timing and settings |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Break times, overtime rules |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.shifts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    code text NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    break_duration_minutes integer DEFAULT 0,
    grace_period_minutes integer DEFAULT 15,
    overtime_threshold_minutes integer DEFAULT 30,
    is_night_shift boolean DEFAULT false,
    color text DEFAULT '#3B82F6',
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, code)
);

-- ----------------------------------------------------------------------------
-- 18.2 shift_assignments
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Employee shift assignments |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Date-based, status tracking |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.shift_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    shift_id uuid NOT NULL REFERENCES public.shifts(id) ON DELETE CASCADE,
    date date NOT NULL,
    status text DEFAULT 'scheduled',
    notes text,
    created_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, employee_id, date)
);

-- ----------------------------------------------------------------------------
-- 18.3 shift_swap_requests
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Shift swap requests between employees |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Approval workflow, reason tracking |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.shift_swap_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    requester_id uuid NOT NULL,
    requester_assignment_id uuid NOT NULL REFERENCES public.shift_assignments(id),
    target_id uuid NOT NULL,
    target_assignment_id uuid NOT NULL REFERENCES public.shift_assignments(id),
    reason text,
    status text DEFAULT 'pending',
    approved_by uuid,
    approved_at timestamptz,
    rejection_reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 📂 PART 19: OVERTIME & GEOFENCING TABLES (PENDING MIGRATION)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 19.1 overtime_records
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Overtime hours tracking with approval status |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Rate multipliers, approval workflow |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.overtime_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    date date NOT NULL,
    hours numeric NOT NULL,
    overtime_type text DEFAULT 'regular',
    rate_multiplier numeric DEFAULT 1.5,
    amount numeric,
    status text DEFAULT 'pending',
    approved_by uuid,
    approved_at timestamptz,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 19.2 geofence_zones
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Office location geofence boundaries |
-- | **Primary Key** | id (uuid) |
-- | **Features** | GPS coordinates, radius, active hours |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.geofence_zones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    latitude numeric NOT NULL,
    longitude numeric NOT NULL,
    radius_meters integer NOT NULL DEFAULT 100,
    address text,
    is_primary boolean DEFAULT false,
    is_active boolean DEFAULT true,
    active_days text[] DEFAULT ARRAY['mon','tue','wed','thu','fri'],
    active_start_time time,
    active_end_time time,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 19.3 geofence_attendance_logs
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | GPS-validated attendance entries |
-- | **Primary Key** | id (uuid) |
-- | **Features** | Distance calculation, mock location detection |
-- | **Status** | 📋 Pending Migration |
-- ----------------------------------------------------------------------------

CREATE TABLE public.geofence_attendance_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    zone_id uuid NOT NULL REFERENCES public.geofence_zones(id),
    action text NOT NULL,
    latitude numeric NOT NULL,
    longitude numeric NOT NULL,
    accuracy_meters numeric,
    distance_from_zone numeric,
    is_within_zone boolean,
    is_mock_location boolean DEFAULT false,
    device_info jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);


-- ============================================================================
-- 📂 PART 20: DATABASE FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 20.1 generate_quote_number()
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Auto-generate quote numbers (ATL-YYYY-XXXX) |
-- | **Returns** | text |
-- | **Example** | ATL-2025-0001 |
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
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
$function$;

-- ----------------------------------------------------------------------------
-- 20.2 generate_invoice_number()
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Auto-generate invoice numbers (INV-YYYY-XXXX) |
-- | **Returns** | text |
-- | **Example** | INV-2025-0001 |
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
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
$function$;

-- ----------------------------------------------------------------------------
-- 20.3 generate_client_id()
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Auto-generate client IDs (ATLS-YYYYMMDD-XXXX) |
-- | **Returns** | text |
-- | **Example** | ATLS-20251207-0001 |
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.generate_client_id()
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
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
$function$;

-- ----------------------------------------------------------------------------
-- 20.4 generate_ticket_number()
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Auto-generate ticket numbers (TKT-XXXXX) |
-- | **Returns** | text |
-- | **Example** | TKT-00001 |
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
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
$function$;

-- ----------------------------------------------------------------------------
-- 20.5 handle_new_user()
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Trigger function to create profile on user signup |
-- | **Returns** | trigger |
-- | **Trigger** | on_auth_user_created |
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- ----------------------------------------------------------------------------
-- 20.6 has_role()
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Security definer to check user roles (RBAC) |
-- | **Returns** | boolean |
-- | **Parameters** | _user_id uuid, _role app_role |
-- | **SECURITY** | SECURITY DEFINER for RLS policy use |
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role = _role
    )
$function$;

-- ----------------------------------------------------------------------------
-- 20.7 is_feature_enabled_for_user()
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Purpose** | Check if feature is enabled for specific user |
-- | **Returns** | boolean |
-- | **Parameters** | _user_id uuid, _feature_key text |
-- | **Status** | 📋 Pending (requires feature tables) |
-- ----------------------------------------------------------------------------

-- Function will be created after feature tables are migrated
-- CREATE OR REPLACE FUNCTION public.is_feature_enabled_for_user(...)


-- ============================================================================
-- 📂 PART 21: TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 21.1 on_auth_user_created
-- ----------------------------------------------------------------------------
-- | Attribute | Details |
-- |-----------|---------|
-- | **Table** | auth.users |
-- | **Event** | AFTER INSERT |
-- | **Function** | handle_new_user() |
-- | **Purpose** | Creates profile when user signs up |
-- ----------------------------------------------------------------------------

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- 📂 PART 22: ROW LEVEL SECURITY (RLS) POLICIES
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

-- ----------------------------------------------------------------------------
-- Profiles Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- User Roles Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- Client Tenants Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own tenant" ON public.client_tenants
    FOR SELECT USING (
        id IN (SELECT tenant_id FROM public.client_tenant_users WHERE user_id = auth.uid())
    );

CREATE POLICY "Admins can manage tenants" ON public.client_tenants
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- Quotes Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Anyone can create quotes" ON public.quotes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own quotes" ON public.quotes
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own quotes" ON public.quotes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all quotes" ON public.quotes
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all quotes" ON public.quotes
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- Invoices Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all invoices" ON public.invoices
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert invoices" ON public.invoices
    FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update invoices" ON public.invoices
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- Leads Policies (Admin Only)
-- ----------------------------------------------------------------------------
CREATE POLICY "Admins can manage leads" ON public.leads
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- Inquiries Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Anyone can create inquiry" ON public.inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own inquiries" ON public.inquiries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all inquiries" ON public.inquiries
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- Projects Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all projects" ON public.projects
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage projects" ON public.projects
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- Support Tickets Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can create tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own tickets" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage tickets" ON public.support_tickets
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- Admin-Only Table Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Admins can manage admin notifications" ON public.admin_notifications
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage admin settings" ON public.admin_settings
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage portal settings" ON public.portal_settings
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage compliance" ON public.compliance_items
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage integrations" ON public.integrations
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- Logging Table Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert system logs" ON public.system_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view system logs" ON public.system_logs
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert clickstream" ON public.clickstream_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view clickstream" ON public.clickstream_events
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- Public Read Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Anyone can view active pricing" ON public.service_pricing
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage pricing" ON public.service_pricing
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active addons" ON public.service_addons
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage addons" ON public.service_addons
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view team" ON public.team_members
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage team" ON public.team_members
    FOR ALL USING (has_role(auth.uid(), 'admin'));


-- ============================================================================
-- 📂 PART 23: INDEXES
-- ============================================================================

-- Core table indexes
CREATE INDEX idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_client_tenant_users_user_id ON public.client_tenant_users(user_id);
CREATE INDEX idx_client_tenant_users_tenant_id ON public.client_tenant_users(tenant_id);

-- Sales & CRM indexes
CREATE INDEX idx_quotes_user_id ON public.quotes(user_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_email ON public.leads(email);

-- Project indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_project_milestones_project_id ON public.project_milestones(project_id);

-- Support indexes
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);

-- MSP indexes
CREATE INDEX idx_client_msp_servers_tenant_id ON public.client_msp_servers(tenant_id);
CREATE INDEX idx_client_msp_metrics_server_id ON public.client_msp_metrics(server_id);
CREATE INDEX idx_client_msp_alerts_tenant_id ON public.client_msp_alerts(tenant_id);

-- Analytics indexes
CREATE INDEX idx_clickstream_events_session_id ON public.clickstream_events(session_id);
CREATE INDEX idx_clickstream_events_created_at ON public.clickstream_events(created_at);
CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Onboarding indexes
CREATE INDEX idx_onboarding_sessions_email ON public.onboarding_sessions(email);
CREATE INDEX idx_onboarding_sessions_status ON public.onboarding_sessions(status);
CREATE INDEX idx_onboarding_sessions_client_id ON public.onboarding_sessions(client_id);


-- ============================================================================
-- 📂 PART 24: REALTIME PUBLICATION
-- ============================================================================

-- Enable realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_msp_alerts;


-- ============================================================================
-- 📂 PART 25: A/B TESTING & AI ANALYTICS TABLES
-- ============================================================================

-- 25.1 A/B Testing Experiments
CREATE TABLE IF NOT EXISTS public.ab_experiments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  hypothesis TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed', 'archived')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  target_audience TEXT DEFAULT 'all',
  traffic_allocation NUMERIC DEFAULT 100,
  primary_metric TEXT NOT NULL,
  secondary_metrics JSONB DEFAULT '[]'::jsonb,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 25.2 A/B Test Variants
CREATE TABLE IF NOT EXISTS public.ab_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID NOT NULL REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_control BOOLEAN DEFAULT false,
  traffic_weight NUMERIC DEFAULT 50,
  variant_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 25.3 A/B Test Results
CREATE TABLE IF NOT EXISTS public.ab_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID NOT NULL REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.ab_variants(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  sample_size INTEGER DEFAULT 0,
  conversion_rate NUMERIC,
  confidence_level NUMERIC,
  is_significant BOOLEAN DEFAULT false,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 25.4 A/B Test User Assignments
CREATE TABLE IF NOT EXISTS public.ab_user_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID NOT NULL REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.ab_variants(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted BOOLEAN DEFAULT false,
  converted_at TIMESTAMP WITH TIME ZONE,
  conversion_value NUMERIC
);

-- 25.5 AI Predictions Cache
CREATE TABLE IF NOT EXISTS public.ai_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('mrr_forecast', 'churn_risk', 'conversion_improvement')),
  input_data JSONB NOT NULL,
  prediction_result JSONB NOT NULL,
  confidence_score NUMERIC,
  model_version TEXT DEFAULT 'gemini-2.5-flash',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.ab_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_user_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage experiments" ON public.ab_experiments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage variants" ON public.ab_variants FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage results" ON public.ab_results FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage assignments" ON public.ab_user_assignments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert assignments" ON public.ab_user_assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view predictions" ON public.ai_predictions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "System can insert predictions" ON public.ai_predictions FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX idx_ab_experiments_status ON public.ab_experiments(status);
CREATE INDEX idx_ab_variants_experiment ON public.ab_variants(experiment_id);
CREATE INDEX idx_ab_results_experiment ON public.ab_results(experiment_id);
CREATE INDEX idx_ab_user_assignments_experiment ON public.ab_user_assignments(experiment_id);
CREATE INDEX idx_ab_user_assignments_user ON public.ab_user_assignments(user_id);
CREATE INDEX idx_ai_predictions_type ON public.ai_predictions(prediction_type);

-- Trigger for updated_at
CREATE TRIGGER update_ab_experiments_updated_at
  BEFORE UPDATE ON public.ab_experiments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================================
-- PART 26: SIDEBAR ACCESS AUDIT LOGS
-- ============================================================================

-- 26.1 Sidebar Access Logs Table
CREATE TABLE IF NOT EXISTS public.sidebar_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.client_tenants(id) ON DELETE CASCADE,
  admin_user_id UUID,
  action_type TEXT NOT NULL DEFAULT 'update', -- update, copy, reset, bulk_enable, bulk_disable
  role_affected TEXT NOT NULL,
  module_id TEXT,
  previous_value BOOLEAN,
  new_value BOOLEAN,
  copy_from_role TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sidebar_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Tenant admins can view their logs"
  ON public.sidebar_access_logs
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.client_tenant_users 
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Tenant admins can insert logs"
  ON public.sidebar_access_logs
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.client_tenant_users 
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Indexes
CREATE INDEX idx_sidebar_access_logs_tenant ON public.sidebar_access_logs(tenant_id);
CREATE INDEX idx_sidebar_access_logs_created ON public.sidebar_access_logs(created_at DESC);
CREATE INDEX idx_sidebar_access_logs_admin ON public.sidebar_access_logs(admin_user_id);
CREATE INDEX idx_sidebar_access_logs_role ON public.sidebar_access_logs(role_affected);
CREATE INDEX idx_sidebar_access_logs_action ON public.sidebar_access_logs(action_type);

-- 26.2 Sidebar Access Log Trigger Function
CREATE OR REPLACE FUNCTION public.log_sidebar_access_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.sidebar_access_logs (
    tenant_id,
    admin_user_id,
    action_type,
    role_affected,
    module_id,
    previous_value,
    new_value,
    metadata
  ) VALUES (
    NEW.tenant_id,
    auth.uid(),
    'update',
    TG_ARGV[0],
    NEW.module_id,
    NULL,
    NEW.is_enabled,
    jsonb_build_object('triggered_by', 'database_trigger')
  );
  
  RETURN NEW;
END;
$$;


-- ============================================================================
-- 🏁 END OF SCHEMA
-- ============================================================================
--
-- SUMMARY:
-- ✅ 67 Tables defined (41 live + 26 pending migration)
-- ✅ 9 Database functions (including log_sidebar_access_change)
-- ✅ 3 Triggers
-- ✅ 15 Enums/Types
-- ✅ 87+ RLS policies
-- ✅ 65+ Indexes
-- ✅ Realtime enabled on key tables
--
-- NEXT STEPS:
-- 1. Run migration for pending tables (Parts 13-19)
-- 2. Deploy remaining edge functions
-- 3. Configure additional secrets as needed
--
-- ============================================================================
