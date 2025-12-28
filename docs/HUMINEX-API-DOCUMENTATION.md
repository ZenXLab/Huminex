# ATLAS Edge Functions API Documentation

> **Last Updated:** December 9, 2025  
> **Version:** 1.0.0  
> **Total Functions:** 16

This document provides comprehensive documentation for all ATLAS Edge Functions, including request/response examples, authentication requirements, and usage patterns.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Headers](#common-headers)
4. [Functions Reference](#functions-reference)
   - [Notifications](#notifications)
   - [Email Services](#email-services)
   - [Payroll & HR](#payroll--hr)
   - [Documents & Files](#documents--files)
   - [Authentication & SSO](#authentication--sso)
   - [Analytics & AI](#analytics--ai)

---

## Overview

All ATLAS Edge Functions are deployed on Supabase Edge Functions and accessible via:

```
https://wnentybljoyjhizsdhrt.supabase.co/functions/v1/{function-name}
```

### Function Status Summary

| Function | Status | Auth Required | Category |
|----------|--------|---------------|----------|
| send-notification | ✅ Active | Yes | Notifications |
| send-bulk-notifications | ✅ Active | Yes | Notifications |
| send-welcome-email | ✅ Active | No | Email |
| send-feature-unlock-email | ✅ Active | No | Email |
| send-quote-followup | ✅ Active | No | Email |
| run-payroll | ✅ Active | Yes | Payroll |
| overtime-calculator | ✅ Active | Yes | Payroll |
| shift-scheduler | ✅ Active | Yes | Attendance |
| shift-swap-workflow | ✅ Active | Yes | Attendance |
| geofence-attendance | ✅ Active | Yes | Attendance |
| generate-invoice-pdf | ✅ Active | No | Documents |
| verify-document | ✅ Active | Yes | Documents |
| process-bgv | ✅ Active | Yes | HR |
| process-insurance-claim | ✅ Active | Yes | HR |
| sso-callback | ✅ Active | No | Authentication |
| predictive-analytics | ✅ Active | No | AI |

---

## Authentication

### JWT Authentication (Default)

Most functions require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Public Functions

Some functions are public (no auth required) for specific use cases:
- `send-welcome-email` - Called internally after admin approval
- `send-feature-unlock-email` - Called internally for feature notifications
- `send-quote-followup` - Called internally for CRM automation
- `generate-invoice-pdf` - Generates HTML invoice (token passed in body)
- `sso-callback` - Handles OAuth redirects
- `predictive-analytics` - Uses LOVABLE_API_KEY for AI gateway

---

## Common Headers

All requests should include these headers:

```http
Content-Type: application/json
apikey: <supabase-anon-key>
Authorization: Bearer <jwt-token>  # If auth required
```

### CORS Headers (Response)

All functions return CORS headers:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
```

---

## Functions Reference

---

## Notifications

### send-notification

Creates a notification in the database and optionally sends email/push notifications.

**Endpoint:** `POST /functions/v1/send-notification`  
**Auth Required:** Yes (JWT)

#### Request Payload

```typescript
interface NotificationPayload {
  // Required
  title: string;                    // Notification title
  message: string;                  // Notification body
  notification_type: string;        // Type: info|success|warning|error|security|system|billing|onboarding|feature

  // Optional
  target_admin_id?: string;         // Target specific admin (null = broadcast)
  category?: string;                // Category: system|security|billing|users|projects|onboarding
  priority?: string;                // Priority: low|normal|high|urgent
  action_url?: string;              // Link URL for notification
  send_email?: boolean;             // Send email notification
  send_push?: boolean;              // Send push notification (future)
  email_recipient?: string;         // Override email recipient
  metadata?: object;                // Additional metadata
}
```

#### Example Request

```javascript
// Simple notification
await supabase.functions.invoke('send-notification', {
  body: {
    title: 'New Quote Submitted',
    message: 'Client ABC Corp submitted a quote request for $5,000',
    notification_type: 'info',
    category: 'billing'
  }
});

// Security alert with email
await supabase.functions.invoke('send-notification', {
  body: {
    title: 'Failed Login Attempt',
    message: 'Multiple failed login attempts detected from IP 192.168.1.1',
    notification_type: 'security',
    category: 'security',
    priority: 'urgent',
    send_email: true,
    email_recipient: 'security@cropxon.com',
    metadata: { ip_address: '192.168.1.1', attempts: 5 }
  }
});
```

#### Response

```json
{
  "success": true,
  "notification": {
    "id": "uuid",
    "title": "New Quote Submitted",
    "message": "...",
    "notification_type": "info",
    "is_read": false,
    "created_at": "2025-12-09T10:00:00Z"
  },
  "email_sent": true,
  "push_sent": false,
  "metadata": { ... }
}
```

---

### send-bulk-notifications

Send notifications to multiple recipients at once.

**Endpoint:** `POST /functions/v1/send-bulk-notifications`  
**Auth Required:** Yes (JWT)

#### Request Payload

```typescript
interface BulkNotificationPayload {
  notifications: Array<{
    title: string;
    message: string;
    notification_type: string;
    target_admin_id?: string;
  }>;
  send_email?: boolean;
}
```

#### Example Request

```javascript
await supabase.functions.invoke('send-bulk-notifications', {
  body: {
    notifications: [
      { title: 'Update 1', message: 'Content 1', notification_type: 'info' },
      { title: 'Update 2', message: 'Content 2', notification_type: 'info' }
    ],
    send_email: false
  }
});
```

---

## Email Services

### send-welcome-email

Sends branded welcome email with login credentials to newly approved clients.

**Endpoint:** `POST /functions/v1/send-welcome-email`  
**Auth Required:** No (public, called internally)  
**Required Secrets:** `RESEND_API_KEY`

#### Request Payload

```typescript
interface WelcomeEmailRequest {
  clientEmail: string;        // Recipient email
  clientName: string;         // Client's name
  companyName: string;        // Company name
  temporaryPassword: string;  // Generated password
  tenantId?: string;          // Optional tenant ID
}
```

#### Example Request

```javascript
await supabase.functions.invoke('send-welcome-email', {
  body: {
    clientEmail: 'john@company.com',
    clientName: 'John Smith',
    companyName: 'Acme Corp',
    temporaryPassword: 'TempPass123!'
  }
});
```

#### Response

```json
{
  "success": true,
  "emailId": "resend-email-id"
}
```

---

### send-feature-unlock-email

Sends notification when a new feature is unlocked for a tenant.

**Endpoint:** `POST /functions/v1/send-feature-unlock-email`  
**Auth Required:** No (public)  
**Required Secrets:** `RESEND_API_KEY`

#### Request Payload

```typescript
interface FeatureUnlockEmailRequest {
  recipientEmail: string;
  recipientName: string;
  featureName: string;
  featureDescription: string;
  tenantName: string;
}
```

---

### send-quote-followup

Sends automated follow-up emails for quote requests.

**Endpoint:** `POST /functions/v1/send-quote-followup`  
**Auth Required:** No (public)  
**Required Secrets:** `RESEND_API_KEY`

#### Request Payload

```typescript
interface QuoteFollowupRequest {
  quoteId: string;
  clientEmail: string;
  clientName: string;
  quoteNumber: string;
  expiryDays?: number;
}
```

---

## Payroll & HR

### run-payroll

Process payroll runs, calculate salaries, deductions, and generate payslips.

**Endpoint:** `POST /functions/v1/run-payroll`  
**Auth Required:** Yes (JWT)  
**Required Tables:** payroll_runs, payslips, employees

#### Actions

| Action | Description |
|--------|-------------|
| `initiate` | Start a new payroll run |
| `calculate` | Calculate salaries for all employees |
| `approve` | Approve payroll run |
| `process` | Process and generate payslips |
| `get-summary` | Get payroll run summary |

#### Example: Initiate Payroll Run

```javascript
await supabase.functions.invoke('run-payroll', {
  body: {
    action: 'initiate',
    tenant_id: 'tenant-uuid',
    month: 12,
    year: 2025
  }
});
```

#### Response

```json
{
  "success": true,
  "payroll_run": {
    "id": "uuid",
    "run_number": "PR-202512-ABC123",
    "period_month": 12,
    "period_year": 2025,
    "status": "draft"
  },
  "message": "Payroll run PR-202512-ABC123 initiated successfully"
}
```

#### Example: Calculate Payroll

```javascript
await supabase.functions.invoke('run-payroll', {
  body: {
    action: 'calculate',
    tenant_id: 'tenant-uuid',
    payroll_run_id: 'payroll-run-uuid'
  }
});
```

#### Response

```json
{
  "success": true,
  "summary": {
    "employee_count": 50,
    "total_gross": 2500000,
    "total_deductions": 375000,
    "total_net": 2125000
  },
  "message": "Calculated payroll for 50 employees"
}
```

---

### process-bgv

Submit and track background verification requests.

**Endpoint:** `POST /functions/v1/process-bgv`  
**Auth Required:** Yes (JWT)  
**Required Tables:** bgv_requests, employees

#### Actions

| Action | Description |
|--------|-------------|
| `submit` | Submit new BGV request |
| `update-status` | Update BGV status |
| `get-status` | Get BGV request status |
| `list` | List all BGV requests for tenant |
| `complete` | Mark BGV as complete with results |

#### BGV Types

- `identity` - Identity verification
- `address` - Address verification
- `education` - Education verification
- `employment` - Employment history verification
- `criminal` - Criminal background check
- `credit` - Credit history check

#### Example: Submit BGV Request

```javascript
await supabase.functions.invoke('process-bgv', {
  body: {
    action: 'submit',
    tenant_id: 'tenant-uuid',
    employee_id: 'employee-uuid',
    verification_types: ['identity', 'address', 'employment'],
    priority: 'high'
  }
});
```

#### Response

```json
{
  "success": true,
  "bgv_request": {
    "id": "uuid",
    "request_number": "BGV-ABC123DEF",
    "verification_types": ["identity", "address", "employment"],
    "status": "pending",
    "expected_completion_date": "2025-12-16T10:00:00Z"
  },
  "message": "BGV request BGV-ABC123DEF submitted successfully"
}
```

---

### process-insurance-claim

Process and track insurance claims.

**Endpoint:** `POST /functions/v1/process-insurance-claim`  
**Auth Required:** Yes (JWT)

#### Actions

| Action | Description |
|--------|-------------|
| `submit` | Submit new claim |
| `approve` | Approve claim |
| `reject` | Reject claim |
| `get-status` | Get claim status |
| `list` | List all claims |

---

### overtime-calculator

Calculate overtime hours and pay.

**Endpoint:** `POST /functions/v1/overtime-calculator`  
**Auth Required:** Yes (JWT)

#### Request Payload

```typescript
interface OvertimeRequest {
  tenant_id: string;
  employee_id: string;
  date_from: string;
  date_to: string;
  overtime_rate?: number;  // Default: 1.5x
}
```

---

## Attendance & Scheduling

### shift-scheduler

Manage employee shift schedules.

**Endpoint:** `POST /functions/v1/shift-scheduler`  
**Auth Required:** Yes (JWT)

#### Actions

| Action | Description |
|--------|-------------|
| `create` | Create new shift |
| `update` | Update shift |
| `delete` | Delete shift |
| `get-schedule` | Get employee schedule |
| `get-team-schedule` | Get team schedule |

---

### shift-swap-workflow

Handle shift swap requests between employees.

**Endpoint:** `POST /functions/v1/shift-swap-workflow`  
**Auth Required:** Yes (JWT)

#### Actions

| Action | Description |
|--------|-------------|
| `request` | Request shift swap |
| `approve` | Approve swap request |
| `reject` | Reject swap request |
| `cancel` | Cancel swap request |

---

### geofence-attendance

Mark attendance using geolocation validation.

**Endpoint:** `POST /functions/v1/geofence-attendance`  
**Auth Required:** Yes (JWT)

#### Request Payload

```typescript
interface GeofenceAttendanceRequest {
  tenant_id: string;
  employee_id: string;
  latitude: number;
  longitude: number;
  action: 'check-in' | 'check-out';
  office_location_id?: string;
}
```

---

## Documents & Files

### generate-invoice-pdf

Generate professional HTML invoice from invoice data.

**Endpoint:** `POST /functions/v1/generate-invoice-pdf`  
**Auth Required:** No (public)

#### Request Payload

```typescript
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
```

#### Response

Returns HTML content with `Content-Type: text/html` that can be rendered or converted to PDF.

---

### verify-document

Verify document authenticity and extract metadata.

**Endpoint:** `POST /functions/v1/verify-document`  
**Auth Required:** Yes (JWT)

#### Request Payload

```typescript
interface VerifyDocumentRequest {
  document_url: string;
  document_type: 'id_proof' | 'address_proof' | 'education' | 'employment' | 'other';
  employee_id?: string;
}
```

---

## Authentication & SSO

### sso-callback

Handle SSO OAuth callbacks for Google, Microsoft, and Okta.

**Endpoint:** `POST /functions/v1/sso-callback`  
**Auth Required:** No (public - handles OAuth redirects)

#### Actions

| Action | Description |
|--------|-------------|
| `initiate` | Start SSO flow, return auth URL |
| `callback` | Handle OAuth callback with code |
| `validate-state` | Validate state token |

#### Supported Providers

- `google` - Google Workspace
- `microsoft` - Microsoft Entra ID / Azure AD
- `okta` - Okta

#### Example: Initiate SSO

```javascript
await supabase.functions.invoke('sso-callback', {
  body: {
    action: 'initiate',
    provider: 'google',
    tenant_id: 'tenant-uuid',
    redirect_uri: 'https://app.cropxon.com/auth/callback'
  }
});
```

#### Response

```json
{
  "success": true,
  "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "state": "state-token-uuid",
  "expires_at": "2025-12-09T10:10:00Z"
}
```

---

## Analytics & AI

### predictive-analytics

AI-powered predictive analytics using Lovable AI gateway.

**Endpoint:** `POST /functions/v1/predictive-analytics`  
**Auth Required:** No (uses LOVABLE_API_KEY)  
**Required Secrets:** `LOVABLE_API_KEY`

#### Prediction Types

| Type | Description |
|------|-------------|
| `mrr_forecast` | MRR/revenue forecasting for next 6 months |
| `churn_risk` | Tenant churn risk assessment |
| `conversion_optimization` | Conversion funnel optimization suggestions |

#### Example: MRR Forecast

```javascript
await supabase.functions.invoke('predictive-analytics', {
  body: {
    type: 'mrr_forecast',
    historicalData: {
      months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      mrr: [45000, 48000, 52000, 55000, 58000, 62000]
    }
  }
});
```

#### Response

```json
{
  "type": "mrr_forecast",
  "result": {
    "predictions": [
      { "month": "Jan", "predicted_mrr": 65000, "confidence": 0.85, "growth_rate": 4.8 },
      { "month": "Feb", "predicted_mrr": 68000, "confidence": 0.82, "growth_rate": 4.6 }
    ],
    "trend": "growing",
    "insights": [
      "Strong month-over-month growth pattern",
      "Q1 typically shows acceleration"
    ],
    "risk_factors": [
      "Seasonal slowdown possible in February"
    ]
  },
  "generated_at": "2025-12-09T10:00:00Z"
}
```

#### Example: Churn Risk Analysis

```javascript
await supabase.functions.invoke('predictive-analytics', {
  body: {
    type: 'churn_risk',
    historicalData: {
      tenants: [
        { id: 'tenant-1', login_frequency: 2, support_tickets: 5, payment_delays: 0 },
        { id: 'tenant-2', login_frequency: 15, support_tickets: 1, payment_delays: 0 }
      ]
    }
  }
});
```

---

## Error Handling

All functions return errors in a consistent format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing/invalid auth |
| 402 | Payment Required - AI quota exceeded |
| 429 | Rate Limited - Too many requests |
| 500 | Internal Server Error |

---

## Required Secrets

The following secrets must be configured in Supabase:

| Secret | Required By | Description |
|--------|-------------|-------------|
| `SUPABASE_URL` | All functions | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | All functions | Service role key for admin operations |
| `SUPABASE_ANON_KEY` | Client calls | Anonymous key for API access |
| `RESEND_API_KEY` | Email functions | Resend API key for email delivery |
| `LOVABLE_API_KEY` | predictive-analytics | Lovable AI gateway key |

---

## Rate Limits

- Standard functions: 100 requests/minute per IP
- AI functions: Subject to Lovable AI gateway limits
- Email functions: Subject to Resend API limits

---

## Changelog

### v1.0.0 (December 9, 2025)
- Initial documentation release
- 16 edge functions documented
- All request/response examples included
