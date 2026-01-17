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
  Sparkles,
  Brain,
  Users,
  Zap
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

const differentials = [
  {
    icon: Sparkles,
    title: "Clareza em vez de confusão",
    description: "Saia do 'não sei o que fazer' para um plano de ação concreto e personalizado.",
  },
  {
    icon: Brain,
    title: "IA que entende você",
    description: "Orientação inteligente que se adapta ao seu momento, estilo e objetivos únicos.",
  },
  {
    icon: Zap,
    title: "Progresso real, não teoria",
    description: "Cada fase entrega resultados tangíveis. Você sente que está avançando.",
  },
  {
    icon: Users,
    title: "Nunca sozinho na jornada",
    description: "Comunidade de pessoas em transição + mentores que já passaram por isso.",
  },
];

export const LandingCycle = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Metodologia exclusiva</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Da incerteza à realização em{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              6 fases
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Você não precisa descobrir tudo sozinho. O <span className="font-semibold text-foreground">Ciclo Migrei</span> é 
            o mapa que transforma o caos da transição em passos claros e conquistas reais.
          </p>
        </motion.div>

        {/* Main Content - Desktop */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-16 xl:gap-24 items-center mb-20">
          {/* Left: Wheel */}
          <motion.div
            className="flex justify-center relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Decorative ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[520px] h-[520px] rounded-full border border-dashed border-primary/10" />
            </div>
            <HeroMigreiWheel />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                Chega de se sentir perdido.
                <br />
                <span className="text-primary">Chegou a hora de migrar.</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Cada fase do Ciclo foi desenhada para você sair do ponto A com clareza, 
                ferramentas e a confiança que faltava. Sem atalhos. Sem promessas vazias.
              </p>
            </div>

            {/* Differentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {differentials.map((item, index) => (
                <motion.div
                  key={index}
                  className="group p-5 rounded-2xl bg-gradient-to-br from-card to-card/80 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <Button 
                size="lg" 
                className="group text-base px-8 h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                onClick={() => navigate("/auth?tab=signup")}
              >
                Quero começar agora
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="text-sm text-muted-foreground mt-2 sm:mt-3">
                Gratuito para começar. Sem cartão.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Tablet View */}
        <div className="hidden md:block lg:hidden">
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <HeroMigreiWheel />
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Chega de se sentir perdido. <span className="text-primary">Chegou a hora de migrar.</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Cada fase do Ciclo foi desenhada para você sair com clareza, 
                ferramentas e a confiança que faltava.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {differentials.map((item, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-xl bg-card border border-border/50"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.08 }}
                >
                  <div className="p-2 rounded-lg bg-primary/10 w-fit mb-3">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                className="group shadow-lg shadow-primary/20"
                onClick={() => navigate("/auth?tab=signup")}
              >
                Quero começar agora
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Gratuito para começar. Sem cartão.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mobile: Card Layout */}
        <div className="md:hidden space-y-10">
          {/* Phases Grid */}
          <div className="grid grid-cols-2 gap-3">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.number}
                className="p-4 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 active:scale-[0.98] transition-transform"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: phase.color }}
                  >
                    <phase.icon className="h-4 w-4 text-white" />
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

          {/* Mobile Value Props */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-foreground text-center">
              Por que o Ciclo Migrei funciona?
            </h3>
            
            <div className="space-y-3">
              {differentials.slice(0, 3).map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/40"
                >
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mobile CTA */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="w-full group h-12 text-base shadow-lg shadow-primary/20"
              onClick={() => navigate("/auth?tab=signup")}
            >
              Quero começar agora
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Gratuito para começar. Sem cartão.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
