import { useState, useEffect } from "react";
import { 
  Lightbulb, 
  Search, 
  Target, 
  Settings, 
  Rocket, 
  Star,
  User,
  ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Phase {
  id: string;
  name: string;
  icon: React.ElementType;
  bgColor: string;
  hoverColor: string;
  textColor: string;
  description: string;
  angle: number;
  route: string;
  available: boolean;
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
    angle: 0,
    route: "/fase/despertar",
    available: true
  },
  { 
    id: "descobrir", 
    name: "Descobrir", 
    icon: Search, 
    bgColor: "#10B981", // Emerald 500
    hoverColor: "#059669", // Emerald 600
    textColor: "#FFFFFF",
    description: "Autoconhecimento e clareza de propósito",
    angle: 60,
    route: "/fase/descobrir",
    available: false
  },
  { 
    id: "decidir", 
    name: "Decidir", 
    icon: Target, 
    bgColor: "#3B82F6", // Blue 500
    hoverColor: "#2563EB", // Blue 600
    textColor: "#FFFFFF",
    description: "Definição estratégica da rota e metas",
    angle: 120,
    route: "/fase/decidir",
    available: false
  },
  { 
    id: "desenvolver", 
    name: "Desenvolver", 
    icon: Settings, 
    bgColor: "#8B5CF6", // Violet 500
    hoverColor: "#7C3AED", // Violet 600
    textColor: "#FFFFFF",
    description: "Construção de competências",
    angle: 180,
    route: "/fase/desenvolver",
    available: false
  },
  { 
    id: "deslanchar", 
    name: "Deslanchar", 
    icon: Rocket, 
    bgColor: "#EC4899", // Pink 500
    hoverColor: "#DB2777", // Pink 600
    textColor: "#FFFFFF",
    description: "Execução prática e networking",
    angle: 240,
    route: "/fase/deslanchar",
    available: false
  },
  { 
    id: "desfrutar", 
    name: "Desfrutar", 
    icon: Star, 
    bgColor: "#F97316", // Orange 500
    hoverColor: "#EA580C", // Orange 600
    textColor: "#FFFFFF",
    description: "Consolidação e celebração",
    angle: 300,
    route: "/fase/desfrutar",
    available: false
  },
];

export function MigreiCircle() {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const [pulseOpacity, setPulseOpacity] = useState(0.6);

  // Subtle pulsing effect for Despertar
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseOpacity(prev => prev === 0.6 ? 0.85 : 0.6);
    }, 1500);
    
    const timer = setTimeout(() => {
      clearInterval(interval);
      setPulseOpacity(1);
    }, 6000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const size = 420;
  const center = size / 2;
  const outerRadius = 195;
  const innerRadius = 70;
  const numSegments = 6;
  const segmentAngle = 360 / numSegments; // 60 degrees each
  const gapAngle = 4; // Gap in degrees between segments
  const cornerRadius = 8; // Rounded corners

  // Create rounded segment path
  const createRoundedSegmentPath = (index: number, outer: number, inner: number) => {
    const startAngle = index * segmentAngle + gapAngle / 2;
    const endAngle = (index + 1) * segmentAngle - gapAngle / 2;
    
    // Convert to radians and offset by -90 to start from top
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    // Calculate corner offset based on radius
    const outerCornerOffset = cornerRadius / outer;
    const innerCornerOffset = cornerRadius / inner;
    
    // Outer arc points with corner offsets
    const outerStart = {
      x: center + outer * Math.cos(startRad + outerCornerOffset),
      y: center + outer * Math.sin(startRad + outerCornerOffset)
    };
    const outerEnd = {
      x: center + outer * Math.cos(endRad - outerCornerOffset),
      y: center + outer * Math.sin(endRad - outerCornerOffset)
    };
    
    // Inner arc points with corner offsets
    const innerStart = {
      x: center + inner * Math.cos(endRad - innerCornerOffset),
      y: center + inner * Math.sin(endRad - innerCornerOffset)
    };
    const innerEnd = {
      x: center + inner * Math.cos(startRad + innerCornerOffset),
      y: center + inner * Math.sin(startRad + innerCornerOffset)
    };
    
    // Corner control points
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

  const handlePhaseClick = (phase: Phase) => {
    setPulseOpacity(1);
    if (phase.available) {
      navigate(phase.route);
    } else {
      setActivePhase(activePhase === phase.id ? null : phase.id);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="animate-scale-in"
        >
          {/* Segments */}
          {phases.map((phase, index) => {
            const isActive = activePhase === phase.id;
            const isHovered = hoveredPhase === phase.id;
            const isDespertar = phase.id === "despertar";
            const shouldPulse = isDespertar && !activePhase && pulseOpacity < 1;
            const iconPos = getIconPosition(index, (outerRadius + innerRadius) / 2);

            return (
              <g key={phase.id}>
                {/* Segment */}
                <path
                  d={createRoundedSegmentPath(index, outerRadius, innerRadius)}
                  fill={isHovered || isActive ? phase.hoverColor : phase.bgColor}
                  className={phase.available ? "cursor-pointer transition-all duration-300" : "cursor-not-allowed transition-all duration-300"}
                  style={{
                    opacity: !phase.available && !isDespertar ? 0.5 : (shouldPulse ? pulseOpacity : 1),
                    filter: isHovered || isActive 
                      ? 'drop-shadow(0 6px 16px rgba(0,0,0,0.3))' 
                      : shouldPulse 
                        ? 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.25))'
                        : 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
                    transform: isHovered && phase.available ? `scale(1.03)` : isActive ? 'scale(1.02)' : 'scale(1)',
                    transformOrigin: `${center}px ${center}px`,
                  }}
                  onMouseEnter={() => setHoveredPhase(phase.id)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  onClick={() => handlePhaseClick(phase)}
                />
                
                {/* Active ring indicator */}
                {isActive && (
                  <path
                    d={createRoundedSegmentPath(index, outerRadius + 5, outerRadius + 2)}
                    fill={phase.hoverColor}
                    opacity={0.7}
                  />
                )}

                {/* Phase Icon */}
                <foreignObject
                  x={iconPos.x - 20}
                  y={iconPos.y - 20}
                  width={40}
                  height={40}
                  className="pointer-events-none"
                >
                  <div 
                    className="flex items-center justify-center h-full w-full rounded-full"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <phase.icon 
                      className="h-5 w-5" 
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
            r={innerRadius - 8}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            className="drop-shadow-sm"
          />

          {/* Center content */}
          <foreignObject
            x={center - 28}
            y={center - 28}
            width={56}
            height={56}
          >
            <div className="flex items-center justify-center h-full">
              <div className="h-13 w-13 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
          </foreignObject>
        </svg>

        {/* Tooltip on hover/active */}
        {(hoveredPhase || activePhase) && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl px-5 py-3 shadow-lg animate-fade-in z-10"
            style={{ bottom: '-24px' }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: phases.find(p => p.id === (hoveredPhase || activePhase))?.bgColor }}
              />
              <p className="font-semibold text-foreground">
                {phases.find(p => p.id === (hoveredPhase || activePhase))?.name}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {phases.find(p => p.id === (hoveredPhase || activePhase))?.description}
            </p>
          </div>
        )}
      </div>

      {/* Current Phase Indicator */}
      <div className="flex items-center justify-between w-full max-w-md px-2">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: phases[0].bgColor }}
          />
          <span className="text-sm text-muted-foreground">
            Fase atual: <span className="font-semibold text-foreground capitalize">Despertar</span>
          </span>
        </div>
        <Link 
          to="/progress"
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Ver jornada
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Legend - horizontal aligned */}
      <div className="grid grid-cols-6 gap-2 w-full max-w-md">
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => handlePhaseClick(phase)}
            className={`flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg text-center transition-all duration-200 ${
              activePhase === phase.id 
                ? 'bg-secondary shadow-sm' 
                : phase.available ? 'hover:bg-secondary/50' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <div 
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: phase.bgColor }}
            />
            <span 
              className="text-xs font-medium leading-tight"
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
