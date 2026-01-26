import { Target, ArrowRight, Check, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { focusRingClasses } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/useProgress";
import { useMemo, forwardRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PHASE_COLORS } from "@/data/phaseIntroData";
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

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0 }
};

interface MissionItemProps {
  activity: PhaseActivity;
  isCompleted: boolean;
  phaseLink: string;
  isNext?: boolean;
  phaseColor: string;
}

function MissionItem({ activity, isCompleted, phaseLink, isNext, phaseColor }: MissionItemProps) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        to={phaseLink}
        className={cn(
          "flex items-center gap-2.5 py-2 px-2 rounded-lg transition-all",
          isCompleted 
            ? 'opacity-60' 
            : isNext
              ? 'bg-primary/5 hover:bg-primary/10'
              : 'hover:bg-muted/40'
        )}
      >
        {/* Compact status indicator */}
        <div 
          className={cn(
            "h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0",
            isCompleted ? "bg-primary" : "border-2"
          )}
          style={{ borderColor: isCompleted ? undefined : `${phaseColor}40` }}
        >
          {isCompleted ? (
            <Check className="h-3 w-3 text-primary-foreground" />
          ) : isNext ? (
            <Zap className="h-2.5 w-2.5" style={{ color: phaseColor }} />
          ) : (
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
          )}
        </div>
        
        <span className={cn(
          "text-sm flex-1 truncate",
          isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
        )}>
          {activity.title}
        </span>
        
        <span className="text-[10px] text-muted-foreground flex-shrink-0">
          +{activity.xp_reward}
        </span>
      </Link>
    </motion.div>
  );
}

function MissionCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 h-full">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

export const MissionCard = forwardRef<HTMLDivElement, object>(function MissionCard(_, ref) {
  const { 
    userProgress, 
    phases, 
    activities, 
    completedActivities, 
    phaseProgress,
    loading
  } = useProgress();

  const currentPhase = useMemo(() => {
    if (!phases || phases.length === 0) return null;
    return phases.find(p => p.id === userProgress?.current_phase_id) || phases[0];
  }, [phases, userProgress]);

  const phaseSlug = useMemo(() => {
    return currentPhase?.phase_number 
      ? phaseNumberToSlug[currentPhase.phase_number] 
      : "despertar";
  }, [currentPhase]);

  const phaseColor = PHASE_COLORS[currentPhase?.phase_number as keyof typeof PHASE_COLORS] || PHASE_COLORS[1];

  const phaseMissions = useMemo(() => {
    if (!currentPhase || !activities) return [];
    return activities
      .filter(a => a.phase_id === currentPhase.id)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [activities, currentPhase]);

  const completedCount = useMemo(() => {
    return phaseMissions.filter(m => completedActivities.includes(m.id)).length;
  }, [phaseMissions, completedActivities]);

  const currentPhaseProgress = useMemo(() => {
    return phaseProgress?.find(p => p.phase_id === currentPhase?.id);
  }, [phaseProgress, currentPhase]);

  const progressPercentage = currentPhaseProgress?.progress_percentage || 0;
  const phaseDisplayName = currentPhase?.name || "Despertar";
  const phaseLink = phaseRoutes[phaseSlug] || "/fase/despertar";

  const displayMissions = useMemo(() => {
    const uncompleted = phaseMissions.filter(m => !completedActivities.includes(m.id));
    const completed = phaseMissions.filter(m => completedActivities.includes(m.id));
    return [...uncompleted, ...completed].slice(0, 3);
  }, [phaseMissions, completedActivities]);

  if (loading) {
    return <MissionCardSkeleton />;
  }

  const allComplete = completedCount === phaseMissions.length && phaseMissions.length > 0;

  return (
    <motion.div 
      ref={ref}
      className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col"
      data-tour="mission-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      {/* Compact Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${phaseColor}15` }}
          >
            {allComplete ? (
              <Trophy className="h-4 w-4" style={{ color: phaseColor }} />
            ) : (
              <Target className="h-4 w-4" style={{ color: phaseColor }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {phaseDisplayName}
              </h3>
              <Link 
                to={phaseLink}
                className={cn(
                  "text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 rounded",
                  focusRingClasses
                )}
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {/* Inline progress bar */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ backgroundColor: phaseColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {completedCount}/{phaseMissions.length}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Missions list - compact */}
      <motion.div 
        className="px-4 pb-4 space-y-0.5 flex-1"
        data-tour="mission-tasks"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {displayMissions.length > 0 ? (
            displayMissions.map((mission) => {
              const isCompleted = completedActivities.includes(mission.id);
              const isNext = !isCompleted && displayMissions.filter(m => !completedActivities.includes(m.id))[0]?.id === mission.id;
              
              return (
                <MissionItem
                  key={mission.id}
                  activity={mission}
                  isCompleted={isCompleted}
                  phaseLink={phaseLink}
                  isNext={isNext}
                  phaseColor={phaseColor}
                />
              );
            })
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">Nenhuma missão disponível.</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

MissionCard.displayName = "MissionCard";
