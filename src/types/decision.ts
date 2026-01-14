// Fase 3 - Decidir Types

export type RiskLevel = 'low' | 'medium' | 'high';
export type GapType = 'technical' | 'behavioral' | 'positioning';
export type GapPriority = 'low' | 'medium' | 'high';
export type GoalStatus = 'draft' | 'active' | 'completed' | 'abandoned';

export interface PossibilityRoute {
  id: string;
  user_id: string;
  route_name: string;
  passion_score: number;
  skill_score: number;
  market_score: number;
  total_score: number;
  transition_time_months: number | null;
  risk_level: RiskLevel | null;
  financial_return: string | null;
  profile_fit_percentage: number;
  notes: string | null;
  is_selected: boolean;
  is_discarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface SmartGoal {
  id: string;
  user_id: string;
  route_id: string | null;
  goal_title: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  time_bound: string;
  target_date: string | null;
  is_validated: boolean;
  validation_feedback: string | null;
  status: GoalStatus;
  created_at: string;
  updated_at: string;
}

export interface Plan90Days {
  id: string;
  user_id: string;
  goal_id: string | null;
  month_number: number;
  month_theme: string;
  month_objective: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanWeeklyTask {
  id: string;
  plan_month_id: string;
  user_id: string;
  week_number: number;
  task_title: string;
  task_description: string | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillGap {
  id: string;
  user_id: string;
  route_id: string | null;
  gap_type: GapType;
  gap_name: string;
  current_level: number;
  required_level: number;
  priority: GapPriority;
  suggested_actions: SuggestedAction[];
  is_addressed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SuggestedAction {
  type: 'course' | 'practice' | 'project' | 'mentoring';
  title: string;
  description?: string;
  url?: string;
}

export interface DecisionCheckpoint {
  id: string;
  user_id: string;
  selected_route_id: string | null;
  decision_date: string | null;
  commitment_statement: string | null;
  discarded_routes: DiscardedRoute[];
  confidence_level: number | null;
  is_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiscardedRoute {
  route_id: string;
  route_name: string;
  reason: string;
}

// Constants
export const MONTH_THEMES = [
  { number: 1, name: 'Clareza e Base', description: 'Fundamentos e preparação inicial' },
  { number: 2, name: 'Construção', description: 'Desenvolvimento de habilidades e networking' },
  { number: 3, name: 'Exposição e Ação', description: 'Visibilidade e primeiras oportunidades' },
];

export const GAP_TYPE_LABELS: Record<GapType, string> = {
  technical: 'Técnica',
  behavioral: 'Comportamental',
  positioning: 'Posicionamento',
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: 'Baixo',
  medium: 'Médio',
  high: 'Alto',
};

export const PRIORITY_LABELS: Record<GapPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};
