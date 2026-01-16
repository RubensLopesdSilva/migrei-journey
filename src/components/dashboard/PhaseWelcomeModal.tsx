import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Lightbulb, Search, Target, Settings, Rocket, Star, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { useAgent } from "@/hooks/useAgent";
import { Link } from "react-router-dom";

// Agent avatar imports
import lumiAvatar from "@/assets/agents/lumi.png";
import noahAvatar from "@/assets/agents/noah.png";
import mayaAvatar from "@/assets/agents/maya.png";
import kaiAvatar from "@/assets/agents/kai.png";
import leoAvatar from "@/assets/agents/leo.png";
import emaAvatar from "@/assets/agents/ema.png";

const agentAvatars: Record<string, string> = {
  "Lumi": lumiAvatar,
  "Noah": noahAvatar,
  "Maya": mayaAvatar,
  "Kai": kaiAvatar,
  "Leo": leoAvatar,
  "Ema": emaAvatar,
};

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

// QUICK WINS - O que o usuário ganha HOJE
const phaseQuickWins: Record<string, { 
  time: string; 
  result: string; 
  firstTask: string;
  benefits: string[];
}> = {
  despertar: {
    time: "5 min",
    result: "Seu primeiro diagnóstico de carreira",
    firstTask: "Responder o teste de consciência",
    benefits: ["Clareza sobre suas dores", "Mapeamento de bloqueios", "Declaração de compromisso"]
  },
  descobrir: {
    time: "15 min",
    result: "Mapa visual dos seus talentos",
    firstTask: "Fazer o diagnóstico de competências",
    benefits: ["Roda da carreira preenchida", "Radar de habilidades", "Relatório de clareza"]
  },
  decidir: {
    time: "20 min",
    result: "Sua rota de transição definida",
    firstTask: "Preencher a matriz de possibilidades",
    benefits: ["Meta SMART definida", "Plano de 90 dias", "Mapa de lacunas"]
  },
  desenvolver: {
    time: "30 min",
    result: "Currículo e LinkedIn otimizados",
    firstTask: "Gerar seu currículo com IA",
    benefits: ["Currículo profissional", "Pitch de apresentação", "Checklist LinkedIn"]
  },
  deslanchar: {
    time: "15 min",
    result: "Rotina de candidaturas ativa",
    firstTask: "Configurar seu painel de execução",
    benefits: ["Diário de oportunidades", "Rotina de networking", "Simulador de entrevistas"]
  },
  desfrutar: {
    time: "10 min",
    result: "Celebração e próximo ciclo",
    firstTask: "Avaliar seus resultados",
    benefits: ["Linha de conquistas", "Relatório final", "Planejamento do próximo ciclo"]
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
  const { currentAgent } = useAgent();

  const currentPhaseData = phases?.find(p => p.id === userProgress?.current_phase_id);
  const phaseSlug = currentPhaseData?.phase_number 
    ? phaseNumberToSlug[currentPhaseData.phase_number] 
    : "despertar";
  
  const PhaseIcon = phaseIcons[phaseSlug] || Lightbulb;
  const phaseColor = phaseColors[phaseSlug] || "#F59E0B";
  const quickWin = phaseQuickWins[phaseSlug] || phaseQuickWins.despertar;
  const phaseNumber = currentPhaseData?.phase_number || 1;
  
  // Agent avatar
  const agentAvatar = currentAgent ? (agentAvatars[currentAgent.name] || lumiAvatar) : null;

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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
                {/* Header with agent */}
                <div 
                  className="relative px-6 pt-6 pb-4 flex items-center gap-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${phaseColor}15 0%, ${phaseColor}05 100%)`,
                  }}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors"
                  >
                    <X className="h-5 w-5 text-foreground/70" />
                  </button>

                  {/* Agent avatar */}
                  {agentAvatar && (
                    <motion.img 
                      src={agentAvatar} 
                      alt={currentAgent?.name}
                      className="h-14 w-14 rounded-full object-cover ring-4 ring-white/30 flex-shrink-0"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring" }}
                    />
                  )}
                  
                  <div className="flex-1">
                    <motion.p 
                      className="text-sm text-muted-foreground"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      {currentAgent?.name || "Seu coach"} diz:
                    </motion.p>
                    <motion.h2 
                      className="text-lg font-bold text-foreground"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Você está pronto para começar! 🎉
                    </motion.h2>
                  </div>
                </div>

                {/* Quick Win Promise */}
                <div className="px-6 py-4 border-b border-border/50">
                  <motion.div
                    className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <div 
                      className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: phaseColor }}
                    >
                      <PhaseIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Em <strong>{quickWin.time}</strong> você terá:
                      </p>
                      <p className="text-sm text-primary font-semibold">
                        {quickWin.result}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* What you'll do */}
                <div className="px-6 py-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-3">
                      Fase {phaseNumber} • O que você vai conquistar
                    </p>
                    
                    <div className="space-y-2">
                      {quickWin.benefits.map((benefit, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center gap-2 text-sm text-foreground/80"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 + index * 0.05 }}
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <motion.div
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="w-full"
                      style={{ 
                        backgroundColor: phaseColor,
                        color: 'white'
                      }}
                    >
                      <Link to={phaseLink} onClick={() => setIsOpen(false)}>
                        <Clock className="mr-2 h-4 w-4" />
                        {quickWin.firstTask}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      Explorar o dashboard primeiro
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
