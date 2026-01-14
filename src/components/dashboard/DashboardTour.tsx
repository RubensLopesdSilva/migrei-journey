import { OnboardingTour, TourStep, useTour } from "@/components/ui/onboarding-tour";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { TooltipEnhanced } from "@/components/ui/tooltip-enhanced";

const dashboardTourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao Migrei! 🎉",
    description: "Este tour vai te mostrar as principais funcionalidades da plataforma para você começar sua jornada de transição de carreira.",
    position: "center",
  },
  {
    id: "stats",
    title: "Suas Estatísticas",
    description: "Aqui você acompanha seu progresso: pontos XP, dias na jornada, streak e mais. Passe o mouse sobre cada card para ver mais detalhes.",
    target: ".grid.grid-cols-3",
    position: "bottom",
  },
  {
    id: "circle",
    title: "A Roda Migrei",
    description: "Este é o coração da sua jornada! Clique em cada fase para acessar suas atividades. Você está na fase 'Despertar' - comece por aqui!",
    target: ".card-elevated svg",
    position: "right",
  },
  {
    id: "missions",
    title: "Missões Diárias",
    description: "Complete missões para ganhar XP e desbloquear conquistas. Novas missões aparecem todo dia!",
    target: "[aria-label='Missões do dia']",
    position: "left",
  },
  {
    id: "sidebar",
    title: "Navegação",
    description: "Use o menu lateral para acessar todas as áreas: Fases, Progresso, Comunidade e Mentoria.",
    target: "nav",
    position: "right",
  },
  {
    id: "complete",
    title: "Pronto para começar!",
    description: "Agora você conhece o básico. Clique na fase 'Despertar' na Roda Migrei para iniciar sua jornada de transição profissional!",
    position: "center",
  },
];

export function DashboardTour() {
  const { isOpen, hasCompleted, startTour, closeTour, completeTour } = useTour("migrei-dashboard-tour");

  return (
    <>
      {/* Tour trigger button - shows after tour is completed */}
      {hasCompleted && (
        <TooltipEnhanced content="Repetir tour de introdução" side="left">
          <Button
            variant="ghost"
            size="icon"
            onClick={startTour}
            className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full bg-card border shadow-lg hover:shadow-xl transition-all"
            aria-label="Ajuda"
          >
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
        </TooltipEnhanced>
      )}

      <OnboardingTour
        steps={dashboardTourSteps}
        isOpen={isOpen}
        onClose={closeTour}
        onComplete={completeTour}
        storageKey="migrei-dashboard-tour"
      />
    </>
  );
}
