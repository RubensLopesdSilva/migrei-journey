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
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const planConfig: Record<string, { color: string; icon: typeof Crown; gradient: string }> = {
  free: {
    color: "bg-muted text-muted-foreground",
    icon: Sparkles,
    gradient: "from-muted to-muted",
  },
  essential: {
    color: "bg-blue-500/10 text-blue-600",
    icon: Sparkles,
    gradient: "from-blue-500 to-blue-600",
  },
  premium: {
    color: "bg-amber-500/10 text-amber-600",
    icon: Crown,
    gradient: "from-amber-500 to-orange-500",
  },
};

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
  } = useSubscription();
  const { toast } = useToast();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  const config = planConfig[planSlug] || planConfig.free;
  const PlanIcon = config.icon;

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
  const hasPrioritySupport = features.priority_support === true;
  const hasExclusiveContent = features.exclusive_content === true;

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="card-elevated p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Sua Assinatura
            </h2>
            <p className="text-sm text-muted-foreground">
              Gerencie seu plano e pagamentos
            </p>
          </div>
          <Badge className={`${config.color} gap-1`}>
            <PlanIcon className="h-3 w-3" />
            {planName}
          </Badge>
        </div>

        {/* Status Alerts */}
        {status === "past_due" && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">Pagamento pendente</p>
              <p className="text-xs text-destructive/80">
                Atualize seu método de pagamento para continuar usando os recursos premium.
              </p>
            </div>
          </div>
        )}

        {cancelAtPeriodEnd && subscriptionEnd && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3">
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
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3">
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

        {/* Plan Features */}
        <div className="grid gap-3 mb-6">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Sessões de mentoria/mês</span>
            <span className="font-medium">{mentoringLimit === 0 ? "Nenhuma" : mentoringLimit}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Assistente IA</span>
            {hasAI ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Suporte prioritário</span>
            {hasPrioritySupport ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Conteúdo exclusivo</span>
            {hasExclusiveContent ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Subscription End Date */}
        {isSubscribed && subscriptionEnd && !cancelAtPeriodEnd && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Calendar className="h-4 w-4" />
            <span>
              Próxima renovação:{" "}
              {format(new Date(subscriptionEnd), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {isSubscribed && (
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              disabled={loadingPortal}
              className="gap-2"
            >
              {loadingPortal ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Gerenciar Assinatura
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}

          {planSlug === "free" && (
            <Button
              onClick={() => handleUpgrade("essential")}
              disabled={loadingCheckout === "essential"}
              className="btn-primary-gradient gap-2"
            >
              {loadingCheckout === "essential" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Assinar Plano Essencial
            </Button>
          )}

          {planSlug !== "premium" && planSlug !== "free" && (
            <Button
              onClick={() => handleUpgrade("premium")}
              disabled={loadingCheckout === "premium"}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 gap-2"
            >
              {loadingCheckout === "premium" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Crown className="h-4 w-4" />
              )}
              Upgrade para Premium
            </Button>
          )}
        </div>
      </div>

      {/* Upgrade Cards (for free users) */}
      {planSlug === "free" && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Essential Plan */}
          <div className="card-elevated p-6 border-2 border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Essencial</h3>
                <p className="text-sm text-muted-foreground">R$ 49/mês</p>
              </div>
            </div>
            <ul className="space-y-2 mb-4 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                2 sessões de mentoria/mês
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Assistente IA
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Acesso à comunidade
              </li>
            </ul>
            <Button
              onClick={() => handleUpgrade("essential")}
              disabled={loadingCheckout === "essential"}
              variant="outline"
              className="w-full border-blue-500/50 text-blue-600 hover:bg-blue-500/10"
            >
              {loadingCheckout === "essential" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Começar agora"
              )}
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="card-elevated p-6 border-2 border-amber-500/30 hover:border-amber-500/50 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
              Mais Popular
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Crown className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold">Premium</h3>
                <p className="text-sm text-muted-foreground">R$ 99/mês</p>
              </div>
            </div>
            <ul className="space-y-2 mb-4 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                4 sessões de mentoria/mês
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Assistente IA
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Suporte prioritário
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Conteúdo exclusivo
              </li>
            </ul>
            <Button
              onClick={() => handleUpgrade("premium")}
              disabled={loadingCheckout === "premium"}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
            >
              {loadingCheckout === "premium" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Assinar Premium"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
