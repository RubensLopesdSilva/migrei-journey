import { motion } from "framer-motion";

const stats = [
  { value: "42%", label: "dos profissionais pretendem mudar de carreira.", source: "CNN Brasil" },
  { value: "51%", label: "dos brasileiros consideram uma transição de profissão.", source: "SEGS" },
  { value: "56%", label: "estão abertos a mudar de carreira em 2026.", source: "Robert Half" },
];

export const LandingSocialProof = () => {
  return (
    <section className="py-16 border-y border-border/50 bg-muted/30">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          A transição de carreira já é realidade para milhões de profissionais
        </motion.h2>

        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center max-w-[250px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-3">
                {stat.value}
              </span>
              <span className="text-base md:text-lg text-muted-foreground mb-2">
                {stat.label}
              </span>
              <span className="text-xs text-primary/70 font-medium bg-primary/10 px-3 py-1 rounded">
                {stat.source}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
