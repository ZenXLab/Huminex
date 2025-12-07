import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationPayload {
  title: string;
  message: string;
  notification_type: string;
  target_admin_id?: string | null;
  priority?: "low" | "normal" | "high" | "urgent";
  action_url?: string;
  send_email?: boolean;
  send_push?: boolean;
  email_recipient?: string;
  metadata?: Record<string, unknown>;
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

    const payload: NotificationPayload = await req.json();
    console.log("Received notification payload:", payload);

    const {
      title,
      message,
      notification_type,
      target_admin_id = null,
      priority = "normal",
      action_url,
      send_email = false,
      send_push = false,
      email_recipient,
      metadata,
    } = payload;

    // Validate required fields
    if (!title || !message || !notification_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: title, message, notification_type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Insert notification into database
    const { data: notification, error: insertError } = await supabase
      .from("admin_notifications")
      .insert({
        title,
        message,
        notification_type,
        target_admin_id,
        is_read: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting notification:", insertError);
      throw new Error(`Failed to create notification: ${insertError.message}`);
    }

    console.log("Notification created:", notification);

    // Send email notification if requested
    let emailResult = null;
    if (send_email && email_recipient && resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        
        const priorityColors = {
          low: "#6B7280",
          normal: "#3B82F6",
          high: "#F59E0B",
          urgent: "#EF4444",
        };

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
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #00363D 0%, #0E3A40 100%); padding: 24px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ATLAS Admin</h1>
                  <p style="color: #00A6A6; margin: 8px 0 0 0; font-size: 14px;">Notification Alert</p>
                </div>
                
                <div style="padding: 32px;">
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
        console.log("Email sent successfully:", emailResult);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the entire request if email fails
      }
    }

    // Push notification placeholder - would integrate with web push or FCM
    let pushResult = null;
    if (send_push) {
      console.log("Push notification requested - would send to subscribed devices");
      pushResult = { status: "push_not_implemented", message: "Web push subscription required" };
    }

    return new Response(
      JSON.stringify({
        success: true,
        notification,
        email_sent: !!emailResult,
        push_sent: !!pushResult,
        metadata: {
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
    console.error("Error in send-notification function:", errorMessage);
    
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
