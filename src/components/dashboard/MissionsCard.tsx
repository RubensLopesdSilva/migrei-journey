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
    <div className="bg-card border border-border rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Missões do dia</h3>
            <p className="text-xs text-muted-foreground">
              {completedCount}/{dailyMissions.length} completas • +{earnedXP}/{totalXP} XP
            </p>
          </div>
        </div>
        <Link 
          to="/progresso"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Missions List */}
      <div className="space-y-2">
        {dailyMissions.map((mission) => (
          <div 
            key={mission.id}
            className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
              mission.completed 
                ? 'bg-primary/5' 
                : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {mission.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={`text-sm ${
                mission.completed 
                  ? 'text-muted-foreground line-through' 
                  : 'text-foreground'
              }`}>
                {mission.title}
              </span>
            </div>
            <span className={`text-xs font-medium ${
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
