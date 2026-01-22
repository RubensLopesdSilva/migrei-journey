import { motion } from "framer-motion";
import { Compass, ClipboardList, Rocket, Target, Bot, Users, GraduationCap } from "lucide-react";
import { ScrollToNextButton } from "./ScrollToNextButton";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Compass,
    title: "Entenda quem você é",
    description: "Descubra seus talentos e valores.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: ClipboardList,
    title: "Monte seu plano",
    description: "Plano de 90 dias executável.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Rocket,
    title: "Entre em ação",
    description: "Execute com acompanhamento.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  }
];

const benefits = [
  { text: "Método em 6 fases", Icon: Target, color: "text-rose-500" },
  { text: "IA personalizada", Icon: Bot, color: "text-violet-500" },
  { text: "Networking prático", Icon: Users, color: "text-amber-500" },
  { text: "Mentores disponíveis", Icon: GraduationCap, color: "text-emerald-500" }
];

export const LandingSolution = () => {
  return (
    <section id="como-funciona" className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30 relative">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <motion.div 
          className="text-center mb-12" 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Como a <span className="text-primary">Migrei</span> te ajuda
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Da confusão à clareza em 3 etapas simples.
          </p>
        </motion.div>

        {/* Steps - Compact horizontal layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-xl ${step.bgColor} flex items-center justify-center shrink-0`}>
                <step.icon className={`h-6 w-6 ${step.color}`} />
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground">Etapa {index + 1}</span>
                <h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits - Inline compact */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/50"
            >
              <benefit.Icon className={`w-4 h-4 ${benefit.color}`} />
              <span className="text-sm text-foreground">{benefit.text}</span>
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
            className="rounded-full px-8"
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
