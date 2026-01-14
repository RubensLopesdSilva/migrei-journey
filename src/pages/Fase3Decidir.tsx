import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PossibilitiesMatrix } from '@/components/decision/PossibilitiesMatrix';
import { RouteComparator } from '@/components/decision/RouteComparator';
import { SmartGoalBuilder } from '@/components/decision/SmartGoalBuilder';
import { Plan90Days } from '@/components/decision/Plan90Days';
import { GapsMap } from '@/components/decision/GapsMap';
import { DecisionCheckpoint } from '@/components/decision/DecisionCheckpoint';
import { AvatarCoach } from '@/components/awakening/AvatarCoach';
import { useDecision } from '@/hooks/useDecision';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <PageLayout>
      <PageContent className="space-y-6">
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Tabs value={activeStep} onValueChange={(v) => setActiveStep(v as Step)}>
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index < progress.completed;
                  return (
                    <TabsTrigger key={step.key} value={step.key} className="relative text-xs px-2">
                      <Icon className="h-4 w-4 mr-1" />
                      {step.label}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value="matrix">
                <PossibilitiesMatrix onComplete={() => setActiveStep('comparator')} />
              </TabsContent>

              <TabsContent value="comparator">
                <RouteComparator onComplete={() => setActiveStep('goal')} />
              </TabsContent>

              <TabsContent value="goal">
                <SmartGoalBuilder onComplete={() => setActiveStep('plan')} />
              </TabsContent>

              <TabsContent value="plan">
                <Plan90Days onComplete={() => setActiveStep('gaps')} />
              </TabsContent>

              <TabsContent value="gaps">
                <GapsMap onComplete={() => setActiveStep('checkpoint')} />
              </TabsContent>

              <TabsContent value="checkpoint">
                <DecisionCheckpoint onComplete={() => window.location.href = '/progresso'} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Coach Sidebar */}
          <div className="lg:col-span-4 order-first lg:order-last">
            <AvatarCoach 
              phase="decidir" 
              context={`Usuário está na etapa: ${activeStep}`}
            />
          </div>
        </div>
      </PageContent>
    </PageLayout>
  );
}
