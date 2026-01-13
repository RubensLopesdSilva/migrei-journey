// Types for Phase 1 - Despertar (Awakening)

export interface ConsciousnessQuestion {
  key: string;
  text: string;
  category: 'satisfaction' | 'future' | 'readiness';
}

export interface ConsciousnessResponse {
  id: string;
  user_id: string;
  question_key: string;
  question_text: string;
  response_value: number;
  response_text?: string;
  created_at: string;
}

export interface ReadinessAssessment {
  id: string;
  user_id: string;
  emotional_score: number;
  financial_score: number;
  professional_score: number;
  total_score: number;
  readiness_level: 'not_ready' | 'preparing' | 'ready';
  emotional_answers: ReadinessAnswer[];
  financial_answers: ReadinessAnswer[];
  professional_answers: ReadinessAnswer[];
  created_at: string;
}

export interface ReadinessAnswer {
  question: string;
  value: number;
  weight: number;
}

export interface PainMapItem {
  id: string;
  user_id: string;
  pain_type: 'hurts' | 'tires' | 'frustrates';
  description: string;
  intensity: number;
  created_at: string;
}

export interface CommitmentDeclaration {
  id: string;
  user_id: string;
  declaration_text: string;
  custom_text?: string;
  confirmed_at: string;
}

export interface CoachMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CoachConversation {
  id: string;
  user_id: string;
  phase_id?: string;
  context_type: string;
  messages: CoachMessage[];
  created_at: string;
}

// Consciousness questions for onboarding
export const CONSCIOUSNESS_QUESTIONS: ConsciousnessQuestion[] = [
  {
    key: 'career_satisfaction',
    text: 'Você está satisfeito com sua carreira atual?',
    category: 'satisfaction'
  },
  {
    key: 'energy_level',
    text: 'Você sente energia e motivação ao acordar para trabalhar?',
    category: 'satisfaction'
  },
  {
    key: 'five_year_vision',
    text: 'Você se vê fazendo isso daqui 5 anos?',
    category: 'future'
  },
  {
    key: 'growth_potential',
    text: 'Você enxerga potencial de crescimento na sua área atual?',
    category: 'future'
  },
  {
    key: 'change_readiness',
    text: 'Você está pronto para fazer mudanças significativas na sua carreira?',
    category: 'readiness'
  }
];

// Readiness test questions
export const READINESS_QUESTIONS = {
  emotional: [
    { question: 'Estou emocionalmente preparado para lidar com incertezas', weight: 1 },
    { question: 'Tenho apoio de família/amigos para essa mudança', weight: 1 },
    { question: 'Consigo lidar bem com rejeições e frustrações', weight: 1 },
    { question: 'Tenho clareza sobre o que me faz feliz profissionalmente', weight: 1.5 },
  ],
  financial: [
    { question: 'Tenho reserva financeira para pelo menos 6 meses', weight: 1.5 },
    { question: 'Posso reduzir gastos se necessário', weight: 1 },
    { question: 'Tenho outras fontes de renda ou suporte', weight: 1 },
    { question: 'Minhas dívidas estão controladas', weight: 1 },
  ],
  professional: [
    { question: 'Tenho habilidades que podem ser transferidas', weight: 1 },
    { question: 'Já pesquisei sobre a nova área de interesse', weight: 1.5 },
    { question: 'Tenho ou estou construindo uma rede de contatos', weight: 1 },
    { question: 'Estou disposto a começar de um nível mais baixo se necessário', weight: 1 },
  ]
};

export type ReadinessCategory = keyof typeof READINESS_QUESTIONS;
