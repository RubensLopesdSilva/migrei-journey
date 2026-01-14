import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { 
  ResultsEvaluation, 
  AchievementLine, 
  FinalReport, 
  SymbolicCelebration, 
  CycleReentry 
} from '@/types/enjoy';

export const useEnjoy = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [resultsEvaluation, setResultsEvaluation] = useState<ResultsEvaluation[]>([]);
  const [achievements, setAchievements] = useState<AchievementLine[]>([]);
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);
  const [celebration, setCelebration] = useState<SymbolicCelebration | null>(null);
  const [cycleReentries, setCycleReentries] = useState<CycleReentry[]>([]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await Promise.all([
        fetchResultsEvaluation(),
        fetchAchievements(),
        fetchFinalReport(),
        fetchCelebration(),
        fetchCycleReentries(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResultsEvaluation = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('results_evaluation')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching results evaluation:', error);
    } else {
      setResultsEvaluation(data || []);
    }
  };

  const fetchAchievements = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('achievements_line')
      .select('*')
      .eq('user_id', user.id)
      .order('achieved_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching achievements:', error);
    } else {
      setAchievements(data || []);
    }
  };

  const fetchFinalReport = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('final_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching final report:', error);
    } else {
      setFinalReport(data as FinalReport | null);
    }
  };

  const fetchCelebration = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('symbolic_celebrations')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching celebration:', error);
    } else {
      setCelebration(data as SymbolicCelebration | null);
    }
  };

  const fetchCycleReentries = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('cycle_reentries')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching cycle reentries:', error);
    } else {
      setCycleReentries(data || []);
    }
  };

  const saveResultEvaluation = async (dimension: string, beforeScore: number, afterScore: number, reflection?: string) => {
    if (!user) return;
    
    const existing = resultsEvaluation.find(r => r.dimension === dimension);
    
    if (existing) {
      const { error } = await supabase
        .from('results_evaluation')
        .update({ before_score: beforeScore, after_score: afterScore, reflection })
        .eq('id', existing.id);
      
      if (error) {
        toast({ title: 'Erro ao atualizar avaliação', variant: 'destructive' });
      } else {
        toast({ title: 'Avaliação atualizada!' });
        fetchResultsEvaluation();
      }
    } else {
      const { error } = await supabase
        .from('results_evaluation')
        .insert({ user_id: user.id, dimension, before_score: beforeScore, after_score: afterScore, reflection });
      
      if (error) {
        toast({ title: 'Erro ao salvar avaliação', variant: 'destructive' });
      } else {
        toast({ title: 'Avaliação salva!' });
        fetchResultsEvaluation();
      }
    }
  };

  const addAchievement = async (title: string, description?: string, achievementType: string = 'milestone', phaseId?: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('achievements_line')
      .insert({ user_id: user.id, title, description, achievement_type: achievementType, phase_id: phaseId });
    
    if (error) {
      toast({ title: 'Erro ao adicionar conquista', variant: 'destructive' });
    } else {
      toast({ title: 'Conquista registrada! 🎉' });
      fetchAchievements();
    }
  };

  const celebrateAchievement = async (achievementId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('achievements_line')
      .update({ is_celebrated: true })
      .eq('id', achievementId);
    
    if (error) {
      toast({ title: 'Erro ao celebrar conquista', variant: 'destructive' });
    } else {
      fetchAchievements();
    }
  };

  const generateFinalReport = async (journeySummary: string, keyLearnings: string[], newProfessionalIdentity: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('final_reports')
      .insert({
        user_id: user.id,
        journey_summary: journeySummary,
        key_learnings: keyLearnings,
        new_professional_identity: newProfessionalIdentity,
        total_xp_earned: 0, // Would be calculated from progress
        total_days: 0, // Would be calculated
        phases_completed: 5,
      });
    
    if (error) {
      toast({ title: 'Erro ao gerar relatório', variant: 'destructive' });
    } else {
      toast({ title: 'Relatório final gerado!' });
      fetchFinalReport();
    }
  };

  const createCelebration = async (celebrationMessage: string, avatarMessage: string, cycleNumber: number = 1) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('symbolic_celebrations')
      .insert({
        user_id: user.id,
        celebration_message: celebrationMessage,
        avatar_message: avatarMessage,
        cycle_number: cycleNumber,
      });
    
    if (error) {
      toast({ title: 'Erro ao criar celebração', variant: 'destructive' });
    } else {
      toast({ title: 'Celebração criada! 🎊' });
      fetchCelebration();
    }
  };

  const startNewCycle = async (nextLevelGoal: string, motivation: string) => {
    if (!user) return;
    
    const currentCycle = cycleReentries.length > 0 ? cycleReentries[0].new_cycle : 1;
    
    const { error } = await supabase
      .from('cycle_reentries')
      .insert({
        user_id: user.id,
        previous_cycle: currentCycle,
        new_cycle: currentCycle + 1,
        next_level_goal: nextLevelGoal,
        motivation: motivation,
      });
    
    if (error) {
      toast({ title: 'Erro ao iniciar novo ciclo', variant: 'destructive' });
    } else {
      toast({ title: 'Novo ciclo iniciado! 🚀' });
      fetchCycleReentries();
    }
  };

  return {
    loading,
    resultsEvaluation,
    achievements,
    finalReport,
    celebration,
    cycleReentries,
    saveResultEvaluation,
    addAchievement,
    celebrateAchievement,
    generateFinalReport,
    createCelebration,
    startNewCycle,
    refreshData: fetchAllData,
  };
};
