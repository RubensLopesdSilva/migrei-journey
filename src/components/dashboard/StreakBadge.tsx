import { motion } from "framer-motion";
import { Flame, Trophy, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStreak } from "@/hooks/useStreak";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StreakBadgeProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function StreakBadge({ size = "md", showLabel = true, className }: StreakBadgeProps) {
  const { streak, loading, getStreakStatus } = useStreak();
  const status = getStreakStatus();

  if (loading || !streak) return null;

  const sizeClasses = {
    sm: "h-6 px-2 text-xs gap-1",
    md: "h-8 px-3 text-sm gap-1.5",
    lg: "h-10 px-4 text-base gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const getFlameColor = () => {
    if (streak.current_streak >= 30) return "text-orange-500";
    if (streak.current_streak >= 7) return "text-amber-500";
    if (streak.current_streak >= 3) return "text-yellow-500";
    return "text-muted-foreground";
  };

  const getBackgroundColor = () => {
    if (status.streakAtRisk) return "bg-red-500/10 border-red-500/30";
    if (streak.current_streak >= 7) return "bg-amber-500/10 border-amber-500/30";
    if (streak.current_streak >= 3) return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-muted/50 border-border";
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className={cn(
            "inline-flex items-center rounded-full border font-medium",
            sizeClasses[size],
            getBackgroundColor(),
            status.streakAtRisk && "animate-pulse",
            className
          )}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={streak.current_streak >= 3 ? {
              rotate: [-5, 5, -5],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Flame className={cn(iconSizes[size], getFlameColor())} />
          </motion.div>
          <span className={cn(
            "font-bold",
            streak.current_streak >= 7 ? "text-amber-600" : "text-foreground"
          )}>
            {streak.current_streak}
          </span>
          {showLabel && (
            <span className="text-muted-foreground">
              {streak.current_streak === 1 ? "dia" : "dias"}
            </span>
          )}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-center">
        <div className="space-y-1">
          <p className="font-medium">
            {status.streakAtRisk 
              ? "⚠️ Streak em risco!" 
              : `🔥 ${streak.current_streak} dias seguidos`
            }
          </p>
          {streak.longest_streak > streak.current_streak && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
              <Trophy className="h-3 w-3" />
              Recorde: {streak.longest_streak} dias
            </p>
          )}
          {status.needsActivity && (
            <p className="text-xs text-amber-600">
              Complete uma atividade hoje!
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// Weekly calendar visualization
interface StreakCalendarProps {
  className?: string;
}

export function StreakCalendar({ className }: StreakCalendarProps) {
  const { streak } = useStreak();
  
  // Generate last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split("T")[0],
      dayName: date.toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3),
      isToday: i === 6,
    };
  });

  const lastActivityDate = streak?.last_activity_date;
  const streakStartDate = streak?.streak_started_at 
    ? new Date(streak.streak_started_at).toISOString().split("T")[0]
    : null;

  const isDateActive = (date: string) => {
    if (!lastActivityDate || !streak?.current_streak) return false;
    
    const checkDate = new Date(date);
    const lastActive = new Date(lastActivityDate);
    const diffDays = Math.floor((lastActive.getTime() - checkDate.getTime()) / 86400000);
    
    return diffDays >= 0 && diffDays < streak.current_streak;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {days.map((day) => {
        const isActive = isDateActive(day.date);
        
        return (
          <Tooltip key={day.date}>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] text-muted-foreground uppercase">
                  {day.dayName}
                </span>
                <motion.div
                  className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : day.isToday 
                        ? "bg-muted border-2 border-dashed border-primary/50" 
                        : "bg-muted/50"
                  )}
                  initial={isActive ? { scale: 0 } : {}}
                  animate={isActive ? { scale: 1 } : {}}
                  transition={{ type: "spring", damping: 10 }}
                >
                  {isActive && <Flame className="h-3 w-3" />}
                </motion.div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isActive ? "Ativo" : day.isToday ? "Hoje" : "Sem atividade"}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
