import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  clientEmail: string;
  clientName: string;
  companyName: string;
  temporaryPassword: string;
  tenantId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Welcome email function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { clientEmail, clientName, companyName, temporaryPassword, tenantId }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to: ${clientEmail}`);

    // Get portal URL from environment or use default
    const portalUrl = "https://wnentybljoyjhizsdhrt.lovableproject.com/portal/auth";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background: linear-gradient(135deg, #0E3A40 0%, #00363D 100%); border-radius: 16px; overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #4FF2F2; letter-spacing: -0.5px;">
                      🎉 Welcome to ATLAS
                    </h1>
                    <p style="margin: 10px 0 0; font-size: 16px; color: #00A6A6;">
                      Your Premium Client Portal is Ready
                    </p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <p style="margin: 0 0 20px; font-size: 16px; color: #F5F8F8; line-height: 1.6;">
                      Hello <strong style="color: #4FF2F2;">${clientName}</strong>,
                    </p>
                    <p style="margin: 0 0 20px; font-size: 16px; color: #F5F8F8; line-height: 1.6;">
                      Your account for <strong style="color: #00A6A6;">${companyName}</strong> has been approved and is now active. You can access your dedicated client portal to track projects, view invoices, manage support tickets, and more.
                    </p>
                  </td>
                </tr>
                
                <!-- Credentials Box -->
                <tr>
                  <td style="padding: 0 40px 20px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background: rgba(0, 0, 0, 0.3); border-radius: 12px; border: 1px solid rgba(79, 242, 242, 0.2);">
                      <tr>
                        <td style="padding: 24px;">
                          <p style="margin: 0 0 16px; font-size: 14px; font-weight: 600; color: #00A6A6; text-transform: uppercase; letter-spacing: 1px;">
                            Your Login Credentials
                          </p>
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 8px 0; color: #a0a0a0; font-size: 14px; width: 100px;">Email:</td>
                              <td style="padding: 8px 0; color: #F5F8F8; font-size: 14px; font-weight: 600;">${clientEmail}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #a0a0a0; font-size: 14px; width: 100px;">Password:</td>
                              <td style="padding: 8px 0; color: #4FF2F2; font-size: 14px; font-weight: 600; font-family: monospace;">${temporaryPassword}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- CTA Button -->
                <tr>
                  <td style="padding: 0 40px 30px; text-align: center;">
                    <a href="${portalUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #00A6A6 0%, #4FF2F2 100%); color: #00363D; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 20px rgba(79, 242, 242, 0.3);">
                      Access Your Portal →
                    </a>
                  </td>
                </tr>
                
                <!-- Security Notice -->
                <tr>
                  <td style="padding: 0 40px 30px;">
                    <p style="margin: 0; padding: 16px; font-size: 13px; color: #a0a0a0; line-height: 1.5; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 3px solid #FFC107;">
                      <strong style="color: #FFC107;">⚠️ Security Recommendation:</strong><br>
                      Please change your password after your first login to ensure account security.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; background: rgba(0, 0, 0, 0.2); border-top: 1px solid rgba(79, 242, 242, 0.1);">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #00A6A6; font-weight: 600;">
                      CropXon ATLAS Team
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #666;">
                      This is an automated message. Please do not reply directly to this email.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send email using Resend API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CropXon ATLAS <onboarding@resend.dev>",
        to: [clientEmail],
        subject: "Welcome to CropXon ATLAS - Your Account is Ready!",
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    // Log the email sending in system_logs
    await supabase.from('system_logs').insert({
      level: 'info',
      source: 'welcome-email',
      message: `Welcome email sent to ${clientEmail}`,
      metadata: { 
        clientEmail, 
        clientName, 
        companyName,
        tenantId,
        emailId: emailResult.id 
      }
    });

    return new Response(JSON.stringify({ success: true, emailId: emailResult.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
