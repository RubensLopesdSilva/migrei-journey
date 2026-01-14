import { z } from 'zod';

// Phase Status
export const PhaseStatusSchema = z.enum(['locked', 'available', 'in_progress', 'completed']);

// Activity Type
export const ActivityTypeSchema = z.enum(['lesson', 'exercise', 'checkpoint', 'quiz', 'reflection']);

// Mission Type
export const MissionTypeSchema = z.enum(['daily', 'weekly', 'phase', 'special']);

// Badge Rarity
export const BadgeRaritySchema = z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']);

// Migrei Phase
export const MigreiPhaseSchema = z.object({
  id: z.string().uuid(),
  phase_number: z.number().int().min(1).max(6),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  objective: z.string().nullable(),
  level_name: z.string().min(1),
  level_description: z.string().nullable(),
  icon_name: z.string().nullable(),
  color: z.string().nullable(),
  xp_to_complete: z.number().int().min(0),
  sort_order: z.number().int(),
});

// Phase Activity
export const PhaseActivitySchema = z.object({
  id: z.string().uuid(),
  phase_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().nullable(),
  activity_type: ActivityTypeSchema,
  is_checkpoint: z.boolean(),
  is_required: z.boolean(),
  xp_reward: z.number().int().min(0),
  sort_order: z.number().int(),
  estimated_minutes: z.number().int().nullable(),
});

// User Progress
export const UserProgressSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  current_phase_id: z.string().uuid().nullable(),
  current_phase_number: z.number().int().min(1).max(6),
  total_xp: z.number().int().min(0),
  current_level: z.number().int().min(1),
  streak_days: z.number().int().min(0),
  longest_streak: z.number().int().min(0),
  last_activity_at: z.string().datetime().nullable(),
  journey_started_at: z.string().datetime(),
});

// User Phase Progress
export const UserPhaseProgressSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  phase_id: z.string().uuid(),
  status: PhaseStatusSchema,
  progress_percentage: z.number().min(0).max(100),
  xp_earned: z.number().int().min(0),
  started_at: z.string().datetime().nullable(),
  completed_at: z.string().datetime().nullable(),
  time_spent_minutes: z.number().int().min(0),
});

// Badge
export const BadgeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
  icon_name: z.string().min(1),
  category: z.string().min(1),
  phase_id: z.string().uuid().nullable(),
  xp_reward: z.number().int().min(0),
  is_phase_completion: z.boolean(),
  is_master_badge: z.boolean(),
  requirement_type: z.string().min(1),
  requirement_value: z.record(z.unknown()),
  rarity: BadgeRaritySchema,
  sort_order: z.number().int(),
});

// User Badge
export const UserBadgeSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  badge_id: z.string().uuid(),
  earned_at: z.string().datetime(),
  badge: BadgeSchema.optional(),
});

// Mission
export const MissionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  mission_type: MissionTypeSchema,
  phase_id: z.string().uuid().nullable(),
  xp_reward: z.number().int().min(0),
  badge_id: z.string().uuid().nullable(),
  requirement_type: z.string().min(1),
  requirement_value: z.record(z.unknown()),
  is_active: z.boolean(),
});

// User Mission
export const UserMissionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  mission_id: z.string().uuid(),
  progress: z.number().int().min(0),
  target: z.number().int().min(1),
  is_completed: z.boolean(),
  completed_at: z.string().datetime().nullable(),
  assigned_at: z.string().datetime(),
  expires_at: z.string().datetime().nullable(),
  mission: MissionSchema.optional(),
});

// Complete Activity Input
export const CompleteActivityInputSchema = z.object({
  activityId: z.string().uuid(),
  phaseId: z.string().uuid(),
  timeSpent: z.number().int().min(0).default(0),
});

// Progress Summary
export const ProgressSummarySchema = z.object({
  totalXp: z.number().int().min(0),
  currentLevel: z.number().int().min(1),
  levelName: z.string(),
  nextLevelXp: z.number().int().min(0),
  overallProgress: z.number().min(0).max(100),
  streak: z.number().int().min(0),
});

// Type exports
export type MigreiPhaseInput = z.infer<typeof MigreiPhaseSchema>;
export type PhaseActivityInput = z.infer<typeof PhaseActivitySchema>;
export type UserProgressInput = z.infer<typeof UserProgressSchema>;
export type UserPhaseProgressInput = z.infer<typeof UserPhaseProgressSchema>;
export type BadgeInput = z.infer<typeof BadgeSchema>;
export type UserBadgeInput = z.infer<typeof UserBadgeSchema>;
export type MissionInput = z.infer<typeof MissionSchema>;
export type UserMissionInput = z.infer<typeof UserMissionSchema>;
export type CompleteActivityInput = z.infer<typeof CompleteActivityInputSchema>;
export type ProgressSummaryInput = z.infer<typeof ProgressSummarySchema>;

// Validation helpers
export function validatePhases(data: unknown[]): MigreiPhaseInput[] {
  return data.map(item => MigreiPhaseSchema.parse(item));
}

export function validateActivities(data: unknown[]): PhaseActivityInput[] {
  return data.map(item => PhaseActivitySchema.parse(item));
}

export function validateUserProgress(data: unknown): UserProgressInput | null {
  if (!data) return null;
  return UserProgressSchema.parse(data);
}

export function validateBadges(data: unknown[]): BadgeInput[] {
  return data.map(item => BadgeSchema.parse(item));
}

// Safe parse helpers (don't throw, return result)
export function safeParsePhase(data: unknown) {
  return MigreiPhaseSchema.safeParse(data);
}

export function safeParseActivity(data: unknown) {
  return PhaseActivitySchema.safeParse(data);
}

export function safeParseUserProgress(data: unknown) {
  return UserProgressSchema.safeParse(data);
}
