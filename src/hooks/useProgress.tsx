import { useProgressData } from './progress/useProgressData';
import { useProgressActions } from './progress/useProgressActions';
import { useProgressSummary } from './progress/useProgressSummary';

/**
 * Main progress hook - composes smaller specialized hooks
 * Provides backwards compatibility with the original API
 */
export function useProgress() {
  // Data layer
  const {
    phases,
    activities,
    userProgress,
    phaseProgress,
    badges,
    userBadges,
    missions,
    userMissions,
    completedActivities,
    loading,
    refetch,
  } = useProgressData();

  // Actions layer
  const { completeActivity, startPhase, awardBadge } = useProgressActions({
    activities,
    phases,
    badges,
    userBadges,
    userProgress,
    phaseProgress,
    completedActivities,
    onRefetch: refetch,
  });

  // Summary/computed layer
  const { getProgressSummary, phasesWithProgress, currentPhase, levelInfo, overallProgress } = 
    useProgressSummary({
      phases,
      activities,
      userProgress,
      phaseProgress,
      completedActivities,
      userBadges,
      userMissions,
    });

  return {
    // State
    loading,
    phases,
    activities,
    userProgress,
    phaseProgress,
    badges,
    userBadges,
    missions,
    userMissions,
    completedActivities,
    
    // Computed
    phasesWithProgress,
    currentPhase,
    levelInfo,
    overallProgress,
    
    // Actions
    completeActivity,
    startPhase,
    awardBadge,
    getProgressSummary,
    refreshProgress: refetch,
  };
}
