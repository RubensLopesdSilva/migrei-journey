import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2, ChevronRight, Zap, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  title: string;
  category: 'linkedin' | 'evento' | 'coffee' | 'networking';
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
  isCompleted: boolean;
}

const categoryEmoji = {
  linkedin: '📱',
  evento: '🎤',
  coffee: '☕',
  networking: '👥'
};

const difficultyFlames = {
  easy: 1,
  medium: 2,
  hard: 3
};

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Comente em 3 posts',
    category: 'linkedin',
    difficulty: 'easy',
    xp: 30,
    isCompleted: false
  },
  {
    id: '2',
    title: 'Envie 2 conexões personalizadas',
    category: 'linkedin',
    difficulty: 'medium',
    xp: 50,
    isCompleted: false
  },
  {
    id: '3',
    title: 'Participe de um evento',
    category: 'evento',
    difficulty: 'medium',
    xp: 75,
    isCompleted: true
  },
  {
    id: '4',
    title: 'Convide alguém para café',
    category: 'coffee',
    difficulty: 'hard',
    xp: 100,
    isCompleted: false
  }
];

interface WeeklyChallengesProps {
  challenges?: Challenge[];
  onCompleteChallenge?: (challengeId: string) => void;
  onProgressChange?: (completedCount: number) => void;
}

export function WeeklyChallenges({ 
  challenges = mockChallenges,
  onCompleteChallenge,
  onProgressChange
}: WeeklyChallengesProps) {
  const [localChallenges, setLocalChallenges] = useState(challenges);
  
  const completedCount = localChallenges.filter(c => c.isCompleted).length;
  const totalXP = localChallenges.reduce((acc, c) => acc + (c.isCompleted ? c.xp : 0), 0);
  const potentialXP = localChallenges.reduce((acc, c) => acc + c.xp, 0);
  const allCompleted = completedCount === localChallenges.length;

  const handleComplete = (id: string) => {
    setLocalChallenges(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, isCompleted: true } : c);
      const newCount = updated.filter(c => c.isCompleted).length;
      onProgressChange?.(newCount);
      return updated;
    });
    onCompleteChallenge?.(id);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <CardTitle className="text-base">Desafios</CardTitle>
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
              <span className="font-medium">{completedCount}/{localChallenges.length}</span>
              {allCompleted && (
                <Badge className="bg-green-500 h-5 gap-1">
                  <Award className="h-3 w-3" />
                  Completo!
                </Badge>
              )}
            </div>
          </div>
          <Progress 
            value={(completedCount / localChallenges.length) * 100} 
            className="h-1.5"
          />
        </div>

        {/* Challenges list */}
        <div className="space-y-2">
          {localChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={cn(
                "flex items-center gap-3 p-2.5 rounded-lg border transition-colors",
                challenge.isCompleted 
                  ? "bg-green-500/5 border-green-500/30" 
                  : "hover:bg-muted/50"
              )}>
                {/* Status indicator */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm",
                  challenge.isCompleted 
                    ? "bg-green-500 text-white" 
                    : "bg-muted"
                )}>
                  {challenge.isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    categoryEmoji[challenge.category]
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs">
                      {Array(difficultyFlames[challenge.difficulty]).fill('🔥').join('')}
                    </span>
                    <Badge variant="secondary" className="text-xs h-4 px-1">
                      +{challenge.xp}
                    </Badge>
                  </div>
                  <p className={cn(
                    "text-sm font-medium leading-tight",
                    challenge.isCompleted && "line-through text-muted-foreground"
                  )}>
                    {challenge.title}
                  </p>
                </div>

                {!challenge.isCompleted && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 shrink-0"
                    onClick={() => handleComplete(challenge.id)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
