-- Fase 3 - Decidir: Tabelas para planejamento estratégico

-- Matriz de Possibilidades (rotas avaliadas)
CREATE TABLE public.possibility_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  route_name TEXT NOT NULL,
  passion_score INTEGER DEFAULT 0 CHECK (passion_score >= 0 AND passion_score <= 10),
  skill_score INTEGER DEFAULT 0 CHECK (skill_score >= 0 AND skill_score <= 10),
  market_score INTEGER DEFAULT 0 CHECK (market_score >= 0 AND market_score <= 10),
  total_score NUMERIC GENERATED ALWAYS AS ((passion_score + skill_score + market_score) / 3.0) STORED,
  transition_time_months INTEGER,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  financial_return TEXT,
  profile_fit_percentage INTEGER DEFAULT 0 CHECK (profile_fit_percentage >= 0 AND profile_fit_percentage <= 100),
  notes TEXT,
  is_selected BOOLEAN DEFAULT false,
  is_discarded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Meta SMART Profissional
CREATE TABLE public.smart_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  route_id UUID REFERENCES public.possibility_routes(id) ON DELETE SET NULL,
  goal_title TEXT NOT NULL,
  specific TEXT NOT NULL,
  measurable TEXT NOT NULL,
  achievable TEXT NOT NULL,
  relevant TEXT NOT NULL,
  time_bound TEXT NOT NULL,
  target_date DATE,
  is_validated BOOLEAN DEFAULT false,
  validation_feedback TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Plano de 90 Dias
CREATE TABLE public.plan_90_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_id UUID REFERENCES public.smart_goals(id) ON DELETE SET NULL,
  month_number INTEGER NOT NULL CHECK (month_number >= 1 AND month_number <= 3),
  month_theme TEXT NOT NULL,
  month_objective TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, goal_id, month_number)
);

-- Tarefas semanais do plano
CREATE TABLE public.plan_weekly_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_month_id UUID NOT NULL REFERENCES public.plan_90_days(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 4),
  task_title TEXT NOT NULL,
  task_description TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mapa de Lacunas
CREATE TABLE public.skills_gaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  route_id UUID REFERENCES public.possibility_routes(id) ON DELETE SET NULL,
  gap_type TEXT NOT NULL CHECK (gap_type IN ('technical', 'behavioral', 'positioning')),
  gap_name TEXT NOT NULL,
  current_level INTEGER DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 5),
  required_level INTEGER DEFAULT 5 CHECK (required_level >= 1 AND required_level <= 5),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  suggested_actions JSONB DEFAULT '[]'::jsonb,
  is_addressed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Checkpoint de Decisão
CREATE TABLE public.decision_checkpoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  selected_route_id UUID REFERENCES public.possibility_routes(id) ON DELETE SET NULL,
  decision_date TIMESTAMP WITH TIME ZONE,
  commitment_statement TEXT,
  discarded_routes JSONB DEFAULT '[]'::jsonb,
  confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 10),
  is_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.possibility_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_90_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_weekly_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_checkpoints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for possibility_routes
CREATE POLICY "Users can view their own routes" ON public.possibility_routes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own routes" ON public.possibility_routes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own routes" ON public.possibility_routes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own routes" ON public.possibility_routes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for smart_goals
CREATE POLICY "Users can view their own goals" ON public.smart_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.smart_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.smart_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.smart_goals FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for plan_90_days
CREATE POLICY "Users can view their own plans" ON public.plan_90_days FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own plans" ON public.plan_90_days FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own plans" ON public.plan_90_days FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own plans" ON public.plan_90_days FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for plan_weekly_tasks
CREATE POLICY "Users can view their own tasks" ON public.plan_weekly_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tasks" ON public.plan_weekly_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.plan_weekly_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.plan_weekly_tasks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for skills_gaps
CREATE POLICY "Users can view their own gaps" ON public.skills_gaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own gaps" ON public.skills_gaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own gaps" ON public.skills_gaps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own gaps" ON public.skills_gaps FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for decision_checkpoints
CREATE POLICY "Users can view their own checkpoint" ON public.decision_checkpoints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own checkpoint" ON public.decision_checkpoints FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own checkpoint" ON public.decision_checkpoints FOR UPDATE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_possibility_routes_updated_at BEFORE UPDATE ON public.possibility_routes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_smart_goals_updated_at BEFORE UPDATE ON public.smart_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_plan_90_days_updated_at BEFORE UPDATE ON public.plan_90_days FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_plan_weekly_tasks_updated_at BEFORE UPDATE ON public.plan_weekly_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_skills_gaps_updated_at BEFORE UPDATE ON public.skills_gaps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_decision_checkpoints_updated_at BEFORE UPDATE ON public.decision_checkpoints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();