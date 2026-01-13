-- =====================================================
-- FASE 2 - DESCOBRIR: Database Schema
-- =====================================================

-- 1. Diagnostic Hub Results (personality, motivators, skills, maturity)
CREATE TABLE public.diagnostic_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  diagnostic_type TEXT NOT NULL, -- 'personality', 'motivators', 'transferable_skills', 'maturity'
  answers JSONB NOT NULL DEFAULT '{}',
  scores JSONB NOT NULL DEFAULT '{}',
  result_summary TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Career Wheel - Current vs Desired ratings
CREATE TABLE public.career_wheel_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dimension TEXT NOT NULL, -- 'satisfaction', 'purpose', 'growth', 'remuneration', 'lifestyle'
  current_rating INTEGER NOT NULL DEFAULT 5 CHECK (current_rating >= 1 AND current_rating <= 10),
  desired_rating INTEGER NOT NULL DEFAULT 10 CHECK (desired_rating >= 1 AND desired_rating <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, dimension)
);

-- 3. Self-Discovery Diary (7 days)
CREATE TABLE public.discovery_diary_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 7),
  question TEXT NOT NULL,
  response TEXT,
  emotional_reaction TEXT, -- 'excited', 'neutral', 'anxious', 'hopeful', 'confused'
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, day_number)
);

-- 4. Professional Timeline
CREATE TABLE public.professional_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_year INTEGER NOT NULL,
  event_title TEXT NOT NULL,
  event_description TEXT,
  event_type TEXT NOT NULL DEFAULT 'positive', -- 'positive', 'negative', 'neutral'
  learnings TEXT,
  ai_suggested_learning TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Skills Radar / Competencies
CREATE TABLE public.competency_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  competency_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'technical', 'behavioral', 'leadership', 'creative'
  self_rating INTEGER NOT NULL DEFAULT 5 CHECK (self_rating >= 1 AND self_rating <= 10),
  evidence TEXT,
  is_top_strength BOOLEAN DEFAULT false,
  is_neglected BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, competency_name)
);

-- 6. Profession Recommendations (AI-generated)
CREATE TABLE public.profession_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profession_name TEXT NOT NULL,
  profession_description TEXT,
  match_score INTEGER NOT NULL DEFAULT 0, -- 0-100
  match_reasons JSONB DEFAULT '[]',
  salary_range TEXT,
  growth_outlook TEXT,
  required_skills JSONB DEFAULT '[]',
  user_matching_skills JSONB DEFAULT '[]',
  skills_gap JSONB DEFAULT '[]',
  is_selected BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Clarity Report (Phase 2 Output)
CREATE TABLE public.clarity_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  professional_identity TEXT,
  core_motivators JSONB DEFAULT '[]',
  recommended_routes JSONB DEFAULT '[]', -- 2-3 career paths
  top_competencies JSONB DEFAULT '[]',
  areas_to_develop JSONB DEFAULT '[]',
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_wheel_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competency_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profession_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clarity_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for diagnostic_results
CREATE POLICY "Users can view own diagnostic results" ON public.diagnostic_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own diagnostic results" ON public.diagnostic_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own diagnostic results" ON public.diagnostic_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own diagnostic results" ON public.diagnostic_results FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for career_wheel_assessments
CREATE POLICY "Users can view own career wheel" ON public.career_wheel_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own career wheel" ON public.career_wheel_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own career wheel" ON public.career_wheel_assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own career wheel" ON public.career_wheel_assessments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for discovery_diary_entries
CREATE POLICY "Users can view own diary" ON public.discovery_diary_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own diary" ON public.discovery_diary_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own diary" ON public.discovery_diary_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own diary" ON public.discovery_diary_entries FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for professional_timeline
CREATE POLICY "Users can view own timeline" ON public.professional_timeline FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own timeline" ON public.professional_timeline FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own timeline" ON public.professional_timeline FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own timeline" ON public.professional_timeline FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for competency_assessments
CREATE POLICY "Users can view own competencies" ON public.competency_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own competencies" ON public.competency_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own competencies" ON public.competency_assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own competencies" ON public.competency_assessments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for profession_recommendations
CREATE POLICY "Users can view own recommendations" ON public.profession_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own recommendations" ON public.profession_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recommendations" ON public.profession_recommendations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recommendations" ON public.profession_recommendations FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for clarity_reports
CREATE POLICY "Users can view own clarity report" ON public.clarity_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own clarity report" ON public.clarity_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clarity report" ON public.clarity_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clarity report" ON public.clarity_reports FOR DELETE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_diagnostic_results_updated_at BEFORE UPDATE ON public.diagnostic_results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_career_wheel_updated_at BEFORE UPDATE ON public.career_wheel_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_diary_updated_at BEFORE UPDATE ON public.discovery_diary_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_timeline_updated_at BEFORE UPDATE ON public.professional_timeline FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_competency_updated_at BEFORE UPDATE ON public.competency_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profession_recs_updated_at BEFORE UPDATE ON public.profession_recommendations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clarity_report_updated_at BEFORE UPDATE ON public.clarity_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();