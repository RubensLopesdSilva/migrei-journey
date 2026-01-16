import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { PossibilitiesMatrix } from '@/components/decision/PossibilitiesMatrix';
import { RouteComparator } from '@/components/decision/RouteComparator';
import { SmartGoalBuilder } from '@/components/decision/SmartGoalBuilder';
import { Plan90Days } from '@/components/decision/Plan90Days';
import { GapsMap } from '@/components/decision/GapsMap';
import { DecisionCheckpoint } from '@/components/decision/DecisionCheckpoint';
import { FloatingCoachButton } from '@/components/coach/FloatingCoachButton';
import { PhaseAccessGate } from '@/components/subscription/PhaseAccessGate';
import { useDecision } from '@/hooks/useDecision';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
import { Target, BarChart3, Goal, Calendar, Map, CheckCircle2, Check } from 'lucide-react';

type Step = 'matrix' | 'comparator' | 'goal' | 'plan' | 'gaps' | 'checkpoint';

const steps: { key: Step; label: string; icon: typeof Target }[] = [
  { key: 'matrix', label: 'Matriz', icon: BarChart3 },
  { key: 'comparator', label: 'Comparar', icon: Target },
  { key: 'goal', label: 'Meta SMART', icon: Goal },
  { key: 'plan', label: 'Plano 90 Dias', icon: Calendar },
  { key: 'gaps', label: 'Lacunas', icon: Map },
  { key: 'checkpoint', label: 'Decisão', icon: CheckCircle2 }
];

export default function Fase3Decidir() {
  const { getPhaseProgress, checkpoint } = useDecision();
  const [activeStep, setActiveStep] = useState<Step>('matrix');

  const progress = getPhaseProgress();
  const isPhaseComplete = checkpoint?.is_confirmed === true;

  return (
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

          {/* Phase Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Fase 3: Decidir</h1>
                <p className="text-muted-foreground">Planejamento estratégico e foco</p>
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

          {/* Main Content - Full Width */}
          <AnimatedTabs value={activeStep} onValueChange={(v) => setActiveStep(v as Step)}>
            <AnimatedTabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < progress.completed;
                return (
                  <AnimatedTabsTrigger key={step.key} value={step.key} className="relative text-xs px-2">
                    <Icon className="h-4 w-4 mr-1" aria-hidden="true" />
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

            <AnimatedTabsContent value="matrix">
              <PossibilitiesMatrix onComplete={() => setActiveStep('comparator')} />
            </AnimatedTabsContent>

            <AnimatedTabsContent value="comparator">
              <RouteComparator onComplete={() => setActiveStep('goal')} />
            </AnimatedTabsContent>

            <AnimatedTabsContent value="goal">
              <SmartGoalBuilder onComplete={() => setActiveStep('plan')} />
            </AnimatedTabsContent>

            <AnimatedTabsContent value="plan">
              <Plan90Days onComplete={() => setActiveStep('gaps')} />
            </AnimatedTabsContent>

            <AnimatedTabsContent value="gaps">
              <GapsMap onComplete={() => setActiveStep('checkpoint')} />
            </AnimatedTabsContent>

            <AnimatedTabsContent value="checkpoint">
              <DecisionCheckpoint onComplete={() => window.location.href = '/progresso'} />
            </AnimatedTabsContent>
          </AnimatedTabs>

          {/* Floating Coach Button */}
          <FloatingCoachButton 
            phase="decidir" 
            context={`Usuário está na etapa: ${activeStep}`}
            greeting="Olá! 👋 Estou aqui na fase de Decidir! Esta é a hora de definir seu caminho. Vou te ajudar a avaliar possibilidades, definir metas SMART e criar seu plano de ação. Por onde quer começar?"
          />
        </PageContent>
      </PageLayout>
    </PhaseAccessGate>
  );
}
