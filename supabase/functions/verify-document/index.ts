import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * VERIFY-DOCUMENT Edge Function
 * =============================
 * 
 * PURPOSE: OCR processing and verification of uploaded documents
 * 
 * ENDPOINTS:
 *   POST /verify-document
 *     - action: 'submit' - Submit document for verification
 *     - action: 'extract' - Extract data from document (OCR)
 *     - action: 'verify' - Verify document authenticity
 *     - action: 'get-status' - Get verification status
 *     - action: 'list' - List all verifications
 * 
 * DOCUMENT TYPES: aadhaar, pan, passport, driving_license, voter_id, bank_statement, payslip
 * REQUIRED TABLES: document_verifications, document_extractions
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
      verification_id,
      document_type,
      document_url,
      document_number
    } = await req.json();

    console.log(`[verify-document] Action: ${action}, Document Type: ${document_type}`);

    switch (action) {
      case 'submit': {
        // Validate document type
        const validDocTypes = ['aadhaar', 'pan', 'passport', 'driving_license', 'voter_id', 'bank_statement', 'payslip'];
        if (!validDocTypes.includes(document_type)) {
          return new Response(JSON.stringify({
            error: `Invalid document type. Use: ${validDocTypes.join(', ')}`
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Generate verification ID
        const verificationNumber = `DOC-${Date.now().toString(36).toUpperCase()}`;

        // Create verification request
        const { data: verification, error } = await supabase
          .from('document_verifications')
          .insert({
            tenant_id,
            employee_id,
            verification_number: verificationNumber,
            document_type,
            document_url,
            document_number,
            status: 'pending',
            submitted_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;

        console.log(`[verify-document] Created verification: ${verificationNumber}`);

        return new Response(JSON.stringify({
          success: true,
          verification,
          message: `Document verification ${verificationNumber} submitted`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'extract': {
        // Simulate OCR extraction (in production, integrate with OCR service)
        // This would typically call an OCR API like Google Vision, AWS Textract, etc.

        const extractedData: Record<string, unknown> = {};

        switch (document_type) {
          case 'aadhaar':
            extractedData.name = 'John Doe';
            extractedData.aadhaar_number = 'XXXX-XXXX-1234';
            extractedData.dob = '1990-01-15';
            extractedData.gender = 'Male';
            extractedData.address = '123 Main Street, City, State - 123456';
            break;

          case 'pan':
            extractedData.name = 'John Doe';
            extractedData.pan_number = 'ABCDE1234F';
            extractedData.dob = '1990-01-15';
            extractedData.father_name = 'James Doe';
            break;

          case 'passport':
            extractedData.name = 'John Doe';
            extractedData.passport_number = 'A1234567';
            extractedData.nationality = 'Indian';
            extractedData.dob = '1990-01-15';
            extractedData.issue_date = '2020-01-01';
            extractedData.expiry_date = '2030-01-01';
            break;

          case 'driving_license':
            extractedData.name = 'John Doe';
            extractedData.license_number = 'DL-1234567890';
            extractedData.dob = '1990-01-15';
            extractedData.valid_until = '2025-01-15';
            extractedData.vehicle_class = 'LMV';
            break;

          case 'bank_statement':
            extractedData.account_holder = 'John Doe';
            extractedData.account_number = 'XXXX1234';
            extractedData.bank_name = 'Sample Bank';
            extractedData.ifsc_code = 'SBIN0001234';
            extractedData.statement_period = '2024-01 to 2024-03';
            break;

          case 'payslip':
            extractedData.employee_name = 'John Doe';
            extractedData.employee_id = 'EMP001';
            extractedData.month = 'December 2024';
            extractedData.gross_salary = 50000;
            extractedData.net_salary = 42000;
            extractedData.company_name = 'Sample Corp';
            break;

          default:
            extractedData.raw_text = 'Document content extracted';
        }

        // Store extraction results
        const { data: extraction, error } = await supabase
          .from('document_extractions')
          .insert({
            verification_id,
            document_type,
            extracted_data: extractedData,
            confidence_score: 0.95,
            extracted_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;

        // Update verification status
        await supabase
          .from('document_verifications')
          .update({
            status: 'extracted',
            extracted_at: new Date().toISOString()
          })
          .eq('id', verification_id);

        console.log(`[verify-document] Extracted data from ${document_type}`);

        return new Response(JSON.stringify({
          success: true,
          extraction,
          extracted_data: extractedData,
          confidence_score: 0.95
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'verify': {
        // Simulate verification (in production, call verification APIs)
        // This would typically validate document numbers with government databases

        const verificationResult = {
          is_valid: true,
          verification_method: 'database_check',
          verified_fields: ['name', 'document_number', 'dob'],
          confidence: 0.98,
          verified_at: new Date().toISOString()
        };

        // Update verification record
        const { error } = await supabase
          .from('document_verifications')
          .update({
            status: 'verified',
            is_valid: verificationResult.is_valid,
            verification_result: verificationResult,
            verified_at: new Date().toISOString()
          })
          .eq('id', verification_id);

        if (error) throw error;

        console.log(`[verify-document] Verified document: ${verification_id}`);

        return new Response(JSON.stringify({
          success: true,
          verification_result: verificationResult,
          message: 'Document verified successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get-status': {
        const { data: verification, error } = await supabase
          .from('document_verifications')
          .select('*, document_extractions(*), employees(full_name, email)')
          .eq('id', verification_id)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          verification
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'list': {
        let query = supabase
          .from('document_verifications')
          .select('*, employees(full_name, email)')
          .eq('tenant_id', tenant_id)
          .order('created_at', { ascending: false });

        if (employee_id) {
          query = query.eq('employee_id', employee_id);
        }

        const { data: verifications, error } = await query;

        if (error) throw error;

        // Summary stats
        const summary = {
          total: verifications?.length || 0,
          pending: verifications?.filter(v => v.status === 'pending').length || 0,
          extracted: verifications?.filter(v => v.status === 'extracted').length || 0,
          verified: verifications?.filter(v => v.status === 'verified').length || 0,
          failed: verifications?.filter(v => v.status === 'failed').length || 0
        };

        return new Response(JSON.stringify({
          success: true,
          verifications,
          summary
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({
          error: 'Invalid action. Use: submit, extract, verify, get-status, list'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[verify-document] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
