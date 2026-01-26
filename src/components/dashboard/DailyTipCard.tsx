import { useState, useEffect } from "react";
import { Lightbulb, RefreshCw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useProgress } from "@/hooks/useProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { PHASE_COLORS } from "@/data/phaseIntroData";

interface DailyTip {
  tip: string;
  source: 'ai' | 'database' | 'fallback';
  date: string;
}

export function DailyTipCard() {
  const { userProgress } = useProgress();
  const [tip, setTip] = useState<DailyTip | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const phaseNumber = userProgress?.current_phase_number || 1;
  const phaseColor = PHASE_COLORS[phaseNumber as keyof typeof PHASE_COLORS] || PHASE_COLORS[1];

  const fetchTip = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Check localStorage for today's cached tip
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `daily_tip_${today}_${phaseNumber}`;
      
      if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setTip(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      const { data, error } = await supabase.functions.invoke('daily-tip', {
        body: { phaseNumber }
      });

      if (error) throw error;

      const tipData: DailyTip = data;
      setTip(tipData);
      
      // Cache for today
      localStorage.setItem(cacheKey, JSON.stringify(tipData));
      
    } catch (error) {
      console.error("Failed to fetch daily tip:", error);
      // Fallback tip
      setTip({
        tip: "Faça algo pela sua transição hoje",
        source: 'fallback',
        date: new Date().toISOString().split('T')[0]
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTip();
  }, [phaseNumber]);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-4" style={{ boxShadow: 'var(--shadow-md)' }}>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
          <Skeleton className="h-4 flex-1" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-card rounded-2xl border border-border overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div 
            className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${phaseColor}15` }}
          >
            <Lightbulb className="h-5 w-5" style={{ color: phaseColor }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Dica do dia
              </span>
              {tip?.source === 'ai' && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-2.5 w-2.5" />
                  IA
                </span>
              )}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.p
                key={tip?.tip}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm font-medium text-foreground leading-snug"
              >
                {tip?.tip}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => fetchTip(true)}
            disabled={refreshing}
            className={cn(
              "p-1.5 rounded-lg transition-all text-muted-foreground hover:text-foreground hover:bg-muted/50",
              refreshing && "animate-spin"
            )}
            aria-label="Nova dica"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
