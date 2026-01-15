import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Compass, ClipboardList, Rocket } from "lucide-react";

const pillars = [
  {
    icon: Compass,
    title: "Clareza",
    description: "Descubra quem você é e o que faz sentido para sua próxima fase profissional.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: ClipboardList,
    title: "Estratégia",
    description: "Transforme suas decisões em um plano realista e executável de 90 dias.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Rocket,
    title: "Ação",
    description: "Execute com acompanhamento, networking estratégico e mentoria especializada.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

export const LandingSolution = () => {
  return (
    <section id="como-funciona" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conheça o Migrei
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Um método estruturado que guia sua transição de carreira do autoconhecimento à ação.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="p-8 h-full text-center bg-card hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 group">
                <div className={`inline-flex p-4 rounded-2xl ${pillar.bgColor} mb-6 group-hover:scale-110 transition-transform`}>
                  <pillar.icon className={`h-8 w-8 ${pillar.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
