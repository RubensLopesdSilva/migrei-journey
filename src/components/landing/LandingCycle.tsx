import { motion } from "framer-motion";
import { HeroMigreiWheel } from "./HeroMigreiWheel";
import { 
  Lightbulb, 
  Search, 
  Target, 
  Wrench, 
  Rocket, 
  Trophy,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const phases = [
  {
    number: 1,
    name: "Despertar",
    icon: Lightbulb,
    description: "Reconheça a necessidade de mudança",
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
    description: "Escolha seu caminho com clareza",
    color: "#3B82F6",
  },
  {
    number: 4,
    name: "Desenvolver",
    icon: Wrench,
    description: "Construa as competências necessárias",
    color: "#8B5CF6",
  },
  {
    number: 5,
    name: "Deslanchar",
    icon: Rocket,
    description: "Execute e conquiste oportunidades",
    color: "#EC4899",
  },
  {
    number: 6,
    name: "Desfrutar",
    icon: Trophy,
    description: "Celebre sua nova identidade",
    color: "#F97316",
  },
];

const methodologyPoints = [
  "Metodologia validada por especialistas em transição de carreira",
  "Acompanhamento personalizado com IA em cada etapa",
  "Ferramentas práticas e exercícios guiados",
  "Comunidade de suporte durante toda a jornada",
];

export const LandingCycle = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Nossa Metodologia
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            O Ciclo Migrei
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma jornada estruturada em <span className="text-primary font-semibold">6 fases</span> que 
            transforma a incerteza profissional em clareza e ação.
          </p>
        </motion.div>

        {/* Main Content - Desktop */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Left: Wheel */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HeroMigreiWheel />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Uma metodologia completa para sua transição
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                O Ciclo Migrei foi desenvolvido para guiar você do momento em que percebe 
                a necessidade de mudança até a celebração da sua nova carreira. Cada fase 
                foi cuidadosamente estruturada com ferramentas, exercícios e suporte especializado.
              </p>
            </div>

            {/* Methodology Points */}
            <div className="space-y-3">
              {methodologyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{point}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <Button 
                size="lg" 
                className="group"
                onClick={() => navigate("/auth?tab=signup")}
              >
                Começar minha jornada
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Tablet View */}
        <div className="hidden md:block lg:hidden">
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <HeroMigreiWheel />
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-muted-foreground leading-relaxed">
              O Ciclo Migrei foi desenvolvido para guiar você do momento em que percebe 
              a necessidade de mudança até a celebração da sua nova carreira.
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-left">
              {methodologyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-sm text-foreground">{point}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="group"
              onClick={() => navigate("/auth?tab=signup")}
            >
              Começar minha jornada
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        {/* Mobile: Grid Layout */}
        <div className="md:hidden space-y-8">
          <div className="grid grid-cols-2 gap-3">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.number}
                className="p-4 rounded-xl bg-card border border-border/50 active:scale-95 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: phase.color }}
                  >
                    <phase.icon className="h-4 w-4 text-white" />
                  </div>
                  <span 
                    className="font-semibold text-sm"
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

          {/* Mobile Methodology Points */}
          <motion.div
            className="space-y-3 bg-muted/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {methodologyPoints.slice(0, 2).map((point, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{point}</span>
              </div>
            ))}
          </motion.div>

          {/* Mobile CTA */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="w-full group"
              onClick={() => navigate("/auth?tab=signup")}
            >
              Começar minha jornada
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
