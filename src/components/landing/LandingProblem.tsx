import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const problems = [
  {
    emoji: "😰",
    text: "Sinto que estou no lugar errado, mas não sei para onde ir",
  },
  {
    emoji: "🔄",
    text: "Já pensei em mudar, mas o medo de errar me paralisa",
  },
  {
    emoji: "📉",
    text: "Minha carreira estagnou e não sei como recomeçar",
  },
  {
    emoji: "🤯",
    text: "Tenho tantas opções que não consigo decidir nenhuma",
  },
];

export const LandingProblem = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Você se reconhece?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full bg-card hover:bg-card/80 transition-colors border-border/50 hover:border-primary/30">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{problem.emoji}</span>
                  <p className="text-lg text-foreground/90 leading-relaxed">
                    "{problem.text}"
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-lg md:text-xl text-muted-foreground mt-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Se você se identificou com alguma dessas frases, você não está sozinho.{" "}
          <span className="text-primary font-semibold">
            E mais importante: existe um caminho.
          </span>
        </motion.p>
      </div>
    </section>
  );
};
