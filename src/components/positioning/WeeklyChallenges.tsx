import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2, Clock, ChevronRight, Zap, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'linkedin' | 'evento' | 'coffee' | 'comunidade';
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
  isCompleted: boolean;
  progress?: {
    current: number;
    target: number;
  };
}

const categoryConfig = {
  linkedin: { emoji: '📱', label: 'LinkedIn', color: 'text-blue-500 bg-blue-500/10' },
  evento: { emoji: '🎤', label: 'Evento', color: 'text-amber-500 bg-amber-500/10' },
  coffee: { emoji: '☕', label: 'Coffee Chat', color: 'text-purple-500 bg-purple-500/10' },
  comunidade: { emoji: '👥', label: 'Comunidade', color: 'text-green-500 bg-green-500/10' }
};

const difficultyConfig = {
  easy: { label: 'Iniciante', color: 'bg-green-500/10 text-green-600', flames: 1 },
  medium: { label: 'Intermediário', color: 'bg-amber-500/10 text-amber-600', flames: 2 },
  hard: { label: 'Avançado', color: 'bg-red-500/10 text-red-600', flames: 3 }
};

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Comente em 3 posts do LinkedIn',
    description: 'Deixe comentários relevantes em posts de pessoas da sua área',
    category: 'linkedin',
    difficulty: 'easy',
    xp: 30,
    isCompleted: false,
    progress: { current: 1, target: 3 }
  },
  {
    id: '2',
    title: 'Envie 2 mensagens de conexão personalizadas',
    description: 'Use o template para se conectar com pessoas relevantes',
    category: 'linkedin',
    difficulty: 'medium',
    xp: 50,
    isCompleted: false,
    progress: { current: 0, target: 2 }
  },
  {
    id: '3',
    title: 'Participe de um evento online',
    description: 'Encontre um webinar ou meetup da sua área e participe',
    category: 'evento',
    difficulty: 'medium',
    xp: 75,
    isCompleted: true
  },
  {
    id: '4',
    title: 'Marque um coffee chat',
    description: 'Convide alguém para uma conversa de 15-30 minutos',
    category: 'coffee',
    difficulty: 'hard',
    xp: 100,
    isCompleted: false
  }
];

interface WeeklyChallengesProps {
  challenges?: Challenge[];
  onCompleteChallenge?: (challengeId: string) => void;
}

export function WeeklyChallenges({ 
  challenges = mockChallenges,
  onCompleteChallenge 
}: WeeklyChallengesProps) {
  const [localChallenges, setLocalChallenges] = useState(challenges);
  
  const completedCount = localChallenges.filter(c => c.isCompleted).length;
  const totalXP = localChallenges.reduce((acc, c) => acc + (c.isCompleted ? c.xp : 0), 0);
  const potentialXP = localChallenges.reduce((acc, c) => acc + c.xp, 0);

  const handleComplete = (id: string) => {
    setLocalChallenges(prev => prev.map(c =>
      c.id === id ? { ...c, isCompleted: true } : c
    ));
    onCompleteChallenge?.(id);
  };

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Desafios da Semana</h2>
            <p className="text-xs text-muted-foreground">
              Complete para ganhar XP e evoluir
            </p>
          </div>
        </div>
        <Badge className="bg-primary/10 text-primary">
          <Zap className="h-3 w-3 mr-1" />
          {totalXP}/{potentialXP} XP
        </Badge>
      </div>

      {/* Progress bar */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progresso semanal</span>
              <span className="font-medium">{completedCount}/{localChallenges.length}</span>
            </div>
            <Progress 
              value={(completedCount / localChallenges.length) * 100} 
              className="h-2"
            />
          </div>
          {completedCount === localChallenges.length && (
            <Badge className="bg-green-500 gap-1">
              <Award className="h-3 w-3" />
              Completo!
            </Badge>
          )}
        </div>
      </Card>

      {/* Challenges list */}
      <div className="space-y-3">
        {localChallenges.map((challenge, index) => {
          const catConfig = categoryConfig[challenge.category];
          const diffConfig = difficultyConfig[challenge.difficulty];
          
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "group transition-all",
                challenge.isCompleted 
                  ? "bg-green-500/5 border-green-500/30" 
                  : "hover:shadow-md hover:border-primary/30"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Status indicator */}
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      challenge.isCompleted 
                        ? "bg-green-500 text-white" 
                        : "bg-muted"
                    )}>
                      {challenge.isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-lg">{catConfig.emoji}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className={cn("text-xs", catConfig.color)}>
                          {catConfig.label}
                        </Badge>
                        <Badge variant="outline" className={cn("text-xs", diffConfig.color)}>
                          {Array(diffConfig.flames).fill('🔥').join('')}
                        </Badge>
                        <Badge className="bg-primary/10 text-primary text-xs">
                          +{challenge.xp} XP
                        </Badge>
                      </div>

                      {/* Content */}
                      <h4 className={cn(
                        "font-semibold text-sm mb-1",
                        challenge.isCompleted && "line-through text-muted-foreground"
                      )}>
                        {challenge.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {challenge.description}
                      </p>

                      {/* Progress (if applicable) */}
                      {challenge.progress && !challenge.isCompleted && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progresso</span>
                            <span>{challenge.progress.current}/{challenge.progress.target}</span>
                          </div>
                          <Progress 
                            value={(challenge.progress.current / challenge.progress.target) * 100}
                            className="h-1.5"
                          />
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    {!challenge.isCompleted && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="shrink-0"
                        onClick={() => handleComplete(challenge.id)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
