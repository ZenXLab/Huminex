# ATLAS Platform - Complete Pages Inventory

> **Version**: 1.0.0  
> **Last Updated**: December 9, 2025  
> **Total Pages**: 75+ pages across 4 portals

---

## 📊 Pages Summary

| Portal | Route Prefix | Page Count | Target User |
|--------|--------------|------------|-------------|
| Public Marketing | `/` | 25+ | Visitors, Prospects |
| Admin Portal | `/admin/*` | 35+ | CropXon Internal Team |
| Tenant Portal | `/tenant/*` | 25+ | Client Organization Admins |
| Employee Portal | `/portal/*` | 15+ | Client Employees |

---

## 🌐 PUBLIC MARKETING PAGES

### Core Marketing Pages

| Route | Page | Purpose | Use Case |
|-------|------|---------|----------|
| `/` | Home (Index) | Landing page with hero, stats, features, testimonials | First impression, lead generation |
| `/features` | Features Overview | Showcase all 15 ATLAS modules | Product discovery |
| `/about` | About Us | Company story, mission, team, values | Build trust and credibility |
| `/contact` | Contact Us | Contact form, support channels, API docs | Customer communication |
| `/pricing` | Pricing | Plans, tiers, comparison, calculators | Purchase decisions |
| `/industries` | Industries Overview | 14 industry verticals showcase | Vertical-specific marketing |
| `/partners` | Partners | Partner program information | Channel partnerships |
| `/get-quote` | Get Quote | Quote calculator and generation | Lead capture, sales |

### Module Detail Pages (`/modules/:slug`)

| Route | Module | Purpose |
|-------|--------|---------|
| `/modules/workforce-management` | Workforce Management | Employee database, org charts, lifecycle |
| `/modules/attendance-leave` | Attendance & Leave OS | Biometric, shifts, leave policies |
| `/modules/payroll-engine` | Payroll Engine | Salary, compliance, payslips |
| `/modules/recruitment-ats` | Recruitment & ATS | Job posting, pipeline, interviews |
| `/modules/projects-tasks` | Projects & Tasks | Project management, time tracking |
| `/modules/finance-expense` | Finance & Expense | Expense management, approvals |
| `/modules/compliance-risk` | Compliance & Risk | Statutory compliance, governance |
| `/modules/identity-access` | Identity & Access | SSO, RBAC, security |
| `/modules/assets-ems` | Assets & EMS | Asset lifecycle, QR tracking |
| `/modules/bgv-suite` | BGV Suite | Background verification |
| `/modules/performance-okr` | Performance & OKR | Goals, reviews, feedback |
| `/modules/announcements-docs` | Announcements & Docs | Company communications |
| `/modules/opzenix-automation` | OpZenix Automation | Workflow builder |
| `/modules/proxima-ai` | Proxima AI | AI predictions, insights |
| `/modules/governance-audit` | Governance & Audit | Risk register, audit trails |

### Industry Detail Pages (`/industries/:slug`)

| Route | Industry | Target Vertical |
|-------|----------|-----------------|
| `/industries/retail` | Retail & Commerce | Shops, supermarkets, e-commerce |
| `/industries/food-hospitality` | Food & Hospitality | Restaurants, hotels, catering |
| `/industries/healthcare` | Healthcare & Wellness | Hospitals, clinics, telemedicine |
| `/industries/education` | Education & Learning | Schools, EdTech, training |
| `/industries/agriculture` | Agriculture & Rural | Farmer orgs, agri-tech |
| `/industries/real-estate` | Real Estate & Construction | Agencies, builders |
| `/industries/manufacturing` | Manufacturing & Industrial | Factories, automation |
| `/industries/logistics` | Logistics & Supply Chain | Couriers, fleet, warehousing |
| `/industries/technology` | Technology & IT | SaaS, app development |
| `/industries/marketing` | Marketing & Creative | Agencies, content creators |
| `/industries/finance` | Finance & Insurance | FinTech, NBFCs |
| `/industries/professional` | Professional Services | Consultants, legal |
| `/industries/public-sector` | Public Sector & Government | Departments, NGOs |
| `/industries/events` | Events & Entertainment | Planners, production |

### Service Pages (`/services/:slug`)

| Route | Service | Description |
|-------|---------|-------------|
| `/services/digital-engineering` | Digital Engineering | Custom software development |
| `/services/ai-automation` | AI & Automation | Intelligent automation solutions |
| `/services/experience-design` | Experience Design | UX/UI design services |
| `/services/cloud-devops` | Cloud & DevOps | Cloud infrastructure, DevOps |
| `/services/enterprise-consulting` | Enterprise Consulting | Digital transformation |
| `/services/managed-it` | Managed IT | IT infrastructure management |
| `/services/cybersecurity` | Cybersecurity | Security services |
| `/services/industry-solutions` | Industry Solutions | Vertical-specific solutions |

### Authentication Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/auth` | User Authentication | Sign up / Sign in for clients |
| `/reset-password` | Password Reset | Password recovery flow |
| `/onboarding` | Onboarding Wizard | 4-step new client setup |

---

## 🔐 ADMIN PORTAL (`/admin/*`)

> **Access**: CropXon Internal Team Only  
> **Purpose**: Platform-wide management, tenant administration, analytics

### Command Center

| Route | Module | Purpose |
|-------|--------|---------|
| `/admin` | Dashboard Overview | Key metrics, quick actions, alerts |
| `/admin/analytics` | Analytics Dashboard | Multi-tab analytics (overview, funnels, heatmaps, revenue, geo) |
| `/admin/analytics/basic` | Basic Analytics | Simple analytics view |
| `/admin/health` | System Health | Platform health monitoring |

### Tenant Management

| Route | Module | Purpose |
|-------|--------|---------|
| `/admin/tenants` | Tenant Management | Create, manage client organizations |
| `/admin/tenant-billing` | Tenant Billing | Subscription management |
| `/admin/tenant-usage` | Usage Analytics | Per-tenant usage metrics |
| `/admin/tenant-config` | Tenant Configuration | Feature flags per tenant |
| `/admin/plugins` | Plugins Management | Enable/disable features for tenants |

### Sales & Revenue

| Route | Module | Purpose |
|-------|--------|---------|
| `/admin/crm` | CRM | Lead management, contacts |
| `/admin/pipeline` | Pipeline Management | Sales pipeline visualization |
| `/admin/quotes` | Quotes | Quote management and tracking |
| `/admin/invoices` | Invoices | Invoice generation, payment tracking |
| `/admin/revenue` | Revenue Analytics | MRR, ARR, revenue trends |
| `/admin/pricing` | Pricing Management | Service pricing configuration |

### Client Management

| Route | Module | Purpose |
|-------|--------|---------|
| `/admin/users` | Users | Client user management |
| `/admin/onboarding-tracker` | Onboarding Tracker | Track client onboarding progress |
| `/admin/onboarding` | Onboarding Approvals | Approve new client applications |
| `/admin/client-health` | Client Health | Client satisfaction, health scores |
| `/admin/notices` | Client Notices | Announcements to clients |

### Marketing & Growth

| Route | Module | Purpose |
|-------|--------|---------|
| `/admin/clickstream` | Clickstream Analytics | User behavior tracking |
| `/admin/marketing` | Marketing | Campaign management |
| `/admin/lead-scoring` | Lead Scoring | AI-powered lead scoring |
| `/admin/email-campaigns` | Email Campaigns | Email automation |
| `/admin/funnels` | Conversion Funnels | Funnel analysis |
| `/admin/ab-testing` | A/B Testing | Experiment management |
| `/admin/ab-testing/:id` | A/B Results | Experiment results |
| `/admin/predictive` | Predictive Analytics | AI predictions |

### Operations & Projects

| Route | Module | Purpose |
|-------|--------|---------|
| `/admin/projects` | Projects | Project management |
| `/admin/project-timeline` | Project Timeline | Gantt views, milestones |
| `/admin/files` | Files | File management |
| `/admin/team` | Team Management | Internal team |

### Support & Communication

| Route | Module | Purpose |
|-------|--------|---------|
| `/admin/tickets` | Tickets | Support ticket management |
| `/admin/chat` | Live Chat | Real-time client chat |
| `/admin/meetings` | Meetings | Meeting scheduling |
| `/admin/video-calls` | Video Conference | Video call management |
| `/admin/inquiries` | Inquiries | Contact form submissions |

### AI & Intelligence

| Route | Module | Purpose |
|-------|--------|---------|
| `/admin/ai` | AI Dashboard | AI overview and insights |
| `/admin/ai-usage` | AI Usage | AI credits, usage tracking |
| `/admin/ai-models` | AI Models | Model configuration |
| `/admin/automation-logs` | Automation Logs | Workflow execution logs |

### Infrastructure & MSP

| Route | Module | Purpose |
|-------|--------|---------|
| `/admin/msp` | MSP Monitoring | Managed services monitoring |
| `/admin/servers` | Server Health | Server status, metrics |
| `/admin/cloud` | Cloud Resources | Cloud infrastructure |
| `/admin/database` | Database Status | Database health |
| `/admin/api-gateway` | API Gateway | API management |

### Security & Compliance

| Route | Module | Purpose |
|-------|--------|---------|
| `/admin/security` | Security | Security overview |
| `/admin/access-control` | Access Control | User permissions |
| `/admin/compliance` | Compliance | Compliance tracking |
| `/admin/threats` | Threat Detection | Security threats |
| `/admin/audit` | Audit Logs | System audit trail |

### Platform Settings

| Route | Module | Purpose |
|-------|--------|---------|
| `/admin/portal-settings` | Portal Settings | Portal configuration |
| `/admin/roles` | Roles & Permissions | RBAC management |
| `/admin/integrations` | Integrations | Third-party integrations |
| `/admin/api-keys` | API Keys & Webhooks | API credentials |
| `/admin/feature-flags` | Feature Flags | Feature toggles |
| `/admin/logs` | System Logs | Application logs |
| `/admin/backup` | Backup & Recovery | Data backup |
| `/admin/super` | Super Admin | Advanced admin tools |
| `/admin/notifications` | Notification System | Notification management |
| `/admin/notifications/preferences` | Notification Preferences | Alert settings |
| `/admin/settings` | Settings | General settings |

---

## 🏢 TENANT PORTAL (`/tenant/*`)

> **Access**: Client Organization Super-Admins / Admins  
> **Purpose**: Configure organization settings, manage employees, HR operations

### Authentication

| Route | Page | Purpose |
|-------|------|---------|
| `/tenant/login` | Tenant Login | Organization admin authentication |

### Dashboard & Overview

| Route | Module | Purpose |
|-------|--------|---------|
| `/tenant/dashboard` | Dashboard | Organization overview, widgets |

### Workforce Management

| Route | Module | Purpose |
|-------|--------|---------|
| `/tenant/workforce` | Workforce | Employee directory |
| `/tenant/employees` | Employees | Employee management, portal access |
| `/tenant/attendance` | Attendance | Attendance tracking |
| `/tenant/documents` | Documents | Document management |
| `/tenant/announcements` | Announcements | Company announcements |

### Payroll & Finance

| Route | Module | Purpose |
|-------|--------|---------|
| `/tenant/payroll` | Payroll | Payroll processing |
| `/tenant/finance` | Finance | Financial management |
| `/tenant/insurance` | Insurance | Insurance claims |

### Talent & Hiring

| Route | Module | Purpose |
|-------|--------|---------|
| `/tenant/recruitment` | Recruitment | ATS, job postings |
| `/tenant/bgv` | BGV | Background verification |
| `/tenant/performance` | Performance | Performance management |

### Operations

| Route | Module | Purpose |
|-------|--------|---------|
| `/tenant/projects` | Projects | Project management |
| `/tenant/ems` | EMS & Assets | Asset management |
| `/tenant/requests` | Requests | Request workflows |
| `/tenant/notifications` | Notifications | Notification center |

### Compliance & Risk

| Route | Module | Purpose |
|-------|--------|---------|
| `/tenant/compliance` | Compliance | Compliance tracking |
| `/tenant/risk` | Risk & Governance | Risk management |
| `/tenant/identity` | Identity & Access | User management, SSO |

### Intelligence & Automation

| Route | Module | Purpose |
|-------|--------|---------|
| `/tenant/intelligence` | Proxima AI | AI insights |
| `/tenant/automations` | OpZenix | Workflow automation |
| `/tenant/managed-ops` | Managed Operations | Outsourced operations |

### Settings

| Route | Module | Purpose |
|-------|--------|---------|
| `/tenant/settings` | Settings | General settings |
| `/tenant/settings/integrations` | Integrations | Third-party connections |
| `/tenant/settings/api-keys` | API Keys | API credentials |
| `/tenant/settings/billing` | Billing & Plans | Subscription management |
| `/tenant/settings/export` | Data Export | Data export tools |
| `/tenant/settings/domain` | Custom Domain | Domain configuration |
| `/tenant/settings/widgets` | Widget Access | Dashboard widget access |
| `/tenant/settings/sidebar` | Sidebar Access | Sidebar module access per role |

---

## 👤 EMPLOYEE PORTAL (`/portal/*`)

> **Access**: Client Employees (Staff, HR, Managers, Finance, Admins)  
> **Purpose**: Day-to-day work, self-service, collaboration

### Authentication

| Route | Page | Purpose |
|-------|------|---------|
| `/portal/login` | Portal Login | Employee authentication |

### Core Modules

| Route | Module | Purpose |
|-------|--------|---------|
| `/portal` | Dashboard | Personal dashboard with widgets |
| `/portal/projects` | Projects | Project workspace |
| `/portal/files` | Files | File repository |
| `/portal/invoices` | Invoices | Invoice history |
| `/portal/tickets` | Tickets | Support tickets |
| `/portal/meetings` | Meetings | Meeting calendar |
| `/portal/team` | Team | Team directory |
| `/portal/ai` | AI Dashboard | AI tools |
| `/portal/msp` | MSP Monitoring | Server monitoring (if enabled) |
| `/portal/feedback` | Feedback | Feedback submission |
| `/portal/resources` | Resources | Knowledge base |
| `/portal/settings` | Settings | Profile settings |
| `/portal/plans` | Tier Comparison | Plan comparison, upgrade |

---

## 📱 DASHBOARD WIDGETS

### Employee Portal Widgets

| Widget | Purpose | Default Roles |
|--------|---------|---------------|
| AttendanceWidget | Attendance summary, shifts | All |
| LeaveBalanceWidget | Leave entitlements | All |
| PayslipWidget | Recent payslips | All |
| TasksWidget | Assigned tasks | All |
| ExpenseClaimsWidget | Expense claims status | All |
| AnnouncementsWidget | Company announcements | All |
| TeamOverviewWidget | Team members | Managers, HR |
| ApprovalsWidget | Pending approvals | Managers |
| TeamAttendanceWidget | Team attendance | Managers |
| InvoicesWidget | Invoice summary | Finance |
| TicketsWidget | Support tickets | All |

### Tenant Dashboard Widgets

| Widget | Purpose |
|--------|---------|
| WorkforceWidget | Employee count, distribution |
| AttendanceWidget | Daily attendance overview |
| PayrollWidget | Payroll cycle status |
| RecruitmentWidget | Open positions, pipeline |
| ComplianceWidget | Compliance status |
| FinanceWidget | Financial summary |
| BGVWidget | BGV request status |
| InsuranceWidget | Claims pipeline |
| TasksProjectsWidget | Projects overview |
| ProximaAIWidget | AI insights preview |

---

## 🔗 Navigation Structure

### Public Website Navigation
```
Home → Features → Industries → Pricing → About → Contact → Get Quote
         ↓            ↓
    Module Pages  Industry Pages
```

### Admin Portal Sidebar Sections
```
Command Center → Tenant Management → Sales & Revenue → Client Management
       ↓                 ↓                  ↓                  ↓
   Dashboard          Tenants           CRM/Pipeline        Users/Health
   Analytics          Billing           Quotes/Invoices     Onboarding
   Health             Plugins           Revenue             Notices

Marketing & Growth → Operations → Support → AI & Intelligence
       ↓                 ↓           ↓              ↓
   Clickstream        Projects     Tickets       AI Dashboard
   A/B Testing        Files        Meetings      Usage/Models
   Funnels            Team         Chat          Automation

Infrastructure → Security → Platform Settings
      ↓              ↓              ↓
   MSP/Servers    Access        Settings
   Cloud          Compliance    Integrations
   Database       Audit         Feature Flags
```

### Tenant Portal Sidebar Sections
```
Workforce Management → Payroll & Finance → Talent & Hiring
         ↓                    ↓                   ↓
    Workforce             Payroll           Recruitment
    Employees             Finance               BGV
    Attendance            Insurance        Performance
    Documents

Operations → Compliance & Risk → Intelligence & Automation
     ↓               ↓                      ↓
  Projects       Compliance             Proxima AI
  EMS/Assets     Risk/Governance        OpZenix
  Requests       Identity/Access        Managed Ops
```

---

## 📊 Page Metrics

| Category | Count |
|----------|-------|
| Total Public Pages | 25+ |
| Total Admin Pages | 35+ |
| Total Tenant Pages | 25+ |
| Total Portal Pages | 15+ |
| **Grand Total** | **100+ pages** |

---

*Last Updated: December 9, 2025*
