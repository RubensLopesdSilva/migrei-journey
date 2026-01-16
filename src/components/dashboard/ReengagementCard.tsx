import { useState, useEffect } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useAgent } from "@/hooks/useAgent";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Target,
  MessageCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInDays, differenceInHours } from "date-fns";
import { Link } from "react-router-dom";

interface ReengagementCardProps {
  onDismiss?: () => void;
}

// Messages based on inactivity duration
const getReengagementMessage = (daysInactive: number, phaseName: string, agentName?: string) => {
  if (daysInactive >= 7) {
    return {
      severity: 'high',
      title: `${agentName || 'Seu mentor'} está te esperando`,
      message: `Faz ${daysInactive} dias que você não aparece. Sua jornada na fase ${phaseName} está pausada, mas não precisa ficar.`,
      cta: "Retomar de onde parei",
      subtext: "5 minutos é tudo que você precisa para voltar ao ritmo"
    };
  } else if (daysInactive >= 3) {
    return {
      severity: 'medium',
      title: "O momentum é tudo em transições",
      message: `Você estava avançando bem na fase ${phaseName}. Que tal completar uma missão rápida hoje?`,
      cta: "Ver próxima missão",
      subtext: "Consistência supera intensidade"
    };
  } else if (daysInactive >= 1) {
    return {
      severity: 'low',
      title: "Bom te ver de volta!",
      message: `A fase ${phaseName} tem novidades esperando por você.`,
      cta: "Continuar",
      subtext: null
    };
  }
  return null;
};

export function ReengagementCard({ onDismiss }: ReengagementCardProps) {
  const { userProgress, currentPhase } = useProgress();
  const { currentAgent } = useAgent();
  const [dismissed, setDismissed] = useState(false);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Check if user has been inactive
    if (userProgress?.last_activity_at) {
      const lastActivity = new Date(userProgress.last_activity_at);
      const now = new Date();
      const daysInactive = differenceInDays(now, lastActivity);
      
      // Show card if inactive for more than 1 day
      setShowCard(daysInactive >= 1);
    }
  }, [userProgress?.last_activity_at]);

  if (!showCard || dismissed || !userProgress?.last_activity_at) {
    return null;
  }

  const lastActivity = new Date(userProgress.last_activity_at);
  const daysInactive = differenceInDays(new Date(), lastActivity);
  const phaseName = currentPhase?.name || 'Despertar';
  const agentName = currentAgent?.name;

  const message = getReengagementMessage(daysInactive, phaseName, agentName);
  
  if (!message) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const severityColors = {
    high: 'border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5',
    medium: 'border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10',
    low: 'border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5'
  };

  const iconColors = {
    high: 'from-amber-500 to-orange-500',
    medium: 'from-primary to-primary',
    low: 'from-green-500 to-emerald-500'
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`relative overflow-hidden ${severityColors[message.severity]}`}>
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground z-10"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-4 space-y-3">
              {/* Header with agent avatar or icon */}
              <div className="flex items-start gap-3">
                {currentAgent?.avatar_url ? (
                  <img 
                    src={currentAgent.avatar_url} 
                    alt={currentAgent.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                  />
                ) : (
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${iconColors[message.severity]} flex-shrink-0`}>
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                    {message.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {message.message}
                  </p>
                </div>
              </div>

              {/* Time indicator */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Última atividade há {daysInactive} {daysInactive === 1 ? 'dia' : 'dias'}</span>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="flex-1 text-muted-foreground text-xs"
                >
                  Lembrar depois
                </Button>
                <Button
                  size="sm"
                  asChild
                  className={`flex-1 gap-1.5 text-xs ${
                    message.severity === 'high' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                      : ''
                  }`}
                >
                  <Link to={currentPhase ? `/fase-${currentPhase.phase_number}-${currentPhase.slug}` : '/progresso'}>
                    {message.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              {/* Subtext */}
              {message.subtext && (
                <p className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {message.subtext}
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}