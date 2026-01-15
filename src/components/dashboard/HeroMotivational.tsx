import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { QuickStatsBar } from "./QuickStatsBar";
import { useProgress } from "@/hooks/useProgress";

interface PhaseMotivation {
  phase: string;
  greeting: string;
  color: string;
}

const phaseMotivations: PhaseMotivation[] = [
  { phase: "despertar", greeting: "Sua transição começa aqui.", color: "hsl(var(--phase-despertar))" },
  { phase: "descobrir", greeting: "Clareza vem antes da decisão.", color: "hsl(var(--phase-descobrir))" },
  { phase: "decidir", greeting: "Escolha com consciência, não pressão.", color: "hsl(var(--phase-decidir))" },
  { phase: "desenvolver", greeting: "Construindo competências reais.", color: "hsl(var(--phase-desenvolver))" },
  { phase: "deslanchar", greeting: "Execute com consistência.", color: "hsl(var(--phase-deslanchar))" },
  { phase: "desfrutar", greeting: "Você avançou com consciência.", color: "hsl(var(--phase-desfrutar))" },
];

const phaseNumberToSlug: Record<number, string> = {
  1: "despertar",
  2: "descobrir",
  3: "decidir",
  4: "desenvolver",
  5: "deslanchar",
  6: "desfrutar",
};

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function HeroMotivational() {
  const { user } = useAuth();
  const { loading, userProgress, getProgressSummary, phases } = useProgress();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [currentPhaseSlug, setCurrentPhaseSlug] = useState("despertar");

  const summary = loading ? null : getProgressSummary();

  const daysInJourney = userProgress?.journey_started_at 
    ? Math.floor((Date.now() - new Date(userProgress.journey_started_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const currentPhase = phases?.find(p => p.id === userProgress?.current_phase_id);

  const fetchUserData = useCallback(async () => {
    if (!user) return;

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
      setCurrentPhaseSlug(phaseSlug);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Migrante";
  const currentMotivation = phaseMotivations.find(p => p.phase === currentPhaseSlug) || phaseMotivations[0];
  const timeGreeting = getTimeGreeting();

  return (
    <motion.div 
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Left: Greeting */}
      <div className="flex items-center gap-3">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          >
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          </motion.div>
        </motion.div>
        <div>
          <motion.h1 
            className="text-xl sm:text-2xl font-heading font-bold text-foreground flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <span className="text-muted-foreground font-normal">{timeGreeting},</span>
            <span className="text-gradient-primary">{displayName}</span>
            <motion.span
              className="inline-block"
              animate={{ rotate: [0, 20, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              👋
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xs sm:text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {currentMotivation.greeting}
          </motion.p>
        </div>
      </div>

      {/* Right: Quick Stats - Compact inline */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25 }}
      >
        <QuickStatsBar 
          points={summary?.totalXp || 0}
          days={daysInJourney}
          weeklyProgress={summary?.overallProgress || 0}
          currentPhase={currentPhase ? { 
            name: currentPhase.name, 
            number: currentPhase.phase_number 
          } : undefined}
        />
      </motion.div>
    </motion.div>
  );
}
