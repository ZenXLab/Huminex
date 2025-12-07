import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeatureUnlockEmailRequest {
  employeeEmail: string;
  employeeName: string;
  featureName: string;
  featureDescription?: string;
  actionUrl?: string;
  tenantName?: string;
}

const generateEmailHtml = (data: FeatureUnlockEmailRequest) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Feature Unlocked - ATLAS</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f9fc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #005EEB 0%, #00C2FF 100%); border-radius: 16px 16px 0 0;">
              <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 12px 24px; border-radius: 50px; margin-bottom: 20px;">
                <span style="color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">✨ NEW FEATURE UNLOCKED</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; line-height: 1.3;">
                ${data.featureName}
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #0F1E3A; font-size: 16px; line-height: 1.6;">
                Hi ${data.employeeName},
              </p>
              
              <p style="margin: 0 0 20px; color: #6B7280; font-size: 15px; line-height: 1.7;">
                Great news! Your organization admin has unlocked a new feature for you in ATLAS:
              </p>
              
              <!-- Feature Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <tr>
                  <td style="padding: 24px; background: linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%); border-radius: 12px; border-left: 4px solid #005EEB;">
                    <h2 style="margin: 0 0 8px; color: #005EEB; font-size: 20px; font-weight: 700;">
                      ${data.featureName}
                    </h2>
                    ${data.featureDescription ? `
                    <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                      ${data.featureDescription}
                    </p>
                    ` : ''}
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 30px; color: #6B7280; font-size: 15px; line-height: 1.7;">
                This feature is now available in your ATLAS portal. Log in to explore and make the most of this new capability.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${data.actionUrl || 'https://atlas.cropxon.com/portal'}" 
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #005EEB 0%, #0046c7 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 94, 235, 0.3);">
                      Explore Feature →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 10px; color: #9CA3AF; font-size: 13px;">
                      Powered by <strong style="color: #005EEB;">ATLAS</strong> by CropXon Innovations
                    </p>
                    ${data.tenantName ? `
                    <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                      Organization: ${data.tenantName}
                    </p>
                    ` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
        <!-- Unsubscribe -->
        <p style="margin: 20px 0 0; color: #9CA3AF; font-size: 12px; text-align: center;">
          You received this email because you're a member of an ATLAS-powered organization.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-feature-unlock-email function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody: FeatureUnlockEmailRequest = await req.json();
    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const { employeeEmail, employeeName, featureName, featureDescription, actionUrl, tenantName } = requestBody;

    // Validate required fields
    if (!employeeEmail || !employeeName || !featureName) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields: employeeEmail, employeeName, featureName" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate email HTML
    const htmlContent = generateEmailHtml({
      employeeEmail,
      employeeName,
      featureName,
      featureDescription,
      actionUrl,
      tenantName,
    });

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "ATLAS <notifications@resend.dev>",
      to: [employeeEmail],
      subject: `🎉 New Feature Unlocked: ${featureName} - ATLAS`,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log to Supabase for audit
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase.from("system_logs").insert({
        level: "info",
        source: "send-feature-unlock-email",
        message: `Feature unlock email sent to ${employeeEmail} for feature: ${featureName}`,
        metadata: {
          employeeEmail,
          employeeName,
          featureName,
          tenantName,
          emailId: emailResponse.data?.id,
        },
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Feature unlock email sent successfully",
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-feature-unlock-email function:", error);
    
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
