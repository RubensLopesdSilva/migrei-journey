import { motion } from "framer-motion";
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
import { Card, CardContent } from "@/components/ui/card";
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
  }).slice(0, 3); // Show max 3 missions

  const getMissionProgress = (missionId: string): UserMission | undefined => {
    return userMissions.find(um => um.mission_id === missionId);
  };

  const completedCount = userMissions.filter(um => um.is_completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-bold text-base">Missões</h3>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" />
              {completedCount}
            </Badge>
          </div>

          {/* Missions List */}
          <div className="space-y-3">
            {activeMissions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Target className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Sem missões no momento</p>
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
                    "p-3 rounded-lg border transition-all",
                    isCompleted 
                      ? "bg-green-500/5 border-green-200" 
                      : "bg-muted/30 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div 
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                        isCompleted ? "bg-green-500" : typeColor
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <Icon className="h-4 w-4 text-white" />
                      )}
                    </div>
                  
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className={cn(
                          "font-medium text-sm truncate",
                          isCompleted && "text-green-700"
                        )}>
                          {mission.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className="text-[10px] px-1.5 py-0 shrink-0"
                        >
                          {missionTypeLabels[mission.mission_type]}
                        </Badge>
                      </div>

                      {/* Progress - Compact */}
                      {!isCompleted && userMission && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <Progress value={progress} className="h-1 flex-1" />
                          <span className="text-[10px] text-muted-foreground tabular-nums">
                            {userMission.progress}/{userMission.target}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* XP Badge */}
                    <div className="shrink-0">
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Zap className="h-3 w-3" />
                        {mission.xp_reward}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          </div>

          {/* View all button */}
          {activeMissions.length > 0 && (
            <Button variant="ghost" size="sm" className="w-full mt-3 gap-1">
              Ver todas
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
