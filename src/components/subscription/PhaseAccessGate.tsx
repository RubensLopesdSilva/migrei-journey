import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, ArrowRight, Clock, TrendingUp, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface PhaseAccessGateProps {
  phaseNumber: number;
  phaseName: string;
  children: React.ReactNode;
}

// What the user loses by not having access - focused on pain points
const phaseLostOpportunities: Record<number, {
  mainPain: string;
  lostBenefits: string[];
  urgencyMessage: string;
  testimonial?: { quote: string; author: string };
}> = {
  3: {
    mainPain: "Sem clareza, você continua preso na dúvida",
    lostBenefits: [
      "Comparador de rotas para decisão objetiva",
      "Meta SMART personalizada para sua transição",
      "Plano de 90 dias com ações semanais claras"
    ],
    urgencyMessage: "Cada semana sem decisão é uma semana de oportunidades perdidas",
    testimonial: {
      quote: "A fase Decidir me ajudou a sair da paralisia. Em 2 semanas eu tinha clareza total.",
      author: "Ana, 34 anos — transição para UX Design"
    }
  },
  4: {
    mainPain: "Sem preparo, você perde oportunidades por não estar pronto",
    lostBenefits: [
      "Currículo otimizado para sua nova área",
      "LinkedIn estratégico que atrai recrutadores",
      "Pitch pessoal que convence em 30 segundos"
    ],
    urgencyMessage: "Recrutadores passam 7 segundos no seu currículo. Você está preparado?",
    testimonial: {
      quote: "Meu LinkedIn antes era invisível. Depois da fase Desenvolver, recebi 3 convites em 1 mês.",
      author: "Carlos, 41 anos — transição para Dados"
    }
  },
  5: {
    mainPain: "Sem ação estratégica, você depende da sorte",
    lostBenefits: [
      "Simulador de entrevistas com IA",
      "Painel de execução para acompanhar oportunidades",
      "Rotina de networking que gera resultados"
    ],
    urgencyMessage: "Quem busca oportunidade de forma estruturada encontra 3x mais rápido",
    testimonial: {
      quote: "A fase Deslanchar me deu a disciplina que faltava. Consegui minha vaga em 45 dias.",
      author: "Marina, 29 anos — transição para Product"
    }
  },
  6: {
    mainPain: "Sem consolidação, você corre o risco de voltar à estaca zero",
    lostBenefits: [
      "Relatório final da sua jornada completa",
      "Celebração simbólica das conquistas",
      "Preparação para o próximo ciclo de crescimento"
    ],
    urgencyMessage: "Quem celebra conquistas cria momentum para o próximo nível",
    testimonial: {
      quote: "A fase Desfrutar me fez perceber o quanto eu evoluí. Agora sei que posso fazer de novo.",
      author: "Ricardo, 38 anos — 2ª transição de carreira"
    }
  }
};

const defaultLostOpportunity: {
  mainPain: string;
  lostBenefits: string[];
  urgencyMessage: string;
  testimonial?: { quote: string; author: string };
} = {
  mainPain: "Esta fase contém ferramentas essenciais para sua transição",
  lostBenefits: [
    "Ferramentas práticas e guiadas",
    "Acompanhamento do seu progresso",
    "Networking com a rede Migrei"
  ],
  urgencyMessage: "Quanto mais você espera, mais tempo leva para alcançar seus objetivos"
};

export function PhaseAccessGate({ phaseNumber, phaseName, children }: PhaseAccessGateProps) {
  const { canAccessPhase, planSlug, isLoading, createCheckout } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return <>{children}</>;
  }

  if (canAccessPhase(phaseNumber)) {
    return <>{children}</>;
  }

  const opportunity = phaseLostOpportunities[phaseNumber] || defaultLostOpportunity;

  const handleUpgrade = async () => {
    try {
      const url = await createCheckout("essential");
      if (url) {
        window.open(url, "_blank");
      }
    } catch (error) {
      navigate("/configuracoes");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 space-y-6 overflow-hidden relative">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-amber-500 to-primary" />
          
          {/* Header with pain point */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-600 flex items-center justify-center gap-1.5">
                <Clock className="h-4 w-4" />
                Fase {phaseNumber}: {phaseName}
              </p>
              <h2 className="text-2xl font-bold text-foreground">
                {opportunity.mainPain}
              </h2>
            </div>
          </div>

          {/* Lost benefits - what they're missing */}
          <div className="bg-muted/50 rounded-xl p-5 space-y-4">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              O que você perde sem esta fase:
            </p>
            <ul className="space-y-3">
              {opportunity.lostBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-xs font-bold">✕</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial - social proof */}
          {opportunity.testimonial && (
            <div className="border-l-4 border-primary/50 pl-4 py-2">
              <p className="text-sm italic text-foreground">
                "{opportunity.testimonial.quote}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                — {opportunity.testimonial.author}
              </p>
            </div>
          )}

          {/* Urgency message */}
          <div className="text-center">
            <p className="text-sm font-medium text-amber-600 flex items-center justify-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              {opportunity.urgencyMessage}
            </p>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-primary/5 to-amber-500/5 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-center gap-2 text-foreground">
              <Crown className="h-5 w-5 text-amber-600" />
              <span className="font-semibold">Desbloqueie com o plano Essencial</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                Todas as 6 fases
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                Mentor IA 24h
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                Networking exclusivo
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate("/progresso")}
              >
                Ver meu progresso
              </Button>
              <Button
                onClick={handleUpgrade}
                className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                Desbloquear agora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              A partir de R$ 49/mês • Cancele quando quiser
            </p>
          </div>

          {planSlug === "free" && (
            <p className="text-center text-xs text-muted-foreground">
              Você está no plano Gratuito, com acesso às fases 1 e 2. 
              <br />
              <span className="text-foreground font-medium">Faça upgrade para continuar sua jornada.</span>
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}