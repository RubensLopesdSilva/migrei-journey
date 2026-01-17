import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";

const testimonials = [
  {
    quote: "Estava perdida depois de 15 anos na mesma empresa. O Migrei me ajudou a descobrir que minha experiência tinha valor em áreas que eu nem imaginava.",
    name: "Marina Santos",
    role: "De RH Corporativo → Consultora de Carreira",
    avatar: "M",
    color: "bg-violet-500",
  },
  {
    quote: "Achava que precisava de uma faculdade nova. Na verdade, precisava de clareza. Em 3 meses já estava trabalhando na área que escolhi.",
    name: "Rafael Lima",
    role: "De Engenheiro → Product Manager",
    avatar: "R",
    color: "bg-blue-500",
  },
  {
    quote: "A comunidade fez toda diferença. Saber que outras pessoas passavam pelo mesmo me deu coragem para seguir em frente.",
    name: "Carla Mendes",
    role: "De Advogada → UX Designer",
    avatar: "C",
    color: "bg-emerald-500",
  },
];

export const LandingTestimonialsCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Testimonials */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Histórias de quem já migrou
          </h2>
          <p className="text-lg text-muted-foreground">
            Profissionais reais que transformaram suas carreiras
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center text-white font-semibold`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          className="text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-10 md:p-16 border border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para começar sua transição?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Junte-se a milhares de profissionais que estão construindo carreiras mais alinhadas com seus valores.
          </p>
          
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg rounded-full group shadow-lg shadow-primary/25"
            onClick={() => navigate("/auth?tab=signup")}
          >
            Começar agora — é grátis
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            Sem cartão de crédito · Cancele quando quiser
          </p>
        </motion.div>
      </div>
    </section>
  );
};
