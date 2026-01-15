import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, Lightbulb, Search, Target, Settings, Rocket, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { Link } from "react-router-dom";

const phaseIcons: Record<string, React.ElementType> = {
  despertar: Lightbulb,
  descobrir: Search,
  decidir: Target,
  desenvolver: Settings,
  deslanchar: Rocket,
  desfrutar: Star,
};

const phaseColors: Record<string, string> = {
  despertar: "#F59E0B",
  descobrir: "#10B981",
  decidir: "#3B82F6",
  desenvolver: "#8B5CF6",
  deslanchar: "#EC4899",
  desfrutar: "#F97316",
};

const phaseMessages: Record<string, { title: string; subtitle: string; description: string }> = {
  despertar: {
    title: "Fase Despertar",
    subtitle: "O início da sua jornada!",
    description: "Você está dando o primeiro passo para transformar sua carreira. Nesta fase, vamos mapear suas dores e motivações para iniciar sua mudança profissional."
  },
  descobrir: {
    title: "Fase Descobrir",
    subtitle: "Hora de se conhecer melhor!",
    description: "Explore suas habilidades, valores e interesses. Nesta fase, você vai descobrir seu perfil profissional e identificar caminhos possíveis."
  },
  decidir: {
    title: "Fase Decidir",
    subtitle: "Clareza nas escolhas!",
    description: "Com base no que descobriu, agora é hora de definir sua rota. Vamos criar metas claras e um plano de ação para os próximos 90 dias."
  },
  desenvolver: {
    title: "Fase Desenvolver",
    subtitle: "Construindo seu futuro!",
    description: "Prepare-se para o mercado. Nesta fase, você vai otimizar seu LinkedIn, currículo, pitch e desenvolver as competências necessárias."
  },
  deslanchar: {
    title: "Fase Deslanchar",
    subtitle: "É hora de brilhar!",
    description: "Coloque tudo em prática! Candidate-se a vagas, faça networking ativo e prepare-se para entrevistas. A transição está acontecendo."
  },
  desfrutar: {
    title: "Fase Desfrutar",
    subtitle: "Você conseguiu!",
    description: "Celebre suas conquistas e consolide os aprendizados. Documente sua jornada e prepare-se para continuar evoluindo."
  },
};

const phaseNumberToSlug: Record<number, string> = {
  1: "despertar",
  2: "descobrir",
  3: "decidir",
  4: "desenvolver",
  5: "deslanchar",
  6: "desfrutar",
};

interface PhaseWelcomeModalProps {
  forceOpen?: boolean;
}

export function PhaseWelcomeModal({ forceOpen = false }: PhaseWelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { userProgress, phases } = useProgress();

  const currentPhaseData = phases?.find(p => p.id === userProgress?.current_phase_id);
  const phaseSlug = currentPhaseData?.phase_number 
    ? phaseNumberToSlug[currentPhaseData.phase_number] 
    : "despertar";
  
  const PhaseIcon = phaseIcons[phaseSlug] || Lightbulb;
  const phaseColor = phaseColors[phaseSlug] || "#F59E0B";
  const phaseMessage = phaseMessages[phaseSlug] || phaseMessages.despertar;
  const phaseNumber = currentPhaseData?.phase_number || 1;

  // Open when forceOpen changes to true
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const phaseLink = `/fase/${phaseSlug}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
              {/* Header with phase color accent */}
              <div 
                className="relative h-32 flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${phaseColor}20 0%, ${phaseColor}05 100%)`,
                  borderBottom: `2px solid ${phaseColor}30`
                }}
              >
                {/* Decorative circles */}
                <div 
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
                  style={{ backgroundColor: phaseColor }}
                />
                <div 
                  className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full opacity-10"
                  style={{ backgroundColor: phaseColor }}
                />

                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors"
                >
                  <X className="h-5 w-5 text-foreground/70" />
                </button>

                {/* Phase icon */}
                <motion.div
                  className="relative z-10 h-20 w-20 rounded-2xl flex items-center justify-center"
                  style={{ 
                    backgroundColor: phaseColor,
                    boxShadow: `0 10px 40px -10px ${phaseColor}80`
                  }}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                  <PhaseIcon className="h-10 w-10 text-white" strokeWidth={2} />
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4" style={{ color: phaseColor }} />
                    <span 
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: phaseColor }}
                    >
                      Fase {phaseNumber}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {phaseMessage.title}
                  </h2>
                  
                  <p 
                    className="text-sm font-medium mb-4"
                    style={{ color: phaseColor }}
                  >
                    {phaseMessage.subtitle}
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {phaseMessage.description}
                  </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                  className="flex flex-col gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    asChild
                    className="w-full"
                    style={{ 
                      backgroundColor: phaseColor,
                      color: 'white'
                    }}
                  >
                    <Link to={phaseLink} onClick={() => setIsOpen(false)}>
                      Ir para a fase
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    Continuar no dashboard
                  </Button>
                </motion.div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
