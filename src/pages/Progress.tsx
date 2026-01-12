import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useProgress } from "@/hooks/useProgress";
import { ProgressHeader } from "@/components/progress/ProgressHeader";
import { InteractiveRodaMigrei } from "@/components/progress/InteractiveRodaMigrei";
import { PhaseDetailCard } from "@/components/progress/PhaseDetailCard";
import { BadgesGallery } from "@/components/progress/BadgesGallery";
import { MissionsCard } from "@/components/progress/MissionsCard";
import { ProgressAnalytics } from "@/components/progress/ProgressAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PhaseWithProgress } from "@/types/progress";
import { 
  LayoutDashboard, 
  Trophy, 
  Target, 
  BarChart3,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="pl-64">
          <Header />
          <main className="p-8">
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          </main>
        </div>
      </div>
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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-8">
          {/* Progress Header */}
          <ProgressHeader
            totalXp={summary.totalXp}
            level={summary.currentLevel}
            levelName={summary.levelName}
            streak={summary.streak}
            overallProgress={summary.overallProgress}
          />

          {/* Main Content */}
          {selectedPhase ? (
            <div className="space-y-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedPhase(null)}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar para visão geral
              </Button>
              
              <PhaseDetailCard
                phase={selectedPhase}
                completedActivities={completedActivities}
                onStartPhase={handleStartPhase}
                onCompleteActivity={handleCompleteActivity}
              />
            </div>
          ) : (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full max-w-2xl grid-cols-4">
                <TabsTrigger value="overview" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="badges" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Conquistas
                </TabsTrigger>
                <TabsTrigger value="missions" className="gap-2">
                  <Target className="h-4 w-4" />
                  Missões
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Análise
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-12 gap-8">
                  {/* Roda Migrei */}
                  <div className="col-span-7">
                    <div className="bg-card rounded-2xl border border-border p-8">
                      <h3 className="text-lg font-semibold mb-6 text-center">
                        Sua Jornada Migrei
                      </h3>
                      <InteractiveRodaMigrei
                        phases={phasesWithProgress}
                        currentPhaseId={userProgress?.current_phase_id || null}
                        onPhaseClick={handlePhaseClick}
                      />
                    </div>
                  </div>

                  {/* Right side cards */}
                  <div className="col-span-5 space-y-6">
                    {/* Current Phase Quick View */}
                    {summary.currentPhase && (
                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6">
                        <h4 className="text-sm text-muted-foreground mb-2">Fase Atual</h4>
                        <div className="flex items-center gap-3 mb-4">
                          <div 
                            className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: summary.currentPhase.color || '#3B82F6' }}
                          >
                            {summary.currentPhase.phase_number}
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{summary.currentPhase.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {summary.currentPhase.level_name}
                            </p>
                          </div>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => {
                            const currentPhaseWithProgress = phasesWithProgress.find(
                              p => p.id === summary.currentPhase?.id
                            );
                            if (currentPhaseWithProgress) {
                              handlePhaseClick(currentPhaseWithProgress);
                            }
                          }}
                        >
                          Ver Atividades
                        </Button>
                      </div>
                    )}

                    {/* Quick Missions */}
                    <MissionsCard
                      missions={missions}
                      userMissions={userMissions}
                      currentPhaseId={userProgress?.current_phase_id || null}
                    />
                  </div>
                </div>

                {/* Phase Cards Grid */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Todas as Fases</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {phasesWithProgress.map(phase => {
                      const isLocked = phase.userProgress?.status === 'locked';
                      const isCompleted = phase.userProgress?.status === 'completed';
                      const isCurrent = phase.id === userProgress?.current_phase_id;
                      
                      return (
                        <button
                          key={phase.id}
                          onClick={() => !isLocked && handlePhaseClick(phase)}
                          disabled={isLocked}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            isLocked 
                              ? 'opacity-50 cursor-not-allowed bg-muted/30' 
                              : isCurrent
                                ? 'border-primary/50 bg-primary/5 hover:bg-primary/10'
                                : isCompleted
                                  ? 'border-green-200 bg-green-500/5 hover:bg-green-500/10'
                                  : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div 
                              className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                              style={{ 
                                backgroundColor: isLocked ? '#6B7280' : phase.color || '#3B82F6' 
                              }}
                            >
                              {phase.phase_number}
                            </div>
                            <div>
                              <p className="font-medium">{phase.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {phase.userProgress?.progress_percentage || 0}% completo
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="badges">
                <BadgesGallery
                  allBadges={badges}
                  earnedBadges={userBadges}
                />
              </TabsContent>

              <TabsContent value="missions">
                <MissionsCard
                  missions={missions}
                  userMissions={userMissions}
                  currentPhaseId={userProgress?.current_phase_id || null}
                />
              </TabsContent>

              <TabsContent value="analytics">
                <ProgressAnalytics
                  phases={phasesWithProgress}
                  userProgress={userProgress}
                />
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
}
