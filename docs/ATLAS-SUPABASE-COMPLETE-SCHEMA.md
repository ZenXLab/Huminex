# ATLAS Supabase Complete Schema Documentation

> **Version:** 1.0.0  
> **Last Updated:** 2025-01-07  
> **Project ID:** `wnentybljoyjhizsdhrt`  
> **Platform:** Lovable Cloud (Supabase-backed)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Database Tables](#database-tables)
4. [Database Functions](#database-functions)
5. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
6. [Edge Functions](#edge-functions)
7. [Storage Buckets](#storage-buckets)
8. [Secrets/Environment Variables](#secretsenvironment-variables)
9. [Migration Guide](#migration-guide)

---

## Overview

ATLAS is an enterprise-grade Workforce Operating System built on Supabase. This documentation covers:
- 27+ database tables with comprehensive RLS policies
- 6 database functions for ID generation and role checking
- 4 edge functions for email and PDF generation
- 1 storage bucket for client files
- Complete authentication flow

---

## Authentication

### Auth Configuration
- **Email/Password Authentication:** Enabled
- **Auto-confirm Email:** Should be enabled for testing
- **Session Duration:** Default Supabase settings

### User Flow
1. User signs up via `/portal/auth` (client) or `/tenant/login` (tenant admin) or `/admin/login` (ATLAS admin)
2. Profile is automatically created via `handle_new_user` trigger
3. Role is assigned in `user_roles` table (default: 'user')
4. Admins have 'admin' role for elevated access

### Auth Schema (Managed by Supabase)
```sql
-- auth.users (Supabase managed - DO NOT MODIFY)
-- Contains: id, email, encrypted_password, email_confirmed_at, etc.
```

---

## Database Tables

### Core Application Tables

#### 1. `profiles` - User Profiles
```sql
-- Stores extended user information linked to auth.users
CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,                    -- User's email address
    full_name text,                         -- Display name
    company_name text,                      -- Associated company
    phone text,                             -- Contact phone
    tenant_id uuid REFERENCES client_tenants(id), -- Multi-tenancy link
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Users can view/update own profile; Admins can view all
```

#### 2. `user_roles` - Role Assignment
```sql
-- Stores user roles for RBAC (Role-Based Access Control)
-- CRITICAL: Roles MUST be in separate table for security
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',  -- 'admin' | 'user'
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Enum: app_role = ('admin', 'user')
-- RLS: Users can view own roles; Admins can manage all
```

#### 3. `client_tenants` - Multi-Tenant Organizations
```sql
-- Root table for multi-tenancy - each tenant is a client organization
CREATE TABLE public.client_tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,              -- URL-friendly identifier
    name text NOT NULL,                     -- Organization name
    contact_email text NOT NULL,            -- Primary contact
    contact_phone text,
    address text,
    logo_url text,                          -- Custom branding
    status text DEFAULT 'pending',          -- pending/active/suspended
    tenant_type text DEFAULT 'individual',  -- individual/enterprise
    settings jsonb DEFAULT '{}',            -- Custom configuration
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Admins full access; Users can view own tenant only
```

#### 4. `client_tenant_users` - Tenant Membership
```sql
-- Links users to tenants with role assignments
CREATE TABLE public.client_tenant_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES client_tenants(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text DEFAULT 'member',             -- super_admin/admin/member/viewer
    created_at timestamptz DEFAULT now(),
    UNIQUE(tenant_id, user_id)
);

-- RLS: Admins full access; Users can view own memberships
```

### Sales & CRM Tables

#### 5. `quotes` - Sales Quotes
```sql
-- Stores pricing quotes generated via calculator
CREATE TABLE public.quotes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number text NOT NULL,             -- Format: ATL-YYYY-XXXX
    user_id uuid REFERENCES profiles(id),
    
    -- Quote Configuration
    client_type text NOT NULL,              -- individual/startup/enterprise
    service_type text NOT NULL,             -- Selected service
    complexity text NOT NULL,               -- basic/standard/advanced
    
    -- Pricing
    estimated_price numeric NOT NULL,       -- Before discounts
    discount_percent integer DEFAULT 0,
    final_price numeric NOT NULL,           -- After discounts
    
    -- Add-ons & Features
    features jsonb DEFAULT '[]',            -- Selected features
    addons jsonb DEFAULT '[]',              -- Selected add-ons
    coupon_code text,
    
    -- Contact Info
    contact_name text,
    contact_email text,
    contact_phone text,
    contact_company text,
    
    -- Status & Notes
    status quote_status DEFAULT 'pending',  -- draft/pending/approved/rejected/converted
    notes text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enum: quote_status = ('draft', 'pending', 'approved', 'rejected', 'converted')
```

#### 6. `invoices` - Billing Invoices
```sql
-- Invoices generated from approved quotes
CREATE TABLE public.invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number text NOT NULL,           -- Format: INV-YYYY-XXXX
    user_id uuid REFERENCES profiles(id),
    quote_id uuid REFERENCES quotes(id),
    
    -- Amounts
    amount numeric NOT NULL,                -- Base amount
    tax_percent numeric DEFAULT 18.00,      -- GST percentage
    tax_amount numeric NOT NULL,            -- Calculated tax
    total_amount numeric NOT NULL,          -- Final amount
    
    -- Status & Dates
    status invoice_status DEFAULT 'draft',  -- draft/sent/paid/overdue/cancelled
    due_date date,
    paid_at timestamptz,
    
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enum: invoice_status = ('draft', 'sent', 'paid', 'overdue', 'cancelled')
```

#### 7. `leads` - CRM Lead Tracking
```sql
-- Tracks sales leads and their status
CREATE TABLE public.leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    
    -- Lead Management
    source text DEFAULT 'website',          -- website/referral/campaign
    status text DEFAULT 'new',              -- new/contacted/qualified/converted
    score integer DEFAULT 0,                -- Lead scoring (0-100)
    
    -- Assignment
    assigned_to uuid,                       -- Assigned team member
    notes text,
    
    -- Activity Tracking
    last_contact_at timestamptz,
    converted_at timestamptz,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Admin-only access
```

#### 8. `inquiries` - Contact Form Submissions
```sql
-- Stores contact form submissions
CREATE TABLE public.inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    service_interest text,                  -- Selected service
    message text,
    source text DEFAULT 'website',
    user_id uuid REFERENCES profiles(id),
    created_at timestamptz DEFAULT now()
);

-- RLS: Anyone can create; Users see own; Admins see all
```

### Client Onboarding Tables

#### 9. `onboarding_sessions` - Client Onboarding Flow
```sql
-- Tracks multi-step client onboarding process
CREATE TABLE public.onboarding_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id text NOT NULL,                -- Format: ATLS-YYYYMMDD-XXXX
    user_id uuid REFERENCES auth.users(id),
    quote_id uuid REFERENCES quotes(id),
    
    -- Client Info
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    company_name text,
    
    -- Classification
    client_type text NOT NULL,              -- individual/startup/enterprise
    industry_type text NOT NULL,            -- Selected industry
    industry_subtype text,
    
    -- Onboarding Progress
    current_step integer DEFAULT 1,         -- 1-4 step wizard
    status text DEFAULT 'new',              -- new/in_progress/verified/approved/rejected
    
    -- Selections
    selected_services jsonb DEFAULT '[]',
    selected_addons jsonb DEFAULT '[]',
    consent_accepted jsonb DEFAULT '{}',    -- Terms, Privacy, etc.
    pricing_snapshot jsonb,                 -- Locked pricing at time of signup
    
    -- Verification
    verification_code text,
    verification_sent_at timestamptz,
    verified_at timestamptz,
    
    -- Approval
    dashboard_tier text DEFAULT 'basic',    -- basic/professional/enterprise
    assigned_pm uuid,                       -- Assigned Project Manager
    assigned_team jsonb DEFAULT '[]',
    approved_by uuid,
    approved_at timestamptz,
    approval_notes text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Anyone can create; Users see own; Admins manage all
```

#### 10. `client_onboarding` - Legacy Onboarding (Simplified)
```sql
-- Simplified onboarding for basic clients
CREATE TABLE public.client_onboarding (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    company_name text,
    service_interests jsonb DEFAULT '[]',
    status text DEFAULT 'pending',          -- pending/approved/rejected
    notes text,
    reviewed_by uuid,
    reviewed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Admin-only access
```

### Project Management Tables

#### 11. `projects` - Client Projects
```sql
-- Tracks client projects and their status
CREATE TABLE public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id),
    name text NOT NULL,
    description text,
    
    -- Status & Progress
    status text DEFAULT 'planning',         -- planning/active/on_hold/completed
    phase text DEFAULT 'Discovery',
    progress integer DEFAULT 0,             -- 0-100%
    health_score integer DEFAULT 100,       -- Project health indicator
    
    -- Timeline
    start_date date,
    due_date date,
    
    -- Resources
    budget numeric,
    team_members jsonb DEFAULT '[]',        -- Assigned team member IDs
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Admins full access; Users see own projects
```

#### 12. `project_milestones` - Project Milestones
```sql
-- Tracks milestones within projects
CREATE TABLE public.project_milestones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    status text DEFAULT 'pending',          -- pending/in_progress/completed
    due_date date,
    completed_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- RLS: Admins manage; Users see own project milestones
```

### Support & Communication Tables

#### 13. `support_tickets` - Support Tickets
```sql
-- Client support ticket system
CREATE TABLE public.support_tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number text NOT NULL,            -- Format: TKT-XXXXX
    user_id uuid REFERENCES profiles(id),
    project_id uuid REFERENCES projects(id),
    
    subject text NOT NULL,
    description text,
    
    -- Status & Priority
    status text DEFAULT 'open',             -- open/in_progress/resolved/closed
    priority text DEFAULT 'medium',         -- low/medium/high/urgent
    
    -- Assignment & SLA
    assigned_to uuid,
    sla_due_at timestamptz,
    resolved_at timestamptz,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Users create own; Admins manage all
```

#### 14. `ticket_messages` - Ticket Thread Messages
```sql
-- Messages within support tickets
CREATE TABLE public.ticket_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id uuid REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id uuid,                           -- Message author
    message text NOT NULL,
    is_internal boolean DEFAULT false,      -- Internal notes (admin only)
    created_at timestamptz DEFAULT now()
);

-- RLS: Users add to own tickets; Admins manage all
```

#### 15. `meetings` - Client Meetings
```sql
-- Scheduled meetings with clients
CREATE TABLE public.meetings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id),
    project_id uuid REFERENCES projects(id),
    
    title text NOT NULL,
    description text,
    
    -- Scheduling
    scheduled_at timestamptz NOT NULL,
    duration_minutes integer DEFAULT 30,
    meeting_type text DEFAULT 'client',     -- client/internal/demo
    
    -- Meeting Details
    meeting_link text,                      -- Video call link
    recording_url text,
    notes text,
    
    status text DEFAULT 'scheduled',        -- scheduled/completed/cancelled
    created_at timestamptz DEFAULT now()
);

-- RLS: Admins manage; Users see own meetings
```

### File Management Tables

#### 16. `client_files` - Client File Storage
```sql
-- Tracks files uploaded by/for clients
CREATE TABLE public.client_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id),
    project_id uuid REFERENCES projects(id),
    
    name text NOT NULL,
    file_path text NOT NULL,                -- Storage bucket path
    file_type text,                         -- MIME type
    file_size bigint,                       -- Bytes
    
    folder text DEFAULT 'root',             -- Virtual folder structure
    version integer DEFAULT 1,
    uploaded_by uuid,
    
    created_at timestamptz DEFAULT now()
);

-- RLS: Admins full access; Users manage own files
```

### Feedback & Reviews Tables

#### 17. `client_feedback` - Client Feedback
```sql
-- Client satisfaction and feedback
CREATE TABLE public.client_feedback (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id),
    project_id uuid REFERENCES projects(id),
    milestone_id uuid REFERENCES project_milestones(id),
    
    rating integer,                         -- 1-5 stars
    comment text,
    feedback_type text DEFAULT 'general',   -- general/milestone/project
    
    created_at timestamptz DEFAULT now()
);

-- RLS: Users create own; Admins view all
```

### MSP Monitoring Tables

#### 18. `client_msp_servers` - Monitored Servers
```sql
-- Servers monitored for MSP clients
CREATE TABLE public.client_msp_servers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES client_tenants(id) ON DELETE CASCADE,
    
    name text NOT NULL,
    hostname text,
    ip_address text,
    server_type text DEFAULT 'web',         -- web/database/application
    status text DEFAULT 'unknown',          -- online/offline/warning/unknown
    
    last_ping_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Admins full access; Users see own tenant servers
```

#### 19. `client_msp_metrics` - Server Metrics
```sql
-- Performance metrics for monitored servers
CREATE TABLE public.client_msp_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id uuid NOT NULL REFERENCES client_msp_servers(id) ON DELETE CASCADE,
    
    cpu_usage numeric,                      -- Percentage
    memory_usage numeric,                   -- Percentage
    disk_usage numeric,                     -- Percentage
    network_in bigint,                      -- Bytes
    network_out bigint,                     -- Bytes
    uptime_seconds bigint,
    
    recorded_at timestamptz DEFAULT now()
);

-- RLS: Admins full access; Users see own tenant metrics
```

#### 20. `client_msp_alerts` - Server Alerts
```sql
-- Alerts from monitored servers
CREATE TABLE public.client_msp_alerts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES client_tenants(id) ON DELETE CASCADE,
    server_id uuid NOT NULL REFERENCES client_msp_servers(id) ON DELETE CASCADE,
    
    alert_type text NOT NULL,               -- cpu_high/memory_high/disk_full/offline
    severity text DEFAULT 'warning',        -- info/warning/critical
    message text NOT NULL,
    
    is_resolved boolean DEFAULT false,
    resolved_at timestamptz,
    
    created_at timestamptz DEFAULT now()
);

-- RLS: Admins full access; Users see own tenant alerts
```

### Pricing & Configuration Tables

#### 21. `service_pricing` - Service Plans
```sql
-- Defines service pricing tiers
CREATE TABLE public.service_pricing (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name text NOT NULL,
    service_category text NOT NULL,         -- digital-engineering/ai-automation/etc
    plan_tier text DEFAULT 'basic',         -- basic/standard/advanced/enterprise
    
    base_price numeric DEFAULT 0,
    features jsonb DEFAULT '[]',            -- Included features
    description text,
    
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Anyone can view active; Admins manage
```

#### 22. `service_addons` - Service Add-ons
```sql
-- Optional add-on services
CREATE TABLE public.service_addons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    category text,
    price numeric DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- RLS: Anyone can view active; Admins manage
```

#### 23. `pricing_modifiers` - Dynamic Pricing Adjustments
```sql
-- Modifiers for dynamic pricing (industry, size, etc.)
CREATE TABLE public.pricing_modifiers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    modifier_type text NOT NULL,            -- industry/client_type/size
    modifier_key text NOT NULL,             -- healthcare/startup/1-10
    multiplier numeric DEFAULT 1.0,         -- Price multiplier
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- RLS: Anyone can view active; Admins manage
```

#### 24. `coupon_codes` - Discount Codes
```sql
-- Promotional coupon codes
CREATE TABLE public.coupon_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,              -- Coupon code (e.g., ATLAS15)
    discount_type text DEFAULT 'percentage', -- percentage/fixed
    discount_value numeric DEFAULT 0,        -- Amount or percentage
    
    -- Usage Limits
    max_uses integer,
    current_uses integer DEFAULT 0,
    
    -- Validity
    valid_from timestamptz,
    valid_until timestamptz,
    is_active boolean DEFAULT true,
    
    created_at timestamptz DEFAULT now()
);

-- RLS: Anyone can view active; Admins manage
```

### Admin & System Tables

#### 25. `admin_notifications` - Admin Notifications
```sql
-- Notifications for admin users
CREATE TABLE public.admin_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    target_admin_id uuid,                   -- Specific admin or null for all
    title text NOT NULL,
    message text NOT NULL,
    notification_type text DEFAULT 'info',  -- info/warning/error/success
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- RLS: Admin-only access
```

#### 26. `admin_settings` - Admin Configuration
```sql
-- Platform-wide admin settings
CREATE TABLE public.admin_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL,
    description text,
    updated_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Admin-only access
```

#### 27. `portal_settings` - Portal Configuration
```sql
-- Client portal customization settings
CREATE TABLE public.portal_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL,
    description text,
    updated_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Admin-only access
```

### Logging & Analytics Tables

#### 28. `audit_logs` - Audit Trail
```sql
-- Immutable audit log for compliance
CREATE TABLE public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    
    action text NOT NULL,                   -- create/update/delete/login/etc
    entity_type text NOT NULL,              -- Table/resource name
    entity_id text,                         -- Affected record ID
    
    old_values jsonb,                       -- Previous state
    new_values jsonb,                       -- New state
    
    ip_address text,
    user_agent text,
    
    created_at timestamptz DEFAULT now()
);

-- RLS: Admins view; System inserts
```

#### 29. `system_logs` - System Logs
```sql
-- Application and system logs
CREATE TABLE public.system_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    level text NOT NULL,                    -- info/warning/error/debug
    source text NOT NULL,                   -- Function/module name
    message text NOT NULL,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- RLS: Admins view; System inserts
```

#### 30. `clickstream_events` - User Behavior Tracking
```sql
-- Tracks user interactions for analytics
CREATE TABLE public.clickstream_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id text NOT NULL,               -- Browser session
    user_id uuid,                           -- Authenticated user (if any)
    
    event_type text NOT NULL,               -- page_view/click/scroll/form_submit
    page_url text,
    
    -- Element Details (for clicks)
    element_id text,
    element_class text,
    element_text text,
    
    metadata jsonb DEFAULT '{}',            -- Additional event data
    created_at timestamptz DEFAULT now()
);

-- RLS: Anyone can insert; Admins view
```

#### 31. `api_usage` - API Usage Tracking
```sql
-- Tracks API endpoint usage
CREATE TABLE public.api_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    endpoint text NOT NULL,
    method text NOT NULL,                   -- GET/POST/PUT/DELETE
    status_code integer,
    response_time_ms integer,
    request_body jsonb,
    created_at timestamptz DEFAULT now()
);

-- RLS: System inserts; Admins view
```

### Team & Compliance Tables

#### 32. `team_members` - Internal Team
```sql
-- CropXon internal team members
CREATE TABLE public.team_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,                           -- Link to auth if they have access
    name text NOT NULL,
    email text NOT NULL,
    role text NOT NULL,                     -- Job title
    department text,
    avatar_url text,
    skills jsonb DEFAULT '[]',
    availability text DEFAULT 'available',  -- available/busy/away
    created_at timestamptz DEFAULT now()
);

-- RLS: Anyone can view; Admins manage
```

#### 33. `compliance_items` - Compliance Tracking
```sql
-- Tracks compliance requirements
CREATE TABLE public.compliance_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    category text NOT NULL,                 -- gdpr/hipaa/soc2/pci
    status text DEFAULT 'pending',          -- pending/in_progress/compliant
    due_date date,
    assigned_to uuid,
    completed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Admin-only access
```

#### 34. `integrations` - Third-Party Integrations
```sql
-- Configured integrations
CREATE TABLE public.integrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL,                     -- slack/google/stripe/etc
    config jsonb DEFAULT '{}',              -- Integration configuration
    is_active boolean DEFAULT false,
    last_sync_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Admin-only access
```

#### 35. `client_notices` - Client Announcements
```sql
-- Announcements for clients
CREATE TABLE public.client_notices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    notice_type text DEFAULT 'info',        -- info/warning/maintenance/update
    target_type text DEFAULT 'all',         -- all/specific
    target_users jsonb DEFAULT '[]',        -- Specific user IDs
    is_active boolean DEFAULT true,
    expires_at timestamptz,
    created_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Admins manage; Users view active notices
```

---

## Database Functions

### 1. `generate_quote_number()`
```sql
-- Generates unique quote numbers: ATL-YYYY-XXXX
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
```

### 2. `generate_invoice_number()`
```sql
-- Generates unique invoice numbers: INV-YYYY-XXXX
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
```

### 3. `generate_client_id()`
```sql
-- Generates unique client IDs: ATLS-YYYYMMDD-XXXX
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
```

### 4. `generate_ticket_number()`
```sql
-- Generates unique ticket numbers: TKT-XXXXX
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
```

### 5. `has_role()`
```sql
-- Checks if user has a specific role (SECURITY DEFINER - bypasses RLS)
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
```

### 6. `handle_new_user()` - Auth Trigger
```sql
-- Automatically creates profile when user signs up
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

-- Trigger on auth.users (created by migration)
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Row Level Security (RLS) Policies

All tables have RLS enabled with appropriate policies. Key patterns:

### Admin Access Pattern
```sql
-- Admins can manage all records
CREATE POLICY "Admins can manage [table]" ON public.[table]
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
```

### User Self-Access Pattern
```sql
-- Users can view own records
CREATE POLICY "Users can view own [table]" ON public.[table]
FOR SELECT USING (auth.uid() = user_id);
```

### Multi-Tenant Access Pattern
```sql
-- Users can view own tenant records
CREATE POLICY "Users can view own tenant [table]" ON public.[table]
FOR SELECT USING (
  tenant_id IN (
    SELECT tenant_id FROM client_tenant_users
    WHERE user_id = auth.uid()
  )
);
```

### Public Read Pattern
```sql
-- Anyone can view active records
CREATE POLICY "Anyone can view active [table]" ON public.[table]
FOR SELECT USING (is_active = true);
```

---

## Edge Functions

### 1. `send-welcome-email`
**Purpose:** Sends welcome email with login credentials after admin approves client
**Location:** `supabase/functions/send-welcome-email/index.ts`
**JWT Required:** No (verify_jwt = false)

```typescript
// Request body
interface WelcomeEmailRequest {
  clientEmail: string;
  clientName: string;
  companyName: string;
  temporaryPassword: string;
  tenantId?: string;
}

// Uses RESEND_API_KEY secret
// Logs to system_logs table
```

### 2. `send-feature-unlock-email`
**Purpose:** Notifies employees when admin unlocks new features for them
**Location:** `supabase/functions/send-feature-unlock-email/index.ts`
**JWT Required:** No (verify_jwt = false)

```typescript
// Request body
interface FeatureUnlockEmailRequest {
  employeeEmail: string;
  employeeName: string;
  featureName: string;
  featureDescription?: string;
  actionUrl?: string;
  tenantName?: string;
}

// Uses RESEND_API_KEY secret
// Logs to system_logs table
```

### 3. `send-quote-followup`
**Purpose:** Sends various quote/pricing related emails (exit intent, calculator, followup)
**Location:** `supabase/functions/send-quote-followup/index.ts`
**JWT Required:** No (verify_jwt = false)

```typescript
// Request body
interface QuoteFollowupRequest {
  name: string;
  email: string;
  type: "exit_intent" | "quote_request" | "calculator" | "followup";
  quoteDetails?: {
    services?: string[];
    addons?: string[];
    total?: number;
    clientType?: string;
  };
}

// Uses RESEND_API_KEY secret
```

### 4. `generate-invoice-pdf`
**Purpose:** Generates HTML invoice for PDF download
**Location:** `supabase/functions/generate-invoice-pdf/index.ts`
**JWT Required:** No (verify_jwt = false)

```typescript
// Request body
interface InvoiceData {
  invoice_number: string;
  amount: number;
  tax_amount: number;
  tax_percent: number;
  total_amount: number;
  status: string;
  due_date: string | null;
  created_at: string;
  notes: string | null;
  client_name: string;
  client_email: string;
  client_company: string | null;
  client_phone: string | null;
  quote_number: string | null;
  service_type: string | null;
}

// Returns HTML content (convert to PDF client-side)
```

### Edge Function Configuration
```toml
# supabase/config.toml
project_id = "wnentybljoyjhizsdhrt"

[functions.generate-invoice-pdf]
verify_jwt = false

[functions.send-welcome-email]
verify_jwt = false

[functions.send-feature-unlock-email]
verify_jwt = false

[functions.send-quote-followup]
verify_jwt = false
```

---

## Storage Buckets

### `client-files`
**Purpose:** Stores client-uploaded files and documents
**Public:** No (private bucket)
**Access:** Via signed URLs

```sql
-- Storage bucket configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-files', 'client-files', false);

-- RLS policies for storage.objects
-- Users can upload to their own folder: {user_id}/{filename}
-- Admins can access all files
```

---

## Secrets/Environment Variables

These secrets are configured in Supabase and available to edge functions:

| Secret Name | Description | Used By |
|-------------|-------------|---------|
| `SUPABASE_URL` | Project URL | All edge functions |
| `SUPABASE_ANON_KEY` | Public anon key | Frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key (never expose) | Edge functions |
| `SUPABASE_PUBLISHABLE_KEY` | Same as anon key | Frontend |
| `SUPABASE_DB_URL` | Direct database connection | Migrations |
| `RESEND_API_KEY` | Resend.com API key | Email functions |

---

## Migration Guide

### To migrate to your own Supabase project:

1. **Create new Supabase project** at https://supabase.com

2. **Export schema from Lovable Cloud:**
   - Use this documentation as reference
   - Or export via SQL Editor (if you have access)

3. **Run migrations in order:**
   ```bash
   # 1. Create enums
   CREATE TYPE app_role AS ENUM ('admin', 'user');
   CREATE TYPE quote_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'converted');
   CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
   
   # 2. Create tables (in dependency order)
   # 3. Create functions
   # 4. Create RLS policies
   # 5. Create triggers
   ```

4. **Deploy edge functions:**
   ```bash
   supabase functions deploy send-welcome-email
   supabase functions deploy send-feature-unlock-email
   supabase functions deploy send-quote-followup
   supabase functions deploy generate-invoice-pdf
   ```

5. **Configure secrets:**
   ```bash
   supabase secrets set RESEND_API_KEY=re_xxxxx
   ```

6. **Create storage bucket:**
   ```sql
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('client-files', 'client-files', false);
   ```

7. **Update frontend environment:**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJxxxxx
   ```

---

## Additional Notes

### Enum Types
```sql
-- App roles for RBAC
CREATE TYPE app_role AS ENUM ('admin', 'user');

-- Quote lifecycle
CREATE TYPE quote_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'converted');

-- Invoice lifecycle
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
```

### Important Security Considerations
1. **Never store roles in profiles table** - Use separate `user_roles` table
2. **Always use `has_role()` function** for role checks in RLS policies
3. **Never expose `SUPABASE_SERVICE_ROLE_KEY`** in frontend code
4. **Use RLS on all tables** - No exceptions
5. **Validate all inputs** in edge functions

### Performance Indexes
```sql
-- Recommended indexes for common queries
CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_clickstream_session ON clickstream_events(session_id);
```

---

## Sample Data SQL Scripts

Use these scripts to populate your database with test data after migration.

### 1. Create Admin User and Role
```sql
-- First, create an admin user via Supabase Auth (use Dashboard or API)
-- Then assign admin role:
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_ADMIN_USER_UUID', 'admin');
```

### 2. Sample Tenants (Client Organizations)
```sql
-- Sample client tenants for multi-tenancy testing
INSERT INTO public.client_tenants (slug, name, contact_email, contact_phone, status, tenant_type, address) VALUES
('acme-corp', 'Acme Corporation', 'admin@acmecorp.com', '+91-9876543210', 'active', 'enterprise', 'Mumbai, Maharashtra'),
('startup-hub', 'Startup Hub India', 'hello@startuphub.in', '+91-9123456789', 'active', 'startup', 'Bangalore, Karnataka'),
('retail-mart', 'Retail Mart Ltd', 'ops@retailmart.co.in', '+91-9988776655', 'pending', 'enterprise', 'Delhi, NCR'),
('tech-solutions', 'Tech Solutions Pvt Ltd', 'info@techsol.io', '+91-8765432109', 'active', 'individual', 'Hyderabad, Telangana'),
('global-services', 'Global Services Inc', 'contact@globalservices.com', '+91-7654321098', 'active', 'enterprise', 'Pune, Maharashtra');
```

### 3. Sample Team Members
```sql
-- Sample team members for project assignment
INSERT INTO public.team_members (name, email, role, department, availability, skills) VALUES
('Arjun Sharma', 'arjun@cropxon.com', 'Project Manager', 'Operations', 'available', '["Project Management", "Agile", "Scrum"]'),
('Priya Patel', 'priya@cropxon.com', 'Senior Developer', 'Engineering', 'available', '["React", "Node.js", "PostgreSQL"]'),
('Rahul Verma', 'rahul@cropxon.com', 'DevOps Engineer', 'Infrastructure', 'busy', '["AWS", "Docker", "Kubernetes"]'),
('Ananya Singh', 'ananya@cropxon.com', 'UI/UX Designer', 'Design', 'available', '["Figma", "Adobe XD", "User Research"]'),
('Vikram Reddy', 'vikram@cropxon.com', 'Security Analyst', 'Security', 'available', '["Penetration Testing", "SIEM", "Compliance"]'),
('Meera Joshi', 'meera@cropxon.com', 'Business Analyst', 'Operations', 'available', '["Requirements Analysis", "Process Mapping", "SQL"]'),
('Karthik Nair', 'karthik@cropxon.com', 'Full Stack Developer', 'Engineering', 'busy', '["TypeScript", "Python", "GraphQL"]'),
('Sneha Gupta', 'sneha@cropxon.com', 'Customer Success', 'Support', 'available', '["Client Relations", "Onboarding", "Training"]');
```

### 4. Sample Leads
```sql
-- Sample CRM leads for testing
INSERT INTO public.leads (name, email, phone, company, source, status, score, notes) VALUES
('Rajesh Kumar', 'rajesh@techstartup.in', '+91-9876543211', 'TechStartup India', 'website', 'new', 25, 'Interested in HR automation'),
('Sunita Menon', 'sunita@retailchain.com', '+91-9876543212', 'Retail Chain Corp', 'referral', 'contacted', 65, 'Enterprise client, high potential'),
('Amit Jain', 'amit@manufacturingco.in', '+91-9876543213', 'Manufacturing Co', 'linkedin', 'qualified', 85, 'Ready for demo, budget approved'),
('Deepa Krishnan', 'deepa@hospitalgroup.org', '+91-9876543214', 'Hospital Group', 'campaign', 'new', 40, 'Healthcare vertical, compliance focus'),
('Sanjay Deshmukh', 'sanjay@logisticsplus.in', '+91-9876543215', 'Logistics Plus', 'website', 'contacted', 55, 'Interested in payroll module'),
('Neha Agarwal', 'neha@edtechsolutions.com', '+91-9876543216', 'EdTech Solutions', 'event', 'qualified', 75, 'Fast-growing startup, 500+ employees'),
('Vinod Pillai', 'vinod@financeservices.in', '+91-9876543217', 'Finance Services Ltd', 'cold_call', 'new', 30, 'Initial discussion scheduled');
```

### 5. Sample Quotes
```sql
-- Sample pricing quotes
INSERT INTO public.quotes (quote_number, client_type, service_type, complexity, estimated_price, final_price, status, contact_name, contact_email, contact_company, features, addons) VALUES
('ATL-2025-0001', 'enterprise', 'HR & Payroll', 'advanced', 150000, 135000, 'pending', 'Sunita Menon', 'sunita@retailchain.com', 'Retail Chain Corp', '["Core HR", "Payroll", "Attendance", "Leave Management"]', '["BGV Integration", "SSO"]'),
('ATL-2025-0002', 'startup', 'Workforce OS', 'standard', 75000, 75000, 'approved', 'Neha Agarwal', 'neha@edtechsolutions.com', 'EdTech Solutions', '["Core HR", "Recruitment", "Performance"]', '["AI Insights"]'),
('ATL-2025-0003', 'individual', 'Compliance Suite', 'basic', 25000, 22500, 'converted', 'Rajesh Kumar', 'rajesh@techstartup.in', 'TechStartup India', '["PF/ESIC", "PT", "Labor Laws"]', '[]'),
('ATL-2025-0004', 'enterprise', 'Full Platform', 'enterprise', 350000, 315000, 'pending', 'Amit Jain', 'amit@manufacturingco.in', 'Manufacturing Co', '["All Modules"]', '["Managed Services", "Priority Support", "Custom Integration"]');
```

### 6. Sample Invoices
```sql
-- Sample invoices (linked to quotes where applicable)
INSERT INTO public.invoices (invoice_number, amount, tax_percent, tax_amount, total_amount, status, due_date, notes) VALUES
('INV-2025-0001', 22500, 18.00, 4050, 26550, 'paid', '2025-02-15', 'TechStartup India - Compliance Suite'),
('INV-2025-0002', 75000, 18.00, 13500, 88500, 'sent', '2025-02-28', 'EdTech Solutions - Workforce OS Annual'),
('INV-2025-0003', 50000, 18.00, 9000, 59000, 'draft', '2025-03-15', 'Retail Chain Corp - Implementation Phase 1'),
('INV-2025-0004', 35000, 18.00, 6300, 41300, 'overdue', '2025-01-31', 'Hospital Group - HR Module');
```

### 7. Sample Projects
```sql
-- Sample active projects
INSERT INTO public.projects (name, description, status, phase, progress, health_score, budget, start_date, due_date) VALUES
('Retail Chain HR Transformation', 'Complete HR automation for 5000+ employees', 'active', 'Implementation', 45, 85, 500000, '2025-01-01', '2025-06-30'),
('EdTech Payroll Integration', 'Payroll setup with existing HRMS', 'active', 'Development', 70, 95, 150000, '2024-12-01', '2025-03-31'),
('Hospital Compliance Audit', 'Annual compliance review and automation', 'planning', 'Discovery', 10, 100, 100000, '2025-02-01', '2025-04-30'),
('Manufacturing ERP Integration', 'Connect ATLAS with SAP ERP', 'active', 'Design', 25, 75, 350000, '2025-01-15', '2025-09-30'),
('Fintech Security Hardening', 'Security audit and implementation', 'completed', 'Closure', 100, 100, 200000, '2024-10-01', '2024-12-31');
```

### 8. Sample Support Tickets
```sql
-- Sample support tickets
INSERT INTO public.support_tickets (ticket_number, subject, description, status, priority, sla_due_at) VALUES
('TKT-00001', 'Unable to generate payslips', 'Getting error when trying to generate monthly payslips for February', 'open', 'high', NOW() + INTERVAL '4 hours'),
('TKT-00002', 'SSO configuration help needed', 'Need assistance configuring Azure AD SSO', 'in_progress', 'medium', NOW() + INTERVAL '24 hours'),
('TKT-00003', 'Feature request: Custom reports', 'Would like ability to create custom compliance reports', 'open', 'low', NOW() + INTERVAL '72 hours'),
('TKT-00004', 'Attendance sync failing', 'Biometric device not syncing attendance data', 'resolved', 'urgent', NOW() - INTERVAL '2 hours'),
('TKT-00005', 'Invoice PDF not downloading', 'PDF download button not working on Safari', 'open', 'medium', NOW() + INTERVAL '12 hours');
```

### 9. Sample Onboarding Sessions
```sql
-- Sample onboarding applications
INSERT INTO public.onboarding_sessions (client_id, full_name, email, phone, company_name, client_type, industry_type, industry_subtype, status, current_step, selected_services, dashboard_tier) VALUES
('ATLS-20250207-0001', 'Rohit Sharma', 'rohit@newstartup.io', '+91-9988776655', 'New Startup IO', 'startup', 'Technology & IT', 'SaaS & Software Products', 'pending_approval', 4, '["HR & Payroll", "Recruitment", "Compliance"]', 'professional'),
('ATLS-20250207-0002', 'Kavita Rao', 'kavita@hospitalnetwork.org', '+91-8877665544', 'Hospital Network', 'enterprise', 'Healthcare & Wellness', 'Hospitals & Medical Centers', 'approved', 4, '["Full Platform"]', 'enterprise'),
('ATLS-20250207-0003', 'Anil Kapoor', 'anil@retailworld.com', '+91-7766554433', 'Retail World', 'enterprise', 'Retail & Commerce', 'Supermarkets & Hypermarkets', 'in_progress', 2, '["Workforce Management", "Attendance"]', 'basic');
```

### 10. Sample System Logs
```sql
-- Sample system logs for monitoring
INSERT INTO public.system_logs (level, source, message, metadata) VALUES
('info', 'auth', 'User login successful', '{"user_email": "admin@cropxon.com", "ip": "192.168.1.100"}'),
('info', 'payroll', 'Payroll run initiated', '{"tenant": "acme-corp", "month": "February 2025", "employee_count": 150}'),
('warning', 'integration', 'SSO token refresh failed, retrying', '{"provider": "azure_ad", "tenant": "retail-mart"}'),
('error', 'email', 'Failed to send welcome email', '{"recipient": "test@example.com", "error": "Invalid email address"}'),
('info', 'api', 'API rate limit approaching', '{"tenant": "startup-hub", "current_rate": 450, "limit": 500}'),
('debug', 'scheduler', 'Cron job executed successfully', '{"job": "daily_backup", "duration_ms": 3450}'),
('info', 'onboarding', 'New client application received', '{"client_id": "ATLS-20250207-0004", "company": "New Client Ltd"}');
```

### 11. Sample Audit Logs
```sql
-- Sample audit logs for compliance
INSERT INTO public.audit_logs (action, entity_type, entity_id, old_values, new_values, ip_address, user_agent) VALUES
('create', 'quote', 'ATL-2025-0001', NULL, '{"status": "draft", "amount": 150000}', '192.168.1.100', 'Mozilla/5.0'),
('update', 'project', 'proj-001', '{"status": "planning"}', '{"status": "active"}', '192.168.1.101', 'Chrome/120'),
('delete', 'lead', 'lead-old-001', '{"name": "Old Lead", "status": "lost"}', NULL, '192.168.1.102', 'Safari/17'),
('update', 'user_role', 'role-001', '{"role": "user"}', '{"role": "admin"}', '192.168.1.100', 'Firefox/121'),
('create', 'tenant', 'tenant-new-001', NULL, '{"name": "New Tenant", "status": "active"}', '192.168.1.103', 'Edge/120');
```

### 12. Sample Pricing Data
```sql
-- Sample service pricing
INSERT INTO public.service_pricing (service_name, service_category, plan_tier, base_price, description, features, is_active) VALUES
('Core HR', 'HR & Workforce', 'basic', 2999, 'Essential HR management', '["Employee Directory", "Basic Reports", "Document Storage"]', true),
('Core HR', 'HR & Workforce', 'professional', 5999, 'Advanced HR with automation', '["All Basic Features", "Workflow Automation", "Custom Fields", "API Access"]', true),
('Core HR', 'HR & Workforce', 'enterprise', 9999, 'Enterprise HR suite', '["All Professional Features", "SSO", "Advanced Analytics", "Priority Support"]', true),
('Payroll', 'Payroll & Finance', 'basic', 3999, 'Basic payroll processing', '["Salary Calculation", "Payslips", "Bank File Generation"]', true),
('Payroll', 'Payroll & Finance', 'professional', 7999, 'Advanced payroll with compliance', '["All Basic Features", "PF/ESIC/PT", "Reimbursements", "Multi-location"]', true),
('Compliance Suite', 'Compliance', 'professional', 4999, 'Full compliance automation', '["PF/ESIC Filing", "PT", "Labor Law Compliance", "Audit Trail"]', true);

-- Sample add-ons
INSERT INTO public.service_addons (name, price, category, description, is_active) VALUES
('BGV Integration', 2500, 'Verification', 'Background verification integration with third-party providers', true),
('SSO Setup', 5000, 'Security', 'Single Sign-On configuration for enterprise', true),
('Priority Support', 9999, 'Support', '24/7 priority support with dedicated account manager', true),
('Custom Integration', 15000, 'Integration', 'Custom API integration with existing systems', true),
('Managed Payroll', 25000, 'Services', 'Fully managed payroll processing service', true),
('AI Insights', 7500, 'Intelligence', 'AI-powered workforce analytics and predictions', true);

-- Sample pricing modifiers
INSERT INTO public.pricing_modifiers (modifier_type, modifier_key, multiplier, description, is_active) VALUES
('industry', 'healthcare', 1.15, '15% premium for healthcare compliance requirements', true),
('industry', 'finance', 1.20, '20% premium for financial sector regulations', true),
('employee_count', '500_plus', 0.85, '15% volume discount for 500+ employees', true),
('employee_count', '1000_plus', 0.75, '25% volume discount for 1000+ employees', true),
('contract_length', 'annual', 0.80, '20% discount for annual commitment', true),
('contract_length', 'multi_year', 0.70, '30% discount for multi-year contracts', true);

-- Sample coupon codes
INSERT INTO public.coupon_codes (code, discount_type, discount_value, max_uses, is_active, valid_from, valid_until) VALUES
('WELCOME20', 'percentage', 20, 100, true, NOW(), NOW() + INTERVAL '90 days'),
('STARTUP50', 'percentage', 50, 50, true, NOW(), NOW() + INTERVAL '60 days'),
('FLAT5000', 'fixed', 5000, 25, true, NOW(), NOW() + INTERVAL '30 days'),
('ENTERPRISE25', 'percentage', 25, 10, true, NOW(), NOW() + INTERVAL '180 days');
```

### 13. Sample MSP Monitoring Data
```sql
-- Sample MSP servers (linked to tenants)
INSERT INTO public.client_msp_servers (tenant_id, name, hostname, ip_address, server_type, status) 
SELECT id, 'Production Web Server', 'prod-web-01.acme.local', '10.0.1.10', 'web', 'online'
FROM public.client_tenants WHERE slug = 'acme-corp';

INSERT INTO public.client_msp_servers (tenant_id, name, hostname, ip_address, server_type, status) 
SELECT id, 'Database Server', 'prod-db-01.acme.local', '10.0.1.20', 'database', 'online'
FROM public.client_tenants WHERE slug = 'acme-corp';

INSERT INTO public.client_msp_servers (tenant_id, name, hostname, ip_address, server_type, status) 
SELECT id, 'Application Server', 'prod-app-01.startup.local', '10.0.2.10', 'app', 'warning'
FROM public.client_tenants WHERE slug = 'startup-hub';
```

### 14. Sample Clickstream Events
```sql
-- Sample clickstream data for analytics
INSERT INTO public.clickstream_events (session_id, event_type, page_url, element_id, element_text, metadata) VALUES
('sess-001', 'page_view', '/pricing', NULL, NULL, '{"referrer": "google.com", "utm_source": "google_ads"}'),
('sess-001', 'click', '/pricing', 'btn-get-quote', 'Get Custom Quote', '{"section": "pricing_table"}'),
('sess-001', 'page_view', '/get-quote', NULL, NULL, '{}'),
('sess-002', 'page_view', '/', NULL, NULL, '{"referrer": "linkedin.com"}'),
('sess-002', 'scroll', '/', NULL, NULL, '{"depth": 75}'),
('sess-002', 'click', '/', 'btn-features', 'Explore Features', '{}'),
('sess-003', 'page_view', '/features', NULL, NULL, '{"referrer": "direct"}'),
('sess-003', 'click', '/features', 'module-hr', 'HR & Payroll', '{}'),
('sess-003', 'page_view', '/modules/hr-payroll', NULL, NULL, '{}');
```

### 15. Sample Meetings
```sql
-- Sample scheduled meetings
INSERT INTO public.meetings (title, description, scheduled_at, duration_minutes, meeting_type, meeting_link, status) VALUES
('Retail Chain Kickoff', 'Project kickoff meeting with Retail Chain Corp stakeholders', NOW() + INTERVAL '2 days', 60, 'client', 'https://meet.google.com/abc-defg-hij', 'scheduled'),
('EdTech Weekly Sync', 'Weekly status update with EdTech Solutions', NOW() + INTERVAL '1 day', 30, 'client', 'https://teams.microsoft.com/l/meetup-join/xyz', 'scheduled'),
('Internal Sprint Planning', 'Sprint 24 planning session', NOW() + INTERVAL '3 days', 120, 'internal', 'https://meet.google.com/xyz-abcd-efg', 'scheduled'),
('Hospital Demo', 'ATLAS platform demo for Hospital Group', NOW() + INTERVAL '5 days', 45, 'demo', 'https://zoom.us/j/123456789', 'scheduled');
```

---

## Complete Migration SQL Script

For convenience, here's a single script to run all sample data insertions:

```sql
-- Run this after creating all tables and functions
-- Make sure to replace 'YOUR_ADMIN_USER_UUID' with actual admin user ID

BEGIN;

-- Execute all sample data inserts from sections above
-- (Copy individual sections as needed)

COMMIT;
```

---

**Document generated for CropXon ATLAS platform migration and self-hosting reference.**
