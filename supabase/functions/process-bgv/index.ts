import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * PROCESS-BGV Edge Function
 * =========================
 * 
 * PURPOSE: Submit and track background verification requests
 * 
 * ENDPOINTS:
 *   POST /process-bgv
 *     - action: 'submit' - Submit new BGV request
 *     - action: 'update-status' - Update BGV status
 *     - action: 'get-status' - Get BGV request status
 *     - action: 'list' - List all BGV requests for tenant
 *     - action: 'complete' - Mark BGV as complete with results
 * 
 * BGV TYPES: identity, address, education, employment, criminal, credit
 * REQUIRED TABLES: bgv_requests, employees
 * AUTHENTICATION: Required (JWT)
 */

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { 
      action, 
      tenant_id, 
      employee_id, 
      bgv_request_id,
      verification_types,
      priority,
      status,
      verification_result,
      notes
    } = await req.json();

    console.log(`[process-bgv] Action: ${action}, Tenant: ${tenant_id}`);

    switch (action) {
      case 'submit': {
        // Generate request number
        const requestNumber = `BGV-${Date.now().toString(36).toUpperCase()}`;
        
        // Get employee details
        const { data: employee, error: empError } = await supabase
          .from('employees')
          .select('full_name, email, employee_code')
          .eq('id', employee_id)
          .single();

        if (empError) throw empError;

        // Create BGV request
        const { data: bgvRequest, error } = await supabase
          .from('bgv_requests')
          .insert({
            tenant_id,
            employee_id,
            request_number: requestNumber,
            verification_types: verification_types || ['identity', 'address', 'employment'],
            priority: priority || 'normal',
            status: 'pending',
            submitted_at: new Date().toISOString(),
            expected_completion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
          })
          .select()
          .single();

        if (error) throw error;

        console.log(`[process-bgv] Created BGV request: ${requestNumber} for ${employee?.full_name}`);

        return new Response(JSON.stringify({
          success: true,
          bgv_request: bgvRequest,
          message: `BGV request ${requestNumber} submitted successfully`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'update-status': {
        const validStatuses = ['pending', 'in_progress', 'completed', 'failed', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
          return new Response(JSON.stringify({
            error: `Invalid status. Use: ${validStatuses.join(', ')}`
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const updateData: Record<string, unknown> = {
          status,
          updated_at: new Date().toISOString()
        };

        if (status === 'in_progress') {
          updateData.started_at = new Date().toISOString();
        }

        if (status === 'completed' || status === 'failed') {
          updateData.completed_at = new Date().toISOString();
        }

        const { error } = await supabase
          .from('bgv_requests')
          .update(updateData)
          .eq('id', bgv_request_id);

        if (error) throw error;

        console.log(`[process-bgv] Updated status to ${status}: ${bgv_request_id}`);

        return new Response(JSON.stringify({
          success: true,
          message: `BGV request status updated to ${status}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'complete': {
        const { error } = await supabase
          .from('bgv_requests')
          .update({
            status: 'completed',
            verification_result: verification_result || 'clear',
            result_details: notes,
            completed_at: new Date().toISOString()
          })
          .eq('id', bgv_request_id);

        if (error) throw error;

        console.log(`[process-bgv] Completed BGV: ${bgv_request_id} with result: ${verification_result}`);

        return new Response(JSON.stringify({
          success: true,
          message: `BGV completed with result: ${verification_result}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get-status': {
        const { data: bgvRequest, error } = await supabase
          .from('bgv_requests')
          .select('*, employees(full_name, email, employee_code)')
          .eq('id', bgv_request_id)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          bgv_request: bgvRequest
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'list': {
        const { data: bgvRequests, error } = await supabase
          .from('bgv_requests')
          .select('*, employees(full_name, email, employee_code)')
          .eq('tenant_id', tenant_id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Calculate summary stats
        const summary = {
          total: bgvRequests?.length || 0,
          pending: bgvRequests?.filter(r => r.status === 'pending').length || 0,
          in_progress: bgvRequests?.filter(r => r.status === 'in_progress').length || 0,
          completed: bgvRequests?.filter(r => r.status === 'completed').length || 0,
          failed: bgvRequests?.filter(r => r.status === 'failed').length || 0
        };

        return new Response(JSON.stringify({
          success: true,
          bgv_requests: bgvRequests,
          summary
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({
          error: 'Invalid action. Use: submit, update-status, get-status, list, complete'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[process-bgv] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
