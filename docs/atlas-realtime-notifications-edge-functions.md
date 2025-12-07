# ATLAS Realtime Notifications - Edge Functions Documentation

This document describes the backend edge functions required for the ATLAS realtime notification system.

## Overview

The notification system supports:
- Real-time push notifications via Supabase Realtime
- Email notifications via Resend
- Browser push notifications (future)
- SMS notifications via Twilio (future)

## Database Schema

The notification system uses the `admin_notifications` table in the public schema:

```sql
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL DEFAULT 'info',
  target_admin_id UUID REFERENCES auth.users(id),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB,
  priority TEXT DEFAULT 'normal',
  action_url TEXT,
  action_label TEXT
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view their notifications" 
ON public.admin_notifications 
FOR SELECT 
USING (target_admin_id = auth.uid() OR target_admin_id IS NULL);

CREATE POLICY "System can insert notifications" 
ON public.admin_notifications 
FOR INSERT 
WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;
```

## Edge Functions

### 1. send-notification

Creates a notification and optionally sends email/push.

**File: `supabase/functions/send-notification/index.ts`**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  title: string;
  message: string;
  notification_type: 'info' | 'success' | 'warning' | 'security' | 'feature_unlock';
  target_admin_id?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  action_url?: string;
  action_label?: string;
  send_email?: boolean;
  send_push?: boolean;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: NotificationPayload = await req.json();

    // Insert notification into database
    const { data: notification, error: dbError } = await supabase
      .from('admin_notifications')
      .insert({
        title: payload.title,
        message: payload.message,
        notification_type: payload.notification_type,
        target_admin_id: payload.target_admin_id || null,
        priority: payload.priority || 'normal',
        action_url: payload.action_url,
        action_label: payload.action_label,
        metadata: payload.metadata
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Send email notification if requested
    if (payload.send_email && payload.target_admin_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', payload.target_admin_id)
        .single();

      if (profile?.email) {
        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        if (resendApiKey) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'ATLAS Notifications <notifications@cropxon.com>',
              to: profile.email,
              subject: `[ATLAS] ${payload.title}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #00363D;">${payload.title}</h2>
                  <p style="color: #666;">${payload.message}</p>
                  ${payload.action_url ? `
                    <a href="${payload.action_url}" style="display: inline-block; padding: 12px 24px; background: #00A6A6; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
                      ${payload.action_label || 'View Details'}
                    </a>
                  ` : ''}
                  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                  <p style="color: #999; font-size: 12px;">
                    This notification was sent by ATLAS. 
                    <a href="https://atlas.cropxon.com/admin/settings">Manage preferences</a>
                  </p>
                </div>
              `
            }),
          });
        }
      }
    }

    console.log('Notification created:', notification.id);

    return new Response(
      JSON.stringify({ success: true, notification }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### 2. send-bulk-notifications

Sends notifications to multiple admins or all admins.

**File: `supabase/functions/send-bulk-notifications/index.ts`**

```typescript
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
  target_admin_ids?: string[];
  target_all_admins?: boolean;
  send_email?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: BulkNotificationPayload = await req.json();

    let adminIds: string[] = payload.target_admin_ids || [];

    // Get all admin IDs if targeting all
    if (payload.target_all_admins) {
      const { data: admins } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      adminIds = (admins || []).map(a => a.user_id);
    }

    // Insert notifications for each admin
    const notifications = adminIds.map(adminId => ({
      title: payload.title,
      message: payload.message,
      notification_type: payload.notification_type,
      target_admin_id: adminId,
    }));

    const { data, error } = await supabase
      .from('admin_notifications')
      .insert(notifications)
      .select();

    if (error) throw error;

    console.log(`Sent ${data.length} notifications`);

    return new Response(
      JSON.stringify({ success: true, count: data.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### 3. notification-triggers (Database Triggers)

Automatic notifications on system events.

```sql
-- Function to create notification on new onboarding
CREATE OR REPLACE FUNCTION notify_new_onboarding()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (title, message, notification_type, metadata)
  VALUES (
    'New Onboarding Request',
    format('New client %s has started onboarding', NEW.full_name),
    'info',
    jsonb_build_object('onboarding_id', NEW.id, 'client_name', NEW.full_name)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for onboarding
CREATE TRIGGER on_new_onboarding
  AFTER INSERT ON onboarding_sessions
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_onboarding();

-- Function to notify on invoice payment
CREATE OR REPLACE FUNCTION notify_invoice_paid()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    INSERT INTO admin_notifications (title, message, notification_type, priority, metadata)
    VALUES (
      'Invoice Paid',
      format('Invoice %s has been paid', NEW.invoice_number),
      'success',
      'high',
      jsonb_build_object('invoice_id', NEW.id, 'amount', NEW.total_amount)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for invoice payment
CREATE TRIGGER on_invoice_paid
  AFTER UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION notify_invoice_paid();

-- Security alert notification
CREATE OR REPLACE FUNCTION notify_security_alert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.action = 'login_failed' THEN
    INSERT INTO admin_notifications (title, message, notification_type, priority, metadata)
    VALUES (
      'Security Alert',
      format('Failed login attempt from IP %s', NEW.ip_address),
      'security',
      'urgent',
      jsonb_build_object('ip_address', NEW.ip_address, 'user_agent', NEW.user_agent)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Frontend Integration

The frontend uses the `useNotifications` hook and `AdminNotificationBell` component for:
- Fetching notifications from database
- Listening to realtime inserts via Supabase Realtime
- Marking notifications as read
- Displaying unread count badge

## Email Templates

Email notifications are sent via Resend with branded HTML templates matching ATLAS design.

## Environment Variables Required

- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations
- `RESEND_API_KEY`: Resend API key for email delivery
- `TWILIO_ACCOUNT_SID`: (Future) Twilio for SMS
- `TWILIO_AUTH_TOKEN`: (Future) Twilio auth token

## Notification Types

| Type | Color | Use Case |
|------|-------|----------|
| info | Blue | General updates |
| success | Green | Completed actions |
| warning | Yellow | Attention required |
| security | Red | Security alerts |
| feature_unlock | Purple | New feature available |

## Priority Levels

| Priority | Behavior |
|----------|----------|
| low | No special handling |
| normal | Default |
| high | Email sent immediately |
| urgent | Email + push notification |
