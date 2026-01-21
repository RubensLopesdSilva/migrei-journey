import { useState, forwardRef } from "react";
import { Users, ArrowRight, UserPlus, MessageCircle, MessageSquare, Check, Loader2, Sparkles, Lightbulb, Coffee, Share2, RefreshCw, UserCheck, Heart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { focusRingClasses } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";
import { AnimatedProgress } from "@/components/ui/animated-container";
import { useNetworking, type NetworkingActionType } from "@/hooks/useNetworking";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import confetti from "canvas-confetti";
import { Skeleton } from "@/components/ui/skeleton";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 }
};

const getActionIcon = (type: NetworkingActionType) => {
  switch (type) {
    case 'connect': return UserPlus;
    case 'comment': return MessageCircle;
    case 'message': return MessageSquare;
    case 'coffee': return Coffee;
    case 'share': return Share2;
    case 'followup': return RefreshCw;
    case 'referral': return UserCheck;
    case 'thank': return Heart;
    case 'event': return Calendar;
    default: return Users;
  }
};

// Strategic context for each action type - explains WHY this matters
const actionStrategicContext: Record<NetworkingActionType, { 
  why: string; 
  tip: string;
  example: string;
}> = {
  connect: {
    why: "Cada conexão abre portas para oportunidades invisíveis",
    tip: "Conecte com pessoas 1-2 níveis acima de onde você quer chegar",
    example: "Ex: 'Vi seu post sobre [tema]. Estou em transição para [área] e adoraria trocar ideias.'"
  },
  comment: {
    why: "Comentários estratégicos te posicionam como referência",
    tip: "Pergunte sobre desafios reais, não elogie superficialmente",
    example: "Ex: 'Interessante! Como você lidou com [desafio específico] no início?'"
  },
  message: {
    why: "Mensagens diretas criam relacionamentos reais",
    tip: "Seja específico sobre o que quer aprender, não peça emprego",
    example: "Ex: 'Posso te fazer 2 perguntas sobre sua transição para [área]?'"
  },
  coffee: {
    why: "Conversas 1:1 aceleram sua transição mais do que qualquer curso",
    tip: "Peça 15-20 min, tenha perguntas preparadas, ofereça algo em troca",
    example: "Ex: 'Adoraria ouvir sobre sua jornada. Posso te pagar um café virtual de 15 min?'"
  },
  share: {
    why: "Compartilhar posiciona você como alguém em evolução ativa",
    tip: "Conte sobre aprendizados, não só conquistas - vulnerabilidade conecta",
    example: "Ex: 'Essa semana aprendi que [insight]. Alguém mais passou por isso?'"
  },
  followup: {
    why: "90% das oportunidades vêm de follow-ups - a maioria desiste cedo demais",
    tip: "Agradeça, compartilhe progresso, peça próximo passo",
    example: "Ex: 'Oi [nome], apliquei o que você sugeriu e [resultado]. Obrigado!'"
  },
  referral: {
    why: "Indicações têm 10x mais chances de virar entrevista",
    tip: "Facilite: envie seu currículo formatado e pontos-chave",
    example: "Ex: 'Você conhece alguém em [empresa/área]? Posso enviar meu perfil para facilitar?'"
  },
  thank: {
    why: "Gratidão fortalece laços e abre portas para futuras ajudas",
    tip: "Seja específico sobre o impacto que a pessoa teve",
    example: "Ex: 'Sua dica sobre [assunto] me ajudou a [resultado]. Muito obrigado!'"
  },
  event: {
    why: "Eventos são atalhos para conhecer várias pessoas relevantes de uma vez",
    tip: "Chegue cedo, faça 3 conexões significativas, siga no LinkedIn no mesmo dia",
    example: "Ex: Participei do [evento], conectei com [pessoa] e aprendi sobre [tema]."
  }
};

interface EvidenceFormData {
  targetName: string;
  profileUrl: string;
  description: string;
}

export const NetworkingCard = forwardRef<HTMLDivElement, object>(function NetworkingCard(_, ref) {
  const { 
    weeklyProgress, 
    getActionsWithGoalInfo, 
    completeAction, 
    loading,
    currentPhaseName 
  } = useNetworking();
  const { toast } = useToast();
  
  const [selectedAction, setSelectedAction] = useState<{
    actionType: NetworkingActionType;
    title: string;
    description: string;
  } | null>(null);
  
  const [formData, setFormData] = useState<EvidenceFormData>({
    targetName: '',
    profileUrl: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const actionsWithInfo = getActionsWithGoalInfo();

  const handleActionClick = (action: typeof actionsWithInfo[0]) => {
    if (action.isCompleted) return;
    
    setSelectedAction({
      actionType: action.action_type,
      title: action.title,
      description: action.description
    });
    setFormData({ targetName: '', profileUrl: '', description: '' });
  };

  const handleSubmitEvidence = async () => {
    if (!selectedAction) return;
    
    // Validate minimum evidence
    if (!formData.targetName.trim() && !formData.description.trim()) {
      toast({
        title: "Evidência necessária",
        description: "Preencha pelo menos o nome do contato ou uma descrição da ação.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    const result = await completeAction(selectedAction.actionType, {
      targetName: formData.targetName.trim() || undefined,
      profileUrl: formData.profileUrl.trim() || undefined,
      description: formData.description.trim() || undefined
    });

    setIsSubmitting(false);

    if (result.success) {
      setSelectedAction(null);
      
      // Show success feedback
      if (result.goalCompleted) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10B981', '#34D399', '#6EE7B7']
        });
        toast({
          title: "Networking registrado 🎉",
          description: `Cada conversa amplia sua visão. +${result.xpEarned} XP`
        });
      } else {
        toast({
          title: "Networking registrado",
          description: `Progresso salvo. +${result.xpEarned} XP`
        });
      }
    } else {
      toast({
        title: "Algo não saiu como esperado",
        description: result.error || "Tente novamente em instantes.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden h-full">
        <div className="p-4 border-b border-border/50">
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        ref={ref}
        className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col"
        data-tour="networking-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-phase-deslanchar/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-phase-deslanchar" aria-hidden="true" />
            </div>
            <div>
            <h3 className="font-semibold text-sm text-foreground">
                Networking estratégico
              </h3>
              <p className="text-[10px] text-muted-foreground">
                {weeklyProgress.completed}/{weeklyProgress.total} ações • +{weeklyProgress.earnedXP}/{weeklyProgress.potentialXP} XP
              </p>
            </div>
          </div>
          <Link 
            to="/networking"
            className={cn(
              "text-primary hover:text-primary/80 transition-colors p-2 -m-2 rounded-lg",
              focusRingClasses
            )}
            aria-label="Ver Networking"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Progress bar */}
        <div className="px-4 pt-3">
          <AnimatedProgress value={weeklyProgress.percentage} className="h-1.5" />
        </div>

        {/* Actions list */}
        <motion.div 
          className="p-3 space-y-1 flex-1"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {actionsWithInfo.map((action) => {
              const Icon = getActionIcon(action.action_type);
              const progressText = `${action.completed}/${action.target_count}`;
              
              return (
                <motion.div
                  key={action.id}
                  variants={itemVariants}
                  layout
                >
                  <button
                    onClick={() => handleActionClick(action)}
                    disabled={action.isCompleted}
                    className={cn(
                      "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-left group",
                      focusRingClasses,
                      action.isCompleted 
                        ? 'bg-phase-deslanchar/5 cursor-default' 
                        : 'hover:bg-muted/50 cursor-pointer'
                    )}
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      action.isCompleted 
                        ? "bg-phase-deslanchar/20" 
                        : "bg-muted group-hover:bg-phase-deslanchar/10"
                    )}>
                      {action.isCompleted ? (
                        <Check className="h-4 w-4 text-phase-deslanchar" />
                      ) : (
                        <Icon className={cn(
                          "h-4 w-4 text-muted-foreground group-hover:text-phase-deslanchar transition-colors"
                        )} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          action.isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
                        )}>
                          {action.title}
                        </p>
                        {!action.isCompleted && action.completed > 0 && (
                          <span className="text-[10px] text-phase-deslanchar font-medium">
                            {progressText}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {action.description}
                      </p>
                    </div>
                    <span className={cn(
                      "text-xs font-medium flex-shrink-0",
                      action.isCompleted ? 'text-phase-deslanchar' : 'text-muted-foreground'
                    )}>
                      +{action.xp_reward} XP
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Phase context badge */}
        <div className="px-4 pb-3">
          <div className="text-[10px] text-muted-foreground text-center py-1.5 px-3 bg-muted/50 rounded-lg">
            Fase atual: <span className="font-medium text-foreground">{currentPhaseName}</span>
          </div>
        </div>
      </motion.div>

      {/* Evidence Dialog with Strategic Context */}
      <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAction && (
                <>
                  {(() => {
                    const Icon = getActionIcon(selectedAction.actionType);
                    return <Icon className="h-5 w-5 text-phase-deslanchar" />;
                  })()}
                  {selectedAction.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-left">
              {selectedAction && actionStrategicContext[selectedAction.actionType]?.why}
            </DialogDescription>
          </DialogHeader>

          {/* Strategic tip box */}
          {selectedAction && (
            <div className="bg-phase-deslanchar/5 border border-phase-deslanchar/20 rounded-lg p-3 space-y-2">
              <p className="text-xs font-medium text-phase-deslanchar flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Dica estratégica
              </p>
              <p className="text-sm text-foreground">
                {actionStrategicContext[selectedAction.actionType]?.tip}
              </p>
              <p className="text-xs text-muted-foreground italic">
                {actionStrategicContext[selectedAction.actionType]?.example}
              </p>
            </div>
          )}

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="targetName">Com quem você interagiu? *</Label>
              <Input
                id="targetName"
                placeholder="Ex: Maria Santos, Head de Marketing na XYZ"
                value={formData.targetName}
                onChange={(e) => setFormData(prev => ({ ...prev, targetName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileUrl">Link do perfil (opcional)</Label>
              <Input
                id="profileUrl"
                placeholder="https://linkedin.com/in/..."
                value={formData.profileUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, profileUrl: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">O que você aprendeu ou descobriu?</Label>
              <Textarea
                id="description"
                placeholder="Ex: Descobri que a área de UX valoriza mais portfólio do que certificações..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
              <p className="text-[10px] text-muted-foreground">
                Registrar aprendizados ajuda a consolidar insights da sua jornada
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSelectedAction(null)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitEvidence}
              disabled={isSubmitting || (!formData.targetName.trim() && !formData.description.trim())}
              className="bg-phase-deslanchar hover:bg-phase-deslanchar/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar progresso"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

NetworkingCard.displayName = "NetworkingCard";
