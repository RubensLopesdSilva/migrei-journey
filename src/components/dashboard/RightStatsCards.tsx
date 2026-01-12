import { Calendar, Award } from "lucide-react";

export function RightStatsCards() {
  return (
    <div className="flex items-center gap-3">
      {/* Dias seguidos */}
      <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl px-5 py-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-primary leading-none">7</span>
          <p className="text-xs text-muted-foreground mt-0.5">dias seguidos</p>
        </div>
      </div>

      {/* Badge conquistada */}
      <div className="bg-card border border-border rounded-2xl px-5 py-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Award className="h-5 w-5 text-accent" />
        </div>
        <div>
          <span className="text-sm font-semibold text-foreground leading-none">Primeira Semana</span>
          <p className="text-xs text-muted-foreground mt-0.5">próxima conquista</p>
        </div>
      </div>
    </div>
  );
}
