import { motion } from "framer-motion";
import { HeroMigreiWheel } from "./HeroMigreiWheel";
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
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
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

        {/* HeroMigreiWheel Component */}
        <div className="flex justify-center">
          <HeroMigreiWheel />
        </div>

        {/* Mobile: Grid Layout */}
        <div className="md:hidden grid grid-cols-2 gap-4 mt-8">
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
    </section>
  );
};
