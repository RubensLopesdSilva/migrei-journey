import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Celebration types with different visual effects
export type CelebrationType = 
  | "mission_complete" 
  | "phase_complete" 
  | "badge_earned" 
  | "xp_milestone" 
  | "streak"
  | "first_login";

interface CelebrationConfig {
  confettiCount: number;
  spread: number;
  colors: string[];
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  duration: number;
}

const celebrationConfigs: Record<CelebrationType, CelebrationConfig> = {
  mission_complete: {
    confettiCount: 50,
    spread: 60,
    colors: ["#10B981", "#34D399", "#6EE7B7"],
    icon: Zap,
    title: "Missão Concluída!",
    duration: 2000,
  },
  phase_complete: {
    confettiCount: 150,
    spread: 100,
    colors: ["#F59E0B", "#FBBF24", "#FCD34D", "#8B5CF6", "#A78BFA"],
    icon: Trophy,
    title: "Fase Completa! 🎉",
    subtitle: "Você desbloqueou a próxima fase!",
    duration: 4000,
  },
  badge_earned: {
    confettiCount: 80,
    spread: 70,
    colors: ["#8B5CF6", "#A78BFA", "#C4B5FD"],
    icon: Star,
    title: "Novo Badge!",
    duration: 3000,
  },
  xp_milestone: {
    confettiCount: 60,
    spread: 50,
    colors: ["#3B82F6", "#60A5FA", "#93C5FD"],
    icon: Sparkles,
    title: "Marco de XP!",
    duration: 2500,
  },
  streak: {
    confettiCount: 70,
    spread: 55,
    colors: ["#EC4899", "#F472B6", "#F9A8D4"],
    icon: Sparkles,
    title: "Sequência Mantida!",
    duration: 2500,
  },
  first_login: {
    confettiCount: 40,
    spread: 45,
    colors: ["#F59E0B", "#FBBF24", "#FCD34D"],
    icon: Sparkles,
    title: "Bem-vindo de volta!",
    subtitle: "Mais um dia na sua jornada",
    duration: 2000,
  },
};

export function triggerConfetti(type: CelebrationType = "mission_complete") {
  const config = celebrationConfigs[type];
  
  // Main burst
  confetti({
    particleCount: config.confettiCount,
    spread: config.spread,
    origin: { y: 0.6 },
    colors: config.colors,
  });

  // Side bursts for bigger celebrations
  if (type === "phase_complete") {
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: config.colors,
      });
    }, 150);

    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: config.colors,
      });
    }, 300);
  }
}

interface CelebrationModalProps {
  type: CelebrationType;
  isOpen: boolean;
  onClose: () => void;
  customTitle?: string;
  customSubtitle?: string;
  xpEarned?: number;
  badgeName?: string;
}

export function CelebrationModal({
  type,
  isOpen,
  onClose,
  customTitle,
  customSubtitle,
  xpEarned,
  badgeName,
}: CelebrationModalProps) {
  const config = celebrationConfigs[type];
  const Icon = config.icon;

  useEffect(() => {
    if (isOpen) {
      triggerConfetti(type);
      
      // Auto-close after duration
      const timer = setTimeout(() => {
        onClose();
      }, config.duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, type, config.duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-card/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-border/50 text-center max-w-sm mx-4 pointer-events-auto"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            onClick={onClose}
          >
            {/* Animated Icon */}
            <motion.div
              className={cn(
                "w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4",
                "bg-gradient-to-br from-primary/20 to-primary/5"
              )}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 10 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: 2,
                  repeatType: "reverse"
                }}
              >
                <Icon className="h-10 w-10 text-primary" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-2xl font-bold text-foreground mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {customTitle || config.title}
            </motion.h2>

            {/* Subtitle */}
            {(customSubtitle || config.subtitle || badgeName) && (
              <motion.p
                className="text-muted-foreground mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {customSubtitle || badgeName || config.subtitle}
              </motion.p>
            )}

            {/* XP Badge */}
            {xpEarned && (
              <motion.div
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="h-4 w-4" />
                +{xpEarned} XP
              </motion.div>
            )}

            {/* Tap to dismiss hint */}
            <motion.p
              className="text-xs text-muted-foreground mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8 }}
            >
              Toque para fechar
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing celebrations
export function useCelebration() {
  const celebrate = useCallback((
    type: CelebrationType,
    options?: {
      title?: string;
      subtitle?: string;
      xp?: number;
    }
  ) => {
    // Dispatch custom event for the celebration
    const event = new CustomEvent("migrei-celebration", {
      detail: { type, ...options }
    });
    window.dispatchEvent(event);
    
    // Always trigger confetti immediately
    triggerConfetti(type);
  }, []);

  return { celebrate, triggerConfetti };
}
