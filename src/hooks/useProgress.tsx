import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { 
  MigreiPhase, 
  PhaseActivity, 
  UserProgress, 
  UserPhaseProgress, 
  Badge, 
  UserBadge, 
  Mission, 
  UserMission,
  PhaseWithProgress,
  UserProgressSummary,
  getLevelFromXp,
  PhaseStatus
} from '@/types/progress';
import { useToast } from './use-toast';

export function useProgress() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [phases, setPhases] = useState<MigreiPhase[]>([]);
  const [activities, setActivities] = useState<PhaseActivity[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [phaseProgress, setPhaseProgress] = useState<UserPhaseProgress[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  // Fetch all progress data
  const fetchProgressData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch phases
      const { data: phasesData } = await supabase
        .from('migrei_phases')
        .select('*')
        .order('phase_number');

      // Fetch activities
      const { data: activitiesData } = await supabase
        .from('phase_activities')
        .select('*')
        .order('sort_order');

      // Fetch user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch phase progress
      const { data: phaseProgressData } = await supabase
        .from('user_phase_progress')
        .select('*')
        .eq('user_id', user.id);

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('badges')
        .select('*')
        .order('sort_order');

      // Fetch user badges
      const { data: userBadgesData } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', user.id);

      // Fetch missions
      const { data: missionsData } = await supabase
        .from('missions')
        .select('*')
        .eq('is_active', true);

      // Fetch user missions
      const { data: userMissionsData } = await supabase
        .from('user_missions')
        .select('*, missions(*)')
        .eq('user_id', user.id);

      // Fetch completed activities
      const { data: completionsData } = await supabase
        .from('user_activity_completions')
        .select('activity_id')
        .eq('user_id', user.id);

      setPhases((phasesData as MigreiPhase[]) || []);
      setActivities((activitiesData as PhaseActivity[]) || []);
      setUserProgress((progressData as UserProgress) || null);
      setPhaseProgress((phaseProgressData as UserPhaseProgress[]) || []);
      setBadges((badgesData as Badge[]) || []);
      setUserBadges((userBadgesData as UserBadge[]) || []);
      setMissions((missionsData as Mission[]) || []);
      setUserMissions((userMissionsData as UserMission[]) || []);
      setCompletedActivities(completionsData?.map(c => c.activity_id) || []);

      // Initialize progress if not exists
      if (!progressData && phasesData?.length) {
        await initializeProgress(user.id, phasesData[0].id);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initialize progress for new user
  const initializeProgress = async (userId: string, firstPhaseId: string) => {
    try {
      // Create user progress
      const { data: newProgress } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          current_phase_id: firstPhaseId,
          current_phase_number: 1
        })
        .select()
        .single();

      // Create phase progress for all phases
      const phaseInserts = phases.map((phase, index) => ({
        user_id: userId,
        phase_id: phase.id,
        status: (index === 0 ? 'available' : 'locked') as PhaseStatus
      }));

      await supabase.from('user_phase_progress').insert(phaseInserts);

      if (newProgress) {
        setUserProgress(newProgress as UserProgress);
      }
    } catch (error) {
      console.error('Error initializing progress:', error);
    }
  };

  // Complete an activity
  const completeActivity = async (activityId: string, phaseId: string, timeSpent: number = 0) => {
    if (!user) return;

    try {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      // Insert completion
      const { error: completionError } = await supabase
        .from('user_activity_completions')
        .insert({
          user_id: user.id,
          activity_id: activityId,
          phase_id: phaseId,
          xp_earned: activity.xp_reward,
          time_spent_minutes: timeSpent
        });

      if (completionError) throw completionError;

      // Add XP transaction
      await supabase.from('xp_transactions').insert({
        user_id: user.id,
        amount: activity.xp_reward,
        source_type: 'activity',
        source_id: activityId,
        phase_id: phaseId,
        description: `Completou: ${activity.title}`
      });

      // Update user progress XP
      const newTotalXp = (userProgress?.total_xp || 0) + activity.xp_reward;
      await supabase
        .from('user_progress')
        .update({
          total_xp: newTotalXp,
          last_activity_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      // Update phase progress
      const phaseActivities = activities.filter(a => a.phase_id === phaseId);
      const newCompletedActivities = [...completedActivities, activityId];
      const phaseCompletedCount = phaseActivities.filter(a => 
        newCompletedActivities.includes(a.id)
      ).length;
      const progressPercentage = Math.round((phaseCompletedCount / phaseActivities.length) * 100);

      await supabase
        .from('user_phase_progress')
        .update({
          progress_percentage: progressPercentage,
          xp_earned: (phaseProgress.find(p => p.phase_id === phaseId)?.xp_earned || 0) + activity.xp_reward,
          status: progressPercentage === 100 ? 'completed' : 'in_progress'
        })
        .eq('user_id', user.id)
        .eq('phase_id', phaseId);

      // Log event
      await supabase.from('progress_events').insert({
        user_id: user.id,
        event_type: 'activity_completed',
        phase_id: phaseId,
        metadata: { activity_id: activityId, xp_earned: activity.xp_reward }
      });

      toast({
        title: `+${activity.xp_reward} XP`,
        description: `Atividade "${activity.title}" concluída!`
      });

      // Check for phase completion
      if (progressPercentage === 100) {
        await handlePhaseCompletion(phaseId);
      }

      // Check for badge unlocks
      await checkBadgeUnlocks(newTotalXp, newCompletedActivities.length);

      // Refresh data
      await fetchProgressData();
    } catch (error) {
      console.error('Error completing activity:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível completar a atividade',
        variant: 'destructive'
      });
    }
  };

  // Handle phase completion
  const handlePhaseCompletion = async (phaseId: string) => {
    if (!user) return;

    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return;

    // Mark phase as completed
    await supabase
      .from('user_phase_progress')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('phase_id', phaseId);

    // Unlock next phase
    const nextPhase = phases.find(p => p.phase_number === phase.phase_number + 1);
    if (nextPhase) {
      await supabase
        .from('user_phase_progress')
        .update({
          status: 'available',
          started_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('phase_id', nextPhase.id);

      await supabase
        .from('user_progress')
        .update({
          current_phase_id: nextPhase.id,
          current_phase_number: nextPhase.phase_number
        })
        .eq('user_id', user.id);
    }

    // Award phase completion badge
    const phaseBadge = badges.find(b => 
      b.is_phase_completion && b.phase_id === phaseId
    );
    if (phaseBadge) {
      await awardBadge(phaseBadge.id);
    }

    // Log event
    await supabase.from('progress_events').insert({
      user_id: user.id,
      event_type: 'phase_completed',
      phase_id: phaseId,
      metadata: { phase_number: phase.phase_number, phase_name: phase.name }
    });

    toast({
      title: '🎉 Fase Concluída!',
      description: `Você completou a fase ${phase.name}!`
    });
  };

  // Award a badge
  const awardBadge = async (badgeId: string) => {
    if (!user) return;

    const badge = badges.find(b => b.id === badgeId);
    if (!badge) return;

    // Check if already has badge
    if (userBadges.some(ub => ub.badge_id === badgeId)) return;

    try {
      await supabase.from('user_badges').insert({
        user_id: user.id,
        badge_id: badgeId
      });

      // Add XP for badge
      await supabase.from('xp_transactions').insert({
        user_id: user.id,
        amount: badge.xp_reward,
        source_type: 'badge',
        source_id: badgeId,
        description: `Badge: ${badge.name}`
      });

      // Update total XP
      await supabase
        .from('user_progress')
        .update({
          total_xp: (userProgress?.total_xp || 0) + badge.xp_reward
        })
        .eq('user_id', user.id);

      toast({
        title: '🏆 Nova Conquista!',
        description: `Você desbloqueou: ${badge.name}`
      });
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  // Check for badge unlocks
  const checkBadgeUnlocks = async (totalXp: number, activitiesCount: number) => {
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
  };

  // Start a phase
  const startPhase = async (phaseId: string) => {
    if (!user) return;

    await supabase
      .from('user_phase_progress')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('phase_id', phaseId);

    await supabase
      .from('user_progress')
      .update({
        current_phase_id: phaseId
      })
      .eq('user_id', user.id);

    await fetchProgressData();
  };

  // Get progress summary
  const getProgressSummary = useCallback((): UserProgressSummary => {
    const currentPhase = phases.find(p => p.id === userProgress?.current_phase_id) || null;
    const level = getLevelFromXp(userProgress?.total_xp || 0);

    const phasesWithProgress: PhaseWithProgress[] = phases.map(phase => {
      const progress = phaseProgress.find(p => p.phase_id === phase.id);
      const phaseActivities = activities.filter(a => a.phase_id === phase.id);
      const completed = phaseActivities.filter(a => completedActivities.includes(a.id)).length;

      return {
        ...phase,
        userProgress: progress || null,
        activities: phaseActivities,
        completedActivities: completed,
        totalActivities: phaseActivities.length
      };
    });

    const completedPhases = phaseProgress.filter(p => p.status === 'completed').length;
    const overallProgress = phases.length > 0 
      ? Math.round((completedPhases / phases.length) * 100) 
      : 0;

    return {
      progress: userProgress,
      currentPhase,
      phases: phasesWithProgress,
      totalXp: userProgress?.total_xp || 0,
      currentLevel: level.level,
      levelName: level.name,
      nextLevelXp: level.maxXp,
      overallProgress,
      badges: userBadges,
      missions: userMissions,
      streak: userProgress?.streak_days || 0
    };
  }, [phases, activities, userProgress, phaseProgress, completedActivities, userBadges, userMissions]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  return {
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
    completeActivity,
    startPhase,
    getProgressSummary,
    refreshProgress: fetchProgressData
  };
}
