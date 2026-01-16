import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Mic, Coffee, ChevronDown, BookOpen, MessageSquare, Send, UserPlus, Users, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

type PillarType = 'digital' | 'presencial' | 'onetoone';

interface PillarContent {
  id: PillarType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
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
    subtitle: 'LinkedIn & Comunidades',
    icon: <Smartphone className="h-5 w-5" />,
    scripts: [
      {
        title: 'Mensagem de Conexão',
        description: 'Convites personalizados no LinkedIn',
        icon: <UserPlus className="h-4 w-4" />
      },
      {
        title: 'Comentário Estratégico',
        description: 'Seja notado por recrutadores',
        icon: <MessageSquare className="h-4 w-4" />
      },
      {
        title: 'InMail que Funciona',
        description: 'Abordagem fora da sua rede',
        icon: <Send className="h-4 w-4" />
      }
    ]
  },
  {
    id: 'presencial',
    title: 'Presencial',
    subtitle: 'Eventos & Meetups',
    icon: <Mic className="h-5 w-5" />,
    scripts: [
      {
        title: 'Elevator Pitch',
        description: 'Apresente-se em 30 segundos',
        icon: <Mic className="h-4 w-4" />
      },
      {
        title: 'Troca de Contatos',
        description: 'Peça LinkedIn naturalmente',
        icon: <Users className="h-4 w-4" />
      },
      {
        title: 'Follow-up Pós-Evento',
        description: 'Mantenha o contato aquecido',
        icon: <Calendar className="h-4 w-4" />
      }
    ]
  },
  {
    id: 'onetoone',
    title: 'Conversas 1:1',
    subtitle: 'Coffee Chats & Indicações',
    icon: <Coffee className="h-5 w-5" />,
    scripts: [
      {
        title: 'Pedir um Coffee Chat',
        description: 'Convide sem parecer oportunista',
        icon: <Coffee className="h-4 w-4" />
      },
      {
        title: 'Conduzir a Conversa',
        description: 'Perguntas e escuta ativa',
        icon: <MessageSquare className="h-4 w-4" />
      },
      {
        title: 'Pedir Indicação',
        description: 'Referência de forma elegante',
        icon: <UserPlus className="h-4 w-4" />
      }
    ]
  }
];

interface NetworkingPillarsProps {
  onSelectScript?: (pillarId: PillarType, scriptIndex: number) => void;
}

export function NetworkingPillars({ onSelectScript }: NetworkingPillarsProps) {
  const [openPillar, setOpenPillar] = useState<PillarType | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Scripts & Templates</h2>
          <p className="text-sm text-muted-foreground">Escolha o contexto e acesse modelos prontos</p>
        </div>
      </div>

      <div className="space-y-3">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Collapsible
              open={openPillar === pillar.id}
              onOpenChange={(isOpen) => setOpenPillar(isOpen ? pillar.id : null)}
            >
              <Card className={cn(
                "transition-all duration-200",
                openPillar === pillar.id 
                  ? "ring-2 ring-primary/50 shadow-md" 
                  : "hover:border-primary/30"
              )}>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-left">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            {pillar.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{pillar.title}</h3>
                            <p className="text-xs text-muted-foreground">{pillar.subtitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {pillar.scripts.length} scripts
                          </Badge>
                          <ChevronDown className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform duration-200",
                            openPillar === pillar.id && "rotate-180"
                          )} />
                        </div>
                      </div>
                    </CardContent>
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-2 border-t pt-3">
                    {pillar.scripts.map((script, scriptIndex) => (
                      <Button
                        key={script.title}
                        variant="ghost"
                        className="w-full justify-start h-auto py-3 px-3 hover:bg-muted"
                        onClick={() => onSelectScript?.(pillar.id, scriptIndex)}
                      >
                        <div className="flex items-center gap-3 text-left w-full">
                          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                            {script.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{script.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {script.description}
                            </p>
                          </div>
                          <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
