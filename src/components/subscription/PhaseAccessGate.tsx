import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface PhaseAccessGateProps {
  phaseNumber: number;
  phaseName: string;
  children: React.ReactNode;
}

export function PhaseAccessGate({ phaseNumber, phaseName, children }: PhaseAccessGateProps) {
  const { canAccessPhase, planSlug, isLoading } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return <>{children}</>;
  }

  if (canAccessPhase(phaseNumber)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-lg p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Fase Bloqueada
            </h2>
            <p className="text-muted-foreground">
              A <strong>{phaseName}</strong> está disponível apenas para assinantes do plano Essencial ou superior.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Crown className="h-5 w-5" />
              <span className="font-semibold">Faça upgrade para desbloquear</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Com o plano Essencial você tem acesso a todas as 6 fases do Ciclo Migrei, 
              além do assistente IA para te ajudar na sua transição de carreira.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/progresso")}
            >
              Voltar ao Progresso
            </Button>
            <Button
              onClick={() => navigate("/configuracoes")}
              className="gap-2"
            >
              Ver Planos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {planSlug === "free" && (
            <p className="text-xs text-muted-foreground">
              Você está no plano Gratuito, que dá acesso às fases 1 e 2.
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}