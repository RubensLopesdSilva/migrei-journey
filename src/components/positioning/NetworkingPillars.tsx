import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Mic, Coffee, ChevronRight, BookOpen, MessageSquare, Users, Calendar, Send, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type PillarType = 'digital' | 'presencial' | 'onetoone';

interface PillarContent {
  id: PillarType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  emoji: string;
  color: string;
  bgGradient: string;
  scripts: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
}

const pillars: PillarContent[] = [
  {
    id: 'digital',
    title: 'Digital',
    subtitle: 'LinkedIn, Comunidades Online',
    icon: <Smartphone className="h-6 w-6" />,
    emoji: '📱',
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/10 to-blue-600/5',
    scripts: [
      {
        title: 'Mensagem de Conexão',
        description: 'Template para enviar convites personalizados no LinkedIn',
        icon: <UserPlus className="h-4 w-4" />
      },
      {
        title: 'Comentário Estratégico',
        description: 'Como comentar posts para ser notado por recrutadores',
        icon: <MessageSquare className="h-4 w-4" />
      },
      {
        title: 'InMail que Funciona',
        description: 'Abordagem para pessoas fora da sua rede',
        icon: <Send className="h-4 w-4" />
      }
    ]
  },
  {
    id: 'presencial',
    title: 'Presencial',
    subtitle: 'Eventos, Meetups, Workshops',
    icon: <Mic className="h-6 w-6" />,
    emoji: '🎤',
    color: 'text-amber-500',
    bgGradient: 'from-amber-500/10 to-amber-600/5',
    scripts: [
      {
        title: 'Elevator Pitch',
        description: 'Apresente-se em 30 segundos de forma memorável',
        icon: <Mic className="h-4 w-4" />
      },
      {
        title: 'Troca de Contatos',
        description: 'Como pedir LinkedIn sem parecer invasivo',
        icon: <Users className="h-4 w-4" />
      },
      {
        title: 'Follow-up Pós-Evento',
        description: 'Mensagem para manter o contato aquecido',
        icon: <Calendar className="h-4 w-4" />
      }
    ]
  },
  {
    id: 'onetoone',
    title: '1:1',
    subtitle: 'Coffee Chats, Indicações',
    icon: <Coffee className="h-6 w-6" />,
    emoji: '☕',
    color: 'text-purple-500',
    bgGradient: 'from-purple-500/10 to-purple-600/5',
    scripts: [
      {
        title: 'Pedir um Coffee Chat',
        description: 'Como convidar alguém para uma conversa sem parecer oportunista',
        icon: <Coffee className="h-4 w-4" />
      },
      {
        title: 'Conduzir a Conversa',
        description: 'Perguntas para fazer e como ouvir ativamente',
        icon: <MessageSquare className="h-4 w-4" />
      },
      {
        title: 'Pedir Indicação',
        description: 'Como pedir uma referência de forma elegante',
        icon: <UserPlus className="h-4 w-4" />
      }
    ]
  }
];

interface NetworkingPillarsProps {
  onSelectScript?: (pillarId: PillarType, scriptIndex: number) => void;
}

export function NetworkingPillars({ onSelectScript }: NetworkingPillarsProps) {
  const [selectedPillar, setSelectedPillar] = useState<PillarType | null>(null);

  const handlePillarClick = (pillarId: PillarType) => {
    setSelectedPillar(selectedPillar === pillarId ? null : pillarId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Scripts & Templates</h2>
          <p className="text-sm text-muted-foreground">Escolha o contexto e acesse templates prontos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={cn(
                "cursor-pointer transition-all duration-300 overflow-hidden group",
                "hover:shadow-lg hover:-translate-y-1",
                selectedPillar === pillar.id 
                  ? "ring-2 ring-primary shadow-lg" 
                  : "hover:ring-1 hover:ring-primary/30"
              )}
              onClick={() => handlePillarClick(pillar.id)}
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity",
                pillar.bgGradient,
                selectedPillar === pillar.id ? "opacity-100" : "group-hover:opacity-75"
              )} />
              
              <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-3 rounded-xl bg-background/80 backdrop-blur-sm shadow-sm",
                      pillar.color
                    )}>
                      {pillar.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {pillar.emoji} {pillar.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{pillar.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    selectedPillar === pillar.id && "rotate-90"
                  )} />
                </div>
              </CardHeader>

              {selectedPillar === pillar.id && (
                <CardContent className="relative z-10 pt-0">
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {pillar.scripts.map((script, scriptIndex) => (
                      <motion.div
                        key={script.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: scriptIndex * 0.1 }}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto py-3 px-3 bg-background/60 backdrop-blur-sm hover:bg-background/80"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectScript?.(pillar.id, scriptIndex);
                          }}
                        >
                          <div className="flex items-start gap-3 text-left">
                            <div className={cn("p-2 rounded-lg bg-muted", pillar.color)}>
                              {script.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{script.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {script.description}
                              </p>
                            </div>
                            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
