
-- Table for resume versions
CREATE TABLE public.user_resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  version_name TEXT NOT NULL DEFAULT 'Versão 1',
  target_area TEXT,
  personal_info JSONB DEFAULT '{}',
  professional_summary TEXT,
  experiences JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  languages JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for professional pitch
CREATE TABLE public.professional_pitches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  who_am_i TEXT,
  what_i_do TEXT,
  problem_i_solve TEXT,
  full_pitch TEXT,
  duration_seconds INTEGER,
  practice_count INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for LinkedIn checklist
CREATE TABLE public.linkedin_checklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_photo BOOLEAN DEFAULT false,
  banner_image BOOLEAN DEFAULT false,
  headline_optimized BOOLEAN DEFAULT false,
  headline_text TEXT,
  about_section BOOLEAN DEFAULT false,
  about_text TEXT,
  experience_updated BOOLEAN DEFAULT false,
  skills_added BOOLEAN DEFAULT false,
  keywords JSONB DEFAULT '[]',
  recommendations_count INTEGER DEFAULT 0,
  connections_count INTEGER DEFAULT 0,
  overall_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Table for portfolio projects
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_title TEXT NOT NULL,
  project_type TEXT NOT NULL, -- 'real' or 'simulated'
  description TEXT,
  skills_used JSONB DEFAULT '[]',
  results TEXT,
  image_url TEXT,
  project_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for development track items
CREATE TABLE public.development_track (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL, -- 'course', 'project', 'microchallenge'
  title TEXT NOT NULL,
  description TEXT,
  provider TEXT, -- for courses
  url TEXT,
  estimated_hours INTEGER,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for coach feedback in this phase
CREATE TABLE public.develop_coach_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feedback_type TEXT NOT NULL, -- 'resume', 'pitch', 'linkedin', 'portfolio', 'general'
  strengths JSONB DEFAULT '[]',
  improvements JSONB DEFAULT '[]',
  action_items JSONB DEFAULT '[]',
  overall_readiness INTEGER DEFAULT 0, -- 0-100
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_track ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.develop_coach_feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_resumes
CREATE POLICY "Users can view their own resumes" ON public.user_resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own resumes" ON public.user_resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resumes" ON public.user_resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resumes" ON public.user_resumes FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for professional_pitches
CREATE POLICY "Users can view their own pitches" ON public.professional_pitches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own pitches" ON public.professional_pitches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pitches" ON public.professional_pitches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pitches" ON public.professional_pitches FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for linkedin_checklist
CREATE POLICY "Users can view their own linkedin checklist" ON public.linkedin_checklist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own linkedin checklist" ON public.linkedin_checklist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own linkedin checklist" ON public.linkedin_checklist FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for portfolio_projects
CREATE POLICY "Users can view their own portfolio projects" ON public.portfolio_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own portfolio projects" ON public.portfolio_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own portfolio projects" ON public.portfolio_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own portfolio projects" ON public.portfolio_projects FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for development_track
CREATE POLICY "Users can view their own development track" ON public.development_track FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own development track items" ON public.development_track FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own development track items" ON public.development_track FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own development track items" ON public.development_track FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for develop_coach_feedback
CREATE POLICY "Users can view their own coach feedback" ON public.develop_coach_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own coach feedback" ON public.develop_coach_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update triggers
CREATE TRIGGER update_user_resumes_updated_at BEFORE UPDATE ON public.user_resumes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_professional_pitches_updated_at BEFORE UPDATE ON public.professional_pitches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_linkedin_checklist_updated_at BEFORE UPDATE ON public.linkedin_checklist FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portfolio_projects_updated_at BEFORE UPDATE ON public.portfolio_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_development_track_updated_at BEFORE UPDATE ON public.development_track FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
