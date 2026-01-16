import { 
  Target, 
  Clock, 
  Check, 
  ChevronRight,
  Zap,
  Calendar,
  Flag,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mission, UserMission, MissionType } from "@/types/progress";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MissionsCardProps {
  missions: Mission[];
  userMissions: UserMission[];
  currentPhaseId: string | null;
}

const missionTypeIcons: Record<MissionType, React.ElementType> = {
  daily: Calendar,
  weekly: Target,
  phase: Flag,
  special: Sparkles,
};

const missionTypeLabels: Record<MissionType, string> = {
  daily: 'Diária',
  weekly: 'Semanal',
  phase: 'Fase',
  special: 'Especial',
};

const missionTypeColors: Record<MissionType, string> = {
  daily: 'bg-blue-500',
  weekly: 'bg-purple-500',
  phase: 'bg-green-500',
  special: 'bg-amber-500',
};

export function MissionsCard({ missions, userMissions, currentPhaseId }: MissionsCardProps) {
  // Filter and sort missions
  const activeMissions = missions.filter(m => {
    // Phase missions should only show for current phase
    if (m.phase_id && m.phase_id !== currentPhaseId) return false;
    return true;
  });

  const getMissionProgress = (missionId: string): UserMission | undefined => {
    return userMissions.find(um => um.mission_id === missionId);
  };

  const completedCount = userMissions.filter(um => um.is_completed).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Missões
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Check className="h-3 w-3" />
            {completedCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeMissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Sem missões no momento</p>
            <p className="text-sm">Em breve teremos novidades!</p>
          </div>
        ) : (
          activeMissions.map(mission => {
            const userMission = getMissionProgress(mission.id);
            const isCompleted = userMission?.is_completed;
            const progress = userMission ? (userMission.progress / userMission.target) * 100 : 0;
            const Icon = missionTypeIcons[mission.mission_type];
            const typeColor = missionTypeColors[mission.mission_type];

            return (
              <div
                key={mission.id}
                className={cn(
                  "p-4 rounded-xl border transition-all",
                  isCompleted 
                    ? "bg-green-500/5 border-green-200" 
                    : "bg-card hover:bg-muted/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                      isCompleted ? "bg-green-500" : typeColor
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <Icon className="h-5 w-5 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-medium",
                        isCompleted && "text-green-700"
                      )}>
                        {mission.title}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className="text-[10px] px-1.5 py-0"
                      >
                        {missionTypeLabels[mission.mission_type]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {mission.description}
                    </p>

                    {/* Progress */}
                    {!isCompleted && userMission && (
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {userMission.progress}/{userMission.target}
                          </span>
                          <span className="font-medium text-primary">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    )}

                    {/* Expiration */}
                    {!isCompleted && userMission?.expires_at && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Expira {formatDistanceToNow(new Date(userMission.expires_at), { 
                          addSuffix: true,
                          locale: ptBR 
                        })}
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-primary font-medium">
                      <Zap className="h-4 w-4" />
                      {mission.xp_reward} XP
                    </div>
                    {mission.badge_id && (
                      <span className="text-xs text-muted-foreground">
                        + Badge
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* View all missions button */}
        {activeMissions.length > 0 && (
          <Button variant="ghost" className="w-full gap-2">
            Ver todas
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
