import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useToast } from '@/hooks/use-toast';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface NetworkingAction {
  id: string;
  user_id: string;
  action_type: 'connect' | 'comment' | 'message';
  target_name: string | null;
  target_profile_url: string | null;
  action_description: string | null;
  completed: boolean;
  completed_at: string | null;
  scheduled_date: string;
  evidence?: string | null;
  xp_reward?: number;
  phase_id?: string | null;
}

interface NetworkingGoal {
  id: string;
  action_type: 'connect' | 'comment' | 'message';
  title: string;
  description: string;
  target_count: number;
  xp_reward: number;
}

// Default weekly networking goals per phase
const getWeeklyGoals = (phaseNumber: number): NetworkingGoal[] => {
  const baseGoals: NetworkingGoal[] = [
    {
      id: 'connect-goal',
      action_type: 'connect',
      title: 'Enviar 3 convites',
      description: 'Conecte-se com pessoas que já estão onde você quer chegar',
      target_count: 3,
      xp_reward: 15
    },
    {
      id: 'comment-goal',
      action_type: 'comment',
      title: 'Comentar 2 posts',
      description: 'Faça perguntas sobre rotina, desafios e caminhos possíveis',
      target_count: 2,
      xp_reward: 10
    }
  ];

  // Customize goals based on phase
  if (phaseNumber === 1) {
    // Despertar - exploration focus
    baseGoals[0].description = 'Conecte com pessoas que inspiram sua mudança';
    baseGoals[1].description = 'Comente em conteúdos sobre transição de carreira';
  } else if (phaseNumber === 2) {
    // Descobrir - discovery focus
    baseGoals[0].description = 'Conecte para explorar possibilidades de carreira';
    baseGoals[1].description = 'Aprenda com quem vive a realidade que você busca';
  } else if (phaseNumber === 3) {
    // Decidir - validation focus
    baseGoals[0].description = 'Valide sua decisão com quem trilhou caminhos similares';
    baseGoals[1].description = 'Interaja para confirmar seu direcionamento';
  } else if (phaseNumber === 4) {
    // Desenvolver - building focus
    baseGoals[0].description = 'Conecte com referências da sua nova área';
    baseGoals[1].description = 'Mostre seu aprendizado através dos comentários';
  } else if (phaseNumber === 5) {
    // Deslanchar - action focus
    baseGoals[0].description = 'Amplie sua rede para acessar oportunidades';
    baseGoals[1].description = 'Aumente visibilidade com engajamento consistente';
  } else if (phaseNumber === 6) {
    // Desfrutar - consolidation focus
    baseGoals[0].description = 'Cultive sua rede com valor genuíno';
    baseGoals[1].description = 'Compartilhe aprendizados da sua jornada';
  }

  return baseGoals;
};

export function useNetworking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentPhase, userProgress, refreshProgress } = useProgress();
  
  const [actions, setActions] = useState<NetworkingAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current week boundaries
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

  // Load actions for current week
  const loadActions = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('networking_routine')
        .select('*')
        .eq('user_id', user.id)
        .gte('scheduled_date', weekStartStr)
        .lte('scheduled_date', weekEndStr)
        .order('scheduled_date', { ascending: false });

      if (error) {
        console.error('Error loading networking actions:', error);
        return;
      }

      setActions(data as NetworkingAction[]);
    } finally {
      setLoading(false);
    }
  }, [user, weekStartStr, weekEndStr]);

  useEffect(() => {
    if (user) {
      loadActions();
    }
  }, [user, loadActions]);

  // Get weekly goals based on current phase
  const weeklyGoals = useMemo(() => {
    const phaseNumber = currentPhase?.phase_number || userProgress?.current_phase_number || 1;
    return getWeeklyGoals(phaseNumber);
  }, [currentPhase, userProgress]);

  // Calculate progress for each goal type
  const getGoalProgress = useCallback((actionType: 'connect' | 'comment' | 'message') => {
    const completedCount = actions.filter(
      a => a.action_type === actionType && a.completed
    ).length;
    return completedCount;
  }, [actions]);

  // Calculate total weekly progress
  const weeklyProgress = useMemo(() => {
    let totalCompleted = 0;
    let totalTarget = 0;
    let earnedXP = 0;
    let potentialXP = 0;

    weeklyGoals.forEach(goal => {
      const completed = getGoalProgress(goal.action_type);
      totalTarget += goal.target_count;
      
      // Cap at target count for progress calculation
      const cappedCompleted = Math.min(completed, goal.target_count);
      totalCompleted += cappedCompleted;
      
      // XP calculation: proportional to completed/target, capped at 100%
      const completionRatio = Math.min(completed / goal.target_count, 1);
      earnedXP += Math.round(goal.xp_reward * completionRatio);
      potentialXP += goal.xp_reward;
    });

    return {
      completed: totalCompleted,
      total: totalTarget,
      percentage: totalTarget > 0 ? (totalCompleted / totalTarget) * 100 : 0,
      earnedXP,
      potentialXP
    };
  }, [weeklyGoals, getGoalProgress]);

  // Complete an action with evidence validation
  const completeAction = async (
    actionType: 'connect' | 'comment' | 'message',
    evidence: { targetName?: string; profileUrl?: string; description?: string }
  ) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };
    
    // Validate evidence
    if (!evidence.targetName && !evidence.description) {
      return { 
        success: false, 
        error: 'Forneça pelo menos o nome do contato ou descrição da ação' 
      };
    }

    const goal = weeklyGoals.find(g => g.action_type === actionType);
    if (!goal) {
      return { success: false, error: 'Tipo de ação inválido' };
    }

    // Check if goal already completed for this type
    const currentCompleted = getGoalProgress(actionType);
    if (currentCompleted >= goal.target_count) {
      return { 
        success: false, 
        error: 'Você já completou todas as ações deste tipo esta semana!' 
      };
    }

    try {
      // Insert the action
      const { error: insertError } = await supabase
        .from('networking_routine')
        .insert({
          user_id: user.id,
          action_type: actionType,
          target_name: evidence.targetName || null,
          target_profile_url: evidence.profileUrl || null,
          action_description: evidence.description || null,
          completed: true,
          completed_at: new Date().toISOString(),
          scheduled_date: format(new Date(), 'yyyy-MM-dd')
        });

      if (insertError) {
        console.error('Error completing action:', insertError);
        return { success: false, error: 'Erro ao salvar ação' };
      }

      // Calculate XP earned for this action
      const newCompleted = currentCompleted + 1;
      const xpPerAction = Math.round(goal.xp_reward / goal.target_count);
      
      // Update user XP if we just completed the goal
      if (newCompleted <= goal.target_count) {
        await supabase
          .from('user_progress')
          .update({ 
            total_xp: (userProgress?.total_xp || 0) + xpPerAction,
            last_activity_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }

      // Reload actions and progress
      await loadActions();
      await refreshProgress();

      return { 
        success: true, 
        xpEarned: xpPerAction,
        goalCompleted: newCompleted >= goal.target_count
      };
    } catch (error) {
      console.error('Error completing action:', error);
      return { success: false, error: 'Erro inesperado' };
    }
  };

  // Get actions list (for display)
  const getActionsWithGoalInfo = useCallback(() => {
    return weeklyGoals.map(goal => {
      const completed = getGoalProgress(goal.action_type);
      const isCompleted = completed >= goal.target_count;
      
      return {
        ...goal,
        completed,
        isCompleted,
        remainingCount: Math.max(0, goal.target_count - completed)
      };
    });
  }, [weeklyGoals, getGoalProgress]);

  return {
    actions,
    weeklyGoals,
    weeklyProgress,
    loading,
    completeAction,
    getActionsWithGoalInfo,
    reload: loadActions,
    currentPhaseName: currentPhase?.name || 'Despertar',
    currentPhaseNumber: currentPhase?.phase_number || userProgress?.current_phase_number || 1
  };
}
