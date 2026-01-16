import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Clock, 
  BarChart3, 
  AlertCircle,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PhaseWithProgress, UserProgress, XpTransaction } from "@/types/progress";
import { differenceInDays } from "date-fns";

interface ProgressAnalyticsProps {
  phases: PhaseWithProgress[];
  userProgress: UserProgress | null;
  xpTransactions?: XpTransaction[];
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

  // Calculate average time per phase
  const averageDaysPerPhase = completedPhases.length > 0 
    ? Math.round(daysInJourney / completedPhases.length)
    : null;

  // Platform average (mock data - would come from backend)
  const platformAverageDays = 14;

  // Find bottleneck phase (most time spent)
  const phaseWithMostTime = phases.reduce((max, phase) => {
    const time = phase.userProgress?.time_spent_minutes || 0;
    return time > (max?.userProgress?.time_spent_minutes || 0) ? phase : max;
  }, phases[0]);

  // Calculate if user is ahead or behind
  const isAheadOfSchedule = averageDaysPerPhase 
    ? averageDaysPerPhase < platformAverageDays 
    : null;

  // Days in current phase
  const daysInCurrentPhase = currentPhase?.userProgress?.started_at
    ? differenceInDays(new Date(), new Date(currentPhase.userProgress.started_at))
    : 0;

  // Generate insight message
  const generateInsight = () => {
    if (!currentPhase) return null;

    if (daysInCurrentPhase > platformAverageDays) {
      return {
        type: 'warning',
        message: `${daysInCurrentPhase} dias na Fase ${currentPhase.phase_number}. Revise as atividades pendentes.`
      };
    }

    if (currentPhase.userProgress?.progress_percentage && currentPhase.userProgress.progress_percentage > 70) {
      return {
        type: 'success',
        message: `${100 - currentPhase.userProgress.progress_percentage}% para concluir a Fase ${currentPhase.phase_number}. Continue!`
      };
    }

    return {
      type: 'info',
      message: `Fase ${currentPhase.phase_number}: ${currentPhase.name}. Complete as atividades para avançar.`
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
        <CardContent className="p-5 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-bold text-base">Análise</h3>
          </div>
          {/* Stats Grid - Compact */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs">Dias</span>
              </div>
              <p className="text-xl font-bold">{daysInJourney}</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs">Média/fase</span>
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-xl font-bold">
                  {averageDaysPerPhase || '-'}
                </p>
                {averageDaysPerPhase && (
                  <span className="text-xs text-muted-foreground">d</span>
                )}
                {isAheadOfSchedule !== null && (
                  isAheadOfSchedule ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-orange-500" />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Phase Progress - Compact */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Por fase</h4>
            <div className="space-y-2">
              {phases.map(phase => {
                const progress = phase.userProgress?.progress_percentage || 0;
                const isLocked = phase.userProgress?.status === 'locked';
                const isCurrent = phase.id === userProgress?.current_phase_id;

                return (
                  <div key={phase.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={isLocked ? 'text-muted-foreground' : 'text-foreground'}>
                        {phase.phase_number}. {phase.name}
                        {isCurrent && (
                          <Badge variant="secondary" className="ml-1.5 text-[10px] px-1 py-0">
                            Atual
                          </Badge>
                        )}
                      </span>
                      <span className={isLocked ? 'text-muted-foreground' : 'font-medium tabular-nums'}>
                        {isLocked ? '—' : `${progress}%`}
                      </span>
                    </div>
                    <Progress 
                      value={isLocked ? 0 : progress} 
                      className={`h-1.5 ${isLocked ? 'opacity-30' : ''}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottleneck Alert - Compact */}
          {phaseWithMostTime && (phaseWithMostTime.userProgress?.time_spent_minutes || 0) > 60 && (
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm text-orange-700">Atenção</p>
                  <p className="text-xs text-orange-600">
                    Fase {phaseWithMostTime.phase_number} está levando mais tempo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Coach Insight - Compact */}
          {insight && (
            <div 
              className={`p-3 rounded-lg border ${
                insight.type === 'warning' 
                  ? 'bg-amber-500/10 border-amber-200' 
                  : insight.type === 'success'
                    ? 'bg-green-500/10 border-green-200'
                    : 'bg-primary/5 border-primary/20'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                  insight.type === 'warning' 
                    ? 'bg-amber-500' 
                    : insight.type === 'success'
                      ? 'bg-green-500'
                      : 'bg-primary'
                }`}>
                  <Lightbulb className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-xs mb-0.5">💡 Dica</p>
                  <p className="text-xs text-muted-foreground">
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Comparison - Compact */}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Seu ritmo vs média
              </span>
              <span className={`font-medium ${
                isAheadOfSchedule ? 'text-green-600' : 'text-orange-600'
              }`}>
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
