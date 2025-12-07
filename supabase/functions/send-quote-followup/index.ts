import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteFollowupRequest {
  name: string;
  email: string;
  type: "exit_intent" | "quote_request" | "calculator" | "followup";
  quoteDetails?: {
    services?: string[];
    addons?: string[];
    total?: number;
    clientType?: string;
  };
}

const getSubjectLine = (type: string): string => {
  switch (type) {
    case "exit_intent":
      return "🎁 Your Exclusive 15% Discount - Don't Miss Out!";
    case "quote_request":
      return "Your ATLAS Custom Quote is Ready";
    case "calculator":
      return "Your ATLAS Pricing Estimate";
    case "followup":
      return "Following Up on Your ATLAS Interest";
    default:
      return "Thank You for Your Interest in ATLAS";
  }
};

const getEmailContent = (type: string, name: string, quoteDetails?: QuoteFollowupRequest["quoteDetails"]): string => {
  const firstName = name.split(" ")[0];

  let contentBlock = "";

  switch (type) {
    case "exit_intent":
      contentBlock = `
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          We noticed you were checking out ATLAS pricing. Before you go, we'd love to offer you an <strong>exclusive 15% discount</strong> on your first 3 months!
        </p>
        <div style="background: linear-gradient(135deg, #00A6A6 0%, #4FF2F2 100%); padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center;">
          <p style="color: white; font-size: 24px; font-weight: bold; margin: 0;">ATLAS15</p>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 8px 0 0 0;">Use this code at checkout</p>
        </div>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          This offer expires in <strong>48 hours</strong>. Don't miss your chance to experience the power of ATLAS at a special price.
        </p>
      `;
      break;

    case "quote_request":
      contentBlock = `
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Thank you for requesting a custom quote! Our team is reviewing your requirements and will send you a detailed proposal within <strong>2 business hours</strong>.
        </p>
        ${quoteDetails ? `
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px 0; color: #1f2937;">Your Quote Summary</h3>
            ${quoteDetails.services?.length ? `
              <p style="margin: 8px 0; color: #4b5563;"><strong>Services:</strong> ${quoteDetails.services.join(", ")}</p>
            ` : ""}
            ${quoteDetails.total ? `
              <p style="margin: 8px 0; color: #4b5563;"><strong>Estimated Total:</strong> ₹${quoteDetails.total.toLocaleString()}/month</p>
            ` : ""}
          </div>
        ` : ""}
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          In the meantime, feel free to explore our features or schedule a demo with our team.
        </p>
      `;
      break;

    case "calculator":
      contentBlock = `
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Thanks for using our pricing calculator! Based on your selections, here's what we found:
        </p>
        ${quoteDetails ? `
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px 0; color: #1f2937;">Your Estimate</h3>
            <p style="font-size: 28px; color: #00363D; font-weight: bold; margin: 8px 0;">
              ₹${quoteDetails.total?.toLocaleString() || "Custom"}/month
            </p>
            <p style="color: #6b7280; font-size: 14px;">Save 20% with annual billing</p>
          </div>
        ` : ""}
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Ready to get started? Start your <strong>90-day free trial</strong> today - no credit card required.
        </p>
      `;
      break;

    default:
      contentBlock = `
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Thank you for your interest in ATLAS! We're excited to help you transform your workforce management.
        </p>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Our team will be in touch shortly to discuss how ATLAS can help your organization.
        </p>
      `;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
  <div style="padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #00363D 0%, #0E3A40 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">CropXon ATLAS</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0;">Workforce Operating System</p>
      </div>
      
      <!-- Content -->
      <div style="padding: 40px 30px;">
        <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 24px 0;">
          Hi ${firstName}! 👋
        </h2>
        
        ${contentBlock}
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://atlas.cropxon.com/onboarding" 
             style="display: inline-block; background: linear-gradient(135deg, #00363D 0%, #0E3A40 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Start Free Trial →
          </a>
        </div>
        
        <!-- Help Section -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 32px;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Questions? Reply to this email or reach us at <a href="mailto:support@cropxon.com" style="color: #00A6A6;">support@cropxon.com</a>
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #f8fafc; padding: 24px 30px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © 2025 CropXon Innovations Pvt. Ltd. | Bhubaneswar, India
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
          <a href="https://atlas.cropxon.com/unsubscribe" style="color: #9ca3af;">Unsubscribe</a> | 
          <a href="https://atlas.cropxon.com/privacy" style="color: #9ca3af;">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-quote-followup function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return new Response(
      JSON.stringify({ error: "Email service not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { name, email, type, quoteDetails }: QuoteFollowupRequest = await req.json();
    
    console.log(`Sending ${type} email to ${email}`);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ATLAS <onboarding@resend.dev>",
        to: [email],
        subject: getSubjectLine(type),
        html: getEmailContent(type, name, quoteDetails),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-quote-followup function:", error);
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
