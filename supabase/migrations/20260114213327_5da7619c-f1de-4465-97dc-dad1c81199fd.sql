
-- Create table for execution panel tracking
CREATE TABLE public.execution_panel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  panel_type VARCHAR(50) NOT NULL, -- 'job_application', 'networking', 'followup'
  title TEXT NOT NULL,
  company TEXT,
  contact_name TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'rejected'
  notes TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for opportunities diary
CREATE TABLE public.opportunities_diary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_type VARCHAR(50) NOT NULL, -- 'conversation', 'referral', 'selection_process'
  title TEXT NOT NULL,
  description TEXT,
  contact_name TEXT,
  company TEXT,
  outcome TEXT,
  next_steps TEXT,
  importance_level INTEGER DEFAULT 3, -- 1-5
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for networking routine
CREATE TABLE public.networking_routine (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- 'comment', 'connect', 'message'
  target_name TEXT,
  target_profile_url TEXT,
  action_description TEXT,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for interview simulations
CREATE TABLE public.interview_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  area VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  user_response TEXT,
  ai_feedback TEXT,
  score INTEGER, -- 1-10
  practiced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for weekly check-ins
CREATE TABLE public.weekly_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_start DATE NOT NULL,
  what_worked TEXT,
  what_blocked TEXT,
  suggested_adjustments TEXT,
  energy_level INTEGER DEFAULT 5, -- 1-10
  confidence_level INTEGER DEFAULT 5, -- 1-10
  goals_next_week TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Enable RLS on all tables
ALTER TABLE public.execution_panel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.networking_routine ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_checkins ENABLE ROW LEVEL SECURITY;

-- RLS policies for execution_panel
CREATE POLICY "Users can view their own execution panel items" ON public.execution_panel FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own execution panel items" ON public.execution_panel FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own execution panel items" ON public.execution_panel FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own execution panel items" ON public.execution_panel FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for opportunities_diary
CREATE POLICY "Users can view their own opportunities diary" ON public.opportunities_diary FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own opportunities diary entries" ON public.opportunities_diary FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own opportunities diary entries" ON public.opportunities_diary FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own opportunities diary entries" ON public.opportunities_diary FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for networking_routine
CREATE POLICY "Users can view their own networking routine" ON public.networking_routine FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own networking routine items" ON public.networking_routine FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own networking routine items" ON public.networking_routine FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own networking routine items" ON public.networking_routine FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for interview_simulations
CREATE POLICY "Users can view their own interview simulations" ON public.interview_simulations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own interview simulations" ON public.interview_simulations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own interview simulations" ON public.interview_simulations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own interview simulations" ON public.interview_simulations FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for weekly_checkins
CREATE POLICY "Users can view their own weekly checkins" ON public.weekly_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own weekly checkins" ON public.weekly_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own weekly checkins" ON public.weekly_checkins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own weekly checkins" ON public.weekly_checkins FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_execution_panel_updated_at BEFORE UPDATE ON public.execution_panel FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_opportunities_diary_updated_at BEFORE UPDATE ON public.opportunities_diary FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_interview_simulations_updated_at BEFORE UPDATE ON public.interview_simulations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_weekly_checkins_updated_at BEFORE UPDATE ON public.weekly_checkins FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
