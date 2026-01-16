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
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 via-blue-50/50 to-slate-50 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 border border-border/50"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl dark:from-blue-900/20" />
      </div>

      <div className="relative p-6 md:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
          {/* Left content */}
          <div className="flex-1 space-y-5">
            {/* Plan badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge 
                className={`
                  px-3 py-1.5 text-sm font-medium shadow-sm
                  ${isPremium 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 hover:from-amber-600 hover:to-orange-600" 
                    : isEssential 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0"
                      : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {isPremium && <Crown className="h-3.5 w-3.5 mr-1.5" />}
                {isEssential && <Sparkles className="h-3.5 w-3.5 mr-1.5" />}
                {planName || "Plano Gratuito"}
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground tracking-tight leading-tight">
                Mentoria com
                <br />
                <span className="text-primary">Especialistas</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-md leading-relaxed"
            >
              Acelere sua transição de carreira com orientação personalizada de profissionais experientes.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm font-medium">Mentores ativos</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm font-medium">Sessões 1:1</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm font-medium">Avaliação 4.9</span>
              </div>
            </motion.div>
          </div>

          {/* Right content - Session card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="lg:w-72"
          >
            {isFree ? (
              <div className="p-6 rounded-2xl bg-card border shadow-lg shadow-black/5">
                <div className="text-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Desbloqueie Mentorias</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Faça upgrade e acesse mentores especializados
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
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-card border shadow-lg shadow-black/5">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Sessões este mês
                    </span>
                    <span className="text-3xl font-bold text-foreground tabular-nums">
                      {remainingSessions}/{sessionLimit}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <Progress 
                      value={100 - sessionUsagePercent} 
                      className="h-2 bg-muted" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {remainingSessions > 0 
                        ? `${remainingSessions} sessão(ões) disponível(is)`
                        : "Limite atingido este mês"
                      }
                    </p>
                  </div>

                  {/* Upgrade button for Essential */}
                  {isEssential && (
                    <Button 
                      onClick={onUpgrade}
                      variant="outline"
                      className="w-full gap-2 border-amber-500/30 text-amber-700 hover:bg-amber-500/10 hover:border-amber-500/50 dark:text-amber-400 dark:hover:bg-amber-500/20"
                    >
                      <Crown className="h-4 w-4" />
                      Upgrade para Premium
                    </Button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
