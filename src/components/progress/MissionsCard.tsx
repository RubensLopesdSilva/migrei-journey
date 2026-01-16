import { motion } from "framer-motion";
import { 
  Target, 
  Check, 
  ChevronRight,
  Zap,
  Calendar,
  Flag,
  Sparkles,
  Flame
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mission, UserMission, MissionType } from "@/types/progress";
import { cn } from "@/lib/utils";

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

const difficultyFlames: Record<MissionType, number> = {
  daily: 1,
  weekly: 2,
  phase: 2,
  special: 3,
};

export function MissionsCard({ missions, userMissions, currentPhaseId }: MissionsCardProps) {
  // Filter and sort missions
  const activeMissions = missions.filter(m => {
    if (m.phase_id && m.phase_id !== currentPhaseId) return false;
    return true;
  }).slice(0, 4); // Show max 4 missions

  const getMissionProgress = (missionId: string): UserMission | undefined => {
    return userMissions.find(um => um.mission_id === missionId);
  };

  const completedCount = userMissions.filter(um => um.is_completed).length;
  const totalXP = activeMissions.reduce((acc, m) => {
    const userMission = getMissionProgress(m.id);
    return acc + (userMission?.is_completed ? m.xp_reward : 0);
  }, 0);
  const potentialXP = activeMissions.reduce((acc, m) => acc + m.xp_reward, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base">Missões</CardTitle>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              {totalXP}/{potentialXP}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progresso</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{completedCount}/{activeMissions.length}</span>
                {completedCount === activeMissions.length && activeMissions.length > 0 && (
                  <Badge className="bg-green-500 h-5 gap-1">
                    <Check className="h-3 w-3" />
                    Completo!
                  </Badge>
                )}
              </div>
            </div>
            <Progress 
              value={activeMissions.length > 0 ? (completedCount / activeMissions.length) * 100 : 0} 
              className="h-1.5"
            />
          </div>

          {/* Missions List */}
          <div className="space-y-2">
            {activeMissions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Target className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Sem missões no momento</p>
              </div>
            ) : (
              activeMissions.map((mission, index) => {
                const userMission = getMissionProgress(mission.id);
                const isCompleted = userMission?.is_completed;
                const progress = userMission ? (userMission.progress / userMission.target) * 100 : 0;
                const Icon = missionTypeIcons[mission.mission_type];
                const flames = difficultyFlames[mission.mission_type];

                return (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={cn(
                      "flex items-center gap-3 p-2.5 rounded-lg border transition-colors",
                      isCompleted 
                        ? "bg-green-500/5 border-green-500/30" 
                        : "hover:bg-muted/50"
                    )}>
                      {/* Status indicator */}
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        isCompleted 
                          ? "bg-green-500 text-white" 
                          : "bg-muted"
                      )}>
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs">
                            {Array(flames).fill('🔥').join('')}
                          </span>
                          <Badge variant="secondary" className="text-xs h-4 px-1">
                            +{mission.xp_reward}
                          </Badge>
                        </div>
                        <p className={cn(
                          "text-sm font-medium leading-tight",
                          isCompleted && "line-through text-muted-foreground"
                        )}>
                          {mission.title}
                        </p>
                        
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

                      {!isCompleted && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
