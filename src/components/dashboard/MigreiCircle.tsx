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

interface Phase {
  id: string;
  name: string;
  icon: React.ElementType;
  bgColor: string;
  hoverColor: string;
  textColor: string;
  description: string;
  angle: number;
}

// Cores otimizadas para contraste e legibilidade
const phases: Phase[] = [
  { 
    id: "despertar", 
    name: "Despertar", 
    icon: Lightbulb, 
    bgColor: "#F59E0B", // Amber 500
    hoverColor: "#D97706", // Amber 600
    textColor: "#1F2937", // Gray 800 - escuro para contraste
    description: "Percepção da necessidade de mudança",
    angle: 0 
  },
  { 
    id: "descobrir", 
    name: "Descobrir", 
    icon: Search, 
    bgColor: "#10B981", // Emerald 500
    hoverColor: "#059669", // Emerald 600
    textColor: "#FFFFFF",
    description: "Autoconhecimento e clareza de propósito",
    angle: 60 
  },
  { 
    id: "decidir", 
    name: "Decidir", 
    icon: Target, 
    bgColor: "#3B82F6", // Blue 500
    hoverColor: "#2563EB", // Blue 600
    textColor: "#FFFFFF",
    description: "Definição estratégica da rota e metas",
    angle: 120 
  },
  { 
    id: "desenvolver", 
    name: "Desenvolver", 
    icon: Settings, 
    bgColor: "#8B5CF6", // Violet 500
    hoverColor: "#7C3AED", // Violet 600
    textColor: "#FFFFFF",
    description: "Construção de competências",
    angle: 180 
  },
  { 
    id: "deslanchar", 
    name: "Deslanchar", 
    icon: Rocket, 
    bgColor: "#EC4899", // Pink 500
    hoverColor: "#DB2777", // Pink 600
    textColor: "#FFFFFF",
    description: "Execução prática e networking",
    angle: 240 
  },
  { 
    id: "desfrutar", 
    name: "Desfrutar", 
    icon: Star, 
    bgColor: "#F97316", // Orange 500
    hoverColor: "#EA580C", // Orange 600
    textColor: "#FFFFFF",
    description: "Consolidação e celebração",
    angle: 300 
  },
];

export function MigreiCircle() {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  const size = 320;
  const center = size / 2;
  const outerRadius = 150;
  const innerRadius = 55;
  const gapAngle = 6; // ~5mm gap between segments

  const createSegmentPath = (startAngle: number, endAngle: number, outer: number, inner: number) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = center + outer * Math.cos(startRad);
    const y1 = center + outer * Math.sin(startRad);
    const x2 = center + outer * Math.cos(endRad);
    const y2 = center + outer * Math.sin(endRad);
    const x3 = center + inner * Math.cos(endRad);
    const y3 = center + inner * Math.sin(endRad);
    const x4 = center + inner * Math.cos(startRad);
    const y4 = center + inner * Math.sin(startRad);

    return `M ${x1} ${y1} A ${outer} ${outer} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 0 0 ${x4} ${y4} Z`;
  };

  const getIconPosition = (angle: number, radius: number) => {
    const rad = (angle + 30 - 90) * (Math.PI / 180);
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
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
          {/* Segments */}
          {phases.map((phase) => {
            const startAngle = phase.angle + gapAngle / 2;
            const endAngle = phase.angle + 60 - gapAngle / 2;
            const isActive = activePhase === phase.id;
            const isHovered = hoveredPhase === phase.id;
            const iconPos = getIconPosition(phase.angle, (outerRadius + innerRadius) / 2);

            return (
              <g key={phase.id}>
                {/* Segment */}
                <path
                  d={createSegmentPath(startAngle, endAngle, outerRadius, innerRadius)}
                  fill={isHovered || isActive ? phase.hoverColor : phase.bgColor}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter: isHovered || isActive 
                      ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' 
                      : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    transform: isHovered ? `scale(1.03)` : isActive ? 'scale(1.02)' : 'scale(1)',
                    transformOrigin: `${center}px ${center}px`,
                  }}
                  onMouseEnter={() => setHoveredPhase(phase.id)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
                />
                
                {/* Active ring indicator */}
                {isActive && (
                  <path
                    d={createSegmentPath(startAngle, endAngle, outerRadius + 4, outerRadius + 2)}
                    fill={phase.hoverColor}
                    className="animate-pulse"
                  />
                )}

                {/* Phase Icon */}
                <foreignObject
                  x={iconPos.x - 16}
                  y={iconPos.y - 16}
                  width={32}
                  height={32}
                  className="pointer-events-none"
                >
                  <div 
                    className="flex items-center justify-center h-full w-full rounded-full"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <phase.icon 
                      className="h-4 w-4" 
                      style={{ color: phase.textColor }}
                      strokeWidth={2.5}
                    />
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Center Circle */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius - 6}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            className="drop-shadow-sm"
          />

          {/* Center content */}
          <foreignObject
            x={center - 24}
            y={center - 24}
            width={48}
            height={48}
          >
            <div className="flex items-center justify-center h-full">
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            </div>
          </foreignObject>
        </svg>

        {/* Tooltip on hover/active */}
        {(hoveredPhase || activePhase) && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl px-4 py-2 shadow-lg animate-fade-in z-10"
            style={{ bottom: '-16px' }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: phases.find(p => p.id === (hoveredPhase || activePhase))?.bgColor }}
              />
              <p className="font-semibold text-foreground text-sm">
                {phases.find(p => p.id === (hoveredPhase || activePhase))?.name}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {phases.find(p => p.id === (hoveredPhase || activePhase))?.description}
            </p>
          </div>
        )}
      </div>

      {/* Legend - horizontal aligned */}
      <div className="grid grid-cols-6 gap-1 w-full max-w-sm">
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
            className={`flex flex-col items-center gap-1 px-1 py-2 rounded-lg text-center transition-all duration-200 ${
              activePhase === phase.id 
                ? 'bg-secondary shadow-sm' 
                : 'hover:bg-secondary/50'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: phase.bgColor }}
            />
            <span 
              className="text-[10px] font-medium leading-tight"
              style={{ 
                color: activePhase === phase.id ? phase.hoverColor : 'hsl(var(--muted-foreground))',
              }}
            >
              {phase.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
