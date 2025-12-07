import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * PROCESS-INSURANCE-CLAIM Edge Function
 * =====================================
 * 
 * PURPOSE: Submit and track employee insurance claim requests
 * 
 * ENDPOINTS:
 *   POST /process-insurance-claim
 *     - action: 'submit' - Submit new insurance claim
 *     - action: 'update-status' - Update claim status
 *     - action: 'approve' - Approve claim
 *     - action: 'reject' - Reject claim with reason
 *     - action: 'get-claim' - Get claim details
 *     - action: 'list' - List all claims for tenant/employee
 * 
 * CLAIM TYPES: medical, dental, vision, life, disability, accident
 * REQUIRED TABLES: insurance_claims, employees
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
      claim_id,
      claim_type,
      claim_amount,
      description,
      documents,
      approved_by,
      rejection_reason
    } = await req.json();

    console.log(`[process-insurance-claim] Action: ${action}, Tenant: ${tenant_id}`);

    switch (action) {
      case 'submit': {
        // Generate claim number
        const claimNumber = `CLM-${Date.now().toString(36).toUpperCase()}`;

        // Validate claim type
        const validClaimTypes = ['medical', 'dental', 'vision', 'life', 'disability', 'accident'];
        if (!validClaimTypes.includes(claim_type)) {
          return new Response(JSON.stringify({
            error: `Invalid claim type. Use: ${validClaimTypes.join(', ')}`
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Create insurance claim
        const { data: claim, error } = await supabase
          .from('insurance_claims')
          .insert({
            tenant_id,
            employee_id,
            claim_number: claimNumber,
            claim_type,
            claim_amount,
            description,
            documents: documents || [],
            status: 'submitted',
            submitted_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;

        console.log(`[process-insurance-claim] Created claim: ${claimNumber}`);

        return new Response(JSON.stringify({
          success: true,
          claim,
          message: `Insurance claim ${claimNumber} submitted successfully`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'update-status': {
        const { status } = await req.json();
        const validStatuses = ['submitted', 'under_review', 'approved', 'rejected', 'paid', 'cancelled'];

        if (!validStatuses.includes(status)) {
          return new Response(JSON.stringify({
            error: `Invalid status. Use: ${validStatuses.join(', ')}`
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { error } = await supabase
          .from('insurance_claims')
          .update({
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', claim_id);

        if (error) throw error;

        console.log(`[process-insurance-claim] Updated status to ${status}: ${claim_id}`);

        return new Response(JSON.stringify({
          success: true,
          message: `Claim status updated to ${status}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'approve': {
        const { approved_amount } = await req.json();

        const { error } = await supabase
          .from('insurance_claims')
          .update({
            status: 'approved',
            approved_amount: approved_amount || claim_amount,
            approved_by,
            approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', claim_id);

        if (error) throw error;

        console.log(`[process-insurance-claim] Approved claim: ${claim_id}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'Insurance claim approved successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'reject': {
        const { error } = await supabase
          .from('insurance_claims')
          .update({
            status: 'rejected',
            rejection_reason,
            rejected_by: approved_by,
            rejected_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', claim_id);

        if (error) throw error;

        console.log(`[process-insurance-claim] Rejected claim: ${claim_id}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'Insurance claim rejected'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get-claim': {
        const { data: claim, error } = await supabase
          .from('insurance_claims')
          .select('*, employees(full_name, email, employee_code)')
          .eq('id', claim_id)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          claim
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'list': {
        let query = supabase
          .from('insurance_claims')
          .select('*, employees(full_name, email, employee_code)')
          .eq('tenant_id', tenant_id)
          .order('created_at', { ascending: false });

        // Filter by employee if provided
        if (employee_id) {
          query = query.eq('employee_id', employee_id);
        }

        const { data: claims, error } = await query;

        if (error) throw error;

        // Calculate summary
        const summary = {
          total: claims?.length || 0,
          submitted: claims?.filter(c => c.status === 'submitted').length || 0,
          under_review: claims?.filter(c => c.status === 'under_review').length || 0,
          approved: claims?.filter(c => c.status === 'approved').length || 0,
          rejected: claims?.filter(c => c.status === 'rejected').length || 0,
          paid: claims?.filter(c => c.status === 'paid').length || 0,
          total_amount: claims?.reduce((sum, c) => sum + (c.claim_amount || 0), 0) || 0,
          approved_amount: claims?.filter(c => c.status === 'approved' || c.status === 'paid')
            .reduce((sum, c) => sum + (c.approved_amount || 0), 0) || 0
        };

        return new Response(JSON.stringify({
          success: true,
          claims,
          summary
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({
          error: 'Invalid action. Use: submit, update-status, approve, reject, get-claim, list'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[process-insurance-claim] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
