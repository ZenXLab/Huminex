import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { TenantLayout } from "@/components/tenant/TenantLayout";
import TenantDashboard from "./TenantDashboard";
import TenantWorkforce from "./TenantWorkforce";
import TenantPayroll from "./TenantPayroll";
import TenantRecruitment from "./TenantRecruitment";
import TenantAttendance from "./TenantAttendance";
import TenantCompliance from "./TenantCompliance";
import TenantFinance from "./TenantFinance";
import TenantBGV from "./TenantBGV";
import TenantInsurance from "./TenantInsurance";
import TenantProjects from "./TenantProjects";
import TenantDocuments from "./TenantDocuments";
import TenantAnnouncements from "./TenantAnnouncements";
import TenantPerformance from "./TenantPerformance";
import TenantOpZenix from "./TenantOpZenix";
import TenantProximaAI from "./TenantProximaAI";
import TenantSettings from "./TenantSettings";
import TenantEMS from "./TenantEMS";
import TenantIdentityAccess from "./TenantIdentityAccess";
import TenantRiskGovernance from "./TenantRiskGovernance";
import TenantRequests from "./TenantRequests";
import TenantNotifications from "./TenantNotifications";
import TenantManagedOps from "./TenantManagedOps";
import TenantEmployees from "./TenantEmployees";
import TenantIntegrations from "./settings/TenantIntegrations";
import TenantAPIKeys from "./settings/TenantAPIKeys";
import TenantBilling from "./settings/TenantBilling";
import TenantDataExport from "./settings/TenantDataExport";
import TenantCustomDomain from "./settings/TenantCustomDomain";
import TenantWidgetAccess from "./settings/TenantWidgetAccess";

// Placeholder for remaining pages
const PlaceholderPage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-bold text-[#0F1E3A]">{title}</h1>
      <p className="text-sm text-[#6B7280] mt-1">{description}</p>
    </div>
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F7F9FC] mx-auto mb-4 flex items-center justify-center">
        <svg className="w-8 h-8 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-[#0F1E3A] mb-2">Coming Soon</h3>
      <p className="text-[#6B7280] max-w-md mx-auto">This module is under development.</p>
    </div>
  </div>
);

/**
 * TenantPortal - Tenant Super-Admin Portal
 * 
 * Route: /tenant/*
 * 
 * This is the Tenant Organization Admin Panel - visible ONLY to the client's 
 * internal Super Admin / Admin roles. This is where a company configures 
 * their entire ATLAS workspace.
 * 
 * Used for:
 * - Org structure setup
 * - HR, Payroll, Finance, Compliance, BGV settings
 * - Roles & permissions for their team
 * - API keys & Integrations
 * - Custom domain & Company-level configurations
 */
const TenantPortal: React.FC = () => {
  return (
    <Routes>
      <Route element={<TenantLayout />}>
        <Route index element={<Navigate to="/tenant/dashboard" replace />} />
        <Route path="dashboard" element={<TenantDashboard />} />
        
        {/* Workforce Management */}
        <Route path="workforce" element={<TenantWorkforce />} />
        <Route path="employees" element={<TenantEmployees />} />
        <Route path="attendance" element={<TenantAttendance />} />
        <Route path="documents" element={<TenantDocuments />} />
        <Route path="announcements" element={<TenantAnnouncements />} />
        
        {/* Payroll & Finance */}
        <Route path="payroll" element={<TenantPayroll />} />
        <Route path="finance" element={<TenantFinance />} />
        <Route path="insurance" element={<TenantInsurance />} />
        
        {/* Talent & Hiring */}
        <Route path="recruitment" element={<TenantRecruitment />} />
        <Route path="bgv" element={<TenantBGV />} />
        <Route path="performance" element={<TenantPerformance />} />
        
        {/* Operations */}
        <Route path="projects" element={<TenantProjects />} />
        <Route path="ems" element={<TenantEMS />} />
        <Route path="requests" element={<TenantRequests />} />
        <Route path="notifications" element={<TenantNotifications />} />
        
        {/* Compliance & Risk */}
        <Route path="compliance" element={<TenantCompliance />} />
        <Route path="risk" element={<TenantRiskGovernance />} />
        <Route path="identity" element={<TenantIdentityAccess />} />
        
        {/* Intelligence & Automation */}
        <Route path="intelligence" element={<TenantProximaAI />} />
        <Route path="automations" element={<TenantOpZenix />} />
        <Route path="managed-ops" element={<TenantManagedOps />} />
        
        {/* Settings */}
        <Route path="settings" element={<TenantSettings />} />
        <Route path="settings/integrations" element={<TenantIntegrations />} />
        <Route path="settings/api-keys" element={<TenantAPIKeys />} />
        <Route path="settings/billing" element={<TenantBilling />} />
        <Route path="settings/export" element={<TenantDataExport />} />
        <Route path="settings/domain" element={<TenantCustomDomain />} />
        <Route path="settings/widgets" element={<TenantWidgetAccess />} />
        
        <Route path="onboarding" element={<PlaceholderPage title="Onboarding" description="Complete your organization setup" />} />
        <Route path="*" element={<PlaceholderPage title="Page Not Found" description="The page you're looking for doesn't exist" />} />
      </Route>
    </Routes>
  );
};

export default TenantPortal;
