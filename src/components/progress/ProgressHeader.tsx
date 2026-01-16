import { motion } from "framer-motion";
import { Flame, TrendingUp, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getXpProgressInLevel } from "@/types/progress";

interface ProgressHeaderProps {
  totalXp: number;
  level: number;
  levelName: string;
  streak: number;
  overallProgress: number;
}

export function ProgressHeader({ 
  totalXp, 
  level, 
  levelName, 
  streak, 
  overallProgress 
}: ProgressHeaderProps) {
  const xpProgress = getXpProgressInLevel(totalXp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      {/* Hero Header - Same pattern as Networking */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg shadow-md">
          {level}
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {levelName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {totalXp.toLocaleString()} XP total
          </p>
        </div>
      </div>

      {/* Stats Row - Compact badges like Networking */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
          <Flame className="h-3.5 w-3.5 text-orange-500" />
          <span className="font-bold">{streak}</span>
          <span className="text-muted-foreground text-xs">dias</span>
        </Badge>
        <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          <span className="font-bold">{overallProgress}%</span>
          <span className="text-muted-foreground text-xs">completo</span>
        </Badge>
        <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <span className="font-bold">{xpProgress.current}</span>
          <span className="text-muted-foreground text-xs">/ {xpProgress.max}</span>
        </Badge>
      </div>

      {/* XP Progress Bar - Compact */}
      <div className="bg-card rounded-lg border border-border p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">Próximo nível</span>
          <span className="text-xs font-bold tabular-nums text-foreground">
            {xpProgress.percentage}%
          </span>
        </div>
        <Progress value={xpProgress.percentage} className="h-1.5" />
      </div>
    </motion.div>
  );
}
