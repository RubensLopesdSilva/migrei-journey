import { useState, useEffect } from "react";
import { 
  Lightbulb, 
  Search, 
  Target, 
  Wrench, 
  Rocket, 
  Trophy,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PHASE_COLORS } from "@/data/phaseIntroData";

interface Phase {
  id: string;
  name: string;
  icon: React.ElementType;
  bgColor: string;
  glowColor: string;
  textColor: string;
  description: string;
  angle: number;
}

// Helper to create glow color from hex - igual ao Dashboard
const hexToGlow = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.4)`;
};

// Mesmos ícones do Dashboard (MigreiCircle)
const phases: Phase[] = [
  { 
    id: "despertar", 
    name: "Despertar", 
    icon: Lightbulb, 
    bgColor: PHASE_COLORS[1],
    glowColor: hexToGlow(PHASE_COLORS[1]),
    textColor: "#FFFFFF",
    description: "Perceba a necessidade de mudança e dê o primeiro passo.",
    angle: 0,
  },
  { 
    id: "descobrir", 
    name: "Descobrir", 
    icon: Search, 
    bgColor: PHASE_COLORS[2],
    glowColor: hexToGlow(PHASE_COLORS[2]),
    textColor: "#FFFFFF",
    description: "Entenda quem você é, seus talentos e o que faz sentido agora.",
    angle: 60,
  },
  { 
    id: "decidir", 
    name: "Decidir", 
    icon: Target, 
    bgColor: PHASE_COLORS[3],
    glowColor: hexToGlow(PHASE_COLORS[3]),
    textColor: "#FFFFFF",
    description: "Escolha um caminho com base em clareza, não em pressão.",
    angle: 120,
  },
  { 
    id: "desenvolver", 
    name: "Desenvolver", 
    icon: Wrench, 
    bgColor: PHASE_COLORS[4],
    glowColor: hexToGlow(PHASE_COLORS[4]),
    textColor: "#FFFFFF",
    description: "Construa as competências necessárias para sua nova carreira.",
    angle: 180,
  },
  { 
    id: "deslanchar", 
    name: "Deslanchar", 
    icon: Rocket, 
    bgColor: PHASE_COLORS[5],
    glowColor: hexToGlow(PHASE_COLORS[5]),
    textColor: "#FFFFFF",
    description: "Execute com consistência e acompanhe sua evolução.",
    angle: 240,
  },
  { 
    id: "desfrutar", 
    name: "Desfrutar", 
    icon: Trophy, 
    bgColor: PHASE_COLORS[6],
    glowColor: hexToGlow(PHASE_COLORS[6]),
    textColor: "#FFFFFF",
    description: "Celebre sua conquista e consolide sua nova identidade.",
    angle: 300,
  },
];

interface HeroMigreiWheelProps {
  hideTooltip?: boolean;
}

export const HeroMigreiWheel = ({ hideTooltip = false }: HeroMigreiWheelProps) => {
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const [isEntered, setIsEntered] = useState(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  // Animação de entrada
  useEffect(() => {
    const timer = setTimeout(() => setIsEntered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate phases when not hovering
  useEffect(() => {
    if (hoveredPhase) return;
    
    const interval = setInterval(() => {
      setActivePhaseIndex((prev) => (prev + 1) % phases.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [hoveredPhase]);

  // Dimensões - maior que o Dashboard
  const size = 560;
  const center = size / 2;
  const outerRadius = 260;
  const innerRadius = 95;
  const numSegments = 6;
  const segmentAngle = 360 / numSegments;
  const gapAngle = 5;
  const cornerRadius = 12;

  // Criar caminho do segmento arredondado - igual ao Dashboard
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

  const currentActivePhase = hoveredPhase || phases[activePhaseIndex].id;
  const currentActiveIndex = phases.findIndex((p) => p.id === currentActivePhase);
  const currentPhase = phases.find((p) => p.id === currentActivePhase);

  const tooltipAnchor = (() => {
    if (currentActiveIndex < 0) return null;
    return getIconPosition(currentActiveIndex, outerRadius + 42);
  })();

  const tooltipSide = tooltipAnchor
    ? tooltipAnchor.x < center
      ? "left"
      : "right"
    : "right";

  return (
    <motion.div 
      className="flex flex-col items-center gap-4"
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
          {/* Definições de filtros */}
          <defs>
            {/* Glow filter para fase ativa */}
            <filter id="landing-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Segmentos - CORES SÓLIDAS */}
          {phases.map((phase, index) => {
            const isActive = currentActivePhase === phase.id;
            const isHovered = hoveredPhase === phase.id;
            const iconPos = getIconPosition(index, (outerRadius + innerRadius) / 2);

            return (
              <g key={phase.id}>
                {/* Glow da fase ativa */}
                {isActive && (
                  <path
                    d={createRoundedSegmentPath(index, outerRadius + 6, innerRadius - 3)}
                    fill={phase.glowColor}
                    opacity={0.5}
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* Segmento principal - COR SÓLIDA */}
                <motion.path
                  d={createRoundedSegmentPath(index, outerRadius, innerRadius)}
                  fill={phase.bgColor}
                  className="cursor-pointer"
                  style={{
                    filter: isActive ? 'url(#landing-glow)' : 'none',
                    transformOrigin: `${center}px ${center}px`,
                  }}
                  initial={{ scale: 1 }}
                  animate={{ scale: isActive ? 1.02 : 1 }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setHoveredPhase(phase.id)}
                  onMouseLeave={() => setHoveredPhase(null)}
                />

                {/* Brilho interno para fase ativa */}
                {isActive && (
                  <path
                    d={createRoundedSegmentPath(index, outerRadius - 20, innerRadius + 10)}
                    fill="white"
                    opacity={0.08}
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* Container do ícone - igual ao Dashboard */}
                <foreignObject
                  x={iconPos.x - 24}
                  y={iconPos.y - 24}
                  width={48}
                  height={48}
                  className="pointer-events-none"
                >
                  <div 
                    className={cn(
                      "flex items-center justify-center h-full w-full rounded-full",
                      isActive && "ring-2 ring-white/30"
                    )}
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <phase.icon 
                      className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        isHovered && "scale-110"
                      )}
                      style={{ color: phase.textColor }}
                      strokeWidth={2.5}
                    />
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Centro - Círculo do usuário - igual ao Dashboard */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius - 10}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
          />

          {/* Conteúdo central */}
          <foreignObject
            x={center - 30}
            y={center - 30}
            width={60}
            height={60}
          >
            <div className="flex items-center justify-center h-full">
              <div 
                className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center"
              >
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
          </foreignObject>
        </motion.svg>

        {/* Tooltip elegante - acompanha a fase ativa */}
        <AnimatePresence>
          {!hideTooltip && currentActivePhase && currentPhase && tooltipAnchor && (
            <motion.div 
              className="absolute bg-card/95 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 shadow-xl z-20 w-[220px]"
              style={{
                left: tooltipAnchor.x,
                top: tooltipAnchor.y,
                transform:
                  tooltipSide === "left"
                    ? "translate(calc(-100% - 8px), -50%)"
                    : "translate(8px, -50%)",
              }}
              key={currentActivePhase}
              initial={{
                opacity: 0,
                x: tooltipSide === "left" ? 8 : -8,
                scale: 0.95,
              }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: tooltipSide === "left" ? 8 : -8,
                scale: 0.95,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: currentPhase.bgColor }}
                />
                <span className="font-semibold text-foreground text-sm">
                  {currentPhase.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {currentPhase.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};