import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { PhaseIntroBlock } from '@/components/phases/PhaseIntroBlock';
import { PhaseSteps, type PhaseStep } from '@/components/phases/PhaseSteps';
import { getPhaseIntroData, PHASE_COLORS } from '@/data/phaseIntroData';
import { PossibilitiesMatrix } from '@/components/decision/PossibilitiesMatrix';
import { RouteComparator } from '@/components/decision/RouteComparator';
import { SmartGoalBuilder } from '@/components/decision/SmartGoalBuilder';
import { Plan90Days } from '@/components/decision/Plan90Days';
import { GapsMap } from '@/components/decision/GapsMap';
import { DecisionCheckpoint } from '@/components/decision/DecisionCheckpoint';
import { FloatingCoachButton } from '@/components/coach/FloatingCoachButton';
import { PhaseAccessGate } from '@/components/subscription/PhaseAccessGate';
import { SEOHead, SEOBreadcrumbs } from '@/components/seo';
import { useDecision } from '@/hooks/useDecision';
import { Target, BarChart3, Goal, Calendar, Map, CheckCircle2 } from 'lucide-react';

type Step = 'matrix' | 'comparator' | 'goal' | 'plan' | 'gaps' | 'checkpoint';

const steps: PhaseStep[] = [
  { key: 'matrix', label: 'Matriz', icon: BarChart3 },
  { key: 'comparator', label: 'Comparar', icon: Target },
  { key: 'goal', label: 'Meta SMART', icon: Goal },
  { key: 'plan', label: 'Plano 90d', icon: Calendar },
  { key: 'gaps', label: 'Lacunas', icon: Map },
  { key: 'checkpoint', label: 'Decisão', icon: CheckCircle2 }
];

export default function Fase3Decidir() {
  const { getPhaseProgress, checkpoint } = useDecision();
  const [activeStep, setActiveStep] = useState<Step>('matrix');

  const progress = getPhaseProgress();
  const isPhaseComplete = checkpoint?.is_confirmed === true;

  // Dados do bloco introdutório com clareza UX
  const phaseIntroData = getPhaseIntroData(3, progress.percentage, isPhaseComplete);

  const renderStepContent = () => {
    switch (activeStep) {
      case 'matrix': return <PossibilitiesMatrix onComplete={() => setActiveStep('comparator')} />;
      case 'comparator': return <RouteComparator onComplete={() => setActiveStep('goal')} />;
      case 'goal': return <SmartGoalBuilder onComplete={() => setActiveStep('plan')} />;
      case 'plan': return <Plan90Days onComplete={() => setActiveStep('gaps')} />;
      case 'gaps': return <GapsMap onComplete={() => setActiveStep('checkpoint')} />;
      case 'checkpoint': return <DecisionCheckpoint onComplete={() => window.location.href = '/progresso'} />;
      default: return null;
    }
  };

  return (
    <>
      <SEOHead
        title="Fase 3: Decidir - Defina seu Caminho Profissional | Migrei"
        description="Defina seu novo caminho profissional com matriz de possibilidades, metas SMART e plano de 90 dias. Tome decisões com clareza."
        canonical="https://migrei.com/fase/decidir"
        noIndex={true}
      />
      <SEOBreadcrumbs
        items={[
          { name: "Início", url: "/" },
          { name: "Jornada", url: "/progresso" },
          { name: "Fase 3: Decidir", url: "/fase/decidir" }
        ]}
      />
      <PhaseAccessGate phaseNumber={3} phaseName="Fase 3: Decidir">
        <PageLayout>
          <PageContent className="space-y-6">
            {/* Breadcrumb */}
            <PageBreadcrumb
              items={[
                { label: "Jornada", href: "/progresso" },
                { label: "Fase 3: Decidir", current: true }
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
              phaseColor={PHASE_COLORS[3]}
            />

            {/* Step Content */}
            <div className="mt-6">
              {renderStepContent()}
            </div>

            {/* Floating Coach Button */}
            <FloatingCoachButton 
              phase="decidir" 
              context={`Usuário está na etapa: ${activeStep}`}
              greeting="Olá! 👋 Estou aqui na fase de Decidir! Esta é a hora de definir seu caminho. Vou te ajudar a avaliar possibilidades, definir metas SMART e criar seu plano de ação. Por onde quer começar?"
            />
          </PageContent>
        </PageLayout>
      </PhaseAccessGate>
    </>
  );
}
