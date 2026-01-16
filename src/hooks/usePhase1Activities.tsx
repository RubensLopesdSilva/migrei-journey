import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useAwakening } from '@/hooks/useAwakening';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Phase 1 activity IDs from the database
// These map directly to the phase_activities table for Phase 1: Despertar
const PHASE_1_ACTIVITY_MAP = {
  profile: 'a7f1c071-7232-43a9-af06-b84207db86f3',        // "Complete seu perfil profissional"
  readiness: '2f34121f-5e30-4a93-94c7-4edfdd9f768b',      // "Faça o Teste de Prontidão"
  painmap: 'a232858c-4d50-4743-9e52-d4b45fc19baf',        // "Mapeie suas dores profissionais"
  commitment: '44d7c7cb-2551-4497-ab4a-fd92d281e9f5',     // "Declare seu compromisso"
} as const;

const PHASE_1_ID = '25fd7273-3ba2-4104-964d-d0126db222a7';

type Phase1Step = keyof typeof PHASE_1_ACTIVITY_MAP;

/**
 * Hook that bridges Phase 1 (Awakening) data with the gamification system
 * Automatically completes activities when steps are finished
 */
export function usePhase1Activities() {
  const { user } = useAuth();
  const { completeActivity, completedActivities, refreshProgress, loading: progressLoading } = useProgress();
  const { readinessAssessment, painMap, commitment } = useAwakening();
  const [profileComplete, setProfileComplete] = useState(false);
  
  // Track what we've already processed to avoid duplicate calls
  const processedRef = useRef<Set<string>>(new Set());

  // Check if profile is complete
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('full_name, bio')
        .eq('user_id', user.id)
        .single();
      
      // Profile is complete if user has a full name
      setProfileComplete(!!(data?.full_name && data.full_name.trim().length > 0));
    };
    
    checkProfile();
  }, [user]);

  /**
   * Check if a step's activity is already completed
   */
  const isActivityCompleted = useCallback((step: Phase1Step): boolean => {
    const activityId = PHASE_1_ACTIVITY_MAP[step];
    return completedActivities.includes(activityId);
  }, [completedActivities]);

  /**
   * Complete an activity for a specific step
   */
  const completeStepActivity = useCallback(async (step: Phase1Step) => {
    if (!user) return;
    
    const activityId = PHASE_1_ACTIVITY_MAP[step];
    
    // Skip if already completed or already being processed
    if (completedActivities.includes(activityId) || processedRef.current.has(activityId)) {
      return;
    }
    
    // Mark as being processed
    processedRef.current.add(activityId);
    
    try {
      await completeActivity(activityId, PHASE_1_ID);
    } catch (error) {
      console.error(`Error completing activity for ${step}:`, error);
      // Remove from processed if failed
      processedRef.current.delete(activityId);
    }
  }, [user, completedActivities, completeActivity]);

  /**
   * Check completion status based on awakening data
   */
  const stepCompletionStatus = useMemo(() => {
    return {
      profile: profileComplete,
      readiness: !!(readinessAssessment && 
        readinessAssessment.emotional_score > 0 && 
        readinessAssessment.financial_score > 0 && 
        readinessAssessment.professional_score > 0),
      painmap: painMap.length >= 2,
      commitment: !!commitment,
    };
  }, [profileComplete, readinessAssessment, painMap, commitment]);

  /**
   * Auto-complete activities when data criteria is met
   * This runs on data changes to sync up any missed completions
   */
  useEffect(() => {
    if (!user || progressLoading) return;

    const syncCompletions = async () => {
      // Check each step and complete if criteria met but activity not recorded
      for (const [step, isComplete] of Object.entries(stepCompletionStatus)) {
        if (isComplete && !isActivityCompleted(step as Phase1Step)) {
          await completeStepActivity(step as Phase1Step);
        }
      }
    };

    syncCompletions();
  }, [user, progressLoading, stepCompletionStatus, isActivityCompleted, completeStepActivity]);

  return {
    isActivityCompleted,
    completeStepActivity,
    stepCompletionStatus,
    refreshProgress,
    activityIds: PHASE_1_ACTIVITY_MAP,
    phaseId: PHASE_1_ID,
    profileComplete,
  };
}
