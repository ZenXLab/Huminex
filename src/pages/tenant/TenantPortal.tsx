import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { TenantLayout } from "@/components/tenant/TenantLayout";
import TenantDashboard from "./TenantDashboard";
import TenantWorkforce from "./TenantWorkforce";
import TenantPayroll from "./TenantPayroll";
import TenantRecruitment from "./TenantRecruitment";

// Placeholder for remaining pages
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-[#0F1E3A] mb-2">{title}</h1>
      <p className="text-[#6B7280]">This module is under development.</p>
    </div>
  </div>
);

const TenantPortal: React.FC = () => {
  return (
    <Routes>
      <Route element={<TenantLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TenantDashboard />} />
        <Route path="workforce" element={<TenantWorkforce />} />
        <Route path="payroll" element={<TenantPayroll />} />
        <Route path="recruitment" element={<TenantRecruitment />} />
        <Route path="attendance" element={<PlaceholderPage title="Attendance & Leave" />} />
        <Route path="compliance" element={<PlaceholderPage title="Statutory Compliance" />} />
        <Route path="finance" element={<PlaceholderPage title="Finance & Billing" />} />
        <Route path="insurance" element={<PlaceholderPage title="Insurance & Claims" />} />
        <Route path="bgv" element={<PlaceholderPage title="Background Verification" />} />
        <Route path="projects" element={<PlaceholderPage title="Projects & Tasks" />} />
        <Route path="ems" element={<PlaceholderPage title="Enterprise Management" />} />
        <Route path="performance" element={<PlaceholderPage title="Performance & Engagement" />} />
        <Route path="automations" element={<PlaceholderPage title="OpZenix Automations" />} />
        <Route path="intelligence" element={<PlaceholderPage title="Proxima AI" />} />
        <Route path="identity" element={<PlaceholderPage title="Identity & Access" />} />
        <Route path="risk" element={<PlaceholderPage title="Risk & Governance" />} />
        <Route path="managed-ops" element={<PlaceholderPage title="Managed Operations" />} />
        <Route path="settings/*" element={<PlaceholderPage title="Tenant Settings" />} />
        <Route path="onboarding" element={<PlaceholderPage title="Onboarding Wizard" />} />
        <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
      </Route>
    </Routes>
  );
};

export default TenantPortal;
