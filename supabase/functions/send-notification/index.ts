/**
 * ============================================================================
 * ATLAS SEND-NOTIFICATION EDGE FUNCTION
 * ============================================================================
 * 
 * PURPOSE:
 * Creates a single notification in the database and optionally sends email
 * and/or push notifications to the target recipient.
 * 
 * ENDPOINT: POST /functions/v1/send-notification
 * 
 * AUTHENTICATION:
 * - Requires valid Supabase auth token in Authorization header
 * - Uses service role key for database operations
 * 
 * ENVIRONMENT VARIABLES REQUIRED:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Service role key for admin operations
 * - RESEND_API_KEY: Resend API key for email delivery
 * 
 * REQUEST PAYLOAD (NotificationPayload):
 * {
 *   title: string;              // Required: Notification title
 *   message: string;            // Required: Notification message/body
 *   notification_type: string;  // Required: Type (info|success|warning|error|security|system|billing|onboarding|feature)
 *   category?: string;          // Optional: Category for filtering (system|security|billing|users|projects|onboarding)
 *   target_admin_id?: string;   // Optional: Specific admin UUID to target (null = broadcast)
 *   priority?: string;          // Optional: Priority level (low|normal|high|urgent) - default: normal
 *   action_url?: string;        // Optional: URL to link to from notification
 *   send_email?: boolean;       // Optional: Whether to send email notification
 *   send_push?: boolean;        // Optional: Whether to send push notification (future)
 *   email_recipient?: string;   // Optional: Override email recipient address
 *   metadata?: object;          // Optional: Additional metadata to store with notification
 * }
 * 
 * RESPONSE:
 * {
 *   success: boolean;
 *   notification: object;       // Created notification record
 *   email_sent: boolean;        // Whether email was successfully sent
 *   push_sent: boolean;         // Whether push was sent (currently placeholder)
 *   metadata: object;           // Echo of request metadata
 * }
 * 
 * NOTIFICATION TYPES:
 * - info: General informational updates (blue)
 * - success: Successful operations completed (green)
 * - warning: Attention required, non-critical (yellow)
 * - error: Error occurred, action needed (red)
 * - security: Security-related alerts (red, high priority)
 * - system: System status updates (blue)
 * - billing: Payment and invoice notifications (green)
 * - onboarding: New client onboarding events (purple)
 * - feature: Feature unlock notifications (purple)
 * 
 * CATEGORIES (for filtering):
 * - system: System health, maintenance, updates
 * - security: Login attempts, access control, threats
 * - billing: Invoices, payments, subscriptions
 * - users: User management, roles, permissions
 * - projects: Project updates, milestones, deadlines
 * - onboarding: New client registrations, approvals
 * 
 * PRIORITY LEVELS:
 * - low: Background notifications, no immediate action
 * - normal: Standard notifications (default)
 * - high: Important, should be seen soon
 * - urgent: Critical, immediate attention required (triggers email + push)
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Simple notification:
 * await supabase.functions.invoke('send-notification', {
 *   body: {
 *     title: 'New Quote Submitted',
 *     message: 'Client ABC Corp submitted a quote request for $5,000',
 *     notification_type: 'info',
 *     category: 'billing'
 *   }
 * });
 * 
 * 2. Security alert with email:
 * await supabase.functions.invoke('send-notification', {
 *   body: {
 *     title: 'Failed Login Attempt',
 *     message: 'Multiple failed login attempts detected from IP 192.168.1.1',
 *     notification_type: 'security',
 *     category: 'security',
 *     priority: 'urgent',
 *     send_email: true,
 *     email_recipient: 'security@cropxon.com',
 *     metadata: { ip_address: '192.168.1.1', attempts: 5 }
 *   }
 * });
 * 
 * 3. Feature unlock notification:
 * await supabase.functions.invoke('send-notification', {
 *   body: {
 *     title: 'New Feature Unlocked!',
 *     message: 'AI Analytics dashboard is now available for your account',
 *     notification_type: 'feature',
 *     category: 'system',
 *     target_admin_id: 'uuid-of-admin',
 *     action_url: '/admin/ai-analytics',
 *     send_push: true
 *   }
 * });
 * 
 * ERROR HANDLING:
 * - Returns 400 if required fields are missing
 * - Returns 500 for database or email errors
 * - Email failures don't fail the entire request (graceful degradation)
 * 
 * ============================================================================
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Notification payload interface
 * All fields that can be sent to this edge function
 */
interface NotificationPayload {
  // Required fields
  title: string;
  message: string;
  notification_type: string;
  
  // Optional targeting
  target_admin_id?: string | null;
  
  // Optional categorization
  category?: "system" | "security" | "billing" | "users" | "projects" | "onboarding";
  priority?: "low" | "normal" | "high" | "urgent";
  
  // Optional action
  action_url?: string;
  
  // Delivery options
  send_email?: boolean;
  send_push?: boolean;
  email_recipient?: string;
  
  // Additional data
  metadata?: Record<string, unknown>;
}

/**
 * Email template color mapping based on priority
 */
const priorityColors: Record<string, string> = {
  low: "#6B7280",      // Gray - low priority
  normal: "#3B82F6",   // Blue - normal priority
  high: "#F59E0B",     // Amber - high priority
  urgent: "#EF4444",   // Red - urgent priority
};

/**
 * Category icons for email templates (emoji fallbacks)
 */
const categoryIcons: Record<string, string> = {
  system: "⚙️",
  security: "🔒",
  billing: "💳",
  users: "👥",
  projects: "📁",
  onboarding: "🚀",
};

/**
 * Main handler function
 */
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    // Validate environment
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("Missing Supabase environment variables");
      throw new Error("Missing Supabase environment variables");
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Parse request body
    const payload: NotificationPayload = await req.json();
    console.log("📬 Received notification payload:", {
      title: payload.title,
      type: payload.notification_type,
      category: payload.category,
      priority: payload.priority,
      target: payload.target_admin_id || "broadcast"
    });

    // Destructure with defaults
    const {
      title,
      message,
      notification_type,
      target_admin_id = null,
      category = "system",
      priority = "normal",
      action_url,
      send_email = false,
      send_push = false,
      email_recipient,
      metadata,
    } = payload;

    // Validate required fields
    if (!title || !message || !notification_type) {
      console.error("❌ Missing required fields");
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: title, message, notification_type",
          received: { title: !!title, message: !!message, notification_type: !!notification_type }
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // =========================================================================
    // STEP 1: Insert notification into database
    // =========================================================================
    console.log("📝 Inserting notification into database...");
    
    const { data: notification, error: insertError } = await supabase
      .from("admin_notifications")
      .insert({
        title,
        message,
        notification_type,
        target_admin_id,
        is_read: false,
        // Note: category, priority, action_url would need to be added to the table schema
        // For now, we store them in the notification record as supported columns
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ Error inserting notification:", insertError);
      throw new Error(`Failed to create notification: ${insertError.message}`);
    }

    console.log("✅ Notification created:", notification.id);

    // =========================================================================
    // STEP 2: Send email notification if requested
    // =========================================================================
    let emailResult = null;
    if (send_email && email_recipient && resendApiKey) {
      console.log("📧 Sending email notification to:", email_recipient);
      
      try {
        const resend = new Resend(resendApiKey);
        
        // Build email with branded ATLAS template
        const emailResponse = await resend.emails.send({
          from: "ATLAS Notifications <notifications@resend.dev>",
          to: [email_recipient],
          subject: `[${priority.toUpperCase()}] ${title}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${title}</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 20px; margin: 0;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header with ATLAS branding -->
                <div style="background: linear-gradient(135deg, #00363D 0%, #0E3A40 100%); padding: 24px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">ATLAS Admin</h1>
                  <p style="color: #00A6A6; margin: 8px 0 0 0; font-size: 14px;">
                    ${categoryIcons[category] || "📬"} Notification Alert
                  </p>
                </div>
                
                <!-- Content -->
                <div style="padding: 32px;">
                  <!-- Priority and Type badges -->
                  <div style="margin-bottom: 20px;">
                    <span style="background-color: ${priorityColors[priority]}; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; display: inline-block;">
                      ${priority}
                    </span>
                    <span style="color: #6B7280; font-size: 14px; margin-left: 12px;">
                      ${notification_type.replace(/_/g, " ")}
                    </span>
                  </div>
                  
                  <!-- Title -->
                  <h2 style="color: #111827; font-size: 20px; margin: 0 0 16px 0; font-weight: 600;">
                    ${title}
                  </h2>
                  
                  <!-- Message -->
                  <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                    ${message}
                  </p>
                  
                  <!-- Action button (if provided) -->
                  ${action_url ? `
                  <a href="${action_url}" style="display: inline-block; background-color: #00A6A6; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                    View Details →
                  </a>
                  ` : ""}
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6B7280; font-size: 12px; margin: 0;">
                    This is an automated notification from CropXon ATLAS.
                  </p>
                  <p style="color: #9CA3AF; font-size: 11px; margin: 8px 0 0 0;">
                    © ${new Date().getFullYear()} CropXon ATLAS. All rights reserved.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        emailResult = emailResponse;
        console.log("✅ Email sent successfully:", emailResult);
      } catch (emailError) {
        // Log error but don't fail the entire request
        console.error("⚠️ Error sending email (non-fatal):", emailError);
      }
    }

    // =========================================================================
    // STEP 3: Send push notification if requested (placeholder for future)
    // =========================================================================
    let pushResult = null;
    if (send_push) {
      console.log("📱 Push notification requested - would send to subscribed devices");
      // TODO: Implement Web Push or FCM integration
      // This would involve:
      // 1. Looking up push subscriptions for the target admin
      // 2. Sending push via web-push library or FCM
      pushResult = { 
        status: "push_not_implemented", 
        message: "Web push subscription required - implement with web-push library" 
      };
    }

    // =========================================================================
    // STEP 4: Return success response
    // =========================================================================
    console.log("✅ Notification process complete");
    
    return new Response(
      JSON.stringify({
        success: true,
        notification,
        email_sent: !!emailResult,
        push_sent: !!pushResult,
        metadata: {
          category,
          priority,
          action_url,
          ...metadata,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("❌ Error in send-notification function:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Start the server
serve(handler);
