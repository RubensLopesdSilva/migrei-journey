import { Star, Calendar, Trophy, Zap, TrendingUp, Flame, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedProgress } from "@/components/ui/animated-container";
import { StatTooltip } from "@/components/ui/tooltip-enhanced";

interface QuickStatsBarProps {
  points?: number;
  days?: number;
  ranking?: number;
  energy?: number;
  weeklyProgress?: number;
  streakDays?: number;
}

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  showProgress?: boolean;
  progress?: number;
  description: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring" as const,
      stiffness: 300,
      damping: 24
    }
  }
};

export function QuickStatsBar({ 
  points = 30, 
  days = 100, 
  ranking = 1, 
  energy = 75,
  weeklyProgress = 60,
  streakDays = 7
}: QuickStatsBarProps) {
  const stats: StatItem[] = [
    {
      icon: Star,
      label: "Pontos XP",
      value: points.toLocaleString(),
      color: "hsl(var(--phase-despertar))",
      bgColor: "hsl(var(--phase-despertar) / 0.15)",
      description: "Pontos de experiência ganhos completando atividades e missões",
      trend: { value: 15, label: "esta semana", positive: true }
    },
    {
      icon: Flame,
      label: "Dias seguidos",
      value: streakDays.toString(),
      color: "hsl(var(--phase-decidir))",
      bgColor: "hsl(var(--phase-decidir) / 0.15)",
      description: "Quantos dias consecutivos você acessou a plataforma",
      trend: streakDays > 0 ? { value: streakDays, label: "dias de streak", positive: true } : undefined
    },
    {
      icon: Calendar,
      label: "Dias na jornada",
      value: days.toString(),
      color: "hsl(var(--primary))",
      bgColor: "hsl(var(--primary) / 0.15)",
      description: "Total de dias desde que você começou sua transição de carreira"
    },
    {
      icon: Trophy,
      label: "Ranking",
      value: `${ranking}º`,
      color: "hsl(var(--phase-desfrutar))",
      bgColor: "hsl(var(--phase-desfrutar) / 0.15)",
      description: "Sua posição no ranking geral de migrantes ativos"
    },
    {
      icon: Zap,
      label: "Energia",
      value: `${energy}%`,
      color: "hsl(var(--phase-deslanchar))",
      bgColor: "hsl(var(--phase-deslanchar) / 0.15)",
      showProgress: true,
      progress: energy,
      description: "Seu nível de energia baseado na frequência de atividades recentes"
    },
    {
      icon: TrendingUp,
      label: "Progresso semanal",
      value: `${weeklyProgress}%`,
      color: "hsl(var(--phase-descobrir))",
      bgColor: "hsl(var(--phase-descobrir) / 0.15)",
      showProgress: true,
      progress: weeklyProgress,
      description: "Quanto você progrediu na fase atual esta semana"
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3"
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
          trend={stat.trend}
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              y: -4, 
              boxShadow: "0 8px 24px -4px hsl(200 25% 15% / 0.16)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className="card-elevated p-2 sm:p-3 flex flex-col items-center text-center cursor-default"
            role="group"
            aria-label={`${stat.label}: ${stat.value}`}
          >
            <motion.div 
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center mb-1.5 sm:mb-2"
              style={{ backgroundColor: stat.bgColor }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <stat.icon 
                className="h-4 w-4 sm:h-5 sm:w-5" 
                style={{ color: stat.color }}
                aria-hidden="true"
              />
            </motion.div>
            
            <motion.p 
              className="text-lg sm:text-xl font-bold tabular-nums"
              style={{ color: stat.color }}
              key={stat.value}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {stat.value}
            </motion.p>
            
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              {stat.label}
            </p>

            {stat.showProgress && stat.progress !== undefined && (
              <div className="w-full mt-1.5 sm:mt-2">
                <AnimatedProgress 
                  value={stat.progress}
                  color={stat.color}
                  className="h-1 sm:h-1.5"
                />
              </div>
            )}
          </motion.div>
        </StatTooltip>
      ))}
    </motion.div>
  );
}
