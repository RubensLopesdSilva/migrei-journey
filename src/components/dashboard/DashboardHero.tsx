import { Flame, Star, Calendar, Trophy, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PhaseInfo {
  name: string;
  color: string;
  message: string;
}

const phaseData: Record<string, PhaseInfo> = {
  despertar: {
    name: "Despertar",
    color: "hsl(var(--phase-despertar))",
    message: "Você está despertando para novas possibilidades"
  },
  descobrir: {
    name: "Descobrir", 
    color: "hsl(var(--phase-descobrir))",
    message: "Cada descoberta te aproxima do seu propósito"
  },
  decidir: {
    name: "Decidir",
    color: "hsl(var(--phase-decidir))",
    message: "Suas decisões moldam o profissional de amanhã"
  },
  desenvolver: {
    name: "Desenvolver",
    color: "hsl(var(--phase-desenvolver))",
    message: "Construindo habilidades para sua nova carreira"
  },
  deslanchar: {
    name: "Deslanchar",
    color: "hsl(var(--phase-deslanchar))",
    message: "É hora de colocar em prática tudo que aprendeu"
  },
  desfrutar: {
    name: "Desfrutar",
    color: "hsl(var(--phase-desfrutar))",
    message: "Celebre suas conquistas e inspire outros"
  }
};

export function DashboardHero() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  
  // TODO: Get from user progress
  const currentPhase = "despertar";
  const streakDays = 7;
  const totalXP = 1250;
  const daysInJourney = 45;
  const ranking = 12;

  useEffect(() => {
    if (user) fetchProfile();
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
  const phase = phaseData[currentPhase] || phaseData.despertar;

  return (
    <div className="animate-fade-in">
      {/* Top Bar: Greeting + Stats */}
      <div className="flex items-center justify-between">
        {/* Left - Greeting */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sua jornada
            </span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Olá, <span className="text-gradient-primary">{displayName}</span>! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            {phase.message}
          </p>
        </div>

        {/* Right - Stats Row */}
        <div className="flex items-center gap-3">
          {/* Streak */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/20">
            <Flame className="h-5 w-5 text-accent" />
            <div className="text-right">
              <p className="text-lg font-bold text-foreground leading-none">{streakDays}</p>
              <p className="text-[10px] text-muted-foreground">dias seguidos</p>
            </div>
          </div>

          {/* XP */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-phase-despertar/10 border border-phase-despertar/20">
            <Star className="h-5 w-5 text-phase-despertar" />
            <div className="text-right">
              <p className="text-lg font-bold text-foreground leading-none">{totalXP.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">XP total</p>
            </div>
          </div>

          {/* Days */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="text-right">
              <p className="text-lg font-bold text-foreground leading-none">{daysInJourney}</p>
              <p className="text-[10px] text-muted-foreground">dias na jornada</p>
            </div>
          </div>

          {/* Ranking */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-phase-desfrutar/10 border border-phase-desfrutar/20">
            <Trophy className="h-5 w-5 text-phase-desfrutar" />
            <div className="text-right">
              <p className="text-lg font-bold text-foreground leading-none">#{ranking}</p>
              <p className="text-[10px] text-muted-foreground">ranking</p>
            </div>
          </div>

          {/* Current Phase Badge */}
          <div 
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border"
            style={{ 
              backgroundColor: `${phase.color}10`,
              borderColor: `${phase.color}25`
            }}
          >
            <div 
              className="h-3 w-3 rounded-full animate-pulse-slow"
              style={{ backgroundColor: phase.color }}
            />
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground leading-none">Fase atual</p>
              <p 
                className="text-sm font-semibold leading-tight"
                style={{ color: phase.color }}
              >
                {phase.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
