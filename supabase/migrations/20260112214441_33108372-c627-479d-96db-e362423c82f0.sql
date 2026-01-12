-- =============================================
-- MIGREI PROGRESS & GAMIFICATION SYSTEM
-- =============================================

-- Enum for phase status
CREATE TYPE public.phase_status AS ENUM ('locked', 'available', 'in_progress', 'completed');

-- Enum for activity type
CREATE TYPE public.activity_type AS ENUM ('lesson', 'exercise', 'checkpoint', 'quiz', 'reflection');

-- Enum for mission type
CREATE TYPE public.mission_type AS ENUM ('daily', 'weekly', 'phase', 'special');

-- =============================================
-- PHASES DEFINITION
-- =============================================
CREATE TABLE public.migrei_phases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_number integer NOT NULL UNIQUE CHECK (phase_number >= 1 AND phase_number <= 6),
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    objective text,
    level_name text NOT NULL,
    level_description text,
    icon_name text,
    color text,
    xp_to_complete integer NOT NULL DEFAULT 1000,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Insert the 6 Migrei phases
INSERT INTO public.migrei_phases (phase_number, name, slug, description, objective, level_name, level_description, icon_name, color, xp_to_complete, sort_order) VALUES
(1, 'Despertar', 'despertar', 'Percepção da necessidade de mudança e tomada de consciência', 'Reconhecer a necessidade de mudança e despertar para novas possibilidades', 'Explorador', 'Você está iniciando sua jornada de autodescoberta', 'Sunrise', '#F59E0B', 1000, 1),
(2, 'Descobrir', 'descobrir', 'Autoconhecimento, diagnóstico e clareza de propósito profissional', 'Desenvolver autoconhecimento profundo e clareza sobre seu propósito', 'Descobridor', 'Você está mapeando seus talentos e aspirações', 'Compass', '#8B5CF6', 1500, 2),
(3, 'Decidir', 'decidir', 'Definição estratégica da rota, metas e planejamento', 'Definir sua estratégia de transição com metas claras', 'Estrategista', 'Você está traçando seu plano de ação', 'Target', '#3B82F6', 2000, 3),
(4, 'Desenvolver', 'desenvolver', 'Construção de competências, reposicionamento e preparação', 'Desenvolver as competências necessárias para sua nova carreira', 'Profissional em Transição', 'Você está construindo seu novo perfil profissional', 'Wrench', '#10B981', 2500, 4),
(5, 'Deslanchar', 'deslanchar', 'Execução prática, networking e acesso a oportunidades', 'Executar seu plano e acessar novas oportunidades', 'Profissional Posicionado', 'Você está conquistando seu espaço no mercado', 'Rocket', '#F97316', 3000, 5),
(6, 'Desfrutar', 'desfrutar', 'Consolidação, celebração de resultados e avaliação para o próximo ciclo', 'Consolidar sua nova carreira e celebrar suas conquistas', 'Profissional Reposicionado', 'Você completou sua transição com sucesso', 'Trophy', '#EAB308', 2000, 6);

-- Enable RLS
ALTER TABLE public.migrei_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view phases" ON public.migrei_phases
FOR SELECT USING (true);

-- =============================================
-- PHASE ACTIVITIES
-- =============================================
CREATE TABLE public.phase_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_id uuid NOT NULL REFERENCES public.migrei_phases(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    activity_type activity_type NOT NULL DEFAULT 'lesson',
    is_checkpoint boolean NOT NULL DEFAULT false,
    is_required boolean NOT NULL DEFAULT true,
    xp_reward integer NOT NULL DEFAULT 100,
    sort_order integer NOT NULL DEFAULT 0,
    estimated_minutes integer DEFAULT 30,
    content_url text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.phase_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view activities" ON public.phase_activities
FOR SELECT USING (true);

-- =============================================
-- USER PROGRESS
-- =============================================
CREATE TABLE public.user_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_phase_id uuid REFERENCES public.migrei_phases(id),
    current_phase_number integer NOT NULL DEFAULT 1,
    total_xp integer NOT NULL DEFAULT 0,
    current_level integer NOT NULL DEFAULT 1,
    streak_days integer NOT NULL DEFAULT 0,
    longest_streak integer NOT NULL DEFAULT 0,
    last_activity_at timestamptz,
    journey_started_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.user_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- USER PHASE PROGRESS
-- =============================================
CREATE TABLE public.user_phase_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    phase_id uuid NOT NULL REFERENCES public.migrei_phases(id) ON DELETE CASCADE,
    status phase_status NOT NULL DEFAULT 'locked',
    progress_percentage integer NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    xp_earned integer NOT NULL DEFAULT 0,
    started_at timestamptz,
    completed_at timestamptz,
    time_spent_minutes integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, phase_id)
);

ALTER TABLE public.user_phase_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own phase progress" ON public.user_phase_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own phase progress" ON public.user_phase_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own phase progress" ON public.user_phase_progress
FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- USER ACTIVITY COMPLETIONS
-- =============================================
CREATE TABLE public.user_activity_completions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id uuid NOT NULL REFERENCES public.phase_activities(id) ON DELETE CASCADE,
    phase_id uuid NOT NULL REFERENCES public.migrei_phases(id) ON DELETE CASCADE,
    completed_at timestamptz NOT NULL DEFAULT now(),
    xp_earned integer NOT NULL DEFAULT 0,
    time_spent_minutes integer DEFAULT 0,
    notes text,
    UNIQUE(user_id, activity_id)
);

ALTER TABLE public.user_activity_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own completions" ON public.user_activity_completions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" ON public.user_activity_completions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- BADGES / ACHIEVEMENTS
-- =============================================
CREATE TABLE public.badges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text NOT NULL,
    icon_name text NOT NULL,
    category text NOT NULL DEFAULT 'general',
    phase_id uuid REFERENCES public.migrei_phases(id),
    xp_reward integer NOT NULL DEFAULT 50,
    is_phase_completion boolean NOT NULL DEFAULT false,
    is_master_badge boolean NOT NULL DEFAULT false,
    requirement_type text NOT NULL,
    requirement_value jsonb NOT NULL DEFAULT '{}'::jsonb,
    rarity text NOT NULL DEFAULT 'common',
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges" ON public.badges
FOR SELECT USING (true);

-- Insert phase completion badges
INSERT INTO public.badges (name, description, icon_name, category, phase_id, xp_reward, is_phase_completion, requirement_type, requirement_value, rarity, sort_order)
SELECT 
    'Mestre ' || name,
    'Concluiu a fase ' || name || ' com sucesso',
    icon_name,
    'phase',
    id,
    500,
    true,
    'phase_completion',
    jsonb_build_object('phase_id', id),
    'rare',
    phase_number
FROM public.migrei_phases;

-- Insert master badge
INSERT INTO public.badges (name, description, icon_name, category, xp_reward, is_master_badge, requirement_type, requirement_value, rarity, sort_order) VALUES
('Mestre Migrei', 'Completou todas as 6 fases da jornada Migrei', 'Crown', 'master', 2000, true, 'all_phases_completed', '{"phases_required": 6}'::jsonb, 'legendary', 100);

-- Insert streak badges
INSERT INTO public.badges (name, description, icon_name, category, xp_reward, requirement_type, requirement_value, rarity, sort_order) VALUES
('Primeiro Passo', 'Completou sua primeira atividade', 'Footprints', 'milestone', 25, 'activities_completed', '{"count": 1}'::jsonb, 'common', 1),
('Consistente', 'Manteve uma sequência de 7 dias', 'Flame', 'streak', 100, 'streak_days', '{"days": 7}'::jsonb, 'uncommon', 10),
('Dedicado', 'Manteve uma sequência de 30 dias', 'Fire', 'streak', 300, 'streak_days', '{"days": 30}'::jsonb, 'rare', 11),
('Imparável', 'Manteve uma sequência de 100 dias', 'Zap', 'streak', 1000, 'streak_days', '{"days": 100}'::jsonb, 'epic', 12),
('Maratonista', 'Completou 50 atividades', 'Medal', 'milestone', 200, 'activities_completed', '{"count": 50}'::jsonb, 'uncommon', 20),
('Especialista', 'Completou 100 atividades', 'Award', 'milestone', 500, 'activities_completed', '{"count": 100}'::jsonb, 'rare', 21);

-- =============================================
-- USER BADGES
-- =============================================
CREATE TABLE public.user_badges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges" ON public.user_badges
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON public.user_badges
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- MISSIONS
-- =============================================
CREATE TABLE public.missions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text NOT NULL,
    mission_type mission_type NOT NULL DEFAULT 'weekly',
    phase_id uuid REFERENCES public.migrei_phases(id),
    xp_reward integer NOT NULL DEFAULT 100,
    badge_id uuid REFERENCES public.badges(id),
    requirement_type text NOT NULL,
    requirement_value jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_active boolean NOT NULL DEFAULT true,
    starts_at timestamptz,
    ends_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active missions" ON public.missions
FOR SELECT USING (is_active = true);

-- Insert sample missions
INSERT INTO public.missions (title, description, mission_type, xp_reward, requirement_type, requirement_value) VALUES
('Primeira Semana', 'Complete 3 atividades esta semana', 'weekly', 150, 'weekly_activities', '{"count": 3}'::jsonb),
('Explorador Consistente', 'Acesse a plataforma por 5 dias consecutivos', 'weekly', 200, 'consecutive_days', '{"days": 5}'::jsonb),
('Reflexão Profunda', 'Complete todas as atividades de reflexão da fase atual', 'phase', 300, 'phase_reflections', '{"all": true}'::jsonb);

-- =============================================
-- USER MISSIONS
-- =============================================
CREATE TABLE public.user_missions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_id uuid NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    progress integer NOT NULL DEFAULT 0,
    target integer NOT NULL DEFAULT 1,
    is_completed boolean NOT NULL DEFAULT false,
    completed_at timestamptz,
    assigned_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz,
    UNIQUE(user_id, mission_id)
);

ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own missions" ON public.user_missions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own missions" ON public.user_missions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own missions" ON public.user_missions
FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- XP TRANSACTIONS (HISTORY)
-- =============================================
CREATE TABLE public.xp_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    source_type text NOT NULL,
    source_id uuid,
    phase_id uuid REFERENCES public.migrei_phases(id),
    description text,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own xp transactions" ON public.xp_transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own xp transactions" ON public.xp_transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- PROGRESS EVENTS (FOR ANALYTICS)
-- =============================================
CREATE TABLE public.progress_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type text NOT NULL,
    phase_id uuid REFERENCES public.migrei_phases(id),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.progress_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events" ON public.progress_events
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON public.progress_events
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to initialize user progress
CREATE OR REPLACE FUNCTION public.initialize_user_progress()
RETURNS TRIGGER AS $$
DECLARE
    first_phase_id uuid;
BEGIN
    -- Get the first phase
    SELECT id INTO first_phase_id FROM public.migrei_phases WHERE phase_number = 1;
    
    -- Create user progress record
    INSERT INTO public.user_progress (user_id, current_phase_id, current_phase_number)
    VALUES (NEW.id, first_phase_id, 1)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Initialize phase progress for all phases
    INSERT INTO public.user_phase_progress (user_id, phase_id, status)
    SELECT NEW.id, id, 
        CASE WHEN phase_number = 1 THEN 'available'::phase_status ELSE 'locked'::phase_status END
    FROM public.migrei_phases
    ON CONFLICT (user_id, phase_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to initialize progress on user creation
CREATE TRIGGER on_auth_user_created_init_progress
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.initialize_user_progress();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_progress_updated_at();

CREATE TRIGGER update_user_phase_progress_updated_at
    BEFORE UPDATE ON public.user_phase_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_progress_updated_at();

-- =============================================
-- SAMPLE ACTIVITIES FOR EACH PHASE
-- =============================================
INSERT INTO public.phase_activities (phase_id, title, description, activity_type, is_checkpoint, xp_reward, sort_order, estimated_minutes)
SELECT 
    p.id,
    'Introdução à fase ' || p.name,
    'Entenda os objetivos e o que você vai aprender nesta fase',
    'lesson',
    false,
    50,
    1,
    15
FROM public.migrei_phases p;

INSERT INTO public.phase_activities (phase_id, title, description, activity_type, is_checkpoint, xp_reward, sort_order, estimated_minutes)
SELECT 
    p.id,
    'Reflexão: ' || p.name,
    'Reflita sobre sua situação atual em relação a esta fase',
    'reflection',
    false,
    100,
    2,
    30
FROM public.migrei_phases p;

INSERT INTO public.phase_activities (phase_id, title, description, activity_type, is_checkpoint, is_required, xp_reward, sort_order, estimated_minutes)
SELECT 
    p.id,
    'Checkpoint: Validação ' || p.name,
    'Valide seu progresso nesta fase antes de avançar',
    'checkpoint',
    true,
    true,
    200,
    10,
    45
FROM public.migrei_phases p;