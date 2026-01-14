import { useState, useEffect, useCallback } from 'react';
import { progressRepository } from '@/lib/repositories';
import { useAuth } from '@/hooks/useAuth';
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

export interface ProgressDataState {
  phases: MigreiPhase[];
  activities: PhaseActivity[];
  userProgress: UserProgress | null;
  phaseProgress: UserPhaseProgress[];
  badges: Badge[];
  userBadges: UserBadge[];
  missions: Mission[];
  userMissions: UserMission[];
  completedActivities: string[];
  loading: boolean;
}

/**
 * Hook for fetching and managing progress data state
 * Separates data fetching from business logic
 */
export function useProgressData() {
  const { user } = useAuth();
  const [state, setState] = useState<ProgressDataState>({
    phases: [],
    activities: [],
    userProgress: null,
    phaseProgress: [],
    badges: [],
    userBadges: [],
    missions: [],
    userMissions: [],
    completedActivities: [],
    loading: true,
  });

  const fetchData = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true }));

      // Fetch all data in parallel
      const [
        phasesResult,
        activitiesResult,
        progressResult,
        phaseProgressResult,
        badgesResult,
        userBadgesResult,
        missionsResult,
        userMissionsResult,
        completedIds,
      ] = await Promise.all([
        progressRepository.getPhases(),
        progressRepository.getActivities(),
        progressRepository.getUserProgress(user.id),
        progressRepository.getPhaseProgress(user.id),
        progressRepository.getBadges(),
        progressRepository.getUserBadges(user.id),
        progressRepository.getActiveMissions(),
        progressRepository.getUserMissions(user.id),
        progressRepository.getCompletedActivityIds(user.id),
      ]);

      const phases = phasesResult.data;
      const userProgress = progressResult.data;

      // Initialize progress if not exists
      if (!userProgress && phases.length > 0) {
        const { data: newProgress } = await progressRepository.createUserProgress(
          user.id,
          phases[0].id
        );
        await progressRepository.initializePhaseProgress(user.id, phases);

        setState({
          phases,
          activities: activitiesResult.data,
          userProgress: newProgress,
          phaseProgress: phases.map((phase, index) => ({
            id: '',
            user_id: user.id,
            phase_id: phase.id,
            status: (index === 0 ? 'available' : 'locked') as PhaseStatus,
            progress_percentage: 0,
            xp_earned: 0,
            started_at: null,
            completed_at: null,
            time_spent_minutes: 0,
          })),
          badges: badgesResult.data,
          userBadges: userBadgesResult.data,
          missions: missionsResult.data,
          userMissions: userMissionsResult.data,
          completedActivities: completedIds,
          loading: false,
        });
        return;
      }

      setState({
        phases,
        activities: activitiesResult.data,
        userProgress,
        phaseProgress: phaseProgressResult.data,
        badges: badgesResult.data,
        userBadges: userBadgesResult.data,
        missions: missionsResult.data,
        userMissions: userMissionsResult.data,
        completedActivities: completedIds,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}
