import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Users, Calendar, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Gratuito",
    price: "0",
    period: "",
    description: "Comece a explorar sua transição",
    features: [
      "Fases 1 e 2 do Ciclo Migrei",
      "Acesso à comunidade",
      "Meu progresso",
    ],
    mentoring: null,
    cta: "Começar grátis",
    popular: false,
    highlighted: false,
  },
  {
    name: "Essencial",
    price: "49",
    period: "/mês",
    description: "Experimente todo o poder da plataforma",
    features: [
      "Todas as 6 fases do Ciclo Migrei",
      "Acesso à comunidade",
      "Meu progresso",
      "Assistente IA (Mentor IA)",
    ],
    mentoring: null,
    cta: "Assinar Essencial",
    popular: true,
    highlighted: true,
    savings: "Economize R$100/ano",
  },
  {
    name: "Premium",
    price: "149",
    period: "/mês",
    description: "Experiência completa com mentoria",
    features: [
      "Tudo do plano Essencial",
      "Prioridade no suporte",
      "Conteúdos exclusivos",
    ],
    mentoring: {
      sessions: 1,
      label: "1 mentoria/mês",
      description: "Sessão 1:1 com especialista",
    },
    cta: "Assinar Premium",
    popular: false,
    highlighted: false,
  },
];

export const LandingPricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const navigate = useNavigate();

  return (
    <section id="planos" className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Escolha o plano ideal para você
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Escolha o plano que funciona melhor para você. Entre em contato se precisar de ajuda.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-muted rounded-full p-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === "yearly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Anual
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <Card 
                className={`p-6 h-full flex flex-col rounded-2xl transition-all duration-300 ${
                  plan.highlighted 
                    ? "bg-primary text-primary-foreground border-primary shadow-xl scale-105 z-10" 
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
                      {billingPeriod === "yearly" && plan.price !== "0" 
                        ? Math.round(parseInt(plan.price) * 0.8) 
                        : plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>

                  {/* Savings Badge */}
                  {plan.savings && billingPeriod === "yearly" && (
                    <span className="inline-block mt-3 px-3 py-1 bg-primary-foreground/20 text-primary-foreground text-xs font-medium rounded-full">
                      {plan.savings}
                    </span>
                  )}
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
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
