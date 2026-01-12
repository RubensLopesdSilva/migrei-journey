import { TrendingUp, Zap, Flame } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color: string;
  progress?: number;
  delay?: number;
}

function StatCard({ icon: Icon, value, label, color, progress, delay = 0 }: StatCardProps) {
  return (
    <div 
      className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-primary/20 hover:shadow-md transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div 
        className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <span className="text-2xl font-bold text-foreground leading-none">{value}</span>
      {progress !== undefined && (
        <div className="w-full h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ 
              width: `${progress}%`,
              backgroundColor: color 
            }}
          />
        </div>
      )}
      <span className="text-[11px] text-muted-foreground mt-2 leading-tight font-medium">{label}</span>
    </div>
  );
}

export function LeftStatsCards() {
  return (
    <div className="flex flex-col gap-3 w-[140px]">
      <StatCard 
        icon={TrendingUp} 
        value="60%" 
        label="Progresso semanal" 
        color="hsl(var(--primary))"
        progress={60}
        delay={0}
      />
      <StatCard 
        icon={Zap} 
        value="75%" 
        label="Energia" 
        color="hsl(var(--phase-descobrir))"
        progress={75}
        delay={100}
      />
      <StatCard 
        icon={Flame} 
        value="30" 
        label="Pontos XP" 
        color="hsl(var(--phase-despertar))"
        delay={200}
      />
    </div>
  );
}
