// Progress & Gamification Types

export type PhaseStatus = 'locked' | 'available' | 'in_progress' | 'completed';
export type ActivityType = 'lesson' | 'exercise' | 'checkpoint' | 'quiz' | 'reflection';
export type MissionType = 'daily' | 'weekly' | 'phase' | 'special';

export interface MigreiPhase {
  id: string;
  phase_number: number;
  name: string;
  slug: string;
  description: string | null;
  objective: string | null;
  level_name: string;
  level_description: string | null;
  icon_name: string | null;
  color: string | null;
  xp_to_complete: number;
  sort_order: number;
}

export interface PhaseActivity {
  id: string;
  phase_id: string;
  title: string;
  description: string | null;
  activity_type: ActivityType;
  is_checkpoint: boolean;
  is_required: boolean;
  xp_reward: number;
  sort_order: number;
  estimated_minutes: number | null;
}

export interface UserProgress {
  id: string;
  user_id: string;
  current_phase_id: string | null;
  current_phase_number: number;
  total_xp: number;
  current_level: number;
  streak_days: number;
  longest_streak: number;
  last_activity_at: string | null;
  journey_started_at: string;
}

export interface UserPhaseProgress {
  id: string;
  user_id: string;
  phase_id: string;
  status: PhaseStatus;
  progress_percentage: number;
  xp_earned: number;
  started_at: string | null;
  completed_at: string | null;
  time_spent_minutes: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  category: string;
  phase_id: string | null;
  xp_reward: number;
  is_phase_completion: boolean;
  is_master_badge: boolean;
  requirement_type: string;
  requirement_value: Record<string, unknown>;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  sort_order: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  mission_type: MissionType;
  phase_id: string | null;
  xp_reward: number;
  badge_id: string | null;
  requirement_type: string;
  requirement_value: Record<string, unknown>;
  is_active: boolean;
}

export interface UserMission {
  id: string;
  user_id: string;
  mission_id: string;
  progress: number;
  target: number;
  is_completed: boolean;
  completed_at: string | null;
  assigned_at: string;
  expires_at: string | null;
  mission?: Mission;
}

export interface XpTransaction {
  id: string;
  user_id: string;
  amount: number;
  source_type: string;
  source_id: string | null;
  phase_id: string | null;
  description: string | null;
  created_at: string;
}

export interface ProgressEvent {
  id: string;
  user_id: string;
  event_type: string;
  phase_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Combined types for UI
export interface PhaseWithProgress extends MigreiPhase {
  userProgress: UserPhaseProgress | null;
  activities: PhaseActivity[];
  completedActivities: number;
  totalActivities: number;
}

export interface UserProgressSummary {
  progress: UserProgress | null;
  currentPhase: MigreiPhase | null;
  phases: PhaseWithProgress[];
  totalXp: number;
  currentLevel: number;
  levelName: string;
  nextLevelXp: number;
  overallProgress: number;
  badges: UserBadge[];
  missions: UserMission[];
  streak: number;
}

export interface LevelInfo {
  level: number;
  name: string;
  description: string;
  minXp: number;
  maxXp: number;
  phaseNumber: number;
}

// Level definitions based on phases
export const LEVEL_DEFINITIONS: LevelInfo[] = [
  { level: 1, name: 'Explorador', description: 'Você está iniciando sua jornada', minXp: 0, maxXp: 1000, phaseNumber: 1 },
  { level: 2, name: 'Descobridor', description: 'Você está mapeando seus talentos', minXp: 1000, maxXp: 2500, phaseNumber: 2 },
  { level: 3, name: 'Estrategista', description: 'Você está traçando seu plano', minXp: 2500, maxXp: 4500, phaseNumber: 3 },
  { level: 4, name: 'Profissional em Transição', description: 'Você está construindo seu novo perfil', minXp: 4500, maxXp: 7000, phaseNumber: 4 },
  { level: 5, name: 'Profissional Posicionado', description: 'Você está conquistando seu espaço', minXp: 7000, maxXp: 10000, phaseNumber: 5 },
  { level: 6, name: 'Profissional Reposicionado', description: 'Você completou sua transição', minXp: 10000, maxXp: 15000, phaseNumber: 6 },
];

export function getLevelFromXp(xp: number): LevelInfo {
  for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_DEFINITIONS[i].minXp) {
      return LEVEL_DEFINITIONS[i];
    }
  }
  return LEVEL_DEFINITIONS[0];
}

export function getXpProgressInLevel(xp: number): { current: number; max: number; percentage: number } {
  const level = getLevelFromXp(xp);
  const nextLevel = LEVEL_DEFINITIONS.find(l => l.level === level.level + 1);
  const maxXp = nextLevel ? nextLevel.minXp : level.maxXp;
  const current = xp - level.minXp;
  const max = maxXp - level.minXp;
  return {
    current,
    max,
    percentage: Math.min(100, (current / max) * 100)
  };
}
