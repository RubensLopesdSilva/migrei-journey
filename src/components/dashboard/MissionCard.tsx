import { Target, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedProgress } from "@/components/ui/animated-container";
import { focusRingClasses } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";

interface Challenge {
  id: string;
  title: string;
  completed: boolean;
  xp: number;
}

const dailyChallenges: Challenge[] = [
  { id: "1", title: "Atualizar perfil LinkedIn", completed: true, xp: 15 },
  { id: "2", title: "Ler artigo sobre transição", completed: false, xp: 10 },
  { id: "3", title: "Fazer 1 conexão nova", completed: false, xp: 20 },
  { id: "4", title: "Completar lição da fase", completed: false, xp: 25 },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export function MissionCard() {
  const completedCount = dailyChallenges.filter(c => c.completed).length;
  const totalXP = dailyChallenges.filter(c => c.completed).reduce((acc, c) => acc + c.xp, 0);
  const potentialXP = dailyChallenges.reduce((acc, c) => acc + c.xp, 0);
  const progressPercent = (completedCount / dailyChallenges.length) * 100;

  return (
    <motion.div 
      className="card-elevated overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 sm:p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div 
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-foreground">
                Missões do dia
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {completedCount}/{dailyChallenges.length} completas • +{totalXP}/{potentialXP} XP
              </p>
            </div>
          </div>
          <Link 
            to="/progresso"
            className={cn(
              "text-primary hover:text-primary/80 transition-colors p-2 -m-2 rounded-lg",
              focusRingClasses
            )}
            aria-label="Ver todas as missões"
          >
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 sm:mt-4">
          <AnimatedProgress value={progressPercent} className="h-1.5 sm:h-2" />
        </div>
      </div>
      
      {/* Challenges list */}
      <motion.div 
        className="p-3 sm:p-4 space-y-1.5 sm:space-y-2"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {dailyChallenges.map((challenge) => (
          <motion.button
            key={challenge.id}
            variants={itemVariants}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 text-left",
              focusRingClasses,
              challenge.completed 
                ? 'bg-primary/5 hover:bg-primary/10' 
                : 'hover:bg-muted'
            )}
            aria-label={`${challenge.title} - ${challenge.completed ? 'Completa' : 'Pendente'} - ${challenge.xp} pontos XP`}
          >
            <motion.div
              initial={challenge.completed ? { scale: 0 } : { scale: 1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {challenge.completed ? (
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              )}
            </motion.div>
            <span className={cn(
              "flex-1 text-xs sm:text-sm",
              challenge.completed 
                ? 'text-muted-foreground line-through' 
                : 'text-foreground'
            )}>
              {challenge.title}
            </span>
            <span className={cn(
              "text-[10px] sm:text-xs font-medium",
              challenge.completed 
                ? 'text-primary' 
                : 'text-muted-foreground'
            )}>
              +{challenge.xp} XP
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
