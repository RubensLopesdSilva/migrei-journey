import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Career migration tips database - practical, under 50 chars each
const careerTips = [
  // Networking
  "Conecte com 3 pessoas da nova área por semana",
  "Comente posts de líderes da sua área-alvo",
  "Peça 15 min de café virtual, não emprego",
  "Agradeça quem te ajudou essa semana",
  "Participe de eventos online da nova área",
  
  // LinkedIn & Personal Branding
  "Atualize seu headline no LinkedIn hoje",
  "Publique um aprendizado da sua transição",
  "Peça uma recomendação no LinkedIn",
  "Adicione skills da nova área ao perfil",
  "Siga hashtags relevantes da nova carreira",
  
  // Skills & Learning
  "Dedique 30 min/dia à nova habilidade",
  "Complete 1 módulo de curso por semana",
  "Aplique o que aprendeu em um projeto",
  "Documente suas conquistas de aprendizado",
  "Ensine algo que aprendeu recentemente",
  
  // Mindset
  "Celebre pequenas vitórias diárias",
  "Anote 3 gratidões da sua jornada",
  "Visualize você na nova carreira",
  "Aceite que errar faz parte do processo",
  "Compare-se só com você de ontem",
  
  // Job Search
  "Candidate-se a 5 vagas por semana",
  "Personalize cada candidatura enviada",
  "Pesquise a empresa antes da entrevista",
  "Prepare 3 histórias de sucesso",
  "Faça follow-up após cada entrevista",
  
  // Self-care
  "Cuide do sono durante a transição",
  "Mantenha uma rotina mesmo sem emprego",
  "Converse com quem já fez transição",
  "Tire pausas para evitar burnout",
  "Exercite-se para manter energia alta",
  
  // Strategy
  "Defina sua meta SMART do mês",
  "Revise seu plano de 90 dias",
  "Identifique 1 gap para desenvolver",
  "Mapeie empresas-alvo da nova área",
  "Crie um portfólio mesmo sem emprego",
  
  // Action
  "Faça algo pela transição agora",
  "Envie 1 mensagem de networking hoje",
  "Atualize seu currículo esta semana",
  "Pratique seu pitch de 30 segundos",
  "Pesquise 1 vaga que te interesse"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    // Get date-based seed for daily consistency
    const today = new Date().toISOString().split('T')[0];
    const { phaseNumber = 1, userName = '' } = await req.json().catch(() => ({}));
    
    // Try AI-generated tip first, fallback to database
    if (LOVABLE_API_KEY) {
      try {
        const phaseContext = {
          1: "despertar - tomando consciência da necessidade de mudança",
          2: "descobrir - fazendo autoconhecimento e diagnóstico",
          3: "decidir - definindo rota e planejamento",
          4: "desenvolver - construindo materiais e presença",
          5: "deslanchar - buscando oportunidades ativamente",
          6: "desfrutar - consolidando conquistas"
        };

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
                content: `Você é um coach de transição de carreira. Gere UMA dica prática e acionável para alguém em transição de carreira.

REGRAS OBRIGATÓRIAS:
- Máximo 50 caracteres
- Em português brasileiro
- Ação específica e prática
- Tom motivador mas direto
- Sem emojis
- Comece com verbo de ação

O usuário está na fase: ${phaseContext[phaseNumber as keyof typeof phaseContext] || phaseContext[1]}
Data de hoje: ${today}

Responda APENAS com a dica, nada mais.`
              },
              {
                role: "user",
                content: `Gere uma dica de carreira para hoje (${today}). Seja específico e prático.`
              }
            ],
            max_tokens: 60,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiTip = data.choices?.[0]?.message?.content?.trim();
          
          if (aiTip && aiTip.length <= 55) {
            console.log("AI tip generated:", aiTip);
            return new Response(
              JSON.stringify({ 
                tip: aiTip,
                source: 'ai',
                date: today 
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      } catch (aiError) {
        console.error("AI generation failed, using fallback:", aiError);
      }
    }

    // Fallback: Use date + phase as seed for consistent daily tip
    const seed = today.split('-').reduce((acc, n) => acc + parseInt(n), 0) + phaseNumber;
    const tipIndex = seed % careerTips.length;
    const fallbackTip = careerTips[tipIndex];

    console.log("Using fallback tip:", fallbackTip);
    
    return new Response(
      JSON.stringify({ 
        tip: fallbackTip,
        source: 'database',
        date: today 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Daily tip error:", error);
    
    // Ultimate fallback
    return new Response(
      JSON.stringify({ 
        tip: "Faça algo pela transição hoje",
        source: 'fallback',
        date: new Date().toISOString().split('T')[0]
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
