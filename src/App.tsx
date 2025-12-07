import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import { ClickstreamTracker } from "@/components/ClickstreamTracker";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Index from "./pages/Index";
import Features from "./pages/Features";
import ModuleDetail from "./pages/modules/ModuleDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Industries from "./pages/Industries";
import IndustryDetail from "./pages/industries/IndustryDetail";
import GetQuote from "./pages/GetQuote";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Portal from "./pages/Portal";
import NotFound from "./pages/NotFound";

// Service pages
import DigitalEngineering from "./pages/services/DigitalEngineering";
import AIAutomation from "./pages/services/AIAutomation";
import ExperienceDesign from "./pages/services/ExperienceDesign";
import CloudDevOps from "./pages/services/CloudDevOps";
import EnterpriseConsulting from "./pages/services/EnterpriseConsulting";
import ManagedIT from "./pages/services/ManagedIT";
import Cybersecurity from "./pages/services/Cybersecurity";
import IndustrySolutions from "./pages/services/IndustrySolutions";

// Admin pages
import AdminAuth from "./pages/admin/AdminAuth";
import AdminPage from "./pages/admin/AdminPage";

// Portal pages
import PortalAuth from "./pages/portal/PortalAuth";

// Tenant pages
import TenantAuth from "./pages/tenant/TenantAuth";
import TenantPortal from "./pages/tenant/TenantPortal";

const queryClient = new QueryClient();

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3,
};

// Animated Routes wrapper component
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Scroll to top on route change
  useScrollToTop();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/modules/:slug" element={<ModuleDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/industries/:slug" element={<IndustryDetail />} />
          <Route path="/get-quote" element={<GetQuote />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Client Portal Routes - Employee access (unlocked by Tenant Admin) */}
          <Route path="/portal/login" element={<PortalAuth />} />
          <Route path="/portal/*" element={<Portal />} />
          
          {/* Admin Dashboard Routes - ATLAS Global Admin (CropXon Internal) */}
          <Route path="/admin/login" element={<AdminAuth />} />
          <Route path="/admin/*" element={<AdminPage />} />
          
          {/* Tenant Super-Admin Portal Routes - Client Organization Admin */}
          <Route path="/tenant/login" element={<TenantAuth />} />
          <Route path="/tenant/*" element={<TenantPortal />} />
          
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
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ClickstreamTracker />
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
