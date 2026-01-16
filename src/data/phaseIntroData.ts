import { 
  Sparkles, 
  Search, 
  Target, 
  Wrench, 
  Rocket, 
  Trophy 
} from "lucide-react";
import { createElement } from "react";
import type { PhaseIntroData } from "@/components/phases/PhaseIntroBlock";

// Cores por fase (seguindo o padrão existente)
export const PHASE_COLORS = {
  1: "#F59E0B", // Amber - Despertar
  2: "#8B5CF6", // Purple - Descobrir
  3: "#3B82F6", // Blue - Decidir
  4: "#F97316", // Orange - Desenvolver
  5: "#EF4444", // Red - Deslanchar
  6: "#10B981", // Emerald - Desfrutar
} as const;

// Dados estruturados para cada fase - TEXTOS SIMPLIFICADOS E OBJETIVOS
export const PHASE_INTRO_DATA: Record<number, Omit<PhaseIntroData, 'progressPercentage' | 'isComplete' | 'phaseIcon'>> = {
  1: {
    phaseNumber: 1,
    phaseName: "Despertar",
    phaseSubtitle: "Consciência e decisão de mudar",
    phaseColor: PHASE_COLORS[1],
    learnings: [
      "Reconhecer seu momento de mudança",
      "Avaliar sua prontidão para transição",
      "Mapear suas dores e motivações"
    ],
    benefits: [
      "Decidir com consciência",
      "Reduzir ansiedade inicial",
      "Firmar compromisso real"
    ],
    deliverables: [
      "Mapa de Dor documentado",
      "Avaliação de Prontidão",
      "Declaração de Compromisso"
    ],
    aiCapabilities: [
      "Análise de padrões",
      "Reflexões guiadas",
      "Resumo de insights"
    ]
  },
  2: {
    phaseNumber: 2,
    phaseName: "Descobrir",
    phaseSubtitle: "Autoconhecimento e diagnóstico profundo",
    phaseColor: PHASE_COLORS[2],
    learnings: [
      "Mapear competências e forças",
      "Identificar gaps de desenvolvimento",
      "Explorar carreiras alinhadas"
    ],
    benefits: [
      "Clareza sobre quem você é",
      "Descobrir carreiras compatíveis",
      "Entender seu diferencial"
    ],
    deliverables: [
      "Radar de Competências",
      "Roda da Vida Profissional",
      "Relatório de Clareza"
    ],
    aiCapabilities: [
      "Diagnósticos automáticos",
      "Recomendações de profissões",
      "Análise de timeline"
    ]
  },
  3: {
    phaseNumber: 3,
    phaseName: "Decidir",
    phaseSubtitle: "Planejamento estratégico e foco",
    phaseColor: PHASE_COLORS[3],
    learnings: [
      "Analisar rotas de transição",
      "Definir metas SMART",
      "Criar plano de 90 dias"
    ],
    benefits: [
      "Sair da paralisia decisória",
      "Ter plano executável",
      "Identificar gaps a preencher"
    ],
    deliverables: [
      "Rota de transição validada",
      "Metas SMART documentadas",
      "Plano de 90 dias"
    ],
    aiCapabilities: [
      "Comparador de rotas",
      "Gerador de metas",
      "Análise de gaps"
    ]
  },
  4: {
    phaseNumber: 4,
    phaseName: "Desenvolver",
    phaseSubtitle: "Prepare-se para ser visto na nova área",
    phaseColor: PHASE_COLORS[4],
    learnings: [
      "Construir materiais de impacto",
      "Otimizar presença no LinkedIn",
      "Desenvolver seu pitch"
    ],
    benefits: [
      "Ser reconhecido na nova área",
      "Aumentar visibilidade",
      "Ganhar confiança profissional"
    ],
    deliverables: [
      "Currículo otimizado",
      "Pitch de 60 segundos",
      "LinkedIn atualizado"
    ],
    aiCapabilities: [
      "Gerador de pitch",
      "Feedback de materiais",
      "Sugestões de keywords"
    ]
  },
  5: {
    phaseNumber: 5,
    phaseName: "Deslanchar",
    phaseSubtitle: "Coloque seu plano em movimento",
    phaseColor: PHASE_COLORS[5],
    learnings: [
      "Executar busca ativa",
      "Praticar entrevistas",
      "Manter rotina de networking"
    ],
    benefits: [
      "Transformar plano em ação",
      "Gerar oportunidades reais",
      "Manter momentum"
    ],
    deliverables: [
      "Painel de oportunidades",
      "Diário de candidaturas",
      "Simulações praticadas"
    ],
    aiCapabilities: [
      "Simulador de entrevistas",
      "Feedback em tempo real",
      "Sugestões de follow-up"
    ]
  },
  6: {
    phaseNumber: 6,
    phaseName: "Desfrutar",
    phaseSubtitle: "Consolidação, celebração e novo ciclo",
    phaseColor: PHASE_COLORS[6],
    learnings: [
      "Avaliar resultados da jornada",
      "Celebrar conquistas",
      "Planejar próximo ciclo"
    ],
    benefits: [
      "Reconhecer sua evolução",
      "Consolidar aprendizados",
      "Preparar próximo nível"
    ],
    deliverables: [
      "Relatório Final",
      "Linha do Tempo de Conquistas",
      "Plano do próximo ciclo"
    ],
    aiCapabilities: [
      "Relatório personalizado",
      "Análise de evolução",
      "Sugestões de próximo nível"
    ]
  }
};

// Helper para obter ícone por fase
export const getPhaseIcon = (phaseNumber: number, className: string = "h-7 w-7 text-white") => {
  const icons = {
    1: Sparkles,
    2: Search,
    3: Target,
    4: Wrench,
    5: Rocket,
    6: Trophy
  };
  const Icon = icons[phaseNumber as keyof typeof icons] || Sparkles;
  return createElement(Icon, { className });
};

// Helper para obter dados completos de uma fase
export const getPhaseIntroData = (
  phaseNumber: number, 
  progressPercentage: number, 
  isComplete: boolean = false
): PhaseIntroData => {
  const baseData = PHASE_INTRO_DATA[phaseNumber];
  return {
    ...baseData,
    phaseIcon: getPhaseIcon(phaseNumber),
    progressPercentage,
    isComplete
  };
};