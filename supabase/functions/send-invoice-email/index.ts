import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvoiceEmailRequest {
  email: string;
  invoiceId: string;
  planName: string;
  planPrice: number;
  addons: { name: string; price: number }[];
  addonsTotal: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  region: 'india' | 'global';
  isAnnual: boolean;
  currency: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-invoice-email function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: InvoiceEmailRequest = await req.json();
    console.log("Invoice email request:", { invoiceId: data.invoiceId, email: data.email });

    const taxLabel = data.region === 'india' ? 'GST (18%)' : 'Tax Included';
    const addonsHtml = data.addons.length > 0 
      ? data.addons.map(a => `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${a.name}</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${data.currency}${a.price.toLocaleString()}</td></tr>`).join('')
      : '';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ATLAS Invoice Preview</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00363D 0%, #00A6A6 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">ATLAS</h1>
              <p style="color: #4FF2F2; margin: 8px 0 0 0; font-size: 14px;">by CropXon Innovations Pvt Ltd</p>
            </td>
          </tr>
          
          <!-- Invoice Header -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <table width="100%">
                <tr>
                  <td>
                    <h2 style="color: #1f2937; margin: 0; font-size: 24px;">Invoice Preview</h2>
                    <p style="color: #6b7280; margin: 8px 0 0 0;">Thank you for choosing ATLAS!</p>
                  </td>
                  <td align="right">
                    <p style="color: #00363D; font-weight: bold; font-size: 14px; margin: 0;">Invoice ID</p>
                    <p style="color: #1f2937; font-family: monospace; font-size: 16px; margin: 4px 0 0 0;">${data.invoiceId}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Plan Details -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <table width="100%" style="background-color: #f0fdfa; border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <p style="color: #00363D; font-weight: bold; font-size: 12px; text-transform: uppercase; margin: 0;">Selected Plan</p>
                    <h3 style="color: #1f2937; margin: 8px 0 0 0; font-size: 20px;">${data.planName}</h3>
                    <p style="color: #6b7280; margin: 4px 0 0 0;">${data.isAnnual ? 'Annual Billing' : 'Monthly Billing'}</p>
                  </td>
                  <td align="right">
                    <p style="color: #00A6A6; font-size: 28px; font-weight: bold; margin: 0;">${data.currency}${data.planPrice.toLocaleString()}</p>
                    <p style="color: #6b7280; font-size: 12px; margin: 4px 0 0 0;">${data.isAnnual ? '/year' : '/month'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          ${data.addons.length > 0 ? `
          <!-- Add-ons -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <p style="color: #00363D; font-weight: bold; font-size: 12px; text-transform: uppercase; margin: 0 0 12px 0;">Add-On Modules</p>
              <table width="100%" style="border-collapse: collapse;">
                ${addonsHtml}
              </table>
            </td>
          </tr>
          ` : ''}
          
          <!-- Pricing Summary -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" style="background-color: #f9fafb; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; color: #1f2937;">${data.currency}${data.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">${taxLabel}</td>
                  <td style="padding: 8px 0; text-align: right; color: ${data.region === 'india' ? '#1f2937' : '#059669'};">
                    ${data.region === 'india' ? `+ ${data.currency}${data.taxAmount.toLocaleString()}` : 'Included'}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top: 2px solid #00A6A6; padding-top: 12px;"></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: bold; font-size: 18px;">Total Amount</td>
                  <td style="padding: 8px 0; text-align: right; color: #00363D; font-weight: bold; font-size: 24px;">${data.currency}${data.totalAmount.toLocaleString()}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <a href="https://atlas.cropxon.com/portal/login" style="display: inline-block; background: linear-gradient(135deg, #00363D 0%, #00A6A6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px;">
                Login & Complete Payment
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                CropXon Innovations Pvt Ltd<br>
                support@cropxon.com | atlas.cropxon.com
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin: 12px 0 0 0;">
                This is a preview invoice. Final invoice will be generated after payment confirmation.
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

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ATLAS by CropXon <onboarding@resend.dev>",
        to: [data.email],
        subject: `Your ATLAS Invoice Preview - ${data.invoiceId}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Resend API error:", errorData);
      throw new Error(errorData.message || "Failed to send email");
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-invoice-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
