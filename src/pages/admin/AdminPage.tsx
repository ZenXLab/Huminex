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
import { Loader2 } from "lucide-react";

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (!authLoading && !roleLoading && !isAdmin) {
      navigate("/dashboard");
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

  // Determine which component to render based on path
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === "/admin" || path === "/admin/") {
      return <AdminOverview />;
    }
    if (path.startsWith("/admin/quotes")) {
      return <AdminQuotes />;
    }
    if (path.startsWith("/admin/invoices")) {
      return <AdminInvoices />;
    }
    if (path.startsWith("/admin/users")) {
      return <AdminUsers />;
    }
    if (path.startsWith("/admin/inquiries")) {
      return <AdminInquiries />;
    }
    if (path.startsWith("/admin/settings")) {
      return <AdminSettings />;
    }
    
    return <AdminOverview />;
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminPage;
