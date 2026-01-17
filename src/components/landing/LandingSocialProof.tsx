import { motion } from "framer-motion";

const stats = [
  { value: "42%", label: "dos profissionais pretendem mudar de carreira.", source: "CNN Brasil" },
  { value: "51%", label: "dos brasileiros consideram uma transição de profissão.", source: "SEGS" },
  { value: "56%", label: "dos profissionais estão abertos a uma nova carreira no próximo ano.", source: "Robert Half" },
];

export const LandingSocialProof = () => {
  return (
    <section className="py-12 border-y border-border/50 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                  {stat.value}
                </span>
                <span className="text-base md:text-lg text-muted-foreground">
                  {stat.label}
                </span>
                <span className="text-xs text-primary/70 font-medium bg-primary/10 px-2 py-0.5 rounded">
                  {stat.source}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
