import { Star, Calendar, Trophy, Zap, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuickStatsBarProps {
  points?: number;
  days?: number;
  ranking?: number;
  energy?: number;
  weeklyProgress?: number;
}

export function QuickStatsBar({ 
  points = 30, 
  days = 100, 
  ranking = 1, 
  energy = 75,
  weeklyProgress = 60 
}: QuickStatsBarProps) {
  const stats = [
    {
      icon: Star,
      label: "Pontos XP",
      value: points.toLocaleString(),
      color: "hsl(var(--phase-despertar))",
      bgColor: "hsl(var(--phase-despertar) / 0.15)"
    },
    {
      icon: Calendar,
      label: "Dias na jornada",
      value: days.toString(),
      color: "hsl(var(--primary))",
      bgColor: "hsl(var(--primary) / 0.15)"
    },
    {
      icon: Trophy,
      label: "Ranking",
      value: `${ranking}º`,
      color: "hsl(var(--phase-desfrutar))",
      bgColor: "hsl(var(--phase-desfrutar) / 0.15)"
    },
    {
      icon: Zap,
      label: "Energia",
      value: `${energy}%`,
      color: "hsl(var(--phase-deslanchar))",
      bgColor: "hsl(var(--phase-deslanchar) / 0.15)",
      showProgress: true,
      progress: energy
    },
    {
      icon: TrendingUp,
      label: "Progresso semanal",
      value: `${weeklyProgress}%`,
      color: "hsl(var(--phase-descobrir))",
      bgColor: "hsl(var(--phase-descobrir) / 0.15)",
      showProgress: true,
      progress: weeklyProgress
    }
  ];

  return (
    <div className="grid grid-cols-5 gap-3 animate-fade-in">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="card-elevated p-4 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div 
            className="h-12 w-12 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: stat.bgColor }}
          >
            <stat.icon 
              className="h-6 w-6" 
              style={{ color: stat.color }}
            />
          </div>
          
          <p 
            className="text-2xl font-bold"
            style={{ color: stat.color }}
          >
            {stat.value}
          </p>
          
          <p className="text-xs text-muted-foreground mt-1">
            {stat.label}
          </p>

          {stat.showProgress && (
            <div className="w-full mt-2">
              <Progress 
                value={stat.progress} 
                className="h-1.5"
                style={{ 
                  // @ts-ignore
                  '--progress-color': stat.color 
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
