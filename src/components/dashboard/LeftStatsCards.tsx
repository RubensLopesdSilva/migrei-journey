import { TrendingUp, Zap, Flame } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color: string;
  progress?: number;
}

function StatCard({ icon: Icon, value, label, color, progress }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
      <div 
        className="h-9 w-9 rounded-xl flex items-center justify-center mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-4.5 w-4.5" style={{ color }} />
      </div>
      <span className="text-2xl font-bold text-foreground leading-tight">{value}</span>
      {progress !== undefined && (
        <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${progress}%`,
              backgroundColor: color 
            }}
          />
        </div>
      )}
      <span className="text-xs text-muted-foreground mt-1.5 leading-tight">{label}</span>
    </div>
  );
}

export function LeftStatsCards() {
  return (
    <div className="flex flex-col gap-3 w-32">
      <StatCard 
        icon={TrendingUp} 
        value="60%" 
        label="Progresso semanal" 
        color="hsl(var(--primary))"
        progress={60}
      />
      <StatCard 
        icon={Zap} 
        value="75%" 
        label="Energia" 
        color="hsl(var(--phase-descobrir))"
        progress={75}
      />
      <StatCard 
        icon={Flame} 
        value="30" 
        label="Pontos XP" 
        color="hsl(var(--phase-despertar))"
      />
    </div>
  );
}
