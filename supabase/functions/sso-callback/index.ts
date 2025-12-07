import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * SSO-CALLBACK Edge Function
 * ==========================
 * 
 * PURPOSE: Handle SSO OAuth callbacks for Google, Microsoft, and Okta providers
 * 
 * ENDPOINTS:
 *   POST /sso-callback
 *     - action: 'initiate' - Start SSO flow, return auth URL
 *     - action: 'callback' - Handle OAuth callback with code
 *     - action: 'validate-state' - Validate state token
 * 
 * SUPPORTED PROVIDERS: google, microsoft, okta
 * REQUIRED TABLES: sso_states, profiles, client_tenant_users
 * AUTHENTICATION: Public (for callback handling)
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

    const { action, provider, tenant_id, state, code, redirect_uri } = await req.json();

    console.log(`[sso-callback] Action: ${action}, Provider: ${provider}`);

    switch (action) {
      case 'initiate': {
        // Generate state token for CSRF protection
        const stateToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min expiry

        // Store state in database
        const { error: stateError } = await supabase
          .from('sso_states')
          .insert({
            state_token: stateToken,
            provider,
            tenant_id,
            redirect_uri,
            expires_at: expiresAt,
            created_at: new Date().toISOString()
          });

        if (stateError) throw stateError;

        // Generate auth URL based on provider
        let authUrl = '';
        const encodedRedirect = encodeURIComponent(redirect_uri || `${supabaseUrl}/functions/v1/sso-callback`);

        switch (provider) {
          case 'google':
            // Note: In production, use actual Google OAuth credentials
            authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
              `client_id=YOUR_GOOGLE_CLIENT_ID&` +
              `redirect_uri=${encodedRedirect}&` +
              `response_type=code&` +
              `scope=openid email profile&` +
              `state=${stateToken}`;
            break;

          case 'microsoft':
            // Note: In production, use actual Microsoft OAuth credentials
            authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
              `client_id=YOUR_MICROSOFT_CLIENT_ID&` +
              `redirect_uri=${encodedRedirect}&` +
              `response_type=code&` +
              `scope=openid email profile&` +
              `state=${stateToken}`;
            break;

          case 'okta':
            // Note: In production, use actual Okta OAuth credentials
            authUrl = `https://YOUR_OKTA_DOMAIN.okta.com/oauth2/v1/authorize?` +
              `client_id=YOUR_OKTA_CLIENT_ID&` +
              `redirect_uri=${encodedRedirect}&` +
              `response_type=code&` +
              `scope=openid email profile&` +
              `state=${stateToken}`;
            break;

          default:
            return new Response(JSON.stringify({
              error: 'Invalid provider. Use: google, microsoft, okta'
            }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        console.log(`[sso-callback] Initiated SSO for ${provider}, state: ${stateToken}`);

        return new Response(JSON.stringify({
          success: true,
          auth_url: authUrl,
          state: stateToken,
          expires_at: expiresAt
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'validate-state': {
        // Validate state token exists and hasn't expired
        const { data: ssoState, error } = await supabase
          .from('sso_states')
          .select('*')
          .eq('state_token', state)
          .gt('expires_at', new Date().toISOString())
          .is('used_at', null)
          .single();

        if (error || !ssoState) {
          return new Response(JSON.stringify({
            success: false,
            valid: false,
            error: 'Invalid or expired state token'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({
          success: true,
          valid: true,
          provider: ssoState.provider,
          tenant_id: ssoState.tenant_id
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'callback': {
        // Validate state first
        const { data: ssoState, error: stateError } = await supabase
          .from('sso_states')
          .select('*')
          .eq('state_token', state)
          .gt('expires_at', new Date().toISOString())
          .is('used_at', null)
          .single();

        if (stateError || !ssoState) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid or expired state token'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Mark state as used
        await supabase
          .from('sso_states')
          .update({ used_at: new Date().toISOString() })
          .eq('state_token', state);

        // In production, exchange code for tokens and get user info
        // This is a simplified example - actual implementation would:
        // 1. Exchange authorization code for access token
        // 2. Fetch user profile from provider
        // 3. Create or update user in Supabase Auth
        // 4. Link to tenant

        console.log(`[sso-callback] Processing callback for ${ssoState.provider}`);

        // Simulated user info (replace with actual OAuth token exchange)
        const userInfo = {
          email: 'user@example.com',
          name: 'SSO User',
          provider: ssoState.provider,
          provider_id: crypto.randomUUID()
        };

        return new Response(JSON.stringify({
          success: true,
          message: 'SSO callback processed successfully',
          user: userInfo,
          tenant_id: ssoState.tenant_id,
          // In production, return session tokens here
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({
          error: 'Invalid action. Use: initiate, callback, validate-state'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[sso-callback] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
