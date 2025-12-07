/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    ATLAS EDGE FUNCTIONS - COMPLETE GUIDE                   ║
 * ║                                                                            ║
 * ║  This file contains ALL Edge Functions for the ATLAS Multi-Tenancy        ║
 * ║  Enterprise Platform. Copy each section to the appropriate file in        ║
 * ║  your supabase/functions/ directory.                                       ║
 * ║                                                                            ║
 * ║  Author: CropXon ATLAS Platform                                           ║
 * ║  Version: 1.0.0                                                           ║
 * ║  Last Updated: 2025-01-07                                                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * DIRECTORY STRUCTURE:
 * ─────────────────────
 * supabase/
 * └── functions/
 *     ├── _shared/                      # Shared utilities (not deployed)
 *     │   ├── tenant-utils.ts           # Tenant context & RBAC
 *     │   ├── cors.ts                   # CORS headers
 *     │   ├── validation.ts             # Input validation
 *     │   ├── response.ts               # Standardized responses
 *     │   ├── types.ts                  # TypeScript types
 *     │   ├── email-utils.ts            # Email templates
 *     │   └── auth-utils.ts             # SSO helpers
 *     │
 *     ├── sso-google-callback/          # Google Workspace SSO
 *     │   └── index.ts
 *     ├── sso-microsoft-callback/       # Microsoft Entra ID SSO
 *     │   └── index.ts
 *     ├── sso-saml-callback/            # Generic SAML handler
 *     │   └── index.ts
 *     ├── tenant-setup/                 # New tenant provisioning
 *     │   └── index.ts
 *     ├── invite-user/                  # User invitation
 *     │   └── index.ts
 *     │
 *     ├── payroll-run/                  # Execute payroll
 *     │   └── index.ts
 *     ├── payslip-generate/             # Generate payslips
 *     │   └── index.ts
 *     ├── salary-slip-pdf/              # PDF generation
 *     │   └── index.ts
 *     │
 *     ├── employee-import/              # Bulk import
 *     │   └── index.ts
 *     ├── offboarding-trigger/          # Offboarding workflow
 *     │   └── index.ts
 *     ├── onboarding-complete/          # Complete onboarding
 *     │   └── index.ts
 *     │
 *     ├── send-notification/            # Multi-channel notifications
 *     │   └── index.ts
 *     │
 *     ├── bgv-initiate/                 # Start BGV
 *     │   └── index.ts
 *     ├── bgv-webhook/                  # BGV provider callback
 *     │   └── index.ts
 *     │
 *     ├── workflow-trigger/             # OpZenix trigger
 *     │   └── index.ts
 *     ├── workflow-execute/             # Execute workflow steps
 *     │   └── index.ts
 *     │
 *     ├── proxima-query/                # AI queries
 *     │   └── index.ts
 *     ├── insights-generate/            # Generate insights
 *     │   └── index.ts
 *     │
 *     ├── stripe-webhook/               # Payment webhooks
 *     │   └── index.ts
 *     ├── calendar-sync/                # Calendar integration
 *     │   └── index.ts
 *     └── slack-notify/                 # Slack notifications
 *         └── index.ts
 * 
 * 
 * REQUIRED SECRETS (set in Supabase Dashboard > Edge Functions > Secrets):
 * ─────────────────────────────────────────────────────────────────────────
 * - SUPABASE_URL                 # Auto-provided
 * - SUPABASE_ANON_KEY            # Auto-provided
 * - SUPABASE_SERVICE_ROLE_KEY    # Auto-provided
 * - GOOGLE_CLIENT_ID             # For Google Workspace SSO
 * - GOOGLE_CLIENT_SECRET         # For Google Workspace SSO
 * - MICROSOFT_CLIENT_ID          # For Microsoft Entra ID SSO
 * - MICROSOFT_CLIENT_SECRET      # For Microsoft Entra ID SSO
 * - RESEND_API_KEY               # For email notifications
 * - TWILIO_ACCOUNT_SID           # For SMS notifications (optional)
 * - TWILIO_AUTH_TOKEN            # For SMS notifications (optional)
 * - STRIPE_SECRET_KEY            # For payment processing
 * - STRIPE_WEBHOOK_SECRET        # For Stripe webhooks
 * - SLACK_BOT_TOKEN              # For Slack integration
 * - TEMPORAL_ADDRESS             # For Temporal workflows (optional)
 * - OPENAI_API_KEY               # For AI/Proxima features
 */


// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                            ║
// ║                      SECTION 1: SHARED UTILITIES                           ║
// ║                                                                            ║
// ║  These files go in: supabase/functions/_shared/                            ║
// ║  They are NOT deployed as functions, but imported by other functions       ║
// ║                                                                            ║
// ╚═══════════════════════════════════════════════════════════════════════════╝


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/_shared/cors.ts
// PURPOSE: CORS headers for cross-origin requests from your frontend
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CORS Headers Configuration
 * 
 * These headers allow your Edge Functions to be called from any origin.
 * In production, you may want to restrict 'Access-Control-Allow-Origin'
 * to your specific domains for security.
 * 
 * Usage:
 *   import { corsHeaders, handleCors } from "../_shared/cors.ts";
 *   
 *   if (req.method === 'OPTIONS') {
 *     return handleCors();
 *   }
 *   return new Response(data, { headers: corsHeaders });
 */

export const corsHeaders = {
  // Allow requests from any origin (use specific domain in production)
  'Access-Control-Allow-Origin': '*',
  
  // Headers that the client is allowed to send
  'Access-Control-Allow-Headers': 
    'authorization, x-client-info, apikey, content-type, x-tenant-id',
  
  // HTTP methods allowed
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  
  // How long the preflight response can be cached (1 hour)
  'Access-Control-Max-Age': '3600',
};

/**
 * Handle CORS preflight (OPTIONS) requests
 * Call this at the start of every Edge Function
 */
export function handleCors(): Response {
  return new Response(null, { 
    status: 204, // No Content
    headers: corsHeaders 
  });
}


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/_shared/types.ts
// PURPOSE: TypeScript type definitions used across all Edge Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ATLAS Type Definitions
 * 
 * These types ensure consistency across all Edge Functions.
 * Import them in your functions for type safety.
 */

// User roles within a tenant organization
export type TenantRole = 
  | 'super_admin'    // Full access to all tenant features
  | 'admin'          // Administrative access
  | 'hr_admin'       // HR module access
  | 'finance_admin'  // Finance/Payroll access
  | 'manager'        // Team management access
  | 'employee';      // Basic employee access

// Platform-level admin role (CropXon staff)
export type PlatformRole = 'platform_admin';

// User's context within the current request
export interface TenantContext {
  userId: string;           // Supabase auth user ID
  email: string;            // User's email
  tenantId: string;         // Current tenant ID
  tenantSlug: string;       // Tenant's URL slug
  role: TenantRole;         // User's role in this tenant
  isPlatformAdmin: boolean; // Is CropXon platform admin?
}

// Standard API response format
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: string;
}

// Audit log entry
export interface AuditLogEntry {
  tenantId: string;
  userId: string;
  action: string;           // e.g., 'EMPLOYEE_CREATED', 'PAYROLL_RUN'
  entityType: string;       // e.g., 'employee', 'payroll_run'
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

// Pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Employee data structure
export interface Employee {
  id: string;
  tenantId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone?: string;
  departmentId?: string;
  designationId?: string;
  managerId?: string;
  dateOfJoining: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  salaryDetails?: SalaryDetails;
}

// Salary breakdown (Indian payroll)
export interface SalaryDetails {
  basic: number;            // Basic salary
  hra: number;              // House Rent Allowance
  conveyance: number;       // Conveyance allowance
  medical: number;          // Medical allowance
  special: number;          // Special allowance
  lta: number;              // Leave Travel Allowance
  grossSalary: number;      // Total before deductions
  pfEmployee: number;       // Employee PF contribution (12%)
  pfEmployer: number;       // Employer PF contribution (12%)
  esicEmployee: number;     // Employee ESIC (0.75%)
  esicEmployer: number;     // Employer ESIC (3.25%)
  professionalTax: number;  // State professional tax
  tds: number;              // Tax Deducted at Source
  netSalary: number;        // Take-home salary
}

// Workflow definition (OpZenix)
export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  triggerType: 'manual' | 'scheduled' | 'event';
  triggerConfig: Record<string, unknown>;
  steps: WorkflowStep[];
  isActive: boolean;
}

export interface WorkflowStep {
  id: string;
  type: 'action' | 'condition' | 'delay' | 'notification';
  config: Record<string, unknown>;
  nextStepId?: string;
  onSuccess?: string;
  onFailure?: string;
}

// Notification channels
export type NotificationChannel = 'email' | 'sms' | 'push' | 'slack' | 'in_app';

export interface NotificationRequest {
  tenantId: string;
  recipientId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: NotificationChannel;
  templateId?: string;
  subject?: string;
  body: string;
  metadata?: Record<string, unknown>;
}


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/_shared/response.ts
// PURPOSE: Standardized API response helpers
// ═══════════════════════════════════════════════════════════════════════════

import { corsHeaders } from "./cors.ts";
import type { ApiResponse } from "./types.ts";

/**
 * Response Utilities
 * 
 * Use these helpers to ensure consistent API responses across all functions.
 * All responses include CORS headers and proper content-type.
 */

/**
 * Create a successful response
 * @param data - The response data
 * @param status - HTTP status code (default: 200)
 */
export function successResponse<T>(data: T, status = 200): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
  
  return new Response(JSON.stringify(body), {
    status,
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'application/json' 
    },
  });
}

/**
 * Create an error response
 * @param message - Error message
 * @param status - HTTP status code (default: 400)
 * @param code - Optional error code for client handling
 */
export function errorResponse(
  message: string, 
  status = 400, 
  code?: string
): Response {
  const body: ApiResponse = {
    success: false,
    error: message,
    code,
    timestamp: new Date().toISOString(),
  };
  
  return new Response(JSON.stringify(body), {
    status,
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'application/json' 
    },
  });
}

/**
 * Common error responses
 */
export const Errors = {
  unauthorized: () => errorResponse('Unauthorized', 401, 'UNAUTHORIZED'),
  forbidden: () => errorResponse('Forbidden', 403, 'FORBIDDEN'),
  notFound: (entity: string) => 
    errorResponse(`${entity} not found`, 404, 'NOT_FOUND'),
  badRequest: (message: string) => 
    errorResponse(message, 400, 'BAD_REQUEST'),
  internal: (message = 'Internal server error') => 
    errorResponse(message, 500, 'INTERNAL_ERROR'),
  tenantRequired: () => 
    errorResponse('Tenant ID required', 400, 'TENANT_REQUIRED'),
  insufficientRole: (required: string) => 
    errorResponse(`Requires ${required} role`, 403, 'INSUFFICIENT_ROLE'),
};


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/_shared/validation.ts
// PURPOSE: Input validation schemas using Zod-like validation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validation Utilities
 * 
 * Since Deno Edge Functions can't use npm packages directly without esm.sh,
 * we implement simple validation helpers here.
 * 
 * For complex validation, you can import Zod:
 *   import { z } from "https://esm.sh/zod@3.22.4";
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Phone validation (Indian format)
const PHONE_REGEX = /^(\+91)?[6-9]\d{9}$/;

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate an email address
 */
export function validateEmail(email: unknown): boolean {
  return typeof email === 'string' && EMAIL_REGEX.test(email);
}

/**
 * Validate a UUID
 */
export function validateUUID(uuid: unknown): boolean {
  return typeof uuid === 'string' && UUID_REGEX.test(uuid);
}

/**
 * Validate an Indian phone number
 */
export function validatePhone(phone: unknown): boolean {
  if (typeof phone !== 'string') return false;
  return PHONE_REGEX.test(phone.replace(/\s/g, ''));
}

/**
 * Validate required string field
 */
export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate string length
 */
export function validateLength(
  value: string, 
  fieldName: string, 
  min?: number, 
  max?: number
): string | null {
  if (min !== undefined && value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (max !== undefined && value.length > max) {
    return `${fieldName} must be at most ${max} characters`;
  }
  return null;
}

/**
 * Validate number range
 */
export function validateRange(
  value: number, 
  fieldName: string, 
  min?: number, 
  max?: number
): string | null {
  if (min !== undefined && value < min) {
    return `${fieldName} must be at least ${min}`;
  }
  if (max !== undefined && value > max) {
    return `${fieldName} must be at most ${max}`;
  }
  return null;
}

/**
 * Validate enum value
 */
export function validateEnum<T extends string>(
  value: unknown, 
  fieldName: string, 
  allowedValues: readonly T[]
): string | null {
  if (!allowedValues.includes(value as T)) {
    return `${fieldName} must be one of: ${allowedValues.join(', ')}`;
  }
  return null;
}

/**
 * Validate payroll run request
 */
export function validatePayrollRunRequest(data: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Invalid request body'] };
  }
  
  const { tenant_id, month, year } = data as Record<string, unknown>;
  
  if (!validateUUID(tenant_id)) {
    errors.push('Invalid tenant_id');
  }
  
  if (typeof month !== 'number' || month < 1 || month > 12) {
    errors.push('month must be between 1 and 12');
  }
  
  if (typeof year !== 'number' || year < 2020 || year > 2100) {
    errors.push('year must be between 2020 and 2100');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate employee data
 */
export function validateEmployeeData(data: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Invalid request body'] };
  }
  
  const { 
    full_name, 
    email, 
    phone, 
    department_id, 
    date_of_joining 
  } = data as Record<string, unknown>;
  
  const nameError = validateRequired(full_name, 'full_name');
  if (nameError) errors.push(nameError);
  
  if (!validateEmail(email)) {
    errors.push('Invalid email format');
  }
  
  if (phone && !validatePhone(phone)) {
    errors.push('Invalid phone format (use Indian format)');
  }
  
  if (department_id && !validateUUID(department_id)) {
    errors.push('Invalid department_id');
  }
  
  if (date_of_joining && isNaN(Date.parse(date_of_joining as string))) {
    errors.push('Invalid date_of_joining format');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate notification request
 */
export function validateNotificationRequest(data: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Invalid request body'] };
  }
  
  const { 
    tenant_id, 
    channel, 
    body,
    recipient_email,
    recipient_phone 
  } = data as Record<string, unknown>;
  
  if (!validateUUID(tenant_id)) {
    errors.push('Invalid tenant_id');
  }
  
  const validChannels = ['email', 'sms', 'push', 'slack', 'in_app'] as const;
  const channelError = validateEnum(channel, 'channel', validChannels);
  if (channelError) errors.push(channelError);
  
  const bodyError = validateRequired(body, 'body');
  if (bodyError) errors.push(bodyError);
  
  // Channel-specific validation
  if (channel === 'email' && !validateEmail(recipient_email)) {
    errors.push('Valid recipient_email required for email channel');
  }
  
  if (channel === 'sms' && !validatePhone(recipient_phone)) {
    errors.push('Valid recipient_phone required for sms channel');
  }
  
  return { valid: errors.length === 0, errors };
}


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/_shared/tenant-utils.ts
// PURPOSE: Tenant context extraction, RBAC, and audit logging
// ═══════════════════════════════════════════════════════════════════════════

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { TenantContext, TenantRole, AuditLogEntry } from "./types.ts";

/**
 * Tenant Utilities
 * 
 * This is the CORE utility file for multi-tenancy. Every Edge Function
 * that accesses tenant data MUST use these utilities.
 * 
 * Key Functions:
 * - createSupabaseClient: Creates authenticated Supabase client
 * - getTenantContext: Extracts and validates tenant access
 * - requireRole: Enforces role-based access control
 * - logAudit: Records audit trail entries
 */

/**
 * Create a Supabase client with user's auth context
 * 
 * @param authHeader - The Authorization header from the request
 * @returns Authenticated Supabase client
 * 
 * Usage:
 *   const authHeader = req.headers.get('Authorization');
 *   const supabase = createSupabaseClient(authHeader);
 */
export function createSupabaseClient(authHeader: string | null): SupabaseClient {
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }
  
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: authHeader },
      },
    }
  );
}

/**
 * Create a Supabase client with service role (admin) access
 * 
 * USE WITH CAUTION: This bypasses RLS policies!
 * Only use for operations that require elevated privileges.
 */
export function createAdminClient(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
}

/**
 * Get the authenticated user from request
 * 
 * @param supabase - Authenticated Supabase client
 * @returns User object or throws error
 */
export async function getAuthenticatedUser(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('Unauthorized: Invalid or expired token');
  }
  
  return user;
}

/**
 * Get tenant context for the current request
 * 
 * This function:
 * 1. Validates the user is authenticated
 * 2. Checks the user has access to the requested tenant
 * 3. Returns the user's role within that tenant
 * 
 * @param supabase - Authenticated Supabase client
 * @param tenantId - The tenant ID being accessed
 * @returns TenantContext with user's access details
 * 
 * Usage:
 *   const context = await getTenantContext(supabase, tenantId);
 *   console.log(`User ${context.email} has ${context.role} access`);
 */
export async function getTenantContext(
  supabase: SupabaseClient,
  tenantId: string
): Promise<TenantContext> {
  // Get authenticated user
  const user = await getAuthenticatedUser(supabase);
  
  // Check if user is platform admin (bypasses tenant check)
  const adminClient = createAdminClient();
  const { data: platformAdmin } = await adminClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .single();
  
  const isPlatformAdmin = !!platformAdmin;
  
  // Get user's membership in the requested tenant
  // Using service role to query the custom schema
  const { data: membership, error: membershipError } = await adminClient
    .rpc('atlas_core.get_user_tenant_membership', {
      _user_id: user.id,
      _tenant_id: tenantId
    });
  
  // If RPC doesn't exist yet, fall back to direct query
  if (membershipError?.code === 'PGRST202') {
    // Function doesn't exist, query directly
    const { data: directMembership, error: directError } = await adminClient
      .from('client_tenant_users')
      .select('role, tenant:client_tenants(slug)')
      .eq('user_id', user.id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (directError || !directMembership) {
      if (!isPlatformAdmin) {
        throw new Error('Access denied: Not a member of this tenant');
      }
      // Platform admins can access any tenant with admin role
      return {
        userId: user.id,
        email: user.email ?? '',
        tenantId,
        tenantSlug: '',
        role: 'super_admin',
        isPlatformAdmin: true,
      };
    }
    
    return {
      userId: user.id,
      email: user.email ?? '',
      tenantId,
      tenantSlug: (directMembership.tenant as { slug: string })?.slug ?? '',
      role: directMembership.role as TenantRole,
      isPlatformAdmin,
    };
  }
  
  if (!membership && !isPlatformAdmin) {
    throw new Error('Access denied: Not a member of this tenant');
  }
  
  return {
    userId: user.id,
    email: user.email ?? '',
    tenantId,
    tenantSlug: membership?.tenant_slug ?? '',
    role: (membership?.role ?? 'super_admin') as TenantRole,
    isPlatformAdmin,
  };
}

/**
 * Role hierarchy for permission checks
 * Higher index = more permissions
 */
const ROLE_HIERARCHY: Record<TenantRole, number> = {
  'super_admin': 100,
  'admin': 80,
  'hr_admin': 60,
  'finance_admin': 60,
  'manager': 40,
  'employee': 20,
};

/**
 * Check if user has required role or higher
 * 
 * @param context - The tenant context from getTenantContext
 * @param requiredRole - Minimum role required
 * @throws Error if user doesn't have sufficient permissions
 * 
 * Usage:
 *   await requireRole(context, 'hr_admin');  // Allows hr_admin, admin, super_admin
 */
export function requireRole(context: TenantContext, requiredRole: TenantRole): void {
  // Platform admins bypass all role checks
  if (context.isPlatformAdmin) return;
  
  const userLevel = ROLE_HIERARCHY[context.role] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
  
  if (userLevel < requiredLevel) {
    throw new Error(`Access denied: Requires ${requiredRole} role or higher`);
  }
}

/**
 * Check if user has any of the specified roles
 * 
 * @param context - The tenant context
 * @param allowedRoles - Array of acceptable roles
 * @throws Error if user doesn't have any of the roles
 */
export function requireAnyRole(
  context: TenantContext, 
  allowedRoles: TenantRole[]
): void {
  if (context.isPlatformAdmin) return;
  
  if (!allowedRoles.includes(context.role)) {
    throw new Error(
      `Access denied: Requires one of: ${allowedRoles.join(', ')}`
    );
  }
}

/**
 * Log an audit trail entry
 * 
 * Every significant action should be logged for compliance.
 * This uses the service role to ensure logs are always written.
 * 
 * @param entry - The audit log entry
 * 
 * Usage:
 *   await logAudit({
 *     tenantId: context.tenantId,
 *     userId: context.userId,
 *     action: 'EMPLOYEE_CREATED',
 *     entityType: 'employee',
 *     entityId: newEmployee.id,
 *     newValues: { name: 'John Doe', email: 'john@example.com' }
 *   });
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  const adminClient = createAdminClient();
  
  try {
    // Try custom schema first
    const { error } = await adminClient
      .from('audit_logs')
      .insert({
        tenant_id: entry.tenantId,
        user_id: entry.userId,
        action: entry.action,
        entity_type: entry.entityType,
        entity_id: entry.entityId,
        old_values: entry.oldValues,
        new_values: entry.newValues,
        ip_address: entry.ipAddress,
        user_agent: entry.userAgent,
        created_at: new Date().toISOString(),
      });
    
    if (error) {
      // Log to console if database insert fails
      console.error('Failed to write audit log:', error);
      console.log('Audit entry:', JSON.stringify(entry));
    }
  } catch (err) {
    console.error('Audit logging error:', err);
  }
}

/**
 * Extract client IP from request headers
 */
export function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    ?? req.headers.get('x-real-ip') 
    ?? 'unknown';
}

/**
 * Extract user agent from request headers
 */
export function getUserAgent(req: Request): string {
  return req.headers.get('user-agent') ?? 'unknown';
}


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/_shared/email-utils.ts
// PURPOSE: Email sending utilities using Resend
// ═══════════════════════════════════════════════════════════════════════════

import { Resend } from "npm:resend@2.0.0";

/**
 * Email Utilities
 * 
 * Uses Resend for transactional emails. Requires RESEND_API_KEY secret.
 * Get your API key from: https://resend.com/api-keys
 * 
 * IMPORTANT: You must verify your domain at https://resend.com/domains
 * before sending from custom email addresses.
 */

// Initialize Resend client
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

/**
 * Send a simple email
 */
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const resend = getResendClient();
    
    const { data, error } = await resend.emails.send({
      from: options.from ?? 'ATLAS <noreply@atlas.cropxon.com>',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      reply_to: options.replyTo,
    });
    
    if (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Email sent successfully:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Email error:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Email template: Welcome email for new employees
 */
export function getWelcomeEmailTemplate(data: {
  employeeName: string;
  companyName: string;
  loginUrl: string;
  temporaryPassword?: string;
}): { subject: string; html: string } {
  return {
    subject: `Welcome to ${data.companyName} - Your ATLAS Account`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ATLAS</title>
      </head>
      <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #005EEB 0%, #00C2FF 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
            Welcome to ATLAS
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">
            ${data.companyName}
          </p>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 18px; margin: 0 0 20px;">
            Hello <strong>${data.employeeName}</strong>,
          </p>
          
          <p style="margin: 0 0 20px;">
            Your account has been created on the ATLAS platform. You can now access your employee portal to view payslips, apply for leaves, submit expenses, and more.
          </p>
          
          ${data.temporaryPassword ? `
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px; font-weight: 600;">Your temporary password:</p>
            <code style="background: #e5e7eb; padding: 8px 16px; border-radius: 4px; font-size: 16px; letter-spacing: 1px;">
              ${data.temporaryPassword}
            </code>
            <p style="margin: 10px 0 0; font-size: 14px; color: #6b7280;">
              Please change this password after your first login.
            </p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" style="display: inline-block; background: #005EEB; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Login to ATLAS
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6b7280; margin: 0;">
            If you have any questions, please contact your HR administrator.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">
            Powered by ATLAS Enterprise Platform<br>
            © ${new Date().getFullYear()} CropXon Technologies
          </p>
        </div>
      </body>
      </html>
    `,
  };
}

/**
 * Email template: Payslip notification
 */
export function getPayslipEmailTemplate(data: {
  employeeName: string;
  month: string;
  year: number;
  netSalary: number;
  viewUrl: string;
}): { subject: string; html: string } {
  const formattedSalary = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(data.netSalary);
  
  return {
    subject: `Payslip for ${data.month} ${data.year}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payslip Notification</title>
      </head>
      <body style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0F1E3A; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Payslip Ready</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p>Hello ${data.employeeName},</p>
          
          <p>Your payslip for <strong>${data.month} ${data.year}</strong> is now available.</p>
          
          <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #166534; font-size: 14px;">Net Salary</p>
            <p style="margin: 5px 0 0; font-size: 28px; font-weight: 700; color: #15803d;">
              ${formattedSalary}
            </p>
          </div>
          
          <div style="text-align: center;">
            <a href="${data.viewUrl}" style="display: inline-block; background: #005EEB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View Payslip
            </a>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

/**
 * Email template: Password reset
 */
export function getPasswordResetEmailTemplate(data: {
  userName: string;
  resetUrl: string;
  expiresIn: string;
}): { subject: string; html: string } {
  return {
    subject: 'Reset Your ATLAS Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Password Reset</title></head>
      <body style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0F1E3A; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <p>Hello ${data.userName},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" style="background: #005EEB; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This link will expire in ${data.expiresIn}. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </body>
      </html>
    `,
  };
}


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/_shared/auth-utils.ts
// PURPOSE: SSO authentication helpers
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SSO Authentication Utilities
 * 
 * Helpers for implementing Single Sign-On with:
 * - Google Workspace
 * - Microsoft Entra ID (Azure AD)
 * - Generic SAML 2.0
 */

// Google OAuth configuration
export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

// Microsoft OAuth configuration
export interface MicrosoftOAuthConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;  // 'common' for multi-tenant or specific tenant ID
  redirectUri: string;
}

/**
 * Get Google OAuth config from environment
 */
export function getGoogleConfig(): GoogleOAuthConfig {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth not configured');
  }
  
  return {
    clientId,
    clientSecret,
    redirectUri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/sso-google-callback`,
  };
}

/**
 * Get Microsoft OAuth config from environment
 */
export function getMicrosoftConfig(): MicrosoftOAuthConfig {
  const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
  const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    throw new Error('Microsoft OAuth not configured');
  }
  
  return {
    clientId,
    clientSecret,
    tenantId: Deno.env.get('MICROSOFT_TENANT_ID') ?? 'common',
    redirectUri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/sso-microsoft-callback`,
  };
}

/**
 * Generate Google OAuth authorization URL
 */
export function getGoogleAuthUrl(state: string, tenantSlug: string): string {
  const config = getGoogleConfig();
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    state: JSON.stringify({ state, tenantSlug }),
    prompt: 'select_account',
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

/**
 * Generate Microsoft OAuth authorization URL
 */
export function getMicrosoftAuthUrl(state: string, tenantSlug: string): string {
  const config = getMicrosoftConfig();
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'openid email profile User.Read',
    state: JSON.stringify({ state, tenantSlug }),
    prompt: 'select_account',
  });
  
  return `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/authorize?${params}`;
}

/**
 * Exchange Google auth code for tokens
 */
export async function exchangeGoogleCode(code: string): Promise<{
  access_token: string;
  id_token: string;
  refresh_token?: string;
}> {
  const config = getGoogleConfig();
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google token exchange failed: ${error}`);
  }
  
  return response.json();
}

/**
 * Exchange Microsoft auth code for tokens
 */
export async function exchangeMicrosoftCode(code: string): Promise<{
  access_token: string;
  id_token: string;
  refresh_token?: string;
}> {
  const config = getMicrosoftConfig();
  
  const response = await fetch(
    `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
        scope: 'openid email profile User.Read',
      }),
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Microsoft token exchange failed: ${error}`);
  }
  
  return response.json();
}

/**
 * Get Google user info from access token
 */
export async function getGoogleUserInfo(accessToken: string): Promise<{
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  hd?: string;  // Hosted domain (for Google Workspace)
}> {
  const response = await fetch(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to get Google user info');
  }
  
  return response.json();
}

/**
 * Get Microsoft user info from access token
 */
export async function getMicrosoftUserInfo(accessToken: string): Promise<{
  id: string;
  mail: string;
  displayName: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
}> {
  const response = await fetch(
    'https://graph.microsoft.com/v1.0/me',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to get Microsoft user info');
  }
  
  return response.json();
}

/**
 * Decode JWT token (without verification - for reading claims only)
 * For production, use proper JWT verification
 */
export function decodeJwt(token: string): Record<string, unknown> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }
  
  const payload = parts[1];
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decoded);
}


// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                            ║
// ║                    SECTION 2: SSO AUTHENTICATION FUNCTIONS                 ║
// ║                                                                            ║
// ╚═══════════════════════════════════════════════════════════════════════════╝


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/sso-google-callback/index.ts
// PURPOSE: Handle Google Workspace OAuth callback
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Google Workspace SSO Callback Handler
 * 
 * This function handles the OAuth callback from Google after a user
 * authenticates with their Google Workspace account.
 * 
 * Flow:
 * 1. User clicks "Login with Google" on your tenant login page
 * 2. User is redirected to Google to authenticate
 * 3. Google redirects back to this function with an auth code
 * 4. This function exchanges the code for tokens
 * 5. Gets user info and creates/updates the user in Supabase Auth
 * 6. Redirects user to the tenant portal
 * 
 * Required Secrets:
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// In actual implementation, import from _shared:
// import { corsHeaders } from "../_shared/cors.ts";
// import { exchangeGoogleCode, getGoogleUserInfo } from "../_shared/auth-utils.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const stateParam = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('Google OAuth error:', error);
      return redirectToLogin('Authentication cancelled or failed');
    }

    if (!code || !stateParam) {
      return redirectToLogin('Missing authorization code');
    }

    // Parse state parameter
    let state: { state: string; tenantSlug: string };
    try {
      state = JSON.parse(stateParam);
    } catch {
      return redirectToLogin('Invalid state parameter');
    }

    // Get OAuth configuration
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    
    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth not configured');
    }

    const redirectUri = `${supabaseUrl}/functions/v1/sso-google-callback`;

    // Exchange authorization code for tokens
    console.log('Exchanging Google auth code for tokens...');
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return redirectToLogin('Failed to authenticate with Google');
    }

    const tokens = await tokenResponse.json();
    console.log('Token exchange successful');

    // Get user info from Google
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info from Google');
    }

    const googleUser = await userInfoResponse.json();
    console.log('Google user info:', {
      email: googleUser.email,
      name: googleUser.name,
      hd: googleUser.hd, // Hosted domain for Google Workspace
    });

    // Create Supabase admin client
    const supabase = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find the tenant by slug
    const { data: tenant, error: tenantError } = await supabase
      .from('client_tenants')
      .select('id, name, settings')
      .eq('slug', state.tenantSlug)
      .single();

    if (tenantError || !tenant) {
      console.error('Tenant not found:', state.tenantSlug);
      return redirectToLogin('Organization not found');
    }

    // Check if tenant has Google SSO enabled and domain restriction
    const tenantSettings = tenant.settings as Record<string, unknown> || {};
    const ssoConfig = tenantSettings.sso as Record<string, unknown> || {};
    
    if (ssoConfig.google_enabled !== true) {
      return redirectToLogin('Google SSO not enabled for this organization');
    }

    // Optionally verify Google Workspace domain
    const allowedDomain = ssoConfig.google_domain as string;
    if (allowedDomain && googleUser.hd !== allowedDomain) {
      console.error(`Domain mismatch: expected ${allowedDomain}, got ${googleUser.hd}`);
      return redirectToLogin('Email domain not allowed for this organization');
    }

    // Check if user exists in this tenant
    const { data: existingMembership } = await supabase
      .from('client_tenant_users')
      .select('id, user_id, role')
      .eq('tenant_id', tenant.id)
      .eq('user_id', googleUser.sub) // Note: Need to map Google ID to Supabase user
      .single();

    let userId: string;

    if (!existingMembership) {
      // Check if user exists in Supabase Auth by email
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(
        (u) => u.email === googleUser.email
      );

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user in Supabase Auth
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: googleUser.email,
          email_confirm: true, // Google has already verified the email
          user_metadata: {
            full_name: googleUser.name,
            avatar_url: googleUser.picture,
            provider: 'google',
            google_id: googleUser.sub,
          },
        });

        if (createError || !newUser.user) {
          console.error('Failed to create user:', createError);
          throw new Error('Failed to create user account');
        }

        userId = newUser.user.id;
        console.log('Created new user:', userId);
      }

      // Check if user is pre-approved (invited) for this tenant
      const { data: invitation } = await supabase
        .from('tenant_invitations')
        .select('role')
        .eq('tenant_id', tenant.id)
        .eq('email', googleUser.email)
        .eq('status', 'pending')
        .single();

      if (!invitation && !ssoConfig.auto_provision) {
        return redirectToLogin('You are not authorized to access this organization');
      }

      // Add user to tenant
      const { error: membershipError } = await supabase
        .from('client_tenant_users')
        .insert({
          tenant_id: tenant.id,
          user_id: userId,
          role: invitation?.role || 'employee',
        });

      if (membershipError) {
        console.error('Failed to add user to tenant:', membershipError);
        throw new Error('Failed to add user to organization');
      }

      // Update invitation status if exists
      if (invitation) {
        await supabase
          .from('tenant_invitations')
          .update({ status: 'accepted', accepted_at: new Date().toISOString() })
          .eq('tenant_id', tenant.id)
          .eq('email', googleUser.email);
      }

      console.log('Added user to tenant:', tenant.id);
    } else {
      userId = existingMembership.user_id;
    }

    // Generate a session token for the user
    // In production, you'd use Supabase's signInWithIdToken or custom JWT
    const { data: session, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: googleUser.email,
      options: {
        redirectTo: `${getAppUrl()}/tenant/${state.tenantSlug}/dashboard`,
      },
    });

    if (sessionError || !session) {
      console.error('Failed to create session:', sessionError);
      throw new Error('Failed to create session');
    }

    // Log the SSO login
    await supabase.from('audit_logs').insert({
      tenant_id: tenant.id,
      user_id: userId,
      action: 'SSO_LOGIN_GOOGLE',
      entity_type: 'auth',
      new_values: {
        email: googleUser.email,
        provider: 'google',
        google_id: googleUser.sub,
      },
    });

    // Redirect to the magic link (this will set the session cookie)
    const redirectUrl = session.properties?.action_link || 
      `${getAppUrl()}/tenant/${state.tenantSlug}/dashboard`;
    
    return Response.redirect(redirectUrl, 302);

  } catch (error) {
    console.error('Google SSO error:', error);
    return redirectToLogin(error instanceof Error ? error.message : 'Authentication failed');
  }
});

/**
 * Get the frontend app URL
 */
function getAppUrl(): string {
  // In production, use your actual domain
  return Deno.env.get('APP_URL') || 'https://your-app.lovable.app';
}

/**
 * Redirect to login page with error message
 */
function redirectToLogin(error: string): Response {
  const appUrl = getAppUrl();
  const errorParam = encodeURIComponent(error);
  return Response.redirect(`${appUrl}/tenant/login?error=${errorParam}`, 302);
}


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/sso-microsoft-callback/index.ts
// PURPOSE: Handle Microsoft Entra ID (Azure AD) OAuth callback
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Microsoft Entra ID SSO Callback Handler
 * 
 * Handles OAuth callback from Microsoft after user authenticates
 * with their Microsoft 365 / Entra ID account.
 * 
 * Required Secrets:
 * - MICROSOFT_CLIENT_ID
 * - MICROSOFT_CLIENT_SECRET
 * - MICROSOFT_TENANT_ID (optional - 'common' for multi-tenant)
 */

import { serve as serveMicrosoft } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient as createMicrosoftClient } from "https://esm.sh/@supabase/supabase-js@2";

const microsoftCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serveMicrosoft(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: microsoftCorsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const stateParam = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    if (error) {
      console.error('Microsoft OAuth error:', error, errorDescription);
      return redirectToMicrosoftLogin(errorDescription || 'Authentication failed');
    }

    if (!code || !stateParam) {
      return redirectToMicrosoftLogin('Missing authorization code');
    }

    // Parse state
    let state: { state: string; tenantSlug: string };
    try {
      state = JSON.parse(stateParam);
    } catch {
      return redirectToMicrosoftLogin('Invalid state parameter');
    }

    // Get OAuth configuration
    const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
    const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
    const tenantId = Deno.env.get('MICROSOFT_TENANT_ID') || 'common';
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';

    if (!clientId || !clientSecret) {
      throw new Error('Microsoft OAuth not configured');
    }

    const redirectUri = `${supabaseUrl}/functions/v1/sso-microsoft-callback`;

    // Exchange code for tokens
    console.log('Exchanging Microsoft auth code for tokens...');

    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          scope: 'openid email profile User.Read',
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return redirectToMicrosoftLogin('Failed to authenticate with Microsoft');
    }

    const tokens = await tokenResponse.json();
    console.log('Microsoft token exchange successful');

    // Get user info from Microsoft Graph
    const userInfoResponse = await fetch(
      'https://graph.microsoft.com/v1.0/me',
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info from Microsoft');
    }

    const msUser = await userInfoResponse.json();
    console.log('Microsoft user info:', {
      id: msUser.id,
      mail: msUser.mail,
      displayName: msUser.displayName,
      userPrincipalName: msUser.userPrincipalName,
    });

    // Get user's email (prefer mail, fallback to userPrincipalName)
    const userEmail = msUser.mail || msUser.userPrincipalName;
    if (!userEmail) {
      throw new Error('No email found in Microsoft profile');
    }

    // Create Supabase admin client
    const supabase = createMicrosoftClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find the tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('client_tenants')
      .select('id, name, settings')
      .eq('slug', state.tenantSlug)
      .single();

    if (tenantError || !tenant) {
      return redirectToMicrosoftLogin('Organization not found');
    }

    // Check SSO configuration
    const tenantSettings = tenant.settings as Record<string, unknown> || {};
    const ssoConfig = tenantSettings.sso as Record<string, unknown> || {};

    if (ssoConfig.microsoft_enabled !== true) {
      return redirectToMicrosoftLogin('Microsoft SSO not enabled for this organization');
    }

    // Optionally verify Azure AD tenant
    const allowedTenantId = ssoConfig.microsoft_tenant_id as string;
    if (allowedTenantId) {
      // Decode ID token to get tenant ID
      const idTokenParts = tokens.id_token.split('.');
      const idTokenPayload = JSON.parse(atob(idTokenParts[1]));
      
      if (idTokenPayload.tid !== allowedTenantId) {
        console.error(`Tenant mismatch: expected ${allowedTenantId}, got ${idTokenPayload.tid}`);
        return redirectToMicrosoftLogin('Microsoft tenant not allowed');
      }
    }

    // Check if user exists in Supabase
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    let existingUser = existingUsers?.users?.find(u => u.email === userEmail);
    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      
      // Update user metadata
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...existingUser.user_metadata,
          full_name: msUser.displayName,
          microsoft_id: msUser.id,
          job_title: msUser.jobTitle,
          department: msUser.department,
        },
      });
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: userEmail,
        email_confirm: true,
        user_metadata: {
          full_name: msUser.displayName,
          provider: 'microsoft',
          microsoft_id: msUser.id,
          job_title: msUser.jobTitle,
          department: msUser.department,
        },
      });

      if (createError || !newUser.user) {
        throw new Error('Failed to create user account');
      }

      userId = newUser.user.id;
      console.log('Created new user from Microsoft SSO:', userId);
    }

    // Check tenant membership
    const { data: membership } = await supabase
      .from('client_tenant_users')
      .select('id, role')
      .eq('tenant_id', tenant.id)
      .eq('user_id', userId)
      .single();

    if (!membership) {
      // Check for invitation
      const { data: invitation } = await supabase
        .from('tenant_invitations')
        .select('role')
        .eq('tenant_id', tenant.id)
        .eq('email', userEmail)
        .eq('status', 'pending')
        .single();

      if (!invitation && !ssoConfig.auto_provision) {
        return redirectToMicrosoftLogin('You are not authorized to access this organization');
      }

      // Add user to tenant
      await supabase.from('client_tenant_users').insert({
        tenant_id: tenant.id,
        user_id: userId,
        role: invitation?.role || 'employee',
      });

      if (invitation) {
        await supabase
          .from('tenant_invitations')
          .update({ status: 'accepted', accepted_at: new Date().toISOString() })
          .eq('tenant_id', tenant.id)
          .eq('email', userEmail);
      }
    }

    // Generate session
    const { data: session } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
      options: {
        redirectTo: `${getMicrosoftAppUrl()}/tenant/${state.tenantSlug}/dashboard`,
      },
    });

    // Log SSO login
    await supabase.from('audit_logs').insert({
      tenant_id: tenant.id,
      user_id: userId,
      action: 'SSO_LOGIN_MICROSOFT',
      entity_type: 'auth',
      new_values: {
        email: userEmail,
        provider: 'microsoft',
        microsoft_id: msUser.id,
      },
    });

    const redirectUrl = session?.properties?.action_link ||
      `${getMicrosoftAppUrl()}/tenant/${state.tenantSlug}/dashboard`;

    return Response.redirect(redirectUrl, 302);

  } catch (error) {
    console.error('Microsoft SSO error:', error);
    return redirectToMicrosoftLogin(
      error instanceof Error ? error.message : 'Authentication failed'
    );
  }
});

function getMicrosoftAppUrl(): string {
  return Deno.env.get('APP_URL') || 'https://your-app.lovable.app';
}

function redirectToMicrosoftLogin(error: string): Response {
  const appUrl = getMicrosoftAppUrl();
  return Response.redirect(
    `${appUrl}/tenant/login?error=${encodeURIComponent(error)}`,
    302
  );
}


// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                            ║
// ║                       SECTION 3: PAYROLL FUNCTIONS                         ║
// ║                                                                            ║
// ╚═══════════════════════════════════════════════════════════════════════════╝


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/payroll-run/index.ts
// PURPOSE: Execute monthly payroll for all employees in a tenant
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Payroll Run Edge Function
 * 
 * Executes monthly payroll for a tenant organization.
 * Calculates salaries, deductions (PF, ESIC, Professional Tax, TDS),
 * and generates payroll items for each active employee.
 * 
 * Indian Payroll Components:
 * - Basic: 40-50% of CTC
 * - HRA: 40-50% of Basic
 * - Conveyance: ₹1,600/month (tax exempt up to ₹19,200/year)
 * - Medical: ₹1,250/month
 * - Special Allowance: Remaining amount
 * 
 * Statutory Deductions:
 * - PF: 12% of Basic (both employee and employer)
 * - ESIC: 0.75% employee, 3.25% employer (if gross < ₹21,000)
 * - Professional Tax: State-specific (max ₹200/month)
 * - TDS: Based on income tax slabs
 * 
 * Required Role: finance_admin or higher
 */

import { serve as servePayroll } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient as createPayrollClient } from "https://esm.sh/@supabase/supabase-js@2";

const payrollCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Indian payroll configuration
const PAYROLL_CONFIG = {
  PF_RATE: 0.12,                    // 12% of Basic
  PF_WAGE_CEILING: 15000,           // Max Basic for PF calculation
  ESIC_EMPLOYEE_RATE: 0.0075,       // 0.75% of Gross
  ESIC_EMPLOYER_RATE: 0.0325,       // 3.25% of Gross
  ESIC_WAGE_CEILING: 21000,         // ESIC applicable if Gross < 21000
  PROFESSIONAL_TAX_MAX: 200,        // Max PT per month
  LTA_PERCENTAGE: 0.05,             // 5% of Basic as LTA
};

// Month names for display
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

servePayroll(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: payrollCorsHeaders });
  }

  const startTime = Date.now();
  console.log('=== PAYROLL RUN STARTED ===');

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return errorPayrollResponse('Missing authorization header', 401);
    }

    // Create Supabase client with user context
    const supabase = createPayrollClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return errorPayrollResponse('Unauthorized', 401);
    }

    // Parse request body
    const { tenant_id, month, year, dry_run = false } = await req.json();

    // Validate input
    if (!tenant_id || !month || !year) {
      return errorPayrollResponse('tenant_id, month, and year are required', 400);
    }

    if (month < 1 || month > 12) {
      return errorPayrollResponse('month must be between 1 and 12', 400);
    }

    console.log(`Processing payroll for: ${MONTH_NAMES[month - 1]} ${year}, Tenant: ${tenant_id}`);

    // Create admin client for data access
    const adminClient = createPayrollClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user has access to this tenant with appropriate role
    const { data: membership, error: membershipError } = await adminClient
      .from('client_tenant_users')
      .select('role')
      .eq('user_id', user.id)
      .eq('tenant_id', tenant_id)
      .single();

    if (membershipError || !membership) {
      return errorPayrollResponse('Access denied: Not a member of this tenant', 403);
    }

    const allowedRoles = ['super_admin', 'admin', 'finance_admin'];
    if (!allowedRoles.includes(membership.role)) {
      return errorPayrollResponse(
        `Access denied: Requires one of: ${allowedRoles.join(', ')}`,
        403
      );
    }

    console.log(`User ${user.email} has ${membership.role} role - access granted`);

    // Check for existing payroll run for this month
    const { data: existingRun } = await adminClient
      .from('pay_payroll_runs')
      .select('id, status')
      .eq('tenant_id', tenant_id)
      .eq('cycle_month', month)
      .eq('cycle_year', year)
      .single();

    if (existingRun) {
      return errorPayrollResponse(
        `Payroll already exists for ${MONTH_NAMES[month - 1]} ${year} (Status: ${existingRun.status})`,
        400
      );
    }

    // Get all active employees for this tenant
    // Note: In the actual implementation, query the atlas_hr.hr_employees table
    const { data: employees, error: employeesError } = await adminClient
      .from('hr_employees')
      .select(`
        id,
        employee_code,
        full_name,
        email,
        department_id,
        designation_id,
        date_of_joining,
        salary_structure
      `)
      .eq('tenant_id', tenant_id)
      .eq('status', 'active');

    if (employeesError) {
      console.error('Error fetching employees:', employeesError);
      throw new Error('Failed to fetch employees');
    }

    if (!employees || employees.length === 0) {
      return errorPayrollResponse('No active employees found for payroll', 400);
    }

    console.log(`Found ${employees.length} active employees`);

    // If dry run, calculate but don't save
    if (dry_run) {
      const preview = employees.map(emp => calculateSalary(emp));
      const totals = calculatePayrollTotals(preview);

      return successPayrollResponse({
        dry_run: true,
        month: MONTH_NAMES[month - 1],
        year,
        employee_count: employees.length,
        totals,
        items: preview,
      });
    }

    // Create payroll run record
    const { data: payrollRun, error: runError } = await adminClient
      .from('pay_payroll_runs')
      .insert({
        tenant_id,
        cycle_month: month,
        cycle_year: year,
        status: 'processing',
        total_employees: employees.length,
        created_by: user.id,
        processing_started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (runError || !payrollRun) {
      console.error('Failed to create payroll run:', runError);
      throw new Error('Failed to initialize payroll run');
    }

    console.log(`Created payroll run: ${payrollRun.id}`);

    // Process each employee
    const payrollItems = [];
    const errors = [];

    for (const employee of employees) {
      try {
        const salaryDetails = calculateSalary(employee);
        
        payrollItems.push({
          tenant_id,
          payroll_run_id: payrollRun.id,
          employee_id: employee.id,
          employee_code: employee.employee_code,
          employee_name: employee.full_name,
          
          // Earnings
          basic: salaryDetails.basic,
          hra: salaryDetails.hra,
          conveyance: salaryDetails.conveyance,
          medical: salaryDetails.medical,
          special_allowance: salaryDetails.special,
          lta: salaryDetails.lta,
          gross_salary: salaryDetails.grossSalary,
          
          // Deductions
          pf_employee: salaryDetails.pfEmployee,
          pf_employer: salaryDetails.pfEmployer,
          esic_employee: salaryDetails.esicEmployee,
          esic_employer: salaryDetails.esicEmployer,
          professional_tax: salaryDetails.professionalTax,
          tds: salaryDetails.tds,
          total_deductions: salaryDetails.totalDeductions,
          
          // Net
          net_salary: salaryDetails.netSalary,
          status: 'calculated',
        });

        console.log(`Processed: ${employee.full_name} - Net: ₹${salaryDetails.netSalary}`);

      } catch (err) {
        console.error(`Error processing ${employee.full_name}:`, err);
        errors.push({
          employee_id: employee.id,
          employee_name: employee.full_name,
          error: String(err),
        });
      }
    }

    // Bulk insert payroll items
    if (payrollItems.length > 0) {
      const { error: itemsError } = await adminClient
        .from('pay_payroll_items')
        .insert(payrollItems);

      if (itemsError) {
        console.error('Failed to insert payroll items:', itemsError);
        
        // Update run status to failed
        await adminClient
          .from('pay_payroll_runs')
          .update({ status: 'failed', error_message: itemsError.message })
          .eq('id', payrollRun.id);
        
        throw new Error('Failed to save payroll items');
      }
    }

    // Calculate totals
    const totals = calculatePayrollTotals(payrollItems);

    // Update payroll run with totals
    const { error: updateError } = await adminClient
      .from('pay_payroll_runs')
      .update({
        status: errors.length > 0 ? 'completed_with_errors' : 'completed',
        total_gross: totals.totalGross,
        total_deductions: totals.totalDeductions,
        total_net: totals.totalNet,
        total_pf: totals.totalPF,
        total_esic: totals.totalESIC,
        total_pt: totals.totalPT,
        total_tds: totals.totalTDS,
        processed_count: payrollItems.length,
        error_count: errors.length,
        processing_completed_at: new Date().toISOString(),
      })
      .eq('id', payrollRun.id);

    if (updateError) {
      console.error('Failed to update payroll run:', updateError);
    }

    // Log audit entry
    await adminClient.from('audit_logs').insert({
      tenant_id,
      user_id: user.id,
      action: 'PAYROLL_RUN_COMPLETED',
      entity_type: 'payroll_run',
      entity_id: payrollRun.id,
      new_values: {
        month: MONTH_NAMES[month - 1],
        year,
        employee_count: employees.length,
        total_gross: totals.totalGross,
        total_net: totals.totalNet,
      },
    });

    const duration = Date.now() - startTime;
    console.log(`=== PAYROLL RUN COMPLETED in ${duration}ms ===`);

    return successPayrollResponse({
      payroll_run_id: payrollRun.id,
      month: MONTH_NAMES[month - 1],
      year,
      status: errors.length > 0 ? 'completed_with_errors' : 'completed',
      processed: payrollItems.length,
      errors: errors.length,
      totals,
      error_details: errors.length > 0 ? errors : undefined,
      duration_ms: duration,
    });

  } catch (error) {
    console.error('Payroll run error:', error);
    return errorPayrollResponse(
      error instanceof Error ? error.message : 'Payroll processing failed',
      500
    );
  }
});

/**
 * Calculate salary for an employee
 */
function calculateSalary(employee: Record<string, unknown>): Record<string, number> {
  // Get salary structure or use defaults
  const salary = employee.salary_structure as Record<string, number> || {};
  const ctc = salary.ctc || salary.gross || 50000; // Default CTC
  
  // Calculate components based on CTC
  const basic = salary.basic || Math.round(ctc * 0.40);
  const hra = salary.hra || Math.round(basic * 0.50);
  const conveyance = salary.conveyance || 1600;
  const medical = salary.medical || 1250;
  const lta = salary.lta || Math.round(basic * PAYROLL_CONFIG.LTA_PERCENTAGE);
  const special = ctc - basic - hra - conveyance - medical - lta;
  
  const grossSalary = basic + hra + conveyance + medical + lta + Math.max(0, special);
  
  // Calculate deductions
  const pfWage = Math.min(basic, PAYROLL_CONFIG.PF_WAGE_CEILING);
  const pfEmployee = Math.round(pfWage * PAYROLL_CONFIG.PF_RATE);
  const pfEmployer = Math.round(pfWage * PAYROLL_CONFIG.PF_RATE);
  
  // ESIC (only if gross < 21,000)
  let esicEmployee = 0;
  let esicEmployer = 0;
  if (grossSalary <= PAYROLL_CONFIG.ESIC_WAGE_CEILING) {
    esicEmployee = Math.round(grossSalary * PAYROLL_CONFIG.ESIC_EMPLOYEE_RATE);
    esicEmployer = Math.round(grossSalary * PAYROLL_CONFIG.ESIC_EMPLOYER_RATE);
  }
  
  // Professional Tax (simplified - varies by state)
  let professionalTax = 0;
  if (grossSalary > 15000) {
    professionalTax = PAYROLL_CONFIG.PROFESSIONAL_TAX_MAX;
  } else if (grossSalary > 10000) {
    professionalTax = 150;
  }
  
  // TDS (simplified calculation - use proper tax slabs in production)
  const annualIncome = grossSalary * 12;
  let tds = 0;
  if (annualIncome > 1000000) {
    tds = Math.round((annualIncome * 0.30 - 125000) / 12);
  } else if (annualIncome > 500000) {
    tds = Math.round((annualIncome * 0.20 - 75000) / 12);
  } else if (annualIncome > 250000) {
    tds = Math.round((annualIncome * 0.05) / 12);
  }
  
  const totalDeductions = pfEmployee + esicEmployee + professionalTax + tds;
  const netSalary = grossSalary - totalDeductions;
  
  return {
    basic,
    hra,
    conveyance,
    medical,
    lta,
    special: Math.max(0, special),
    grossSalary,
    pfEmployee,
    pfEmployer,
    esicEmployee,
    esicEmployer,
    professionalTax,
    tds,
    totalDeductions,
    netSalary,
  };
}

/**
 * Calculate payroll totals
 */
function calculatePayrollTotals(items: Record<string, number>[]): Record<string, number> {
  return items.reduce((totals, item) => ({
    totalGross: (totals.totalGross || 0) + (item.grossSalary || item.gross_salary || 0),
    totalDeductions: (totals.totalDeductions || 0) + (item.totalDeductions || item.total_deductions || 0),
    totalNet: (totals.totalNet || 0) + (item.netSalary || item.net_salary || 0),
    totalPF: (totals.totalPF || 0) + (item.pfEmployee || item.pf_employee || 0) + (item.pfEmployer || item.pf_employer || 0),
    totalESIC: (totals.totalESIC || 0) + (item.esicEmployee || item.esic_employee || 0) + (item.esicEmployer || item.esic_employer || 0),
    totalPT: (totals.totalPT || 0) + (item.professionalTax || item.professional_tax || 0),
    totalTDS: (totals.totalTDS || 0) + (item.tds || 0),
  }), {} as Record<string, number>);
}

function successPayrollResponse(data: unknown): Response {
  return new Response(
    JSON.stringify({ success: true, data, timestamp: new Date().toISOString() }),
    { headers: { ...payrollCorsHeaders, 'Content-Type': 'application/json' } }
  );
}

function errorPayrollResponse(message: string, status = 400): Response {
  return new Response(
    JSON.stringify({ success: false, error: message, timestamp: new Date().toISOString() }),
    { status, headers: { ...payrollCorsHeaders, 'Content-Type': 'application/json' } }
  );
}


// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                            ║
// ║                    SECTION 4: NOTIFICATION FUNCTIONS                       ║
// ║                                                                            ║
// ╚═══════════════════════════════════════════════════════════════════════════╝


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/send-notification/index.ts
// PURPOSE: Multi-channel notification sending (email, SMS, push, Slack)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Send Notification Edge Function
 * 
 * Sends notifications through multiple channels:
 * - email: Using Resend API
 * - sms: Using Twilio API
 * - slack: Using Slack Bot API
 * - in_app: Saved to database for in-app display
 * - push: Web push notifications (future)
 * 
 * Required Secrets:
 * - RESEND_API_KEY (for email)
 * - TWILIO_ACCOUNT_SID & TWILIO_AUTH_TOKEN (for SMS)
 * - SLACK_BOT_TOKEN (for Slack)
 */

import { serve as serveNotification } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient as createNotificationClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const notificationCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serveNotification(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: notificationCorsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return notificationErrorResponse('Missing authorization header', 401);
    }

    // Parse request
    const {
      tenant_id,
      channel,          // 'email' | 'sms' | 'slack' | 'in_app'
      recipient_id,     // User ID (for in_app)
      recipient_email,  // Email address
      recipient_phone,  // Phone number (for SMS)
      slack_channel,    // Slack channel ID
      subject,          // Email subject
      body,             // Message body (plain text or HTML)
      template_id,      // Optional template ID
      template_data,    // Template variables
      priority,         // 'low' | 'normal' | 'high' | 'urgent'
      metadata,         // Additional data
    } = await req.json();

    // Validate required fields
    if (!tenant_id) {
      return notificationErrorResponse('tenant_id is required', 400);
    }
    if (!channel) {
      return notificationErrorResponse('channel is required', 400);
    }
    if (!body && !template_id) {
      return notificationErrorResponse('body or template_id is required', 400);
    }

    // Create admin client
    const adminClient = createNotificationClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Process message body (apply template if needed)
    let finalBody = body;
    let finalSubject = subject;
    
    if (template_id) {
      const { data: template } = await adminClient
        .from('notification_templates')
        .select('subject, body, channel')
        .eq('id', template_id)
        .single();
      
      if (template) {
        finalBody = applyTemplate(template.body, template_data || {});
        finalSubject = applyTemplate(template.subject || subject, template_data || {});
      }
    }

    let result: { success: boolean; messageId?: string; error?: string };

    // Route to appropriate channel handler
    switch (channel) {
      case 'email':
        result = await sendEmailNotification({
          to: recipient_email,
          subject: finalSubject || 'Notification',
          html: finalBody,
        });
        break;

      case 'sms':
        result = await sendSmsNotification({
          to: recipient_phone,
          body: finalBody,
        });
        break;

      case 'slack':
        result = await sendSlackNotification({
          channel: slack_channel,
          text: finalBody,
        });
        break;

      case 'in_app':
        result = await saveInAppNotification(adminClient, {
          tenant_id,
          user_id: recipient_id,
          title: finalSubject || 'Notification',
          body: finalBody,
          priority: priority || 'normal',
          metadata,
        });
        break;

      default:
        return notificationErrorResponse(`Unknown channel: ${channel}`, 400);
    }

    // Log notification
    await adminClient.from('notification_logs').insert({
      tenant_id,
      channel,
      recipient_id,
      recipient_email,
      recipient_phone,
      subject: finalSubject,
      body: finalBody,
      status: result.success ? 'sent' : 'failed',
      error_message: result.error,
      message_id: result.messageId,
      priority,
      metadata,
    });

    if (!result.success) {
      return notificationErrorResponse(result.error || 'Failed to send notification', 500);
    }

    return notificationSuccessResponse({
      channel,
      message_id: result.messageId,
      status: 'sent',
    });

  } catch (error) {
    console.error('Notification error:', error);
    return notificationErrorResponse(
      error instanceof Error ? error.message : 'Notification failed',
      500
    );
  }
});

/**
 * Send email using Resend
 */
async function sendEmailNotification(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    return { success: false, error: 'Email not configured' };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: 'ATLAS <notifications@atlas.cropxon.com>',
      to: [options.to],
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Send SMS using Twilio
 */
async function sendSmsNotification(options: {
  to: string;
  body: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!accountSid || !authToken || !fromNumber) {
    return { success: false, error: 'SMS not configured' };
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: options.to,
          From: fromNumber,
          Body: options.body,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message };
    }

    return { success: true, messageId: data.sid };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Send Slack message
 */
async function sendSlackNotification(options: {
  channel: string;
  text: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const botToken = Deno.env.get('SLACK_BOT_TOKEN');
  if (!botToken) {
    return { success: false, error: 'Slack not configured' };
  }

  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: options.channel,
        text: options.text,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, messageId: data.ts };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Save in-app notification to database
 */
async function saveInAppNotification(
  supabase: ReturnType<typeof createNotificationClient>,
  options: {
    tenant_id: string;
    user_id: string;
    title: string;
    body: string;
    priority: string;
    metadata?: Record<string, unknown>;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('user_notifications')
      .insert({
        tenant_id: options.tenant_id,
        user_id: options.user_id,
        title: options.title,
        body: options.body,
        priority: options.priority,
        is_read: false,
        metadata: options.metadata,
      })
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Apply template variables
 */
function applyTemplate(
  template: string,
  data: Record<string, unknown>
): string {
  let result = template;
  
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, String(value ?? ''));
  }
  
  return result;
}

function notificationSuccessResponse(data: unknown): Response {
  return new Response(
    JSON.stringify({ success: true, data, timestamp: new Date().toISOString() }),
    { headers: { ...notificationCorsHeaders, 'Content-Type': 'application/json' } }
  );
}

function notificationErrorResponse(message: string, status = 400): Response {
  return new Response(
    JSON.stringify({ success: false, error: message, timestamp: new Date().toISOString() }),
    { status, headers: { ...notificationCorsHeaders, 'Content-Type': 'application/json' } }
  );
}


// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                            ║
// ║                      SECTION 5: WORKFLOW AUTOMATION                        ║
// ║                        (OpZenix Integration)                               ║
// ║                                                                            ║
// ╚═══════════════════════════════════════════════════════════════════════════╝


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/workflow-trigger/index.ts
// PURPOSE: Trigger and execute OpZenix automation workflows
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Workflow Trigger Edge Function
 * 
 * Triggers automation workflows defined in the OpZenix module.
 * 
 * Workflow Types:
 * - manual: Triggered by user action
 * - scheduled: Triggered by cron schedule (use pg_cron or external scheduler)
 * - event: Triggered by database/application events
 * 
 * Step Types:
 * - action: Execute an operation (send email, create record, etc.)
 * - condition: Branch based on conditions
 * - delay: Wait for specified duration
 * - notification: Send notification
 * - integration: Call external API
 * 
 * For production with long-running workflows, integrate with Temporal:
 * https://temporal.io/
 */

import { serve as serveWorkflow } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient as createWorkflowClient } from "https://esm.sh/@supabase/supabase-js@2";

const workflowCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serveWorkflow(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: workflowCorsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return workflowErrorResponse('Missing authorization header', 401);
    }

    const {
      tenant_id,
      workflow_id,
      trigger_type,   // 'manual' | 'scheduled' | 'event'
      input_data,     // Input data for the workflow
      async = true,   // Run asynchronously (return immediately)
    } = await req.json();

    // Validate
    if (!tenant_id || !workflow_id) {
      return workflowErrorResponse('tenant_id and workflow_id are required', 400);
    }

    // Create clients
    const supabase = createWorkflowClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const adminClient = createWorkflowClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return workflowErrorResponse('Unauthorized', 401);
    }

    // Get workflow definition
    const { data: workflow, error: workflowError } = await adminClient
      .from('automation_workflows')
      .select('*')
      .eq('id', workflow_id)
      .eq('tenant_id', tenant_id)
      .single();

    if (workflowError || !workflow) {
      return workflowErrorResponse('Workflow not found', 404);
    }

    if (!workflow.is_active) {
      return workflowErrorResponse('Workflow is not active', 400);
    }

    // Create workflow run record
    const { data: workflowRun, error: runError } = await adminClient
      .from('automation_workflow_runs')
      .insert({
        tenant_id,
        workflow_id,
        triggered_by: user.id,
        trigger_type: trigger_type || 'manual',
        input_data,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (runError || !workflowRun) {
      throw new Error('Failed to create workflow run');
    }

    console.log(`Workflow run started: ${workflowRun.id}`);

    // For async execution, return immediately and process in background
    if (async) {
      // In production, you would queue this for processing
      // For now, we'll execute synchronously but return early
      
      // Fire and forget - execute workflow
      executeWorkflow(adminClient, workflow, workflowRun.id, input_data)
        .catch(err => console.error('Workflow execution error:', err));

      return workflowSuccessResponse({
        run_id: workflowRun.id,
        status: 'started',
        message: 'Workflow triggered successfully',
      });
    }

    // Synchronous execution
    const result = await executeWorkflow(
      adminClient,
      workflow,
      workflowRun.id,
      input_data
    );

    return workflowSuccessResponse({
      run_id: workflowRun.id,
      status: result.status,
      output: result.output,
      steps_executed: result.stepsExecuted,
    });

  } catch (error) {
    console.error('Workflow trigger error:', error);
    return workflowErrorResponse(
      error instanceof Error ? error.message : 'Workflow trigger failed',
      500
    );
  }
});

/**
 * Execute workflow steps
 */
async function executeWorkflow(
  supabase: ReturnType<typeof createWorkflowClient>,
  workflow: Record<string, unknown>,
  runId: string,
  inputData: Record<string, unknown>
): Promise<{
  status: string;
  output: Record<string, unknown>;
  stepsExecuted: number;
}> {
  const steps = workflow.steps as Array<{
    id: string;
    type: string;
    config: Record<string, unknown>;
    next_step_id?: string;
    on_success?: string;
    on_failure?: string;
  }>;

  if (!steps || steps.length === 0) {
    await updateWorkflowRun(supabase, runId, 'completed', {});
    return { status: 'completed', output: {}, stepsExecuted: 0 };
  }

  let currentStep = steps[0];
  let stepIndex = 0;
  const context: Record<string, unknown> = { input: inputData };
  const executedSteps: string[] = [];
  const maxSteps = 100; // Prevent infinite loops

  try {
    while (currentStep && stepIndex < maxSteps) {
      console.log(`Executing step ${stepIndex + 1}: ${currentStep.type}`);
      
      // Log step start
      await supabase.from('automation_step_logs').insert({
        workflow_run_id: runId,
        step_id: currentStep.id,
        step_type: currentStep.type,
        status: 'running',
        started_at: new Date().toISOString(),
      });

      let stepResult: { success: boolean; output?: unknown; error?: string };

      try {
        stepResult = await executeStep(supabase, currentStep, context);
      } catch (err) {
        stepResult = { success: false, error: String(err) };
      }

      // Update step log
      await supabase
        .from('automation_step_logs')
        .update({
          status: stepResult.success ? 'completed' : 'failed',
          output: stepResult.output,
          error_message: stepResult.error,
          completed_at: new Date().toISOString(),
        })
        .eq('workflow_run_id', runId)
        .eq('step_id', currentStep.id);

      // Store step output in context
      context[`step_${currentStep.id}`] = stepResult.output;
      executedSteps.push(currentStep.id);

      // Determine next step
      let nextStepId: string | undefined;
      
      if (stepResult.success) {
        nextStepId = currentStep.on_success || currentStep.next_step_id;
      } else {
        nextStepId = currentStep.on_failure;
        if (!nextStepId) {
          // No failure handler, workflow fails
          throw new Error(`Step ${currentStep.id} failed: ${stepResult.error}`);
        }
      }

      if (!nextStepId) {
        break; // Workflow completed
      }

      currentStep = steps.find(s => s.id === nextStepId)!;
      stepIndex++;
    }

    const finalOutput = { context, steps_completed: executedSteps.length };
    await updateWorkflowRun(supabase, runId, 'completed', finalOutput);
    
    return {
      status: 'completed',
      output: finalOutput,
      stepsExecuted: executedSteps.length,
    };

  } catch (error) {
    const errorOutput = { error: String(error), steps_completed: executedSteps.length };
    await updateWorkflowRun(supabase, runId, 'failed', errorOutput);
    
    return {
      status: 'failed',
      output: errorOutput,
      stepsExecuted: executedSteps.length,
    };
  }
}

/**
 * Execute a single workflow step
 */
async function executeStep(
  supabase: ReturnType<typeof createWorkflowClient>,
  step: { type: string; config: Record<string, unknown> },
  context: Record<string, unknown>
): Promise<{ success: boolean; output?: unknown; error?: string }> {
  const config = step.config;

  switch (step.type) {
    case 'notification':
      // Send notification
      const channel = config.channel as string || 'email';
      console.log(`Sending ${channel} notification`);
      // In production, call the send-notification function
      return { success: true, output: { channel, sent: true } };

    case 'delay':
      // Wait for specified duration
      const delayMs = (config.seconds as number || 0) * 1000;
      console.log(`Waiting ${delayMs}ms`);
      await new Promise(resolve => setTimeout(resolve, Math.min(delayMs, 30000)));
      return { success: true, output: { delayed: delayMs } };

    case 'condition':
      // Evaluate condition
      const field = config.field as string;
      const operator = config.operator as string;
      const value = config.value;
      
      const fieldValue = getNestedValue(context, field);
      const result = evaluateCondition(fieldValue, operator, value);
      
      return { success: true, output: { condition_met: result } };

    case 'action':
      // Execute action based on action_type
      const actionType = config.action_type as string;
      console.log(`Executing action: ${actionType}`);
      
      switch (actionType) {
        case 'create_record':
          // Create a database record
          const { data, error } = await supabase
            .from(config.table as string)
            .insert(config.data)
            .select();
          
          if (error) {
            return { success: false, error: error.message };
          }
          return { success: true, output: { created: data } };

        case 'update_record':
          // Update a database record
          const { error: updateError } = await supabase
            .from(config.table as string)
            .update(config.data)
            .match(config.match as Record<string, unknown>);
          
          if (updateError) {
            return { success: false, error: updateError.message };
          }
          return { success: true, output: { updated: true } };

        case 'http_request':
          // Make HTTP request
          try {
            const response = await fetch(config.url as string, {
              method: (config.method as string) || 'POST',
              headers: config.headers as Record<string, string>,
              body: config.body ? JSON.stringify(config.body) : undefined,
            });
            
            const responseData = await response.json();
            return { success: response.ok, output: responseData };
          } catch (err) {
            return { success: false, error: String(err) };
          }

        default:
          return { success: false, error: `Unknown action type: ${actionType}` };
      }

    case 'integration':
      // Call external integration
      const integrationId = config.integration_id as string;
      console.log(`Calling integration: ${integrationId}`);
      // In production, fetch integration config and execute
      return { success: true, output: { integration: integrationId, executed: true } };

    default:
      return { success: false, error: `Unknown step type: ${step.type}` };
  }
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined;
  }, obj as unknown);
}

/**
 * Evaluate a condition
 */
function evaluateCondition(left: unknown, operator: string, right: unknown): boolean {
  switch (operator) {
    case 'equals':
    case '==':
      return left === right;
    case 'not_equals':
    case '!=':
      return left !== right;
    case 'contains':
      return String(left).includes(String(right));
    case 'greater_than':
    case '>':
      return Number(left) > Number(right);
    case 'less_than':
    case '<':
      return Number(left) < Number(right);
    case 'is_empty':
      return !left || (Array.isArray(left) && left.length === 0);
    case 'is_not_empty':
      return !!left && (!Array.isArray(left) || left.length > 0);
    default:
      return false;
  }
}

/**
 * Update workflow run status
 */
async function updateWorkflowRun(
  supabase: ReturnType<typeof createWorkflowClient>,
  runId: string,
  status: string,
  output: Record<string, unknown>
): Promise<void> {
  await supabase
    .from('automation_workflow_runs')
    .update({
      status,
      output_data: output,
      completed_at: new Date().toISOString(),
    })
    .eq('id', runId);
}

function workflowSuccessResponse(data: unknown): Response {
  return new Response(
    JSON.stringify({ success: true, data, timestamp: new Date().toISOString() }),
    { headers: { ...workflowCorsHeaders, 'Content-Type': 'application/json' } }
  );
}

function workflowErrorResponse(message: string, status = 400): Response {
  return new Response(
    JSON.stringify({ success: false, error: message, timestamp: new Date().toISOString() }),
    { status, headers: { ...workflowCorsHeaders, 'Content-Type': 'application/json' } }
  );
}


// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                            ║
// ║                        SECTION 6: AI / PROXIMA                             ║
// ║                                                                            ║
// ╚═══════════════════════════════════════════════════════════════════════════╝


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/proxima-query/index.ts
// PURPOSE: AI-powered queries for Proxima insights
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Proxima AI Query Edge Function
 * 
 * Provides AI-powered insights and natural language queries for:
 * - Attrition risk analysis
 * - Payroll anomaly detection
 * - Compliance risk assessment
 * - General HR analytics questions
 * 
 * Uses OpenAI GPT-4 with context from tenant data.
 * 
 * Required Secrets:
 * - OPENAI_API_KEY
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve as serveProxima } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient as createProximaClient } from "https://esm.sh/@supabase/supabase-js@2";

const proximaCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serveProxima(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: proximaCorsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return proximaErrorResponse('Missing authorization header', 401);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return proximaErrorResponse('AI service not configured', 500);
    }

    const {
      tenant_id,
      query,           // Natural language query
      query_type,      // 'attrition' | 'payroll' | 'compliance' | 'general'
      include_context, // Include relevant data context
      max_tokens,      // Max response tokens
    } = await req.json();

    if (!tenant_id || !query) {
      return proximaErrorResponse('tenant_id and query are required', 400);
    }

    // Create clients
    const supabase = createProximaClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const adminClient = createProximaClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return proximaErrorResponse('Unauthorized', 401);
    }

    // Gather context based on query type
    let context = '';
    
    if (include_context !== false) {
      context = await gatherQueryContext(adminClient, tenant_id, query_type);
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(query_type);

    // Build user message with context
    const userMessage = context 
      ? `Context:\n${context}\n\nQuestion: ${query}`
      : query;

    // Call OpenAI
    console.log(`Proxima query: ${query_type || 'general'}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: max_tokens || 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI error:', error);
      return proximaErrorResponse('AI service error', 500);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Log query for analytics
    await adminClient.from('proxima_query_logs').insert({
      tenant_id,
      user_id: user.id,
      query,
      query_type: query_type || 'general',
      response: aiResponse,
      tokens_used: data.usage?.total_tokens,
    });

    return proximaSuccessResponse({
      response: aiResponse,
      query_type: query_type || 'general',
      tokens_used: data.usage?.total_tokens,
    });

  } catch (error) {
    console.error('Proxima error:', error);
    return proximaErrorResponse(
      error instanceof Error ? error.message : 'AI query failed',
      500
    );
  }
});

/**
 * Build system prompt based on query type
 */
function buildSystemPrompt(queryType?: string): string {
  const basePrompt = `You are Proxima AI, an intelligent assistant for ATLAS HR platform. 
You help HR administrators and managers understand their workforce data, 
identify risks, and make data-driven decisions.

Guidelines:
- Be concise but informative
- Use bullet points for lists
- Provide actionable recommendations
- If data is insufficient, say so
- Format numbers with Indian number system (lakhs, crores)
- Always consider compliance with Indian labor laws
`;

  switch (queryType) {
    case 'attrition':
      return basePrompt + `
You are specialized in attrition risk analysis. Focus on:
- Identifying flight risk employees
- Analyzing patterns in recent resignations
- Recommending retention strategies
- Calculating attrition rates by department/tenure
`;

    case 'payroll':
      return basePrompt + `
You are specialized in payroll analytics. Focus on:
- Identifying salary anomalies
- Comparing compensation across roles
- Analyzing payroll trends
- Ensuring statutory compliance (PF, ESIC, TDS)
`;

    case 'compliance':
      return basePrompt + `
You are specialized in compliance monitoring. Focus on:
- Tracking compliance deadlines
- Identifying missing documents
- Suggesting remediation steps
- Prioritizing by risk level
`;

    default:
      return basePrompt + `
You can answer general questions about:
- Workforce statistics
- Department performance
- HR metrics and KPIs
- Best practices
`;
  }
}

/**
 * Gather relevant context for the query
 */
async function gatherQueryContext(
  supabase: ReturnType<typeof createProximaClient>,
  tenantId: string,
  queryType?: string
): Promise<string> {
  let context = '';

  try {
    // Get basic tenant stats
    const { data: employees } = await supabase
      .from('hr_employees')
      .select('id, department_id, status, date_of_joining')
      .eq('tenant_id', tenantId);

    if (employees) {
      const activeCount = employees.filter(e => e.status === 'active').length;
      const recentJoiners = employees.filter(e => {
        const joinDate = new Date(e.date_of_joining);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return joinDate > threeMonthsAgo;
      }).length;

      context += `Employee Statistics:
- Total active employees: ${activeCount}
- Joined in last 3 months: ${recentJoiners}
`;
    }

    // Add query-specific context
    if (queryType === 'attrition') {
      // Get recent resignations
      const { data: exits } = await supabase
        .from('hr_employee_exits')
        .select('*')
        .eq('tenant_id', tenantId)
        .gte('exit_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

      if (exits && exits.length > 0) {
        context += `\nRecent Exits (last 90 days): ${exits.length}
`;
      }
    }

    if (queryType === 'payroll') {
      // Get latest payroll run summary
      const { data: payrollRun } = await supabase
        .from('pay_payroll_runs')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('status', 'completed')
        .order('cycle_year', { ascending: false })
        .order('cycle_month', { ascending: false })
        .limit(1)
        .single();

      if (payrollRun) {
        context += `\nLatest Payroll (${payrollRun.cycle_month}/${payrollRun.cycle_year}):
- Total Gross: ₹${formatIndianNumber(payrollRun.total_gross)}
- Total Net: ₹${formatIndianNumber(payrollRun.total_net)}
- Employees: ${payrollRun.total_employees}
`;
      }
    }

    if (queryType === 'compliance') {
      // Get pending compliance items
      const { data: pendingItems } = await supabase
        .from('compliance_items')
        .select('*')
        .eq('tenant_id', tenantId)
        .neq('status', 'completed');

      if (pendingItems && pendingItems.length > 0) {
        context += `\nPending Compliance Items: ${pendingItems.length}
`;
      }
    }

  } catch (err) {
    console.error('Error gathering context:', err);
  }

  return context;
}

/**
 * Format number in Indian style (lakhs, crores)
 */
function formatIndianNumber(num: number): string {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(2) + ' Cr';
  } else if (num >= 100000) {
    return (num / 100000).toFixed(2) + ' L';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + ' K';
  }
  return num.toFixed(2);
}

function proximaSuccessResponse(data: unknown): Response {
  return new Response(
    JSON.stringify({ success: true, data, timestamp: new Date().toISOString() }),
    { headers: { ...proximaCorsHeaders, 'Content-Type': 'application/json' } }
  );
}

function proximaErrorResponse(message: string, status = 400): Response {
  return new Response(
    JSON.stringify({ success: false, error: message, timestamp: new Date().toISOString() }),
    { status, headers: { ...proximaCorsHeaders, 'Content-Type': 'application/json' } }
  );
}


// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                            ║
// ║                     SECTION 7: STRIPE INTEGRATION                          ║
// ║                                                                            ║
// ╚═══════════════════════════════════════════════════════════════════════════╝


// ═══════════════════════════════════════════════════════════════════════════
// FILE: supabase/functions/stripe-webhook/index.ts
// PURPOSE: Handle Stripe payment webhooks for subscription management
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events for:
 * - subscription.created: New subscription started
 * - subscription.updated: Plan changes, renewals
 * - subscription.deleted: Subscription cancelled
 * - invoice.paid: Successful payment
 * - invoice.payment_failed: Failed payment
 * 
 * Required Secrets:
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SECRET
 */

import { serve as serveStripe } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient as createStripeClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.5.0?target=deno";

const stripeCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serveStripe(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: stripeCorsHeaders });
  }

  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!stripeSecretKey || !webhookSecret) {
    console.error('Stripe not configured');
    return new Response('Stripe not configured', { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature', { status: 400 });
  }

  try {
    const body = await req.text();
    
    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Invalid signature', { status: 400 });
    }

    console.log(`Stripe webhook received: ${event.type}`);

    // Create Supabase admin client
    const supabase = createStripeClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(supabase, subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(supabase, invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(supabase, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Handle subscription created/updated
 */
async function handleSubscriptionChange(
  supabase: ReturnType<typeof createStripeClient>,
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  const priceId = subscription.items.data[0]?.price.id;

  // Find tenant by Stripe customer ID
  const { data: tenant } = await supabase
    .from('client_tenants')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!tenant) {
    console.error('Tenant not found for customer:', customerId);
    return;
  }

  // Map price ID to plan tier
  const planTier = mapPriceToTier(priceId);

  // Update tenant subscription
  await supabase
    .from('tenant_subscriptions')
    .upsert({
      tenant_id: tenant.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      status,
      plan_tier: planTier,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    });

  // Update tenant settings
  await supabase
    .from('client_tenants')
    .update({
      subscription_status: status,
      plan_tier: planTier,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tenant.id);

  console.log(`Subscription ${status} for tenant ${tenant.id}: ${planTier}`);
}

/**
 * Handle subscription cancelled
 */
async function handleSubscriptionCancelled(
  supabase: ReturnType<typeof createStripeClient>,
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId = subscription.customer as string;

  const { data: tenant } = await supabase
    .from('client_tenants')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!tenant) return;

  // Update subscription status
  await supabase
    .from('tenant_subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  // Downgrade tenant to free tier
  await supabase
    .from('client_tenants')
    .update({
      subscription_status: 'cancelled',
      plan_tier: 'free',
      updated_at: new Date().toISOString(),
    })
    .eq('id', tenant.id);

  console.log(`Subscription cancelled for tenant ${tenant.id}`);
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaid(
  supabase: ReturnType<typeof createStripeClient>,
  invoice: Stripe.Invoice
): Promise<void> {
  const customerId = invoice.customer as string;

  const { data: tenant } = await supabase
    .from('client_tenants')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!tenant) return;

  // Record payment
  await supabase.from('tenant_payments').insert({
    tenant_id: tenant.id,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_paid / 100, // Stripe amounts are in cents
    currency: invoice.currency,
    status: 'paid',
    paid_at: new Date(invoice.status_transitions.paid_at! * 1000).toISOString(),
  });

  console.log(`Payment received for tenant ${tenant.id}: ${invoice.amount_paid / 100} ${invoice.currency}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(
  supabase: ReturnType<typeof createStripeClient>,
  invoice: Stripe.Invoice
): Promise<void> {
  const customerId = invoice.customer as string;

  const { data: tenant } = await supabase
    .from('client_tenants')
    .select('id, contact_email, name')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!tenant) return;

  // Record failed payment
  await supabase.from('tenant_payments').insert({
    tenant_id: tenant.id,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_due / 100,
    currency: invoice.currency,
    status: 'failed',
  });

  // TODO: Send notification about failed payment
  console.log(`Payment failed for tenant ${tenant.id}`);
}

/**
 * Map Stripe price ID to plan tier
 */
function mapPriceToTier(priceId: string): string {
  // In production, configure these in environment or database
  const priceTierMap: Record<string, string> = {
    'price_starter_monthly': 'starter',
    'price_starter_yearly': 'starter',
    'price_pro_monthly': 'pro',
    'price_pro_yearly': 'pro',
    'price_business_monthly': 'business',
    'price_business_yearly': 'business',
    'price_enterprise_monthly': 'enterprise',
    'price_enterprise_yearly': 'enterprise',
  };

  return priceTierMap[priceId] || 'starter';
}


// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                            ║
// ║                           SECTION 8: CONFIG                                ║
// ║                                                                            ║
// ╚═══════════════════════════════════════════════════════════════════════════╝


/**
 * supabase/config.toml
 * 
 * This is the Supabase configuration file that defines Edge Functions settings.
 * Copy this content to your supabase/config.toml file.
 */

/*
project_id = "your-project-id"

# ═══════════════════════════════════════════════════════════════════════════
# SSO Authentication Functions
# ═══════════════════════════════════════════════════════════════════════════

[functions.sso-google-callback]
verify_jwt = false  # Public - OAuth callback

[functions.sso-microsoft-callback]
verify_jwt = false  # Public - OAuth callback

[functions.sso-saml-callback]
verify_jwt = false  # Public - SAML callback

# ═══════════════════════════════════════════════════════════════════════════
# Tenant Setup Functions
# ═══════════════════════════════════════════════════════════════════════════

[functions.tenant-setup]
verify_jwt = true   # Requires authentication

[functions.invite-user]
verify_jwt = true   # Requires authentication

# ═══════════════════════════════════════════════════════════════════════════
# Payroll Functions
# ═══════════════════════════════════════════════════════════════════════════

[functions.payroll-run]
verify_jwt = true   # Requires finance_admin role

[functions.payslip-generate]
verify_jwt = true

[functions.salary-slip-pdf]
verify_jwt = true

# ═══════════════════════════════════════════════════════════════════════════
# HR Functions
# ═══════════════════════════════════════════════════════════════════════════

[functions.employee-import]
verify_jwt = true   # Requires hr_admin role

[functions.offboarding-trigger]
verify_jwt = true

[functions.onboarding-complete]
verify_jwt = true

# ═══════════════════════════════════════════════════════════════════════════
# Notification Functions
# ═══════════════════════════════════════════════════════════════════════════

[functions.send-notification]
verify_jwt = true

# ═══════════════════════════════════════════════════════════════════════════
# BGV Functions
# ═══════════════════════════════════════════════════════════════════════════

[functions.bgv-initiate]
verify_jwt = true

[functions.bgv-webhook]
verify_jwt = false  # Public - webhook from BGV provider

# ═══════════════════════════════════════════════════════════════════════════
# Workflow/Automation Functions (OpZenix)
# ═══════════════════════════════════════════════════════════════════════════

[functions.workflow-trigger]
verify_jwt = true

[functions.workflow-execute]
verify_jwt = true

[functions.workflow-schedule]
verify_jwt = false  # Called by scheduler

# ═══════════════════════════════════════════════════════════════════════════
# AI Functions (Proxima)
# ═══════════════════════════════════════════════════════════════════════════

[functions.proxima-query]
verify_jwt = true

[functions.insights-generate]
verify_jwt = true

# ═══════════════════════════════════════════════════════════════════════════
# Integration Functions
# ═══════════════════════════════════════════════════════════════════════════

[functions.stripe-webhook]
verify_jwt = false  # Public - Stripe webhook

[functions.calendar-sync]
verify_jwt = true

[functions.slack-notify]
verify_jwt = true

# ═══════════════════════════════════════════════════════════════════════════
# Existing Functions (keep these)
# ═══════════════════════════════════════════════════════════════════════════

[functions.generate-invoice-pdf]
verify_jwt = false

[functions.send-welcome-email]
verify_jwt = false
*/


// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                            ║
// ║                        TEMPORAL WORKFLOW INTEGRATION                       ║
// ║                                                                            ║
// ║  For production long-running workflows, integrate with Temporal.io        ║
// ║                                                                            ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

/**
 * Temporal Workflow Integration Guide
 * 
 * Temporal is a workflow orchestration platform that provides:
 * - Durable execution (survives failures)
 * - Automatic retries with configurable policies
 * - Long-running workflows (hours, days, weeks)
 * - Human-in-the-loop approvals
 * - Visibility into workflow state
 * 
 * Setup Steps:
 * 
 * 1. Deploy Temporal (self-hosted or Temporal Cloud)
 *    - Self-hosted: https://docs.temporal.io/self-hosted-guide
 *    - Cloud: https://temporal.io/cloud
 * 
 * 2. Set TEMPORAL_ADDRESS secret in Supabase
 *    - Format: "your-namespace.your-account.tmprl.cloud:7233"
 * 
 * 3. Create Temporal Worker (separate Node.js service)
 *    - Runs outside Supabase
 *    - Polls Temporal for tasks
 *    - Executes workflow activities
 * 
 * Example Temporal Worker (Node.js):
 * 
 * ```typescript
 * import { Worker } from '@temporalio/worker';
 * import * as activities from './activities';
 * 
 * async function run() {
 *   const worker = await Worker.create({
 *     workflowsPath: require.resolve('./workflows'),
 *     activities,
 *     taskQueue: 'atlas-workflows',
 *   });
 *   await worker.run();
 * }
 * 
 * run().catch(console.error);
 * ```
 * 
 * Example Workflow Definition:
 * 
 * ```typescript
 * import { proxyActivities } from '@temporalio/workflow';
 * import type * as activities from './activities';
 * 
 * const { sendEmail, updateDatabase, callAPI } = proxyActivities<typeof activities>({
 *   startToCloseTimeout: '1 minute',
 *   retry: {
 *     maximumAttempts: 3,
 *   },
 * });
 * 
 * export async function employeeOnboardingWorkflow(employeeId: string): Promise<void> {
 *   // Step 1: Send welcome email
 *   await sendEmail(employeeId, 'welcome');
 *   
 *   // Step 2: Wait for document upload (can wait days)
 *   await condition(() => documentsUploaded(employeeId), '7 days');
 *   
 *   // Step 3: Trigger BGV
 *   const bgvResult = await callAPI('bgv-provider', { employeeId });
 *   
 *   // Step 4: Wait for BGV completion (can take weeks)
 *   await condition(() => bgvCompleted(employeeId), '30 days');
 *   
 *   // Step 5: Complete onboarding
 *   await updateDatabase('employees', employeeId, { status: 'active' });
 * }
 * ```
 * 
 * Triggering from Edge Function:
 * 
 * ```typescript
 * import { Client } from '@temporalio/client';
 * 
 * const client = new Client({
 *   connection: await Connection.connect({
 *     address: Deno.env.get('TEMPORAL_ADDRESS'),
 *   }),
 * });
 * 
 * const handle = await client.workflow.start(employeeOnboardingWorkflow, {
 *   args: [employeeId],
 *   taskQueue: 'atlas-workflows',
 *   workflowId: `onboarding-${employeeId}`,
 * });
 * 
 * console.log(`Started workflow: ${handle.workflowId}`);
 * ```
 */


// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                            ║
// ║                              END OF FILE                                   ║
// ║                                                                            ║
// ║  This file contains the complete Edge Functions architecture for ATLAS.   ║
// ║  To use, split each section into its own file as indicated by the         ║
// ║  FILE: comments above each section.                                        ║
// ║                                                                            ║
// ║  Required Secrets:                                                         ║
// ║  - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET                                 ║
// ║  - MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET                           ║
// ║  - RESEND_API_KEY                                                         ║
// ║  - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN (optional)                       ║
// ║  - STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET                               ║
// ║  - SLACK_BOT_TOKEN (optional)                                             ║
// ║  - OPENAI_API_KEY                                                         ║
// ║  - TEMPORAL_ADDRESS (optional)                                            ║
// ║                                                                            ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
