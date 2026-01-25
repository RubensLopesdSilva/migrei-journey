import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowRight, Clock, Flame, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useProgress } from "@/hooks/useProgress";

// Motivational messages based on days inactive
const getInactivityMessage = (daysInactive: number): { title: string; message: string; urgency: 'low' | 'medium' | 'high' } => {
  if (daysInactive >= 14) {
    return {
      title: "Sua transição está esperando por você",
      message: "Já se passaram 2 semanas. Cada dia conta para sua evolução profissional.",
      urgency: 'high'
    };
  }
  if (daysInactive >= 7) {
    return {
      title: "Volte a ganhar ritmo",
      message: "Uma semana de pausa pode ser recuperada. 5 minutos hoje fazem diferença.",
      urgency: 'medium'
    };
  }
  if (daysInactive >= 3) {
    return {
      title: "Senti sua falta por aqui!",
      message: "Consistência é o segredo. Que tal retomar de onde parou?",
      urgency: 'low'
    };
  }
  return { title: "", message: "", urgency: 'low' };
};

export function InactivityBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { userProgress } = useProgress();

  // Calculate days since last activity
  const daysInactive = userProgress?.last_activity_at
    ? Math.floor((Date.now() - new Date(userProgress.last_activity_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Don't show if less than 3 days inactive or dismissed
  if (daysInactive < 3 || isDismissed) {
    return null;
  }

  const { title, message, urgency } = getInactivityMessage(daysInactive);

  const urgencyStyles = {
    low: {
      bg: 'bg-gradient-to-r from-amber-500/10 to-amber-500/5',
      border: 'border-amber-500/30',
      icon: 'text-amber-500',
      iconBg: 'bg-amber-500/20'
    },
    medium: {
      bg: 'bg-gradient-to-r from-orange-500/10 to-orange-500/5',
      border: 'border-orange-500/30',
      icon: 'text-orange-500',
      iconBg: 'bg-orange-500/20'
    },
    high: {
      bg: 'bg-gradient-to-r from-red-500/10 to-red-500/5',
      border: 'border-red-500/30',
      icon: 'text-red-500',
      iconBg: 'bg-red-500/20'
    }
  };

  const styles = urgencyStyles[urgency];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative rounded-xl border ${styles.bg} ${styles.border} overflow-hidden`}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-start sm:items-center gap-4">
            {/* Icon */}
            <motion.div 
              className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl ${styles.iconBg} flex items-center justify-center flex-shrink-0`}
              animate={urgency === 'high' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {urgency === 'high' ? (
                <AlertTriangle className={`h-5 w-5 sm:h-6 sm:w-6 ${styles.icon}`} />
              ) : (
                <Clock className={`h-5 w-5 sm:h-6 sm:w-6 ${styles.icon}`} />
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground text-sm sm:text-base">
                  {title}
                </h4>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${styles.iconBg} ${styles.icon}`}>
                  {daysInactive} dias
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {message}
              </p>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/fase/despertar">
                <Button 
                  size="sm" 
                  className="gap-1.5 h-9 btn-primary-gradient"
                >
                  <Flame className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Retomar jornada</span>
                  <span className="sm:hidden">Retomar</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
