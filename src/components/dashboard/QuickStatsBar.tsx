import { Star, Calendar, TrendingUp, MapPin, Flame, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { StatTooltip } from "@/components/ui/tooltip-enhanced";
import { useStreak } from "@/hooks/useStreak";

interface QuickStatsBarProps {
  points?: number;
  days?: number;
  weeklyProgress?: number;
  currentPhase?: {
    name: string;
    number: number;
  };
}

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
  bgColor: string;
  description: string;
  isStreak?: boolean;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring" as const,
      stiffness: 500,
      damping: 30
    }
  }
};

export function QuickStatsBar({ 
  points = 0, 
  days = 0, 
  weeklyProgress = 0,
  currentPhase = { name: "Despertar", number: 1 }
}: QuickStatsBarProps) {
  const { streak } = useStreak();
  
  const stats: StatItem[] = [
    // Streak first - gamification priority
    ...(streak && streak.current_streak > 0 ? [{
      icon: Flame,
      value: streak.current_streak.toString(),
      label: streak.current_streak === 1 ? "dia" : "dias",
      color: streak.current_streak >= 7 ? "hsl(25, 95%, 53%)" : streak.current_streak >= 3 ? "hsl(45, 93%, 47%)" : "hsl(var(--muted-foreground))",
      bgColor: streak.current_streak >= 7 ? "hsl(25, 95%, 53% / 0.15)" : streak.current_streak >= 3 ? "hsl(45, 93%, 47% / 0.15)" : "hsl(var(--muted) / 0.5)",
      description: `🔥 Streak: ${streak.current_streak} dias seguidos${streak.longest_streak > streak.current_streak ? ` (recorde: ${streak.longest_streak})` : ""}`,
      isStreak: true,
    }] : []),
    {
      icon: Star,
      value: points.toLocaleString(),
      label: "XP",
      color: "hsl(var(--phase-despertar))",
      bgColor: "hsl(var(--phase-despertar) / 0.15)",
      description: "Pontos de experiência acumulados"
    },
    {
      icon: Calendar,
      value: days.toString(),
      label: "dias",
      color: "hsl(var(--primary))",
      bgColor: "hsl(var(--primary) / 0.15)",
      description: "Dias na jornada"
    },
    {
      icon: TrendingUp,
      value: `${weeklyProgress}%`,
      label: "semana",
      color: "hsl(var(--phase-descobrir))",
      bgColor: "hsl(var(--phase-descobrir) / 0.15)",
      description: "Progresso semanal"
    },
    {
      icon: MapPin,
      value: `F${currentPhase.number}`,
      label: currentPhase.name,
      color: "hsl(var(--phase-decidir))",
      bgColor: "hsl(var(--phase-decidir) / 0.15)",
      description: `Fase ${currentPhase.number}: ${currentPhase.name}`
    }
  ];

  return (
    <motion.div 
      className="flex items-center gap-2"
      data-tour="stats-bar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => (
        <StatTooltip
          key={stat.label}
          label={stat.label}
          value={stat.value}
          description={stat.description}
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              y: -2, 
              boxShadow: "var(--shadow-md)",
              transition: { duration: 0.15 }
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-card border border-border rounded-xl cursor-default"
            style={{ boxShadow: "var(--shadow-xs)" }}
          >
            <motion.div 
              className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: stat.bgColor }}
              animate={stat.isStreak ? {
                rotate: [-5, 5, -5],
                scale: [1, 1.05, 1],
              } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <stat.icon 
                className="h-3 w-3 sm:h-3.5 sm:w-3.5" 
                style={{ color: stat.color }}
              />
            </motion.div>
            <div className="flex items-baseline gap-1">
              <span 
                className="text-sm sm:text-base font-bold tabular-nums"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-medium hidden sm:inline">
                {stat.label}
              </span>
            </div>
          </motion.div>
        </StatTooltip>
      ))}
    </motion.div>
  );
}
