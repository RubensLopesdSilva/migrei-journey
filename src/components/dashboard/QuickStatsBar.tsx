import { Star, Calendar, Trophy, Zap } from "lucide-react";

interface QuickStatsBarProps {
  points?: number;
  days?: number;
  ranking?: number;
  energy?: number;
}

export function QuickStatsBar({ 
  points = 1250, 
  days = 45, 
  ranking = 12, 
  energy = 75 
}: QuickStatsBarProps) {
  const stats = [
    {
      icon: Star,
      label: "XP Total",
      value: points.toLocaleString(),
      color: "hsl(var(--phase-despertar))"
    },
    {
      icon: Calendar,
      label: "Dias",
      value: days.toString(),
      color: "hsl(var(--primary))"
    },
    {
      icon: Trophy,
      label: "Ranking",
      value: `#${ranking}`,
      color: "hsl(var(--phase-desfrutar))"
    },
    {
      icon: Zap,
      label: "Energia",
      value: `${energy}%`,
      color: "hsl(var(--phase-deslanchar))"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:shadow-md transition-all"
        >
          <div 
            className="h-9 w-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${stat.color}15` }}
          >
            <stat.icon 
              className="h-4 w-4" 
              style={{ color: stat.color }}
            />
          </div>
          <div>
            <p 
              className="text-lg font-bold leading-none"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
