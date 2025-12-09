import { useEffect, Suspense, lazy, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminLoadingFallback } from "@/components/admin/AdminLoadingFallback";

// Pre-load critical admin modules - AdminOverview loads immediately
const AdminOverview = lazy(() => import("@/components/admin/AdminOverview").then(m => ({ default: m.AdminOverview })));

// All admin modules use React.lazy for automatic code splitting
// Each module gets its own chunk, loaded only when needed
const LazyComponents = {
  quotes: lazy(() => import("@/components/admin/AdminQuotes").then(m => ({ default: m.AdminQuotes }))),
  invoices: lazy(() => import("@/components/admin/AdminInvoices").then(m => ({ default: m.AdminInvoices }))),
  users: lazy(() => import("@/components/admin/AdminUsers").then(m => ({ default: m.AdminUsers }))),
  inquiries: lazy(() => import("@/components/admin/AdminInquiries").then(m => ({ default: m.AdminInquiries }))),
  settings: lazy(() => import("@/components/admin/AdminSettings").then(m => ({ default: m.AdminSettings }))),
  analytics: lazy(() => import("@/components/admin/modules/AdminAnalytics").then(m => ({ default: m.AdminAnalytics }))),
  analyticsDashboard: lazy(() => import("@/components/admin/modules/AdminAnalyticsDashboard").then(m => ({ default: m.AdminAnalyticsDashboard }))),
  abTesting: lazy(() => import("@/components/admin/modules/AdminABTesting").then(m => ({ default: m.AdminABTesting }))),
  abResults: lazy(() => import("@/components/admin/modules/AdminABResults").then(m => ({ default: m.AdminABResults }))),
  predictive: lazy(() => import("@/components/admin/modules/AdminPredictiveAnalytics").then(m => ({ default: m.AdminPredictiveAnalytics }))),
  onboardingApprovals: lazy(() => import("@/components/admin/modules/AdminOnboardingApprovals").then(m => ({ default: m.AdminOnboardingApprovals }))),
  auditLogs: lazy(() => import("@/components/admin/modules/AdminAuditLogs").then(m => ({ default: m.AdminAuditLogs }))),
  clientNotices: lazy(() => import("@/components/admin/modules/AdminClientNotices").then(m => ({ default: m.AdminClientNotices }))),
  compliance: lazy(() => import("@/components/admin/modules/AdminCompliance").then(m => ({ default: m.AdminCompliance }))),
  systemLogs: lazy(() => import("@/components/admin/modules/AdminSystemLogs").then(m => ({ default: m.AdminSystemLogs }))),
  integrations: lazy(() => import("@/components/admin/modules/AdminIntegrations").then(m => ({ default: m.AdminIntegrations }))),
  portalSettings: lazy(() => import("@/components/admin/modules/AdminPortalSettings").then(m => ({ default: m.AdminPortalSettings }))),
  crm: lazy(() => import("@/components/admin/modules/AdminCRM").then(m => ({ default: m.AdminCRM }))),
  clickstream: lazy(() => import("@/components/admin/modules/AdminClickstream").then(m => ({ default: m.AdminClickstream }))),
  msp: lazy(() => import("@/components/admin/modules/AdminMSPMonitoring").then(m => ({ default: m.AdminMSPMonitoring }))),
  marketing: lazy(() => import("@/components/admin/modules/AdminMarketing").then(m => ({ default: m.AdminMarketing }))),
  projects: lazy(() => import("@/components/admin/modules/AdminProjects").then(m => ({ default: m.AdminProjects }))),
  tickets: lazy(() => import("@/components/admin/modules/AdminTickets").then(m => ({ default: m.AdminTickets }))),
  meetings: lazy(() => import("@/components/admin/modules/AdminMeetings").then(m => ({ default: m.AdminMeetings }))),
  files: lazy(() => import("@/components/admin/modules/AdminFiles").then(m => ({ default: m.AdminFiles }))),
  aiDashboard: lazy(() => import("@/components/admin/modules/AdminAIDashboard").then(m => ({ default: m.AdminAIDashboard }))),
  team: lazy(() => import("@/components/admin/modules/AdminTeamManagement").then(m => ({ default: m.AdminTeamManagement }))),
  superAdmin: lazy(() => import("@/components/admin/modules/AdminSuperAdmin").then(m => ({ default: m.AdminSuperAdmin }))),
  plugins: lazy(() => import("@/components/admin/modules/AdminPluginsManagement").then(m => ({ default: m.AdminPluginsManagement }))),
  tenants: lazy(() => import("@/components/admin/modules/AdminTenantManagement")),
  pricing: lazy(() => import("@/components/admin/modules/AdminPricingManagement")),
  onboardingTracker: lazy(() => import("@/components/admin/modules/AdminOnboardingTracker")),
  tenantBilling: lazy(() => import("@/components/admin/modules/AdminTenantBilling").then(m => ({ default: m.AdminTenantBilling }))),
  revenue: lazy(() => import("@/components/admin/modules/AdminRevenueAnalytics").then(m => ({ default: m.AdminRevenueAnalytics }))),
  systemHealth: lazy(() => import("@/components/admin/modules/AdminSystemHealth").then(m => ({ default: m.AdminSystemHealth }))),
  pipeline: lazy(() => import("@/components/admin/modules/AdminPipelineManagement").then(m => ({ default: m.AdminPipelineManagement }))),
  threats: lazy(() => import("@/components/admin/modules/AdminThreatDetection").then(m => ({ default: m.AdminThreatDetection }))),
  cloud: lazy(() => import("@/components/admin/modules/AdminCloudResources").then(m => ({ default: m.AdminCloudResources }))),
  accessControl: lazy(() => import("@/components/admin/modules/AdminAccessControl").then(m => ({ default: m.AdminAccessControl }))),
  emailCampaigns: lazy(() => import("@/components/admin/modules/AdminEmailCampaigns").then(m => ({ default: m.AdminEmailCampaigns }))),
  leadScoring: lazy(() => import("@/components/admin/modules/AdminLeadScoring").then(m => ({ default: m.AdminLeadScoring }))),
  apiGateway: lazy(() => import("@/components/admin/modules/AdminAPIGateway").then(m => ({ default: m.AdminAPIGateway }))),
  database: lazy(() => import("@/components/admin/modules/AdminDatabaseStatus").then(m => ({ default: m.AdminDatabaseStatus }))),
  clientHealth: lazy(() => import("@/components/admin/modules/AdminClientHealth").then(m => ({ default: m.AdminClientHealth }))),
  funnels: lazy(() => import("@/components/admin/modules/AdminConversionFunnels").then(m => ({ default: m.AdminConversionFunnels }))),
  projectTimeline: lazy(() => import("@/components/admin/modules/AdminProjectTimeline").then(m => ({ default: m.AdminProjectTimeline }))),
  videoConference: lazy(() => import("@/components/admin/modules/AdminVideoConference").then(m => ({ default: m.AdminVideoConference }))),
  roles: lazy(() => import("@/components/admin/modules/AdminRolesPermissions").then(m => ({ default: m.AdminRolesPermissions }))),
  backup: lazy(() => import("@/components/admin/modules/AdminBackupRecovery").then(m => ({ default: m.AdminBackupRecovery }))),
  apiKeys: lazy(() => import("@/components/admin/modules/AdminAPIKeysWebhooks").then(m => ({ default: m.AdminAPIKeysWebhooks }))),
  liveChat: lazy(() => import("@/components/admin/modules/AdminLiveChat").then(m => ({ default: m.AdminLiveChat }))),
  aiUsage: lazy(() => import("@/components/admin/modules/AdminAIUsage").then(m => ({ default: m.AdminAIUsage }))),
  aiModels: lazy(() => import("@/components/admin/modules/AdminAIModels").then(m => ({ default: m.AdminAIModels }))),
  automationLogs: lazy(() => import("@/components/admin/modules/AdminAutomationLogs").then(m => ({ default: m.AdminAutomationLogs }))),
  serverHealth: lazy(() => import("@/components/admin/modules/AdminServerHealth").then(m => ({ default: m.AdminServerHealth }))),
  featureFlags: lazy(() => import("@/components/admin/modules/AdminFeatureFlags").then(m => ({ default: m.AdminFeatureFlags }))),
  notifications: lazy(() => import("@/components/admin/AdminNotificationSystem").then(m => ({ default: m.AdminNotificationSystem }))),
  notificationPrefs: lazy(() => import("@/components/admin/AdminNotificationPreferences").then(m => ({ default: m.AdminNotificationPreferences }))),
};

// Get module name from path for loading indicator
const getModuleName = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  if (segments.length <= 1) return 'Dashboard';
  const name = segments[1].replace(/-/g, ' ');
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    } else if (!authLoading && !roleLoading && !isAdmin) {
      navigate("/portal");
    }
  }, [user, authLoading, isAdmin, roleLoading, navigate]);

  // Memoize the content to prevent unnecessary re-renders
  const content = useMemo(() => {
    const path = location.pathname;
    
    // Command Center
    if (path === "/admin" || path === "/admin/") return <AdminOverview />;
    if (path === "/admin/analytics") return <LazyComponents.analyticsDashboard />;
    if (path.startsWith("/admin/analytics/basic")) return <LazyComponents.analytics />;
    if (path.startsWith("/admin/health")) return <LazyComponents.systemHealth />;
    
    // Tenant Management
    if (path.startsWith("/admin/tenants")) return <LazyComponents.tenants />;
    if (path.startsWith("/admin/tenant-billing")) return <LazyComponents.tenantBilling />;
    if (path.startsWith("/admin/tenant-usage")) return <LazyComponents.revenue />;
    if (path.startsWith("/admin/tenant-config")) return <LazyComponents.accessControl />;
    if (path.startsWith("/admin/plugins")) return <LazyComponents.plugins />;
    
    // Sales & Revenue
    if (path.startsWith("/admin/crm")) return <LazyComponents.crm />;
    if (path.startsWith("/admin/pipeline")) return <LazyComponents.pipeline />;
    if (path.startsWith("/admin/quotes")) return <LazyComponents.quotes />;
    if (path.startsWith("/admin/invoices")) return <LazyComponents.invoices />;
    if (path.startsWith("/admin/revenue")) return <LazyComponents.revenue />;
    if (path.startsWith("/admin/pricing")) return <LazyComponents.pricing />;
    
    // Client Management
    if (path.startsWith("/admin/users")) return <LazyComponents.users />;
    if (path.startsWith("/admin/onboarding-tracker")) return <LazyComponents.onboardingTracker />;
    if (path.startsWith("/admin/onboarding")) return <LazyComponents.onboardingApprovals />;
    if (path.startsWith("/admin/client-health")) return <LazyComponents.clientHealth />;
    if (path.startsWith("/admin/notices")) return <LazyComponents.clientNotices />;
    
    // Marketing & Growth
    if (path.startsWith("/admin/clickstream")) return <LazyComponents.clickstream />;
    if (path.startsWith("/admin/marketing")) return <LazyComponents.marketing />;
    if (path.startsWith("/admin/lead-scoring")) return <LazyComponents.leadScoring />;
    if (path.startsWith("/admin/email-campaigns")) return <LazyComponents.emailCampaigns />;
    if (path.startsWith("/admin/funnels")) return <LazyComponents.funnels />;
    if (path.match(/^\/admin\/ab-testing\/[^/]+$/)) return <LazyComponents.abResults />;
    if (path === "/admin/ab-testing") return <LazyComponents.abTesting />;
    if (path.startsWith("/admin/predictive")) return <LazyComponents.predictive />;
    
    // Operations & Projects
    if (path.startsWith("/admin/projects")) return <LazyComponents.projects />;
    if (path.startsWith("/admin/project-timeline")) return <LazyComponents.projectTimeline />;
    if (path.startsWith("/admin/files")) return <LazyComponents.files />;
    if (path.startsWith("/admin/team")) return <LazyComponents.team />;
    
    // Support & Communication
    if (path.startsWith("/admin/tickets")) return <LazyComponents.tickets />;
    if (path.startsWith("/admin/chat")) return <LazyComponents.liveChat />;
    if (path.startsWith("/admin/meetings")) return <LazyComponents.meetings />;
    if (path.startsWith("/admin/video-calls")) return <LazyComponents.videoConference />;
    if (path.startsWith("/admin/inquiries")) return <LazyComponents.inquiries />;
    
    // AI & Intelligence
    if (path.startsWith("/admin/ai")) return <LazyComponents.aiDashboard />;
    if (path.startsWith("/admin/ai-usage")) return <LazyComponents.aiUsage />;
    if (path.startsWith("/admin/ai-models")) return <LazyComponents.aiModels />;
    if (path.startsWith("/admin/automation-logs")) return <LazyComponents.automationLogs />;
    
    // Infrastructure & MSP
    if (path.startsWith("/admin/msp")) return <LazyComponents.msp />;
    if (path.startsWith("/admin/servers")) return <LazyComponents.serverHealth />;
    if (path.startsWith("/admin/cloud")) return <LazyComponents.cloud />;
    if (path.startsWith("/admin/database")) return <LazyComponents.database />;
    if (path.startsWith("/admin/api-gateway")) return <LazyComponents.apiGateway />;
    
    // Security & Compliance
    if (path.startsWith("/admin/security")) return <LazyComponents.compliance />;
    if (path.startsWith("/admin/access-control")) return <LazyComponents.accessControl />;
    if (path.startsWith("/admin/compliance")) return <LazyComponents.compliance />;
    if (path.startsWith("/admin/threats")) return <LazyComponents.threats />;
    if (path.startsWith("/admin/audit")) return <LazyComponents.auditLogs />;
    
    // Platform Settings
    if (path.startsWith("/admin/portal-settings")) return <LazyComponents.portalSettings />;
    if (path.startsWith("/admin/roles")) return <LazyComponents.roles />;
    if (path.startsWith("/admin/integrations")) return <LazyComponents.integrations />;
    if (path.startsWith("/admin/api-keys")) return <LazyComponents.apiKeys />;
    if (path.startsWith("/admin/feature-flags")) return <LazyComponents.featureFlags />;
    if (path.startsWith("/admin/logs")) return <LazyComponents.systemLogs />;
    if (path.startsWith("/admin/backup")) return <LazyComponents.backup />;
    if (path.startsWith("/admin/super")) return <LazyComponents.superAdmin />;
    if (path.startsWith("/admin/notifications/preferences")) return <LazyComponents.notificationPrefs />;
    if (path.startsWith("/admin/notifications")) return <LazyComponents.notifications />;
    if (path.startsWith("/admin/settings")) return <LazyComponents.settings />;
    
    return <AdminOverview />;
  }, [location.pathname]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AdminLoadingFallback module="Authentication" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <Suspense fallback={<AdminLoadingFallback module={getModuleName(location.pathname)} />}>
        {content}
      </Suspense>
    </AdminLayout>
  );
};

export default AdminPage;
