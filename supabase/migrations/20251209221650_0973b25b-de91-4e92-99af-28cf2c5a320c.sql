-- Fix RLS policy for session_recordings to allow anonymous inserts
-- This is needed for session recording to work for unauthenticated users

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert session recordings" ON public.session_recordings;
DROP POLICY IF EXISTS "Anyone can view session recordings" ON public.session_recordings;
DROP POLICY IF EXISTS "Admins can delete session recordings" ON public.session_recordings;

-- Allow anyone to insert session recordings (anonymous users browsing the site)
CREATE POLICY "Anyone can insert session recordings"
ON public.session_recordings
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read session recordings (for replay in dashboard)
CREATE POLICY "Anyone can view session recordings"
ON public.session_recordings
FOR SELECT
USING (true);

-- Allow updates to session recordings (for appending events)
CREATE POLICY "Anyone can update session recordings"
ON public.session_recordings
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow deletes for admin cleanup
CREATE POLICY "Anyone can delete session recordings"
ON public.session_recordings
FOR DELETE
USING (true);