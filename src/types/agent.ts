// AI Agent Tutor Types

export interface AIAgent {
  id: string;
  name: string;
  title: string;
  persona: string;
  description: string;
  avatar_url: string;
  background_color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export type AgentPersona = 'strategic' | 'motivational' | 'analytical' | 'empathetic' | 'creative' | 'practical';

// Mapping of persona to message style
export const PERSONA_STYLES: Record<AgentPersona, {
  greeting: string;
  encouragement: string;
  challenge: string;
}> = {
  strategic: {
    greeting: "Vamos traçar sua estratégia juntos.",
    encouragement: "Você está construindo algo sólido. Continue.",
    challenge: "Hora de tomar uma decisão importante."
  },
  motivational: {
    greeting: "Que bom ter você aqui! Vamos em frente!",
    encouragement: "Você está arrasando! Cada passo conta!",
    challenge: "Isso é uma oportunidade de crescer!"
  },
  analytical: {
    greeting: "Vamos organizar suas ideias.",
    encouragement: "Os dados mostram que você está progredindo bem.",
    challenge: "Vamos analisar isso com calma e encontrar a melhor solução."
  },
  empathetic: {
    greeting: "Como você está se sentindo hoje?",
    encouragement: "Está tudo bem ir no seu ritmo. Você está evoluindo.",
    challenge: "Entendo que isso pode ser difícil. Estou aqui com você."
  },
  creative: {
    greeting: "Pronto para explorar novas possibilidades?",
    encouragement: "Sua jornada é única! Continue criando!",
    challenge: "Que tal pensar nisso de um ângulo diferente?"
  },
  practical: {
    greeting: "Vamos ao que interessa.",
    encouragement: "Bom trabalho. Próximo passo.",
    challenge: "Problema identificado. Aqui está a solução."
  }
};
