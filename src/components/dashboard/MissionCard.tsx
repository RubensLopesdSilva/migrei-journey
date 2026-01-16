import { Target, ArrowRight, Check, Sparkles, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { focusRingClasses } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/useProgress";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PhaseActivity } from "@/types/progress";

// Phase number to slug mapping
const phaseNumberToSlug: Record<number, string> = {
  1: "despertar",
  2: "descobrir",
  3: "decidir",
  4: "desenvolver",
  5: "deslanchar",
  6: "desfrutar",
};

// Phase routes mapping
const phaseRoutes: Record<string, string> = {
  despertar: "/fase/despertar",
  descobrir: "/fase/descobrir",
  decidir: "/fase/decidir",
  desenvolver: "/fase/desenvolver",
  deslanchar: "/fase/deslanchar",
  desfrutar: "/fase/desfrutar",
};

// Quick win messages per phase
const phaseQuickWins: Record<string, string> = {
  despertar: "5 min para seu 1º diagnóstico",
  descobrir: "Descubra padrões ocultos na sua carreira",
  decidir: "Defina sua rota em 20 minutos",
  desenvolver: "Saia com currículo pronto hoje",
  deslanchar: "Comece a se candidatar agora",
  desfrutar: "Celebre suas conquistas",
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 }
};

interface MissionItemProps {
  activity: PhaseActivity;
  isCompleted: boolean;
  phaseLink: string;
  isNext?: boolean;
}

function MissionItem({ activity, isCompleted, phaseLink, isNext }: MissionItemProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="group"
    >
      <Link
        to={phaseLink}
        className={cn(
          "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-left block",
          isCompleted 
            ? 'bg-primary/5' 
            : isNext
              ? 'bg-primary/10 border border-primary/20 hover:bg-primary/15'
              : 'hover:bg-muted/50'
        )}
      >
        {/* Status icon */}
        <div className={cn(
          "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0",
          isCompleted ? "bg-primary" : isNext ? "bg-primary/20" : "bg-muted"
        )}>
          {isCompleted ? (
            <Check className="h-3.5 w-3.5 text-primary-foreground" />
          ) : isNext ? (
            <Zap className="h-3.5 w-3.5 text-primary" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium truncate",
            isCompleted 
              ? 'text-muted-foreground line-through' 
              : isNext
                ? 'text-foreground'
                : 'text-foreground/80'
          )}>
            {activity.title}
          </p>
          {isNext && !isCompleted && (
            <p className="text-[10px] text-primary font-medium">
              Próxima missão
            </p>
          )}
        </div>
        
        <span className={cn(
          "text-xs font-medium flex-shrink-0",
          isCompleted ? 'text-primary' : 'text-muted-foreground'
        )}>
          {isCompleted ? '✓' : '+'}{activity.xp_reward} XP
        </span>
      </Link>
    </motion.div>
  );
}

function MissionCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
      <div className="px-4 pt-3">
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
      <div className="p-3 space-y-2 flex-1">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function MissionCard() {
  const { 
    userProgress, 
    phases, 
    activities, 
    completedActivities, 
    phaseProgress,
    loading
  } = useProgress();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  
  // Get current phase info
  const currentPhase = useMemo(() => {
    if (!phases || phases.length === 0) return null;
    return phases.find(p => p.id === userProgress?.current_phase_id) || phases[0];
  }, [phases, userProgress]);

  const phaseSlug = useMemo(() => {
    return currentPhase?.phase_number 
      ? phaseNumberToSlug[currentPhase.phase_number] 
      : "despertar";
  }, [currentPhase]);

  // Get missions (activities) for the current phase
  const phaseMissions = useMemo(() => {
    if (!currentPhase || !activities) return [];
    
    return activities
      .filter(a => a.phase_id === currentPhase.id)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [activities, currentPhase]);

  // Calculate completion stats
  const completedCount = useMemo(() => {
    return phaseMissions.filter(m => completedActivities.includes(m.id)).length;
  }, [phaseMissions, completedActivities]);

  const totalXP = useMemo(() => {
    return phaseMissions
      .filter(m => completedActivities.includes(m.id))
      .reduce((acc, m) => acc + m.xp_reward, 0);
  }, [phaseMissions, completedActivities]);

  const potentialXP = useMemo(() => {
    return phaseMissions.reduce((acc, m) => acc + m.xp_reward, 0);
  }, [phaseMissions]);

  // Get current phase progress
  const currentPhaseProgress = useMemo(() => {
    return phaseProgress?.find(p => p.phase_id === currentPhase?.id);
  }, [phaseProgress, currentPhase]);

  const progressPercentage = currentPhaseProgress?.progress_percentage || 0;

  const phaseDisplayName = currentPhase?.name || "Despertar";
  const phaseLink = phaseRoutes[phaseSlug] || "/fase/despertar";

  // Get first uncompleted missions to display
  const displayMissions = useMemo(() => {
    const uncompleted = phaseMissions.filter(m => !completedActivities.includes(m.id));
    const completed = phaseMissions.filter(m => completedActivities.includes(m.id));
    
    // Show up to 3 missions: prioritize uncompleted, then show completed
    return [...uncompleted, ...completed].slice(0, 3);
  }, [phaseMissions, completedActivities]);


  // NOW we can have conditional returns after all hooks
  if (loading) {
    return <MissionCardSkeleton />;
  }

  const quickWin = phaseQuickWins[phaseSlug] || "Complete suas missões";
  const allComplete = completedCount === phaseMissions.length && phaseMissions.length > 0;

  return (
    <motion.div 
      className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col"
      data-tour="mission-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      {/* Header with quick win */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-9 w-9 rounded-xl flex items-center justify-center",
            allComplete ? "bg-primary" : "bg-primary/10"
          )}>
            {allComplete ? (
              <Trophy className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
            ) : (
              <Target className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-foreground">
                {allComplete ? "Fase completa! 🎉" : phaseDisplayName}
              </h3>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {allComplete 
                ? `+${totalXP} XP conquistados` 
                : `${completedCount}/${phaseMissions.length} • ${quickWin}`
              }
            </p>
          </div>
        </div>
        <Link 
          to={phaseLink}
          className={cn(
            "text-primary hover:text-primary/80 transition-colors p-2 -m-2 rounded-lg",
            focusRingClasses
          )}
          aria-label="Ver todas as missões da fase"
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Progress bar with celebration */}
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">
            {allComplete ? "Parabéns! Fase concluída" : "Progresso da fase"}
          </span>
          <span className={cn(
            "font-medium",
            allComplete ? "text-primary" : progressPercentage >= 50 ? "text-primary" : "text-muted-foreground"
          )}>
            {progressPercentage}%
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className={cn(
              "h-full rounded-full",
              allComplete 
                ? "bg-gradient-to-r from-primary to-primary/80" 
                : "bg-primary"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
      
      {/* Missions list */}
      <motion.div 
        className="p-3 space-y-1 flex-1"
        data-tour="mission-tasks"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {displayMissions.length > 0 ? (
            displayMissions.map((mission, index) => {
              const isCompleted = completedActivities.includes(mission.id);
              // First uncompleted mission is the "next" one
              const isNext = !isCompleted && displayMissions.filter(m => !completedActivities.includes(m.id))[0]?.id === mission.id;
              
              return (
                <MissionItem
                  key={mission.id}
                  activity={mission}
                  isCompleted={isCompleted}
                  phaseLink={phaseLink}
                  isNext={isNext}
                />
              );
            })
          ) : (
            <motion.div 
              className="text-center py-4 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary/30" />
              <p className="text-sm">Nenhuma missão disponível agora.</p>
              <p className="text-xs mt-1">Conclua as etapas anteriores para continuar.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer - action-oriented */}
      <div className="px-4 pb-3">
        <Link to={phaseLink}>
          <Button 
            variant={allComplete ? "outline" : "default"}
            size="sm" 
            className={cn(
              "w-full text-xs h-9",
              !allComplete && "btn-primary-gradient"
            )}
          >
            {allComplete ? (
              <>Revisar conquistas</>
            ) : (
              <>
                Continuar missão
                <ArrowRight className="h-3 w-3 ml-1" />
              </>
            )}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
