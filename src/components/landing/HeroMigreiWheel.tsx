import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, 
  Search, 
  Target, 
  Wrench, 
  Rocket, 
  Trophy,
  User
} from "lucide-react";

const phases = [
  {
    number: 1,
    name: "Despertar",
    icon: Lightbulb,
    description: "Perceba a necessidade de mudança e dê o primeiro passo.",
    color: "#F59E0B", // amber/orange
    startAngle: -60,
  },
  {
    number: 2,
    name: "Descobrir",
    icon: Search,
    description: "Entenda seus talentos, valores e interesses profundos.",
    color: "#10B981", // emerald/teal
    startAngle: 0,
  },
  {
    number: 3,
    name: "Decidir",
    icon: Target,
    description: "Escolha um caminho com base em clareza, não em pressão.",
    color: "#3B82F6", // blue
    startAngle: 60,
  },
  {
    number: 4,
    name: "Desenvolver",
    icon: Wrench,
    description: "Prepare-se com as habilidades necessárias.",
    color: "#8B5CF6", // purple
    startAngle: 120,
  },
  {
    number: 5,
    name: "Deslanchar",
    icon: Rocket,
    description: "Execute seu plano e conquiste oportunidades.",
    color: "#EC4899", // pink
    startAngle: 180,
  },
  {
    number: 6,
    name: "Desfrutar",
    icon: Trophy,
    description: "Celebre e consolide sua nova identidade profissional.",
    color: "#F97316", // orange
    startAngle: 240,
  },
];

// Helper function to create pie segment path
const createPieSegment = (
  centerX: number,
  centerY: number,
  radius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
): string => {
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);

  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);
  const x3 = centerX + innerRadius * Math.cos(endRad);
  const y3 = centerY + innerRadius * Math.sin(endRad);
  const x4 = centerX + innerRadius * Math.cos(startRad);
  const y4 = centerY + innerRadius * Math.sin(startRad);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
};

// Get icon position in the middle of a segment
const getIconPosition = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
  const iconRadius = radius * 0.7;
  return {
    x: centerX + iconRadius * Math.cos(midAngle),
    y: centerY + iconRadius * Math.sin(midAngle),
  };
};

export const HeroMigreiWheel = () => {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const size = 320;
  const center = size / 2;
  const outerRadius = 140;
  const innerRadius = 55;
  const segmentAngle = 60;

  const handleMouseEnter = (index: number, event: React.MouseEvent) => {
    setActivePhase(index);
    const rect = event.currentTarget.getBoundingClientRect();
    const svgRect = event.currentTarget.closest('svg')?.getBoundingClientRect();
    if (svgRect) {
      setTooltipPosition({
        x: rect.left - svgRect.left + rect.width / 2,
        y: rect.top - svgRect.top + rect.height / 2,
      });
    }
  };

  return (
    <div className="relative">
      {/* Glow effect */}
      <div 
        className="absolute inset-0 blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(16,185,129,0.2) 30%, rgba(139,92,246,0.2) 60%, transparent 80%)"
        }}
      />
      
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10 drop-shadow-xl"
        initial={{ scale: 0.8, opacity: 0, rotate: -30 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Shadow filter */}
        <defs>
          <filter id="wheelShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
          </filter>
          <filter id="segmentGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* White background circle */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius + 8}
          fill="white"
          filter="url(#wheelShadow)"
        />

        {/* Segments */}
        {phases.map((phase, index) => {
          const startAngle = phase.startAngle;
          const endAngle = startAngle + segmentAngle;
          const isActive = activePhase === index;
          const iconPos = getIconPosition(center, center, outerRadius, startAngle, endAngle);

          return (
            <g
              key={phase.number}
              onMouseEnter={(e) => handleMouseEnter(index, e)}
              onMouseLeave={() => setActivePhase(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Segment */}
              <motion.path
                d={createPieSegment(center, center, outerRadius, innerRadius, startAngle, endAngle)}
                fill={phase.color}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: isActive ? 1.05 : 1,
                  filter: isActive ? "url(#segmentGlow)" : "none"
                }}
                transition={{ 
                  opacity: { delay: index * 0.1, duration: 0.4 },
                  scale: { duration: 0.2 }
                }}
                style={{ 
                  transformOrigin: `${center}px ${center}px`,
                }}
              />

              {/* Icon background circle */}
              <motion.circle
                cx={iconPos.x}
                cy={iconPos.y}
                r={18}
                fill="rgba(255,255,255,0.25)"
                initial={{ scale: 0 }}
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
              />

              {/* Icon */}
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
              >
                <foreignObject
                  x={iconPos.x - 12}
                  y={iconPos.y - 12}
                  width={24}
                  height={24}
                >
                  <phase.icon 
                    className="w-6 h-6 text-white drop-shadow-sm" 
                    strokeWidth={1.5}
                  />
                </foreignObject>
              </motion.g>
            </g>
          );
        })}

        {/* Center circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        />
        
        {/* Center icon */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <foreignObject
            x={center - 16}
            y={center - 16}
            width={32}
            height={32}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <User className="w-7 h-7 text-primary/70" strokeWidth={1.5} />
            </div>
          </foreignObject>
        </motion.g>
      </motion.svg>

      {/* Tooltip */}
      <AnimatePresence>
        {activePhase !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 bg-white rounded-xl shadow-xl p-4 min-w-[200px] max-w-[240px] border border-border/50"
            style={{
              left: "50%",
              bottom: "-20px",
              transform: "translateX(-50%)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: phases[activePhase].color }}
              />
              <span className="font-bold text-foreground">
                {phases[activePhase].name}
              </span>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                Fase {phases[activePhase].number}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {phases[activePhase].description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
