import { Flame, Calendar, Trophy, Zap, TrendingUp } from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color: string;
  hasProgress?: boolean;
  progress?: number;
}

const stats: StatItem[] = [
  { icon: Flame, value: 30, label: "Pontos XP", color: "hsl(var(--phase-despertar))" },
  { icon: Calendar, value: 100, label: "Dias na jornada", color: "hsl(var(--primary))" },
  { icon: Trophy, value: "1º", label: "Ranking", color: "hsl(var(--phase-decidir))" },
  { icon: Zap, value: "75%", label: "Energia", color: "hsl(var(--phase-descobrir))", hasProgress: true, progress: 75 },
  { icon: TrendingUp, value: "60%", label: "Progresso Semanal", color: "hsl(var(--primary))", hasProgress: true, progress: 60 },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-5 gap-2">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-card border border-border rounded-xl px-3 py-2.5 flex flex-col items-center justify-center text-center transition-all hover:shadow-sm hover:border-primary/20"
          >
            <Icon className="h-4 w-4 mb-1" style={{ color: stat.color }} />
            <span className="text-lg font-bold text-foreground leading-tight">{stat.value}</span>
            {stat.hasProgress && (
              <div className="w-full h-1 bg-muted rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${stat.progress}%`,
                    backgroundColor: stat.color 
                  }}
                />
              </div>
            )}
            <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}