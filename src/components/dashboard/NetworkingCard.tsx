import { useState, forwardRef } from "react";
import { Users, ArrowRight, UserPlus, MessageCircle, MessageSquare, Check, Loader2, Coffee, Share2, RefreshCw, UserCheck, Heart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { focusRingClasses } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";
import { useNetworking, type NetworkingActionType } from "@/hooks/useNetworking";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import confetti from "canvas-confetti";
import { Skeleton } from "@/components/ui/skeleton";
import { PHASE_COLORS } from "@/data/phaseIntroData";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
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

// Compact strategic tips
const actionTips: Record<NetworkingActionType, string> = {
  connect: "Conecte com pessoas 1-2 níveis acima",
  comment: "Pergunte, não elogie superficialmente",
  message: "Seja específico sobre o que quer aprender",
  coffee: "Peça 15 min, tenha perguntas prontas",
  share: "Conte aprendizados, não só conquistas",
  followup: "Agradeça e compartilhe progresso",
  referral: "Facilite: envie perfil formatado",
  thank: "Seja específico sobre o impacto",
  event: "Faça 3 conexões, siga no mesmo dia"
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
    currentPhaseNumber
  } = useNetworking();
  const { toast } = useToast();
  
  const [selectedAction, setSelectedAction] = useState<{
    actionType: NetworkingActionType;
    title: string;
  } | null>(null);
  
  const [formData, setFormData] = useState<EvidenceFormData>({
    targetName: '',
    profileUrl: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const actionsWithInfo = getActionsWithGoalInfo();
  const phaseColor = PHASE_COLORS[currentPhaseNumber as keyof typeof PHASE_COLORS] || PHASE_COLORS[5];

  const handleActionClick = (action: typeof actionsWithInfo[0]) => {
    if (action.isCompleted) return;
    setSelectedAction({
      actionType: action.action_type,
      title: action.title
    });
    setFormData({ targetName: '', profileUrl: '', description: '' });
  };

  const handleSubmitEvidence = async () => {
    if (!selectedAction) return;
    
    if (!formData.targetName.trim() && !formData.description.trim()) {
      toast({
        title: "Evidência necessária",
        description: "Preencha pelo menos o nome do contato ou descrição.",
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
      
      if (result.goalCompleted) {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#10B981', '#34D399', '#6EE7B7']
        });
        toast({
          title: "Networking registrado 🎉",
          description: `+${result.xpEarned} XP`
        });
      } else {
        toast({
          title: "Progresso salvo",
          description: `+${result.xpEarned} XP`
        });
      }
    } else {
      toast({
        title: "Erro ao salvar",
        description: result.error || "Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-4 h-full">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // Show only first 3 actions for compact view
  const displayActions = actionsWithInfo.slice(0, 3);

  return (
    <>
      <motion.div 
        ref={ref}
        className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col"
        data-tour="networking-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        {/* Compact Header */}
        <div className="p-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${phaseColor}15` }}
            >
              <Users className="h-4 w-4" style={{ color: phaseColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground">
                  Networking
                </h3>
                <Link 
                  to="/networking"
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 rounded",
                    focusRingClasses
                  )}
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {/* Inline progress bar */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: phaseColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${weeklyProgress.percentage}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {weeklyProgress.completed}/{weeklyProgress.total}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions list - compact */}
        <motion.div 
          className="px-4 pb-4 space-y-0.5 flex-1"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {displayActions.map((action) => {
              const Icon = getActionIcon(action.action_type);
              
              return (
                <motion.div key={action.id} variants={itemVariants} layout>
                  <button
                    onClick={() => handleActionClick(action)}
                    disabled={action.isCompleted}
                    className={cn(
                      "w-full flex items-center gap-2.5 py-2 px-2 rounded-lg transition-all text-left",
                      focusRingClasses,
                      action.isCompleted 
                        ? 'opacity-60 cursor-default' 
                        : 'hover:bg-muted/40 cursor-pointer'
                    )}
                  >
                    <div 
                      className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0",
                        action.isCompleted ? "bg-primary" : "border-2"
                      )}
                      style={{ borderColor: action.isCompleted ? undefined : `${phaseColor}40` }}
                    >
                      {action.isCompleted ? (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      ) : (
                        <Icon className="h-2.5 w-2.5" style={{ color: phaseColor }} />
                      )}
                    </div>
                    <span className={cn(
                      "text-sm flex-1 truncate",
                      action.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                    )}>
                      {action.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">
                      +{action.xp_reward}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Simplified Evidence Dialog */}
      <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              {selectedAction?.title}
            </DialogTitle>
          </DialogHeader>

          {/* Compact tip */}
          {selectedAction && (
            <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
              💡 {actionTips[selectedAction.actionType]}
            </p>
          )}

          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="targetName" className="text-xs">Com quem?</Label>
              <Input
                id="targetName"
                placeholder="Nome e cargo"
                value={formData.targetName}
                onChange={(e) => setFormData(prev => ({ ...prev, targetName: e.target.value }))}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs">O que aprendeu? (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Insight principal..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAction(null)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitEvidence}
              disabled={isSubmitting || (!formData.targetName.trim() && !formData.description.trim())}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Registrar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

NetworkingCard.displayName = "NetworkingCard";
