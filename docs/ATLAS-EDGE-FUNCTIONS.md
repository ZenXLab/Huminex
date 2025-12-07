# ATLAS Edge Functions Documentation

> **Version**: 3.4.0  
> **Last Updated**: December 7, 2025 @ 18:00 UTC  
> **Author**: CropXon ATLAS Team

---

## 📊 Edge Functions Summary (15 Total - ALL DEPLOYED)

| # | Function Name | Status | Category | Purpose/Description |
|---|---------------|--------|----------|---------------------|
| 1 | `send-notification` | ✅ Deployed | Notifications | Creates in-app notifications for users with priority levels |
| 2 | `send-bulk-notifications` | ✅ Deployed | Notifications | Send notifications to multiple users at once (batch processing) |
| 3 | `send-welcome-email` | ✅ Deployed | Email | Sends welcome email with login credentials to new clients |
| 4 | `send-feature-unlock-email` | ✅ Deployed | Email | Notifies users when new features are unlocked for them |
| 5 | `send-quote-followup` | ✅ Deployed | Email | Automated follow-up emails for pending quotes |
| 6 | `generate-invoice-pdf` | ✅ Deployed | PDF | Generates downloadable PDF invoices |
| 7 | `shift-scheduler` | ✅ Deployed | Shift Mgmt | Auto-schedule shifts, publish schedules, notify employees |
| 8 | `shift-swap-workflow` | ✅ Deployed | Shift Mgmt | Handle shift swap requests, approvals, rejections |
| 9 | `overtime-calculator` | ✅ Deployed | Overtime | Calculate overtime hours, apply multipliers, process records |
| 10 | `geofence-attendance` | ✅ Deployed | Geofencing | GPS-validated check-in/out with fake location detection |
| 11 | `run-payroll` | ✅ Deployed | Payroll | Process payroll runs, calculate salaries, generate payslips |
| 12 | `process-bgv` | ✅ Deployed | BGV | Submit and track background verification requests |
| 13 | `sso-callback` | ✅ Deployed | SSO | Handle SSO OAuth callbacks (Google, Microsoft, Okta) |
| 14 | `process-insurance-claim` | ✅ Deployed | Insurance | Submit and track insurance claim requests |
| 15 | `verify-document` | ✅ Deployed | Documents | OCR and verification of uploaded documents |

---

## 📈 Statistics

| Metric | Count |
|--------|-------|
| **Total Edge Functions** | 15 |
| **Deployed** | 15 ✅ |
| **Required Secrets** | 4 (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY) |

---

## 🗂️ Functions by Category

| Category | Functions | Count |
|----------|-----------|-------|
| **Notifications** | send-notification, send-bulk-notifications | 2 |
| **Email** | send-welcome-email, send-feature-unlock-email, send-quote-followup | 3 |
| **PDF Generation** | generate-invoice-pdf | 1 |
| **Shift Management** | shift-scheduler, shift-swap-workflow | 2 |
| **Attendance** | overtime-calculator, geofence-attendance | 2 |
| **Payroll** | run-payroll | 1 |
| **BGV** | process-bgv | 1 |
| **SSO** | sso-callback | 1 |
| **Insurance** | process-insurance-claim | 1 |
| **Documents** | verify-document | 1 |

---

## 🔧 Function Details

### 1. send-notification
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/send-notification/index.ts` |
| **Purpose** | Create in-app notifications for users |
| **Auth** | Public (verify_jwt = false) |
| **Tables Used** | admin_notifications, employee_notifications |
| **Actions** | create, mark-read, delete |

### 2. send-bulk-notifications
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/send-bulk-notifications/index.ts` |
| **Purpose** | Send notifications to multiple users at once |
| **Auth** | Public (verify_jwt = false) |
| **Tables Used** | admin_notifications, employee_notifications |
| **Actions** | send-bulk |

### 3. send-welcome-email
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/send-welcome-email/index.ts` |
| **Purpose** | Send welcome emails with login credentials |
| **Auth** | Public (verify_jwt = false) |
| **Secrets** | RESEND_API_KEY |
| **Actions** | send |

### 4. send-feature-unlock-email
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/send-feature-unlock-email/index.ts` |
| **Purpose** | Notify users when features are unlocked |
| **Auth** | Public (verify_jwt = false) |
| **Secrets** | RESEND_API_KEY |
| **Actions** | send |

### 5. send-quote-followup
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/send-quote-followup/index.ts` |
| **Purpose** | Automated follow-up for pending quotes |
| **Auth** | Public (verify_jwt = false) |
| **Secrets** | RESEND_API_KEY |
| **Tables Used** | quotes |
| **Actions** | send-followup |

### 6. generate-invoice-pdf
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/generate-invoice-pdf/index.ts` |
| **Purpose** | Generate downloadable PDF invoices |
| **Auth** | Public (verify_jwt = false) |
| **Tables Used** | invoices, quotes |
| **Actions** | generate |

### 7. shift-scheduler
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/shift-scheduler/index.ts` |
| **Purpose** | Auto-schedule and publish shifts |
| **Auth** | Public (verify_jwt = false) |
| **Tables Used** | shifts, shift_assignments, employees |
| **Actions** | create-shift, auto-assign, publish, get-schedule |

### 8. shift-swap-workflow
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/shift-swap-workflow/index.ts` |
| **Purpose** | Handle shift swap requests and approvals |
| **Auth** | Public (verify_jwt = false) |
| **Tables Used** | shift_swap_requests, shift_assignments |
| **Actions** | request, approve, reject, cancel, list |

### 9. overtime-calculator
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/overtime-calculator/index.ts` |
| **Purpose** | Calculate overtime hours and multipliers |
| **Auth** | Public (verify_jwt = false) |
| **Tables Used** | overtime_records, employees, attendance_records |
| **Actions** | calculate, approve, reject, get-summary, process-batch |

### 10. geofence-attendance
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/geofence-attendance/index.ts` |
| **Purpose** | GPS-validated check-in/out with fake location detection |
| **Auth** | Public (verify_jwt = false) |
| **Tables Used** | geofence_zones, geofence_attendance_logs, attendance_records |
| **Actions** | check-in, check-out, validate-location, get-zones |
| **Features** | Haversine distance calculation, Mock location detection |

### 11. run-payroll
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/run-payroll/index.ts` |
| **Purpose** | Process payroll runs and generate payslips |
| **Auth** | Public (verify_jwt = false) |
| **Tables Used** | payroll_runs, payslips, employees |
| **Actions** | initiate, calculate, approve, process, get-summary |
| **Calculations** | Basic, HRA (40%), Special Allowance (20%), PF (12%), PT, TDS |

### 12. process-bgv
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/process-bgv/index.ts` |
| **Purpose** | Submit and track background verifications |
| **Auth** | Public (verify_jwt = false) |
| **Tables Used** | bgv_requests, employees |
| **Actions** | submit, update-status, complete, get-status, list |
| **BGV Types** | identity, address, education, employment, criminal, credit |

### 13. sso-callback
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/sso-callback/index.ts` |
| **Purpose** | Handle SSO OAuth callbacks |
| **Auth** | Public (verify_jwt = false) |
| **Tables Used** | sso_states, profiles, client_tenant_users |
| **Actions** | initiate, callback, validate-state |
| **Providers** | Google, Microsoft, Okta |

### 14. process-insurance-claim
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/process-insurance-claim/index.ts` |
| **Purpose** | Submit and track insurance claims |
| **Auth** | Public (verify_jwt = false) |
| **Tables Used** | insurance_claims, employees |
| **Actions** | submit, update-status, approve, reject, get-claim, list |
| **Claim Types** | medical, dental, vision, life, disability, accident |

### 15. verify-document
| Attribute | Details |
|-----------|---------|
| **File** | `supabase/functions/verify-document/index.ts` |
| **Purpose** | OCR and document verification |
| **Auth** | Public (verify_jwt = false) |
| **Tables Used** | document_verifications, document_extractions |
| **Actions** | submit, extract, verify, get-status, list |
| **Document Types** | aadhaar, pan, passport, driving_license, voter_id, bank_statement, payslip |

---

## 📁 Directory Structure

```
supabase/
└── functions/
    ├── send-notification/            # In-app notifications
    │   └── index.ts
    ├── send-bulk-notifications/      # Bulk notifications
    │   └── index.ts
    ├── send-welcome-email/           # Welcome emails
    │   └── index.ts
    ├── send-feature-unlock-email/    # Feature unlock emails
    │   └── index.ts
    ├── send-quote-followup/          # Quote follow-up emails
    │   └── index.ts
    ├── generate-invoice-pdf/         # PDF generation
    │   └── index.ts
    ├── shift-scheduler/              # Shift scheduling
    │   └── index.ts
    ├── shift-swap-workflow/          # Shift swap handling
    │   └── index.ts
    ├── overtime-calculator/          # Overtime calculation
    │   └── index.ts
    ├── geofence-attendance/          # GPS attendance
    │   └── index.ts
    ├── run-payroll/                  # Payroll processing
    │   └── index.ts
    ├── process-bgv/                  # BGV requests
    │   └── index.ts
    ├── sso-callback/                 # SSO OAuth
    │   └── index.ts
    ├── process-insurance-claim/      # Insurance claims
    │   └── index.ts
    └── verify-document/              # Document OCR
        └── index.ts
```

---

## 🔑 Required Secrets

| Secret | Description | Required |
|--------|-------------|----------|
| `SUPABASE_URL` | Auto-provided by Supabase | ✅ |
| `SUPABASE_ANON_KEY` | Auto-provided by Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-provided by Supabase | ✅ |
| `RESEND_API_KEY` | For sending emails via Resend | ✅ |

---

## Overview

1. [Summary Statistics](#summary-statistics)
2. [Directory Structure](#directory-structure)
3. [Required Secrets](#required-secrets)
4. [Shared Utilities](#shared-utilities)
5. [Notification Functions](#notification-functions)
6. [Email Functions](#email-functions)
7. [Payroll Functions](#payroll-functions)
8. [BGV Functions](#bgv-functions)
9. [SSO Functions](#sso-functions)
10. [Insurance Functions](#insurance-functions)
11. [Document Verification Functions](#document-verification-functions)
12. [PDF Generation Functions](#pdf-generation-functions)
13. [Error Handling](#error-handling)
14. [Testing](#testing)
15. [Security Considerations](#security-considerations)

---

## Directory Structure

```
supabase/
└── functions/
    ├── _shared/                      # Shared utilities (NOT deployed)
    │   ├── cors.ts                   # CORS headers
    │   ├── types.ts                  # TypeScript types
    │   ├── response.ts               # Standardized responses
    │   ├── validation.ts             # Input validation
    │   ├── tenant-utils.ts           # Tenant context & RBAC
    │   └── email-utils.ts            # Email templates
    │
    ├── send-notification/            # Create notifications
    │   └── index.ts
    ├── send-bulk-notifications/      # Bulk notifications
    │   └── index.ts
    ├── send-welcome-email/           # Welcome emails
    │   └── index.ts
    ├── send-feature-unlock-email/    # Feature unlock emails
    │   └── index.ts
    ├── send-quote-followup/          # Quote follow-up emails
    │   └── index.ts
    └── generate-invoice-pdf/         # PDF generation
        └── index.ts
```

---

## Required Secrets

Set these in Supabase Dashboard > Edge Functions > Secrets:

| Secret | Description | Required |
|--------|-------------|----------|
| `SUPABASE_URL` | Auto-provided by Supabase | ✅ |
| `SUPABASE_ANON_KEY` | Auto-provided by Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-provided by Supabase | ✅ |
| `RESEND_API_KEY` | For sending emails via Resend | ✅ |

---

## Shared Utilities

### CORS Headers

Every Edge Function must handle CORS. Use this pattern:

```typescript
// supabase/functions/_shared/cors.ts

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

export function handleCors(): Response {
  return new Response(null, { status: 204, headers: corsHeaders });
}
```

### Usage in Functions

```typescript
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Your logic here...
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
```

---

## Notification Functions

### 1. send-notification

**Purpose**: Creates a single notification and optionally sends email/push.

**Endpoint**: `POST /functions/v1/send-notification`

**File**: `supabase/functions/send-notification/index.ts`

#### Request Payload

```typescript
interface NotificationPayload {
  // Required fields
  title: string;              // Notification title
  message: string;            // Notification body
  notification_type: string;  // info | success | warning | error | security | billing
  
  // Optional fields
  category?: string;          // system | security | billing | users | projects | onboarding
  target_admin_id?: string;   // Specific admin UUID (null = broadcast)
  priority?: string;          // low | normal | high | urgent
  action_url?: string;        // Link to relevant page
  send_email?: boolean;       // Send email notification
  send_push?: boolean;        // Send push notification
  email_recipient?: string;   // Override email address
  metadata?: object;          // Additional data
}
```

#### Complete Implementation

```typescript
// supabase/functions/send-notification/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  title: string;
  message: string;
  notification_type: string;
  category?: string;
  target_admin_id?: string;
  priority?: string;
  action_url?: string;
  send_email?: boolean;
  send_push?: boolean;
  email_recipient?: string;
  metadata?: Record<string, unknown>;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const payload: NotificationPayload = await req.json();
    
    // Validate required fields
    if (!payload.title || !payload.message || !payload.notification_type) {
      throw new Error('Missing required fields: title, message, notification_type');
    }

    console.log('[send-notification] Creating notification:', {
      title: payload.title,
      type: payload.notification_type,
      category: payload.category,
      target: payload.target_admin_id || 'broadcast',
      priority: payload.priority || 'normal'
    });

    // Insert notification into database
    const { data: notification, error: insertError } = await supabase
      .from('admin_notifications')
      .insert({
        title: payload.title,
        message: payload.message,
        notification_type: payload.notification_type,
        target_admin_id: payload.target_admin_id || null,
        is_read: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[send-notification] Insert error:', insertError);
      throw insertError;
    }

    console.log('[send-notification] Notification created:', notification.id);

    // Send email if requested
    let emailResult = null;
    if (payload.send_email) {
      const resendApiKey = Deno.env.get('RESEND_API_KEY');
      
      if (resendApiKey && payload.email_recipient) {
        try {
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'ATLAS <noreply@atlas.cropxon.com>',
              to: [payload.email_recipient],
              subject: `[ATLAS] ${payload.title}`,
              html: generateEmailHtml(payload),
            }),
          });

          emailResult = await emailResponse.json();
          console.log('[send-notification] Email sent:', emailResult);
        } catch (emailError) {
          console.error('[send-notification] Email error:', emailError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        notification_id: notification.id,
        email_sent: !!emailResult,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[send-notification] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Generate styled email HTML
function generateEmailHtml(payload: NotificationPayload): string {
  const priorityColors = {
    low: '#6B7280',
    normal: '#3B82F6',
    high: '#F59E0B',
    urgent: '#EF4444'
  };
  
  const typeColors = {
    info: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    security: '#EF4444',
    billing: '#10B981'
  };

  const color = typeColors[payload.notification_type] || '#3B82F6';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, ${color}, ${color}dd); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">ATLAS Notification</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <h2 style="margin: 0 0 15px; color: #1a1a1a;">${payload.title}</h2>
        <p style="color: #4a4a4a; line-height: 1.6; margin: 0 0 20px;">${payload.message}</p>
        ${payload.action_url ? `
          <a href="${payload.action_url}" style="display: inline-block; background: ${color}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            View Details
          </a>
        ` : ''}
      </div>
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>Powered by ATLAS Enterprise Platform</p>
      </div>
    </body>
    </html>
  `;
}
```

#### Usage Examples

```typescript
// Simple notification
await supabase.functions.invoke('send-notification', {
  body: {
    title: 'New Quote Submitted',
    message: 'Client ABC Corp submitted a quote for $5,000',
    notification_type: 'info',
    category: 'billing'
  }
});

// Security alert with email
await supabase.functions.invoke('send-notification', {
  body: {
    title: 'Failed Login Attempt',
    message: 'Multiple failed attempts from IP 192.168.1.1',
    notification_type: 'security',
    category: 'security',
    priority: 'urgent',
    send_email: true,
    email_recipient: 'security@cropxon.com'
  }
});

// Targeted notification to specific admin
await supabase.functions.invoke('send-notification', {
  body: {
    title: 'Project Update Required',
    message: 'Project XYZ needs your review',
    notification_type: 'warning',
    category: 'projects',
    target_admin_id: 'admin-uuid-here',
    action_url: '/admin/projects/xyz'
  }
});
```

---

### 2. send-bulk-notifications

**Purpose**: Sends notifications to multiple admins or broadcasts to all.

**Endpoint**: `POST /functions/v1/send-bulk-notifications`

**File**: `supabase/functions/send-bulk-notifications/index.ts`

#### Request Payload

```typescript
interface BulkNotificationPayload {
  title: string;
  message: string;
  notification_type: string;
  category?: string;
  target_admin_ids?: string[];   // Specific admin UUIDs
  broadcast_to_all?: boolean;    // Send to all admins
  priority?: string;
  action_url?: string;
  send_emails?: boolean;
  metadata?: object;
}
```

#### Complete Implementation

```typescript
// supabase/functions/send-bulk-notifications/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BulkNotificationPayload {
  title: string;
  message: string;
  notification_type: string;
  category?: string;
  target_admin_ids?: string[];
  broadcast_to_all?: boolean;
  priority?: string;
  action_url?: string;
  send_emails?: boolean;
  metadata?: Record<string, unknown>;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: BulkNotificationPayload = await req.json();

    if (!payload.title || !payload.message || !payload.notification_type) {
      throw new Error('Missing required fields');
    }

    console.log('[send-bulk-notifications] Processing:', {
      title: payload.title,
      broadcast: payload.broadcast_to_all,
      targetCount: payload.target_admin_ids?.length || 0
    });

    let targetAdminIds = payload.target_admin_ids || [];

    // If broadcasting, get all admin user IDs
    if (payload.broadcast_to_all) {
      const { data: admins, error: adminError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (adminError) throw adminError;
      targetAdminIds = admins?.map(a => a.user_id) || [];
    }

    // Create notifications for each target
    const notifications = targetAdminIds.map(adminId => ({
      title: payload.title,
      message: payload.message,
      notification_type: payload.notification_type,
      target_admin_id: adminId,
      is_read: false,
    }));

    // Also create a broadcast notification (null target = all admins)
    if (payload.broadcast_to_all) {
      notifications.push({
        title: payload.title,
        message: payload.message,
        notification_type: payload.notification_type,
        target_admin_id: null,
        is_read: false,
      });
    }

    const { data: inserted, error: insertError } = await supabase
      .from('admin_notifications')
      .insert(notifications)
      .select();

    if (insertError) throw insertError;

    console.log('[send-bulk-notifications] Created:', inserted?.length, 'notifications');

    // Send emails if requested (with rate limiting)
    let emailsSent = 0;
    if (payload.send_emails && targetAdminIds.length > 0) {
      const resendApiKey = Deno.env.get('RESEND_API_KEY');
      
      if (resendApiKey) {
        // Get admin emails
        const { data: profiles } = await supabase
          .from('profiles')
          .select('email')
          .in('id', targetAdminIds);

        // Send emails in batches of 10 to avoid rate limits
        const emails = profiles?.map(p => p.email).filter(Boolean) || [];
        const batchSize = 10;
        
        for (let i = 0; i < emails.length; i += batchSize) {
          const batch = emails.slice(i, i + batchSize);
          
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'ATLAS <noreply@atlas.cropxon.com>',
              to: batch,
              subject: `[ATLAS] ${payload.title}`,
              html: `<h2>${payload.title}</h2><p>${payload.message}</p>`,
            }),
          });

          emailsSent += batch.length;
          
          // Rate limit delay
          if (i + batchSize < emails.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        notifications_created: inserted?.length || 0,
        emails_sent: emailsSent,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[send-bulk-notifications] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

#### Usage Examples

```typescript
// Broadcast to all admins
await supabase.functions.invoke('send-bulk-notifications', {
  body: {
    title: 'System Maintenance',
    message: 'ATLAS will undergo maintenance Sunday 2AM-4AM',
    notification_type: 'system',
    broadcast_to_all: true,
    priority: 'high'
  }
});

// Send to specific admins with email
await supabase.functions.invoke('send-bulk-notifications', {
  body: {
    title: 'Invoice Payment Required',
    message: 'Invoices totaling ₹5,00,000 are overdue',
    notification_type: 'billing',
    target_admin_ids: ['uuid-1', 'uuid-2'],
    send_emails: true,
    action_url: '/admin/invoices?status=overdue'
  }
});
```

---

## Email Functions

### 3. send-welcome-email

**Purpose**: Sends welcome email to new clients after onboarding approval.

**Endpoint**: `POST /functions/v1/send-welcome-email`

```typescript
// supabase/functions/send-welcome-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, temporaryPassword, loginUrl } = await req.json();

    if (!name || !email) {
      throw new Error('Missing required fields: name, email');
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ATLAS <welcome@atlas.cropxon.com>',
        to: [email],
        subject: `Welcome to ATLAS - ${company || 'Your Account is Ready'}`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #005EEB, #00C2FF); padding: 40px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome to ATLAS</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">${company || 'Your Workforce OS'}</p>
            </div>
            <div style="background: #fff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="font-size: 18px;">Hello <strong>${name}</strong>,</p>
              <p>Your ATLAS account has been approved and is ready to use.</p>
              ${temporaryPassword ? `
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0 0 10px; font-weight: 600;">Your temporary password:</p>
                  <code style="background: #e5e7eb; padding: 8px 16px; border-radius: 4px; font-size: 16px;">
                    ${temporaryPassword}
                  </code>
                  <p style="margin: 10px 0 0; font-size: 14px; color: #6b7280;">
                    Please change this after your first login.
                  </p>
                </div>
              ` : ''}
              <div style="text-align: center; margin: 30px 0;">
                <a href="${loginUrl || 'https://atlas.cropxon.com/portal/auth'}" style="background: #005EEB; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                  Login to ATLAS
                </a>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const result = await response.json();

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[send-welcome-email] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

### 4. send-feature-unlock-email

**Purpose**: Sends email when new features are unlocked for users.

**Endpoint**: `POST /functions/v1/send-feature-unlock-email`

```typescript
// supabase/functions/send-feature-unlock-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userName, featureName, featureDescription, portalUrl } = await req.json();

    if (!email || !featureName) {
      throw new Error('Missing required fields');
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) throw new Error('RESEND_API_KEY not configured');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ATLAS <features@atlas.cropxon.com>',
        to: [email],
        subject: `🎉 New Feature Unlocked: ${featureName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 40px; border-radius: 12px 12px 0 0; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
              <h1 style="color: white; margin: 0;">New Feature Unlocked!</h1>
            </div>
            <div style="background: #fff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="font-size: 18px;">Hi ${userName || 'there'},</p>
              <p>Great news! You now have access to:</p>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #166534; margin: 0 0 10px;">${featureName}</h3>
                <p style="color: #15803d; margin: 0;">${featureDescription || 'Explore this new feature in your portal.'}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${portalUrl || 'https://atlas.cropxon.com/portal'}" style="background: #10B981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                  Explore Now
                </a>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const result = await response.json();

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[send-feature-unlock-email] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## Payroll Functions

### 5. run-payroll

**Purpose**: Processes payroll for a tenant, calculates salaries, deductions, and generates payslips.

**Endpoint**: `POST /functions/v1/run-payroll`

**File**: `supabase/functions/run-payroll/index.ts`

#### Required Secrets

| Secret | Description |
|--------|-------------|
| `SUPABASE_URL` | Auto-provided |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-provided |

#### Request Payload

```typescript
interface RunPayrollPayload {
  tenant_id: string;          // Tenant UUID
  payroll_month: string;      // Format: YYYY-MM
  employee_ids?: string[];    // Optional: specific employees (null = all)
  include_bonuses?: boolean;  // Include bonus calculations
  include_deductions?: boolean; // Include statutory deductions
  dry_run?: boolean;          // Preview without saving
}
```

#### Response

```typescript
interface PayrollResponse {
  success: boolean;
  payroll_run_id?: string;
  summary: {
    total_employees: number;
    total_gross: number;
    total_deductions: number;
    total_net: number;
    processing_time_ms: number;
  };
  errors?: Array<{ employee_id: string; error: string }>;
}
```

#### Complete Implementation

```typescript
// supabase/functions/run-payroll/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RunPayrollPayload {
  tenant_id: string;
  payroll_month: string;
  employee_ids?: string[];
  include_bonuses?: boolean;
  include_deductions?: boolean;
  dry_run?: boolean;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  base_salary: number;
  department: string;
}

interface PayrollCalculation {
  employee_id: string;
  gross_salary: number;
  pf_deduction: number;      // 12% of basic
  esi_deduction: number;     // 0.75% if applicable
  professional_tax: number;  // State-based
  tds_deduction: number;     // Based on tax slab
  other_deductions: number;
  bonuses: number;
  net_salary: number;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: RunPayrollPayload = await req.json();

    // Validate required fields
    if (!payload.tenant_id || !payload.payroll_month) {
      throw new Error('Missing required fields: tenant_id, payroll_month');
    }

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(payload.payroll_month)) {
      throw new Error('Invalid payroll_month format. Use YYYY-MM');
    }

    console.log('[run-payroll] Starting payroll run:', {
      tenant_id: payload.tenant_id,
      month: payload.payroll_month,
      dry_run: payload.dry_run
    });

    // Fetch employees for this tenant
    let employeeQuery = supabase
      .from('employees')
      .select('id, name, email, base_salary, department')
      .eq('tenant_id', payload.tenant_id)
      .eq('status', 'active');

    if (payload.employee_ids && payload.employee_ids.length > 0) {
      employeeQuery = employeeQuery.in('id', payload.employee_ids);
    }

    const { data: employees, error: empError } = await employeeQuery;

    if (empError) throw empError;
    if (!employees || employees.length === 0) {
      throw new Error('No active employees found for this tenant');
    }

    console.log('[run-payroll] Processing', employees.length, 'employees');

    // Calculate payroll for each employee
    const calculations: PayrollCalculation[] = [];
    const errors: Array<{ employee_id: string; error: string }> = [];

    for (const emp of employees) {
      try {
        const calc = calculatePayroll(emp as Employee, payload);
        calculations.push(calc);
      } catch (calcError) {
        errors.push({
          employee_id: emp.id,
          error: calcError.message
        });
      }
    }

    // Calculate summary
    const summary = {
      total_employees: calculations.length,
      total_gross: calculations.reduce((sum, c) => sum + c.gross_salary, 0),
      total_deductions: calculations.reduce((sum, c) => 
        sum + c.pf_deduction + c.esi_deduction + c.professional_tax + c.tds_deduction + c.other_deductions, 0),
      total_net: calculations.reduce((sum, c) => sum + c.net_salary, 0),
      processing_time_ms: Date.now() - startTime
    };

    let payroll_run_id = null;

    // Save payroll run if not a dry run
    if (!payload.dry_run) {
      // Create payroll run record
      const { data: payrollRun, error: runError } = await supabase
        .from('payroll_runs')
        .insert({
          tenant_id: payload.tenant_id,
          payroll_month: payload.payroll_month,
          status: 'completed',
          total_employees: summary.total_employees,
          total_gross: summary.total_gross,
          total_deductions: summary.total_deductions,
          total_net: summary.total_net,
          processed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (runError) throw runError;
      payroll_run_id = payrollRun.id;

      // Insert individual payslips
      const payslips = calculations.map(calc => ({
        payroll_run_id: payroll_run_id,
        employee_id: calc.employee_id,
        tenant_id: payload.tenant_id,
        payroll_month: payload.payroll_month,
        gross_salary: calc.gross_salary,
        pf_deduction: calc.pf_deduction,
        esi_deduction: calc.esi_deduction,
        professional_tax: calc.professional_tax,
        tds_deduction: calc.tds_deduction,
        other_deductions: calc.other_deductions,
        bonuses: calc.bonuses,
        net_salary: calc.net_salary
      }));

      const { error: payslipError } = await supabase
        .from('payslips')
        .insert(payslips);

      if (payslipError) {
        console.error('[run-payroll] Payslip insert error:', payslipError);
      }

      console.log('[run-payroll] Payroll run completed:', payroll_run_id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        payroll_run_id,
        dry_run: payload.dry_run || false,
        summary,
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[run-payroll] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        processing_time_ms: Date.now() - startTime
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Calculate payroll for single employee
function calculatePayroll(
  employee: Employee, 
  options: RunPayrollPayload
): PayrollCalculation {
  const grossSalary = employee.base_salary;
  const basic = grossSalary * 0.5; // 50% of gross is basic

  // PF: 12% of basic (capped at ₹15,000 basic)
  const pfBasic = Math.min(basic, 15000);
  const pfDeduction = pfBasic * 0.12;

  // ESI: 0.75% if gross <= ₹21,000
  const esiDeduction = grossSalary <= 21000 ? grossSalary * 0.0075 : 0;

  // Professional Tax (varies by state, using common ₹200/month)
  const professionalTax = grossSalary > 15000 ? 200 : 0;

  // TDS: Simplified calculation based on annual income
  const annualIncome = grossSalary * 12;
  let tdsDeduction = 0;
  if (annualIncome > 1000000) {
    tdsDeduction = grossSalary * 0.30; // 30% for > 10L
  } else if (annualIncome > 500000) {
    tdsDeduction = grossSalary * 0.20; // 20% for 5-10L
  } else if (annualIncome > 250000) {
    tdsDeduction = grossSalary * 0.05; // 5% for 2.5-5L
  }

  // Bonuses (if enabled)
  const bonuses = options.include_bonuses ? 0 : 0; // Placeholder for bonus logic

  // Calculate net
  const totalDeductions = pfDeduction + esiDeduction + professionalTax + tdsDeduction;
  const netSalary = grossSalary + bonuses - totalDeductions;

  return {
    employee_id: employee.id,
    gross_salary: Math.round(grossSalary * 100) / 100,
    pf_deduction: Math.round(pfDeduction * 100) / 100,
    esi_deduction: Math.round(esiDeduction * 100) / 100,
    professional_tax: professionalTax,
    tds_deduction: Math.round(tdsDeduction * 100) / 100,
    other_deductions: 0,
    bonuses,
    net_salary: Math.round(netSalary * 100) / 100
  };
}
```

#### Usage Examples

```typescript
// Run payroll for all employees
await supabase.functions.invoke('run-payroll', {
  body: {
    tenant_id: 'tenant-uuid',
    payroll_month: '2024-12',
    include_deductions: true
  }
});

// Dry run to preview calculations
await supabase.functions.invoke('run-payroll', {
  body: {
    tenant_id: 'tenant-uuid',
    payroll_month: '2024-12',
    dry_run: true
  }
});

// Run for specific employees
await supabase.functions.invoke('run-payroll', {
  body: {
    tenant_id: 'tenant-uuid',
    payroll_month: '2024-12',
    employee_ids: ['emp-1', 'emp-2', 'emp-3']
  }
});
```

---

## BGV (Background Verification) Functions

### 6. initiate-bgv

**Purpose**: Initiates background verification for an employee through third-party BGV provider.

**Endpoint**: `POST /functions/v1/initiate-bgv`

**File**: `supabase/functions/initiate-bgv/index.ts`

#### Required Secrets

| Secret | Description |
|--------|-------------|
| `BGV_PROVIDER_API_KEY` | API key for BGV provider (AuthBridge, IDFY, etc.) |
| `BGV_PROVIDER_URL` | BGV provider API endpoint |

#### Request Payload

```typescript
interface InitiateBGVPayload {
  tenant_id: string;
  employee_id: string;
  verification_types: Array<
    'identity' | 'address' | 'education' | 'employment' | 
    'criminal' | 'credit' | 'drug_test' | 'reference'
  >;
  priority?: 'normal' | 'urgent';
  documents?: {
    aadhaar?: string;       // Masked Aadhaar number
    pan?: string;           // PAN number
    passport?: string;      // Passport number
  };
  callback_url?: string;    // Webhook for status updates
}
```

#### Response

```typescript
interface BGVResponse {
  success: boolean;
  request_id: string;
  verification_id: string;
  status: 'initiated' | 'pending' | 'in_progress';
  estimated_completion: string; // ISO date
  verifications: Array<{
    type: string;
    status: string;
  }>;
}
```

#### Complete Implementation

```typescript
// supabase/functions/initiate-bgv/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InitiateBGVPayload {
  tenant_id: string;
  employee_id: string;
  verification_types: string[];
  priority?: 'normal' | 'urgent';
  documents?: {
    aadhaar?: string;
    pan?: string;
    passport?: string;
  };
  callback_url?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const bgvApiKey = Deno.env.get('BGV_PROVIDER_API_KEY');
    const bgvProviderUrl = Deno.env.get('BGV_PROVIDER_URL') || 'https://api.bgv-provider.com/v1';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const payload: InitiateBGVPayload = await req.json();

    // Validate required fields
    if (!payload.tenant_id || !payload.employee_id || !payload.verification_types?.length) {
      throw new Error('Missing required fields: tenant_id, employee_id, verification_types');
    }

    console.log('[initiate-bgv] Starting BGV for employee:', payload.employee_id);

    // Fetch employee details
    const { data: employee, error: empError } = await supabase
      .from('employees')
      .select('id, name, email, phone, date_of_birth')
      .eq('id', payload.employee_id)
      .eq('tenant_id', payload.tenant_id)
      .single();

    if (empError || !employee) {
      throw new Error('Employee not found');
    }

    // Generate unique verification ID
    const verificationId = `BGV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create BGV request record
    const { data: bgvRequest, error: insertError } = await supabase
      .from('bgv_requests')
      .insert({
        tenant_id: payload.tenant_id,
        employee_id: payload.employee_id,
        verification_id: verificationId,
        verification_types: payload.verification_types,
        status: 'initiated',
        priority: payload.priority || 'normal',
        documents_submitted: payload.documents || {},
        initiated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Call external BGV provider (if configured)
    let providerResponse = null;
    if (bgvApiKey) {
      try {
        const externalResponse = await fetch(`${bgvProviderUrl}/verifications`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${bgvApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reference_id: verificationId,
            candidate: {
              name: employee.name,
              email: employee.email,
              phone: employee.phone,
              dob: employee.date_of_birth
            },
            checks: payload.verification_types.map(type => ({
              type,
              priority: payload.priority || 'normal'
            })),
            callback_url: payload.callback_url
          })
        });

        providerResponse = await externalResponse.json();
        
        // Update with provider reference
        if (providerResponse.id) {
          await supabase
            .from('bgv_requests')
            .update({
              provider_reference_id: providerResponse.id,
              status: 'pending'
            })
            .eq('id', bgvRequest.id);
        }

        console.log('[initiate-bgv] Provider response:', providerResponse);
      } catch (providerError) {
        console.error('[initiate-bgv] Provider call failed:', providerError);
        // Continue with local tracking even if provider fails
      }
    }

    // Calculate estimated completion
    const estimatedDays = payload.priority === 'urgent' ? 2 : 5;
    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + estimatedDays);

    return new Response(
      JSON.stringify({
        success: true,
        request_id: bgvRequest.id,
        verification_id: verificationId,
        status: providerResponse ? 'pending' : 'initiated',
        estimated_completion: estimatedCompletion.toISOString(),
        verifications: payload.verification_types.map(type => ({
          type,
          status: 'pending'
        })),
        provider_reference: providerResponse?.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[initiate-bgv] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### 7. bgv-webhook

**Purpose**: Receives status updates from BGV provider and updates verification status.

**Endpoint**: `POST /functions/v1/bgv-webhook`

**File**: `supabase/functions/bgv-webhook/index.ts`

```typescript
// supabase/functions/bgv-webhook/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
};

interface BGVWebhookPayload {
  reference_id: string;       // Our verification_id
  provider_id: string;        // Provider's ID
  event_type: 'status_update' | 'check_completed' | 'verification_completed';
  status: 'in_progress' | 'completed' | 'failed' | 'requires_action';
  checks?: Array<{
    type: string;
    status: string;
    result?: 'clear' | 'discrepancy' | 'unable_to_verify';
    details?: Record<string, unknown>;
  }>;
  completed_at?: string;
  report_url?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify webhook signature (provider-specific)
    const signature = req.headers.get('x-webhook-signature');
    // Add signature verification logic here based on your BGV provider

    const payload: BGVWebhookPayload = await req.json();

    console.log('[bgv-webhook] Received:', {
      reference_id: payload.reference_id,
      event_type: payload.event_type,
      status: payload.status
    });

    // Find BGV request by verification_id
    const { data: bgvRequest, error: findError } = await supabase
      .from('bgv_requests')
      .select('*')
      .eq('verification_id', payload.reference_id)
      .single();

    if (findError || !bgvRequest) {
      throw new Error('BGV request not found: ' + payload.reference_id);
    }

    // Update BGV request status
    const updateData: Record<string, unknown> = {
      status: payload.status,
      last_updated_at: new Date().toISOString()
    };

    if (payload.checks) {
      updateData.verification_results = payload.checks;
    }

    if (payload.completed_at) {
      updateData.completed_at = payload.completed_at;
    }

    if (payload.report_url) {
      updateData.report_url = payload.report_url;
    }

    const { error: updateError } = await supabase
      .from('bgv_requests')
      .update(updateData)
      .eq('id', bgvRequest.id);

    if (updateError) throw updateError;

    // Send notification if verification completed
    if (payload.event_type === 'verification_completed') {
      const hasDiscrepancy = payload.checks?.some(c => c.result === 'discrepancy');
      
      await supabase.functions.invoke('send-notification', {
        body: {
          title: `BGV ${hasDiscrepancy ? 'Completed with Issues' : 'Completed'}`,
          message: `Background verification for employee completed. ${hasDiscrepancy ? 'Review required.' : 'All clear.'}`,
          notification_type: hasDiscrepancy ? 'warning' : 'success',
          category: 'users',
          action_url: `/tenant/bgv/${bgvRequest.id}`
        }
      });
    }

    console.log('[bgv-webhook] Updated BGV request:', bgvRequest.id);

    return new Response(
      JSON.stringify({ success: true, received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[bgv-webhook] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

#### Usage Examples

```typescript
// Initiate comprehensive BGV
await supabase.functions.invoke('initiate-bgv', {
  body: {
    tenant_id: 'tenant-uuid',
    employee_id: 'employee-uuid',
    verification_types: ['identity', 'address', 'education', 'employment', 'criminal'],
    priority: 'normal',
    documents: {
      aadhaar: 'XXXX-XXXX-1234',
      pan: 'ABCDE1234F'
    }
  }
});

// Initiate urgent BGV for senior hire
await supabase.functions.invoke('initiate-bgv', {
  body: {
    tenant_id: 'tenant-uuid',
    employee_id: 'employee-uuid',
    verification_types: ['identity', 'employment', 'education', 'reference', 'credit'],
    priority: 'urgent',
    callback_url: 'https://your-domain.com/api/bgv-callback'
  }
});
```

---

## SSO Authentication Functions

### 8. sso-initiate

**Purpose**: Initiates SSO authentication flow for Google, Microsoft, or SAML providers.

**Endpoint**: `POST /functions/v1/sso-initiate`

**File**: `supabase/functions/sso-initiate/index.ts`

#### Required Secrets

| Secret | Description |
|--------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `MICROSOFT_CLIENT_ID` | Microsoft/Entra ID Client ID |
| `MICROSOFT_CLIENT_SECRET` | Microsoft Client Secret |
| `SAML_IDP_METADATA_URL` | SAML Identity Provider metadata URL |

#### Request Payload

```typescript
interface SSOInitiatePayload {
  tenant_id: string;
  provider: 'google' | 'microsoft' | 'okta' | 'saml';
  redirect_uri: string;
  state?: string;           // CSRF protection
  login_hint?: string;      // Pre-fill email
}
```

#### Response

```typescript
interface SSOInitiateResponse {
  success: boolean;
  auth_url: string;         // Redirect user to this URL
  state: string;            // Store for verification
  expires_in: number;       // Seconds until state expires
}
```

#### Complete Implementation

```typescript
// supabase/functions/sso-initiate/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SSOInitiatePayload {
  tenant_id: string;
  provider: 'google' | 'microsoft' | 'okta' | 'saml';
  redirect_uri: string;
  state?: string;
  login_hint?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: SSOInitiatePayload = await req.json();

    if (!payload.tenant_id || !payload.provider || !payload.redirect_uri) {
      throw new Error('Missing required fields: tenant_id, provider, redirect_uri');
    }

    console.log('[sso-initiate] Starting SSO flow:', {
      tenant_id: payload.tenant_id,
      provider: payload.provider
    });

    // Fetch tenant SSO configuration
    const { data: tenant, error: tenantError } = await supabase
      .from('client_tenants')
      .select('id, name, settings')
      .eq('id', payload.tenant_id)
      .single();

    if (tenantError || !tenant) {
      throw new Error('Tenant not found');
    }

    // Generate state for CSRF protection
    const state = payload.state || crypto.randomUUID();
    const stateData = {
      tenant_id: payload.tenant_id,
      provider: payload.provider,
      redirect_uri: payload.redirect_uri,
      created_at: Date.now()
    };

    // Store state in database for verification
    await supabase
      .from('sso_states')
      .insert({
        state,
        data: stateData,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min
      });

    let authUrl: string;

    switch (payload.provider) {
      case 'google': {
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        if (!clientId) throw new Error('Google SSO not configured');

        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: payload.redirect_uri,
          response_type: 'code',
          scope: 'openid email profile',
          state,
          access_type: 'offline',
          prompt: 'select_account'
        });

        if (payload.login_hint) {
          params.set('login_hint', payload.login_hint);
        }

        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
        break;
      }

      case 'microsoft': {
        const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
        if (!clientId) throw new Error('Microsoft SSO not configured');

        const tenantSettings = tenant.settings as Record<string, unknown> || {};
        const azureTenant = tenantSettings.azure_tenant_id || 'common';

        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: payload.redirect_uri,
          response_type: 'code',
          scope: 'openid email profile User.Read',
          state,
          response_mode: 'query'
        });

        if (payload.login_hint) {
          params.set('login_hint', payload.login_hint);
        }

        authUrl = `https://login.microsoftonline.com/${azureTenant}/oauth2/v2.0/authorize?${params}`;
        break;
      }

      case 'okta': {
        const tenantSettings = tenant.settings as Record<string, unknown> || {};
        const oktaDomain = tenantSettings.okta_domain;
        const oktaClientId = tenantSettings.okta_client_id;

        if (!oktaDomain || !oktaClientId) {
          throw new Error('Okta SSO not configured for this tenant');
        }

        const params = new URLSearchParams({
          client_id: oktaClientId as string,
          redirect_uri: payload.redirect_uri,
          response_type: 'code',
          scope: 'openid email profile',
          state
        });

        authUrl = `https://${oktaDomain}/oauth2/default/v1/authorize?${params}`;
        break;
      }

      case 'saml': {
        // SAML requires different flow - redirect to SAML IDP
        const tenantSettings = tenant.settings as Record<string, unknown> || {};
        const samlIdpUrl = tenantSettings.saml_sso_url;

        if (!samlIdpUrl) {
          throw new Error('SAML SSO not configured for this tenant');
        }

        // Generate SAML AuthnRequest (simplified)
        const samlRequest = btoa(JSON.stringify({
          issuer: `https://atlas.cropxon.com/sso/metadata/${payload.tenant_id}`,
          destination: samlIdpUrl,
          id: state,
          issue_instant: new Date().toISOString()
        }));

        authUrl = `${samlIdpUrl}?SAMLRequest=${encodeURIComponent(samlRequest)}&RelayState=${state}`;
        break;
      }

      default:
        throw new Error('Unsupported SSO provider');
    }

    console.log('[sso-initiate] Generated auth URL for:', payload.provider);

    return new Response(
      JSON.stringify({
        success: true,
        auth_url: authUrl,
        state,
        expires_in: 600 // 10 minutes
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[sso-initiate] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### 9. sso-callback

**Purpose**: Handles OAuth/SAML callback, exchanges code for tokens, and creates/updates user session.

**Endpoint**: `POST /functions/v1/sso-callback`

**File**: `supabase/functions/sso-callback/index.ts`

```typescript
// supabase/functions/sso-callback/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SSOCallbackPayload {
  code: string;              // Authorization code from provider
  state: string;             // State for verification
  provider: 'google' | 'microsoft' | 'okta' | 'saml';
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: SSOCallbackPayload = await req.json();

    if (!payload.code || !payload.state) {
      throw new Error('Missing required fields: code, state');
    }

    console.log('[sso-callback] Processing callback:', {
      provider: payload.provider,
      state: payload.state.substring(0, 8) + '...'
    });

    // Verify state
    const { data: stateRecord, error: stateError } = await supabase
      .from('sso_states')
      .select('*')
      .eq('state', payload.state)
      .single();

    if (stateError || !stateRecord) {
      throw new Error('Invalid or expired state');
    }

    // Check expiry
    if (new Date(stateRecord.expires_at) < new Date()) {
      throw new Error('State expired');
    }

    const stateData = stateRecord.data;
    let userInfo: { email: string; name: string; picture?: string };

    // Exchange code for tokens based on provider
    switch (payload.provider) {
      case 'google': {
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID')!;
        const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')!;

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code: payload.code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: stateData.redirect_uri,
            grant_type: 'authorization_code'
          })
        });

        const tokens = await tokenResponse.json();
        if (tokens.error) throw new Error(tokens.error_description || tokens.error);

        // Get user info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { 'Authorization': `Bearer ${tokens.access_token}` }
        });

        userInfo = await userResponse.json();
        break;
      }

      case 'microsoft': {
        const clientId = Deno.env.get('MICROSOFT_CLIENT_ID')!;
        const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET')!;

        const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code: payload.code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: stateData.redirect_uri,
            grant_type: 'authorization_code',
            scope: 'openid email profile User.Read'
          })
        });

        const tokens = await tokenResponse.json();
        if (tokens.error) throw new Error(tokens.error_description || tokens.error);

        // Get user info from Microsoft Graph
        const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: { 'Authorization': `Bearer ${tokens.access_token}` }
        });

        const msUser = await userResponse.json();
        userInfo = {
          email: msUser.mail || msUser.userPrincipalName,
          name: msUser.displayName,
          picture: undefined
        };
        break;
      }

      default:
        throw new Error('SSO callback not implemented for: ' + payload.provider);
    }

    console.log('[sso-callback] User authenticated:', userInfo.email);

    // Check if user exists in tenant
    const { data: existingUser, error: userError } = await supabase
      .from('client_tenant_users')
      .select('*, profiles!inner(*)')
      .eq('tenant_id', stateData.tenant_id)
      .eq('profiles.email', userInfo.email)
      .single();

    let userId: string;
    let isNewUser = false;

    if (existingUser) {
      userId = existingUser.user_id;
    } else {
      // Create new user via Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userInfo.email,
        email_confirm: true,
        user_metadata: {
          full_name: userInfo.name,
          avatar_url: userInfo.picture,
          sso_provider: payload.provider
        }
      });

      if (authError) throw authError;
      userId = authUser.user!.id;
      isNewUser = true;

      // Add to tenant
      await supabase.from('client_tenant_users').insert({
        tenant_id: stateData.tenant_id,
        user_id: userId,
        role: 'employee'
      });

      // Create profile
      await supabase.from('profiles').insert({
        id: userId,
        email: userInfo.email,
        full_name: userInfo.name,
        tenant_id: stateData.tenant_id
      });
    }

    // Generate session
    const { data: session, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userInfo.email
    });

    if (sessionError) throw sessionError;

    // Delete used state
    await supabase.from('sso_states').delete().eq('state', payload.state);

    console.log('[sso-callback] Session created for:', userInfo.email);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userId,
          email: userInfo.email,
          name: userInfo.name,
          is_new: isNewUser
        },
        login_url: session.properties?.action_link,
        redirect_uri: stateData.redirect_uri
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[sso-callback] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

#### Usage Examples

```typescript
// Initiate Google SSO
const { data } = await supabase.functions.invoke('sso-initiate', {
  body: {
    tenant_id: 'tenant-uuid',
    provider: 'google',
    redirect_uri: 'https://atlas.cropxon.com/auth/callback'
  }
});

// Redirect user
window.location.href = data.auth_url;

// In callback page, handle the response
const { data: session } = await supabase.functions.invoke('sso-callback', {
  body: {
    code: urlParams.get('code'),
    state: urlParams.get('state'),
    provider: 'google'
  }
});

// Microsoft SSO for enterprise tenant
const { data } = await supabase.functions.invoke('sso-initiate', {
  body: {
    tenant_id: 'enterprise-tenant-uuid',
    provider: 'microsoft',
    redirect_uri: 'https://atlas.cropxon.com/auth/callback',
    login_hint: 'user@company.com'
  }
});
```

---

## Notification Categories & Types

### Categories

| Category | Icon | Use Case |
|----------|------|----------|
| `system` | ⚙️ | System updates, maintenance |
| `security` | 🔒 | Login attempts, threats |
| `billing` | 💳 | Invoices, payments |
| `users` | 👥 | User management |
| `projects` | 📁 | Project updates |
| `onboarding` | 🚀 | New client registrations |

### Types

| Type | Color | Description |
|------|-------|-------------|
| `info` | Blue | General updates |
| `success` | Green | Completed actions |
| `warning` | Yellow | Attention required |
| `error` | Red | Error occurred |
| `security` | Red | Security alerts |
| `billing` | Green | Payment notifications |

### Priority Levels

| Priority | Behavior |
|----------|----------|
| `low` | No special handling |
| `normal` | Default |
| `high` | Email sent immediately |
| `urgent` | Email + push + sound |

---

## Deployment

Edge functions deploy automatically when you push code. To manually deploy:

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy send-notification

# View logs
supabase functions logs send-notification
```

---

## Frontend Integration

### React Hook for Push Notifications

```typescript
// src/hooks/usePushNotifications.ts

import { useState, useEffect } from 'react';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const subscribe = async () => {
    if (!isSupported) return false;
    
    const result = await Notification.requestPermission();
    setPermission(result);
    setIsSubscribed(result === 'granted');
    return result === 'granted';
  };

  const unsubscribe = () => {
    setIsSubscribed(false);
  };

  return { isSupported, isSubscribed, permission, subscribe, unsubscribe };
}
```

### Service Worker

```javascript
// public/sw.js

self.addEventListener('push', function(event) {
  const data = event.data?.json() || {};
  
  const options = {
    body: data.message || 'New notification',
    icon: '/favicon.png',
    badge: '/favicon.png',
    vibrate: [100, 50, 100],
    data: { url: data.action_url || '/' },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'ATLAS', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    const url = event.notification.data?.url || '/';
    event.waitUntil(clients.openWindow(url));
  }
});
```

---

## Insurance Functions

### 10. process-insurance-claim

**Purpose**: Initiates and processes insurance claims for employees through integrated insurance providers.

**Endpoint**: `POST /functions/v1/process-insurance-claim`

**File**: `supabase/functions/process-insurance-claim/index.ts`

#### Required Secrets

| Secret | Description |
|--------|-------------|
| `INSURANCE_PROVIDER_API_KEY` | API key for insurance provider |
| `INSURANCE_PROVIDER_URL` | Insurance provider API endpoint |

#### Request Payload

```typescript
interface InsuranceClaimPayload {
  tenant_id: string;
  employee_id: string;
  claim_type: 'health' | 'dental' | 'vision' | 'life' | 'disability' | 'accident';
  claim_amount: number;
  claim_date: string;          // ISO date
  description: string;
  documents?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  hospital_details?: {
    name: string;
    address: string;
    admission_date?: string;
    discharge_date?: string;
  };
  policy_number?: string;
  priority?: 'normal' | 'urgent';
}
```

#### Response

```typescript
interface InsuranceClaimResponse {
  success: boolean;
  claim_id: string;
  reference_number: string;
  status: 'submitted' | 'pending_documents' | 'under_review';
  estimated_processing_days: number;
  next_steps?: string[];
}
```

#### Complete Implementation

```typescript
// supabase/functions/process-insurance-claim/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InsuranceClaimPayload {
  tenant_id: string;
  employee_id: string;
  claim_type: 'health' | 'dental' | 'vision' | 'life' | 'disability' | 'accident';
  claim_amount: number;
  claim_date: string;
  description: string;
  documents?: Array<{ name: string; url: string; type: string }>;
  hospital_details?: {
    name: string;
    address: string;
    admission_date?: string;
    discharge_date?: string;
  };
  policy_number?: string;
  priority?: 'normal' | 'urgent';
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const insuranceApiKey = Deno.env.get('INSURANCE_PROVIDER_API_KEY');
    const insuranceProviderUrl = Deno.env.get('INSURANCE_PROVIDER_URL') || 'https://api.insurance-provider.com/v1';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const payload: InsuranceClaimPayload = await req.json();

    // Validate required fields
    if (!payload.tenant_id || !payload.employee_id || !payload.claim_type || !payload.claim_amount) {
      throw new Error('Missing required fields: tenant_id, employee_id, claim_type, claim_amount');
    }

    console.log('[process-insurance-claim] Processing claim:', {
      tenant_id: payload.tenant_id,
      employee_id: payload.employee_id,
      claim_type: payload.claim_type,
      amount: payload.claim_amount
    });

    // Fetch employee and policy details
    const { data: employee, error: empError } = await supabase
      .from('employees')
      .select('id, name, email, insurance_policy_id')
      .eq('id', payload.employee_id)
      .eq('tenant_id', payload.tenant_id)
      .single();

    if (empError || !employee) {
      throw new Error('Employee not found or not in tenant');
    }

    // Generate unique claim reference
    const referenceNumber = `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Calculate estimated processing time
    const estimatedDays = payload.priority === 'urgent' ? 3 : 7;

    // Create claim record in database
    const { data: claim, error: insertError } = await supabase
      .from('insurance_claims')
      .insert({
        tenant_id: payload.tenant_id,
        employee_id: payload.employee_id,
        reference_number: referenceNumber,
        claim_type: payload.claim_type,
        claim_amount: payload.claim_amount,
        claim_date: payload.claim_date,
        description: payload.description,
        documents: payload.documents || [],
        hospital_details: payload.hospital_details || null,
        policy_number: payload.policy_number || employee.insurance_policy_id,
        status: 'submitted',
        priority: payload.priority || 'normal',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Submit to external insurance provider if configured
    let providerResponse = null;
    if (insuranceApiKey) {
      try {
        const externalResponse = await fetch(`${insuranceProviderUrl}/claims`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${insuranceApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reference_id: referenceNumber,
            policy_number: payload.policy_number,
            claim_type: payload.claim_type,
            amount: payload.claim_amount,
            claimant: {
              name: employee.name,
              email: employee.email
            },
            documents: payload.documents,
            hospital_details: payload.hospital_details
          })
        });

        providerResponse = await externalResponse.json();

        // Update with provider reference
        if (providerResponse.claim_id) {
          await supabase
            .from('insurance_claims')
            .update({
              provider_claim_id: providerResponse.claim_id,
              status: 'under_review'
            })
            .eq('id', claim.id);
        }

        console.log('[process-insurance-claim] Provider response:', providerResponse);
      } catch (providerError) {
        console.error('[process-insurance-claim] Provider call failed:', providerError);
      }
    }

    // Send notification to HR/Admin
    await supabase.functions.invoke('send-notification', {
      body: {
        title: 'New Insurance Claim Submitted',
        message: `${employee.name} submitted a ${payload.claim_type} claim for ₹${payload.claim_amount.toLocaleString()}`,
        notification_type: 'info',
        category: 'billing',
        action_url: `/tenant/insurance/claims/${claim.id}`
      }
    });

    // Determine next steps based on claim type
    const nextSteps = [];
    if (!payload.documents || payload.documents.length === 0) {
      nextSteps.push('Upload supporting documents (bills, prescriptions, discharge summary)');
    }
    if (payload.claim_type === 'health' && !payload.hospital_details) {
      nextSteps.push('Provide hospital/clinic details');
    }
    nextSteps.push('Claim will be reviewed within ' + estimatedDays + ' business days');

    return new Response(
      JSON.stringify({
        success: true,
        claim_id: claim.id,
        reference_number: referenceNumber,
        status: providerResponse ? 'under_review' : 'submitted',
        estimated_processing_days: estimatedDays,
        next_steps: nextSteps,
        provider_reference: providerResponse?.claim_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[process-insurance-claim] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### 11. insurance-claim-webhook

**Purpose**: Receives status updates from insurance provider and updates claim status.

**Endpoint**: `POST /functions/v1/insurance-claim-webhook`

**File**: `supabase/functions/insurance-claim-webhook/index.ts`

```typescript
// supabase/functions/insurance-claim-webhook/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
};

interface InsuranceWebhookPayload {
  reference_id: string;
  provider_claim_id: string;
  event_type: 'status_update' | 'approved' | 'rejected' | 'payment_processed' | 'documents_required';
  status: string;
  approved_amount?: number;
  rejection_reason?: string;
  payment_date?: string;
  payment_reference?: string;
  required_documents?: string[];
  notes?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: InsuranceWebhookPayload = await req.json();

    console.log('[insurance-claim-webhook] Received:', {
      reference_id: payload.reference_id,
      event_type: payload.event_type,
      status: payload.status
    });

    // Find claim by reference number
    const { data: claim, error: findError } = await supabase
      .from('insurance_claims')
      .select('*, employees(name, email)')
      .eq('reference_number', payload.reference_id)
      .single();

    if (findError || !claim) {
      throw new Error('Insurance claim not found: ' + payload.reference_id);
    }

    // Update claim based on event type
    const updateData: Record<string, unknown> = {
      status: payload.status,
      last_updated_at: new Date().toISOString()
    };

    if (payload.approved_amount !== undefined) {
      updateData.approved_amount = payload.approved_amount;
    }

    if (payload.rejection_reason) {
      updateData.rejection_reason = payload.rejection_reason;
    }

    if (payload.payment_date) {
      updateData.payment_date = payload.payment_date;
      updateData.payment_reference = payload.payment_reference;
    }

    if (payload.notes) {
      updateData.provider_notes = payload.notes;
    }

    const { error: updateError } = await supabase
      .from('insurance_claims')
      .update(updateData)
      .eq('id', claim.id);

    if (updateError) throw updateError;

    // Send notification based on event type
    let notificationTitle = 'Insurance Claim Update';
    let notificationType = 'info';
    let notificationMessage = '';

    switch (payload.event_type) {
      case 'approved':
        notificationTitle = 'Insurance Claim Approved';
        notificationType = 'success';
        notificationMessage = `Your ${claim.claim_type} claim has been approved for ₹${payload.approved_amount?.toLocaleString()}`;
        break;
      case 'rejected':
        notificationTitle = 'Insurance Claim Rejected';
        notificationType = 'error';
        notificationMessage = `Your ${claim.claim_type} claim was rejected. Reason: ${payload.rejection_reason}`;
        break;
      case 'payment_processed':
        notificationTitle = 'Insurance Payment Processed';
        notificationType = 'success';
        notificationMessage = `Payment of ₹${payload.approved_amount?.toLocaleString()} has been processed for your ${claim.claim_type} claim`;
        break;
      case 'documents_required':
        notificationTitle = 'Documents Required';
        notificationType = 'warning';
        notificationMessage = `Additional documents required for your ${claim.claim_type} claim: ${payload.required_documents?.join(', ')}`;
        break;
      default:
        notificationMessage = `Your ${claim.claim_type} claim status updated to: ${payload.status}`;
    }

    // Notify employee
    await supabase.functions.invoke('send-notification', {
      body: {
        title: notificationTitle,
        message: notificationMessage,
        notification_type: notificationType,
        category: 'billing',
        target_admin_id: claim.employee_id,
        action_url: `/portal/insurance/claims/${claim.id}`
      }
    });

    // Send email for important updates
    if (['approved', 'rejected', 'payment_processed'].includes(payload.event_type)) {
      await supabase.functions.invoke('send-notification', {
        body: {
          title: notificationTitle,
          message: notificationMessage,
          notification_type: notificationType,
          send_email: true,
          email_recipient: claim.employees?.email
        }
      });
    }

    console.log('[insurance-claim-webhook] Updated claim:', claim.id);

    return new Response(
      JSON.stringify({ success: true, received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[insurance-claim-webhook] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

#### Usage Examples

```typescript
// Submit health insurance claim
await supabase.functions.invoke('process-insurance-claim', {
  body: {
    tenant_id: 'tenant-uuid',
    employee_id: 'employee-uuid',
    claim_type: 'health',
    claim_amount: 25000,
    claim_date: '2025-12-01',
    description: 'Hospitalization for surgery',
    hospital_details: {
      name: 'Apollo Hospital',
      address: 'Chennai',
      admission_date: '2025-11-28',
      discharge_date: '2025-12-01'
    },
    documents: [
      { name: 'Discharge Summary', url: 'https://...', type: 'pdf' },
      { name: 'Bills', url: 'https://...', type: 'pdf' }
    ],
    priority: 'normal'
  }
});

// Urgent dental claim
await supabase.functions.invoke('process-insurance-claim', {
  body: {
    tenant_id: 'tenant-uuid',
    employee_id: 'employee-uuid',
    claim_type: 'dental',
    claim_amount: 8000,
    claim_date: '2025-12-05',
    description: 'Root canal treatment',
    priority: 'urgent'
  }
});
```

---

## Document Verification Functions

### 12. verify-document

**Purpose**: Initiates document verification (Aadhaar, PAN, Passport, Driving License, etc.) through verification providers.

**Endpoint**: `POST /functions/v1/verify-document`

**File**: `supabase/functions/verify-document/index.ts`

#### Required Secrets

| Secret | Description |
|--------|-------------|
| `DOCUMENT_VERIFY_API_KEY` | API key for document verification provider (IDFY, Digio, etc.) |
| `DOCUMENT_VERIFY_URL` | Verification provider API endpoint |

#### Request Payload

```typescript
interface VerifyDocumentPayload {
  tenant_id: string;
  employee_id?: string;           // Optional: link to employee
  reference_type: 'employee' | 'vendor' | 'candidate' | 'other';
  reference_id: string;
  document_type: 'aadhaar' | 'pan' | 'passport' | 'driving_license' | 'voter_id' | 'bank_account' | 'gst' | 'company_pan';
  document_number: string;
  additional_data?: {
    name?: string;                 // For name match verification
    dob?: string;                  // For DOB verification
    father_name?: string;
    address?: string;
  };
  consent?: {
    purpose: string;
    timestamp: string;
    ip_address?: string;
  };
}
```

#### Response

```typescript
interface VerifyDocumentResponse {
  success: boolean;
  verification_id: string;
  status: 'initiated' | 'pending' | 'verified' | 'failed';
  result?: {
    is_valid: boolean;
    name_match?: boolean;
    dob_match?: boolean;
    details?: Record<string, unknown>;
  };
  message?: string;
}
```

#### Complete Implementation

```typescript
// supabase/functions/verify-document/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyDocumentPayload {
  tenant_id: string;
  employee_id?: string;
  reference_type: 'employee' | 'vendor' | 'candidate' | 'other';
  reference_id: string;
  document_type: 'aadhaar' | 'pan' | 'passport' | 'driving_license' | 'voter_id' | 'bank_account' | 'gst' | 'company_pan';
  document_number: string;
  additional_data?: {
    name?: string;
    dob?: string;
    father_name?: string;
    address?: string;
  };
  consent?: {
    purpose: string;
    timestamp: string;
    ip_address?: string;
  };
}

// Mask sensitive document numbers for logging
function maskDocumentNumber(docType: string, docNumber: string): string {
  if (!docNumber) return '';
  const len = docNumber.length;
  if (len <= 4) return '****';
  return docNumber.substring(0, 2) + '*'.repeat(len - 4) + docNumber.substring(len - 2);
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const verifyApiKey = Deno.env.get('DOCUMENT_VERIFY_API_KEY');
    const verifyProviderUrl = Deno.env.get('DOCUMENT_VERIFY_URL') || 'https://api.idfy.com/v3';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const payload: VerifyDocumentPayload = await req.json();

    // Validate required fields
    if (!payload.tenant_id || !payload.document_type || !payload.document_number || !payload.reference_id) {
      throw new Error('Missing required fields: tenant_id, document_type, document_number, reference_id');
    }

    // Validate consent for Aadhaar (mandatory in India)
    if (payload.document_type === 'aadhaar' && !payload.consent) {
      throw new Error('Consent is mandatory for Aadhaar verification');
    }

    console.log('[verify-document] Starting verification:', {
      tenant_id: payload.tenant_id,
      document_type: payload.document_type,
      masked_number: maskDocumentNumber(payload.document_type, payload.document_number),
      reference_type: payload.reference_type
    });

    // Generate verification ID
    const verificationId = `VRF-${payload.document_type.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // Create verification record
    const { data: verification, error: insertError } = await supabase
      .from('document_verifications')
      .insert({
        tenant_id: payload.tenant_id,
        employee_id: payload.employee_id,
        verification_id: verificationId,
        reference_type: payload.reference_type,
        reference_id: payload.reference_id,
        document_type: payload.document_type,
        document_number_masked: maskDocumentNumber(payload.document_type, payload.document_number),
        status: 'initiated',
        consent_data: payload.consent,
        initiated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Call external verification provider
    let verificationResult = null;
    if (verifyApiKey) {
      try {
        // Build verification request based on document type
        const verifyRequest: Record<string, unknown> = {
          task_id: verificationId,
          group_id: payload.tenant_id,
        };

        // Configure based on document type
        switch (payload.document_type) {
          case 'aadhaar':
            verifyRequest.essentials = {
              aadhaar_number: payload.document_number,
              consent: payload.consent?.purpose || 'Employment verification',
              consent_timestamp: payload.consent?.timestamp || new Date().toISOString()
            };
            break;
          case 'pan':
            verifyRequest.essentials = {
              pan_number: payload.document_number,
              name: payload.additional_data?.name,
              dob: payload.additional_data?.dob
            };
            break;
          case 'bank_account':
            verifyRequest.essentials = {
              account_number: payload.document_number,
              ifsc: payload.additional_data?.['ifsc'],
              name: payload.additional_data?.name
            };
            break;
          default:
            verifyRequest.essentials = {
              document_number: payload.document_number,
              name: payload.additional_data?.name
            };
        }

        const verifyResponse = await fetch(`${verifyProviderUrl}/tasks/sync/verify/${payload.document_type}`, {
          method: 'POST',
          headers: {
            'api-key': verifyApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(verifyRequest)
        });

        verificationResult = await verifyResponse.json();

        // Update verification record with result
        const isValid = verificationResult.result?.valid === true || 
                       verificationResult.result?.status === 'verified';

        await supabase
          .from('document_verifications')
          .update({
            status: isValid ? 'verified' : 'failed',
            is_valid: isValid,
            verification_result: verificationResult.result,
            provider_task_id: verificationResult.task_id,
            completed_at: new Date().toISOString()
          })
          .eq('id', verification.id);

        console.log('[verify-document] Verification completed:', {
          verification_id: verificationId,
          is_valid: isValid
        });

        return new Response(
          JSON.stringify({
            success: true,
            verification_id: verificationId,
            status: isValid ? 'verified' : 'failed',
            result: {
              is_valid: isValid,
              name_match: verificationResult.result?.name_match,
              dob_match: verificationResult.result?.dob_match,
              details: verificationResult.result
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (providerError) {
        console.error('[verify-document] Provider error:', providerError);
        
        // Update status to pending for manual review
        await supabase
          .from('document_verifications')
          .update({
            status: 'pending',
            error_message: providerError.message
          })
          .eq('id', verification.id);
      }
    }

    // Return pending status if no provider configured or provider failed
    return new Response(
      JSON.stringify({
        success: true,
        verification_id: verificationId,
        status: 'pending',
        message: 'Verification initiated. Manual review may be required.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[verify-document] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### 13. document-ocr-extract

**Purpose**: Extracts data from uploaded document images using OCR and AI.

**Endpoint**: `POST /functions/v1/document-ocr-extract`

**File**: `supabase/functions/document-ocr-extract/index.ts`

```typescript
// supabase/functions/document-ocr-extract/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OCRExtractPayload {
  tenant_id: string;
  document_url: string;          // URL of uploaded document image
  document_type: 'aadhaar' | 'pan' | 'passport' | 'driving_license' | 'bank_statement' | 'payslip' | 'offer_letter' | 'other';
  extract_fields?: string[];     // Specific fields to extract
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ocrApiKey = Deno.env.get('OCR_API_KEY'); // Can use Google Vision, AWS Textract, etc.
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const payload: OCRExtractPayload = await req.json();

    if (!payload.tenant_id || !payload.document_url || !payload.document_type) {
      throw new Error('Missing required fields: tenant_id, document_url, document_type');
    }

    console.log('[document-ocr-extract] Processing:', {
      tenant_id: payload.tenant_id,
      document_type: payload.document_type
    });

    // Define expected fields based on document type
    const fieldMappings: Record<string, string[]> = {
      aadhaar: ['aadhaar_number', 'name', 'dob', 'gender', 'address'],
      pan: ['pan_number', 'name', 'father_name', 'dob'],
      passport: ['passport_number', 'name', 'nationality', 'dob', 'issue_date', 'expiry_date', 'place_of_birth'],
      driving_license: ['license_number', 'name', 'dob', 'issue_date', 'validity', 'blood_group', 'vehicle_class'],
      bank_statement: ['account_number', 'account_holder', 'bank_name', 'ifsc', 'opening_balance', 'closing_balance'],
      payslip: ['employee_name', 'employee_id', 'month', 'gross_salary', 'deductions', 'net_salary'],
      offer_letter: ['candidate_name', 'position', 'salary', 'joining_date', 'company_name'],
      other: ['text_content']
    };

    const fieldsToExtract = payload.extract_fields || fieldMappings[payload.document_type] || ['text_content'];

    // For demo/development, return mock extracted data
    // In production, integrate with OCR provider (Google Vision, AWS Textract, IDFY OCR)
    let extractedData: Record<string, unknown> = {};
    
    if (ocrApiKey) {
      // Call OCR provider API
      // Example with Google Vision API
      try {
        const ocrResponse = await fetch('https://vision.googleapis.com/v1/images:annotate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ocrApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [{
              image: { source: { imageUri: payload.document_url } },
              features: [
                { type: 'TEXT_DETECTION' },
                { type: 'DOCUMENT_TEXT_DETECTION' }
              ]
            }]
          })
        });

        const ocrResult = await ocrResponse.json();
        const fullText = ocrResult.responses?.[0]?.fullTextAnnotation?.text || '';
        
        // Parse extracted text based on document type
        extractedData = parseDocumentText(fullText, payload.document_type, fieldsToExtract);
        
      } catch (ocrError) {
        console.error('[document-ocr-extract] OCR error:', ocrError);
        throw new Error('OCR extraction failed');
      }
    } else {
      // Mock data for development
      extractedData = {
        raw_text: 'OCR provider not configured. Please set OCR_API_KEY.',
        fields_requested: fieldsToExtract,
        status: 'mock'
      };
    }

    // Store extraction result
    const { data: extraction, error: insertError } = await supabase
      .from('document_extractions')
      .insert({
        tenant_id: payload.tenant_id,
        document_url: payload.document_url,
        document_type: payload.document_type,
        extracted_data: extractedData,
        confidence_score: extractedData.confidence || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('[document-ocr-extract] Insert error:', insertError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        extraction_id: extraction?.id,
        document_type: payload.document_type,
        extracted_data: extractedData,
        fields_extracted: Object.keys(extractedData)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[document-ocr-extract] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Parse OCR text based on document type
function parseDocumentText(
  text: string, 
  docType: string, 
  fields: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = { raw_text: text };
  
  // Document-specific parsing logic
  switch (docType) {
    case 'pan':
      // PAN number pattern: AAAAA0000A
      const panMatch = text.match(/[A-Z]{5}[0-9]{4}[A-Z]/);
      if (panMatch) result.pan_number = panMatch[0];
      break;
      
    case 'aadhaar':
      // Aadhaar pattern: 0000 0000 0000
      const aadhaarMatch = text.match(/\d{4}\s?\d{4}\s?\d{4}/);
      if (aadhaarMatch) result.aadhaar_number = aadhaarMatch[0].replace(/\s/g, '');
      break;
      
    // Add more document-specific parsing...
  }
  
  result.confidence = 0.85; // Example confidence score
  return result;
}
```

#### Usage Examples

```typescript
// Verify PAN card
await supabase.functions.invoke('verify-document', {
  body: {
    tenant_id: 'tenant-uuid',
    employee_id: 'employee-uuid',
    reference_type: 'employee',
    reference_id: 'employee-uuid',
    document_type: 'pan',
    document_number: 'ABCDE1234F',
    additional_data: {
      name: 'John Doe',
      dob: '1990-01-15'
    }
  }
});

// Verify Aadhaar with consent
await supabase.functions.invoke('verify-document', {
  body: {
    tenant_id: 'tenant-uuid',
    employee_id: 'employee-uuid',
    reference_type: 'employee',
    reference_id: 'employee-uuid',
    document_type: 'aadhaar',
    document_number: '123456789012',
    consent: {
      purpose: 'Employment background verification',
      timestamp: new Date().toISOString(),
      ip_address: '192.168.1.1'
    }
  }
});

// Bank account verification
await supabase.functions.invoke('verify-document', {
  body: {
    tenant_id: 'tenant-uuid',
    employee_id: 'employee-uuid',
    reference_type: 'employee',
    reference_id: 'employee-uuid',
    document_type: 'bank_account',
    document_number: '12345678901234',
    additional_data: {
      ifsc: 'HDFC0001234',
      name: 'John Doe'
    }
  }
});

// Extract data from uploaded PAN image
await supabase.functions.invoke('document-ocr-extract', {
  body: {
    tenant_id: 'tenant-uuid',
    document_url: 'https://storage.supabase.co/..../pan-card.jpg',
    document_type: 'pan'
  }
});
```

---

## Error Handling

All functions follow this error response pattern:

```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: "Error message", code: "ERROR_CODE" }
```

Common error codes:
- `MISSING_FIELDS` - Required fields not provided
- `UNAUTHORIZED` - Invalid or missing authentication
- `NOT_FOUND` - Resource not found
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Server error
- `PROVIDER_ERROR` - Third-party provider error
- `CONSENT_REQUIRED` - User consent not provided
- `DOCUMENT_INVALID` - Document validation failed

---

## Testing

Call functions locally:

```bash
# Start local Supabase
supabase start

# Test function
curl -X POST 'http://localhost:54321/functions/v1/send-notification' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -d '{"title":"Test","message":"Hello","notification_type":"info"}'

# Test insurance claim
curl -X POST 'http://localhost:54321/functions/v1/process-insurance-claim' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -d '{"tenant_id":"...","employee_id":"...","claim_type":"health","claim_amount":10000}'

# Test document verification
curl -X POST 'http://localhost:54321/functions/v1/verify-document' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -d '{"tenant_id":"...","document_type":"pan","document_number":"ABCDE1234F","reference_type":"employee","reference_id":"..."}'
```

---

## Security Considerations

1. **Never expose service role key** - Only use in Edge Functions
2. **Validate all inputs** - Use validation utilities
3. **Rate limit emails** - Use batch processing
4. **Log all actions** - For audit trail
5. **Use HTTPS only** - Enforced by Supabase
6. **Mask sensitive data** - Never log full document numbers
7. **Require consent** - Especially for Aadhaar verification (mandatory in India)
8. **Secure webhooks** - Validate signatures from external providers
9. **Encrypt stored data** - Use Supabase Vault for sensitive fields
10. **Audit trail** - Log all verification and claim activities

---

## Appendix: Complete Function List

| # | Function Name | Purpose | Category |
|---|--------------|---------|----------|
| 1 | `send-notification` | Create single notification | Notifications |
| 2 | `send-bulk-notifications` | Send to multiple users | Notifications |
| 3 | `send-welcome-email` | Welcome new clients | Email |
| 4 | `send-feature-unlock-email` | Feature unlock alerts | Email |
| 5 | `send-quote-followup` | Quote follow-up emails | Email |
| 6 | `generate-invoice-pdf` | Generate invoice PDFs | PDF |
| 7 | `run-payroll` | Process tenant payroll | Payroll |
| 8 | `initiate-bgv` | Start background check | BGV |
| 9 | `bgv-webhook` | BGV status updates | BGV |
| 10 | `sso-initiate` | Start SSO auth flow | SSO |
| 11 | `sso-callback` | Handle SSO callback | SSO |
| 12 | `process-insurance-claim` | Submit insurance claim | Insurance |
| 13 | `insurance-claim-webhook` | Claim status updates | Insurance |
| 14 | `verify-document` | Verify identity documents | Document |
| 15 | `document-ocr-extract` | Extract data from docs | Document |

---

*End of ATLAS Edge Functions Documentation*

*Last Updated: December 7, 2025 | Version 3.0.0*
