import { motion } from "framer-motion";

const stats = [
  { value: "42%", label: "dos profissionais pretendem mudar de carreira" },
  { value: "51%", label: "dos brasileiros consideram uma transição de profissão" },
  { value: "56%", label: "dos profissionais estão abertos a uma nova carreira no próximo ano" },
];

export const LandingSocialProof = () => {
  return (
    <section className="py-12 border-y border-border/50 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg font-semibold text-foreground">
            Milhares de profissionais já transformaram suas carreiras
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-12 md:gap-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-[200px]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
