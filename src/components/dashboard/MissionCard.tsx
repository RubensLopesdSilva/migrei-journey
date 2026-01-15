import { Target, Circle, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { focusRingClasses } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/useProgress";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";
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
  onComplete: (activityId: string) => Promise<void>;
  isLoading: boolean;
  phaseLink: string;
}

function MissionItem({ activity, isCompleted, onComplete, isLoading, phaseLink }: MissionItemProps) {
  const handleComplete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCompleted && !isLoading) {
      await onComplete(activity.id);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="group"
    >
      <div
        className={cn(
          "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-left",
          isCompleted 
            ? 'bg-primary/5' 
            : 'hover:bg-muted/50'
        )}
      >
        <button
          onClick={handleComplete}
          disabled={isCompleted || isLoading}
          className={cn(
            "h-5 w-5 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center",
            focusRingClasses,
            isCompleted 
              ? "bg-primary border-primary" 
              : "border-muted-foreground/40 hover:border-primary group-hover:border-primary"
          )}
          aria-label={isCompleted ? "Missão concluída" : "Concluir missão"}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />
          ) : isCompleted ? (
            <Check className="h-3 w-3 text-primary-foreground" />
          ) : null}
        </button>
        
        <Link to={phaseLink} className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium truncate",
            isCompleted 
              ? 'text-muted-foreground line-through' 
              : 'text-foreground'
          )}>
            {activity.title}
          </p>
          {activity.description && (
            <p className="text-[10px] text-muted-foreground truncate">
              {activity.description}
            </p>
          )}
        </Link>
        
        <span className={cn(
          "text-xs font-medium flex-shrink-0",
          isCompleted ? 'text-primary' : 'text-muted-foreground'
        )}>
          +{activity.xp_reward} XP
        </span>
      </div>
    </motion.div>
  );
}

export function MissionCard() {
  const { 
    userProgress, 
    phases, 
    activities, 
    completedActivities, 
    completeActivity,
    phaseProgress 
  } = useProgress();
  
  const [loadingActivity, setLoadingActivity] = useState<string | null>(null);
  
  // Get current phase info
  const currentPhase = useMemo(() => {
    return phases?.find(p => p.id === userProgress?.current_phase_id) || phases?.[0];
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

  // Handle mission completion
  const handleCompleteMission = async (activityId: string) => {
    if (!currentPhase) return;
    
    setLoadingActivity(activityId);
    
    try {
      await completeActivity(activityId, currentPhase.id, 0);
      
      const activity = phaseMissions.find(a => a.id === activityId);
      const newCompletedCount = completedCount + 1;
      const newProgressPercentage = Math.round((newCompletedCount / phaseMissions.length) * 100);
      
      // Trigger confetti for celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3B82F6', '#8B5CF6', '#F59E0B']
      });
      
      // Show success toast with progress info
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Etapa concluída 🎉</span>
          <span className="text-sm text-muted-foreground">
            Você avançou mais um passo na sua transição.
          </span>
          {activity && (
            <span className="text-sm text-primary font-medium">
              +{activity.xp_reward} XP
            </span>
          )}
        </div>
      );
      
    } catch (error) {
      console.error('Error completing mission:', error);
      toast.error('Algo não saiu como esperado. Tente novamente em instantes.');
    } finally {
      setLoadingActivity(null);
    }
  };

  // Get first uncompleted missions to display
  const displayMissions = useMemo(() => {
    const uncompleted = phaseMissions.filter(m => !completedActivities.includes(m.id));
    const completed = phaseMissions.filter(m => completedActivities.includes(m.id));
    
    // Show up to 3 missions: prioritize uncompleted, then show completed
    return [...uncompleted, ...completed].slice(0, 3);
  }, [phaseMissions, completedActivities]);

  return (
    <motion.div 
      className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col"
      data-tour="mission-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      {/* Header compact */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground">
                  Missões da fase
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                  {phaseDisplayName}
                </span>
              </div>
            <p className="text-[10px] text-muted-foreground">
              {completedCount}/{phaseMissions.length} completas • +{totalXP}/{potentialXP} XP
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

      {/* Progress bar */}
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Progresso da fase</span>
          <span className="font-medium text-primary">{progressPercentage}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
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
            displayMissions.map((mission) => (
              <MissionItem
                key={mission.id}
                activity={mission}
                isCompleted={completedActivities.includes(mission.id)}
                onComplete={handleCompleteMission}
                isLoading={loadingActivity === mission.id}
                phaseLink={phaseLink}
              />
            ))
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

      {/* Footer - link to phase */}
      {phaseMissions.length > 3 && (
        <div className="px-4 pb-3">
          <Link to={phaseLink}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs h-8 text-muted-foreground hover:text-foreground"
            >
              Continuar jornada
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}
