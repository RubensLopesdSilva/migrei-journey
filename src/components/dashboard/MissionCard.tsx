import { Target, CheckCircle2 } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  completed: boolean;
}

const dailyChallenges: Challenge[] = [
  { id: "1", title: "Atualizar perfil LinkedIn", completed: true },
  { id: "2", title: "Ler artigo sobre transição", completed: false },
  { id: "3", title: "Fazer 1 conexão nova", completed: false },
];

export function MissionCard() {
  const completedCount = dailyChallenges.filter(c => c.completed).length;

  return (
    <div className="card-elevated p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Missão do dia</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Complete {dailyChallenges.length} desafios
      </p>

      <div className="space-y-3">
        {dailyChallenges.map((challenge) => (
          <div 
            key={challenge.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <CheckCircle2 
              className={`h-5 w-5 ${
                challenge.completed 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}
            />
            <span className={`text-sm ${
              challenge.completed 
                ? 'text-muted-foreground line-through' 
                : 'text-foreground'
            }`}>
              {challenge.title}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium text-primary">
            {completedCount}/{dailyChallenges.length}
          </span>
        </div>
      </div>
    </div>
  );
}
