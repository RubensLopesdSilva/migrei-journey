import { Play, Clock, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
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
  title = "Complete seu perfil profissional",
  description = "Adicione suas experiências e habilidades para receber recomendações personalizadas",
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
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}80)` }}
      />
      
      <div className="p-6">
        <div className="flex items-start justify-between gap-6">
          {/* Left content */}
          <div className="flex-1 space-y-4">
            {/* Phase badge & status */}
            <div className="flex items-center gap-3">
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${phaseColor}20`,
                  color: phaseColor
                }}
              >
                {phase}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {estimatedTime} min
              </span>
              <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                +{xpReward} XP
              </span>
            </div>

            {/* Title & description */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Seu progresso</span>
                <span className="font-medium text-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Right - CTA */}
          <div className="flex flex-col items-center gap-3">
            <Button 
              size="lg"
              className="h-16 w-16 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              style={{ 
                background: `linear-gradient(135deg, ${phaseColor}, ${phaseColor}dd)`,
              }}
            >
              <Play className="h-7 w-7 fill-current group-hover:scale-110 transition-transform" />
            </Button>
            <span className="text-xs font-medium text-muted-foreground">Continuar</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              2 de 6 etapas completas
            </span>
          </div>
          
          <button className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Ver todas as atividades
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
