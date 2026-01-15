import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, 
  Search, 
  Target, 
  Wrench, 
  Rocket, 
  Trophy 
} from "lucide-react";

const phases = [
  {
    number: 1,
    name: "Despertar",
    icon: Lightbulb,
    description: "Reconheça que algo precisa mudar e desperte para novas possibilidades.",
    color: "hsl(var(--phase-1))",
  },
  {
    number: 2,
    name: "Descobrir",
    icon: Search,
    description: "Entenda seus talentos, valores e interesses profundos.",
    color: "hsl(var(--phase-2))",
  },
  {
    number: 3,
    name: "Decidir",
    icon: Target,
    description: "Escolha um caminho com base em clareza, não em pressão.",
    color: "hsl(var(--phase-3))",
  },
  {
    number: 4,
    name: "Desenvolver",
    icon: Wrench,
    description: "Prepare-se com as habilidades necessárias para sua nova carreira.",
    color: "hsl(var(--phase-4))",
  },
  {
    number: 5,
    name: "Deslanchar",
    icon: Rocket,
    description: "Execute seu plano e conquiste oportunidades reais.",
    color: "hsl(var(--phase-5))",
  },
  {
    number: 6,
    name: "Desfrutar",
    icon: Trophy,
    description: "Celebre e consolide sua nova identidade profissional.",
    color: "hsl(var(--phase-6))",
  },
];

export const LandingCycle = () => {
  const [activePhase, setActivePhase] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O Ciclo Migrei
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Toda transição bem-sucedida passa por estas 6 fases.
          </p>
        </motion.div>

        {/* Cycle Visualization */}
        <div className="relative max-w-4xl mx-auto">
          {/* Desktop: Circular Layout */}
          <div className="hidden md:flex items-center justify-center relative" style={{ height: "520px" }}>
            {/* Connecting circle - rendered first (behind) */}
            <svg
              className="absolute w-[440px] h-[440px] pointer-events-none"
              style={{ zIndex: 0 }}
            >
              <motion.circle
                cx="220"
                cy="220"
                r="200"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                strokeDasharray="12 6"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>

            {/* Center content */}
            <div 
              className="absolute flex items-center justify-center"
              style={{ zIndex: 5 }}
            >
              <div className="w-[180px] h-[180px] rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg">
                <AnimatePresence mode="wait">
                  {activePhase !== null ? (
                    <motion.div
                      key={`phase-${activePhase}`}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="text-center px-4"
                    >
                      <motion.div
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: phases[activePhase].color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        {(() => {
                          const IconComponent = phases[activePhase].icon;
                          return <IconComponent className="h-6 w-6 text-white" />;
                        })()}
                      </motion.div>
                      <h3 
                        className="text-xl font-bold mb-1"
                        style={{ color: phases[activePhase].color }}
                      >
                        {phases[activePhase].name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {phases[activePhase].description}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center px-4"
                    >
                      <motion.div 
                        className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center"
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="w-3 h-3 rounded-full bg-primary/50" />
                      </motion.div>
                      <p className="text-sm text-muted-foreground">
                        Passe o mouse nas fases
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Phase nodes positioned in circle */}
            {phases.map((phase, index) => {
              const angle = (index * 60 - 90) * (Math.PI / 180);
              const radius = 200;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isActive = activePhase === index;

              return (
                <motion.div
                  key={phase.number}
                  className="absolute cursor-pointer"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                    zIndex: isActive ? 20 : 10,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  onMouseEnter={() => setActivePhase(index)}
                  onMouseLeave={() => setActivePhase(null)}
                >
                  <motion.div
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl"
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      backgroundColor: isActive ? "hsl(var(--card))" : "transparent",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                      boxShadow: isActive 
                        ? "0 10px 40px -10px rgba(0,0,0,0.2)" 
                        : "none",
                    }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden"
                      style={{ backgroundColor: phase.color }}
                      animate={{
                        boxShadow: isActive 
                          ? `0 0 30px 5px ${phase.color}40`
                          : "0 4px 14px -3px rgba(0,0,0,0.2)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Pulse effect when active */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: phase.color }}
                          initial={{ scale: 1, opacity: 0.5 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ 
                            duration: 1, 
                            repeat: Infinity,
                            ease: "easeOut"
                          }}
                        />
                      )}
                      <phase.icon className="h-7 w-7 text-white relative z-10" />
                    </motion.div>
                    <motion.span 
                      className="font-semibold text-sm whitespace-nowrap"
                      animate={{
                        color: isActive ? phase.color : "hsl(var(--foreground))",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {phase.name}
                    </motion.span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile: Grid Layout */}
          <div className="md:hidden grid grid-cols-2 gap-4">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.number}
                className="p-4 rounded-xl bg-card border border-border/50 active:scale-95 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: phase.color }}
                  >
                    <phase.icon className="h-5 w-5 text-white" />
                  </div>
                  <span 
                    className="font-semibold"
                    style={{ color: phase.color }}
                  >
                    {phase.name}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {phase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
