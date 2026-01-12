import { 
  TrendingUp, 
  Clock, 
  BarChart3, 
  AlertCircle,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
        message: `Você está há ${daysInCurrentPhase} dias na Fase ${currentPhase.phase_number}. Usuários que avançam com mais clareza costumam concluir esta fase em ${platformAverageDays} dias. Que tal revisar as atividades pendentes?`
      };
    }

    if (currentPhase.userProgress?.progress_percentage && currentPhase.userProgress.progress_percentage > 70) {
      return {
        type: 'success',
        message: `Excelente progresso! Você está a ${100 - currentPhase.userProgress.progress_percentage}% de concluir a Fase ${currentPhase.phase_number}. Continue assim!`
      };
    }

    return {
      type: 'info',
      message: `Você está na Fase ${currentPhase.phase_number}: ${currentPhase.name}. Complete as atividades para desbloquear a próxima fase da sua jornada.`
    };
  };

  const insight = generateInsight();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Análise de Progresso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Dias na jornada</span>
            </div>
            <p className="text-2xl font-bold">{daysInJourney}</p>
          </div>

          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Média por fase</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">
                {averageDaysPerPhase || '-'}
              </p>
              {averageDaysPerPhase && (
                <span className="text-sm text-muted-foreground">dias</span>
              )}
              {isAheadOfSchedule !== null && (
                isAheadOfSchedule ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-orange-500" />
                )
              )}
            </div>
          </div>
        </div>

        {/* Phase Progress Bars */}
        <div>
          <h4 className="text-sm font-medium mb-3">Progresso por Fase</h4>
          <div className="space-y-3">
            {phases.map(phase => {
              const progress = phase.userProgress?.progress_percentage || 0;
              const isLocked = phase.userProgress?.status === 'locked';
              const isCurrent = phase.id === userProgress?.current_phase_id;

              return (
                <div key={phase.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className={isLocked ? 'text-muted-foreground' : 'text-foreground'}>
                      {phase.phase_number}. {phase.name}
                      {isCurrent && (
                        <span className="text-primary ml-2">(atual)</span>
                      )}
                    </span>
                    <span className={isLocked ? 'text-muted-foreground' : 'font-medium'}>
                      {isLocked ? 'Bloqueada' : `${progress}%`}
                    </span>
                  </div>
                  <Progress 
                    value={isLocked ? 0 : progress} 
                    className={`h-2 ${isLocked ? 'opacity-30' : ''}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottleneck Alert */}
        {phaseWithMostTime && (phaseWithMostTime.userProgress?.time_spent_minutes || 0) > 60 && (
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-orange-700">Gargalo Detectado</p>
                <p className="text-sm text-orange-600">
                  A Fase {phaseWithMostTime.phase_number} ({phaseWithMostTime.name}) está demandando mais tempo. 
                  Considere revisar as atividades ou pedir ajuda na mentoria.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Coach Insight */}
        {insight && (
          <div 
            className={`p-4 rounded-xl border ${
              insight.type === 'warning' 
                ? 'bg-amber-500/10 border-amber-200' 
                : insight.type === 'success'
                  ? 'bg-green-500/10 border-green-200'
                  : 'bg-primary/5 border-primary/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                insight.type === 'warning' 
                  ? 'bg-amber-500' 
                  : insight.type === 'success'
                    ? 'bg-green-500'
                    : 'bg-primary'
              }`}>
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm mb-1">
                  💡 Insight do Coach Migrei
                </p>
                <p className="text-sm text-muted-foreground">
                  {insight.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison with Platform */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Seu ritmo vs média da plataforma
            </span>
            <span className={`font-medium ${
              isAheadOfSchedule ? 'text-green-600' : 'text-orange-600'
            }`}>
              {isAheadOfSchedule 
                ? `${platformAverageDays - (averageDaysPerPhase || 0)} dias mais rápido`
                : averageDaysPerPhase 
                  ? `${(averageDaysPerPhase || 0) - platformAverageDays} dias mais lento`
                  : 'Calculando...'
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
