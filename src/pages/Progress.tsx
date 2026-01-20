import { useState } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { useProgress } from "@/hooks/useProgress";
import { ProgressHeader } from "@/components/progress/ProgressHeader";
import { CurrentPhaseCard } from "@/components/progress/CurrentPhaseCard";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { PhaseDetailCard } from "@/components/progress/PhaseDetailCard";
import { BadgesGallery } from "@/components/progress/BadgesGallery";
import { MissionsCard } from "@/components/progress/MissionsCard";
import { ProgressAnalytics } from "@/components/progress/ProgressAnalytics";
import { PhasesGrid } from "@/components/progress/PhasesGrid";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { SEOHead, SEOBreadcrumbs } from "@/components/seo";
import { PhaseWithProgress } from "@/types/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

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


  const handleStartPhase = () => {
    if (selectedPhase) {
      startPhase(selectedPhase.id);
    }
  };

  const currentPhaseWithProgress = phasesWithProgress.find(
    p => p.id === summary.currentPhase?.id
  );

  return (
    <>
      <SEOHead
        title="Meu Progresso na Jornada de Carreira | Migrei"
        description="Acompanhe seu progresso no Ciclo Migrei, visualize badges conquistadas, missões e análises da sua evolução profissional."
        canonical="https://migrei.com/progresso"
        noIndex={true}
      />
      <SEOBreadcrumbs
        items={[
          { name: "Início", url: "/" },
          { name: "Progresso", url: "/progresso" }
        ]}
      />
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

        {/* Hero Header - Same pattern as Networking */}
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
            />
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Main Grid - Same pattern as Networking (7/5 or 8/4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Content - Roda Migrei - Same visual as Dashboard */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                <motion.div 
                  className="relative w-full flex justify-center items-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {/* Clean container with subtle elevation */}
                  <div className="relative p-4 sm:p-6 lg:p-8 w-full">
                    {/* Subtle background */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-card to-card/60 rounded-3xl border border-border/40"
                      style={{
                        boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.05)'
                      }}
                    />
                    
                    {/* The Circle - main element */}
                    <div className="relative z-10 flex justify-center">
                      <MigreiCircle />
                    </div>
                  </div>
                </motion.div>

                {/* Phases Grid - Desktop only in main */}
                <div className="hidden lg:block">
                  <PhasesGrid
                    phases={phasesWithProgress}
                    currentPhaseId={userProgress?.current_phase_id || null}
                    onPhaseClick={handlePhaseClick}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-6">
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

                {/* Phases Grid - Mobile/Tablet */}
                <div className="lg:hidden">
                  <PhasesGrid
                    phases={phasesWithProgress}
                    currentPhaseId={userProgress?.current_phase_id || null}
                    onPhaseClick={handlePhaseClick}
                  />
                </div>
              </div>
            </div>

            {/* Secondary Grid - Badges and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Badges */}
              <div className="lg:col-span-7 xl:col-span-8">
                <BadgesGallery
                  allBadges={badges}
                  earnedBadges={userBadges}
                />
              </div>

              {/* Analytics */}
              <div className="lg:col-span-5 xl:col-span-4">
                <ProgressAnalytics
                  phases={phasesWithProgress}
                  userProgress={userProgress}
                />
              </div>
            </div>
          </div>
        )}
      </PageContent>
    </PageLayout>
    </>
  );
}
