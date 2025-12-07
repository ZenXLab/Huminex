import { useEffect, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboardSkeleton, AdminTableSkeleton } from "@/components/admin/AdminCardSkeleton";
import { Loader2 } from "lucide-react";

// Lazy load all admin modules for code splitting
const AdminOverview = lazy(() => import("@/components/admin/AdminOverview").then(m => ({ default: m.AdminOverview })));
const AdminQuotes = lazy(() => import("@/components/admin/AdminQuotes").then(m => ({ default: m.AdminQuotes })));
const AdminInvoices = lazy(() => import("@/components/admin/AdminInvoices").then(m => ({ default: m.AdminInvoices })));
const AdminUsers = lazy(() => import("@/components/admin/AdminUsers").then(m => ({ default: m.AdminUsers })));
const AdminInquiries = lazy(() => import("@/components/admin/AdminInquiries").then(m => ({ default: m.AdminInquiries })));
const AdminSettings = lazy(() => import("@/components/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));
const AdminAnalytics = lazy(() => import("@/components/admin/modules/AdminAnalytics").then(m => ({ default: m.AdminAnalytics })));
const AdminAnalyticsDashboard = lazy(() => import("@/components/admin/modules/AdminAnalyticsDashboard").then(m => ({ default: m.AdminAnalyticsDashboard })));
const AdminABTesting = lazy(() => import("@/components/admin/modules/AdminABTesting").then(m => ({ default: m.AdminABTesting })));
const AdminABResults = lazy(() => import("@/components/admin/modules/AdminABResults").then(m => ({ default: m.AdminABResults })));
const AdminPredictiveAnalytics = lazy(() => import("@/components/admin/modules/AdminPredictiveAnalytics").then(m => ({ default: m.AdminPredictiveAnalytics })));
const AdminOnboardingApprovals = lazy(() => import("@/components/admin/modules/AdminOnboardingApprovals").then(m => ({ default: m.AdminOnboardingApprovals })));
const AdminAuditLogs = lazy(() => import("@/components/admin/modules/AdminAuditLogs").then(m => ({ default: m.AdminAuditLogs })));
const AdminClientNotices = lazy(() => import("@/components/admin/modules/AdminClientNotices").then(m => ({ default: m.AdminClientNotices })));
const AdminCompliance = lazy(() => import("@/components/admin/modules/AdminCompliance").then(m => ({ default: m.AdminCompliance })));
const AdminSystemLogs = lazy(() => import("@/components/admin/modules/AdminSystemLogs").then(m => ({ default: m.AdminSystemLogs })));
const AdminIntegrations = lazy(() => import("@/components/admin/modules/AdminIntegrations").then(m => ({ default: m.AdminIntegrations })));
const AdminPortalSettings = lazy(() => import("@/components/admin/modules/AdminPortalSettings").then(m => ({ default: m.AdminPortalSettings })));
const AdminCRM = lazy(() => import("@/components/admin/modules/AdminCRM").then(m => ({ default: m.AdminCRM })));
const AdminClickstream = lazy(() => import("@/components/admin/modules/AdminClickstream").then(m => ({ default: m.AdminClickstream })));
const AdminMSPMonitoring = lazy(() => import("@/components/admin/modules/AdminMSPMonitoring").then(m => ({ default: m.AdminMSPMonitoring })));
const AdminMarketing = lazy(() => import("@/components/admin/modules/AdminMarketing").then(m => ({ default: m.AdminMarketing })));
const AdminProjects = lazy(() => import("@/components/admin/modules/AdminProjects").then(m => ({ default: m.AdminProjects })));
const AdminTickets = lazy(() => import("@/components/admin/modules/AdminTickets").then(m => ({ default: m.AdminTickets })));
const AdminMeetings = lazy(() => import("@/components/admin/modules/AdminMeetings").then(m => ({ default: m.AdminMeetings })));
const AdminFiles = lazy(() => import("@/components/admin/modules/AdminFiles").then(m => ({ default: m.AdminFiles })));
const AdminAIDashboard = lazy(() => import("@/components/admin/modules/AdminAIDashboard").then(m => ({ default: m.AdminAIDashboard })));
const AdminTeamManagement = lazy(() => import("@/components/admin/modules/AdminTeamManagement").then(m => ({ default: m.AdminTeamManagement })));
const AdminSuperAdmin = lazy(() => import("@/components/admin/modules/AdminSuperAdmin").then(m => ({ default: m.AdminSuperAdmin })));
const AdminPluginsManagement = lazy(() => import("@/components/admin/modules/AdminPluginsManagement").then(m => ({ default: m.AdminPluginsManagement })));
const AdminTenantManagement = lazy(() => import("@/components/admin/modules/AdminTenantManagement"));
const AdminPricingManagement = lazy(() => import("@/components/admin/modules/AdminPricingManagement"));
const AdminOnboardingTracker = lazy(() => import("@/components/admin/modules/AdminOnboardingTracker"));
const AdminTenantBilling = lazy(() => import("@/components/admin/modules/AdminTenantBilling").then(m => ({ default: m.AdminTenantBilling })));
const AdminRevenueAnalytics = lazy(() => import("@/components/admin/modules/AdminRevenueAnalytics").then(m => ({ default: m.AdminRevenueAnalytics })));
const AdminSystemHealth = lazy(() => import("@/components/admin/modules/AdminSystemHealth").then(m => ({ default: m.AdminSystemHealth })));
const AdminPipelineManagement = lazy(() => import("@/components/admin/modules/AdminPipelineManagement").then(m => ({ default: m.AdminPipelineManagement })));
const AdminThreatDetection = lazy(() => import("@/components/admin/modules/AdminThreatDetection").then(m => ({ default: m.AdminThreatDetection })));
const AdminCloudResources = lazy(() => import("@/components/admin/modules/AdminCloudResources").then(m => ({ default: m.AdminCloudResources })));
const AdminAccessControl = lazy(() => import("@/components/admin/modules/AdminAccessControl").then(m => ({ default: m.AdminAccessControl })));
const AdminEmailCampaigns = lazy(() => import("@/components/admin/modules/AdminEmailCampaigns").then(m => ({ default: m.AdminEmailCampaigns })));
const AdminLeadScoring = lazy(() => import("@/components/admin/modules/AdminLeadScoring").then(m => ({ default: m.AdminLeadScoring })));
const AdminAPIGateway = lazy(() => import("@/components/admin/modules/AdminAPIGateway").then(m => ({ default: m.AdminAPIGateway })));
const AdminDatabaseStatus = lazy(() => import("@/components/admin/modules/AdminDatabaseStatus").then(m => ({ default: m.AdminDatabaseStatus })));
const AdminClientHealth = lazy(() => import("@/components/admin/modules/AdminClientHealth").then(m => ({ default: m.AdminClientHealth })));
const AdminConversionFunnels = lazy(() => import("@/components/admin/modules/AdminConversionFunnels").then(m => ({ default: m.AdminConversionFunnels })));
const AdminProjectTimeline = lazy(() => import("@/components/admin/modules/AdminProjectTimeline").then(m => ({ default: m.AdminProjectTimeline })));
const AdminVideoConference = lazy(() => import("@/components/admin/modules/AdminVideoConference").then(m => ({ default: m.AdminVideoConference })));
const AdminRolesPermissions = lazy(() => import("@/components/admin/modules/AdminRolesPermissions").then(m => ({ default: m.AdminRolesPermissions })));
const AdminBackupRecovery = lazy(() => import("@/components/admin/modules/AdminBackupRecovery").then(m => ({ default: m.AdminBackupRecovery })));
const AdminAPIKeysWebhooks = lazy(() => import("@/components/admin/modules/AdminAPIKeysWebhooks").then(m => ({ default: m.AdminAPIKeysWebhooks })));
const AdminLiveChat = lazy(() => import("@/components/admin/modules/AdminLiveChat").then(m => ({ default: m.AdminLiveChat })));
const AdminAIUsage = lazy(() => import("@/components/admin/modules/AdminAIUsage").then(m => ({ default: m.AdminAIUsage })));
const AdminAIModels = lazy(() => import("@/components/admin/modules/AdminAIModels").then(m => ({ default: m.AdminAIModels })));
const AdminAutomationLogs = lazy(() => import("@/components/admin/modules/AdminAutomationLogs").then(m => ({ default: m.AdminAutomationLogs })));
const AdminServerHealth = lazy(() => import("@/components/admin/modules/AdminServerHealth").then(m => ({ default: m.AdminServerHealth })));
const AdminFeatureFlags = lazy(() => import("@/components/admin/modules/AdminFeatureFlags").then(m => ({ default: m.AdminFeatureFlags })));
const AdminNotificationSystem = lazy(() => import("@/components/admin/AdminNotificationSystem").then(m => ({ default: m.AdminNotificationSystem })));
const AdminNotificationPreferences = lazy(() => import("@/components/admin/AdminNotificationPreferences").then(m => ({ default: m.AdminNotificationPreferences })));

// Loading fallback based on route type
const getLoadingFallback = (path: string) => {
  // Dashboard-style pages
  if (path === "/admin" || path.includes("analytics") || path.includes("health") || path.includes("overview")) {
    return <AdminDashboardSkeleton />;
  }
  // Table-heavy pages
  return <AdminTableSkeleton rows={8} />;
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

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const renderContent = () => {
    const path = location.pathname;
    
    // Command Center
    if (path === "/admin" || path === "/admin/") return <AdminOverview />;
    if (path === "/admin/analytics") return <AdminAnalyticsDashboard />;
    if (path.startsWith("/admin/analytics/basic")) return <AdminAnalytics />;
    if (path.startsWith("/admin/health")) return <AdminSystemHealth />;
    
    // Tenant Management
    if (path.startsWith("/admin/tenants")) return <AdminTenantManagement />;
    if (path.startsWith("/admin/tenant-billing")) return <AdminTenantBilling />;
    if (path.startsWith("/admin/tenant-usage")) return <AdminRevenueAnalytics />;
    if (path.startsWith("/admin/tenant-config")) return <AdminAccessControl />;
    if (path.startsWith("/admin/plugins")) return <AdminPluginsManagement />;
    
    // Sales & Revenue
    if (path.startsWith("/admin/crm")) return <AdminCRM />;
    if (path.startsWith("/admin/pipeline")) return <AdminPipelineManagement />;
    if (path.startsWith("/admin/quotes")) return <AdminQuotes />;
    if (path.startsWith("/admin/invoices")) return <AdminInvoices />;
    if (path.startsWith("/admin/revenue")) return <AdminRevenueAnalytics />;
    if (path.startsWith("/admin/pricing")) return <AdminPricingManagement />;
    
    // Client Management
    if (path.startsWith("/admin/users")) return <AdminUsers />;
    if (path.startsWith("/admin/onboarding-tracker")) return <AdminOnboardingTracker />;
    if (path.startsWith("/admin/onboarding")) return <AdminOnboardingApprovals />;
    if (path.startsWith("/admin/client-health")) return <AdminClientHealth />;
    if (path.startsWith("/admin/notices")) return <AdminClientNotices />;
    
    // Marketing & Growth
    if (path.startsWith("/admin/clickstream")) return <AdminClickstream />;
    if (path.startsWith("/admin/marketing")) return <AdminMarketing />;
    if (path.startsWith("/admin/lead-scoring")) return <AdminLeadScoring />;
    if (path.startsWith("/admin/email-campaigns")) return <AdminEmailCampaigns />;
    if (path.startsWith("/admin/funnels")) return <AdminConversionFunnels />;
    if (path.match(/^\/admin\/ab-testing\/[^/]+$/)) return <AdminABResults />;
    if (path === "/admin/ab-testing") return <AdminABTesting />;
    if (path.startsWith("/admin/predictive")) return <AdminPredictiveAnalytics />;
    
    // Operations & Projects
    if (path.startsWith("/admin/projects")) return <AdminProjects />;
    if (path.startsWith("/admin/project-timeline")) return <AdminProjectTimeline />;
    if (path.startsWith("/admin/files")) return <AdminFiles />;
    if (path.startsWith("/admin/team")) return <AdminTeamManagement />;
    
    // Support & Communication
    if (path.startsWith("/admin/tickets")) return <AdminTickets />;
    if (path.startsWith("/admin/chat")) return <AdminLiveChat />;
    if (path.startsWith("/admin/meetings")) return <AdminMeetings />;
    if (path.startsWith("/admin/video-calls")) return <AdminVideoConference />;
    if (path.startsWith("/admin/inquiries")) return <AdminInquiries />;
    
    // AI & Intelligence
    if (path.startsWith("/admin/ai")) return <AdminAIDashboard />;
    if (path.startsWith("/admin/ai-usage")) return <AdminAIUsage />;
    if (path.startsWith("/admin/ai-models")) return <AdminAIModels />;
    if (path.startsWith("/admin/automation-logs")) return <AdminAutomationLogs />;
    
    // Infrastructure & MSP
    if (path.startsWith("/admin/msp")) return <AdminMSPMonitoring />;
    if (path.startsWith("/admin/servers")) return <AdminServerHealth />;
    if (path.startsWith("/admin/cloud")) return <AdminCloudResources />;
    if (path.startsWith("/admin/database")) return <AdminDatabaseStatus />;
    if (path.startsWith("/admin/api-gateway")) return <AdminAPIGateway />;
    
    // Security & Compliance
    if (path.startsWith("/admin/security")) return <AdminCompliance />;
    if (path.startsWith("/admin/access-control")) return <AdminAccessControl />;
    if (path.startsWith("/admin/compliance")) return <AdminCompliance />;
    if (path.startsWith("/admin/threats")) return <AdminThreatDetection />;
    if (path.startsWith("/admin/audit")) return <AdminAuditLogs />;
    
    // Platform Settings
    if (path.startsWith("/admin/portal-settings")) return <AdminPortalSettings />;
    if (path.startsWith("/admin/roles")) return <AdminRolesPermissions />;
    if (path.startsWith("/admin/integrations")) return <AdminIntegrations />;
    if (path.startsWith("/admin/api-keys")) return <AdminAPIKeysWebhooks />;
    if (path.startsWith("/admin/feature-flags")) return <AdminFeatureFlags />;
    if (path.startsWith("/admin/logs")) return <AdminSystemLogs />;
    if (path.startsWith("/admin/backup")) return <AdminBackupRecovery />;
    if (path.startsWith("/admin/super")) return <AdminSuperAdmin />;
    if (path.startsWith("/admin/notifications/preferences")) return <AdminNotificationPreferences />;
    if (path.startsWith("/admin/notifications")) return <AdminNotificationSystem />;
    if (path.startsWith("/admin/settings")) return <AdminSettings />;
    
    return <AdminOverview />;
  };

  return (
    <AdminLayout>
      <Suspense fallback={getLoadingFallback(location.pathname)}>
        {renderContent()}
      </Suspense>
    </AdminLayout>
  );
};

export default AdminPage;
