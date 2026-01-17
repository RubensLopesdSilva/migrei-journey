import { OnboardingTour, TourStep, useTour } from "@/components/ui/onboarding-tour";
import { Button } from "@/components/ui/button";
import { HelpCircle, Sparkles, Target, Clock } from "lucide-react";
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

const phaseNumberToSlug: Record<number, string> = {
  1: "despertar",
  2: "descobrir",
  3: "decidir",
  4: "desenvolver",
  5: "deslanchar",
  6: "desfrutar",
};

// What the user will achieve TODAY in each phase
const phaseQuickWins: Record<number, string> = {
  1: "Em 5 minutos você terá seu primeiro diagnóstico de carreira",
  2: "Você vai descobrir padrões que nunca percebeu em sua trajetória",
  3: "Você vai definir sua rota com metas claras para 90 dias",
  4: "Você vai sair com currículo e LinkedIn prontos para agir",
  5: "Você vai começar a se candidatar e fazer networking real",
  6: "Você vai celebrar conquistas e planejar o próximo ciclo",
};

interface DashboardTourProps {
  onTourComplete?: () => void;
}

export function DashboardTour({ onTourComplete }: DashboardTourProps) {
  const { isOpen, hasCompleted, startTour, closeTour, completeTour } = useTour("migrei-dashboard-tour-v4");
  const { currentPhase } = useProgress();
  const { currentAgent } = useAgent();
  const navigate = useNavigate();

  const currentPhaseName = currentPhase ? phaseNames[currentPhase.phase_number] || "Despertar" : "Despertar";
  const currentPhaseNumber = currentPhase?.phase_number || 1;
  const currentPhaseSlug = phaseNumberToSlug[currentPhaseNumber] || "despertar";
  const quickWin = phaseQuickWins[currentPhaseNumber];
  
  // Agent info for tour
  const agentInfo = currentAgent ? {
    name: currentAgent.name,
    title: currentAgent.title
  } : null;

  const handleComplete = () => {
    completeTour();
    onTourComplete?.();
  };

  const handleClose = () => {
    closeTour();
    localStorage.setItem("migrei-dashboard-tour-v4", "true");
    onTourComplete?.();
  };

  // Auto-start on first visit - DISABLED
  // if (!hasCompleted && !isOpen) {
  //   setTimeout(() => startTour(), 800);
  // }

  // TOUR SIMPLIFICADO: 5 passos focados em BENEFÍCIOS
  const dashboardTourSteps: TourStep[] = [
    // STEP 1 — O QUE VOCÊ VAI GANHAR HOJE
    {
      id: "welcome",
      title: `Olá! Sou ${currentAgent?.name || "seu coach"} 👋`,
      description: quickWin,
      position: "center",
      action: (
        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-primary/5 rounded-lg p-3 border border-primary/10">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-medium">Tour de 1 minuto</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span>3 coisas para saber</span>
        </div>
      ),
    },
    // STEP 2 — SUA ÚNICA MISSÃO (foco)
    {
      id: "mission",
      title: "Foque apenas aqui",
      description: `Você está na fase ${currentPhaseName}. Complete as missões desta fase antes de avançar. Isso garante resultados reais.`,
      target: "[data-tour='mission-card']",
      position: "left",
      action: (
        <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 rounded-full px-3 py-1.5 w-fit">
          <Target className="h-3.5 w-3.5" />
          <span>Uma fase de cada vez = clareza</span>
        </div>
      ),
    },
    // STEP 3 — O CICLO (contexto rápido)
    {
      id: "cycle",
      title: "Sua jornada visual",
      description: "O Ciclo Migrei mostra onde você está. Clique na sua fase para começar as atividades.",
      target: "[data-tour='migrei-circle']",
      position: "right",
    },
    // STEP 4 — ONDE BUSCAR AJUDA
    {
      id: "help",
      title: "Estou sempre aqui",
      description: "Me chame quando precisar de ajuda. Posso tirar dúvidas, dar feedback e te manter no caminho certo.",
      target: "[data-tour='floating-coach']",
      position: "left",
      action: (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Disponível 24/7 para você</span>
        </div>
      ),
    },
    // STEP 5 — AÇÃO IMEDIATA
    {
      id: "start",
      title: "Pronto para começar? 🚀",
      description: `Vamos direto para a fase ${currentPhaseName}. ${quickWin}.`,
      position: "center",
      action: (
        <Button 
          size="default" 
          className="w-full btn-primary-gradient"
          onClick={() => {
            handleComplete();
            navigate(`/fase/${currentPhaseSlug}`);
          }}
        >
          Começar minha primeira atividade
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Tour trigger button - only show if completed */}
      {hasCompleted && (
        <TooltipEnhanced content="Rever tour" side="right">
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
      )}

      <OnboardingTour
        steps={dashboardTourSteps}
        isOpen={isOpen}
        onClose={handleClose}
        onComplete={handleComplete}
        storageKey="migrei-dashboard-tour-v4"
        agent={agentInfo}
      />
    </>
  );
}
