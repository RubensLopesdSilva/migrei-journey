// Fase 6 - Desfrutar Types

export interface ResultsEvaluation {
  id: string;
  user_id: string;
  dimension: string;
  before_score: number;
  after_score: number;
  reflection: string | null;
  created_at: string;
  updated_at: string;
}

export interface AchievementLine {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  achievement_type: string;
  phase_id: string | null;
  achieved_at: string;
  is_celebrated: boolean;
  created_at: string;
}

export interface FinalReport {
  id: string;
  user_id: string;
  journey_summary: string | null;
  key_learnings: string[];
  new_professional_identity: string | null;
  total_xp_earned: number;
  total_days: number;
  phases_completed: number;
  generated_at: string;
  updated_at: string;
}

export interface SymbolicCelebration {
  id: string;
  user_id: string;
  celebration_message: string | null;
  avatar_message: string | null;
  cycle_number: number;
  completed_at: string;
  next_cycle_started: boolean;
  created_at: string;
}

export interface CycleReentry {
  id: string;
  user_id: string;
  previous_cycle: number;
  new_cycle: number;
  next_level_goal: string | null;
  motivation: string | null;
  started_at: string;
  created_at: string;
}

export const EVALUATION_DIMENSIONS = [
  { key: 'clarity', label: 'Clareza de Propósito', description: 'Quanto você entende seu propósito profissional' },
  { key: 'confidence', label: 'Confiança Profissional', description: 'Seu nível de confiança em suas habilidades' },
  { key: 'network', label: 'Rede de Contatos', description: 'Qualidade e tamanho da sua rede profissional' },
  { key: 'skills', label: 'Competências Técnicas', description: 'Domínio das habilidades necessárias' },
  { key: 'positioning', label: 'Posicionamento de Mercado', description: 'Como você se posiciona no mercado' },
  { key: 'emotional', label: 'Equilíbrio Emocional', description: 'Sua resiliência e gestão emocional' },
];
