-- Create AI Agents table with predefined agents
CREATE TABLE public.ai_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  persona TEXT NOT NULL,
  description TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  background_color TEXT NOT NULL DEFAULT '#BBF7D0',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ai_agents (public read)
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

-- Everyone can read agents
CREATE POLICY "Agents are viewable by everyone"
ON public.ai_agents
FOR SELECT
USING (true);

-- Add agent_id to profiles table
ALTER TABLE public.profiles
ADD COLUMN agent_id UUID REFERENCES public.ai_agents(id);

-- Insert default agents (6 unique avatars based on the uploaded images)
INSERT INTO public.ai_agents (name, title, persona, description, avatar_url, background_color, sort_order) VALUES
('Lumi', 'Mentora Estratégica', 'strategic', 'Clara, objetiva e focada em decisões práticas. Te ajuda a ver o caminho com clareza.', '/agents/lumi.png', '#BBF7D0', 1),
('Noah', 'Coach Motivacional', 'motivational', 'Te incentiva a avançar mesmo quando bater insegurança. Energia positiva constante.', '/agents/noah.png', '#C4B5FD', 2),
('Ema', 'Orientadora Analítica', 'analytical', 'Transforma confusão em planos claros. Metodologia e estrutura para sua jornada.', '/agents/ema.png', '#FECACA', 3),
('Leo', 'Guia Empático', 'empathetic', 'Acolhe suas emoções e te ajuda a processar a transição com equilíbrio.', '/agents/leo.png', '#FED7AA', 4),
('Maya', 'Facilitadora Criativa', 'creative', 'Desperta novas perspectivas e te ajuda a pensar fora da caixa.', '/agents/maya.png', '#BAE6FD', 5),
('Kai', 'Mentor Prático', 'practical', 'Direto ao ponto, foca em ações concretas e resultados mensuráveis.', '/agents/kai.png', '#DDD6FE', 6);