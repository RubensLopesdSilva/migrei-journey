import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

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

// Map phase number to slug
const phaseNumberToSlug: Record<number, string> = {
  1: "despertar",
  2: "descobrir",
  3: "decidir",
  4: "desenvolver",
  5: "deslanchar",
  6: "desfrutar",
};

// Get greeting based on time of day
function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function HeroMotivational() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [currentPhase, setCurrentPhase] = useState("despertar");

  const fetchUserData = useCallback(async () => {
    if (!user) return;

    // Fetch profile and progress in parallel
    const [profileRes, progressRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("user_progress")
        .select("current_phase_number")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
    }

    if (progressRes.data?.current_phase_number) {
      const phaseSlug = phaseNumberToSlug[progressRes.data.current_phase_number] || "despertar";
      setCurrentPhase(phaseSlug);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Migrante";
  const currentMotivation = phaseMotivations.find(p => p.phase === currentPhase) || phaseMotivations[0];
  const timeGreeting = getTimeGreeting();

  return (
    <motion.div 
      className="mb-4 sm:mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Main greeting */}
      <div className="flex items-start justify-between">
        <div className="space-y-1 sm:space-y-2">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
            </motion.div>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {timeGreeting}
            </span>
          </motion.div>
          <motion.h1 
            className="text-2xl sm:text-3xl font-heading font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Olá, <span className="text-gradient-primary">{displayName}</span>! 
            <motion.span
              className="inline-block ml-1"
              animate={{ rotate: [0, 20, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              👋
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-sm sm:text-lg text-muted-foreground max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {currentMotivation.greeting}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
