import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Lightbulb, 
  Search, 
  Target, 
  Wrench, 
  Rocket, 
  Trophy 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { PHASE_COLORS } from "@/data/phaseIntroData";
import type { LucideIcon } from "lucide-react";

// Mapa de ícones por fase
const PHASE_ICONS: Record<number, LucideIcon> = {
  1: Lightbulb,  // Despertar
  2: Search,     // Descobrir
  3: Target,     // Decidir
  4: Wrench,     // Desenvolver
  5: Rocket,     // Deslanchar
  6: Trophy,     // Desfrutar
};

export function CurrentPhaseButton() {
  const navigate = useNavigate();
  const { currentPhase, phasesWithProgress } = useProgress();

  if (!currentPhase) return null;

  // Encontrar progresso da fase atual
  const phaseData = phasesWithProgress.find(p => p.id === currentPhase.id);
  const progress = phaseData ? 
    (phaseData.totalActivities > 0 ? (phaseData.completedActivities / phaseData.totalActivities) * 100 : 0) 
    : 0;
  const hasStarted = progress > 0;
  const phaseColor = PHASE_COLORS[currentPhase.phase_number] || PHASE_COLORS[1];
  
  // Ícone dinâmico baseado na fase atual
  const PhaseIcon = PHASE_ICONS[currentPhase.phase_number] || Lightbulb;

  const handleClick = () => {
    navigate(`/fase/${currentPhase.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Button
        onClick={handleClick}
        className="w-full h-14 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
        style={{ backgroundColor: phaseColor }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 flex items-center justify-between w-full px-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
              <PhaseIcon className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-xs text-white/80 font-medium">
                {hasStarted ? "Continuar jornada" : "Começar agora"}
              </p>
              <p className="text-sm font-bold">
                Fase {currentPhase.phase_number}: {currentPhase.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasStarted && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {Math.round(progress)}%
              </span>
            )}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Button>
    </motion.div>
  );
}
