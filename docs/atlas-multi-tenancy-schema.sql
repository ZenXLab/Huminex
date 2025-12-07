-- ============================================================================
-- ATLAS MULTI-TENANCY DATABASE SCHEMA
-- Enterprise-Grade Workday-Style Multi-Tenancy for Supabase
-- Version: 1.0.0
-- Generated: 2024
-- ============================================================================
-- 
-- EXECUTION ORDER:
-- 1. Run this entire file in your Supabase SQL Editor
-- 2. Or split by sections marked with "-- PART X"
--
-- IMPORTANT: Run in a fresh Supabase project or backup existing data first
-- ============================================================================

-- ============================================================================
-- PART 1: SCHEMA CREATION & EXTENSIONS
-- ============================================================================

-- Create custom schemas for modular organization
CREATE SCHEMA IF NOT EXISTS atlas_core;      -- Platform core (tenants, users, auth)
CREATE SCHEMA IF NOT EXISTS atlas_hr;        -- HR & Workforce Management
CREATE SCHEMA IF NOT EXISTS atlas_payroll;   -- Payroll & Compensation
CREATE SCHEMA IF NOT EXISTS atlas_attendance;-- Attendance & Leave
CREATE SCHEMA IF NOT EXISTS atlas_recruitment;-- Talent Acquisition
CREATE SCHEMA IF NOT EXISTS atlas_compliance;-- Compliance & Policies
CREATE SCHEMA IF NOT EXISTS atlas_finance;   -- Finance & Billing
CREATE SCHEMA IF NOT EXISTS atlas_projects;  -- Projects & Tasks
CREATE SCHEMA IF NOT EXISTS atlas_assets;    -- Asset & EMS Management
CREATE SCHEMA IF NOT EXISTS atlas_automation;-- OpZenix Workflows
CREATE SCHEMA IF NOT EXISTS atlas_insurance; -- Insurance & Claims
CREATE SCHEMA IF NOT EXISTS atlas_bgv;       -- Background Verification
CREATE SCHEMA IF NOT EXISTS atlas_performance;-- Performance & OKRs

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant schema usage to authenticated users
GRANT USAGE ON SCHEMA atlas_core TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA atlas_hr TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA atlas_payroll TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA atlas_attendance TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA atlas_recruitment TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA atlas_compliance TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA atlas_finance TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA atlas_projects TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA atlas_assets TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA atlas_automation TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA atlas_insurance TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA atlas_bgv TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA atlas_performance TO authenticated, anon, service_role;

-- ============================================================================
-- PART 2: ENUM TYPES
-- ============================================================================

-- Core enums
CREATE TYPE atlas_core.tenant_status AS ENUM (
    'trial', 'active', 'suspended', 'cancelled', 'expired'
);

CREATE TYPE atlas_core.tenant_plan AS ENUM (
    'trial', 'starter', 'professional', 'business', 'enterprise'
);

CREATE TYPE atlas_core.tenant_role AS ENUM (
    'super_admin', 'admin', 'hr_admin', 'finance_admin', 'manager', 'employee', 'contractor', 'viewer'
);

CREATE TYPE atlas_core.platform_role AS ENUM (
    'platform_admin', 'platform_support', 'platform_viewer'
);

CREATE TYPE atlas_core.membership_status AS ENUM (
    'active', 'inactive', 'pending', 'suspended'
);

-- HR enums
CREATE TYPE atlas_hr.employee_status AS ENUM (
    'active', 'on_leave', 'probation', 'notice_period', 'terminated', 'retired'
);

CREATE TYPE atlas_hr.employment_type AS ENUM (
    'full_time', 'part_time', 'contract', 'intern', 'consultant'
);

CREATE TYPE atlas_hr.gender AS ENUM (
    'male', 'female', 'other', 'prefer_not_to_say'
);

-- Payroll enums
CREATE TYPE atlas_payroll.payroll_status AS ENUM (
    'draft', 'processing', 'pending_approval', 'approved', 'paid', 'failed', 'cancelled'
);

CREATE TYPE atlas_payroll.salary_component_type AS ENUM (
    'earning', 'deduction', 'reimbursement', 'statutory', 'bonus'
);

-- Attendance enums
CREATE TYPE atlas_attendance.leave_status AS ENUM (
    'pending', 'approved', 'rejected', 'cancelled', 'expired'
);

CREATE TYPE atlas_attendance.leave_type AS ENUM (
    'casual', 'sick', 'earned', 'maternity', 'paternity', 'bereavement', 'unpaid', 'compensatory', 'work_from_home'
);

-- Recruitment enums
CREATE TYPE atlas_recruitment.job_status AS ENUM (
    'draft', 'open', 'on_hold', 'filled', 'cancelled'
);

CREATE TYPE atlas_recruitment.application_status AS ENUM (
    'applied', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected', 'withdrawn'
);

-- Project enums
CREATE TYPE atlas_projects.project_status AS ENUM (
    'planning', 'active', 'on_hold', 'completed', 'cancelled', 'archived'
);

CREATE TYPE atlas_projects.task_status AS ENUM (
    'backlog', 'todo', 'in_progress', 'review', 'done', 'blocked'
);

CREATE TYPE atlas_projects.task_priority AS ENUM (
    'critical', 'high', 'medium', 'low'
);

-- Automation enums
CREATE TYPE atlas_automation.workflow_status AS ENUM (
    'draft', 'active', 'paused', 'archived'
);

CREATE TYPE atlas_automation.execution_status AS ENUM (
    'pending', 'running', 'completed', 'failed', 'cancelled', 'retrying'
);

-- BGV enums
CREATE TYPE atlas_bgv.verification_status AS ENUM (
    'pending', 'in_progress', 'completed', 'failed', 'disputed'
);

CREATE TYPE atlas_bgv.verification_type AS ENUM (
    'identity', 'address', 'education', 'employment', 'criminal', 'credit', 'reference', 'drug_test'
);

-- Insurance enums
CREATE TYPE atlas_insurance.claim_status AS ENUM (
    'submitted', 'under_review', 'approved', 'rejected', 'paid', 'appealed'
);

CREATE TYPE atlas_insurance.policy_type AS ENUM (
    'health', 'life', 'accident', 'disability', 'dental', 'vision'
);

-- Performance enums
CREATE TYPE atlas_performance.review_status AS ENUM (
    'draft', 'self_review', 'manager_review', 'calibration', 'completed'
);

CREATE TYPE atlas_performance.goal_status AS ENUM (
    'not_started', 'in_progress', 'at_risk', 'on_track', 'completed', 'cancelled'
);

-- Compliance enums
CREATE TYPE atlas_compliance.compliance_status AS ENUM (
    'compliant', 'non_compliant', 'pending', 'expired', 'exempted'
);

-- Asset enums
CREATE TYPE atlas_assets.asset_status AS ENUM (
    'available', 'assigned', 'maintenance', 'retired', 'lost', 'damaged'
);

-- ============================================================================
-- PART 3: CORE TABLES (atlas_core schema)
-- ============================================================================

-- 3.1 Tenants Table (Root of multi-tenancy)
CREATE TABLE atlas_core.core_tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    legal_name text,
    status atlas_core.tenant_status NOT NULL DEFAULT 'trial',
    plan atlas_core.tenant_plan NOT NULL DEFAULT 'trial',
    
    -- Contact & Address
    contact_email text NOT NULL,
    contact_phone text,
    address_line1 text,
    address_line2 text,
    city text,
    state text,
    country text DEFAULT 'IN',
    postal_code text,
    
    -- Branding
    logo_url text,
    primary_color text DEFAULT '#005EEB',
    custom_domain text,
    
    -- Subscription
    trial_ends_at timestamptz,
    subscription_starts_at timestamptz,
    subscription_ends_at timestamptz,
    billing_email text,
    
    -- Limits (based on plan)
    max_employees integer DEFAULT 10,
    max_admins integer DEFAULT 2,
    max_storage_gb integer DEFAULT 5,
    
    -- Onboarding
    onboarding_status text DEFAULT 'pending',
    onboarding_completed_at timestamptz,
    
    -- Metadata
    settings jsonb DEFAULT '{}',
    metadata jsonb DEFAULT '{}',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

-- 3.2 User Profiles (linked to auth.users)
CREATE TABLE atlas_core.core_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    full_name text,
    phone text,
    avatar_url text,
    timezone text DEFAULT 'Asia/Kolkata',
    locale text DEFAULT 'en',
    
    -- Platform-level role (for ATLAS internal admins)
    platform_role atlas_core.platform_role,
    
    -- Preferences
    preferences jsonb DEFAULT '{}',
    notification_settings jsonb DEFAULT '{"email": true, "push": true, "sms": false}',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_login_at timestamptz
);

-- 3.3 User-Tenant Memberships (Multi-tenant access)
CREATE TABLE atlas_core.core_tenant_memberships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    -- Role within this tenant
    role atlas_core.tenant_role NOT NULL DEFAULT 'employee',
    status atlas_core.membership_status NOT NULL DEFAULT 'active',
    
    -- Employee link (if applicable)
    employee_id uuid, -- Will reference atlas_hr.hr_employees
    
    -- Access control
    permissions jsonb DEFAULT '[]',
    department_access jsonb DEFAULT '[]',
    
    -- Invitation
    invited_by uuid REFERENCES auth.users(id),
    invited_at timestamptz,
    accepted_at timestamptz,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(user_id, tenant_id)
);

-- 3.4 Tenant Settings (Detailed configuration)
CREATE TABLE atlas_core.core_tenant_settings (
    tenant_id uuid PRIMARY KEY REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    -- General Settings
    fiscal_year_start integer DEFAULT 4, -- April
    week_start_day integer DEFAULT 1, -- Monday
    date_format text DEFAULT 'DD/MM/YYYY',
    currency text DEFAULT 'INR',
    
    -- HR Settings
    hr_config jsonb DEFAULT '{
        "probation_days": 90,
        "notice_period_days": 30,
        "employee_id_prefix": "EMP",
        "auto_generate_employee_id": true
    }',
    
    -- Payroll Settings
    payroll_config jsonb DEFAULT '{
        "pay_cycle": "monthly",
        "pay_day": 1,
        "include_pf": true,
        "include_esic": true,
        "include_professional_tax": true
    }',
    
    -- Attendance Settings
    attendance_config jsonb DEFAULT '{
        "work_hours_per_day": 9,
        "grace_period_minutes": 15,
        "half_day_hours": 4.5,
        "overtime_multiplier": 1.5,
        "geo_fencing_enabled": false
    }',
    
    -- Leave Settings
    leave_policies jsonb DEFAULT '{
        "casual_leave": 12,
        "sick_leave": 12,
        "earned_leave": 15,
        "carry_forward_max": 30,
        "encashment_enabled": true
    }',
    
    -- Compliance Settings
    compliance_config jsonb DEFAULT '{
        "pf_enabled": true,
        "esic_enabled": true,
        "lwf_enabled": false,
        "gratuity_enabled": true
    }',
    
    -- Integration Settings
    integrations jsonb DEFAULT '{}',
    
    -- SSO Settings
    sso_config jsonb DEFAULT '{
        "enabled": false,
        "provider": null,
        "domain": null
    }',
    
    -- Feature Flags
    features jsonb DEFAULT '{
        "bgv_enabled": true,
        "insurance_enabled": true,
        "performance_enabled": true,
        "automation_enabled": true,
        "ai_insights_enabled": false
    }',
    
    -- Timestamps
    updated_at timestamptz DEFAULT now()
);

-- 3.5 Audit Logs (Immutable trail)
CREATE TABLE atlas_core.core_audit_logs (
    id bigserial PRIMARY KEY,
    tenant_id uuid REFERENCES atlas_core.core_tenants(id),
    user_id uuid REFERENCES auth.users(id),
    
    -- Action details
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid,
    
    -- Change tracking
    old_values jsonb,
    new_values jsonb,
    
    -- Request context
    ip_address inet,
    user_agent text,
    request_id text,
    
    -- Timestamp (immutable)
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Create index for audit log queries
CREATE INDEX idx_audit_logs_tenant ON atlas_core.core_audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user ON atlas_core.core_audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON atlas_core.core_audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON atlas_core.core_audit_logs(created_at DESC);

-- ============================================================================
-- PART 4: HR MODULE (atlas_hr schema)
-- ============================================================================

-- 4.1 Departments
CREATE TABLE atlas_hr.hr_departments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    name text NOT NULL,
    code text,
    description text,
    parent_id uuid REFERENCES atlas_hr.hr_departments(id),
    head_employee_id uuid, -- Will reference hr_employees
    
    is_active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, code)
);

-- 4.2 Designations
CREATE TABLE atlas_hr.hr_designations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    title text NOT NULL,
    code text,
    level integer DEFAULT 1,
    department_id uuid REFERENCES atlas_hr.hr_departments(id),
    
    min_salary numeric(12,2),
    max_salary numeric(12,2),
    
    is_active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, code)
);

-- 4.3 Employees (Core HR table)
CREATE TABLE atlas_hr.hr_employees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id), -- Linked if employee has portal access
    
    -- Basic Info
    employee_code text NOT NULL,
    first_name text NOT NULL,
    last_name text,
    full_name text GENERATED ALWAYS AS (first_name || ' ' || COALESCE(last_name, '')) STORED,
    email text NOT NULL,
    phone text,
    
    -- Personal Details
    date_of_birth date,
    gender atlas_hr.gender,
    blood_group text,
    nationality text DEFAULT 'Indian',
    marital_status text,
    
    -- Employment Details
    status atlas_hr.employee_status NOT NULL DEFAULT 'active',
    employment_type atlas_hr.employment_type NOT NULL DEFAULT 'full_time',
    department_id uuid REFERENCES atlas_hr.hr_departments(id),
    designation_id uuid REFERENCES atlas_hr.hr_designations(id),
    reporting_manager_id uuid REFERENCES atlas_hr.hr_employees(id),
    
    -- Dates
    joining_date date NOT NULL,
    confirmation_date date,
    resignation_date date,
    last_working_date date,
    
    -- Compensation
    ctc_annual numeric(12,2),
    salary_currency text DEFAULT 'INR',
    
    -- Location
    work_location text,
    is_remote boolean DEFAULT false,
    
    -- Identity Documents
    pan_number text,
    aadhar_number text,
    passport_number text,
    
    -- Bank Details
    bank_name text,
    bank_account_number text,
    bank_ifsc text,
    
    -- Address
    current_address jsonb DEFAULT '{}',
    permanent_address jsonb DEFAULT '{}',
    
    -- Emergency Contact
    emergency_contact jsonb DEFAULT '{}',
    
    -- Additional Data
    skills jsonb DEFAULT '[]',
    certifications jsonb DEFAULT '[]',
    education jsonb DEFAULT '[]',
    work_experience jsonb DEFAULT '[]',
    
    -- Profile
    avatar_url text,
    bio text,
    
    -- Metadata
    custom_fields jsonb DEFAULT '{}',
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz,
    
    UNIQUE(tenant_id, employee_code),
    UNIQUE(tenant_id, email)
);

-- Add foreign key for department head
ALTER TABLE atlas_hr.hr_departments 
    ADD CONSTRAINT fk_department_head 
    FOREIGN KEY (head_employee_id) 
    REFERENCES atlas_hr.hr_employees(id);

-- Add foreign key for membership employee link
ALTER TABLE atlas_core.core_tenant_memberships
    ADD CONSTRAINT fk_membership_employee
    FOREIGN KEY (employee_id)
    REFERENCES atlas_hr.hr_employees(id);

-- 4.4 Employee Documents
CREATE TABLE atlas_hr.hr_employee_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id) ON DELETE CASCADE,
    
    document_type text NOT NULL,
    document_name text NOT NULL,
    file_path text NOT NULL,
    file_size integer,
    mime_type text,
    
    expiry_date date,
    is_verified boolean DEFAULT false,
    verified_by uuid REFERENCES auth.users(id),
    verified_at timestamptz,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PART 5: PAYROLL MODULE (atlas_payroll schema)
-- ============================================================================

-- 5.1 Salary Components
CREATE TABLE atlas_payroll.pay_salary_components (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    name text NOT NULL,
    code text NOT NULL,
    component_type atlas_payroll.salary_component_type NOT NULL,
    
    is_taxable boolean DEFAULT true,
    is_fixed boolean DEFAULT true,
    calculation_formula text,
    
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, code)
);

-- 5.2 Employee Salary Structure
CREATE TABLE atlas_payroll.pay_employee_salary (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id) ON DELETE CASCADE,
    
    effective_from date NOT NULL,
    effective_to date,
    
    ctc_annual numeric(12,2) NOT NULL,
    ctc_monthly numeric(12,2) NOT NULL,
    
    -- Salary breakdown
    components jsonb NOT NULL DEFAULT '[]',
    
    is_current boolean DEFAULT true,
    approved_by uuid REFERENCES auth.users(id),
    approved_at timestamptz,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 5.3 Payroll Runs
CREATE TABLE atlas_payroll.pay_payroll_runs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    run_code text NOT NULL,
    pay_period_start date NOT NULL,
    pay_period_end date NOT NULL,
    payment_date date,
    
    status atlas_payroll.payroll_status NOT NULL DEFAULT 'draft',
    
    -- Summary
    total_employees integer DEFAULT 0,
    total_gross numeric(14,2) DEFAULT 0,
    total_deductions numeric(14,2) DEFAULT 0,
    total_net numeric(14,2) DEFAULT 0,
    total_employer_contributions numeric(14,2) DEFAULT 0,
    
    -- Processing
    processed_by uuid REFERENCES auth.users(id),
    processed_at timestamptz,
    approved_by uuid REFERENCES auth.users(id),
    approved_at timestamptz,
    
    -- Error tracking
    errors jsonb DEFAULT '[]',
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, run_code)
);

-- 5.4 Payroll Items (Individual payslips)
CREATE TABLE atlas_payroll.pay_payroll_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    payroll_run_id uuid NOT NULL REFERENCES atlas_payroll.pay_payroll_runs(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id),
    
    -- Calculated amounts
    gross_salary numeric(12,2) NOT NULL,
    total_deductions numeric(12,2) NOT NULL,
    net_salary numeric(12,2) NOT NULL,
    
    -- Breakdown
    earnings jsonb NOT NULL DEFAULT '[]',
    deductions jsonb NOT NULL DEFAULT '[]',
    employer_contributions jsonb DEFAULT '[]',
    
    -- Days calculation
    working_days integer,
    days_present integer,
    days_absent integer,
    leave_days integer,
    
    -- LOP deduction
    lop_days integer DEFAULT 0,
    lop_amount numeric(12,2) DEFAULT 0,
    
    -- Reimbursements
    reimbursements jsonb DEFAULT '[]',
    
    -- Tax
    tds_amount numeric(12,2) DEFAULT 0,
    
    -- Status
    is_processed boolean DEFAULT false,
    is_paid boolean DEFAULT false,
    paid_at timestamptz,
    
    -- Payment details
    payment_mode text,
    payment_reference text,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PART 6: ATTENDANCE MODULE (atlas_attendance schema)
-- ============================================================================

-- 6.1 Attendance Records
CREATE TABLE atlas_attendance.att_attendance_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id) ON DELETE CASCADE,
    
    attendance_date date NOT NULL,
    
    -- Check-in/out
    check_in_time timestamptz,
    check_out_time timestamptz,
    
    -- Calculated fields
    total_hours numeric(4,2),
    overtime_hours numeric(4,2) DEFAULT 0,
    is_late boolean DEFAULT false,
    late_minutes integer DEFAULT 0,
    is_early_departure boolean DEFAULT false,
    
    -- Status
    status text DEFAULT 'present', -- present, absent, half_day, on_leave, holiday, weekend
    
    -- Location tracking
    check_in_location jsonb,
    check_out_location jsonb,
    
    -- Device info
    check_in_device text,
    check_out_device text,
    
    -- Regularization
    is_regularized boolean DEFAULT false,
    regularized_by uuid REFERENCES auth.users(id),
    regularization_reason text,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, employee_id, attendance_date)
);

-- 6.2 Leave Balances
CREATE TABLE atlas_attendance.att_leave_balances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id) ON DELETE CASCADE,
    
    leave_type atlas_attendance.leave_type NOT NULL,
    fiscal_year integer NOT NULL,
    
    opening_balance numeric(4,1) DEFAULT 0,
    accrued numeric(4,1) DEFAULT 0,
    used numeric(4,1) DEFAULT 0,
    adjusted numeric(4,1) DEFAULT 0,
    carried_forward numeric(4,1) DEFAULT 0,
    encashed numeric(4,1) DEFAULT 0,
    
    -- Calculated current balance
    current_balance numeric(4,1) GENERATED ALWAYS AS (
        opening_balance + accrued + adjusted + carried_forward - used - encashed
    ) STORED,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, employee_id, leave_type, fiscal_year)
);

-- 6.3 Leave Requests
CREATE TABLE atlas_attendance.att_leave_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id) ON DELETE CASCADE,
    
    leave_type atlas_attendance.leave_type NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_days numeric(4,1) NOT NULL,
    
    -- Half day handling
    is_half_day boolean DEFAULT false,
    half_day_type text, -- first_half, second_half
    
    reason text,
    
    status atlas_attendance.leave_status NOT NULL DEFAULT 'pending',
    
    -- Approval workflow
    approved_by uuid REFERENCES auth.users(id),
    approved_at timestamptz,
    rejection_reason text,
    
    -- Cancellation
    cancelled_at timestamptz,
    cancellation_reason text,
    
    -- Attachments
    attachments jsonb DEFAULT '[]',
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 6.4 Holidays
CREATE TABLE atlas_attendance.att_holidays (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    name text NOT NULL,
    holiday_date date NOT NULL,
    holiday_type text DEFAULT 'public', -- public, optional, restricted
    
    is_optional boolean DEFAULT false,
    applicable_locations jsonb DEFAULT '[]',
    applicable_departments jsonb DEFAULT '[]',
    
    description text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, holiday_date, name)
);

-- 6.5 Shift Definitions
CREATE TABLE atlas_attendance.att_shifts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    name text NOT NULL,
    code text NOT NULL,
    
    start_time time NOT NULL,
    end_time time NOT NULL,
    break_duration_minutes integer DEFAULT 60,
    
    grace_period_minutes integer DEFAULT 15,
    min_hours_for_half_day numeric(3,1) DEFAULT 4,
    min_hours_for_full_day numeric(3,1) DEFAULT 8,
    
    is_night_shift boolean DEFAULT false,
    is_flexible boolean DEFAULT false,
    
    is_active boolean DEFAULT true,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, code)
);

-- ============================================================================
-- PART 7: RECRUITMENT MODULE (atlas_recruitment schema)
-- ============================================================================

-- 7.1 Job Postings
CREATE TABLE atlas_recruitment.rec_job_postings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    job_code text NOT NULL,
    title text NOT NULL,
    description text,
    
    department_id uuid REFERENCES atlas_hr.hr_departments(id),
    designation_id uuid REFERENCES atlas_hr.hr_designations(id),
    
    employment_type atlas_hr.employment_type NOT NULL DEFAULT 'full_time',
    experience_min integer DEFAULT 0,
    experience_max integer,
    
    -- Compensation
    salary_min numeric(12,2),
    salary_max numeric(12,2),
    is_salary_visible boolean DEFAULT false,
    
    -- Location
    location text,
    is_remote boolean DEFAULT false,
    
    -- Requirements
    skills_required jsonb DEFAULT '[]',
    qualifications jsonb DEFAULT '[]',
    
    -- Posting details
    status atlas_recruitment.job_status NOT NULL DEFAULT 'draft',
    positions_count integer DEFAULT 1,
    positions_filled integer DEFAULT 0,
    
    posted_at timestamptz,
    expires_at timestamptz,
    
    -- Hiring manager
    hiring_manager_id uuid REFERENCES atlas_hr.hr_employees(id),
    
    -- External posting
    external_links jsonb DEFAULT '[]',
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, job_code)
);

-- 7.2 Candidates
CREATE TABLE atlas_recruitment.rec_candidates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    first_name text NOT NULL,
    last_name text,
    email text NOT NULL,
    phone text,
    
    -- Profile
    resume_url text,
    linkedin_url text,
    portfolio_url text,
    
    current_company text,
    current_designation text,
    experience_years numeric(3,1),
    current_ctc numeric(12,2),
    expected_ctc numeric(12,2),
    notice_period_days integer,
    
    skills jsonb DEFAULT '[]',
    education jsonb DEFAULT '[]',
    
    source text, -- direct, referral, job_portal, linkedin, etc.
    referred_by uuid REFERENCES atlas_hr.hr_employees(id),
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 7.3 Applications
CREATE TABLE atlas_recruitment.rec_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    job_id uuid NOT NULL REFERENCES atlas_recruitment.rec_job_postings(id) ON DELETE CASCADE,
    candidate_id uuid NOT NULL REFERENCES atlas_recruitment.rec_candidates(id) ON DELETE CASCADE,
    
    status atlas_recruitment.application_status NOT NULL DEFAULT 'applied',
    
    -- Screening
    screening_score integer,
    screening_notes text,
    
    -- Interview stages
    current_stage text,
    stages_completed jsonb DEFAULT '[]',
    
    -- Offer details
    offered_ctc numeric(12,2),
    offer_letter_url text,
    offer_accepted_at timestamptz,
    offer_rejected_at timestamptz,
    offer_rejection_reason text,
    
    -- Joining
    expected_joining_date date,
    actual_joining_date date,
    
    -- Rejection
    rejected_at timestamptz,
    rejection_reason text,
    rejection_stage text,
    
    -- Assignment
    assigned_recruiter_id uuid REFERENCES atlas_hr.hr_employees(id),
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, job_id, candidate_id)
);

-- 7.4 Interview Schedules
CREATE TABLE atlas_recruitment.rec_interviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    application_id uuid NOT NULL REFERENCES atlas_recruitment.rec_applications(id) ON DELETE CASCADE,
    
    round_number integer NOT NULL,
    round_type text NOT NULL, -- phone_screen, technical, hr, managerial, cultural
    
    scheduled_at timestamptz NOT NULL,
    duration_minutes integer DEFAULT 60,
    
    -- Interviewers
    interviewers jsonb NOT NULL DEFAULT '[]',
    
    -- Meeting details
    meeting_link text,
    location text,
    
    -- Status
    status text DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
    
    -- Feedback
    feedback jsonb DEFAULT '{}',
    overall_rating integer, -- 1-5
    recommendation text, -- strong_hire, hire, no_hire, strong_no_hire
    
    completed_at timestamptz,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PART 8: PROJECTS MODULE (atlas_projects schema)
-- ============================================================================

-- 8.1 Projects
CREATE TABLE atlas_projects.proj_projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    project_code text NOT NULL,
    name text NOT NULL,
    description text,
    
    status atlas_projects.project_status NOT NULL DEFAULT 'planning',
    
    -- Timeline
    start_date date,
    target_end_date date,
    actual_end_date date,
    
    -- Progress
    progress_percentage integer DEFAULT 0,
    
    -- Budget
    budget numeric(14,2),
    spent numeric(14,2) DEFAULT 0,
    
    -- Team
    project_manager_id uuid REFERENCES atlas_hr.hr_employees(id),
    team_members jsonb DEFAULT '[]',
    
    -- Client (if external project)
    is_internal boolean DEFAULT true,
    client_name text,
    client_contact jsonb DEFAULT '{}',
    
    -- Settings
    settings jsonb DEFAULT '{}',
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, project_code)
);

-- 8.2 Project Tasks
CREATE TABLE atlas_projects.proj_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    project_id uuid NOT NULL REFERENCES atlas_projects.proj_projects(id) ON DELETE CASCADE,
    
    task_code text NOT NULL,
    title text NOT NULL,
    description text,
    
    status atlas_projects.task_status NOT NULL DEFAULT 'backlog',
    priority atlas_projects.task_priority NOT NULL DEFAULT 'medium',
    
    -- Assignment
    assignee_id uuid REFERENCES atlas_hr.hr_employees(id),
    reporter_id uuid REFERENCES atlas_hr.hr_employees(id),
    
    -- Timeline
    start_date date,
    due_date date,
    completed_at timestamptz,
    
    -- Estimation
    estimated_hours numeric(6,2),
    actual_hours numeric(6,2),
    
    -- Hierarchy
    parent_task_id uuid REFERENCES atlas_projects.proj_tasks(id),
    
    -- Labels and categories
    labels jsonb DEFAULT '[]',
    sprint text,
    
    -- Attachments
    attachments jsonb DEFAULT '[]',
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, task_code)
);

-- 8.3 Task Comments
CREATE TABLE atlas_projects.proj_task_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    task_id uuid NOT NULL REFERENCES atlas_projects.proj_tasks(id) ON DELETE CASCADE,
    
    author_id uuid NOT NULL REFERENCES auth.users(id),
    content text NOT NULL,
    
    -- Mentions
    mentions jsonb DEFAULT '[]',
    
    -- Attachments
    attachments jsonb DEFAULT '[]',
    
    -- Edit tracking
    is_edited boolean DEFAULT false,
    edited_at timestamptz,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 8.4 Time Entries
CREATE TABLE atlas_projects.proj_time_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    task_id uuid REFERENCES atlas_projects.proj_tasks(id) ON DELETE SET NULL,
    project_id uuid NOT NULL REFERENCES atlas_projects.proj_projects(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id),
    
    entry_date date NOT NULL,
    hours numeric(4,2) NOT NULL,
    description text,
    
    -- Billing
    is_billable boolean DEFAULT true,
    billing_rate numeric(10,2),
    
    -- Approval
    is_approved boolean DEFAULT false,
    approved_by uuid REFERENCES auth.users(id),
    approved_at timestamptz,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PART 9: AUTOMATION MODULE (atlas_automation schema)
-- ============================================================================

-- 9.1 Workflow Definitions
CREATE TABLE atlas_automation.auto_workflows (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    name text NOT NULL,
    description text,
    category text, -- hr, payroll, recruitment, compliance, etc.
    
    status atlas_automation.workflow_status NOT NULL DEFAULT 'draft',
    
    -- Trigger configuration
    trigger_type text NOT NULL, -- manual, scheduled, event, webhook
    trigger_config jsonb NOT NULL DEFAULT '{}',
    
    -- Workflow steps
    steps jsonb NOT NULL DEFAULT '[]',
    
    -- Version control
    version integer DEFAULT 1,
    published_at timestamptz,
    published_by uuid REFERENCES auth.users(id),
    
    -- Stats
    total_runs integer DEFAULT 0,
    successful_runs integer DEFAULT 0,
    failed_runs integer DEFAULT 0,
    
    -- Is this a template
    is_template boolean DEFAULT false,
    template_source_id uuid REFERENCES atlas_automation.auto_workflows(id),
    
    metadata jsonb DEFAULT '{}',
    
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, name, version)
);

-- 9.2 Workflow Executions
CREATE TABLE atlas_automation.auto_executions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    workflow_id uuid NOT NULL REFERENCES atlas_automation.auto_workflows(id) ON DELETE CASCADE,
    
    execution_number integer NOT NULL,
    
    status atlas_automation.execution_status NOT NULL DEFAULT 'pending',
    
    -- Trigger info
    triggered_by uuid REFERENCES auth.users(id),
    trigger_type text,
    trigger_data jsonb DEFAULT '{}',
    
    -- Input/Output
    input_data jsonb DEFAULT '{}',
    output_data jsonb DEFAULT '{}',
    
    -- Timing
    started_at timestamptz,
    completed_at timestamptz,
    duration_ms integer,
    
    -- Step tracking
    current_step integer DEFAULT 0,
    steps_completed jsonb DEFAULT '[]',
    
    -- Error handling
    error_message text,
    error_step integer,
    retry_count integer DEFAULT 0,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now()
);

-- 9.3 Workflow Templates (Global templates)
CREATE TABLE atlas_automation.auto_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name text NOT NULL,
    description text,
    category text NOT NULL,
    
    -- Template definition
    trigger_type text NOT NULL,
    trigger_config jsonb NOT NULL DEFAULT '{}',
    steps jsonb NOT NULL DEFAULT '[]',
    
    -- Customizable variables
    variables jsonb DEFAULT '[]',
    
    -- Stats
    usage_count integer DEFAULT 0,
    
    is_active boolean DEFAULT true,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PART 10: BGV MODULE (atlas_bgv schema)
-- ============================================================================

-- 10.1 BGV Requests
CREATE TABLE atlas_bgv.bgv_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id),
    
    request_code text NOT NULL,
    
    -- Verification types requested
    verification_types jsonb NOT NULL DEFAULT '[]',
    
    status atlas_bgv.verification_status NOT NULL DEFAULT 'pending',
    
    -- Provider
    provider text,
    provider_reference text,
    
    -- Timeline
    initiated_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    
    -- Cost
    estimated_cost numeric(10,2),
    actual_cost numeric(10,2),
    
    -- Initiator
    initiated_by uuid REFERENCES auth.users(id),
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, request_code)
);

-- 10.2 BGV Verification Items
CREATE TABLE atlas_bgv.bgv_verification_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    request_id uuid NOT NULL REFERENCES atlas_bgv.bgv_requests(id) ON DELETE CASCADE,
    
    verification_type atlas_bgv.verification_type NOT NULL,
    
    status atlas_bgv.verification_status NOT NULL DEFAULT 'pending',
    
    -- Input data for verification
    input_data jsonb NOT NULL DEFAULT '{}',
    
    -- Verification result
    result_data jsonb DEFAULT '{}',
    is_verified boolean,
    discrepancies jsonb DEFAULT '[]',
    
    -- Provider details
    provider_status text,
    provider_report_url text,
    
    -- Timeline
    started_at timestamptz,
    completed_at timestamptz,
    
    -- Notes
    notes text,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PART 11: INSURANCE MODULE (atlas_insurance schema)
-- ============================================================================

-- 11.1 Insurance Policies (Company policies)
CREATE TABLE atlas_insurance.ins_policies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    policy_number text NOT NULL,
    policy_type atlas_insurance.policy_type NOT NULL,
    
    provider text NOT NULL,
    provider_contact jsonb DEFAULT '{}',
    
    -- Coverage
    sum_insured numeric(14,2),
    premium_amount numeric(12,2),
    premium_frequency text DEFAULT 'annual',
    
    -- Validity
    start_date date NOT NULL,
    end_date date NOT NULL,
    
    -- Coverage details
    coverage_details jsonb DEFAULT '{}',
    exclusions jsonb DEFAULT '[]',
    
    -- Documents
    policy_document_url text,
    
    is_active boolean DEFAULT true,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, policy_number)
);

-- 11.2 Employee Enrollments
CREATE TABLE atlas_insurance.ins_enrollments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    policy_id uuid NOT NULL REFERENCES atlas_insurance.ins_policies(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id) ON DELETE CASCADE,
    
    enrollment_date date NOT NULL,
    
    -- Coverage
    sum_insured numeric(14,2),
    premium_share_employee numeric(12,2) DEFAULT 0,
    premium_share_employer numeric(12,2) DEFAULT 0,
    
    -- Dependents
    dependents jsonb DEFAULT '[]',
    
    -- Nominee
    nominees jsonb DEFAULT '[]',
    
    -- Status
    is_active boolean DEFAULT true,
    terminated_at date,
    termination_reason text,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, policy_id, employee_id)
);

-- 11.3 Insurance Claims
CREATE TABLE atlas_insurance.ins_claims (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    enrollment_id uuid NOT NULL REFERENCES atlas_insurance.ins_enrollments(id),
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id),
    
    claim_number text NOT NULL,
    
    -- Claim details
    claim_type text NOT NULL,
    claim_amount numeric(12,2) NOT NULL,
    approved_amount numeric(12,2),
    
    -- Claimant (employee or dependent)
    claimant_type text DEFAULT 'self', -- self, dependent
    claimant_name text,
    claimant_relation text,
    
    -- Incident
    incident_date date NOT NULL,
    incident_description text,
    
    -- Hospital/Provider
    hospital_name text,
    hospital_location text,
    
    -- Status
    status atlas_insurance.claim_status NOT NULL DEFAULT 'submitted',
    
    -- Documents
    documents jsonb DEFAULT '[]',
    
    -- Processing
    submitted_at timestamptz DEFAULT now(),
    reviewed_at timestamptz,
    reviewed_by uuid REFERENCES auth.users(id),
    settled_at timestamptz,
    
    -- Rejection
    rejection_reason text,
    
    -- Payment
    payment_reference text,
    payment_date date,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, claim_number)
);

-- ============================================================================
-- PART 12: PERFORMANCE MODULE (atlas_performance schema)
-- ============================================================================

-- 12.1 Review Cycles
CREATE TABLE atlas_performance.perf_review_cycles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    name text NOT NULL,
    description text,
    
    cycle_type text NOT NULL, -- annual, semi_annual, quarterly
    
    -- Timeline
    start_date date NOT NULL,
    end_date date NOT NULL,
    
    -- Phases
    self_review_start date,
    self_review_end date,
    manager_review_start date,
    manager_review_end date,
    calibration_start date,
    calibration_end date,
    
    -- Status
    status text DEFAULT 'draft', -- draft, active, calibration, completed
    
    -- Rating scale
    rating_scale jsonb DEFAULT '[
        {"value": 1, "label": "Needs Improvement"},
        {"value": 2, "label": "Meets Expectations"},
        {"value": 3, "label": "Exceeds Expectations"},
        {"value": 4, "label": "Outstanding"}
    ]',
    
    -- Template
    review_template jsonb DEFAULT '[]',
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 12.2 Performance Reviews
CREATE TABLE atlas_performance.perf_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    cycle_id uuid NOT NULL REFERENCES atlas_performance.perf_review_cycles(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id) ON DELETE CASCADE,
    
    status atlas_performance.review_status NOT NULL DEFAULT 'draft',
    
    -- Reviewers
    manager_id uuid REFERENCES atlas_hr.hr_employees(id),
    
    -- Self Review
    self_review jsonb DEFAULT '{}',
    self_review_submitted_at timestamptz,
    
    -- Manager Review
    manager_review jsonb DEFAULT '{}',
    manager_review_submitted_at timestamptz,
    
    -- Final Ratings
    overall_rating numeric(3,2),
    final_rating numeric(3,2), -- After calibration
    
    -- Feedback
    strengths text,
    areas_of_improvement text,
    manager_comments text,
    employee_comments text,
    
    -- Goals
    goals_achieved integer,
    goals_total integer,
    
    -- Calibration
    is_calibrated boolean DEFAULT false,
    calibration_notes text,
    
    -- Acknowledgment
    acknowledged_by_employee boolean DEFAULT false,
    acknowledged_at timestamptz,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, cycle_id, employee_id)
);

-- 12.3 Goals/OKRs
CREATE TABLE atlas_performance.perf_goals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id) ON DELETE CASCADE,
    
    title text NOT NULL,
    description text,
    
    goal_type text DEFAULT 'individual', -- individual, team, department, company
    category text, -- business, development, project
    
    -- Timeline
    start_date date,
    target_date date,
    
    -- Measurement
    metric_type text, -- percentage, number, boolean, milestone
    target_value numeric(12,2),
    current_value numeric(12,2) DEFAULT 0,
    
    -- Status
    status atlas_performance.goal_status NOT NULL DEFAULT 'not_started',
    progress_percentage integer DEFAULT 0,
    
    -- Weightage for performance
    weightage numeric(5,2) DEFAULT 0,
    
    -- Linked to review
    review_id uuid REFERENCES atlas_performance.perf_reviews(id),
    
    -- Parent goal (for cascading)
    parent_goal_id uuid REFERENCES atlas_performance.perf_goals(id),
    
    -- Key Results (for OKRs)
    key_results jsonb DEFAULT '[]',
    
    -- Check-ins
    last_checkin_at timestamptz,
    checkin_frequency text DEFAULT 'weekly',
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PART 13: COMPLIANCE MODULE (atlas_compliance schema)
-- ============================================================================

-- 13.1 Compliance Requirements
CREATE TABLE atlas_compliance.comp_requirements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    name text NOT NULL,
    description text,
    
    category text NOT NULL, -- statutory, tax, labor_law, industry_specific
    subcategory text,
    
    -- Applicability
    is_mandatory boolean DEFAULT true,
    applicable_states jsonb DEFAULT '[]',
    applicable_employee_count_min integer,
    applicable_employee_count_max integer,
    
    -- Frequency
    frequency text NOT NULL, -- monthly, quarterly, annual, one_time
    due_day integer, -- Day of month
    due_month integer, -- Month of year (for annual)
    
    -- Authority
    authority_name text,
    authority_portal_url text,
    
    -- Documents
    required_documents jsonb DEFAULT '[]',
    form_templates jsonb DEFAULT '[]',
    
    -- Penalties
    penalty_info text,
    
    is_active boolean DEFAULT true,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 13.2 Compliance Tasks
CREATE TABLE atlas_compliance.comp_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    requirement_id uuid REFERENCES atlas_compliance.comp_requirements(id),
    
    title text NOT NULL,
    description text,
    
    status atlas_compliance.compliance_status NOT NULL DEFAULT 'pending',
    
    -- Period
    compliance_period text, -- e.g., "2024-Q1", "2024-04"
    
    -- Due date
    due_date date NOT NULL,
    completed_at timestamptz,
    
    -- Assignment
    assigned_to uuid REFERENCES atlas_hr.hr_employees(id),
    
    -- Submission
    submission_reference text,
    submission_date date,
    acknowledgment_number text,
    
    -- Documents
    documents jsonb DEFAULT '[]',
    
    -- Notes
    notes text,
    
    -- Reminder
    reminder_sent_at timestamptz,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PART 14: ASSETS MODULE (atlas_assets schema)
-- ============================================================================

-- 14.1 Asset Categories
CREATE TABLE atlas_assets.asset_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    name text NOT NULL,
    code text NOT NULL,
    description text,
    
    parent_id uuid REFERENCES atlas_assets.asset_categories(id),
    
    -- Depreciation settings
    depreciation_method text, -- straight_line, declining_balance
    useful_life_years integer,
    salvage_value_percentage numeric(5,2),
    
    is_active boolean DEFAULT true,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, code)
);

-- 14.2 Assets
CREATE TABLE atlas_assets.assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    category_id uuid REFERENCES atlas_assets.asset_categories(id),
    
    asset_code text NOT NULL,
    name text NOT NULL,
    description text,
    
    -- Details
    brand text,
    model text,
    serial_number text,
    
    -- Purchase
    purchase_date date,
    purchase_price numeric(12,2),
    vendor text,
    invoice_number text,
    
    -- Warranty
    warranty_start_date date,
    warranty_end_date date,
    warranty_details text,
    
    -- Assignment
    status atlas_assets.asset_status NOT NULL DEFAULT 'available',
    assigned_to uuid REFERENCES atlas_hr.hr_employees(id),
    assigned_at timestamptz,
    location text,
    
    -- Tracking
    qr_code text,
    rfid_tag text,
    
    -- Condition
    condition text DEFAULT 'good', -- excellent, good, fair, poor
    last_maintenance_date date,
    next_maintenance_date date,
    
    -- Depreciation
    current_value numeric(12,2),
    
    -- Disposal
    disposed_at date,
    disposal_method text,
    disposal_value numeric(12,2),
    disposal_notes text,
    
    -- Documents
    documents jsonb DEFAULT '[]',
    images jsonb DEFAULT '[]',
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, asset_code)
);

-- 14.3 Asset Assignments History
CREATE TABLE atlas_assets.asset_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    asset_id uuid NOT NULL REFERENCES atlas_assets.assets(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id),
    
    assigned_at timestamptz NOT NULL DEFAULT now(),
    returned_at timestamptz,
    
    assigned_by uuid REFERENCES auth.users(id),
    returned_to uuid REFERENCES auth.users(id),
    
    condition_at_assignment text,
    condition_at_return text,
    
    notes text,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PART 15: FINANCE MODULE (atlas_finance schema)
-- ============================================================================

-- 15.1 Expense Categories
CREATE TABLE atlas_finance.fin_expense_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    name text NOT NULL,
    code text NOT NULL,
    description text,
    
    parent_id uuid REFERENCES atlas_finance.fin_expense_categories(id),
    
    -- Limits
    max_amount numeric(12,2),
    requires_approval_above numeric(12,2),
    
    -- GL mapping
    gl_account_code text,
    
    is_active boolean DEFAULT true,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, code)
);

-- 15.2 Expense Claims
CREATE TABLE atlas_finance.fin_expense_claims (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES atlas_hr.hr_employees(id) ON DELETE CASCADE,
    
    claim_number text NOT NULL,
    title text NOT NULL,
    
    -- Amount
    total_amount numeric(12,2) NOT NULL,
    approved_amount numeric(12,2),
    currency text DEFAULT 'INR',
    
    -- Status
    status text NOT NULL DEFAULT 'draft', -- draft, submitted, approved, rejected, paid
    
    -- Line items
    items jsonb NOT NULL DEFAULT '[]',
    
    -- Approval
    submitted_at timestamptz,
    approved_by uuid REFERENCES auth.users(id),
    approved_at timestamptz,
    rejection_reason text,
    
    -- Payment
    paid_at timestamptz,
    payment_reference text,
    
    -- Attachments
    receipts jsonb DEFAULT '[]',
    
    notes text,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, claim_number)
);

-- 15.3 Invoices (Client billing)
CREATE TABLE atlas_finance.fin_invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES atlas_core.core_tenants(id) ON DELETE CASCADE,
    
    invoice_number text NOT NULL,
    
    -- Client
    client_name text NOT NULL,
    client_email text,
    client_address jsonb DEFAULT '{}',
    client_gstin text,
    
    -- Invoice details
    invoice_date date NOT NULL,
    due_date date,
    
    -- Amounts
    subtotal numeric(14,2) NOT NULL,
    discount_amount numeric(14,2) DEFAULT 0,
    tax_amount numeric(14,2) DEFAULT 0,
    total_amount numeric(14,2) NOT NULL,
    
    -- Tax details
    tax_breakdown jsonb DEFAULT '[]',
    
    -- Line items
    items jsonb NOT NULL DEFAULT '[]',
    
    -- Status
    status text NOT NULL DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
    
    -- Payment
    paid_amount numeric(14,2) DEFAULT 0,
    paid_at timestamptz,
    payment_method text,
    payment_reference text,
    
    -- Document
    pdf_url text,
    
    -- Notes
    notes text,
    terms text,
    
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(tenant_id, invoice_number)
);

-- ============================================================================
-- PART 16: SECURITY DEFINER FUNCTIONS
-- ============================================================================

-- 16.1 Get user's tenant IDs
CREATE OR REPLACE FUNCTION atlas_core.get_user_tenant_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = atlas_core
AS $$
    SELECT tenant_id 
    FROM atlas_core.core_tenant_memberships 
    WHERE user_id = _user_id 
    AND status = 'active'
$$;

-- 16.2 Check if user has specific tenant role
CREATE OR REPLACE FUNCTION atlas_core.has_tenant_role(
    _user_id uuid, 
    _tenant_id uuid, 
    _role atlas_core.tenant_role
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = atlas_core
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM atlas_core.core_tenant_memberships
        WHERE user_id = _user_id
        AND tenant_id = _tenant_id
        AND role = _role
        AND status = 'active'
    )
$$;

-- 16.3 Check if user has any of specified roles in tenant
CREATE OR REPLACE FUNCTION atlas_core.has_any_tenant_role(
    _user_id uuid, 
    _tenant_id uuid, 
    _roles atlas_core.tenant_role[]
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = atlas_core
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM atlas_core.core_tenant_memberships
        WHERE user_id = _user_id
        AND tenant_id = _tenant_id
        AND role = ANY(_roles)
        AND status = 'active'
    )
$$;

-- 16.4 Check if user is tenant admin
CREATE OR REPLACE FUNCTION atlas_core.is_tenant_admin(_user_id uuid, _tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = atlas_core
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM atlas_core.core_tenant_memberships
        WHERE user_id = _user_id
        AND tenant_id = _tenant_id
        AND role IN ('super_admin', 'admin')
        AND status = 'active'
    )
$$;

-- 16.5 Check if user is platform admin
CREATE OR REPLACE FUNCTION atlas_core.is_platform_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = atlas_core
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM atlas_core.core_profiles
        WHERE id = _user_id
        AND platform_role = 'platform_admin'
    )
$$;

-- 16.6 Get user's role in a tenant
CREATE OR REPLACE FUNCTION atlas_core.get_user_tenant_role(_user_id uuid, _tenant_id uuid)
RETURNS atlas_core.tenant_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = atlas_core
AS $$
    SELECT role 
    FROM atlas_core.core_tenant_memberships 
    WHERE user_id = _user_id 
    AND tenant_id = _tenant_id 
    AND status = 'active'
    LIMIT 1
$$;

-- 16.7 Check if user belongs to tenant
CREATE OR REPLACE FUNCTION atlas_core.is_tenant_member(_user_id uuid, _tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = atlas_core
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM atlas_core.core_tenant_memberships
        WHERE user_id = _user_id
        AND tenant_id = _tenant_id
        AND status = 'active'
    )
$$;

-- 16.8 Get employee ID for user in tenant
CREATE OR REPLACE FUNCTION atlas_core.get_user_employee_id(_user_id uuid, _tenant_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = atlas_core
AS $$
    SELECT employee_id 
    FROM atlas_core.core_tenant_memberships 
    WHERE user_id = _user_id 
    AND tenant_id = _tenant_id 
    AND status = 'active'
    LIMIT 1
$$;

-- ============================================================================
-- PART 17: ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE atlas_core.core_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_core.core_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_core.core_tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_core.core_tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_core.core_audit_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE atlas_hr.hr_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_hr.hr_designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_hr.hr_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_hr.hr_employee_documents ENABLE ROW LEVEL SECURITY;

ALTER TABLE atlas_payroll.pay_salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_payroll.pay_employee_salary ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_payroll.pay_payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_payroll.pay_payroll_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE atlas_attendance.att_attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_attendance.att_leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_attendance.att_leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_attendance.att_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_attendance.att_shifts ENABLE ROW LEVEL SECURITY;

ALTER TABLE atlas_recruitment.rec_job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_recruitment.rec_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_recruitment.rec_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_recruitment.rec_interviews ENABLE ROW LEVEL SECURITY;

ALTER TABLE atlas_projects.proj_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_projects.proj_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_projects.proj_task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_projects.proj_time_entries ENABLE ROW LEVEL SECURITY;

ALTER TABLE atlas_automation.auto_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_automation.auto_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_automation.auto_templates ENABLE ROW LEVEL SECURITY;

ALTER TABLE atlas_bgv.bgv_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_bgv.bgv_verification_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE atlas_insurance.ins_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_insurance.ins_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_insurance.ins_claims ENABLE ROW LEVEL SECURITY;

ALTER TABLE atlas_performance.perf_review_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_performance.perf_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_performance.perf_goals ENABLE ROW LEVEL SECURITY;

ALTER TABLE atlas_compliance.comp_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_compliance.comp_tasks ENABLE ROW LEVEL SECURITY;

ALTER TABLE atlas_assets.asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_assets.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_assets.asset_assignments ENABLE ROW LEVEL SECURITY;

ALTER TABLE atlas_finance.fin_expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_finance.fin_expense_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_finance.fin_invoices ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: CORE SCHEMA
-- ============================================================================

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile"
    ON atlas_core.core_profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON atlas_core.core_profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Platform admins can view all profiles"
    ON atlas_core.core_profiles FOR SELECT
    TO authenticated
    USING (atlas_core.is_platform_admin(auth.uid()));

-- Tenants: Users can view tenants they belong to
CREATE POLICY "Users can view own tenants"
    ON atlas_core.core_tenants FOR SELECT
    TO authenticated
    USING (id IN (SELECT atlas_core.get_user_tenant_ids(auth.uid())));

CREATE POLICY "Tenant admins can update tenant"
    ON atlas_core.core_tenants FOR UPDATE
    TO authenticated
    USING (atlas_core.is_tenant_admin(auth.uid(), id));

CREATE POLICY "Platform admins can manage all tenants"
    ON atlas_core.core_tenants FOR ALL
    TO authenticated
    USING (atlas_core.is_platform_admin(auth.uid()));

-- Memberships: Users can view their own memberships
CREATE POLICY "Users can view own memberships"
    ON atlas_core.core_tenant_memberships FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Tenant admins can view all memberships"
    ON atlas_core.core_tenant_memberships FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_admin(auth.uid(), tenant_id));

CREATE POLICY "Tenant admins can manage memberships"
    ON atlas_core.core_tenant_memberships FOR ALL
    TO authenticated
    USING (atlas_core.is_tenant_admin(auth.uid(), tenant_id));

-- Tenant Settings: Only tenant admins can access
CREATE POLICY "Tenant admins can view settings"
    ON atlas_core.core_tenant_settings FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_admin(auth.uid(), tenant_id));

CREATE POLICY "Tenant admins can update settings"
    ON atlas_core.core_tenant_settings FOR UPDATE
    TO authenticated
    USING (atlas_core.is_tenant_admin(auth.uid(), tenant_id));

-- Audit Logs: Tenant admins can view, platform admins can view all
CREATE POLICY "Tenant admins can view tenant audit logs"
    ON atlas_core.core_audit_logs FOR SELECT
    TO authenticated
    USING (
        atlas_core.is_tenant_admin(auth.uid(), tenant_id)
        OR atlas_core.is_platform_admin(auth.uid())
    );

CREATE POLICY "Authenticated users can insert audit logs"
    ON atlas_core.core_audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ============================================================================
-- RLS POLICIES: HR SCHEMA
-- ============================================================================

-- Departments
CREATE POLICY "Tenant members can view departments"
    ON atlas_hr.hr_departments FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "HR admins can manage departments"
    ON atlas_hr.hr_departments FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- Designations
CREATE POLICY "Tenant members can view designations"
    ON atlas_hr.hr_designations FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "HR admins can manage designations"
    ON atlas_hr.hr_designations FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- Employees
CREATE POLICY "Employees can view own record"
    ON atlas_hr.hr_employees FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Tenant members can view basic employee info"
    ON atlas_hr.hr_employees FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "HR admins can manage employees"
    ON atlas_hr.hr_employees FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- Employee Documents
CREATE POLICY "Employees can view own documents"
    ON atlas_hr.hr_employee_documents FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "HR admins can manage employee documents"
    ON atlas_hr.hr_employee_documents FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- ============================================================================
-- RLS POLICIES: PAYROLL SCHEMA
-- ============================================================================

-- Salary Components
CREATE POLICY "Finance admins can manage salary components"
    ON atlas_payroll.pay_salary_components FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'finance_admin']::atlas_core.tenant_role[]
    ));

-- Employee Salary
CREATE POLICY "Employees can view own salary"
    ON atlas_payroll.pay_employee_salary FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Finance admins can manage salaries"
    ON atlas_payroll.pay_employee_salary FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'finance_admin']::atlas_core.tenant_role[]
    ));

-- Payroll Runs
CREATE POLICY "Finance admins can manage payroll runs"
    ON atlas_payroll.pay_payroll_runs FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'finance_admin']::atlas_core.tenant_role[]
    ));

-- Payroll Items (Payslips)
CREATE POLICY "Employees can view own payslips"
    ON atlas_payroll.pay_payroll_items FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Finance admins can manage payroll items"
    ON atlas_payroll.pay_payroll_items FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'finance_admin']::atlas_core.tenant_role[]
    ));

-- ============================================================================
-- RLS POLICIES: ATTENDANCE SCHEMA
-- ============================================================================

-- Attendance Records
CREATE POLICY "Employees can view own attendance"
    ON atlas_attendance.att_attendance_records FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Employees can mark own attendance"
    ON atlas_attendance.att_attendance_records FOR INSERT
    TO authenticated
    WITH CHECK (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "HR admins can manage attendance"
    ON atlas_attendance.att_attendance_records FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- Leave Balances
CREATE POLICY "Employees can view own leave balances"
    ON atlas_attendance.att_leave_balances FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "HR admins can manage leave balances"
    ON atlas_attendance.att_leave_balances FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- Leave Requests
CREATE POLICY "Employees can view own leave requests"
    ON atlas_attendance.att_leave_requests FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Employees can create leave requests"
    ON atlas_attendance.att_leave_requests FOR INSERT
    TO authenticated
    WITH CHECK (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Managers can view team leave requests"
    ON atlas_attendance.att_leave_requests FOR SELECT
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin', 'manager']::atlas_core.tenant_role[]
    ));

CREATE POLICY "Managers can approve leave requests"
    ON atlas_attendance.att_leave_requests FOR UPDATE
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin', 'manager']::atlas_core.tenant_role[]
    ));

-- Holidays
CREATE POLICY "Tenant members can view holidays"
    ON atlas_attendance.att_holidays FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "HR admins can manage holidays"
    ON atlas_attendance.att_holidays FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- Shifts
CREATE POLICY "Tenant members can view shifts"
    ON atlas_attendance.att_shifts FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "HR admins can manage shifts"
    ON atlas_attendance.att_shifts FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- ============================================================================
-- RLS POLICIES: RECRUITMENT SCHEMA
-- ============================================================================

-- Job Postings
CREATE POLICY "Tenant members can view job postings"
    ON atlas_recruitment.rec_job_postings FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "HR admins can manage job postings"
    ON atlas_recruitment.rec_job_postings FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- Candidates
CREATE POLICY "Recruiters can view candidates"
    ON atlas_recruitment.rec_candidates FOR SELECT
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin', 'manager']::atlas_core.tenant_role[]
    ));

CREATE POLICY "HR admins can manage candidates"
    ON atlas_recruitment.rec_candidates FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- Applications
CREATE POLICY "Recruiters can manage applications"
    ON atlas_recruitment.rec_applications FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin', 'manager']::atlas_core.tenant_role[]
    ));

-- Interviews
CREATE POLICY "Interviewers can view interviews"
    ON atlas_recruitment.rec_interviews FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "HR admins can manage interviews"
    ON atlas_recruitment.rec_interviews FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- ============================================================================
-- RLS POLICIES: PROJECTS SCHEMA
-- ============================================================================

-- Projects
CREATE POLICY "Tenant members can view projects"
    ON atlas_projects.proj_projects FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "Managers can manage projects"
    ON atlas_projects.proj_projects FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'manager']::atlas_core.tenant_role[]
    ));

-- Tasks
CREATE POLICY "Tenant members can view tasks"
    ON atlas_projects.proj_tasks FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "Tenant members can manage tasks"
    ON atlas_projects.proj_tasks FOR ALL
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

-- Task Comments
CREATE POLICY "Tenant members can view comments"
    ON atlas_projects.proj_task_comments FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "Tenant members can create comments"
    ON atlas_projects.proj_task_comments FOR INSERT
    TO authenticated
    WITH CHECK (atlas_core.is_tenant_member(auth.uid(), tenant_id) AND author_id = auth.uid());

-- Time Entries
CREATE POLICY "Employees can view own time entries"
    ON atlas_projects.proj_time_entries FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Employees can log time"
    ON atlas_projects.proj_time_entries FOR INSERT
    TO authenticated
    WITH CHECK (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Managers can manage time entries"
    ON atlas_projects.proj_time_entries FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'manager']::atlas_core.tenant_role[]
    ));

-- ============================================================================
-- RLS POLICIES: AUTOMATION SCHEMA
-- ============================================================================

-- Workflows
CREATE POLICY "Tenant admins can manage workflows"
    ON atlas_automation.auto_workflows FOR ALL
    TO authenticated
    USING (atlas_core.is_tenant_admin(auth.uid(), tenant_id));

-- Executions
CREATE POLICY "Tenant admins can view executions"
    ON atlas_automation.auto_executions FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_admin(auth.uid(), tenant_id));

-- Templates (Global - no tenant_id)
CREATE POLICY "Anyone can view active templates"
    ON atlas_automation.auto_templates FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "Platform admins can manage templates"
    ON atlas_automation.auto_templates FOR ALL
    TO authenticated
    USING (atlas_core.is_platform_admin(auth.uid()));

-- ============================================================================
-- RLS POLICIES: BGV SCHEMA
-- ============================================================================

-- BGV Requests
CREATE POLICY "HR admins can manage BGV requests"
    ON atlas_bgv.bgv_requests FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- Verification Items
CREATE POLICY "HR admins can manage verification items"
    ON atlas_bgv.bgv_verification_items FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- ============================================================================
-- RLS POLICIES: INSURANCE SCHEMA
-- ============================================================================

-- Policies
CREATE POLICY "HR admins can manage insurance policies"
    ON atlas_insurance.ins_policies FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

CREATE POLICY "Employees can view policies"
    ON atlas_insurance.ins_policies FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

-- Enrollments
CREATE POLICY "Employees can view own enrollments"
    ON atlas_insurance.ins_enrollments FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "HR admins can manage enrollments"
    ON atlas_insurance.ins_enrollments FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- Claims
CREATE POLICY "Employees can view own claims"
    ON atlas_insurance.ins_claims FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Employees can submit claims"
    ON atlas_insurance.ins_claims FOR INSERT
    TO authenticated
    WITH CHECK (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "HR admins can manage claims"
    ON atlas_insurance.ins_claims FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- ============================================================================
-- RLS POLICIES: PERFORMANCE SCHEMA
-- ============================================================================

-- Review Cycles
CREATE POLICY "Tenant members can view review cycles"
    ON atlas_performance.perf_review_cycles FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "HR admins can manage review cycles"
    ON atlas_performance.perf_review_cycles FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin']::atlas_core.tenant_role[]
    ));

-- Reviews
CREATE POLICY "Employees can view own reviews"
    ON atlas_performance.perf_reviews FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Employees can update own self review"
    ON atlas_performance.perf_reviews FOR UPDATE
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Managers can manage team reviews"
    ON atlas_performance.perf_reviews FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin', 'manager']::atlas_core.tenant_role[]
    ));

-- Goals
CREATE POLICY "Employees can view own goals"
    ON atlas_performance.perf_goals FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Employees can manage own goals"
    ON atlas_performance.perf_goals FOR ALL
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Managers can view team goals"
    ON atlas_performance.perf_goals FOR SELECT
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'hr_admin', 'manager']::atlas_core.tenant_role[]
    ));

-- ============================================================================
-- RLS POLICIES: COMPLIANCE SCHEMA
-- ============================================================================

-- Requirements
CREATE POLICY "Tenant members can view requirements"
    ON atlas_compliance.comp_requirements FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "Admins can manage requirements"
    ON atlas_compliance.comp_requirements FOR ALL
    TO authenticated
    USING (atlas_core.is_tenant_admin(auth.uid(), tenant_id));

-- Tasks
CREATE POLICY "Assigned users can view tasks"
    ON atlas_compliance.comp_tasks FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "Admins can manage tasks"
    ON atlas_compliance.comp_tasks FOR ALL
    TO authenticated
    USING (atlas_core.is_tenant_admin(auth.uid(), tenant_id));

-- ============================================================================
-- RLS POLICIES: ASSETS SCHEMA
-- ============================================================================

-- Categories
CREATE POLICY "Tenant members can view categories"
    ON atlas_assets.asset_categories FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "Admins can manage categories"
    ON atlas_assets.asset_categories FOR ALL
    TO authenticated
    USING (atlas_core.is_tenant_admin(auth.uid(), tenant_id));

-- Assets
CREATE POLICY "Tenant members can view assets"
    ON atlas_assets.assets FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "Admins can manage assets"
    ON atlas_assets.assets FOR ALL
    TO authenticated
    USING (atlas_core.is_tenant_admin(auth.uid(), tenant_id));

-- Assignments
CREATE POLICY "Employees can view own assignments"
    ON atlas_assets.asset_assignments FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage assignments"
    ON atlas_assets.asset_assignments FOR ALL
    TO authenticated
    USING (atlas_core.is_tenant_admin(auth.uid(), tenant_id));

-- ============================================================================
-- RLS POLICIES: FINANCE SCHEMA
-- ============================================================================

-- Expense Categories
CREATE POLICY "Tenant members can view expense categories"
    ON atlas_finance.fin_expense_categories FOR SELECT
    TO authenticated
    USING (atlas_core.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "Finance admins can manage categories"
    ON atlas_finance.fin_expense_categories FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'finance_admin']::atlas_core.tenant_role[]
    ));

-- Expense Claims
CREATE POLICY "Employees can view own claims"
    ON atlas_finance.fin_expense_claims FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Employees can create claims"
    ON atlas_finance.fin_expense_claims FOR INSERT
    TO authenticated
    WITH CHECK (
        employee_id IN (
            SELECT id FROM atlas_hr.hr_employees WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Finance admins can manage claims"
    ON atlas_finance.fin_expense_claims FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'finance_admin']::atlas_core.tenant_role[]
    ));

-- Invoices
CREATE POLICY "Finance admins can manage invoices"
    ON atlas_finance.fin_invoices FOR ALL
    TO authenticated
    USING (atlas_core.has_any_tenant_role(
        auth.uid(), 
        tenant_id, 
        ARRAY['super_admin', 'admin', 'finance_admin']::atlas_core.tenant_role[]
    ));

-- ============================================================================
-- PART 18: TRIGGERS
-- ============================================================================

-- 18.1 Auto-create profile on user signup
CREATE OR REPLACE FUNCTION atlas_core.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = atlas_core
AS $$
BEGIN
    INSERT INTO atlas_core.core_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION atlas_core.handle_new_user();

-- 18.2 Update timestamps
CREATE OR REPLACE FUNCTION atlas_core.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = atlas_core
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON atlas_core.core_tenants
    FOR EACH ROW EXECUTE FUNCTION atlas_core.update_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON atlas_core.core_profiles
    FOR EACH ROW EXECUTE FUNCTION atlas_core.update_updated_at();

CREATE TRIGGER update_memberships_updated_at
    BEFORE UPDATE ON atlas_core.core_tenant_memberships
    FOR EACH ROW EXECUTE FUNCTION atlas_core.update_updated_at();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON atlas_core.core_tenant_settings
    FOR EACH ROW EXECUTE FUNCTION atlas_core.update_updated_at();

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON atlas_hr.hr_employees
    FOR EACH ROW EXECUTE FUNCTION atlas_core.update_updated_at();

CREATE TRIGGER update_payroll_runs_updated_at
    BEFORE UPDATE ON atlas_payroll.pay_payroll_runs
    FOR EACH ROW EXECUTE FUNCTION atlas_core.update_updated_at();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON atlas_projects.proj_projects
    FOR EACH ROW EXECUTE FUNCTION atlas_core.update_updated_at();

-- ============================================================================
-- PART 19: INDEXES FOR PERFORMANCE
-- ============================================================================

-- Core indexes
CREATE INDEX idx_memberships_user ON atlas_core.core_tenant_memberships(user_id);
CREATE INDEX idx_memberships_tenant ON atlas_core.core_tenant_memberships(tenant_id);
CREATE INDEX idx_memberships_role ON atlas_core.core_tenant_memberships(role);

-- HR indexes
CREATE INDEX idx_employees_tenant ON atlas_hr.hr_employees(tenant_id);
CREATE INDEX idx_employees_user ON atlas_hr.hr_employees(user_id);
CREATE INDEX idx_employees_department ON atlas_hr.hr_employees(department_id);
CREATE INDEX idx_employees_status ON atlas_hr.hr_employees(status);

-- Payroll indexes
CREATE INDEX idx_payroll_runs_tenant ON atlas_payroll.pay_payroll_runs(tenant_id);
CREATE INDEX idx_payroll_items_employee ON atlas_payroll.pay_payroll_items(employee_id);

-- Attendance indexes
CREATE INDEX idx_attendance_tenant_date ON atlas_attendance.att_attendance_records(tenant_id, attendance_date);
CREATE INDEX idx_attendance_employee ON atlas_attendance.att_attendance_records(employee_id);
CREATE INDEX idx_leave_requests_employee ON atlas_attendance.att_leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON atlas_attendance.att_leave_requests(status);

-- Projects indexes
CREATE INDEX idx_projects_tenant ON atlas_projects.proj_projects(tenant_id);
CREATE INDEX idx_tasks_project ON atlas_projects.proj_tasks(project_id);
CREATE INDEX idx_tasks_assignee ON atlas_projects.proj_tasks(assignee_id);

-- ============================================================================
-- PART 20: POSTGREST CONFIGURATION
-- ============================================================================

-- IMPORTANT: Run this in Supabase Dashboard > SQL Editor
-- This exposes custom schemas to the API

-- Option 1: Via SQL (if you have superuser access)
-- ALTER ROLE authenticator SET pgrst.db_schemas TO 'public, atlas_core, atlas_hr, atlas_payroll, atlas_attendance, atlas_recruitment, atlas_compliance, atlas_finance, atlas_projects, atlas_assets, atlas_automation, atlas_insurance, atlas_bgv, atlas_performance';

-- Option 2: Via supabase/config.toml (recommended for Supabase projects)
-- [api]
-- schemas = ["public", "atlas_core", "atlas_hr", "atlas_payroll", "atlas_attendance", "atlas_recruitment", "atlas_compliance", "atlas_finance", "atlas_projects", "atlas_assets", "atlas_automation", "atlas_insurance", "atlas_bgv", "atlas_performance"]

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

-- Summary:
-- ✅ 13 Custom Schemas Created
-- ✅ 20+ Enum Types Defined
-- ✅ 45+ Tables Created
-- ✅ 8 Security Definer Functions
-- ✅ 80+ RLS Policies
-- ✅ Auto-create Profile Trigger
-- ✅ Updated_at Triggers
-- ✅ Performance Indexes

-- Next Steps:
-- 1. Update supabase/config.toml to expose schemas
-- 2. Create Edge Functions with tenant context
-- 3. Set up Storage buckets with RLS
-- 4. Configure Auth settings
