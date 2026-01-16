import { motion } from "framer-motion";
import { Check, Lock, Play, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PhaseWithProgress } from "@/types/progress";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Compass } from "lucide-react";

interface PhasesGridProps {
  phases: PhaseWithProgress[];
  currentPhaseId: string | null;
  onPhaseClick: (phase: PhaseWithProgress) => void;
}

export function PhasesGrid({ phases, currentPhaseId, onPhaseClick }: PhasesGridProps) {
  const [isOpen, setIsOpen] = useState(false);

  const completedCount = phases.filter(p => p.userProgress?.status === 'completed').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className={cn(
          "transition-all duration-200",
          isOpen ? "ring-2 ring-primary/50 shadow-md" : "hover:border-primary/30"
        )}>
          <CollapsibleTrigger asChild>
            <button className="w-full text-left">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Compass className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base">Fases</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {completedCount}/6 concluídas
                    </Badge>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )} />
                  </div>
                </div>
              </CardHeader>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0 pb-4">
              <div className="space-y-2">
                {phases.map((phase, index) => {
                  const isLocked = phase.userProgress?.status === 'locked';
                  const isCompleted = phase.userProgress?.status === 'completed';
                  const isCurrent = phase.id === currentPhaseId;
                  const progress = phase.userProgress?.progress_percentage || 0;

                  return (
                    <motion.div
                      key={phase.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start h-auto py-3 px-3",
                          isLocked && "opacity-50 cursor-not-allowed",
                          isCurrent && "bg-primary/5 hover:bg-primary/10",
                          isCompleted && "bg-green-500/5 hover:bg-green-500/10"
                        )}
                        disabled={isLocked}
                        onClick={() => !isLocked && onPhaseClick(phase)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div 
                            className={cn(
                              "w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                            )}
                            style={{ 
                              backgroundColor: isLocked ? '#6B7280' : phase.color || '#3B82F6' 
                            }}
                          >
                            {phase.phase_number}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-medium text-sm">{phase.name}</p>
                              {isCompleted && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5 bg-green-500/10 text-green-600">
                                  <Check className="h-2.5 w-2.5" />
                                </Badge>
                              )}
                              {isCurrent && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5 bg-primary/10 text-primary">
                                  <Play className="h-2.5 w-2.5" />
                                </Badge>
                              )}
                              {isLocked && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
                                  <Lock className="h-2.5 w-2.5" />
                                </Badge>
                              )}
                            </div>
                            {!isLocked && (
                              <div className="flex items-center gap-2">
                                <Progress value={progress} className="h-1 flex-1 max-w-24" />
                                <span className="text-[10px] text-muted-foreground tabular-nums">
                                  {progress}%
                                </span>
                              </div>
                            )}
                          </div>
                          {!isLocked && (
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </motion.div>
  );
}
