import { Flame, Star, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PhaseMotivation {
  phase: string;
  greeting: string;
  motivation: string;
  color: string;
}

const phaseMotivations: PhaseMotivation[] = [
  {
    phase: "despertar",
    greeting: "O primeiro passo já foi dado!",
    motivation: "Você está despertando para novas possibilidades. Continue explorando.",
    color: "hsl(var(--phase-despertar))"
  },
  {
    phase: "descobrir",
    greeting: "Hora de se conhecer melhor!",
    motivation: "Cada descoberta te aproxima do seu propósito. Continue a jornada.",
    color: "hsl(var(--phase-descobrir))"
  },
  {
    phase: "decidir",
    greeting: "Clareza nas escolhas!",
    motivation: "Suas decisões de hoje moldam o profissional de amanhã.",
    color: "hsl(var(--phase-decidir))"
  },
  {
    phase: "desenvolver",
    greeting: "Construindo seu futuro!",
    motivation: "Cada habilidade aprendida é um tijolo na sua nova carreira.",
    color: "hsl(var(--phase-desenvolver))"
  },
  {
    phase: "deslanchar",
    greeting: "É hora de brilhar!",
    motivation: "Coloque em prática tudo o que aprendeu. O mundo precisa de você.",
    color: "hsl(var(--phase-deslanchar))"
  },
  {
    phase: "desfrutar",
    greeting: "Você conseguiu!",
    motivation: "Celebre suas conquistas e inspire outros na mesma jornada.",
    color: "hsl(var(--phase-desfrutar))"
  },
];

export function HeroMotivational() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [currentPhase] = useState("despertar");
  const [streakDays] = useState(7);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) setProfile(data);
  };

  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Migrante";
  const currentMotivation = phaseMotivations.find(p => p.phase === currentPhase) || phaseMotivations[0];

  return (
    <div className="animate-fade-in flex items-center justify-between">
      {/* Left - Greeting */}
      <div className="space-y-1">
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Olá, <span className="text-gradient-primary">{displayName}</span>! 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          {currentMotivation.greeting}
        </p>
      </div>

      {/* Right - Streak & Phase */}
      <div className="flex items-center gap-4">
        {/* Streak Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
          <Flame className="h-5 w-5 text-accent" />
          <div>
            <p className="text-lg font-bold text-foreground leading-none">{streakDays}</p>
            <p className="text-[10px] text-muted-foreground">dias</p>
          </div>
        </div>

        {/* Current Phase */}
        <div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl border"
          style={{ 
            background: `linear-gradient(135deg, ${currentMotivation.color}10, transparent)`,
            borderColor: `${currentMotivation.color}30`
          }}
        >
          <div 
            className="h-3 w-3 rounded-full animate-pulse-slow"
            style={{ backgroundColor: currentMotivation.color }}
          />
          <div>
            <p className="text-xs text-muted-foreground leading-none">Fase</p>
            <p 
              className="text-sm font-semibold capitalize leading-tight"
              style={{ color: currentMotivation.color }}
            >
              {currentPhase}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
