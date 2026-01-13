import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type {
  DiagnosticResult,
  CareerWheelAssessment,
  DiaryEntry,
  TimelineEvent,
  CompetencyAssessment,
  ProfessionRecommendation,
  ClarityReport,
  DiagnosticType,
  EmotionalReaction,
  EventType,
  CompetencyCategory,
} from '@/types/discovery';

export function useDiscovery() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [careerWheel, setCareerWheel] = useState<CareerWheelAssessment[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [competencies, setCompetencies] = useState<CompetencyAssessment[]>([]);
  const [recommendations, setRecommendations] = useState<ProfessionRecommendation[]>([]);
  const [clarityReport, setClarityReport] = useState<ClarityReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);

  // Fetch all discovery data
  const fetchDiscoveryData = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [
        diagnosticsRes,
        careerWheelRes,
        diaryRes,
        timelineRes,
        competenciesRes,
        recommendationsRes,
        clarityRes,
      ] = await Promise.all([
        supabase.from('diagnostic_results').select('*').eq('user_id', user.id),
        supabase.from('career_wheel_assessments').select('*').eq('user_id', user.id),
        supabase.from('discovery_diary_entries').select('*').eq('user_id', user.id).order('day_number'),
        supabase.from('professional_timeline').select('*').eq('user_id', user.id).order('event_year', { ascending: false }),
        supabase.from('competency_assessments').select('*').eq('user_id', user.id),
        supabase.from('profession_recommendations').select('*').eq('user_id', user.id).order('match_score', { ascending: false }),
        supabase.from('clarity_reports').select('*').eq('user_id', user.id).maybeSingle(),
      ]);

      if (diagnosticsRes.data) setDiagnosticResults(diagnosticsRes.data as unknown as DiagnosticResult[]);
      if (careerWheelRes.data) setCareerWheel(careerWheelRes.data as unknown as CareerWheelAssessment[]);
      if (diaryRes.data) setDiaryEntries(diaryRes.data as unknown as DiaryEntry[]);
      if (timelineRes.data) setTimeline(timelineRes.data as unknown as TimelineEvent[]);
      if (competenciesRes.data) setCompetencies(competenciesRes.data as unknown as CompetencyAssessment[]);
      if (recommendationsRes.data) setRecommendations(recommendationsRes.data as unknown as ProfessionRecommendation[]);
      if (clarityRes.data) setClarityReport(clarityRes.data as unknown as ClarityReport);
    } catch (error) {
      console.error('Error fetching discovery data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDiscoveryData();
  }, [fetchDiscoveryData]);

  // Save Diagnostic Result
  const saveDiagnosticResult = async (
    diagnosticType: DiagnosticType,
    answers: Record<string, unknown>,
    scores: Record<string, number>,
    resultSummary?: string
  ) => {
    if (!user) return;

    try {
      const existing = diagnosticResults.find(d => d.diagnostic_type === diagnosticType);
      
      if (existing) {
        const { error } = await supabase
          .from('diagnostic_results')
          .update({
            answers: answers as unknown as Record<string, never>,
            scores: scores as unknown as Record<string, never>,
            result_summary: resultSummary,
            completed_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('diagnostic_results')
          .insert({
            user_id: user.id,
            diagnostic_type: diagnosticType,
            answers: answers as unknown as Record<string, never>,
            scores: scores as unknown as Record<string, never>,
            result_summary: resultSummary,
            completed_at: new Date().toISOString(),
          });
        if (error) throw error;
      }

      toast({ title: 'Diagnóstico salvo com sucesso!' });
      fetchDiscoveryData();
    } catch (error) {
      console.error('Error saving diagnostic:', error);
      toast({ title: 'Erro ao salvar diagnóstico', variant: 'destructive' });
    }
  };

  // Save Career Wheel Assessment
  const saveCareerWheelAssessment = async (
    dimension: string,
    currentRating: number,
    desiredRating: number,
    notes?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('career_wheel_assessments')
        .upsert({
          user_id: user.id,
          dimension,
          current_rating: currentRating,
          desired_rating: desiredRating,
          notes,
        }, { onConflict: 'user_id,dimension' });

      if (error) throw error;
      fetchDiscoveryData();
    } catch (error) {
      console.error('Error saving career wheel:', error);
      toast({ title: 'Erro ao salvar avaliação', variant: 'destructive' });
    }
  };

  // Save Diary Entry
  const saveDiaryEntry = async (
    dayNumber: number,
    question: string,
    response: string,
    emotionalReaction: EmotionalReaction
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('discovery_diary_entries')
        .upsert({
          user_id: user.id,
          day_number: dayNumber,
          question,
          response,
          emotional_reaction: emotionalReaction,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,day_number' });

      if (error) throw error;
      toast({ title: 'Reflexão salva!' });
      fetchDiscoveryData();
    } catch (error) {
      console.error('Error saving diary entry:', error);
      toast({ title: 'Erro ao salvar reflexão', variant: 'destructive' });
    }
  };

  // Add Timeline Event
  const addTimelineEvent = async (
    eventYear: number,
    eventTitle: string,
    eventDescription: string,
    eventType: EventType,
    learnings?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('professional_timeline')
        .insert({
          user_id: user.id,
          event_year: eventYear,
          event_title: eventTitle,
          event_description: eventDescription,
          event_type: eventType,
          learnings,
          sort_order: timeline.length,
        });

      if (error) throw error;
      toast({ title: 'Evento adicionado!' });
      fetchDiscoveryData();
    } catch (error) {
      console.error('Error adding timeline event:', error);
      toast({ title: 'Erro ao adicionar evento', variant: 'destructive' });
    }
  };

  // Update Timeline Event with AI Learning
  const updateTimelineWithAILearning = async (eventId: string, aiLearning: string) => {
    try {
      const { error } = await supabase
        .from('professional_timeline')
        .update({ ai_suggested_learning: aiLearning })
        .eq('id', eventId);

      if (error) throw error;
      fetchDiscoveryData();
    } catch (error) {
      console.error('Error updating timeline learning:', error);
    }
  };

  // Delete Timeline Event
  const deleteTimelineEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('professional_timeline')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      toast({ title: 'Evento removido!' });
      fetchDiscoveryData();
    } catch (error) {
      console.error('Error deleting timeline event:', error);
      toast({ title: 'Erro ao remover evento', variant: 'destructive' });
    }
  };

  // Save Competency Assessment
  const saveCompetency = async (
    competencyName: string,
    category: CompetencyCategory,
    selfRating: number,
    evidence?: string,
    isTopStrength?: boolean,
    isNeglected?: boolean
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('competency_assessments')
        .upsert({
          user_id: user.id,
          competency_name: competencyName,
          category,
          self_rating: selfRating,
          evidence,
          is_top_strength: isTopStrength,
          is_neglected: isNeglected,
        }, { onConflict: 'user_id,competency_name' });

      if (error) throw error;
      fetchDiscoveryData();
    } catch (error) {
      console.error('Error saving competency:', error);
      toast({ title: 'Erro ao salvar competência', variant: 'destructive' });
    }
  };

  // Generate AI Profession Recommendations
  const generateRecommendations = async () => {
    if (!user) return;

    setIsGeneratingRecommendations(true);
    try {
      // Get pain map from Phase 1
      const { data: painMapData } = await supabase
        .from('pain_map')
        .select('*')
        .eq('user_id', user.id);

      const userProfile = {
        diagnosticResults: diagnosticResults.map(d => ({
          diagnostic_type: d.diagnostic_type,
          scores: d.scores,
          result_summary: d.result_summary,
        })),
        careerWheel: careerWheel.map(c => ({
          dimension: c.dimension,
          current_rating: c.current_rating,
          desired_rating: c.desired_rating,
        })),
        diaryInsights: diaryEntries.filter(d => d.response).map(d => d.response!),
        timeline: timeline.map(t => ({
          event_title: t.event_title,
          event_type: t.event_type,
          learnings: t.learnings,
        })),
        competencies: competencies.map(c => ({
          competency_name: c.competency_name,
          category: c.category,
          self_rating: c.self_rating,
          is_top_strength: c.is_top_strength,
        })),
        painMap: (painMapData || []).map((p: { pain_type: string; description: string; intensity: number }) => ({
          pain_type: p.pain_type,
          description: p.description,
          intensity: p.intensity,
        })),
      };

      const response = await supabase.functions.invoke('profession-recommendations', {
        body: { userProfile, action: 'recommend_professions' },
      });

      if (response.error) throw response.error;

      const aiRecommendations = response.data.recommendations || [];

      // Clear existing recommendations
      await supabase
        .from('profession_recommendations')
        .delete()
        .eq('user_id', user.id);

      // Save new recommendations
      for (const rec of aiRecommendations) {
        await supabase
          .from('profession_recommendations')
          .insert({
            user_id: user.id,
            profession_name: rec.profession_name,
            profession_description: rec.profession_description,
            match_score: rec.match_score,
            match_reasons: rec.match_reasons,
            salary_range: rec.salary_range,
            growth_outlook: rec.growth_outlook,
            required_skills: rec.required_skills,
            user_matching_skills: rec.user_matching_skills,
            skills_gap: rec.skills_gap,
          });
      }

      toast({ title: 'Recomendações geradas com sucesso!' });
      fetchDiscoveryData();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({ title: 'Erro ao gerar recomendações', variant: 'destructive' });
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  // Select a profession
  const selectProfession = async (professionId: string) => {
    try {
      // Deselect all first
      await supabase
        .from('profession_recommendations')
        .update({ is_selected: false })
        .eq('user_id', user?.id);

      // Select the chosen one
      const { error } = await supabase
        .from('profession_recommendations')
        .update({ is_selected: true })
        .eq('id', professionId);

      if (error) throw error;
      toast({ title: 'Profissão selecionada!' });
      fetchDiscoveryData();
    } catch (error) {
      console.error('Error selecting profession:', error);
      toast({ title: 'Erro ao selecionar profissão', variant: 'destructive' });
    }
  };

  // Generate Clarity Report
  const generateClarityReport = async () => {
    if (!user) return;

    try {
      // Get pain map from Phase 1
      const { data: painMapData } = await supabase
        .from('pain_map')
        .select('*')
        .eq('user_id', user.id);

      const userProfile = {
        diagnosticResults: diagnosticResults.map(d => ({
          diagnostic_type: d.diagnostic_type,
          scores: d.scores,
          result_summary: d.result_summary,
        })),
        careerWheel: careerWheel.map(c => ({
          dimension: c.dimension,
          current_rating: c.current_rating,
          desired_rating: c.desired_rating,
        })),
        diaryInsights: diaryEntries.filter(d => d.response).map(d => d.response!),
        timeline: timeline.map(t => ({
          event_title: t.event_title,
          event_type: t.event_type,
          learnings: t.learnings,
        })),
        competencies: competencies.map(c => ({
          competency_name: c.competency_name,
          category: c.category,
          self_rating: c.self_rating,
          is_top_strength: c.is_top_strength,
        })),
        painMap: (painMapData || []).map((p: { pain_type: string; description: string; intensity: number }) => ({
          pain_type: p.pain_type,
          description: p.description,
          intensity: p.intensity,
        })),
      };

      const response = await supabase.functions.invoke('profession-recommendations', {
        body: { userProfile, action: 'generate_clarity_report' },
      });

      if (response.error) throw response.error;

      const reportData = response.data;

      // Save clarity report
      const { error } = await supabase
        .from('clarity_reports')
        .upsert({
          user_id: user.id,
          professional_identity: reportData.professional_identity,
          core_motivators: reportData.core_motivators,
          recommended_routes: reportData.recommended_routes,
          top_competencies: reportData.top_competencies,
          areas_to_develop: reportData.areas_to_develop,
          generated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      toast({ title: 'Relatório de Clareza gerado!' });
      fetchDiscoveryData();
    } catch (error) {
      console.error('Error generating clarity report:', error);
      toast({ title: 'Erro ao gerar relatório', variant: 'destructive' });
    }
  };

  // Calculate phase progress
  const getPhaseProgress = () => {
    let completed = 0;
    const total = 6; // 4 diagnostics + career wheel + diary

    // Check diagnostics
    const completedDiagnostics = diagnosticResults.filter(d => d.completed_at).length;
    if (completedDiagnostics >= 4) completed += 1;
    else completed += completedDiagnostics * 0.25;

    // Check career wheel
    if (careerWheel.length >= 5) completed += 1;

    // Check diary (at least 5 days)
    const completedDays = diaryEntries.filter(d => d.completed_at).length;
    if (completedDays >= 5) completed += 1;
    else completed += completedDays * 0.2;

    // Check timeline (at least 3 events)
    if (timeline.length >= 3) completed += 1;

    // Check competencies (at least 8)
    if (competencies.length >= 8) completed += 1;

    // Check recommendations generated
    if (recommendations.length > 0) completed += 1;

    return Math.round((completed / total) * 100);
  };

  return {
    // Data
    diagnosticResults,
    careerWheel,
    diaryEntries,
    timeline,
    competencies,
    recommendations,
    clarityReport,
    isLoading,
    isGeneratingRecommendations,
    
    // Actions
    saveDiagnosticResult,
    saveCareerWheelAssessment,
    saveDiaryEntry,
    addTimelineEvent,
    updateTimelineWithAILearning,
    deleteTimelineEvent,
    saveCompetency,
    generateRecommendations,
    selectProfession,
    generateClarityReport,
    refetch: fetchDiscoveryData,
    
    // Computed
    phaseProgress: getPhaseProgress(),
  };
}
