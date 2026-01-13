import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  diagnosticResults: Array<{
    diagnostic_type: string;
    scores: Record<string, number>;
    result_summary: string;
  }>;
  careerWheel: Array<{
    dimension: string;
    current_rating: number;
    desired_rating: number;
  }>;
  diaryInsights: string[];
  timeline: Array<{
    event_title: string;
    event_type: string;
    learnings: string;
  }>;
  competencies: Array<{
    competency_name: string;
    category: string;
    self_rating: number;
    is_top_strength: boolean;
  }>;
  painMap: Array<{
    pain_type: string;
    description: string;
    intensity: number;
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile, action } = await req.json() as { userProfile: UserProfile; action: string };
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "recommend_professions") {
      systemPrompt = `Você é um especialista em orientação profissional e transição de carreira do programa MIGREI. 
Sua missão é analisar profundamente o perfil do usuário e recomendar profissões que sejam altamente compatíveis com suas características.

IMPORTANTE: Suas recomendações devem ser baseadas no mercado de trabalho brasileiro.

Você deve retornar EXATAMENTE um JSON válido com esta estrutura:
{
  "recommendations": [
    {
      "profession_name": "Nome da Profissão",
      "profession_description": "Descrição detalhada da profissão e o que ela envolve",
      "match_score": 85,
      "match_reasons": ["Razão 1", "Razão 2", "Razão 3"],
      "salary_range": "R$ X.XXX - R$ XX.XXX",
      "growth_outlook": "Perspectiva de crescimento no mercado",
      "required_skills": ["Habilidade 1", "Habilidade 2"],
      "user_matching_skills": ["Habilidades que o usuário já tem"],
      "skills_gap": ["Habilidades que o usuário precisa desenvolver"]
    }
  ]
}

Recomende entre 5 e 8 profissões, ordenadas por match_score (maior para menor).
O match_score deve ser entre 0 e 100.`;

      userPrompt = `Analise o seguinte perfil do usuário e recomende profissões compatíveis:

## Resultados dos Diagnósticos
${JSON.stringify(userProfile.diagnosticResults, null, 2)}

## Roda da Carreira (Atual vs Desejado)
${JSON.stringify(userProfile.careerWheel, null, 2)}

## Insights do Diário de Autodescoberta
${userProfile.diaryInsights?.join('\n') || 'Não disponível'}

## Linha do Tempo Profissional
${JSON.stringify(userProfile.timeline, null, 2)}

## Competências Identificadas
${JSON.stringify(userProfile.competencies, null, 2)}

## Mapa de Dores Profissionais
${JSON.stringify(userProfile.painMap, null, 2)}

Com base neste perfil completo, recomende profissões que:
1. Alinhem com as forças e competências do usuário
2. Atendam às dimensões que o usuário quer melhorar na roda da carreira
3. Resolvam as dores profissionais identificadas
4. Aproveitem os aprendizados da trajetória
5. Tenham boa perspectiva no mercado brasileiro

Retorne APENAS o JSON, sem explicações adicionais.`;

    } else if (action === "generate_clarity_report") {
      systemPrompt = `Você é um especialista em orientação profissional do programa MIGREI.
Sua missão é gerar um Relatório de Clareza Profissional que sintetize toda a jornada de autodescoberta do usuário.

Retorne EXATAMENTE um JSON válido com esta estrutura:
{
  "professional_identity": "Uma descrição rica e personalizada de quem é este profissional",
  "core_motivators": ["Motivador 1", "Motivador 2", "Motivador 3"],
  "recommended_routes": [
    {
      "route_name": "Nome da Rota",
      "description": "Por que esta rota faz sentido",
      "next_steps": ["Passo 1", "Passo 2"]
    }
  ],
  "top_competencies": ["Competência 1", "Competência 2", "Competência 3", "Competência 4", "Competência 5"],
  "areas_to_develop": ["Área 1", "Área 2", "Área 3"]
}`;

      userPrompt = `Gere um Relatório de Clareza Profissional para este usuário:

## Resultados dos Diagnósticos
${JSON.stringify(userProfile.diagnosticResults, null, 2)}

## Roda da Carreira
${JSON.stringify(userProfile.careerWheel, null, 2)}

## Insights do Diário
${userProfile.diaryInsights?.join('\n') || 'Não disponível'}

## Linha do Tempo
${JSON.stringify(userProfile.timeline, null, 2)}

## Competências
${JSON.stringify(userProfile.competencies, null, 2)}

## Mapa de Dores
${JSON.stringify(userProfile.painMap, null, 2)}

Retorne APENAS o JSON, sem explicações adicionais.`;

    } else if (action === "suggest_timeline_learning") {
      systemPrompt = `Você é um coach de carreira especializado em extrair aprendizados de experiências profissionais.
Analise o evento da linha do tempo e sugira um aprendizado profundo e prático.
Retorne APENAS uma string com o aprendizado sugerido (máximo 2 frases).`;

      userPrompt = `Evento: ${JSON.stringify(userProfile)}
Qual o principal aprendizado de carreira que pode ser extraído deste evento?`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let result;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleanContent);
    } catch {
      // If it's not JSON (like timeline learning), return as string
      result = { content };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in profession-recommendations:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
