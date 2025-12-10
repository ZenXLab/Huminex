# TRACEFLOW Technology Stack

> **Last Updated:** 2025-12-10  
> **Version:** 1.0.0-beta  
> **Status:** Finalized Enterprise-Ready Stack

## Overview

TRACEFLOW is built on a modern, enterprise-grade technology stack designed for scalability, reliability, real-time performance, and multi-tenant isolation. This stack is MVP-fast, enterprise-safe, horizontally scalable, AI-native, multi-agent ready, observability-fused, and BFSI-compliant.

---

## 1. Backend / Core Cloud Platform

| Layer | Technology | Purpose | Use Cases |
|-------|------------|---------|-----------|
| **API Gateway** | Supabase Edge Functions + HTTPS/gRPC | Low-latency edge compute, global scale | Authentication, presigned uploads, metadata sync |
| **Core Backend** | Node.js / Deno / Go services | High throughput, event-heavy ingestion | Tenant mgmt, billing, reporting, admin APIs |
| **Metadata Store** | Supabase PostgreSQL (→ AWS RDS) | Reliable relational store, easy migration | Sessions, events, workflows, billing ledger |
| **Object Storage** | Supabase Storage (→ S3) | MVP simplicity; S3 lifecycle for scale | Session replays, audio files, screenshots |
| **Vector DB** | pgvector (MVP) → Pinecone (scale) | MVP fit; Pinecone for high-dimensional | Semantic search, root-cause grouping, similarity |
| **Queueing** | Upstash Redis Streams | Edge-friendly, durable streams | Event streaming, ingestion pipeline |
| **Task Queues** | BullMQ (Node.js) | Priority queues, retries, DLQ support | Short tasks: transcription, embeddings |
| **AI Orchestration** | NeuroRouter + MCP | Multi-provider routing, cost control | LLM provider selection, failover, governance |
| **Cloud Compute** | K8s / Serverless Workers | Logic separation + autoscaling | Background tasks, analytics, dashboards |

---

## 2. Runner (Hybrid / On-Prem / VPC)

For enterprise customers requiring data residency, BFSI compliance, or air-gapped deployments.

| Component | Technology | Responsibilities | Use Cases |
|-----------|------------|------------------|-----------|
| **Runner Runtime** | Docker / K8s / VM | Host ingest API, tokenization, buffering | BFSI/Insurance on-prem deployment |
| **Ingest Server** | Go / Node.js | High throughput event ingestion | Accept events, replays, logs via WebRTC/WS |
| **Tokenization Engine** | Local PII Redactor | Ensures **zero raw PII** leaves enterprise | Compliance-critical workloads |
| **Stream Buffer** | Redis Streams (local/Upstash) | Durable queue, backpressure handling | Protects from cloud outages |
| **Retry & DLQ** | BullMQ + DLQ (S3/MinIO) | Fault tolerance, no data loss | Enterprise reliability |
| **Local Workers** | Node.js/Go workers | Preprocessing, compression, chunking | Reduce cloud costs, low latency |
| **Policy Sync** | Cloud → Runner sync | Feature flags, retention, sampling | Tenant-wide settings enforcement |

---

## 3. Workflow & Orchestration (Durable + Scalable)

| Layer | Technology | Purpose | Use Cases |
|-------|------------|---------|-----------|
| **Workflow Engine** | Temporal.io | Exactly-once, durable, scalable workflows | Causality analysis, UX scan, AI pipelines |
| **Worker Pools** | Go / Node.js | Horizontal scalability | Heavy AI tasks, multi-step processes |
| **Workflow Types** | Temporal workflows | Long-running durable orchestration | Session summary, DLQ → retry, billing |
| **Automatic Recovery** | Temporal retry/backoff | Handles provider outages safely | AI provider failover |

### Temporal Workflow Examples
```typescript
// Session Analysis Workflow
@workflow
async function analyzeSession(sessionId: string): Promise<AnalysisResult> {
  // Step 1: Extract events
  const events = await extractSessionEvents(sessionId);
  
  // Step 2: Run AI analysis (with automatic retry)
  const summary = await summarizeSession(events);
  const rootCause = await detectRootCause(events, summary);
  
  // Step 3: Generate recommendations
  const fixes = await generateCodeFixes(rootCause);
  
  return { summary, rootCause, fixes };
}
```

---

## 4. AI & Multi-Agent Intelligence Layer

### NeuroRouter (Multi-LLM Task Router)

| Component | Technology | Description | Use Cases |
|-----------|------------|-------------|-----------|
| **Model Router** | NeuroRouter + MCP | Routes across OpenAI, Anthropic, Gemini, DeepSeek | Cost optimization, best-model selection |
| **Agents** | Multi-agent framework | UX Agent, Analyst Agent, Causality Agent | Automatic issue detection, RCA |
| **Embeddings** | OpenAI/DeepSeek/Pinecone | Cross-modal embeddings | Session similarity, clustering |
| **Summarization** | OpenAI/Anthropic | High-quality narrative insights | Executive dashboards |
| **Image/DOM Vision** | Vision LLM + heuristics | Detect layout bugs, overlaps | UX friction mapping |

### AI Gateway Configuration
```typescript
// Primary: Lovable AI Gateway (Pre-configured)
const LOVABLE_AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

// NeuroRouter Model Selection by Task Type
const MODEL_ROUTING = {
  session_summary: "google/gemini-2.5-flash",      // Fast, cost-effective
  root_cause_analysis: "google/gemini-2.5-pro",   // Deep reasoning
  ui_visual_analysis: "google/gemini-2.5-pro",    // Vision capabilities
  code_fix_suggestion: "openai/gpt-5-mini",       // Code expertise
  journey_analysis: "google/gemini-2.5-flash",    // Balanced performance
  causality_detection: "anthropic/claude-4",      // Complex reasoning
  embedding_generation: "openai/text-embedding",  // Vector embeddings
};

// Fallback Chain
const FALLBACK_CHAIN = [
  "google/gemini-2.5-flash",
  "openai/gpt-5-mini",
  "anthropic/claude-4",
  "deepseek/deepseek-v3"
];
```

### Supported AI Providers

| Provider | Models | Best For |
|----------|--------|----------|
| **Lovable AI Gateway** | gemini-2.5-flash/pro, gpt-5/mini/nano | Default (no API key needed) |
| **Google Gemini** | gemini-2.5-flash, gemini-2.5-pro, gemini-3-pro | Vision/UI analysis, multimodal |
| **OpenAI** | gpt-5, gpt-5-mini, gpt-5-nano | General reasoning, code analysis |
| **Anthropic Claude** | claude-4, claude-sonnet-4 | Complex reasoning, code review |
| **DeepSeek** | deepseek-v3 | Cost-effective reasoning |

---

## 5. Live Data & Observability Layer

| Feature | Technology | Purpose | Use Case |
|---------|------------|---------|----------|
| **Live Replay** | WebRTC (primary) / WebSocket (fallback) | Ultra-low latency, secure streaming | Support teams, fraud investigation |
| **Distributed Tracing** | OpenTelemetry | Full trace: SDK → Runner → Worker → Cloud | Correlation of logs + sessions |
| **Metrics** | Prometheus + Grafana | Enterprise observability | SLOs, alerting, system health |
| **Logs** | Loki / Elasticsearch | Centralized structured logs | Debugging, audit trails |
| **Trace Visualization** | Jaeger | Distributed trace analysis | Performance debugging |
| **Alerting** | PagerDuty / Slack / Email | Incident workflow | Real-time issue detection |

### OpenTelemetry Integration
```typescript
// Trace context propagation
import { trace, context } from '@opentelemetry/api';

const tracer = trace.getTracer('traceflow-sdk');

export function captureEvent(event: CaptureEvent) {
  const span = tracer.startSpan('capture_event', {
    attributes: {
      'event.type': event.type,
      'session.id': event.sessionId,
      'tenant.id': event.tenantId,
    }
  });
  
  try {
    // Process event with trace context
    return processEvent(event, span);
  } finally {
    span.end();
  }
}
```

---

## 6. Storage & Data Handling

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Metadata** | Supabase PostgreSQL | Sessions, events, analytics, billing |
| **Hot Storage** | PostgreSQL + Redis | Active sessions, real-time queries |
| **Warm Storage** | S3 Standard | Recent replays (0-30 days) |
| **Cold Storage** | S3 Glacier | Archive 6-12 month old replays |
| **Vector Retrieval** | pgvector → Pinecone | Semantic analytics, clustering |
| **Object Storage** | Supabase Storage → S3 | Blobs, audio, screenshots |
| **Blob Uploads** | Presigned URLs | High throughput, secure uploads |

### Storage Lifecycle Policy
```yaml
# S3 Lifecycle Configuration
lifecycle:
  - id: session-recordings-lifecycle
    prefix: recordings/
    transitions:
      - days: 30
        storage_class: STANDARD_IA
      - days: 90
        storage_class: GLACIER
    expiration:
      days: 365  # Configurable per tenant
```

---

## 7. Security & Compliance

| Requirement | Technology | Reason |
|-------------|------------|--------|
| **PII Tokenization** | Local engine on Runner | Keeps PII out of cloud |
| **mTLS Everywhere** | mTLS + cert rotation | BFSI requirement |
| **Secrets Management** | HashiCorp Vault / AWS KMS / GCP KMS | Zero trust architecture |
| **RBAC + SSO** | OAuth2, SAML, OIDC | Enterprise-ready auth |
| **Audit Logs** | Loki/Elasticsearch | Compliance requirements |
| **Data Residency** | Multi-region runners/cloud | GDPR/India regulations |
| **Encryption at Rest** | AES-256 | Data protection |
| **Encryption in Transit** | TLS 1.3 | Secure communication |
| **Row-Level Security** | PostgreSQL RLS | Tenant isolation |
| **SOC2/ISO Roadmap** | Architecture-ready | Enterprise trust |

### Security Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│  Client SDK  │  mTLS + API Key + JWT                       │
├──────────────┼──────────────────────────────────────────────┤
│  Edge        │  Rate limiting + WAF + DDoS protection      │
├──────────────┼──────────────────────────────────────────────┤
│  Runner      │  PII Tokenization + Local encryption        │
├──────────────┼──────────────────────────────────────────────┤
│  Cloud       │  RLS + Vault + KMS + Audit logging          │
├──────────────┼──────────────────────────────────────────────┤
│  Storage     │  AES-256 + Presigned URLs + Lifecycle       │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Frontend Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.x | UI component library |
| **TypeScript** | 5.x | Type-safe development |
| **Vite** | 5.x | Build tool and dev server |
| **React Router** | 6.x | Client-side routing |

### UI & Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| **TailwindCSS** | 3.x | Utility-first CSS framework |
| **Radix UI** | Latest | Accessible component primitives |
| **shadcn/ui** | Latest | Pre-built component library |
| **Framer Motion** | 11.x | Animation library |
| **Lucide React** | Latest | Icon library |

### State & Data Management
| Technology | Version | Purpose |
|------------|---------|---------|
| **TanStack Query** | 5.x | Server state management |
| **React Hook Form** | 7.x | Form state management |
| **Zod** | 3.x | Schema validation |

### Session Recording & Replay
| Technology | Version | Purpose |
|------------|---------|---------|
| **rrweb** | 2.0.0-alpha | DOM recording & replay |
| **rrweb-player** | 1.0.0-alpha | Session replay player |

### Drag & Drop
| Technology | Version | Purpose |
|------------|---------|---------|
| **@dnd-kit/core** | 6.x | Drag and drop primitives |
| **@dnd-kit/sortable** | 10.x | Sortable lists |

---

## 9. SDK Architecture

### Web SDK (JavaScript/TypeScript)
```typescript
// Installation
npm install @traceflow/web-sdk

// Usage
import { TraceFlow } from '@traceflow/web-sdk';

TraceFlow.init({
  projectId: 'your-project-id',
  apiKey: 'your-api-key',
  captureOptions: {
    clicks: true,
    scrolls: true,
    forms: true,
    errors: true,
    network: true,
    sessionRecording: true,
    audio: false,  // Enterprise feature
  },
  privacy: {
    maskInputs: true,
    maskEmails: true,
    excludeSelectors: ['.sensitive-data'],
  },
  runner: {
    endpoint: 'https://runner.yourcompany.com',  // On-prem runner
    fallback: 'https://ingest.traceflow.io',     // Cloud fallback
  }
});
```

### Mobile SDK (React Native / Flutter)
```typescript
// React Native
import { TraceFlowRN } from '@traceflow/react-native-sdk';

TraceFlowRN.init({
  projectId: 'your-project-id',
  apiKey: 'your-api-key',
  captureGestures: true,
  captureScreenshots: true,
});
```

### Backend SDK (Node.js / Python / Go)
```typescript
// Node.js
import { TraceFlowServer } from '@traceflow/node-sdk';

const tf = new TraceFlowServer({
  projectId: 'your-project-id',
  apiKey: 'your-api-key',
});

// Correlate backend events with sessions
tf.trackEvent('api_call', {
  sessionId: req.headers['x-traceflow-session'],
  endpoint: '/api/checkout',
  duration: 245,
  status: 200,
});
```

---

## 10. Product Features & Use Case Matrix

| Module | Features | Use Cases |
|--------|----------|-----------|
| **Capture Engine** | Session replay, DOM snapshots, audio, network tracing | UX debugging, compliance |
| **AI Analysis** | Multi-agent summarization + RCA | Automated triage, reduced MTTR |
| **UX Intelligence** | Rage-click, dead zone detection, layout bugs | Funnel optimization |
| **Causality Engine** | Issue → API → log → UI correlation | Engineering triage |
| **Performance Insights** | Latency/CPU correlation with UI failures | SRE troubleshooting |
| **Funnel Analysis** | Journey mapping, drop-off detection | Product growth |
| **Alerting & Ticketing** | Auto-tickets, automated incident timelines | SRE & Support automation |
| **Industry Packs** | BFSI claim-flow, ecommerce checkout analysis | Vertical-specific intelligence |

---

## 11. Deployment Modes

| Mode | Description | Target Users |
|------|-------------|--------------|
| **SaaS** | Full cloud deployment | Startups, SMBs |
| **Hybrid** | Runner on-prem, cloud control plane | BFSI, Insurance |
| **Fully On-Prem** | Runner + Workers + infra fully on-prem | Government, healthcare |
| **Air-Gapped** | No external connectivity | High-security banking, defense |

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT MODES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────────┐│
│  │    SaaS     │   │   Hybrid    │   │   On-Prem/Air-Gapped   ││
│  ├─────────────┤   ├─────────────┤   ├─────────────────────────┤│
│  │ SDK → Cloud │   │ SDK → Runner│   │ SDK → Runner → Local   ││
│  │             │   │     ↓       │   │         ↓              ││
│  │ Full cloud  │   │ Cloud Ctrl  │   │ Local Workers          ││
│  │ processing  │   │ Plane sync  │   │ Local Storage          ││
│  │             │   │             │   │ Local AI (optional)    ││
│  └─────────────┘   └─────────────┘   └─────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Version Compatibility Matrix

| Component | Minimum Version | Recommended |
|-----------|-----------------|-------------|
| Node.js | 18.x | 20.x LTS |
| PostgreSQL | 14.x | 15.x |
| Redis | 6.x | 7.x |
| Deno | 1.38+ | Latest |
| Docker | 20.x | 24.x |
| Kubernetes | 1.26+ | 1.29+ |
| Go | 1.20+ | 1.22+ |

---

## 13. Final Tech Stack Summary

### Core Platform
- **Supabase** (Edge Functions, Postgres, Storage, Realtime)
- **Redis Streams** (Upstash)
- **BullMQ** (Task queues)
- **Temporal.io** (Workflow orchestration)
- **NeuroRouter + MCP** (AI orchestration)

### AI Providers
- **Lovable AI Gateway** (Default, no API key)
- **OpenAI** (GPT-5, GPT-5-mini)
- **Anthropic** (Claude 4)
- **Google** (Gemini 2.5 Pro/Flash)
- **DeepSeek** (Cost-effective)

### Workers & Compute
- Node.js/Go containers
- Kubernetes for scaling
- Temporal workers

### Client SDKs
- Web (JavaScript/TypeScript)
- Mobile (React Native, Flutter)
- Backend (Node.js, Python, Go)
- WebRTC/WebSocket streaming

### Observability
- OpenTelemetry (tracing)
- Prometheus + Grafana (metrics)
- Loki/Elasticsearch (logs)
- Jaeger (trace visualization)

### Security
- HashiCorp Vault (secrets)
- mTLS everywhere
- PII Tokenization engine
- VPC/PrivateLink ready
- SOC2/ISO compliant architecture

---

## 14. Future Technology Additions

### Q1 2026
- [ ] Apache Kafka for high-volume event streaming
- [ ] ClickHouse for analytics data warehouse
- [ ] Pinecone migration for vector search at scale

### Q2 2026
- [ ] GraphQL API layer
- [ ] gRPC for internal service communication
- [ ] Custom ML model training pipeline

### Q3 2026
- [ ] Edge computing nodes
- [ ] Multi-region data replication
- [ ] Real-time ML inference at edge
- [ ] Voice+Session fusion (audio correlation)

---

*This is the finalized enterprise-ready tech stack for TRACEFLOW - MVP-fast, Enterprise-safe, Horizontally scalable, AI-native, Multi-agent ready, Observability-fused, BFSI-compliant, and Investor impressive.*
