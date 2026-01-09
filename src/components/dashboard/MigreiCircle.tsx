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
  color: string;
  description: string;
  angle: number;
}

const phases: Phase[] = [
  { 
    id: "despertar", 
    name: "Despertar", 
    icon: Lightbulb, 
    color: "hsl(45, 95%, 60%)",
    description: "Percepção da necessidade de mudança",
    angle: 0 
  },
  { 
    id: "descobrir", 
    name: "Descobrir", 
    icon: Search, 
    color: "hsl(174, 60%, 50%)",
    description: "Autoconhecimento e clareza de propósito",
    angle: 60 
  },
  { 
    id: "decidir", 
    name: "Decidir", 
    icon: Target, 
    color: "hsl(220, 70%, 55%)",
    description: "Definição estratégica da rota e metas",
    angle: 120 
  },
  { 
    id: "desenvolver", 
    name: "Desenvolver", 
    icon: Settings, 
    color: "hsl(280, 60%, 55%)",
    description: "Construção de competências",
    angle: 180 
  },
  { 
    id: "deslanchar", 
    name: "Deslanchar", 
    icon: Rocket, 
    color: "hsl(340, 75%, 55%)",
    description: "Execução prática e networking",
    angle: 240 
  },
  { 
    id: "desfrutar", 
    name: "Desfrutar", 
    icon: Star, 
    color: "hsl(28, 90%, 55%)",
    description: "Consolidação e celebração",
    angle: 300 
  },
];

export function MigreiCircle() {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  const size = 380;
  const center = size / 2;
  const outerRadius = 170;
  const innerRadius = 70;
  const gapAngle = 4;

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
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="animate-scale-in"
        >
          {/* Segments */}
          {phases.map((phase, index) => {
            const startAngle = phase.angle + gapAngle / 2;
            const endAngle = phase.angle + 60 - gapAngle / 2;
            const isActive = activePhase === phase.id;
            const isHovered = hoveredPhase === phase.id;
            const iconPos = getIconPosition(phase.angle, (outerRadius + innerRadius) / 2);

            return (
              <g key={phase.id}>
                <path
                  d={createSegmentPath(startAngle, endAngle, outerRadius, innerRadius)}
                  fill={phase.color}
                  className="phase-segment"
                  style={{
                    opacity: isActive || isHovered ? 1 : 0.85,
                    transform: isHovered ? `scale(1.02)` : 'scale(1)',
                    transformOrigin: `${center}px ${center}px`,
                    transition: 'all 0.3s ease-out',
                  }}
                  onMouseEnter={() => setHoveredPhase(phase.id)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
                />
                {/* Phase Icon */}
                <foreignObject
                  x={iconPos.x - 16}
                  y={iconPos.y - 16}
                  width={32}
                  height={32}
                  className="pointer-events-none"
                >
                  <div className="flex items-center justify-center h-full">
                    <phase.icon 
                      className="h-6 w-6 drop-shadow-md" 
                      style={{ color: 'white' }}
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
            r={innerRadius - 10}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />

          {/* Center Icon */}
          <foreignObject
            x={center - 24}
            y={center - 24}
            width={48}
            height={48}
          >
            <div className="flex items-center justify-center h-full">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
          </foreignObject>
        </svg>

        {/* Tooltip */}
        {hoveredPhase && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl px-4 py-2 shadow-medium animate-fade-in whitespace-nowrap">
            <p className="font-semibold text-foreground">
              {phases.find(p => p.id === hoveredPhase)?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {phases.find(p => p.id === hoveredPhase)?.description}
            </p>
          </div>
        )}
      </div>

      {/* Tasks Indicator */}
      <div className="mt-6 stat-badge">
        <Star className="h-4 w-4 text-phase-despertar" />
        <span>Faltam 3 tarefas</span>
      </div>
    </div>
  );
}
