import { Calendar, Award } from "lucide-react";

export function RightStatsCards() {
  return (
    <div className="flex items-center gap-3">
      {/* Dias seguidos */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5 flex items-center gap-3 hover:border-primary/40 transition-all duration-300 animate-fade-in">
        <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center">
          <Calendar className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <span className="text-xl font-bold text-primary leading-none block">7</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">dias seguidos</p>
        </div>
      </div>

      {/* Badge conquistada */}
      <div className="bg-card border border-border rounded-2xl px-4 py-2.5 flex items-center gap-3 hover:border-accent/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center">
          <Award className="h-4.5 w-4.5 text-accent" />
        </div>
        <div>
          <span className="text-sm font-semibold text-foreground leading-none block">Primeira Semana</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">próxima conquista</p>
        </div>
      </div>
    </div>
  );
}
