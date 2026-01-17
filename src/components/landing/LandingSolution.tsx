import { motion } from "framer-motion";
import { Compass, ClipboardList, Rocket, CheckCircle2 } from "lucide-react";
import logoMigrei from "@/assets/logo-migrei.png";
const steps = [{
  icon: Compass,
  title: "Entenda quem você é",
  description: "Descubra seus talentos, valores e o que faz sentido para sua próxima fase.",
  color: "text-amber-500",
  bgColor: "bg-amber-500/10"
}, {
  icon: ClipboardList,
  title: "Monte seu plano",
  description: "Transforme decisões em um plano de 90 dias realista e executável.",
  color: "text-blue-500",
  bgColor: "bg-blue-500/10"
}, {
  icon: Rocket,
  title: "Entre em ação",
  description: "Execute com acompanhamento, networking e mentoria especializada.",
  color: "text-emerald-500",
  bgColor: "bg-emerald-500/10"
}];
const benefits = ["Método em 6 fases", "IA personalizada", "Networking prático", "Mentores disponíveis"];
export const LandingSolution = () => {
  return <section id="como-funciona" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <motion.div className="text-center mb-16" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3 flex-wrap">Como a
te ajuda<img src={logoMigrei} alt="Migrei" className="h-16 md:h-20 lg:h-24 inline-block" /> te ajuda
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Um método estruturado que te leva da confusão à clareza em 3 etapas.</p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => <motion.div key={index} className="relative" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: index * 0.15
        }}>
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent" />}
              
              <div className="text-center">
                {/* Step number */}
                <div className="relative inline-flex mb-6">
                  <div className={`w-20 h-20 rounded-2xl ${step.bgColor} flex items-center justify-center`}>
                    <step.icon className={`h-10 w-10 ${step.color}`} />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>)}
        </div>

        {/* Benefits list */}
        <motion.div className="bg-muted/30 rounded-2xl p-8 md:p-10" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        delay: 0.3
      }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => <motion.div key={index} className="flex items-center gap-3" initial={{
            opacity: 0,
            x: -10
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.4 + index * 0.1
          }}>
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium">{benefit}</span>
              </motion.div>)}
          </div>
        </motion.div>
      </div>
    </section>;
};