-- =============================================
-- FASE 1 - DESPERTAR: Tabelas de Onboarding
-- =============================================

-- Respostas de consciência (perguntas reflexivas do onboarding)
CREATE TABLE public.consciousness_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  question_text TEXT NOT NULL,
  response_value INTEGER NOT NULL CHECK (response_value BETWEEN 1 AND 10),
  response_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_key)
);

-- Teste de prontidão para transição
CREATE TABLE public.readiness_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  emotional_score INTEGER NOT NULL DEFAULT 0 CHECK (emotional_score BETWEEN 0 AND 100),
  financial_score INTEGER NOT NULL DEFAULT 0 CHECK (financial_score BETWEEN 0 AND 100),
  professional_score INTEGER NOT NULL DEFAULT 0 CHECK (professional_score BETWEEN 0 AND 100),
  total_score INTEGER GENERATED ALWAYS AS ((emotional_score + financial_score + professional_score) / 3) STORED,
  readiness_level TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN (emotional_score + financial_score + professional_score) / 3 < 40 THEN 'not_ready'
      WHEN (emotional_score + financial_score + professional_score) / 3 < 70 THEN 'preparing'
      ELSE 'ready'
    END
  ) STORED,
  emotional_answers JSONB DEFAULT '[]'::jsonb,
  financial_answers JSONB DEFAULT '[]'::jsonb,
  professional_answers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mapa de dor profissional
CREATE TABLE public.pain_map (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pain_type TEXT NOT NULL CHECK (pain_type IN ('hurts', 'tires', 'frustrates')),
  description TEXT NOT NULL,
  intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Declaração de compromisso
CREATE TABLE public.commitment_declarations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  declaration_text TEXT NOT NULL DEFAULT 'Eu assumo o compromisso de conduzir minha transição profissional',
  custom_text TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Conversas com Avatar Coach
CREATE TABLE public.coach_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES public.migrei_phases(id),
  context_type TEXT NOT NULL DEFAULT 'general',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para buscar conversas do usuário
CREATE INDEX idx_coach_conversations_user ON public.coach_conversations(user_id, phase_id);
CREATE INDEX idx_consciousness_responses_user ON public.consciousness_responses(user_id);
CREATE INDEX idx_pain_map_user ON public.pain_map(user_id);

-- Enable RLS
ALTER TABLE public.consciousness_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readiness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pain_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commitment_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can manage their consciousness responses"
ON public.consciousness_responses FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their readiness assessment"
ON public.readiness_assessments FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their pain map"
ON public.pain_map FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their commitment declaration"
ON public.commitment_declarations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their coach conversations"
ON public.coach_conversations FOR ALL USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_consciousness_responses_updated_at
BEFORE UPDATE ON public.consciousness_responses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_readiness_assessments_updated_at
BEFORE UPDATE ON public.readiness_assessments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coach_conversations_updated_at
BEFORE UPDATE ON public.coach_conversations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();