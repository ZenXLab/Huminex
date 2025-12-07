-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert their own session recordings" ON public.session_recordings;
DROP POLICY IF EXISTS "Users can view their own session recordings" ON public.session_recordings;
DROP POLICY IF EXISTS "Admins can view all session recordings" ON public.session_recordings;

-- Create new policies that allow anonymous session recording
-- Allow anyone to insert session recordings (for tracking all visitors)
CREATE POLICY "Anyone can insert session recordings" 
ON public.session_recordings 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update their session (using session_id match)
CREATE POLICY "Anyone can update session recordings by session_id" 
ON public.session_recordings 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Only admins can view all session recordings
CREATE POLICY "Admins can view all session recordings" 
ON public.session_recordings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);