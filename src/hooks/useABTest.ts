import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ABTestVariant {
  id: string;
  name: string;
  isControl: boolean;
  config: Record<string, any>;
}

interface ABTestResult {
  experimentId: string;
  experimentName: string;
  variantId: string;
  variantName: string;
  isControl: boolean;
  config: Record<string, any>;
  trackConversion: (value?: number) => Promise<void>;
}

interface UseABTestOptions {
  experimentName: string;
  fallbackVariant?: string;
}

// Generate or retrieve session ID for anonymous users
const getSessionId = (): string => {
  const key = "atlas_ab_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
};

// Statistical functions for significance calculations
export const calculateZScore = (
  controlConversions: number,
  controlVisitors: number,
  variantConversions: number,
  variantVisitors: number
): number => {
  const p1 = controlConversions / controlVisitors;
  const p2 = variantConversions / variantVisitors;
  const p = (controlConversions + variantConversions) / (controlVisitors + variantVisitors);
  const se = Math.sqrt(p * (1 - p) * (1 / controlVisitors + 1 / variantVisitors));
  
  if (se === 0) return 0;
  return (p2 - p1) / se;
};

export const calculatePValue = (zScore: number): number => {
  // Two-tailed p-value approximation using normal distribution
  const absZ = Math.abs(zScore);
  const p = Math.exp(-0.5 * absZ * absZ) / Math.sqrt(2 * Math.PI);
  return 2 * (1 - normalCDF(absZ));
};

const normalCDF = (x: number): number => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
};

export const calculateConfidenceInterval = (
  conversions: number,
  visitors: number,
  confidenceLevel: number = 0.95
): { lower: number; upper: number } => {
  if (visitors === 0) return { lower: 0, upper: 0 };
  
  const p = conversions / visitors;
  const zScores: Record<number, number> = {
    0.90: 1.645,
    0.95: 1.96,
    0.99: 2.576,
  };
  const z = zScores[confidenceLevel] || 1.96;
  const se = Math.sqrt((p * (1 - p)) / visitors);
  
  return {
    lower: Math.max(0, (p - z * se) * 100),
    upper: Math.min(100, (p + z * se) * 100),
  };
};

export const calculateStatisticalSignificance = (
  controlConversions: number,
  controlVisitors: number,
  variantConversions: number,
  variantVisitors: number
): number => {
  if (controlVisitors === 0 || variantVisitors === 0) return 0;
  
  const zScore = calculateZScore(controlConversions, controlVisitors, variantConversions, variantVisitors);
  const pValue = calculatePValue(zScore);
  
  return (1 - pValue) * 100;
};

export const getWinnerRecommendation = (
  significance: number,
  improvement: number,
  sampleSize: number,
  minSampleSize: number = 1000
): { recommendation: string; confidence: "high" | "medium" | "low"; action: string } => {
  if (sampleSize < minSampleSize) {
    return {
      recommendation: "Insufficient data",
      confidence: "low",
      action: `Continue running until at least ${minSampleSize} visitors per variant`,
    };
  }
  
  if (significance >= 95) {
    if (improvement > 0) {
      return {
        recommendation: "Variant is the winner",
        confidence: "high",
        action: "Implement the winning variant",
      };
    } else {
      return {
        recommendation: "Control is the winner",
        confidence: "high",
        action: "Keep the current version",
      };
    }
  } else if (significance >= 90) {
    return {
      recommendation: improvement > 0 ? "Variant is likely better" : "Control is likely better",
      confidence: "medium",
      action: "Consider running longer for higher confidence",
    };
  } else {
    return {
      recommendation: "No significant difference",
      confidence: "low",
      action: "Continue running or consider redesigning variants",
    };
  }
};

export const useABTest = ({ experimentName, fallbackVariant = "control" }: UseABTestOptions): ABTestResult | null => {
  const [result, setResult] = useState<ABTestResult | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const assignVariant = async () => {
      if (isAssigning) return;
      setIsAssigning(true);

      try {
        const sessionId = getSessionId();
        const { data: { user } } = await supabase.auth.getUser();

        // Check for existing assignment
        let query = supabase
          .from("ab_user_assignments")
          .select(`
            *,
            ab_experiments!inner (id, name, status),
            ab_variants!inner (id, name, is_control, variant_config)
          `)
          .eq("ab_experiments.name", experimentName)
          .eq("ab_experiments.status", "running");

        if (user?.id) {
          query = query.eq("user_id", user.id);
        } else {
          query = query.eq("session_id", sessionId);
        }

        const { data: existingAssignment } = await query.maybeSingle();

        if (existingAssignment) {
          // Use existing assignment
          const exp = existingAssignment.ab_experiments as any;
          const variant = existingAssignment.ab_variants as any;

          setResult({
            experimentId: exp.id,
            experimentName: exp.name,
            variantId: variant.id,
            variantName: variant.name,
            isControl: variant.is_control || false,
            config: variant.variant_config || {},
            trackConversion: async (value?: number) => {
              await supabase
                .from("ab_user_assignments")
                .update({
                  converted: true,
                  converted_at: new Date().toISOString(),
                  conversion_value: value || null,
                })
                .eq("id", existingAssignment.id);
            },
          });
          return;
        }

        // Fetch running experiment
        const { data: experiment } = await supabase
          .from("ab_experiments")
          .select(`
            *,
            ab_variants (*)
          `)
          .eq("name", experimentName)
          .eq("status", "running")
          .maybeSingle();

        if (!experiment || !experiment.ab_variants?.length) {
          console.log(`No active experiment found: ${experimentName}`);
          return;
        }

        // Weighted random variant selection
        const variants = experiment.ab_variants as any[];
        const totalWeight = variants.reduce((sum, v) => sum + (v.traffic_weight || 50), 0);
        let random = Math.random() * totalWeight;
        let selectedVariant = variants[0];

        for (const variant of variants) {
          random -= variant.traffic_weight || 50;
          if (random <= 0) {
            selectedVariant = variant;
            break;
          }
        }

        // Create assignment
        const { data: assignment, error } = await supabase
          .from("ab_user_assignments")
          .insert({
            experiment_id: experiment.id,
            variant_id: selectedVariant.id,
            user_id: user?.id || null,
            session_id: sessionId,
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating assignment:", error);
          return;
        }

        setResult({
          experimentId: experiment.id,
          experimentName: experiment.name,
          variantId: selectedVariant.id,
          variantName: selectedVariant.name,
          isControl: selectedVariant.is_control || false,
          config: selectedVariant.variant_config || {},
          trackConversion: async (value?: number) => {
            await supabase
              .from("ab_user_assignments")
              .update({
                converted: true,
                converted_at: new Date().toISOString(),
                conversion_value: value || null,
              })
              .eq("id", assignment.id);
          },
        });
      } catch (error) {
        console.error("A/B test error:", error);
      } finally {
        setIsAssigning(false);
      }
    };

    assignVariant();
  }, [experimentName, isAssigning]);

  return result;
};

// Hook to track conversions for a specific experiment
export const useTrackConversion = (experimentName: string) => {
  const trackConversion = useCallback(async (conversionValue?: number) => {
    try {
      const sessionId = getSessionId();
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase
        .from("ab_user_assignments")
        .select(`
          id,
          ab_experiments!inner (name, status)
        `)
        .eq("ab_experiments.name", experimentName)
        .eq("converted", false);

      if (user?.id) {
        query = query.eq("user_id", user.id);
      } else {
        query = query.eq("session_id", sessionId);
      }

      const { data: assignment } = await query.maybeSingle();

      if (assignment) {
        await supabase
          .from("ab_user_assignments")
          .update({
            converted: true,
            converted_at: new Date().toISOString(),
            conversion_value: conversionValue || null,
          })
          .eq("id", assignment.id);
      }
    } catch (error) {
      console.error("Error tracking conversion:", error);
    }
  }, [experimentName]);

  return trackConversion;
};

export default useABTest;
