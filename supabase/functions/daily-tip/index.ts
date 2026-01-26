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
          const phaseInfo = phaseContext[phaseNumber as keyof typeof phaseContext] || phaseContext[1];
          
          const phaseSpecificContext = {
            1: {
              soft: "Foco em autoconhecimento, aceitação da mudança e construção de mentalidade positiva",
              hard: "Foco em pesquisa de mercado, mapeamento de habilidades transferíveis e análise de tendências"
            },
            2: {
              soft: "Foco em identificar valores, propósito e motivadores de carreira",
              hard: "Foco em diagnósticos de perfil, testes vocacionais e inventário de competências"
            },
            3: {
              soft: "Foco em tomada de decisão, gestão de incertezas e compromisso com metas",
              hard: "Foco em planejamento estratégico, definição de metas SMART e análise de viabilidade"
            },
            4: {
              soft: "Foco em construção de marca pessoal, comunicação de valor e storytelling",
              hard: "Foco em currículo, LinkedIn, portfólio e materiais de apresentação profissional"
            },
            5: {
              soft: "Foco em networking ativo, entrevistas, negociação e resiliência",
              hard: "Foco em estratégias de busca, candidaturas, simulação de entrevistas e follow-up"
            },
            6: {
              soft: "Foco em adaptação ao novo papel, construção de relacionamentos e celebração",
              hard: "Foco em onboarding, aprendizado contínuo e consolidação de resultados"
            }
          };

          const currentPhaseContext = phaseSpecificContext[phaseNumber as keyof typeof phaseSpecificContext] || phaseSpecificContext[1];
          
          const softSkillPrompt = `Você é um coach especialista em TRANSIÇÃO DE CARREIRA para profissionais 35+ anos.

CONTEXTO DO USUÁRIO:
- Fase atual: ${phaseInfo}
- Foco da fase: ${currentPhaseContext.soft}
- Perfil: Profissional experiente buscando recolocação ou mudança de área

OBJETIVO:
Gerar UMA micro-ação de SOFT SKILL executável HOJE que ajude diretamente na transição de carreira.

TEMAS PRIORITÁRIOS PARA TRANSIÇÃO:
- Gestão emocional da mudança (medo, ansiedade, síndrome do impostor)
- Networking estratégico (não apenas "fazer contatos")
- Comunicação do seu valor único (pitch, storytelling)
- Resiliência e persistência (lidar com rejeições)
- Adaptabilidade e aprendizado contínuo
- Autoconfiança e autoeficácia profissional

REGRAS:
1. MÁXIMO 45 caracteres
2. Começar com verbo no imperativo
3. Ser MUITO específico e prático
4. Conectar diretamente com transição de carreira
5. Sem emojis, sem pontuação final
6. Português brasileiro

EXEMPLOS EXCELENTES:
✓ "Liste 3 conquistas que te orgulham"
✓ "Envie mensagem a 1 ex-colega hoje"
✓ "Pratique seu pitch em voz alta 2x"
✓ "Identifique 1 medo e escreva sobre ele"
✓ "Agradeça quem te ajudou essa semana"

Responda APENAS com a dica.`;

          const hardSkillPrompt = `Você é um coach especialista em TRANSIÇÃO DE CARREIRA para profissionais 35+ anos.

CONTEXTO DO USUÁRIO:
- Fase atual: ${phaseInfo}
- Foco da fase: ${currentPhaseContext.hard}
- Perfil: Profissional experiente buscando recolocação ou mudança de área

OBJETIVO:
Gerar UMA micro-ação de HARD SKILL executável HOJE que acelere a transição de carreira.

TEMAS PRIORITÁRIOS PARA TRANSIÇÃO:
- LinkedIn: otimização, conteúdo, visibilidade
- Currículo: ATS-friendly, palavras-chave, resultados
- Ferramentas de IA para produtividade (ChatGPT, Copilot)
- Pesquisa de mercado e empresas-alvo
- Preparação para entrevistas (STAR method)
- Upskilling em competências digitais demandadas
- Portfolio e cases de sucesso

REGRAS:
1. MÁXIMO 45 caracteres
2. Começar com verbo no imperativo
3. Ser MUITO específico e prático
4. Mencionar ferramenta ou técnica quando possível
5. Sem emojis, sem pontuação final
6. Português brasileiro

EXEMPLOS EXCELENTES:
✓ "Adicione 3 palavras-chave ao LinkedIn"
✓ "Pesquise 5 vagas na sua área-alvo"
✓ "Atualize 1 conquista com números"
✓ "Use ChatGPT para revisar seu resumo"
✓ "Salve 3 empresas no LinkedIn Jobs"

Responda APENAS com a dica.`;

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
                  content: skillType === 'soft' ? softSkillPrompt : hardSkillPrompt
                },
                {
                  role: "user",
                  content: `Data: ${today}. Gere uma dica única e assertiva.`
                }
              ],
              max_tokens: 60,
              temperature: 0.7,
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
