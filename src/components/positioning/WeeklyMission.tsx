import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, ChevronRight, Sparkles, Trophy, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
}

const categoryConfig = {
  digital: {
    label: 'Digital',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    icon: '📱'
  },
  presencial: {
    label: 'Presencial',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    icon: '🎤'
  },
  onetoone: {
    label: '1:1',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    icon: '☕'
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

export function WeeklyMission({ mission = defaultMission, onComplete }: WeeklyMissionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const progress = (mission.current / mission.target) * 100;
  const isCompleted = mission.current >= mission.target;
  const config = categoryConfig[mission.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn(
        "relative overflow-hidden border-2 transition-all duration-300",
        isCompleted 
          ? "border-green-500/50 bg-gradient-to-br from-green-500/5 to-emerald-500/10" 
          : "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:border-primary/40"
      )}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-full" />

        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-3 rounded-xl",
                isCompleted ? "bg-green-500/20" : "bg-primary/20"
              )}>
                {isCompleted ? (
                  <Trophy className="h-6 w-6 text-green-500" />
                ) : (
                  <Target className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Missão da Semana
                  </span>
                  <Badge variant="outline" className={cn("text-xs", config.color)}>
                    {config.icon} {config.label}
                  </Badge>
                </div>
                <h3 className="font-bold text-lg">{mission.title}</h3>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                {mission.xp} XP
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {mission.daysLeft} dias restantes
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          <p className="text-sm text-muted-foreground">{mission.description}</p>

          {/* Progress section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progresso</span>
              <span className={cn(
                "font-bold",
                isCompleted ? "text-green-500" : "text-primary"
              )}>
                {mission.current}/{mission.target}
              </span>
            </div>
            <div className="relative">
              <Progress 
                value={progress} 
                className={cn(
                  "h-3 rounded-full",
                  isCompleted ? "[&>div]:bg-green-500" : ""
                )}
              />
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-500/20" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            {isCompleted ? (
              <Button className="w-full gap-2 bg-green-500 hover:bg-green-600">
                <Trophy className="h-4 w-4" />
                Missão Completa!
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  variant="outline" 
                  className="flex-1 gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Registrar Progresso
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "rotate-90"
                  )} />
                </Button>
              </>
            )}
          </div>

          {/* Expanded section */}
          <AnimatePresence>
            {isExpanded && !isCompleted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3 border-t">
                  <p className="text-sm font-medium">Onde você fez networking?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'LinkedIn', icon: '📱', type: 'digital' },
                      { label: 'Evento', icon: '🎤', type: 'presencial' },
                      { label: 'Coffee Chat', icon: '☕', type: 'onetoone' }
                    ].map((option) => (
                      <Button
                        key={option.type}
                        variant="outline"
                        className="flex-col h-auto py-3 hover:bg-primary/5 hover:border-primary"
                        onClick={() => onComplete?.(mission.id)}
                      >
                        <span className="text-2xl mb-1">{option.icon}</span>
                        <span className="text-xs">{option.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
