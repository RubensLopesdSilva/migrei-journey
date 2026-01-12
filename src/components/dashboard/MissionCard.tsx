import { Target, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

interface Challenge {
  id: string;
  title: string;
  completed: boolean;
  xp: number;
}

const dailyChallenges: Challenge[] = [
  { id: "1", title: "Atualizar perfil LinkedIn", completed: true, xp: 15 },
  { id: "2", title: "Ler artigo sobre transição", completed: false, xp: 10 },
  { id: "3", title: "Fazer 1 conexão nova", completed: false, xp: 20 },
  { id: "4", title: "Completar lição da fase", completed: false, xp: 25 },
];

export function MissionCard() {
  const completedCount = dailyChallenges.filter(c => c.completed).length;
  const totalXP = dailyChallenges.reduce((acc, c) => acc + c.xp, 0);
  const earnedXP = dailyChallenges.filter(c => c.completed).reduce((acc, c) => acc + c.xp, 0);
  const progressPercent = (completedCount / dailyChallenges.length) * 100;

  return (
    <div className="card-elevated h-full p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Missões do dia</h3>
            <p className="text-xs text-muted-foreground">
              +{earnedXP}/{totalXP} XP disponível
            </p>
          </div>
        </div>
        <Link 
          to="/progresso"
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          Ver todas
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">{completedCount} de {dailyChallenges.length} completas</span>
          <span className="font-medium text-primary">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>
      
      {/* Challenges - Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {dailyChallenges.map((challenge) => (
          <div 
            key={challenge.id}
            className={`flex-shrink-0 w-44 p-3 rounded-xl border transition-all cursor-pointer group ${
              challenge.completed 
                ? 'bg-primary/5 border-primary/20' 
                : 'bg-muted/30 border-border hover:border-primary/30 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {challenge.completed ? (
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-tight ${
                  challenge.completed 
                    ? 'text-muted-foreground line-through' 
                    : 'text-foreground'
                }`}>
                  {challenge.title}
                </p>
                <p className={`text-[10px] mt-1 font-medium ${
                  challenge.completed ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  +{challenge.xp} XP
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
