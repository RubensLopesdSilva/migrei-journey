import { Play, Clock, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

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
  description = "Adicione experiências para recomendações",
  estimatedTime = 15,
  xpReward = 50,
  phase = "Despertar",
  phaseColor = "hsl(var(--phase-despertar))",
  progress = 35
}: NextActionCardProps) {
  return (
    <div className="card-elevated h-full flex flex-col overflow-hidden">
      {/* Accent line */}
      <div 
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}60)` }}
      />
      
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div 
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${phaseColor}15` }}
          >
            <Play className="h-4 w-4 fill-current" style={{ color: phaseColor }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Próxima ação</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {estimatedTime}min
              </span>
              <span className="flex items-center gap-1 text-[10px] text-primary font-medium">
                <Sparkles className="h-3 w-3" />
                +{xpReward}XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs font-medium text-foreground mb-1">{title}</p>
        <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">{description}</p>

        {/* Progress */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* CTA */}
        <Link to="/progresso" className="mt-4">
          <Button 
            size="sm"
            className="w-full h-8 text-xs gap-1.5"
            style={{ 
              background: `linear-gradient(135deg, ${phaseColor}, ${phaseColor}cc)`,
            }}
          >
            Continuar
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
