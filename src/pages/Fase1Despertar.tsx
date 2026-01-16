import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ConsciousnessOnboarding } from '@/components/awakening/ConsciousnessOnboarding';
import { ReadinessTest } from '@/components/awakening/ReadinessTest';
import { PainMapBuilder } from '@/components/awakening/PainMapBuilder';
import { CommitmentDeclaration } from '@/components/awakening/CommitmentDeclaration';
import { PhaseEvaluation } from '@/components/awakening/PhaseEvaluation';
import { FloatingCoachButton } from '@/components/coach/FloatingCoachButton';
import { PhaseIntroBlock } from '@/components/phases/PhaseIntroBlock';
import { PhaseSteps, type PhaseStep } from '@/components/phases/PhaseSteps';
import { getPhaseIntroData, PHASE_COLORS } from '@/data/phaseIntroData';
import { useAwakening } from '@/hooks/useAwakening';
import { usePhase1Activities } from '@/hooks/usePhase1Activities';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { Brain, Target, Frown, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Step = 'consciousness' | 'readiness' | 'painmap' | 'evaluation' | 'commitment';

const steps: PhaseStep[] = [
  { key: 'consciousness', label: 'Consciência', icon: Brain },
  { key: 'readiness', label: 'Prontidão', icon: Target },
  { key: 'painmap', label: 'Mapa de Dor', icon: Frown },
  { key: 'evaluation', label: 'Avaliação', icon: Sparkles },
  { key: 'commitment', label: 'Compromisso', icon: Heart }
];

export default function Fase1Despertar() {
  const navigate = useNavigate();
  const { getPhaseProgress, commitment, consciousnessResponses, readinessAssessment, painMap } = useAwakening();
  const { completeStepActivity } = usePhase1Activities();
  const [activeStep, setActiveStep] = useState<Step>('consciousness');

  const progress = getPhaseProgress();
  const isPhaseComplete = commitment !== null;

  // Calculate which steps are completed based on data
  const getCompletedStepsFromData = () => {
    let count = 0;
    // Consciousness: at least 3 responses
    if (consciousnessResponses.length >= 3) count++;
    // Readiness: all scores > 0
    if (readinessAssessment && 
        readinessAssessment.emotional_score > 0 && 
        readinessAssessment.financial_score > 0 && 
        readinessAssessment.professional_score > 0) count++;
    // Pain map: at least 2 items
    if (painMap.length >= 2) count++;
    // Evaluation is considered complete when pain map is done (it's a view step)
    if (painMap.length >= 2) count++;
    // Commitment declared
    if (commitment) count++;
    return count;
  };

  // Get the active step index
  const activeIndex = steps.findIndex(s => s.key === activeStep);
  
  // Use the maximum between data-based completion and current step position
  // This ensures that when navigating forward, previous steps are accessible
  const completedStepsCount = Math.max(getCompletedStepsFromData(), activeIndex);

  // Auto-navigate to the correct step based on progress
  useEffect(() => {
    if (consciousnessResponses.length < 3) {
      setActiveStep('consciousness');
    } else if (!readinessAssessment || 
               readinessAssessment.emotional_score === 0 || 
               readinessAssessment.financial_score === 0 || 
               readinessAssessment.professional_score === 0) {
      setActiveStep('readiness');
    } else if (painMap.length < 2) {
      setActiveStep('painmap');
    } else if (!commitment) {
      // Show evaluation before commitment
      setActiveStep('evaluation');
    } else {
      setActiveStep('commitment');
    }
  }, []);

  // Dados do bloco introdutório com clareza UX
  const phaseIntroData = getPhaseIntroData(1, progress.percentage, isPhaseComplete);

  const handleStepComplete = async (currentStep: Step, nextStep: Step) => {
    // Complete the activity for gamification if it's a tracked step
    if (currentStep === 'readiness' || currentStep === 'painmap' || currentStep === 'commitment') {
      await completeStepActivity(currentStep);
    }
    setActiveStep(nextStep);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 'consciousness':
        return <ConsciousnessOnboarding onComplete={() => handleStepComplete('consciousness', 'readiness')} />;
      case 'readiness':
        return <ReadinessTest onComplete={() => handleStepComplete('readiness', 'painmap')} />;
      case 'painmap':
        return <PainMapBuilder onComplete={() => handleStepComplete('painmap', 'evaluation')} />;
      case 'evaluation':
        return <PhaseEvaluation onComplete={() => handleStepComplete('evaluation', 'commitment')} />;
      case 'commitment':
        return <CommitmentDeclaration onComplete={async () => {
          await handleStepComplete('commitment', 'commitment');
          navigate('/fase-2-descobrir');
        }} />;
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <PageContent className="space-y-6">
        {/* Breadcrumb */}
        <PageBreadcrumb
          items={[
            { label: "Jornada", href: "/progresso" },
            { label: "Fase 1: Despertar", current: true }
          ]}
        />

        {/* Blocos de Clareza UX - O que vai aprender, Para que serve, O que terá pronto */}
        <PhaseIntroBlock data={phaseIntroData} />

        {/* Phase Steps Navigation */}
        <PhaseSteps
          steps={steps}
          activeStep={activeStep}
          onStepChange={(step) => setActiveStep(step as Step)}
          completedSteps={completedStepsCount}
          phaseColor={PHASE_COLORS[1]}
          lockSequential={true}
        />

        {/* Step Content */}
        <div className="mt-6">
          {renderStepContent()}
        </div>

        {/* Floating Coach Button */}
        <FloatingCoachButton 
          phase="despertar" 
          context={`Usuário está na etapa: ${activeStep}`}
          greeting="Olá! 👋 Estou aqui para te ajudar na fase de Despertar. Esta é a fase mais importante - você está tomando consciência da necessidade de mudança. Como posso te apoiar?"
        />
      </PageContent>
    </PageLayout>
  );
}
