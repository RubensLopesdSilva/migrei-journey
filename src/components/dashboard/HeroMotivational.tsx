import { Flame, Star, Sparkles } from "lucide-react";
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
  const [currentPhase] = useState("despertar"); // TODO: Get from user progress
  const [streakDays] = useState(7); // TODO: Get from user progress
  const [nextAchievement] = useState("Primeira Semana"); // TODO: Get dynamically

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
    <div className="animate-fade-in">
      {/* Main greeting */}
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Bom dia
            </span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Olá, <span className="text-gradient-primary">{displayName}</span>! 👋
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            {currentMotivation.greeting}
          </p>
        </div>

        {/* Streak & Achievement */}
        <div className="flex items-center gap-4">
          {/* Streak Badge */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-accent/20 border border-accent/30 shadow-sm">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-accent/30">
              <Flame className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{streakDays}</p>
              <p className="text-xs font-medium text-foreground/70">dias seguidos</p>
            </div>
          </div>

          {/* Next Achievement */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-primary/20 border border-primary/30 shadow-sm">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/30">
              <Star className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{nextAchievement}</p>
              <p className="text-xs font-medium text-foreground/70">próxima conquista</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
