import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Clock, 
  BarChart3, 
  AlertCircle,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PhaseWithProgress, UserProgress } from "@/types/progress";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface ProgressAnalyticsProps {
  phases: PhaseWithProgress[];
  userProgress: UserProgress | null;
}

export function ProgressAnalytics({ 
  phases, 
  userProgress
}: ProgressAnalyticsProps) {
  const currentPhase = phases.find(p => p.id === userProgress?.current_phase_id);
  const completedPhases = phases.filter(p => p.userProgress?.status === 'completed');
  const daysInJourney = userProgress?.journey_started_at 
    ? differenceInDays(new Date(), new Date(userProgress.journey_started_at))
    : 0;

  const averageDaysPerPhase = completedPhases.length > 0 
    ? Math.round(daysInJourney / completedPhases.length)
    : null;

  const platformAverageDays = 14;

  const isAheadOfSchedule = averageDaysPerPhase 
    ? averageDaysPerPhase < platformAverageDays 
    : null;

  const daysInCurrentPhase = currentPhase?.userProgress?.started_at
    ? differenceInDays(new Date(), new Date(currentPhase.userProgress.started_at))
    : 0;

  const generateInsight = () => {
    if (!currentPhase) return null;

    if (daysInCurrentPhase > platformAverageDays) {
      return {
        type: 'warning',
        message: `${daysInCurrentPhase}d na Fase ${currentPhase.phase_number}. Revise atividades.`
      };
    }

    if (currentPhase.userProgress?.progress_percentage && currentPhase.userProgress.progress_percentage > 70) {
      return {
        type: 'success',
        message: `${100 - currentPhase.userProgress.progress_percentage}% para próxima fase!`
      };
    }

    return {
      type: 'info',
      message: `Complete as atividades para avançar.`
    };
  };

  const insight = generateInsight();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base">Análise</CardTitle>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              {completedPhases.length}/6
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Clock className="h-3 w-3" />
                <span className="text-[10px]">Dias</span>
              </div>
              <p className="text-lg font-bold">{daysInJourney}</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[10px]">Média</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <p className="text-lg font-bold">{averageDaysPerPhase || '-'}</p>
                {averageDaysPerPhase && <span className="text-xs text-muted-foreground">d</span>}
                {isAheadOfSchedule !== null && (
                  isAheadOfSchedule ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-orange-500" />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Phase Progress - Compact */}
          <div className="space-y-2">
            {phases.slice(0, 4).map(phase => {
              const progress = phase.userProgress?.progress_percentage || 0;
              const isLocked = phase.userProgress?.status === 'locked';
              const isCurrent = phase.id === userProgress?.current_phase_id;

              return (
                <div key={phase.id} className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ 
                      backgroundColor: isLocked ? '#6B7280' : phase.color || '#3B82F6' 
                    }}
                  >
                    {phase.phase_number}
                  </div>
                  <Progress 
                    value={isLocked ? 0 : progress} 
                    className={cn("h-1.5 flex-1", isLocked && "opacity-30")}
                  />
                  <span className={cn(
                    "text-[10px] tabular-nums w-8 text-right",
                    isLocked ? 'text-muted-foreground' : 'font-medium'
                  )}>
                    {isLocked ? '—' : `${progress}%`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Insight */}
          {insight && (
            <div 
              className={cn(
                "p-2.5 rounded-lg border flex items-center gap-2",
                insight.type === 'warning' && 'bg-amber-500/10 border-amber-200',
                insight.type === 'success' && 'bg-green-500/10 border-green-200',
                insight.type === 'info' && 'bg-primary/5 border-primary/20'
              )}
            >
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                insight.type === 'warning' && 'bg-amber-500',
                insight.type === 'success' && 'bg-green-500',
                insight.type === 'info' && 'bg-primary'
              )}>
                <Lightbulb className="h-3 w-3 text-white" />
              </div>
              <p className="text-xs text-muted-foreground">{insight.message}</p>
            </div>
          )}

          {/* Comparison */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Seu ritmo</span>
              <span className={cn(
                "font-medium",
                isAheadOfSchedule ? 'text-green-600' : 'text-orange-600'
              )}>
                {isAheadOfSchedule 
                  ? `${platformAverageDays - (averageDaysPerPhase || 0)}d mais rápido`
                  : averageDaysPerPhase 
                    ? `${(averageDaysPerPhase || 0) - platformAverageDays}d mais lento`
                    : 'Calculando...'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
