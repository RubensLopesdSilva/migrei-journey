import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { PhaseIntroBlock } from '@/components/phases/PhaseIntroBlock';
import { PhaseSteps, type PhaseStep } from '@/components/phases/PhaseSteps';
import { getPhaseIntroData, PHASE_COLORS } from '@/data/phaseIntroData';
import { BarChart3, Trophy, FileText, PartyPopper, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEnjoy } from '@/hooks/useEnjoy';
import { ResultsEvaluation } from '@/components/enjoy/ResultsEvaluation';
import { AchievementsLine } from '@/components/enjoy/AchievementsLine';
import { FinalReport } from '@/components/enjoy/FinalReport';
import { SymbolicCelebration } from '@/components/enjoy/SymbolicCelebration';
import { CycleReentry } from '@/components/enjoy/CycleReentry';
import { FloatingCoachButton } from '@/components/coach/FloatingCoachButton';
import { PhaseAccessGate } from '@/components/subscription/PhaseAccessGate';
import { SEOHead, SEOBreadcrumbs } from '@/components/seo';

type Step = 'evaluation' | 'achievements' | 'report' | 'celebration' | 'reentry';

const steps: PhaseStep[] = [
  { key: 'evaluation', label: 'Avaliação', icon: BarChart3 },
  { key: 'achievements', label: 'Conquistas', icon: Trophy },
  { key: 'report', label: 'Relatório', icon: FileText },
  { key: 'celebration', label: 'Celebração', icon: PartyPopper },
  { key: 'reentry', label: 'Novo Ciclo', icon: RefreshCw }
];

const Fase6Desfrutar = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    loading, 
    resultsEvaluation, 
    achievements, 
    finalReport, 
    celebration, 
    cycleReentries,
    saveResultEvaluation,
    addAchievement,
    celebrateAchievement,
    generateFinalReport,
    createCelebration,
    startNewCycle,
  } = useEnjoy();

  const [activeStep, setActiveStep] = useState<Step>('evaluation');

  // Calcular progresso da fase 6 baseado nas atividades concluídas
  const calculateProgress = () => {
    let completed = 0;
    if (resultsEvaluation && resultsEvaluation.length > 0) completed++;
    if (achievements && achievements.length > 0) completed++;
    if (finalReport) completed++;
    if (celebration) completed++;
    if (cycleReentries && cycleReentries.length > 0) completed++;
    return Math.round((completed / 5) * 100);
  };

  const progress = calculateProgress();
  const isPhaseComplete = progress === 100;
  const completedSteps = Math.round(progress / 20);

  // Dados do bloco introdutório com clareza UX
  const phaseIntroData = getPhaseIntroData(6, progress, isPhaseComplete);

  if (authLoading) {
    return (
      <PageLayout>
        <PageSkeleton variant="dashboard" showHeader={true} />
      </PageLayout>
    );
  }

  const renderStepContent = () => {
    if (loading) {
      return <PageSkeleton variant="dashboard" showHeader={false} />;
    }

    switch (activeStep) {
      case 'evaluation':
        return (
          <ResultsEvaluation 
            evaluations={resultsEvaluation}
            onSave={saveResultEvaluation}
          />
        );
      case 'achievements':
        return (
          <AchievementsLine 
            achievements={achievements}
            onAdd={addAchievement}
            onCelebrate={celebrateAchievement}
          />
        );
      case 'report':
        return (
          <FinalReport 
            report={finalReport}
            onGenerate={generateFinalReport}
          />
        );
      case 'celebration':
        return (
          <SymbolicCelebration 
            celebration={celebration}
            onCreate={createCelebration}
          />
        );
      case 'reentry':
        return (
          <CycleReentry 
            reentries={cycleReentries}
            onStartNewCycle={startNewCycle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SEOHead
        title="Fase 6: Desfrutar - Celebre suas Conquistas | Migrei"
        description="Celebre sua transição de carreira, consolide sua nova identidade profissional e prepare-se para novos ciclos de evolução."
        canonical="https://migrei.com/fase/desfrutar"
        noIndex={true}
      />
      <SEOBreadcrumbs
        items={[
          { name: "Início", url: "/" },
          { name: "Jornada", url: "/progresso" },
          { name: "Fase 6: Desfrutar", url: "/fase/desfrutar" }
        ]}
      />
      <PhaseAccessGate phaseNumber={6} phaseName="Fase 6: Desfrutar">
        <PageLayout>
          <PageContent>
            <div className="container mx-auto max-w-6xl space-y-6">
              {/* Breadcrumb */}
              <PageBreadcrumb
                items={[
                  { label: "Jornada", href: "/progresso" },
                  { label: "Fase 6: Desfrutar", current: true }
                ]}
              />

              {/* Blocos de Clareza UX - O que vai aprender, Para que serve, O que terá pronto */}
              <PhaseIntroBlock data={phaseIntroData} />

              {/* Phase Steps Navigation */}
              <PhaseSteps
                steps={steps}
                activeStep={activeStep}
                onStepChange={(step) => setActiveStep(step as Step)}
                completedSteps={completedSteps}
                phaseColor={PHASE_COLORS[6]}
                lockSequential={true}
              />

              {/* Step Content */}
              <div className="mt-6">
                {renderStepContent()}
              </div>

              {/* Floating Coach Button */}
              <FloatingCoachButton
                phase="desfrutar"
                context={`Usuário está na aba: ${activeStep}. Fase de celebração e consolidação da transição.`}
                greeting="Parabéns! 🎉 Você chegou à fase final! Estou aqui para te ajudar a celebrar suas conquistas, gerar seu relatório final e, se desejar, iniciar um novo ciclo de evolução. Como posso ajudar?"
              />
            </div>
          </PageContent>
        </PageLayout>
      </PhaseAccessGate>
    </>
  );
};

export default Fase6Desfrutar;
