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
    slug: "premium",
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

export default function ChoosePlan() {
  const { createCheckout, isLoading: subLoading, isSubscribed, status } = useSubscription();
  const { signOut, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Check if user has active subscription
  const hasActiveSubscription = isSubscribed || status === "active" || status === "trialing";

  // CRITICAL: Auto-redirect if user already has active subscription
  // Must wait for both auth AND subscription to finish loading
  if (!authLoading && !subLoading && hasActiveSubscription && !hasRedirected) {
    setHasRedirected(true);
    // Use setTimeout to avoid setState during render
    setTimeout(() => {
      navigate("/escolher-agente", { replace: true });
    }, 0);
  }

  // Show loading while checking subscription status
  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando sua conta...</p>
        </div>
      </div>
    );
  }

  const handleSelectPlan = async (planSlug: string) => {
    // Check subscription status before attempting checkout
    if (hasActiveSubscription) {
      toast({
        title: "Você já possui uma assinatura ativa",
        description: "Redirecionando para o dashboard...",
        variant: "default",
      });
      setTimeout(() => navigate("/dashboard"), 1500);
      return;
    }

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
      
      // Check for active subscription error from backend
      if (errorMessage.includes("active subscription") || errorMessage.includes("already have")) {
        toast({
          title: "Você já possui uma assinatura ativa",
          description: "Redirecionando para o dashboard...",
          variant: "default",
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        toast({
          title: "Erro ao iniciar checkout",
          description: "Tente novamente em alguns instantes.",
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
                  onClick={() => handleSelectPlan(plan.slug)}
                  disabled={loadingPlan !== null || subLoading}
                >
                  {loadingPlan === plan.slug ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Redirecionando para pagamento...</span>
                    </span>
                  ) : (
                    plan.cta
                  )}
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
