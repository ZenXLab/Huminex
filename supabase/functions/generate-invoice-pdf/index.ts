import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvoiceData {
  invoice_number: string;
  amount: number;
  tax_amount: number;
  tax_percent: number;
  total_amount: number;
  status: string;
  due_date: string | null;
  created_at: string;
  notes: string | null;
  client_name: string;
  client_email: string;
  client_company: string | null;
  client_phone: string | null;
  quote_number: string | null;
  service_type: string | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const invoiceData: InvoiceData = await req.json();
    console.log("Generating PDF for invoice:", invoiceData.invoice_number);

    const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    // Generate professional HTML invoice
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceData.invoice_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    .header {
      background: linear-gradient(135deg, #00363D 0%, #0E3A40 100%);
      color: white;
      padding: 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .logo-section h1 {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .logo-section p {
      font-size: 14px;
      opacity: 0.9;
      color: #4FF2F2;
      font-weight: 600;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h2 {
      font-size: 28px;
      font-weight: 300;
      margin-bottom: 8px;
    }
    .invoice-title .invoice-number {
      font-size: 18px;
      font-weight: 600;
      color: #4FF2F2;
    }
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
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .info-section h3 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .info-section p {
      font-size: 15px;
      margin-bottom: 4px;
    }
    .info-section .company-name {
      font-size: 18px;
      font-weight: 600;
      color: #00363D;
    }
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
    .date-item span {
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
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
    .items-table td {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .items-table td:last-child { text-align: right; font-weight: 600; }
    .totals-section {
      display: flex;
      justify-content: flex-end;
    }
    .totals-box {
      width: 300px;
      background: #f8fafc;
      border-radius: 12px;
      padding: 24px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 14px;
    }
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
    .notes-section {
      margin-top: 40px;
      padding: 24px;
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      border-radius: 0 12px 12px 0;
    }
    .notes-section h4 {
      font-size: 14px;
      font-weight: 600;
      color: #92400e;
      margin-bottom: 8px;
    }
    .notes-section p {
      font-size: 14px;
      color: #78350f;
    }
    .footer {
      background: #f8fafc;
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .footer .company-info {
      font-weight: 600;
      color: #00363D;
      font-size: 14px;
    }
    .payment-info {
      margin-top: 40px;
      padding: 24px;
      background: linear-gradient(135deg, #00363D08 0%, #0E3A4010 100%);
      border-radius: 12px;
      border: 1px solid #00363D20;
    }
    .payment-info h4 {
      font-size: 14px;
      font-weight: 600;
      color: #00363D;
      margin-bottom: 12px;
    }
    .payment-info p {
      font-size: 13px;
      color: #475569;
      margin-bottom: 4px;
    }
    @media print {
      body { background: white; }
      .invoice-container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="logo-section">
        <h1>CropXon</h1>
        <p>ATLAS</p>
      </div>
      <div class="invoice-title">
        <h2>INVOICE</h2>
        <div class="invoice-number">${invoiceData.invoice_number}</div>
        <span class="status-badge status-${invoiceData.status}">${invoiceData.status}</span>
      </div>
    </div>

    <div class="content">
      <div class="info-grid">
        <div class="info-section">
          <h3>Bill To</h3>
          <p class="company-name">${invoiceData.client_company || invoiceData.client_name}</p>
          <p>${invoiceData.client_name}</p>
          <p>${invoiceData.client_email}</p>
          ${invoiceData.client_phone ? `<p>${invoiceData.client_phone}</p>` : ''}
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
          <span>${formatDate(invoiceData.created_at)}</span>
        </div>
        <div class="date-item">
          <label>Due Date</label>
          <span>${invoiceData.due_date ? formatDate(invoiceData.due_date) : 'Upon Receipt'}</span>
        </div>
        <div class="date-item">
          <label>Quote Reference</label>
          <span>${invoiceData.quote_number || 'N/A'}</span>
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
            <td>Professional Services as per Quote ${invoiceData.quote_number || ''}</td>
            <td>${invoiceData.service_type ? invoiceData.service_type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Technology Services'}</td>
            <td>${formatCurrency(invoiceData.amount)}</td>
          </tr>
        </tbody>
      </table>

      <div class="totals-section">
        <div class="totals-box">
          <div class="total-row subtotal">
            <span>Subtotal</span>
            <span>${formatCurrency(invoiceData.amount)}</span>
          </div>
          <div class="total-row tax">
            <span>GST (${invoiceData.tax_percent}%)</span>
            <span>${formatCurrency(invoiceData.tax_amount)}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total Due</span>
            <span>${formatCurrency(invoiceData.total_amount)}</span>
          </div>
        </div>
      </div>

      ${invoiceData.notes ? `
      <div class="notes-section">
        <h4>Notes</h4>
        <p>${invoiceData.notes}</p>
      </div>
      ` : ''}

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
    </div>
  </div>
</body>
</html>
    `;

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