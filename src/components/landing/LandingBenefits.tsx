import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Brain, 
  Target, 
  Calendar, 
  Users, 
  Network, 
  MessageCircle,
  Bot
} from "lucide-react";

const benefits = [
  {
    icon: Brain,
    text: "Diagnósticos de autoconhecimento validados",
  },
  {
    icon: Target,
    text: "Missões práticas para cada fase",
  },
  {
    icon: Calendar,
    text: "Plano de ação de 90 dias personalizado",
  },
  {
    icon: Users,
    text: "Comunidade de pessoas em transição",
  },
  {
    icon: Network,
    text: "Networking estratégico guiado",
  },
  {
    icon: MessageCircle,
    text: "Mentoria com especialistas",
  },
  {
    icon: Bot,
    text: "Coach IA disponível 24/7",
  },
];

export const LandingBenefits = () => {
  return (
    <section id="beneficios" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que você ganha com o Migrei
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-foreground font-medium">{benefit.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
