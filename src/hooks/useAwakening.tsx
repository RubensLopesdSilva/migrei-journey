import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  ConsciousnessResponse,
  ReadinessAssessment,
  PainMapItem,
  CommitmentDeclaration,
  CoachMessage,
  ReadinessAnswer,
  CONSCIOUSNESS_QUESTIONS,
  READINESS_QUESTIONS,
  ReadinessCategory
} from '@/types/awakening';

export function useAwakening() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [consciousnessResponses, setConsciousnessResponses] = useState<ConsciousnessResponse[]>([]);
  const [readinessAssessment, setReadinessAssessment] = useState<ReadinessAssessment | null>(null);
  const [painMap, setPainMap] = useState<PainMapItem[]>([]);
  const [commitment, setCommitment] = useState<CommitmentDeclaration | null>(null);

  // Fetch all awakening data
  const fetchAwakeningData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [
        { data: consciousness },
        { data: readiness },
        { data: pain },
        { data: commit }
      ] = await Promise.all([
        supabase.from('consciousness_responses').select('*').eq('user_id', user.id),
        supabase.from('readiness_assessments').select('*').eq('user_id', user.id).single(),
        supabase.from('pain_map').select('*').eq('user_id', user.id),
        supabase.from('commitment_declarations').select('*').eq('user_id', user.id).single()
      ]);

      setConsciousnessResponses(consciousness || []);
      if (readiness) {
        setReadinessAssessment({
          ...readiness,
          readiness_level: readiness.readiness_level as 'not_ready' | 'preparing' | 'ready',
          emotional_answers: (readiness.emotional_answers || []) as unknown as ReadinessAnswer[],
          financial_answers: (readiness.financial_answers || []) as unknown as ReadinessAnswer[],
          professional_answers: (readiness.professional_answers || []) as unknown as ReadinessAnswer[]
        });
      }
      setPainMap((pain || []).map(p => ({
        ...p,
        pain_type: p.pain_type as 'hurts' | 'tires' | 'frustrates'
      })));
      setCommitment(commit as CommitmentDeclaration | null);
    } catch (error) {
      console.error('Error fetching awakening data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAwakeningData();
  }, [fetchAwakeningData]);

  // Save consciousness response
  const saveConsciousnessResponse = async (questionKey: string, value: number, text?: string) => {
    if (!user) return;
    
    const question = CONSCIOUSNESS_QUESTIONS.find(q => q.key === questionKey);
    if (!question) return;

    try {
      const { error } = await supabase
        .from('consciousness_responses')
        .upsert({
          user_id: user.id,
          question_key: questionKey,
          question_text: question.text,
          response_value: value,
          response_text: text
        }, { onConflict: 'user_id,question_key' });

      if (error) throw error;
      
      await fetchAwakeningData();
    } catch (error) {
      console.error('Error saving response:', error);
      toast.error('Erro ao salvar resposta');
    }
  };

  // Calculate readiness score
  const calculateCategoryScore = (answers: ReadinessAnswer[]): number => {
    if (answers.length === 0) return 0;
    const totalWeight = answers.reduce((sum, a) => sum + a.weight, 0);
    const weightedSum = answers.reduce((sum, a) => sum + (a.value * a.weight), 0);
    return Math.round((weightedSum / (totalWeight * 10)) * 100);
  };

  // Save readiness assessment
  const saveReadinessAssessment = async (
    category: ReadinessCategory,
    answers: ReadinessAnswer[]
  ) => {
    if (!user) return;

    try {
      // Get existing assessment or create new
      const { data: existing } = await supabase
        .from('readiness_assessments')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const score = calculateCategoryScore(answers);
      const updateData: Record<string, unknown> = {
        user_id: user.id,
        [`${category}_score`]: score,
        [`${category}_answers`]: answers
      };

      if (existing) {
        const { error } = await supabase
          .from('readiness_assessments')
          .update(updateData)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const insertData = {
          user_id: user.id,
          emotional_score: category === 'emotional' ? score : 0,
          financial_score: category === 'financial' ? score : 0,
          professional_score: category === 'professional' ? score : 0,
          emotional_answers: JSON.stringify(category === 'emotional' ? answers : []),
          financial_answers: JSON.stringify(category === 'financial' ? answers : []),
          professional_answers: JSON.stringify(category === 'professional' ? answers : [])
        };
        const { error } = await supabase
          .from('readiness_assessments')
          .insert(insertData);
        if (error) throw error;
      }

      await fetchAwakeningData();
      toast.success('Avaliação salva!');
    } catch (error) {
      console.error('Error saving readiness:', error);
      toast.error('Erro ao salvar avaliação');
    }
  };

  // Add pain point
  const addPainPoint = async (painType: 'hurts' | 'tires' | 'frustrates', description: string, intensity: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pain_map')
        .insert({
          user_id: user.id,
          pain_type: painType,
          description,
          intensity
        });

      if (error) throw error;
      await fetchAwakeningData();
      toast.success('Ponto de dor adicionado');
    } catch (error) {
      console.error('Error adding pain point:', error);
      toast.error('Erro ao adicionar');
    }
  };

  // Remove pain point
  const removePainPoint = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pain_map')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAwakeningData();
    } catch (error) {
      console.error('Error removing pain point:', error);
      toast.error('Erro ao remover');
    }
  };

  // Save commitment
  const saveCommitment = async (customText?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('commitment_declarations')
        .upsert({
          user_id: user.id,
          declaration_text: 'Eu assumo o compromisso de conduzir minha transição profissional',
          custom_text: customText,
          confirmed_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      await fetchAwakeningData();
      toast.success('🎉 Compromisso firmado! Sua jornada começou!');
    } catch (error) {
      console.error('Error saving commitment:', error);
      toast.error('Erro ao salvar compromisso');
    }
  };

  // Calculate overall progress
  const getPhaseProgress = useCallback(() => {
    let completed = 0;
    const total = 4; // 4 steps in phase 1

    // Step 1: Consciousness (at least 3 questions answered)
    if (consciousnessResponses.length >= 3) completed++;

    // Step 2: Readiness test completed
    if (readinessAssessment && 
        readinessAssessment.emotional_score > 0 && 
        readinessAssessment.financial_score > 0 && 
        readinessAssessment.professional_score > 0) {
      completed++;
    }

    // Step 3: Pain map (at least 2 items)
    if (painMap.length >= 2) completed++;

    // Step 4: Commitment declared
    if (commitment) completed++;

    return { completed, total, percentage: Math.round((completed / total) * 100) };
  }, [consciousnessResponses, readinessAssessment, painMap, commitment]);

  return {
    loading,
    consciousnessResponses,
    readinessAssessment,
    painMap,
    commitment,
    saveConsciousnessResponse,
    saveReadinessAssessment,
    addPainPoint,
    removePainPoint,
    saveCommitment,
    getPhaseProgress,
    refetch: fetchAwakeningData
  };
}
