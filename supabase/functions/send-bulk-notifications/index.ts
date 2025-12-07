import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkNotificationPayload {
  title: string;
  message: string;
  notification_type: string;
  target_admin_ids?: string[];
  broadcast_to_all?: boolean;
  priority?: "low" | "normal" | "high" | "urgent";
  action_url?: string;
  send_emails?: boolean;
  metadata?: Record<string, unknown>;
}

interface NotificationResult {
  admin_id: string;
  notification_id?: string;
  email_sent?: boolean;
  success: boolean;
  error?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const payload: BulkNotificationPayload = await req.json();
    console.log("Received bulk notification payload:", payload);

    const {
      title,
      message,
      notification_type,
      target_admin_ids = [],
      broadcast_to_all = false,
      priority = "normal",
      action_url,
      send_emails = false,
      metadata,
    } = payload;

    // Validate required fields
    if (!title || !message || !notification_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: title, message, notification_type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let adminIds: string[] = target_admin_ids;

    // If broadcasting to all, get all admin user IDs
    if (broadcast_to_all) {
      const { data: adminRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (rolesError) {
        console.error("Error fetching admin roles:", rolesError);
        throw new Error(`Failed to fetch admin users: ${rolesError.message}`);
      }

      adminIds = adminRoles?.map((r) => r.user_id) || [];
      console.log(`Broadcasting to ${adminIds.length} admin users`);
    }

    if (adminIds.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No target admins specified or found",
          notifications_created: 0 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const results: NotificationResult[] = [];
    const notificationsToInsert = adminIds.map((adminId) => ({
      title,
      message,
      notification_type,
      target_admin_id: adminId,
      is_read: false,
    }));

    // Batch insert all notifications
    const { data: notifications, error: insertError } = await supabase
      .from("admin_notifications")
      .insert(notificationsToInsert)
      .select();

    if (insertError) {
      console.error("Error inserting notifications:", insertError);
      throw new Error(`Failed to create notifications: ${insertError.message}`);
    }

    console.log(`Created ${notifications?.length || 0} notifications`);

    // Send emails if requested
    if (send_emails && resendApiKey) {
      const resend = new Resend(resendApiKey);

      // Get admin emails from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", adminIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      } else if (profiles && profiles.length > 0) {
        const priorityColors = {
          low: "#6B7280",
          normal: "#3B82F6",
          high: "#F59E0B",
          urgent: "#EF4444",
        };

        // Send emails in batches of 10
        const emailBatches = [];
        for (let i = 0; i < profiles.length; i += 10) {
          emailBatches.push(profiles.slice(i, i + 10));
        }

        for (const batch of emailBatches) {
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
                  </head>
                  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                      <div style="background: linear-gradient(135deg, #00363D 0%, #0E3A40 100%); padding: 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ATLAS Admin</h1>
                        <p style="color: #00A6A6; margin: 8px 0 0 0; font-size: 14px;">Bulk Notification</p>
                      </div>
                      
                      <div style="padding: 32px;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0 0 16px 0;">
                          Hello ${profile.full_name || 'Admin'},
                        </p>
                        
                        <div style="display: flex; align-items: center; margin-bottom: 20px;">
                          <span style="background-color: ${priorityColors[priority]}; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                            ${priority}
                          </span>
                          <span style="color: #6B7280; font-size: 14px; margin-left: 12px;">
                            ${notification_type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        
                        <h2 style="color: #111827; font-size: 20px; margin: 0 0 16px 0;">${title}</h2>
                        <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">${message}</p>
                        
                        ${action_url ? `
                        <a href="${action_url}" style="display: inline-block; background-color: #00A6A6; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                          View Details
                        </a>
                        ` : ''}
                      </div>
                      
                      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6B7280; font-size: 12px; margin: 0;">
                          This is a bulk notification from CropXon ATLAS.
                        </p>
                      </div>
                    </div>
                  </body>
                  </html>
                `,
              });

              results.push({
                admin_id: profile.id,
                email_sent: true,
                success: true,
              });
            } catch (emailError) {
              console.error(`Error sending email to ${profile.email}:`, emailError);
              results.push({
                admin_id: profile.id,
                email_sent: false,
                success: true,
                error: "Email send failed",
              });
            }
          });

          await Promise.all(emailPromises);
        }
      }
    } else {
      // Just add success results without email
      adminIds.forEach((adminId, index) => {
        results.push({
          admin_id: adminId,
          notification_id: notifications?.[index]?.id,
          success: true,
        });
      });
    }

    const successCount = results.filter((r) => r.success).length;
    const emailsSent = results.filter((r) => r.email_sent).length;

    return new Response(
      JSON.stringify({
        success: true,
        notifications_created: notifications?.length || 0,
        emails_sent: emailsSent,
        total_targets: adminIds.length,
        results,
        metadata: {
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
    console.error("Error in send-bulk-notifications function:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
