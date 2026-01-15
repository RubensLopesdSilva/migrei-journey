import { OnboardingTour, TourStep, useTour } from "@/components/ui/onboarding-tour";
import { Button } from "@/components/ui/button";
import { HelpCircle, Rocket } from "lucide-react";
import { TooltipEnhanced } from "@/components/ui/tooltip-enhanced";
import { useProgress } from "@/hooks/useProgress";
import { useNavigate } from "react-router-dom";

// Phase name mapping
const phaseNames: Record<number, string> = {
  1: "Despertar",
  2: "Descobrir",
  3: "Decidir",
  4: "Desenvolver",
  5: "Deslanchar",
  6: "Desfrutar",
};

export function DashboardTour() {
  const { isOpen, hasCompleted, startTour, closeTour, completeTour } = useTour("migrei-dashboard-tour-v2");
  const { currentPhase } = useProgress();
  const navigate = useNavigate();

  const currentPhaseName = currentPhase ? phaseNames[currentPhase.phase_number] || "Despertar" : "Despertar";
  const currentPhaseNumber = currentPhase?.phase_number || 1;

  const dashboardTourSteps: TourStep[] = [
    // STEP 1 — BOAS-VINDAS
    {
      id: "welcome",
      title: "Bem-vindo à sua jornada Migrei 🎉",
      description: "Você está no Ciclo Migrei, um processo estruturado para guiar sua transição de carreira com clareza, ação e apoio. Vamos te mostrar onde você está e o que fazer agora.",
      position: "center",
      action: (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
          <Rocket className="h-4 w-4 text-primary" />
          <span>Tour rápido de ~2 minutos</span>
        </div>
      ),
    },
    // STEP 2 — CICLO MIGREI (FASE ATUAL)
    {
      id: "cycle",
      title: `Sua fase atual: ${currentPhaseName}`,
      description: `O Ciclo Migrei é dividido em 6 fases progressivas. Você está na fase "${currentPhaseName}". Tudo aqui foi pensado para te ajudar a avançar exatamente neste momento.`,
      target: "[data-tour='migrei-circle']",
      position: "right",
    },
    // STEP 3 — MISSÃO DA FASE
    {
      id: "mission",
      title: "Sua missão nesta fase",
      description: "Cada fase tem uma missão principal. Ao cumprir essa missão, você avança com mais clareza e segurança no processo de migração de carreira.",
      target: "[data-tour='mission-card']",
      position: "left",
    },
    // STEP 4 — TAREFAS DA MISSÃO
    {
      id: "tasks",
      title: "Tarefas que geram progresso",
      description: "Essas são as tarefas práticas da sua missão. Cada tarefa concluída impacta diretamente seu progresso e desbloqueia novos aprendizados.",
      target: "[data-tour='mission-tasks']",
      position: "left",
      action: (
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✔</span> Faça no seu ritmo
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✔</span> Progresso salvo automaticamente
          </div>
        </div>
      ),
    },
    // STEP 5 — NETWORKING
    {
      id: "networking",
      title: "Networking estratégico",
      description: "Migrar de carreira não é só sobre habilidades. Aqui você encontra tarefas de networking direcionado para se conectar com as pessoas certas no momento certo.",
      target: "[data-tour='networking-card']",
      position: "left",
    },
    // STEP 6 — INDICADORES
    {
      id: "indicators",
      title: "Seus indicadores",
      description: "Aqui você acompanha sua evolução no Ciclo Migrei: Progresso da fase, Engajamento e Consistência. Use esses dados para se manter no ritmo certo.",
      target: "[data-tour='stats-bar']",
      position: "bottom",
    },
    // STEP 7 — SIDEBAR | FASE ATUAL
    {
      id: "sidebar-phase",
      title: "Acesso rápido à sua fase",
      description: "A qualquer momento, volte para sua fase atual por aqui. Tudo o que você precisa agora está concentrado neste espaço.",
      target: "[data-tour='sidebar-current-phase']",
      position: "right",
    },
    // STEP 8 — SIDEBAR | PROGRESSO
    {
      id: "sidebar-progress",
      title: "Visualize seu progresso",
      description: "Veja o quanto você já avançou e o que falta para concluir a fase. Pequenos passos constroem grandes mudanças.",
      target: "[data-tour='sidebar-progress']",
      position: "right",
    },
    // STEP 9 — SIDEBAR | COMUNIDADE
    {
      id: "sidebar-community",
      title: "Comunidade Migrei",
      description: "Conecte-se com pessoas que também estão migrando de carreira. Troca real, experiências práticas e apoio durante a jornada.",
      target: "[data-tour='sidebar-community']",
      position: "right",
    },
    // STEP 10 — SIDEBAR | MENTORIA
    {
      id: "sidebar-mentoring",
      title: "Mentoria especializada",
      description: "Precisa de ajuda personalizada? Aqui você pode acessar mentores que já passaram por processos de transição e atuam no mercado.",
      target: "[data-tour='sidebar-mentoring']",
      position: "right",
    },
    // STEP 11 — CONFIGURAÇÕES
    {
      id: "sidebar-settings",
      title: "Conta e assinatura",
      description: "Aqui você gerencia seus dados, plano de assinatura e preferências. Tudo de forma simples, transparente e segura.",
      target: "[data-tour='sidebar-settings']",
      position: "right",
    },
    // STEP 12 — ENCERRAMENTO
    {
      id: "complete",
      title: "Agora é com você 🚀",
      description: "Foque na missão da fase atual. O Migrei cuida do método — você cuida da ação.",
      position: "center",
      action: (
        <Button 
          size="sm" 
          className="w-full"
          onClick={() => navigate(`/fase${currentPhaseNumber}-${currentPhaseName.toLowerCase()}`)}
        >
          Ir para minha missão
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Tour trigger button - always visible for re-execution */}
      <TooltipEnhanced content={hasCompleted ? "Rever tour" : "Iniciar tour"} side="left">
        <Button
          variant="ghost"
          size="icon"
          onClick={startTour}
          className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-card border shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          aria-label="Ajuda"
        >
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
      </TooltipEnhanced>

      <OnboardingTour
        steps={dashboardTourSteps}
        isOpen={isOpen}
        onClose={closeTour}
        onComplete={completeTour}
        storageKey="migrei-dashboard-tour-v2"
      />
    </>
  );
}
