import { Target, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Mission {
  id: string;
  title: string;
  completed: boolean;
  xp: number;
}

const dailyMissions: Mission[] = [
  { id: "1", title: "Atualizar perfil LinkedIn", completed: true, xp: 15 },
  { id: "2", title: "Ler artigo sobre transição", completed: false, xp: 10 },
  { id: "3", title: "Fazer 1 conexão nova", completed: false, xp: 20 },
  { id: "4", title: "Completar lição da fase", completed: false, xp: 25 },
];

export function MissionsCard() {
  const completedCount = dailyMissions.filter(m => m.completed).length;
  const totalXP = dailyMissions.reduce((acc, m) => acc + m.xp, 0);
  const earnedXP = dailyMissions.filter(m => m.completed).reduce((acc, m) => acc + m.xp, 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Missões do dia</h3>
            <p className="text-[10px] text-muted-foreground">
              {completedCount}/{dailyMissions.length} completas • +{earnedXP}/{totalXP} XP
            </p>
          </div>
        </div>
        <Link 
          to="/progresso"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Missions List */}
      <div className="space-y-1.5">
        {dailyMissions.map((mission) => (
          <div 
            key={mission.id}
            className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer ${
              mission.completed 
                ? 'bg-primary/5' 
                : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-2">
              {mission.completed ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={`text-xs ${
                mission.completed 
                  ? 'text-muted-foreground line-through' 
                  : 'text-foreground'
              }`}>
                {mission.title}
              </span>
            </div>
            <span className={`text-[10px] font-medium ${
              mission.completed ? 'text-primary' : 'text-muted-foreground'
            }`}>
              +{mission.xp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
