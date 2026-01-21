import { motion } from "framer-motion";
import { Check } from "lucide-react";

const benefits = [
  "Clareza sobre qual carreira seguir",
  "Plano de ação de 90 dias personalizado",
  "Mentor IA disponível 24/7",
  "Networking com profissionais em transição",
  "Acompanhamento do seu progresso",
];

export const LandingBenefits = () => {
  return (
    <section id="beneficios" className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              O que você ganha com o Migrei
            </h2>
            
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl" />
            
            {/* Main visual container */}
            <div className="relative bg-gradient-to-br from-muted/50 to-background rounded-3xl p-8 border border-border/50">
              {/* Floating card 1 */}
              <motion.div
                className="absolute -top-4 right-8 bg-card rounded-xl p-3 shadow-lg border border-border/50"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Maria Silva</p>
                    <p className="text-xs text-muted-foreground">Mentora de Carreira</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </motion.div>

              {/* Central image placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl">🚀</span>
                  </div>
                  <p className="text-muted-foreground text-sm">Sua jornada de transição</p>
                </div>
              </div>

              {/* Floating card 2 */}
              <motion.div
                className="absolute -bottom-4 left-8 bg-card rounded-xl p-4 shadow-lg border border-border/50"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">90</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Plano de Ação</p>
                    <p className="text-sm font-semibold text-foreground">Dias para transição</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating card 3 */}
              <motion.div
                className="absolute top-1/2 -right-4 bg-card rounded-xl p-3 shadow-lg border border-border/50"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-xs font-medium text-foreground">Transição concluída!</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
