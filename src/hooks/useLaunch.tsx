import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type {
  ExecutionPanelItem,
  OpportunityDiaryEntry,
  NetworkingRoutineItem,
  InterviewSimulation,
  WeeklyCheckin
} from '@/types/launch';

export function useLaunch() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [executionItems, setExecutionItems] = useState<ExecutionPanelItem[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<OpportunityDiaryEntry[]>([]);
  const [networkingItems, setNetworkingItems] = useState<NetworkingRoutineItem[]>([]);
  const [simulations, setSimulations] = useState<InterviewSimulation[]>([]);
  const [weeklyCheckins, setWeeklyCheckins] = useState<WeeklyCheckin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      await Promise.all([
        loadExecutionItems(),
        loadDiaryEntries(),
        loadNetworkingItems(),
        loadSimulations(),
        loadWeeklyCheckins()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadExecutionItems = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('execution_panel')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading execution items:', error);
      return;
    }
    setExecutionItems(data as ExecutionPanelItem[]);
  };

  const loadDiaryEntries = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('opportunities_diary')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false });
    
    if (error) {
      console.error('Error loading diary entries:', error);
      return;
    }
    setDiaryEntries(data as OpportunityDiaryEntry[]);
  };

  const loadNetworkingItems = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('networking_routine')
      .select('*')
      .eq('user_id', user.id)
      .order('scheduled_date', { ascending: false });
    
    if (error) {
      console.error('Error loading networking items:', error);
      return;
    }
    setNetworkingItems(data as NetworkingRoutineItem[]);
  };

  const loadSimulations = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('interview_simulations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading simulations:', error);
      return;
    }
    setSimulations(data as InterviewSimulation[]);
  };

  const loadWeeklyCheckins = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('weekly_checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('week_start', { ascending: false });
    
    if (error) {
      console.error('Error loading weekly checkins:', error);
      return;
    }
    setWeeklyCheckins(data as WeeklyCheckin[]);
  };

  // Execution Panel CRUD
  const addExecutionItem = async (item: Omit<ExecutionPanelItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('execution_panel')
      .insert({ ...item, user_id: user.id });
    
    if (error) {
      toast({ title: 'Erro ao adicionar item', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Item adicionado com sucesso!' });
    loadExecutionItems();
  };

  const updateExecutionItem = async (id: string, updates: Partial<ExecutionPanelItem>) => {
    const { error } = await supabase
      .from('execution_panel')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao atualizar item', variant: 'destructive' });
      return;
    }
    
    loadExecutionItems();
  };

  const deleteExecutionItem = async (id: string) => {
    const { error } = await supabase
      .from('execution_panel')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao excluir item', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Item excluído!' });
    loadExecutionItems();
  };

  // Diary CRUD
  const addDiaryEntry = async (entry: Omit<OpportunityDiaryEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('opportunities_diary')
      .insert({ ...entry, user_id: user.id });
    
    if (error) {
      toast({ title: 'Erro ao adicionar entrada', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Entrada adicionada com sucesso!' });
    loadDiaryEntries();
  };

  const updateDiaryEntry = async (id: string, updates: Partial<OpportunityDiaryEntry>) => {
    const { error } = await supabase
      .from('opportunities_diary')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao atualizar entrada', variant: 'destructive' });
      return;
    }
    
    loadDiaryEntries();
  };

  const deleteDiaryEntry = async (id: string) => {
    const { error } = await supabase
      .from('opportunities_diary')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao excluir entrada', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Entrada excluída!' });
    loadDiaryEntries();
  };

  // Networking CRUD
  const addNetworkingItem = async (item: Omit<NetworkingRoutineItem, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('networking_routine')
      .insert({ ...item, user_id: user.id });
    
    if (error) {
      toast({ title: 'Erro ao adicionar ação', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Ação de networking adicionada!' });
    loadNetworkingItems();
  };

  const updateNetworkingItem = async (id: string, updates: Partial<NetworkingRoutineItem>) => {
    const { error } = await supabase
      .from('networking_routine')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao atualizar ação', variant: 'destructive' });
      return;
    }
    
    loadNetworkingItems();
  };

  const completeNetworkingItem = async (id: string) => {
    await updateNetworkingItem(id, { 
      completed: true, 
      completed_at: new Date().toISOString() 
    });
    toast({ title: 'Ação concluída! 🎉' });
  };

  const deleteNetworkingItem = async (id: string) => {
    const { error } = await supabase
      .from('networking_routine')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao excluir ação', variant: 'destructive' });
      return;
    }
    
    loadNetworkingItems();
  };

  // Interview Simulations
  const addSimulation = async (simulation: Omit<InterviewSimulation, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('interview_simulations')
      .insert({ ...simulation, user_id: user.id })
      .select()
      .single();
    
    if (error) {
      toast({ title: 'Erro ao criar simulação', variant: 'destructive' });
      return null;
    }
    
    loadSimulations();
    return data as InterviewSimulation;
  };

  const updateSimulation = async (id: string, updates: Partial<InterviewSimulation>) => {
    const { error } = await supabase
      .from('interview_simulations')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao atualizar simulação', variant: 'destructive' });
      return;
    }
    
    loadSimulations();
  };

  const deleteSimulation = async (id: string) => {
    const { error } = await supabase
      .from('interview_simulations')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao excluir simulação', variant: 'destructive' });
      return;
    }
    
    loadSimulations();
  };

  // Weekly Check-ins
  const addOrUpdateCheckin = async (checkin: Omit<WeeklyCheckin, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('weekly_checkins')
      .upsert({ 
        ...checkin, 
        user_id: user.id 
      }, { 
        onConflict: 'user_id,week_start' 
      });
    
    if (error) {
      toast({ title: 'Erro ao salvar check-in', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Check-in salvo com sucesso!' });
    loadWeeklyCheckins();
  };

  const deleteCheckin = async (id: string) => {
    const { error } = await supabase
      .from('weekly_checkins')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({ title: 'Erro ao excluir check-in', variant: 'destructive' });
      return;
    }
    
    loadWeeklyCheckins();
  };

  // Stats
  const getExecutionStats = () => {
    const jobApps = executionItems.filter(i => i.panel_type === 'job_application');
    const networking = executionItems.filter(i => i.panel_type === 'networking');
    const followups = executionItems.filter(i => i.panel_type === 'followup');
    
    return {
      totalJobApps: jobApps.length,
      completedJobApps: jobApps.filter(i => i.status === 'completed').length,
      totalNetworking: networking.length,
      completedNetworking: networking.filter(i => i.status === 'completed').length,
      totalFollowups: followups.length,
      completedFollowups: followups.filter(i => i.status === 'completed').length
    };
  };

  const getTodayNetworkingActions = () => {
    const today = new Date().toISOString().split('T')[0];
    return networkingItems.filter(i => i.scheduled_date === today);
  };

  const getPhaseProgress = () => {
    let totalWeight = 0;
    let completedWeight = 0;

    // Execution panel (30%)
    const stats = getExecutionStats();
    if (stats.totalJobApps + stats.totalNetworking + stats.totalFollowups > 0) {
      totalWeight += 30;
      const totalItems = stats.totalJobApps + stats.totalNetworking + stats.totalFollowups;
      const completedItems = stats.completedJobApps + stats.completedNetworking + stats.completedFollowups;
      completedWeight += (completedItems / totalItems) * 30;
    }

    // Diary entries (20%)
    if (diaryEntries.length > 0) {
      totalWeight += 20;
      completedWeight += Math.min(diaryEntries.length / 5, 1) * 20;
    }

    // Networking routine (20%)
    const todayActions = getTodayNetworkingActions();
    if (todayActions.length > 0) {
      totalWeight += 20;
      const completed = todayActions.filter(a => a.completed).length;
      completedWeight += (completed / todayActions.length) * 20;
    }

    // Interview simulations (15%)
    if (simulations.length > 0) {
      totalWeight += 15;
      const practiced = simulations.filter(s => s.practiced_at).length;
      completedWeight += (practiced / simulations.length) * 15;
    }

    // Weekly check-ins (15%)
    if (weeklyCheckins.length > 0) {
      totalWeight += 15;
      completedWeight += Math.min(weeklyCheckins.length / 4, 1) * 15;
    }

    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  };

  return {
    // Data
    executionItems,
    diaryEntries,
    networkingItems,
    simulations,
    weeklyCheckins,
    loading,
    
    // Execution Panel
    addExecutionItem,
    updateExecutionItem,
    deleteExecutionItem,
    
    // Diary
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    
    // Networking
    addNetworkingItem,
    updateNetworkingItem,
    completeNetworkingItem,
    deleteNetworkingItem,
    
    // Simulations
    addSimulation,
    updateSimulation,
    deleteSimulation,
    
    // Check-ins
    addOrUpdateCheckin,
    deleteCheckin,
    
    // Stats
    getExecutionStats,
    getTodayNetworkingActions,
    getPhaseProgress,
    
    // Reload
    reload: loadAllData
  };
}
