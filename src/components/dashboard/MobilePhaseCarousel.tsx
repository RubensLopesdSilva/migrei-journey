import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, 
  Search, 
  Target, 
  Wrench, 
  Rocket, 
  Trophy,
  Check,
  Lock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PHASE_COLORS } from "@/data/phaseIntroData";

interface Phase {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  route: string;
  phaseNumber: number;
}

const phases: Phase[] = [
  { 
    id: "despertar", 
    name: "Despertar", 
    icon: Lightbulb, 
    color: PHASE_COLORS[1],
    description: "Perceba a necessidade de mudança",
    route: "/fase/despertar",
    phaseNumber: 1
  },
  { 
    id: "descobrir", 
    name: "Descobrir", 
    icon: Search, 
    color: PHASE_COLORS[2],
    description: "Entenda seus talentos e propósito",
    route: "/fase/descobrir",
    phaseNumber: 2
  },
  { 
    id: "decidir", 
    name: "Decidir", 
    icon: Target, 
    color: PHASE_COLORS[3],
    description: "Escolha seu caminho com clareza",
    route: "/fase/decidir",
    phaseNumber: 3
  },
  { 
    id: "desenvolver", 
    name: "Desenvolver", 
    icon: Wrench, 
    color: PHASE_COLORS[4],
    description: "Construa competências necessárias",
    route: "/fase/desenvolver",
    phaseNumber: 4
  },
  { 
    id: "deslanchar", 
    name: "Deslanchar", 
    icon: Rocket, 
    color: PHASE_COLORS[5],
    description: "Execute com consistência",
    route: "/fase/deslanchar",
    phaseNumber: 5
  },
  { 
    id: "desfrutar", 
    name: "Desfrutar", 
    icon: Trophy, 
    color: PHASE_COLORS[6],
    description: "Celebre suas conquistas",
    route: "/fase/desfrutar",
    phaseNumber: 6
  },
];

export function MobilePhaseCarousel() {
  const navigate = useNavigate();
  const { phasesWithProgress, currentPhase } = useProgress();
  
  // Start at current phase
  const currentPhaseIndex = useMemo(() => {
    const index = phases.findIndex(p => p.id === currentPhase?.slug);
    return index >= 0 ? index : 0;
  }, [currentPhase]);

  const [activeIndex, setActiveIndex] = useState(currentPhaseIndex);

  // Map phase progress
  const phaseProgressMap = useMemo(() => {
    const map: Record<string, { status: string; progress: number }> = {};
    phasesWithProgress.forEach(p => {
      map[p.slug] = {
        status: p.userProgress?.status || 'locked',
        progress: p.totalActivities > 0 ? (p.completedActivities / p.totalActivities) * 100 : 0
      };
    });
    return map;
  }, [phasesWithProgress]);

  const getPhaseState = (phase: Phase) => {
    const progress = phaseProgressMap[phase.id];
    const isCurrent = phase.id === currentPhase?.slug;
    const isCompleted = progress?.status === 'completed';
    const isLocked = progress?.status === 'locked';
    
    return { isCurrent, isCompleted, isLocked, progress: progress?.progress || 0 };
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev > 0 ? prev - 1 : phases.length - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev < phases.length - 1 ? prev + 1 : 0));
  };

  const handlePhaseClick = (phase: Phase) => {
    const { isLocked } = getPhaseState(phase);
    if (!isLocked) {
      navigate(phase.route);
    }
  };

  const activePhase = phases[activeIndex];
  const { isCurrent, isCompleted, isLocked, progress } = getPhaseState(activePhase);
  const Icon = activePhase.icon;

  return (
    <div className="w-full">
      {/* Phase dots indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {phases.map((phase, index) => {
          const state = getPhaseState(phase);
          return (
            <button
              key={phase.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === activeIndex ? "w-6" : "w-2",
                state.isCompleted 
                  ? "bg-primary" 
                  : state.isCurrent 
                    ? "bg-primary/60" 
                    : state.isLocked 
                      ? "bg-muted" 
                      : "bg-muted-foreground/30"
              )}
              style={
                (state.isCurrent || state.isCompleted) && index === activeIndex 
                  ? { backgroundColor: phase.color } 
                  : {}
              }
            />
          );
        })}
      </div>

      {/* Carousel container */}
      <div className="relative">
        {/* Navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/80 backdrop-blur-sm"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/80 backdrop-blur-sm"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Phase card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "mx-10 rounded-2xl border p-5 cursor-pointer transition-all duration-300",
              isLocked 
                ? "bg-muted/30 border-border/50 opacity-60 cursor-not-allowed" 
                : "bg-card border-border hover:border-primary/30"
            )}
            onClick={() => handlePhaseClick(activePhase)}
            style={
              isCurrent 
                ? { 
                    borderColor: `${activePhase.color}50`,
                    boxShadow: `0 0 20px ${activePhase.color}15`
                  } 
                : {}
            }
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div 
                className={cn(
                  "h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0",
                  isCompleted && "ring-2 ring-white/30"
                )}
                style={{ 
                  backgroundColor: isLocked ? 'hsl(var(--muted))' : `${activePhase.color}20`,
                }}
              >
                {isCompleted ? (
                  <Check className="h-6 w-6 text-white" style={{ color: activePhase.color }} />
                ) : isLocked ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Icon className="h-6 w-6" style={{ color: activePhase.color }} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: isLocked ? 'hsl(var(--muted))' : `${activePhase.color}20`,
                      color: isLocked ? 'hsl(var(--muted-foreground))' : activePhase.color
                    }}
                  >
                    Fase {activePhase.phaseNumber}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Atual
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      ✓ Completa
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground mb-0.5">
                  {activePhase.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {activePhase.description}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            {!isLocked && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium" style={{ color: activePhase.color }}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: activePhase.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quick phase list */}
      <div className="flex justify-center gap-3 mt-4 px-4">
        {phases.map((phase, index) => {
          const state = getPhaseState(phase);
          const PhaseIcon = phase.icon;
          return (
            <button
              key={phase.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200",
                index === activeIndex 
                  ? "ring-2 ring-offset-2 ring-offset-background" 
                  : "opacity-60 hover:opacity-100",
                state.isLocked && "opacity-30"
              )}
              style={{ 
                backgroundColor: state.isLocked ? 'hsl(var(--muted))' : `${phase.color}20`,
                ...(index === activeIndex ? { ringColor: phase.color } : {})
              }}
            >
              {state.isCompleted ? (
                <Check className="h-4 w-4" style={{ color: phase.color }} />
              ) : state.isLocked ? (
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <PhaseIcon className="h-4 w-4" style={{ color: phase.color }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
