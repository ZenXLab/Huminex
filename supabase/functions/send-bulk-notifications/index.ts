/**
 * ============================================================================
 * ATLAS SEND-BULK-NOTIFICATIONS EDGE FUNCTION
 * ============================================================================
 * 
 * PURPOSE:
 * Sends notifications to multiple admin users at once, either by specifying
 * a list of admin IDs or by broadcasting to all admins. Supports batch
 * email delivery with rate limiting.
 * 
 * ENDPOINT: POST /functions/v1/send-bulk-notifications
 * 
 * AUTHENTICATION:
 * - Requires valid Supabase auth token in Authorization header
 * - Uses service role key for database operations
 * - Should only be called from admin contexts
 * 
 * ENVIRONMENT VARIABLES REQUIRED:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Service role key for admin operations
 * - RESEND_API_KEY: Resend API key for email delivery
 * 
 * REQUEST PAYLOAD (BulkNotificationPayload):
 * {
 *   title: string;              // Required: Notification title
 *   message: string;            // Required: Notification message/body
 *   notification_type: string;  // Required: Type of notification
 *   category?: string;          // Optional: Category for filtering
 *   target_admin_ids?: string[];// Optional: Array of specific admin UUIDs
 *   broadcast_to_all?: boolean; // Optional: If true, sends to all admins
 *   priority?: string;          // Optional: Priority level (low|normal|high|urgent)
 *   action_url?: string;        // Optional: URL to link to from notification
 *   send_emails?: boolean;      // Optional: Whether to send email notifications
 *   metadata?: object;          // Optional: Additional metadata
 * }
 * 
 * RESPONSE:
 * {
 *   success: boolean;
 *   notifications_created: number;  // Count of DB records created
 *   emails_sent: number;            // Count of emails successfully sent
 *   total_targets: number;          // Total number of targeted admins
 *   results: NotificationResult[];  // Per-admin results
 *   metadata: object;               // Echo of request metadata
 * }
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Broadcast to all admins:
 * await supabase.functions.invoke('send-bulk-notifications', {
 *   body: {
 *     title: 'System Maintenance Scheduled',
 *     message: 'ATLAS will undergo maintenance on Sunday 2AM-4AM IST',
 *     notification_type: 'system',
 *     category: 'system',
 *     broadcast_to_all: true,
 *     priority: 'high'
 *   }
 * });
 * 
 * 2. Send to specific admins with email:
 * await supabase.functions.invoke('send-bulk-notifications', {
 *   body: {
 *     title: 'Urgent: Invoice Payment Required',
 *     message: 'Client invoices totaling ₹5,00,000 are overdue by 7 days',
 *     notification_type: 'billing',
 *     category: 'billing',
 *     target_admin_ids: ['uuid-admin-1', 'uuid-admin-2'],
 *     priority: 'urgent',
 *     send_emails: true,
 *     action_url: '/admin/invoices?status=overdue'
 *   }
 * });
 * 
 * 3. Security broadcast:
 * await supabase.functions.invoke('send-bulk-notifications', {
 *   body: {
 *     title: 'Security Update Required',
 *     message: 'New security patches have been applied. Please review audit logs.',
 *     notification_type: 'security',
 *     category: 'security',
 *     broadcast_to_all: true,
 *     priority: 'high',
 *     send_emails: true,
 *     metadata: { patch_version: '2.5.1', affected_modules: ['auth', 'api'] }
 *   }
 * });
 * 
 * RATE LIMITING:
 * - Emails are sent in batches of 10 to avoid rate limits
 * - Each batch is processed sequentially with parallel emails within batch
 * 
 * ERROR HANDLING:
 * - Returns 400 if required fields are missing
 * - Returns 200 with empty results if no admins found
 * - Individual email failures don't fail the entire request
 * - All results are returned even if some failed
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
 * Bulk notification payload interface
 */
interface BulkNotificationPayload {
  // Required fields
  title: string;
  message: string;
  notification_type: string;
  
  // Targeting options (at least one required)
  target_admin_ids?: string[];
  broadcast_to_all?: boolean;
  
  // Optional categorization
  category?: "system" | "security" | "billing" | "users" | "projects" | "onboarding";
  priority?: "low" | "normal" | "high" | "urgent";
  
  // Optional action
  action_url?: string;
  
  // Email delivery
  send_emails?: boolean;
  
  // Additional data
  metadata?: Record<string, unknown>;
}

/**
 * Result for each notification attempt
 */
interface NotificationResult {
  admin_id: string;
  notification_id?: string;
  email_sent?: boolean;
  success: boolean;
  error?: string;
}

/**
 * Priority color mapping for email styling
 */
const priorityColors: Record<string, string> = {
  low: "#6B7280",      // Gray
  normal: "#3B82F6",   // Blue
  high: "#F59E0B",     // Amber
  urgent: "#EF4444",   // Red
};

/**
 * Category emoji mapping for email templates
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
    const payload: BulkNotificationPayload = await req.json();
    console.log("📬 Received bulk notification payload:", {
      title: payload.title,
      type: payload.notification_type,
      category: payload.category,
      priority: payload.priority,
      broadcast: payload.broadcast_to_all,
      targetCount: payload.target_admin_ids?.length || 0
    });

    // Destructure with defaults
    const {
      title,
      message,
      notification_type,
      target_admin_ids = [],
      broadcast_to_all = false,
      category = "system",
      priority = "normal",
      action_url,
      send_emails = false,
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
    // STEP 1: Determine target admin IDs
    // =========================================================================
    let adminIds: string[] = [...target_admin_ids];

    if (broadcast_to_all) {
      console.log("📢 Broadcasting to all admins - fetching admin list...");
      
      const { data: adminRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (rolesError) {
        console.error("❌ Error fetching admin roles:", rolesError);
        throw new Error(`Failed to fetch admin users: ${rolesError.message}`);
      }

      adminIds = adminRoles?.map((r) => r.user_id) || [];
      console.log(`✅ Found ${adminIds.length} admin users`);
    }

    // Handle case where no admins found
    if (adminIds.length === 0) {
      console.log("⚠️ No target admins specified or found");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No target admins specified or found",
          notifications_created: 0,
          emails_sent: 0,
          total_targets: 0,
          results: []
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // =========================================================================
    // STEP 2: Create notifications in database (batch insert)
    // =========================================================================
    console.log(`📝 Creating ${adminIds.length} notifications in database...`);
    
    const results: NotificationResult[] = [];
    const notificationsToInsert = adminIds.map((adminId) => ({
      title,
      message,
      notification_type,
      target_admin_id: adminId,
      is_read: false,
    }));

    const { data: notifications, error: insertError } = await supabase
      .from("admin_notifications")
      .insert(notificationsToInsert)
      .select();

    if (insertError) {
      console.error("❌ Error inserting notifications:", insertError);
      throw new Error(`Failed to create notifications: ${insertError.message}`);
    }

    console.log(`✅ Created ${notifications?.length || 0} notification records`);

    // =========================================================================
    // STEP 3: Send emails if requested (with rate limiting)
    // =========================================================================
    if (send_emails && resendApiKey) {
      console.log("📧 Preparing to send emails...");
      const resend = new Resend(resendApiKey);

      // Fetch admin profiles for email addresses
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", adminIds);

      if (profilesError) {
        console.error("⚠️ Error fetching profiles:", profilesError);
      } else if (profiles && profiles.length > 0) {
        console.log(`📧 Sending emails to ${profiles.length} admins...`);
        
        // Process emails in batches of 10 to avoid rate limits
        const BATCH_SIZE = 10;
        const emailBatches: typeof profiles[] = [];
        
        for (let i = 0; i < profiles.length; i += BATCH_SIZE) {
          emailBatches.push(profiles.slice(i, i + BATCH_SIZE));
        }

        console.log(`📦 Processing ${emailBatches.length} email batches...`);

        for (let batchIndex = 0; batchIndex < emailBatches.length; batchIndex++) {
          const batch = emailBatches[batchIndex];
          console.log(`📧 Processing batch ${batchIndex + 1}/${emailBatches.length} (${batch.length} emails)`);
          
          // Process batch in parallel
          const emailPromises = batch.map(async (profile) => {
            try {
              await resend.emails.send({
                from: "ATLAS Notifications <notifications@resend.dev>",
                to: [profile.email],
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
                      
                      <!-- Header -->
                      <div style="background: linear-gradient(135deg, #00363D 0%, #0E3A40 100%); padding: 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">ATLAS Admin</h1>
                        <p style="color: #00A6A6; margin: 8px 0 0 0; font-size: 14px;">
                          ${categoryIcons[category] || "📢"} Bulk Notification
                        </p>
                      </div>
                      
                      <!-- Content -->
                      <div style="padding: 32px;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0 0 16px 0;">
                          Hello ${profile.full_name || "Admin"},
                        </p>
                        
                        <!-- Priority badge -->
                        <div style="margin-bottom: 20px;">
                          <span style="background-color: ${priorityColors[priority]}; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; display: inline-block;">
                            ${priority}
                          </span>
                          <span style="color: #6B7280; font-size: 14px; margin-left: 12px;">
                            ${notification_type.replace(/_/g, " ")}
                          </span>
                        </div>
                        
                        <!-- Title and message -->
                        <h2 style="color: #111827; font-size: 20px; margin: 0 0 16px 0; font-weight: 600;">
                          ${title}
                        </h2>
                        <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                          ${message}
                        </p>
                        
                        <!-- Action button -->
                        ${action_url ? `
                        <a href="${action_url}" style="display: inline-block; background-color: #00A6A6; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                          View Details →
                        </a>
                        ` : ""}
                      </div>
                      
                      <!-- Footer -->
                      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6B7280; font-size: 12px; margin: 0;">
                          This is a bulk notification from CropXon ATLAS.
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

              console.log(`✅ Email sent to ${profile.email}`);
              results.push({
                admin_id: profile.id,
                email_sent: true,
                success: true,
              });
            } catch (emailError) {
              console.error(`⚠️ Error sending email to ${profile.email}:`, emailError);
              results.push({
                admin_id: profile.id,
                email_sent: false,
                success: true, // Notification was still created
                error: "Email send failed",
              });
            }
          });

          await Promise.all(emailPromises);
        }
      }
    } else {
      // No email sending - just record success for notifications
      console.log("📝 No emails requested, recording notification results...");
      adminIds.forEach((adminId, index) => {
        results.push({
          admin_id: adminId,
          notification_id: notifications?.[index]?.id,
          success: true,
        });
      });
    }

    // =========================================================================
    // STEP 4: Return summary response
    // =========================================================================
    const successCount = results.filter((r) => r.success).length;
    const emailsSent = results.filter((r) => r.email_sent).length;

    console.log(`✅ Bulk notification complete: ${notifications?.length || 0} notifications, ${emailsSent} emails`);

    return new Response(
      JSON.stringify({
        success: true,
        notifications_created: notifications?.length || 0,
        emails_sent: emailsSent,
        total_targets: adminIds.length,
        results,
        metadata: {
          category,
          priority,
          action_url,
          broadcast_to_all,
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
    console.error("❌ Error in send-bulk-notifications function:", errorMessage);
    
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
