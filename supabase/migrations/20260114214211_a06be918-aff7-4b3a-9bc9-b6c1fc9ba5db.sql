
-- Tabela para avaliação de resultados (antes vs depois)
CREATE TABLE public.results_evaluation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dimension TEXT NOT NULL,
  before_score INTEGER DEFAULT 0,
  after_score INTEGER DEFAULT 0,
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para linha de conquistas
CREATE TABLE public.achievements_line (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  achievement_type TEXT NOT NULL DEFAULT 'milestone',
  phase_id UUID REFERENCES public.migrei_phases(id),
  achieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_celebrated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para relatório final Migrei
CREATE TABLE public.final_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  journey_summary TEXT,
  key_learnings JSONB DEFAULT '[]'::jsonb,
  new_professional_identity TEXT,
  total_xp_earned INTEGER DEFAULT 0,
  total_days INTEGER DEFAULT 0,
  phases_completed INTEGER DEFAULT 0,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para celebração simbólica
CREATE TABLE public.symbolic_celebrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  celebration_message TEXT,
  avatar_message TEXT,
  cycle_number INTEGER DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_cycle_started BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para reentrada no círculo
CREATE TABLE public.cycle_reentries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  previous_cycle INTEGER NOT NULL,
  new_cycle INTEGER NOT NULL,
  next_level_goal TEXT,
  motivation TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.results_evaluation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements_line ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.final_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symbolic_celebrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_reentries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for results_evaluation
CREATE POLICY "Users can view their own results" ON public.results_evaluation FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own results" ON public.results_evaluation FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own results" ON public.results_evaluation FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own results" ON public.results_evaluation FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for achievements_line
CREATE POLICY "Users can view their own achievements" ON public.achievements_line FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON public.achievements_line FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own achievements" ON public.achievements_line FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own achievements" ON public.achievements_line FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for final_reports
CREATE POLICY "Users can view their own final reports" ON public.final_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own final reports" ON public.final_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own final reports" ON public.final_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own final reports" ON public.final_reports FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for symbolic_celebrations
CREATE POLICY "Users can view their own celebrations" ON public.symbolic_celebrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own celebrations" ON public.symbolic_celebrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own celebrations" ON public.symbolic_celebrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own celebrations" ON public.symbolic_celebrations FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for cycle_reentries
CREATE POLICY "Users can view their own cycle reentries" ON public.cycle_reentries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cycle reentries" ON public.cycle_reentries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cycle reentries" ON public.cycle_reentries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cycle reentries" ON public.cycle_reentries FOR DELETE USING (auth.uid() = user_id);

-- Update triggers
CREATE TRIGGER update_results_evaluation_updated_at BEFORE UPDATE ON public.results_evaluation FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_final_reports_updated_at BEFORE UPDATE ON public.final_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
