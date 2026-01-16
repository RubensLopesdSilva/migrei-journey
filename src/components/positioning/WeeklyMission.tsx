import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Sparkles, Trophy, Clock, Plus, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xp: number;
  category: 'digital' | 'presencial' | 'onetoone';
  daysLeft: number;
}

interface WeeklyMissionProps {
  mission?: Mission;
  onComplete?: (missionId: string) => void;
  onUpdateProgress?: (missionId: string, increment: number) => void;
}

const categoryConfig = {
  digital: {
    label: 'Digital',
    icon: '📱',
    bgClass: 'bg-primary/5',
    borderClass: 'border-primary/20'
  },
  presencial: {
    label: 'Presencial',
    icon: '🎤',
    bgClass: 'bg-accent/50',
    borderClass: 'border-accent'
  },
  onetoone: {
    label: '1:1',
    icon: '☕',
    bgClass: 'bg-secondary/50',
    borderClass: 'border-secondary'
  }
};

// Mock mission for demo
const defaultMission: Mission = {
  id: '1',
  title: 'Inicie 3 conversas profissionais',
  description: 'Conecte-se com pessoas da sua área no LinkedIn, eventos ou coffee chats',
  target: 3,
  current: 1,
  xp: 150,
  category: 'digital',
  daysLeft: 5
};

export function WeeklyMission({ mission = defaultMission, onComplete, onUpdateProgress }: WeeklyMissionProps) {
  const [localProgress, setLocalProgress] = useState(mission.current);
  const progress = (localProgress / mission.target) * 100;
  const isCompleted = localProgress >= mission.target;
  const config = categoryConfig[mission.category];

  const handleIncrement = () => {
    if (localProgress < mission.target) {
      setLocalProgress(prev => prev + 1);
      onUpdateProgress?.(mission.id, 1);
    }
  };

  const handleDecrement = () => {
    if (localProgress > 0) {
      setLocalProgress(prev => prev - 1);
      onUpdateProgress?.(mission.id, -1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        isCompleted 
          ? "border-green-500/50 bg-green-500/5" 
          : "border-border bg-card hover:border-primary/30"
      )}>
        <CardContent className="p-5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                isCompleted ? "bg-green-500/10" : "bg-primary/10"
              )}>
                {isCompleted ? (
                  <Trophy className="h-6 w-6 text-green-500" />
                ) : (
                  <Target className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Missão da Semana
                  </span>
                  <Badge variant="outline" className={cn("text-xs", config.bgClass, config.borderClass)}>
                    {config.icon} {config.label}
                  </Badge>
                </div>
                <h3 className="font-bold text-base leading-tight">{mission.title}</h3>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {mission.xp} XP
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {mission.daysLeft}d restantes
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">{mission.description}</p>

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso</span>
              <span className={cn(
                "text-sm font-bold tabular-nums",
                isCompleted ? "text-green-500" : "text-foreground"
              )}>
                {localProgress} / {mission.target}
              </span>
            </div>
            
            <div className="relative">
              <Progress 
                value={progress} 
                className={cn(
                  "h-2",
                  isCompleted && "[&>div]:bg-green-500"
                )}
              />
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 fill-green-100" />
                </motion.div>
              )}
            </div>

            {/* Quick Progress Controls */}
            {!isCompleted && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={handleDecrement}
                  disabled={localProgress === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold tabular-nums">{localProgress}</span>
                  <span className="text-xs text-muted-foreground">concluídas</span>
                </div>
                <Button
                  variant="default"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={handleIncrement}
                  disabled={localProgress >= mission.target}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 pt-2 text-green-600"
              >
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">Missão Completa! 🎉</span>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
