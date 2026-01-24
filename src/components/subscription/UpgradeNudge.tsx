import { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Crown, 
  ArrowRight, 
  X, 
  Sparkles, 
  TrendingUp,
  Target,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UpgradeNudgeProps {
  trigger: 'phase_complete' | 'mission_complete' | 'xp_milestone' | 'time_based';
  context?: {
    phaseName?: string;
    xpEarned?: number;
    missionName?: string;
  };
  onDismiss?: () => void;
}

// Contextual messages based on trigger type
const nudgeMessages = {
  phase_complete: {
    title: "Você completou uma fase! 🎉",
    subtitle: "Seu progresso mostra que você leva isso a sério.",
    cta: "Continuar minha jornada",
    benefit: "Desbloqueie as próximas 4 fases e acelere sua transição"
  },
  mission_complete: {
    title: "Missão concluída!",
    subtitle: "Você está criando momentum. Não pare agora.",
    cta: "Ver mais missões",
    benefit: "Assinantes completam a transição 2x mais rápido"
  },
  xp_milestone: {
    title: "Novo recorde de XP!",
    subtitle: "Seu engajamento está acima da média.",
    cta: "Desbloquear tudo",
    benefit: "Multiplique seus resultados com acesso completo"
  },
  time_based: {
    title: "Você está no caminho certo",
    subtitle: "Já são alguns dias de jornada. O próximo passo é crucial.",
    cta: "Acelerar minha transição",
    benefit: "O plano Essencial desbloqueia ferramentas de decisão e ação"
  }
};

export function UpgradeNudge({ trigger, context, onDismiss }: UpgradeNudgeProps) {
  const { planSlug, createCheckout, isLoading } = useSubscription();
  const { userProgress } = useProgress();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Don't show to paid users
  if (planSlug !== 'free' || dismissed || isLoading) {
    return null;
  }

  const message = nudgeMessages[trigger];

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const url = await createCheckout("essential");
      if (url) {
        window.open(url, "_blank");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative overflow-hidden border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-5 space-y-4">
              {/* Header with icon */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex-shrink-0">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {message.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {message.subtitle}
                  </p>
                </div>
              </div>

              {/* Context-specific message */}
              {context?.phaseName && (
                <div className="flex items-center gap-2 text-sm bg-green-500/10 text-green-600 rounded-lg p-2.5">
                  <Sparkles className="h-4 w-4" />
                  <span>Você completou a fase <strong>{context.phaseName}</strong></span>
                </div>
              )}

              {context?.xpEarned && (
                <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary rounded-lg p-2.5">
                  <Zap className="h-4 w-4" />
                  <span>+{context.xpEarned} XP conquistados!</span>
                </div>
              )}

              {/* Benefit highlight */}
              <div className="flex items-start gap-2.5 text-sm">
                <TrendingUp className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{message.benefit}</span>
              </div>

              {/* Progress indicator - show how close they are */}
              {userProgress && (
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" />
                  <span>
                    Fase {userProgress.current_phase_number}/2 do plano gratuito • 
                    <span className="text-foreground font-medium"> Faltam 4 fases</span>
                  </span>
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="flex-1 text-muted-foreground"
                >
                  Agora não
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="flex-1 gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  {message.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Price anchor */}
              <p className="text-center text-[10px] text-muted-foreground">
                A partir de R$ 59/mês • Sem compromisso
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to determine when to show upgrade nudge
export function useUpgradeNudgeTrigger() {
  const { planSlug } = useSubscription();
  const { userProgress, overallProgress } = useProgress();

  const shouldShowNudge = () => {
    if (planSlug !== 'free') return null;
    
    // Check for phase completion trigger - when user is near end of phase 2
    if (userProgress?.current_phase_number === 2 && overallProgress >= 30) {
      return { trigger: 'phase_complete' as const, context: { phaseName: 'Descobrir' } };
    }

    // Check for XP milestone
    if (userProgress?.total_xp && userProgress.total_xp >= 500 && userProgress.total_xp < 600) {
      return { trigger: 'xp_milestone' as const, context: { xpEarned: userProgress.total_xp } };
    }

    return null;
  };

  return { shouldShowNudge };
}