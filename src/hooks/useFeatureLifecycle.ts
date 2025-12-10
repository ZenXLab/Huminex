import { useMemo } from 'react';
import { 
  getFeatureStageById, 
  getFeatureReleaseInfo, 
  getFeaturesByStage,
  FeatureStage,
  FeatureRelease 
} from '@/lib/featureLifecycle';

/**
 * Hook to get feature lifecycle information
 */
export function useFeatureLifecycle(featureId: string) {
  return useMemo(() => {
    const info = getFeatureReleaseInfo(featureId);
    return {
      stage: info?.stage ?? null,
      daysUntilNextStage: info?.daysUntilNextStage ?? null,
      releaseDate: info?.releaseDate ?? null,
      isBeta: info?.stage === 'beta',
      isNew: info?.stage === 'new',
      hasActiveBadge: info?.stage !== null
    };
  }, [featureId]);
}

/**
 * Hook to get all features grouped by their lifecycle stage
 */
export function useFeaturesByLifecycle() {
  return useMemo(() => {
    const beta = getFeaturesByStage('beta');
    const newFeatures = getFeaturesByStage('new');
    const stable = getFeaturesByStage(null);

    return {
      beta,
      new: newFeatures,
      stable,
      betaCount: beta.length,
      newCount: newFeatures.length,
      stableCount: stable.length,
      totalNew: beta.length + newFeatures.length
    };
  }, []);
}

/**
 * Hook to check multiple features at once
 */
export function useMultipleFeatureStages(featureIds: string[]) {
  return useMemo(() => {
    return featureIds.reduce((acc, id) => {
      acc[id] = getFeatureStageById(id);
      return acc;
    }, {} as Record<string, FeatureStage>);
  }, [featureIds]);
}
