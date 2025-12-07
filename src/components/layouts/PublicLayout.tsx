import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface PublicLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

/**
 * PublicLayout - Wrapper for public marketing pages
 * Includes Header (fixed, visible on scroll) and Footer
 * Should NOT be used on dashboard pages (/portal, /admin, /tenant)
 */
export const PublicLayout = ({ children, showFooter = true }: PublicLayoutProps) => {
  const location = useLocation();
  
  // Check if we're on a dashboard route (these should not show Header/Footer)
  const isDashboardRoute = 
    location.pathname.startsWith('/portal') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/tenant');
  
  // If on a dashboard route, just render children without layout
  if (isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-18">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PublicLayout;
