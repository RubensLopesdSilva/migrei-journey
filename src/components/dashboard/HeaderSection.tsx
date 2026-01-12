import { ArrowRight, Award, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const phaseColors: Record<string, string> = {
  despertar: "hsl(var(--phase-despertar))",
  descobrir: "hsl(var(--phase-descobrir))",
  decidir: "hsl(var(--phase-decidir))",
  desenvolver: "hsl(var(--phase-desenvolver))",
  deslanchar: "hsl(var(--phase-deslanchar))",
  desfrutar: "hsl(var(--phase-desfrutar))",
};

export function HeaderSection() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  
  const currentPhase = "despertar";

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
  const phaseColor = phaseColors[currentPhase];

  return (
    <div className="flex items-start justify-between gap-6">
      {/* Left - Greeting */}
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>BOM DIA</span>
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">
          Olá, {displayName}! 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          O primeiro passo já foi dado!
        </p>
      </div>

      {/* Right - Phase & Achievement Badges */}
      <div className="flex items-center gap-3">
        {/* Current Phase Badge */}
        <div 
          className="flex items-center gap-3 px-4 py-3 rounded-2xl border bg-card"
          style={{ borderColor: `${phaseColor}30` }}
        >
          <div 
            className="h-3 w-3 rounded-full animate-pulse-slow"
            style={{ backgroundColor: phaseColor }}
          />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Fase Atual</p>
            <p className="font-semibold text-foreground capitalize">{currentPhase}</p>
          </div>
          <Link 
            to="/progresso"
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors ml-2"
          >
            Ver jornada
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Achievement Badge */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-primary/20 bg-primary/5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Primeira Semana</p>
            <p className="text-xs text-muted-foreground">próxima conquista</p>
          </div>
        </div>
      </div>
    </div>
  );
}
