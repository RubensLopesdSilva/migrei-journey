import { motion } from "framer-motion";
import { TrendingUp, Users, Target, Sparkles } from "lucide-react";

const stats = [
  { 
    value: "2.500+", 
    label: "profissionais já usaram o Migrei",
    Icon: Users,
    bgColor: "bg-primary",
    textColor: "text-primary",
  },
  { 
    value: "87%", 
    label: "relatam mais clareza em 30 dias",
    Icon: Target,
    bgColor: "bg-accent",
    textColor: "text-accent",
  },
  { 
    value: "3x", 
    label: "mais rápido que fazer sozinho",
    Icon: TrendingUp,
    bgColor: "bg-emerald-500",
    textColor: "text-emerald-500",
  },
];

export const LandingSocialProof = () => {
  return (
    <section id="resultados" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-phase-3/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Resultados Comprovados</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            Números que <span className="text-gradient-primary">falam por si</span>
          </h3>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.15 }}
            >
              {/* Card */}
              <div className="relative p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group-hover:-translate-y-1">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 rounded-2xl ${stat.bgColor}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center mb-6 shadow-lg`}>
                  <stat.Icon className="h-7 w-7 text-white" />
                </div>
                
                {/* Value */}
                <div className={`text-4xl md:text-5xl font-bold ${stat.textColor} mb-3`}>
                  {stat.value}
                </div>
                
                {/* Label */}
                <p className="text-muted-foreground text-base leading-relaxed">
                  {stat.label}
                </p>

                {/* Decorative corner */}
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${stat.bgColor} opacity-50`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
