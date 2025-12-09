import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    console.log("Checking for overdue invoices...");

    // Get all sent invoices with due dates that have passed
    const now = new Date().toISOString();
    
    const { data: overdueInvoices, error: fetchError } = await supabase
      .from('invoices')
      .select('*, quotes(contact_name, contact_email, contact_phone)')
      .eq('status', 'sent')
      .lt('due_date', now)
      .not('due_date', 'is', null);

    if (fetchError) {
      console.error('Error fetching invoices:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${overdueInvoices?.length || 0} overdue invoices`);

    const results = {
      marked_overdue: 0,
      reminders_sent: 0,
      errors: [] as string[],
    };

    for (const invoice of overdueInvoices || []) {
      try {
        // Update invoice status to overdue
        const { error: updateError } = await supabase
          .from('invoices')
          .update({ 
            status: 'overdue',
            updated_at: new Date().toISOString()
          })
          .eq('id', invoice.id);

        if (updateError) {
          console.error(`Error updating invoice ${invoice.invoice_number}:`, updateError);
          results.errors.push(`Failed to update ${invoice.invoice_number}`);
          continue;
        }

        results.marked_overdue++;
        console.log(`Marked invoice ${invoice.invoice_number} as overdue`);

        // Send reminder email if resend is configured
        if (resend && invoice.quotes?.contact_email) {
          const notes = invoice.notes ? JSON.parse(invoice.notes) : {};
          const clientName = invoice.quotes?.contact_name || notes.payment_email || 'Customer';
          const dueDate = invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }) : 'N/A';

          const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    .header { background: linear-gradient(135deg, #00363D 0%, #0E3A40 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 5px 0 0; color: #4FF2F2; font-size: 14px; }
    .alert-banner { background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px 24px; margin: 24px; border-radius: 8px; }
    .alert-banner h2 { color: #dc2626; margin: 0 0 8px; font-size: 18px; }
    .alert-banner p { color: #7f1d1d; margin: 0; font-size: 14px; }
    .content { padding: 24px; }
    .invoice-details { background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; font-size: 14px; }
    .detail-value { color: #1e293b; font-weight: 600; font-size: 14px; }
    .amount-due { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; }
    .amount-due .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; }
    .amount-due .amount { font-size: 32px; font-weight: 700; margin-top: 8px; }
    .cta-button { display: block; background: #00363D; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; text-align: center; font-weight: 600; margin: 24px 0; }
    .footer { background: #f8fafc; padding: 20px 24px; text-align: center; color: #64748b; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CropXon ATLAS</h1>
      <p>Payment Reminder</p>
    </div>
    
    <div class="alert-banner">
      <h2>⚠️ Invoice Overdue</h2>
      <p>Your payment is past the due date. Please settle this invoice at your earliest convenience to avoid service interruptions.</p>
    </div>
    
    <div class="content">
      <p>Dear ${clientName},</p>
      <p>This is a friendly reminder that the following invoice is now overdue:</p>
      
      <div class="invoice-details">
        <div class="detail-row">
          <span class="detail-label">Invoice Number</span>
          <span class="detail-value">${invoice.invoice_number}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Due Date</span>
          <span class="detail-value">${dueDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">${notes.plan_name || 'Professional Services'}</span>
        </div>
      </div>
      
      <div class="amount-due">
        <div class="label">Total Amount Due</div>
        <div class="amount">₹${Number(invoice.total_amount).toLocaleString('en-IN')}</div>
      </div>
      
      <p>If you've already made the payment, please disregard this email. For any questions or payment arrangements, please contact our billing team.</p>
      
      <a href="mailto:billing@cropxon.com" class="cta-button">Contact Billing Support</a>
    </div>
    
    <div class="footer">
      <p>CropXon Technologies • ATLAS Platform</p>
      <p>billing@cropxon.com | +91 000 000 0000</p>
    </div>
  </div>
</body>
</html>
          `;

          const { error: emailError } = await resend.emails.send({
            from: 'ATLAS Billing <billing@resend.dev>',
            to: [invoice.quotes.contact_email],
            subject: `⚠️ Payment Overdue - Invoice ${invoice.invoice_number}`,
            html: emailHtml,
          });

          if (emailError) {
            console.error(`Error sending reminder for ${invoice.invoice_number}:`, emailError);
            results.errors.push(`Failed to send reminder for ${invoice.invoice_number}`);
          } else {
            // Update reminder tracking
            await supabase
              .from('invoices')
              .update({
                reminder_sent_at: new Date().toISOString(),
                reminder_count: (invoice.reminder_count || 0) + 1
              })
              .eq('id', invoice.id);

            results.reminders_sent++;
            console.log(`Sent reminder email for ${invoice.invoice_number}`);
          }
        }
      } catch (invoiceError) {
        console.error(`Error processing invoice ${invoice.invoice_number}:`, invoiceError);
        results.errors.push(`Error processing ${invoice.invoice_number}`);
      }
    }

    console.log("Overdue check completed:", results);

    return new Response(JSON.stringify({
      success: true,
      ...results,
      total_checked: overdueInvoices?.length || 0,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in check-overdue-invoices:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
