import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Estava perdida depois de 15 anos na mesma empresa. O Migrei me ajudou a descobrir que minha experiência tinha valor em áreas que eu nem imaginava.",
    name: "Marina",
    age: 42,
    transition: "De RH Corporativo para Consultora de Carreira",
    avatar: "M",
  },
  {
    quote: "Achava que precisava de uma faculdade nova. Na verdade, precisava de clareza. Em 3 meses já estava trabalhando na área que escolhi.",
    name: "Rafael",
    age: 35,
    transition: "De Engenheiro para Product Manager",
    avatar: "R",
  },
  {
    quote: "A comunidade fez toda diferença. Saber que outras pessoas passavam pelo mesmo me deu coragem para seguir em frente.",
    name: "Carla",
    age: 29,
    transition: "De Advogada para UX Designer",
    avatar: "C",
  },
];

export const LandingTestimonials = () => {
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
            Quem já migrou
          </h2>
          <p className="text-lg text-muted-foreground">
            Histórias reais de profissionais que transformaram suas carreiras
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="p-6 h-full bg-card border-border/50 hover:border-primary/30 transition-colors flex flex-col">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                
                <p className="text-foreground/90 leading-relaxed flex-grow mb-6">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}, {testimonial.age} anos
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.transition}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
