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
          <div className="hidden md:block relative h-[500px]">
            {/* Center text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <AnimatePresence mode="wait">
                {activePhase !== null ? (
                  <motion.div
                    key={activePhase}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="max-w-[200px]"
                  >
                    <h3 
                      className="text-2xl font-bold mb-2"
                      style={{ color: phases[activePhase].color }}
                    >
                      {phases[activePhase].name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {phases[activePhase].description}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-muted-foreground text-sm">
                      Passe o mouse nas fases
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Circular phases */}
            {phases.map((phase, index) => {
              const angle = (index * 60 - 90) * (Math.PI / 180);
              const radius = 200;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={phase.number}
                  className="absolute top-1/2 left-1/2 cursor-pointer"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setActivePhase(index)}
                  onMouseLeave={() => setActivePhase(null)}
                >
                  <motion.div
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all"
                    whileHover={{ scale: 1.1 }}
                    style={{
                      backgroundColor: activePhase === index 
                        ? `${phase.color}20` 
                        : 'transparent',
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: phase.color }}
                    >
                      <phase.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="font-semibold text-foreground">
                      {phase.name}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Connecting circle */}
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] pointer-events-none"
            >
              <circle
                cx="210"
                cy="210"
                r="200"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                strokeDasharray="10 5"
              />
            </svg>
          </div>

          {/* Mobile: Grid Layout */}
          <div className="md:hidden grid grid-cols-2 gap-4">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.number}
                className="p-4 rounded-xl bg-card border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: phase.color }}
                  >
                    <phase.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-foreground">
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
