// ============================================================================
// ATLAS Edge Function: Overtime Calculator
// ============================================================================
// Purpose: Calculate overtime hours, rates, and process overtime records
// Version: 1.0.0
// Last Updated: December 7, 2025 @ 16:45 UTC
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OvertimeRequest {
  action: 'calculate_daily' | 'calculate_period' | 'submit_overtime' | 'approve_overtime' | 'reject_overtime' | 'get_overtime_summary';
  tenant_id: string;
  user_id?: string;
  employee_id?: string;
  date?: string;
  period?: {
    start_date: string;
    end_date: string;
  };
  overtime_data?: {
    employee_id: string;
    overtime_date: string;
    hours: number;
    overtime_type: 'regular' | 'double' | 'special' | 'comp_off';
    notes?: string;
    pre_approved?: boolean;
  };
  overtime_record_id?: string;
  rejection_reason?: string;
}

interface OvertimeConfig {
  regular_hours_per_day: number;
  regular_multiplier: number;
  double_multiplier: number;
  special_multiplier: number;
  max_overtime_per_day: number;
  max_overtime_per_week: number;
  require_pre_approval: boolean;
}

const DEFAULT_CONFIG: OvertimeConfig = {
  regular_hours_per_day: 8,
  regular_multiplier: 1.5,
  double_multiplier: 2.0,
  special_multiplier: 2.5,
  max_overtime_per_day: 4,
  max_overtime_per_week: 20,
  require_pre_approval: false,
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const request: OvertimeRequest = await req.json();
    console.log(`[Overtime Calculator] Action: ${request.action}, Tenant: ${request.tenant_id}`);

    let result: any;

    switch (request.action) {
      case 'calculate_daily':
        result = await calculateDailyOvertime(supabase, request);
        break;
      case 'calculate_period':
        result = await calculatePeriodOvertime(supabase, request);
        break;
      case 'submit_overtime':
        result = await submitOvertime(supabase, request);
        break;
      case 'approve_overtime':
        result = await approveOvertime(supabase, request);
        break;
      case 'reject_overtime':
        result = await rejectOvertime(supabase, request);
        break;
      case 'get_overtime_summary':
        result = await getOvertimeSummary(supabase, request);
        break;
      default:
        throw new Error(`Unknown action: ${request.action}`);
    }

    console.log(`[Overtime Calculator] Success: ${request.action}`);
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    const error = err as Error;
    console.error('[Overtime Calculator] Error:', error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

async function calculateDailyOvertime(supabase: any, request: OvertimeRequest) {
  const { tenant_id, employee_id, date } = request;
  if (!employee_id || !date) throw new Error('employee_id and date are required');

  // Get attendance record for the day
  const { data: attendance, error: attError } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('employee_id', employee_id)
    .eq('attendance_date', date)
    .single();

  if (attError || !attendance) {
    return { overtime_hours: 0, message: 'No attendance record found for this date' };
  }

  // Get shift assignment for the day
  const { data: assignment } = await supabase
    .from('shift_assignments')
    .select('*, shifts:shift_id (*)')
    .eq('employee_id', employee_id)
    .eq('assignment_date', date)
    .single();

  const config = DEFAULT_CONFIG;
  const regularHours = assignment?.shifts?.min_hours || config.regular_hours_per_day;
  const totalWorked = attendance.total_hours || 0;
  
  let overtimeHours = 0;
  let overtimeType: 'regular' | 'double' = 'regular';

  if (totalWorked > regularHours) {
    overtimeHours = Math.min(totalWorked - regularHours, config.max_overtime_per_day);
    
    // Check if it's a weekend/holiday for double rate
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      overtimeType = 'double';
    }
  }

  const multiplier = overtimeType === 'double' ? config.double_multiplier : config.regular_multiplier;

  console.log(`[Overtime Calculator] Daily OT for ${employee_id}: ${overtimeHours} hours (${overtimeType})`);

  return {
    employee_id,
    date,
    regular_hours: regularHours,
    total_worked: totalWorked,
    overtime_hours: overtimeHours,
    overtime_type: overtimeType,
    rate_multiplier: multiplier,
    needs_approval: overtimeHours > 0 && config.require_pre_approval,
  };
}

async function calculatePeriodOvertime(supabase: any, request: OvertimeRequest) {
  const { tenant_id, employee_id, period } = request;
  if (!period) throw new Error('period is required');

  // Get all attendance records for the period
  let query = supabase
    .from('attendance_records')
    .select('*')
    .eq('tenant_id', tenant_id)
    .gte('attendance_date', period.start_date)
    .lte('attendance_date', period.end_date);

  if (employee_id) {
    query = query.eq('employee_id', employee_id);
  }

  const { data: attendanceRecords, error } = await query;
  if (error) throw error;

  const config = DEFAULT_CONFIG;
  const overtimeByEmployee: Record<string, any> = {};

  for (const record of attendanceRecords || []) {
    const empId = record.employee_id;
    if (!overtimeByEmployee[empId]) {
      overtimeByEmployee[empId] = {
        employee_id: empId,
        total_regular_hours: 0,
        total_overtime_hours: 0,
        regular_overtime_hours: 0,
        double_overtime_hours: 0,
        days_worked: 0,
      };
    }

    const totalWorked = record.total_hours || 0;
    const dayOfWeek = new Date(record.attendance_date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (totalWorked > config.regular_hours_per_day) {
      const ot = Math.min(totalWorked - config.regular_hours_per_day, config.max_overtime_per_day);
      overtimeByEmployee[empId].total_overtime_hours += ot;
      
      if (isWeekend) {
        overtimeByEmployee[empId].double_overtime_hours += ot;
      } else {
        overtimeByEmployee[empId].regular_overtime_hours += ot;
      }
      overtimeByEmployee[empId].total_regular_hours += config.regular_hours_per_day;
    } else {
      overtimeByEmployee[empId].total_regular_hours += totalWorked;
    }
    
    overtimeByEmployee[empId].days_worked++;
  }

  // Cap weekly overtime
  for (const empId in overtimeByEmployee) {
    const emp = overtimeByEmployee[empId];
    if (emp.total_overtime_hours > config.max_overtime_per_week) {
      emp.total_overtime_hours = config.max_overtime_per_week;
      emp.capped = true;
    }
    
    // Calculate estimated pay multiplier
    emp.regular_ot_pay_multiplier = emp.regular_overtime_hours * config.regular_multiplier;
    emp.double_ot_pay_multiplier = emp.double_overtime_hours * config.double_multiplier;
  }

  console.log(`[Overtime Calculator] Period OT calculated for ${Object.keys(overtimeByEmployee).length} employees`);

  return {
    period,
    employees: Object.values(overtimeByEmployee),
    config: {
      regular_multiplier: config.regular_multiplier,
      double_multiplier: config.double_multiplier,
    },
  };
}

async function submitOvertime(supabase: any, request: OvertimeRequest) {
  const { tenant_id, overtime_data } = request;
  if (!overtime_data) throw new Error('overtime_data is required');

  // Validate hours don't exceed daily limit
  if (overtime_data.hours > DEFAULT_CONFIG.max_overtime_per_day) {
    throw new Error(`Overtime hours cannot exceed ${DEFAULT_CONFIG.max_overtime_per_day} per day`);
  }

  // Get rate multiplier based on type
  const rateMultiplier = getMultiplier(overtime_data.overtime_type);

  const { data, error } = await supabase
    .from('overtime_records')
    .insert({
      tenant_id,
      employee_id: overtime_data.employee_id,
      overtime_date: overtime_data.overtime_date,
      hours: overtime_data.hours,
      overtime_type: overtime_data.overtime_type,
      rate_multiplier: rateMultiplier,
      pre_approved: overtime_data.pre_approved || false,
      status: overtime_data.pre_approved ? 'approved' : 'pending',
      notes: overtime_data.notes,
    })
    .select()
    .single();

  if (error) throw error;

  console.log(`[Overtime Calculator] Submitted OT record: ${data.id}`);
  return data;
}

async function approveOvertime(supabase: any, request: OvertimeRequest) {
  const { overtime_record_id, user_id } = request;
  if (!overtime_record_id) throw new Error('overtime_record_id is required');

  const { error } = await supabase
    .from('overtime_records')
    .update({
      status: 'approved',
      approved_by: user_id,
      approved_at: new Date().toISOString(),
    })
    .eq('id', overtime_record_id)
    .eq('status', 'pending');

  if (error) throw error;

  console.log(`[Overtime Calculator] Approved OT: ${overtime_record_id}`);
  return { message: 'Overtime approved successfully' };
}

async function rejectOvertime(supabase: any, request: OvertimeRequest) {
  const { overtime_record_id, user_id, rejection_reason } = request;
  if (!overtime_record_id) throw new Error('overtime_record_id is required');

  const { error } = await supabase
    .from('overtime_records')
    .update({
      status: 'rejected',
      approved_by: user_id,
      approved_at: new Date().toISOString(),
      rejection_reason: rejection_reason || 'Rejected by manager',
    })
    .eq('id', overtime_record_id)
    .eq('status', 'pending');

  if (error) throw error;

  console.log(`[Overtime Calculator] Rejected OT: ${overtime_record_id}`);
  return { message: 'Overtime rejected' };
}

async function getOvertimeSummary(supabase: any, request: OvertimeRequest) {
  const { tenant_id, employee_id, period } = request;
  if (!period) throw new Error('period is required');

  let query = supabase
    .from('overtime_records')
    .select(`
      *,
      employees:employee_id (full_name, employee_code, department)
    `)
    .eq('tenant_id', tenant_id)
    .gte('overtime_date', period.start_date)
    .lte('overtime_date', period.end_date);

  if (employee_id) {
    query = query.eq('employee_id', employee_id);
  }

  const { data, error } = await query.order('overtime_date', { ascending: false });
  if (error) throw error;

  // Summarize
  const summary = {
    total_records: data?.length || 0,
    total_hours: 0,
    approved_hours: 0,
    pending_hours: 0,
    rejected_hours: 0,
    by_type: {
      regular: 0,
      double: 0,
      special: 0,
      comp_off: 0,
    },
    records: data,
  };

  for (const record of data || []) {
    summary.total_hours += record.hours;
    if (record.status === 'approved') summary.approved_hours += record.hours;
    if (record.status === 'pending') summary.pending_hours += record.hours;
    if (record.status === 'rejected') summary.rejected_hours += record.hours;
    const otType = record.overtime_type as keyof typeof summary.by_type;
    if (otType && summary.by_type[otType] !== undefined) {
      summary.by_type[otType] += record.hours;
    }
  }

  console.log(`[Overtime Calculator] Summary: ${summary.total_hours} total hours`);
  return summary;
}

function getMultiplier(type: string): number {
  const multipliers: Record<string, number> = {
    regular: DEFAULT_CONFIG.regular_multiplier,
    double: DEFAULT_CONFIG.double_multiplier,
    special: DEFAULT_CONFIG.special_multiplier,
    comp_off: 1.0,
  };
  return multipliers[type] || DEFAULT_CONFIG.regular_multiplier;
}
