import { Play, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface NextActionCardProps {
  title?: string;
  description?: string;
  estimatedTime?: number;
  xpReward?: number;
  phase?: string;
  phaseColor?: string;
  progress?: number;
}

export function NextActionCard({
  title = "Complete seu perfil",
  description = "Adicione suas experiências para recomendações personalizadas",
  estimatedTime = 15,
  xpReward = 50,
  phase = "Despertar",
  phaseColor = "hsl(var(--phase-despertar))",
  progress = 35
}: NextActionCardProps) {
  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      {/* Gradient accent top */}
      <div 
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}80)` }}
      />
      
      <div className="p-4 space-y-4">
        {/* Phase badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span 
            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ 
              backgroundColor: `${phaseColor}20`,
              color: phaseColor
            }}
          >
            {phase}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {estimatedTime}min
          </span>
          <span className="flex items-center gap-1 text-[10px] text-primary font-medium">
            <Sparkles className="h-3 w-3" />
            +{xpReward}XP
          </span>
        </div>

        {/* Title & description */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* CTA */}
        <Button 
          size="sm"
          className="w-full h-9 text-xs gap-2"
          style={{ 
            background: `linear-gradient(135deg, ${phaseColor}, ${phaseColor}dd)`,
          }}
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Continuar
        </Button>
      </div>
    </div>
  );
}
