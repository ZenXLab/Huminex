// ============================================================================
// ATLAS Edge Function: Shift Scheduler
// ============================================================================
// Purpose: Automate shift scheduling, assignment, and management
// Version: 1.0.0
// Last Updated: December 7, 2025 @ 16:45 UTC
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShiftScheduleRequest {
  action: 'create_shift' | 'assign_shift' | 'bulk_assign' | 'auto_schedule' | 'get_schedule';
  tenant_id: string;
  shift_data?: {
    name: string;
    start_time: string;
    end_time: string;
    break_duration_minutes?: number;
    grace_period_minutes?: number;
    is_overnight?: boolean;
    applicable_days?: string[];
    color?: string;
  };
  assignment_data?: {
    shift_id: string;
    employee_id: string;
    assignment_date: string;
  };
  bulk_assignments?: {
    shift_id: string;
    employee_ids: string[];
    start_date: string;
    end_date: string;
    days_of_week?: string[];
  };
  auto_schedule_config?: {
    department?: string;
    start_date: string;
    end_date: string;
    balance_hours?: boolean;
  };
  schedule_query?: {
    employee_id?: string;
    start_date: string;
    end_date: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const request: ShiftScheduleRequest = await req.json();
    console.log(`[Shift Scheduler] Action: ${request.action}, Tenant: ${request.tenant_id}`);

    let result: any;

    switch (request.action) {
      case 'create_shift':
        result = await createShift(supabase, request);
        break;
      case 'assign_shift':
        result = await assignShift(supabase, request);
        break;
      case 'bulk_assign':
        result = await bulkAssignShifts(supabase, request);
        break;
      case 'auto_schedule':
        result = await autoScheduleShifts(supabase, request);
        break;
      case 'get_schedule':
        result = await getSchedule(supabase, request);
        break;
      default:
        throw new Error(`Unknown action: ${request.action}`);
    }

    console.log(`[Shift Scheduler] Success: ${request.action}`);
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    const error = err as Error;
    console.error('[Shift Scheduler] Error:', error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

async function createShift(supabase: any, request: ShiftScheduleRequest) {
  const { tenant_id, shift_data } = request;
  if (!shift_data) throw new Error('shift_data is required');

  const { data, error } = await supabase
    .from('shifts')
    .insert({
      tenant_id,
      name: shift_data.name,
      start_time: shift_data.start_time,
      end_time: shift_data.end_time,
      break_duration_minutes: shift_data.break_duration_minutes || 0,
      grace_period_minutes: shift_data.grace_period_minutes || 15,
      is_overnight: shift_data.is_overnight || false,
      applicable_days: shift_data.applicable_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      color: shift_data.color || '#3B82F6',
      status: 'active',
    })
    .select()
    .single();

  if (error) throw error;
  console.log(`[Shift Scheduler] Created shift: ${data.name}`);
  return data;
}

async function assignShift(supabase: any, request: ShiftScheduleRequest) {
  const { tenant_id, assignment_data } = request;
  if (!assignment_data) throw new Error('assignment_data is required');

  // Check for existing assignment on same date
  const { data: existing } = await supabase
    .from('shift_assignments')
    .select('id')
    .eq('employee_id', assignment_data.employee_id)
    .eq('assignment_date', assignment_data.assignment_date)
    .single();

  if (existing) {
    throw new Error('Employee already has a shift assigned for this date');
  }

  const { data, error } = await supabase
    .from('shift_assignments')
    .insert({
      tenant_id,
      shift_id: assignment_data.shift_id,
      employee_id: assignment_data.employee_id,
      assignment_date: assignment_data.assignment_date,
      status: 'scheduled',
    })
    .select()
    .single();

  if (error) throw error;
  console.log(`[Shift Scheduler] Assigned shift to employee: ${assignment_data.employee_id}`);
  return data;
}

async function bulkAssignShifts(supabase: any, request: ShiftScheduleRequest) {
  const { tenant_id, bulk_assignments } = request;
  if (!bulk_assignments) throw new Error('bulk_assignments is required');

  const { shift_id, employee_ids, start_date, end_date, days_of_week } = bulk_assignments;
  const allowedDays = days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  
  const assignments: any[] = [];
  const start = new Date(start_date);
  const end = new Date(end_date);

  // Generate assignments for each date and employee
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if (allowedDays.includes(dayName)) {
      const dateStr = date.toISOString().split('T')[0];
      for (const employee_id of employee_ids) {
        assignments.push({
          tenant_id,
          shift_id,
          employee_id,
          assignment_date: dateStr,
          status: 'scheduled',
        });
      }
    }
  }

  if (assignments.length === 0) {
    throw new Error('No valid assignment dates found');
  }

  // Insert in batches to avoid conflicts
  const { data, error } = await supabase
    .from('shift_assignments')
    .upsert(assignments, { onConflict: 'shift_id,employee_id,assignment_date' })
    .select();

  if (error) throw error;
  console.log(`[Shift Scheduler] Bulk assigned ${assignments.length} shifts`);
  return { assigned_count: assignments.length, assignments: data };
}

async function autoScheduleShifts(supabase: any, request: ShiftScheduleRequest) {
  const { tenant_id, auto_schedule_config } = request;
  if (!auto_schedule_config) throw new Error('auto_schedule_config is required');

  // Get active shifts for tenant
  const { data: shifts, error: shiftsError } = await supabase
    .from('shifts')
    .select('*')
    .eq('tenant_id', tenant_id)
    .eq('status', 'active');

  if (shiftsError) throw shiftsError;
  if (!shifts || shifts.length === 0) throw new Error('No active shifts found');

  // Get employees (optionally filtered by department)
  let employeeQuery = supabase
    .from('employees')
    .select('id, full_name, department')
    .eq('tenant_id', tenant_id)
    .eq('employment_status', 'active');

  if (auto_schedule_config.department) {
    employeeQuery = employeeQuery.eq('department', auto_schedule_config.department);
  }

  const { data: employees, error: empError } = await employeeQuery;
  if (empError) throw empError;
  if (!employees || employees.length === 0) throw new Error('No active employees found');

  // Simple round-robin scheduling
  const assignments: any[] = [];
  const start = new Date(auto_schedule_config.start_date);
  const end = new Date(auto_schedule_config.end_date);
  let employeeIndex = 0;

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dateStr = date.toISOString().split('T')[0];

    for (const shift of shifts) {
      if (shift.applicable_days && shift.applicable_days.includes(dayName)) {
        // Assign employees to this shift
        const employeesPerShift = Math.ceil(employees.length / shifts.length);
        for (let i = 0; i < employeesPerShift && employeeIndex < employees.length; i++) {
          assignments.push({
            tenant_id,
            shift_id: shift.id,
            employee_id: employees[employeeIndex % employees.length].id,
            assignment_date: dateStr,
            status: 'scheduled',
          });
          employeeIndex++;
        }
      }
    }
    employeeIndex = 0; // Reset for next day
  }

  // Insert assignments
  const { data, error } = await supabase
    .from('shift_assignments')
    .upsert(assignments, { onConflict: 'shift_id,employee_id,assignment_date' })
    .select();

  if (error) throw error;
  console.log(`[Shift Scheduler] Auto-scheduled ${assignments.length} shifts for ${employees.length} employees`);
  return { 
    scheduled_count: assignments.length,
    employees_count: employees.length,
    shifts_count: shifts.length,
  };
}

async function getSchedule(supabase: any, request: ShiftScheduleRequest) {
  const { tenant_id, schedule_query } = request;
  if (!schedule_query) throw new Error('schedule_query is required');

  let query = supabase
    .from('shift_assignments')
    .select(`
      *,
      shifts:shift_id (name, start_time, end_time, color),
      employees:employee_id (full_name, employee_code, department)
    `)
    .eq('tenant_id', tenant_id)
    .gte('assignment_date', schedule_query.start_date)
    .lte('assignment_date', schedule_query.end_date)
    .order('assignment_date', { ascending: true });

  if (schedule_query.employee_id) {
    query = query.eq('employee_id', schedule_query.employee_id);
  }

  const { data, error } = await query;
  if (error) throw error;

  console.log(`[Shift Scheduler] Retrieved ${data?.length || 0} schedule entries`);
  return data;
}
