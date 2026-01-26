import { useState, useEffect } from "react";
import { Heart, Wrench, RefreshCw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useProgress } from "@/hooks/useProgress";
import { Skeleton } from "@/components/ui/skeleton";

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

  const phaseNumber = userProgress?.current_phase_number || 1;

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
      
      if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setTips(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      const { data, error } = await supabase.functions.invoke('daily-tip', {
        body: { phaseNumber }
      });

      if (error) throw error;

      const tipsData: DailyTips = data;
      setTips(tipsData);
      
      // Cache for today
      localStorage.setItem(cacheKey, JSON.stringify(tipsData));
      
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
      </div>
    </motion.div>
  );
}
