import { motion } from "framer-motion";
import { Play, ChevronRight } from "lucide-react";
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: phase.color || '#3B82F6' }}
              >
                {phase.phase_number}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Agora
                  </span>
                  <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20">
                    <Play className="h-3 w-3 mr-1" />
                    Em andamento
                  </Badge>
                </div>
                <h3 className="font-bold text-base leading-tight">{phase.name}</h3>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {phase.objective || phase.description}
          </p>

          {/* Progress */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso</span>
              <span className={cn(
                "text-sm font-bold tabular-nums",
                progressPercentage >= 100 ? "text-green-500" : "text-foreground"
              )}>
                {progressPercentage}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
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
