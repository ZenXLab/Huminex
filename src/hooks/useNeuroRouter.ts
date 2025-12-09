import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NeuroRouterRequest {
  task_type: 
    | "session_summary" 
    | "root_cause_analysis" 
    | "code_fix_suggestion" 
    | "ui_visual_analysis" 
    | "ux_issue_detection"
    | "journey_analysis"
    | "sentiment_analysis"
    | "general";
  prompt: string;
  context?: any;
  prefer_llm?: "openai" | "claude" | "gemini" | "deepseek";
  require_vision?: boolean;
  max_tokens?: number;
  temperature?: number;
}

export interface NeuroRouterResponse {
  success: boolean;
  content: string;
  llm_used: string;
  model_used: string;
  routing_reason: string;
  latency_ms: number;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
  error?: string;
}

export function useNeuroRouter() {
  return useMutation({
    mutationFn: async (request: NeuroRouterRequest): Promise<NeuroRouterResponse> => {
      const { data, error } = await supabase.functions.invoke("traceflow-neurorouter", {
        body: request,
      });

      if (error) {
        throw new Error(error.message || "Failed to call NeuroRouter");
      }

      return data as NeuroRouterResponse;
    },
  });
}

// Convenience hooks for specific task types
export function useSessionSummary() {
  const neuroRouter = useNeuroRouter();

  return {
    ...neuroRouter,
    analyze: (sessionEvents: any[], sessionMetadata: any) => {
      return neuroRouter.mutateAsync({
        task_type: "session_summary",
        prompt: "Analyze this user session and provide a concise summary of what happened, key frustration points, and potential issues.",
        context: {
          events: sessionEvents.slice(0, 100), // Limit to avoid token overflow
          metadata: sessionMetadata,
        },
        max_tokens: 1000,
      });
    },
  };
}

export function useRootCauseAnalysis() {
  const neuroRouter = useNeuroRouter();

  return {
    ...neuroRouter,
    analyze: (sessionEvents: any[], errorDetails: any) => {
      return neuroRouter.mutateAsync({
        task_type: "root_cause_analysis",
        prompt: "Analyze this session data and identify the root cause of user frustration or errors. Provide technical details and trace the issue to likely code components.",
        context: {
          events: sessionEvents,
          errors: errorDetails,
        },
        prefer_llm: "deepseek",
        max_tokens: 2000,
      });
    },
  };
}

export function useCodeFixSuggestion() {
  const neuroRouter = useNeuroRouter();

  return {
    ...neuroRouter,
    suggest: (issueDescription: string, codeContext?: string) => {
      return neuroRouter.mutateAsync({
        task_type: "code_fix_suggestion",
        prompt: `Based on this UX issue, provide specific code fixes:\n\nIssue: ${issueDescription}${codeContext ? `\n\nCode Context:\n${codeContext}` : ""}`,
        prefer_llm: "claude",
        max_tokens: 2000,
      });
    },
  };
}

export function useUXIssueDetection() {
  const neuroRouter = useNeuroRouter();

  return {
    ...neuroRouter,
    detect: (pageEvents: any[], componentInfo?: any) => {
      return neuroRouter.mutateAsync({
        task_type: "ux_issue_detection",
        prompt: "Analyze these user interaction events and identify UX issues, friction points, and opportunities for improvement. Prioritize by impact on user experience and conversion.",
        context: {
          events: pageEvents,
          component: componentInfo,
        },
        max_tokens: 1500,
      });
    },
  };
}

export function useJourneyAnalysis() {
  const neuroRouter = useNeuroRouter();

  return {
    ...neuroRouter,
    analyze: (journeySteps: any[], conversionData?: any) => {
      return neuroRouter.mutateAsync({
        task_type: "journey_analysis",
        prompt: "Analyze this user journey, identify drop-off points, explain WHY users are dropping off, and suggest specific improvements to increase conversion.",
        context: {
          journey: journeySteps,
          conversion: conversionData,
        },
        prefer_llm: "deepseek",
        max_tokens: 2000,
      });
    },
  };
}
