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
  Star
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

  const sessionUsagePercent = sessionLimit > 0 
    ? ((sessionLimit - remainingSessions) / sessionLimit) * 100 
    : 0;

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

      <div className="relative p-6 md:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          {/* Left content */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`
                  ${isPremium 
                    ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 border-amber-500/30" 
                    : isEssential 
                      ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-700 border-blue-500/30"
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
              <p className="text-muted-foreground mt-2 text-lg max-w-xl">
                Acelere sua transição de carreira com orientação personalizada de profissionais experientes.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">Mentores ativos</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">Sessões 1:1</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">Avaliação 4.9</span>
              </div>
            </div>
          </div>

          {/* Right content - Session info or CTA */}
          <div className="lg:w-80">
            {isFree ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-card border shadow-lg"
              >
                <div className="text-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Desbloqueie Mentorias</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Faça upgrade e tenha acesso a mentores especializados
                    </p>
                  </div>
                  <Button 
                    onClick={onUpgrade} 
                    className="w-full gap-2 btn-primary-gradient"
                  >
                    Ver Planos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
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
                  
                  <div className="space-y-2">
                    <Progress 
                      value={sessionUsagePercent} 
                      className="h-2" 
                    />
                    <p className="text-xs text-muted-foreground">
                      {remainingSessions > 0 
                        ? `${remainingSessions} sessão(ões) disponível(is)`
                        : "Limite atingido este mês"
                      }
                    </p>
                  </div>

                  {isEssential && (
                    <Button 
                      onClick={onUpgrade}
                      variant="outline"
                      className="w-full gap-2 border-amber-500/30 text-amber-700 hover:bg-amber-500/10"
                    >
                      <Crown className="h-4 w-4" />
                      Upgrade para Premium
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
