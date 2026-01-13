import { Target, CheckCircle2, Circle, ArrowRight } from "lucide-react";
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
  const totalXP = dailyChallenges.filter(c => c.completed).reduce((acc, c) => acc + c.xp, 0);
  const potentialXP = dailyChallenges.reduce((acc, c) => acc + c.xp, 0);
  const progressPercent = (completedCount / dailyChallenges.length) * 100;

  return (
    <div className="card-elevated overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Missões do dia</h3>
              <p className="text-xs text-muted-foreground">
                {completedCount}/{dailyChallenges.length} completas • +{totalXP}/{potentialXP} XP
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
        
        {/* Progress bar */}
        <div className="mt-4">
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>
      
      {/* Challenges list */}
      <div className="p-4 space-y-2">
        {dailyChallenges.map((challenge) => (
          <div 
            key={challenge.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
              challenge.completed 
                ? 'bg-primary/5 hover:bg-primary/10' 
                : 'hover:bg-muted'
            }`}
          >
            {challenge.completed ? (
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            )}
            <span className={`flex-1 text-sm ${
              challenge.completed 
                ? 'text-muted-foreground line-through' 
                : 'text-foreground'
            }`}>
              {challenge.title}
            </span>
            <span className={`text-xs font-medium ${
              challenge.completed 
                ? 'text-primary' 
                : 'text-muted-foreground'
            }`}>
              +{challenge.xp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
