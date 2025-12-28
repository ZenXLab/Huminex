# HUMINEX Platform - Technology Stack & Architecture

> **Version**: 1.0.0  
> **Last Updated**: December 28, 2025  
> **Target**: Scalable Billion-Dollar SaaS Enterprise

---

## 🎯 Vision Statement

HUMINEX is architected to be a **world-class enterprise Workforce Operating System** capable of scaling from startup to billion-dollar enterprise. The technology choices prioritize:

- **Scalability**: Handle millions of users across thousands of tenants
- **Security**: Enterprise-grade security with SOC2, ISO27001, GDPR compliance
- **Performance**: Sub-100ms response times at scale
- **Reliability**: 99.99% uptime SLA capability
- **Developer Experience**: Rapid iteration without compromising quality

---

## 🏗️ Current Technology Stack

### Frontend

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **React** | 18.3.1 | UI Framework | Industry standard, massive ecosystem, component reusability |
| **TypeScript** | 5.x | Type Safety | Catch bugs at compile time, better DX |
| **Vite** | 5.x | Build Tool | Lightning-fast HMR, optimized production builds |
| **TailwindCSS** | 3.x | Styling | Utility-first, consistent design system |
| **Framer Motion** | 11.x | Animations | Production-ready animations, gesture support |
| **React Router** | 6.x | Routing | Declarative routing, nested routes |
| **TanStack Query** | 5.x | Data Fetching | Caching, background refetch, optimistic updates |
| **React Hook Form** | 7.x | Form Management | Performance, validation, minimal re-renders |
| **Zod** | 3.x | Schema Validation | Runtime validation, TypeScript integration |

### UI Component Libraries

| Library | Purpose |
|---------|---------|
| **Radix UI** | Accessible primitives (dialogs, popovers, dropdowns) |
| **shadcn/ui** | Beautiful, customizable component system |
| **Lucide React** | Consistent iconography |
| **Recharts** | Data visualization, charts |
| **rrweb** | Session recording and replay |

### Backend (Supabase)

| Service | Purpose | Scalability Path |
|---------|---------|------------------|
| **PostgreSQL** | Primary database | Horizontal scaling, read replicas |
| **Supabase Auth** | Authentication | SSO, OAuth, MFA support |
| **Supabase Edge Functions** | Serverless compute | Auto-scaling, no cold starts |
| **Supabase Realtime** | WebSocket subscriptions | Built-in scaling |
| **Supabase Storage** | File storage | CDN-backed, unlimited storage |

### Email & Communication

| Service | Purpose |
|---------|---------|
| **Resend** | Transactional emails |
| **Planned: Twilio** | SMS, WhatsApp |
| **Planned: Gupshup** | WhatsApp Business API |

### AI & Intelligence

| Capability | Current Implementation |
|------------|------------------------|
| **Lovable AI Gateway** | Gemini, GPT integration without API keys |
| **Predictive Analytics** | MRR forecasting, churn prediction |
| **AI Summarization** | Document analysis, insights |

---

## 🚀 Planned Technology Additions

### For Billion-Dollar Scale

#### Background Job Processing
```
┌─────────────────────────────────────────────────────────────┐
│                    Job Processing Layer                      │
├─────────────────────────────────────────────────────────────┤
│  Upstash Redis + BullMQ                                     │
│  ├── Payroll processing queues                              │
│  ├── Email notification queues                              │
│  ├── Report generation queues                               │
│  ├── Data export queues                                     │
│  └── Webhook delivery queues                                │
└─────────────────────────────────────────────────────────────┘
```

| Technology | Purpose | Scale Target |
|------------|---------|--------------|
| **Upstash Redis** | Distributed caching, job queues | 100K+ concurrent jobs |
| **BullMQ** | Job orchestration, retries, priorities | Reliable job processing |

#### Workflow Automation
```
┌─────────────────────────────────────────────────────────────┐
│                   Workflow Orchestration                     │
├─────────────────────────────────────────────────────────────┤
│  Temporal Workflow                                          │
│  ├── OpZenix automation engine                              │
│  ├── Multi-step onboarding sequences                        │
│  ├── Payroll processing pipelines                           │
│  ├── BGV verification workflows                             │
│  ├── Approval chains with human-in-loop                     │
│  └── Scheduled compliance reminders                         │
└─────────────────────────────────────────────────────────────┘
```

| Technology | Purpose | Scale Target |
|------------|---------|--------------|
| **Temporal** | Durable workflow execution | 10M+ workflow executions/day |

#### Enterprise Authentication
```
┌─────────────────────────────────────────────────────────────┐
│                    SSO Architecture                          │
├─────────────────────────────────────────────────────────────┤
│  ├── Google Workspace (Gmail organizations)                 │
│  ├── Microsoft Entra ID (Office 365)                        │
│  ├── Okta / Auth0 (Enterprise IdP)                          │
│  └── Custom SAML 2.0 (Proprietary systems)                  │
└─────────────────────────────────────────────────────────────┘
```

#### Observability & Monitoring
```
┌─────────────────────────────────────────────────────────────┐
│                   Observability Stack                        │
├─────────────────────────────────────────────────────────────┤
│  ├── Sentry (Error tracking, performance)                   │
│  ├── PostHog (Product analytics, feature flags)             │
│  ├── Grafana Cloud (Infrastructure monitoring)              │
│  └── PagerDuty (Incident management)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏢 Multi-Tenancy Architecture

### Database Strategy: Logical Multi-Tenancy

```sql
-- All tenant-scoped tables include tenant_id
CREATE TABLE employees (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  -- ... other columns
);

-- RLS enforces tenant isolation
CREATE POLICY "Tenant isolation" ON employees
  USING (tenant_id = get_current_tenant_id());
```

### Tenant Isolation Layers

```
┌──────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│  ├── Route-level tenant context (/tenant/:slug/...)         │
│  ├── React context for tenant state                         │
│  └── API calls include tenant headers                        │
├──────────────────────────────────────────────────────────────┤
│                      API Layer                                │
│  ├── Edge function tenant validation                         │
│  ├── JWT claims include tenant_id                            │
│  └── Request-level tenant scope                              │
├──────────────────────────────────────────────────────────────┤
│                    Database Layer                             │
│  ├── RLS policies enforce tenant_id                          │
│  ├── Security definer functions for context                  │
│  └── Audit logs track tenant operations                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Current Database Schema

### Tables by Category (67 Total)

| Category | Table Count | Examples |
|----------|-------------|----------|
| Core | 4 | profiles, user_roles, client_tenants, client_tenant_users |
| Sales & CRM | 4 | quotes, invoices, leads, inquiries |
| Onboarding | 2 | onboarding_sessions, client_onboarding |
| Project Management | 2 | projects, project_milestones |
| Support | 2 | support_tickets, ticket_messages |
| Communication | 2 | meetings, client_notices |
| File Management | 2 | client_files, client_feedback |
| MSP Monitoring | 3 | client_msp_servers, client_msp_metrics, client_msp_alerts |
| Pricing | 4 | service_pricing, service_addons, pricing_modifiers, coupon_codes |
| Admin | 2 | admin_notifications, admin_settings |
| Analytics | 4 | clickstream_events, session_recordings, api_usage, sidebar_access_logs |
| A/B Testing | 4 | ab_experiments, ab_variants, ab_results, ab_user_assignments |
| AI | 1 | ai_predictions |
| Logging | 2 | audit_logs, system_logs |
| HR (Pending) | 10+ | employees, attendance, payroll, leave, etc. |

### Edge Functions (16 Deployed)

| Function | Purpose |
|----------|---------|
| generate-invoice-pdf | PDF invoice generation |
| geofence-attendance | GPS-validated check-ins |
| overtime-calculator | Overtime computation |
| predictive-analytics | AI predictions |
| process-bgv | Background verification |
| process-insurance-claim | Claims processing |
| run-payroll | Payroll execution |
| send-bulk-notifications | Batch notifications |
| send-feature-unlock-email | Feature unlock emails |
| send-notification | Single notifications |
| send-quote-followup | Quote follow-up emails |
| send-welcome-email | Welcome emails |
| shift-scheduler | Shift management |
| shift-swap-workflow | Shift swap processing |
| sso-callback | SSO authentication |
| verify-document | Document verification |

---

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   Authentication Layers                      │
├─────────────────────────────────────────────────────────────┤
│  1. Email/Password + Email OTP (Standard)                   │
│  2. SSO via OAuth 2.0 (Enterprise)                          │
│  3. SAML 2.0 (Custom Enterprise IdP)                        │
│  4. MFA via TOTP/SMS (Optional)                             │
└─────────────────────────────────────────────────────────────┘
```

### Authorization Model

```
┌─────────────────────────────────────────────────────────────┐
│                    RBAC Structure                            │
├─────────────────────────────────────────────────────────────┤
│  Platform Level (HUMINEX Admin)                              │
│  ├── admin: Full platform access                            │
│  └── user: Standard client access                           │
├─────────────────────────────────────────────────────────────┤
│  Tenant Level (Client Organization)                         │
│  ├── super_admin: Full organization access                  │
│  ├── admin: Organization management                         │
│  └── member: Basic organization access                      │
├─────────────────────────────────────────────────────────────┤
│  Employee Level (Portal Access)                             │
│  ├── admin: Full portal access                              │
│  ├── manager: Team management                               │
│  ├── hr: HR operations                                      │
│  ├── finance: Financial operations                          │
│  └── staff: Basic access                                    │
└─────────────────────────────────────────────────────────────┘
```

### Row-Level Security

```sql
-- Example: Employees can only see their tenant's data
CREATE POLICY "Tenant isolation" ON public.employees
  FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM client_tenant_users 
    WHERE user_id = auth.uid()
  ));
```

---

## 📈 Scaling Strategy

### Current Scale
- **Users**: 0-10,000
- **Tenants**: 0-100
- **Database**: Single Supabase instance
- **Compute**: Edge functions

### Phase 1: 10K-100K Users
- Read replicas for database
- CDN for static assets
- Redis caching layer
- BullMQ for job processing

### Phase 2: 100K-1M Users
- Temporal for workflows
- Dedicated Postgres clusters
- Multi-region deployment
- Advanced observability

### Phase 3: 1M+ Users
- Kubernetes orchestration
- Custom sharding strategy
- Global CDN presence
- Enterprise SLAs

---

## 🛠️ Development Workflow

### Code Quality

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **TypeScript** | Type checking |
| **Husky** | Git hooks |

### CI/CD Pipeline (Planned)

```
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                            │
├─────────────────────────────────────────────────────────────┤
│  1. Push to GitHub                                          │
│  2. Lint + Type Check                                       │
│  3. Unit Tests                                              │
│  4. Integration Tests                                       │
│  5. Build                                                   │
│  6. Deploy to Staging                                       │
│  7. E2E Tests                                               │
│  8. Deploy to Production                                    │
│  9. Post-deploy verification                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Performance Optimizations

### Current Optimizations

| Optimization | Implementation |
|--------------|----------------|
| **Code Splitting** | React.lazy for admin modules |
| **Data Caching** | TanStack Query with stale-while-revalidate |
| **Image Optimization** | Lazy loading, responsive images |
| **Bundle Optimization** | Vite tree-shaking, minification |
| **Service Worker** | Offline support, asset caching |

### Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |
| API Response Time | < 100ms p95 |

---

## 🌐 Deployment Architecture

### Current Setup

```
┌─────────────────────────────────────────────────────────────┐
│                  Lovable Cloud Hosting                       │
├─────────────────────────────────────────────────────────────┤
│  ├── Frontend: Lovable CDN                                  │
│  ├── Backend: Supabase (Managed)                            │
│  ├── Database: PostgreSQL (Supabase)                        │
│  └── Functions: Edge Functions (Deno Deploy)                │
└─────────────────────────────────────────────────────────────┘
```

### Production Architecture (Planned)

```
┌─────────────────────────────────────────────────────────────┐
│                    Global Architecture                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   CDN Edge   │    │   CDN Edge   │    │   CDN Edge   │  │
│  │   (US-East)  │    │   (EU-West)  │    │  (AP-South)  │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                   │           │
│         └───────────────────┼───────────────────┘           │
│                             │                               │
│                    ┌────────┴────────┐                      │
│                    │  Load Balancer  │                      │
│                    └────────┬────────┘                      │
│                             │                               │
│         ┌───────────────────┼───────────────────┐           │
│         │                   │                   │           │
│  ┌──────┴───────┐    ┌──────┴───────┐    ┌──────┴───────┐  │
│  │   App Node   │    │   App Node   │    │   App Node   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                             │                               │
│                    ┌────────┴────────┐                      │
│                    │   PostgreSQL    │                      │
│                    │   (Primary)     │                      │
│                    └────────┬────────┘                      │
│                             │                               │
│         ┌───────────────────┼───────────────────┐           │
│         │                   │                   │           │
│  ┌──────┴───────┐    ┌──────┴───────┐    ┌──────┴───────┐  │
│  │   Replica    │    │   Replica    │    │   Replica    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Technology Roadmap

### Q1 2026
- [ ] Upstash Redis + BullMQ integration
- [ ] Enhanced SSO providers
- [ ] Sentry error tracking

### Q2 2026
- [ ] Temporal workflow engine
- [ ] PostHog analytics
- [ ] Multi-region database

### Q3 2026
- [ ] Kubernetes deployment
- [ ] Custom sharding
- [ ] Enterprise SLA infrastructure

### Q4 2026
- [ ] Global CDN optimization
- [ ] Advanced AI features
- [ ] Mobile applications

---

## 🔗 Key Dependencies

```json
{
  "core": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^5.x",
    "vite": "^5.x"
  },
  "styling": {
    "tailwindcss": "^3.x",
    "tailwindcss-animate": "^1.0.7"
  },
  "state": {
    "@tanstack/react-query": "^5.83.0",
    "react-hook-form": "^7.61.1"
  },
  "ui": {
    "@radix-ui/react-*": "latest",
    "framer-motion": "^11.18.2",
    "lucide-react": "^0.462.0"
  },
  "backend": {
    "@supabase/supabase-js": "^2.86.2"
  },
  "utilities": {
    "date-fns": "^3.6.0",
    "zod": "^3.25.76",
    "clsx": "^2.1.1"
  }
}
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `ATLAS-DATABASE-SCHEMA.sql` | Complete database schema |
| `ATLAS-EDGE-FUNCTIONS.md` | Edge function documentation |
| `ATLAS-SETUP-GUIDE.md` | Deployment instructions |
| `ATLAS-PAGES-INVENTORY.md` | Complete page catalog |
| `ATLAS-TECH-STACK.md` | This document |

---

*Last Updated: December 9, 2025*
*Target: Enterprise-grade, billion-dollar scale SaaS platform*
