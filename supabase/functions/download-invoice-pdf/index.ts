import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DownloadRequest {
  invoice_id: string;
  downloaded_by_email?: string;
  downloaded_by_name?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestData: DownloadRequest = await req.json();
    const { invoice_id, downloaded_by_email, downloaded_by_name } = requestData;

    console.log(`Processing PDF download for invoice: ${invoice_id}`);

    // Get user from auth header if present
    let downloadedBy = null;
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      downloadedBy = user?.id;
    }

    // Fetch invoice data
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, quotes(quote_number, contact_name, contact_email, contact_phone, company_name)')
      .eq('id', invoice_id)
      .single();

    if (invoiceError || !invoice) {
      console.error('Invoice not found:', invoiceError);
      return new Response(
        JSON.stringify({ error: 'Invoice not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Track the download
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const { error: trackError } = await supabase
      .from('invoice_downloads')
      .insert({
        invoice_id: invoice_id,
        downloaded_by: downloadedBy,
        downloaded_by_email: downloaded_by_email || invoice.quotes?.contact_email,
        downloaded_by_name: downloaded_by_name || invoice.quotes?.contact_name,
        download_type: 'pdf',
        ip_address: ipAddress,
        user_agent: userAgent,
      });

    if (trackError) {
      console.error('Failed to track download:', trackError);
      // Continue anyway - tracking failure shouldn't block download
    }

    // Parse notes for additional data
    const notes = invoice.notes ? JSON.parse(invoice.notes) : {};

    // Generate the PDF HTML
    const formatCurrency = (amount: number, currency = '₹') => 
      `${currency}${amount.toLocaleString('en-IN')}`;
    
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const currency = notes.currency || '₹';
    const clientName = invoice.quotes?.contact_name || notes.payment_email || 'Customer';
    const clientEmail = invoice.quotes?.contact_email || notes.payment_email || '';
    const clientCompany = invoice.quotes?.company_name || notes.company_name || '';
    const clientPhone = invoice.quotes?.contact_phone || '';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoice_number}</title>
  <style>
    @page { size: A4; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background: white;
      color: #1e293b;
      line-height: 1.6;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .invoice-container { max-width: 800px; margin: 0 auto; background: white; }
    .header {
      background: linear-gradient(135deg, #00363D 0%, #0E3A40 100%);
      color: white;
      padding: 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .logo-section h1 { font-size: 32px; font-weight: 700; letter-spacing: -0.5px; }
    .logo-section p { font-size: 14px; color: #4FF2F2; font-weight: 600; margin-top: 4px; }
    .invoice-title { text-align: right; }
    .invoice-title h2 { font-size: 28px; font-weight: 300; margin-bottom: 8px; }
    .invoice-title .invoice-number { font-size: 18px; font-weight: 600; color: #4FF2F2; }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 12px;
    }
    .status-draft { background: #64748b; }
    .status-sent { background: #3b82f6; }
    .status-paid { background: #22c55e; }
    .status-overdue { background: #ef4444; }
    .status-cancelled { background: #6b7280; }
    .content { padding: 40px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    .info-section h3 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .info-section p { font-size: 15px; margin-bottom: 4px; }
    .info-section .company-name { font-size: 18px; font-weight: 600; color: #00363D; }
    .dates-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      background: #f8fafc;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 40px;
    }
    .date-item label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      display: block;
      margin-bottom: 4px;
    }
    .date-item span { font-size: 15px; font-weight: 600; color: #1e293b; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .items-table th {
      background: #00363D;
      color: white;
      padding: 14px 16px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .items-table th:last-child { text-align: right; }
    .items-table td { padding: 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .items-table td:last-child { text-align: right; font-weight: 600; }
    .totals-section { display: flex; justify-content: flex-end; }
    .totals-box { width: 300px; background: #f8fafc; border-radius: 12px; padding: 24px; }
    .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
    .total-row.subtotal { border-bottom: 1px dashed #cbd5e1; }
    .total-row.tax { color: #64748b; }
    .total-row.grand-total {
      border-top: 2px solid #00363D;
      margin-top: 10px;
      padding-top: 16px;
      font-size: 20px;
      font-weight: 700;
      color: #00363D;
    }
    .addons-section { margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 12px; }
    .addons-section h4 { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #00363D; }
    .addon-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
    .addon-row:last-child { border-bottom: none; }
    .payment-info {
      margin-top: 40px;
      padding: 24px;
      background: linear-gradient(135deg, #00363D08 0%, #0E3A4010 100%);
      border-radius: 12px;
      border: 1px solid #00363D20;
    }
    .payment-info h4 { font-size: 14px; font-weight: 600; color: #00363D; margin-bottom: 12px; }
    .payment-info p { font-size: 13px; color: #475569; margin-bottom: 4px; }
    .footer {
      background: #f8fafc;
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p { font-size: 13px; color: #64748b; margin-bottom: 4px; }
    .footer .company-info { font-weight: 600; color: #00363D; font-size: 14px; }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 120px;
      font-weight: 700;
      color: rgba(34, 197, 94, 0.1);
      pointer-events: none;
      z-index: 1000;
    }
    @media print {
      body { background: white; }
      .invoice-container { box-shadow: none; }
    }
  </style>
</head>
<body>
  ${invoice.status === 'paid' ? '<div class="watermark">PAID</div>' : ''}
  <div class="invoice-container">
    <div class="header">
      <div class="logo-section">
        <h1>CropXon</h1>
        <p>ATLAS</p>
      </div>
      <div class="invoice-title">
        <h2>INVOICE</h2>
        <div class="invoice-number">${invoice.invoice_number}</div>
        <span class="status-badge status-${invoice.status}">${invoice.status}</span>
      </div>
    </div>

    <div class="content">
      <div class="info-grid">
        <div class="info-section">
          <h3>Bill To</h3>
          <p class="company-name">${clientCompany || clientName}</p>
          <p>${clientName}</p>
          <p>${clientEmail}</p>
          ${clientPhone ? `<p>${clientPhone}</p>` : ''}
        </div>
        <div class="info-section">
          <h3>From</h3>
          <p class="company-name">CropXon Technologies</p>
          <p>ATLAS Platform Division</p>
          <p>contact@cropxon.com</p>
          <p>+91 000 000 0000</p>
        </div>
      </div>

      <div class="dates-grid">
        <div class="date-item">
          <label>Invoice Date</label>
          <span>${formatDate(invoice.created_at)}</span>
        </div>
        <div class="date-item">
          <label>Due Date</label>
          <span>${invoice.due_date ? formatDate(invoice.due_date) : 'Upon Receipt'}</span>
        </div>
        <div class="date-item">
          <label>Quote Reference</label>
          <span>${invoice.quotes?.quote_number || notes.quote_number || 'N/A'}</span>
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Service Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${notes.plan_name || 'Professional Services'}</td>
            <td>${notes.billing_cycle === 'annual' ? 'Annual Subscription' : 'Monthly Subscription'}</td>
            <td>${formatCurrency(Number(invoice.amount), currency)}</td>
          </tr>
        </tbody>
      </table>

      ${notes.addons && notes.addons.length > 0 ? `
      <div class="addons-section">
        <h4>Add-ons Included</h4>
        ${notes.addons.map((addon: any) => `
          <div class="addon-row">
            <span>${addon.name}</span>
            <span>${formatCurrency(addon.price || 0, currency)}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div class="totals-section">
        <div class="totals-box">
          <div class="total-row subtotal">
            <span>Subtotal</span>
            <span>${formatCurrency(Number(invoice.amount), currency)}</span>
          </div>
          <div class="total-row tax">
            <span>Tax (${invoice.tax_percent || 0}%)</span>
            <span>${formatCurrency(Number(invoice.tax_amount || 0), currency)}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total Due</span>
            <span>${formatCurrency(Number(invoice.total_amount), currency)}</span>
          </div>
        </div>
      </div>

      <div class="payment-info">
        <h4>Payment Information</h4>
        <p><strong>Bank:</strong> HDFC Bank</p>
        <p><strong>Account Name:</strong> CropXon Technologies Pvt Ltd</p>
        <p><strong>Account Number:</strong> XXXX XXXX XXXX 1234</p>
        <p><strong>IFSC Code:</strong> HDFC0001234</p>
        <p><strong>UPI:</strong> cropxon@hdfcbank</p>
      </div>
    </div>

    <div class="footer">
      <p class="company-info">CropXon Technologies • ATLAS Platform</p>
      <p>Thank you for your business!</p>
      <p>Questions? Contact us at billing@cropxon.com</p>
      <p style="margin-top: 12px; font-size: 11px; color: #94a3b8;">
        Downloaded on ${new Date().toLocaleString('en-IN')}
      </p>
    </div>
  </div>
</body>
</html>
    `;

    console.log(`PDF HTML generated for invoice ${invoice.invoice_number}`);

    return new Response(htmlContent, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
