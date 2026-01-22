import { 
  Users, 
  Calendar, 
  Wallet, 
  UserPlus, 
  FolderKanban, 
  Receipt, 
  ShieldCheck, 
  KeyRound, 
  Package, 
  FileSearch, 
  TrendingUp, 
  Megaphone, 
  Sparkles, 
  Zap, 
  Lock
} from "lucide-react";

export interface ModuleData {
  id: number;
  slug: string;
  icon: React.ElementType;
  title: string;
  tagline: string;
  heroDescription: string;
  description: string;
  features: string[];
  benefits: { title: string; description: string }[];
  useCases: { industry: string; scenario: string; outcome: string }[];
  color: string;
  iconBg: string;
  iconColor: string;
}

export const modules: ModuleData[] = [
  {
    id: 1,
    slug: "workforce-management",
    icon: Users,
    title: "Workforce Management",
    tagline: "Your single source of truth for all employee data.",
    heroDescription: "Centralized employee database with multi-location & multi-entity support — the foundation of your enterprise workforce.",
    description: "Centralized employee database with multi-location & multi-entity support. Manage documents, ID proofs, employment letters, contracts, department structures, org charts, and the complete employee lifecycle from onboarding to exit.",
    features: [
      "Employee database with multi-location support",
      "Documents, ID proofs & contracts management",
      "Department & Org chart visualization",
      "Employee lifecycle management (onboarding to exit)",
      "Seat allocation & equipment tracking",
      "Multi-entity & subsidiary support",
      "Custom fields & employee attributes",
      "Bulk import/export capabilities",
      "Employee self-service portal",
      "Real-time workforce analytics"
    ],
    benefits: [
      { title: "Single Source of Truth", description: "Eliminate data silos with one unified employee database across all locations." },
      { title: "Reduce Admin Overhead", description: "Automate document collection, renewals, and lifecycle events." },
      { title: "Compliance Ready", description: "Maintain accurate records for audits and regulatory requirements." },
      { title: "Scalable Architecture", description: "Grow from 10 to 10,000 employees without changing systems." }
    ],
    useCases: [
      { industry: "Manufacturing", scenario: "Multi-plant workforce tracking", outcome: "60% reduction in HR admin time" },
      { industry: "IT Services", scenario: "Remote + office hybrid management", outcome: "Complete visibility across 5 locations" },
      { industry: "Retail Chain", scenario: "Franchise employee management", outcome: "Unified view of 2,000+ staff" }
    ],
    color: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500"
  },
  {
    id: 2,
    slug: "attendance-leave",
    icon: Calendar,
    title: "Attendance & Leave OS",
    tagline: "Accurate payroll inputs. Zero manual errors.",
    heroDescription: "Complete attendance management with biometric, app-based, geofence, or API integration for error-free payroll processing.",
    description: "Complete attendance management with biometric, app-based, geofence, or API integration. Includes shift scheduling, roster management, leave policies, allocations, carry-forward rules, and manager approvals.",
    features: [
      "Biometric, app-based & geofence attendance",
      "Shift scheduling & roster management",
      "Leave policies & allocations",
      "Manager approval workflows",
      "Real-time insights dashboard",
      "Overtime calculation & tracking",
      "Holiday calendar management",
      "Comp-off & work-from-home tracking",
      "Regularization requests",
      "Attendance anomaly detection"
    ],
    benefits: [
      { title: "Error-Free Payroll", description: "Accurate attendance data flows directly to payroll with zero manual intervention." },
      { title: "Policy Compliance", description: "Enforce attendance policies automatically across the organization." },
      { title: "Real-Time Visibility", description: "Know who's present, absent, or on leave at any moment." },
      { title: "Flexible Work Support", description: "Handle hybrid, remote, and shift-based workforces effortlessly." }
    ],
    useCases: [
      { industry: "BPO/Call Center", scenario: "24/7 shift rotation management", outcome: "40% faster roster planning" },
      { industry: "Healthcare", scenario: "Multi-shift hospital staffing", outcome: "Zero attendance disputes" },
      { industry: "Logistics", scenario: "Field force attendance tracking", outcome: "GPS-verified attendance for 500+ drivers" }
    ],
    color: "from-green-500 to-emerald-500",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500"
  },
  {
    id: 3,
    slug: "payroll-engine",
    icon: Wallet,
    title: "Payroll Engine",
    tagline: "Modern HR + payroll engineered for India's workforce.",
    heroDescription: "Zero manual payroll pain with 100% compliance. Auto salary calculations, statutory deductions, and bulk payslip generation.",
    description: "Zero manual payroll pain with 100% compliance. Auto salary calculations, PF, ESI, PT, TDS, LWF compliance, full CTC structure builder, bulk payslip generation, and income tax previews for employees.",
    features: [
      "Auto salary calculations",
      "PF, ESI, PT, TDS, LWF compliance",
      "Full CTC structure builder",
      "Bulk payslip generation (PDF)",
      "Income tax preview for employees",
      "Salary disbursement integration",
      "Arrears & bonus processing",
      "Statutory filing preparation",
      "Multi-currency support",
      "Year-end tax computation"
    ],
    benefits: [
      { title: "100% Compliance", description: "Auto-calculate PF, ESI, PT, TDS, and LWF based on latest regulations." },
      { title: "Zero Errors", description: "Rule-based calculations eliminate manual payroll mistakes." },
      { title: "Employee Transparency", description: "Self-service payslips and tax projections build trust." },
      { title: "Audit Ready", description: "Complete payroll history with detailed audit trails." }
    ],
    useCases: [
      { industry: "Startup", scenario: "First-time payroll setup", outcome: "Compliant payroll running in 2 days" },
      { industry: "Enterprise", scenario: "Multi-state compliance", outcome: "Auto PT calculations for 15 states" },
      { industry: "NGO", scenario: "Grant-based salary management", outcome: "Project-wise payroll allocation" }
    ],
    color: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500"
  },
  {
    id: 4,
    slug: "recruitment-ats",
    icon: UserPlus,
    title: "Recruitment & ATS",
    tagline: "Faster hiring. Structured candidate management.",
    heroDescription: "End-to-end recruitment with job posting, candidate pipeline management, AI resume parsing, and comprehensive hiring analytics.",
    description: "End-to-end recruitment with job posting, candidate pipeline management, resume parsing, interview scheduling, offer management, and comprehensive hiring analytics.",
    features: [
      "Job posting & distribution",
      "Candidate pipeline management",
      "AI-powered resume parsing",
      "Interview scheduling",
      "Hiring analytics & insights",
      "Offer letter generation",
      "Career page builder",
      "Job board integrations",
      "Candidate scoring & ranking",
      "Hiring team collaboration"
    ],
    benefits: [
      { title: "Faster Time-to-Hire", description: "Streamlined workflows reduce hiring cycle by 50%." },
      { title: "Better Candidates", description: "AI matching surfaces the best-fit candidates first." },
      { title: "Collaborative Hiring", description: "Hiring managers and recruiters work in sync." },
      { title: "Data-Driven Decisions", description: "Analytics reveal what's working and what's not." }
    ],
    useCases: [
      { industry: "Tech Company", scenario: "High-volume developer hiring", outcome: "200 hires/quarter with 3-person team" },
      { industry: "Consulting Firm", scenario: "Campus recruitment", outcome: "Processed 5,000 applications in 2 weeks" },
      { industry: "Retail", scenario: "Seasonal hiring surge", outcome: "500 store staff hired in 30 days" }
    ],
    color: "from-purple-500 to-violet-500",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500"
  },
  {
    id: 5,
    slug: "projects-tasks",
    icon: FolderKanban,
    title: "Projects & Tasks",
    tagline: "Plan it. Track it. Bill it. All on HUMINEX.",
    heroDescription: "Complete project management where Operations, HR, and Finance come together for unified resource and billing management.",
    description: "Complete project management where Operations, HR, and Finance come together. Project creation, task assignment, time tracking, billable hours, milestones, and resource management.",
    features: [
      "Project creation & management",
      "Task assignment & tracking",
      "Time tracking & billable hours",
      "Milestones & deadlines",
      "Resource management",
      "Gantt chart visualization",
      "Kanban board view",
      "Project budget tracking",
      "Client billing integration",
      "Team capacity planning"
    ],
    benefits: [
      { title: "Unified View", description: "HR, operations, and finance data in one project context." },
      { title: "Accurate Billing", description: "Track time precisely for client invoicing." },
      { title: "Resource Optimization", description: "Allocate the right people to the right projects." },
      { title: "On-Time Delivery", description: "Milestone tracking keeps projects on schedule." }
    ],
    useCases: [
      { industry: "IT Services", scenario: "Client project delivery", outcome: "15% improvement in project margins" },
      { industry: "Agency", scenario: "Multi-client campaign management", outcome: "Real-time utilization visibility" },
      { industry: "Construction", scenario: "Site-wise project tracking", outcome: "Integrated labor cost tracking" }
    ],
    color: "from-indigo-500 to-blue-500",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500"
  },
  {
    id: 6,
    slug: "finance-expense",
    icon: Receipt,
    title: "Finance & Expense",
    tagline: "Smarter billing for smarter businesses.",
    heroDescription: "Complete expense visibility with automated controls, multi-level approvals, and seamless reimbursement workflows.",
    description: "Complete expense visibility with automated controls. Expense submissions, multi-level approvals, automated reimbursement calculations, budgeting, and vendor payment workflows.",
    features: [
      "Expense submissions & tracking",
      "Multi-level approvals",
      "Automated reimbursement calculations",
      "Budgeting & forecasting",
      "Vendor payment workflows",
      "Receipt scanning (OCR)",
      "Policy violation alerts",
      "Department-wise budgets",
      "Advance management",
      "GST-compliant invoicing"
    ],
    benefits: [
      { title: "Policy Compliance", description: "Auto-enforce expense policies before submission." },
      { title: "Faster Reimbursements", description: "Approved expenses processed within days, not weeks." },
      { title: "Budget Control", description: "Real-time visibility into spending vs. budget." },
      { title: "Audit Trail", description: "Complete documentation for every expense." }
    ],
    useCases: [
      { industry: "Sales Organization", scenario: "Field expense management", outcome: "70% faster reimbursement cycle" },
      { industry: "Corporate", scenario: "Travel & expense policy enforcement", outcome: "20% reduction in policy violations" },
      { industry: "NGO", scenario: "Grant expense tracking", outcome: "Donor-ready expense reports" }
    ],
    color: "from-teal-500 to-cyan-500",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-500"
  },
  {
    id: 7,
    slug: "compliance-risk",
    icon: ShieldCheck,
    title: "Compliance & Risk",
    tagline: "Compliance that completes itself.",
    heroDescription: "Zero compliance surprises with automated PF, ESIC, PT filings tracker, statutory registers, and governance dashboard.",
    description: "Zero compliance surprises with automated PF, ESIC, PT filings tracker, policy acknowledgment workflows, statutory registers, risk & governance dashboard, and certificate renewals.",
    features: [
      "PF, ESI, PT filings tracker",
      "Policy acknowledgment workflows",
      "Statutory registers",
      "Risk & governance dashboard",
      "Certificate renewals",
      "Labor law compliance",
      "Audit preparation tools",
      "Compliance calendar",
      "Document expiry alerts",
      "Regulatory updates tracking"
    ],
    benefits: [
      { title: "Never Miss a Deadline", description: "Automated reminders for every statutory filing." },
      { title: "Audit Ready", description: "All registers and documents organized and accessible." },
      { title: "Risk Visibility", description: "Dashboard highlights compliance gaps before they become issues." },
      { title: "Policy Governance", description: "Ensure every employee has acknowledged required policies." }
    ],
    useCases: [
      { industry: "Manufacturing", scenario: "Factory compliance management", outcome: "Zero penalties in annual inspection" },
      { industry: "Multi-State Operations", scenario: "State-wise compliance tracking", outcome: "Unified view of 12 state compliances" },
      { industry: "Startup", scenario: "Compliance setup from scratch", outcome: "Audit-ready in first year" }
    ],
    color: "from-red-500 to-rose-500",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500"
  },
  {
    id: 8,
    slug: "identity-access",
    icon: KeyRound,
    title: "Identity & Access",
    tagline: "Enterprise trust. Secure data governance.",
    heroDescription: "Role-based access control with SSO integration for Google, Microsoft, Okta, SAML, and comprehensive security audit logs.",
    description: "Role-based access control (RBAC), SSO integration with Google, Microsoft, Okta, SAML, API keys & app integrations, and comprehensive security audit logs.",
    features: [
      "Role-based access control (RBAC)",
      "SSO (Google, Microsoft, Okta, SAML)",
      "API keys & app integrations",
      "Security audit logs",
      "Multi-factor authentication",
      "Session management",
      "IP whitelisting",
      "Password policies",
      "Access request workflows",
      "Third-party app permissions"
    ],
    benefits: [
      { title: "Zero Trust Security", description: "Granular permissions ensure least-privilege access." },
      { title: "Simplified Login", description: "SSO means one password for all enterprise apps." },
      { title: "Complete Visibility", description: "Know who accessed what, when, and from where." },
      { title: "Compliance Ready", description: "Meet SOC2, ISO27001, and GDPR access requirements." }
    ],
    useCases: [
      { industry: "Financial Services", scenario: "Sensitive data access control", outcome: "Role-based PII access" },
      { industry: "Enterprise", scenario: "Google Workspace SSO integration", outcome: "Single sign-on for 5,000 users" },
      { industry: "Healthcare", scenario: "HIPAA-compliant access", outcome: "Audit-ready access logs" }
    ],
    color: "from-slate-500 to-zinc-500",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-500"
  },
  {
    id: 9,
    slug: "assets-ems",
    icon: Package,
    title: "Assets & EMS",
    tagline: "Your enterprise assets — under one roof.",
    heroDescription: "Complete asset lifecycle management for laptops, phones, SIMs, and tools with QR tracking and maintenance logs.",
    description: "Complete asset lifecycle management for laptops, phones, SIMs, and tools. Assignment workflows, maintenance logs, and full asset lifecycle tracking.",
    features: [
      "Laptop, phone, SIM tracking",
      "Assignment workflows",
      "Maintenance logs",
      "Asset lifecycle management",
      "QR code tracking",
      "Depreciation tracking",
      "Vendor management",
      "Asset categories & types",
      "Return & disposal workflows",
      "Asset cost reports"
    ],
    benefits: [
      { title: "Complete Visibility", description: "Know every asset's location, status, and assignee." },
      { title: "Reduce Loss", description: "Track assets throughout their lifecycle from purchase to disposal." },
      { title: "Maintenance Control", description: "Schedule and track maintenance to extend asset life." },
      { title: "Cost Tracking", description: "Understand true cost of ownership per asset." }
    ],
    useCases: [
      { industry: "IT Company", scenario: "Laptop fleet management", outcome: "500 laptops tracked with zero loss" },
      { industry: "Field Services", scenario: "Equipment tracking", outcome: "Real-time visibility of 1,000+ tools" },
      { industry: "Corporate Office", scenario: "Office equipment management", outcome: "Automated maintenance schedules" }
    ],
    color: "from-pink-500 to-rose-500",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500"
  },
  {
    id: 10,
    slug: "bgv-suite",
    icon: FileSearch,
    title: "BGV Suite",
    tagline: "Instant trust. Automated verification.",
    heroDescription: "Risk-free hiring with PAN, Aadhaar, employment, and education checks through automated third-party integration.",
    description: "Risk-free hiring with PAN, Aadhaar, employment, and education checks. Third-party integration and automated status tracking for complete background verification.",
    features: [
      "PAN & Aadhaar verification",
      "Employment history checks",
      "Education verification",
      "Third-party integration",
      "Automated status tracking",
      "Criminal record checks",
      "Address verification",
      "Reference checks",
      "Drug screening integration",
      "Verification reports"
    ],
    benefits: [
      { title: "Risk Mitigation", description: "Catch discrepancies before they become problems." },
      { title: "Faster Onboarding", description: "Automated checks reduce verification time by 70%." },
      { title: "Compliance", description: "Meet industry-specific verification requirements." },
      { title: "Candidate Experience", description: "Simple, mobile-friendly verification process." }
    ],
    useCases: [
      { industry: "Banking/BFSI", scenario: "Mandatory employee verification", outcome: "100% verified workforce" },
      { industry: "IT/ITES", scenario: "Client compliance requirements", outcome: "BGV reports for client audits" },
      { industry: "Healthcare", scenario: "Credential verification", outcome: "License and education verified" }
    ],
    color: "from-cyan-500 to-sky-500",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-500"
  },
  {
    id: 11,
    slug: "performance-management",
    icon: TrendingUp,
    title: "Performance Management",
    tagline: "Data-driven performance culture.",
    heroDescription: "Complete performance management with Goals/OKRs, 360° feedback, quarterly reviews, and comprehensive performance history.",
    description: "Complete performance management with Goals/OKRs, 360° feedback, quarterly reviews, and comprehensive performance history tracking.",
    features: [
      "Goals & OKRs",
      "360° feedback",
      "Quarterly reviews",
      "Performance history",
      "Skill mapping",
      "Competency frameworks",
      "Continuous feedback",
      "Performance improvement plans",
      "Rating calibration",
      "Succession planning"
    ],
    benefits: [
      { title: "Aligned Goals", description: "OKRs cascade from company to individual level." },
      { title: "Fair Evaluations", description: "360° feedback provides complete perspective." },
      { title: "Development Focus", description: "Identify skill gaps and growth opportunities." },
      { title: "Retention", description: "Regular feedback keeps top performers engaged." }
    ],
    useCases: [
      { industry: "Tech Startup", scenario: "OKR implementation", outcome: "Company-wide goal alignment" },
      { industry: "Consulting", scenario: "Project-based performance", outcome: "Client feedback integrated" },
      { industry: "Sales", scenario: "Target-driven reviews", outcome: "Real-time performance visibility" }
    ],
    color: "from-emerald-500 to-green-500",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500"
  },
  {
    id: 12,
    slug: "announcements-docs",
    icon: Megaphone,
    title: "Announcements & Docs",
    tagline: "Single source for internal communication.",
    heroDescription: "Company-wide announcements, policy center, employee letters, auto watermarking, and access logs for complete document governance.",
    description: "Company-wide announcements, policy center, employee letters, auto watermarking, and access logs for complete document management.",
    features: [
      "Company-wide announcements",
      "Policy center",
      "Employee letters",
      "Auto watermarking",
      "Access logs",
      "Document templates",
      "E-signature integration",
      "Version control",
      "Read receipts",
      "Targeted communications"
    ],
    benefits: [
      { title: "Unified Communication", description: "One place for all company announcements and policies." },
      { title: "Document Security", description: "Watermarking and access logs prevent misuse." },
      { title: "Acknowledgment Tracking", description: "Know who's read important communications." },
      { title: "Self-Service", description: "Employees access letters and documents on-demand." }
    ],
    useCases: [
      { industry: "Corporate", scenario: "Policy rollout", outcome: "95% acknowledgment in 48 hours" },
      { industry: "Distributed Team", scenario: "Remote communication", outcome: "Unified announcement reach" },
      { industry: "Regulated Industry", scenario: "Compliance documentation", outcome: "Audit-ready policy records" }
    ],
    color: "from-orange-500 to-amber-500",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500"
  },
  {
    id: 13,
    slug: "proxima-ai",
    icon: Sparkles,
    title: "Proxima AI",
    tagline: "AI-native organization — not just HR automation.",
    heroDescription: "AI-powered insights, workflow automation, payroll anomaly detection, hiring recommendations, and natural language queries.",
    description: "AI-powered insights, workflow automation, summaries, payroll anomaly detection, hiring recommendations, and employee sentiment analysis. Query your data like ChatGPT.",
    features: [
      "AI-powered insights",
      "Workflow automation",
      "Payroll anomaly detection",
      "Hiring recommendations",
      "Natural language queries",
      "Attrition prediction",
      "Sentiment analysis",
      "Document summarization",
      "Smart scheduling",
      "Predictive analytics"
    ],
    benefits: [
      { title: "Proactive Insights", description: "AI surfaces issues before they become problems." },
      { title: "Natural Queries", description: "Ask questions in plain English, get instant answers." },
      { title: "Time Savings", description: "Automate analysis that took hours to minutes." },
      { title: "Better Decisions", description: "Data-driven recommendations for every HR decision." }
    ],
    useCases: [
      { industry: "Enterprise", scenario: "Attrition risk analysis", outcome: "Identified 50 high-risk employees early" },
      { industry: "HR Team", scenario: "Policy queries", outcome: "Instant answers to employee questions" },
      { industry: "Finance", scenario: "Payroll anomaly detection", outcome: "Caught errors before payroll run" }
    ],
    color: "from-violet-500 to-purple-500",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500"
  },
  {
    id: 14,
    slug: "opzenix-automation",
    icon: Zap,
    title: "OpZenix Automation",
    tagline: "Zero manual workflows. Everything runs automatically.",
    heroDescription: "Powered by Temporal Workflows for onboarding, approval chains, multi-step HR workflows, and compliance automations.",
    description: "Powered by Temporal Workflows for onboarding, approval chains, multi-step HR workflows, finance workflows, compliance workflows, and payroll pre-check automations.",
    features: [
      "Onboarding workflows",
      "Approval chains",
      "Multi-step HR workflows",
      "Finance & payment workflows",
      "Compliance automations",
      "Template marketplace",
      "Trigger builder",
      "Conditional logic",
      "Integration actions",
      "Execution monitoring"
    ],
    benefits: [
      { title: "Zero Manual Work", description: "Automate repetitive HR tasks end-to-end." },
      { title: "Consistency", description: "Every process runs the same way, every time." },
      { title: "Speed", description: "What took days now happens in minutes." },
      { title: "Visibility", description: "Track every workflow step and its status." }
    ],
    useCases: [
      { industry: "Fast-Growing Startup", scenario: "Onboarding automation", outcome: "New hire setup in 10 minutes" },
      { industry: "Enterprise", scenario: "Multi-level approvals", outcome: "7-step approval in 2 hours vs 5 days" },
      { industry: "HR Ops", scenario: "Exit process automation", outcome: "Complete clearance in 48 hours" }
    ],
    color: "from-yellow-500 to-amber-500",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-500"
  },
  {
    id: 15,
    slug: "governance-layer",
    icon: Lock,
    title: "Governance Layer",
    tagline: "Built for trust. Designed for accuracy. Engineered for scale.",
    heroDescription: "Enterprise-grade security with access logs, file encryption, virus scanning, DR replication, and API rate limits.",
    description: "Enterprise-grade security with access logs, file encryption & watermarking, virus scanning, DR replication, full audit log indexing, and API rate limits.",
    features: [
      "Access logs",
      "File encryption & watermarking",
      "Virus scanning",
      "DR replication",
      "API rate limits",
      "Data retention policies",
      "GDPR compliance tools",
      "Data anonymization",
      "Backup & recovery",
      "Security certifications"
    ],
    benefits: [
      { title: "Enterprise Security", description: "Bank-grade encryption and security controls." },
      { title: "Compliance", description: "Meet SOC2, ISO27001, GDPR requirements out of the box." },
      { title: "Business Continuity", description: "DR replication ensures zero data loss." },
      { title: "Trust", description: "Give clients and auditors confidence in your security posture." }
    ],
    useCases: [
      { industry: "Financial Services", scenario: "SOC2 compliance", outcome: "Audit passed with flying colors" },
      { industry: "Healthcare", scenario: "Patient data security", outcome: "HIPAA-compliant data handling" },
      { industry: "Enterprise", scenario: "Data governance", outcome: "Complete audit trail for 5 years" }
    ],
    color: "from-gray-500 to-slate-500",
    iconBg: "bg-gray-500/10",
    iconColor: "text-gray-500"
  }
];

export const getModuleBySlug = (slug: string): ModuleData | undefined => {
  return modules.find(m => m.slug === slug);
};
