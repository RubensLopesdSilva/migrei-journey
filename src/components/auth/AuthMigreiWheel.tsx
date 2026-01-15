import { useState } from "react";
import { 
  Lightbulb, 
  Search, 
  Target, 
  Settings, 
  Rocket, 
  Star,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Phase {
  id: string;
  name: string;
  icon: React.ElementType;
  bgColor: string;
  glowColor: string;
  textColor: string;
  description: string;
}

const phases: Phase[] = [
  { 
    id: "despertar", 
    name: "Despertar", 
    icon: Lightbulb, 
    bgColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.4)",
    textColor: "#1F2937",
    description: "Percepção da necessidade de mudança"
  },
  { 
    id: "descobrir", 
    name: "Descobrir", 
    icon: Search, 
    bgColor: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    textColor: "#FFFFFF",
    description: "Autoconhecimento e clareza de propósito"
  },
  { 
    id: "decidir", 
    name: "Decidir", 
    icon: Target, 
    bgColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    textColor: "#FFFFFF",
    description: "Definição estratégica da rota e metas"
  },
  { 
    id: "desenvolver", 
    name: "Desenvolver", 
    icon: Settings, 
    bgColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.4)",
    textColor: "#FFFFFF",
    description: "Construção de competências"
  },
  { 
    id: "deslanchar", 
    name: "Deslanchar", 
    icon: Rocket, 
    bgColor: "#EC4899",
    glowColor: "rgba(236, 72, 153, 0.4)",
    textColor: "#FFFFFF",
    description: "Execução prática e networking"
  },
  { 
    id: "desfrutar", 
    name: "Desfrutar", 
    icon: Star, 
    bgColor: "#F97316",
    glowColor: "rgba(249, 115, 22, 0.4)",
    textColor: "#FFFFFF",
    description: "Consolidação e celebração"
  },
];

export function AuthMigreiWheel() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  const size = 280;
  const center = size / 2;
  const outerRadius = 130;
  const innerRadius = 50;
  const numSegments = 6;
  const segmentAngle = 360 / numSegments;
  const gapAngle = 5;
  const cornerRadius = 8;

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

  const activePhase = selectedPhase || hoveredPhase;
  const activePhaseData = phases.find(p => p.id === activePhase);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel */}
      <div className="relative">
        <motion.svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="relative z-10"
          initial={{ opacity: 0, rotate: -30 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <defs>
            {phases.map((phase) => (
              <linearGradient 
                key={`gradient-${phase.id}`}
                id={`auth-gradient-${phase.id}`}
                x1="0%" y1="0%" x2="100%" y2="100%"
              >
                <stop offset="0%" stopColor={phase.bgColor} stopOpacity="1" />
                <stop offset="100%" stopColor={phase.bgColor} stopOpacity="0.85" />
              </linearGradient>
            ))}
            
            <filter id="auth-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {phases.map((phase, index) => {
            const isActive = activePhase === phase.id;
            const iconPos = getIconPosition(index, (outerRadius + innerRadius) / 2);

            return (
              <g key={phase.id}>
                {isActive && (
                  <motion.path
                    d={createRoundedSegmentPath(index, outerRadius + 6, innerRadius - 3)}
                    fill={phase.glowColor}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    style={{ transformOrigin: `${center}px ${center}px` }}
                  />
                )}

                <motion.path
                  d={createRoundedSegmentPath(index, outerRadius, innerRadius)}
                  fill={`url(#auth-gradient-${phase.id})`}
                  className="cursor-pointer"
                  style={{
                    filter: isActive ? 'url(#auth-glow)' : 'none',
                    transformOrigin: `${center}px ${center}px`,
                  }}
                  animate={{ 
                    scale: isActive ? 1.04 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setHoveredPhase(phase.id)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                />

                <foreignObject
                  x={iconPos.x - 18}
                  y={iconPos.y - 18}
                  width={36}
                  height={36}
                  className="pointer-events-none"
                >
                  <motion.div 
                    className="flex items-center justify-center h-full w-full rounded-full"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(4px)'
                    }}
                    animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <phase.icon 
                      className="h-4 w-4"
                      style={{ color: phase.textColor }}
                      strokeWidth={2.5}
                    />
                  </motion.div>
                </foreignObject>
              </g>
            );
          })}

          {/* Centro com logo */}
          <motion.circle
            cx={center}
            cy={center}
            r={innerRadius - 8}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />

          <foreignObject
            x={center - 20}
            y={center - 20}
            width={40}
            height={40}
          >
            <div className="flex items-center justify-center h-full">
              <motion.div 
                className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center"
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
      </div>

      {/* Phase info */}
      <AnimatePresence mode="wait">
        {activePhaseData ? (
          <motion.div 
            key={activePhaseData.id}
            className="text-center max-w-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activePhaseData.bgColor }}
              />
              <h4 className="font-semibold text-foreground">
                {activePhaseData.name}
              </h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {activePhaseData.description}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="default"
            className="text-center max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h4 className="font-semibold text-foreground mb-1">
              Metodologia Migrei
            </h4>
            <p className="text-sm text-muted-foreground">
              Clique em uma fase para saber mais sobre sua jornada de transição
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
