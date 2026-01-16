import { Star, Flame, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {level}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
              <div className="bg-phase-despertar rounded-full p-1">
                <Star className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{levelName}</h2>
            <p className="text-sm text-muted-foreground">Nível {level} • {totalXp.toLocaleString()} XP total</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Streak */}
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-border">
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-lg font-bold text-foreground">{streak}</p>
              <p className="text-xs text-muted-foreground">dias</p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-border">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-lg font-bold text-foreground">{overallProgress}%</p>
              <p className="text-xs text-muted-foreground">completo</p>
            </div>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Award className="h-4 w-4" />
            Próximo nível
          </span>
          <span className="text-foreground font-medium">
            {xpProgress.current.toLocaleString()} / {xpProgress.max.toLocaleString()} XP
          </span>
        </div>
        <Progress value={xpProgress.percentage} className="h-3" />
      </div>
    </div>
  );
}
