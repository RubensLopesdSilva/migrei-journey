import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ConsciousnessOnboarding } from '@/components/awakening/ConsciousnessOnboarding';
import { ReadinessTest } from '@/components/awakening/ReadinessTest';
import { PainMapBuilder } from '@/components/awakening/PainMapBuilder';
import { CommitmentDeclaration } from '@/components/awakening/CommitmentDeclaration';
import { AvatarCoach } from '@/components/awakening/AvatarCoach';
import { useAwakening } from '@/hooks/useAwakening';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { Sparkles, Brain, Target, Frown, Heart, Check } from 'lucide-react';

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
  const [showCoach, setShowCoach] = useState(true);

  const progress = getPhaseProgress();
  const isPhaseComplete = commitment !== null;

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

        {/* Phase Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Fase 1: Despertar</h1>
              <p className="text-muted-foreground">Consciência e decisão de mudar</p>
            </div>
          </div>
          <Badge variant={isPhaseComplete ? 'default' : 'secondary'} className="text-sm">
            {isPhaseComplete ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Fase Completa
              </>
            ) : (
              `${progress.percentage}% concluído`
            )}
          </Badge>
        </div>

        {/* Progress Bar */}
        <Progress value={progress.percentage} className="h-2" />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
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
          </div>

          {/* Coach Sidebar */}
          <div className="lg:col-span-4 order-first lg:order-last">
            <AvatarCoach 
              phase="despertar" 
              context={`Usuário está na etapa: ${activeStep}`}
            />
          </div>
        </div>
      </PageContent>
    </PageLayout>
  );
}
