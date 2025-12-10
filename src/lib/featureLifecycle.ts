// Feature Lifecycle Management System
// Handles automatic badge progression: Beta (0-14 days) → New (15-30 days) → No badge

export type FeatureStage = 'beta' | 'new' | null;

export interface FeatureRelease {
  id: string;
  name: string;
  releaseDate: string; // ISO date string
  category: string;
}

// Feature release registry - add new features here with their release date
export const featureReleases: FeatureRelease[] = [
  // TRACEFLOW Feature Matrix - Released Today (December 10, 2024)
  { id: "feature-matrix", name: "Feature Matrix Dashboard", releaseDate: "2024-12-10", category: "enterprise" },
  { id: "capture-engine-module", name: "Capture Engine Module", releaseDate: "2024-12-10", category: "capture" },
  { id: "ai-agent-module", name: "AI Agent System Module", releaseDate: "2024-12-10", category: "ai" },
  { id: "enterprise-runner-module", name: "Enterprise Runner Module", releaseDate: "2024-12-10", category: "runner" },
  { id: "security-compliance-module", name: "Security & Compliance Module", releaseDate: "2024-12-10", category: "security" },
  { id: "streaming-module", name: "Streaming & Processing Module", releaseDate: "2024-12-10", category: "streaming" },
  { id: "temporal-workflows-module", name: "Temporal Workflows Module", releaseDate: "2024-12-10", category: "workflows" },
  { id: "storage-indexing-module", name: "Storage & Indexing Module", releaseDate: "2024-12-10", category: "storage" },
  { id: "control-plane-module", name: "Control Plane Module", releaseDate: "2024-12-10", category: "control" },
  { id: "observability-module", name: "Observability Module", releaseDate: "2024-12-10", category: "observability" },
  { id: "cost-optimization-module", name: "Cost Optimization Module", releaseDate: "2024-12-10", category: "cost" },
  { id: "deployment-modes-module", name: "Deployment Modes Module", releaseDate: "2024-12-10", category: "deployment" },
  { id: "productized-outputs-module", name: "Productized Outputs Module", releaseDate: "2024-12-10", category: "outputs" },
  { id: "future-expansions-module", name: "Future Expansions Module", releaseDate: "2024-12-10", category: "future" },
  { id: "industry-modules-panel", name: "Industry Modules Panel", releaseDate: "2024-12-10", category: "industries" },
  
  // Earlier features
  { id: "neurorouter", name: "NeuroRouter AI", releaseDate: "2024-11-25", category: "ai" },
  { id: "session-replay", name: "Session Replay", releaseDate: "2024-10-15", category: "capture" },
  { id: "ux-intelligence", name: "UX Intelligence", releaseDate: "2024-10-01", category: "ux" },
];

/**
 * Calculate the feature stage based on release date
 * @param releaseDate - ISO date string of when feature was released
 * @returns 'beta' (0-14 days), 'new' (15-30 days), or null (>30 days)
 */
export function getFeatureStage(releaseDate: string): FeatureStage {
  const release = new Date(releaseDate);
  const now = new Date();
  const diffTime = now.getTime() - release.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // Future release - show as beta (coming soon)
    return 'beta';
  } else if (diffDays <= 14) {
    // First 14 days - Beta
    return 'beta';
  } else if (diffDays <= 30) {
    // Days 15-30 - New
    return 'new';
  }
  
  // After 30 days - no badge
  return null;
}

/**
 * Get feature stage by feature ID
 */
export function getFeatureStageById(featureId: string): FeatureStage {
  const feature = featureReleases.find(f => f.id === featureId);
  if (!feature) return null;
  return getFeatureStage(feature.releaseDate);
}

/**
 * Get days remaining until next stage transition
 */
export function getDaysUntilNextStage(releaseDate: string): number | null {
  const release = new Date(releaseDate);
  const now = new Date();
  const diffTime = now.getTime() - release.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 14) {
    // Days until "New" stage
    return 14 - diffDays;
  } else if (diffDays <= 30) {
    // Days until badge disappears
    return 30 - diffDays;
  }
  
  return null;
}

/**
 * Get badge styling based on stage
 */
export function getFeatureBadgeStyles(stage: FeatureStage): {
  className: string;
  label: string;
} | null {
  switch (stage) {
    case 'beta':
      return {
        className: 'bg-purple-500/10 text-purple-600 border-purple-300',
        label: 'Beta'
      };
    case 'new':
      return {
        className: 'bg-emerald-500/10 text-emerald-600 border-emerald-300',
        label: 'New'
      };
    default:
      return null;
  }
}

/**
 * Check if a feature is newly released (within 30 days)
 */
export function isNewFeature(featureId: string): boolean {
  const stage = getFeatureStageById(featureId);
  return stage !== null;
}

/**
 * Get all features by stage
 */
export function getFeaturesByStage(stage: FeatureStage): FeatureRelease[] {
  return featureReleases.filter(f => getFeatureStage(f.releaseDate) === stage);
}

/**
 * Get feature release info
 */
export function getFeatureReleaseInfo(featureId: string): {
  stage: FeatureStage;
  daysUntilNextStage: number | null;
  releaseDate: string | null;
} | null {
  const feature = featureReleases.find(f => f.id === featureId);
  if (!feature) return null;
  
  return {
    stage: getFeatureStage(feature.releaseDate),
    daysUntilNextStage: getDaysUntilNextStage(feature.releaseDate),
    releaseDate: feature.releaseDate
  };
}
