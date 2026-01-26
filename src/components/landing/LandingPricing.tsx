import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollToNextButton } from "./ScrollToNextButton";

const plans = [
  {
    name: "Essencial",
    price: "59",
    period: "/mês",
    description: "Tudo para sua transição completa",
    features: [
      "Todas as 6 fases do Ciclo",
      "Networking com a comunidade",
      "Acompanhamento de progresso",
      "Assistente IA personalizado",
    ],
    mentoring: null,
    cta: "Começar com Essencial",
    popular: true,
    highlighted: true,
    cancellationNote: "Cancele em até 7 dias sem compromisso",
  },
  {
    name: "Premium",
    price: "169",
    period: "/mês",
    description: "Acelere com mentoria 1:1",
    features: [
      "Tudo do Essencial",
      "Suporte prioritário",
      "Conteúdos exclusivos",
    ],
    mentoring: {
      sessions: 1,
      label: "1 mentoria ao vivo/mês",
      description: "Sessão 1:1 com especialista",
    },
    cta: "Começar com Premium",
    popular: false,
    highlighted: false,
    cancellationNote: "Cancele quando quiser, sem reembolso",
  },
];

export const LandingPricing = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="py-20 md:py-28 bg-gradient-to-b from-muted/20 via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Invista na sua transição
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                    ⭐ Mais popular
                  </span>
                </div>
              )}
              <Card 
                className={`p-5 md:p-6 h-full flex flex-col rounded-2xl transition-all duration-300 ${
                  plan.highlighted 
                    ? "bg-primary text-primary-foreground border-primary shadow-xl md:scale-105 z-10" 
                    : "bg-card border-border/50 hover:border-primary/30"
                }`}
              >
                {/* Plan Name */}
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>R$</span>
                    <span className={`text-5xl font-bold ${plan.highlighted ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-grow">
                  {/* Mentoring Feature */}
                  {plan.mentoring && (
                    <li className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlighted ? 'bg-primary-foreground/20' : 'bg-primary/10'
                      }`}>
                        <Check className={`h-3 w-3 ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'}`} />
                      </div>
                      <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground' : 'text-foreground/80'}`}>
                        {plan.mentoring.label}
                      </span>
                    </li>
                  )}
                  
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlighted ? 'bg-primary-foreground/20' : 'bg-primary/10'
                      }`}>
                        <Check className={`h-3 w-3 ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'}`} />
                      </div>
                      <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground' : 'text-foreground/80'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant={plan.highlighted ? "secondary" : "outline"}
                  className={`w-full rounded-xl ${
                    plan.highlighted 
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" 
                      : "border-primary/30 text-primary hover:bg-primary/10"
                  }`}
                  onClick={() => navigate("/auth?tab=signup")}
                >
                  {plan.cta}
                </Button>

                {/* Cancellation Note */}
                {plan.cancellationNote && (
                  <p className={`text-xs text-center mt-3 ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {plan.cancellationNote}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <ScrollToNextButton targetId="faq" />
      </div>
    </section>
  );
};
