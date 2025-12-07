import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * RUN-PAYROLL Edge Function
 * ========================
 * 
 * PURPOSE: Process payroll runs, calculate salaries, deductions, and generate payslips
 * 
 * ENDPOINTS:
 *   POST /run-payroll
 *     - action: 'initiate' - Start a new payroll run
 *     - action: 'calculate' - Calculate salaries for all employees
 *     - action: 'approve' - Approve payroll run
 *     - action: 'process' - Process and generate payslips
 *     - action: 'get-summary' - Get payroll run summary
 * 
 * REQUIRED TABLES: payroll_runs, payslips, employees
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

    const { action, tenant_id, payroll_run_id, month, year, approved_by } = await req.json();

    console.log(`[run-payroll] Action: ${action}, Tenant: ${tenant_id}`);

    switch (action) {
      case 'initiate': {
        // Create new payroll run
        const runNumber = `PR-${year}${String(month).padStart(2, '0')}-${Date.now().toString(36).toUpperCase()}`;
        
        const { data: payrollRun, error } = await supabase
          .from('payroll_runs')
          .insert({
            tenant_id,
            run_number: runNumber,
            period_month: month,
            period_year: year,
            status: 'draft',
            total_gross: 0,
            total_deductions: 0,
            total_net: 0,
            employee_count: 0
          })
          .select()
          .single();

        if (error) throw error;

        console.log(`[run-payroll] Created payroll run: ${runNumber}`);
        
        return new Response(JSON.stringify({ 
          success: true, 
          payroll_run: payrollRun,
          message: `Payroll run ${runNumber} initiated successfully`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'calculate': {
        // Get all active employees for tenant
        const { data: employees, error: empError } = await supabase
          .from('employees')
          .select('*')
          .eq('tenant_id', tenant_id)
          .eq('employment_status', 'active');

        if (empError) throw empError;

        let totalGross = 0;
        let totalDeductions = 0;
        let totalNet = 0;
        const payslips = [];

        for (const employee of employees || []) {
          // Calculate salary components
          const basicSalary = employee.basic_salary || 0;
          const hra = basicSalary * 0.4; // 40% of basic
          const specialAllowance = basicSalary * 0.2; // 20% of basic
          const grossSalary = basicSalary + hra + specialAllowance;

          // Calculate deductions
          const pf = basicSalary * 0.12; // 12% PF
          const professionalTax = 200; // Fixed PT
          const tds = grossSalary > 50000 ? grossSalary * 0.1 : 0; // 10% TDS if > 50k
          const totalDeduction = pf + professionalTax + tds;

          const netSalary = grossSalary - totalDeduction;

          totalGross += grossSalary;
          totalDeductions += totalDeduction;
          totalNet += netSalary;

          payslips.push({
            payroll_run_id,
            employee_id: employee.id,
            tenant_id,
            basic_salary: basicSalary,
            hra,
            special_allowance: specialAllowance,
            gross_salary: grossSalary,
            pf_deduction: pf,
            professional_tax: professionalTax,
            tds,
            other_deductions: 0,
            total_deductions: totalDeduction,
            net_salary: netSalary,
            status: 'calculated'
          });
        }

        // Insert all payslips
        if (payslips.length > 0) {
          const { error: slipError } = await supabase
            .from('payslips')
            .insert(payslips);

          if (slipError) throw slipError;
        }

        // Update payroll run totals
        const { error: updateError } = await supabase
          .from('payroll_runs')
          .update({
            status: 'calculated',
            total_gross: totalGross,
            total_deductions: totalDeductions,
            total_net: totalNet,
            employee_count: employees?.length || 0,
            calculated_at: new Date().toISOString()
          })
          .eq('id', payroll_run_id);

        if (updateError) throw updateError;

        console.log(`[run-payroll] Calculated payroll for ${employees?.length} employees`);

        return new Response(JSON.stringify({
          success: true,
          summary: {
            employee_count: employees?.length || 0,
            total_gross: totalGross,
            total_deductions: totalDeductions,
            total_net: totalNet
          },
          message: `Calculated payroll for ${employees?.length} employees`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'approve': {
        const { error } = await supabase
          .from('payroll_runs')
          .update({
            status: 'approved',
            approved_by,
            approved_at: new Date().toISOString()
          })
          .eq('id', payroll_run_id);

        if (error) throw error;

        console.log(`[run-payroll] Payroll run approved: ${payroll_run_id}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'Payroll run approved successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'process': {
        // Update payroll run and payslips to processed
        const { error: runError } = await supabase
          .from('payroll_runs')
          .update({
            status: 'processed',
            processed_at: new Date().toISOString()
          })
          .eq('id', payroll_run_id);

        if (runError) throw runError;

        const { error: slipError } = await supabase
          .from('payslips')
          .update({ status: 'processed' })
          .eq('payroll_run_id', payroll_run_id);

        if (slipError) throw slipError;

        console.log(`[run-payroll] Payroll processed: ${payroll_run_id}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'Payroll processed successfully. Payslips generated.'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get-summary': {
        const { data: payrollRun, error } = await supabase
          .from('payroll_runs')
          .select('*, payslips(*)')
          .eq('id', payroll_run_id)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          payroll_run: payrollRun
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({ 
          error: 'Invalid action. Use: initiate, calculate, approve, process, get-summary' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[run-payroll] Error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
