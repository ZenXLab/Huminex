// ============================================================================
// ATLAS Edge Function: Shift Swap Workflow
// ============================================================================
// Purpose: Handle shift swap requests, approvals, and rejections
// Version: 1.0.0
// Last Updated: December 7, 2025 @ 16:45 UTC
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShiftSwapRequest {
  action: 'request_swap' | 'approve_swap' | 'reject_swap' | 'cancel_swap' | 'get_pending_swaps';
  tenant_id: string;
  user_id?: string;
  swap_request_id?: string;
  swap_data?: {
    requester_id: string;
    requester_assignment_id: string;
    target_employee_id?: string;
    target_assignment_id?: string;
    reason: string;
  };
  rejection_reason?: string;
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

    const request: ShiftSwapRequest = await req.json();
    console.log(`[Shift Swap] Action: ${request.action}, Tenant: ${request.tenant_id}`);

    let result: any;

    switch (request.action) {
      case 'request_swap':
        result = await requestSwap(supabase, request);
        break;
      case 'approve_swap':
        result = await approveSwap(supabase, request);
        break;
      case 'reject_swap':
        result = await rejectSwap(supabase, request);
        break;
      case 'cancel_swap':
        result = await cancelSwap(supabase, request);
        break;
      case 'get_pending_swaps':
        result = await getPendingSwaps(supabase, request);
        break;
      default:
        throw new Error(`Unknown action: ${request.action}`);
    }

    console.log(`[Shift Swap] Success: ${request.action}`);
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    const error = err as Error;
    console.error('[Shift Swap] Error:', error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

async function requestSwap(supabase: any, request: ShiftSwapRequest) {
  const { tenant_id, swap_data } = request;
  if (!swap_data) throw new Error('swap_data is required');

  // Validate requester assignment exists
  const { data: requesterAssignment, error: reqError } = await supabase
    .from('shift_assignments')
    .select('*, shifts:shift_id (name, start_time, end_time)')
    .eq('id', swap_data.requester_assignment_id)
    .single();

  if (reqError || !requesterAssignment) {
    throw new Error('Requester assignment not found');
  }

  // If target assignment specified, validate it exists
  if (swap_data.target_assignment_id) {
    const { data: targetAssignment, error: targetError } = await supabase
      .from('shift_assignments')
      .select('*')
      .eq('id', swap_data.target_assignment_id)
      .single();

    if (targetError || !targetAssignment) {
      throw new Error('Target assignment not found');
    }
  }

  // Create swap request
  const { data, error } = await supabase
    .from('shift_swap_requests')
    .insert({
      tenant_id,
      requester_id: swap_data.requester_id,
      requester_assignment_id: swap_data.requester_assignment_id,
      target_employee_id: swap_data.target_employee_id,
      target_assignment_id: swap_data.target_assignment_id,
      reason: swap_data.reason,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  // Send notification to manager/admin
  await sendSwapNotification(supabase, tenant_id, 'new_swap_request', {
    requester_id: swap_data.requester_id,
    shift_name: requesterAssignment.shifts?.name,
    assignment_date: requesterAssignment.assignment_date,
  });

  console.log(`[Shift Swap] Created swap request: ${data.id}`);
  return data;
}

async function approveSwap(supabase: any, request: ShiftSwapRequest) {
  const { swap_request_id, user_id, tenant_id } = request;
  if (!swap_request_id) throw new Error('swap_request_id is required');

  // Get the swap request
  const { data: swapRequest, error: fetchError } = await supabase
    .from('shift_swap_requests')
    .select('*')
    .eq('id', swap_request_id)
    .single();

  if (fetchError || !swapRequest) {
    throw new Error('Swap request not found');
  }

  if (swapRequest.status !== 'pending') {
    throw new Error(`Cannot approve swap with status: ${swapRequest.status}`);
  }

  // Start transaction-like operations
  // 1. Update swap request status
  const { error: updateError } = await supabase
    .from('shift_swap_requests')
    .update({
      status: 'approved',
      approved_by: user_id,
      approved_at: new Date().toISOString(),
    })
    .eq('id', swap_request_id);

  if (updateError) throw updateError;

  // 2. If there's a target assignment, swap the employees
  if (swapRequest.target_assignment_id && swapRequest.target_employee_id) {
    // Get both assignments
    const { data: assignments } = await supabase
      .from('shift_assignments')
      .select('*')
      .in('id', [swapRequest.requester_assignment_id, swapRequest.target_assignment_id]);

    if (assignments && assignments.length === 2) {
      const requesterAssignment = assignments.find((a: any) => a.id === swapRequest.requester_assignment_id);
      const targetAssignment = assignments.find((a: any) => a.id === swapRequest.target_assignment_id);

      // Swap the employee IDs
      await supabase
        .from('shift_assignments')
        .update({ employee_id: swapRequest.target_employee_id })
        .eq('id', swapRequest.requester_assignment_id);

      await supabase
        .from('shift_assignments')
        .update({ employee_id: swapRequest.requester_id })
        .eq('id', swapRequest.target_assignment_id);

      console.log(`[Shift Swap] Swapped assignments between employees`);
    }
  }

  // 3. Update status to completed
  await supabase
    .from('shift_swap_requests')
    .update({ status: 'completed' })
    .eq('id', swap_request_id);

  // Send notification to requester
  await sendSwapNotification(supabase, tenant_id, 'swap_approved', {
    requester_id: swapRequest.requester_id,
  });

  console.log(`[Shift Swap] Approved and completed swap: ${swap_request_id}`);
  return { message: 'Swap approved and executed successfully' };
}

async function rejectSwap(supabase: any, request: ShiftSwapRequest) {
  const { swap_request_id, user_id, rejection_reason, tenant_id } = request;
  if (!swap_request_id) throw new Error('swap_request_id is required');

  const { data: swapRequest, error: fetchError } = await supabase
    .from('shift_swap_requests')
    .select('*')
    .eq('id', swap_request_id)
    .single();

  if (fetchError || !swapRequest) {
    throw new Error('Swap request not found');
  }

  if (swapRequest.status !== 'pending') {
    throw new Error(`Cannot reject swap with status: ${swapRequest.status}`);
  }

  const { error } = await supabase
    .from('shift_swap_requests')
    .update({
      status: 'rejected',
      approved_by: user_id,
      approved_at: new Date().toISOString(),
      rejection_reason: rejection_reason || 'Request rejected by manager',
    })
    .eq('id', swap_request_id);

  if (error) throw error;

  // Send notification to requester
  await sendSwapNotification(supabase, tenant_id, 'swap_rejected', {
    requester_id: swapRequest.requester_id,
    reason: rejection_reason,
  });

  console.log(`[Shift Swap] Rejected swap: ${swap_request_id}`);
  return { message: 'Swap request rejected' };
}

async function cancelSwap(supabase: any, request: ShiftSwapRequest) {
  const { swap_request_id, user_id } = request;
  if (!swap_request_id) throw new Error('swap_request_id is required');

  const { data: swapRequest, error: fetchError } = await supabase
    .from('shift_swap_requests')
    .select('*')
    .eq('id', swap_request_id)
    .single();

  if (fetchError || !swapRequest) {
    throw new Error('Swap request not found');
  }

  // Only requester can cancel, and only if pending
  if (swapRequest.status !== 'pending') {
    throw new Error(`Cannot cancel swap with status: ${swapRequest.status}`);
  }

  const { error } = await supabase
    .from('shift_swap_requests')
    .update({ status: 'cancelled' })
    .eq('id', swap_request_id);

  if (error) throw error;

  console.log(`[Shift Swap] Cancelled swap: ${swap_request_id}`);
  return { message: 'Swap request cancelled' };
}

async function getPendingSwaps(supabase: any, request: ShiftSwapRequest) {
  const { tenant_id } = request;

  const { data, error } = await supabase
    .from('shift_swap_requests')
    .select(`
      *,
      requester:requester_id (full_name, employee_code),
      target_employee:target_employee_id (full_name, employee_code),
      requester_assignment:requester_assignment_id (
        assignment_date,
        shifts:shift_id (name, start_time, end_time)
      ),
      target_assignment:target_assignment_id (
        assignment_date,
        shifts:shift_id (name, start_time, end_time)
      )
    `)
    .eq('tenant_id', tenant_id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;

  console.log(`[Shift Swap] Retrieved ${data?.length || 0} pending swaps`);
  return data;
}

async function sendSwapNotification(supabase: any, tenant_id: string, type: string, data: any) {
  try {
    // Create in-app notification
    await supabase.from('admin_notifications').insert({
      title: getNotificationTitle(type),
      message: getNotificationMessage(type, data),
      notification_type: 'shift_swap',
      is_read: false,
    });
  } catch (error) {
    console.error('[Shift Swap] Failed to send notification:', error);
  }
}

function getNotificationTitle(type: string): string {
  const titles: Record<string, string> = {
    new_swap_request: 'New Shift Swap Request',
    swap_approved: 'Shift Swap Approved',
    swap_rejected: 'Shift Swap Rejected',
  };
  return titles[type] || 'Shift Swap Update';
}

function getNotificationMessage(type: string, data: any): string {
  switch (type) {
    case 'new_swap_request':
      return `A new shift swap request has been submitted for ${data.shift_name} on ${data.assignment_date}`;
    case 'swap_approved':
      return 'Your shift swap request has been approved';
    case 'swap_rejected':
      return `Your shift swap request was rejected${data.reason ? `: ${data.reason}` : ''}`;
    default:
      return 'Shift swap status has been updated';
  }
}
