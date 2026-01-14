import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProgress } from './useProgress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type {
  PossibilityRoute,
  SmartGoal,
  Plan90Days,
  PlanWeeklyTask,
  SkillGap,
  DecisionCheckpoint,
  SuggestedAction,
  DiscardedRoute,
} from '@/types/decision';

export const useDecision = () => {
  const { user } = useAuth();
  const { phaseProgress } = useProgress();
  const { toast } = useToast();

  const [routes, setRoutes] = useState<PossibilityRoute[]>([]);
  const [smartGoals, setSmartGoals] = useState<SmartGoal[]>([]);
  const [plan90Days, setPlan90Days] = useState<Plan90Days[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<PlanWeeklyTask[]>([]);
  const [skillsGaps, setSkillsGaps] = useState<SkillGap[]>([]);
  const [checkpoint, setCheckpoint] = useState<DecisionCheckpoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const progressPercentage = 0;

  // Fetch all decision data
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          routesRes,
          goalsRes,
          planRes,
          tasksRes,
          gapsRes,
          checkpointRes
        ] = await Promise.all([
          supabase.from('possibility_routes').select('*').eq('user_id', user.id).order('total_score', { ascending: false }),
          supabase.from('smart_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('plan_90_days').select('*').eq('user_id', user.id).order('month_number'),
          supabase.from('plan_weekly_tasks').select('*').eq('user_id', user.id).order('week_number'),
          supabase.from('skills_gaps').select('*').eq('user_id', user.id).order('priority'),
          supabase.from('decision_checkpoints').select('*').eq('user_id', user.id).single()
        ]);

        if (routesRes.data) setRoutes(routesRes.data as unknown as PossibilityRoute[]);
        if (goalsRes.data) setSmartGoals(goalsRes.data as unknown as SmartGoal[]);
        if (planRes.data) setPlan90Days(planRes.data as unknown as Plan90Days[]);
        if (tasksRes.data) setWeeklyTasks(tasksRes.data as unknown as PlanWeeklyTask[]);
        if (gapsRes.data) {
          setSkillsGaps(gapsRes.data.map(g => ({
            ...g,
            suggested_actions: (g.suggested_actions as unknown as SuggestedAction[]) || []
          })) as SkillGap[]);
        }
        if (checkpointRes.data) {
          setCheckpoint({
            ...checkpointRes.data,
            discarded_routes: (checkpointRes.data.discarded_routes as unknown as DiscardedRoute[]) || []
          } as DecisionCheckpoint);
        }
      } catch (error) {
        console.error('Error fetching decision data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Route management
  const addRoute = async (route: Omit<PossibilityRoute, 'id' | 'user_id' | 'total_score' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('possibility_routes')
      .insert({ ...route, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao adicionar rota', description: error.message, variant: 'destructive' });
      return null;
    }

    setRoutes(prev => [...prev, data as PossibilityRoute]);
    toast({ title: 'Rota adicionada!', description: 'Sua nova possibilidade foi registrada.' });
    return data;
  };

  const updateRoute = async (id: string, updates: Partial<PossibilityRoute>) => {
    const { data, error } = await supabase
      .from('possibility_routes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao atualizar rota', description: error.message, variant: 'destructive' });
      return null;
    }

    setRoutes(prev => prev.map(r => r.id === id ? data as PossibilityRoute : r));
    return data;
  };

  const deleteRoute = async (id: string) => {
    const { error } = await supabase
      .from('possibility_routes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao remover rota', description: error.message, variant: 'destructive' });
      return false;
    }

    setRoutes(prev => prev.filter(r => r.id !== id));
    return true;
  };

  const selectRoute = async (id: string) => {
    // Deselect all others first
    await supabase.from('possibility_routes').update({ is_selected: false }).eq('user_id', user?.id);
    
    const { data, error } = await supabase
      .from('possibility_routes')
      .update({ is_selected: true, is_discarded: false })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao selecionar rota', description: error.message, variant: 'destructive' });
      return null;
    }

    setRoutes(prev => prev.map(r => ({
      ...r,
      is_selected: r.id === id,
      is_discarded: r.id === id ? false : r.is_discarded
    })));
    
    toast({ title: 'Rota selecionada!', description: 'Esta será sua rota principal de transição.' });
    return data;
  };

  // SMART Goal management
  const addSmartGoal = async (goal: Omit<SmartGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('smart_goals')
      .insert({ ...goal, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao criar meta', description: error.message, variant: 'destructive' });
      return null;
    }

    setSmartGoals(prev => [data as SmartGoal, ...prev]);
    toast({ title: 'Meta SMART criada!', description: 'Sua meta foi definida com sucesso.' });
    return data;
  };

  const updateSmartGoal = async (id: string, updates: Partial<SmartGoal>) => {
    const { data, error } = await supabase
      .from('smart_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao atualizar meta', description: error.message, variant: 'destructive' });
      return null;
    }

    setSmartGoals(prev => prev.map(g => g.id === id ? data as SmartGoal : g));
    return data;
  };

  // 90-Day Plan management
  const createPlan90Days = async (goalId: string) => {
    if (!user) return null;

    const months = [
      { month_number: 1, month_theme: 'Clareza e Base', month_objective: 'Consolidar fundamentos e preparar terreno' },
      { month_number: 2, month_theme: 'Construção', month_objective: 'Desenvolver habilidades e expandir rede' },
      { month_number: 3, month_theme: 'Exposição e Ação', month_objective: 'Ganhar visibilidade e buscar oportunidades' },
    ];

    const { data, error } = await supabase
      .from('plan_90_days')
      .insert(months.map(m => ({ ...m, user_id: user.id, goal_id: goalId })))
      .select();

    if (error) {
      toast({ title: 'Erro ao criar plano', description: error.message, variant: 'destructive' });
      return null;
    }

    setPlan90Days(data as Plan90Days[]);
    toast({ title: 'Plano de 90 dias criado!', description: 'Seu plano estratégico está pronto.' });
    return data;
  };

  const addWeeklyTask = async (planMonthId: string, weekNumber: number, title: string, description?: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('plan_weekly_tasks')
      .insert({
        plan_month_id: planMonthId,
        user_id: user.id,
        week_number: weekNumber,
        task_title: title,
        task_description: description || null
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao adicionar tarefa', description: error.message, variant: 'destructive' });
      return null;
    }

    setWeeklyTasks(prev => [...prev, data as PlanWeeklyTask]);
    return data;
  };

  const toggleTaskComplete = async (taskId: string) => {
    const task = weeklyTasks.find(t => t.id === taskId);
    if (!task) return null;

    const { data, error } = await supabase
      .from('plan_weekly_tasks')
      .update({
        is_completed: !task.is_completed,
        completed_at: !task.is_completed ? new Date().toISOString() : null
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao atualizar tarefa', description: error.message, variant: 'destructive' });
      return null;
    }

    setWeeklyTasks(prev => prev.map(t => t.id === taskId ? data as PlanWeeklyTask : t));
    return data;
  };

  // Skills Gap management
  const addSkillGap = async (gap: Omit<SkillGap, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('skills_gaps')
      .insert({ 
        gap_type: gap.gap_type,
        gap_name: gap.gap_name,
        current_level: gap.current_level,
        required_level: gap.required_level,
        priority: gap.priority,
        route_id: gap.route_id,
        suggested_actions: gap.suggested_actions as unknown as any,
        is_addressed: gap.is_addressed,
        user_id: user.id 
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao adicionar lacuna', description: error.message, variant: 'destructive' });
      return null;
    }

    setSkillsGaps(prev => [...prev, { ...data, suggested_actions: gap.suggested_actions } as SkillGap]);
    return data;
  };

  const updateSkillGap = async (id: string, updates: Partial<SkillGap>) => {
    const updateData: any = { ...updates };
    if (updates.suggested_actions) {
      updateData.suggested_actions = updates.suggested_actions as unknown as any;
    }
    
    const { data, error } = await supabase
      .from('skills_gaps')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao atualizar lacuna', description: error.message, variant: 'destructive' });
      return null;
    }

    setSkillsGaps(prev => prev.map(g => g.id === id ? { ...data, suggested_actions: updates.suggested_actions || g.suggested_actions } as SkillGap : g));
    return data;
  };

  // Decision Checkpoint
  const confirmDecision = async (routeId: string, commitmentStatement: string, confidenceLevel: number) => {
    if (!user) return null;

    const selectedRoute = routes.find(r => r.id === routeId);
    const discardedRoutes: DiscardedRoute[] = routes
      .filter(r => r.id !== routeId)
      .map(r => ({ route_id: r.id, route_name: r.route_name, reason: 'Não selecionada' }));

    // Mark other routes as discarded
    await supabase
      .from('possibility_routes')
      .update({ is_discarded: true, is_selected: false })
      .neq('id', routeId)
      .eq('user_id', user.id);

    // Mark selected route
    await supabase
      .from('possibility_routes')
      .update({ is_selected: true, is_discarded: false })
      .eq('id', routeId);

    const checkpointData = {
      user_id: user.id,
      selected_route_id: routeId,
      decision_date: new Date().toISOString(),
      commitment_statement: commitmentStatement,
      discarded_routes: discardedRoutes as unknown as any,
      confidence_level: confidenceLevel,
      is_confirmed: true
    };

    const { data, error } = await supabase
      .from('decision_checkpoints')
      .upsert(checkpointData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao confirmar decisão', description: error.message, variant: 'destructive' });
      return null;
    }

    setCheckpoint({ ...data, discarded_routes: discardedRoutes } as DecisionCheckpoint);
    setRoutes(prev => prev.map(r => ({
      ...r,
      is_selected: r.id === routeId,
      is_discarded: r.id !== routeId
    })));

    toast({ 
      title: '🎯 Decisão confirmada!', 
      description: `Você escolheu: ${selectedRoute?.route_name}. Boa sorte na sua jornada!` 
    });
    
    return data;
  };

  const selectedRoute = routes.find(r => r.is_selected);
  const activeGoal = smartGoals.find(g => g.status === 'active');

  // Calculate phase progress
  const getPhaseProgress = () => {
    let completed = 0;
    const total = 6; // 6 steps: matrix, comparator, goal, plan, gaps, checkpoint

    if (routes.length > 0) completed++;
    if (routes.some(r => r.is_selected)) completed++;
    if (smartGoals.length > 0) completed++;
    if (plan90Days.length > 0) completed++;
    if (skillsGaps.length > 0) completed++;
    if (checkpoint?.is_confirmed) completed++;

    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    };
  };

  return {
    // Data
    routes,
    smartGoals,
    plan90Days,
    weeklyTasks,
    skillsGaps,
    checkpoint,
    selectedRoute,
    activeGoal,
    progressPercentage,
    isLoading,
    getPhaseProgress,

    // Route actions
    addRoute,
    updateRoute,
    deleteRoute,
    selectRoute,

    // Goal actions
    addSmartGoal,
    updateSmartGoal,

    // Plan actions
    createPlan90Days,
    addWeeklyTask,
    toggleTaskComplete,

    // Gap actions
    addSkillGap,
    updateSkillGap,

    // Checkpoint
    confirmDecision,
  };
};
