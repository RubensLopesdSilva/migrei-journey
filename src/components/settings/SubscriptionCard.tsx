import { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Crown,
  CreditCard,
  Calendar,
  Check,
  X,
  Loader2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  Zap,
  Users,
  Bot,
  Headphones,
  FileText,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const planConfig: Record<string, { color: string; icon: typeof Crown; gradient: string; bgGradient: string }> = {
  free: {
    color: "bg-muted text-muted-foreground",
    icon: Zap,
    gradient: "from-muted to-muted",
    bgGradient: "from-muted/50 to-muted/30",
  },
  essential: {
    color: "bg-blue-500/10 text-blue-600",
    icon: Sparkles,
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-500/10 to-blue-600/5",
  },
  premium: {
    color: "bg-amber-500/10 text-amber-600",
    icon: Crown,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/10 to-orange-500/5",
  },
};

const phaseNames = [
  "Despertar",
  "Descobrir", 
  "Decidir",
  "Desenvolver",
  "Deslanchar",
  "Desfrutar",
];

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: { label: string; included: boolean; highlight?: boolean }[];
  phasesAccess: number;
  mentoringLabel?: string;
  isCurrentPlan: boolean;
  isPopular?: boolean;
  variant: "free" | "essential" | "premium";
  onUpgrade?: () => void;
  loading?: boolean;
}

function PlanCard({
  name,
  price,
  period,
  description,
  features,
  phasesAccess,
  mentoringLabel,
  isCurrentPlan,
  isPopular,
  variant,
  onUpgrade,
  loading,
}: PlanCardProps) {
  const config = planConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={`relative rounded-xl border-2 p-6 transition-all ${
        isCurrentPlan
          ? "border-primary bg-primary/5 shadow-lg"
          : isPopular
          ? "border-amber-500/50 hover:border-amber-500"
          : "border-border/50 hover:border-border"
      }`}
    >
      {isPopular && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            <Crown className="h-3 w-3" />
            Recomendado
          </span>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            <Check className="h-3 w-3" />
            Seu plano atual
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${config.bgGradient}`}>
          <Icon className={`h-5 w-5 ${variant === "free" ? "text-muted-foreground" : variant === "essential" ? "text-blue-600" : "text-amber-600"}`} />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-bold text-foreground">{price}</span>
        {period && <span className="text-muted-foreground text-sm">{period}</span>}
      </div>

      {/* Phase Access Indicator */}
      <div className="mb-4 p-3 rounded-lg bg-muted/50">
        <p className="text-xs font-medium text-muted-foreground mb-2">Acesso às Fases</p>
        <div className="flex gap-1">
          {phaseNames.map((phase, idx) => (
            <div
              key={idx}
              className={`flex-1 h-2 rounded-full ${
                idx < phasesAccess
                  ? variant === "premium"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                    : variant === "essential"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600"
                    : "bg-primary"
                  : "bg-border"
              }`}
              title={phase}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {phasesAccess === 6 ? "Todas as 6 fases" : `Fases 1 e 2 de 6`}
        </p>
      </div>

      {/* Mentoring Badge */}
      {mentoringLabel && (
        <div className="mb-4 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-600">{mentoringLabel}</span>
        </div>
      )}

      {/* Features List */}
      <ul className="space-y-2 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {feature.included ? (
              <Check className={`h-4 w-4 flex-shrink-0 ${feature.highlight ? "text-primary" : "text-green-500"}`} />
            ) : (
              <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
            )}
            <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground/50"}`}>
              {feature.label}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {!isCurrentPlan && onUpgrade && (
        <Button
          onClick={onUpgrade}
          disabled={loading}
          className={`w-full gap-2 ${
            variant === "premium"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              : variant === "essential"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              : ""
          }`}
          variant={variant === "free" ? "outline" : "default"}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Fazer upgrade
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      )}

      {isCurrentPlan && (
        <div className="text-center text-sm text-muted-foreground">
          Você está neste plano
        </div>
      )}
    </div>
  );
}

export function SubscriptionCard() {
  const {
    isLoading,
    isSubscribed,
    status,
    planSlug,
    planName,
    subscriptionEnd,
    cancelAtPeriodEnd,
    trialEnd,
    features,
    openCustomerPortal,
    createCheckout,
    getMaxPhaseAccess,
  } = useSubscription();
  const { toast } = useToast();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  const config = planConfig[planSlug] || planConfig.free;
  const PlanIcon = config.icon;
  const maxPhaseAccess = getMaxPhaseAccess();

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      const url = await openCustomerPortal();
      if (url) {
        window.open(url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível abrir o portal de assinatura",
        variant: "destructive",
      });
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleUpgrade = async (targetPlan: string) => {
    setLoadingCheckout(targetPlan);
    try {
      const url = await createCheckout(targetPlan);
      if (url) {
        window.open(url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível iniciar o checkout",
        variant: "destructive",
      });
    } finally {
      setLoadingCheckout(null);
    }
  };

  if (isLoading) {
    return (
      <div className="card-elevated p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const mentoringLimit = Number(features.mentoring_sessions_limit) || 0;
  const hasAI = features.ai_assistant === true;

  return (
    <div className="space-y-6">
      {/* Current Plan Header */}
      <div className={`card-elevated p-6 bg-gradient-to-br ${config.bgGradient}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient}`}>
              <PlanIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{planName}</h2>
              <p className="text-sm text-muted-foreground">
                {planSlug === "free" 
                  ? "Acesso às fases 1 e 2" 
                  : planSlug === "essential"
                  ? "Acesso completo ao Ciclo Migrei"
                  : "Experiência completa com mentoria"}
              </p>
            </div>
          </div>
          {isSubscribed && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageSubscription}
              disabled={loadingPortal}
              className="gap-2"
            >
              {loadingPortal ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Gerenciar
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Phase Progress */}
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Fases Desbloqueadas</span>
            <span className="text-sm text-muted-foreground">{maxPhaseAccess} de 6</span>
          </div>
          <div className="flex gap-1.5">
            {phaseNames.map((phase, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full h-3 rounded-full transition-all ${
                    idx < maxPhaseAccess
                      ? `bg-gradient-to-r ${config.gradient}`
                      : "bg-muted"
                  }`}
                />
                <span className={`text-[10px] ${idx < maxPhaseAccess ? "text-foreground" : "text-muted-foreground"}`}>
                  {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Alerts */}
        {status === "past_due" && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">Pagamento pendente</p>
              <p className="text-xs text-destructive/80">
                Atualize seu método de pagamento para continuar usando os recursos.
              </p>
            </div>
          </div>
        )}

        {cancelAtPeriodEnd && subscriptionEnd && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-600">Cancelamento programado</p>
              <p className="text-xs text-amber-600/80">
                Sua assinatura será cancelada em{" "}
                {format(new Date(subscriptionEnd), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        )}

        {status === "trialing" && trialEnd && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-600">Período de teste</p>
              <p className="text-xs text-blue-600/80">
                Seu trial termina em{" "}
                {format(new Date(trialEnd), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        )}

        {isSubscribed && subscriptionEnd && !cancelAtPeriodEnd && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Próxima renovação:{" "}
              {format(new Date(subscriptionEnd), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>
        )}
      </div>

      {/* Plan Comparison */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {planSlug === "premium" ? "Seu plano inclui" : "Compare os planos"}
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <PlanCard
            name="Gratuito"
            price="R$ 0"
            period=""
            description="Para começar sua jornada"
            phasesAccess={2}
            features={[
              { label: "Fases 1 e 2 do Ciclo Migrei", included: true },
              { label: "Acesso ao Networking", included: true },
              { label: "Meu progresso", included: true },
              { label: "Assistente IA (Mentor IA)", included: false },
              { label: "Mentoria mensal", included: false },
            ]}
            isCurrentPlan={planSlug === "free"}
            variant="free"
          />

          <PlanCard
            name="Essencial"
            price="R$ 59"
            period="/mês"
            description="Acesso completo ao ciclo"
            phasesAccess={6}
            features={[
              { label: "Todas as 6 fases do Ciclo", included: true, highlight: true },
              { label: "Acesso ao Networking", included: true },
              { label: "Meu progresso", included: true },
              { label: "Assistente IA (Mentor IA)", included: true, highlight: true },
              { label: "Mentoria mensal", included: false },
            ]}
            isCurrentPlan={planSlug === "essential"}
            variant="essential"
            onUpgrade={planSlug === "free" ? () => handleUpgrade("essential") : undefined}
            loading={loadingCheckout === "essential"}
          />

          <PlanCard
            name="Premium"
            price="R$ 169"
            period="/mês"
            description="Experiência completa"
            phasesAccess={6}
            mentoringLabel="1 mentoria por mês"
            features={[
              { label: "Tudo do Essencial", included: true },
              { label: "Prioridade no suporte", included: true },
              { label: "Conteúdos exclusivos", included: true },
              { label: "Sessão 1:1 com especialista", included: true, highlight: true },
            ]}
            isCurrentPlan={planSlug === "premium"}
            isPopular={planSlug !== "premium"}
            variant="premium"
            onUpgrade={planSlug !== "premium" ? () => handleUpgrade("premium") : undefined}
            loading={loadingCheckout === "premium"}
          />
        </div>
      </div>

      {/* Quick Features Summary for Current Plan */}
      <div className="card-elevated p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recursos do seu plano</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
            <div className={`p-2 rounded-full mb-2 ${maxPhaseAccess === 6 ? "bg-green-500/10" : "bg-muted"}`}>
              <Zap className={`h-5 w-5 ${maxPhaseAccess === 6 ? "text-green-500" : "text-muted-foreground"}`} />
            </div>
            <span className="text-2xl font-bold">{maxPhaseAccess}</span>
            <span className="text-xs text-muted-foreground">Fases</span>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
            <div className={`p-2 rounded-full mb-2 ${hasAI ? "bg-green-500/10" : "bg-muted"}`}>
              <Bot className={`h-5 w-5 ${hasAI ? "text-green-500" : "text-muted-foreground"}`} />
            </div>
            <span className="text-2xl font-bold">{hasAI ? "✓" : "–"}</span>
            <span className="text-xs text-muted-foreground">Mentor IA</span>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
            <div className={`p-2 rounded-full mb-2 ${mentoringLimit > 0 ? "bg-green-500/10" : "bg-muted"}`}>
              <Users className={`h-5 w-5 ${mentoringLimit > 0 ? "text-green-500" : "text-muted-foreground"}`} />
            </div>
            <span className="text-2xl font-bold">{mentoringLimit || "–"}</span>
            <span className="text-xs text-muted-foreground">Mentoria/mês</span>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
            <div className="p-2 rounded-full mb-2 bg-green-500/10">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-2xl font-bold">✓</span>
            <span className="text-xs text-muted-foreground">Networking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
