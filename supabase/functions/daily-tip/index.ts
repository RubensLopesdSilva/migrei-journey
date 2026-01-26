import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Soft Skills tips - comportamentais e interpessoais
const softSkillsTips = [
  "Pratique escuta ativa em conversas",
  "Peça feedback construtivo hoje",
  "Comunique com clareza e empatia",
  "Colabore com alguém novo hoje",
  "Gerencie seu tempo com prioridades",
  "Adapte-se a uma mudança hoje",
  "Resolva um conflito com diplomacia",
  "Demonstre proatividade no trabalho",
  "Desenvolva sua inteligência emocional",
  "Pratique resiliência ante desafios",
  "Lidere pelo exemplo hoje",
  "Negocie com foco em ganha-ganha",
  "Seja flexível com planos hoje",
  "Melhore sua comunicação escrita",
  "Cultive relacionamentos profissionais",
  "Aceite críticas como crescimento",
  "Delegue uma tarefa com clareza",
  "Inspire confiança com consistência",
  "Pratique a arte de persuadir",
  "Gerencie expectativas com clareza",
];

// Hard Skills tips - técnicas e específicas
const hardSkillsTips = [
  "Aprenda uma função nova do Excel",
  "Complete um módulo de curso online",
  "Pratique idiomas por 15 minutos",
  "Atualize seu portfólio digital",
  "Estude uma ferramenta da nova área",
  "Crie um projeto-piloto pessoal",
  "Obtenha uma certificação gratuita",
  "Analise dados para tomar decisões",
  "Aprenda um atalho de produtividade",
  "Documente um processo que domina",
  "Estude tendências do seu setor",
  "Pratique apresentações com slides",
  "Automatize uma tarefa repetitiva",
  "Aprenda sobre IA na sua área",
  "Melhore sua escrita técnica",
  "Estude métricas do seu mercado",
  "Crie conteúdo sobre sua expertise",
  "Faça um curso de gestão de projetos",
  "Aprenda básico de análise de dados",
  "Desenvolva uma skill digital nova",
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    // Get date-based seed for daily consistency
    const today = new Date().toISOString().split('T')[0];
    const { phaseNumber = 1, tipType = 'both' } = await req.json().catch(() => ({}));
    
    const phaseContext = {
      1: "despertar - tomando consciência da necessidade de mudança",
      2: "descobrir - fazendo autoconhecimento e diagnóstico",
      3: "decidir - definindo rota e planejamento",
      4: "desenvolver - construindo materiais e presença",
      5: "deslanchar - buscando oportunidades ativamente",
      6: "desfrutar - consolidando conquistas"
    };

    let softSkillTip = "";
    let hardSkillTip = "";
    let softSource: 'ai' | 'database' | 'fallback' = 'database';
    let hardSource: 'ai' | 'database' | 'fallback' = 'database';

    // Try AI-generated tips first
    if (LOVABLE_API_KEY) {
      try {
        const generateTip = async (skillType: 'soft' | 'hard') => {
          const skillDescription = skillType === 'soft' 
            ? "SOFT SKILL (comportamental/interpessoal): comunicação, liderança, trabalho em equipe, adaptabilidade, inteligência emocional, resolução de conflitos"
            : "HARD SKILL (técnica/específica): Excel, ferramentas digitais, análise de dados, idiomas, certificações, gestão de projetos";

          const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                {
                  role: "system",
                  content: `Você é um coach de transição de carreira. Gere UMA dica prática de ${skillType === 'soft' ? 'SOFT SKILL' : 'HARD SKILL'}.

TIPO DE HABILIDADE:
${skillDescription}

REGRAS OBRIGATÓRIAS:
- Máximo 40 caracteres
- Em português brasileiro
- Ação específica e prática para hoje
- Tom motivador mas direto
- Sem emojis
- Comece com verbo de ação

Fase do usuário: ${phaseContext[phaseNumber as keyof typeof phaseContext] || phaseContext[1]}

Responda APENAS com a dica, nada mais.`
                },
                {
                  role: "user",
                  content: `Gere uma dica de ${skillType} skill para hoje (${today}). Seja específico e prático.`
                }
              ],
              max_tokens: 50,
              temperature: 0.8,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const tip = data.choices?.[0]?.message?.content?.trim();
            if (tip && tip.length <= 50) {
              return { tip, source: 'ai' as const };
            }
          }
          return null;
        };

        // Generate both tips in parallel
        const [softResult, hardResult] = await Promise.all([
          generateTip('soft'),
          generateTip('hard')
        ]);

        if (softResult) {
          softSkillTip = softResult.tip;
          softSource = 'ai';
        }
        if (hardResult) {
          hardSkillTip = hardResult.tip;
          hardSource = 'ai';
        }

      } catch (aiError) {
        console.error("AI generation failed, using fallback:", aiError);
      }
    }

    // Fallback: Use date + phase as seed for consistent daily tips
    const seed = today.split('-').reduce((acc, n) => acc + parseInt(n), 0) + phaseNumber;
    
    if (!softSkillTip) {
      const softIndex = seed % softSkillsTips.length;
      softSkillTip = softSkillsTips[softIndex];
      softSource = 'database';
    }
    
    if (!hardSkillTip) {
      const hardIndex = (seed + 7) % hardSkillsTips.length; // Different offset for variety
      hardSkillTip = hardSkillsTips[hardIndex];
      hardSource = 'database';
    }

    console.log("Tips generated:", { softSkillTip, hardSkillTip, softSource, hardSource });
    
    return new Response(
      JSON.stringify({ 
        softSkill: {
          tip: softSkillTip,
          source: softSource,
        },
        hardSkill: {
          tip: hardSkillTip,
          source: hardSource,
        },
        date: today 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Daily tip error:", error);
    
    // Ultimate fallback
    return new Response(
      JSON.stringify({ 
        softSkill: {
          tip: "Pratique escuta ativa hoje",
          source: 'fallback',
        },
        hardSkill: {
          tip: "Complete um módulo de curso",
          source: 'fallback',
        },
        date: new Date().toISOString().split('T')[0]
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
