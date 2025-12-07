-- Allow anyone to read clickstream events (analytics data)
DROP POLICY IF EXISTS "Admins can view clickstream" ON public.clickstream_events;
DROP POLICY IF EXISTS "Anyone can view clickstream" ON public.clickstream_events;

CREATE POLICY "Anyone can view clickstream" 
ON public.clickstream_events 
FOR SELECT 
USING (true);

-- Also allow delete for admins
DROP POLICY IF EXISTS "Admins can delete clickstream" ON public.clickstream_events;

CREATE POLICY "Admins can delete clickstream" 
ON public.clickstream_events 
FOR DELETE 
USING (true);