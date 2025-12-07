-- ============================================================================
-- ATLAS DATABASE SCHEMA - COMPLETE SQL REFERENCE
-- ============================================================================
-- 
-- PURPOSE: Complete database schema for ATLAS Workforce Operating System
--          including all tables, functions, triggers, enums, and RLS policies
--
-- VERSION: 3.0.0
-- LAST UPDATED: December 7, 2025
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
-- ATLAS DATABASE SCHEMA STATISTICS
-- ============================================================================
-- 
-- LAST UPDATED: December 7, 2025 @ 17:30 UTC
--
-- COMPONENT COUNTS:
--   Database Tables: 52 (35 core + 7 operational + 5 HR module + 5 shift/geofencing)
--   Database Functions: 7
--   Database Triggers: 2
--   Edge Functions: 15 (10 deployed + 5 documented)
--   Storage Buckets: 1
--   Secrets Configured: 6
--   Enums/Types: 15 (10 existing + 2 HR + 3 new shift/geofencing)
--   RLS Policies: 75+
--   Indexes: 50+
--
-- ============================================================================
-- TABLE SUMMARY (52 Tables) - Quick Reference
-- ============================================================================
--
-- | # | Table Name                  | Category          | Purpose/Description                                    |
-- |---|-----------------------------|--------------------|--------------------------------------------------------|
-- | 1 | profiles                    | Core               | User profile data (name, email, phone, company)        |
-- | 2 | user_roles                  | Core               | User role assignments (admin, user) for RBAC           |
-- | 3 | client_tenants              | Core               | Organization/company tenant records                    |
-- | 4 | client_tenant_users         | Core               | Maps users to their tenant memberships                 |
-- | 5 | quotes                      | Sales & CRM        | Service quotes with pricing, status, contact info      |
-- | 6 | invoices                    | Sales & CRM        | Client invoices with amounts, due dates, status        |
-- | 7 | leads                       | Sales & CRM        | Sales leads with scores, sources, conversion tracking  |
-- | 8 | inquiries                   | Sales & CRM        | Contact form submissions and service inquiries         |
-- | 9 | onboarding_sessions         | Onboarding         | Client onboarding wizard progress and data             |
-- |10 | client_onboarding           | Onboarding         | Simple onboarding requests (pre-approval stage)        |
-- |11 | projects                    | Project Mgmt       | Client projects with status, budget, timeline          |
-- |12 | project_milestones          | Project Mgmt       | Project milestones with due dates and completion       |
-- |13 | support_tickets             | Support            | Support tickets with priority, SLA, assignment         |
-- |14 | ticket_messages             | Support            | Messages/replies within support tickets                |
-- |15 | meetings                    | Communication      | Scheduled meetings with clients and team               |
-- |16 | client_files                | File Management    | Client uploaded files with versioning                  |
-- |17 | client_feedback             | File Management    | Client feedback ratings and comments                   |
-- |18 | client_msp_servers          | MSP Monitoring     | Monitored servers for managed service clients          |
-- |19 | client_msp_metrics          | MSP Monitoring     | Server performance metrics (CPU, memory, disk)         |
-- |20 | client_msp_alerts           | MSP Monitoring     | Server alerts and incident notifications               |
-- |21 | service_pricing             | Pricing            | Service pricing tiers and features                     |
-- |22 | service_addons              | Pricing            | Optional add-on services with pricing                  |
-- |23 | pricing_modifiers           | Pricing            | Industry/size pricing multipliers                      |
-- |24 | coupon_codes                | Pricing            | Discount coupons with usage limits                     |
-- |25 | admin_notifications         | Admin              | Admin-targeted notifications                           |
-- |26 | admin_settings              | Admin              | Platform-wide admin configuration                      |
-- |27 | portal_settings             | Admin              | Client portal configuration settings                   |
-- |28 | audit_logs                  | Logging            | System audit trail for compliance                      |
-- |29 | system_logs                 | Logging            | Application logs for debugging                         |
-- |30 | clickstream_events          | Logging            | User interaction tracking for analytics                |
-- |31 | api_usage                   | Logging            | API endpoint usage tracking                            |
-- |32 | team_members                | Team               | Internal team member profiles                          |
-- |33 | compliance_items            | Compliance         | Compliance checklist items and status                  |
-- |34 | integrations                | Integrations       | Third-party integration configurations                 |
-- |35 | client_notices              | Communication      | Announcements and notices for clients                  |
-- |36 | global_features             | Features           | Platform-wide feature definitions                      |
-- |37 | tenant_features             | Features           | Tenant-specific feature flags                          |
-- |38 | role_feature_defaults       | Features           | Default features by role                               |
-- |39 | employee_feature_access     | Features           | Individual employee feature permissions                |
-- |40 | employee_notifications      | Notifications      | Employee notification records                          |
-- |41 | notification_preferences    | Notifications      | User notification channel preferences                  |
-- |42 | feature_unlock_log          | Notifications      | Log of feature unlock events                           |
-- |43 | payroll_runs                | Payroll            | Monthly/weekly payroll processing runs                 |
-- |44 | payslips                    | Payroll            | Individual employee payslips                           |
-- |45 | bgv_requests                | BGV                | Background verification requests                       |
-- |46 | sso_states                  | SSO                | OAuth state tokens for SSO flows                       |
-- |47 | insurance_claims            | Insurance          | Employee insurance claim submissions                   |
-- |48 | document_verifications      | Documents          | Document verification requests and results             |
-- |49 | document_extractions        | Documents          | OCR/data extraction from documents                     |
-- |50 | employees                   | HR                 | Employee master records with employment details        |
-- |51 | attendance_records          | HR                 | Daily attendance check-in/check-out records            |
-- |52 | leave_types                 | HR                 | Leave type definitions (annual, sick, etc.)            |
-- |53 | leave_balances              | HR                 | Employee leave balance tracking                        |
-- |54 | leave_requests              | HR                 | Leave application requests and approvals               |
-- |55 | shifts                      | Shift Mgmt         | Shift definitions with timing and settings             |
-- |56 | shift_assignments           | Shift Mgmt         | Employee shift assignments                             |
-- |57 | shift_swap_requests         | Shift Mgmt         | Shift swap requests between employees                  |
-- |58 | overtime_records            | Overtime           | Overtime hours tracking with approval status           |
-- |59 | geofence_zones              | Geofencing         | Office location geofence boundaries                    |
-- |60 | geofence_attendance_logs    | Geofencing         | GPS-validated attendance entries                       |
--
-- ============================================================================
-- DATABASE FUNCTIONS SUMMARY (7 Functions)
-- ============================================================================
--
-- | # | Function Name              | Purpose                                              |
-- |---|----------------------------|------------------------------------------------------|
-- | 1 | generate_quote_number()    | Auto-generate quote numbers (ATL-YYYY-XXXX format)   |
-- | 2 | generate_invoice_number()  | Auto-generate invoice numbers (INV-YYYY-XXXX format) |
-- | 3 | generate_client_id()       | Auto-generate client IDs (ATLS-YYYYMMDD-XXXX format) |
-- | 4 | generate_ticket_number()   | Auto-generate ticket numbers (TKT-XXXXX format)      |
-- | 5 | handle_new_user()          | Trigger function to create profile on user signup    |
-- | 6 | has_role()                 | Security definer to check user roles (RBAC)          |
-- | 7 | is_feature_enabled_for_user() | Check if feature is enabled for specific user     |
--
-- ============================================================================
-- DATABASE TRIGGERS SUMMARY (2 Triggers)
-- ============================================================================
--
-- | # | Trigger Name               | Table      | Purpose                                |
-- |---|----------------------------|------------|----------------------------------------|
-- | 1 | on_auth_user_created       | auth.users | Creates profile when user signs up     |
-- | 2 | on_employee_feature_enabled| employee_feature_access | Notifies when features unlocked |
--
-- ============================================================================
-- ENUMS/TYPES SUMMARY (15 Types)
-- ============================================================================
--
-- | # | Type Name                  | Values                                               |
-- |---|----------------------------|------------------------------------------------------|
-- | 1 | app_role                   | admin, user                                          |
-- | 2 | quote_status               | draft, pending, approved, rejected, converted        |
-- | 3 | invoice_status             | draft, sent, paid, overdue, cancelled                |
-- | 4 | feature_category           | core, payroll, talent, operations, compliance, intelligence, integrations |
-- | 5 | feature_tier               | starter, professional, business, enterprise          |
-- | 6 | tenant_role                | super_admin, admin, hr_manager, manager, employee    |
-- | 7 | notification_type          | feature_unlock, system, alert, reminder, message     |
-- | 8 | notification_channel       | in_app, email, sms, push                             |
-- | 9 | notification_priority      | low, normal, high, urgent                            |
-- |10 | employment_status          | active, probation, notice, terminated, resigned      |
-- |11 | attendance_status          | present, absent, half_day, late, on_leave, holiday   |
-- |12 | shift_status               | draft, published, active, completed, cancelled       |
-- |13 | shift_assignment_status    | scheduled, confirmed, completed, missed, swapped     |
-- |14 | shift_swap_status          | pending, approved, rejected, cancelled               |
-- |15 | overtime_type              | regular, weekend, holiday, night_shift               |
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
-- PART 14: PAYROLL & HR OPERATIONS TABLES
-- ============================================================================

-- 14.1 Payroll Runs
CREATE TABLE public.payroll_runs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    run_number text NOT NULL,               -- Format: PAY-YYYYMM-XXXX
    pay_period_start date NOT NULL,
    pay_period_end date NOT NULL,
    status text DEFAULT 'pending',          -- pending/processing/completed/failed
    total_employees integer DEFAULT 0,
    total_gross_pay numeric(15,2) DEFAULT 0,
    total_deductions numeric(15,2) DEFAULT 0,
    total_net_pay numeric(15,2) DEFAULT 0,
    total_employer_contributions numeric(15,2) DEFAULT 0,
    currency text DEFAULT 'INR',
    processed_at timestamptz,
    processed_by uuid,
    approved_at timestamptz,
    approved_by uuid,
    notes text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.payroll_runs IS 'Monthly/weekly payroll processing runs for tenant organizations';

-- 14.2 Payslips
CREATE TABLE public.payslips (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id uuid NOT NULL REFERENCES public.payroll_runs(id) ON DELETE CASCADE,
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    user_id uuid,
    
    -- Employee Details (snapshot at time of payslip)
    employee_name text NOT NULL,
    employee_email text,
    employee_code text,
    department text,
    designation text,
    
    -- Pay Period
    pay_period_start date NOT NULL,
    pay_period_end date NOT NULL,
    
    -- Earnings
    basic_salary numeric(12,2) DEFAULT 0,
    hra numeric(12,2) DEFAULT 0,
    conveyance numeric(12,2) DEFAULT 0,
    medical_allowance numeric(12,2) DEFAULT 0,
    special_allowance numeric(12,2) DEFAULT 0,
    other_earnings numeric(12,2) DEFAULT 0,
    overtime_pay numeric(12,2) DEFAULT 0,
    bonus numeric(12,2) DEFAULT 0,
    gross_pay numeric(12,2) NOT NULL,
    
    -- Deductions
    pf_employee numeric(12,2) DEFAULT 0,    -- Provident Fund (Employee)
    pf_employer numeric(12,2) DEFAULT 0,    -- Provident Fund (Employer)
    esic_employee numeric(12,2) DEFAULT 0,  -- ESI (Employee)
    esic_employer numeric(12,2) DEFAULT 0,  -- ESI (Employer)
    professional_tax numeric(12,2) DEFAULT 0,
    tds numeric(12,2) DEFAULT 0,            -- Tax Deducted at Source
    loan_deduction numeric(12,2) DEFAULT 0,
    other_deductions numeric(12,2) DEFAULT 0,
    total_deductions numeric(12,2) NOT NULL,
    
    -- Net Pay
    net_pay numeric(12,2) NOT NULL,
    
    -- Payment Details
    payment_mode text DEFAULT 'bank_transfer', -- bank_transfer/cheque/cash
    bank_name text,
    bank_account_last4 text,
    payment_reference text,
    paid_at timestamptz,
    
    -- Status
    status text DEFAULT 'generated',        -- generated/sent/viewed/disputed
    sent_at timestamptz,
    viewed_at timestamptz,
    
    -- PDF
    pdf_url text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.payslips IS 'Individual employee payslips generated from payroll runs';

-- 14.3 BGV Requests (Background Verification)
CREATE TABLE public.bgv_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number text NOT NULL,           -- Format: BGV-YYYYMMDD-XXXX
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    user_id uuid,
    
    -- Employee Info
    employee_name text NOT NULL,
    employee_email text NOT NULL,
    
    -- Verification Types Requested
    verification_types jsonb DEFAULT '[]',  -- ["identity", "address", "education", "employment", "criminal"]
    
    -- Provider Info
    provider_name text,                     -- e.g., "AuthBridge", "HireRight"
    provider_request_id text,
    provider_status text,
    
    -- Status
    status text DEFAULT 'pending',          -- pending/in_progress/completed/failed
    overall_result text,                    -- clear/adverse/pending
    
    -- Results (per verification type)
    results jsonb DEFAULT '{}',
    
    -- Timestamps
    initiated_at timestamptz DEFAULT now(),
    initiated_by uuid,
    submitted_at timestamptz,
    completed_at timestamptz,
    
    -- Cost
    cost numeric(10,2),
    currency text DEFAULT 'INR',
    
    -- Documents
    documents jsonb DEFAULT '[]',
    
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.bgv_requests IS 'Background verification requests for employees via third-party providers';

-- 14.4 SSO States (OAuth/SAML state management)
CREATE TABLE public.sso_states (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    state_token text UNIQUE NOT NULL,
    tenant_id uuid REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    provider text NOT NULL,                 -- google/microsoft/okta/saml
    redirect_url text,
    code_verifier text,                     -- For PKCE
    nonce text,
    metadata jsonb DEFAULT '{}',
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.sso_states IS 'Temporary state storage for SSO authentication flows (auto-cleanup after use)';

-- 14.5 Insurance Claims
CREATE TABLE public.insurance_claims (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_number text NOT NULL,             -- Format: CLM-YYYYMMDD-XXXX
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL,
    user_id uuid,
    
    -- Employee Info
    employee_name text NOT NULL,
    employee_email text,
    
    -- Claim Details
    claim_type text NOT NULL,               -- medical/dental/vision/life/disability
    policy_number text,
    policy_provider text,
    
    -- Amounts
    claim_amount numeric(12,2) NOT NULL,
    approved_amount numeric(12,2),
    currency text DEFAULT 'INR',
    
    -- Status
    status text DEFAULT 'submitted',        -- submitted/under_review/approved/rejected/paid
    rejection_reason text,
    
    -- Dates
    incident_date date,
    submission_date date DEFAULT CURRENT_DATE,
    review_started_at timestamptz,
    decision_date timestamptz,
    payment_date timestamptz,
    
    -- Provider
    provider_claim_id text,
    provider_status text,
    
    -- Documents
    documents jsonb DEFAULT '[]',           -- Array of document URLs/IDs
    
    -- Processing
    processed_by uuid,
    processed_at timestamptz,
    
    notes text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.insurance_claims IS 'Employee insurance claims (medical, dental, vision, life, disability)';

-- 14.6 Document Verifications
CREATE TABLE public.document_verifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_number text NOT NULL,      -- Format: VER-YYYYMMDD-XXXX
    tenant_id uuid REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    
    -- Document Info
    document_type text NOT NULL,            -- aadhaar/pan/passport/license/voter_id/bank_statement
    document_number text,
    document_name text,
    document_url text,
    
    -- Owner Info
    owner_id uuid,
    owner_type text,                        -- employee/candidate/vendor
    owner_name text,
    
    -- Verification
    verification_method text,               -- api/manual/ocr
    provider_name text,
    provider_request_id text,
    
    -- Status & Results
    status text DEFAULT 'pending',          -- pending/processing/verified/failed/invalid
    is_valid boolean,
    confidence_score numeric(5,2),          -- 0-100%
    verification_result jsonb DEFAULT '{}',
    failure_reason text,
    
    -- Timestamps
    submitted_at timestamptz DEFAULT now(),
    verified_at timestamptz,
    expires_at timestamptz,
    
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.document_verifications IS 'KYC and document verification requests with API/OCR integration';

-- 14.7 Document Extractions (OCR)
CREATE TABLE public.document_extractions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    extraction_number text NOT NULL,        -- Format: EXT-YYYYMMDD-XXXX
    tenant_id uuid REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    verification_id uuid REFERENCES public.document_verifications(id),
    
    -- Document Info
    document_url text NOT NULL,
    document_type text,
    file_name text,
    file_size bigint,
    mime_type text,
    
    -- Extraction Results
    status text DEFAULT 'pending',          -- pending/processing/completed/failed
    extracted_data jsonb DEFAULT '{}',      -- All extracted fields
    
    -- Specific Extracted Fields (common)
    extracted_name text,
    extracted_dob date,
    extracted_address text,
    extracted_id_number text,
    
    -- OCR Details
    ocr_provider text,                      -- google_vision/aws_textract/azure
    ocr_confidence numeric(5,2),
    raw_ocr_response jsonb,
    
    -- Processing
    processing_time_ms integer,
    error_message text,
    
    processed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.document_extractions IS 'OCR document data extraction results from verification documents';


-- ============================================================================
-- PART 15: HR MODULE TABLES (Employees, Attendance, Leave)
-- ============================================================================

-- 15.1 Employees (Core employee records)
CREATE TABLE public.employees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code text NOT NULL,            -- Format: EMP-XXXX or custom per tenant
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id), -- Linked Supabase auth user (optional)
    
    -- Personal Information
    first_name text NOT NULL,
    last_name text NOT NULL,
    full_name text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    email text NOT NULL,
    personal_email text,
    phone text,
    mobile text,
    date_of_birth date,
    gender text,                            -- male/female/other/prefer_not_to_say
    blood_group text,
    marital_status text,
    nationality text DEFAULT 'Indian',
    
    -- Address
    current_address jsonb DEFAULT '{}',
    permanent_address jsonb DEFAULT '{}',
    
    -- Employment Details
    employment_type text DEFAULT 'full_time', -- full_time/part_time/contract/intern/consultant
    employment_status text DEFAULT 'active',  -- active/inactive/terminated/resigned/on_leave
    department text,
    designation text,
    job_title text,
    grade text,
    reporting_manager_id uuid REFERENCES public.employees(id),
    
    -- Dates
    date_of_joining date NOT NULL,
    date_of_confirmation date,
    date_of_exit date,
    probation_end_date date,
    
    -- Work Location
    work_location text,
    branch text,
    is_remote boolean DEFAULT false,
    
    -- Compensation
    salary_currency text DEFAULT 'INR',
    ctc_annual numeric(15,2),
    basic_salary numeric(12,2),
    
    -- Bank Details (encrypted in production)
    bank_name text,
    bank_account_number text,
    bank_ifsc_code text,
    
    -- Statutory IDs
    pan_number text,
    aadhaar_number text,
    uan_number text,                        -- Universal Account Number (PF)
    esic_number text,
    
    -- Emergency Contact
    emergency_contact_name text,
    emergency_contact_phone text,
    emergency_contact_relation text,
    
    -- Profile
    avatar_url text,
    bio text,
    skills jsonb DEFAULT '[]',
    
    -- Metadata
    custom_fields jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, employee_code),
    UNIQUE(tenant_id, email)
);

COMMENT ON TABLE public.employees IS 'Core employee master data for each tenant organization';

-- 15.2 Attendance Records
CREATE TABLE public.attendance_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    
    -- Date
    attendance_date date NOT NULL,
    
    -- Check-in/Check-out
    check_in_time timestamptz,
    check_out_time timestamptz,
    
    -- Duration
    total_hours numeric(5,2),               -- Calculated work hours
    break_hours numeric(5,2) DEFAULT 0,
    overtime_hours numeric(5,2) DEFAULT 0,
    
    -- Status
    status text DEFAULT 'present',          -- present/absent/half_day/leave/holiday/weekend/work_from_home
    attendance_type text DEFAULT 'regular', -- regular/wfh/on_site/field
    
    -- Location (for geo-fencing)
    check_in_location jsonb,                -- {lat, lng, address}
    check_out_location jsonb,
    is_location_verified boolean DEFAULT false,
    
    -- Device Info
    check_in_device text,                   -- mobile/web/biometric/manual
    check_out_device text,
    check_in_ip text,
    check_out_ip text,
    
    -- Regularization
    is_regularized boolean DEFAULT false,
    regularized_by uuid,
    regularized_at timestamptz,
    regularization_reason text,
    
    -- Shift
    shift_id uuid,
    shift_name text,
    expected_check_in time,
    expected_check_out time,
    
    -- Late/Early
    is_late boolean DEFAULT false,
    late_by_minutes integer DEFAULT 0,
    is_early_departure boolean DEFAULT false,
    early_by_minutes integer DEFAULT 0,
    
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, employee_id, attendance_date)
);

COMMENT ON TABLE public.attendance_records IS 'Daily attendance records with check-in/out times, location, and regularization';

-- 15.3 Leave Types (Configurable per tenant)
CREATE TABLE public.leave_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    
    name text NOT NULL,                     -- Casual Leave, Sick Leave, Earned Leave, etc.
    code text NOT NULL,                     -- CL, SL, EL, etc.
    description text,
    
    -- Configuration
    is_paid boolean DEFAULT true,
    is_encashable boolean DEFAULT false,
    is_carry_forward boolean DEFAULT false,
    max_carry_forward_days integer DEFAULT 0,
    
    -- Accrual
    accrual_type text DEFAULT 'annual',     -- annual/monthly/quarterly/none
    annual_quota numeric(5,2),              -- Days per year
    monthly_accrual numeric(5,2),
    
    -- Limits
    max_consecutive_days integer,
    min_days_notice integer DEFAULT 0,
    max_times_per_year integer,
    
    -- Applicability
    applicable_gender text,                 -- all/male/female
    applicable_employment_types jsonb DEFAULT '["full_time"]',
    probation_allowed boolean DEFAULT false,
    
    -- Color for UI
    color text DEFAULT '#3B82F6',
    
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, code)
);

COMMENT ON TABLE public.leave_types IS 'Configurable leave types per tenant with accrual and limit rules';

-- 15.4 Leave Balances
CREATE TABLE public.leave_balances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    leave_type_id uuid NOT NULL REFERENCES public.leave_types(id) ON DELETE CASCADE,
    
    -- Balance Year
    year integer NOT NULL,
    
    -- Balance Details
    opening_balance numeric(5,2) DEFAULT 0,
    accrued numeric(5,2) DEFAULT 0,
    used numeric(5,2) DEFAULT 0,
    pending numeric(5,2) DEFAULT 0,         -- Requested but not approved
    encashed numeric(5,2) DEFAULT 0,
    lapsed numeric(5,2) DEFAULT 0,
    carry_forward numeric(5,2) DEFAULT 0,
    
    -- Calculated
    available_balance numeric(5,2) GENERATED ALWAYS AS (opening_balance + accrued + carry_forward - used - encashed - lapsed) STORED,
    
    last_accrual_date date,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, employee_id, leave_type_id, year)
);

COMMENT ON TABLE public.leave_balances IS 'Employee leave balance tracking per leave type and year';

-- 15.5 Leave Requests
CREATE TABLE public.leave_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number text NOT NULL,           -- Format: LV-YYYYMMDD-XXXX
    tenant_id uuid NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    leave_type_id uuid NOT NULL REFERENCES public.leave_types(id),
    
    -- Leave Period
    start_date date NOT NULL,
    end_date date NOT NULL,
    
    -- Days
    total_days numeric(5,2) NOT NULL,
    half_day_start boolean DEFAULT false,   -- Half day on start date
    half_day_end boolean DEFAULT false,     -- Half day on end date
    
    -- Status
    status text DEFAULT 'pending',          -- pending/approved/rejected/cancelled/withdrawn
    
    -- Reason
    reason text NOT NULL,
    
    -- Approval Chain
    approver_id uuid REFERENCES public.employees(id),
    approved_at timestamptz,
    rejected_at timestamptz,
    rejection_reason text,
    
    -- Multi-level Approval
    approval_chain jsonb DEFAULT '[]',      -- Array of {approver_id, status, timestamp, comments}
    current_approval_level integer DEFAULT 1,
    
    -- Attachments (for medical certificates, etc.)
    attachments jsonb DEFAULT '[]',
    
    -- Contact during leave
    contact_number text,
    handover_to uuid REFERENCES public.employees(id),
    handover_notes text,
    
    -- Cancellation
    cancelled_at timestamptz,
    cancellation_reason text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.leave_requests IS 'Employee leave requests with approval workflow';


-- ============================================================================
-- PART 16: DATABASE FUNCTIONS
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
-- PART 19: NEW TABLES - ENABLE RLS
-- ============================================================================

ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bgv_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sso_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_extractions ENABLE ROW LEVEL SECURITY;

-- Payroll Runs Policies
CREATE POLICY "Admins can manage payroll runs" ON public.payroll_runs
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Tenant admins can manage own payroll runs" ON public.payroll_runs
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- Payslips Policies
CREATE POLICY "Admins can manage payslips" ON public.payslips
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view own payslips" ON public.payslips
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Tenant admins can manage payslips" ON public.payslips
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- BGV Requests Policies
CREATE POLICY "Admins can manage BGV requests" ON public.bgv_requests
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Tenant admins can manage BGV" ON public.bgv_requests
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- SSO States Policies (service role only typically)
CREATE POLICY "System can manage SSO states" ON public.sso_states
    FOR ALL USING (true);

-- Insurance Claims Policies
CREATE POLICY "Admins can manage insurance claims" ON public.insurance_claims
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view own claims" ON public.insurance_claims
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Employees can submit claims" ON public.insurance_claims
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Tenant admins can manage claims" ON public.insurance_claims
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- Document Verifications Policies
CREATE POLICY "Admins can manage verifications" ON public.document_verifications
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Tenant admins can manage verifications" ON public.document_verifications
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- Document Extractions Policies
CREATE POLICY "Admins can manage extractions" ON public.document_extractions
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Tenant admins can manage extractions" ON public.document_extractions
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));


-- ============================================================================
-- PART 20: NEW TABLES - INDEXES
-- ============================================================================

CREATE INDEX idx_payroll_runs_tenant ON public.payroll_runs(tenant_id);
CREATE INDEX idx_payroll_runs_status ON public.payroll_runs(status);
CREATE INDEX idx_payroll_runs_period ON public.payroll_runs(pay_period_start, pay_period_end);

CREATE INDEX idx_payslips_payroll_run ON public.payslips(payroll_run_id);
CREATE INDEX idx_payslips_tenant ON public.payslips(tenant_id);
CREATE INDEX idx_payslips_employee ON public.payslips(employee_id);
CREATE INDEX idx_payslips_user ON public.payslips(user_id);

CREATE INDEX idx_bgv_requests_tenant ON public.bgv_requests(tenant_id);
CREATE INDEX idx_bgv_requests_employee ON public.bgv_requests(employee_id);
CREATE INDEX idx_bgv_requests_status ON public.bgv_requests(status);

CREATE INDEX idx_sso_states_token ON public.sso_states(state_token);
CREATE INDEX idx_sso_states_expires ON public.sso_states(expires_at);

CREATE INDEX idx_insurance_claims_tenant ON public.insurance_claims(tenant_id);
CREATE INDEX idx_insurance_claims_employee ON public.insurance_claims(employee_id);
CREATE INDEX idx_insurance_claims_status ON public.insurance_claims(status);

CREATE INDEX idx_document_verifications_tenant ON public.document_verifications(tenant_id);
CREATE INDEX idx_document_verifications_status ON public.document_verifications(status);

CREATE INDEX idx_document_extractions_verification ON public.document_extractions(verification_id);
CREATE INDEX idx_document_extractions_status ON public.document_extractions(status);


-- ============================================================================
-- PART 22: HR MODULE - ENABLE RLS
-- ============================================================================

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Employees Policies
CREATE POLICY "Admins can manage employees" ON public.employees
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view own record" ON public.employees
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Tenant admins can manage employees" ON public.employees
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

CREATE POLICY "Managers can view team members" ON public.employees
    FOR SELECT USING (reporting_manager_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ));

-- Attendance Records Policies
CREATE POLICY "Admins can manage attendance" ON public.attendance_records
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view own attendance" ON public.attendance_records
    FOR SELECT USING (employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Employees can check in/out" ON public.attendance_records
    FOR INSERT WITH CHECK (employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Tenant admins can manage attendance" ON public.attendance_records
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- Leave Types Policies
CREATE POLICY "Anyone can view leave types" ON public.leave_types
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage leave types" ON public.leave_types
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Tenant admins can manage leave types" ON public.leave_types
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- Leave Balances Policies
CREATE POLICY "Admins can manage leave balances" ON public.leave_balances
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view own balance" ON public.leave_balances
    FOR SELECT USING (employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Tenant admins can manage leave balances" ON public.leave_balances
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- Leave Requests Policies
CREATE POLICY "Admins can manage leave requests" ON public.leave_requests
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view own requests" ON public.leave_requests
    FOR SELECT USING (employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Employees can submit leave requests" ON public.leave_requests
    FOR INSERT WITH CHECK (employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Employees can cancel own requests" ON public.leave_requests
    FOR UPDATE USING (
        employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
        AND status = 'pending'
    );

CREATE POLICY "Managers can approve team requests" ON public.leave_requests
    FOR UPDATE USING (
        approver_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
    );

CREATE POLICY "Tenant admins can manage leave requests" ON public.leave_requests
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));


-- ============================================================================
-- PART 23: HR MODULE - INDEXES
-- ============================================================================

CREATE INDEX idx_employees_tenant ON public.employees(tenant_id);
CREATE INDEX idx_employees_user ON public.employees(user_id);
CREATE INDEX idx_employees_department ON public.employees(tenant_id, department);
CREATE INDEX idx_employees_manager ON public.employees(reporting_manager_id);
CREATE INDEX idx_employees_status ON public.employees(employment_status);
CREATE INDEX idx_employees_code ON public.employees(tenant_id, employee_code);

CREATE INDEX idx_attendance_tenant ON public.attendance_records(tenant_id);
CREATE INDEX idx_attendance_employee ON public.attendance_records(employee_id);
CREATE INDEX idx_attendance_date ON public.attendance_records(attendance_date);
CREATE INDEX idx_attendance_tenant_date ON public.attendance_records(tenant_id, attendance_date);

CREATE INDEX idx_leave_types_tenant ON public.leave_types(tenant_id);
CREATE INDEX idx_leave_types_active ON public.leave_types(tenant_id, is_active);

CREATE INDEX idx_leave_balances_tenant ON public.leave_balances(tenant_id);
CREATE INDEX idx_leave_balances_employee ON public.leave_balances(employee_id);
CREATE INDEX idx_leave_balances_year ON public.leave_balances(tenant_id, year);

CREATE INDEX idx_leave_requests_tenant ON public.leave_requests(tenant_id);
CREATE INDEX idx_leave_requests_employee ON public.leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX idx_leave_requests_approver ON public.leave_requests(approver_id);
CREATE INDEX idx_leave_requests_dates ON public.leave_requests(start_date, end_date);


-- ============================================================================
-- PART 24: ENABLE REALTIME FOR NEW TABLES
-- ============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.payroll_runs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bgv_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.insurance_claims;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leave_requests;


-- ============================================================================
-- PART 25: SHIFT MANAGEMENT ENUMS
-- ============================================================================

-- Shift status
CREATE TYPE public.shift_status AS ENUM (
    'active',         -- Currently active shift
    'inactive',       -- Disabled shift
    'archived'        -- No longer in use
);

-- Shift assignment status
CREATE TYPE public.shift_assignment_status AS ENUM (
    'scheduled',      -- Assigned to employee
    'in_progress',    -- Employee currently working
    'completed',      -- Shift completed
    'missed',         -- Employee didn't show up
    'cancelled'       -- Assignment cancelled
);

-- Shift swap request status
CREATE TYPE public.shift_swap_status AS ENUM (
    'pending',        -- Awaiting approval
    'approved',       -- Approved by manager
    'rejected',       -- Rejected
    'cancelled',      -- Cancelled by requester
    'completed'       -- Swap executed
);


-- ============================================================================
-- PART 26: SHIFT MANAGEMENT TABLES
-- ============================================================================

-- Shifts table - defines available shifts
CREATE TABLE public.shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,                                  -- e.g., "Morning Shift", "Night Shift"
    code TEXT,                                           -- e.g., "MS", "NS"
    description TEXT,
    start_time TIME NOT NULL,                            -- Shift start time
    end_time TIME NOT NULL,                              -- Shift end time
    break_duration_minutes INTEGER DEFAULT 0,            -- Break duration in minutes
    grace_period_minutes INTEGER DEFAULT 15,             -- Late arrival grace period
    early_checkout_minutes INTEGER DEFAULT 15,           -- Early checkout allowed
    is_overnight BOOLEAN DEFAULT false,                  -- Shift crosses midnight
    is_flexible BOOLEAN DEFAULT false,                   -- Flexible timing allowed
    min_hours DECIMAL(4,2),                              -- Minimum hours required
    max_hours DECIMAL(4,2),                              -- Maximum hours allowed
    color TEXT DEFAULT '#3B82F6',                        -- Display color for UI
    applicable_days JSONB DEFAULT '["monday","tuesday","wednesday","thursday","friday"]',
    status shift_status DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Shift Assignments - assigns employees to shifts
CREATE TABLE public.shift_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    shift_id UUID NOT NULL REFERENCES public.shifts(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    assignment_date DATE NOT NULL,                       -- Date of assignment
    actual_start_time TIMESTAMPTZ,                       -- When employee actually started
    actual_end_time TIMESTAMPTZ,                         -- When employee actually ended
    status shift_assignment_status DEFAULT 'scheduled',
    hours_worked DECIMAL(5,2),                           -- Total hours worked
    overtime_hours DECIMAL(5,2) DEFAULT 0,               -- Overtime hours
    notes TEXT,
    assigned_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(shift_id, employee_id, assignment_date)
);

-- Shift Swap Requests - employee requests to swap shifts
CREATE TABLE public.shift_swap_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    requester_assignment_id UUID NOT NULL REFERENCES public.shift_assignments(id) ON DELETE CASCADE,
    target_employee_id UUID REFERENCES public.employees(id),  -- Who to swap with (optional)
    target_assignment_id UUID REFERENCES public.shift_assignments(id),  -- Their assignment to take
    reason TEXT NOT NULL,
    status shift_swap_status DEFAULT 'pending',
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================================
-- PART 27: OVERTIME TRACKING TABLE
-- ============================================================================

-- Overtime type enum
CREATE TYPE public.overtime_type AS ENUM (
    'regular',        -- Standard 1.5x overtime
    'double',         -- 2x overtime (holidays, etc.)
    'special',        -- Special rates
    'comp_off'        -- Compensatory off instead of payment
);

-- Overtime Records table
CREATE TABLE public.overtime_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    attendance_record_id UUID REFERENCES public.attendance_records(id),
    shift_assignment_id UUID REFERENCES public.shift_assignments(id),
    overtime_date DATE NOT NULL,
    overtime_type overtime_type DEFAULT 'regular',
    hours DECIMAL(5,2) NOT NULL,                         -- Overtime hours
    rate_multiplier DECIMAL(3,2) DEFAULT 1.5,            -- Pay multiplier (1.5x, 2x, etc.)
    pre_approved BOOLEAN DEFAULT false,                   -- Was overtime pre-approved?
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processed')),
    rejection_reason TEXT,
    payroll_processed BOOLEAN DEFAULT false,              -- Added to payroll?
    payroll_run_id UUID REFERENCES public.payroll_runs(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================================
-- PART 28: GEOFENCING TABLES
-- ============================================================================

-- Geofence zone type enum
CREATE TYPE public.geofence_zone_type AS ENUM (
    'office',         -- Main office location
    'branch',         -- Branch office
    'client_site',    -- Client location
    'work_from_home', -- Registered WFH address
    'field',          -- Field work zone
    'restricted'      -- Restricted area
);

-- Geofence Zones - defines geographic boundaries for attendance
CREATE TABLE public.geofence_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,                                   -- Zone name
    zone_type geofence_zone_type DEFAULT 'office',
    address TEXT,                                         -- Physical address
    latitude DECIMAL(10,8) NOT NULL,                      -- Center latitude
    longitude DECIMAL(11,8) NOT NULL,                     -- Center longitude
    radius_meters INTEGER NOT NULL DEFAULT 100,           -- Geofence radius in meters
    polygon_coordinates JSONB,                            -- For complex polygon shapes
    is_active BOOLEAN DEFAULT true,
    is_primary BOOLEAN DEFAULT false,                     -- Primary office location
    allowed_ip_ranges JSONB DEFAULT '[]',                 -- Allowed IP ranges for WiFi-based location
    wifi_ssids JSONB DEFAULT '[]',                        -- Allowed WiFi network names
    timezone TEXT DEFAULT 'Asia/Kolkata',
    working_hours JSONB DEFAULT '{"start": "09:00", "end": "18:00"}',
    applicable_departments JSONB DEFAULT '[]',            -- Empty means all departments
    applicable_designations JSONB DEFAULT '[]',           -- Empty means all designations
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Geofence Attendance Logs - records location-based attendance attempts
CREATE TABLE public.geofence_attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.client_tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    attendance_record_id UUID REFERENCES public.attendance_records(id),
    geofence_zone_id UUID REFERENCES public.geofence_zones(id),
    action_type TEXT NOT NULL CHECK (action_type IN ('check_in', 'check_out', 'location_update')),
    latitude DECIMAL(10,8) NOT NULL,                      -- Employee's latitude
    longitude DECIMAL(11,8) NOT NULL,                     -- Employee's longitude
    accuracy_meters DECIMAL(8,2),                         -- GPS accuracy
    altitude_meters DECIMAL(10,2),                        -- Altitude if available
    is_within_geofence BOOLEAN NOT NULL DEFAULT false,    -- Was employee within allowed zone?
    distance_from_zone_meters DECIMAL(10,2),              -- Distance from nearest zone center
    matched_zone_id UUID REFERENCES public.geofence_zones(id),  -- Which zone matched (if any)
    device_info JSONB DEFAULT '{}',                       -- Device details (model, OS, etc.)
    ip_address INET,                                      -- IP address for WiFi validation
    wifi_ssid TEXT,                                       -- Connected WiFi network
    is_mocked_location BOOLEAN DEFAULT false,             -- Detected fake GPS?
    verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('verified', 'suspicious', 'rejected', 'manual_override')),
    verification_notes TEXT,
    photo_url TEXT,                                       -- Selfie photo for verification
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================================
-- PART 29: SHIFT & GEOFENCING - ENABLE RLS
-- ============================================================================

ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overtime_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofence_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofence_attendance_logs ENABLE ROW LEVEL SECURITY;

-- Shifts Policies
CREATE POLICY "Admins can manage shifts" ON public.shifts
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view shifts" ON public.shifts
    FOR SELECT USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users WHERE user_id = auth.uid()
    ));

CREATE POLICY "Tenant admins can manage shifts" ON public.shifts
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- Shift Assignments Policies
CREATE POLICY "Admins can manage shift assignments" ON public.shift_assignments
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view own assignments" ON public.shift_assignments
    FOR SELECT USING (employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Tenant admins can manage assignments" ON public.shift_assignments
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- Shift Swap Requests Policies
CREATE POLICY "Admins can manage swap requests" ON public.shift_swap_requests
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view own swap requests" ON public.shift_swap_requests
    FOR SELECT USING (requester_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ) OR target_employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Employees can create swap requests" ON public.shift_swap_requests
    FOR INSERT WITH CHECK (requester_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Tenant admins can manage swap requests" ON public.shift_swap_requests
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- Overtime Records Policies
CREATE POLICY "Admins can manage overtime" ON public.overtime_records
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view own overtime" ON public.overtime_records
    FOR SELECT USING (employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Tenant admins can manage overtime" ON public.overtime_records
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- Geofence Zones Policies
CREATE POLICY "Admins can manage geofence zones" ON public.geofence_zones
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view geofence zones" ON public.geofence_zones
    FOR SELECT USING (is_active = true AND tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users WHERE user_id = auth.uid()
    ));

CREATE POLICY "Tenant admins can manage zones" ON public.geofence_zones
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- Geofence Attendance Logs Policies
CREATE POLICY "Admins can manage geofence logs" ON public.geofence_attendance_logs
    FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can log attendance" ON public.geofence_attendance_logs
    FOR INSERT WITH CHECK (employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Employees can view own geofence logs" ON public.geofence_attendance_logs
    FOR SELECT USING (employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    ));

CREATE POLICY "Tenant admins can view all logs" ON public.geofence_attendance_logs
    FOR ALL USING (tenant_id IN (
        SELECT tenant_id FROM public.client_tenant_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    ));


-- ============================================================================
-- PART 30: SHIFT & GEOFENCING - INDEXES
-- ============================================================================

-- Shifts indexes
CREATE INDEX idx_shifts_tenant ON public.shifts(tenant_id);
CREATE INDEX idx_shifts_status ON public.shifts(status);
CREATE INDEX idx_shifts_tenant_active ON public.shifts(tenant_id) WHERE status = 'active';

-- Shift Assignments indexes
CREATE INDEX idx_shift_assignments_tenant ON public.shift_assignments(tenant_id);
CREATE INDEX idx_shift_assignments_shift ON public.shift_assignments(shift_id);
CREATE INDEX idx_shift_assignments_employee ON public.shift_assignments(employee_id);
CREATE INDEX idx_shift_assignments_date ON public.shift_assignments(assignment_date);
CREATE INDEX idx_shift_assignments_status ON public.shift_assignments(status);
CREATE INDEX idx_shift_assignments_employee_date ON public.shift_assignments(employee_id, assignment_date);

-- Shift Swap Requests indexes
CREATE INDEX idx_shift_swap_tenant ON public.shift_swap_requests(tenant_id);
CREATE INDEX idx_shift_swap_requester ON public.shift_swap_requests(requester_id);
CREATE INDEX idx_shift_swap_target ON public.shift_swap_requests(target_employee_id);
CREATE INDEX idx_shift_swap_status ON public.shift_swap_requests(status);

-- Overtime Records indexes
CREATE INDEX idx_overtime_tenant ON public.overtime_records(tenant_id);
CREATE INDEX idx_overtime_employee ON public.overtime_records(employee_id);
CREATE INDEX idx_overtime_date ON public.overtime_records(overtime_date);
CREATE INDEX idx_overtime_status ON public.overtime_records(status);
CREATE INDEX idx_overtime_payroll ON public.overtime_records(payroll_run_id);

-- Geofence Zones indexes
CREATE INDEX idx_geofence_zones_tenant ON public.geofence_zones(tenant_id);
CREATE INDEX idx_geofence_zones_active ON public.geofence_zones(tenant_id) WHERE is_active = true;
CREATE INDEX idx_geofence_zones_location ON public.geofence_zones(latitude, longitude);

-- Geofence Attendance Logs indexes
CREATE INDEX idx_geofence_logs_tenant ON public.geofence_attendance_logs(tenant_id);
CREATE INDEX idx_geofence_logs_employee ON public.geofence_attendance_logs(employee_id);
CREATE INDEX idx_geofence_logs_attendance ON public.geofence_attendance_logs(attendance_record_id);
CREATE INDEX idx_geofence_logs_zone ON public.geofence_attendance_logs(geofence_zone_id);
CREATE INDEX idx_geofence_logs_created ON public.geofence_attendance_logs(created_at);
CREATE INDEX idx_geofence_logs_verification ON public.geofence_attendance_logs(verification_status);


-- ============================================================================
-- PART 31: ENABLE REALTIME FOR NEW TABLES
-- ============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.shifts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shift_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shift_swap_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.overtime_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.geofence_zones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.geofence_attendance_logs;


-- ============================================================================
-- END OF ATLAS DATABASE SCHEMA
-- Last Updated: December 7, 2025 @ 16:45 UTC
-- Total Tables: 52 | Functions: 7 | Triggers: 2 | RLS Policies: 75+ | Indexes: 50+
-- ============================================================================
