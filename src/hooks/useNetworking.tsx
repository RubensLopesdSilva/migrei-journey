import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { startOfWeek, endOfWeek, format } from 'date-fns';

export type NetworkingActionType = 
  | 'connect'      // Enviar convites de conexão
  | 'comment'      // Comentar em posts
  | 'message'      // Enviar mensagens diretas
  | 'coffee'       // Pedir coffee chat
  | 'share'        // Compartilhar conteúdo próprio
  | 'followup'     // Fazer follow-up com contatos
  | 'referral'     // Pedir indicação
  | 'thank'        // Agradecer/reconhecer contatos
  | 'event';       // Participar de eventos

export interface NetworkingAction {
  id: string;
  user_id: string;
  action_type: NetworkingActionType;
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
  action_type: NetworkingActionType;
  title: string;
  description: string;
  target_count: number;
  xp_reward: number;
  week?: number; // Qual semana do mês (1-4) - se não definido, vale para todas
}

interface UserProgressMinimal {
  current_phase_number: number;
  current_phase_name: string;
  total_xp: number;
}

// Metas de networking por fase - sistema progressivo
// Cada fase tem ações específicas que evoluem ao longo do mês
const getPhaseGoals = (phaseNumber: number): NetworkingGoal[] => {
  const phaseGoalsMap: Record<number, NetworkingGoal[]> = {
    // FASE 1: DESPERTAR - Foco em exploração e inspiração
    1: [
      {
        id: 'connect-1',
        action_type: 'connect',
        title: 'Enviar 3 convites',
        description: 'Conecte com pessoas que inspiram sua mudança',
        target_count: 3,
        xp_reward: 15
      },
      {
        id: 'comment-1',
        action_type: 'comment',
        title: 'Comentar 2 posts',
        description: 'Comente em conteúdos sobre transição de carreira',
        target_count: 2,
        xp_reward: 10
      },
      {
        id: 'share-1',
        action_type: 'share',
        title: 'Compartilhar 1 reflexão',
        description: 'Publique sobre sua decisão de mudar',
        target_count: 1,
        xp_reward: 15
      },
      {
        id: 'event-1',
        action_type: 'event',
        title: 'Participar de 1 evento',
        description: 'Entre em um webinar ou live sobre carreira',
        target_count: 1,
        xp_reward: 20
      }
    ],
    
    // FASE 2: DESCOBRIR - Foco em explorar possibilidades
    2: [
      {
        id: 'connect-2',
        action_type: 'connect',
        title: 'Enviar 4 convites',
        description: 'Conecte para explorar possibilidades de carreira',
        target_count: 4,
        xp_reward: 20
      },
      {
        id: 'comment-2',
        action_type: 'comment',
        title: 'Comentar 3 posts',
        description: 'Aprenda com quem vive a realidade que você busca',
        target_count: 3,
        xp_reward: 15
      },
      {
        id: 'message-2',
        action_type: 'message',
        title: 'Enviar 2 mensagens',
        description: 'Pergunte sobre rotina e desafios da área',
        target_count: 2,
        xp_reward: 15
      },
      {
        id: 'coffee-2',
        action_type: 'coffee',
        title: 'Pedir 1 coffee chat',
        description: 'Convide alguém para uma conversa de 15 min',
        target_count: 1,
        xp_reward: 25
      },
      {
        id: 'event-2',
        action_type: 'event',
        title: 'Participar de 1 evento',
        description: 'Explore eventos da área que te interessa',
        target_count: 1,
        xp_reward: 20
      }
    ],
    
    // FASE 3: DECIDIR - Foco em validação
    3: [
      {
        id: 'connect-3',
        action_type: 'connect',
        title: 'Enviar 4 convites',
        description: 'Valide sua decisão com quem trilhou caminhos similares',
        target_count: 4,
        xp_reward: 20
      },
      {
        id: 'comment-3',
        action_type: 'comment',
        title: 'Comentar 3 posts',
        description: 'Interaja para confirmar seu direcionamento',
        target_count: 3,
        xp_reward: 15
      },
      {
        id: 'message-3',
        action_type: 'message',
        title: 'Enviar 2 mensagens',
        description: 'Valide suas hipóteses com profissionais da área',
        target_count: 2,
        xp_reward: 15
      },
      {
        id: 'coffee-3',
        action_type: 'coffee',
        title: 'Pedir 2 coffee chats',
        description: 'Aprofunde conversas para validar sua escolha',
        target_count: 2,
        xp_reward: 30
      },
      {
        id: 'thank-3',
        action_type: 'thank',
        title: 'Agradecer 2 contatos',
        description: 'Reconheça quem te ajudou na decisão',
        target_count: 2,
        xp_reward: 10
      }
    ],
    
    // FASE 4: DESENVOLVER - Foco em aprendizado e visibilidade
    4: [
      {
        id: 'connect-4',
        action_type: 'connect',
        title: 'Enviar 5 convites',
        description: 'Conecte com referências da sua nova área',
        target_count: 5,
        xp_reward: 25
      },
      {
        id: 'comment-4',
        action_type: 'comment',
        title: 'Comentar 4 posts',
        description: 'Mostre seu aprendizado através dos comentários',
        target_count: 4,
        xp_reward: 20
      },
      {
        id: 'share-4',
        action_type: 'share',
        title: 'Compartilhar 2 aprendizados',
        description: 'Publique sobre o que está aprendendo',
        target_count: 2,
        xp_reward: 25
      },
      {
        id: 'message-4',
        action_type: 'message',
        title: 'Enviar 2 mensagens',
        description: 'Peça feedback sobre seu desenvolvimento',
        target_count: 2,
        xp_reward: 15
      },
      {
        id: 'event-4',
        action_type: 'event',
        title: 'Participar de 1 evento',
        description: 'Faça networking em eventos da sua área',
        target_count: 1,
        xp_reward: 20
      },
      {
        id: 'followup-4',
        action_type: 'followup',
        title: 'Fazer 2 follow-ups',
        description: 'Retome contato com conexões estratégicas',
        target_count: 2,
        xp_reward: 15
      }
    ],
    
    // FASE 5: DESLANCHAR - Foco máximo em oportunidades
    5: [
      {
        id: 'connect-5',
        action_type: 'connect',
        title: 'Enviar 6 convites',
        description: 'Amplie sua rede para acessar oportunidades',
        target_count: 6,
        xp_reward: 30
      },
      {
        id: 'comment-5',
        action_type: 'comment',
        title: 'Comentar 5 posts',
        description: 'Aumente visibilidade com engajamento consistente',
        target_count: 5,
        xp_reward: 25
      },
      {
        id: 'message-5',
        action_type: 'message',
        title: 'Enviar 3 mensagens',
        description: 'Apresente-se para potenciais empregadores',
        target_count: 3,
        xp_reward: 20
      },
      {
        id: 'referral-5',
        action_type: 'referral',
        title: 'Pedir 2 indicações',
        description: 'Solicite referências de conexões de confiança',
        target_count: 2,
        xp_reward: 30
      },
      {
        id: 'coffee-5',
        action_type: 'coffee',
        title: 'Pedir 2 coffee chats',
        description: 'Converse com decisores e influenciadores',
        target_count: 2,
        xp_reward: 30
      },
      {
        id: 'share-5',
        action_type: 'share',
        title: 'Compartilhar 2 conteúdos',
        description: 'Mostre sua expertise e disponibilidade',
        target_count: 2,
        xp_reward: 25
      },
      {
        id: 'followup-5',
        action_type: 'followup',
        title: 'Fazer 3 follow-ups',
        description: 'Mantenha processos aquecidos',
        target_count: 3,
        xp_reward: 20
      },
      {
        id: 'event-5',
        action_type: 'event',
        title: 'Participar de 2 eventos',
        description: 'Maximize presença em eventos de networking',
        target_count: 2,
        xp_reward: 30
      }
    ],
    
    // FASE 6: DESFRUTAR - Foco em retribuição e manutenção
    6: [
      {
        id: 'connect-6',
        action_type: 'connect',
        title: 'Enviar 3 convites',
        description: 'Cultive sua rede com valor genuíno',
        target_count: 3,
        xp_reward: 15
      },
      {
        id: 'comment-6',
        action_type: 'comment',
        title: 'Comentar 3 posts',
        description: 'Compartilhe aprendizados da sua jornada',
        target_count: 3,
        xp_reward: 15
      },
      {
        id: 'share-6',
        action_type: 'share',
        title: 'Compartilhar 2 conquistas',
        description: 'Inspire outros com sua história',
        target_count: 2,
        xp_reward: 25
      },
      {
        id: 'thank-6',
        action_type: 'thank',
        title: 'Agradecer 3 pessoas',
        description: 'Reconheça quem fez parte da sua transição',
        target_count: 3,
        xp_reward: 20
      },
      {
        id: 'message-6',
        action_type: 'message',
        title: 'Oferecer ajuda a 2 pessoas',
        description: 'Retribua orientando quem está começando',
        target_count: 2,
        xp_reward: 20
      },
      {
        id: 'referral-6',
        action_type: 'referral',
        title: 'Indicar 1 pessoa',
        description: 'Ajude alguém da comunidade com uma indicação',
        target_count: 1,
        xp_reward: 25
      }
    ]
  };

  return phaseGoalsMap[phaseNumber] || phaseGoalsMap[1];
};

// Wrapper para manter compatibilidade
const getWeeklyGoals = (phaseNumber: number): NetworkingGoal[] => {
  return getPhaseGoals(phaseNumber);
};

export function useNetworking() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [actions, setActions] = useState<NetworkingAction[]>([]);
  const [userProgressData, setUserProgressData] = useState<UserProgressMinimal | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current week boundaries
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

  // Load all data in a single fetch
  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Fetch networking actions and user progress in parallel
      const [actionsResult, progressResult] = await Promise.all([
        supabase
          .from('networking_routine')
          .select('*')
          .eq('user_id', user.id)
          .gte('scheduled_date', weekStartStr)
          .lte('scheduled_date', weekEndStr)
          .order('scheduled_date', { ascending: false }),
        supabase
          .from('user_progress')
          .select('current_phase_number, total_xp, current_phase_id')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      if (actionsResult.error) {
        console.error('Error loading networking actions:', actionsResult.error);
      } else {
        setActions(actionsResult.data as NetworkingAction[]);
      }

      // Get phase name if we have progress
      let phaseName = 'Despertar';
      if (progressResult.data?.current_phase_id) {
        const { data: phaseData } = await supabase
          .from('migrei_phases')
          .select('name')
          .eq('id', progressResult.data.current_phase_id)
          .single();
        if (phaseData) {
          phaseName = phaseData.name;
        }
      }

      setUserProgressData({
        current_phase_number: progressResult.data?.current_phase_number || 1,
        current_phase_name: phaseName,
        total_xp: progressResult.data?.total_xp || 0
      });
    } finally {
      setLoading(false);
    }
  }, [user, weekStartStr, weekEndStr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get weekly goals based on current phase
  const weeklyGoals = useMemo(() => {
    return getWeeklyGoals(userProgressData?.current_phase_number || 1);
  }, [userProgressData?.current_phase_number]);

  // Calculate progress for each goal type
  const getGoalProgress = useCallback((actionType: NetworkingActionType) => {
    return actions.filter(a => a.action_type === actionType && a.completed).length;
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
      
      const cappedCompleted = Math.min(completed, goal.target_count);
      totalCompleted += cappedCompleted;
      
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
    actionType: NetworkingActionType,
    evidence: { targetName?: string; profileUrl?: string; description?: string }
  ) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };
    
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

    const currentCompleted = getGoalProgress(actionType);
    if (currentCompleted >= goal.target_count) {
      return { 
        success: false, 
        error: 'Você já completou todas as ações deste tipo esta semana!' 
      };
    }

    try {
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

      const newCompleted = currentCompleted + 1;
      const xpPerAction = Math.round(goal.xp_reward / goal.target_count);
      
      if (newCompleted <= goal.target_count) {
        await supabase
          .from('user_progress')
          .update({ 
            total_xp: (userProgressData?.total_xp || 0) + xpPerAction,
            last_activity_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }

      // Reload only networking data (lightweight)
      await loadData();

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
    reload: loadData,
    currentPhaseName: userProgressData?.current_phase_name || 'Despertar',
    currentPhaseNumber: userProgressData?.current_phase_number || 1
  };
}
