import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Sparkles, 
  ArrowRight, 
  Users,
  Calendar,
  Target,
  TrendingUp,
  MessageCircle,
  CheckCircle2
} from "lucide-react";

interface MentoringHeroProps {
  planSlug: string | null;
  planName: string;
  sessionLimit: number;
  remainingSessions: number;
  onUpgrade: () => void;
}

export function MentoringHero({
  planSlug,
  planName,
  sessionLimit,
  remainingSessions,
  onUpgrade,
}: MentoringHeroProps) {
  const isPremium = planSlug === "premium";
  const isEssential = planSlug === "essential";
  const isFree = planSlug === "free" || !planSlug;
  const needsUpgrade = isFree || isEssential;

  const sessionUsagePercent = sessionLimit > 0 
    ? ((sessionLimit - remainingSessions) / sessionLimit) * 100 
    : 0;

  // Benefits for free/essential users
  const benefits = [
    { icon: Target, text: "Orientação personalizada de carreira" },
    { icon: TrendingUp, text: "Acelere sua transição profissional" },
    { icon: MessageCircle, text: "Sessão 1:1 mensal com especialistas" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border border-primary/10"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative p-5 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
          {/* Left content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`
                  ${isPremium 
                    ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30" 
                    : isEssential 
                      ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30"
                      : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {isPremium && <Crown className="h-3 w-3 mr-1" />}
                {isEssential && <Sparkles className="h-3 w-3 mr-1" />}
                {planName || "Plano Gratuito"}
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Mentoria com
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Especialistas</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-base max-w-lg">
                {needsUpgrade 
                  ? "Acelere sua transição de carreira com orientação de quem já passou por isso."
                  : "Orientação personalizada para acelerar sua transição."
                }
              </p>
            </div>

            {/* Benefits for free/essential - show value instead of stats */}
            {needsUpgrade ? (
              <div className="flex flex-wrap items-center gap-4 pt-1">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <benefit.icon className="h-4 w-4 text-primary" />
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Mentores especializados</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Sessões 1:1</span>
                </div>
              </div>
            )}
          </div>

          {/* Right content - CTA for free/essential or Session info for premium */}
          <div className="lg:w-80">
            {needsUpgrade ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-xl bg-card border shadow-lg"
              >
                <div className="space-y-4">
                  {/* Value proposition - honest message */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">Orientação direcionada</span>
                      <p className="text-xs text-muted-foreground">De quem já fez transição de carreira</p>
                    </div>
                  </div>

                  {/* Premium benefits */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Exclusivo do Premium
                    </p>
                    <div className="space-y-1.5">
                      {[
                        "1 sessão de mentoria por mês",
                        "Acesso a todos os mentores",
                        "Conteúdo exclusivo",
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={onUpgrade} 
                    size="lg"
                    className="w-full gap-2 btn-primary-gradient shadow-lg"
                  >
                    <Sparkles className="h-4 w-4" />
                    Desbloquear Mentoria
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Cancele quando quiser • Sem compromisso
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-card border shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Sessões este mês
                    </span>
                    <span className="text-2xl font-bold text-foreground">
                      {remainingSessions}/{sessionLimit}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <Progress 
                      value={sessionUsagePercent} 
                      className="h-2" 
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {remainingSessions > 0 
                          ? `${remainingSessions} sessão(ões) disponível(is)`
                          : "Limite atingido este mês"
                        }
                      </span>
                      <span>1 cancelamento grátis</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
