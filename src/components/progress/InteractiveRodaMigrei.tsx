import { useState, useEffect } from "react";
import { 
  Lightbulb, 
  Compass, 
  Target, 
  Wrench, 
  Rocket, 
  Trophy,
  Lock,
  Check,
  Play
} from "lucide-react";
import { PhaseWithProgress } from "@/types/progress";
import { cn } from "@/lib/utils";

interface InteractiveRodaMigreiProps {
  phases: PhaseWithProgress[];
  currentPhaseId: string | null;
  onPhaseClick?: (phase: PhaseWithProgress) => void;
}

const phaseIcons: Record<string, React.ElementType> = {
  'Sunrise': Lightbulb,
  'Compass': Compass,
  'Target': Target,
  'Wrench': Wrench,
  'Rocket': Rocket,
  'Trophy': Trophy,
};

const phaseColors: Record<number, { bg: string; hover: string; text: string }> = {
  1: { bg: "#F59E0B", hover: "#D97706", text: "#1F2937" },
  2: { bg: "#8B5CF6", hover: "#7C3AED", text: "#FFFFFF" },
  3: { bg: "#3B82F6", hover: "#2563EB", text: "#FFFFFF" },
  4: { bg: "#10B981", hover: "#059669", text: "#FFFFFF" },
  5: { bg: "#F97316", hover: "#EA580C", text: "#FFFFFF" },
  6: { bg: "#EAB308", hover: "#CA8A04", text: "#1F2937" },
};

export function InteractiveRodaMigrei({ 
  phases, 
  currentPhaseId, 
  onPhaseClick 
}: InteractiveRodaMigreiProps) {
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const [pulseOpacity, setPulseOpacity] = useState(0.7);

  // Pulse animation for current phase
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseOpacity(prev => prev === 0.7 ? 0.9 : 0.7);
    }, 1200);
    
    return () => clearInterval(interval);
  }, []);

  const size = 420;
  const center = size / 2;
  const outerRadius = 185;
  const innerRadius = 65;
  const numSegments = 6;
  const segmentAngle = 360 / numSegments;
  const gapAngle = 4;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return Check;
      case 'locked': return Lock;
      case 'in_progress': return Play;
      default: return Play;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="animate-scale-in"
        >
          {/* Phase Segments */}
          {phases.map((phase, index) => {
            const colors = phaseColors[phase.phase_number];
            const isHovered = hoveredPhase === phase.id;
            const isCurrent = phase.id === currentPhaseId;
            const isLocked = phase.userProgress?.status === 'locked';
            const isCompleted = phase.userProgress?.status === 'completed';
            const progress = phase.userProgress?.progress_percentage || 0;
            const iconPos = getIconPosition(index, (outerRadius + innerRadius) / 2);
            const Icon = phaseIcons[phase.icon_name || 'Lightbulb'] || Lightbulb;
            const StatusIcon = getStatusIcon(phase.userProgress?.status || 'available');

            return (
              <g key={phase.id}>
                {/* Background segment (for progress) */}
                <path
                  d={createRoundedSegmentPath(index, outerRadius, innerRadius)}
                  fill={isLocked ? "#374151" : colors.bg}
                  className={cn(
                    "transition-all duration-300",
                    !isLocked && "cursor-pointer"
                  )}
                  style={{
                    opacity: isLocked ? 0.4 : isCurrent ? pulseOpacity : isCompleted ? 1 : 0.7,
                    filter: isHovered && !isLocked
                      ? 'drop-shadow(0 6px 16px rgba(0,0,0,0.3))' 
                      : isCurrent
                        ? `drop-shadow(0 4px 12px ${colors.bg}40)`
                        : 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
                    transform: isHovered && !isLocked ? `scale(1.03)` : 'scale(1)',
                    transformOrigin: `${center}px ${center}px`,
                  }}
                  onMouseEnter={() => !isLocked && setHoveredPhase(phase.id)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  onClick={() => !isLocked && onPhaseClick?.(phase)}
                />
                
                {/* Progress overlay */}
                {progress > 0 && progress < 100 && !isLocked && (
                  <path
                    d={createRoundedSegmentPath(index, outerRadius, innerRadius)}
                    fill={colors.hover}
                    clipPath={`inset(${100 - progress}% 0 0 0)`}
                    className="pointer-events-none"
                  />
                )}

                {/* Current phase ring */}
                {isCurrent && (
                  <path
                    d={createRoundedSegmentPath(index, outerRadius + 6, outerRadius + 2)}
                    fill={colors.hover}
                    opacity={0.8}
                    className="animate-pulse"
                  />
                )}

                {/* Completed checkmark ring */}
                {isCompleted && (
                  <path
                    d={createRoundedSegmentPath(index, outerRadius + 4, outerRadius + 1)}
                    fill="#10B981"
                    opacity={0.9}
                  />
                )}

                {/* Phase Icon */}
                <foreignObject
                  x={iconPos.x - 22}
                  y={iconPos.y - 22}
                  width={44}
                  height={44}
                  className="pointer-events-none"
                >
                  <div 
                    className="flex items-center justify-center h-full w-full rounded-full relative"
                    style={{ 
                      backgroundColor: isLocked ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <Icon 
                      className={cn("h-5 w-5", isLocked && "opacity-50")}
                      style={{ color: isLocked ? "#9CA3AF" : colors.text }}
                      strokeWidth={2.5}
                    />
                    {/* Status indicator */}
                    <div 
                      className={cn(
                        "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center",
                        isCompleted && "bg-green-500",
                        isCurrent && "bg-primary",
                        isLocked && "bg-gray-500",
                        !isCompleted && !isCurrent && !isLocked && "bg-primary/50"
                      )}
                    >
                      <StatusIcon className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </foreignObject>

                {/* Progress percentage */}
                {!isLocked && progress > 0 && (
                  <foreignObject
                    x={iconPos.x - 15}
                    y={iconPos.y + 18}
                    width={30}
                    height={16}
                    className="pointer-events-none"
                  >
                    <div className="flex items-center justify-center h-full">
                      <span 
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: '#fff'
                        }}
                      >
                        {progress}%
                      </span>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}

          {/* Center Circle */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius - 8}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            className="drop-shadow-md"
          />

          {/* Center content - Overall Progress */}
          <foreignObject
            x={center - 35}
            y={center - 30}
            width={70}
            height={60}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-2xl font-bold text-foreground">
                {phases.filter(p => p.userProgress?.status === 'completed').length}
              </span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">
                de 6 fases
              </span>
            </div>
          </foreignObject>
        </svg>

        {/* Tooltip */}
        {hoveredPhase && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl px-5 py-3 shadow-lg animate-fade-in z-10 min-w-[200px]"
            style={{ bottom: '-16px' }}
          >
            {(() => {
              const phase = phases.find(p => p.id === hoveredPhase);
              if (!phase) return null;
              const colors = phaseColors[phase.phase_number];
              return (
                <>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors.bg }}
                    />
                    <p className="font-semibold text-foreground">
                      Fase {phase.phase_number}: {phase.name}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {phase.description}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {phase.completedActivities}/{phase.totalActivities} atividades
                    </span>
                    <span className="text-xs font-medium text-primary">
                      {phase.userProgress?.progress_percentage || 0}% completo
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-6 gap-2 w-full max-w-lg">
        {phases.map((phase) => {
          const colors = phaseColors[phase.phase_number];
          const isLocked = phase.userProgress?.status === 'locked';
          const isCurrent = phase.id === currentPhaseId;
          const isCompleted = phase.userProgress?.status === 'completed';

          return (
            <button
              key={phase.id}
              onClick={() => !isLocked && onPhaseClick?.(phase)}
              disabled={isLocked}
              className={cn(
                "flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg text-center transition-all duration-200",
                isCurrent && "bg-primary/10 ring-2 ring-primary/30",
                isCompleted && "bg-green-500/10",
                !isLocked && !isCurrent && !isCompleted && "hover:bg-secondary/50",
                isLocked && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="relative">
                <div 
                  className={cn(
                    "w-4 h-4 rounded-full",
                    isLocked && "bg-gray-400"
                  )}
                  style={{ backgroundColor: isLocked ? undefined : colors.bg }}
                />
                {isCompleted && (
                  <Check className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 text-green-500" />
                )}
              </div>
              <span 
                className={cn(
                  "text-xs font-medium leading-tight",
                  isLocked && "text-muted-foreground"
                )}
                style={{ 
                  color: isLocked ? undefined : isCurrent ? colors.hover : 'hsl(var(--muted-foreground))',
                }}
              >
                {phase.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
