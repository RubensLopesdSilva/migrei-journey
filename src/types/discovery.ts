// Phase 2 - Discovery Types

export type DiagnosticType = 'personality' | 'motivators' | 'transferable_skills' | 'maturity';
export type EmotionalReaction = 'excited' | 'neutral' | 'anxious' | 'hopeful' | 'confused';
export type EventType = 'positive' | 'negative' | 'neutral';
export type CompetencyCategory = 'technical' | 'behavioral' | 'leadership' | 'creative';

export interface DiagnosticResult {
  id: string;
  user_id: string;
  diagnostic_type: DiagnosticType;
  answers: Record<string, unknown>;
  scores: Record<string, number>;
  result_summary: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CareerWheelAssessment {
  id: string;
  user_id: string;
  dimension: string;
  current_rating: number;
  desired_rating: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiaryEntry {
  id: string;
  user_id: string;
  day_number: number;
  question: string;
  response: string | null;
  emotional_reaction: EmotionalReaction | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  user_id: string;
  event_year: number;
  event_title: string;
  event_description: string | null;
  event_type: EventType;
  learnings: string | null;
  ai_suggested_learning: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CompetencyAssessment {
  id: string;
  user_id: string;
  competency_name: string;
  category: CompetencyCategory;
  self_rating: number;
  evidence: string | null;
  is_top_strength: boolean;
  is_neglected: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfessionRecommendation {
  id: string;
  user_id: string;
  profession_name: string;
  profession_description: string | null;
  match_score: number;
  match_reasons: string[];
  salary_range: string | null;
  growth_outlook: string | null;
  required_skills: string[];
  user_matching_skills: string[];
  skills_gap: string[];
  is_selected: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClarityReport {
  id: string;
  user_id: string;
  professional_identity: string | null;
  core_motivators: string[];
  recommended_routes: RecommendedRoute[];
  top_competencies: string[];
  areas_to_develop: string[];
  generated_at: string;
  updated_at: string;
}

export interface RecommendedRoute {
  route_name: string;
  description: string;
  next_steps: string[];
}

// Career Wheel Dimensions
export const CAREER_WHEEL_DIMENSIONS = [
  { key: 'satisfaction', label: 'Satisfação', description: 'Quão satisfeito você está com seu trabalho atual?' },
  { key: 'purpose', label: 'Propósito', description: 'Seu trabalho tem significado para você?' },
  { key: 'growth', label: 'Crescimento', description: 'Você sente que está evoluindo profissionalmente?' },
  { key: 'remuneration', label: 'Remuneração', description: 'Sua remuneração atende suas necessidades?' },
  { key: 'lifestyle', label: 'Estilo de Vida', description: 'Seu trabalho permite equilíbrio com a vida pessoal?' },
];

// Diary Questions (7 days)
export const DIARY_QUESTIONS = [
  { day: 1, question: 'Se você pudesse acordar amanhã fazendo qualquer trabalho, qual seria?' },
  { day: 2, question: 'Quais atividades te fazem perder a noção do tempo?' },
  { day: 3, question: 'O que você faria se dinheiro não fosse uma preocupação?' },
  { day: 4, question: 'Quais problemas do mundo você gostaria de ajudar a resolver?' },
  { day: 5, question: 'O que as pessoas sempre pedem sua ajuda ou conselho?' },
  { day: 6, question: 'Qual conquista profissional te deu mais orgulho?' },
  { day: 7, question: 'Como você quer ser lembrado profissionalmente?' },
];

// Diagnostic Tests Info
export const DIAGNOSTIC_TESTS = [
  {
    type: 'personality' as DiagnosticType,
    title: 'Personalidade / Temperamento',
    description: 'Descubra seu tipo de personalidade e como ele influencia suas escolhas profissionais',
    icon: 'Brain',
    questions: 15,
    estimatedTime: 10,
  },
  {
    type: 'motivators' as DiagnosticType,
    title: 'Motivadores Internos',
    description: 'Identifique o que realmente te move e te faz dar o melhor de si',
    icon: 'Heart',
    questions: 12,
    estimatedTime: 8,
  },
  {
    type: 'transferable_skills' as DiagnosticType,
    title: 'Habilidades Transferíveis',
    description: 'Mapeie suas habilidades que podem ser aplicadas em diferentes áreas',
    icon: 'Shuffle',
    questions: 18,
    estimatedTime: 12,
  },
  {
    type: 'maturity' as DiagnosticType,
    title: 'Maturidade Profissional',
    description: 'Avalie seu nível de maturidade e prontidão para transição',
    icon: 'TrendingUp',
    questions: 10,
    estimatedTime: 6,
  },
];

// Default Competencies for Radar
export const DEFAULT_COMPETENCIES = [
  { name: 'Comunicação', category: 'behavioral' as CompetencyCategory },
  { name: 'Liderança', category: 'leadership' as CompetencyCategory },
  { name: 'Resolução de Problemas', category: 'technical' as CompetencyCategory },
  { name: 'Trabalho em Equipe', category: 'behavioral' as CompetencyCategory },
  { name: 'Adaptabilidade', category: 'behavioral' as CompetencyCategory },
  { name: 'Criatividade', category: 'creative' as CompetencyCategory },
  { name: 'Gestão de Tempo', category: 'behavioral' as CompetencyCategory },
  { name: 'Pensamento Crítico', category: 'technical' as CompetencyCategory },
  { name: 'Inteligência Emocional', category: 'behavioral' as CompetencyCategory },
  { name: 'Visão Estratégica', category: 'leadership' as CompetencyCategory },
  { name: 'Negociação', category: 'behavioral' as CompetencyCategory },
  { name: 'Inovação', category: 'creative' as CompetencyCategory },
];
