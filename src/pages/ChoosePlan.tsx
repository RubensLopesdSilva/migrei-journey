import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Sparkles, 
  Loader2, 
  LogOut
} from "lucide-react";
import logoMigrei from "@/assets/logo-migrei.png";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    slug: "essential",
    name: "Essencial",
    price: "49",
    period: "/mês",
    description: "Para quem quer começar sua transição de carreira com suporte completo",
    features: [
      "Acesso às 6 fases do Ciclo Migrei",
      "Coach IA personalizado",
      "Comunidade de transição",
      "Suporte por email",
    ],
    disabledFeatures: [
      "Conteúdo exclusivo",
      "Mentoria individual",
    ],
    cta: "Assinar Essencial",
    popular: true,
    highlighted: true,
    cancellationNote: "Garantia de 7 dias para reembolso",
  },
  {
    slug: "premium",
    name: "Premium",
    price: "99",
    period: "/mês",
    description: "Experiência completa com mentoria especializada",
    features: [
      "Acesso às 6 fases do Ciclo Migrei",
      "Coach IA personalizado",
      "Comunidade de transição",
      "Suporte prioritário",
      "Conteúdo exclusivo",
      "1 sessão de mentoria/mês",
    ],
    disabledFeatures: [],
    cta: "Assinar Premium",
    popular: false,
    highlighted: false,
    cancellationNote: "Cancele quando quiser, sem reembolso",
  },
];

export default function ChoosePlan() {
  const { createCheckout, isLoading: subLoading } = useSubscription();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planSlug: string) => {
    setLoadingPlan(planSlug);
    try {
      const url = await createCheckout(planSlug);
      console.log("Checkout URL received:", url);
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("URL de checkout não retornada");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      
      const errorMessage = error?.message || "Erro desconhecido";
      
      if (errorMessage.includes("active subscription")) {
        toast({
          title: "Você já possui uma assinatura ativa",
          description: "Vá para Configurações para gerenciar sua assinatura.",
          variant: "default",
        });
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast({
          title: "Erro ao iniciar checkout",
          description: errorMessage || "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <img src={logoMigrei} alt="Migrei" className="h-12 w-auto" />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Último passo
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Escolha seu plano
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {user?.user_metadata?.full_name ? `Olá, ${user.user_metadata.full_name}! ` : ""}
              Selecione o plano ideal para sua jornada de transição de carreira.
            </p>
          </motion.div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto items-stretch mb-10">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground/80">
                        {feature}
                      </span>
                    </li>
                  ))}
                  
                  {/* Disabled Features */}
                  {plan.disabledFeatures.map((feature, featureIndex) => (
                    <li key={`disabled-${featureIndex}`} className="flex items-center gap-3 opacity-50">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center bg-muted">
                        <span className="h-0.5 w-2 bg-muted-foreground"></span>
                      </div>
                      <span className="text-sm text-muted-foreground line-through">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className={`w-full rounded-xl ${
                    plan.highlighted 
                      ? "btn-primary-gradient" 
                      : "border-primary/30 text-primary hover:bg-primary/10"
                  }`}
                  onClick={() => handleSelectPlan(plan.slug)}
                  disabled={loadingPlan !== null || subLoading}
                >
                  {loadingPlan === plan.slug ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    plan.cta
                  )}
                </Button>

                {/* Cancellation Note */}
                {plan.cancellationNote && (
                  <p className="text-xs text-center mt-3 text-muted-foreground">
                    {plan.cancellationNote}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center space-y-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Pagamento seguro via Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Acesso imediato</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Ao assinar, você concorda com nossos{" "}
            <a href="/termos" className="underline hover:text-foreground">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="/privacidade" className="underline hover:text-foreground">
              Política de Privacidade
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
