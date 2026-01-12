import { 
  Flame, 
  Star, 
  ArrowRight, 
  Play,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const phaseColors: Record<string, string> = {
  despertar: "hsl(var(--phase-despertar))",
  descobrir: "hsl(var(--phase-descobrir))",
  decidir: "hsl(var(--phase-decidir))",
  desenvolver: "hsl(var(--phase-desenvolver))",
  deslanchar: "hsl(var(--phase-deslanchar))",
  desfrutar: "hsl(var(--phase-desfrutar))",
};

const phaseMessages: Record<string, string> = {
  despertar: "O primeiro passo da sua transformação",
  descobrir: "Descobrindo seu verdadeiro potencial",
  decidir: "Traçando o caminho ideal",
  desenvolver: "Construindo novas competências",
  deslanchar: "Colocando tudo em prática",
  desfrutar: "Celebrando suas conquistas",
};

export function WelcomePanel() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  
  const currentPhase = "despertar";
  const streakDays = 7;
  const totalXP = 1250;
  const phaseProgress = 35;
  const nextActivity = "Complete seu perfil profissional";

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
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">Bem-vindo de volta</p>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Olá, {displayName}! 👋
        </h1>
        <p className="text-muted-foreground">
          {phaseMessages[currentPhase]}
        </p>
      </div>

      {/* Stats Pills */}
      <div className="flex flex-wrap gap-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
          <Flame className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">{streakDays} dias</span>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Star className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">{totalXP.toLocaleString()} XP</span>
        </div>

        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
          style={{ 
            backgroundColor: `${phaseColor}10`,
            borderColor: `${phaseColor}25`
          }}
        >
          <div 
            className="h-2.5 w-2.5 rounded-full animate-pulse-slow"
            style={{ backgroundColor: phaseColor }}
          />
          <span 
            className="text-sm font-semibold capitalize"
            style={{ color: phaseColor }}
          >
            {currentPhase}
          </span>
        </div>
      </div>

      {/* Phase Progress Card */}
      <div 
        className="p-5 rounded-2xl border"
        style={{ 
          background: `linear-gradient(135deg, ${phaseColor}08, transparent)`,
          borderColor: `${phaseColor}20`
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: phaseColor }} />
            <span className="text-sm font-medium text-foreground">Progresso na fase</span>
          </div>
          <span 
            className="text-sm font-bold"
            style={{ color: phaseColor }}
          >
            {phaseProgress}%
          </span>
        </div>
        <Progress 
          value={phaseProgress} 
          className="h-2"
        />
        <p className="text-xs text-muted-foreground mt-3">
          Continue assim! Faltam 65% para a próxima fase.
        </p>
      </div>

      {/* Next Action */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-start gap-4">
          <div 
            className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${phaseColor}15` }}
          >
            <Play className="h-5 w-5 fill-current" style={{ color: phaseColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Próxima atividade • +50 XP
            </p>
            <p className="font-medium text-foreground mb-3">{nextActivity}</p>
            <Link to="/progresso">
              <Button 
                size="sm" 
                className="gap-2"
                style={{ 
                  background: `linear-gradient(135deg, ${phaseColor}, ${phaseColor}cc)`,
                }}
              >
                Começar agora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick link */}
      <Link 
        to="/progresso"
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2"
      >
        Ver toda a jornada
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
