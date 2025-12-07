# ATLAS Realtime Notifications - Edge Functions Documentation

> **Last Updated**: December 2024  
> **Version**: 2.0  
> **Author**: CropXon ATLAS Team

## Overview

The ATLAS notification system provides real-time alerts across multiple channels:
- **Database notifications** via Supabase Realtime
- **Email notifications** via Resend
- **Browser push notifications** via Service Worker
- **Desktop alerts** with sound

---

## Edge Functions

### 1. send-notification

**Purpose**: Creates a single notification and optionally sends email/push.

**Endpoint**: `POST /functions/v1/send-notification`

**File**: `supabase/functions/send-notification/index.ts`

#### Request Payload

```typescript
interface NotificationPayload {
  title: string;              // Required: Notification title
  message: string;            // Required: Notification message
  notification_type: string;  // Required: info|success|warning|error|security|billing
  category?: string;          // Optional: system|security|billing|users|projects|onboarding
  target_admin_id?: string;   // Optional: Specific admin UUID (null = broadcast)
  priority?: string;          // Optional: low|normal|high|urgent (default: normal)
  action_url?: string;        // Optional: Link URL
  send_email?: boolean;       // Optional: Send email notification
  send_push?: boolean;        // Optional: Send push notification
  email_recipient?: string;   // Optional: Override email address
  metadata?: object;          // Optional: Additional data
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

## Notification Categories

| Category | Icon | Use Case |
|----------|------|----------|
| system | ⚙️ | System updates, maintenance |
| security | 🔒 | Login attempts, threats |
| billing | 💳 | Invoices, payments |
| users | 👥 | User management |
| projects | 📁 | Project updates |
| onboarding | 🚀 | New client registrations |

## Notification Types

| Type | Color | Description |
|------|-------|-------------|
| info | Blue | General updates |
| success | Green | Completed actions |
| warning | Yellow | Attention required |
| error | Red | Error occurred |
| security | Red | Security alerts |
| billing | Green | Payment notifications |

## Priority Levels

| Priority | Behavior |
|----------|----------|
| low | No special handling |
| normal | Default |
| high | Email sent immediately |
| urgent | Email + push + sound |

---

## Environment Variables

```bash
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
```

---

## Database Schema

```sql
-- admin_notifications table
CREATE TABLE public.admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL DEFAULT 'info',
  target_admin_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;
```

---

## Frontend Integration

The admin panel uses:
- `AdminNotificationSystem` - Full notification management with category filtering
- `AdminNotificationBell` - Header notification bell with unread count
- `usePushNotifications` hook - Browser push subscription
- `useNotificationSound` hook - Audio alerts

## Service Worker

The `public/sw.js` handles push notifications and click events for desktop alerts.
