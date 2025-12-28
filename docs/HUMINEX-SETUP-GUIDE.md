# HUMINEX Setup & Deployment Guide

> **Version**: 3.3.0  
> **Last Updated**: December 28, 2025 @ 17:30 UTC  
> **Author**: CropXon HUMINEX Team

## Overview

This guide covers the complete setup and deployment of the HUMINEX Workforce Operating System, including:
- Supabase project configuration
- Database schema deployment (52 tables, 7 functions, 2 triggers)
- Edge function deployment (10 deployed, 5 documented)
- Environment variables
- Authentication setup
- Storage configuration

---

## Component Summary

| Component | Count | Details |
|-----------|-------|---------|
| **Database Tables** | 52 | 35 core + 7 operational + 5 HR + 5 shift/geofencing |
| **Database Functions** | 7 | Generators + feature checks |
| **Database Triggers** | 2 | Profile creation, feature unlock |
| **Edge Functions** | 15 | 10 deployed, 5 documented |
| **Storage Buckets** | 1 | client-files |
| **Secrets** | 6 | Supabase + Resend |
| **Enums/Types** | 15 | RBAC, status workflows, notifications, shift, geofencing |
| **RLS Policies** | 75+ | Row-level security |
| **Indexes** | 50+ | Performance optimization |

---

## Edge Functions Summary (15 Total)

| # | Function Name | Status | Purpose |
|---|---------------|--------|---------|
| 1 | send-notification | ✅ Deployed | Create in-app notifications for users |
| 2 | send-bulk-notifications | ✅ Deployed | Send notifications to multiple users |
| 3 | send-welcome-email | ✅ Deployed | Welcome email with login credentials |
| 4 | send-feature-unlock-email | ✅ Deployed | Notify when features are unlocked |
| 5 | send-quote-followup | ✅ Deployed | Follow-up emails for pending quotes |
| 6 | generate-invoice-pdf | ✅ Deployed | Generate downloadable PDF invoices |
| 7 | shift-scheduler | ✅ Deployed | Auto-schedule and publish shifts |
| 8 | shift-swap-workflow | ✅ Deployed | Handle shift swap approvals |
| 9 | overtime-calculator | ✅ Deployed | Calculate overtime hours/pay |
| 10 | geofence-attendance | ✅ Deployed | GPS check-in with fake location detection |
| 11 | run-payroll | 📝 Documented | Process payroll runs |
| 12 | process-bgv | 📝 Documented | Background verification |
| 13 | sso-callback | 📝 Documented | SSO OAuth callbacks |
| 14 | process-insurance-claim | 📝 Documented | Insurance claim processing |
| 15 | verify-document | 📝 Documented | OCR document verification |

---

## Database Tables Summary (52 Tables)

### Core Tables (8)
| Table | Purpose |
|-------|---------|
| profiles | User profile data (name, email, phone) |
| user_roles | Role assignments for RBAC (admin, user) |
| client_tenants | Organization/company tenant records |
| client_tenant_users | User-tenant membership mapping |
| quotes | Service quotes with pricing and status |
| invoices | Client invoices with payment tracking |
| leads | Sales leads with scoring and conversion |
| inquiries | Contact form submissions |

### HR & Workforce Tables (10)
| Table | Purpose |
|-------|---------|
| employees | Employee master records |
| attendance_records | Daily check-in/check-out |
| leave_types | Leave type definitions |
| leave_balances | Employee leave balances |
| leave_requests | Leave applications and approvals |
| shifts | Shift definitions and timing |
| shift_assignments | Employee shift assignments |
| shift_swap_requests | Shift swap between employees |
| overtime_records | Overtime hours and approvals |
| geofence_zones | Office location boundaries |

### Payroll & Finance Tables (5)
| Table | Purpose |
|-------|---------|
| payroll_runs | Payroll processing runs |
| payslips | Individual employee payslips |
| service_pricing | Service pricing tiers |
| service_addons | Optional add-on pricing |
| pricing_modifiers | Industry/size multipliers |

### Operations & Compliance Tables (8)
| Table | Purpose |
|-------|---------|
| bgv_requests | Background verification requests |
| insurance_claims | Insurance claim submissions |
| document_verifications | Document verification results |
| document_extractions | OCR data extraction |
| compliance_items | Compliance checklist tracking |
| projects | Client project management |
| project_milestones | Project milestone tracking |
| integrations | Third-party integrations |

### Admin & System Tables (12)
| Table | Purpose |
|-------|---------|
| admin_notifications | Admin-targeted notifications |
| admin_settings | Platform configuration |
| portal_settings | Client portal settings |
| audit_logs | System audit trail |
| system_logs | Application debugging logs |
| clickstream_events | User interaction analytics |
| api_usage | API usage tracking |
| team_members | Internal team profiles |
| client_notices | Client announcements |
| global_features | Platform feature definitions |
| tenant_features | Tenant-specific feature flags |
| employee_feature_access | Employee feature permissions |

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Supabase Project Setup](#supabase-project-setup)
4. [Database Setup](#database-setup)
5. [Authentication Configuration](#authentication-configuration)
6. [Edge Functions Deployment](#edge-functions-deployment)
7. [Storage Configuration](#storage-configuration)
8. [Environment Variables](#environment-variables)
9. [Frontend Configuration](#frontend-configuration)
10. [Verification Checklist](#verification-checklist)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- Node.js 18+ and npm/bun
- Supabase CLI (optional, for local development)
- Git

### Required Accounts
- Supabase account (free tier works for development)
- Resend account (for email notifications)
- Domain for production (optional)

---

## Quick Start

For Lovable Cloud projects, most setup is automatic. Here's what you need to do:

### 1. Secrets Configuration
Add these secrets in Lovable Cloud:

| Secret | Description |
|--------|-------------|
| `RESEND_API_KEY` | Get from [resend.com](https://resend.com) |

### 2. Run Database Migration
Execute the SQL from `docs/HUMINEX-DATABASE-SCHEMA.sql` in your Supabase SQL Editor.

### 3. Configure Auth
Enable email/password authentication with auto-confirm.

That's it for basic setup!

---

## Supabase Project Setup

### Option A: Lovable Cloud (Recommended)

Lovable Cloud automatically provisions and manages your Supabase project. The following are pre-configured:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Option B: External Supabase Project

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy these values:
   - Project URL → `SUPABASE_URL`
   - anon public key → `SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Database Setup

### Step 1: Run the Main Schema

1. Open Supabase Dashboard → SQL Editor
2. Copy the entire contents of `docs/HUMINEX-DATABASE-SCHEMA.sql`
3. Execute the SQL
4. Verify tables were created in Table Editor

### Step 2: Verify Critical Components

After running the schema, verify:

**Tables Created (35+ tables):**
```
profiles, user_roles, client_tenants, client_tenant_users,
quotes, invoices, leads, inquiries, onboarding_sessions,
projects, project_milestones, support_tickets, meetings,
admin_notifications, admin_settings, audit_logs, ...
```

**Functions Created:**
```sql
-- Verify these exist
SELECT proname FROM pg_proc WHERE proname IN (
  'generate_quote_number',
  'generate_invoice_number',
  'generate_client_id',
  'generate_ticket_number',
  'has_role',
  'handle_new_user'
);
```

**Triggers Created:**
```sql
-- Verify auth trigger
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Step 3: Seed Data (Optional)

For development, add sample data:

```sql
-- Add admin user role (replace with actual user ID after signup)
-- First, sign up a user, then run:
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR-USER-UUID', 'admin');

-- Add sample service pricing
INSERT INTO public.service_pricing (service_name, service_category, plan_tier, base_price, is_active)
VALUES 
  ('Digital Engineering', 'digital-engineering', 'basic', 2999, true),
  ('AI Automation', 'ai-automation', 'basic', 4999, true),
  ('Cybersecurity', 'cybersecurity', 'basic', 3499, true);
```

---

## Authentication Configuration

### Enable Email/Password Auth

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Email provider
3. Configure settings:

```
☑ Enable Email Signup
☑ Enable Email Login
☑ Auto-confirm email (for development)
☐ Double confirm email changes
```

### For Production

Disable auto-confirm and set up email templates:

1. Go to Authentication → Email Templates
2. Customize:
   - Confirmation email
   - Password reset email
   - Magic link email

### Auth Policies

The schema includes RLS policies. Ensure RLS is enabled:

```sql
-- Verify RLS is enabled on key tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

---

## Edge Functions Deployment

### Automatic Deployment (Lovable Cloud)

Edge functions in `supabase/functions/` deploy automatically on every build.

### Manual Deployment

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy send-notification
```

### Configure Function Secrets

In Supabase Dashboard → Edge Functions → Secrets:

| Secret | Required | Description |
|--------|----------|-------------|
| `RESEND_API_KEY` | Yes | For email sending |

### Verify Deployment

```bash
# List deployed functions
supabase functions list

# View function logs
supabase functions logs send-notification --tail
```

---

## Storage Configuration

### Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create bucket: `client-files`
3. Set to private (not public)

Or via SQL:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-files', 'client-files', false);
```

### Storage Policies

```sql
-- Allow authenticated users to upload to their folder
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'client-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their files
CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'client-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'client-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Environment Variables

### Frontend (.env file)

For Lovable Cloud, these are auto-configured:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### Edge Function Secrets

Set via Supabase Dashboard or CLI:

```bash
# Set secret via CLI
supabase secrets set RESEND_API_KEY=re_your_api_key
```

Required secrets:

| Secret | Source | Required |
|--------|--------|----------|
| `SUPABASE_URL` | Auto-provided | ✅ |
| `SUPABASE_ANON_KEY` | Auto-provided | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-provided | ✅ |
| `RESEND_API_KEY` | resend.com | ✅ |

---

## Frontend Configuration

### Supabase Client

The client is pre-configured at `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
```

### Usage in Components

```typescript
import { supabase } from '@/integrations/supabase/client';

// Query data
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId);

// Call edge function
const { data, error } = await supabase.functions.invoke('send-notification', {
  body: { title: 'Hello', message: 'World', notification_type: 'info' }
});
```

---

## Verification Checklist

After setup, verify these work:

### Database
- [ ] All tables created (check Table Editor)
- [ ] Functions exist (check Database → Functions)
- [ ] Triggers attached (check Database → Triggers)
- [ ] RLS enabled on all tables

### Authentication
- [ ] User can sign up
- [ ] User can sign in
- [ ] Profile auto-created on signup
- [ ] Role assignment works

### Edge Functions
- [ ] Functions deployed (check Edge Functions)
- [ ] `send-notification` responds to POST
- [ ] Email sending works (if RESEND_API_KEY set)

### Storage
- [ ] `client-files` bucket exists
- [ ] File upload works
- [ ] File download works

### Test Commands

```sql
-- Test quote number generation
SELECT public.generate_quote_number();
-- Expected: HMX-2024-0001

-- Test has_role function
SELECT public.has_role('user-uuid-here', 'admin');
-- Expected: true/false
```

---

## Troubleshooting

### Common Issues

#### "relation does not exist"
**Cause**: Schema not deployed
**Fix**: Run the full SQL schema again

#### "permission denied for table"
**Cause**: RLS policies blocking access
**Fix**: Check if user has correct role, or policy is missing

#### "JWT expired"
**Cause**: User session expired
**Fix**: User needs to re-login

#### Edge function 500 error
**Cause**: Usually missing secret or code error
**Fix**: 
1. Check function logs: `supabase functions logs function-name`
2. Verify secrets are set
3. Check for syntax errors in function code

#### Emails not sending
**Cause**: RESEND_API_KEY not set or invalid
**Fix**: 
1. Get key from resend.com
2. Set in Edge Functions → Secrets
3. Verify domain is configured in Resend

### Getting Help

1. Check Supabase logs: Dashboard → Logs
2. Check Edge Function logs: Dashboard → Edge Functions → Logs
3. Check browser console for frontend errors
4. Review RLS policies if data access issues

---

## Production Checklist

Before going to production:

- [ ] Disable email auto-confirm
- [ ] Set up custom email templates
- [ ] Configure custom domain
- [ ] Enable database backups
- [ ] Review and tighten RLS policies
- [ ] Set up monitoring/alerts
- [ ] Configure rate limiting
- [ ] Enable SSL (auto with Supabase)
- [ ] Review storage policies
- [ ] Test all user flows

---

## Updating Schema

When adding new tables:

1. Create migration SQL
2. Test in development first
3. Run in production SQL Editor
4. Update `types.ts` if needed (auto-generated by Lovable)

```sql
-- Example: Add new column
ALTER TABLE public.profiles 
ADD COLUMN avatar_url text;

-- Example: Add new table
CREATE TABLE public.new_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Always enable RLS
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own data" ON public.new_table
FOR SELECT USING (auth.uid() = user_id);
```

---

## Backup & Recovery

### Manual Backup

1. Go to Supabase Dashboard → Settings → Database
2. Click "Generate Backup"
3. Download backup file

### Restore

1. Create new project
2. Run backup SQL
3. Update environment variables

---

*End of ATLAS Setup Guide*
