-- Create function to log sidebar access changes
CREATE OR REPLACE FUNCTION public.log_sidebar_access_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert log entry when sidebar access is changed
  INSERT INTO public.sidebar_access_logs (
    tenant_id,
    admin_user_id,
    action_type,
    role_affected,
    module_id,
    previous_value,
    new_value,
    metadata
  ) VALUES (
    NEW.tenant_id,
    auth.uid(),
    'update',
    TG_ARGV[0], -- role from trigger argument
    NEW.module_id,
    NULL,
    NEW.is_enabled,
    jsonb_build_object('triggered_by', 'database_trigger')
  );
  
  RETURN NEW;
END;
$$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sidebar_access_logs_admin ON public.sidebar_access_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_sidebar_access_logs_role ON public.sidebar_access_logs(role_affected);
CREATE INDEX IF NOT EXISTS idx_sidebar_access_logs_action ON public.sidebar_access_logs(action_type);