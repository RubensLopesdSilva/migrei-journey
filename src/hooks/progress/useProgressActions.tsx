import { useCallback } from 'react';
import { progressRepository } from '@/lib/repositories';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { 
  PhaseActivity, 
  UserProgress, 
  UserPhaseProgress,
  Badge,
  UserBadge,
  MigreiPhase
} from '@/types/progress';
import { CompleteActivityInputSchema } from '@/lib/schemas/progress.schema';

interface UseProgressActionsProps {
  activities: PhaseActivity[];
  phases: MigreiPhase[];
  badges: Badge[];
  userBadges: UserBadge[];
  userProgress: UserProgress | null;
  phaseProgress: UserPhaseProgress[];
  completedActivities: string[];
  onRefetch: () => Promise<void>;
}

/**
 * Hook for progress-related actions (completing activities, starting phases, etc.)
 * Contains all business logic for progress mutations
 */
export function useProgressActions({
  activities,
  phases,
  badges,
  userBadges,
  userProgress,
  phaseProgress,
  completedActivities,
  onRefetch,
}: UseProgressActionsProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Award a badge to the user
   */
  const awardBadge = useCallback(async (badgeId: string) => {
    if (!user) return;

    const badge = badges.find(b => b.id === badgeId);
    if (!badge) return;

    // Check if already has badge
    if (userBadges.some(ub => ub.badge_id === badgeId)) return;

    try {
      await progressRepository.awardBadge(user.id, badgeId);

      // Add XP for badge
      await progressRepository.addXpTransaction({
        userId: user.id,
        amount: badge.xp_reward,
        sourceType: 'badge',
        sourceId: badgeId,
        description: `Badge: ${badge.name}`,
      });

      // Update total XP
      await progressRepository.updateUserProgress(user.id, {
        total_xp: (userProgress?.total_xp || 0) + badge.xp_reward,
      });

      toast({
        title: '🏆 Nova Conquista!',
        description: `Você desbloqueou: ${badge.name}`,
      });
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  }, [user, badges, userBadges, userProgress, toast]);

  /**
   * Check and award any unlocked badges
   */
  const checkBadgeUnlocks = useCallback(async (
    totalXp: number, 
    activitiesCount: number
  ) => {
    if (!user) return;

    for (const badge of badges) {
      if (userBadges.some(ub => ub.badge_id === badge.id)) continue;

      const req = badge.requirement_value as Record<string, number>;

      switch (badge.requirement_type) {
        case 'activities_completed':
          if (activitiesCount >= (req.count || 0)) {
            await awardBadge(badge.id);
          }
          break;
        case 'streak_days':
          if ((userProgress?.streak_days || 0) >= (req.days || 0)) {
            await awardBadge(badge.id);
          }
          break;
      }
    }
  }, [user, badges, userBadges, userProgress, awardBadge]);

  /**
   * Handle phase completion
   */
  const handlePhaseCompletion = useCallback(async (phaseId: string) => {
    if (!user) return;

    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return;

    // Mark phase as completed
    await progressRepository.updatePhaseProgress(user.id, phaseId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
    });

    // Unlock next phase
    const nextPhase = phases.find(p => p.phase_number === phase.phase_number + 1);
    if (nextPhase) {
      await progressRepository.updatePhaseProgress(user.id, nextPhase.id, {
        status: 'available',
        started_at: new Date().toISOString(),
      });

      await progressRepository.updateUserProgress(user.id, {
        current_phase_id: nextPhase.id,
        current_phase_number: nextPhase.phase_number,
      });
    }

    // Award phase completion badge
    const phaseBadge = badges.find(b => 
      b.is_phase_completion && b.phase_id === phaseId
    );
    if (phaseBadge) {
      await awardBadge(phaseBadge.id);
    }

    // Log event
    await progressRepository.logEvent({
      userId: user.id,
      eventType: 'phase_completed',
      phaseId,
      metadata: { phase_number: phase.phase_number, phase_name: phase.name },
    });

    toast({
      title: '🎉 Fase Concluída!',
      description: `Você completou a fase ${phase.name}!`,
    });
  }, [user, phases, badges, awardBadge, toast]);

  /**
   * Complete an activity
   */
  const completeActivity = useCallback(async (
    activityId: string, 
    phaseId: string, 
    timeSpent: number = 0
  ) => {
    if (!user) return;

    // Validate input
    const validation = CompleteActivityInputSchema.safeParse({ 
      activityId, 
      phaseId, 
      timeSpent 
    });
    
    if (!validation.success) {
      console.error('Invalid input:', validation.error);
      toast({
        title: 'Erro',
        description: 'Dados inválidos',
        variant: 'destructive',
      });
      return;
    }

    try {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      // Insert completion
      const { error: completionError } = await progressRepository.completeActivity({
        userId: user.id,
        activityId,
        phaseId,
        xpEarned: activity.xp_reward,
        timeSpentMinutes: timeSpent,
      });

      if (completionError) throw completionError;

      // Add XP transaction
      await progressRepository.addXpTransaction({
        userId: user.id,
        amount: activity.xp_reward,
        sourceType: 'activity',
        sourceId: activityId,
        phaseId,
        description: `Completou: ${activity.title}`,
      });

      // Update user progress XP
      const newTotalXp = (userProgress?.total_xp || 0) + activity.xp_reward;
      await progressRepository.updateUserProgress(user.id, {
        total_xp: newTotalXp,
        last_activity_at: new Date().toISOString(),
      });

      // Calculate phase progress
      const phaseActivities = activities.filter(a => a.phase_id === phaseId);
      const newCompletedActivities = [...completedActivities, activityId];
      const phaseCompletedCount = phaseActivities.filter(a => 
        newCompletedActivities.includes(a.id)
      ).length;
      const progressPercentage = Math.round(
        (phaseCompletedCount / phaseActivities.length) * 100
      );

      // Update phase progress
      const currentPhaseProgress = phaseProgress.find(p => p.phase_id === phaseId);
      await progressRepository.updatePhaseProgress(user.id, phaseId, {
        progress_percentage: progressPercentage,
        xp_earned: (currentPhaseProgress?.xp_earned || 0) + activity.xp_reward,
        status: progressPercentage === 100 ? 'completed' : 'in_progress',
      });

      // Log event
      await progressRepository.logEvent({
        userId: user.id,
        eventType: 'activity_completed',
        phaseId,
        metadata: { activity_id: activityId, xp_earned: activity.xp_reward },
      });

      toast({
        title: `+${activity.xp_reward} XP`,
        description: `Atividade "${activity.title}" concluída!`,
      });

      // Check for phase completion
      if (progressPercentage === 100) {
        await handlePhaseCompletion(phaseId);
      }

      // Check for badge unlocks
      await checkBadgeUnlocks(newTotalXp, newCompletedActivities.length);

      // Refresh data
      await onRefetch();
    } catch (error) {
      console.error('Error completing activity:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível completar a atividade',
        variant: 'destructive',
      });
    }
  }, [
    user, 
    activities, 
    userProgress, 
    phaseProgress, 
    completedActivities, 
    handlePhaseCompletion, 
    checkBadgeUnlocks, 
    onRefetch, 
    toast
  ]);

  /**
   * Start a phase
   */
  const startPhase = useCallback(async (phaseId: string) => {
    if (!user) return;

    await progressRepository.updatePhaseProgress(user.id, phaseId, {
      status: 'in_progress',
      started_at: new Date().toISOString(),
    });

    await progressRepository.updateUserProgress(user.id, {
      current_phase_id: phaseId,
    });

    await onRefetch();
  }, [user, onRefetch]);

  return {
    completeActivity,
    startPhase,
    awardBadge,
  };
}
