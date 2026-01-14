import { supabase } from '@/integrations/supabase/client';
import type { 
  MigreiPhase, 
  PhaseActivity, 
  UserProgress, 
  UserPhaseProgress,
  Badge,
  UserBadge,
  Mission,
  UserMission,
  PhaseStatus
} from '@/types/progress';
import type { RepositoryResult, RepositoryListResult } from './base.repository';

export class ProgressRepository {
  // Phases
  async getPhases(): Promise<RepositoryListResult<MigreiPhase>> {
    const { data, error } = await supabase
      .from('migrei_phases')
      .select('*')
      .order('phase_number');

    return { data: (data as MigreiPhase[]) || [], error };
  }

  // Activities
  async getActivities(): Promise<RepositoryListResult<PhaseActivity>> {
    const { data, error } = await supabase
      .from('phase_activities')
      .select('*')
      .order('sort_order');

    return { data: (data as PhaseActivity[]) || [], error };
  }

  // User Progress
  async getUserProgress(userId: string): Promise<RepositoryResult<UserProgress>> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return { data: data as UserProgress | null, error };
  }

  async createUserProgress(
    userId: string, 
    phaseId: string
  ): Promise<RepositoryResult<UserProgress>> {
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        current_phase_id: phaseId,
        current_phase_number: 1
      })
      .select()
      .single();

    return { data: data as UserProgress | null, error };
  }

  async updateUserProgress(
    userId: string, 
    updates: Partial<UserProgress>
  ): Promise<RepositoryResult<UserProgress>> {
    const { data, error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    return { data: data as UserProgress | null, error };
  }

  // Phase Progress
  async getPhaseProgress(userId: string): Promise<RepositoryListResult<UserPhaseProgress>> {
    const { data, error } = await supabase
      .from('user_phase_progress')
      .select('*')
      .eq('user_id', userId);

    return { data: (data as UserPhaseProgress[]) || [], error };
  }

  async initializePhaseProgress(
    userId: string, 
    phases: MigreiPhase[]
  ): Promise<{ error: Error | null }> {
    const inserts = phases.map((phase, index) => ({
      user_id: userId,
      phase_id: phase.id,
      status: (index === 0 ? 'available' : 'locked') as PhaseStatus
    }));

    const { error } = await supabase
      .from('user_phase_progress')
      .insert(inserts);

    return { error };
  }

  async updatePhaseProgress(
    userId: string,
    phaseId: string,
    updates: Partial<UserPhaseProgress>
  ): Promise<RepositoryResult<UserPhaseProgress>> {
    const { data, error } = await supabase
      .from('user_phase_progress')
      .update(updates)
      .eq('user_id', userId)
      .eq('phase_id', phaseId)
      .select()
      .single();

    return { data: data as UserPhaseProgress | null, error };
  }

  // Badges
  async getBadges(): Promise<RepositoryListResult<Badge>> {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('sort_order');

    return { data: (data as Badge[]) || [], error };
  }

  async getUserBadges(userId: string): Promise<RepositoryListResult<UserBadge>> {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badges(*)')
      .eq('user_id', userId);

    return { data: (data as UserBadge[]) || [], error };
  }

  async awardBadge(userId: string, badgeId: string): Promise<RepositoryResult<UserBadge>> {
    const { data, error } = await supabase
      .from('user_badges')
      .insert({ user_id: userId, badge_id: badgeId })
      .select()
      .single();

    return { data: data as UserBadge | null, error };
  }

  // Missions
  async getActiveMissions(): Promise<RepositoryListResult<Mission>> {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('is_active', true);

    return { data: (data as Mission[]) || [], error };
  }

  async getUserMissions(userId: string): Promise<RepositoryListResult<UserMission>> {
    const { data, error } = await supabase
      .from('user_missions')
      .select('*, missions(*)')
      .eq('user_id', userId);

    return { data: (data as UserMission[]) || [], error };
  }

  // Activity Completions
  async getCompletedActivityIds(userId: string): Promise<string[]> {
    const { data } = await supabase
      .from('user_activity_completions')
      .select('activity_id')
      .eq('user_id', userId);

    return data?.map(c => c.activity_id) || [];
  }

  async completeActivity(params: {
    userId: string;
    activityId: string;
    phaseId: string;
    xpEarned: number;
    timeSpentMinutes: number;
  }): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('user_activity_completions')
      .insert({
        user_id: params.userId,
        activity_id: params.activityId,
        phase_id: params.phaseId,
        xp_earned: params.xpEarned,
        time_spent_minutes: params.timeSpentMinutes
      });

    return { error };
  }

  // XP Transactions
  async addXpTransaction(params: {
    userId: string;
    amount: number;
    sourceType: string;
    sourceId: string;
    phaseId?: string;
    description: string;
  }): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('xp_transactions')
      .insert({
        user_id: params.userId,
        amount: params.amount,
        source_type: params.sourceType,
        source_id: params.sourceId,
        phase_id: params.phaseId,
        description: params.description
      });

    return { error };
  }

  // Progress Events
  async logEvent(params: {
    userId: string;
    eventType: string;
    phaseId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('progress_events')
      .insert([{
        user_id: params.userId,
        event_type: params.eventType,
        phase_id: params.phaseId,
        metadata: params.metadata as unknown as Record<string, never>
      }]);

    return { error };
  }
}

// Singleton instance
export const progressRepository = new ProgressRepository();
