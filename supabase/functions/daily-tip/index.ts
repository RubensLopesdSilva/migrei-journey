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
          
          const softSkillPrompt = `Você é um coach especialista em transição de carreira com 20 anos de experiência.

CONTEXTO DO USUÁRIO:
- Fase atual: ${phaseInfo}
- Momento: Profissional em transição buscando recolocação ou mudança de área

OBJETIVO:
Gerar UMA micro-ação de SOFT SKILL que o usuário pode executar HOJE para desenvolver habilidades comportamentais essenciais.

EXEMPLOS DE SOFT SKILLS RELEVANTES:
- Comunicação assertiva e escuta ativa
- Networking estratégico e construção de relacionamentos
- Inteligência emocional e autogestão
- Adaptabilidade e resiliência
- Liderança e influência sem autoridade
- Negociação e resolução de conflitos
- Pensamento crítico e tomada de decisão

REGRAS OBRIGATÓRIAS:
1. MÁXIMO 40 caracteres (isso é crítico!)
2. Começar com verbo no imperativo (Pratique, Peça, Identifique, etc.)
3. Ser específico e executável em poucos minutos
4. Ter impacto direto na empregabilidade
5. Sem emojis, sem pontuação final
6. Português brasileiro natural

EXEMPLOS BOM vs RUIM:
✓ "Peça feedback a um ex-colega hoje"
✓ "Pratique seu pitch em 30 segundos"
✓ "Identifique 3 pontos fortes únicos"
✗ "Melhore sua comunicação" (vago demais)
✗ "Seja mais empático" (não é ação específica)

Responda APENAS com a dica, nada mais.`;

          const hardSkillPrompt = `Você é um coach especialista em transição de carreira com 20 anos de experiência.

CONTEXTO DO USUÁRIO:
- Fase atual: ${phaseInfo}
- Momento: Profissional em transição buscando recolocação ou mudança de área

OBJETIVO:
Gerar UMA micro-ação de HARD SKILL que o usuário pode executar HOJE para desenvolver competências técnicas valorizadas no mercado.

EXEMPLOS DE HARD SKILLS RELEVANTES:
- Excel/Planilhas avançadas e análise de dados
- Ferramentas de IA (ChatGPT, Copilot, automação)
- LinkedIn e marca pessoal digital
- Gestão de projetos (metodologias ágeis, Kanban)
- Idiomas (especialmente inglês profissional)
- Ferramentas de apresentação e storytelling
- Certificações e cursos reconhecidos

REGRAS OBRIGATÓRIAS:
1. MÁXIMO 40 caracteres (isso é crítico!)
2. Começar com verbo no imperativo (Aprenda, Complete, Teste, etc.)
3. Ser específico e executável em poucos minutos
4. Mencionar ferramenta ou técnica específica quando possível
5. Sem emojis, sem pontuação final
6. Português brasileiro natural

EXEMPLOS BOM vs RUIM:
✓ "Aprenda PROCV no Excel em 10min"
✓ "Teste o ChatGPT para currículo"
✓ "Otimize 3 palavras-chave no LinkedIn"
✗ "Estude mais tecnologia" (vago demais)
✗ "Faça um curso" (não é ação específica)

Responda APENAS com a dica, nada mais.`;

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
