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
  borderColor: string;
  description: string;
  isStreak?: boolean;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring" as const,
      stiffness: 400,
      damping: 25
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
      bgColor: streak.current_streak >= 7 ? "hsl(25, 95%, 53% / 0.12)" : streak.current_streak >= 3 ? "hsl(45, 93%, 47% / 0.12)" : "hsl(var(--muted) / 0.4)",
      borderColor: streak.current_streak >= 7 ? "hsl(25, 95%, 53% / 0.25)" : streak.current_streak >= 3 ? "hsl(45, 93%, 47% / 0.25)" : "hsl(var(--border))",
      description: `🔥 Streak: ${streak.current_streak} dias seguidos${streak.longest_streak > streak.current_streak ? ` (recorde: ${streak.longest_streak})` : ""}`,
      isStreak: true,
    }] : []),
    {
      icon: Star,
      value: points.toLocaleString(),
      label: "XP",
      color: "hsl(var(--phase-despertar))",
      bgColor: "hsl(var(--phase-despertar) / 0.12)",
      borderColor: "hsl(var(--phase-despertar) / 0.25)",
      description: "Pontos de experiência acumulados"
    },
    {
      icon: Calendar,
      value: days.toString(),
      label: "dias",
      color: "hsl(var(--primary))",
      bgColor: "hsl(var(--primary) / 0.12)",
      borderColor: "hsl(var(--primary) / 0.25)",
      description: "Dias na jornada"
    },
    {
      icon: TrendingUp,
      value: `${weeklyProgress}%`,
      label: "semana",
      color: "hsl(var(--phase-descobrir))",
      bgColor: "hsl(var(--phase-descobrir) / 0.12)",
      borderColor: "hsl(var(--phase-descobrir) / 0.25)",
      description: "Progresso semanal"
    },
    {
      icon: MapPin,
      value: `F${currentPhase.number}`,
      label: currentPhase.name,
      color: "hsl(var(--phase-decidir))",
      bgColor: "hsl(var(--phase-decidir) / 0.12)",
      borderColor: "hsl(var(--phase-decidir) / 0.25)",
      description: `Fase ${currentPhase.number}: ${currentPhase.name}`
    }
  ];

  return (
    <motion.div 
      className="flex items-center gap-2 sm:gap-2.5"
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
              scale: 1.02,
              transition: { duration: 0.15 }
            }}
            className="flex items-center gap-2 px-3 py-2 bg-card/80 backdrop-blur-sm rounded-xl cursor-default transition-shadow duration-200"
            style={{ 
              border: `1px solid ${stat.borderColor}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            {/* Icon Container */}
            <motion.div 
              className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ 
                backgroundColor: stat.bgColor,
                border: `1px solid ${stat.borderColor}`
              }}
              animate={stat.isStreak ? {
                rotate: [-3, 3, -3],
                scale: [1, 1.05, 1],
              } : {}}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <stat.icon 
                className="h-4 w-4" 
                style={{ color: stat.color }}
                strokeWidth={2.5}
              />
            </motion.div>
            
            {/* Value and Label */}
            <div className="flex items-baseline gap-1">
              <span 
                className="text-sm sm:text-base font-bold tabular-nums leading-none"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground/80 font-medium hidden sm:inline leading-none">
                {stat.label}
              </span>
            </div>
          </motion.div>
        </StatTooltip>
      ))}
    </motion.div>
  );
}
