import { motion } from "framer-motion";
import { 
  Crown, 
  Flame, 
  Zap, 
  Medal, 
  Award, 
  Footprints,
  Sunrise,
  Compass,
  Target,
  Wrench,
  Rocket,
  Trophy,
  Lock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Badge, UserBadge } from "@/types/progress";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BadgesGalleryProps {
  allBadges: Badge[];
  earnedBadges: UserBadge[];
}

const iconMap: Record<string, React.ElementType> = {
  Crown,
  Flame,
  Fire: Flame,
  Zap,
  Medal,
  Award,
  Footprints,
  Sunrise,
  Compass,
  Target,
  Wrench,
  Rocket,
  Trophy,
};

const rarityColors: Record<string, { bg: string; border: string; text: string }> = {
  common: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-600' },
  uncommon: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' },
  rare: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
  epic: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' },
  legendary: { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-700' },
};

const rarityLabels: Record<string, string> = {
  common: 'Comum',
  uncommon: 'Incomum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
};

export function BadgesGallery({ allBadges, earnedBadges }: BadgesGalleryProps) {
  const earnedBadgeIds = new Set(earnedBadges.map(ub => ub.badge_id));

  // Group badges by category
  const groupedBadges = allBadges.reduce((acc, badge) => {
    const category = badge.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(badge);
    return acc;
  }, {} as Record<string, Badge[]>);

const categoryLabels: Record<string, string> = {
    phase: 'Por fase',
    master: 'Máxima',
    streak: 'Sequência',
    milestone: 'Marcos',
    general: 'Geral',
  };

  const categoryOrder = ['master', 'phase', 'streak', 'milestone', 'general'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-bold text-base">Conquistas</h3>
            </div>
            <BadgeUI variant="secondary" className="tabular-nums">
              {earnedBadges.length} / {allBadges.length}
            </BadgeUI>
          </div>

          {/* Categories */}
          <div className="space-y-5">
            {categoryOrder.map(category => {
              const badges = groupedBadges[category];
              if (!badges || badges.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    {categoryLabels[category] || category}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {badges.map(badge => {
                      const isEarned = earnedBadgeIds.has(badge.id);
                      const earnedData = earnedBadges.find(ub => ub.badge_id === badge.id);
                      const Icon = iconMap[badge.icon_name] || Award;
                      const colors = rarityColors[badge.rarity];

                      return (
                        <div
                          key={badge.id}
                          className={cn(
                            "relative p-3 rounded-lg border-2 transition-all duration-300",
                            isEarned 
                              ? `${colors.bg} ${colors.border}` 
                              : "bg-muted/30 border-dashed border-muted-foreground/20",
                            !isEarned && "grayscale opacity-50"
                          )}
                        >
                          {/* Locked overlay */}
                          {!isEarned && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}

                          <div className="flex flex-col items-center text-center gap-1.5">
                            <div 
                              className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center",
                                isEarned ? colors.bg : "bg-muted"
                              )}
                            >
                              <Icon 
                                className={cn(
                                  "h-5 w-5",
                                  isEarned ? colors.text : "text-muted-foreground"
                                )} 
                              />
                            </div>
                            <div>
                              <p className={cn(
                                "font-medium text-xs",
                                isEarned ? colors.text : "text-muted-foreground"
                              )}>
                                {badge.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <BadgeUI 
                                variant="outline" 
                                className={cn(
                                  "text-[9px] px-1 py-0",
                                  isEarned && colors.text
                                )}
                              >
                                {rarityLabels[badge.rarity]}
                              </BadgeUI>
                              <span className="text-[9px] text-primary font-medium">
                                +{badge.xp_reward}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
