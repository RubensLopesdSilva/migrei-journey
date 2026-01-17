import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Compass, ClipboardList, Rocket, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  { value: "4.9", platform: "G2 Reviews" },
  { value: "4.8", platform: "Trustpilot" },
];

export const LandingSolution = () => {
  const navigate = useNavigate();

  return (
    <section id="como-funciona" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Title + Ratings */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Como apoiamos profissionais em todo o Brasil
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                O Migrei se tornou referência em transição de carreira, oferecendo um método estruturado que combina autoconhecimento, estratégia e ação.
              </p>
            </motion.div>

            {/* Ratings */}
            <motion.div
              className="flex gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {ratings.map((rating, index) => (
                <div key={index}>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(parseFloat(rating.value)) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">{rating.value}</span>
                    <span className="text-muted-foreground"> / 5 rating</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{rating.platform}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
