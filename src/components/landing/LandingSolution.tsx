import { motion } from "framer-motion";
import { Compass, ClipboardList, Rocket, Target, Bot, Users, GraduationCap, Check } from "lucide-react";
import { ScrollToNextButton } from "./ScrollToNextButton";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Compass,
    title: "Descubra seu potencial",
    description: "Mapeie talentos, valores e o que te faz único.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "group-hover:border-amber-500/40",
  },
  {
    icon: ClipboardList,
    title: "Crie seu plano de ação",
    description: "90 dias com metas claras e passos práticos.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "group-hover:border-blue-500/40",
  },
  {
    icon: Rocket,
    title: "Execute com suporte",
    description: "Avance com IA, mentores e comunidade ao seu lado.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "group-hover:border-emerald-500/40",
  }
];

const benefits = [
  { text: "Método em 6 fases", Icon: Target },
  { text: "IA personalizada", Icon: Bot },
  { text: "Networking prático", Icon: Users },
  { text: "Mentores disponíveis", Icon: GraduationCap }
];

export const LandingSolution = () => {
  return (
    <section id="como-funciona" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background to-muted/30 relative scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-10" 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Como a <span className="text-primary font-display">Migrei</span> te ajuda
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Sua transição de carreira, simplificada em 3 passos.
          </p>
        </motion.div>

        {/* Steps - Vertical timeline on mobile */}
        <div className="relative max-w-md mx-auto sm:max-w-none">
          {/* Connector line (mobile) */}
          <div className="sm:hidden absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-amber-500/40 via-blue-500/40 to-emerald-500/40 rounded-full" />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4 md:gap-6 mb-8 sm:mb-10 relative">
            {/* Connector line (desktop) */}
            <div className="hidden sm:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-amber-500/30 via-blue-500/30 to-emerald-500/30" />
            
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className={`group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border/60 ${step.borderColor} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default ml-2 sm:ml-0`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                {/* Step number badge - positioned on timeline for mobile */}
                <span className="absolute -left-3 sm:-top-2.5 sm:left-4 top-1/2 sm:top-auto -translate-y-1/2 sm:translate-y-0 w-6 h-6 sm:w-auto sm:h-auto flex items-center justify-center text-[10px] font-bold text-white sm:text-muted-foreground bg-primary sm:bg-background px-0 sm:px-2 py-0.5 rounded-full border-2 border-background sm:border-border z-10">
                  {index + 1}
                </span>
                
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${step.bgColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                  <step.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${step.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-base text-foreground mb-0.5">{step.title}</h3>
                  <p className="text-sm sm:text-sm text-muted-foreground leading-snug">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits - 2x2 grid on mobile */}
        <motion.div 
          className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-3 mb-8 max-w-sm mx-auto sm:max-w-none"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 sm:bg-transparent px-3 py-2 sm:p-0 rounded-lg"
            >
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 sm:hidden">
                <benefit.Icon className="w-3 h-3 text-primary" />
              </div>
              <Check className="hidden sm:block w-4 h-4 text-primary shrink-0" />
              <span className="leading-tight">{benefit.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button
            size="lg"
            className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            onClick={() => {
              const element = document.getElementById("planos");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Começar agora
          </Button>
        </motion.div>

        <ScrollToNextButton targetId="recursos" />
      </div>
    </section>
  );
};
