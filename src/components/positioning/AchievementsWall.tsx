import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Heart, MessageCircle, ChevronDown, TrendingUp, Users, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Achievement {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  type: 'connection' | 'interview' | 'offer' | 'event' | 'coffee';
  title: string;
  description: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  createdAt: string;
}

const achievementConfig = {
  connection: { emoji: '🤝', label: 'Nova conexão' },
  interview: { emoji: '💼', label: 'Entrevista conquistada' },
  offer: { emoji: '🎉', label: 'Proposta recebida' },
  event: { emoji: '🎤', label: 'Evento participado' },
  coffee: { emoji: '☕', label: 'Coffee chat realizado' }
};

// Mock data
const mockAchievements: Achievement[] = [
  {
    id: '1',
    user: { name: 'Ana Silva' },
    type: 'interview',
    title: 'Primeira entrevista na nova área!',
    description: 'Usei o template de conexão. A pessoa respondeu e me indicou pro RH.',
    likes: 24,
    comments: 5,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: '2',
    user: { name: 'Carlos Mendes' },
    type: 'coffee',
    title: 'Primeiro coffee chat!',
    description: 'Usei o script e a pessoa adorou. Saí com 2 indicações.',
    likes: 18,
    comments: 3,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: '3',
    user: { name: 'Mariana Costa' },
    type: 'offer',
    title: 'Recebi uma proposta! 🎉',
    description: '3 meses de networking. Hoje assino o contrato.',
    likes: 89,
    comments: 15,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

interface AchievementsWallProps {
  achievements?: Achievement[];
  onLike?: (achievementId: string) => void;
  onShare?: () => void;
}

export function AchievementsWall({ 
  achievements = mockAchievements,
  onLike,
  onShare 
}: AchievementsWallProps) {
  const [showAll, setShowAll] = useState(false);
  const [localAchievements, setLocalAchievements] = useState(achievements);
  
  const displayedAchievements = showAll ? localAchievements : localAchievements.slice(0, 2);

  const handleLike = (id: string) => {
    setLocalAchievements(prev => prev.map(a => 
      a.id === id 
        ? { ...a, likes: a.isLiked ? a.likes - 1 : a.likes + 1, isLiked: !a.isLiked }
        : a
    ));
    onLike?.(id);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-base">Conquistas</CardTitle>
              <p className="text-xs text-muted-foreground">Inspire-se com a comunidade</p>
            </div>
          </div>
          <Button
            onClick={onShare}
            size="sm"
            variant="outline"
            className="h-8 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Compartilhar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Total', value: '247', icon: Trophy },
            { label: 'Semana', value: '32', icon: TrendingUp },
            { label: 'Membros', value: '1.2k', icon: Users }
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
              <div>
                <p className="font-semibold text-sm leading-none">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements list */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {displayedAchievements.map((achievement, index) => {
              const config = achievementConfig[achievement.type];
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={achievement.user.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {achievement.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-medium text-sm">{achievement.user.name}</span>
                          <Badge variant="secondary" className="text-xs h-5 px-1.5">
                            {config.emoji}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(achievement.createdAt), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </span>
                        </div>

                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {achievement.description}
                        </p>

                        <div className="flex items-center gap-3 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-7 px-2 gap-1",
                              achievement.isLiked && "text-red-500"
                            )}
                            onClick={() => handleLike(achievement.id)}
                          >
                            <Heart className={cn(
                              "h-3.5 w-3.5",
                              achievement.isLiked && "fill-current"
                            )} />
                            <span className="text-xs">{achievement.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 gap-1"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span className="text-xs">{achievement.comments}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Show more/less */}
        {localAchievements.length > 2 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-1.5 text-xs"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Ver menos' : `Ver mais ${localAchievements.length - 2}`}
            <ChevronDown className={cn(
              "h-3.5 w-3.5 transition-transform",
              showAll && "rotate-180"
            )} />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
