// Admin module prefetch registry for instant navigation
// Maps route paths to their lazy import functions

type LazyImportFn = () => Promise<any>;

const moduleImports: Record<string, LazyImportFn> = {
  "/admin": () => import("@/components/admin/AdminOverview"),
  "/admin/analytics": () => import("@/components/admin/modules/AdminAnalyticsDashboard"),
  "/admin/analytics/basic": () => import("@/components/admin/modules/AdminAnalytics"),
  "/admin/health": () => import("@/components/admin/modules/AdminSystemHealth"),
  "/admin/tenants": () => import("@/components/admin/modules/AdminTenantManagement"),
  "/admin/tenant-billing": () => import("@/components/admin/modules/AdminTenantBilling"),
  "/admin/tenant-usage": () => import("@/components/admin/modules/AdminRevenueAnalytics"),
  "/admin/tenant-config": () => import("@/components/admin/modules/AdminAccessControl"),
  "/admin/plugins": () => import("@/components/admin/modules/AdminPluginsManagement"),
  "/admin/crm": () => import("@/components/admin/modules/AdminCRM"),
  "/admin/pipeline": () => import("@/components/admin/modules/AdminPipelineManagement"),
  "/admin/quotes": () => import("@/components/admin/AdminQuotes"),
  "/admin/invoices": () => import("@/components/admin/AdminInvoices"),
  "/admin/revenue": () => import("@/components/admin/modules/AdminRevenueAnalytics"),
  "/admin/pricing": () => import("@/components/admin/modules/AdminPricingManagement"),
  "/admin/users": () => import("@/components/admin/AdminUsers"),
  "/admin/onboarding-tracker": () => import("@/components/admin/modules/AdminOnboardingTracker"),
  "/admin/onboarding": () => import("@/components/admin/modules/AdminOnboardingApprovals"),
  "/admin/client-health": () => import("@/components/admin/modules/AdminClientHealth"),
  "/admin/notices": () => import("@/components/admin/modules/AdminClientNotices"),
  "/admin/clickstream": () => import("@/components/admin/modules/AdminClickstream"),
  "/admin/marketing": () => import("@/components/admin/modules/AdminMarketing"),
  "/admin/lead-scoring": () => import("@/components/admin/modules/AdminLeadScoring"),
  "/admin/email-campaigns": () => import("@/components/admin/modules/AdminEmailCampaigns"),
  "/admin/funnels": () => import("@/components/admin/modules/AdminConversionFunnels"),
  "/admin/ab-testing": () => import("@/components/admin/modules/AdminABTesting"),
  "/admin/predictive": () => import("@/components/admin/modules/AdminPredictiveAnalytics"),
  "/admin/projects": () => import("@/components/admin/modules/AdminProjects"),
  "/admin/project-timeline": () => import("@/components/admin/modules/AdminProjectTimeline"),
  "/admin/files": () => import("@/components/admin/modules/AdminFiles"),
  "/admin/team": () => import("@/components/admin/modules/AdminTeamManagement"),
  "/admin/tickets": () => import("@/components/admin/modules/AdminTickets"),
  "/admin/chat": () => import("@/components/admin/modules/AdminLiveChat"),
  "/admin/meetings": () => import("@/components/admin/modules/AdminMeetings"),
  "/admin/video-calls": () => import("@/components/admin/modules/AdminVideoConference"),
  "/admin/inquiries": () => import("@/components/admin/AdminInquiries"),
  "/admin/ai": () => import("@/components/admin/modules/AdminAIDashboard"),
  "/admin/ai-usage": () => import("@/components/admin/modules/AdminAIUsage"),
  "/admin/ai-models": () => import("@/components/admin/modules/AdminAIModels"),
  "/admin/automation-logs": () => import("@/components/admin/modules/AdminAutomationLogs"),
  "/admin/msp": () => import("@/components/admin/modules/AdminMSPMonitoring"),
  "/admin/servers": () => import("@/components/admin/modules/AdminServerHealth"),
  "/admin/cloud": () => import("@/components/admin/modules/AdminCloudResources"),
  "/admin/database": () => import("@/components/admin/modules/AdminDatabaseStatus"),
  "/admin/api-gateway": () => import("@/components/admin/modules/AdminAPIGateway"),
  "/admin/security": () => import("@/components/admin/modules/AdminCompliance"),
  "/admin/access-control": () => import("@/components/admin/modules/AdminAccessControl"),
  "/admin/compliance": () => import("@/components/admin/modules/AdminCompliance"),
  "/admin/threats": () => import("@/components/admin/modules/AdminThreatDetection"),
  "/admin/audit": () => import("@/components/admin/modules/AdminAuditLogs"),
  "/admin/portal-settings": () => import("@/components/admin/modules/AdminPortalSettings"),
  "/admin/roles": () => import("@/components/admin/modules/AdminRolesPermissions"),
  "/admin/integrations": () => import("@/components/admin/modules/AdminIntegrations"),
  "/admin/api-keys": () => import("@/components/admin/modules/AdminAPIKeysWebhooks"),
  "/admin/feature-flags": () => import("@/components/admin/modules/AdminFeatureFlags"),
  "/admin/logs": () => import("@/components/admin/modules/AdminSystemLogs"),
  "/admin/backup": () => import("@/components/admin/modules/AdminBackupRecovery"),
  "/admin/super": () => import("@/components/admin/modules/AdminSuperAdmin"),
  "/admin/notifications": () => import("@/components/admin/AdminNotificationSystem"),
  "/admin/notifications/preferences": () => import("@/components/admin/AdminNotificationPreferences"),
  "/admin/settings": () => import("@/components/admin/AdminSettings"),
};

// Track which modules have already been prefetched
const prefetchedModules = new Set<string>();

/**
 * Prefetch an admin module by its route path
 * Only prefetches once per session to avoid redundant network requests
 */
export const prefetchAdminModule = (path: string): void => {
  // Normalize path
  const normalizedPath = path.split("?")[0]; // Remove query params
  
  // Check if already prefetched
  if (prefetchedModules.has(normalizedPath)) {
    return;
  }

  // Find matching import function
  const importFn = moduleImports[normalizedPath];
  
  if (importFn) {
    // Mark as prefetched immediately to prevent duplicate requests
    prefetchedModules.add(normalizedPath);
    
    // Trigger the import (browser will cache it)
    importFn().catch(() => {
      // If prefetch fails, remove from set so it can be retried
      prefetchedModules.delete(normalizedPath);
    });
  }
};

/**
 * Prefetch multiple admin modules at once
 */
export const prefetchAdminModules = (paths: string[]): void => {
  paths.forEach(prefetchAdminModule);
};

/**
 * Check if a module has been prefetched
 */
export const isModulePrefetched = (path: string): boolean => {
  return prefetchedModules.has(path.split("?")[0]);
};

/**
 * Get the number of prefetched modules (for debugging)
 */
export const getPrefetchedCount = (): number => {
  return prefetchedModules.size;
};

/**
 * Critical modules to prefetch on idle for instant navigation
 */
const criticalModules = [
  "/admin",
  "/admin/analytics",
  "/admin/tenants",
  "/admin/clickstream",
  "/admin/quotes",
  "/admin/invoices",
];

/**
 * Prefetch critical admin modules when browser is idle
 * This ensures the most common modules are ready before user navigates
 */
export const prefetchCriticalModulesOnIdle = (): void => {
  if (typeof window === "undefined") return;
  
  const prefetchAll = () => {
    criticalModules.forEach((path, index) => {
      // Stagger prefetching to avoid blocking
      setTimeout(() => prefetchAdminModule(path), index * 100);
    });
  };

  // Use requestIdleCallback if available, otherwise setTimeout
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(prefetchAll, { timeout: 3000 });
  } else {
    setTimeout(prefetchAll, 1000);
  }
};
