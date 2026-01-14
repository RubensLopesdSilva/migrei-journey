import { Star, Calendar, TrendingUp, MapPin, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedProgress } from "@/components/ui/animated-container";
import { StatTooltip } from "@/components/ui/tooltip-enhanced";

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
  label: string;
  value: string;
  sublabel?: string;
  color: string;
  bgColor: string;
  gradientFrom?: string;
  gradientTo?: string;
  showProgress?: boolean;
  progress?: number;
  description: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  isHighlighted?: boolean;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring" as const,
      stiffness: 400,
      damping: 28
    }
  }
};

export function QuickStatsBar({ 
  points = 575, 
  days = 2, 
  weeklyProgress = 0,
  currentPhase = { name: "Despertar", number: 1 }
}: QuickStatsBarProps) {
  const stats: StatItem[] = [
    {
      icon: Star,
      label: "XP Total",
      value: points.toLocaleString(),
      sublabel: "pontos",
      color: "hsl(var(--phase-despertar))",
      bgColor: "hsl(var(--phase-despertar) / 0.12)",
      gradientFrom: "hsl(var(--phase-despertar))",
      gradientTo: "hsl(var(--phase-descobrir))",
      description: "Pontos de experiência ganhos completando atividades e missões",
      trend: { value: 15, label: "esta semana", positive: true },
      isHighlighted: true
    },
    {
      icon: Calendar,
      label: "Na jornada",
      value: days.toString(),
      sublabel: days === 1 ? "dia" : "dias",
      color: "hsl(var(--primary))",
      bgColor: "hsl(var(--primary) / 0.12)",
      description: "Total de dias desde que você começou sua transição de carreira"
    },
    {
      icon: TrendingUp,
      label: "Progresso",
      value: `${weeklyProgress}%`,
      sublabel: "esta semana",
      color: "hsl(var(--phase-descobrir))",
      bgColor: "hsl(var(--phase-descobrir) / 0.12)",
      showProgress: true,
      progress: weeklyProgress,
      description: "Quanto você progrediu na fase atual esta semana"
    },
    {
      icon: MapPin,
      label: "Fase atual",
      value: `${currentPhase.number}`,
      sublabel: currentPhase.name,
      color: "hsl(var(--phase-decidir))",
      bgColor: "hsl(var(--phase-decidir) / 0.12)",
      description: `Você está na fase ${currentPhase.number}: ${currentPhase.name}`
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => (
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
              y: -6, 
              boxShadow: "var(--shadow-lg)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative overflow-hidden
              bg-card rounded-2xl border border-border
              p-4 sm:p-5
              flex flex-col
              cursor-default
              transition-colors duration-300
              ${stat.isHighlighted ? 'ring-1 ring-primary/20' : ''}
            `}
            style={{ 
              boxShadow: "var(--shadow-sm)"
            }}
            role="group"
            aria-label={`${stat.label}: ${stat.value} ${stat.sublabel || ''}`}
          >
            {/* Subtle gradient accent for highlighted items */}
            {stat.isHighlighted && (
              <div 
                className="absolute top-0 left-0 right-0 h-1 opacity-80"
                style={{
                  background: `linear-gradient(90deg, ${stat.gradientFrom}, ${stat.gradientTo})`
                }}
              />
            )}

            {/* Header with icon */}
            <div className="flex items-center justify-between mb-3">
              <motion.div 
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: stat.bgColor }}
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <stat.icon 
                  className="h-5 w-5 sm:h-5.5 sm:w-5.5" 
                  style={{ color: stat.color }}
                  aria-hidden="true"
                />
              </motion.div>

              {/* Trend indicator */}
              {stat.trend && stat.trend.positive && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ 
                    backgroundColor: "hsl(var(--success) / 0.1)",
                    color: "hsl(var(--success))"
                  }}
                >
                  <TrendingUp className="h-2.5 w-2.5" />
                  +{stat.trend.value}
                </motion.div>
              )}
            </div>

            {/* Value */}
            <div className="flex-1 flex flex-col justify-end">
              <motion.p 
                className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums"
                style={{ color: stat.color }}
                key={stat.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, delay: index * 0.05 }}
              >
                {stat.value}
              </motion.p>
              
              <div className="flex items-baseline gap-1.5 mt-0.5">
                {stat.sublabel && (
                  <span className="text-xs text-muted-foreground font-medium">
                    {stat.sublabel}
                  </span>
                )}
              </div>

              <p className="text-[11px] sm:text-xs text-muted-foreground/70 mt-1 font-medium">
                {stat.label}
              </p>

              {/* Progress bar */}
              {stat.showProgress && stat.progress !== undefined && (
                <div className="mt-3">
                  <AnimatedProgress 
                    value={stat.progress}
                    color={stat.color}
                    className="h-1.5 sm:h-2 rounded-full"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </StatTooltip>
      ))}
    </motion.div>
  );
}
