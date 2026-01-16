import { useState } from "react";
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
  Lock,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge, UserBadge } from "@/types/progress";
import { cn } from "@/lib/utils";

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

export function BadgesGallery({ allBadges, earnedBadges }: BadgesGalleryProps) {
  const [openCategory, setOpenCategory] = useState<string | null>('master');
  
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

  const categoryIcons: Record<string, React.ElementType> = {
    phase: Compass,
    master: Crown,
    streak: Flame,
    milestone: Target,
    general: Award,
  };

  const categoryOrder = ['master', 'phase', 'streak', 'milestone', 'general'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>
              <CardTitle className="text-base">Conquistas</CardTitle>
            </div>
            <BadgeUI variant="secondary" className="tabular-nums gap-1">
              <Zap className="h-3 w-3" />
              {earnedBadges.length}/{allBadges.length}
            </BadgeUI>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {categoryOrder.map((category, catIndex) => {
            const badges = groupedBadges[category];
            if (!badges || badges.length === 0) return null;
            
            const CategoryIcon = categoryIcons[category] || Award;
            const earnedInCategory = badges.filter(b => earnedBadgeIds.has(b.id)).length;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <Collapsible
                  open={openCategory === category}
                  onOpenChange={(isOpen) => setOpenCategory(isOpen ? category : null)}
                >
                  <Card className={cn(
                    "transition-all duration-200",
                    openCategory === category 
                      ? "ring-2 ring-primary/50 shadow-md" 
                      : "hover:border-primary/30"
                  )}>
                    <CollapsibleTrigger asChild>
                      <button className="w-full text-left">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <CategoryIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm">{categoryLabels[category]}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {earnedInCategory}/{badges.length} desbloqueadas
                                </p>
                              </div>
                            </div>
                            <ChevronDown className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform duration-200",
                              openCategory === category && "rotate-180"
                            )} />
                          </div>
                        </CardContent>
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-3 pb-3 border-t pt-3">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {badges.map(badge => {
                            const isEarned = earnedBadgeIds.has(badge.id);
                            const Icon = iconMap[badge.icon_name] || Award;
                            const colors = rarityColors[badge.rarity];

                            return (
                              <div
                                key={badge.id}
                                className={cn(
                                  "relative p-2.5 rounded-lg border transition-all duration-300 text-center",
                                  isEarned 
                                    ? `${colors.bg} ${colors.border}` 
                                    : "bg-muted/30 border-dashed border-muted-foreground/20",
                                  !isEarned && "grayscale opacity-50"
                                )}
                              >
                                {!isEarned && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}

                                <div className="flex flex-col items-center gap-1">
                                  <div 
                                    className={cn(
                                      "h-8 w-8 rounded-full flex items-center justify-center",
                                      isEarned ? colors.bg : "bg-muted"
                                    )}
                                  >
                                    <Icon 
                                      className={cn(
                                        "h-4 w-4",
                                        isEarned ? colors.text : "text-muted-foreground"
                                      )} 
                                    />
                                  </div>
                                  <p className={cn(
                                    "font-medium text-[10px] leading-tight",
                                    isEarned ? colors.text : "text-muted-foreground"
                                  )}>
                                    {badge.name}
                                  </p>
                                  <span className="text-[9px] text-primary font-medium">
                                    +{badge.xp_reward}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
