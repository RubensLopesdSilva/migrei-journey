import { useState, useEffect, useMemo } from "react";
import { 
  Lightbulb, 
  Search, 
  Target, 
  Settings, 
  Rocket, 
  Star,
  User,
  ArrowRight,
  Check
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

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

// Cores otimizadas para contraste e legibilidade com glow emocional
const phases: Phase[] = [
  { 
    id: "despertar", 
    name: "Despertar", 
    icon: Lightbulb, 
    bgColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.4)",
    completedColor: "#78716C",
    textColor: "#1F2937",
    description: "Percepção da necessidade de mudança",
    angle: 0,
    route: "/fase/despertar",
    phaseNumber: 1
  },
  { 
    id: "descobrir", 
    name: "Descobrir", 
    icon: Search, 
    bgColor: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    completedColor: "#78716C",
    textColor: "#FFFFFF",
    description: "Autoconhecimento e clareza de propósito",
    angle: 60,
    route: "/fase/descobrir",
    phaseNumber: 2
  },
  { 
    id: "decidir", 
    name: "Decidir", 
    icon: Target, 
    bgColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    completedColor: "#78716C",
    textColor: "#FFFFFF",
    description: "Definição estratégica da rota e metas",
    angle: 120,
    route: "/fase/decidir",
    phaseNumber: 3
  },
  { 
    id: "desenvolver", 
    name: "Desenvolver", 
    icon: Settings, 
    bgColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.4)",
    completedColor: "#78716C",
    textColor: "#FFFFFF",
    description: "Construção de competências",
    angle: 180,
    route: "/fase/desenvolver",
    phaseNumber: 4
  },
  { 
    id: "deslanchar", 
    name: "Deslanchar", 
    icon: Rocket, 
    bgColor: "#EC4899",
    glowColor: "rgba(236, 72, 153, 0.4)",
    completedColor: "#78716C",
    textColor: "#FFFFFF",
    description: "Execução prática e networking",
    angle: 240,
    route: "/fase/deslanchar",
    phaseNumber: 5
  },
  { 
    id: "desfrutar", 
    name: "Desfrutar", 
    icon: Star, 
    bgColor: "#F97316",
    glowColor: "rgba(249, 115, 22, 0.4)",
    completedColor: "#78716C",
    textColor: "#FFFFFF",
    description: "Consolidação e celebração",
    angle: 300,
    route: "/fase/desfrutar",
    phaseNumber: 6
  },
];

// Mensagens emocionais de microcopy
const motivationalMessages = [
  "Você está avançando",
  "Um passo de cada vez",
  "Essa é a sua jornada",
  "Continue no seu ritmo",
  "Você está no caminho certo"
];

export function MigreiCircle() {
  const navigate = useNavigate();
  const { phasesWithProgress, currentPhase } = useProgress();
  
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const [isEntered, setIsEntered] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  const [celebratingPhase, setCelebratingPhase] = useState<string | null>(null);
  
  // Mensagem motivacional aleatória
  const motivationalMessage = useMemo(() => 
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
    []
  );

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

  // Dimensões responsivas
  const size = 380;
  const center = size / 2;
  const outerRadius = 175;
  const innerRadius = 65;
  const numSegments = 6;
  const segmentAngle = 360 / numSegments;
  const gapAngle = 5;
  const cornerRadius = 10;

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
    if (!isLocked) {
      navigate(phase.route);
    }
  };

  // Celebrar conclusão de fase
  const triggerCelebration = (phaseId: string) => {
    setCelebratingPhase(phaseId);
    setTimeout(() => setCelebratingPhase(null), 1500);
  };

  return (
    <motion.div 
      className="flex flex-col items-center gap-6"
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
      {/* Container da Roda com profundidade */}
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
            
            {/* Glow filter para fase atual */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
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
                {/* Glow da fase atual */}
                {isCurrent && (
                  <motion.path
                    d={createRoundedSegmentPath(index, outerRadius + 8, innerRadius - 4)}
                    fill={phase.glowColor}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ transformOrigin: `${center}px ${center}px` }}
                  />
                )}

                {/* Segmento principal */}
                <motion.path
                  d={createRoundedSegmentPath(index, outerRadius, innerRadius)}
                  fill={isCompleted ? phase.completedColor : `url(#gradient-${phase.id})`}
                  className={cn(
                    "transition-all duration-300",
                    isLocked ? "cursor-not-allowed" : "cursor-pointer"
                  )}
                  style={{
                    filter: isCurrent ? 'url(#glow)' : isCompleted ? 'url(#completed)' : 'none',
                    transformOrigin: `${center}px ${center}px`,
                  }}
                  initial={{ scale: 1, opacity: segmentOpacity }}
                  animate={{ 
                    scale: segmentScale,
                    opacity: segmentOpacity,
                  }}
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
                  x={iconPos.x - 22}
                  y={iconPos.y - 22}
                  width={44}
                  height={44}
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
                        className="h-5 w-5" 
                        style={{ color: '#FFFFFF' }}
                        strokeWidth={3}
                      />
                    ) : (
                      <phase.icon 
                        className={cn(
                          "h-5 w-5 transition-transform duration-200",
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

          {/* Conteúdo central */}
          <foreignObject
            x={center - 26}
            y={center - 26}
            width={52}
            height={52}
          >
            <div className="flex items-center justify-center h-full">
              <motion.div 
                className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center"
                animate={{ 
                  borderColor: ['hsl(var(--primary) / 0.2)', 'hsl(var(--primary) / 0.35)', 'hsl(var(--primary) / 0.2)']
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <User className="h-5 w-5 text-primary" />
              </motion.div>
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

      {/* Microcopy Emocional */}
      <motion.p 
        className="text-sm text-muted-foreground font-medium tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {motivationalMessage}
      </motion.p>

      {/* Indicador da fase atual */}
      <motion.div 
        className="flex items-center justify-between w-full max-w-sm px-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <div className="flex items-center gap-2.5">
          <motion.div 
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: phases.find(p => p.id === currentPhaseId)?.bgColor }}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-xs text-muted-foreground">
            Fase atual: <span className="font-semibold text-foreground capitalize">{phases.find(p => p.id === currentPhaseId)?.name}</span>
          </span>
        </div>
        <Link 
          to="/progresso"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors group"
        >
          Ver jornada
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>

      {/* Legenda horizontal compacta */}
      <motion.div 
        className="grid grid-cols-6 gap-1.5 w-full max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        {phases.map((phase) => {
          const { isCurrent, isCompleted, isLocked } = getPhaseVisualState(phase);
          
          return (
            <motion.button
              key={phase.id}
              onClick={() => handlePhaseClick(phase)}
              disabled={isLocked}
              className={cn(
                "flex flex-col items-center gap-1 px-1.5 py-2 rounded-lg text-center transition-all duration-200",
                isCurrent && "bg-primary/5 ring-1 ring-primary/20",
                isCompleted && "bg-muted/50",
                !isLocked && !isCurrent && "hover:bg-muted/30",
                isLocked && "opacity-40 cursor-not-allowed"
              )}
              whileHover={!isLocked ? { scale: 1.02 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
            >
              <div 
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  isCompleted && "ring-1 ring-offset-1 ring-offset-background ring-muted-foreground/30"
                )}
                style={{ 
                  backgroundColor: isCompleted ? phase.completedColor : phase.bgColor,
                  opacity: isLocked ? 0.4 : 1
                }}
              />
              <span 
                className={cn(
                  "text-[10px] font-medium leading-tight",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {phase.name}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
