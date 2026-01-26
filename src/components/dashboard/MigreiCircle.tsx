import { useState, useEffect, useMemo } from "react";
import { 
  Lightbulb, 
  Search, 
  Target, 
  Wrench, 
  Rocket, 
  Trophy,
  Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import { AgentCenterAvatar } from "./AgentCenterAvatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { PHASE_COLORS } from "@/data/phaseIntroData";
import { PhaseActionModal } from "./PhaseActionModal";

interface Phase {
  id: string;
  name: string;
  icon: React.ElementType;
  bgColor: string;
  glowColor: string;
  completedColor: string;
  textColor: string;
  description: string;
  angle: number;
  route: string;
  phaseNumber: number;
}

// Helper to create glow color from hex
const hexToGlow = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.4)`;
};

// Cores otimizadas usando PHASE_COLORS para consistência
const phases: Phase[] = [
  { 
    id: "despertar", 
    name: "Despertar", 
    icon: Lightbulb, 
    bgColor: PHASE_COLORS[1],
    glowColor: hexToGlow(PHASE_COLORS[1]),
    completedColor: "#78716C",
    textColor: "#FFFFFF",
    description: "Perceba a necessidade de mudança e dê o primeiro passo.",
    angle: 0,
    route: "/fase/despertar",
    phaseNumber: 1
  },
  { 
    id: "descobrir", 
    name: "Descobrir", 
    icon: Search, 
    bgColor: PHASE_COLORS[2],
    glowColor: hexToGlow(PHASE_COLORS[2]),
    completedColor: "#78716C",
    textColor: "#FFFFFF",
    description: "Entenda quem você é, seus talentos e o que faz sentido agora.",
    angle: 60,
    route: "/fase/descobrir",
    phaseNumber: 2
  },
  { 
    id: "decidir", 
    name: "Decidir", 
    icon: Target, 
    bgColor: PHASE_COLORS[3],
    glowColor: hexToGlow(PHASE_COLORS[3]),
    completedColor: "#78716C",
    textColor: "#FFFFFF",
    description: "Escolha um caminho com base em clareza, não em pressão.",
    angle: 120,
    route: "/fase/decidir",
    phaseNumber: 3
  },
  { 
    id: "desenvolver", 
    name: "Desenvolver", 
    icon: Wrench, 
    bgColor: PHASE_COLORS[4],
    glowColor: hexToGlow(PHASE_COLORS[4]),
    completedColor: "#78716C",
    textColor: "#FFFFFF",
    description: "Construa as competências necessárias para sua nova carreira.",
    angle: 180,
    route: "/fase/desenvolver",
    phaseNumber: 4
  },
  { 
    id: "deslanchar", 
    name: "Deslanchar", 
    icon: Rocket, 
    bgColor: PHASE_COLORS[5],
    glowColor: hexToGlow(PHASE_COLORS[5]),
    completedColor: "#78716C",
    textColor: "#FFFFFF",
    description: "Execute com consistência e acompanhe sua evolução.",
    angle: 240,
    route: "/fase/deslanchar",
    phaseNumber: 5
  },
  { 
    id: "desfrutar", 
    name: "Desfrutar", 
    icon: Trophy, 
    bgColor: PHASE_COLORS[6],
    glowColor: hexToGlow(PHASE_COLORS[6]),
    completedColor: "#78716C",
    textColor: "#FFFFFF",
    description: "Celebre sua conquista e consolide sua nova identidade.",
    angle: 300,
    route: "/fase/desfrutar",
    phaseNumber: 6
  },
];

export function MigreiCircle() {
  const navigate = useNavigate();
  const { phasesWithProgress, currentPhase } = useProgress();
  const isMobile = useIsMobile();
  
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const [isEntered, setIsEntered] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  const [celebratingPhase, setCelebratingPhase] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fase atual do banco
  const currentPhaseId = currentPhase?.slug || "despertar";
  
  // Mapear progresso das fases
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

  // Animação de entrada
  useEffect(() => {
    const timer = setTimeout(() => setIsEntered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Pulso vital sutil a cada 6-8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale(1.02);
      setTimeout(() => setPulseScale(1), 800);
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);

  // Dimensões responsivas - baseadas no viewport (aumentado para desktop)
  const size = isMobile ? 320 : 580;
  const center = size / 2;
  const outerRadius = isMobile ? 145 : 268;
  const innerRadius = isMobile ? 52 : 95;
  const numSegments = 6;
  const segmentAngle = 360 / numSegments;
  const gapAngle = isMobile ? 4 : 5;
  const cornerRadius = isMobile ? 8 : 12;

  // Criar caminho do segmento arredondado
  const createRoundedSegmentPath = (index: number, outer: number, inner: number) => {
    const startAngle = index * segmentAngle + gapAngle / 2;
    const endAngle = (index + 1) * segmentAngle - gapAngle / 2;
    
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const outerCornerOffset = cornerRadius / outer;
    const innerCornerOffset = cornerRadius / inner;
    
    const outerStart = {
      x: center + outer * Math.cos(startRad + outerCornerOffset),
      y: center + outer * Math.sin(startRad + outerCornerOffset)
    };
    const outerEnd = {
      x: center + outer * Math.cos(endRad - outerCornerOffset),
      y: center + outer * Math.sin(endRad - outerCornerOffset)
    };
    
    const innerStart = {
      x: center + inner * Math.cos(endRad - innerCornerOffset),
      y: center + inner * Math.sin(endRad - innerCornerOffset)
    };
    const innerEnd = {
      x: center + inner * Math.cos(startRad + innerCornerOffset),
      y: center + inner * Math.sin(startRad + innerCornerOffset)
    };
    
    const outerStartCorner = {
      x: center + outer * Math.cos(startRad),
      y: center + outer * Math.sin(startRad)
    };
    const outerEndCorner = {
      x: center + outer * Math.cos(endRad),
      y: center + outer * Math.sin(endRad)
    };
    const innerStartCorner = {
      x: center + inner * Math.cos(endRad),
      y: center + inner * Math.sin(endRad)
    };
    const innerEndCorner = {
      x: center + inner * Math.cos(startRad),
      y: center + inner * Math.sin(startRad)
    };

    return `
      M ${outerStart.x} ${outerStart.y}
      A ${outer} ${outer} 0 0 1 ${outerEnd.x} ${outerEnd.y}
      Q ${outerEndCorner.x} ${outerEndCorner.y} ${center + (outer - cornerRadius) * Math.cos(endRad)} ${center + (outer - cornerRadius) * Math.sin(endRad)}
      L ${center + (inner + cornerRadius) * Math.cos(endRad)} ${center + (inner + cornerRadius) * Math.sin(endRad)}
      Q ${innerStartCorner.x} ${innerStartCorner.y} ${innerStart.x} ${innerStart.y}
      A ${inner} ${inner} 0 0 0 ${innerEnd.x} ${innerEnd.y}
      Q ${innerEndCorner.x} ${innerEndCorner.y} ${center + (inner + cornerRadius) * Math.cos(startRad)} ${center + (inner + cornerRadius) * Math.sin(startRad)}
      L ${center + (outer - cornerRadius) * Math.cos(startRad)} ${center + (outer - cornerRadius) * Math.sin(startRad)}
      Q ${outerStartCorner.x} ${outerStartCorner.y} ${outerStart.x} ${outerStart.y}
      Z
    `;
  };

  const getIconPosition = (index: number, radius: number) => {
    const angle = index * segmentAngle + segmentAngle / 2;
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  // Determinar estado visual de cada fase
  const getPhaseVisualState = (phase: Phase) => {
    const progress = phaseProgressMap[phase.id];
    const isCurrent = phase.id === currentPhaseId;
    const isCompleted = progress?.status === 'completed';
    const isLocked = progress?.status === 'locked' && phase.phaseNumber > (phases.find(p => p.id === currentPhaseId)?.phaseNumber || 1);
    
    return { isCurrent, isCompleted, isLocked, progress: progress?.progress || 0 };
  };

  const handlePhaseClick = (phase: Phase) => {
    const { isLocked } = getPhaseVisualState(phase);
    // Abrir modal para todas as fases (mostra bloqueado se necessário)
    setSelectedPhase(phase);
    setModalOpen(true);
  };

  const getSelectedPhaseStatus = () => {
    if (!selectedPhase) return 'locked';
    const progress = phaseProgressMap[selectedPhase.id];
    return (progress?.status || 'locked') as 'locked' | 'available' | 'in_progress' | 'completed';
  };

  const getSelectedPhaseProgress = () => {
    if (!selectedPhase) return 0;
    const progress = phaseProgressMap[selectedPhase.id];
    return progress?.progress || 0;
  };

  return (
    <motion.div 
      className="flex flex-col items-center gap-6"
      data-tour="migrei-circle"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ 
        opacity: isEntered ? 1 : 0, 
        scale: isEntered ? 1 : 0.92 
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
    >
      {/* Circle Container */}
      <div className="relative">
        {/* Fundo com blur sutil */}
        <div 
          className="absolute inset-0 -m-8 rounded-full bg-gradient-to-br from-muted/30 to-muted/10 blur-xl"
          style={{ transform: 'scale(0.85)' }}
        />
        
        {/* Sombra de elevação */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{ 
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.15), 0 10px 30px -10px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(8px) scale(0.95)',
            borderRadius: '50%'
          }}
        />

        <motion.svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="relative z-10"
          style={{ filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.08))' }}
        >
          {/* Definições de gradientes e filtros */}
          <defs>
            {phases.map((phase) => (
              <linearGradient 
                key={`gradient-${phase.id}`}
                id={`gradient-${phase.id}`}
                x1="0%" y1="0%" x2="100%" y2="100%"
              >
                <stop offset="0%" stopColor={phase.bgColor} stopOpacity="1" />
                <stop offset="100%" stopColor={phase.bgColor} stopOpacity="0.85" />
              </linearGradient>
            ))}
            
            {/* Glow filter mais intenso para fase atual */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Filtro de desaturação para fases concluídas */}
            <filter id="completed">
              <feColorMatrix type="saturate" values="0.3" />
            </filter>
          </defs>

          {/* Segmentos */}
          {phases.map((phase, index) => {
            const { isCurrent, isCompleted, isLocked } = getPhaseVisualState(phase);
            const isHovered = hoveredPhase === phase.id;
            const isCelebrating = celebratingPhase === phase.id;
            const iconPos = getIconPosition(index, (outerRadius + innerRadius) / 2);

            // Calcular transformação
            const segmentScale = isCurrent && !isHovered ? pulseScale : isHovered ? 1.04 : 1;
            const segmentOpacity = isLocked ? 0.4 : isCompleted ? 0.7 : 1;

            return (
              <g key={phase.id}>
                {/* Glow da fase atual - mais intenso e visível */}
                {isCurrent && (
                  <>
                    {/* Outer glow ring */}
                    <motion.path
                      d={createRoundedSegmentPath(index, outerRadius + 12, innerRadius - 6)}
                      fill={phase.bgColor}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.03, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ transformOrigin: `${center}px ${center}px` }}
                    />
                    {/* Inner pulse */}
                    <motion.path
                      d={createRoundedSegmentPath(index, outerRadius + 6, innerRadius - 3)}
                      fill={phase.glowColor}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0.4, 0.7, 0.4],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ transformOrigin: `${center}px ${center}px` }}
                    />
                  </>
                )}

                {/* Segmento principal */}
                <motion.path
                  d={createRoundedSegmentPath(index, outerRadius, innerRadius)}
                  fill={isCompleted ? phase.completedColor : isCurrent ? phase.bgColor : `url(#gradient-${phase.id})`}
                  className={cn(
                    "transition-all duration-300",
                    isLocked ? "cursor-not-allowed" : "cursor-pointer"
                  )}
                  style={{
                    filter: isCompleted ? 'url(#completed)' : 'none',
                    transformOrigin: `${center}px ${center}px`,
                  }}
                  initial={{ scale: 1, opacity: segmentOpacity }}
                  animate={{ 
                    scale: isCurrent ? [1, 1.02, 1] : segmentScale,
                    opacity: isCurrent ? 1 : segmentOpacity,
                  }}
                  transition={isCurrent ? {
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  } : undefined}
                  whileHover={!isLocked ? { 
                    scale: 1.04,
                    transition: { duration: 0.2 }
                  } : {}}
                  onMouseEnter={() => !isLocked && setHoveredPhase(phase.id)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  onClick={() => handlePhaseClick(phase)}
                />

                {/* Brilho interno para fase atual */}
                {isCurrent && (
                  <motion.path
                    d={createRoundedSegmentPath(index, outerRadius - 20, innerRadius + 10)}
                    fill="white"
                    opacity={0.08}
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* Celebração */}
                <AnimatePresence>
                  {isCelebrating && (
                    <motion.circle
                      cx={iconPos.x}
                      cy={iconPos.y}
                      r={30}
                      fill={phase.bgColor}
                      initial={{ scale: 0, opacity: 0.8 }}
                      animate={{ scale: 3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>

                {/* Container do ícone */}
                <foreignObject
                  x={iconPos.x - (isMobile ? 18 : 24)}
                  y={iconPos.y - (isMobile ? 18 : 24)}
                  width={isMobile ? 36 : 48}
                  height={isMobile ? 36 : 48}
                  className="pointer-events-none"
                >
                  <motion.div 
                    className={cn(
                      "flex items-center justify-center h-full w-full rounded-full",
                      isCompleted && "ring-2 ring-white/30"
                    )}
                    style={{ 
                      backgroundColor: isCompleted ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)'
                    }}
                    animate={isCurrent ? {
                      boxShadow: [
                        '0 0 0 0 rgba(255,255,255,0)',
                        '0 0 0 6px rgba(255,255,255,0.15)',
                        '0 0 0 0 rgba(255,255,255,0)'
                      ]
                    } : {}}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    {isCompleted ? (
                      <Check 
                        className={isMobile ? "h-4 w-4" : "h-5 w-5"}
                        style={{ color: '#FFFFFF' }}
                        strokeWidth={3}
                      />
                    ) : (
                      <phase.icon 
                        className={cn(
                          isMobile ? "h-4 w-4" : "h-5 w-5",
                          "transition-transform duration-200",
                          isHovered && "scale-110"
                        )}
                        style={{ 
                          color: phase.textColor,
                          opacity: isLocked ? 0.5 : 1
                        }}
                        strokeWidth={2.5}
                      />
                    )}
                  </motion.div>
                </foreignObject>
              </g>
            );
          })}

          {/* Centro - Círculo do usuário */}
          <motion.circle
            cx={center}
            cy={center}
            r={innerRadius - 10}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
          />

          {/* Conteúdo central - Agente IA */}
          <foreignObject
            x={center - (innerRadius - 12)}
            y={center - (innerRadius - 12)}
            width={(innerRadius - 12) * 2}
            height={(innerRadius - 12) * 2}
          >
            <div className="flex items-center justify-center h-full w-full">
              <AgentCenterAvatar size={(innerRadius - 12) * 2} showTooltip={false} />
            </div>
          </foreignObject>
        </motion.svg>

        {/* Tooltip elegante no hover */}
        <AnimatePresence>
          {hoveredPhase && (
            <motion.div 
              className="absolute left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-md border border-border/50 rounded-xl px-5 py-3 shadow-xl z-20"
              style={{ bottom: '-20px' }}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center gap-2.5">
                <motion.div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: phases.find(p => p.id === hoveredPhase)?.bgColor }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <p className="font-semibold text-foreground text-sm">
                  {phases.find(p => p.id === hoveredPhase)?.name}
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {getPhaseVisualState(phases.find(p => p.id === hoveredPhase)!).isCompleted 
                    ? 'Concluída' 
                    : getPhaseVisualState(phases.find(p => p.id === hoveredPhase)!).isCurrent 
                      ? 'Em andamento' 
                      : 'Próxima'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {phases.find(p => p.id === hoveredPhase)?.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Phase Legend - Horizontal at bottom */}
      <motion.div 
        className="flex items-center justify-center gap-0.5 sm:gap-2 lg:gap-3 flex-wrap max-w-[340px] sm:max-w-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        {phases.map((phase) => {
          const { isCurrent, isCompleted, isLocked } = getPhaseVisualState(phase);
          
          return (
            <motion.button
              key={phase.id}
              onClick={() => handlePhaseClick(phase)}
              disabled={isLocked}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-left transition-all duration-200",
                isCurrent && "bg-card border border-primary/30 shadow-sm",
                !isCurrent && !isLocked && "hover:bg-muted/50",
                isLocked && "opacity-40 cursor-not-allowed"
              )}
              whileHover={!isLocked ? { scale: 1.02 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
            >
              <div 
                className={cn(
                  "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 flex-shrink-0",
                  isCompleted && "ring-1 ring-offset-1 ring-offset-background ring-muted-foreground/30"
                )}
                style={{ 
                  backgroundColor: isCompleted ? phase.completedColor : phase.bgColor,
                  opacity: isLocked ? 0.4 : 1
                }}
              />
              <span 
                className={cn(
                  "text-[10px] sm:text-xs font-medium leading-tight whitespace-nowrap",
                  isCurrent ? "text-foreground font-semibold" : "text-muted-foreground"
                )}
              >
                {phase.name}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Modal de ação da fase */}
      <PhaseActionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        phase={selectedPhase}
        status={getSelectedPhaseStatus()}
        progress={getSelectedPhaseProgress()}
      />
    </motion.div>
  );
}
