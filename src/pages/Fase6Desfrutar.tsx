import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BarChart3, Trophy, FileText, PartyPopper, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEnjoy } from '@/hooks/useEnjoy';
import { ResultsEvaluation } from '@/components/enjoy/ResultsEvaluation';
import { AchievementsLine } from '@/components/enjoy/AchievementsLine';
import { FinalReport } from '@/components/enjoy/FinalReport';
import { SymbolicCelebration } from '@/components/enjoy/SymbolicCelebration';
import { CycleReentry } from '@/components/enjoy/CycleReentry';

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

  if (authLoading) {
    return (
      <PageLayout>
        <PageSkeleton variant="dashboard" showHeader={true} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageContent>
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <PageBreadcrumb
            items={[
              { label: "Jornada", href: "/progresso" },
              { label: "Fase 6: Desfrutar", current: true }
            ]}
            className="mb-4"
          />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-full bg-gradient-to-r from-amber-500/20 to-primary/20">
                <Sparkles className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Fase 6: Desfrutar</h1>
                <p className="text-muted-foreground">
                  Consolidação, celebração e novo ciclo profissional
                </p>
              </div>
              <Badge className="ml-auto bg-gradient-to-r from-amber-500 to-primary">
                Fase Final
              </Badge>
            </div>
          </div>

          {loading ? (
            <PageSkeleton variant="dashboard" showHeader={false} />
          ) : (
            <Tabs defaultValue="evaluation" className="space-y-6">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="evaluation" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Avaliação</span>
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline">Conquistas</span>
                </TabsTrigger>
                <TabsTrigger value="report" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Relatório</span>
                </TabsTrigger>
                <TabsTrigger value="celebration" className="flex items-center gap-2">
                  <PartyPopper className="h-4 w-4" />
                  <span className="hidden sm:inline">Celebração</span>
                </TabsTrigger>
                <TabsTrigger value="reentry" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Novo Ciclo</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="evaluation">
                <ResultsEvaluation 
                  evaluations={resultsEvaluation}
                  onSave={saveResultEvaluation}
                />
              </TabsContent>

              <TabsContent value="achievements">
                <AchievementsLine 
                  achievements={achievements}
                  onAdd={addAchievement}
                  onCelebrate={celebrateAchievement}
                />
              </TabsContent>

              <TabsContent value="report">
                <FinalReport 
                  report={finalReport}
                  onGenerate={generateFinalReport}
                />
              </TabsContent>

              <TabsContent value="celebration">
                <SymbolicCelebration 
                  celebration={celebration}
                  onCreate={createCelebration}
                />
              </TabsContent>

              <TabsContent value="reentry">
                <CycleReentry 
                  reentries={cycleReentries}
                  onStartNewCycle={startNewCycle}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </PageContent>
    </PageLayout>
  );
};

export default Fase6Desfrutar;
