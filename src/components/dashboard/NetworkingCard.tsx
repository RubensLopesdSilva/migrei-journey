import { Users, ArrowRight, UserPlus, MessageCircle, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { focusRingClasses } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";
import { AnimatedProgress } from "@/components/ui/animated-container";

interface NetworkingAction {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xp: number;
  icon: typeof Users;
}

interface Connection {
  id: string;
  name: string;
  role: string;
  initials: string;
}

const weeklyActions: NetworkingAction[] = [
  { id: "1", title: "Enviar 3 convites", description: "Conecte com novos profissionais", completed: true, xp: 15, icon: UserPlus },
  { id: "2", title: "Comentar 2 posts", description: "Engaje com a comunidade", completed: false, xp: 10, icon: MessageCircle },
  { id: "3", title: "Agendar 1 conversa", description: "Marque um café virtual", completed: false, xp: 25, icon: Calendar },
];

const suggestedConnections: Connection[] = [
  { id: "1", name: "Ana Silva", role: "Product Manager", initials: "AS" },
  { id: "2", name: "Carlos O.", role: "Tech Lead", initials: "CO" },
  { id: "3", name: "Maria L.", role: "UX Designer", initials: "ML" },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export function NetworkingCard() {
  const completedCount = weeklyActions.filter(a => a.completed).length;
  const totalXP = weeklyActions.filter(a => a.completed).reduce((acc, a) => acc + a.xp, 0);
  const potentialXP = weeklyActions.reduce((acc, a) => acc + a.xp, 0);
  const progressPercent = (completedCount / weeklyActions.length) * 100;

  return (
    <motion.div 
      className="card-elevated overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-phase-deslanchar/10 to-phase-deslanchar/5 p-4 sm:p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div 
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-phase-deslanchar/20 flex items-center justify-center"
              whileHover={{ rotate: -10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-phase-deslanchar" aria-hidden="true" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-foreground">
                Networking semanal
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
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
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 sm:mt-4">
          <AnimatedProgress value={progressPercent} className="h-1.5 sm:h-2" />
        </div>
      </div>

      {/* Actions list */}
      <motion.div 
        className="p-3 sm:p-4 space-y-1.5 sm:space-y-2"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {weeklyActions.map((action) => (
          <motion.button
            key={action.id}
            variants={itemVariants}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 text-left",
              focusRingClasses,
              action.completed 
                ? 'bg-phase-deslanchar/5 hover:bg-phase-deslanchar/10' 
                : 'hover:bg-muted'
            )}
          >
            <div className={cn(
              "h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center flex-shrink-0",
              action.completed ? "bg-phase-deslanchar/20" : "bg-muted"
            )}>
              <action.icon className={cn(
                "h-3.5 w-3.5 sm:h-4 sm:w-4",
                action.completed ? "text-phase-deslanchar" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-xs sm:text-sm font-medium truncate",
                action.completed ? 'text-muted-foreground line-through' : 'text-foreground'
              )}>
                {action.title}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {action.description}
              </p>
            </div>
            <span className={cn(
              "text-[10px] sm:text-xs font-medium flex-shrink-0",
              action.completed ? 'text-phase-deslanchar' : 'text-muted-foreground'
            )}>
              +{action.xp} XP
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Suggested connections */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-2">
          Conexões sugeridas
        </p>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {suggestedConnections.slice(0, 3).map((connection) => (
              <Avatar key={connection.id} className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-card">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] sm:text-xs">
                  {connection.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Link 
            to="/comunidade"
            className={cn(
              "text-[10px] sm:text-xs text-primary hover:underline",
              focusRingClasses
            )}
          >
            Ver todas →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
