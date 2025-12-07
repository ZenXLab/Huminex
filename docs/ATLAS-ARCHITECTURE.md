# 🏗️ ATLAS System Architecture

> **Comprehensive Technical Reference**
> Last Updated: **December 7, 2025 @ 19:00 UTC**

---

## 📋 Table of Contents

| Section | Description |
|---------|-------------|
| [System Overview](#-system-overview) | High-level architecture and design principles |
| [Routing Architecture](#-routing-architecture) | 4-layer route structure and access control |
| [Database Schema](#-database-schema) | 60 tables across 7 categories |
| [Edge Functions](#-edge-functions) | 15 serverless functions |
| [Authentication & Security](#-authentication--security) | RLS policies and role-based access |
| [Technology Stack](#-technology-stack) | Frontend, backend, and infrastructure |
| [Integration Points](#-integration-points) | External services and APIs |

---

## 🌐 System Overview

### What is ATLAS?

ATLAS (Advanced Technology for Leadership, Automation & Solutions) is an **AI-powered Workforce Operating System** that unifies:

| Domain | Modules | Description |
|--------|---------|-------------|
| 👥 **People** | HR, Workforce, Attendance | Employee lifecycle management |
| 💰 **Payroll** | Payroll Engine, Finance | Compliant salary processing |
| ✅ **Compliance** | Compliance, Risk, Governance | Regulatory automation |
| 📋 **Operations** | Projects, Tasks, Assets | Operational efficiency |
| 🤖 **Intelligence** | Proxima AI, OpZenix | AI-driven insights & automation |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ATLAS PLATFORM                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   WEBSITE    │  │    ADMIN     │  │    TENANT    │  │    PORTAL    │    │
│  │  Marketing   │  │   Internal   │  │  Super-Admin │  │   Employee   │    │
│  │     (/)      │  │   (/admin)   │  │   (/tenant)  │  │   (/portal)  │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │                  │          │
│         └──────────────────┴──────────────────┴──────────────────┘          │
│                                      │                                       │
│  ┌───────────────────────────────────┴───────────────────────────────────┐  │
│  │                        REACT FRONTEND                                  │  │
│  │  • Vite + TypeScript         • TailwindCSS + Shadcn/UI               │  │
│  │  • React Router v6           • Framer Motion Animations               │  │
│  │  • TanStack Query            • React Hook Form + Zod                  │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                       │
│  ┌───────────────────────────────────┴───────────────────────────────────┐  │
│  │                      SUPABASE BACKEND                                  │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │  Database   │  │    Auth     │  │   Storage   │  │  Realtime   │   │  │
│  │  │ PostgreSQL  │  │   + RLS     │  │   Buckets   │  │  Channels   │   │  │
│  │  │  60 Tables  │  │  Security   │  │   Files     │  │  Live Sync  │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                    EDGE FUNCTIONS (15)                           │  │  │
│  │  │  Notifications • Payroll • BGV • SSO • Insurance • Documents    │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Multi-Tenancy** | Tenant isolation via `tenant_id` columns + RLS policies |
| **Role-Based Access** | 4-layer routing with dedicated guard components |
| **API-First** | Edge functions for all backend operations |
| **Real-Time** | Supabase Realtime for live notifications |
| **Mobile-First** | Responsive design with 3→2→1 column grids |

---

## 🛤️ Routing Architecture

### 4-Layer Route Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ROUTE HIERARCHY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LAYER 1: MARKETING (/)                                                      │
│  ├── /                    → Homepage                                         │
│  ├── /about               → About Us                                         │
│  ├── /contact             → Contact                                          │
│  ├── /features            → All Modules                                      │
│  ├── /modules/:slug       → Module Detail (15 pages)                         │
│  ├── /industries          → Industry Overview                                │
│  ├── /industries/:slug    → Industry Detail (14 pages)                       │
│  ├── /pricing             → Pricing                                          │
│  └── /get-quote           → Quote Generator                                  │
│                                                                              │
│  LAYER 2: ADMIN (/admin/*)                    🔐 AdminGuard                  │
│  ├── /admin/login         → Admin Authentication                             │
│  ├── /admin               → Admin Dashboard                                  │
│  ├── /admin/tenants       → Tenant Management                                │
│  ├── /admin/quotes        → Quote Management                                 │
│  ├── /admin/invoices      → Invoice Management                               │
│  ├── /admin/users         → User Management                                  │
│  ├── /admin/settings      → System Settings                                  │
│  └── /admin/...           → 15+ Admin Modules                                │
│                                                                              │
│  LAYER 3: TENANT (/tenant/*)                  🔐 TenantGuard                 │
│  ├── /tenant/login        → Tenant Authentication                            │
│  ├── /tenant/dashboard    → Organization Dashboard                           │
│  ├── /tenant/workforce    → Workforce Management                             │
│  ├── /tenant/payroll      → Payroll Processing                               │
│  ├── /tenant/attendance   → Attendance Tracking                              │
│  ├── /tenant/recruitment  → Hiring Pipeline                                  │
│  ├── /tenant/settings     → Organization Settings                            │
│  └── /tenant/...          → 14+ Tenant Modules                               │
│                                                                              │
│  LAYER 4: PORTAL (/portal/*)                  🔐 PortalGuard                 │
│  ├── /portal/login        → Employee Authentication                          │
│  ├── /portal              → Employee Dashboard                               │
│  ├── /portal/projects     → My Projects                                      │
│  ├── /portal/invoices     → My Invoices                                      │
│  ├── /portal/tickets      → Support Tickets                                  │
│  └── /portal/...          → Employee Modules                                 │
│                                                                              │
│  SPECIAL: ONBOARDING (/onboarding/*)                                         │
│  └── /onboarding          → 4-Step Client Onboarding Wizard                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Route Guards

| Guard | Route | Role Required | Redirect |
|-------|-------|---------------|----------|
| `AdminGuard` | `/admin/*` | `admin` | `/admin/login` |
| `TenantGuard` | `/tenant/*` | `super_admin` / `admin` | `/tenant/login` |
| `PortalGuard` | `/portal/*` | Any authenticated | `/portal/login` |

---

## 🗄️ Database Schema

### Overview Statistics

| Metric | Count |
|--------|-------|
| **Total Tables** | 60 |
| **Live Tables** | 35 |
| **Pending Tables** | 25 |
| **Functions** | 7 |
| **Triggers** | 2 |
| **Enums** | 15 |

### Table Categories

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📊 CORE TABLES (10)                                                         │
│  ├── profiles              User profiles linked to auth.users               │
│  ├── user_roles            Role assignments (admin/user)                    │
│  ├── admin_settings        System configuration                             │
│  ├── admin_notifications   Admin alerts                                     │
│  ├── portal_settings       Portal configuration                             │
│  ├── system_logs           Application logs                                 │
│  ├── audit_logs            Security audit trail                             │
│  ├── api_usage             API analytics                                    │
│  ├── clickstream_events    User behavior tracking                           │
│  └── integrations          Third-party connections                          │
│                                                                              │
│  💼 SALES & CRM (8)                                                          │
│  ├── quotes                Quote requests                                   │
│  ├── invoices              Billing records                                  │
│  ├── inquiries             Contact form submissions                         │
│  ├── leads                 Sales pipeline                                   │
│  ├── coupon_codes          Discount management                              │
│  ├── service_pricing       Pricing tiers                                    │
│  ├── service_addons        Optional add-ons                                 │
│  └── pricing_modifiers     Dynamic pricing rules                            │
│                                                                              │
│  📁 PROJECT MANAGEMENT (6)                                                   │
│  ├── projects              Active projects                                  │
│  ├── project_milestones    Milestone tracking                               │
│  ├── support_tickets       Customer support                                 │
│  ├── ticket_messages       Ticket conversations                             │
│  ├── meetings              Scheduled meetings                               │
│  └── team_members          Internal team                                    │
│                                                                              │
│  👥 MULTI-TENANCY (8)                                                        │
│  ├── client_tenants        Organization accounts                            │
│  ├── client_tenant_users   User-tenant mappings                             │
│  ├── client_files          Uploaded documents                               │
│  ├── client_feedback       Customer ratings                                 │
│  ├── client_notices        System announcements                             │
│  ├── client_onboarding     Onboarding requests                              │
│  ├── onboarding_sessions   Wizard progress                                  │
│  └── compliance_items      Compliance tracking                              │
│                                                                              │
│  🖥️ MSP MONITORING (3)                                                       │
│  ├── client_msp_servers    Server inventory                                 │
│  ├── client_msp_metrics    Performance metrics                              │
│  └── client_msp_alerts     System alerts                                    │
│                                                                              │
│  👤 HR & WORKFORCE (10) [PENDING]                                            │
│  ├── employees             Employee records                                 │
│  ├── departments           Department structure                             │
│  ├── positions             Job positions                                    │
│  ├── employee_documents    HR documents                                     │
│  ├── leave_requests        Leave management                                 │
│  ├── leave_balances        Leave quotas                                     │
│  ├── announcements         Company announcements                            │
│  ├── performance_reviews   Performance tracking                             │
│  ├── performance_goals     OKR management                                   │
│  └── training_records      Training history                                 │
│                                                                              │
│  💰 PAYROLL & FINANCE (6) [PENDING]                                          │
│  ├── payroll_runs          Payroll cycles                                   │
│  ├── payslips              Salary slips                                     │
│  ├── salary_components     Pay structure                                    │
│  ├── tax_declarations      Tax documents                                    │
│  ├── expense_claims        Expense reports                                  │
│  └── reimbursements        Payment records                                  │
│                                                                              │
│  ⏰ ATTENDANCE & SHIFTS (6) [PENDING]                                        │
│  ├── attendance_records    Daily attendance                                 │
│  ├── shifts                Shift definitions                                │
│  ├── shift_assignments     Employee schedules                               │
│  ├── shift_swap_requests   Swap management                                  │
│  ├── overtime_records      Overtime tracking                                │
│  └── geofence_zones        Location boundaries                              │
│                                                                              │
│  🔍 VERIFICATION (3) [PENDING]                                               │
│  ├── bgv_requests          Background checks                                │
│  ├── bgv_verifications     Verification results                             │
│  └── document_verifications Document validation                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ENTITY RELATIONSHIPS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                           ┌──────────────┐                                   │
│                           │  auth.users  │                                   │
│                           └──────┬───────┘                                   │
│                                  │ 1:1                                       │
│                                  ▼                                           │
│                           ┌──────────────┐                                   │
│              ┌────────────│   profiles   │────────────┐                      │
│              │            └──────────────┘            │                      │
│              │ 1:N               │ 1:N                │ 1:N                  │
│              ▼                   ▼                    ▼                      │
│     ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │
│     │  user_roles  │    │    quotes    │    │   projects   │                │
│     └──────────────┘    └──────┬───────┘    └──────┬───────┘                │
│                                │ 1:1                │ 1:N                    │
│                                ▼                    ▼                        │
│                         ┌──────────────┐    ┌──────────────┐                │
│                         │   invoices   │    │  milestones  │                │
│                         └──────────────┘    └──────────────┘                │
│                                                                              │
│  ┌──────────────┐       ┌──────────────┐                                    │
│  │client_tenants│◄──────│tenant_users  │                                    │
│  └──────┬───────┘ 1:N   └──────────────┘                                    │
│         │ 1:N                                                                │
│         ├─────────────────┬─────────────────┐                               │
│         ▼                 ▼                 ▼                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │ msp_servers  │  │  msp_alerts  │  │ client_files │                       │
│  └──────┬───────┘  └──────────────┘  └──────────────┘                       │
│         │ 1:N                                                                │
│         ▼                                                                    │
│  ┌──────────────┐                                                           │
│  │ msp_metrics  │                                                           │
│  └──────────────┘                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Edge Functions

### Overview Statistics

| Metric | Count |
|--------|-------|
| **Total Functions** | 15 |
| **Notification Functions** | 5 |
| **HR/Payroll Functions** | 5 |
| **Verification Functions** | 2 |
| **Workflow Functions** | 3 |

### Functions by Category

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EDGE FUNCTIONS                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📧 NOTIFICATIONS (5)                                                        │
│  ├── send-notification         Single notification delivery                 │
│  ├── send-bulk-notifications   Batch notification sending                   │
│  ├── send-welcome-email        New user welcome emails                      │
│  ├── send-quote-followup       Quote reminder emails                        │
│  └── send-feature-unlock-email Feature unlock notifications                 │
│                                                                              │
│  💰 PAYROLL & HR (5)                                                         │
│  ├── run-payroll               Execute payroll cycle                        │
│  ├── overtime-calculator       Calculate overtime pay                       │
│  ├── shift-scheduler           Auto-schedule shifts                         │
│  ├── shift-swap-workflow       Process swap requests                        │
│  └── geofence-attendance       Location-based check-in                      │
│                                                                              │
│  🔍 VERIFICATION (2)                                                         │
│  ├── process-bgv               Background verification                      │
│  └── verify-document           Document validation                          │
│                                                                              │
│  🔐 AUTHENTICATION (1)                                                       │
│  └── sso-callback              SSO OAuth callback                           │
│                                                                              │
│  📄 DOCUMENTS (1)                                                            │
│  └── generate-invoice-pdf      PDF invoice generation                       │
│                                                                              │
│  🏥 INSURANCE (1)                                                            │
│  └── process-insurance-claim   Insurance claim processing                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Function Details

| Function | Auth | Method | Purpose |
|----------|------|--------|---------|
| `send-notification` | Public | POST | Send single notification via email/push |
| `send-bulk-notifications` | Admin | POST | Batch send to multiple recipients |
| `send-welcome-email` | Public | POST | Welcome new users with credentials |
| `send-quote-followup` | Service | POST | Automated quote reminder emails |
| `send-feature-unlock-email` | Public | POST | Notify feature unlocks |
| `run-payroll` | Admin | POST | Execute monthly payroll cycle |
| `overtime-calculator` | JWT | POST | Calculate overtime compensation |
| `shift-scheduler` | Admin | POST | Auto-generate shift schedules |
| `shift-swap-workflow` | JWT | POST | Process shift swap requests |
| `geofence-attendance` | JWT | POST | Location-based attendance |
| `process-bgv` | JWT | POST | Background verification checks |
| `verify-document` | JWT | POST | Document authenticity validation |
| `sso-callback` | Public | GET | OAuth SSO callback handler |
| `generate-invoice-pdf` | JWT | POST | Generate PDF invoices |
| `process-insurance-claim` | JWT | POST | Insurance claim workflow |

---

## 🔐 Authentication & Security

### Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ROLE HIERARCHY                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    ATLAS GLOBAL ADMIN                                │    │
│  │  • Platform-wide access                                              │    │
│  │  • Tenant management                                                 │    │
│  │  • System configuration                                              │    │
│  │  • All data visibility                                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    TENANT SUPER-ADMIN                                │    │
│  │  • Organization-scoped access                                        │    │
│  │  • Employee management                                               │    │
│  │  • Module configuration                                              │    │
│  │  • Billing & settings                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    TENANT ADMIN                                      │    │
│  │  • Department-level access                                           │    │
│  │  • Team management                                                   │    │
│  │  • Operational controls                                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    EMPLOYEE (Portal User)                            │    │
│  │  • Personal data access                                              │    │
│  │  • Self-service features                                             │    │
│  │  • Assigned modules only                                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Row Level Security (RLS) Patterns

| Pattern | Example | Description |
|---------|---------|-------------|
| **User-owned** | `auth.uid() = user_id` | User can only access own records |
| **Tenant-scoped** | `tenant_id IN (SELECT ...)` | Access restricted to tenant members |
| **Role-based** | `has_role(auth.uid(), 'admin')` | Admin-only operations |
| **Public read** | `is_active = true` | Anyone can view active records |
| **System insert** | `true` (INSERT only) | System can insert, users can't |

### Security Functions

| Function | Purpose |
|----------|---------|
| `has_role(user_id, role)` | Check if user has specific role |
| `generate_client_id()` | Generate unique client identifiers |
| `generate_quote_number()` | Generate sequential quote numbers |
| `generate_invoice_number()` | Generate sequential invoice numbers |
| `generate_ticket_number()` | Generate support ticket numbers |
| `handle_new_user()` | Auto-create profile on signup |
| `update_updated_at_column()` | Auto-update timestamp triggers |

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 5.x | Build Tool |
| TailwindCSS | 3.x | Styling |
| Shadcn/UI | Latest | Component Library |
| Framer Motion | 11.x | Animations |
| React Router | 6.x | Routing |
| TanStack Query | 5.x | Data Fetching |
| React Hook Form | 7.x | Form Handling |
| Zod | 3.x | Validation |
| Recharts | 2.x | Charts |

### Backend (Supabase)

| Service | Purpose |
|---------|---------|
| PostgreSQL | Database (60 tables) |
| Auth | Authentication + RLS |
| Storage | File management |
| Edge Functions | Serverless logic (Deno) |
| Realtime | Live subscriptions |

### External Services

| Service | Purpose |
|---------|---------|
| Resend | Email delivery |
| (Planned) Stripe | Payment processing |
| (Planned) Twilio | SMS notifications |
| (Planned) OpenAI | AI capabilities |

---

## 🔗 Integration Points

### Current Integrations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INTEGRATION ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────┐                      ┌───────────────┐                   │
│  │    ATLAS      │◄────── API ─────────►│    Resend     │                   │
│  │   Frontend    │        (REST)        │  Email API    │                   │
│  └───────┬───────┘                      └───────────────┘                   │
│          │                                                                   │
│          │ Supabase Client                                                   │
│          │                                                                   │
│  ┌───────┴───────┐                                                          │
│  │   Supabase    │                                                          │
│  │    Backend    │                                                          │
│  ├───────────────┤                                                          │
│  │ • Database    │                                                          │
│  │ • Auth        │                                                          │
│  │ • Storage     │                                                          │
│  │ • Edge Funcs  │                                                          │
│  │ • Realtime    │                                                          │
│  └───────────────┘                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Planned Integrations

| Service | Use Case | Status |
|---------|----------|--------|
| Stripe | Payment processing | 🔜 Planned |
| Twilio | SMS notifications | 🔜 Planned |
| Google Workspace | SSO authentication | 🔜 Planned |
| Microsoft Entra | Enterprise SSO | 🔜 Planned |
| Okta/Auth0 | Identity federation | 🔜 Planned |
| OpenAI | Proxima AI features | 🔜 Planned |
| Temporal | Workflow automation | 🔜 Planned |
| Upstash Redis | Background jobs | 🔜 Planned |

---

## 📁 Project Structure

```
atlas/
├── 📁 docs/
│   ├── ATLAS-ARCHITECTURE.md        # This document
│   ├── ATLAS-DATABASE-SCHEMA.sql    # Database schema reference
│   ├── ATLAS-EDGE-FUNCTIONS.md      # Edge function documentation
│   └── ATLAS-SETUP-GUIDE.md         # Deployment guide
│
├── 📁 public/
│   ├── favicon.png                  # Site favicon
│   ├── robots.txt                   # SEO robots
│   └── sw.js                        # Service worker
│
├── 📁 src/
│   ├── 📁 assets/                   # Static assets
│   ├── 📁 components/
│   │   ├── 📁 admin/                # Admin panel components
│   │   │   └── 📁 modules/          # 15+ admin modules
│   │   ├── 📁 auth/                 # Authentication components
│   │   ├── 📁 guards/               # Route guard components
│   │   ├── 📁 layouts/              # Layout wrappers
│   │   ├── 📁 onboarding/           # Onboarding wizard
│   │   ├── 📁 portal/               # Employee portal components
│   │   ├── 📁 pricing/              # Pricing components
│   │   ├── 📁 tenant/               # Tenant admin components
│   │   │   ├── 📁 modals/           # Tenant modals
│   │   │   └── 📁 widgets/          # Dashboard widgets
│   │   └── 📁 ui/                   # Shadcn/UI components
│   │
│   ├── 📁 hooks/                    # Custom React hooks
│   ├── 📁 integrations/
│   │   └── 📁 supabase/             # Supabase client & types
│   ├── 📁 lib/                      # Utility functions
│   ├── 📁 pages/
│   │   ├── 📁 admin/                # Admin pages
│   │   ├── 📁 industries/           # Industry detail pages
│   │   ├── 📁 modules/              # Module detail pages
│   │   ├── 📁 portal/               # Portal pages
│   │   ├── 📁 services/             # Service pages
│   │   └── 📁 tenant/               # Tenant pages
│   │       └── 📁 settings/         # Tenant settings sub-pages
│   │
│   ├── 📁 styles/                   # Additional styles
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
│
├── 📁 supabase/
│   ├── config.toml                  # Supabase configuration
│   └── 📁 functions/                # Edge functions (15)
│       ├── generate-invoice-pdf/
│       ├── geofence-attendance/
│       ├── overtime-calculator/
│       ├── process-bgv/
│       ├── process-insurance-claim/
│       ├── run-payroll/
│       ├── send-bulk-notifications/
│       ├── send-feature-unlock-email/
│       ├── send-notification/
│       ├── send-quote-followup/
│       ├── send-welcome-email/
│       ├── shift-scheduler/
│       ├── shift-swap-workflow/
│       ├── sso-callback/
│       └── verify-document/
│
├── index.html                       # HTML entry
├── tailwind.config.ts               # Tailwind config
├── vite.config.ts                   # Vite config
└── package.json                     # Dependencies
```

---

## 📊 Quick Reference Links

| Document | Description |
|----------|-------------|
| [ATLAS-DATABASE-SCHEMA.sql](./ATLAS-DATABASE-SCHEMA.sql) | Complete database schema with 60 tables |
| [ATLAS-EDGE-FUNCTIONS.md](./ATLAS-EDGE-FUNCTIONS.md) | 15 edge function documentation |
| [ATLAS-SETUP-GUIDE.md](./ATLAS-SETUP-GUIDE.md) | Deployment and setup instructions |

---

## 📈 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 7, 2025 | Initial comprehensive architecture document |

---

<div align="center">

**Built with ❤️ by CropXon**

*From Hire to Retire — And Everything in Between*

</div>
