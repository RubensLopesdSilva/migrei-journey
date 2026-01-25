import { Play, Clock, ArrowRight, Sparkles, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/useProgress";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Phase routes mapping
const phaseRoutes: Record<string, string> = {
  despertar: "/fase/despertar",
  descobrir: "/fase/descobrir",
  decidir: "/fase/decidir",
  desenvolver: "/fase/desenvolver",
  deslanchar: "/fase/deslanchar",
  desfrutar: "/fase/desfrutar",
};

const phaseNumberToSlug: Record<number, string> = {
  1: "despertar",
  2: "descobrir",
  3: "decidir",
  4: "desenvolver",
  5: "deslanchar",
  6: "desfrutar",
};

export function NextActionCard() {
  const { 
    userProgress, 
    phases, 
    activities, 
    completedActivities, 
    loading 
  } = useProgress();

  // Get current phase info
  const currentPhase = useMemo(() => {
    if (!phases || phases.length === 0) return null;
    return phases.find(p => p.id === userProgress?.current_phase_id) || phases[0];
  }, [phases, userProgress]);

  const phaseSlug = useMemo(() => {
    return currentPhase?.phase_number 
      ? phaseNumberToSlug[currentPhase.phase_number] 
      : "despertar";
  }, [currentPhase]);

  // Get next uncompleted activity
  const nextActivity = useMemo(() => {
    if (!currentPhase || !activities) return null;
    
    const phaseActivities = activities
      .filter(a => a.phase_id === currentPhase.id)
      .sort((a, b) => a.sort_order - b.sort_order);
    
    return phaseActivities.find(a => !completedActivities.includes(a.id)) || null;
  }, [activities, currentPhase, completedActivities]);

  // Calculate phase progress
  const { completedCount, totalCount, progressPercentage } = useMemo(() => {
    if (!currentPhase || !activities) return { completedCount: 0, totalCount: 0, progressPercentage: 0 };
    
    const phaseActivities = activities.filter(a => a.phase_id === currentPhase.id);
    const completed = phaseActivities.filter(a => completedActivities.includes(a.id)).length;
    const total = phaseActivities.length;
    
    return {
      completedCount: completed,
      totalCount: total,
      progressPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [activities, currentPhase, completedActivities]);

  const phaseLink = phaseRoutes[phaseSlug] || "/fase/despertar";

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-card to-card/80 rounded-2xl border border-border overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!nextActivity) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-primary/10 via-card to-card rounded-2xl border border-primary/20 overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-primary mb-1">
                  🎉 Fase concluída!
                </p>
                <h3 className="text-lg font-semibold text-foreground">
                  Parabéns, você completou {currentPhase?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  +{currentPhase?.xp_to_complete} XP conquistados
                </p>
              </div>
            </div>
            <Link to="/progresso">
              <Button variant="outline" size="sm" className="gap-2">
                Ver conquistas
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="relative bg-gradient-to-br from-card via-card to-card/80 rounded-2xl border border-border overflow-hidden group"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ boxShadow: 'var(--shadow-lg)' }}
    >
      {/* Gradient accent top */}
      <div 
        className="h-1 w-full"
        style={{ 
          background: `linear-gradient(90deg, ${currentPhase?.color || 'hsl(var(--primary))'}, ${currentPhase?.color || 'hsl(var(--primary))'}80)` 
        }}
      />
      
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Icon with pulse */}
          <motion.div 
            className="relative h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${currentPhase?.color}20` }}
            animate={{ 
              boxShadow: [
                `0 0 0 0 ${currentPhase?.color}00`,
                `0 0 0 8px ${currentPhase?.color}15`,
                `0 0 0 0 ${currentPhase?.color}00`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap 
              className="h-6 w-6" 
              style={{ color: currentPhase?.color }}
            />
          </motion.div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Phase badge & meta */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span 
                className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                style={{ 
                  backgroundColor: `${currentPhase?.color}20`,
                  color: currentPhase?.color
                }}
              >
                Próximo passo
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {nextActivity.estimated_minutes || 10} min
              </span>
              <span className="flex items-center gap-1 text-[10px] font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                +{nextActivity.xp_reward} XP
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 line-clamp-1">
              {nextActivity.title}
            </h3>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: totalCount }).map((_, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "h-1.5 w-3 rounded-full transition-all",
                        i < completedCount 
                          ? "bg-primary" 
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {completedCount}/{totalCount}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                em {currentPhase?.name}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <Link to={phaseLink}>
            <Button 
              size="lg"
              className={cn(
                "h-12 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 gap-2 group/btn",
                "btn-primary-gradient"
              )}
            >
              <Play className="h-4 w-4 fill-current group-hover/btn:scale-110 transition-transform" />
              <span className="hidden sm:inline">Continuar</span>
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Subtle glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${currentPhase?.color}08 0%, transparent 50%)`
        }}
      />
    </motion.div>
  );
}
