import { motion } from "framer-motion";
import { HeroMigreiWheel } from "./HeroMigreiWheel";
import { 
  Lightbulb, 
  Search, 
  Target, 
  Wrench, 
  Rocket, 
  Trophy,
  Sparkles
} from "lucide-react";
import { ScrollToNextButton } from "./ScrollToNextButton";
import { Button } from "@/components/ui/button";

const phases = [
  {
    number: 1,
    name: "Despertar",
    icon: Lightbulb,
    description: "Perceba a necessidade de mudança",
    color: "#F59E0B",
  },
  {
    number: 2,
    name: "Descobrir",
    icon: Search,
    description: "Entenda seus talentos e valores",
    color: "#10B981",
  },
  {
    number: 3,
    name: "Decidir",
    icon: Target,
    description: "Defina seu caminho com clareza",
    color: "#3B82F6",
  },
  {
    number: 4,
    name: "Desenvolver",
    icon: Wrench,
    description: "Construa as competências",
    color: "#8B5CF6",
  },
  {
    number: 5,
    name: "Deslanchar",
    icon: Rocket,
    description: "Conquiste oportunidades reais",
    color: "#EC4899",
  },
  {
    number: 6,
    name: "Desfrutar",
    icon: Trophy,
    description: "Consolide sua nova identidade",
    color: "#F97316",
  },
];

const PhaseCard = ({ phase, index, align = "left" }: { phase: typeof phases[0]; index: number; align?: "left" | "right" }) => (
  <motion.div
    className={`flex items-center gap-4 ${align === "left" ? "flex-row-reverse text-right" : "flex-row text-left"}`}
    initial={{ opacity: 0, x: align === "left" ? -20 : 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.3 + index * 0.1 }}
  >
    <div className="relative">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
        style={{ backgroundColor: `${phase.color}15` }}
      >
        <phase.icon className="h-5 w-5" style={{ color: phase.color }} />
      </div>
      {/* Phase number badge */}
      <div 
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
        style={{ backgroundColor: phase.color }}
      >
        {phase.number}
      </div>
    </div>
    <div>
      <h4 className="font-bold text-foreground">{phase.name}</h4>
      <p className="text-base text-muted-foreground">{phase.description}</p>
    </div>
  </motion.div>
);

export const LandingCycle = () => {
  return (
    <section id="ciclo-migrei" className="py-24 md:py-36 bg-muted/30">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wide">Metodologia</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            A sua{" "}
            <span className="relative inline-block text-primary">
              transição
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" aria-hidden="true">
                <path d="M2 6C50 2 150 2 198 6" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>{" "}
            com o Ciclo Migrei
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            <span className="font-semibold text-foreground">6 fases</span> para sair da incerteza e conquistar clareza e ação, com passos práticos em cada etapa.
          </p>
        </motion.div>

        {/* Desktop Layout - Phases aligned visually with wheel positions */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] gap-8 xl:gap-12 items-center">
          {/* Left Side - Phases on left of wheel (6, 5, 4 top to bottom) */}
          <div className="space-y-8">
            {[phases[5], phases[4], phases[3]].map((phase, index) => (
              <PhaseCard key={phase.number} phase={phase} index={index} align="left" />
            ))}
          </div>

          {/* Center Wheel */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HeroMigreiWheel />
          </motion.div>

          {/* Right Side - Phases on right of wheel (1, 2, 3 top to bottom) */}
          <div className="space-y-8">
            {[phases[0], phases[1], phases[2]].map((phase, index) => (
              <PhaseCard key={phase.number} phase={phase} index={index + 3} align="right" />
            ))}
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:block lg:hidden">
          <motion.div
            className="flex justify-center mb-10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <HeroMigreiWheel />
          </motion.div>

          <div className="grid grid-cols-3 gap-4">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.number}
                className="text-center p-4 rounded-xl bg-card/50 border border-border/30"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.06 }}
              >
                <div 
                  className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${phase.color}15` }}
                >
                  <phase.icon className="h-5 w-5" style={{ color: phase.color }} />
                </div>
                <h4 className="font-semibold text-sm text-foreground">{phase.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{phase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-3">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.number}
                className="p-4 rounded-xl bg-card border border-border/40"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${phase.color}15` }}
                  >
                    <phase.icon className="h-4 w-4" style={{ color: phase.color }} />
                  </div>
                  <span 
                    className="font-bold text-sm"
                    style={{ color: phase.color }}
                  >
                    {phase.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {phase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Simple CTA */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            className="rounded-full px-8"
            onClick={() => {
              const element = document.getElementById("planos");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Comece sua transição agora
          </Button>
        </motion.div>

        <ScrollToNextButton targetId="planos" />
      </div>
    </section>
  );
};
