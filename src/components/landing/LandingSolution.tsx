import { motion } from "framer-motion";
import { Compass, ClipboardList, Rocket, Star } from "lucide-react";

const features = [
  {
    icon: Compass,
    title: "Clareza",
    description: "Descubra quem você é e o que faz sentido para sua próxima fase profissional.",
  },
  {
    icon: ClipboardList,
    title: "Estratégia",
    description: "Transforme suas decisões em um plano realista e executável de 90 dias.",
  },
  {
    icon: Rocket,
    title: "Ação",
    description: "Execute com acompanhamento, networking estratégico e mentoria especializada.",
  },
];

const ratings = [
  { value: "4.9", label: "/ 5 rating", platform: "G2 Reviews", stars: 5 },
  { value: "4.8", label: "/ 5 rating", platform: "Trustpilot", stars: 5 },
];

export const LandingSolution = () => {
  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Title + Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              Como apoiamos profissionais em todo o Brasil
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-md leading-relaxed">
              O Migrei se tornou referência em transição de carreira, oferecendo um método estruturado que combina autoconhecimento, estratégia e ação.
            </p>

            {/* Ratings */}
            <div className="flex gap-10">
              {ratings.map((rating, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(rating.stars)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-base">
                    <span className="font-bold text-foreground text-lg">{rating.value}</span>
                    <span className="text-muted-foreground ml-1">{rating.label}</span>
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{rating.platform}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-5"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.15 }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-foreground text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};