-- Re-enable RLS on session_recordings
ALTER TABLE public.session_recordings ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can insert session recordings" ON public.session_recordings;
DROP POLICY IF EXISTS "Anyone can insert recordings" ON public.session_recordings;
DROP POLICY IF EXISTS "Anyone can update session recordings by session_id" ON public.session_recordings;
DROP POLICY IF EXISTS "Anyone can update own session recordings" ON public.session_recordings;
DROP POLICY IF EXISTS "Admins can view all session recordings" ON public.session_recordings;
DROP POLICY IF EXISTS "Admins can view recordings" ON public.session_recordings;

-- Create clean policies
-- Allow anonymous inserts (for tracking all visitors including non-authenticated)
CREATE POLICY "Allow anonymous session recording inserts" 
ON public.session_recordings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow updates by session_id (for updating ongoing sessions)
CREATE POLICY "Allow session recording updates" 
ON public.session_recordings 
FOR UPDATE 
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Only admins can view recordings
CREATE POLICY "Only admins can view session recordings" 
ON public.session_recordings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Only admins can delete recordings
CREATE POLICY "Only admins can delete session recordings" 
ON public.session_recordings 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));