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
import { Loader2 } from "lucide-react";

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
    
    if (path === "/admin" || path === "/admin/") return <AdminOverview />;
    if (path.startsWith("/admin/analytics")) return <AdminAnalytics />;
    if (path.startsWith("/admin/crm")) return <AdminCRM />;
    if (path.startsWith("/admin/clickstream")) return <AdminClickstream />;
    if (path.startsWith("/admin/marketing")) return <AdminMarketing />;
    if (path.startsWith("/admin/msp")) return <AdminMSPMonitoring />;
    if (path.startsWith("/admin/onboarding-tracker")) return <AdminOnboardingTracker />;
    if (path.startsWith("/admin/onboarding")) return <AdminOnboardingApprovals />;
    if (path.startsWith("/admin/tenants")) return <AdminTenantManagement />;
    if (path.startsWith("/admin/pricing")) return <AdminPricingManagement />;
    if (path.startsWith("/admin/projects")) return <AdminProjects />;
    if (path.startsWith("/admin/files")) return <AdminFiles />;
    if (path.startsWith("/admin/tickets")) return <AdminTickets />;
    if (path.startsWith("/admin/meetings")) return <AdminMeetings />;
    if (path.startsWith("/admin/quotes")) return <AdminQuotes />;
    if (path.startsWith("/admin/invoices")) return <AdminInvoices />;
    if (path.startsWith("/admin/users")) return <AdminUsers />;
    if (path.startsWith("/admin/inquiries")) return <AdminInquiries />;
    if (path.startsWith("/admin/audit")) return <AdminAuditLogs />;
    if (path.startsWith("/admin/notices")) return <AdminClientNotices />;
    if (path.startsWith("/admin/compliance")) return <AdminCompliance />;
    if (path.startsWith("/admin/security")) return <AdminCompliance />;
    if (path.startsWith("/admin/logs")) return <AdminSystemLogs />;
    if (path.startsWith("/admin/plugins")) return <AdminPluginsManagement />;
    if (path.startsWith("/admin/integrations")) return <AdminIntegrations />;
    if (path.startsWith("/admin/portal-settings")) return <AdminPortalSettings />;
    if (path.startsWith("/admin/ai")) return <AdminAIDashboard />;
    if (path.startsWith("/admin/team")) return <AdminTeamManagement />;
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
