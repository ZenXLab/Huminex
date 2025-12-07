import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, historicalData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`[predictive-analytics] Processing ${type} prediction request`);

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "mrr_forecast":
        systemPrompt = `You are a financial analytics AI specializing in SaaS revenue forecasting. 
        Analyze the provided MRR data and provide predictions for the next 6 months.
        Consider seasonality, growth trends, and market patterns.
        Return your analysis as structured JSON with predictions.`;
        userPrompt = `Analyze this MRR historical data and forecast the next 6 months:
        ${JSON.stringify(historicalData)}
        
        Provide predictions in this exact JSON format:
        {
          "predictions": [
            {"month": "Jan", "predicted_mrr": number, "confidence": number, "growth_rate": number}
          ],
          "trend": "growing" | "stable" | "declining",
          "insights": ["insight1", "insight2"],
          "risk_factors": ["risk1", "risk2"]
        }`;
        break;

      case "churn_risk":
        systemPrompt = `You are a customer success AI specializing in churn prediction.
        Analyze tenant behavior patterns and identify churn risk levels.
        Consider engagement metrics, payment patterns, and support interactions.
        Return structured risk assessments.`;
        userPrompt = `Analyze these tenant metrics and predict churn risk:
        ${JSON.stringify(historicalData)}
        
        Provide risk assessment in this exact JSON format:
        {
          "high_risk_tenants": [{"tenant_id": "id", "risk_score": number, "reasons": ["reason1"]}],
          "medium_risk_tenants": [{"tenant_id": "id", "risk_score": number, "reasons": ["reason1"]}],
          "overall_churn_probability": number,
          "recommendations": ["recommendation1", "recommendation2"]
        }`;
        break;

      case "conversion_optimization":
        systemPrompt = `You are a conversion rate optimization AI.
        Analyze funnel data and A/B test results to suggest improvements.
        Consider user behavior patterns and drop-off points.
        Return actionable optimization suggestions.`;
        userPrompt = `Analyze this conversion funnel data and suggest optimizations:
        ${JSON.stringify(historicalData)}
        
        Provide analysis in this exact JSON format:
        {
          "predicted_improvement": number,
          "bottlenecks": [{"stage": "stage_name", "drop_off_rate": number, "fix": "suggestion"}],
          "quick_wins": ["win1", "win2"],
          "long_term_improvements": ["improvement1", "improvement2"],
          "confidence_score": number
        }`;
        break;

      default:
        throw new Error(`Unknown prediction type: ${type}`);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("[predictive-analytics] Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("[predictive-analytics] Payment required");
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("[predictive-analytics] AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse JSON from the response
    let parsedResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        parsedResult = { raw_response: content };
      }
    } catch {
      parsedResult = { raw_response: content };
    }

    console.log(`[predictive-analytics] Successfully processed ${type} prediction`);

    return new Response(JSON.stringify({ 
      type,
      result: parsedResult,
      generated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[predictive-analytics] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
