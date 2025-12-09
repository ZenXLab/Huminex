import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RazorpayOrderRequest {
  amount: number; // Amount in smallest currency unit (paise for INR, cents for USD)
  currency: string; // INR or USD
  invoiceId: string;
  planName: string;
  customerEmail?: string;
  customerName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("create-razorpay-order function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: RazorpayOrderRequest = await req.json();
    console.log("Razorpay order request:", data);

    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    // Create Razorpay order
    const orderData = {
      amount: Math.round(data.amount * 100), // Convert to paise/cents
      currency: data.currency === '₹' ? 'INR' : 'USD',
      receipt: data.invoiceId,
      notes: {
        plan_name: data.planName,
        invoice_id: data.invoiceId,
        customer_email: data.customerEmail || '',
        customer_name: data.customerName || '',
      },
    };

    const auth = btoa(`${keyId}:${keySecret}`);
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Razorpay API error:", errorData);
      throw new Error(errorData.error?.description || "Failed to create Razorpay order");
    }

    const order = await response.json();
    console.log("Razorpay order created:", order.id);

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId, // Public key for frontend
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in create-razorpay-order function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
