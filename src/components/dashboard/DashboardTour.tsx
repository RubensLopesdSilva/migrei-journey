import { OnboardingTour, TourStep, useTour } from "@/components/ui/onboarding-tour";
import { Button } from "@/components/ui/button";
import { HelpCircle, Rocket } from "lucide-react";
import { TooltipEnhanced } from "@/components/ui/tooltip-enhanced";
import { useProgress } from "@/hooks/useProgress";
import { useAgent } from "@/hooks/useAgent";
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

interface DashboardTourProps {
  onTourComplete?: () => void;
}

export function DashboardTour({ onTourComplete }: DashboardTourProps) {
  const { isOpen, hasCompleted, startTour, closeTour, completeTour } = useTour("migrei-dashboard-tour-v3");
  const { currentPhase } = useProgress();
  const { currentAgent } = useAgent();
  const navigate = useNavigate();

  const currentPhaseName = currentPhase ? phaseNames[currentPhase.phase_number] || "Despertar" : "Despertar";
  const currentPhaseNumber = currentPhase?.phase_number || 1;
  
  // Agent info for tour
  const agentInfo = currentAgent ? {
    name: currentAgent.name,
    title: currentAgent.title
  } : null;

  // Auto-start tour on first visit (only once ever)
  const handleComplete = () => {
    completeTour();
    onTourComplete?.();
  };

  const handleClose = () => {
    closeTour();
    // Also mark as completed when user closes/skips
    localStorage.setItem("migrei-dashboard-tour-v3", "true");
    onTourComplete?.();
  };

  // Auto-start on first visit
  if (!hasCompleted && !isOpen) {
    // Small delay to let dashboard render first
    setTimeout(() => startTour(), 1000);
  }

  const agentGreeting = currentAgent ? `Olá! Sou ${currentAgent.name}, seu coach de transição!` : "Bem-vindo ao Migrei! 🎉";

  const dashboardTourSteps: TourStep[] = [
    // STEP 1 — BOAS-VINDAS
    {
      id: "welcome",
      title: agentGreeting,
      description: "Vou te guiar pela plataforma em menos de 2 minutos. Vamos lá?",
      position: "center",
      action: (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
          <Rocket className="h-4 w-4 text-primary" />
          <span>Tour rápido com {currentAgent?.name || "seu coach"}</span>
        </div>
      ),
    },
    // STEP 2 — CICLO MIGREI (FASE ATUAL)
    {
      id: "cycle",
      title: `Você está na fase ${currentPhaseName}`,
      description: "O Ciclo tem 6 fases. Foque apenas na atual — o resto vem depois.",
      target: "[data-tour='migrei-circle']",
      position: "right",
    },
    // STEP 3 — MISSÃO DA FASE
    {
      id: "mission",
      title: "Sua missão principal",
      description: "Cumpra a missão da fase para avançar com segurança na transição.",
      target: "[data-tour='mission-card']",
      position: "left",
    },
    // STEP 4 — TAREFAS DA MISSÃO
    {
      id: "tasks",
      title: "Tarefas práticas",
      description: "Complete as tarefas no seu ritmo. Cada uma gera progresso real.",
      target: "[data-tour='mission-tasks']",
      position: "left",
    },
    // STEP 5 — NETWORKING
    {
      id: "networking",
      title: "Conexões estratégicas",
      description: "Networking direcionado para abrir portas na nova carreira.",
      target: "[data-tour='networking-card']",
      position: "left",
    },
    // STEP 6 — INDICADORES
    {
      id: "indicators",
      title: "Seus números",
      description: "Acompanhe progresso, engajamento e consistência aqui.",
      target: "[data-tour='stats-bar']",
      position: "bottom",
    },
    // STEP 7 — SIDEBAR | FASE ATUAL
    {
      id: "sidebar-phase",
      title: "Fase atual",
      description: "Acesso rápido a tudo que você precisa agora.",
      target: "[data-tour='sidebar-current-phase']",
      position: "right",
    },
    // STEP 8 — SIDEBAR | PROGRESSO
    {
      id: "sidebar-progress",
      title: "Seu progresso",
      description: "Veja quanto já avançou e o que falta.",
      target: "[data-tour='sidebar-progress']",
      position: "right",
    },
    // STEP 9 — SIDEBAR | COMUNIDADE
    {
      id: "sidebar-community",
      title: "Comunidade",
      description: "Conecte-se com quem também está migrando.",
      target: "[data-tour='sidebar-community']",
      position: "right",
    },
    // STEP 10 — SIDEBAR | MENTORIA
    {
      id: "sidebar-mentoring",
      title: "Mentoria",
      description: "Ajuda personalizada de quem já fez a transição.",
      target: "[data-tour='sidebar-mentoring']",
      position: "right",
    },
    // STEP 11 — CONFIGURAÇÕES
    {
      id: "sidebar-settings",
      title: "Configurações",
      description: "Gerencie conta e assinatura.",
      target: "[data-tour='sidebar-settings']",
      position: "right",
    },
    // STEP 12 — ENCERRAMENTO
    {
      id: "complete",
      title: "Pronto! 🚀",
      description: "Foque na missão. O Migrei cuida do método.",
      position: "center",
      action: (
        <Button 
          size="sm" 
          className="w-full"
          onClick={() => {
            handleComplete();
            navigate(`/fase${currentPhaseNumber}-${currentPhaseName.toLowerCase()}`);
          }}
        >
          Começar missão
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Tour trigger button - bottom left */}
      <TooltipEnhanced content={hasCompleted ? "Rever tour" : "Iniciar tour"} side="right">
        <Button
          variant="ghost"
          size="icon"
          onClick={startTour}
          className="fixed bottom-4 left-4 z-40 h-10 w-10 rounded-full bg-card border shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          aria-label="Ajuda"
        >
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
      </TooltipEnhanced>

      <OnboardingTour
        steps={dashboardTourSteps}
        isOpen={isOpen}
        onClose={handleClose}
        onComplete={handleComplete}
        storageKey="migrei-dashboard-tour-v3"
        agent={agentInfo}
      />
    </>
  );
}
