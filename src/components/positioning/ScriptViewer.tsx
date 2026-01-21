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
      title: 'Pedido de conexão',
      description: 'Seja aceito mesmo por quem não te conhece',
      icon: <UserPlus className="h-4 w-4" />,
      template: `Olá [Nome],

Vi que você trabalha com [área/empresa] e achei muito interessante sua trajetória em [algo específico do perfil].

Estou em transição para [sua área] e adoraria me conectar para acompanhar seu trabalho e, quem sabe, trocar ideias sobre [tema em comum].

Abraço!`,
      tips: [
        'Mencione algo específico do perfil — isso mostra que você pesquisou',
        'Seja breve: máximo 300 caracteres (limite do LinkedIn)',
        'Nunca peça emprego na primeira mensagem — gere conexão primeiro',
        'Mostre interesse genuíno pela pessoa, não só pela vaga'
      ],
      example: 'Olá Maria, vi que você lidera o time de Produto na XYZ e achei incrível o case do lançamento do app. Estou migrando para PM e adoraria me conectar!'
    },
    {
      title: 'Comentário que gera conversa',
      description: 'Apareça no radar de recrutadores e líderes da área',
      icon: <MessageSquare className="h-4 w-4" />,
      template: `[Concorde ou complemente a ideia principal do post]

Na minha experiência com [contexto], percebi que [insight relacionado].

[Faça uma pergunta que convide resposta]`,
      tips: [
        'Comente nas primeiras 2 horas — o algoritmo prioriza interações recentes',
        'Adicione valor real, não apenas "ótimo post" ou emojis',
        'Termine com uma pergunta para aumentar a chance de resposta',
        'Foque em posts de pessoas influentes da área que você quer entrar'
      ],
      example: 'Concordo totalmente! Na minha experiência implementando OKRs, o maior desafio foi justamente o alinhamento entre times. Você usa alguma ferramenta específica para facilitar isso?'
    },
    {
      title: 'Mensagem para desconhecidos',
      description: 'Como abordar pessoas fora da sua rede sem parecer spam',
      icon: <Send className="h-4 w-4" />,
      template: `Assunto: [Algo específico sobre a pessoa ou empresa]

Olá [Nome],

Cheguei até você através de [como encontrou] e fiquei impressionado(a) com [algo específico].

Estou explorando oportunidades em [área] e acredito que 15 minutos de conversa com você me ajudaria muito a entender melhor [aspecto específico].

Teria disponibilidade para um papo rápido na próxima semana?

Agradeço desde já!`,
      tips: [
        'O assunto precisa gerar curiosidade — evite "Oportunidade" ou "Networking"',
        'Mostre que você pesquisou sobre a pessoa antes de escrever',
        'Seja específico sobre o que você quer aprender',
        'Peça pouco tempo (15-20 min) — aumenta a chance de sim'
      ],
      example: ''
    }
  ],
  presencial: [
    {
      title: 'Apresentação pessoal',
      description: 'Seja memorável em 30 segundos de conversa',
      icon: <Mic className="h-4 w-4" />,
      template: `Olá, sou [nome], [cargo/área atual ou em transição].

Nos últimos [tempo] venho trabalhando com [experiência relevante] e agora estou focado(a) em [objetivo].

Meu diferencial é [valor único que você oferece].

E você, com o que trabalha?`,
      tips: [
        'Pratique em voz alta até parecer natural, não decorado',
        'Adapte o tom para cada contexto (mais formal ou casual)',
        'Sempre termine com uma pergunta — isso transforma monólogo em conversa',
        'Sorria e mantenha contato visual — a energia importa tanto quanto as palavras'
      ],
      example: 'Oi, sou a Ana, Product Manager em transição da área de marketing. Tenho 5 anos liderando lançamentos de produto e agora quero aplicar isso em tech. Meu diferencial é entender profundamente o cliente. E você?'
    },
    {
      title: 'Troca de contatos',
      description: 'Saia do evento com conexões reais, não só cartões',
      icon: <Users className="h-4 w-4" />,
      template: `"Foi ótimo conversar sobre [tema]. Vamos nos conectar no LinkedIn para continuar essa conversa?"

ou

"Adorei conhecer seu trabalho em [área]. Posso te mandar uma mensagem depois para [motivo específico]?"`,
      tips: [
        'Mencione algo específico que vocês conversaram — mostra que você prestou atenção',
        'Dê um motivo claro para o contato futuro',
        'Pegue o celular e conecte na hora — esperar diminui as chances',
        'Mande uma mensagem em até 24h enquanto a lembrança está fresca'
      ],
      example: ''
    },
    {
      title: 'Mensagem pós-evento',
      description: 'Transforme um contato em relacionamento de verdade',
      icon: <Calendar className="h-4 w-4" />,
      template: `Olá [Nome]!

Foi um prazer te conhecer no [evento] ontem. Nossa conversa sobre [tema] foi muito valiosa para mim.

Como prometido, segue [link/material/contato mencionado].

Fico à disposição para continuarmos o papo!

Abraço`,
      tips: [
        'Envie em até 24 horas — depois disso a conexão esfria',
        'Mencione algo específico da conversa para mostrar que lembra',
        'Se puder, entregue algo de valor (artigo, contato, insight)',
        'Não peça nada na primeira mensagem — construa o relacionamento primeiro'
      ],
      example: ''
    }
  ],
  onetoone: [
    {
      title: 'Convite para um café',
      description: 'Peça tempo de alguém ocupado sem parecer oportunista',
      icon: <Coffee className="h-4 w-4" />,
      template: `Olá [Nome],

Tenho acompanhado seu trabalho em [área] e admiro muito sua trajetória, especialmente [algo específico].

Estou em um momento de [transição/exploração] e acredito que 15-20 minutos de conversa com você me daria uma perspectiva valiosa sobre [tema específico].

Teria disponibilidade nas próximas semanas? Posso me adaptar completamente ao seu horário.

Agradeço muito desde já!`,
      tips: [
        'Seja específico sobre o que você quer aprender — ninguém gosta de pedidos vagos',
        'Peça pouco tempo (15-20 min) — é mais fácil dizer sim',
        'Ofereça total flexibilidade de horário — você é quem está pedindo',
        'Mostre que pesquisou sobre a pessoa antes de pedir'
      ],
      example: ''
    },
    {
      title: 'Roteiro da conversa',
      description: 'Saiba exatamente o que perguntar e como conduzir o papo',
      icon: <MessageSquare className="h-4 w-4" />,
      template: `Roteiro sugerido para 20 minutos:

1. AGRADECER (2 min)
"Muito obrigado(a) por tirar esse tempo para conversar comigo..."

2. DAR CONTEXTO (3 min)
"Deixa eu te contar rapidamente onde estou e o que busco..."

3. FAZER PERGUNTAS (10-15 min)
- "Como foi sua trajetória até chegar em [área]?"
- "O que você gostaria de ter sabido antes de entrar?"
- "Quais habilidades são mais valorizadas hoje?"
- "Conhece alguém que eu deveria conversar também?"

4. ENCERRAR COM VALOR (2 min)
"Foi muito valioso para mim. Posso te mandar uma mensagem contando como usei seus conselhos?"`,
      tips: [
        'Prepare 3-5 perguntas antes — improviso pode parecer despreparo',
        'Ouça mais do que fala — a pessoa veio para ajudar, não para ouvir',
        'Anote os insights durante a conversa — mostra respeito pelo tempo',
        'Sempre peça indicações de outras pessoas para continuar o networking'
      ],
      example: ''
    },
    {
      title: 'Pedido de indicação',
      description: 'Peça uma referência sem gerar constrangimento',
      icon: <UserPlus className="h-4 w-4" />,
      template: `Para conhecer alguém da empresa:
"Vi que a [empresa] está com uma vaga de [cargo]. Você conhece alguém lá que eu pudesse conversar para entender melhor a cultura?"

Para ampliar sua rede:
"Estou muito interessado em [área/empresa]. Se você conhecer alguém que eu pudesse trocar uma ideia, ficaria muito grato por uma apresentação."

Para pedir recomendação direta (só após ter relacionamento):
"Estou aplicando para [vaga]. Você se sentiria confortável em me recomendar ou me apresentar ao time?"`,
      tips: [
        'Só peça indicação depois de construir algum relacionamento — nunca no primeiro contato',
        'Facilite o trabalho: envie seu currículo e LinkedIn junto do pedido',
        'Sempre dê uma saída fácil: "se você se sentir confortável..."',
        'Agradeça mesmo se a pessoa não puder ajudar — isso mantém a porta aberta'
      ],
      example: ''
    }
  ]
};

const pillarConfig = {
  digital: {
    title: 'Networking Digital',
    subtitle: 'LinkedIn, grupos e redes online',
    icon: <Smartphone className="h-5 w-5" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  presencial: {
    title: 'Networking Presencial',
    subtitle: 'Eventos, meetups e workshops',
    icon: <Mic className="h-5 w-5" />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  onetoone: {
    title: 'Conversas 1:1',
    subtitle: 'Coffee chats e pedidos de indicação',
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
              O que faz funcionar
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
              <h4 className="font-medium text-sm">Veja na prática</h4>
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
