import { motion } from "framer-motion";
import { Check, Lock, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PhaseWithProgress } from "@/types/progress";
import { cn } from "@/lib/utils";

interface PhasesGridProps {
  phases: PhaseWithProgress[];
  currentPhaseId: string | null;
  onPhaseClick: (phase: PhaseWithProgress) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export function PhasesGrid({ phases, currentPhaseId, onPhaseClick }: PhasesGridProps) {
  return (
    <div>
      <h3 className="font-bold text-base mb-4">Fases</h3>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {phases.map(phase => {
          const isLocked = phase.userProgress?.status === 'locked';
          const isCompleted = phase.userProgress?.status === 'completed';
          const isCurrent = phase.id === currentPhaseId;
          const progress = phase.userProgress?.progress_percentage || 0;
          
          return (
            <motion.button
              key={phase.id}
              variants={itemVariants}
              onClick={() => !isLocked && onPhaseClick(phase)}
              disabled={isLocked}
              whileHover={!isLocked ? { scale: 1.02 } : undefined}
              whileTap={!isLocked ? { scale: 0.98 } : undefined}
              className={cn(
                "p-4 rounded-xl border text-left transition-all",
                isLocked 
                  ? 'opacity-50 cursor-not-allowed bg-muted/30' 
                  : isCurrent
                    ? 'border-primary/50 bg-primary/5 hover:bg-primary/10'
                    : isCompleted
                      ? 'border-green-200 bg-green-500/5 hover:bg-green-500/10'
                      : 'bg-card hover:bg-muted/50'
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ 
                    backgroundColor: isLocked ? '#6B7280' : phase.color || '#3B82F6' 
                  }}
                >
                  {phase.phase_number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{phase.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isCompleted && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5 bg-green-500/10 text-green-600">
                        <Check className="h-2.5 w-2.5" />
                        Concluída
                      </Badge>
                    )}
                    {isCurrent && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5 bg-primary/10 text-primary">
                        <Play className="h-2.5 w-2.5" />
                        Atual
                      </Badge>
                    )}
                    {isLocked && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
                        <Lock className="h-2.5 w-2.5" />
                        Bloqueada
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {!isLocked && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium tabular-nums">{progress}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className={cn(
                      "h-1.5",
                      isCompleted && "[&>div]:bg-green-500"
                    )}
                  />
                </div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
