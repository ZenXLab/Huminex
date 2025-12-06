import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ClickstreamTracker } from "@/components/ClickstreamTracker";

// Public pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Industries from "./pages/Industries";
import NotFound from "./pages/NotFound";

// Portal (Client) pages
import Portal from "./pages/Portal";
import PortalAuth from "./pages/portal/PortalAuth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";

// Admin pages
import AdminAuth from "./pages/admin/AdminAuth";
import AdminPage from "./pages/admin/AdminPage";

// Service pages
import DigitalEngineering from "./pages/services/DigitalEngineering";
import AIAutomation from "./pages/services/AIAutomation";
import ExperienceDesign from "./pages/services/ExperienceDesign";
import CloudDevOps from "./pages/services/CloudDevOps";
import EnterpriseConsulting from "./pages/services/EnterpriseConsulting";
import ManagedIT from "./pages/services/ManagedIT";
import Cybersecurity from "./pages/services/Cybersecurity";
import IndustrySolutions from "./pages/services/IndustrySolutions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ClickstreamTracker />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/industries" element={<Industries />} />
            
            {/* Portal (Client) Routes */}
            <Route path="/portal/login" element={<PortalAuth />} />
            <Route path="/portal/*" element={<Portal />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminAuth />} />
            <Route path="/admin/*" element={<AdminPage />} />
            
            {/* Service Pages */}
            <Route path="/services/digital-engineering" element={<DigitalEngineering />} />
            <Route path="/services/ai-automation" element={<AIAutomation />} />
            <Route path="/services/experience-design" element={<ExperienceDesign />} />
            <Route path="/services/cloud-devops" element={<CloudDevOps />} />
            <Route path="/services/enterprise-consulting" element={<EnterpriseConsulting />} />
            <Route path="/services/managed-it" element={<ManagedIT />} />
            <Route path="/services/cybersecurity" element={<Cybersecurity />} />
            <Route path="/services/industry-solutions" element={<IndustrySolutions />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
