import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { PhaseIntroBlock } from '@/components/phases/PhaseIntroBlock';
import { getPhaseIntroData } from '@/data/phaseIntroData';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
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

  const [activeTab, setActiveTab] = useState('evaluation');

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

  // Dados do bloco introdutório com clareza UX
  const phaseIntroData = getPhaseIntroData(6, progress, isPhaseComplete);

  if (authLoading) {
    return (
      <PageLayout>
        <PageSkeleton variant="dashboard" showHeader={true} />
      </PageLayout>
    );
  }

  return (
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

            {loading ? (
              <PageSkeleton variant="dashboard" showHeader={false} />
            ) : (
              <AnimatedTabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <AnimatedTabsList className="grid grid-cols-5 w-full">
                  <AnimatedTabsTrigger value="evaluation" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Avaliação</span>
                  </AnimatedTabsTrigger>
                  <AnimatedTabsTrigger value="achievements" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Conquistas</span>
                  </AnimatedTabsTrigger>
                  <AnimatedTabsTrigger value="report" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Relatório</span>
                  </AnimatedTabsTrigger>
                  <AnimatedTabsTrigger value="celebration" className="flex items-center gap-2">
                    <PartyPopper className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Celebração</span>
                  </AnimatedTabsTrigger>
                  <AnimatedTabsTrigger value="reentry" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Novo Ciclo</span>
                  </AnimatedTabsTrigger>
                </AnimatedTabsList>

                <AnimatedTabsContent value="evaluation">
                  <ResultsEvaluation 
                    evaluations={resultsEvaluation}
                    onSave={saveResultEvaluation}
                  />
                </AnimatedTabsContent>

                <AnimatedTabsContent value="achievements">
                  <AchievementsLine 
                    achievements={achievements}
                    onAdd={addAchievement}
                    onCelebrate={celebrateAchievement}
                  />
                </AnimatedTabsContent>

                <AnimatedTabsContent value="report">
                  <FinalReport 
                    report={finalReport}
                    onGenerate={generateFinalReport}
                  />
                </AnimatedTabsContent>

                <AnimatedTabsContent value="celebration">
                  <SymbolicCelebration 
                    celebration={celebration}
                    onCreate={createCelebration}
                  />
                </AnimatedTabsContent>

                <AnimatedTabsContent value="reentry">
                  <CycleReentry 
                    reentries={cycleReentries}
                    onStartNewCycle={startNewCycle}
                  />
                </AnimatedTabsContent>
              </AnimatedTabs>
            )}

            {/* Floating Coach Button */}
            <FloatingCoachButton
              phase="desfrutar"
              context={`Usuário está na aba: ${activeTab}. Fase de celebração e consolidação da transição.`}
              greeting="Parabéns! 🎉 Você chegou à fase final! Estou aqui para te ajudar a celebrar suas conquistas, gerar seu relatório final e, se desejar, iniciar um novo ciclo de evolução. Como posso ajudar?"
            />
          </div>
        </PageContent>
      </PageLayout>
    </PhaseAccessGate>
  );
};

export default Fase6Desfrutar;
