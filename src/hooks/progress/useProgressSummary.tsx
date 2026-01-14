import { useCallback, useMemo } from 'react';
import type { 
  MigreiPhase, 
  PhaseActivity, 
  UserProgress, 
  UserPhaseProgress,
  UserBadge,
  UserMission,
  PhaseWithProgress,
  UserProgressSummary
} from '@/types/progress';
import { getLevelFromXp } from '@/types/progress';

interface UseProgressSummaryProps {
  phases: MigreiPhase[];
  activities: PhaseActivity[];
  userProgress: UserProgress | null;
  phaseProgress: UserPhaseProgress[];
  completedActivities: string[];
  userBadges: UserBadge[];
  userMissions: UserMission[];
}

/**
 * Hook for computing progress summaries and derived data
 * Contains pure computation logic, no side effects
 */
export function useProgressSummary({
  phases,
  activities,
  userProgress,
  phaseProgress,
  completedActivities,
  userBadges,
  userMissions,
}: UseProgressSummaryProps) {
  /**
   * Phases with progress data attached
   */
  const phasesWithProgress = useMemo((): PhaseWithProgress[] => {
    return phases.map(phase => {
      const progress = phaseProgress.find(p => p.phase_id === phase.id);
      const phaseActivities = activities.filter(a => a.phase_id === phase.id);
      const completed = phaseActivities.filter(a => 
        completedActivities.includes(a.id)
      ).length;

      return {
        ...phase,
        userProgress: progress || null,
        activities: phaseActivities,
        completedActivities: completed,
        totalActivities: phaseActivities.length,
      };
    });
  }, [phases, activities, phaseProgress, completedActivities]);

  /**
   * Current phase
   */
  const currentPhase = useMemo(() => {
    return phases.find(p => p.id === userProgress?.current_phase_id) || null;
  }, [phases, userProgress]);

  /**
   * Level information
   */
  const levelInfo = useMemo(() => {
    return getLevelFromXp(userProgress?.total_xp || 0);
  }, [userProgress]);

  /**
   * Overall progress percentage
   */
  const overallProgress = useMemo(() => {
    const completedPhases = phaseProgress.filter(p => p.status === 'completed').length;
    return phases.length > 0 
      ? Math.round((completedPhases / phases.length) * 100) 
      : 0;
  }, [phases, phaseProgress]);

  /**
   * Get complete progress summary
   */
  const getProgressSummary = useCallback((): UserProgressSummary => {
    return {
      progress: userProgress,
      currentPhase,
      phases: phasesWithProgress,
      totalXp: userProgress?.total_xp || 0,
      currentLevel: levelInfo.level,
      levelName: levelInfo.name,
      nextLevelXp: levelInfo.maxXp,
      overallProgress,
      badges: userBadges,
      missions: userMissions,
      streak: userProgress?.streak_days || 0,
    };
  }, [
    userProgress, 
    currentPhase, 
    phasesWithProgress, 
    levelInfo, 
    overallProgress, 
    userBadges, 
    userMissions
  ]);

  return {
    phasesWithProgress,
    currentPhase,
    levelInfo,
    overallProgress,
    getProgressSummary,
  };
}
