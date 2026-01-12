-- Create enum for user subscription plans
CREATE TYPE public.subscription_plan AS ENUM ('free', 'premium');

-- Create user_roles table for plan management
CREATE TABLE public.user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_plans
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_plans
CREATE POLICY "Users can view own plan"
  ON public.user_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plan"
  ON public.user_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create mentors table
CREATE TABLE public.mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  expertise TEXT[] NOT NULL DEFAULT '{}',
  avatar_url TEXT,
  linkedin_url TEXT,
  years_experience INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on mentors
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

-- Mentors are publicly viewable
CREATE POLICY "Anyone can view active mentors"
  ON public.mentors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Mentors can update own profile"
  ON public.mentors FOR UPDATE
  USING (auth.uid() = user_id);

-- Create mentor availability slots
CREATE TABLE public.mentor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on mentor_availability
ALTER TABLE public.mentor_availability ENABLE ROW LEVEL SECURITY;

-- Anyone can view mentor availability
CREATE POLICY "Anyone can view mentor availability"
  ON public.mentor_availability FOR SELECT
  USING (true);

-- Mentors can manage their availability
CREATE POLICY "Mentors can manage own availability"
  ON public.mentor_availability FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.mentors 
      WHERE id = mentor_availability.mentor_id 
      AND user_id = auth.uid()
    )
  );

-- Create mentoring sessions table
CREATE TABLE public.mentoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE NOT NULL,
  mentee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  meeting_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on mentoring_sessions
ALTER TABLE public.mentoring_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions (as mentee or mentor)
CREATE POLICY "Users can view own sessions"
  ON public.mentoring_sessions FOR SELECT
  USING (
    auth.uid() = mentee_id OR 
    EXISTS (
      SELECT 1 FROM public.mentors 
      WHERE id = mentoring_sessions.mentor_id 
      AND user_id = auth.uid()
    )
  );

-- Premium users can insert sessions (limit checked in app)
CREATE POLICY "Users can book sessions"
  ON public.mentoring_sessions FOR INSERT
  WITH CHECK (auth.uid() = mentee_id);

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions"
  ON public.mentoring_sessions FOR UPDATE
  USING (
    auth.uid() = mentee_id OR 
    EXISTS (
      SELECT 1 FROM public.mentors 
      WHERE id = mentoring_sessions.mentor_id 
      AND user_id = auth.uid()
    )
  );

-- Function to count monthly sessions for a user
CREATE OR REPLACE FUNCTION public.count_monthly_sessions(user_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.mentoring_sessions
  WHERE mentee_id = user_uuid
    AND status != 'cancelled'
    AND scheduled_at >= date_trunc('month', CURRENT_DATE)
    AND scheduled_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
$$;

-- Function to check if user has premium plan
CREATE OR REPLACE FUNCTION public.has_premium_plan(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_plans
    WHERE user_id = user_uuid
      AND plan = 'premium'
  )
$$;

-- Triggers for updated_at
CREATE TRIGGER update_user_plans_updated_at
  BEFORE UPDATE ON public.user_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentors_updated_at
  BEFORE UPDATE ON public.mentors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentoring_sessions_updated_at
  BEFORE UPDATE ON public.mentoring_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create user plan on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_plans (user_id, plan)
  VALUES (new.id, 'free');
  
  RETURN new;
END;
$$;