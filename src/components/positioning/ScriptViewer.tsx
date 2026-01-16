import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Copy, Check, Edit3, Sparkles, ChevronLeft, ChevronRight,
  Smartphone, Mic, Coffee, BookOpen, MessageSquare, Send, UserPlus, Users, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type PillarType = 'digital' | 'presencial' | 'onetoone';

interface Script {
  title: string;
  description: string;
  icon: React.ReactNode;
  template: string;
  tips: string[];
  example: string;
}

const allScripts: Record<PillarType, Script[]> = {
  digital: [
    {
      title: 'Mensagem de Conexão',
      description: 'Template para enviar convites personalizados no LinkedIn',
      icon: <UserPlus className="h-4 w-4" />,
      template: `Olá [Nome],

Vi que você trabalha com [área/empresa] e achei muito interessante sua trajetória em [algo específico do perfil].

Estou em transição para [sua área] e adoraria me conectar para acompanhar seu trabalho e, quem sabe, trocar ideias sobre [tema em comum].

Abraço!`,
      tips: [
        'Mencione algo específico do perfil da pessoa',
        'Seja breve - máximo 300 caracteres',
        'Não peça emprego na primeira mensagem',
        'Mostre interesse genuíno'
      ],
      example: 'Olá Maria, vi que você lidera o time de Produto na XYZ e achei incrível o case do lançamento do app. Estou migrando para PM e adoraria me conectar!'
    },
    {
      title: 'Comentário Estratégico',
      description: 'Como comentar posts para ser notado por recrutadores',
      icon: <MessageSquare className="h-4 w-4" />,
      template: `[Concordar ou complementar a ideia principal]

Na minha experiência com [contexto], percebi que [insight relacionado].

[Pergunta que gera conversa]`,
      tips: [
        'Comente nas primeiras 2 horas do post',
        'Adicione valor, não apenas "ótimo post"',
        'Faça uma pergunta para gerar resposta',
        'Comente em posts de pessoas influentes da área'
      ],
      example: 'Concordo totalmente! Na minha experiência implementando OKRs, o maior desafio foi justamente o alinhamento entre times. Você usa alguma ferramenta específica para facilitar isso?'
    },
    {
      title: 'InMail que Funciona',
      description: 'Abordagem para pessoas fora da sua rede',
      icon: <Send className="h-4 w-4" />,
      template: `Assunto: [Algo específico sobre a pessoa/empresa]

Olá [Nome],

Cheguei até você através de [como encontrou] e fiquei impressionado com [algo específico].

Estou explorando oportunidades em [área] e acredito que uma breve conversa de 15 min poderia me ajudar a entender melhor [aspecto específico].

Teria disponibilidade para um papo rápido na próxima semana?

Obrigado!`,
      tips: [
        'Use um assunto que gere curiosidade',
        'Mostre que pesquisou sobre a pessoa',
        'Seja específico no que quer',
        'Peça pouco tempo (15-20 min)'
      ],
      example: ''
    }
  ],
  presencial: [
    {
      title: 'Elevator Pitch',
      description: 'Apresente-se em 30 segundos de forma memorável',
      icon: <Mic className="h-4 w-4" />,
      template: `Olá, sou [nome], [cargo/área atual ou de transição].

Nos últimos [tempo] venho trabalhando com [experiência relevante] e agora estou focado em [objetivo].

Meu diferencial é [valor único que você oferece].

E você, com o que trabalha?`,
      tips: [
        'Pratique até ficar natural',
        'Adapte para cada contexto',
        'Termine com uma pergunta',
        'Sorria e mantenha contato visual'
      ],
      example: 'Oi, sou a Ana, Product Manager em transição da área de marketing. Tenho 5 anos liderando lançamentos de produto e agora quero aplicar isso em tech. Meu diferencial é entender profundamente o cliente. E você?'
    },
    {
      title: 'Troca de Contatos',
      description: 'Como pedir LinkedIn sem parecer invasivo',
      icon: <Users className="h-4 w-4" />,
      template: `"Foi ótimo conversar sobre [tema]. Podemos nos conectar no LinkedIn para continuar essa conversa?"

ou

"Adorei conhecer seu trabalho em [área]. Posso te mandar uma mensagem depois para [motivo específico]?"`,
      tips: [
        'Mencione o que conversaram',
        'Dê um motivo para o contato futuro',
        'Pegue o celular e conecte na hora',
        'Mande mensagem em até 24h'
      ],
      example: ''
    },
    {
      title: 'Follow-up Pós-Evento',
      description: 'Mensagem para manter o contato aquecido',
      icon: <Calendar className="h-4 w-4" />,
      template: `Olá [Nome]!

Foi um prazer te conhecer no [evento] ontem. Nossa conversa sobre [tema] foi muito valiosa.

Como prometido, segue [link/material/contato mencionado].

Fico à disposição para continuarmos o papo!

Abraço`,
      tips: [
        'Envie em até 24 horas',
        'Mencione algo específico da conversa',
        'Entregue algo de valor se possível',
        'Não peça nada na primeira mensagem'
      ],
      example: ''
    }
  ],
  onetoone: [
    {
      title: 'Pedir um Coffee Chat',
      description: 'Como convidar alguém para uma conversa sem parecer oportunista',
      icon: <Coffee className="h-4 w-4" />,
      template: `Olá [Nome],

Tenho acompanhado seu trabalho em [área] e admiro muito sua trajetória, especialmente [algo específico].

Estou em um momento de [transição/exploração] e acredito que 15-20 min de conversa com você poderia me dar uma perspectiva valiosa sobre [tema específico].

Teria disponibilidade nas próximas semanas? Posso me adaptar ao seu horário.

Agradeço desde já!`,
      tips: [
        'Seja específico sobre o que quer aprender',
        'Peça pouco tempo (15-20 min)',
        'Ofereça flexibilidade',
        'Mostre que pesquisou sobre a pessoa'
      ],
      example: ''
    },
    {
      title: 'Conduzir a Conversa',
      description: 'Perguntas para fazer e como ouvir ativamente',
      icon: <MessageSquare className="h-4 w-4" />,
      template: `Roteiro sugerido:

1. AGRADECER (2 min)
"Muito obrigado por tirar esse tempo..."

2. CONTEXTO (3 min)
"Deixa eu contar rapidamente minha situação..."

3. PERGUNTAS (10-15 min)
- "Como foi sua transição para [área]?"
- "O que você gostaria de saber antes de entrar?"
- "Quais habilidades são mais valorizadas?"
- "Conhece alguém que eu deveria conversar?"

4. ENCERRAR (2 min)
"Foi muito valioso. Posso te dar um retorno sobre como usei seus conselhos?"`,
      tips: [
        'Prepare 3-5 perguntas antes',
        'Ouça mais do que fala',
        'Anote os insights',
        'Peça indicações de outras pessoas'
      ],
      example: ''
    },
    {
      title: 'Pedir Indicação',
      description: 'Como pedir uma referência de forma elegante',
      icon: <UserPlus className="h-4 w-4" />,
      template: `"Vi que a [empresa] está com uma vaga de [cargo]. Você conhece alguém lá que eu poderia conversar para entender melhor a cultura?"

ou

"Estou muito interessado em [área/empresa]. Se você conhecer alguém que eu pudesse trocar uma ideia, ficaria muito grato por uma apresentação."

ou (após já ter relacionamento)

"Estou aplicando para [vaga]. Você se sentiria confortável em me recomendar ou me apresentar ao time?"`,
      tips: [
        'Só peça depois de construir relacionamento',
        'Facilite: mande seu currículo/LinkedIn',
        'Dê uma saída fácil ("se você se sentir confortável...")',
        'Agradeça mesmo se a pessoa não puder ajudar'
      ],
      example: ''
    }
  ]
};

const pillarConfig = {
  digital: {
    title: 'Digital',
    subtitle: 'LinkedIn, Comunidades Online',
    icon: <Smartphone className="h-5 w-5" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  presencial: {
    title: 'Presencial',
    subtitle: 'Eventos, Meetups, Workshops',
    icon: <Mic className="h-5 w-5" />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  onetoone: {
    title: '1:1',
    subtitle: 'Coffee Chats, Indicações',
    icon: <Coffee className="h-5 w-5" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  }
};

interface ScriptViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pillarId: PillarType;
  scriptIndex: number;
}

export function ScriptViewer({ open, onOpenChange, pillarId, scriptIndex }: ScriptViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(scriptIndex);
  const [editedTemplate, setEditedTemplate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const scripts = allScripts[pillarId];
  const currentScript = scripts[currentIndex];
  const pillar = pillarConfig[pillarId];

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editedTemplate : currentScript.template);
    setIsCopied(true);
    toast.success('Template copiado!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleEdit = () => {
    if (!isEditing) {
      setEditedTemplate(currentScript.template);
    }
    setIsEditing(!isEditing);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : scripts.length - 1));
    setIsEditing(false);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < scripts.length - 1 ? prev + 1 : 0));
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", pillar.bgColor, pillar.color)}>
                {pillar.icon}
              </div>
              <div>
                <DialogTitle className="text-lg">{currentScript.title}</DialogTitle>
                <p className="text-xs text-muted-foreground">{pillar.title} • {currentScript.description}</p>
              </div>
            </div>
            <Badge variant="outline">
              {currentIndex + 1}/{scripts.length}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Template
              </h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-8 gap-1.5"
                >
                  <Edit3 className="h-3 w-3" />
                  {isEditing ? 'Cancelar' : 'Personalizar'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 gap-1.5"
                >
                  {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {isCopied ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </div>
            
            {isEditing ? (
              <Textarea
                value={editedTemplate}
                onChange={(e) => setEditedTemplate(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {currentScript.template}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Dicas
            </h4>
            <ul className="space-y-1.5">
              {currentScript.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Example */}
          {currentScript.example && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Exemplo real</h4>
              <Card className="border-green-500/30 bg-green-500/5">
                <CardContent className="p-4">
                  <p className="text-sm italic">{currentScript.example}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrev}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              className="gap-2"
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
