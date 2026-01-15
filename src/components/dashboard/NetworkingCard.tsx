import { Users, ArrowRight, UserPlus, MessageCircle, Calendar, HelpCircle, Circle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { focusRingClasses } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";
import { AnimatedProgress } from "@/components/ui/animated-container";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NetworkingAction {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xp: number;
  icon: typeof Users;
}

const weeklyActions: NetworkingAction[] = [
  { id: "1", title: "Enviar 3 convites", description: "Conecte com novos profissionais", completed: false, xp: 15, icon: UserPlus },
  { id: "2", title: "Comentar 2 posts", description: "Engaje com a comunidade", completed: false, xp: 10, icon: MessageCircle },
];

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

export function NetworkingCard() {
  const completedCount = weeklyActions.filter(a => a.completed).length;
  const totalXP = weeklyActions.filter(a => a.completed).reduce((acc, a) => acc + a.xp, 0);
  const potentialXP = weeklyActions.reduce((acc, a) => acc + a.xp, 0);
  const progressPercent = (completedCount / weeklyActions.length) * 100;

  return (
    <motion.div 
      className="bg-card rounded-2xl border border-border overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-phase-deslanchar/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-phase-deslanchar" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              Networking semanal
            </h3>
            <p className="text-[10px] text-muted-foreground">
              {completedCount}/{weeklyActions.length} ações • +{totalXP}/{potentialXP} XP
            </p>
          </div>
        </div>
        <Link 
          to="/comunidade"
          className={cn(
            "text-primary hover:text-primary/80 transition-colors p-2 -m-2 rounded-lg",
            focusRingClasses
          )}
          aria-label="Ver comunidade"
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-3">
        <AnimatedProgress value={progressPercent} className="h-1.5" />
      </div>

      {/* Actions list - compact */}
      <motion.div 
        className="p-3 space-y-1"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {weeklyActions.map((action) => (
          <motion.div
            key={action.id}
            variants={itemVariants}
          >
            <button
              className={cn(
                "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-left group",
                focusRingClasses,
                action.completed 
                  ? 'bg-phase-deslanchar/5' 
                  : 'hover:bg-muted/50'
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                action.completed ? "bg-phase-deslanchar/20" : "bg-muted"
              )}>
                <action.icon className={cn(
                  "h-4 w-4",
                  action.completed ? "text-phase-deslanchar" : "text-muted-foreground"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  action.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                )}>
                  {action.title}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {action.description}
                </p>
              </div>
              <span className={cn(
                "text-xs font-medium flex-shrink-0",
                action.completed ? 'text-phase-deslanchar' : 'text-muted-foreground'
              )}>
                +{action.xp} XP
              </span>
            </button>
          </motion.div>
        ))}
      </motion.div>

    </motion.div>
  );
}
