# ATLAS Edge Functions Documentation

> **Version**: 2.0.0  
> **Last Updated**: December 2024  
> **Author**: CropXon ATLAS Team

## Overview

This document contains all Edge Functions for the ATLAS platform. Edge Functions run on Supabase's edge runtime (Deno) and handle:
- Email notifications
- PDF generation
- Background processing
- Third-party integrations
- Multi-tenant operations

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Required Secrets](#required-secrets)
3. [Shared Utilities](#shared-utilities)
4. [Notification Functions](#notification-functions)
5. [Email Functions](#email-functions)
6. [PDF Generation Functions](#pdf-generation-functions)
7. [Usage Examples](#usage-examples)

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
```

---

## Security Considerations

1. **Never expose service role key** - Only use in Edge Functions
2. **Validate all inputs** - Use validation utilities
3. **Rate limit emails** - Use batch processing
4. **Log all actions** - For audit trail
5. **Use HTTPS only** - Enforced by Supabase

---

*End of ATLAS Edge Functions Documentation*
