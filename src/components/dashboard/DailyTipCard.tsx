import { useState, useEffect } from "react";
import { Heart, Wrench, RefreshCw, Sparkles, Play, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useProgress } from "@/hooks/useProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { PHASE_COLORS } from "@/data/phaseIntroData";

interface TipData {
  tip: string;
  source: 'ai' | 'database' | 'fallback';
}

interface DailyTips {
  softSkill: TipData;
  hardSkill: TipData;
  date: string;
}

export function DailyTipCard() {
  const { userProgress } = useProgress();
  const [tips, setTips] = useState<DailyTips | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const phaseNumber = userProgress?.current_phase_number || 1;
  const hasStartedPhase = phaseNumber > 0;

  const phaseRoutes: Record<number, string> = {
    1: '/fase-1-despertar',
    2: '/fase-2-descobrir',
    3: '/fase-3-decidir',
    4: '/fase-4-desenvolver',
    5: '/fase-5-deslanchar',
    6: '/fase-6-desfrutar'
  };

  const phaseNames: Record<number, string> = {
    1: 'Despertar',
    2: 'Descobrir',
    3: 'Decidir',
    4: 'Desenvolver',
    5: 'Deslanchar',
    6: 'Desfrutar'
  };

  const currentPhaseColor = PHASE_COLORS[phaseNumber] || PHASE_COLORS[1];

  const fetchTips = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Check localStorage for today's cached tips
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `daily_tips_v2_${today}_${phaseNumber}`;
      
      // Clear old format cache keys
      const oldCacheKey = `daily_tip_${today}_${phaseNumber}`;
      localStorage.removeItem(oldCacheKey);
      
      if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsedCache = JSON.parse(cached);
            // Validate cache has new format
            if (parsedCache.softSkill && parsedCache.hardSkill) {
              setTips(parsedCache);
              setLoading(false);
              return;
            }
          } catch {
            // Invalid cache, continue to fetch
          }
        }
      }

      const { data, error } = await supabase.functions.invoke('daily-tip', {
        body: { phaseNumber }
      });

      if (error) throw error;

      // Validate response structure
      if (data && data.softSkill && data.hardSkill) {
        const tipsData: DailyTips = data;
        setTips(tipsData);
        // Cache for today
        localStorage.setItem(cacheKey, JSON.stringify(tipsData));
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error) {
      console.error("Failed to fetch daily tips:", error);
      // Fallback tips
      setTips({
        softSkill: { tip: "Pratique escuta ativa hoje", source: 'fallback' },
        hardSkill: { tip: "Complete um módulo de curso", source: 'fallback' },
        date: new Date().toISOString().split('T')[0]
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, [phaseNumber]);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-4" style={{ boxShadow: 'var(--shadow-md)' }}>
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>
    );
  }

  const isAnyAI = tips?.softSkill.source === 'ai' || tips?.hardSkill.source === 'ai';

  return (
    <motion.div
      className="bg-card rounded-2xl border border-border overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              Dica do Dia
            </span>
            {isAnyAI && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-2.5 w-2.5" />
                IA
              </span>
            )}
          </div>
          
          {/* Refresh button */}
          <button
            onClick={() => fetchTips(true)}
            disabled={refreshing}
            className={cn(
              "p-1.5 rounded-lg transition-all text-muted-foreground hover:text-foreground hover:bg-muted/50",
              refreshing && "animate-spin"
            )}
            aria-label="Novas dicas"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Soft Skill */}
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-br from-rose-500/10 to-pink-500/5 border border-rose-500/20"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <div className="h-5 w-5 rounded-md bg-rose-500/15 flex items-center justify-center">
                <Heart className="h-3 w-3 text-rose-500" />
              </div>
              <span className="text-[10px] font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                Soft Skill
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={tips?.softSkill.tip}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className="text-xs font-medium text-foreground leading-snug line-clamp-2"
              >
                {tips?.softSkill.tip}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Hard Skill */}
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <div className="h-5 w-5 rounded-md bg-blue-500/15 flex items-center justify-center">
                <Wrench className="h-3 w-3 text-blue-500" />
              </div>
              <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Hard Skill
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={tips?.hardSkill.tip}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className="text-xs font-medium text-foreground leading-snug line-clamp-2"
              >
                {tips?.hardSkill.tip}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* CTA Button - Continue Phase */}
        <motion.button
          onClick={() => navigate(phaseRoutes[phaseNumber])}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-xs font-semibold transition-all shadow-md hover:shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${currentPhaseColor} 0%, ${currentPhaseColor}dd 100%)`,
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Play className="h-3.5 w-3.5" fill="currentColor" />
          <span>Continuar Fase {phaseNumber}: {phaseNames[phaseNumber]}</span>
          <ArrowRight className="h-3.5 w-3.5 ml-auto" />
        </motion.button>
      </div>
    </motion.div>
  );
}
