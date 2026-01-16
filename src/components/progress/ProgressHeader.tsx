import { motion } from "framer-motion";
import { Star, Flame, TrendingUp, Zap } from "lucide-react";
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
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {level}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
              <div className="bg-phase-despertar rounded-full p-0.5">
                <Star className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {levelName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Nível {level} • {totalXp.toLocaleString()} XP
            </p>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-bold">{streak}</span>
            <span className="text-muted-foreground">dias</span>
          </Badge>
          <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="font-bold">{overallProgress}%</span>
          </Badge>
        </div>
      </div>

      {/* XP Progress Card */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-primary" />
            Próximo nível
          </span>
          <span className="text-sm font-bold tabular-nums">
            {xpProgress.current.toLocaleString()} / {xpProgress.max.toLocaleString()} XP
          </span>
        </div>
        <Progress value={xpProgress.percentage} className="h-2" />
      </div>
    </motion.div>
  );
}
