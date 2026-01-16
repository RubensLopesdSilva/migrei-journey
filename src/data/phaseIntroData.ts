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

// Dados estruturados para cada fase seguindo o script UX/UI
export const PHASE_INTRO_DATA: Record<number, Omit<PhaseIntroData, 'progressPercentage' | 'isComplete' | 'phaseIcon'>> = {
  1: {
    phaseNumber: 1,
    phaseName: "Despertar",
    phaseSubtitle: "Consciência e decisão de mudar",
    phaseColor: PHASE_COLORS[1],
    learnings: [
      "Reconhecer o momento de mudança na sua vida",
      "Avaliar sua prontidão emocional, financeira e profissional",
      "Mapear seus pontos de dor e motivações reais"
    ],
    benefits: [
      "Tomar uma decisão consciente sobre sua transição",
      "Reduzir ansiedade ao entender seu ponto de partida",
      "Criar um compromisso sólido com sua mudança"
    ],
    deliverables: [
      "Mapa de Dor pessoal documentado",
      "Avaliação de Prontidão concluída",
      "Declaração de Compromisso assinada"
    ],
    aiCapabilities: [
      "Análise de padrões emocionais",
      "Reflexões guiadas personalizadas",
      "Resumo de insights automatizado"
    ]
  },
  2: {
    phaseNumber: 2,
    phaseName: "Descobrir",
    phaseSubtitle: "Autoconhecimento e diagnóstico profundo",
    phaseColor: PHASE_COLORS[2],
    learnings: [
      "Mapear suas competências e pontos fortes",
      "Identificar gaps e áreas de desenvolvimento",
      "Explorar possibilidades de carreira alinhadas a você"
    ],
    benefits: [
      "Ter clareza sobre quem você é profissionalmente",
      "Descobrir carreiras compatíveis com seu perfil",
      "Entender seu diferencial competitivo no mercado"
    ],
    deliverables: [
      "Radar de Competências completo",
      "Roda da Vida Profissional atualizada",
      "Relatório de Clareza personalizado"
    ],
    aiCapabilities: [
      "Diagnósticos automatizados",
      "Recomendações de profissões por IA",
      "Análise de timeline profissional"
    ]
  },
  3: {
    phaseNumber: 3,
    phaseName: "Decidir",
    phaseSubtitle: "Planejamento estratégico e foco",
    phaseColor: PHASE_COLORS[3],
    learnings: [
      "Analisar rotas possíveis de transição",
      "Definir metas SMART para sua mudança",
      "Criar um plano de ação de 90 dias"
    ],
    benefits: [
      "Sair da paralisia e tomar uma decisão clara",
      "Ter um plano concreto e executável",
      "Identificar gaps a preencher antes de agir"
    ],
    deliverables: [
      "Rota de transição escolhida e validada",
      "Metas SMART documentadas",
      "Plano de 90 dias estruturado"
    ],
    aiCapabilities: [
      "Comparador de rotas inteligente",
      "Gerador de metas SMART",
      "Análise de gaps automatizada"
    ]
  },
  4: {
    phaseNumber: 4,
    phaseName: "Desenvolver",
    phaseSubtitle: "Prepare-se para ser visto como profissional da nova área",
    phaseColor: PHASE_COLORS[4],
    learnings: [
      "Construir materiais profissionais de impacto",
      "Otimizar sua presença digital no LinkedIn",
      "Desenvolver seu pitch e narrativa de carreira"
    ],
    benefits: [
      "Ser reconhecido como profissional da nova área",
      "Aumentar sua visibilidade no mercado",
      "Ter confiança para se apresentar profissionalmente"
    ],
    deliverables: [
      "Currículo otimizado para transição",
      "Pitch profissional de 60 segundos",
      "Perfil LinkedIn atualizado e otimizado"
    ],
    aiCapabilities: [
      "Gerador de pitch por IA",
      "Feedback automático de materiais",
      "Sugestões de palavras-chave"
    ]
  },
  5: {
    phaseNumber: 5,
    phaseName: "Deslanchar",
    phaseSubtitle: "Coloque seu plano em movimento e gere oportunidades",
    phaseColor: PHASE_COLORS[5],
    learnings: [
      "Executar sua estratégia de busca ativa",
      "Praticar entrevistas e apresentações",
      "Construir rotina consistente de networking"
    ],
    benefits: [
      "Transformar planejamento em ação real",
      "Gerar oportunidades concretas de trabalho",
      "Manter momentum mesmo com rejeições"
    ],
    deliverables: [
      "Painel de oportunidades ativo",
      "Diário de candidaturas atualizado",
      "Simulações de entrevista praticadas"
    ],
    aiCapabilities: [
      "Simulador de entrevistas com IA",
      "Feedback de respostas em tempo real",
      "Sugestões de follow-up inteligentes"
    ]
  },
  6: {
    phaseNumber: 6,
    phaseName: "Desfrutar",
    phaseSubtitle: "Consolidação, celebração e novo ciclo",
    phaseColor: PHASE_COLORS[6],
    learnings: [
      "Avaliar os resultados da sua jornada",
      "Celebrar conquistas de forma significativa",
      "Planejar o próximo ciclo de evolução"
    ],
    benefits: [
      "Reconhecer o quanto você evoluiu",
      "Consolidar aprendizados para o futuro",
      "Preparar-se para desafios de nível superior"
    ],
    deliverables: [
      "Relatório Final de Jornada",
      "Linha do Tempo de Conquistas",
      "Plano para o próximo ciclo profissional"
    ],
    aiCapabilities: [
      "Geração de relatório personalizado",
      "Análise de evolução por IA",
      "Sugestões para próximo nível"
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
