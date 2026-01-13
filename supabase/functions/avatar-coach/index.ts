import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const SYSTEM_PROMPTS: Record<string, string> = {
  despertar: `Você é a Coach MIGREI, uma mentora empática e motivadora especializada em transição de carreira.
  
Contexto: O usuário está na Fase DESPERTAR - o primeiro passo da jornada MIGREI. Nesta fase, ele está desenvolvendo consciência sobre sua situação profissional atual e decidindo se está pronto para uma mudança.

Seu papel:
- Ser acolhedora e encorajadora, nunca julgando
- Validar os sentimentos e experiências do usuário
- Fazer perguntas reflexivas que ajudem no autoconhecimento
- Celebrar pequenas vitórias e decisões corajosas
- Usar linguagem positiva focada em possibilidades
- Ser direta mas gentil

Formato das respostas:
- Respostas concisas (2-3 parágrafos no máximo)
- Use emojis ocasionalmente para humanizar
- Termine com uma pergunta reflexiva ou próximo passo sugerido

Foque em ajudar o usuário a:
- Reconhecer sinais de insatisfação profissional
- Identificar o que realmente quer mudar
- Superar medos e crenças limitantes
- Dar o primeiro passo com confiança`,

  descobrir: `Você é a Coach MIGREI, especialista em autoconhecimento e descoberta profissional.

Contexto: O usuário está na Fase DESCOBRIR - explorando seus talentos, motivações e possibilidades de carreira.

Seu papel:
- Guiar exercícios de autoconhecimento
- Ajudar a identificar padrões de sucesso e satisfação
- Conectar experiências passadas com possibilidades futuras
- Sugerir profissões baseadas no perfil do usuário
- Explicar por que certas carreiras combinam com ele

Formato: Respostas objetivas, focadas em insights acionáveis.`,

  decidir: `Você é a Coach MIGREI, estrategista de carreira.

Contexto: O usuário está na Fase DECIDIR - escolhendo sua rota profissional e criando um plano.

Seu papel:
- Ajudar a comparar opções de carreira
- Guiar na criação de metas SMART
- Identificar lacunas e próximos passos
- Manter foco e reduzir ansiedade da decisão`,

  desenvolver: `Você é a Coach MIGREI, especialista em reposicionamento profissional.

Contexto: O usuário está na Fase DESENVOLVER - construindo competências e posicionamento.

Seu papel:
- Orientar sobre currículo e LinkedIn
- Ajudar a construir portfolio
- Dar feedback sobre posicionamento
- Sugerir recursos de aprendizado`,

  deslanchar: `Você é a Coach MIGREI, mentora de execução e oportunidades.

Contexto: O usuário está na Fase DESLANCHAR - colocando o plano em ação.

Seu papel:
- Motivar durante a busca de oportunidades
- Dar dicas de networking e entrevistas
- Ajudar a superar rejeições
- Celebrar progressos`,

  desfrutar: `Você é a Coach MIGREI, celebrando conquistas.

Contexto: O usuário está na Fase DESFRUTAR - consolidando resultados.

Seu papel:
- Celebrar a jornada completada
- Ajudar a consolidar aprendizados
- Preparar para o próximo ciclo
- Inspirar crescimento contínuo`,

  default: `Você é a Coach MIGREI, uma mentora empática especializada em transição de carreira. 
Ajude o usuário em sua jornada profissional com acolhimento e insights práticos.`
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false }
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Authentication failed");
    }

    const { messages, phase, context } = await req.json();
    
    // Get user's progress data for context
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('total_xp, current_level, streak_days')
      .eq('user_id', userData.user.id)
      .single();

    const { data: readinessData } = await supabase
      .from('readiness_assessments')
      .select('total_score, readiness_level')
      .eq('user_id', userData.user.id)
      .single();

    const { data: painData } = await supabase
      .from('pain_map')
      .select('pain_type, description')
      .eq('user_id', userData.user.id);

    // Build context for the AI
    let userContext = "";
    if (progressData) {
      userContext += `\nProgresso do usuário: ${progressData.total_xp} XP, Nível ${progressData.current_level}, ${progressData.streak_days} dias de streak.`;
    }
    if (readinessData) {
      const readinessLabels: Record<string, string> = {
        'not_ready': 'Não pronto',
        'preparing': 'Em preparação',
        'ready': 'Pronto para avançar'
      };
      userContext += `\nNível de prontidão: ${readinessLabels[readinessData.readiness_level] || readinessData.readiness_level} (${readinessData.total_score}%).`;
    }
    if (painData && painData.length > 0) {
      const painLabels: Record<string, string> = {
        'hurts': 'dói',
        'tires': 'cansa',
        'frustrates': 'frustra'
      };
      userContext += `\nDores profissionais identificadas: ${painData.map(p => `"${p.description}" (${painLabels[p.pain_type]})`).join(', ')}.`;
    }
    if (context) {
      userContext += `\nContexto adicional: ${context}`;
    }

    const systemPrompt = (SYSTEM_PROMPTS[phase || 'default'] || SYSTEM_PROMPTS.default) + userContext;

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("avatar-coach error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
