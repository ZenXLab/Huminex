import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ClickstreamEvent {
  id: string;
  session_id: string;
  event_type: string;
  page_url: string;
  element_id: string | null;
  element_text: string | null;
  created_at: string;
  metadata: any;
}

interface StruggleAnalysis {
  rageClicks: {
    count: number;
    locations: Array<{ element: string; page: string; severity: string }>;
  };
  deadClicks: {
    count: number;
    locations: Array<{ element: string; page: string }>;
  };
  formAbandonment: {
    count: number;
    forms: Array<{ formId: string; fieldsAbandoned: string[]; dropOffPoint: string }>;
  };
  fieldAnalytics: {
    mostAbandoned: Array<{ field: string; abandonmentRate: number }>;
    slowestFields: Array<{ field: string; avgTimeMs: number }>;
    errorProne: Array<{ field: string; errorRate: number }>;
  };
  aiInsights: string[];
  overallFrustrationScore: number;
  recommendations: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { events, sessionId } = await req.json();
    
    if (!events || !Array.isArray(events)) {
      return new Response(
        JSON.stringify({ error: "Events array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Pre-process events for analysis
    const clickEvents = events.filter((e: ClickstreamEvent) => e.event_type === "click");
    const formEvents = events.filter((e: ClickstreamEvent) => 
      ["field_blur", "field_error", "form_submit", "form_abandonment"].includes(e.event_type)
    );

    // Detect rage clicks (3+ clicks on same element within 2 seconds)
    const rageClicks = detectRageClicks(clickEvents);
    
    // Detect dead clicks (clicks with no follow-up events)
    const deadClicks = detectDeadClicks(clickEvents, events);
    
    // Analyze form abandonment
    const formAbandonment = analyzeFormAbandonment(formEvents);
    
    // Analyze field-level metrics
    const fieldAnalytics = analyzeFieldMetrics(formEvents);

    // Calculate frustration score
    const frustrationScore = calculateFrustrationScore(rageClicks, deadClicks, formAbandonment);

    // Get AI-powered insights
    const aiAnalysis = await getAIInsights(
      LOVABLE_API_KEY,
      { rageClicks, deadClicks, formAbandonment, fieldAnalytics, events: events.slice(0, 100) }
    );

    const analysis: StruggleAnalysis = {
      rageClicks,
      deadClicks,
      formAbandonment,
      fieldAnalytics,
      aiInsights: aiAnalysis.insights,
      overallFrustrationScore: frustrationScore,
      recommendations: aiAnalysis.recommendations,
    };

    console.log("Struggle analysis complete:", {
      rageClicks: rageClicks.count,
      deadClicks: deadClicks.count,
      formAbandonment: formAbandonment.count,
      frustrationScore,
    });

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-user-struggles:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function detectRageClicks(clickEvents: ClickstreamEvent[]) {
  const rageClicks: Array<{ element: string; page: string; severity: string }> = [];
  
  // Sort by timestamp
  const sorted = [...clickEvents].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  let consecutiveCount = 1;
  let lastElement = "";
  let lastTime = 0;

  for (const event of sorted) {
    const currentTime = new Date(event.created_at).getTime();
    const currentElement = event.element_id || event.element_text || "";
    
    if (currentElement === lastElement && currentTime - lastTime < 2000) {
      consecutiveCount++;
      if (consecutiveCount >= 3) {
        rageClicks.push({
          element: currentElement,
          page: event.page_url,
          severity: consecutiveCount >= 5 ? "high" : "medium",
        });
      }
    } else {
      consecutiveCount = 1;
    }
    
    lastElement = currentElement;
    lastTime = currentTime;
  }

  return {
    count: rageClicks.length,
    locations: rageClicks,
  };
}

function detectDeadClicks(clickEvents: ClickstreamEvent[], allEvents: ClickstreamEvent[]) {
  const deadClicks: Array<{ element: string; page: string }> = [];
  
  for (const click of clickEvents) {
    const clickTime = new Date(click.created_at).getTime();
    
    // Check if any meaningful event follows within 500ms
    const hasFollowUp = allEvents.some(e => {
      const eventTime = new Date(e.created_at).getTime();
      return eventTime > clickTime && 
             eventTime - clickTime < 500 && 
             (e.event_type === "pageview" || e.event_type === "scroll" || e.event_type.includes("form"));
    });
    
    if (!hasFollowUp) {
      deadClicks.push({
        element: click.element_id || click.element_text || "unknown",
        page: click.page_url,
      });
    }
  }

  return {
    count: Math.min(deadClicks.length, 20), // Limit noise
    locations: deadClicks.slice(0, 20),
  };
}

function analyzeFormAbandonment(formEvents: ClickstreamEvent[]) {
  const abandonments = formEvents.filter(e => e.event_type === "form_abandonment");
  
  const forms = abandonments.map(e => ({
    formId: e.element_id || "unknown",
    fieldsAbandoned: e.metadata?.fieldDetails?.filter((f: any) => f.wasAbandoned).map((f: any) => f.name) || [],
    dropOffPoint: e.metadata?.fieldDetails?.slice(-1)[0]?.name || "unknown",
  }));

  return {
    count: abandonments.length,
    forms,
  };
}

function analyzeFieldMetrics(formEvents: ClickstreamEvent[]) {
  const fieldBlurs = formEvents.filter(e => e.event_type === "field_blur");
  const fieldErrors = formEvents.filter(e => e.event_type === "field_error");
  const abandonments = formEvents.filter(e => e.event_type === "form_abandonment");

  // Aggregate field metrics
  const fieldStats: Map<string, { totalTime: number; count: number; errors: number; abandonments: number }> = new Map();

  for (const blur of fieldBlurs) {
    const fieldName = blur.element_id || "unknown";
    const stats = fieldStats.get(fieldName) || { totalTime: 0, count: 0, errors: 0, abandonments: 0 };
    stats.totalTime += blur.metadata?.timeSpentMs || 0;
    stats.count++;
    if (blur.metadata?.hasError) stats.errors++;
    fieldStats.set(fieldName, stats);
  }

  for (const error of fieldErrors) {
    const fieldName = error.element_id || "unknown";
    const stats = fieldStats.get(fieldName) || { totalTime: 0, count: 0, errors: 0, abandonments: 0 };
    stats.errors++;
    fieldStats.set(fieldName, stats);
  }

  for (const abandon of abandonments) {
    const abandonedFields = abandon.metadata?.fieldDetails?.filter((f: any) => f.wasAbandoned) || [];
    for (const field of abandonedFields) {
      const stats = fieldStats.get(field.name) || { totalTime: 0, count: 0, errors: 0, abandonments: 0 };
      stats.abandonments++;
      fieldStats.set(field.name, stats);
    }
  }

  // Calculate rankings
  const entries = Array.from(fieldStats.entries());
  
  const mostAbandoned = entries
    .map(([field, stats]) => ({
      field,
      abandonmentRate: stats.count > 0 ? (stats.abandonments / stats.count) * 100 : 0,
    }))
    .sort((a, b) => b.abandonmentRate - a.abandonmentRate)
    .slice(0, 5);

  const slowestFields = entries
    .map(([field, stats]) => ({
      field,
      avgTimeMs: stats.count > 0 ? stats.totalTime / stats.count : 0,
    }))
    .sort((a, b) => b.avgTimeMs - a.avgTimeMs)
    .slice(0, 5);

  const errorProne = entries
    .map(([field, stats]) => ({
      field,
      errorRate: stats.count > 0 ? (stats.errors / stats.count) * 100 : 0,
    }))
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, 5);

  return { mostAbandoned, slowestFields, errorProne };
}

function calculateFrustrationScore(
  rageClicks: { count: number },
  deadClicks: { count: number },
  formAbandonment: { count: number }
): number {
  // Weighted scoring: rage clicks are most indicative of frustration
  const score = (rageClicks.count * 30) + (deadClicks.count * 10) + (formAbandonment.count * 20);
  return Math.min(100, Math.round(score / 10));
}

async function getAIInsights(
  apiKey: string,
  data: any
): Promise<{ insights: string[]; recommendations: string[] }> {
  try {
    const prompt = `Analyze this user behavior data and identify UX struggles:

Rage Clicks: ${data.rageClicks.count} occurrences
${data.rageClicks.locations.slice(0, 5).map((l: any) => `- ${l.element} on ${l.page} (${l.severity} severity)`).join("\n")}

Dead Clicks: ${data.deadClicks.count} occurrences
${data.deadClicks.locations.slice(0, 5).map((l: any) => `- ${l.element} on ${l.page}`).join("\n")}

Form Abandonment: ${data.formAbandonment.count} occurrences
${data.formAbandonment.forms.slice(0, 3).map((f: any) => `- Form ${f.formId}: dropped at ${f.dropOffPoint}`).join("\n")}

Field Analytics:
- Most abandoned fields: ${data.fieldAnalytics.mostAbandoned.map((f: any) => `${f.field} (${f.abandonmentRate.toFixed(1)}%)`).join(", ")}
- Slowest fields: ${data.fieldAnalytics.slowestFields.map((f: any) => `${f.field} (${(f.avgTimeMs/1000).toFixed(1)}s)`).join(", ")}
- Error-prone fields: ${data.fieldAnalytics.errorProne.map((f: any) => `${f.field} (${f.errorRate.toFixed(1)}%)`).join(", ")}

Provide:
1. 3-5 key insights about user struggles (be specific)
2. 3-5 actionable recommendations to improve UX

Format as JSON: {"insights": ["insight1", ...], "recommendations": ["rec1", ...]}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a UX analytics expert. Analyze user behavior data to identify friction points and provide actionable recommendations. Always respond in valid JSON format." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn("AI rate limit reached, using fallback insights");
        return getFallbackInsights(data);
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return getFallbackInsights(data);
  } catch (error) {
    console.error("AI analysis error:", error);
    return getFallbackInsights(data);
  }
}

function getFallbackInsights(data: any): { insights: string[]; recommendations: string[] } {
  const insights: string[] = [];
  const recommendations: string[] = [];

  if (data.rageClicks.count > 0) {
    insights.push(`${data.rageClicks.count} rage click events detected - users are experiencing frustration with unresponsive elements`);
    recommendations.push("Review and fix unresponsive buttons and interactive elements");
  }

  if (data.deadClicks.count > 5) {
    insights.push(`${data.deadClicks.count} dead clicks found - elements appear clickable but don't respond`);
    recommendations.push("Add visual feedback (hover states, cursors) to interactive elements");
  }

  if (data.formAbandonment.count > 0) {
    insights.push(`${data.formAbandonment.count} form abandonments - users are leaving forms incomplete`);
    recommendations.push("Simplify forms and add progress indicators");
  }

  if (data.fieldAnalytics.errorProne.length > 0) {
    insights.push(`High error rates on fields: ${data.fieldAnalytics.errorProne.slice(0, 3).map((f: any) => f.field).join(", ")}`);
    recommendations.push("Improve field validation messages and input guidance");
  }

  if (insights.length === 0) {
    insights.push("User experience appears smooth with minimal friction detected");
  }

  if (recommendations.length === 0) {
    recommendations.push("Continue monitoring user behavior for emerging patterns");
  }

  return { insights, recommendations };
}
