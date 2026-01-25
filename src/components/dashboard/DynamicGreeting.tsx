import { useMemo } from "react";
import { Sparkles, Rocket, Target, Trophy, Flame, Heart, Sun, Moon, Sunrise } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { useStreak } from "@/hooks/useStreak";

interface GreetingData {
  greeting: string;
  message: string;
  icon: React.ElementType;
  iconColor: string;
}

function getTimeIcon(): React.ElementType {
  const hour = new Date().getHours();
  if (hour < 12) return Sunrise;
  if (hour < 18) return Sun;
  return Moon;
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

// Dynamic motivational messages based on context
function getContextualMessage(context: {
  streakDays: number;
  phaseName: string;
  phaseNumber: number;
  progressPercentage: number;
  daysInJourney: number;
  completedActivities: number;
}): GreetingData {
  const { streakDays, phaseName, phaseNumber, progressPercentage, daysInJourney, completedActivities } = context;
  
  // Streak-based messages (priority)
  if (streakDays >= 30) {
    return {
      greeting: getTimeGreeting(),
      message: `🔥 ${streakDays} dias de consistência! Você é imparável.`,
      icon: Flame,
      iconColor: "text-orange-500"
    };
  }
  
  if (streakDays >= 7) {
    return {
      greeting: getTimeGreeting(),
      message: `${streakDays} dias seguidos! Sua dedicação está gerando resultados.`,
      icon: Flame,
      iconColor: "text-amber-500"
    };
  }

  // Progress-based messages
  if (progressPercentage >= 90) {
    return {
      greeting: getTimeGreeting(),
      message: `Quase lá! Você está a ${100 - progressPercentage}% de completar ${phaseName}.`,
      icon: Trophy,
      iconColor: "text-yellow-500"
    };
  }

  if (progressPercentage >= 50) {
    return {
      greeting: getTimeGreeting(),
      message: `Metade da fase ${phaseName} concluída. Continue forte!`,
      icon: Target,
      iconColor: "text-primary"
    };
  }

  // Journey milestone messages
  if (daysInJourney === 1) {
    return {
      greeting: getTimeGreeting(),
      message: "Primeiro dia da jornada! Cada passo conta.",
      icon: Sparkles,
      iconColor: "text-primary"
    };
  }

  if (daysInJourney === 7) {
    return {
      greeting: getTimeGreeting(),
      message: "Uma semana de jornada! Você está construindo algo incrível.",
      icon: Heart,
      iconColor: "text-pink-500"
    };
  }

  if (completedActivities === 0) {
    return {
      greeting: getTimeGreeting(),
      message: "Pronto para dar o primeiro passo? Cada jornada começa assim.",
      icon: Rocket,
      iconColor: "text-primary"
    };
  }

  // Phase-specific default messages
  const phaseMessages: Record<number, string> = {
    1: "Sua transição começa com consciência.",
    2: "Descobrindo quem você realmente é.",
    3: "Clareza vem antes da decisão.",
    4: "Construindo competências reais.",
    5: "Execute com consistência.",
    6: "Celebre cada conquista."
  };

  return {
    greeting: getTimeGreeting(),
    message: phaseMessages[phaseNumber] || "Continue sua evolução profissional.",
    icon: getTimeIcon(),
    iconColor: "text-primary"
  };
}

export function DynamicGreeting() {
  const { user } = useAuth();
  const { userProgress, currentPhase, completedActivities, phaseProgress } = useProgress();
  const { streak } = useStreak();

  const displayName = useMemo(() => {
    // Try to get name from user metadata
    const fullName = user?.user_metadata?.full_name;
    if (fullName) return fullName.split(" ")[0];
    return user?.email?.split("@")[0] || "Migrante";
  }, [user]);

  const daysInJourney = useMemo(() => {
    if (!userProgress?.journey_started_at) return 0;
    return Math.floor((Date.now() - new Date(userProgress.journey_started_at).getTime()) / (1000 * 60 * 60 * 24));
  }, [userProgress]);

  const currentPhaseProgress = useMemo(() => {
    if (!currentPhase || !phaseProgress) return 0;
    const progress = phaseProgress.find(p => p.phase_id === currentPhase.id);
    return progress?.progress_percentage || 0;
  }, [currentPhase, phaseProgress]);

  const greetingData = useMemo(() => {
    return getContextualMessage({
      streakDays: streak?.current_streak || 0,
      phaseName: currentPhase?.name || "Despertar",
      phaseNumber: currentPhase?.phase_number || 1,
      progressPercentage: currentPhaseProgress,
      daysInJourney,
      completedActivities: completedActivities.length
    });
  }, [streak, currentPhase, currentPhaseProgress, daysInJourney, completedActivities]);

  const Icon = greetingData.icon;

  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
      >
        <Icon className={`h-5 w-5 ${greetingData.iconColor}`} />
      </motion.div>
      
      <div>
        <motion.h1 
          className="text-xl sm:text-2xl font-heading font-bold text-foreground flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-muted-foreground font-normal">{greetingData.greeting},</span>
          <span className="text-gradient-primary">{displayName}</span>
          <motion.span
            className="inline-block"
            animate={{ rotate: [0, 20, 0] }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            👋
          </motion.span>
        </motion.h1>
        <motion.p 
          className="text-xs sm:text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {greetingData.message}
        </motion.p>
      </div>
    </motion.div>
  );
}
