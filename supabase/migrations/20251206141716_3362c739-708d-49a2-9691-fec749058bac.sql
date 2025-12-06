
-- Service pricing table for admin-controlled pricing
CREATE TABLE public.service_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  service_category TEXT NOT NULL,
  plan_tier TEXT NOT NULL DEFAULT 'basic',
  base_price NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Service add-ons table
CREATE TABLE public.service_addons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pricing modifiers for client types and industries
CREATE TABLE public.pricing_modifiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  modifier_type TEXT NOT NULL,
  modifier_key TEXT NOT NULL,
  multiplier NUMERIC NOT NULL DEFAULT 1.0,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Coupon codes table
CREATE TABLE public.coupon_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC NOT NULL DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Onboarding sessions to track progress
CREATE TABLE public.onboarding_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL UNIQUE,
  user_id UUID,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  client_type TEXT NOT NULL,
  industry_type TEXT NOT NULL,
  industry_subtype TEXT,
  selected_services JSONB DEFAULT '[]'::jsonb,
  selected_addons JSONB DEFAULT '[]'::jsonb,
  quote_id UUID REFERENCES public.quotes(id),
  current_step INTEGER DEFAULT 1,
  consent_accepted JSONB DEFAULT '{}'::jsonb,
  verification_code TEXT,
  verification_sent_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'new',
  pricing_snapshot JSONB,
  assigned_pm UUID,
  assigned_team JSONB DEFAULT '[]'::jsonb,
  dashboard_tier TEXT DEFAULT 'basic',
  approval_notes TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Function to generate ATLAS Client ID
CREATE OR REPLACE FUNCTION public.generate_client_id()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_id TEXT;
  date_part TEXT;
  seq_num INTEGER;
BEGIN
  date_part := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  SELECT COALESCE(MAX(CAST(SUBSTRING(client_id FROM 15) AS INTEGER)), 0) + 1
  INTO seq_num
  FROM public.onboarding_sessions
  WHERE client_id LIKE 'ATLS-' || date_part || '-%';
  
  new_id := 'ATLS-' || date_part || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN new_id;
END;
$$;

-- Enable RLS
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_pricing
CREATE POLICY "Anyone can view active pricing" ON public.service_pricing
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage pricing" ON public.service_pricing
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for service_addons
CREATE POLICY "Anyone can view active addons" ON public.service_addons
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage addons" ON public.service_addons
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for pricing_modifiers
CREATE POLICY "Anyone can view active modifiers" ON public.pricing_modifiers
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage modifiers" ON public.pricing_modifiers
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for coupon_codes
CREATE POLICY "Anyone can view active coupons" ON public.coupon_codes
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage coupons" ON public.coupon_codes
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for onboarding_sessions
CREATE POLICY "Anyone can create onboarding" ON public.onboarding_sessions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own onboarding" ON public.onboarding_sessions
FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR user_id = auth.uid());

CREATE POLICY "Users can update own onboarding" ON public.onboarding_sessions
FOR UPDATE USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR user_id = auth.uid());

CREATE POLICY "Admins can manage all onboarding" ON public.onboarding_sessions
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default pricing data
INSERT INTO public.service_pricing (service_name, service_category, plan_tier, base_price, description, features) VALUES
('Digital Engineering', 'core', 'basic', 25000, 'Basic digital engineering services', '["Basic web development", "Mobile responsive design", "Standard support"]'),
('Digital Engineering', 'core', 'standard', 50000, 'Standard digital engineering services', '["Advanced web development", "Mobile apps", "API integration", "Priority support"]'),
('Digital Engineering', 'core', 'advanced', 100000, 'Advanced digital engineering services', '["Enterprise web solutions", "Cross-platform apps", "Custom APIs", "24/7 support"]'),
('Digital Engineering', 'core', 'enterprise', 0, 'Custom enterprise solutions', '["Custom development", "Dedicated team", "SLA guarantee", "Executive support"]'),
('AI & Intelligent Automation', 'core', 'basic', 35000, 'Basic AI automation', '["Chatbot integration", "Basic ML models", "Data analysis"]'),
('AI & Intelligent Automation', 'core', 'standard', 75000, 'Standard AI automation', '["Advanced chatbots", "Custom ML models", "Predictive analytics"]'),
('AI & Intelligent Automation', 'core', 'advanced', 150000, 'Advanced AI automation', '["Enterprise AI", "Deep learning", "Real-time analytics", "AI consulting"]'),
('Experience Design Studio', 'core', 'basic', 20000, 'Basic design services', '["UI design", "Basic UX research", "Design system"]'),
('Experience Design Studio', 'core', 'standard', 45000, 'Standard design services', '["Advanced UI/UX", "User testing", "Brand identity"]'),
('Experience Design Studio', 'core', 'advanced', 90000, 'Advanced design services', '["Enterprise design", "Design ops", "Multi-platform design"]'),
('Cloud & DevOps', 'core', 'basic', 30000, 'Basic cloud services', '["Cloud setup", "Basic CI/CD", "Monitoring"]'),
('Cloud & DevOps', 'core', 'standard', 60000, 'Standard cloud services', '["Multi-cloud", "Advanced DevOps", "Security scanning"]'),
('Cloud & DevOps', 'core', 'advanced', 120000, 'Advanced cloud services', '["Enterprise cloud", "Kubernetes", "24/7 monitoring"]'),
('Enterprise Consulting', 'core', 'basic', 40000, 'Basic consulting', '["Strategy review", "Process audit", "Recommendations"]'),
('Enterprise Consulting', 'core', 'standard', 80000, 'Standard consulting', '["Digital transformation", "Change management", "Training"]'),
('Enterprise Consulting', 'core', 'advanced', 160000, 'Advanced consulting', '["Enterprise transformation", "C-suite advisory", "Implementation"]'),
('Managed IT Services', 'core', 'basic', 15000, 'Basic managed IT', '["Help desk", "Basic maintenance", "Email support"]'),
('Managed IT Services', 'core', 'standard', 35000, 'Standard managed IT', '["24/7 support", "Proactive maintenance", "Security updates"]'),
('Managed IT Services', 'core', 'advanced', 70000, 'Advanced managed IT', '["Enterprise IT", "Dedicated team", "SLA guarantee"]'),
('Cybersecurity & Compliance', 'core', 'basic', 25000, 'Basic security', '["Security audit", "Basic compliance", "Training"]'),
('Cybersecurity & Compliance', 'core', 'standard', 55000, 'Standard security', '["Penetration testing", "Compliance management", "Incident response"]'),
('Cybersecurity & Compliance', 'core', 'advanced', 110000, 'Advanced security', '["Enterprise security", "SOC services", "24/7 monitoring"]'),
('Industry Solutions', 'core', 'basic', 30000, 'Basic industry solutions', '["Industry analysis", "Custom workflows", "Integration"]'),
('Industry Solutions', 'core', 'standard', 65000, 'Standard industry solutions', '["Industry automation", "Custom solutions", "Training"]'),
('Industry Solutions', 'core', 'advanced', 130000, 'Advanced industry solutions', '["Enterprise solutions", "Full customization", "Dedicated support"]');

-- Insert default add-ons
INSERT INTO public.service_addons (name, description, price, category) VALUES
('SEO Optimization', 'Search engine optimization package', 15000, 'marketing'),
('UI/UX Design Enhancement', 'Premium design package', 20000, 'design'),
('Cloud Support Package', '24/7 cloud monitoring and support', 25000, 'infrastructure'),
('AI Automation Pack', 'Additional AI automation features', 30000, 'ai'),
('DevOps Setup', 'Complete DevOps pipeline setup', 35000, 'infrastructure'),
('Security Audit', 'Comprehensive security audit', 20000, 'security'),
('Training Package', 'Team training and documentation', 15000, 'support'),
('Priority Support', '24/7 priority support access', 10000, 'support'),
('Data Analytics', 'Advanced data analytics dashboard', 25000, 'analytics'),
('Mobile App Add-on', 'Native mobile application', 40000, 'development');

-- Insert default pricing modifiers
INSERT INTO public.pricing_modifiers (modifier_type, modifier_key, multiplier, description) VALUES
('client_type', 'individual', 0.6, 'Individual client discount'),
('client_type', 'small_business', 0.8, 'Small business pricing'),
('client_type', 'msme', 1.0, 'MSME standard pricing'),
('client_type', 'startup', 1.2, 'Startup pricing'),
('client_type', 'enterprise', 1.5, 'Enterprise premium pricing'),
('industry', 'retail', 1.0, 'Retail standard pricing'),
('industry', 'healthcare', 1.1, 'Healthcare pricing'),
('industry', 'technology', 0.95, 'Technology discount'),
('industry', 'finance', 1.15, 'Finance premium pricing'),
('industry', 'education', 0.85, 'Education discount');
