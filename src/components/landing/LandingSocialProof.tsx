import { motion } from "framer-motion";
import { TrendingUp, Users, Target } from "lucide-react";

const stats = [
  { 
    value: "2.500+", 
    label: "profissionais já usaram o Migrei",
    icon: Users,
  },
  { 
    value: "87%", 
    label: "relatam mais clareza em 30 dias",
    icon: Target,
  },
  { 
    value: "3x", 
    label: "mais rápido que fazer sozinho",
    icon: TrendingUp,
  },
];

export const LandingSocialProof = () => {
  return (
    <section className="py-12 md:py-16 border-y border-border/50 bg-muted/20">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </span>
                <p className="text-sm text-muted-foreground max-w-[160px]">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
