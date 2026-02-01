import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Target, Brain, Users, Headphones, BookOpen, Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollToNextButton } from "./ScrollToNextButton";

const plans = [
  {
    name: "Essencial",
    price: "49",
    period: "/mês",
    description: "Para quem quer começar sua transição de carreira com suporte completo",
    features: [
      { icon: Target, text: "Acesso às 6 fases do Ciclo Migrei", included: true },
      { icon: Brain, text: "Coach IA personalizado", included: true },
      { icon: Users, text: "Comunidade de transição", included: true },
      { icon: Headphones, text: "Suporte por email", included: true },
      { icon: BookOpen, text: "Conteúdo exclusivo", included: false },
      { icon: Crown, text: "Mentoria individual", included: false },
    ],
    cta: "Assinar Essencial",
    popular: true,
    highlighted: true,
  },
  {
    name: "Premium",
    price: "99",
    period: "/mês",
    description: "Experiência completa com mentoria especializada",
    features: [
      { icon: Target, text: "Acesso às 6 fases do Ciclo Migrei", included: true },
      { icon: Brain, text: "Coach IA personalizado", included: true },
      { icon: Users, text: "Comunidade de transição", included: true },
      { icon: Headphones, text: "Suporte prioritário", included: true },
      { icon: BookOpen, text: "Conteúdo exclusivo", included: true },
      { icon: Crown, text: "1 sessão de mentoria/mês", included: true },
    ],
    cta: "Assinar Premium",
    popular: false,
    highlighted: false,
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
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                    Mais popular
                  </span>
                </div>
              )}
              <Card 
                className={`p-5 md:p-6 h-full flex flex-col rounded-2xl transition-all duration-300 ${
                  plan.highlighted 
                    ? "border-primary shadow-xl border-2" 
                    : "bg-card border-border/50 hover:border-primary/30"
                }`}
              >
                {/* Plan Name */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-sm mb-4 text-muted-foreground">
                    {plan.description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className={`flex items-center gap-3 ${
                        feature.included ? "" : "opacity-50"
                      }`}
                    >
                      {feature.included ? (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 flex-shrink-0" />
                      )}
                      <feature.icon className={`h-4 w-4 flex-shrink-0 ${
                        feature.included ? "text-muted-foreground" : "text-muted-foreground/50"
                      }`} />
                      <span className={`text-sm ${
                        feature.included 
                          ? "text-foreground" 
                          : "text-muted-foreground line-through"
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className={`w-full ${
                    plan.highlighted 
                      ? "btn-primary-gradient" 
                      : ""
                  }`}
                  size="lg"
                  onClick={() => navigate("/auth?tab=signup")}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <ScrollToNextButton targetId="faq" />
      </div>
    </section>
  );
};
