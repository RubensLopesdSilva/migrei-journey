import { motion } from "framer-motion";
import { Compass, ClipboardList, Rocket, Target, Bot, Users, GraduationCap, Check } from "lucide-react";
import { ScrollToNextButton } from "./ScrollToNextButton";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Compass,
    title: "Entenda quem você é",
    description: "Descubra seus talentos e valores.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "group-hover:border-amber-500/40",
  },
  {
    icon: ClipboardList,
    title: "Monte seu plano",
    description: "Plano de 90 dias executável.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "group-hover:border-blue-500/40",
  },
  {
    icon: Rocket,
    title: "Entre em ação",
    description: "Execute com acompanhamento.",
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
            Como a <span className="text-primary">Migrei</span> te ajuda
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Da confusão à clareza em 3 etapas simples.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 relative">
          {/* Connector line (desktop) */}
          <div className="hidden sm:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-amber-500/30 via-blue-500/30 to-emerald-500/30" />
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className={`group relative flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-border/60 ${step.borderColor} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Step number */}
              <span className="absolute -top-2.5 left-3 sm:left-4 text-[9px] sm:text-[10px] font-bold text-muted-foreground bg-background px-1.5 sm:px-2 rounded-full border border-border">
                {index + 1}
              </span>
              
              <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl ${step.bgColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                <step.icon className={`h-5 w-5 sm:h-7 sm:w-7 ${step.color}`} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{step.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <motion.div 
          className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 mb-6 sm:mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground"
            >
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
              <span>{benefit.text}</span>
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

        <ScrollToNextButton targetId="funcionalidades" />
      </div>
    </section>
  );
};
