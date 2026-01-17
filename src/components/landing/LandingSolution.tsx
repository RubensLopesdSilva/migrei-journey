import { motion } from "framer-motion";
import { Compass, ClipboardList, Rocket, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import logoMigrei from "@/assets/logo-migrei.png";
import { useState } from "react";
import { ScrollToNextButton } from "./ScrollToNextButton";

const steps = [
  {
    icon: Compass,
    title: "Entenda quem você é",
    description: "Descubra seus talentos, valores e o que faz sentido para sua próxima fase.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    hoverBgColor: "group-hover:bg-amber-500/20",
    borderColor: "border-amber-500/20",
    glowColor: "group-hover:shadow-amber-500/20",
    highlight: "Autoconhecimento"
  },
  {
    icon: ClipboardList,
    title: "Monte seu plano",
    description: "Transforme decisões em um plano de 90 dias realista e executável.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    hoverBgColor: "group-hover:bg-blue-500/20",
    borderColor: "border-blue-500/20",
    glowColor: "group-hover:shadow-blue-500/20",
    highlight: "Estratégia"
  },
  {
    icon: Rocket,
    title: "Entre em ação",
    description: "Execute com acompanhamento, networking e mentoria especializada.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    hoverBgColor: "group-hover:bg-emerald-500/20",
    borderColor: "border-emerald-500/20",
    glowColor: "group-hover:shadow-emerald-500/20",
    highlight: "Execução"
  }
];

const benefits = [
  { text: "Método em 6 fases", icon: "🎯", description: "Jornada estruturada e progressiva" },
  { text: "IA personalizada", icon: "🤖", description: "Assistente que entende seu momento" },
  { text: "Networking prático", icon: "🤝", description: "Conexões que abrem portas" },
  { text: "Mentores disponíveis", icon: "👨‍🏫", description: "Orientação de quem já passou por isso" }
];

export const LandingSolution = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="como-funciona" className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Header with enhanced styling */}
        <motion.div 
          className="text-center mb-20" 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Eyebrow */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Simples e eficaz</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 flex items-center justify-center gap-3 flex-wrap">
            Como a <img src={logoMigrei} alt="Migrei" className="h-16 md:h-20 lg:h-24 inline-block" /> te ajuda
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Da <span className="text-foreground font-medium">confusão</span> à <span className="text-primary font-medium">clareza</span> em 3 etapas simples.
          </p>
        </motion.div>

        {/* Steps with enhanced cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 relative">
          {/* Progress line connecting cards (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16.5%] right-[16.5%] h-1">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500/30 via-blue-500/30 to-emerald-500/30 rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card */}
              <motion.div 
                className={`
                  relative p-8 rounded-3xl border bg-card/50 backdrop-blur-sm
                  ${step.borderColor} 
                  transition-all duration-500 ease-out cursor-pointer
                  group-hover:shadow-2xl ${step.glowColor}
                  group-hover:border-opacity-50
                  group-hover:-translate-y-2
                `}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Highlight tag */}
                <motion.span 
                  className={`absolute -top-3 left-6 px-3 py-1 text-xs font-semibold rounded-full ${step.bgColor} ${step.color}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0, y: hoveredIndex === index ? 0 : 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {step.highlight}
                </motion.span>

                <div className="text-center">
                  {/* Icon container with enhanced styling */}
                  <div className="relative inline-flex mb-6">
                    <motion.div 
                      className={`
                        w-24 h-24 rounded-3xl ${step.bgColor} ${step.hoverBgColor}
                        flex items-center justify-center
                        transition-all duration-300
                        group-hover:scale-110
                      `}
                      animate={{
                        rotate: hoveredIndex === index ? [0, -5, 5, 0] : 0
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <step.icon className={`h-12 w-12 ${step.color} transition-transform duration-300 group-hover:scale-110`} />
                    </motion.div>
                    
                    {/* Step number badge */}
                    <motion.span 
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      {index + 1}
                    </motion.span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Learn more indicator */}
                  <motion.div 
                    className="mt-4 flex items-center justify-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: -10 }}
                    animate={{ x: hoveredIndex === index ? 0 : -10 }}
                  >
                    <span>Saiba mais</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Mobile connector line */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center my-4">
                  <motion.div 
                    className="w-0.5 h-8 bg-gradient-to-b from-border to-transparent"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Benefits list with enhanced styling */}
        <motion.div 
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {/* Glass background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 backdrop-blur-xl" />
          <div className="absolute inset-0 border border-primary/10 rounded-3xl" />
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative z-10 p-8 md:p-12">
            {/* Section header */}
            <div className="text-center mb-10">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Incluído na plataforma</span>
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                O que você recebe
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 h-full">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      {/* Icon with animated background */}
                      <div className="relative mb-4">
                        <motion.div 
                          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <span className="text-3xl">{benefit.icon}</span>
                        </motion.div>
                        {/* Check badge */}
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                        </div>
                      </div>
                      
                      {/* Text content */}
                      <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {benefit.text}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <ScrollToNextButton targetId="funcionalidades" />
      </div>
    </section>
  );
};
