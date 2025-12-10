// TRACEFLOW Complete Demo Data for Feature Matrix
// Organized by Feature Categories A-N

export interface DemoDataItem {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'error' | 'warning' | 'success';
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  timestamp?: string;
  metadata?: Record<string, any>;
}

// A) DATA CAPTURE & INGEST LAYER
export const captureEngineData = {
  stats: [
    { label: 'Events/sec', value: '4,247', change: '+12%', trend: 'up' as const },
    { label: 'Active SDKs', value: '23', change: '+3', trend: 'up' as const },
    { label: 'Data Ingested', value: '2.4TB', change: '+18%', trend: 'up' as const },
    { label: 'Capture Rate', value: '99.97%', change: '+0.02%', trend: 'up' as const },
  ],
  sdks: [
    { name: 'Browser SDK (Web)', status: 'active', version: '2.4.1', events: '1.2M/day', domains: 12 },
    { name: 'Mobile SDK (iOS)', status: 'active', version: '1.8.3', events: '890K/day', apps: 3 },
    { name: 'Mobile SDK (Android)', status: 'active', version: '1.8.2', events: '1.1M/day', apps: 4 },
    { name: 'React Native SDK', status: 'pending', version: '1.2.0', events: '240K/day', apps: 2 },
  ],
  captureTypes: [
    { type: 'Automatic Events', count: 2847291, status: 'active' },
    { type: 'DOM Snapshots', count: 892431, status: 'active' },
    { type: 'Network/API Traces', count: 1234567, status: 'active' },
    { type: 'Rage-click Detection', count: 4521, status: 'active' },
    { type: 'Form Field Errors', count: 12893, status: 'active' },
    { type: 'User Journey Stitching', count: 89234, status: 'active' },
    { type: 'Voice/Audio Capture', count: 0, status: 'pending' },
    { type: 'WebRTC Live Replay', count: 342, status: 'active' },
  ],
  realtimeEvents: [
    { id: 'evt_001', type: 'click', page: '/checkout', element: 'button.submit', timestamp: '2s ago' },
    { id: 'evt_002', type: 'scroll', page: '/pricing', depth: 75, timestamp: '3s ago' },
    { id: 'evt_003', type: 'error', page: '/dashboard', message: 'API timeout', timestamp: '5s ago' },
    { id: 'evt_004', type: 'form_input', page: '/signup', field: 'email', timestamp: '8s ago' },
    { id: 'evt_005', type: 'rage_click', page: '/cart', element: 'div.loading', timestamp: '12s ago' },
  ],
};

// B) ENTERPRISE RUNNER
export const enterpriseRunnerData = {
  stats: [
    { label: 'Runner Instances', value: '8', change: '+2', trend: 'up' as const },
    { label: 'Queue Depth', value: '1,247', change: '-15%', trend: 'down' as const },
    { label: 'Processing Rate', value: '12.4K/s', change: '+8%', trend: 'up' as const },
    { label: 'Uptime', value: '99.99%', change: '+0.01%', trend: 'up' as const },
  ],
  runners: [
    { id: 'runner_01', name: 'prod-us-east-1', status: 'healthy', cpu: 45, memory: 62, queue: 234 },
    { id: 'runner_02', name: 'prod-us-west-2', status: 'healthy', cpu: 38, memory: 55, queue: 189 },
    { id: 'runner_03', name: 'prod-eu-west-1', status: 'healthy', cpu: 52, memory: 71, queue: 412 },
    { id: 'runner_04', name: 'prod-ap-south-1', status: 'warning', cpu: 78, memory: 85, queue: 892 },
  ],
  capabilities: [
    { name: 'HTTP/gRPC Ingest API', status: 'active', throughput: '50K req/s' },
    { name: 'WebSocket/WebRTC Ingest', status: 'active', connections: 12400 },
    { name: 'Local PII Tokenization', status: 'active', tokensProcessed: '2.4M' },
    { name: 'Adaptive Sampling', status: 'active', rate: '15%' },
    { name: 'Circuit Breaker', status: 'active', trips: 3 },
    { name: 'Local Redis Buffering', status: 'active', size: '4.2GB' },
    { name: 'DLQ Forwarding', status: 'active', pending: 127 },
  ],
};

// C) STREAMING + PROCESSING LAYER
export const streamingLayerData = {
  stats: [
    { label: 'Messages/sec', value: '24.7K', change: '+22%', trend: 'up' as const },
    { label: 'Avg Latency', value: '12ms', change: '-8%', trend: 'down' as const },
    { label: 'Worker Nodes', value: '24', change: '+4', trend: 'up' as const },
    { label: 'DLQ Size', value: '127', change: '-45', trend: 'down' as const },
  ],
  eventBackbone: [
    { name: 'Redis Streams', status: 'active', lag: '2.3ms', consumers: 12 },
    { name: 'Kafka Cluster', status: 'active', partitions: 48, lag: '4.1ms' },
    { name: 'Consumer Groups', status: 'active', groups: 8, offset: 'latest' },
  ],
  edgeWorkers: [
    { name: 'Transcription Worker', status: 'active', processed: '12.4K', queue: 23 },
    { name: 'Embedding Generator', status: 'active', processed: '89.2K', queue: 156 },
    { name: 'Replay Chunker', status: 'active', processed: '4.2K', queue: 12 },
    { name: 'Micro-Summary AI', status: 'active', processed: '2.1K', queue: 8 },
    { name: 'Form Anomaly Detector', status: 'active', processed: '15.7K', queue: 34 },
  ],
  jobQueue: [
    { priority: 'critical', pending: 12, processing: 3, completed: 4521 },
    { priority: 'high', pending: 89, processing: 24, completed: 12893 },
    { priority: 'normal', pending: 456, processing: 128, completed: 89234 },
    { priority: 'low', pending: 1234, processing: 56, completed: 234567 },
  ],
};

// D) AI MULTI-AGENT SYSTEM
export const aiAgentSystemData = {
  stats: [
    { label: 'AI Tasks/hr', value: '2,847', change: '+34%', trend: 'up' as const },
    { label: 'Avg Response', value: '1.2s', change: '-18%', trend: 'down' as const },
    { label: 'Cost/1K Tasks', value: '$0.42', change: '-12%', trend: 'down' as const },
    { label: 'Accuracy', value: '94.2%', change: '+2.1%', trend: 'up' as const },
  ],
  neuroRouter: {
    activeProviders: [
      { name: 'OpenAI GPT-5', status: 'active', tasks: 1247, avgLatency: '890ms', cost: '$0.32' },
      { name: 'Google Gemini 2.5', status: 'active', tasks: 892, avgLatency: '720ms', cost: '$0.28' },
      { name: 'Anthropic Claude 4', status: 'active', tasks: 456, avgLatency: '1.1s', cost: '$0.45' },
      { name: 'DeepSeek R1', status: 'active', tasks: 234, avgLatency: '650ms', cost: '$0.18' },
    ],
    routingPolicy: 'cost-optimized',
    circuitBreakers: 2,
    auditTrail: 12847,
  },
  agents: [
    { name: 'Session Analyst', status: 'active', tasks: 892, accuracy: '96%', icon: 'brain' },
    { name: 'UX Vision Agent', status: 'active', tasks: 456, accuracy: '93%', icon: 'eye' },
    { name: 'Causality Agent', status: 'active', tasks: 234, accuracy: '91%', icon: 'git-branch' },
    { name: 'Error Diagnosis', status: 'active', tasks: 567, accuracy: '97%', icon: 'bug' },
    { name: 'Performance Agent', status: 'active', tasks: 189, accuracy: '94%', icon: 'zap' },
    { name: 'Growth Agent', status: 'active', tasks: 123, accuracy: '89%', icon: 'trending-up' },
    { name: 'Ticketing Agent', status: 'pending', tasks: 0, accuracy: 'N/A', icon: 'ticket' },
  ],
  recentOutputs: [
    { type: 'session_summary', insight: 'User struggled with OTP input on mobile', confidence: 94 },
    { type: 'causal_chain', insight: 'API timeout → loader stuck → rage clicks', confidence: 91 },
    { type: 'revenue_impact', insight: '₹2.1M at risk from checkout failures', confidence: 89 },
    { type: 'root_cause', insight: 'ComponentX line 53 causing null pointer', confidence: 96 },
  ],
};

// E) TEMPORAL WORKFLOW LAYER
export const temporalWorkflowData = {
  stats: [
    { label: 'Active Workflows', value: '1,247', change: '+8%', trend: 'up' as const },
    { label: 'Completed/hr', value: '892', change: '+15%', trend: 'up' as const },
    { label: 'Failed/hr', value: '12', change: '-40%', trend: 'down' as const },
    { label: 'Avg Duration', value: '4.2s', change: '-22%', trend: 'down' as const },
  ],
  workflows: [
    { name: 'Session Summary', status: 'running', active: 234, completed: 12847, avgDuration: '2.1s' },
    { name: 'UX Scan', status: 'running', active: 89, completed: 4521, avgDuration: '8.4s' },
    { name: 'Causality Analysis', status: 'running', active: 45, completed: 2134, avgDuration: '12.3s' },
    { name: 'Multi-Agent Orchestration', status: 'running', active: 23, completed: 892, avgDuration: '18.7s' },
    { name: 'DLQ Reprocessing', status: 'idle', active: 0, completed: 127, avgDuration: '45.2s' },
    { name: 'Retention Purge', status: 'scheduled', active: 0, completed: 24, avgDuration: '5m' },
    { name: 'Billing Meter', status: 'running', active: 1, completed: 720, avgDuration: '1.2s' },
  ],
  guarantees: [
    { name: 'Exactly-once Orchestration', status: 'active' },
    { name: 'Versioned Definitions', status: 'active', version: 'v2.4.1' },
    { name: 'Long-running Tasks', status: 'active', maxDuration: '7 days' },
    { name: 'Horizontal Scaling', status: 'active', workers: 24 },
    { name: 'Human-in-loop Approvals', status: 'pending' },
  ],
};

// F) STORAGE & INDEXING LAYER
export const storageLayerData = {
  stats: [
    { label: 'Total Storage', value: '12.4TB', change: '+8%', trend: 'up' as const },
    { label: 'Hot Storage', value: '2.1TB', change: '+12%', trend: 'up' as const },
    { label: 'Cold Storage', value: '10.3TB', change: '+6%', trend: 'up' as const },
    { label: 'Index Size', value: '890GB', change: '+15%', trend: 'up' as const },
  ],
  objectStorage: [
    { type: 'Replay Blobs', size: '4.2TB', objects: '2.4M', retention: '90 days' },
    { type: 'Screenshots', size: '1.8TB', objects: '12.4M', retention: '30 days' },
    { type: 'Audio Files', size: '890GB', objects: '234K', retention: '60 days' },
    { type: 'Payload Archives', size: '2.1TB', objects: '1.2M', retention: '365 days' },
  ],
  metadataDB: [
    { table: 'sessions', rows: '12.4M', size: '45GB', indexes: 8 },
    { table: 'events', rows: '892M', size: '234GB', indexes: 12 },
    { table: 'user_journeys', rows: '2.1M', size: '12GB', indexes: 6 },
    { table: 'api_logs', rows: '456M', size: '89GB', indexes: 5 },
    { table: 'tenant_settings', rows: '1.2K', size: '24MB', indexes: 3 },
  ],
  vectorDB: [
    { index: 'session_embeddings', vectors: '2.4M', dimensions: 1536, similarity: 'cosine' },
    { index: 'journey_clusters', vectors: '892K', dimensions: 768, similarity: 'euclidean' },
    { index: 'anomaly_detection', vectors: '456K', dimensions: 512, similarity: 'cosine' },
  ],
};

// G) CONTROL PLANE
export const controlPlaneData = {
  stats: [
    { label: 'Active Tenants', value: '247', change: '+12', trend: 'up' as const },
    { label: 'Monthly Usage', value: '$12.4K', change: '+18%', trend: 'up' as const },
    { label: 'API Calls', value: '89M', change: '+24%', trend: 'up' as const },
    { label: 'Active Users', value: '1,247', change: '+8%', trend: 'up' as const },
  ],
  tenants: [
    { name: 'Acme Corp', plan: 'Enterprise', usage: '$4,247', sessions: '2.4M', status: 'active' },
    { name: 'TechStart Inc', plan: 'Business', usage: '$1,892', sessions: '890K', status: 'active' },
    { name: 'Global Finance', plan: 'Enterprise', usage: '$8,456', sessions: '4.2M', status: 'active' },
    { name: 'HealthPlus', plan: 'Business', usage: '$2,134', sessions: '1.1M', status: 'active' },
  ],
  featureFlags: [
    { flag: 'ai_session_analysis', enabled: true, tenants: 'all' },
    { flag: 'voice_capture', enabled: false, tenants: 'beta' },
    { flag: 'webrtc_live', enabled: true, tenants: 'enterprise' },
    { flag: 'custom_agents', enabled: false, tenants: 'none' },
  ],
  alerts: [
    { type: 'anomaly', message: 'Error rate spike detected', tenant: 'Acme Corp', severity: 'high' },
    { type: 'quota', message: 'Approaching 80% of monthly quota', tenant: 'TechStart', severity: 'medium' },
    { type: 'performance', message: 'API latency increased 40%', tenant: 'all', severity: 'medium' },
  ],
};

// H) REALTIME & OBSERVABILITY
export const observabilityData = {
  stats: [
    { label: 'Live Connections', value: '12,400', change: '+15%', trend: 'up' as const },
    { label: 'Trace Spans/s', value: '45.2K', change: '+8%', trend: 'up' as const },
    { label: 'Metrics Points', value: '2.4M', change: '+12%', trend: 'up' as const },
    { label: 'Log Lines/s', value: '8.9K', change: '+5%', trend: 'up' as const },
  ],
  realtime: [
    { channel: 'WebRTC Live Replay', connections: 342, bandwidth: '1.2Gbps', status: 'active' },
    { channel: 'WebSocket Events', connections: 12058, messages: '24.7K/s', status: 'active' },
    { channel: 'Anomaly Notifications', subscribers: 1247, alerts: '45/hr', status: 'active' },
    { channel: 'Dashboard Updates', connections: 892, fps: 60, status: 'active' },
  ],
  traces: [
    { service: 'SDK Capture', spans: '12.4M', p50: '2ms', p99: '45ms', errors: '0.02%' },
    { service: 'Runner Ingest', spans: '8.9M', p50: '8ms', p99: '120ms', errors: '0.05%' },
    { service: 'AI Processing', spans: '2.1M', p50: '890ms', p99: '4.2s', errors: '0.12%' },
    { service: 'Temporal Workers', spans: '4.5M', p50: '45ms', p99: '890ms', errors: '0.08%' },
  ],
  dashboards: [
    { name: 'System Health', type: 'grafana', panels: 24, refreshRate: '10s' },
    { name: 'AI Performance', type: 'grafana', panels: 18, refreshRate: '30s' },
    { name: 'Business Metrics', type: 'custom', panels: 12, refreshRate: '1m' },
    { name: 'SLO Dashboard', type: 'grafana', panels: 8, refreshRate: '5s' },
  ],
};

// I) SECURITY & COMPLIANCE
export const securityData = {
  stats: [
    { label: 'PII Tokens', value: '24.7M', change: '+8%', trend: 'up' as const },
    { label: 'Encrypted Keys', value: '1,247', change: '+12', trend: 'up' as const },
    { label: 'Audit Events', value: '892K', change: '+15%', trend: 'up' as const },
    { label: 'Policy Violations', value: '0', change: '0', trend: 'stable' as const },
  ],
  compliance: [
    { framework: 'SOC 2 Type II', status: 'certified', lastAudit: '2024-11-15', nextAudit: '2025-05-15' },
    { framework: 'ISO 27001', status: 'certified', lastAudit: '2024-10-01', nextAudit: '2025-10-01' },
    { framework: 'GDPR', status: 'compliant', lastAudit: '2024-12-01', nextAudit: '2025-06-01' },
    { framework: 'HIPAA', status: 'in-progress', lastAudit: 'N/A', nextAudit: '2025-03-01' },
  ],
  securityFeatures: [
    { name: 'Zero Raw PII Ingest', status: 'active', description: 'All PII tokenized at edge' },
    { name: 'mTLS Communication', status: 'active', description: 'End-to-end encryption' },
    { name: 'VPC Peering', status: 'active', description: '12 VPCs connected' },
    { name: 'KMS Encryption', status: 'active', description: 'AES-256-GCM' },
    { name: 'Per-tenant Keys', status: 'active', description: '247 unique keys' },
    { name: 'Audit Trails', status: 'active', description: '90-day retention' },
  ],
  recentAudits: [
    { action: 'Data Export', user: 'admin@acme.com', resource: 'sessions', timestamp: '2 min ago' },
    { action: 'Policy Update', user: 'security@corp.com', resource: 'pii_rules', timestamp: '15 min ago' },
    { action: 'Key Rotation', user: 'system', resource: 'encryption_keys', timestamp: '1 hr ago' },
  ],
};

// J) ENTERPRISE DEPLOYMENT MODES
export const deploymentData = {
  stats: [
    { label: 'SaaS Tenants', value: '189', change: '+8', trend: 'up' as const },
    { label: 'Hybrid Deployments', value: '45', change: '+3', trend: 'up' as const },
    { label: 'On-Prem Instances', value: '13', change: '+1', trend: 'up' as const },
    { label: 'Air-gapped', value: '4', change: '0', trend: 'stable' as const },
  ],
  modes: [
    { name: 'SaaS (Cloud)', status: 'active', tenants: 189, description: 'Fully managed cloud' },
    { name: 'Hybrid', status: 'active', tenants: 45, description: 'Runner on-prem, cloud control' },
    { name: 'Fully On-Prem', status: 'active', tenants: 13, description: 'Complete self-hosted' },
    { name: 'Air-gapped', status: 'active', tenants: 4, description: 'No internet connection' },
    { name: 'Dedicated VPC', status: 'active', tenants: 8, description: 'Single-tenant cloud' },
  ],
  deploymentOptions: [
    { type: 'Kubernetes Helm', status: 'available', version: '2.4.1' },
    { type: 'Docker Compose', status: 'available', version: '2.4.1' },
    { type: 'VM Installer', status: 'available', platforms: 'Linux, Windows' },
    { type: 'Windows MSI', status: 'available', version: '2.4.1' },
    { type: 'Terraform Module', status: 'available', providers: 'AWS, GCP, Azure' },
  ],
};

// K) INDUSTRY MODULES
export const industryModulesData = {
  bfsi: {
    name: 'BFSI Module',
    features: [
      { name: 'KYC/OTP Journey Maps', status: 'active', insights: 4521, revenue: '₹12.4M saved' },
      { name: 'Loan Application Funnel', status: 'active', insights: 2134, revenue: '₹8.9M saved' },
      { name: 'Payment Dropout Analytics', status: 'active', insights: 8923, revenue: '₹45.2M saved' },
      { name: 'Fraud Friction Analysis', status: 'active', insights: 1247, revenue: '₹2.1M saved' },
    ],
  },
  insurance: {
    name: 'Insurance Module',
    features: [
      { name: 'Claims Journey Insights', status: 'active', insights: 3421, revenue: '₹5.4M saved' },
      { name: 'Agent Portal Diagnostics', status: 'active', insights: 1892, revenue: '₹2.8M saved' },
      { name: 'Policy Issuance Drop-off', status: 'active', insights: 2456, revenue: '₹7.2M saved' },
      { name: 'Document Upload Failures', status: 'active', insights: 4123, revenue: '₹3.1M saved' },
    ],
  },
  ecommerce: {
    name: 'E-commerce Module',
    features: [
      { name: 'Checkout Abandonment AI', status: 'active', insights: 12847, revenue: '₹89.2M saved' },
      { name: 'Cart Insight Flows', status: 'active', insights: 8923, revenue: '₹45.6M saved' },
      { name: 'Search Frustration Detection', status: 'active', insights: 5621, revenue: '₹23.4M saved' },
    ],
  },
  saas: {
    name: 'SaaS/B2B Module',
    features: [
      { name: 'Onboarding Flow Analytics', status: 'active', insights: 3456, revenue: '₹12.1M ARR saved' },
      { name: 'User Activation Scoring', status: 'active', insights: 2134, revenue: '₹8.4M ARR saved' },
      { name: 'Feature Adoption Heatmaps', status: 'active', insights: 4521, revenue: '₹15.2M ARR saved' },
    ],
  },
};

// L) COST OPTIMIZATION
export const costOptimizationData = {
  stats: [
    { label: 'Monthly Cost', value: '$4,247', change: '-12%', trend: 'down' as const },
    { label: 'Cost/Session', value: '$0.0012', change: '-8%', trend: 'down' as const },
    { label: 'AI Cost/Task', value: '$0.42', change: '-15%', trend: 'down' as const },
    { label: 'Storage Cost', value: '$892', change: '-5%', trend: 'down' as const },
  ],
  budgets: [
    { tenant: 'Acme Corp', budget: 5000, used: 4247, percentage: 85 },
    { tenant: 'TechStart', budget: 2000, used: 1892, percentage: 95 },
    { tenant: 'Global Finance', budget: 10000, used: 8456, percentage: 85 },
    { tenant: 'HealthPlus', budget: 3000, used: 2134, percentage: 71 },
  ],
  optimizations: [
    { type: 'Adaptive Sampling', savings: '$1,247/mo', status: 'active' },
    { type: 'Cold Storage Tiering', savings: '$892/mo', status: 'active' },
    { type: 'AI Model Routing', savings: '$456/mo', status: 'active' },
    { type: 'Event Deduplication', savings: '$234/mo', status: 'active' },
  ],
  scaling: [
    { metric: 'Auto-scaling Workers', current: 24, min: 4, max: 100 },
    { metric: 'Regional Distribution', regions: ['us-east', 'us-west', 'eu-west', 'ap-south'] },
    { metric: 'Multi-region Active', status: 'active', latency: '<50ms' },
  ],
};

// M) PRODUCTIZED OUTPUTS
export const productizedOutputsData = {
  reports: [
    { name: 'AI Session Reports', generated: 12847, format: 'PDF/JSON', frequency: 'Real-time' },
    { name: 'UX Friction Maps', generated: 4521, format: 'Interactive', frequency: 'Hourly' },
    { name: 'Journey Causality Graphs', generated: 2134, format: 'SVG/JSON', frequency: 'On-demand' },
    { name: 'Anomaly Heatmaps', generated: 892, format: 'Canvas', frequency: 'Real-time' },
    { name: 'Model Provenance Sheets', generated: 456, format: 'PDF', frequency: 'Weekly' },
    { name: 'Replay + Transcript Fusion', generated: 234, format: 'Video/Text', frequency: 'On-demand' },
  ],
  integrations: [
    { name: 'Jira Issue Creation', status: 'active', created: 1247, autoCreate: true },
    { name: 'GitHub Issues', status: 'active', created: 892, autoCreate: false },
    { name: 'ServiceNow Tickets', status: 'pending', created: 0, autoCreate: false },
    { name: 'Snowflake Export', status: 'active', synced: '2.4TB', frequency: 'Daily' },
    { name: 'BigQuery Export', status: 'active', synced: '1.8TB', frequency: 'Hourly' },
  ],
};

// N) FUTURE EXPANSIONS
export const futureExpansionsData = {
  roadmap: [
    { feature: 'LLM-driven Synthetic Testing', status: 'planned', eta: 'Q2 2025', progress: 15 },
    { feature: 'Autonomous UX Optimizer', status: 'research', eta: 'Q3 2025', progress: 5 },
    { feature: 'On-device Small-model Agents', status: 'planned', eta: 'Q2 2025', progress: 25 },
    { feature: 'Federated Analytics', status: 'design', eta: 'Q4 2025', progress: 10 },
    { feature: 'AI-based Real User Monitoring', status: 'planned', eta: 'Q1 2025', progress: 45 },
    { feature: 'Edge-only Inference', status: 'research', eta: 'Q3 2025', progress: 8 },
    { feature: 'Datadog Adapter', status: 'development', eta: 'Q1 2025', progress: 65 },
    { feature: 'New Relic Adapter', status: 'planned', eta: 'Q1 2025', progress: 30 },
    { feature: 'AppDynamics Adapter', status: 'planned', eta: 'Q2 2025', progress: 20 },
    { feature: 'Splunk Adapter', status: 'design', eta: 'Q2 2025', progress: 12 },
  ],
};

// Feature Matrix Status (for checklist view)
export const featureMatrixStatus = {
  'A': { name: 'Data Capture & Ingest', total: 14, implemented: 10, partial: 2, planned: 2 },
  'B': { name: 'Enterprise Runner', total: 18, implemented: 12, partial: 3, planned: 3 },
  'C': { name: 'Streaming + Processing', total: 15, implemented: 10, partial: 3, planned: 2 },
  'D': { name: 'AI Multi-Agent System', total: 18, implemented: 12, partial: 4, planned: 2 },
  'E': { name: 'Temporal Workflows', total: 14, implemented: 8, partial: 3, planned: 3 },
  'F': { name: 'Storage & Indexing', total: 12, implemented: 10, partial: 2, planned: 0 },
  'G': { name: 'Control Plane', total: 16, implemented: 12, partial: 2, planned: 2 },
  'H': { name: 'Realtime & Observability', total: 14, implemented: 10, partial: 2, planned: 2 },
  'I': { name: 'Security & Compliance', total: 12, implemented: 8, partial: 2, planned: 2 },
  'J': { name: 'Enterprise Deployment', total: 10, implemented: 8, partial: 1, planned: 1 },
  'K': { name: 'Industry Modules', total: 12, implemented: 10, partial: 2, planned: 0 },
  'L': { name: 'Cost Optimization', total: 8, implemented: 6, partial: 1, planned: 1 },
  'M': { name: 'Productized Outputs', total: 10, implemented: 7, partial: 2, planned: 1 },
  'N': { name: 'Future Expansions', total: 10, implemented: 0, partial: 2, planned: 8 },
};

// Combined export for easy module access
export const traceflowDemoData = {
  captureEngine: {
    ...captureEngineData,
    features: [
      { name: 'Browser SDK (Web)', enabled: true, description: 'Auto-capture for web apps' },
      { name: 'Mobile SDK (iOS/Android)', enabled: true, description: 'Native mobile tracking' },
      { name: 'Offline Event Queue', enabled: true, description: 'Persist events when offline' },
      { name: 'Automatic Event Capture', enabled: true, description: 'Zero manual tagging' },
      { name: 'DOM Snapshots', enabled: true, description: 'Pixel-perfect reconstruction' },
      { name: 'Network/API Tracing', enabled: true, description: 'Full request/response capture' },
      { name: 'Rage-click Detection', enabled: true, description: 'Frustration pattern recognition' },
      { name: 'Form-field Error Capture', enabled: true, description: 'Input validation tracking' },
      { name: 'User Journey Stitching', enabled: true, description: 'Cross-session identity' },
      { name: 'Realtime Micro-events', enabled: true, description: 'WebSocket event streaming' },
      { name: 'WebRTC Live Replay', enabled: false, description: 'Live session co-browsing' },
      { name: 'Voice/Audio Capture', enabled: false, description: 'Audio event recording' },
      { name: 'Screen Recording', enabled: true, description: 'Privacy-safe video capture' },
      { name: 'SDK-side Masking', enabled: true, description: 'Client-side PII redaction' },
    ],
  },
  enterpriseRunner: {
    ...enterpriseRunnerData,
    features: [
      { name: 'HTTP/gRPC Ingest API', enabled: true, description: 'High-throughput ingestion' },
      { name: 'WebSocket/WebRTC Ingest', enabled: true, description: 'Real-time connections' },
      { name: 'Local PII Tokenization', enabled: true, description: 'Edge-level privacy' },
      { name: 'PII Redaction Policy Engine', enabled: true, description: 'Configurable rules' },
      { name: 'Adaptive Sampling', enabled: true, description: 'Dynamic rate control' },
      { name: 'Backpressure Management', enabled: true, description: 'Flow control' },
      { name: 'Circuit Breaker', enabled: true, description: 'Fault tolerance' },
      { name: 'Tenant-level Quotas', enabled: true, description: 'Usage limits per org' },
      { name: 'Local Redis Buffering', enabled: true, description: 'Local queue storage' },
      { name: 'Disk Fallback Storage', enabled: false, description: 'Persistent backup' },
      { name: 'Presigned URL Uploads', enabled: true, description: 'Direct S3/MinIO uploads' },
      { name: 'Auto-healing', enabled: true, description: 'Self-recovery mechanisms' },
      { name: 'Health Probes', enabled: true, description: 'Liveness/readiness checks' },
      { name: 'Queue Depth Monitoring', enabled: true, description: 'Backlog visibility' },
      { name: 'Retry Engine', enabled: true, description: 'Automatic retries' },
      { name: 'DLQ Forwarding', enabled: true, description: 'Failed event archival' },
      { name: 'K8s/VM/Docker Deployment', enabled: true, description: 'Flexible deployment' },
      { name: 'Air-gapped Mode', enabled: false, description: 'Offline operation' },
    ],
  },
  streamingLayer: {
    ...streamingLayerData,
    features: [
      { name: 'Redis Streams', enabled: true, description: 'MVP event backbone' },
      { name: 'Kafka/Redpanda', enabled: false, description: 'Enterprise scale' },
      { name: 'Consumer Groups', enabled: true, description: 'Ack semantics' },
      { name: 'Event Normalizer', enabled: true, description: 'Schema normalization' },
      { name: 'Transcription Worker', enabled: true, description: 'Audio to text' },
      { name: 'Embedding Generator', enabled: true, description: 'Vector embeddings' },
      { name: 'Image/Frame Encoder', enabled: true, description: 'Visual processing' },
      { name: 'Replay Chunking', enabled: true, description: 'Segment recordings' },
      { name: 'BullMQ Queue', enabled: true, description: 'Job orchestration' },
      { name: 'Priority Lanes', enabled: true, description: 'High-value processing' },
      { name: 'Exponential Backoff', enabled: true, description: 'Smart retries' },
      { name: 'Dead-Letter Queue', enabled: true, description: 'Failed job handling' },
    ],
  },
  aiAgentSystem: {
    ...aiAgentSystemData,
    features: [
      { name: 'Model Routing Policy', enabled: true, description: 'Smart LLM selection' },
      { name: 'Cost-based Selection', enabled: true, description: 'Budget optimization' },
      { name: 'Latency-based Switching', enabled: true, description: 'Performance routing' },
      { name: 'Circuit Breakers', enabled: true, description: 'Provider failover' },
      { name: 'Audit & Provenance', enabled: true, description: 'AI call tracking' },
      { name: 'Multi-provider Blending', enabled: true, description: 'Best-of-breed AI' },
      { name: 'Session Analyst Agent', enabled: true, description: 'Session summarization' },
      { name: 'UX Vision Agent', enabled: true, description: 'Visual analysis' },
      { name: 'Causality Agent', enabled: true, description: 'Root cause detection' },
      { name: 'Error Diagnosis Agent', enabled: true, description: 'Bug identification' },
      { name: 'Performance Agent', enabled: true, description: 'Speed optimization' },
      { name: 'Growth Agent', enabled: false, description: 'Retention insights' },
      { name: 'Ticketing Agent', enabled: false, description: 'Auto Jira/GitHub' },
    ],
  },
  temporalWorkflows: {
    ...temporalWorkflowData,
    features: [
      { name: 'Session-Summary Workflow', enabled: true, description: 'Auto session analysis' },
      { name: 'UX-Scan Workflow', enabled: true, description: 'Scheduled UX audits' },
      { name: 'Causality Workflow', enabled: true, description: 'Root cause tracing' },
      { name: 'Multi-Agent Orchestration', enabled: true, description: 'Agent coordination' },
      { name: 'Reprocessing Workflow', enabled: true, description: 'DLQ retry handling' },
      { name: 'Retention Purge', enabled: true, description: 'Data lifecycle' },
      { name: 'Billing Meter Workflow', enabled: true, description: 'Usage tracking' },
      { name: 'Exactly-Once Orchestration', enabled: true, description: 'Delivery guarantee' },
      { name: 'Versioned Definitions', enabled: true, description: 'Workflow versioning' },
      { name: 'Long-Running Durable Tasks', enabled: true, description: 'Multi-day workflows' },
      { name: 'Horizontal Scaling', enabled: true, description: 'Worker auto-scale' },
      { name: 'Human-in-Loop Approvals', enabled: false, description: 'Manual review gates' },
    ],
  },
  storageLayer: {
    ...storageLayerData,
    features: [
      { name: 'Replay Blob Storage', enabled: true, description: 'Session recordings' },
      { name: 'Screenshot Storage', enabled: true, description: 'Visual snapshots' },
      { name: 'Audio File Storage', enabled: true, description: 'Voice recordings' },
      { name: 'Cold Storage Lifecycle', enabled: true, description: 'Tiered archival' },
      { name: 'Session Metadata DB', enabled: true, description: 'Core data store' },
      { name: 'User Journey Paths', enabled: true, description: 'Navigation tracking' },
      { name: 'Performance Signals', enabled: true, description: 'Speed metrics' },
      { name: 'Vector Embeddings', enabled: true, description: 'Semantic search' },
      { name: 'Semantic Search', enabled: true, description: 'Natural language query' },
      { name: 'Cross-Modal Indexing', enabled: false, description: 'Multi-format search' },
      { name: 'Journey Clustering', enabled: true, description: 'Pattern grouping' },
      { name: 'Root-Cause Grouping', enabled: true, description: 'Issue clustering' },
    ],
  },
  controlPlane: {
    ...controlPlaneData,
    features: [
      { name: 'Tenant Management', enabled: true, description: 'Multi-org support' },
      { name: 'Billing & Usage Ledger', enabled: true, description: 'Cost tracking' },
      { name: 'Feature Flags', enabled: true, description: 'Toggle features' },
      { name: 'RBAC', enabled: true, description: 'Role-based access' },
      { name: 'SSO/SAML', enabled: true, description: 'Enterprise auth' },
      { name: 'Audit Logs', enabled: true, description: 'Activity tracking' },
      { name: 'Session Explorer', enabled: true, description: 'Browse sessions' },
      { name: 'Replay Viewer', enabled: true, description: 'Watch recordings' },
      { name: 'Audio Transcript Viewer', enabled: false, description: 'Voice playback' },
      { name: 'Journey Explorer', enabled: true, description: 'Path analysis' },
      { name: 'Funnel Analytics', enabled: true, description: 'Conversion tracking' },
      { name: 'Revenue-Loss Quantification', enabled: true, description: 'Impact estimation' },
      { name: 'Custom Alert Rules', enabled: true, description: 'Configurable alerts' },
      { name: 'Real-time Anomaly Detection', enabled: true, description: 'AI-powered alerts' },
      { name: 'Auto-Runbooks', enabled: false, description: 'Automated responses' },
      { name: 'Slack/Email/PagerDuty', enabled: true, description: 'Notification channels' },
    ],
  },
  securityCompliance: {
    ...securityData,
    features: [
      { name: 'Zero Raw PII Cloud Ingest', enabled: true, description: 'Edge tokenization' },
      { name: 'Tokenization-first Pipeline', enabled: true, description: 'Privacy by design' },
      { name: 'mTLS Communication', enabled: true, description: 'Encrypted transport' },
      { name: 'VPC Peering / PrivateLink', enabled: true, description: 'Network isolation' },
      { name: 'Vault + KMS Encryption', enabled: true, description: 'Key management' },
      { name: 'SOC2 Compliance', enabled: true, description: 'Audit ready' },
      { name: 'ISO27001 Compliance', enabled: true, description: 'Security certified' },
      { name: 'GDPR/HIPAA Modes', enabled: true, description: 'Regulatory compliance' },
      { name: 'Data Residency Enforcement', enabled: true, description: 'Geographic controls' },
      { name: 'Per-tenant Encryption Keys', enabled: true, description: 'Isolated encryption' },
      { name: 'Signed Policies & Audit Trails', enabled: true, description: 'Immutable logs' },
    ],
  },
  observability: {
    ...observabilityData,
    features: [
      { name: 'WebRTC Live Replay', enabled: true, description: 'Real-time viewing' },
      { name: 'WebSocket Micro-Events', enabled: true, description: 'Live event stream' },
      { name: 'Live Anomaly Notifications', enabled: true, description: 'Instant alerts' },
      { name: 'Real-time Dashboards', enabled: true, description: 'Live metrics' },
      { name: 'OpenTelemetry Instrumentation', enabled: true, description: 'Standard tracing' },
      { name: 'Distributed Tracing', enabled: true, description: 'End-to-end visibility' },
      { name: 'Prometheus Metrics', enabled: true, description: 'Metrics collection' },
      { name: 'Grafana Dashboards', enabled: true, description: 'Visualization' },
      { name: 'Loki Logs', enabled: false, description: 'Centralized logging' },
      { name: 'Jaeger Tracing', enabled: false, description: 'Trace visualization' },
      { name: 'Performance SLOs', enabled: true, description: 'Service objectives' },
    ],
  },
  deploymentModes: {
    ...deploymentData,
    features: [
      { name: 'SaaS (Cloud)', enabled: true, description: 'Fully managed' },
      { name: 'Hybrid Deployment', enabled: true, description: 'Split architecture' },
      { name: 'Fully On-Prem', enabled: true, description: 'Self-hosted' },
      { name: 'Air-Gapped Mode', enabled: false, description: 'No internet' },
      { name: 'Single-Tenant Dedicated VPC', enabled: true, description: 'Isolated cloud' },
      { name: 'Kubernetes Helm', enabled: true, description: 'K8s deployment' },
      { name: 'VM-Based Runner', enabled: true, description: 'Traditional VMs' },
      { name: 'Windows MSI Version', enabled: true, description: 'Windows installer' },
    ],
  },
  industryModules: industryModulesData,
  costOptimization: {
    ...costOptimizationData,
    features: [
      { name: 'Token Budgeting', enabled: true, description: 'Per-tenant limits' },
      { name: 'Rate Limiting', enabled: true, description: 'Request throttling' },
      { name: 'Auto-Scaling Workers', enabled: true, description: 'Dynamic capacity' },
      { name: 'Multi-Region Architecture', enabled: true, description: 'Global distribution' },
      { name: 'Cold Storage Lifecycle', enabled: true, description: 'Tiered storage' },
      { name: 'Adaptive AI Complexity', enabled: true, description: 'Cost-aware models' },
    ],
  },
  productizedOutputs: {
    ...productizedOutputsData,
    features: [
      { name: 'AI Session Reports', enabled: true, description: 'Auto-generated insights' },
      { name: 'UX Friction Maps', enabled: true, description: 'Visual pain points' },
      { name: 'Journey Causality Graphs', enabled: true, description: 'Root cause flows' },
      { name: 'Anomaly Heatmaps', enabled: true, description: 'Issue distribution' },
      { name: 'Model Provenance Sheets', enabled: true, description: 'AI audit trail' },
      { name: 'Replay + Transcript Fusion', enabled: true, description: 'Multimodal replay' },
      { name: 'Auto-created Jira/GitHub Issues', enabled: false, description: 'Ticket automation' },
      { name: 'Export to Snowflake/BigQuery', enabled: true, description: 'Data warehouse sync' },
    ],
  },
  futureExpansions: {
    ...futureExpansionsData,
    features: [
      { name: 'LLM Synthetic User Testing', enabled: false, description: 'AI-driven testing' },
      { name: 'Autonomous UX Optimizer', enabled: false, description: 'Self-improving UI' },
      { name: 'On-Device Small-Model Agents', enabled: false, description: 'Edge AI' },
      { name: 'Federated Analytics', enabled: false, description: 'Privacy-first insights' },
      { name: 'AI-based Real User Monitoring', enabled: false, description: 'AIOps integration' },
      { name: 'Edge-Only Inference Pipelines', enabled: false, description: 'Local processing' },
      { name: 'Plug-and-Play Adapters', enabled: false, description: 'Third-party integrations' },
    ],
  },
};
