import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminQuotes } from "@/components/admin/AdminQuotes";
import { AdminInvoices } from "@/components/admin/AdminInvoices";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminInquiries } from "@/components/admin/AdminInquiries";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminAnalytics } from "@/components/admin/modules/AdminAnalytics";
import { AdminOnboardingApprovals } from "@/components/admin/modules/AdminOnboardingApprovals";
import { AdminAuditLogs } from "@/components/admin/modules/AdminAuditLogs";
import { AdminClientNotices } from "@/components/admin/modules/AdminClientNotices";
import { AdminCompliance } from "@/components/admin/modules/AdminCompliance";
import { AdminSystemLogs } from "@/components/admin/modules/AdminSystemLogs";
import { AdminIntegrations } from "@/components/admin/modules/AdminIntegrations";
import { AdminPortalSettings } from "@/components/admin/modules/AdminPortalSettings";
import { AdminCRM } from "@/components/admin/modules/AdminCRM";
import { AdminClickstream } from "@/components/admin/modules/AdminClickstream";
import { AdminMSPMonitoring } from "@/components/admin/modules/AdminMSPMonitoring";
import { AdminMarketing } from "@/components/admin/modules/AdminMarketing";
import { AdminProjects } from "@/components/admin/modules/AdminProjects";
import { AdminTickets } from "@/components/admin/modules/AdminTickets";
import { AdminMeetings } from "@/components/admin/modules/AdminMeetings";
import { AdminFiles } from "@/components/admin/modules/AdminFiles";
import { AdminAIDashboard } from "@/components/admin/modules/AdminAIDashboard";
import { AdminTeamManagement } from "@/components/admin/modules/AdminTeamManagement";
import { AdminSuperAdmin } from "@/components/admin/modules/AdminSuperAdmin";
import { AdminPluginsManagement } from "@/components/admin/modules/AdminPluginsManagement";
import AdminTenantManagement from "@/components/admin/modules/AdminTenantManagement";
import AdminPricingManagement from "@/components/admin/modules/AdminPricingManagement";
import AdminOnboardingTracker from "@/components/admin/modules/AdminOnboardingTracker";
import { AdminPlaceholderPage } from "@/components/admin/modules/AdminPlaceholderPage";
import { AdminTenantBilling } from "@/components/admin/modules/AdminTenantBilling";
import { AdminRevenueAnalytics } from "@/components/admin/modules/AdminRevenueAnalytics";
import { AdminSystemHealth } from "@/components/admin/modules/AdminSystemHealth";
import { AdminPipelineManagement } from "@/components/admin/modules/AdminPipelineManagement";
import { AdminThreatDetection } from "@/components/admin/modules/AdminThreatDetection";
import { AdminCloudResources } from "@/components/admin/modules/AdminCloudResources";
import { AdminAccessControl } from "@/components/admin/modules/AdminAccessControl";
import { AdminEmailCampaigns } from "@/components/admin/modules/AdminEmailCampaigns";
import { AdminLeadScoring } from "@/components/admin/modules/AdminLeadScoring";
import { AdminAPIGateway } from "@/components/admin/modules/AdminAPIGateway";
import { AdminDatabaseStatus } from "@/components/admin/modules/AdminDatabaseStatus";
import { Loader2 } from "lucide-react";
import { 
  Gauge, CreditCard, TrendingUp, Settings, Target, Mail, Workflow,
  Phone, Video, Brain, Wallet, HardDrive, Cloud, Database, Globe,
  Key, AlertTriangle, UserCog, Layers, RefreshCw, Calendar
} from "lucide-react";

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
    if (path.startsWith("/admin/analytics")) return <AdminAnalytics />;
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
    if (path.startsWith("/admin/client-health")) return (
      <AdminPlaceholderPage 
        title="Client Health Scores" 
        description="Monitor client satisfaction and health metrics"
        icon={Target}
        features={["Health score dashboard", "Risk indicators", "Engagement tracking", "Churn prediction"]}
      />
    );
    if (path.startsWith("/admin/notices")) return <AdminClientNotices />;
    
    // Marketing & Growth
    if (path.startsWith("/admin/clickstream")) return <AdminClickstream />;
    if (path.startsWith("/admin/marketing")) return <AdminMarketing />;
    if (path.startsWith("/admin/lead-scoring")) return <AdminLeadScoring />;
    if (path.startsWith("/admin/email-campaigns")) return <AdminEmailCampaigns />;
    if (path.startsWith("/admin/funnels")) return (
      <AdminPlaceholderPage 
        title="Conversion Funnels" 
        description="Track and optimize conversion funnels"
        icon={TrendingUp}
        features={["Funnel visualization", "Drop-off analysis", "Conversion optimization", "Goal tracking"]}
      />
    );
    
    // Operations & Projects
    if (path.startsWith("/admin/projects")) return <AdminProjects />;
    if (path.startsWith("/admin/project-timeline")) return (
      <AdminPlaceholderPage 
        title="Project Timeline" 
        description="View project timelines and milestones"
        icon={Calendar}
        features={["Gantt charts", "Milestone tracking", "Resource allocation", "Dependencies"]}
      />
    );
    if (path.startsWith("/admin/files")) return <AdminFiles />;
    if (path.startsWith("/admin/team")) return <AdminTeamManagement />;
    
    // Support & Communication
    if (path.startsWith("/admin/tickets")) return <AdminTickets />;
    if (path.startsWith("/admin/chat")) return (
      <AdminPlaceholderPage 
        title="Live Chat" 
        description="Real-time chat support system"
        icon={Phone}
        features={["Chat inbox", "Canned responses", "Chat routing", "Analytics"]}
      />
    );
    if (path.startsWith("/admin/meetings")) return <AdminMeetings />;
    if (path.startsWith("/admin/video-calls")) return (
      <AdminPlaceholderPage 
        title="Video Calls" 
        description="Schedule and manage video conferences"
        icon={Video}
        features={["Video conferencing", "Screen sharing", "Recording", "Calendar integration"]}
      />
    );
    if (path.startsWith("/admin/inquiries")) return <AdminInquiries />;
    
    // AI & Intelligence
    if (path.startsWith("/admin/ai")) return <AdminAIDashboard />;
    if (path.startsWith("/admin/ai-usage")) return (
      <AdminPlaceholderPage 
        title="AI Usage & Costs" 
        description="Track AI feature usage and costs"
        icon={Wallet}
        features={["Usage metrics", "Cost tracking", "Budget alerts", "Model performance"]}
      />
    );
    if (path.startsWith("/admin/ai-models")) return (
      <AdminPlaceholderPage 
        title="Model Performance" 
        description="Monitor AI model accuracy and performance"
        icon={Brain}
        features={["Accuracy metrics", "Response times", "Error rates", "Model comparison"]}
      />
    );
    if (path.startsWith("/admin/automation-logs")) return (
      <AdminPlaceholderPage 
        title="Automation Logs" 
        description="View workflow automation execution logs"
        icon={Workflow}
        features={["Execution history", "Error tracking", "Performance metrics", "Retry management"]}
      />
    );
    
    // Infrastructure & MSP
    if (path.startsWith("/admin/msp")) return <AdminMSPMonitoring />;
    if (path.startsWith("/admin/servers")) return (
      <AdminPlaceholderPage 
        title="Server Health" 
        description="Monitor server health and performance"
        icon={HardDrive}
        features={["CPU/Memory monitoring", "Disk usage", "Network stats", "Process management"]}
      />
    );
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
    if (path.startsWith("/admin/roles")) return (
      <AdminPlaceholderPage 
        title="User Roles & Permissions" 
        description="Configure platform roles and permissions"
        icon={UserCog}
        features={["Role definitions", "Permission sets", "Role assignment", "Audit trail"]}
      />
    );
    if (path.startsWith("/admin/integrations")) return <AdminIntegrations />;
    if (path.startsWith("/admin/api-keys")) return (
      <AdminPlaceholderPage 
        title="API Keys & Webhooks" 
        description="Manage API credentials and webhooks"
        icon={Key}
        features={["API key management", "Webhook configuration", "Rate limits", "Access logs"]}
      />
    );
    if (path.startsWith("/admin/feature-flags")) return (
      <AdminPlaceholderPage 
        title="Feature Flags" 
        description="Toggle features across the platform"
        icon={Layers}
        features={["Feature toggles", "A/B testing", "Rollout strategies", "Environment configs"]}
      />
    );
    if (path.startsWith("/admin/logs")) return <AdminSystemLogs />;
    if (path.startsWith("/admin/backup")) return (
      <AdminPlaceholderPage 
        title="Backup & Recovery" 
        description="Manage database backups and recovery"
        icon={RefreshCw}
        features={["Backup scheduling", "Point-in-time recovery", "Backup verification", "Disaster recovery"]}
      />
    );
    if (path.startsWith("/admin/super")) return <AdminSuperAdmin />;
    if (path.startsWith("/admin/settings")) return <AdminSettings />;
    
    return <AdminOverview />;
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminPage;