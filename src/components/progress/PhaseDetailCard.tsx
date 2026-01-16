import { 
  ChevronRight, 
  Clock, 
  Check, 
  Lock, 
  Play,
  BookOpen,
  FileQuestion,
  Dumbbell,
  MessageSquare,
  Flag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PhaseWithProgress, PhaseActivity, ActivityType } from "@/types/progress";
import { cn } from "@/lib/utils";

interface PhaseDetailCardProps {
  phase: PhaseWithProgress;
  completedActivities: string[];
  onStartPhase?: () => void;
}

const activityIcons: Record<ActivityType, React.ElementType> = {
  lesson: BookOpen,
  exercise: Dumbbell,
  checkpoint: Flag,
  quiz: FileQuestion,
  reflection: MessageSquare,
};

const activityLabels: Record<ActivityType, string> = {
  lesson: 'Lição',
  exercise: 'Exercício',
  checkpoint: 'Checkpoint',
  quiz: 'Quiz',
  reflection: 'Reflexão',
};

const phaseColors: Record<number, string> = {
  1: "#F59E0B",
  2: "#8B5CF6",
  3: "#3B82F6",
  4: "#10B981",
  5: "#F97316",
  6: "#EAB308",
};

export function PhaseDetailCard({ 
  phase, 
  completedActivities,
  onStartPhase 
}: PhaseDetailCardProps) {
  const isLocked = phase.userProgress?.status === 'locked';
  const isCompleted = phase.userProgress?.status === 'completed';
  const isInProgress = phase.userProgress?.status === 'in_progress';
  const isAvailable = phase.userProgress?.status === 'available';
  const progress = phase.userProgress?.progress_percentage || 0;
  const color = phaseColors[phase.phase_number];

  const sortedActivities = [...phase.activities].sort((a, b) => a.sort_order - b.sort_order);
  const checkpoints = sortedActivities.filter(a => a.is_checkpoint);
  const regularActivities = sortedActivities.filter(a => !a.is_checkpoint);

  return (
    <Card className={cn(
      "transition-all duration-300",
      isLocked && "opacity-60",
      isInProgress && "ring-2 ring-primary/30"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: isLocked ? '#6B7280' : color }}
            >
              {phase.phase_number}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {phase.name}
                {isCompleted && (
                  <Badge className="bg-green-500/10 text-green-600 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Concluída
                  </Badge>
                )}
                {isInProgress && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Play className="h-3 w-3 mr-1" />
                    Em andamento
                  </Badge>
                )}
                {isLocked && (
                  <Badge variant="secondary">
                    <Lock className="h-3 w-3 mr-1" />
                    Bloqueada
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{phase.description}</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {!isLocked && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {phase.completedActivities} de {phase.totalActivities} atividades
              </span>
              <span className="font-medium" style={{ color }}>
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Objective */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-1">Objetivo</h4>
          <p className="text-sm text-muted-foreground">{phase.objective}</p>
        </div>

        {/* Level Info */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold">{phase.phase_number}</span>
          </div>
          <div>
            <p className="font-medium text-sm">Nível: {phase.level_name}</p>
            <p className="text-xs text-muted-foreground">{phase.level_description}</p>
          </div>
        </div>

        {/* Checkpoints */}
        {checkpoints.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Flag className="h-4 w-4 text-primary" />
              Obrigatórios
            </h4>
            <div className="space-y-2">
              {checkpoints.map((activity) => {
                const isActivityCompleted = completedActivities.includes(activity.id);
                return (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    isCompleted={isActivityCompleted}
                    isLocked={isLocked}
                    color={color}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Activities */}
        <div>
          <h4 className="font-medium text-sm mb-3">Atividades</h4>
          <div className="space-y-2">
            {regularActivities.map((activity) => {
              const isActivityCompleted = completedActivities.includes(activity.id);
              return (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  isCompleted={isActivityCompleted}
                  isLocked={isLocked}
                  color={color}
                />
              );
            })}
          </div>
        </div>

        {/* Start Phase Button */}
        {isAvailable && (
          <Button 
            className="w-full"
            size="lg"
            onClick={onStartPhase}
            style={{ backgroundColor: color }}
          >
            Começar
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}

        {/* XP Info */}
        <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
          <span className="text-muted-foreground">XP</span>
          <span className="font-bold" style={{ color }}>
            {phase.userProgress?.xp_earned || 0} / {phase.xp_to_complete} XP
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityItemProps {
  activity: PhaseActivity;
  isCompleted: boolean;
  isLocked: boolean;
  color: string;
}

function ActivityItem({ activity, isCompleted, isLocked, color }: ActivityItemProps) {
  const Icon = activityIcons[activity.activity_type];

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all",
        isCompleted && "bg-green-500/5 border-green-200",
        !isCompleted && !isLocked && "bg-card",
        isLocked && "opacity-50"
      )}
    >
      <div 
        className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
          isCompleted ? "bg-green-500" : "bg-muted"
        )}
        style={{ backgroundColor: isCompleted ? '#10B981' : undefined }}
      >
        {isCompleted ? (
          <Check className="h-4 w-4 text-white" />
        ) : (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn(
            "font-medium text-sm truncate",
            isCompleted && "text-green-700"
          )}>
            {activity.title}
          </p>
          {activity.is_required && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              Obrigatório
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {activityLabels[activity.activity_type]}
          </span>
          {activity.estimated_minutes && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.estimated_minutes} min
            </span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <span 
          className="text-sm font-medium"
          style={{ color: isCompleted ? '#10B981' : color }}
        >
          +{activity.xp_reward} XP
        </span>
      </div>
    </div>
  );
}
