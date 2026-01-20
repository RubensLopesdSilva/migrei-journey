import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { PhaseIntroBlock } from '@/components/phases/PhaseIntroBlock';
import { PhaseSteps, type PhaseStep } from '@/components/phases/PhaseSteps';
import { getPhaseIntroData, PHASE_COLORS } from '@/data/phaseIntroData';
import { Briefcase, BookOpen, Clock, Video, CalendarCheck } from 'lucide-react';
import { ExecutionPanel } from '@/components/launch/ExecutionPanel';
import { OpportunitiesDiary } from '@/components/launch/OpportunitiesDiary';
import { NetworkingRoutine } from '@/components/launch/NetworkingRoutine';
import { InterviewSimulator } from '@/components/launch/InterviewSimulator';
import { WeeklyCheckin } from '@/components/launch/WeeklyCheckin';
import { FloatingCoachButton } from '@/components/coach/FloatingCoachButton';
import { PhaseAccessGate } from '@/components/subscription/PhaseAccessGate';
import { SEOHead, SEOBreadcrumbs } from '@/components/seo';
import { useLaunch } from '@/hooks/useLaunch';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

type Step = 'execution' | 'diary' | 'networking' | 'interview' | 'checkin';

const steps: PhaseStep[] = [
  { key: 'execution', label: 'Execução', icon: Briefcase },
  { key: 'diary', label: 'Diário', icon: BookOpen },
  { key: 'networking', label: 'Networking', icon: Clock },
  { key: 'interview', label: 'Entrevistas', icon: Video },
  { key: 'checkin', label: 'Check-in', icon: CalendarCheck }
];

export default function Fase5Deslanchar() {
  const { user, loading: authLoading } = useAuth();
  const { loading, getPhaseProgress } = useLaunch();
  const [activeStep, setActiveStep] = useState<Step>('execution');

  if (authLoading) {
    return (
      <PageLayout>
        <PageSkeleton variant="dashboard" showHeader={true} />
      </PageLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const progress = getPhaseProgress();
  const isPhaseComplete = progress === 100;

  // Dados do bloco introdutório com clareza UX
  const phaseIntroData = getPhaseIntroData(5, progress, isPhaseComplete);

  const renderStepContent = () => {
    switch (activeStep) {
      case 'execution': return <ExecutionPanel />;
      case 'diary': return <OpportunitiesDiary />;
      case 'networking': return <NetworkingRoutine />;
      case 'interview': return <InterviewSimulator />;
      case 'checkin': return <WeeklyCheckin />;
      default: return null;
    }
  };

  return (
    <>
      <SEOHead
        title="Fase 5: Deslanchar - Conquiste Oportunidades | Migrei"
        description="Execute seu plano, faça networking estratégico, pratique entrevistas e conquiste oportunidades reais na sua nova carreira."
        canonical="https://migrei.com/fase/deslanchar"
        noIndex={true}
      />
      <SEOBreadcrumbs
        items={[
          { name: "Início", url: "/" },
          { name: "Jornada", url: "/progresso" },
          { name: "Fase 5: Deslanchar", url: "/fase/deslanchar" }
        ]}
      />
      <PhaseAccessGate phaseNumber={5} phaseName="Fase 5: Deslanchar">
        <PageLayout>
          <PageContent>
            <div className="container mx-auto max-w-6xl space-y-6">
              {/* Breadcrumb */}
              <PageBreadcrumb
                items={[
                  { label: "Jornada", href: "/progresso" },
                  { label: "Fase 5: Deslanchar", current: true }
                ]}
              />

              {/* Blocos de Clareza UX - O que vai aprender, Para que serve, O que terá pronto */}
              <PhaseIntroBlock data={phaseIntroData} />

              {/* Phase Steps Navigation */}
              <PhaseSteps
                steps={steps}
                activeStep={activeStep}
                onStepChange={(step) => setActiveStep(step as Step)}
                completedSteps={0}
                phaseColor={PHASE_COLORS[5]}
              />

              {/* Step Content */}
              <div className="mt-6">
                {renderStepContent()}
              </div>

              {/* Floating Coach Button */}
              <FloatingCoachButton
                phase="deslanchar"
                context={`Usuário está na aba: ${activeStep}. Fase de execução do plano e geração de oportunidades.`}
                greeting="Olá! 👋 Estou aqui na fase de Deslanchar! Esta é a hora da ação. Posso te ajudar com networking, preparação para entrevistas ou acompanhar sua execução. Como posso apoiar?"
              />
            </div>
          </PageContent>
        </PageLayout>
      </PhaseAccessGate>
    </>
  );
}
