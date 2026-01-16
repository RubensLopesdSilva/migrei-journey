import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ConsciousnessOnboarding } from '@/components/awakening/ConsciousnessOnboarding';
import { ReadinessTest } from '@/components/awakening/ReadinessTest';
import { PainMapBuilder } from '@/components/awakening/PainMapBuilder';
import { CommitmentDeclaration } from '@/components/awakening/CommitmentDeclaration';
import { FloatingCoachButton } from '@/components/coach/FloatingCoachButton';
import { PhaseIntroBlock } from '@/components/phases/PhaseIntroBlock';
import { getPhaseIntroData } from '@/data/phaseIntroData';
import { useAwakening } from '@/hooks/useAwakening';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { Brain, Target, Frown, Heart, Check } from 'lucide-react';

type Step = 'consciousness' | 'readiness' | 'painmap' | 'commitment';

const steps: { key: Step; label: string; icon: typeof Brain }[] = [
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

        {/* Main Content - Full Width */}
        <AnimatedTabs value={activeStep} onValueChange={(v) => setActiveStep(v as Step)}>
          <AnimatedTabsList className="grid grid-cols-4 mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < progress.completed;
              return (
                <AnimatedTabsTrigger key={step.key} value={step.key} className="relative">
                  <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                  {step.label}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" aria-hidden="true" />
                    </div>
                  )}
                </AnimatedTabsTrigger>
              );
            })}
          </AnimatedTabsList>

          <AnimatedTabsContent value="consciousness">
            <ConsciousnessOnboarding onComplete={() => setActiveStep('readiness')} />
          </AnimatedTabsContent>

          <AnimatedTabsContent value="readiness">
            <ReadinessTest onComplete={() => setActiveStep('painmap')} />
          </AnimatedTabsContent>

          <AnimatedTabsContent value="painmap">
            <PainMapBuilder onComplete={() => setActiveStep('commitment')} />
          </AnimatedTabsContent>

          <AnimatedTabsContent value="commitment">
            <CommitmentDeclaration onComplete={() => window.location.href = '/progresso'} />
          </AnimatedTabsContent>
        </AnimatedTabs>

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
