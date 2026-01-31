import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Crown, 
  Sparkles, 
  Loader2, 
  ArrowRight,
  Users,
  Brain,
  Target,
  Headphones,
  BookOpen,
  LogOut
} from "lucide-react";
import logoMigrei from "@/assets/logo-migrei.png";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    slug: "essential",
    name: "Essencial",
    price: 49,
    priceId: "price_1SoqPeBiU5uGvruv4j4CJoOI",
    description: "Para quem quer começar sua transição de carreira com suporte completo",
    popular: true,
    features: [
      { icon: Target, text: "Acesso às 6 fases do Ciclo Migrei", included: true },
      { icon: Brain, text: "Coach IA personalizado", included: true },
      { icon: Users, text: "Comunidade de transição", included: true },
      { icon: Headphones, text: "Suporte por email", included: true },
      { icon: BookOpen, text: "Conteúdo exclusivo", included: false },
      { icon: Crown, text: "Mentoria individual", included: false },
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    price: 99,
    priceId: "price_1SoqTbBiU5uGvruvkaRk0PNh",
    description: "Experiência completa com mentoria especializada",
    popular: false,
    features: [
      { icon: Target, text: "Acesso às 6 fases do Ciclo Migrei", included: true },
      { icon: Brain, text: "Coach IA personalizado", included: true },
      { icon: Users, text: "Comunidade de transição", included: true },
      { icon: Headphones, text: "Suporte prioritário", included: true },
      { icon: BookOpen, text: "Conteúdo exclusivo", included: true },
      { icon: Crown, text: "1 sessão de mentoria/mês", included: true },
    ],
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
        // Use window.open as fallback if location.href doesn't work
        window.location.href = url;
      } else {
        throw new Error("URL de checkout não retornada");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      
      const errorMessage = error?.message || "Erro desconhecido";
      
      // Check for specific error messages
      if (errorMessage.includes("active subscription")) {
        toast({
          title: "Você já possui uma assinatura ativa",
          description: "Vá para Configurações para gerenciar sua assinatura.",
          variant: "default",
        });
        // Redirect to dashboard if already subscribed
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <img src={logoMigrei} alt="Migrei" className="h-12 w-auto" />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
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
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className={`relative h-full transition-all duration-300 hover:shadow-lg ${
                  plan.popular 
                    ? "border-primary shadow-primary/10 shadow-md" 
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground shadow-sm">
                      Mais popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      R$ {plan.price}
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li 
                        key={i} 
                        className={`flex items-center gap-3 text-sm ${
                          feature.included ? "text-foreground" : "text-muted-foreground line-through"
                        }`}
                      >
                        {feature.included ? (
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        ) : (
                          <div className="h-4 w-4 flex-shrink-0" />
                        )}
                        <feature.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full mt-6 ${
                      plan.popular ? "btn-primary-gradient" : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleSelectPlan(plan.slug)}
                    disabled={loadingPlan !== null || subLoading}
                  >
                    {loadingPlan === plan.slug ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Assinar {plan.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
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
