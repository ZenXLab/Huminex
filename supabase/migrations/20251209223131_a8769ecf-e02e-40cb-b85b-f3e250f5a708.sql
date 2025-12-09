-- Add columns for user identification and geolocation to session_recordings
ALTER TABLE public.session_recordings 
ADD COLUMN IF NOT EXISTS visitor_id text,
ADD COLUMN IF NOT EXISTS device_fingerprint text,
ADD COLUMN IF NOT EXISTS ip_address text,
ADD COLUMN IF NOT EXISTS geolocation jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS user_agent text,
ADD COLUMN IF NOT EXISTS pages_visited jsonb DEFAULT '[]'::jsonb;

-- Create index on visitor_id for grouping recordings by user
CREATE INDEX IF NOT EXISTS idx_session_recordings_visitor_id ON public.session_recordings(visitor_id);

-- Create index on ip_address for geo analytics
CREATE INDEX IF NOT EXISTS idx_session_recordings_ip_address ON public.session_recordings(ip_address);

-- Create index on session_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_session_recordings_session_id ON public.session_recordings(session_id);