import { useState } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { useProgress } from "@/hooks/useProgress";
import { ProgressHeader } from "@/components/progress/ProgressHeader";
import { CurrentPhaseCard } from "@/components/progress/CurrentPhaseCard";
import { InteractiveRodaMigrei } from "@/components/progress/InteractiveRodaMigrei";
import { PhaseDetailCard } from "@/components/progress/PhaseDetailCard";
import { BadgesGallery } from "@/components/progress/BadgesGallery";
import { MissionsCard } from "@/components/progress/MissionsCard";
import { ProgressAnalytics } from "@/components/progress/ProgressAnalytics";
import { PhasesGrid } from "@/components/progress/PhasesGrid";
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from "@/components/ui/animated-tabs";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { PhaseWithProgress } from "@/types/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Trophy, 
  Target, 
  BarChart3,
  ChevronLeft
} from "lucide-react";

export default function Progress() {
  const {
    loading,
    phases,
    badges,
    userBadges,
    missions,
    userMissions,
    userProgress,
    phaseProgress,
    completedActivities,
    completeActivity,
    startPhase,
    getProgressSummary
  } = useProgress();

  const [selectedPhase, setSelectedPhase] = useState<PhaseWithProgress | null>(null);

  if (loading) {
    return (
      <PageLayout>
        <PageSkeleton variant="dashboard" showHeader={true} />
      </PageLayout>
    );
  }

  const summary = getProgressSummary();

  // Build phases with progress
  const phasesWithProgress: PhaseWithProgress[] = phases.map(phase => {
    const progress = phaseProgress.find(p => p.phase_id === phase.id);
    const phaseActivities = summary.phases.find(p => p.id === phase.id)?.activities || [];
    const completed = phaseActivities.filter(a => completedActivities.includes(a.id)).length;

    return {
      ...phase,
      userProgress: progress || null,
      activities: phaseActivities,
      completedActivities: completed,
      totalActivities: phaseActivities.length
    };
  });

  const handlePhaseClick = (phase: PhaseWithProgress) => {
    setSelectedPhase(phase);
  };

  const handleCompleteActivity = (activityId: string) => {
    if (selectedPhase) {
      completeActivity(activityId, selectedPhase.id);
    }
  };

  const handleStartPhase = () => {
    if (selectedPhase) {
      startPhase(selectedPhase.id);
    }
  };

  const currentPhaseWithProgress = phasesWithProgress.find(
    p => p.id === summary.currentPhase?.id
  );

  return (
    <PageLayout>
      <PageContent>
        {/* Breadcrumb */}
        <PageBreadcrumb
          items={[
            ...(selectedPhase 
              ? [{ label: "Progresso", href: "/progresso" }, { label: selectedPhase.name, current: true }]
              : [{ label: "Progresso", current: true }]
            )
          ]}
          className="mb-4"
        />

        {/* Progress Header - Hero style like Networking */}
        <ProgressHeader
          totalXp={summary.totalXp}
          level={summary.currentLevel}
          levelName={summary.levelName}
          streak={summary.streak}
          overallProgress={summary.overallProgress}
        />

        {/* Main Content */}
        {selectedPhase ? (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedPhase(null)}
              className="gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
            
            <PhaseDetailCard
              phase={selectedPhase}
              completedActivities={completedActivities}
              onStartPhase={handleStartPhase}
              onCompleteActivity={handleCompleteActivity}
            />
          </motion.div>
        ) : (
          <AnimatedTabs defaultValue="overview" className="space-y-6">
            <AnimatedTabsList className="grid w-full max-w-md grid-cols-4">
              <AnimatedTabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Geral</span>
              </AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="badges" className="gap-1.5 text-xs sm:text-sm">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Conquistas</span>
              </AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="missions" className="gap-1.5 text-xs sm:text-sm">
                <Target className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Missões</span>
              </AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="analytics" className="gap-1.5 text-xs sm:text-sm">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Análise</span>
              </AnimatedTabsTrigger>
            </AnimatedTabsList>

            <AnimatedTabsContent value="overview" className="space-y-6">
              {/* Main Grid - Same pattern as Networking */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content - Roda Migrei */}
                <div className="lg:col-span-7 xl:col-span-8">
                  <motion.div 
                    className="bg-card rounded-xl border border-border p-4 md:p-6"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-bold text-base mb-4 text-center">
                      Sua Jornada
                    </h3>
                    <InteractiveRodaMigrei
                      phases={phasesWithProgress}
                      currentPhaseId={userProgress?.current_phase_id || null}
                      onPhaseClick={handlePhaseClick}
                    />
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-6 order-first lg:order-last">
                  {/* Current Phase Card */}
                  {summary.currentPhase && currentPhaseWithProgress && (
                    <CurrentPhaseCard
                      phase={summary.currentPhase}
                      progressPercentage={currentPhaseWithProgress.userProgress?.progress_percentage || 0}
                      onContinue={() => handlePhaseClick(currentPhaseWithProgress)}
                    />
                  )}

                  {/* Missions */}
                  <MissionsCard
                    missions={missions}
                    userMissions={userMissions}
                    currentPhaseId={userProgress?.current_phase_id || null}
                  />
                </div>
              </div>

              {/* Phases Grid */}
              <PhasesGrid
                phases={phasesWithProgress}
                currentPhaseId={userProgress?.current_phase_id || null}
                onPhaseClick={handlePhaseClick}
              />
            </AnimatedTabsContent>

            <AnimatedTabsContent value="badges">
              <BadgesGallery
                allBadges={badges}
                earnedBadges={userBadges}
              />
            </AnimatedTabsContent>

            <AnimatedTabsContent value="missions">
              <MissionsCard
                missions={missions}
                userMissions={userMissions}
                currentPhaseId={userProgress?.current_phase_id || null}
              />
            </AnimatedTabsContent>

            <AnimatedTabsContent value="analytics">
              <ProgressAnalytics
                phases={phasesWithProgress}
                userProgress={userProgress}
              />
            </AnimatedTabsContent>
          </AnimatedTabs>
        )}
      </PageContent>
    </PageLayout>
  );
}
