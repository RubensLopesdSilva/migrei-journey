import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Heart, MessageCircle, Sparkles, ChevronDown, PartyPopper, TrendingUp, Users } from 'lucide-react';
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
  connection: {
    icon: Users,
    emoji: '🤝',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  interview: {
    icon: MessageCircle,
    emoji: '💼',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  offer: {
    icon: Trophy,
    emoji: '🎉',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  event: {
    icon: PartyPopper,
    emoji: '🎤',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  coffee: {
    icon: TrendingUp,
    emoji: '☕',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  }
};

// Mock data
const mockAchievements: Achievement[] = [
  {
    id: '1',
    user: { name: 'Ana Silva', avatar: '' },
    type: 'interview',
    title: 'Consegui uma entrevista!',
    description: 'Depois de usar o template de mensagem do LinkedIn, recebi uma resposta e marquei uma entrevista para próxima semana! 🚀',
    likes: 24,
    comments: 5,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: '2',
    user: { name: 'Carlos Mendes', avatar: '' },
    type: 'coffee',
    title: 'Primeiro coffee chat da vida!',
    description: 'Usei o script de convite e deu certo! A pessoa foi super receptiva e me deu dicas valiosas sobre a área de produto.',
    likes: 18,
    comments: 3,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: '3',
    user: { name: 'Mariana Costa', avatar: '' },
    type: 'offer',
    title: 'Recebi uma proposta! 🎉',
    description: 'Depois de 3 meses usando as técnicas do Migrei, finalmente recebi uma proposta. Networking funciona!',
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
  
  const displayedAchievements = showAll ? localAchievements : localAchievements.slice(0, 3);

  const handleLike = (id: string) => {
    setLocalAchievements(prev => prev.map(a => 
      a.id === id 
        ? { ...a, likes: a.isLiked ? a.likes - 1 : a.likes + 1, isLiked: !a.isLiked }
        : a
    ));
    onLike?.(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Mural de Conquistas</h2>
            <p className="text-xs text-muted-foreground">
              Celebre as vitórias da comunidade
            </p>
          </div>
        </div>
        <Button
          onClick={onShare}
          className="gap-2"
          size="sm"
        >
          <Sparkles className="h-4 w-4" />
          Compartilhar Vitória
        </Button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Conquistas', value: '247', icon: Trophy, color: 'text-amber-500' },
          { label: 'Esta semana', value: '32', icon: TrendingUp, color: 'text-green-500' },
          { label: 'Migrantes', value: '1.2k', icon: Users, color: 'text-blue-500' }
        ].map((stat) => (
          <Card key={stat.label} className="p-3">
            <div className="flex items-center gap-2">
              <stat.icon className={cn("h-4 w-4", stat.color)} />
              <div>
                <p className="font-bold text-lg leading-none">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Achievements list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayedAchievements.map((achievement, index) => {
            const config = achievementConfig[achievement.type];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                        <AvatarImage src={achievement.user.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {achievement.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{achievement.user.name}</span>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs px-1.5 py-0", config.color, config.bgColor)}
                          >
                            {config.emoji}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(achievement.createdAt), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </span>
                        </div>

                        {/* Content */}
                        <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {achievement.description}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-8 px-2 gap-1.5",
                              achievement.isLiked && "text-red-500"
                            )}
                            onClick={() => handleLike(achievement.id)}
                          >
                            <Heart className={cn(
                              "h-4 w-4",
                              achievement.isLiked && "fill-current"
                            )} />
                            <span className="text-xs">{achievement.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 gap-1.5"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-xs">{achievement.comments}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Show more/less */}
      {localAchievements.length > 3 && (
        <Button
          variant="ghost"
          className="w-full gap-2"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Ver menos' : `Ver mais ${localAchievements.length - 3} conquistas`}
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            showAll && "rotate-180"
          )} />
        </Button>
      )}
    </div>
  );
}
