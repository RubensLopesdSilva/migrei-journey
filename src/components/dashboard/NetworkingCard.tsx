import { useState } from "react";
import { Users, ArrowRight, UserPlus, MessageCircle, MessageSquare, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { focusRingClasses } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";
import { AnimatedProgress } from "@/components/ui/animated-container";
import { useNetworking } from "@/hooks/useNetworking";
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

const getActionIcon = (type: 'connect' | 'comment' | 'message') => {
  switch (type) {
    case 'connect': return UserPlus;
    case 'comment': return MessageCircle;
    case 'message': return MessageSquare;
    default: return Users;
  }
};

interface EvidenceFormData {
  targetName: string;
  profileUrl: string;
  description: string;
}

export function NetworkingCard() {
  const { 
    weeklyProgress, 
    getActionsWithGoalInfo, 
    completeAction, 
    loading,
    currentPhaseName 
  } = useNetworking();
  const { toast } = useToast();
  
  const [selectedAction, setSelectedAction] = useState<{
    actionType: 'connect' | 'comment' | 'message';
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
          title: "🎉 Meta concluída!",
          description: `Você completou ${selectedAction.title} esta semana! +${result.xpEarned} XP`
        });
      } else {
        toast({
          title: "✅ Ação registrada!",
          description: `Ótimo networking! +${result.xpEarned} XP`
        });
      }
    } else {
      toast({
        title: "Erro",
        description: result.error || "Não foi possível registrar a ação.",
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
                Networking semanal
              </h3>
              <p className="text-[10px] text-muted-foreground">
                {weeklyProgress.completed}/{weeklyProgress.total} ações • +{weeklyProgress.earnedXP}/{weeklyProgress.potentialXP} XP
              </p>
            </div>
          </div>
          <Link 
            to="/comunidade"
            className={cn(
              "text-primary hover:text-primary/80 transition-colors p-2 -m-2 rounded-lg",
              focusRingClasses
            )}
            aria-label="Ver comunidade"
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

      {/* Evidence Dialog */}
      <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}>
        <DialogContent className="sm:max-w-md">
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
            <DialogDescription>
              Registre sua ação de networking com evidências para validar e ganhar XP.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="targetName">Nome do contato *</Label>
              <Input
                id="targetName"
                placeholder="Ex: João Silva"
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
              <Label htmlFor="description">Descrição da ação</Label>
              <Textarea
                id="description"
                placeholder="Descreva brevemente a ação realizada..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
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
                  Salvando...
                </>
              ) : (
                "Concluir ação"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
