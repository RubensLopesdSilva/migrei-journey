import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ConsciousnessOnboarding } from '@/components/awakening/ConsciousnessOnboarding';
import { ReadinessTest } from '@/components/awakening/ReadinessTest';
import { PainMapBuilder } from '@/components/awakening/PainMapBuilder';
import { CommitmentDeclaration } from '@/components/awakening/CommitmentDeclaration';
import { FloatingCoachButton } from '@/components/coach/FloatingCoachButton';
import { PhaseIntroBlock } from '@/components/phases/PhaseIntroBlock';
import { PhaseSteps, type PhaseStep } from '@/components/phases/PhaseSteps';
import { getPhaseIntroData, PHASE_COLORS } from '@/data/phaseIntroData';
import { useAwakening } from '@/hooks/useAwakening';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { Brain, Target, Frown, Heart } from 'lucide-react';

type Step = 'consciousness' | 'readiness' | 'painmap' | 'commitment';

const steps: PhaseStep[] = [
  { key: 'consciousness', label: 'Consciência', icon: Brain },
  { key: 'readiness', label: 'Prontidão', icon: Target },
  { key: 'painmap', label: 'Mapa de Dor', icon: Frown },
  { key: 'commitment', label: 'Compromisso', icon: Heart }
];

export default function Fase1Despertar() {
  const { getPhaseProgress, commitment } = useAwakening();
  const [activeStep, setActiveStep] = useState<Step>('consciousness');

  const progress = getPhaseProgress();
  const isPhaseComplete = commitment !== null;

  // Dados do bloco introdutório com clareza UX
  const phaseIntroData = getPhaseIntroData(1, progress.percentage, isPhaseComplete);

  const renderStepContent = () => {
    switch (activeStep) {
      case 'consciousness':
        return <ConsciousnessOnboarding onComplete={() => setActiveStep('readiness')} />;
      case 'readiness':
        return <ReadinessTest onComplete={() => setActiveStep('painmap')} />;
      case 'painmap':
        return <PainMapBuilder onComplete={() => setActiveStep('commitment')} />;
      case 'commitment':
        return <CommitmentDeclaration onComplete={() => window.location.href = '/progresso'} />;
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
          completedSteps={progress.completed}
          phaseColor={PHASE_COLORS[1]}
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
