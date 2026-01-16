import { motion } from "framer-motion";
import { Play, ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MigreiPhase } from "@/types/progress";
import { cn } from "@/lib/utils";

interface CurrentPhaseCardProps {
  phase: MigreiPhase;
  progressPercentage: number;
  onContinue: () => void;
}

export function CurrentPhaseCard({ phase, progressPercentage, onContinue }: CurrentPhaseCardProps) {
  const isCompleted = progressPercentage >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300",
        isCompleted 
          ? "border-green-500/50 bg-green-500/5" 
          : "border-primary/20 bg-primary/5 hover:border-primary/30"
      )}>
        <CardContent className="p-5">
          {/* Header Row - Same pattern as WeeklyMission */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: phase.color || '#3B82F6' }}
              >
                {phase.phase_number}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Fase atual
                  </span>
                  <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20">
                    <Play className="h-3 w-3 mr-1" />
                    Em andamento
                  </Badge>
                </div>
                <h3 className="font-bold text-base leading-tight">{phase.name}</h3>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {phase.xp_to_complete} XP
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {phase.objective || phase.description}
          </p>

          {/* Progress Section - Same pattern as WeeklyMission */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso</span>
              <span className={cn(
                "text-sm font-bold tabular-nums",
                isCompleted ? "text-green-500" : "text-foreground"
              )}>
                {progressPercentage}%
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className={cn(
                "h-2",
                isCompleted && "[&>div]:bg-green-500"
              )}
            />
          </div>

          {/* CTA */}
          <Button 
            className="w-full gap-2"
            onClick={onContinue}
          >
            Continuar
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
