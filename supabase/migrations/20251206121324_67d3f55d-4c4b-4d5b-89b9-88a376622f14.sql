-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning',
  phase TEXT DEFAULT 'Discovery',
  progress INTEGER DEFAULT 0,
  start_date DATE,
  due_date DATE,
  budget NUMERIC,
  health_score INTEGER DEFAULT 100,
  team_members JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Project milestones
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Support tickets
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  project_id UUID REFERENCES public.projects(id),
  ticket_number TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  assigned_to UUID,
  sla_due_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ticket messages
CREATE TABLE public.ticket_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id UUID,
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Client files
CREATE TABLE public.client_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  project_id UUID REFERENCES public.projects(id),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  folder TEXT DEFAULT 'root',
  version INTEGER DEFAULT 1,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Meetings
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  project_id UUID REFERENCES public.projects(id),
  title TEXT NOT NULL,
  description TEXT,
  meeting_type TEXT DEFAULT 'client',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  meeting_link TEXT,
  notes TEXT,
  recording_url TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Feedback
CREATE TABLE public.client_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  project_id UUID REFERENCES public.projects(id),
  milestone_id UUID REFERENCES public.project_milestones(id),
  feedback_type TEXT DEFAULT 'general',
  rating INTEGER,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Leads table for CRM
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new',
  score INTEGER DEFAULT 0,
  notes TEXT,
  assigned_to UUID,
  converted_at TIMESTAMP WITH TIME ZONE,
  last_contact_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team members (internal)
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  availability TEXT DEFAULT 'available',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all projects" ON public.projects FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for milestones
CREATE POLICY "Users can view own milestones" ON public.project_milestones FOR SELECT 
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Admins can manage milestones" ON public.project_milestones FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for tickets
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage tickets" ON public.support_tickets FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for ticket messages
CREATE POLICY "Users can view ticket messages" ON public.ticket_messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = ticket_id AND (support_tickets.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can add messages to own tickets" ON public.ticket_messages FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = ticket_id AND support_tickets.user_id = auth.uid()));
CREATE POLICY "Admins can manage messages" ON public.ticket_messages FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for files
CREATE POLICY "Users can view own files" ON public.client_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload files" ON public.client_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own files" ON public.client_files FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage files" ON public.client_files FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for meetings
CREATE POLICY "Users can view own meetings" ON public.meetings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage meetings" ON public.meetings FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for feedback
CREATE POLICY "Users can view own feedback" ON public.client_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create feedback" ON public.client_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all feedback" ON public.client_feedback FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for leads
CREATE POLICY "Admins can manage leads" ON public.leads FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for team members
CREATE POLICY "Anyone can view team" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage team" ON public.team_members FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Generate ticket number function
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  seq_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 5) AS INTEGER)), 0) + 1
  INTO seq_num
  FROM public.support_tickets;
  
  new_number := 'TKT-' || LPAD(seq_num::TEXT, 5, '0');
  RETURN new_number;
END;
$$;

-- Storage bucket for client files
INSERT INTO storage.buckets (id, name, public) VALUES ('client-files', 'client-files', false);

-- Storage policies
CREATE POLICY "Users can upload own files" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'client-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own files" ON storage.objects FOR SELECT 
  USING (bucket_id = 'client-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE 
  USING (bucket_id = 'client-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can manage all files" ON storage.objects FOR ALL 
  USING (bucket_id = 'client-files' AND has_role(auth.uid(), 'admin'));