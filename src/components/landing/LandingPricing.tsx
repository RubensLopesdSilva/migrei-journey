import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Users, Calendar, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "",
    description: "Para começar sua jornada",
    features: [
      "Fases 1 e 2 completas",
      "Diagnósticos básicos",
      "Missões iniciais",
      "Acesso à comunidade (leitura)",
    ],
    mentoring: null,
    cta: "Começar grátis",
    popular: false,
    variant: "outline" as const,
  },
  {
    name: "Essencial",
    price: "R$ 49",
    period: "/mês",
    description: "Para quem quer ir além",
    features: [
      "Todas as 6 fases",
      "Diagnósticos completos",
      "Plano de 90 dias",
      "Comunidade completa",
      "Networking estratégico",
      "Coach IA básico",
    ],
    mentoring: {
      sessions: 0,
      label: "Acesso aos mentores",
      description: "Agende sessões avulsas",
    },
    cta: "Assinar Essencial",
    popular: true,
    variant: "default" as const,
  },
  {
    name: "Premium",
    price: "R$ 149",
    period: "/mês",
    description: "Experiência completa com mentoria",
    features: [
      "Tudo do Essencial",
      "Coach IA ilimitado",
      "Prioridade no suporte",
      "Conteúdos exclusivos",
      "Relatórios avançados",
    ],
    mentoring: {
      sessions: 2,
      label: "2 mentorias/mês",
      description: "Sessões 1:1 com especialistas",
    },
    cta: "Assinar Premium",
    popular: false,
    variant: "outline" as const,
  },
];

export const LandingPricing = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Escolha seu plano
          </h2>
          <p className="text-lg text-muted-foreground">
            Comece grátis e evolua conforme sua jornada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    Mais popular
                  </span>
                </div>
              )}
              
              <Card 
                className={`p-8 h-full flex flex-col ${
                  plan.popular 
                    ? "border-primary bg-card shadow-lg scale-105" 
                    : "border-border/50 bg-card"
                }`}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Mentoring Section */}
                <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.mentoring ? (
                      <>
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground text-sm">
                          {plan.mentoring.label}
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-muted-foreground text-sm">
                          Mentoria não incluída
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {plan.mentoring 
                      ? plan.mentoring.description 
                      : "Faça upgrade para acessar mentores especializados"
                    }
                  </p>
                  {plan.mentoring && plan.mentoring.sessions > 0 && (
                    <div className="mt-2 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs text-primary font-medium">
                        {plan.mentoring.sessions} sessões inclusas/mês
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.variant}
                  className={`w-full ${
                    plan.popular 
                      ? "bg-primary hover:bg-primary/90" 
                      : ""
                  }`}
                  onClick={() => navigate("/auth")}
                >
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
