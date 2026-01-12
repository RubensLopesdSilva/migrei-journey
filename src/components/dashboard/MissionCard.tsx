import { Target, CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
];

export function MissionCard() {
  const completedCount = dailyChallenges.filter(c => c.completed).length;
  const progressPercent = (completedCount / dailyChallenges.length) * 100;

  return (
    <div className="card-elevated h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Target className="h-4.5 w-4.5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-foreground">Missões do dia</h3>
            <p className="text-[10px] text-muted-foreground">
              {completedCount}/{dailyChallenges.length} completas
            </p>
          </div>
        </div>
        <Progress value={progressPercent} className="h-1.5 mt-3" />
      </div>
      
      {/* Challenges */}
      <div className="p-3 flex-1 space-y-1.5">
        {dailyChallenges.map((challenge) => (
          <div 
            key={challenge.id}
            className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all cursor-pointer group ${
              challenge.completed 
                ? 'bg-primary/5' 
                : 'hover:bg-muted'
            }`}
          >
            {challenge.completed ? (
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            )}
            <span className={`flex-1 text-xs leading-tight ${
              challenge.completed 
                ? 'text-muted-foreground line-through' 
                : 'text-foreground'
            }`}>
              {challenge.title}
            </span>
            <span className={`text-[10px] font-medium ${
              challenge.completed ? 'text-primary' : 'text-muted-foreground'
            }`}>
              +{challenge.xp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
